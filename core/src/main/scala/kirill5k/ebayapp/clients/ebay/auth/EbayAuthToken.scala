package kirill5k.ebayapp.clients.ebay.auth

import java.time.Instant

import scala.concurrent.duration._

private[auth] final case class EbayAuthToken(token: String, expiresAt: Instant) {
  def isValid: Boolean = expiresAt.isAfter(Instant.now())
}

private[auth] object EbayAuthToken {
  def apply(token: String, expiresIn: Long, precisionError: FiniteDuration = 15.seconds): EbayAuthToken =
    new EbayAuthToken(token, Instant.now().plusSeconds(expiresIn).minusSeconds(precisionError.toSeconds))
}
