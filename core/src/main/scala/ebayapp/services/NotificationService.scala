package ebayapp.services

import cats.effect.Sync
import cats.implicits._
import ebayapp.clients.telegram.TelegramClient
import ebayapp.domain.stock.StockUpdate
import ebayapp.domain.{ItemDetails, ResellableItem}
import io.chrisdavenport.log4cats.Logger

trait NotificationService[F[_]] {
  def cheapItem[D <: ItemDetails](item: ResellableItem[D]): F[Unit]
  def stockUpdate[D <: ItemDetails](update: StockUpdate[D]): F[Unit]
}

final class TelegramNotificationService[F[_]](
    private val telegramClient: TelegramClient[F]
)(
    implicit val S: Sync[F],
    val L: Logger[F]
) extends NotificationService[F] {
  import NotificationService._

  override def cheapItem[D <: ItemDetails](item: ResellableItem[D]): F[Unit] =
    S.pure(item.cheapItemNotification).flatMap {
      case Some(message) =>
        L.info(s"""sending "$message"""") *>
          telegramClient.sendMessageToMainChannel(message)
      case None =>
        L.warn(s"not enough details for sending cheap item notification $item")
    }

  override def stockUpdate[D <: ItemDetails](update: StockUpdate[D]): F[Unit] =
    S.pure(update.notification).flatMap {
      case Some(message) =>
        L.info(s"""sending "$message"""") *>
          telegramClient.sendMessageToSecondaryChannel(message)
      case None =>
        L.warn(s"not enough details for stock update notification $update")
    }
}

object NotificationService {
  implicit class StockUpdateOps[D <: ItemDetails](private val update: StockUpdate[D]) extends AnyVal {
    def notification: Option[String] =
      update.item.itemDetails.fullName.map { name =>
        val price    = update.item.buyPrice.rrp
        val quantity = update.item.buyPrice.quantityAvailable
        val url      = update.item.listingDetails.url
        s"STOCK UPDATE for $name (£$price, $quantity): ${update.updateType} $url"
      }
  }

  implicit class ResellableItemOps[D <: ItemDetails](private val item: ResellableItem[D]) extends AnyVal {
    def cheapItemNotification: Option[String] =
      for {
        itemSummary <- item.itemDetails.fullName
        sell        <- item.sellPrice
        quantity = item.buyPrice.quantityAvailable
        buy              = item.buyPrice.rrp
        profitPercentage = sell.credit * 100 / buy - 100
        url              = item.listingDetails.url
      } yield s"""NEW "$itemSummary" - ebay: £$buy, cex: £${sell.credit}(${profitPercentage.intValue}%)/£${sell.cash} (qty: ${quantity}) $url"""
  }

  def telegram[F[_]: Sync: Logger](client: TelegramClient[F]): F[NotificationService[F]] =
    Sync[F].delay(new TelegramNotificationService[F](client))
}
