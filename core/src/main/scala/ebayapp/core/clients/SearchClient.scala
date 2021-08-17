package ebayapp.core.clients

import ebayapp.core.common.config.{SearchCategory, SearchQuery}
import ebayapp.core.domain.ResellableItem
import fs2.Stream

trait SearchClient[F[_]] {
  def search(
      query: SearchQuery,
      category: Option[SearchCategory] = None
  ): Stream[F, ResellableItem.Anything]

  protected val defaultHeaders = Map(
    "Access-Control-Allow-Origin" -> "*",
    "Content-Type"                -> "application/json",
    "Connection"                  -> "keep-alive",
    "Cache-Control"               -> "no-store, max-age=0",
    "Accept"                      -> "*/*",
    "Accept-Encoding"             -> "gzip, deflate, br",
    "Accept-Language"             -> "en-GB,en-US;q=0.9,en;q=0.8",
    "Accept"                      -> "application/json, text/javascript, */*; q=0.01",
    "Connection"                  -> "keep-alive",
    "User-Agent"                  -> "PostmanRuntime/7.28.3"
  )
}
