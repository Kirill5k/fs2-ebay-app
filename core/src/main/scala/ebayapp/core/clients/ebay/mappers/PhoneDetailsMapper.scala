package ebayapp.core.clients.ebay.mappers

import ebayapp.core.domain.ItemDetails.Phone
import ebayapp.core.domain.search.ListingDetails

private[mappers] object PhoneDetailsMapper {
  private val TITLE_FAULTY_CONDITION_MATCHER = List(
    "cracked", "fault", "spares", "repair", "smashed", "no touch", "no face", "broken", "not work", "damag",
    "no service", "screenburn", "screen burn", "see description"
  ).mkString("^.*?(?i)(", "|", ").*$").r

  private val DESCRIPTION_FAULTY_CONDITION_MATCHER = List(
    "no touchid", "no touch id", "no faceid", "no face id", "home button fault", "faulty home", "faulty touch",
    "is icloud lock", "has icloud lock", "has activation lock",
    "faulty screen", "is damag", "is slight damag", "damaged screen", "badly damag", "light damag", "damaged front", "is heavily damag",
    "has crack", "have crack", "has slight crack", "got crack", "cracked screen", "hairline crack", "has small crack", "some crack", "crack on screen",
    "is small crack", "is badly crack", "is crack", "is slight crack", "cracked display", "got some crack", "are crack",
    "cracked front", "both crack", "few crack", "with a slight crack", "crack on front", "crack on back",
    "spares/repair", "spares or parts", "spares or repair", "for parts only", "spares or repair", "parts only", "spares repair", "spares & repair",
    "doesnt work", "dont work", "not work", "cant work", "isnt work", "stopped work",
    "are broke", "is smashed", "is broke", "smashed screen",
    "has some screen burn", "has screen burn", "needs glass replac", "needs new screen", "needs replac",
    "bank transfer"
  ).mkString("^.*?(?i)(", "|", ").*$").r

  private val NETWORKS_MATCH_REGEX = List("unlocked", "o2", "ee", "vodafone", "tesco").mkString("(?i)", "|", "").r

  private val COLOURS_MATCH_REGEX = List(
    "Jet Black", "Black", "Rose Gold", "Gold", "Silver", "White", "Blue", "Grey", "Red",
    "Purple", "Yellow", "Orange", "Green", "Pink"
  ).mkString("(?i)", "|", "").r

  def from(listingDetails: ListingDetails): Phone =
    Phone(
      make = listingDetails.properties.get("Brand"),
      model = listingDetails.properties.get("Model"),
      colour = mapColour(listingDetails),
      storageCapacity = mapStorage(listingDetails),
      network = mapNetwork(listingDetails),
      condition = mapCondition(listingDetails)
    )

  private def mapNetwork(listingDetails: ListingDetails): Option[String] =
    listingDetails.properties
      .get("Network")
      .filter(NETWORKS_MATCH_REGEX.matches(_))
      .orElse(Some("Unlocked"))

  private def mapStorage(listingDetails: ListingDetails): Option[String] =
    listingDetails.properties
      .get("Storage Capacity")
      .map(_.split("[/,]")(0).trim)
      .map(_.replaceAll(" ", ""))
      .filter(!_.contains("MB"))

  private def mapColour(listingDetails: ListingDetails): Option[String] =
    listingDetails.properties
      .get("Manufacturer Colour")
      .orElse(listingDetails.properties.get("Colour"))
      .map(_.replaceAll("(?i)Gray", "Grey"))
      .flatMap(COLOURS_MATCH_REGEX.findFirstIn(_))

  private def mapCondition(listingDetails: ListingDetails): Option[String] = {
    val originalCondition = Some(listingDetails.condition)
    originalCondition
      .filter(_ == "New")
      .orElse(conditionFromTitle(listingDetails))
      .orElse(conditionFromDescription(listingDetails))
      .orElse(originalCondition)
  }

  private def conditionFromTitle(listingDetails: ListingDetails): Option[String] =
    Option.when(TITLE_FAULTY_CONDITION_MATCHER.matches(listingDetails.title))("Faulty")

  private def conditionFromDescription(listingDetails: ListingDetails): Option[String] = {
    val completeDescription  = listingDetails.shortDescription.getOrElse("") + listingDetails.description.getOrElse("")
    val sanatisedDescription = completeDescription.replaceAll("'|\n", "").replaceAll(" a ", " ")
    Option.when(DESCRIPTION_FAULTY_CONDITION_MATCHER.matches(sanatisedDescription))("Faulty")
  }
}
