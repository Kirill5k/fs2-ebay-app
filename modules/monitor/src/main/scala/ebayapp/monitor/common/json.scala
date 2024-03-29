package ebayapp.monitor.common

import cats.syntax.either.*
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration.*
import scala.util.Try

object json extends JsonCodecs

trait JsonCodecs:
  inline given Encoder[FiniteDuration] = Encoder.encodeString.contramap(_.toCoarsest.toString)
  inline given Decoder[FiniteDuration] = Decoder.decodeString.emap { fdStr =>
    Try {
      val Array(length, unit) = fdStr.split(" ")
      FiniteDuration(length.toLong, unit)
    }.toEither.leftMap(_ => s"$fdStr is not valid finite duration string. Expected format is '<length> <unit>'")
  }
