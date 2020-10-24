package ebayapp.common

import java.time.Instant

import cats.Applicative
import cats.effect.Sync
import io.circe.{Decoder, Encoder}
import org.http4s.circe.{jsonEncoderOf, jsonOf}
import org.http4s.{EntityDecoder, EntityEncoder}

import scala.util.Try

object json extends JsonCodecs {
  implicit def deriveEntityEncoder[F[_]: Applicative, A: Encoder]: EntityEncoder[F, A] = jsonEncoderOf[F, A]
  implicit def deriveEntityDecoder[F[_]: Sync, A: Decoder]: EntityDecoder[F, A]        = jsonOf[F, A]
}

trait JsonCodecs {
  implicit val instantEncode: Encoder[Instant] = Encoder.encodeString.contramap[Instant](_.toString)
  implicit val instantDecoder: Decoder[Instant] = Decoder.decodeString.emapTry{ str => Try(Instant.parse(str))}
}
