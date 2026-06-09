package ebayapp.core.clients.telegram

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.TelegramConfig
import ebayapp.core.domain.{Notification, ResellableItemBuilder}
import ebayapp.kernel.errors.AppError
import kirill5k.common.cats.Clock
import sttp.model.StatusCode
import kirill5k.common.sttp.test.Sttp4WordSpec
import sttp.client4.testing.ResponseStub

import java.time.Instant

class TelegramClientSpec extends Sttp4WordSpec {

  val title          = "Test Title"
  val message        = "lorem ipsum dolor sit amet"
  val telegramConfig = TelegramConfig("http://telegram.com", "BOT-KEY", "m1", "m2", "alerts")
  val config         = MockRetailConfigProvider.make[IO](telegramConfig = Some(telegramConfig))
  val item           = ResellableItemBuilder.makeGeneric("test")

  given clock: Clock[IO] = Clock.mock(Instant.now())

  "TelegramClient" should {

    val sendMessageUrl      = "telegram.com/botBOT-KEY/sendMessage"
    val expectedText        = s"$title\n$message"
    val expectedTextWithUrl = s"$title\n$message\n${item.listingDetails.url}"

    "send message to the main channel" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "m1", "text" -> expectedTextWithUrl)) =>
            ResponseStub.adjust("success")
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- TelegramClient.make(config, testingBackend)
        res    <- client.send(Notification.deal(title, message, item))
      yield res

      result.assertVoid
    }

    "send message to the secondary channel" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "m2", "text" -> expectedTextWithUrl)) =>
            ResponseStub.adjust("success")
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- TelegramClient.make(config, testingBackend)
        res    <- client.send(Notification.stock(title, message, item))
      yield res

      result.assertVoid
    }

    "send message to the alerts channel" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "alerts", "text" -> expectedText)) =>
            ResponseStub.adjust("success")
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- TelegramClient.make(config, testingBackend)
        res    <- client.send(Notification.alert(title, message))
      yield res

      result.assertVoid
    }

    "retry on 429" in {
      val testingBackend = fs2BackendStub.whenAnyRequest
        .thenRespondCyclic(
          ResponseStub.adjust("too-many-requests", StatusCode.TooManyRequests),
          ResponseStub.adjust("ok")
        )

      val result = for
        client <- TelegramClient.make(config, testingBackend)
        res    <- client.send(Notification.deal(title, message, item))
      yield res

      result.assertVoid
    }

    "return error when not success" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(sendMessageUrl) && r.hasParams(Map("chat_id" -> "m1", "text" -> expectedTextWithUrl)) =>
            ResponseStub.adjust("fail", StatusCode.BadRequest)
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- TelegramClient.make(config, testingBackend)
        res    <- client.send(Notification.deal(title, message, item))
      yield res

      result.assertThrows(AppError.Http(400, "error sending message to telegram channel m1"))
    }
  }
}
