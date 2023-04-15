package ebayapp.core.clients

import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.domain.ResellableItem
import fs2.Stream

trait SearchClient[F[_]] {

  protected val XRerouteToHeader = "X-Reroute-To"
  
  extension (c: GenericRetailerConfig) protected def websiteUri = c.headers.getOrElse(XRerouteToHeader, c.baseUri)

  def search(criteria: SearchCriteria): Stream[F, ResellableItem]

}
