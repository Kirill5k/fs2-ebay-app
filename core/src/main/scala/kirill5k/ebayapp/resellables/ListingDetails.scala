package kirill5k.ebayapp.resellables

import java.time.Instant

final case class ListingDetails(
    url: String,
    title: String,
    shortDescription: Option[String],
    description: Option[String],
    image: Option[String],
    condition: String,
    datePosted: Instant,
    seller: String,
    properties: Map[String, String]
)
