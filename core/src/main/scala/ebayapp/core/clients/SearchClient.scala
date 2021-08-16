package ebayapp.core.clients

import ebayapp.core.common.config.{SearchCategory, SearchQuery}
import ebayapp.core.domain.ResellableItem
import fs2.Stream

trait SearchClient[F[_]] {
  def search(
      query: SearchQuery,
      category: Option[SearchCategory] = None
  ): Stream[F, ResellableItem.Anything]
}
