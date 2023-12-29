package ebayapp.core.tasks

import cats.Monad
import cats.effect.Concurrent
import cats.syntax.foldable.*
import ebayapp.core.services.{NotificationService, Services, StockService}
import fs2.Stream

final class StockMonitor[F[_]: Concurrent](
    private val notificationService: NotificationService[F],
    private val stockServices: List[StockService[F]]
) extends Task[F]:
  def run: Stream[F, Unit] =
    Stream
      .emits(stockServices.map(_.stockUpdates))
      .parJoinUnbounded
      .evalMap(upd => upd.updates.traverse_(u => notificationService.stockUpdate(upd.item, u)))

object StockMonitor {
  def make[F[_]: Concurrent](services: Services[F]): F[Task[F]] =
    Monad[F].pure(StockMonitor[F](services.notification, services.stock))
}
