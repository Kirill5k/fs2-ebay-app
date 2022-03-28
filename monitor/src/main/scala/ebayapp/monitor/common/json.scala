package ebayapp.monitor.common

import cats.syntax.either.*
import ebayapp.kernel.errors.AppError
import ebayapp.monitor.domain.{HttpMethod, Monitor, Url}
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration.*
import scala.util.Try

trait JsonCodecs:
  inline given Encoder[FiniteDuration] = Encoder[String].contramap(_.toCoarsest.toString)
  inline given Decoder[FiniteDuration] = Decoder[String].emap { fdStr =>
    Try {
      val Array(length, unit) = fdStr.split(" ")
      FiniteDuration(length.toLong, unit)
    }.toEither.leftMap(_ => s"$fdStr is not valid finite duration string. Expected format is '<length> <unit>'")
  }

  inline given Decoder[Url] = Decoder[String].map(Url.apply)
  inline given encodeUrl: Encoder[Url] = Encoder[String].contramap(_.toString)

  inline given Decoder[HttpMethod] = Decoder[String].map(HttpMethod.valueOf)
  inline given Encoder[HttpMethod] = Encoder[String].contramap(_.toString)

  inline given Decoder[Monitor.Status] = Decoder[String].map(Monitor.Status.valueOf)
  inline given Encoder[Monitor.Status] = Encoder[String].contramap(_.toString)

object json extends JsonCodecs
