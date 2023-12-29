package ebayapp.monitor.domain

import io.circe.{Codec, Decoder, Encoder}
import mongo4cats.bson.ObjectId
import ebayapp.monitor.common.json.given

import scala.concurrent.duration.FiniteDuration

opaque type Url = java.net.URL
object Url:
  def apply(host: String): Url = java.net.URI.create(host).toURL

enum HttpMethod:
  case GET, POST, PUT, DELETE, PATCH, HEAD

final case class Monitor(
    id: Monitor.Id,
    name: Monitor.Name,
    connection: Monitor.Connection,
    active: Boolean,
    interval: FiniteDuration,
    contact: Monitor.Contact
)

object Monitor {
  opaque type Id = String
  object Id:
    def apply(id: String): Id   = id
    def apply(id: ObjectId): Id = id.toHexString
    extension (id: Id)
      def toObjectId: ObjectId = ObjectId(id)
      def value: String        = id

  opaque type Name <: String = String
  object Name:
    def apply(name: String): Name            = name
    extension (name: Name) def value: String = name

  enum Status:
    case Up, Down, Paused

  enum Contact:
    case Logging
    case Email(email: String)
    case Telegram(channelId: String)

  sealed trait Connection
  object Connection:
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
}

final case class CreateMonitor(
    name: Monitor.Name,
    connection: Monitor.Connection,
    interval: FiniteDuration,
    contact: Monitor.Contact
)