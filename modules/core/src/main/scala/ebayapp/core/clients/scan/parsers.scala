package ebayapp.core.clients.scan

import cats.syntax.either.*
import ebayapp.kernel.errors.AppError

import scala.util.Try

private[scan] object parsers {

  final private[scan] case class ScanItem(
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
          .flatMap { rawItem =>
            for {
              name  <- nameRegex.findFirstIn(rawItem)
              url   <- urlRegex.findFirstIn(rawItem)
              image <- imageRegex.findFirstIn(rawItem)
              price <- priceRegex.findFirstIn(rawItem).flatMap(_.replace(",", "").toDoubleOption)
            } yield ScanItem(name, url, image, price)
          }
          .toList
      }.toEither
        .leftMap(e => AppError.Json(s"error parsing scan search response ${e.getMessage}\n$rawHtml"))
  }
}
