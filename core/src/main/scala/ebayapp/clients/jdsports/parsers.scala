package ebayapp.clients.jdsports

import cats.implicits._
import ebayapp.common.errors.AppError
import io.circe.generic.auto._
import io.circe.parser._

private[jdsports] object parsers {

  final case class CatalogItem(
      plu: String,
      description: String,
      brand: String,
      sale: Boolean,
      categoryId: String
                              )

  """
    |{
    |		plu: "16022719",
    |		description: "Emporio Armani EA7 Tape 2 T-Shirt",
    |		colour: "black",
    |		unitPrice: "20.00",
    |		category: "Men",
    |		categoryId: "jdsports_ct107887",
    |		sale: true,
    |		brand: "Emporio Armani EA7",
    |		ownbrand: false,
    |		exclusive: false,
    |		onlineexlusive: false
    |	}
    |""".stripMargin


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
  }
}
