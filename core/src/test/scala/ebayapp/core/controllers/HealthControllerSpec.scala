package ebayapp.core.controllers

import cats.effect.IO
import ebayapp.core.ControllerSpec
import org.http4s.Header.Raw
import org.http4s.implicits._
import org.http4s._
import org.typelevel.ci.CIString

class HealthControllerSpec extends ControllerSpec {

  "A HealthController" should {

    "return status on the app" in {
      val controller = new HealthController[IO]

      val request  = Request[IO](uri = uri"/health/status", method = Method.GET, headers = Headers(Raw(CIString("foo"), "bar")))
      val response = controller.routes.orNotFound.run(request)

      val responseBody = """{"status":true,"requestMetadata":{"uri":"/health/status","headers":{"foo":"bar"}}}"""
      verifyJsonResponse(response, Status.Ok, Some(responseBody))
    }
  }
}
