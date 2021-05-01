package ebayapp.core.clients.scan

import ebayapp.core.clients.scan.mappers.ScanItemMapper
import ebayapp.core.common.config.{SearchCategory, SearchQuery}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2.Stream

trait ScanClient[F[_]] {
  def search[D <: ItemDetails: ScanItemMapper](
      query: SearchQuery,
      category: Option[SearchCategory]
  ): Stream[F, ResellableItem[D]]
}
