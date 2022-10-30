package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.IOWordSpec
import ebayapp.core.clients.MessengerClient
import ebayapp.core.common.Error
import ebayapp.core.domain.Notification
import ebayapp.core.domain.ResellableItemBuilder
import ebayapp.core.domain.stock.StockUpdate
import org.mockito.Mockito.times

import java.time.Instant
import scala.concurrent.duration.*

class NotificationServiceSpec extends IOWordSpec {

  "A TelegramNotificationService" when {

    "alerting" should {
      "send alerts on errors" in {
        val client = mock[MessengerClient[IO]]
        when(client.send(any[Notification])).thenReturn(IO.unit)

        val error  = Error("very serious error", Instant.parse("2021-01-01T00:10:00Z"))
        val result = NotificationService.make(client).flatMap(_.alert(error))

        result.asserting { r =>
          verify(client).send(Notification.Alert("""2021-01-01T00:10:00Z ERROR - very serious error"""))
          r mustBe ()
        }
      }
    }

    "cheap items" should {
      "send cheap item notification message" in {
        val client = mock[MessengerClient[IO]]
        when(client.send(any[Notification])).thenReturn(IO.unit)
        val videoGame = ResellableItemBuilder.videoGame("super mario 3", platform = Some("SWITCH"))

        val result = NotificationService.make(client).flatMap(_.cheapItem(videoGame))

        result.asserting { r =>
          val msg = """NEW "super mario 3 SWITCH" - ebay: £32.99, cex: £80(142%)/£100 (qty: 1) https://www.ebay.co.uk/itm/super-mario-3"""
          verify(client).send(Notification.Deal(msg))
          r mustBe ()
        }
      }
    }

    "stock updates" should {
      "stock update notification message" in {
        val client = mock[MessengerClient[IO]]
        when(client.send(any[Notification])).thenReturn(IO.unit)

        val item   = ResellableItemBuilder.generic("macbook pro", price = 50.0, discount = Some(25))
        val update = StockUpdate.PriceDrop(BigDecimal(100.0), BigDecimal(50.0))
        val result = NotificationService.make(client).flatMap(_.stockUpdate(item, update))

        result.asserting { r =>
          val msg = """PRICE/DROP for macbook pro (£50.0, 25% off, 1): Price has reduced from £100.0 to £50.0 http://cex.com/macbookpro"""
          verify(client).send(Notification.Stock(msg))
          r mustBe ()
        }
      }

      "not send identical messages" in {
        val client = mock[MessengerClient[IO]]
        when(client.send(any[Notification])).thenReturn(IO.unit)

        val item = ResellableItemBuilder.generic("macbook pro")
        val result = NotificationService
          .make(client)
          .flatTap(_.stockUpdate(item, StockUpdate.New))
          .flatTap(_ => IO.sleep(1.seconds))
          .flatTap(_.stockUpdate(item, StockUpdate.New))
          .flatTap(_ => IO.sleep(1.seconds))
          .flatMap(_.stockUpdate(item, StockUpdate.New))

        result.asserting { r =>
          val msg = """STOCK/NEW for macbook pro (£1800.0, 1): New in stock http://cex.com/macbookpro"""
          verify(client, times(1)).send(Notification.Stock(msg))
          r mustBe ()
        }
      }
    }
  }
}
