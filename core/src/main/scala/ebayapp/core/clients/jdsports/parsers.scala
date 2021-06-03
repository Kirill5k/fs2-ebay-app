package ebayapp.core.clients.jdsports

import cats.implicits._
import ebayapp.core.common.errors.AppError
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

  final case class JdProduct(
      details: JdProductDetails,
      availableSizes: List[String]
  )

  final case class JdProductDetails(
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
        .replaceAll("\t|\n|\\s{2,10}", "")
        .replaceAll(",(?=])", "")
        .replaceAll("\\{", "\\{\"")
        .replaceAll("(?<!\\}),(?!\")", ",\"")
        .replaceAll(":", "\":")

      decode[List[JdCatalogItem]](rawDataObject.slice(0, rawDataObject.length - 2))
        .leftMap(e => AppError.Json(s"error parsing jdsports search response ${e.getMessage}\n$rawDataObject"))
    }

    def parseProductStockResponse(rawHtml: String): Either[AppError, Option[JdProduct]] =
      parseAvailableSizes(rawHtml).flatMap {
        case Nil => None.asRight[AppError]
        case sizes => parseItemDetails(rawHtml).map(d => Some(JdProduct(d, sizes)))
      }

    private def parseItemDetails(rawHtml: String): Either[AppError, JdProductDetails] = {
      val rawProduct = rawHtml
        .split("var ProductType = ")
        .last
        .split("</script>")
        .head
        .trim
        .replaceAll("undefined", "null")
        .replaceAll("\n|\t|&#\\d+;", "")
        .replaceAll("(?<!https):", "\":")
        .replaceAll(" +", " ")
        .replaceAll("(?<=(\\d,|null,|true,|false,|\",|\\{)) ", " \"")

      decode[JdProductDetails](rawProduct.slice(0, rawProduct.length - 1))
        .leftMap(e => AppError.Json(s"error parsing jdsports item details ${e.getMessage}\n$rawProduct\n$rawHtml"))
    }

    private def parseAvailableSizes(rawHtml: String): Either[AppError, List[String]] =
      rawHtml
        .split("title=\"Select Size ")
        .toList
        .tail
        .flatMap(_.split("\"").headOption)
        .asRight[AppError]
  }
}
