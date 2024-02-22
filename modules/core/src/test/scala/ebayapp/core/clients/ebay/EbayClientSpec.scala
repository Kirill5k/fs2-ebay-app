package ebayapp.core.clients.ebay

import cats.effect.IO
import cats.syntax.applicative.*
import cats.syntax.option.*
import ebayapp.core.{MockConfigProvider, MockLogger}
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.clients.ebay.auth.EbayAuthClient
import ebayapp.core.clients.ebay.browse.EbayBrowseClient
import ebayapp.core.clients.ebay.browse.responses.*
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{EbayConfig, EbaySearchConfig, OAuthCredentials}
import ebayapp.kernel.errors.AppError
import ebayapp.core.domain.{ItemDetails, ItemKind}
import ebayapp.kernel.{Clock, MockClock}
import ebayapp.kernel.IOWordSpec
import org.mockito.ArgumentCaptor
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mockito.{never, times}

import java.util.UUID
import scala.concurrent.duration.*
import scala.jdk.CollectionConverters.*
import java.time.Instant

class EbayClientSpec extends IOWordSpec {

  given logger: Logger[IO] = MockLogger.make[IO]

  val now         = Instant.parse("2020-01-01T00:00:00Z")
  given Clock[IO] = MockClock[IO](now)

  val accessToken = "access-token"
  val criteria    = SearchCriteria("xbox", itemKind = Some(ItemKind.VideoGame), category = Some("games-xbox"))

  val credentials = List(OAuthCredentials("id-1", "secret-1"), OAuthCredentials("id-2", "secret-2"))
  val ebayConfig  = EbayConfig("http://ebay.com", credentials, EbaySearchConfig(5, 92, 20.minutes))
  val config      = MockConfigProvider.make[IO](ebayConfig = Some(ebayConfig))

  "An EbayClient" should {

    "return error when invalid category specified" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      val itemsResponse = videoGameSearchClient.search(criteria.copy(category = None))

      itemsResponse.attempt.compile.last.asserting { res =>
        verifyNoInteractions(authClient, browseClient)
        res mustBe Some(Left(AppError.Critical("category kind is required in ebay-client")))
      }
    }

    "search for video games" in {
      val searchParamsCaptor: ArgumentCaptor[Map[String, String]] = ArgumentCaptor.forClass(classOf[Map[String, String]])
      val (authClient, browseClient)                              = mocks
      val videoGameSearchClient                                   = LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], searchParamsCaptor.capture())).thenReturn(IO.pure(List()))

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.asserting { items =>
        verify(authClient).accessToken
        verify(browseClient).search(eqTo(accessToken), searchParamsCaptor.capture())
        items mustBe Nil
        searchParamsCaptor.getAllValues.asScala must have size 2
        searchParamsCaptor.getValue mustBe Map(
          "q"            -> "xbox",
          "fieldgroups"  -> "EXTENDED",
          "limit"        -> "200",
          "category_ids" -> "139973",
          "filter" -> "conditionIds:{1000|1500|2000|2500|3000|4000|5000},itemLocationCountry:GB,deliveryCountry:GB,price:[0..90],priceCurrency:GBP,itemLocationCountry:GB,buyingOptions:{FIXED_PRICE},itemStartDate:[2019-12-31T23:40:00Z]"
        )
      }
    }

    "switch ebay account on autherror" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(authClient.switchAccount()).thenReturnUnit
      when(browseClient.search(any[String], any[Map[String, String]])).thenReturn(IO.raiseError(AppError.Auth("Too many requests")))

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.asserting { error =>
        verify(authClient).accessToken
        verify(authClient).switchAccount()
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient, never).getItem(any[String], any[String])
        error mustBe Nil
      }
    }

    "return empty on http error" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]]))
        .thenReturn(IO.raiseError(AppError.Http(400, "Bad request")))

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.asserting { error =>
        verify(authClient).accessToken
        verify(authClient, never).switchAccount()
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient, never).getItem(any[String], any[String])
        error mustBe Nil
      }
    }

    "filter out items with bad feedback" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]]))
        .thenReturn(List(ebayItemSummary("1", feedbackPercentage = 90), ebayItemSummary("1", feedbackScore = 4)).pure[IO])

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.asserting { items =>
        verify(authClient).accessToken
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient, never).getItem(any[String], any[String])
        items mustBe Nil
      }
    }

    "filter out items are part of a group" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]]))
        .thenReturn(List(ebayItemSummary("1", itemGroup = Some("USER_DEFINED"))).pure[IO])

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.asserting { items =>
        verify(authClient).accessToken
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient, never).getItem(any[String], any[String])
        items mustBe Nil
      }
    }

    "filter out items with bad names" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      val badItems = List(
        "Super Marios Bros (DS)",
        "Fallout 3 (XBOX)",
        "Fallout 3 PC CD",
        "video game #5",
        "TRIGGER TREADZ 4 PACK - New Playstation 5 - V1398A",
        "super mario bros 3 xbox / 360",
        "game 5 for PS4",
        "Spider-Man 2 (ps5) - Campaign Completion",
        "Game & Watch: The Legend of Zelda - Brand New and Sealed in box",
        "Max Payne (Xbox Classics)",
        "5 PLAYSTATION 3 GAMES (LOT 3)",
        "super mario bros 3ds",
        "destiny - the collection",
        "overwatch - game of the Year Edition",
        "overwatch game of the Year Edition",
        "Starlink Weapons Pack x 2  PS4 XBox Switch - Hailstorm & Iron Fist",
        "switch amazing aluminium case",
        "fallout 4 PlayStation 2/PS2",
        "fallout 4 preorder",
        "COD MW2 GHILLIE Skin 4x Jack Links Codes [COMPLETE SET] + 2 Hours 2XP",
        "fallout 4 disc only",
        "pokemon scarlet/violet",
        "destiny taken king full game",
        "fallout 76 blah damage blah blah blah",
        "call of duty digital code",
        "lego worlds read description",
        """Borderlands 3 "Spooling Recursion" X2 Godroll Moze Splash Damage (Xbox One)""",
        """Borderlands 3 - (ps4) (new maliwan takedown pistol) Moonfire (Anointed) x3 (op)""",
        """Borderlands 3 - (ps4) S3RV 80's Execute (anointed 50% cyro ase )(new takedown)""",
        """Borderlands 3 -(ps4) Redistributor(anointed 100% dam ase x 6 pack)(new takedown)""",
        """Borderlands 3 “Teething St4kbot” SMGdmg/+5GRENADE/JWD (Xbox One)""",
        """Borderlands 3 “Teething St4kbot” SMGdmg/+5GRENADE/JWD (Xbox One)""",
        """call of duty pre-order bonus""",
        """Call of Duty WW2 no case XBOX 360""",
        """Call of Duty WW2 digital code XBOX""",
        """Call of Duty WW2 with carry bag XBOX""",
        """xbox game pass XBOX""",
        """xbox gamepass XBOX""",
        """fifa 2020 million 100 point XBOX""",
        """animal crossing dinosaur recipe card""",
        """fallout 76 5000 caps""",
        """borderlands 4 promotional copy"""
      )

      val response = badItems.map(name => ebayItemSummary(name, name = name))

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]])).thenReturn(IO.pure(response))

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.asserting { res =>
        verify(browseClient, never()).getItem(anyString(), anyString())
        res mustBe Nil
      }
    }

    "filter out items that are not buy it now" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]]))
        .thenReturn(List(ebayItemSummary(buyingOptions = List("AUCTION"))).pure[IO])

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.asserting { items =>
        items mustBe Nil
      }
    }

    "filter out items with bad description" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      val response = List(
        ebayItemSummary(shortDescription = Some("this is a shared account")),
        ebayItemSummary(shortDescription = Some("shared xbox account. playable worldwide"))
      ).pure[IO]

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]])).thenReturn(response)

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.asserting { items =>
        items mustBe Nil
      }
    }

    "get item details for each item id" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]])).thenReturn(IO.pure(ebayItemSummaries("item-1")))
      when(browseClient.getItem(accessToken, "item-1")).thenReturn(IO.pure(Some(ebayItem.copy(itemId = "item-1"))))

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.asserting { items =>
        verify(authClient, times(2)).accessToken
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient).getItem(eqTo(accessToken), any[String])
        items.map(_.itemDetails) mustBe List(
          ItemDetails.VideoGame(Some("call of duty modern warfare"), Some("XBOX ONE"), Some("2019"), Some("Action"))
        )
      }
    }

    "return error when there is not item-kind passes" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = LiveEbayClient[IO](config, authClient, browseClient)

      val itemsResponse = videoGameSearchClient.search(criteria.copy(itemKind = None))

      itemsResponse.compile.drain.attempt.asserting { err =>
        err mustBe Left(AppError.Critical("item kind is required in ebay-client"))
      }
    }
  }

  def mocks: (EbayAuthClient[IO], EbayBrowseClient[IO]) = {
    val authClient   = mock[EbayAuthClient[IO]]
    val browseClient = mock[EbayBrowseClient[IO]]
    (authClient, browseClient)
  }

  def ebayItemSummaries(ids: String*): List[EbayItemSummary] =
    ids.map(ebayItemSummary(_)).toList

  def ebayItemSummary(
      id: String = UUID.randomUUID().toString,
      name: String = "ebay item",
      feedbackScore: Int = 150,
      feedbackPercentage: Int = 150,
      itemGroup: Option[String] = None,
      buyingOptions: List[String] = List("FIXED_PRICE"),
      shortDescription: Option[String] = None,
      categoryId: Int = 139973
  ): EbayItemSummary =
    EbayItemSummary(
      id,
      name,
      Some(ItemPrice(BigDecimal.valueOf(30.00), "GBP")),
      ItemSeller(Some("168.robinhood"), Some(feedbackPercentage.toDouble), Some(feedbackScore)),
      itemGroup,
      buyingOptions.toSet,
      shortDescription,
      Some(Set(categoryId.toString))
    )

  def ebayItem: EbayItem =
    EbayItem(
      "item-1",
      "call of duty modern warfare xbox one 2019",
      "call of duty modern warfare xbox one 2019. Condition is New. Game came as part of bundle and not wanted. Never playes. Dispatched with Royal Mail 1st Class Large Letter.".some,
      None,
      "Video Games & Consoles|Video Games",
      139973,
      ItemPrice(BigDecimal.valueOf(30.00), "GBP"),
      "New",
      Some(ItemImage("https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg")),
      ItemSeller(Some("168.robinhood"), Some(100), Some(150)),
      List(
        ItemProperty("Game Name", "Call of Duty: Modern Warfare"),
        ItemProperty("Release Year", "2019"),
        ItemProperty("Platform", "Microsoft Xbox One"),
        ItemProperty("Genre", "Action")
      ).some,
      Set("FIXED_PRICE"),
      "https://www.ebay.co.uk/itm/call-of-duty-modern-warfare-xbox-one-2019-/333474293066",
      None,
      None,
      None,
      None,
      Some(List(ItemShippingOption("Royal Mail 1st class", ShippingCost(BigDecimal.valueOf(4.99), "GBR")))),
      Some(List(ItemAvailabilities(Some(10), None)))
    )
}
