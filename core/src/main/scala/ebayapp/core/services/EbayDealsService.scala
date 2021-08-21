package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.ebay.EbayClient
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{EbayDealsConfig, SearchCriteria}
import ebayapp.core.common.stream._
import ebayapp.core.domain.ResellableItem
import fs2._

import scala.concurrent.duration._

trait EbayDealsService[F[_]] {
  def deals(config: EbayDealsConfig): Stream[F, ResellableItem]
}

final class LiveEbayDealsService[F[_]: Logger: Temporal](
    private val ebayClient: EbayClient[F],
    private val cexClient: CexClient[F]
) extends EbayDealsService[F] {

  override def deals(config: EbayDealsConfig): Stream[F, ResellableItem] =
    Stream
      .emits(config.searchCriteria)
      .map(find)
      .parJoinUnbounded
      .repeatEvery(config.searchFrequency)

  private def find(criteria: SearchCriteria): Stream[F, ResellableItem] =
    ebayClient
      .search(criteria)
      .evalMap(cexClient.withUpdatedSellPrice)
      .metered(250.millis)
      .handleErrorWith { error =>
        Stream.eval(Logger[F].warn(error)(s"error getting deals from ebay")).drain
      }
}

object EbayDealsService {

  def make[F[_]: Temporal: Logger](
      ebayClient: EbayClient[F],
      cexClient: CexClient[F]
  ): F[EbayDealsService[F]] =
    Monad[F].pure(new LiveEbayDealsService[F](ebayClient, cexClient))
}
