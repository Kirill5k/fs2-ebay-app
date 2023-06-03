package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.syntax.functor.*
import cats.syntax.apply.*
import ebayapp.core.clients.MessengerClient
import ebayapp.core.domain.stock.StockUpdate
import ebayapp.core.domain.{Notification, ResellableItem}
import ebayapp.core.common.{Cache, Error, Logger}

import java.nio.charset.StandardCharsets
import java.util.Base64
import scala.concurrent.duration.*

trait NotificationService[F[_]]:
  def alert(error: Error): F[Unit]
  def cheapItem(item: ResellableItem): F[Unit]
  def stockUpdate(item: ResellableItem, update: StockUpdate): F[Unit]

final private class LiveNotificationService[F[_]: Monad](
    private val messengerClient: MessengerClient[F],
    private val sentMessages: Cache[F, String, Unit]
)(using
    logger: Logger[F]
) extends NotificationService[F] {
  import NotificationService.*

  override def cheapItem(item: ResellableItem): F[Unit] =
    item.cheapItemNotification match
      case Some(notification) =>
        logger.info(s"""sending ${notification.message}""") *>
          messengerClient.send(notification)
      case None =>
        logger.warn(s"not enough details for sending cheap item notification $item")

  override def stockUpdate(item: ResellableItem, update: StockUpdate): F[Unit] =
    item.stockUpdateNotification(update) match
      case Some(notification) =>
        sentMessages.evalPutIfNew(base64(notification.message)) {
          logger.info(s"""sending ${notification.message} from ${item.listingDetails.seller}""") *>
            messengerClient.send(notification)
        }
      case None =>
        logger.warn(s"not enough details for stock update notification $update")

  override def alert(error: Error): F[Unit] = {
    val alert = s"${error.time.toString} ERROR - ${error.message}"
    messengerClient.send(Notification.Alert(alert))
  }

  private def base64(message: String): String =
    Base64.getEncoder.encodeToString(message.getBytes(StandardCharsets.UTF_8))
}

object NotificationService {
  extension (item: ResellableItem)
    def cheapItemNotification: Option[Notification] =
      for
        itemSummary <- item.itemDetails.fullName
        sell        <- item.sellPrice
        quantity         = item.buyPrice.quantityAvailable
        buy              = item.buyPrice.rrp
        profitPercentage = sell.credit * 100 / buy - 100
        url              = item.listingDetails.url
        msg =
          s"""NEW "$itemSummary" - ebay: £$buy, cex: £${sell.credit}(${profitPercentage.intValue}%)/£${sell.cash} (qty: $quantity) $url"""
      yield Notification.Deal(msg)

    def stockUpdateNotification(update: StockUpdate): Option[Notification] =
      item.itemDetails.fullName.map { name =>
        val price    = item.buyPrice.rrp
        val quantity = item.buyPrice.quantityAvailable
        val discount = item.buyPrice.discount.fold("")(d => s", $d% off")
        val url      = item.listingDetails.url
        val image    = item.listingDetails.image.fold("")(i => s"\n$i")
        val msg      = s"${update.header} for $name (£$price$discount, $quantity): ${update.message} $url $image".trim
        Notification.Stock(msg)
      }

  def make[F[_]: Temporal: Logger](client: MessengerClient[F]): F[NotificationService[F]] =
    Cache
      .make[F, String, Unit](1.hour, 5.minutes)
      .map(cache => LiveNotificationService[F](client, cache))
}
