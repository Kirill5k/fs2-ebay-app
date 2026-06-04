package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.syntax.functor.*
import cats.syntax.apply.*
import kirill5k.common.cats.Cache
import ebayapp.core.clients.MessengerClient
import ebayapp.core.domain.stock.StockUpdate
import ebayapp.core.domain.{Notification, ResellableItem}
import ebayapp.core.common.{Error, Logger}

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
        logger.info(s"""sending ${notification.title} ${notification.message} ${item.listingDetails.url}""") *>
          messengerClient.send(notification)
      case None =>
        logger.warn(s"not enough details for sending cheap item notification $item")

  override def stockUpdate(item: ResellableItem, update: StockUpdate): F[Unit] =
    item.stockUpdateNotification(update) match
      case Some(notification) =>
        sentMessages.evalPutIfNew(base64(notification.message)) {
          logger.info(s"""sending ${notification.title} ${notification.message} from ${item.listingDetails.seller} ${item.listingDetails.url} ${item.listingDetails.image}""") *>
            messengerClient.send(notification)
        }
      case None =>
        logger.warn(s"not enough details for stock update notification $update")

  override def alert(error: Error): F[Unit] =
    messengerClient.send(Notification.Alert("Error", s"${error.time.toString} - ${error.message}"))

  private def base64(message: String): String =
    Base64.getEncoder.encodeToString(message.getBytes(StandardCharsets.UTF_8))
}

object NotificationService:
  extension (item: ResellableItem)
    def cheapItemNotification: Option[Notification] =
      for
        itemSummary <- item.itemDetails.fullName
        sell        <- item.sellPrice
        quantity         = item.buyPrice.quantityAvailable
        buy              = item.buyPrice.rrp
        profitPercentage = sell.credit * 100 / buy - 100
        title            = s"""NEW "$itemSummary""""
        msg              = s"""ebay: £$buy, cex: £${sell.credit}(${profitPercentage.intValue}%)/£${sell.cash} (qty: $quantity)"""
      yield Notification.Deal(title, msg, Some(item.listingDetails.url), item.listingDetails.image)

    def stockUpdateNotification(update: StockUpdate): Option[Notification] =
      item.itemDetails.fullName.map { name =>
        val price    = item.buyPrice.rrp
        val quantity = item.buyPrice.quantityAvailable
        val discount = item.buyPrice.discount.fold("")(d => s", $d% off")
        val title    = s"${update.header} for $name"
        val msg      = s"(£$price$discount, $quantity): ${update.message}"
        Notification.Stock(title, msg, Some(item.listingDetails.url), item.listingDetails.image)
      }

  def make[F[_]: {Temporal, Logger}](client: MessengerClient[F]): F[NotificationService[F]] =
    Cache
      .make[F, String, Unit](1.hour, 5.minutes)
      .map(cache => LiveNotificationService[F](client, cache))
