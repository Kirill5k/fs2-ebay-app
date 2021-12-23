package ebayapp.monitor.clients

import cats.Monad
import cats.effect.syntax.temporal.genTemporalOps_
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.applicativeError.*
import cats.effect.Async
import java.time.Instant
import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import sttp.client3.*
import sttp.model.Method

import scala.concurrent.duration.FiniteDuration

trait HttpClient[F[_]]:
  def status(id: Monitor.Id, connection: Monitor.Connection.Http): F[MonitoringEvent]

final private class LiveHttpClient[F[_]](
    val backend: SttpBackend[F, Any]
)(using
    F: Async[F]
) extends HttpClient[F]:
  def status(id: Monitor.Id, connection: Monitor.Connection.Http): F[MonitoringEvent] =
    for
      start <- F.realTime
      res <- basicRequest
        .method(Method(connection.method.toString), uri"${connection.url.toString}")
        .readTimeout(connection.timeout)
        .send(backend)
        .map(r => (if r.code.isSuccess then Monitor.Status.Up else Monitor.Status.Down, s"${r.code} ${r.statusText}"))
        .timeoutTo(connection.timeout, F.pure((Monitor.Status.Down, s"Request timed-out after ${connection.timeout}")))
        .handleError(e => (Monitor.Status.Down, e.getMessage))
      end <- F.realTime
    yield MonitoringEvent(id, res._1, end - start, Instant.ofEpochMilli(start.toMillis), res._2)

object HttpClient:
  def make[F[_]: Async](backend: SttpBackend[F, Any]): F[HttpClient[F]] =
    Monad[F].pure(LiveHttpClient[F](backend))
