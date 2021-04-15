package ebayapp.core.common

import cats.effect.IO
import ebayapp.core.CatsSpec

import scala.concurrent.duration._

class CacheSpec extends CatsSpec {

  "A RefbasedCache" should {

    "return non-expired elements" in {
      val result = for {
        cache <- Cache.make[IO, String, String](5.seconds, 1.second)
        _     <- cache.put("foo", "bar")
        _     <- IO.sleep(2.seconds)
        res   <- cache.get("foo")
      } yield res

      result.unsafeToFuture().map(_ mustBe Some("bar"))
    }

    "return empty option when element expires" in {
      val result = for {
        cache <- Cache.make[IO, String, String](1.seconds, 1.second)
        _     <- cache.put("foo", "bar")
        _     <- IO.sleep(2.seconds)
        res   <- cache.get("foo")
      } yield res

      result.unsafeToFuture().map(_ mustBe None)
    }

    "return true when item is present in cache" in {
      val result = for {
        cache <- Cache.make[IO, String, String](1.seconds, 1.second)
        _     <- cache.put("foo", "bar")
        res   <- cache.contains("foo")
      } yield res

      result.unsafeToFuture().map(_ mustBe true)
    }

    "return false when item has expired" in {
      val result = for {
        cache <- Cache.make[IO, String, String](1.seconds, 1.second)
        _     <- cache.put("foo", "bar")
        _     <- IO.sleep(2.seconds)
        res   <- cache.contains("foo")
      } yield res

      result.unsafeToFuture().map(_ mustBe false)
    }
  }
}
