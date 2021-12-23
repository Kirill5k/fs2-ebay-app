package ebayapp.monitor.common

import ebayapp.monitor.domain.{HttpMethod, Url, Monitor}
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration.*

trait JsonCodecs:
  inline given decodeFD: Decoder[FiniteDuration] = Decoder[Long].map(_.nanos)
  inline given encodeFD: Encoder[FiniteDuration] = Encoder[Long].contramap(_.toNanos)

  inline given decodeUrl: Decoder[Url] = Decoder[String].map(Url.apply)
  inline given encodeUrl: Encoder[Url] = Encoder[String].contramap(_.toString)

  inline given decodeHM: Decoder[HttpMethod] = Decoder[String].map(HttpMethod.valueOf)
  inline given encodeHM: Encoder[HttpMethod] = Encoder[String].contramap(_.toString)

  inline given decodeStatus: Decoder[Monitor.Status] = Decoder[String].map(Monitor.Status.valueOf)
  inline given encodeStatus: Encoder[Monitor.Status] = Encoder[String].contramap(_.toString)

object json extends JsonCodecs
