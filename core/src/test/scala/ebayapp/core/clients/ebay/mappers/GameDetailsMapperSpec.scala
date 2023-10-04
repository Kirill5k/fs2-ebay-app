package ebayapp.core.clients.ebay.mappers

import java.time.Instant

import ebayapp.core.domain.search.ListingDetails
import org.scalatest.Inspectors
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class GameDetailsMapperSpec extends AnyWordSpec with Matchers with Inspectors {

  val testListing = ListingDetails(
    "https://www.ebay.co.uk/itm/Call-of-Duty-Modern-Warfare-Xbox-One-/274204760218",
    "Call of Duty: Modern Warfare Limited Edition (Xbox One)",
    Some("Games"),
    Some("Call of Duty: Modern Warfare (Xbox One). Condition is New. Dispatched with Royal Mail 1st Class Large Letter."),
    None,
    Some("https://i.ebayimg.com/images/g/PW4AAOSweS5eHsrk/s-l1600.jpg"),
    "USED",
    Instant.now,
    "EBAY:boris999",
    Map(
      "Platform"     -> "Microsoft Xbox One",
      "Game Name"    -> "Call of Duty: Modern Warfare",
      "Release Year" -> "2019",
      "Genre"        -> "Action"
    )
  )

  "GameDetailsMapper" should {

    "get details from properties if they are present except for platform and title" in {
      val listingDetails = testListing.copy(title = "Call of Duty Modern Warfare 2 PS4")

      val gameDetails = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Call of Duty Modern Warfare 2")
      gameDetails.platform mustBe Some("PS4")
      gameDetails.releaseYear mustBe Some("2019")
      gameDetails.genre mustBe Some("Action")
    }

    "map uncommon platform spellings" in {
      forAll(
        Map(
          "PS-4"                      -> "PS4",
          "PS4"                       -> "PS4",
          "PS2"                       -> "PS2",
          "PS5"                       -> "PS5",
          "PLAYSTATION4"              -> "PS4",
          "PLAYSTATION 4"             -> "PS4",
          "PLAYSTATION 3"             -> "PS3",
          "XBONE"                     -> "XBOX ONE",
          "XB ONE"                    -> "XBOX ONE",
          "XB 1"                      -> "XBOX ONE",
          "XB360"                     -> "XBOX 360",
          "XBOX 360"                  -> "XBOX 360",
          "X BOX ONE"                 -> "XBOX ONE",
          "XBOX ONE, SERIES X|S"      -> "XBOX ONE",
          " (XBOX ONE, SERIES X|S)"   -> "XBOX ONE",
          "SERIES X"                  -> "XBOX",
          "SERIES X|S"                -> "XBOX",
          "X BOX X SERIES"            -> "XBOX",
          "XBOX SERIES X"             -> "XBOX",
          "XBOX SX"                   -> "XBOX",
          "Xbox-Live-Xbox-One"        -> "XBOX",
          "Play Station 4, 2020"      -> "PS4",
          "Sony Playstation 2016 PS3" -> "PS3",
          "(XBOX, 2020)"              -> "XBOX"
        )
      ) { (exp, act) =>
        val details = GameDetailsMapper.from(testListing.copy(title = s"Call of Duty: Infinite Warfare $exp", properties = Map.empty))
        details.name mustBe Some("Call of Duty Infinite Warfare")
        details.platform mustBe Some(act)
      }
    }

    "map platform from title even if it exists in properties" in {
      val listingDetails = testListing.copy(properties = testListing.properties + ("Platform" -> "Xbox 360"))

      val gameDetails = GameDetailsMapper.from(listingDetails)

      gameDetails.platform mustBe Some("XBOX ONE")
    }

    "map telltale game series to simply telltale" in {
      val listingDetails = testListing.copy(title = "Minecraft A Telltale Game Series", properties = Map.empty)

      val gameDetails = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Minecraft Telltale")
    }

    "only map WII title from complete words" in {
      val listingDetails = testListing.copy(title = s"COD WWII for Sony Playstation 4", properties = Map.empty)

      val gameDetails = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe (Some("Call of Duty WWII"))
      gameDetails.platform mustBe Some("PS4")
    }

    "get details from title if properties are missing" in {
      val listingDetails = testListing.copy(properties = Map.empty)

      val gameDetails = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Call of Duty Modern Warfare")
      gameDetails.platform mustBe Some("XBOX ONE")
      gameDetails.releaseYear mustBe None
      gameDetails.genre mustBe None
    }

    "remove D from GranD turismo" in {
      val listingDetails = testListing.copy(title = "Grand Turismo")

      val gameDetails = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Gran Turismo")
    }

    "remove GT from gran turismo title or similar" in {
      forAll(
        Map(
          "GTS Gran Turismo Sport"      -> "Gran Turismo Sport",
          "GT Sport Gran Turismo Sport" -> "Gran Turismo Sport",
          "Gran Turismo Sport GTS"      -> "Gran Turismo Sport",
          "Gran Turismo Sport GT Sport" -> "Gran Turismo Sport Sport",
          "Gears of War 5"              -> "Gears 5"
        )
      ) { (title, expected) =>
        val listingDetails = testListing.copy(title = title)
        val gameDetails    = GameDetailsMapper.from(listingDetails)
        gameDetails.name mustBe Some(expected)
      }
    }

    "leave new in the middle of title" in {
      val listingDetails = testListing.copy(title = "pal Wolfenstein: The NEW Colosus", properties = Map.empty)
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Wolfenstein NEW Colosus")
    }

    "remove new from the end and beginning of title" in {
      val listingDetails = testListing.copy(title = "NEW LEGO Marvel Avengers New", properties = Map.empty)
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("LEGO Marvel Avengers")
    }

    "keep word 'ultimate' if it is too far from 'edition'" in {
      val listingDetails = testListing.copy(title = "Marvel Ultimate Alliance 3: The Black Order - Standard Edition")
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Marvel Ultimate Alliance 3 Black Order")
    }

    "map bundles" in {
      val listingDetails = testListing.copy(title = "job lot 5 PS4 Games")
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("job lot 5")
      gameDetails.platform mustBe Some("PS4")
    }

    "keep collection if there is just 1 word" in {
      val listingDetails = testListing.copy(title = "Bioshock Collection PS4")
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Bioshock Collection")
    }

    "remove chars with code -1" in {
      val listingDetails = testListing.copy(title = "MINECRAFT XBOX 360 EDITION ")
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("MINECRAFT")
    }

    "map gta and rdr to full title" in {
      forAll(
        Map(
          "gta5"                      -> "Grand Theft Auto 5",
          "gta 5"                     -> "Grand Theft Auto 5",
          "Grand Theft Auto VI + map" -> "Grand Theft Auto VI",
          "grand theft auto gta"      -> "grand theft auto Grand Theft Auto",
          "rdr"                       -> "Red Dead Redemption",
          "sunset overdrive"          -> "sunset overdrive"
        )
      ) { (title, expected) =>
        val listingDetails = testListing.copy(title = title)
        val gameDetails    = GameDetailsMapper.from(listingDetails)
        gameDetails.name mustBe Some(expected)
      }
    }

    "remove year after number" in {
      forAll(
        Map(
          "FIFA 19 2019"                          -> "FIFA 19",
          "FIFA 2019"                             -> "FIFA 19",
          "FIFA19"                                -> "FIFA 19",
          "FIFA 2020"                             -> "FIFA 20",
          "WWE 2k17 2019"                         -> "WWE 2k17",
          "Call of Duty: Infinite Warfare 2 2019" -> "Call of Duty Infinite Warfare 2"
        )
      ) { (title, expected) =>
        val listingDetails = testListing.copy(title = title)
        val gameDetails    = GameDetailsMapper.from(listingDetails)
        gameDetails.name mustBe Some(expected)
      }
    }

    "separate words where appropriate" in {
      forAll(
        Map(
          "racedriver grid"                                            -> "race driver grid",
          "racedriver: grid"                                           -> "race driver grid",
          "NEW Playerunknowns battlegrounds pal PSVR Ultimate Evil Ed" -> "Player unknowns battlegrounds"
        )
      ) { (title, expected) =>
        val listingDetails = testListing.copy(title = title)
        val gameDetails    = GameDetailsMapper.from(listingDetails)
        gameDetails.name mustBe Some(expected)
      }
    }

    "remove wrestling after 2k17 title" in {
      val listingDetails = testListing.copy(title = "WWE 2k19 Wrestling")
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("WWE 2k19")
    }

    "should keep A if used in acronym" in {
      val listingDetails = testListing.copy(title = "L.A. Noire")
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("LA Noire")
    }

    "add missing space between number and ps" in {
      val listingDetails = testListing.copy(title = "Farcry 2PS4")
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Far cry 2")
      gameDetails.platform mustBe Some("PS4")
    }

    "remove noise words from title" in {
      forAll(
        List(
          "Call of Duty Infinite Warfare PS4 (L:100497)",
          "Call of Duty Infinite Warfare Playstation 3 PS3 Game + Free UK Delivery",
          "Call of Duty Infinite Warfare \\ £54.99",
          "5 PS3 Games Call of Duty Infinite Warfare VR PSVR",
          "Call of Duty Infinite Warfare XBOX ONE, SERIES X|S",
          "Call of Duty Infinite Warfare ps-4",
          "Call of Duty Infinite Warfare Xbox one series x",
          "(COD) Call of Duty Infinite Warfare including dlc",
          "Call of Duty Infinite Warfare ps4 free ps5 upgrade",
          "Call of Duty Infinite Warfare inc manual",
          "Call of Duty Infinite Warfare xone",
          "Call of Duty Infinite Warfare xbox one series x s",
          "Call of Duty Infinite Warfare xbox one x series x/s",
          "Call of Duty Infinite Warfare (XBOX ONE, SERIES X|S) VERY GOOD CONDITION",
          "Call of Duty Infinite Warfare game for kids",
          "Call of Duty Infinite Warfare also works on ps4",
          "Call of Duty Infinite Warfare also plays on ps4",
          "Call of Duty Infinite Warfare *brand new sealed*",
          "Call of Duty Infinite Warfare pre-owned multi-player xbox 360",
          "Call of Duty Infinite Warfare multi - player xbox 360",
          "Call of Duty-Infinite Warfare by rockstar games",
          "Call of Duty-Infinite Warfare 2017 version",
          "Call of Duty-Infinite Warfare from rockstar games",
          "Call of Duty-Infinite Warfare 20th Year Celebration",
          "Call of Duty-Infinite Warfare from EA sports",
          "Call of Duty-Infinite Warfare Activision presents",
          "Call of Duty-Infinite Warfare xbox 360 blah blah blah",
          "Call of Duty - Infinite Warfare playstation 4 blah blah blah",
          "Call of Duty - Infinite Warfare - Sony PS4 blah blah blah",
          "PS4 2019 Call of Duty: Infinite Warfare In Working Order",
          "Playstation 4 - PS4 - Call of Duty: Infinite Warfare In Working Order",
          "Playstation 4 PS4 game Call of Duty: Infinite Warfare superultimate edition",
          "Call of Duty: Infinite Warfare 20th anniversary FUVG ID7274z",
          "Call of Duty: Infinite Warfare classic edition foo",
          "Call of Duty: Infinite Warfare 2017",
          "Call of Duty: Infinite Warfare PAL R2",
          "Call of Duty: Infinite Warfare X BOX ONE REF",
          "Call of Duty: Infinite Warfare - factory sealed",
          "Call of Duty: Infinite Warfare only on playstation",
          "Call of Duty: Infinite Warfare PS4 Game UK PAL VR Compatible PREOWNED",
          "3307216096665BC Call of Duty: Infinite Warfare BRAND NEW SEALED",
          "3307216096665BC Call of Duty: Infinite Warfare new and sealed",
          "Call of Duty: Infinite Warfare classics edition foo",
          "*Brand New and Sealed* Call of Duty: Infinite Warfare",
          "New & Sealed Nintendo Switch Game Call of Duty: Infinite Warfare",
          "New & Sealed Call of Duty: Infinite Warfare PAL #1099",
          "Mint Condition - Sony Playstation PS4 Call of Duty: Infinite Warfare EA Pegi 16 Xmas Gift",
          "Call of Duty: Infinite Warfare 20th anniversary edition",
          "Playstation 4 (PS4) Limited Run #62 - Call of Duty: Infinite Warfare fast and free delivery",
          "Limited Run #197: Call of Duty: Infinite Warfare Brigadier Edition (PS4 LRG)",
          "Sealed Call of Duty: Infinite Warfare - game of the year goty free and fast 1st class post",
          "Call of Duty: Infinite Warfare - game of the year goty quick 1st class signed post for playstation vr",
          "Call of Duty: Infinite Warfare - good for sony playstati",
          "Call of Duty: Infinite Warfare Anniversary CE",
          "Call of Duty: Infinite Warfare for ages 18 and over",
          "Call of Duty: Infinite Warfare HD collection cased",
          "Call of Duty: Infinite Warfare R2 PAL UK",
          "Call of Duty: Infinite Warfare x box one",
          "Call of Duty: Infinite Warfare REF A23",
          "Call of Duty: Infinite Warfare case + cart",
          "Call of Duty: Infinite Warfare game and box",
          "Call of Duty: Infinite Warfare case and cartridge",
          "Call of Duty: Infinite Warfare xbox one x xbox series x",
          "Call of Duty: Infinite Warfare map included",
          "Call of Duty: Infinite Warfare xbox 360 classics 2017",
          "Call of Duty: Infinite Warfare only on Playstation 4",
          "Call of Duty: Infinite Warfare - game of the year edition goty",
          "Call of Duty: Infinite Warfare - video game for the playstation vr PLAYSTATION 4 2015",
          "Call of Duty: Infinite Warfare - video game for the PLAYSTATION 4",
          "Call of Duty: Infinite Warfare - new fast post vr required (foo-bar)",
          "Call of Duty: Infinite Warfare - new Fast free post for PS4 game 2020",
          "Call of Duty: Infinite Warfare includes mega awesome pack with goodies",
          "Call of Duty: Infinite Warfare - vr compatible psvr required",
          "Call of Duty: Infinite Warfare includes 5 bonus levels",
          "Call of Duty: Infinite Warfare includes battlemode",
          "Call of Duty: Infinite Warfare with terminator bonus content",
          "Call of Duty: Infinite Warfare - super fast and superfree UK post",
          "Call of Duty: Infinite Warfare - Fast and Free shipping complete with manual and book",
          "Call of Duty: Infinite Warfare - day one edition - day 0 ed - day 1 E - day 1",
          "Call of Duty: Infinite Warfare HD - double pack - premium online edition - XBOX 1 GAME",
          "Call of Duty: Infinite Warfare - premium edt -- Legacy pro ed - elite edition with some bonuses",
          "Call of Duty: Infinite Warfare - brand new and factory sealed",
          "Call of Duty: Infinite Warfare (Day One Edition) [Ge VideoGames Amazing Value]",
          "Call of Duty: Infinite Warfare - complete free 1st class uk postage",
          "Call of Duty: Infinite Warfare the official authentic videogame - new unopened",
          "Call of Duty: Infinite Warfare for microsoft xbox one",
          "Call of Duty: Infinite Warfare for ms xbox one",
          "Call of Duty: Infinite Warfare comes with both manuals",
          "Call of Duty: Infinite Warfare with both manuals",
          "Call of Duty: Infinite Warfare VideoGames",
          "Call of Duty: Infinite Warfare boxed for PS4",
          "official & genuine Call of Duty: Infinite Warfare VideoGames",
          "genuine brand new sealed Call of Duty: Infinite Warfare The game",
          "brand new Call of Duty: Infinite Warfare For ages 18+",
          "Call of Duty            Infinite            Warfare            ",
          "BEST PS4 GAME Call of Duty: Infinite Warfare EU-Import factory sealed next day dispatch free",
          "300076206 Limited run 170 Call of Duty: Infinite Warfare new boxed and complete game",
          "Playstation 4/PAL-Call of Duty: Infinite Warfare NEW",
          "Marvel's Call of Duty: Infinite Warfare • new and factory Sealed •",
          "(Xbox One) Tom Clancy's Call of Duty: Infinite Warfare deluxe edition - VR vr NEW",
          "\uD83D\uDC96 Call of Duty: Infinite Warfareused * | Limited Edition - Remastered: & Game new (Xbox One) "
        )
      ) { title =>
        val details = GameDetailsMapper.from(testListing.copy(title = title, properties = Map.empty))
        details.name mustBe Some("Call of Duty Infinite Warfare")
      }
    }

    "do special replacements" in {
      forAll(
        Map(
          "FIFA 18 (XBOX ONE, SERIES X|S) VERY GOOD CONDITION" -> "FIFA 18",
          "resident evil VII"                                  -> "Resident Evil 7",
          "resident evil VIII"                                 -> "Resident Evil Village",
          "resident evil 8"                                    -> "Resident Evil Village",
          "resident evil village 8"                            -> "resident evil village",
          "XBOX ONE GAME F1 2018 HEADLINE EDITION"             -> "F1 2018",
          "FIFA 21 NEXT LEVEL"                                 -> "FIFA 21",
          "FIFA 21 Xbox one 2021"                              -> "FIFA 21",
          "Resident Evil 7 Biohazard"                          -> "Resident Evil 7",
          "pga tour 2k21 golf fun"                             -> "pga tour 2k21",
          "Super Meat Boy"                                     -> "Super MeatBoy",
          "Horizon Zero Dawn Forbidden West"                   -> "Horizon Forbidden West",
          "GTA 5 Xbox Series X / Xbox One"                     -> "Grand Theft Auto 5",
          "Switch-LEGO HARRY POTTER YEARS 1-7 GAME NEW"        -> "LEGO HARRY POTTER",
          "F1 manager 22"                                      -> "F1 manager 2022",
          "FIFA 22 soccer"                                     -> "FIFA 22",
          "L.A. Noire"                                         -> "LA Noire"
        )
      ) { (title, expected) =>
        val details = GameDetailsMapper.from(testListing.copy(title = title, properties = Map.empty))
        details.name mustBe Some(expected)
      }
    }

    "remove roman numbers followed by digit or vice versa" in {
      forAll(
        Map(
          "Call of Duty Black Ops iii 3" -> "Call of Duty Black Ops iii",
          "Call of Duty Black Ops iv 4"  -> "Call of Duty Black Ops iv",
          "Call of Duty Black Ops ii 2"  -> "Call of Duty Black Ops ii",
          "Call of Duty Black Ops 2 ii"  -> "Call of Duty Black Ops 2",
          "witcher 3 iii"                -> "witcher 3"
        )
      ) { (title, expected) =>
        val details = GameDetailsMapper.from(testListing.copy(title = title, properties = Map.empty))
        details.name mustBe Some(expected)
      }
    }

    "correctly parse PS platform" in {
      val listingDetails = testListing.copy(title = "Call Of Duty Black Ops 3 (PS4)")
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Call Of Duty Black Ops 3")
      gameDetails.platform mustBe Some("PS4")
    }

    "quick test" in {
      val listingDetails = testListing.copy(title = "Ps4 Medievil (PS4) - Including DLC Game NEW")
      val gameDetails    = GameDetailsMapper.from(listingDetails)

      gameDetails.name mustBe Some("Medievil")
    }
  }
}
