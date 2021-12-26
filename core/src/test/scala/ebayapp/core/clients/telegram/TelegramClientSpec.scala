package ebayapp.core.clients.telegram

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.core.MockLogger
import ebayapp.core.clients.Notification
import ebayapp.core.common.Logger
import ebayapp.core.common.config.TelegramConfig
import ebayapp.kernel.errors.AppError
import sttp.client3.{Response, SttpBackend}
import sttp.model.StatusCode
import ebayapp.kernel.SttpClientSpec

class TelegramClientSpec extends SttpClientSpec {

  given logger: Logger[IO] = MockLogger.make[IO]

  val message = "lorem ipsum dolor sit amet"
  val config  = TelegramConfig("http://telegram.com", "BOT-KEY", "m1", "m2", "alerts")

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

      result.unsafeToFuture().map(_ mustBe ())
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

      result.unsafeToFuture().map(_ mustBe ())
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

      result.unsafeToFuture().map(_ mustBe ())
    }

    "retry on 429" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response("too-many-requests", StatusCode.TooManyRequests),
          Response.ok("ok")
        )

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.send(Notification.Deal(message)))

      result.unsafeToFuture().map(_ mustBe ())
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

      result.attempt.unsafeToFuture().map(_ mustBe (Left(AppError.Http(400, "error sending message to telegram channel m1: 400"))))
    }
  }
}
