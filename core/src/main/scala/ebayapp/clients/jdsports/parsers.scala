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
      sale: Boolean
  ) {
    val name: String = s"$colour-$description".replaceAll(" ", "-").replaceAll("-+", "-")
  }

  final case class ItemStock(
      sizes: List[String]
  )

  final case class ItemDetails(
      Id: String,
      Name: String,
      UnitPrice: BigDecimal,
      PreviousUnitPrice: BigDecimal,
      Brand: String,
      Category: String,
      Colour: String,
      PrimaryImage: String
  )

  object ResponseParser {
    private val sizePattern = ".*title=\"Select Size ([ 0-9A-Za-z]+)\".*$.*".r

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
        .leftMap(e => AppError.Json(s"error parsing jdsports search response ${e.getMessage}"))
    }

    def parseItemDetails(rawHtml: String): Either[AppError, ItemDetails] = {
      val rawProduct = rawHtml
        .split("var ProductType = ")
        .last
        .split("</script>")
        .head
        .trim
        .replaceAll("(?<!https):", "\":")
        .replaceAll("(?<!\") {4,10}", "\"")

      decode[ItemDetails](rawProduct.slice(0, rawProduct.length - 1))
        .leftMap(e => AppError.Json(s"error parsing jdsports item details ${e.getMessage}"))
    }

    def parseStockResponse(rawHtml: String): Either[AppError, ItemStock] =
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
