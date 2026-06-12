package ebayapp.core.clients.frasers

import ebayapp.kernel.errors.AppError

object parsers {

  object ResponseParser {
    def parseItemsFromBrandPageResponse(responseBody: String): Either[Throwable, List[responses.FlannelsProduct]] = {
      Left(AppError.Critical(s"Unimplemented parser for Frasers brand page response: ${responseBody}"))
    }
  }
}
