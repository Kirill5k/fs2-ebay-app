package ebayapp.core.clients.jd

import io.circe.Encoder

private[jd] object requests {

  final case class JdAlgoliaSearchRequest(
      query: String,
      page: Int,
      ruleContexts: List[String] = List("web"),
      hitsPerPage: Int = 256,
      attributesToRetrieve: List[String] = List(
        "objectID",
        "name",
        "brand",
        "colour",
        "size",
        "categoryPageId",
        "price",
        "wasPrice",
        "image",
        "slug",
        "inStock"
      ),
      attributesToHighlight: List[String] = Nil
  ) derives Encoder.AsObject
}
