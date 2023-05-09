package ebayapp.kernel.controllers

import cats.effect.{IO, Ref}
import ebayapp.kernel.{ControllerSpec, MockClock}
import org.http4s.Header.Raw
import org.http4s.implicits.*
import org.http4s.*
import org.typelevel.ci.CIString

import java.time.Instant
import java.time.temporal.ChronoUnit

class HealthControllerSpec extends ControllerSpec {

  val startupTime = Instant.parse("2020-01-01T00:00:00Z")
  val now         = Instant.parse("2020-01-02T02:30:10Z")
  val ipAddress   = "127.0.0.1"

  "A HealthController" should {

    "return status on the app" in {
      val controller = new HealthController[IO](startupTime, ipAddress, Some("v0.0.1"), MockClock[IO](now))

      val request  = Request[IO](uri = uri"/health/status", method = Method.GET, headers = Headers(Raw(CIString("foo"), "bar")))
      val response = controller.routes.orNotFound.run(request)

      val responseBody =
        s"""{
           |"startupTime": "$startupTime",
           |"appVersion": "v0.0.1",
           |"upTime": "1d2h30m10s",
           |"serverIpAddress": "$ipAddress",
           |"requestMetadata": {"uri":"/health/status","headers":{"foo":"bar"},"serverAddress":null}
           |}""".stripMargin
      response mustHaveStatus (Status.Ok, Some(responseBody))
    }
  }
}
