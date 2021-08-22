package ebayapp.core.common

import io.circe.{Decoder, Encoder}

import java.time.Instant
import scala.util.Try

object json extends JsonCodecs

trait JsonCodecs {
  implicit val instantEncode: Encoder[Instant]  = Encoder.encodeString.contramap[Instant](_.toString)
  implicit val instantDecoder: Decoder[Instant] = Decoder.decodeString.emapTry(str => Try(Instant.parse(str)))
}
