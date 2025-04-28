package ebayapp.core.clients.jd

import cats.syntax.either.*
import ebayapp.kernel.errors.AppError
import io.circe.Codec
import io.circe.parser.*

private[jd] object parsers {

  final case class JdCatalogItem(
      plu: String,
      colour: String,
      description: String,
      sale: Boolean
  ) derives Codec.AsObject {
    val fullName: String = s"$colour-$description"
      .replaceAll("/|\'|'|&(#|$)[0-9]+;", "")
      .replaceAll(" ", "-")
      .replaceAll("-+", "-")
      .toLowerCase
  }

  final case class JdProduct(
      details: JdProductDetails,
      availableSizes: List[String]
  ) derives Codec.AsObject

  final case class JdProductDetails(
      Id: String,
      Name: String,
      UnitPrice: BigDecimal,
      PreviousUnitPrice: Option[BigDecimal],
      Brand: String,
      Category: String,
      Colour: String,
      PrimaryImage: String
  ) derives Codec.AsObject

  object ResponseParser {

    def parseBrandAjaxResponse(rawHtml: String): Either[AppError, List[JdCatalogItem]] = {
      val rawItems = rawHtml
        .split("window.dataObject.items.push\\(")
        .drop(1)
        .map(rawItem => rawItem.replaceAll("category: categoryName,|categoryId: categoryId,|}\n|</script>", ""))
        .map(rawItem => rawItem.replaceAll("\\);.*", ""))
        .map(rawItem => rawItem.replaceAll("""(\w+)\s*:""", "\"$1\": "))
        .mkString("[", ",", "]")

      decode[List[JdCatalogItem]](rawItems)
        .leftMap(e => AppError.Json(s"error parsing jdsports search response ${e.getMessage}\n$rawItems"))
    }

    def parseSearchResponse(rawHtml: String): Either[AppError, List[JdCatalogItem]] = {
      val rawDataObject = rawHtml
        .replaceFirst(".*items:", "")
        .replaceFirst("};.*", "")
        .replaceAll("\n", "")
        .replaceAll("""(\w+)\s*:""", "\"$1\": ")  // wrap json object key in quotes
        .replaceAll("""(?<=\w"),(?=\s*])""", "") // remove trailing comma in arrays

      decode[List[JdCatalogItem]](rawDataObject)
        .leftMap(e => AppError.Json(s"error parsing jdsports search response ${e.getMessage}\n$rawDataObject"))
    }

    def parseProductStockResponse(rawHtml: String): Either[AppError, Option[JdProduct]] =
      parseAvailableSizes(rawHtml).flatMap {
        case Nil   => None.asRight[AppError]
        case sizes => parseItemDetails(rawHtml).map(d => Some(JdProduct(d, sizes)))
      }

    private def parseItemDetails(rawHtml: String): Either[AppError, JdProductDetails] = {
      val rawProduct = rawHtml
        .split("var ProductType = ")
        .last
        .split("</script>")
        .head
        .trim
        .replaceAll("(?<=Description: \")[^\"]+", "")
        .replaceAll("undefined", "null")
        .replaceAll("\n|\t|&#\\d+;", "")
        .replaceAll("(?<!https):", "\":")
        .replaceAll(" +", " ")
        .replaceAll("(?<=(\\d,|null,|true,|false,|\",|\\{)) ", " \"")

      decode[JdProductDetails](rawProduct.slice(0, rawProduct.length - 1))
        .leftMap(e => AppError.Json(s"error parsing jdsports item details ${e.getMessage}\n$rawProduct\n$rawHtml"))
    }

    private def parseAvailableSizes(rawHtml: String): Either[AppError, List[String]] =
      Option(rawHtml)
        .getOrElse("")
        .split("title=\"Select Size ")
        .toList
        .tail
        .flatMap(_.split("\"").headOption)
        .asRight[AppError]
  }
}
