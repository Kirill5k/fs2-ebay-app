package ebayapp.clients.jdsports

import cats.implicits._
import ebayapp.common.errors.AppError
import io.circe.generic.auto._
import io.circe.parser._

private[jdsports] object parsers {

  final case class JdCatalogItem(
      plu: String,
      colour: String,
      description: String,
      sale: Boolean
  ) {
    val fullName: String = s"$colour-$description".replaceAll(" ", "-").replaceAll("-+", "-").toLowerCase
  }

  final case class JdItemStock(
      sizes: List[String]
  )

  final case class JdItemDetails(
      Id: String,
      Name: String,
      UnitPrice: BigDecimal,
      PreviousUnitPrice: Option[BigDecimal],
      Brand: String,
      Category: String,
      Colour: String,
      PrimaryImage: String
  )

  object ResponseParser {

    def parseSearchResponse(rawHtml: String): Either[AppError, List[JdCatalogItem]] = {
      val rawDataObject = rawHtml
        .split("var dataObject = ")
        .last
        .split("</script>")
        .head
        .split("items: ")
        .last
        .replaceAll("\t|\n", "")
        .replaceAll("\\{", "\\{\"")
        .replaceAll("(?<!\\}),", ",\"")
        .replaceAll(":", "\":")

      decode[List[JdCatalogItem]](rawDataObject.slice(0, rawDataObject.length - 2))
        .leftMap(e => AppError.Json(s"error parsing jdsports search response ${e.getMessage}"))
    }

    def parseItemDetails(rawHtml: String): Either[AppError, JdItemDetails] = {
      val rawProduct = rawHtml
        .split("var ProductType = ")
        .last
        .split("</script>")
        .head
        .trim
        .replaceAll("\n", "")
        .replaceAll("(?<!https):", "\":")
        .replaceAll("(?<!\") {4,10}", "\"")
        .replaceAll("undefined", "null")

      decode[JdItemDetails](rawProduct.slice(0, rawProduct.length - 1))
        .leftMap(e => AppError.Json(s"error parsing jdsports item details ${e.getMessage}"))
    }

    def parseStockResponse(rawHtml: String): Either[AppError, JdItemStock] =
      if (rawHtml.contains("outOfStock")) JdItemStock(Nil).asRight[AppError]
      else {
        val sizes = rawHtml
          .split("title=\"Select Size ")
          .toList
          .tail
          .flatMap(_.split("\"").headOption)
        JdItemStock(sizes).asRight[AppError]
      }
  }
}
