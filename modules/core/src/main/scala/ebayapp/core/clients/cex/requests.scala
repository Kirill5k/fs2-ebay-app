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
      GraphqlSearchRequest("prod_cex_uk", s"query=${query}&userToken=872a14be2ac84b0198b6cb66051c82c6$faceFilters")
    }

  final case class CexGraphqlSearchRequest(
      requests: List[GraphqlSearchRequest]
  ) derives Codec.AsObject
}
