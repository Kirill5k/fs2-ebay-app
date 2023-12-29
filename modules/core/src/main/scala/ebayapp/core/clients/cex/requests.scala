package ebayapp.core.clients.cex

import io.circe.Codec

private[cex] object requests {

  final case class GraphqlSearchRequest(
      indexName: String,
      params: String
  ) derives Codec.AsObject

  final case class CexGraphqlSearchRequest(
      requests: List[GraphqlSearchRequest]
  ) derives Codec.AsObject
}
