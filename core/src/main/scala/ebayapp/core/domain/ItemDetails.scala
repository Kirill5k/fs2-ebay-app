package ebayapp.core.domain

import cats.syntax.functor._
import cats.syntax.traverse._
import cats.syntax.apply._
import io.circe.{Decoder, Encoder}
import io.circe.generic.auto._
import io.circe.syntax._

sealed trait ItemDetails {
  def fullName: Option[String]
}

object ItemDetails {
  final case class Generic(
      name: String
  ) extends ItemDetails {
    val fullName: Option[String] = Some(name)
  }

  final case class Clothing(
      name: String,
      brand: String,
      size: String
  ) extends ItemDetails {
    val fullName: Option[String] = Some(s"$brand - $name, size ${size.capitalize}")
  }

  final case class Phone(
      make: Option[String],
      model: Option[String],
      colour: Option[String],
      storageCapacity: Option[String],
      network: Option[String],
      condition: Option[String]
  ) extends ItemDetails {
    val fullName: Option[String] =
      List(make, model, storageCapacity, colour, network).sequence.map(_.mkString(" "))
  }

  final case class VideoGame(
      name: Option[String],
      platform: Option[String],
      releaseYear: Option[String],
      genre: Option[String]
  ) extends ItemDetails {
    val fullName: Option[String] =
      (name, platform).mapN((n, p) => s"$n $p")
  }

  implicit val encodeItemDetails: Encoder[ItemDetails] = Encoder.instance {
    case details: Generic   => details.asJson
    case details: Phone     => details.asJson
    case details: VideoGame => details.asJson
    case details: Clothing  => details.asJson
  }

  implicit val decodeItemDetails: Decoder[ItemDetails] =
    List[Decoder[ItemDetails]](
      Decoder[Clothing].widen,
      Decoder[VideoGame].widen,
      Decoder[Phone].widen,
      Decoder[Generic].widen
    ).reduceLeft(_ or _)
}
