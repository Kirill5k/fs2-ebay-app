package ebayapp.clients.telegram

import cats.effect.IO
import ebayapp.SttpClientSpec
import ebayapp.common.config.TelegramConfig
import ebayapp.common.errors.ApplicationError
import sttp.client.{NothingT, Response, SttpBackend}
import sttp.model.{Method, StatusCode}

class TelegramClientSpec extends SttpClientSpec {

  val message = "lorem ipsum dolor sit amet"
  val config = TelegramConfig("http://telegram.com", "BOT-KEY", "m1", "m2")

  "TelegramClient" should {

    "send message to the main channel" in {
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r
            if isGoingTo(r, Method.GET, "telegram.com", List("botBOT-KEY", "sendMessage"), Map("chat_id" -> "m1", "text" -> message)) =>
            Response.ok("success")
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.sendMessageToMainChannel(message))

      result.unsafeToFuture().map(_ must be(()))
    }

    "send message to the secondary channel" in {
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r
            if isGoingTo(r, Method.GET, "telegram.com", List("botBOT-KEY", "sendMessage"), Map("chat_id" -> "m2", "text" -> message)) =>
            Response.ok("success")
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.sendMessageToSecondaryChannel(message))

      result.unsafeToFuture().map(_ must be(()))
    }

    "send message to the channel" in {
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r
            if isGoingTo(r, Method.GET, "telegram.com", List("botBOT-KEY", "sendMessage"), Map("chat_id" -> "m1", "text" -> message)) =>
            Response.ok("success")
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make[IO](config, testingBackend)

      val result = telegramClient.flatMap(_.sendMessageToMainChannel(message))

      result.unsafeToFuture().map(_ must be(()))
    }

    "return error when not success" in {
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r
            if isGoingTo(r, Method.GET, "telegram.com", List("botBOT-KEY", "sendMessage"), Map("chat_id" -> "m1", "text" -> message)) =>
            Response("fail", StatusCode.BadRequest)
          case _ => throw new RuntimeException()
        }

      val telegramClient = TelegramClient.make(config, testingBackend)

      val result = telegramClient.flatMap(_.sendMessageToMainChannel(message))

      result.attempt.unsafeToFuture().map(_ must be(Left(ApplicationError.Http(400, "error sending message to telegram channel m1: 400"))))
    }
  }
}
