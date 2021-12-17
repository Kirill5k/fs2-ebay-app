package ebayapp.core

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.core.common.Logger
import io.circe.parser._
import org.http4s.{Response, Status}
import org.scalatest.Assertion
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.http4s.circe._
import org.scalatestplus.mockito.MockitoSugar

trait ControllerSpec extends AnyWordSpec with MockitoSugar with Matchers with MockitoMatchers {

  given rt: IORuntime      = IORuntime.global
  given logger: Logger[IO]   = MockLogger.make[IO]

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
