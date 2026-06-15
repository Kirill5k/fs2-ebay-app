package ebayapp.core.clients.frasers

import ebayapp.kernel.errors.AppError
import io.circe.parser.decode

import scala.util.matching.Regex

object parsers {

  object ResponseParser {
    private val nextFPushPattern: Regex = """self\.__next_f\.push\(\[1,"(.+)"\]\)""".r

    private val activePagePattern: Regex = """PaginationItem_active[^"]*"[^>]*>(\d+)<""".r

    def parseActivePageNumberFromBrandPageResponse(responseBody: String): Either[Throwable, Int] =
      activePagePattern
        .findFirstMatchIn(responseBody)
        .flatMap(m => m.group(1).toIntOption)
        .toRight(AppError.Failed("Could not find active page number in Frasers brand page response"))

    def parseItemsFromBrandPageResponse(responseBody: String): Either[Throwable, List[responses.FrasersProduct]] =
      extractProductsJson(responseBody)
        .toRight(AppError.Failed("Could not find products array in Frasers brand page response"))
        .flatMap { json =>
          decode[List[responses.FrasersProduct]](json).left.map { e =>
            AppError.Json(s"Error decoding Frasers brand page products: ${e.getMessage}", json)
          }
        }

    private def extractProductsJson(html: String): Option[String] =
      html
        .split('\n')
        .find(_.contains("\\\"products\\\":["))
        .flatMap(line => nextFPushPattern.findFirstMatchIn(line))
        .map(m => m.group(1).replace("\\\"", "\"").replace("\\u0026", "&"))
        .flatMap(findProductsArray)

    private def findProductsArray(decoded: String): Option[String] =
      val marker = "\"products\":["
      val idx    = decoded.indexOf(marker)
      Option.when(idx >= 0) {
        val start = idx + marker.length - 1
        var depth = 0
        var end   = start
        var i     = start
        while i < decoded.length do
          decoded.charAt(i) match
            case '[' => depth += 1
            case ']' =>
              depth -= 1
              if depth == 0 then
                end = i + 1
                i = decoded.length
            case _ => ()
          i += 1
        decoded.substring(start, end)
      }
  }
}
