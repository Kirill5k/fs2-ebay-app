package ebayapp.core.clients.telegram

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.TelegramConfig
import ebayapp.core.domain.Notification
import ebayapp.kernel.errors.AppError
import sttp.client3.{Response, SttpBackend}
import sttp.model.StatusCode
import kirill5k.common.sttp.test.SttpWordSpec

class TelegramClientSpec extends SttpWordSpec {

  val message        = "lorem ipsum dolor sit amet"
  val telegramConfig = TelegramConfig("http://telegram.com", "BOT-KEY", "m1", "m2", "alerts")
  val config         = MockRetailConfigProvider.make[IO](telegramConfig = Some(telegramConfig))

  "TelegramClient" should {

    val sendMessageUrl = "telegram.com/botBOT-KEY/sendMessage"

    "send message to the main channel" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "m1", "text" -> message)) =>
            Response.ok("success")
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.send(Notification.Deal(message)))

      result.asserting(_ mustBe ())
    }

    "send message to the secondary channel" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "m2", "text" -> message)) =>
            Response.ok("success")
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.send(Notification.Stock(message)))

      result.asserting(_ mustBe ())
    }

    "send message to the alerts channel" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "alerts", "text" -> message)) =>
            Response.ok("success")
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.send(Notification.Alert(message)))

      result.asserting(_ mustBe ())
    }

    "retry on 429" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response("too-many-requests", StatusCode.TooManyRequests),
          Response.ok("ok")
        )

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.send(Notification.Deal(message)))

      result.asserting(_ mustBe ())
    }

    "return error when not success" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "m1", "text" -> message)) =>
            Response("fail", StatusCode.BadRequest)
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.send(Notification.Deal(message)))

      result.attempt.asserting(_ mustBe (Left(AppError.Http(400, "error sending message to telegram channel m1: 400"))))
    }
  }
}
