package ebayapp.monitor.clients

import cats.effect.IO
import cats.syntax.option.*
import kirill5k.common.sttp.test.Sttp4WordSpec
import ebayapp.monitor.domain.{HttpMethod, Monitor, MonitoringEvent, Url}
import org.scalatest.wordspec.AsyncWordSpec
import kirill5k.common.cats.Clock
import sttp.client4.*
import sttp.client4.testing.ResponseStub
import sttp.model.StatusCode

import java.time.Instant
import scala.concurrent.duration.*

class HttpClientSpec extends Sttp4WordSpec {

  val url = Url("http://foo.bar/health")

  val ts          = Instant.parse("2020-01-01T00:00:00Z")
  given Clock[IO] = Clock.mock[IO](ts)

  "A HttpClient" should {
    "return status Up on success" in {
      val backend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("foo.bar/health") && r.hasHeader("foo", "bar") =>
            ResponseStub.adjust("success")
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- HttpClient.make[IO](backend)
        status <- client.status(Monitor.Connection.Http(url, HttpMethod.GET, 10.seconds, Map("foo" -> "bar").some))
      yield status

      result.asserting(_ mustBe MonitoringEvent.StatusCheck(Monitor.Status.Up, 0.seconds, ts, "HTTP 200 Ok"))
    }

    "return status Down in failure" in {
      val backend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isPost && r.uri == uri"${url.toString}" => ResponseStub.adjust("error", StatusCode.BadRequest)
          case _                                              => throw new RuntimeException()
        }

      val result = for
        client <- HttpClient.make[IO](backend)
        status <- client.status(Monitor.Connection.Http(url, HttpMethod.POST, 10.seconds))
      yield status

      result.asserting(_ mustBe MonitoringEvent.StatusCheck(Monitor.Status.Down, 0.seconds, ts, "HTTP 400 Bad Request"))
    }

    "return status Down in error" in {
      val backend = fs2BackendStub.whenAnyRequest
        .thenRespondF(IO.raiseError(new RuntimeException("Internal server error")))

      val result = for
        client <- HttpClient.make[IO](backend)
        status <- client.status(Monitor.Connection.Http(url, HttpMethod.GET, 10.seconds))
      yield status

      result.asserting(_ mustBe MonitoringEvent.StatusCheck(Monitor.Status.Down, 0.seconds, ts, "Internal server error"))
    }

    "return status Down in timeout" in {
      val backend = fs2BackendStub.whenAnyRequest
        .thenRespondF(IO.never >> IO.pure(ResponseStub.adjust("success")))

      val result = for
        client <- HttpClient.make[IO](backend)
        status <- client.status(Monitor.Connection.Http(url, HttpMethod.GET, 2.seconds))
      yield status

      result.asserting(_ mustBe MonitoringEvent.StatusCheck(Monitor.Status.Down, 0.seconds, ts, "Request timed-out after 2 seconds"))
    }
  }
}
