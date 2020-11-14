package ebayapp.services

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.clients.telegram.TelegramClient
import ebayapp.domain.ResellableItemBuilder
import ebayapp.domain.stock.StockUpdate

class NotificationServiceSpec extends CatsSpec {

  "A TelegramNotificationService" should {

    "send cheap item notification message" in {
      val client = mock[TelegramClient[IO]]
      when(client.sendMessageToMainChannel(any[String])).thenReturn(IO.unit)
      val videoGame = ResellableItemBuilder.videoGame("super mario 3", platform = Some( "SWITCH"))

      val result = NotificationService.telegram(client).flatMap(_.cheapItem(videoGame))

      result.unsafeToFuture().map { r =>
        verify(client).sendMessageToMainChannel("""NEW "super mario 3 SWITCH" - ebay: £32.99, cex: £80(142%)/£100 (qty: 1) https://www.ebay.co.uk/itm/super-mario-3""")
        r must be (())
      }
    }

    "stock update notification message" in {
      val client = mock[TelegramClient[IO]]
      when(client.sendMessageToSecondaryChannel(any[String])).thenReturn(IO.unit)

      val item = ResellableItemBuilder.generic("macbook pro", price = 50.0)
      val update = StockUpdate.PriceDrop(BigDecimal(100.0), BigDecimal(50.0))
      val result = NotificationService.telegram(client).flatMap(_.stockUpdate(item, update))

      result.unsafeToFuture().map { r =>
        verify(client).sendMessageToSecondaryChannel("""PRICE/DROP for macbook pro (£50.0, 1): Price has reduced from £100.0 to £50.0 http://cex.com/macbookpro""")
        r must be (())
      }
    }
  }
}
