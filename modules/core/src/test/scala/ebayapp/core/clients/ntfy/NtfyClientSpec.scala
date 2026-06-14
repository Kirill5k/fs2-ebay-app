package ebayapp.core.clients.ntfy

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.NtfyConfig
import ebayapp.core.domain.{Notification, ResellableItemBuilder}
import ebayapp.kernel.errors.AppError
import sttp.model.StatusCode
import kirill5k.common.sttp.test.Sttp4WordSpec
import sttp.client4.testing.ResponseStub

class NtfyClientSpec extends Sttp4WordSpec {

  val title      = "Test Title"
  val message    = "lorem ipsum dolor sit amet"
  val ntfyConfig = NtfyConfig("http://ntfy.com", "deals", "stock", "alerts")
  val config     = MockRetailConfigProvider.make[IO](ntfyConfig = Some(ntfyConfig))
  val item       = ResellableItemBuilder.makeGeneric("test")

  "NtfyClient" should {

    "send message to deals topic" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r
              if r.isPost && r.isGoingTo("ntfy.com/deals") && r
                .hasHeader("Title", title) && r.hasHeader("Click", item.listingDetails.url) && r.hasBody(message) =>
            ResponseStub.adjust("success")
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- NtfyClient.make(config, testingBackend)
        res    <- client.send(Notification.deal(title, message, item))
      yield res

      result.assertVoid
    }

    "send message to stock topic" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r
              if r.isPost && r.isGoingTo("ntfy.com/stock") && r
                .hasHeader("Title", title) && r.hasHeader("Click", item.listingDetails.url) && r.hasBody(message) =>
            ResponseStub.adjust("success")
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- NtfyClient.make(config, testingBackend)
        res    <- client.send(Notification.stock(title, message, item))
      yield res

      result.assertVoid
    }

    "send message to alerts topic" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isPost && r.isGoingTo("ntfy.com/alerts") && r.hasHeader("Title", title) && r.hasBody(message) =>
            ResponseStub.adjust("success")
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- NtfyClient.make(config, testingBackend)
        res    <- client.send(Notification.alert(title, message))
      yield res

      result.assertVoid
    }

    "return error when not success" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isPost && r.isGoingTo("ntfy.com/deals") =>
            ResponseStub.adjust("fail", StatusCode.BadRequest)
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- NtfyClient.make(config, testingBackend)
        res    <- client.send(Notification.deal(title, message, item))
      yield res

      result.assertThrows(AppError.Http(400, "error sending message to ntfy topic deals"))
    }
  }
}
