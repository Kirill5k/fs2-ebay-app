package ebayapp.monitor.clients

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import courier.Mailer
import ebayapp.monitor.MailerF
import ebayapp.monitor.common.config.EmailConfig
import org.jvnet.mock_javamail.{Mailbox, MockTransport}
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers

import java.util.Properties
import javax.mail.{Provider, Session}
import scala.concurrent.ExecutionContext.Implicits.global

class EmailClientSpec extends AsyncWordSpec with Matchers {

  object MockedSMTPProvider extends Provider(Provider.Type.TRANSPORT, "mocked", classOf[MockTransport].getName, "Mock", null)

  private val mockedSession = Session.getDefaultInstance(new Properties() {{
    put("mail.transport.protocol.rfc822", "mocked")
  }})
  mockedSession.setProvider(MockedSMTPProvider)

  val mailerF = MailerF[IO]("foo@bar.com", Mailer(mockedSession))

  "An EmailClient" should {
    "send email to an external address" in {
      val result = for
        client <- EmailClient.make[IO](mailerF)
        res    <- client.send(EmailMessage("bar@foo.com", "test", "test-email"))
      yield res

      result.unsafeToFuture().map { res =>
        val sentMessage = Mailbox.get("bar@foo.com").get(0)
        sentMessage.getSubject mustBe "test"
        res mustBe ()
      }
    }
  }
}
