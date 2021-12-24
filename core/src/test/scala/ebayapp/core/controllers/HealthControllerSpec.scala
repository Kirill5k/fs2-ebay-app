package ebayapp.core.controllers

import cats.effect.{IO, Ref}
import ebayapp.kernel.ControllerSpec
import org.http4s.Header.Raw
import org.http4s.implicits.*
import org.http4s.*
import org.typelevel.ci.CIString

import java.time.Instant

class HealthControllerSpec extends ControllerSpec {

  val ts = Instant.parse("2021-01-01T00:00:00Z")

  "A HealthController" should {

    "return status on the app" in {
      val controller = Ref.of[IO, Instant](ts).map(t => new HealthController[IO](t))

      val request  = Request[IO](uri = uri"/health/status", method = Method.GET, headers = Headers(Raw(CIString("foo"), "bar")))
      val response = controller.flatMap(_.routes.orNotFound.run(request))

      val responseBody =
        s"""{"startupTime":"$ts","requestMetadata":{"uri":"/health/status","headers":{"foo":"bar"},"serverAddress":null}}"""
      verifyJsonResponse(response, Status.Ok, Some(responseBody))
    }
  }
}
