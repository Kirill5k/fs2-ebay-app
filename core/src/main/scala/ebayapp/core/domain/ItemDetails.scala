package ebayapp.core.domain

import cats.implicits._

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

}
