package ebayapp.monitor.domain

import ebayapp.kernel.types.{EnumType, IdType}
import ebayapp.monitor.common.json.given
import io.circe.generic.semiauto.deriveDecoder
import io.circe.syntax.*
import io.circe.*

import scala.concurrent.duration.FiniteDuration

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
    schedule: Schedule,
    contact: Monitor.Contact
)

object Monitor {
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
      c.downField("kind") match
        case k: HCursor =>
          k.as[String].flatMap {
            case "http" => c.as[Http]
            case kind   => Left(DecodingFailure(s"Unexpected connection kind $kind", List(CursorOp.Field("kind"))))
          }
        case _ =>
          deriveDecoder[Connection].tryDecode(c)
    }

    inline given Encoder[Connection] = Encoder.instance { case http: Http =>
      http.asJsonObject.add("kind", Json.fromString("http")).asJson
    }
  }

  sealed trait Contact
  object Contact {
    case object Logging                   extends Contact
    final case class Email(email: String) extends Contact derives Codec.AsObject

    inline given Decoder[Contact] = Decoder.instance { c =>
      c.downField("kind") match
        case k: HCursor =>
          k.as[String].flatMap {
            case "logging" => Right(Logging)
            case "email"   => c.as[Email]
            case kind      => Left(DecodingFailure(s"Unexpected contact kind $kind", List(CursorOp.Field("kind"))))
          }
        case _ =>
          deriveDecoder[Contact].tryDecode(c)
    }

    inline given Encoder[Contact] = Encoder.instance {
      case email: Email => Json.obj("kind" := "email", "email" := email.email)
      case Logging      => Json.obj("kind" := "logging")
    }
  }
}

final case class CreateMonitor(
    name: Monitor.Name,
    connection: Monitor.Connection,
    schedule: Schedule,
    contact: Monitor.Contact
)
