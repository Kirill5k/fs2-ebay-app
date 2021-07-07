package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.telegram.TelegramClient
import ebayapp.core.domain.stock.StockUpdate
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.common.{Cache, Error, Logger}

import java.nio.charset.StandardCharsets
import java.util.Base64
import scala.concurrent.duration._

trait NotificationService[F[_]] {
  def alert(error: Error): F[Unit]
  def cheapItem[D <: ItemDetails](item: ResellableItem[D]): F[Unit]
  def stockUpdate[D <: ItemDetails](item: ResellableItem[D], update: StockUpdate): F[Unit]
}

final class TelegramNotificationService[F[_]](
    private val telegramClient: TelegramClient[F],
    private val sentMessages: Cache[F, String, Unit]
)(implicit
    F: Monad[F],
    logger: Logger[F]
) extends NotificationService[F] {
  import NotificationService._

  override def cheapItem[D <: ItemDetails](item: ResellableItem[D]): F[Unit] =
    F.pure(item.cheapItemNotification).flatMap {
      case Some(message) =>
        logger.info(s"""sending "$message"""") *>
          telegramClient.sendMessageToMainChannel(message)
      case None =>
        logger.warn(s"not enough details for sending cheap item notification $item")
    }

  override def stockUpdate[D <: ItemDetails](item: ResellableItem[D], update: StockUpdate): F[Unit] =
    F.pure(item.stockUpdateNotification(update)).flatMap {
      case Some(message) =>
        sentMessages.evalIfNew(base64(message)) {
          logger.info(s"""sending "$message"""") *>
            telegramClient.sendMessageToSecondaryChannel(message) *>
            sentMessages.put(base64(message), ())
        }
      case None =>
        logger.warn(s"not enough details for stock update notification $update")
    }

  override def alert(error: Error): F[Unit] = {
    val alert = s"${error.time.toString} ERROR - ${error.message}"
    telegramClient.sendMessageToAlertsChannel(alert)
  }

  private def base64(message: String): String =
    Base64.getEncoder.encodeToString(message.getBytes(StandardCharsets.UTF_8))
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
        val discount = item.buyPrice.discount.fold("")(d => s", $d% off")
        val url      = item.listingDetails.url
        val image    = item.listingDetails.image.fold("")(i => s"\n$i")
        s"${update.header} for $name (£$price$discount, $quantity): ${update.message} $url $image".trim
      }
  }

  def telegram[F[_]: Temporal: Logger](client: TelegramClient[F]): F[NotificationService[F]] =
    Cache
      .make[F, String, Unit](1.hour, 5.minutes)
      .map(cache => new TelegramNotificationService[F](client, cache))
}
