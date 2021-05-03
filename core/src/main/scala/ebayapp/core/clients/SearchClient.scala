package ebayapp.core.clients

import ebayapp.core.common.config.{SearchCategory, SearchQuery}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2.Stream

trait SearchClient[F[_], I] {
  def search[D <: ItemDetails](
      query: SearchQuery,
      category: Option[SearchCategory] = None
  )(implicit
      mapper: ItemMapper[I, D]
  ): Stream[F, ResellableItem[D]]
}
