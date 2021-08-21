package ebayapp.core.clients

import ebayapp.core.common.config.SearchCriteria
import ebayapp.core.domain.ResellableItem
import fs2.Stream

trait SearchClient[F[_]] {
  def search(criteria: SearchCriteria): Stream[F, ResellableItem]
}
