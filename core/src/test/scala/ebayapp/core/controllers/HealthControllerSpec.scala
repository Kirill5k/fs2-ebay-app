package ebayapp.core.controllers

import cats.effect.IO
import ebayapp.core.ControllerSpec
import org.http4s.implicits._
import org.http4s._

class HealthControllerSpec extends ControllerSpec {

  "A HealthController" should {

    "return status on the app" in {
      val controller = new HealthController[IO]

      val request  = Request[IO](uri = uri"/health/status", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.Ok, Some("""{"status": true}"""))
    }
  }
}
