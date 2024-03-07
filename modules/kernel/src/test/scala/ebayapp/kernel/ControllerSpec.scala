package ebayapp.kernel

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import io.circe.parser.parse
import kirill5k.common.cats.test.IOMockitoMatchers
import org.http4s.{Response, Status}
import org.scalatest.Assertion
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar

trait ControllerSpec extends AnyWordSpec with MockitoSugar with Matchers with IOMockitoMatchers {

  def verifyJsonResponse(
      response: IO[Response[IO]],
      expectedStatus: Status,
      expectedBody: Option[String] = None
  ): Assertion =
    response
      .flatMap { res =>
        expectedBody match {
          case Some(expectedJson) =>
            res.as[String].map { receivedJson =>
              res.status mustBe expectedStatus
              parse(receivedJson) mustBe parse(expectedJson)
            }
          case None =>
            res.body.compile.toVector.map { receivedJson =>
              res.status mustBe expectedStatus
              receivedJson mustBe empty
            }
        }
      }
      .unsafeRunSync()(IORuntime.global)

  extension (res: IO[Response[IO]])
    infix def mustHaveStatus(expectedStatus: Status, expectedBody: Option[String] = None): Assertion =
      verifyJsonResponse(res, expectedStatus, expectedBody)
}
