package ebayapp.core.clients.cex

import io.circe.Codec

private[cex] object requests {

  final case class GraphqlSearchRequest(
      indexName: String,
      params: String
  ) derives Codec.AsObject

  object GraphqlSearchRequest:
    def apply(query: String, inStock: Boolean = true): GraphqlSearchRequest = {
      val faceFilters =
        if (inStock) "&facetFilters=%5B%5B%22availability%3AIn%20Stock%20Online%22%2C%22availability%3AIn%20Stock%20In%20Store%22%5D%5D"
        else ""
      GraphqlSearchRequest("prod_cex_uk", s"query=${query}&userToken=ecf31216f1ec463fac30a91a1f0a0dc3$faceFilters")
    }

  final case class CexGraphqlSearchRequest(
      requests: List[GraphqlSearchRequest]
  ) derives Codec.AsObject
}
