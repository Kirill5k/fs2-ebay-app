package ebayapp.kernel.controllers

import cats.effect.{IO, Ref}
import ebayapp.kernel.{Clock, ControllerSpec, MockClock}
import org.http4s.Header.Raw
import org.http4s.implicits.*
import org.http4s.*
import org.typelevel.ci.CIString

import java.time.Instant
import java.time.temporal.ChronoUnit
import scala.concurrent.duration.*

class HealthControllerSpec extends ControllerSpec {

  val ipAddress = "127.0.0.1"
  val timestamp = Instant.parse("2020-01-01T00:00:00Z")

  given clock: Clock[IO] = MockClock[IO](timestamp)

  "A HealthController" should {

    "return status on the app" in {
      val controller = new HealthController[IO](timestamp, ipAddress, Some("v0.0.1"))

      val response = for
        _ <- clock.sleep(1.day + 2.hours + 30.minutes + 10.seconds)
        req = Request[IO](uri = uri"/health/status", method = Method.GET, headers = Headers(Raw(CIString("foo"), "bar")))
        res <- controller.routes.orNotFound.run(req)
      yield res

      val responseBody =
        s"""{
           |"startupTime": "$timestamp",
           |"appVersion": "v0.0.1",
           |"upTime": "1d2h30m10s",
           |"serverIpAddress": "$ipAddress",
           |"requestMetadata": {"uri":"/health/status","headers":{"foo":"bar"},"serverAddress":null}
           |}""".stripMargin
      response mustHaveStatus (Status.Ok, Some(responseBody))
    }
  }
}
