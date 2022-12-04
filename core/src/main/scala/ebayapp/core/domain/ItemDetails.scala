package ebayapp.core.domain

import cats.syntax.functor.*
import cats.syntax.traverse.*
import cats.syntax.apply.*
import io.circe.{Codec, Decoder, Encoder}
import io.circe.syntax.*

sealed trait ItemDetails(val kind: ItemKind):
  def fullName: Option[String]

object ItemDetails {
  final case class Generic(
      name: String
  ) extends ItemDetails(ItemKind.Generic)
      derives Codec.AsObject:
    val fullName: Option[String] = Some(name)

  final case class Clothing(
      name: String,
      brand: String,
      size: String
  ) extends ItemDetails(ItemKind.Clothing)
      derives Codec.AsObject:
    val fullName: Option[String] = Some(s"$brand - $name, size ${size.capitalize}")

  final case class Phone(
      make: Option[String],
      model: Option[String],
      colour: Option[String],
      storageCapacity: Option[String],
      network: Option[String],
      condition: Option[String]
  ) extends ItemDetails(ItemKind.MobilePhone)
      derives Codec.AsObject:
    val fullName: Option[String] =
      List(make, model, storageCapacity, colour, network).sequence.map(_.mkString(" "))

  final case class VideoGame(
      name: Option[String],
      platform: Option[String],
      releaseYear: Option[String],
      genre: Option[String]
  ) extends ItemDetails(ItemKind.VideoGame)
      derives Codec.AsObject:
    val fullName: Option[String] = (name, platform).mapN((n, p) => s"$n $p")

  given Encoder[ItemDetails] = Encoder.instance {
    case details: Generic   => details.asJson
    case details: Phone     => details.asJson
    case details: VideoGame => details.asJson
    case details: Clothing  => details.asJson
  }

  given Decoder[ItemDetails] =
    List[Decoder[ItemDetails]](
      Decoder[Clothing].widen,
      Decoder[VideoGame].widen,
      Decoder[Phone].widen,
      Decoder[Generic].widen
    ).reduceLeft(_ or _)
}
