package ebayapp.monitor.clients

import cats.implicits._
import cats.effect.Async
import java.time.Instant
import ebayapp.monitor.domain.{HttpMethod, MonitorEvent, Url, Monitor}
import sttp.client3.*
import sttp.model.Method

import scala.concurrent.duration.FiniteDuration

trait HttpClient[F[_]]:
  def status(id: Monitor.Id, method: HttpMethod, url: Url, timeout: FiniteDuration): F[MonitorEvent]

final private class LiveHttpClient[F[_]](
    val backend: SttpBackend[F, Any]
)(using F: Async[F]) extends HttpClient[F] {

  def status(id: Monitor.Id, method: HttpMethod, url: Url, timeout: FiniteDuration): F[MonitorEvent] =
    F.realTime.flatMap { startTime =>
      basicRequest
        .method(Method(method.toString), uri"${url.toString}")
        .readTimeout(timeout)
        .send(backend)
        .map(r => (if (r.code.isSuccess) Monitor.Status.Up else Monitor.Status.Down, r.code.toString))
        .handleError(e => (Monitor.Status.Down, e.getMessage))
        .flatMap { case (status, reason) =>
          F.realTime.map { endTime =>
            MonitorEvent(
              id,
              status,
              endTime - startTime,
              Instant.ofEpochMilli(startTime.toMillis),
              reason
            )
          }
        }
    }
}

object HttpClient {}
