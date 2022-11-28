package ebayapp.core.clients.flannels

import io.circe.Codec

private[flannels] object responses {

  final case class FlannelsProduct(
      imageLarge: Option[String]
  ) derives Codec.AsObject

  final case class FlannelsSearchResponse(products: List[FlannelsProduct]) derives Codec.AsObject
}
