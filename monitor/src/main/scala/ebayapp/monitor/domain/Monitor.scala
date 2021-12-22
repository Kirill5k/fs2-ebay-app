package ebayapp.monitor.domain

import io.circe.{Decoder, Encoder, Codec}
import mongo4cats.bson.ObjectId

import java.util.UUID
import java.time.Instant
import scala.concurrent.duration.FiniteDuration

type Url = java.net.URL
object Url:
  def apply(host: String): Url = new java.net.URL(host)
  inline given decode: Decoder[Url] = Decoder[String].map(Url.apply)
  inline given encode: Encoder[Url] = Encoder[String].contramap(_.toString)

enum HttpMethod:
  case GET, POST, PUT, DELETE, PATCH, HEAD

object HttpMethod:
  inline given decode: Decoder[HttpMethod] = Decoder[String].map(HttpMethod.valueOf)
  inline given encode: Encoder[HttpMethod] = Encoder[String].contramap(_.toString)


final case class Monitor(
    id: Monitor.Id,
    name: Monitor.Name,
    connection: Monitor.Connection,
    active: Boolean,
    interval: FiniteDuration,
    notification: Monitor.Notification
)

object Monitor {
  opaque type Id = String
  object Id:
    def apply(id: String): Id = id
    def apply(id: ObjectId): Id = id.toHexString
    extension (id: Id)
      def toObjectId: ObjectId = ObjectId(id)
      def value: String = id

  opaque type Name = String
  object Name:
    def apply(name: String): Name = name
    extension (name: Name)
      def value: String = name

  enum Notification:
    case Email(email: String)
    case Telegram(channelId: String)

  enum Connection:
    case Http(url: Url, method: HttpMethod, timeout: FiniteDuration)

  enum Status:
    case Up, Down
}

final case class MonitorEvent(
    monitorId: Monitor.Id,
    status: Monitor.Status,
    responseTime: FiniteDuration,
    time: Instant,
    reason: String
)
