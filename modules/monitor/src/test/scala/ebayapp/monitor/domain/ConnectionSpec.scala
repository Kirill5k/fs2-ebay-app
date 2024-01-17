package ebayapp.monitor.domain

import ebayapp.monitor.domain.Monitor.Connection
import io.circe.parser.decode
import io.circe.syntax.*
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.concurrent.duration.*

class ConnectionSpec extends AnyWordSpec with Matchers {

  "Connection.Http codec" should {

    val connection = Connection.Http(Url("http://foo.bar"), HttpMethod.GET, 1.minute)

    "convert old json to Connection object" in {
      val connectionJson =
        """{
       |  "Http": {
       |    "url": "http://foo.bar",
       |    "method": "GET",
       |    "timeout": "1 minute"
       |  }
       |}""".stripMargin
      decode[Connection](connectionJson) mustBe Right(connection)
    }

    "convert new json to Connection object" in {
      val connectionJson =
        """{
          |    "kind": "http",
          |    "url": "http://foo.bar",
          |    "method": "GET",
          |    "timeout": "1 minute"
          |}""".stripMargin
      decode[Connection](connectionJson) mustBe Right(connection)
    }

    "convert Connection to json" in {
      connection
        .asInstanceOf[Connection]
        .asJson
        .noSpaces mustBe """{"url":"http://foo.bar","method":"GET","timeout":"1 minute","headers":null,"kind":"http"}"""
    }
  }
}
