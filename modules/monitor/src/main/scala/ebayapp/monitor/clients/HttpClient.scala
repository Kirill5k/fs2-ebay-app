package ebayapp.monitor.clients

import cats.Monad
import cats.effect.syntax.temporal.*
import cats.syntax.applicative.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.applicativeError.*
import cats.effect.Async
import kirill5k.common.cats.Clock
import kirill5k.common.syntax.time.*

import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import sttp.client3.*
import sttp.model.Method

trait HttpClient[F[_]]:
  def status(connection: Monitor.Connection.Http): F[MonitoringEvent.StatusCheck]

final private class LiveHttpClient[F[_]: Async](
    private val backend: SttpBackend[F, Any]
)(using
    C: Clock[F]
) extends HttpClient[F] {
  
  extension [T](res: Response[T])
    private def reason: String = s"HTTP ${res.code} ${res.statusText}".trim
  
  def status(connection: Monitor.Connection.Http): F[MonitoringEvent.StatusCheck] =
    for
      start <- C.now
      res <- emptyRequest
        .headers(connection.headers.getOrElse(Map.empty))
        .method(Method(connection.method.toString.toUpperCase), uri"${connection.url.toString}")
        .readTimeout(connection.timeout)
        .send(backend)
        .map(r => (if r.code.isSuccess then Monitor.Status.Up else Monitor.Status.Down) -> r.reason)
        .timeoutTo(connection.timeout, (Monitor.Status.Down -> s"Request timed-out after ${connection.timeout}").pure[F])
        .handleError(e => Monitor.Status.Down -> e.getMessage)
      end <- C.now
    yield MonitoringEvent.StatusCheck(res._1, end.durationBetween(start), start, res._2)
}
object HttpClient:
  def make[F[_]: Async: Clock](backend: SttpBackend[F, Any]): F[HttpClient[F]] =
    Monad[F].pure(LiveHttpClient[F](backend))
