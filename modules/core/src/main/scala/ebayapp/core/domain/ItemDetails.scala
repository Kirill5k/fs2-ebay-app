package ebayapp.core.domain

import cats.syntax.traverse.*
import cats.syntax.apply.*
import io.circe.{Codec, Decoder, Encoder, Json}
import io.circe.syntax.*

sealed trait ItemDetails(val kind: ItemKind):
  def fullName: Option[String]

object ItemDetails {
  final case class Generic(
      name: String
  ) extends ItemDetails(ItemKind.Generic) derives Codec.AsObject:
    val fullName: Option[String] = Some(name)

  final case class Clothing(
      name: String,
      brand: String,
      size: String
  ) extends ItemDetails(ItemKind.Clothing) derives Codec.AsObject:
    val fullName: Option[String] = Some(s"$brand - $name, size ${size.capitalize}")

  final case class Phone(
      make: Option[String],
      model: Option[String],
      colour: Option[String],
      storageCapacity: Option[String],
      network: Option[String],
      condition: Option[String]
  ) extends ItemDetails(ItemKind.MobilePhone) derives Codec.AsObject:
    val fullName: Option[String] =
      List(make, model, storageCapacity, colour, network).sequence.map(_.mkString(" "))

  final case class Electronics(
      brand: Option[String],
      model: Option[String],
      colour: Option[String],
      condition: Option[String]
  ) extends ItemDetails(ItemKind.Electronics) derives Codec.AsObject:
    val fullName: Option[String] = 
      List(brand, model, colour, condition).sequence.map(_.mkString(" "))

  final case class VideoGame(
      name: Option[String],
      platform: Option[String],
      releaseYear: Option[String],
      genre: Option[String]
  ) extends ItemDetails(ItemKind.VideoGame) derives Codec.AsObject:
    val fullName: Option[String] = (name, platform).mapN((n, p) => s"$n $p")

  inline given Encoder[ItemDetails] = Encoder.instance {
    case d: Generic   => d.asJson.deepMerge(Json.obj("kind" := d.kind))
    case d: Phone     => d.asJson.deepMerge(Json.obj("kind" := d.kind))
    case d: VideoGame => d.asJson.deepMerge(Json.obj("kind" := d.kind))
    case d: Clothing     => d.asJson.deepMerge(Json.obj("kind" := d.kind))
    case d: Electronics => d.asJson.deepMerge(Json.obj("kind" := d.kind))
  }

  inline given Decoder[ItemDetails] = Decoder
    .instance { cursor =>
      cursor.get[ItemKind]("kind").flatMap {
        case ItemKind.Generic     => cursor.as[Generic]
        case ItemKind.VideoGame   => cursor.as[VideoGame]
        case ItemKind.MobilePhone => cursor.as[Phone]
        case ItemKind.Clothing    => cursor.as[Clothing]
        case ItemKind.Electronics => cursor.as[Electronics]
      }
    }
}
