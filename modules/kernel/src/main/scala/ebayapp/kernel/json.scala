package ebayapp.kernel

import io.circe.{Encoder, Decoder}

import scala.concurrent.duration.FiniteDuration
import scala.util.Try

object json extends JsonCodecs

trait JsonCodecs {
  inline given Encoder[FiniteDuration] = Encoder.encodeString.contramap { fd =>
    fd.toString().replace(" ", "")
  }
  inline given Decoder[FiniteDuration] = Decoder.decodeString.emap { fdStr =>
    Either.cond[String, String](
      fdStr.matches("([0-9]+.)?[0-9]+( )?[a-zA-Z]+"),
      fdStr,
      s"$fdStr is not valid finite duration string. Expected format is '<length> <unit>'"
    ).flatMap { fdStr =>
      val Array(length, unit) = fdStr.split("(?<=\\d)( )?(?=[a-zA-Z])")
      Try(FiniteDuration(length.toLong, unit))
        .toEither
        .left.map(e => s"$fdStr is not valid finite duration string. ${e.getMessage}")
    }
  }
}
