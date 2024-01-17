package ebayapp.monitor.domain

import ebayapp.monitor.domain.Monitor.Contact
import io.circe.parser.decode
import io.circe.syntax.*
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ContactSpec extends AnyWordSpec with Matchers {

  "Contact codec" should {

    "convert old json to Contact object" in {
      decode[Contact]("""{"Email": {"email": "foo@bar.com"}}""") mustBe Right(Contact.Email("foo@bar.com"))
      decode[Contact]("""{"Logging": {}}""") mustBe Right(Contact.Logging)
    }

    "convert new json to Contact object" in {
      decode[Contact]("""{"kind":"email","email":"foo@bar.com"}""") mustBe Right(Contact.Email("foo@bar.com"))
      decode[Contact]("""{"kind":"logging"}""") mustBe Right(Contact.Logging)
    }

    "convert Connection to json" in {
      Contact
        .Email("foo@bar.com")
        .asInstanceOf[Contact]
        .asJson
        .noSpaces mustBe """{"kind":"email","email":"foo@bar.com"}"""
    }
  }
}
