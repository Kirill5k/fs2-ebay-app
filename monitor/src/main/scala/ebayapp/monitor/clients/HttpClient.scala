package ebayapp.monitor.clients

import cats.implicits._
import cats.effect.Async
import java.time.Instant
import ebayapp.monitor.domain.{Monitor, MonitorEvent}
import sttp.client3.*
import sttp.model.Method

import scala.concurrent.duration.FiniteDuration

trait HttpClient[F[_]]:
  def status(id: Monitor.Id, connection: Monitor.Connection.Http): F[MonitorEvent]

final private class LiveHttpClient[F[_]](
    val backend: SttpBackend[F, Any]
)(using
    F: Async[F]
) extends HttpClient[F] {

  def status(id: Monitor.Id, connection: Monitor.Connection.Http): F[MonitorEvent] =
    for
      start <- F.realTime
      res <- basicRequest
        .method(Method(connection.method.toString), uri"${connection.url.toString}")
        .readTimeout(connection.timeout)
        .send(backend)
        .map(r => (if (r.code.isSuccess) Monitor.Status.Up else Monitor.Status.Down, r.code.toString))
        .handleError(e => (Monitor.Status.Down, e.getMessage))
      end <- F.realTime
    yield MonitorEvent(id, res._1, end - start, Instant.ofEpochMilli(start.toMillis), res._2)
}

object HttpClient {}
