package ebayapp.monitor.domain

import cats.syntax.either.*
import com.cronutils.model.{Cron as JCron, CronType}
import com.cronutils.model.definition.CronDefinitionBuilder
import com.cronutils.model.time.ExecutionTime
import com.cronutils.parser.CronParser
import ebayapp.kernel.types.{EnumType, IdType}
import ebayapp.monitor.common.json.given
import ebayapp.kernel.syntax.time.*
import io.circe.generic.semiauto.deriveDecoder
import io.circe.syntax.*
import io.circe.*

import scala.concurrent.duration.FiniteDuration
import java.time.{Instant, ZoneOffset}
import scala.util.Try

opaque type Url = java.net.URL
object Url {
  def apply(host: String): Url = java.net.URI.create(host).toURL

  given Decoder[Url] = Decoder.decodeString.map(Url.apply)
  given Encoder[Url] = Encoder.encodeString.contramap(_.toString)
}

object HttpMethod extends EnumType[HttpMethod](() => HttpMethod.values, EnumType.printUpperCase(_))
enum HttpMethod:
  case GET, POST, PUT, DELETE, PATCH, HEAD

final case class Monitor(
    id: Monitor.Id,
    name: Monitor.Name,
    connection: Monitor.Connection,
    active: Boolean,
    schedule: Monitor.Schedule,
    contact: Monitor.Contact
)

object Monitor {
  private val discriminatorField = "kind"

  opaque type Id = String
  object Id extends IdType[Id]

  opaque type Name <: String = String
  object Name:
    def apply(name: String): Name            = name
    extension (name: Name) def value: String = name

  object Status extends EnumType[Status](() => Status.values, _.toString)
  enum Status:
    case Up, Down, Paused

  sealed trait Connection
  object Connection {
    final case class Http(
        url: Url,
        method: HttpMethod,
        timeout: FiniteDuration,
        headers: Option[Map[String, String]] = None
    ) extends Connection
        derives Codec.AsObject

    extension (conn: Connection)
      def asString: String =
        conn match
          case Connection.Http(url, method, _, _) => s"$method $url"

    inline given Decoder[Connection] = Decoder.instance { c =>
      c.downField(discriminatorField) match
        case k: HCursor =>
          k.as[String].flatMap {
            case "http" => c.as[Http]
            case kind   => Left(DecodingFailure(s"Unexpected connection kind $kind", List(CursorOp.Field(discriminatorField))))
          }
        case _ =>
          deriveDecoder[Connection].tryDecode(c)
    }

    inline given Encoder[Connection] = Encoder.instance { case http: Http =>
      http.asJsonObject.add(discriminatorField, Json.fromString("http")).asJson
    }
  }

  sealed trait Contact
  object Contact {
    case object Logging                   extends Contact
    final case class Email(email: String) extends Contact derives Codec.AsObject

    inline given Decoder[Contact] = Decoder.instance { c =>
      c.downField(discriminatorField) match
        case k: HCursor =>
          k.as[String].flatMap {
            case "logging" => Right(Logging)
            case "email"   => c.as[Email]
            case kind      => Left(DecodingFailure(s"Unexpected contact kind $kind", List(CursorOp.Field(discriminatorField))))
          }
        case _ =>
          deriveDecoder[Contact].tryDecode(c)
    }

    inline given Encoder[Contact] = Encoder.instance {
      case email: Email => Json.obj(discriminatorField := "email", "email" := email.email)
      case Logging      => Json.obj(discriminatorField := "logging")
    }
  }

  sealed trait Schedule(val kind: String):
    def nextExecutionTime(lastExecutionTime: Instant): Instant

    def durationUntilNextExecutionTime(lastExecutionTime: Instant): FiniteDuration =
      lastExecutionTime.durationBetween(nextExecutionTime(lastExecutionTime))

  object Schedule {
    final case class Periodic(period: FiniteDuration) extends Schedule("periodic"):
      override def nextExecutionTime(lastExecutionTime: Instant): Instant =
        lastExecutionTime.plusSeconds(period.toSeconds)

    final case class Cron(cron: JCron) extends Schedule("cron"):
      override def nextExecutionTime(lastExecutionTime: Instant): Instant =
        ExecutionTime.forCron(cron).nextExecution(lastExecutionTime.atZone(ZoneOffset.UTC)).orElseThrow().toInstant

    object Cron {
      private val definition = CronDefinitionBuilder.instanceDefinitionFor(CronType.UNIX)
      private val parser = new CronParser(definition)

      def apply(expression: String): Either[Throwable, Cron] =
        Try(parser.parse(expression)).map(Cron.apply).toEither

      def unsafe(expression: String): Cron =
        Cron(parser.parse(expression))
    }

    inline given Decoder[Schedule] = Decoder.instance { c =>
      c.downField(discriminatorField).as[String].flatMap {
        case "cron" =>
          c.downField("cron")
            .as[String]
            .flatMap(Cron.apply)
            .leftMap(e => DecodingFailure(e.getMessage, List(CursorOp.Field("cron"))))
        case "periodic" => c.downField("period").as[FiniteDuration].map(Periodic.apply)
        case kind => Left(DecodingFailure(s"Unexpected schedule kind $kind", List(CursorOp.Field(discriminatorField))))
      }
    }

    inline given Encoder[Schedule] = Encoder.instance {
      case cron: Cron => Json.obj(discriminatorField := cron.kind, "cron" := cron.cron.asString())
      case periodic: Periodic => Json.obj(discriminatorField := periodic.kind, "period" -> periodic.period.asJson)
    }
  }
}

final case class CreateMonitor(
    name: Monitor.Name,
    connection: Monitor.Connection,
    schedule: Monitor.Schedule,
    contact: Monitor.Contact
)
