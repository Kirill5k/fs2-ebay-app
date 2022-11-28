package ebayapp.core.clients.flannels

import ebayapp.core.domain.search.SearchCriteria
import ebayapp.kernel.SttpClientSpec

class FlannelsClientSpec extends SttpClientSpec {

  val sc = SearchCriteria("stone island", Some("men"))
  
  "FlannelsClient" should {
    "return stream of items based on provided search criteria" in {
      pending
    }
  }
}
