package ebayapp.core.clients.ebay.auth

import io.circe.Codec

private[ebay] object responses {

  final case class EbayAuthSuccessResponse(
      access_token: String,
      expires_in: Long,
      token_type: String
  ) derives Codec.AsObject

  final case class EbayAuthErrorResponse(
      error: String,
      error_description: String
  ) derives Codec.AsObject
}
