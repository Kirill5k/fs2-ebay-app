package ebayapp.core.clients.scan

import cats.syntax.either._
import ebayapp.core.common.errors.AppError

import scala.util.Try

private[scan] object parsers {

  private[scan] final case class ScanItem(
      name: String,
      productUrlPath: String,
      imageUrl: String,
      price: Double
  )

  private[scan] object ResponseParser {

    val nameRegex  = "(?<=data-description=\")([^\"]+)".r
    val urlRegex   = "(?<=href=\")([^\"]+)".r
    val imageRegex = "(?<=data-src=\")([^\"]+)".r
    val priceRegex = "(?<=class=\"price\"><small>&pound;</small>)([0-9,]+)".r

    def parseSearchResponse(rawHtml: String): Either[AppError, List[ScanItem]] =
      Try {
        rawHtml
          .split("<ul class=\"productColumns")
          .drop(1)
          .filterNot(_.startsWith(" related"))
          .mkString
          .split("""li class="product"""")
          .tail
          .filter(_.contains("Item in stock"))
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
