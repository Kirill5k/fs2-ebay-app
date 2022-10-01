package ebayapp.monitor

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.kernel.MockitoMatchers
import org.scalatest.Assertion
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar

import scala.concurrent.Future

trait IOWordSpec extends AsyncWordSpec with Matchers with MockitoSugar with MockitoMatchers:
  extension[A] (io: IO[A])
    def asserting(f: A => Assertion): Future[Assertion] =
      io.map(f).unsafeToFuture()(IORuntime.global)
