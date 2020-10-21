package kirill5k.ebayapp.clients.ebay.auth

private[ebay] object responses {

  final case class EbayAuthSuccessResponse(
      access_token: String,
      expires_in: Long,
      token_type: String
  )

  final case class EbayAuthErrorResponse(
      error: String,
      error_description: String
  )
}
