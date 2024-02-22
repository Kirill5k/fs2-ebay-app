package ebayapp.kernel

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import org.scalatest.Assertion
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatestplus.mockito.MockitoSugar

import scala.concurrent.Future

trait IOWordSpec extends AsyncWordSpec with Matchers with MockitoSugar with MockitoMatchers {

  extension [A](io: IO[A])
    def throws(error: Throwable): Future[Assertion] =
      io.attempt.asserting(_ mustBe Left(error))
    def asserting(f: A => Assertion): Future[Assertion] =
      io.map(f).unsafeToFuture()(IORuntime.global)
}
