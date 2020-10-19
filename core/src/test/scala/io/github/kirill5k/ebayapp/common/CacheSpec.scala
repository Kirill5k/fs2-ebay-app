package io.github.kirill5k.ebayapp.common

import cats.effect.IO
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
  }
}
