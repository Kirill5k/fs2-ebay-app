package ebayapp.kernel

import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}

import scala.reflect.ClassTag

object types {
  object EnumType:
    def printKebabCase[E](e: E): String = e.toString.replaceAll("(?<=[a-z])(?=[A-Z])", "-").toLowerCase
    def printLowerCase[E](e: E): String = e.toString.toLowerCase

  transparent trait EnumType[E: ClassTag](private val enums: () => Array[E], private val unwrap: E => String = EnumType.printKebabCase(_)):
    given Encoder[E]    = Encoder[String].contramap(unwrap(_))
    given Decoder[E]    = Decoder[String].emap(from)
    given KeyEncoder[E] = (e: E) => unwrap(e)
    given KeyDecoder[E] = (key: String) => from(key).toOption

    def from(kind: String): Either[String, E] =
      enums()
        .find(unwrap(_) == kind)
        .toRight(
          s"Invalid value $kind for enum ${implicitly[ClassTag[E]].runtimeClass.getSimpleName}, Accepted values: ${enums().map(unwrap).mkString(",")}"
        )

    extension (e: E) def print: String = unwrap(e)
}
