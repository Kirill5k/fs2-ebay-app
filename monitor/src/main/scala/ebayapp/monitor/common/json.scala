package ebayapp.monitor.common

import cats.syntax.either.*
import ebayapp.monitor.domain.{HttpMethod, Monitor, Url}
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

  inline given Decoder[Url] = Decoder.decodeString.map(Url.apply)
  inline given Encoder[Url] = Encoder.encodeString.contramap(_.toString)

  inline given Decoder[HttpMethod] = Decoder.decodeString.map(HttpMethod.valueOf)
  inline given Encoder[HttpMethod] = Encoder.encodeString.contramap(_.toString)

  inline given Decoder[Monitor.Status] = Decoder.decodeString.map(Monitor.Status.valueOf)
  inline given Encoder[Monitor.Status] = Encoder.encodeString.contramap(_.toString)
