package ebayapp.kernel

import ebayapp.kernel.errors.AppError
import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}
import sttp.tapir.Codec.PlainCodec
import sttp.tapir.{Codec, DecodeResult, Schema}

import scala.reflect.ClassTag

object types {
  object EnumType:
    def printKebabCase[E](e: E): String = e.toString.replaceAll("(?<=[a-z])(?=[A-Z])", "-").toLowerCase
    def printLowerCase[E](e: E): String = e.toString.toLowerCase

  transparent trait EnumType[E: ClassTag](private val enums: () => Array[E], private val unwrap: E => String = EnumType.printKebabCase(_)):
    given Encoder[E]    = Encoder[String].contramap(unwrap(_))
    given Decoder[E]    = Decoder[String].emapTry(from(_).toTry)
    given KeyEncoder[E] = (e: E) => unwrap(e)
    given KeyDecoder[E] = (key: String) => from(key).toOption

    given Schema[E]     = Schema.string
    given PlainCodec[E] = Codec.string.mapDecode(s => from(s).fold(DecodeResult.Error(s, _), DecodeResult.Value(_)))(unwrap(_))

    def from(kind: String): Either[AppError, E] =
      enums()
        .find(unwrap(_) == kind)
        .toRight(
          AppError.Invalid(
            s"Invalid value $kind for enum ${implicitly[ClassTag[E]].runtimeClass.getSimpleName}, Accepted values: ${enums().map(unwrap).mkString(",")}"
          )
        )

    def fromUnsafe(name: String): E = from(name).fold(throw _, identity)

    extension (e: E) def print: String = unwrap(e)
}
