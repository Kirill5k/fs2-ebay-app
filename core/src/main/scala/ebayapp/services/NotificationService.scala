package ebayapp.services

import cats.effect.Sync
import cats.implicits._
import ebayapp.clients.telegram.TelegramClient
import ebayapp.domain.stock.StockUpdate
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.common.{Error, Logger}

trait NotificationService[F[_]] {
  def alert(error: Error): F[Unit]
  def cheapItem[D <: ItemDetails](item: ResellableItem[D]): F[Unit]
  def stockUpdate[D <: ItemDetails](item: ResellableItem[D], update: StockUpdate): F[Unit]
}

final class TelegramNotificationService[F[_]](
    private val telegramClient: TelegramClient[F]
)(implicit
    val F: Sync[F],
    val L: Logger[F]
) extends NotificationService[F] {
  import NotificationService._

  override def cheapItem[D <: ItemDetails](item: ResellableItem[D]): F[Unit] =
    F.pure(item.cheapItemNotification).flatMap {
      case Some(message) =>
        L.info(s"""sending "$message"""") *>
          telegramClient.sendMessageToMainChannel(message)
      case None =>
        L.warn(s"not enough details for sending cheap item notification $item")
    }

  override def stockUpdate[D <: ItemDetails](item: ResellableItem[D], update: StockUpdate): F[Unit] =
    F.pure(item.stockUpdateNotification(update)).flatMap {
      case Some(message) =>
        L.info(s"""sending "$message"""") *>
          telegramClient.sendMessageToSecondaryChannel(message)
      case None =>
        L.warn(s"not enough details for stock update notification $update")
    }

  override def alert(error: Error): F[Unit] = {
    val alert = s"${error.time.toString} ERROR - ${error.message}"
    telegramClient.sendMessageToAlertsChannel(alert)
  }
}

object NotificationService {
  implicit class ResellableItemOps[D <: ItemDetails](private val item: ResellableItem[D]) extends AnyVal {
    def cheapItemNotification: Option[String] =
      for {
        itemSummary <- item.itemDetails.fullName
        sell        <- item.sellPrice
        quantity         = item.buyPrice.quantityAvailable
        buy              = item.buyPrice.rrp
        profitPercentage = sell.credit * 100 / buy - 100
        url              = item.listingDetails.url
      } yield s"""NEW "$itemSummary" - ebay: £$buy, cex: £${sell.credit}(${profitPercentage.intValue}%)/£${sell.cash} (qty: ${quantity}) $url"""

    def stockUpdateNotification(update: StockUpdate): Option[String] =
      item.itemDetails.fullName.map { name =>
        val price    = item.buyPrice.rrp
        val quantity = item.buyPrice.quantityAvailable
        val url      = item.listingDetails.url
        s"${update.header} for $name (£$price, $quantity): ${update.message} $url"
      }
  }

  def telegram[F[_]: Sync: Logger](client: TelegramClient[F]): F[NotificationService[F]] =
    Sync[F].delay(new TelegramNotificationService[F](client))
}
