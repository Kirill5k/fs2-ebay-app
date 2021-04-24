package ebayapp.core.clients.telegram

import cats.effect.IO
import ebayapp.core.SttpClientSpec
import ebayapp.core.common.config.TelegramConfig
import ebayapp.core.common.errors.AppError
import sttp.client3.{Response, SttpBackend}
import sttp.model.StatusCode
import ebayapp.core.requests._

class TelegramClientSpec extends SttpClientSpec {

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

      val result = telegramClient.flatMap(_.sendMessageToMainChannel(message))

      result.unsafeToFuture().map(_ must be(()))
    }

    "send message to the secondary channel" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "m2", "text" -> message)) =>
            Response.ok("success")
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.sendMessageToSecondaryChannel(message))

      result.unsafeToFuture().map(_ must be(()))
    }

    "send message to the alerts channel" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "alerts", "text" -> message)) =>
            Response.ok("success")
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.sendMessageToAlertsChannel(message))

      result.unsafeToFuture().map(_ must be(()))
    }

    "send message to the channel" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "m1", "text" -> message)) =>
            Response.ok("success")
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make[IO](config, testingBackend)

      val result = telegramClient.flatMap(_.sendMessageToMainChannel(message))

      result.unsafeToFuture().map(_ must be(()))
    }

    "retry on 429" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response("too-many-requests", StatusCode.TooManyRequests),
          Response.ok("ok")
        )

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.sendMessageToSecondaryChannel(message))

      result.unsafeToFuture().map(_ must be(()))
    }

    "return error when not success" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "m1", "text" -> message)) =>
            Response("fail", StatusCode.BadRequest)
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.sendMessageToMainChannel(message))

      result.attempt.unsafeToFuture().map(_ must be(Left(AppError.Http(400, "error sending message to telegram channel m1: 400"))))
    }
  }
}
