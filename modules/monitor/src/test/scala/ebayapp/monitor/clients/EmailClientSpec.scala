package ebayapp.monitor.clients

import cats.effect.IO
import courier.Mailer as CourierMailer
import kirill5k.common.test.cats.IOWordSpec
import ebayapp.monitor.Mailer
import org.jvnet.mock_javamail.{Mailbox, MockTransport}

import java.util.Properties
import javax.mail.{Provider, Session}

class EmailClientSpec extends IOWordSpec {

  object MockedSMTPProvider extends Provider(Provider.Type.TRANSPORT, "mocked", classOf[MockTransport].getName, "Mock", null)

  private val mockedSession = Session.getDefaultInstance(new Properties() {
    put("mail.transport.protocol.rfc822", "mocked")
  })
  mockedSession.setProvider(MockedSMTPProvider)

  val mailerF = Mailer[IO]("foo@bar.com", CourierMailer(mockedSession))

  "An EmailClient" should {
    "send email to an external address" in {
      val result = for
        client <- EmailClient.make[IO](mailerF)
        res    <- client.send(EmailMessage("bar@foo.com", "test", "test-email"))
      yield res

      result.asserting { res =>
        val sentMessage = Mailbox.get("bar@foo.com").get(0)
        sentMessage.getSubject mustBe "test"
        res mustBe ()
      }
    }
  }
}
