package ebayapp.clients.jdsports

import cats.implicits._
import ebayapp.common.errors.AppError
import io.circe.generic.auto._
import io.circe.parser._

private[jdsports] object parsers {

  final case class CatalogItem(
      plu: String,
      colour: String,
      description: String,
      brand: String,
      sale: Boolean,
      categoryId: String
  ) {
    val name: String = s"$colour-$description".replaceAll(" ", "-").replaceAll("-+", "-")
  }

  final case class ItemStock(
      sizes: List[String]
  )

  object ResponseParser {
    def parseSearchResponse(rawHtml: String): Either[AppError, List[CatalogItem]] = {
      val rawDataObject = rawHtml
        .split("var dataObject = ")
        .last
        .split("</script>")
        .head
        .split("items: ")
        .last
        .replaceAll("\t", "")
        .replaceAll("\\{", "\\{\"")
        .replaceAll("(?<!\\}),", ",\"")
        .replaceAll(":", "\":")

      decode[List[CatalogItem]](rawDataObject.slice(0, rawDataObject.length - 2))
        .leftMap(e => AppError.Json(s"error parsing jdsports reponse ${e.getMessage}"))
    }

    private val sizePattern = ".*title=\"Select Size ([ 0-9A-Za-z]+)\".*$.*".r

    def parseStockResponse(rawHtml: String): Either[AppError, ItemStock] = {
      if (rawHtml.contains("outOfStock")) ItemStock(Nil).asRight[AppError]
      else {
        val sizes = rawHtml
          .split("pdp-productDetails-size")
          .toList
          .flatMap { s =>
            Option(s).collect { case sizePattern(size) => size }
          }
        ItemStock(sizes).asRight[AppError]
      }
    }
  }
}
