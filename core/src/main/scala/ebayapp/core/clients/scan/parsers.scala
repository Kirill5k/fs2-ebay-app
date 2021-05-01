package ebayapp.core.clients.scan

import ebayapp.core.common.errors.AppError
import cats.implicits._

import scala.util.Try

object parsers {

  final case class ScanItem(
      name: String,
      url: String,
      image: String,
      price: Double
  )

  object ResponseParser {

    val nameRegex  = "(?<=data-description=\")([^\"]+)".r
    val urlRegex   = "(?<=href=\")([^\"]+)".r
    val imageRegex = "(?<=data-src=\")([^\"]+)".r
    val priceRegex = "(?<=class=\"price\"><small>&pound;</small>)([0-9,]+)".r

    def parseSearchResponse(rawHtml: String): Either[AppError, List[ScanItem]] =
      Try {
        rawHtml
          .split("productColumns")
          .drop(1)
          .head
          .split("""li class="product"""")
          .tail
          .filterNot(_.contains("buyButtonNoPrice"))
          .map { rawItem =>
            ScanItem(
              nameRegex.findFirstIn(rawItem).get,
              urlRegex.findFirstIn(rawItem).get,
              imageRegex.findFirstIn(rawItem).get,
              priceRegex.findFirstIn(rawItem).get.replace(",", "").toDouble
            )
          }
          .toList
      }.toEither
        .leftMap(e => AppError.Json(s"error parsing scan search response ${e.getMessage}\n$rawHtml"))
  }
}
