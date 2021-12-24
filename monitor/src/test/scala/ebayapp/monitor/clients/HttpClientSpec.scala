package ebayapp.monitor.clients

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.kernel.SttpClientSpec
import ebayapp.monitor.domain.{HttpMethod, Monitor, Url}
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers
import sttp.client3.Response
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend
import sttp.client3.testing.SttpBackendStub
import sttp.client3.*
import sttp.model.{Method, StatusCode}

import scala.concurrent.duration.*

class HttpClientSpec extends SttpClientSpec {

  val id  = Monitor.Id("ID")
  val url = Url("http://foo.bar")

  "A HttpClient" should {
    "return status Up on success" in {
      val backend = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.uri == uri"${url.toString}" =>
            Response.ok("success")
          case r =>
            throw new RuntimeException()
        }

      val result = for
        client <- HttpClient.make[IO](backend)
        status <- client.status(id, Monitor.Connection.Http(url, HttpMethod.GET, 10.seconds))
      yield status

      result.unsafeToFuture().map { event =>
        event.monitorId mustBe id
        event.status mustBe Monitor.Status.Up
        event.reason mustBe "200 OK"
      }
    }

    "return status Down in failure" in {
      val backend = backendStub
        .whenRequestMatchesPartial {
          case r if r.isPost && r.uri == uri"${url.toString}" =>
            Response("error", StatusCode.BadRequest)
          case _ =>
            throw new RuntimeException()
        }

      val result = for
        client <- HttpClient.make[IO](backend)
        status <- client.status(id, Monitor.Connection.Http(url, HttpMethod.POST, 10.seconds))
      yield status

      result.unsafeToFuture().map { event =>
        event.monitorId mustBe id
        event.status mustBe Monitor.Status.Down
        event.reason mustBe "400 "
      }
    }

    "return status Down in error" in {
      val backend = backendStub
        .whenAnyRequest
        .thenRespondF(IO.raiseError(new RuntimeException("Internal server error")))

      val result = for
        client <- HttpClient.make[IO](backend)
        status <- client.status(id, Monitor.Connection.Http(url, HttpMethod.GET, 10.seconds))
      yield status

      result.unsafeToFuture().map { event =>
        event.monitorId mustBe id
        event.status mustBe Monitor.Status.Down
        event.reason mustBe "Internal server error"
      }
    }

    "return status Down in timeout" in {
      val backend = backendStub
        .whenAnyRequest
        .thenRespondF(IO.sleep(5.seconds) *> IO.pure(Response.ok("success")))

      val result = for
        client <- HttpClient.make[IO](backend)
        status <- client.status(id, Monitor.Connection.Http(url, HttpMethod.GET, 2.seconds))
      yield status

      result.unsafeToFuture().map { event =>
        event.monitorId mustBe id
        event.status mustBe Monitor.Status.Down
        event.reason mustBe "Request timed-out after 2 seconds"
      }
    }
  }
}
