package ebayapp.monitor.domain

import io.circe
import io.circe.parser.decode
import io.circe.syntax.*
import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.must.Matchers

class HttpMethodSpec extends AnyWordSpec with Matchers {

  "HttpMethod codec" should {

    "convert json to HttpMethod" in {
      val method = """{"method": "GET"}"""
      decode[Map[String, HttpMethod]](method) mustBe Right(Map("method" -> HttpMethod.GET))
    }

    "convert HttpMethod to json" in {
      Map("method" -> HttpMethod.POST).asJson.noSpaces mustBe """{"method":"POST"}"""
    }
  }
}
