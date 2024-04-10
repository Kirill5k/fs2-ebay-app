package ebayapp.core.common

import io.circe.{Encoder, Decoder}

import scala.concurrent.duration.FiniteDuration
import scala.util.Try

object json {
  inline given Encoder[FiniteDuration] = Encoder.encodeString.contramap(_.toCoarsest.toString)
  inline given Decoder[FiniteDuration] = Decoder.decodeString.emap { fdStr =>
    Try {
      val Array(length, unit) = fdStr.split(" ")
      FiniteDuration(length.toLong, unit)
    }.toEither.left.map(_ => s"$fdStr is not valid finite duration string. Expected format is '<length> <unit>'")
  }
}
