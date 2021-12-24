package ebayapp.kernel

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import io.circe.parser.parse
import org.http4s.circe.*
import org.http4s.{Response, Status}
import org.scalatest.Assertion
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar

trait ControllerSpec extends AnyWordSpec with MockitoSugar with Matchers with MockitoMatchers {

  given rt: IORuntime = IORuntime.global

  def verifyJsonResponse(
      actual: IO[Response[IO]],
      expectedStatus: Status,
      expectedBody: Option[String] = None
  ): Assertion = {
    val actualResp = actual.unsafeRunSync()

    actualResp.status mustBe expectedStatus
    expectedBody match {
      case Some(expected) =>
        val actual = actualResp.asJson.unsafeRunSync()
        actual mustBe parse(expected).getOrElse(throw new RuntimeException)
      case None =>
        actualResp.body.compile.toVector.unsafeRunSync() mustBe empty
    }
  }
}
