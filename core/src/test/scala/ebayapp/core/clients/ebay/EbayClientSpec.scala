package ebayapp.core.clients.ebay

import cats.effect.IO
import cats.implicits._
import ebayapp.core.CatsSpec
import ebayapp.core.clients.ebay.auth.EbayAuthClient
import ebayapp.core.clients.ebay.browse.EbayBrowseClient
import ebayapp.core.clients.ebay.browse.responses._
import ebayapp.core.clients.ebay.mappers.EbayItemMapper._
import ebayapp.core.common.Cache
import ebayapp.core.common.config.{EbayConfig, EbayCredentials, EbayDealsConfig, EbayDealsConfigs, EbaySearchConfig, SearchQuery}
import ebayapp.core.common.errors.AppError
import ebayapp.core.domain.ItemDetails
import ebayapp.core.domain.ItemDetails.Game
import org.mockito.captor.ArgCaptor

import java.util.UUID
import scala.concurrent.duration._

class EbayClientSpec extends CatsSpec {

  val accessToken = "access-token"
  val searchQuery = SearchQuery("xbox")

  val deals       = EbayDealsConfigs(EbayDealsConfig(60.seconds, Nil, 20.minutes, 34, 10))
  val credentials = List(EbayCredentials("id-1", "secret-1"), EbayCredentials("id-2", "secret-2"))
  val config      = EbayConfig("http://ebay.com", credentials, EbaySearchConfig(5, 92), deals)

  "An EbayClient" should {

    "search for video games" in {
      val searchParamsCaptor                = ArgCaptor[Map[String, String]]
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      when(browseClient.search(any[String], anyMap[String, String])).thenReturn(IO.pure(List()))

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(authClient).accessToken
        verify(browseClient).search(eqTo(accessToken), searchParamsCaptor)
        searchParamsCaptor.value must have size 5
        searchParamsCaptor.values.map(_("q")) mustBe(List("xbox"))
        searchParamsCaptor.value("fieldgroups") mustBe("EXTENDED")
        searchParamsCaptor.value("limit") mustBe("200")
        searchParamsCaptor.value("category_ids") mustBe("139973")
        searchParamsCaptor.value("filter") must startWith(
          "conditionIds:%7B1000|1500|2000|2500|3000|4000|5000%7D,itemLocationCountry:GB,deliveryCountry:GB,price:[0..90],priceCurrency:GBP,itemLocationCountry:GB,buyingOptions:%7BFIXED_PRICE%7D,itemStartDate:["
        )
        items mustBe Nil
      }
    }

    "switch ebay account on autherror" in {
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(authClient.switchAccount()).thenReturn(IO.unit)
      when(browseClient.search(any[String], anyMap[String, String])).thenReturn(IO.raiseError(AppError.Auth("Too many requests")))

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { error =>
        verify(cache, never).put(any[String], any[Unit])
        verify(authClient).accessToken
        verify(authClient).switchAccount()
        verify(browseClient).search(eqTo(accessToken), anyMap[String, String])
        verify(browseClient, never).getItem(any[String], any[String])
        error mustBe Nil
      }
    }

    "return empty on http error" in {
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      when(browseClient.search(any[String], anyMap[String, String]))
        .thenReturn(IO.raiseError(AppError.Http(400, "Bad request")))

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { error =>
        verify(cache, never).put(any[String], any[Unit])
        verify(authClient).accessToken
        verify(authClient, never).switchAccount()
        verify(browseClient).search(eqTo(accessToken), anyMap[String, String])
        verify(browseClient, never).getItem(any[String], any[String])
        error mustBe Nil
      }
    }

    "filter out items that are not new" in {
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      when(cache.contains(any[String])).thenReturn(IO.pure(true))
      when(browseClient.search(any[String], anyMap[String, String])).thenReturn(ebayItemSummaries("item-1").pure[IO])

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(cache).contains("item-1")
        verify(cache, never).put(any[String], any[Unit])
        verify(browseClient).search(eqTo(accessToken), anyMap[String, String])
        verify(browseClient, never).getItem(any[String], any[String])
        items mustBe Nil
      }
    }

    "filter out items with bad feedback" in {
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      when(browseClient.search(any[String], anyMap[String, String]))
        .thenReturn(List(ebayItemSummary("1", feedbackPercentage = 90), ebayItemSummary("1", feedbackScore = 4)).pure[IO])

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(cache, never).put(any[String], any[Unit])
        verify(authClient).accessToken
        verify(browseClient).search(eqTo(accessToken), anyMap[String, String])
        verify(browseClient, never).getItem(any[String], any[String])
        items mustBe Nil
      }
    }

    "filter out items are part of a group" in {
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      when(browseClient.search(any[String], anyMap[String, String]))
        .thenReturn(List(ebayItemSummary("1", itemGroup = Some("USER_DEFINED"))).pure[IO])

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(cache, never).put(any[String], any[Unit])
        verify(authClient).accessToken
        verify(browseClient).search(eqTo(accessToken), anyMap[String, String])
        verify(browseClient, never).getItem(any[String], any[String])
        items mustBe Nil
      }
    }

    "filter out items with bad names" in {
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      val response = List(
        ebayItemSummary("1", name = "fallout 4 disc only"),
        ebayItemSummary("2", name = "fallout 76 blah damage blah blah blah"),
        ebayItemSummary("3", name = "call of duty digital code"),
        ebayItemSummary("4", name = "lego worlds read description"),
        ebayItemSummary("5", name = """Borderlands 3 "Spooling Recursion" X2 Godroll Moze Splash Damage (Xbox One)"""),
        ebayItemSummary("6", name = """Borderlands 3 - (ps4) (new maliwan takedown pistol) Moonfire (Anointed) x3 (op)"""),
        ebayItemSummary("7", name = """Borderlands 3 - (ps4) S3RV 80's Execute (anointed 50% cyro ase )(new takedown)"""),
        ebayItemSummary("8", name = """Borderlands 3 -(ps4) Redistributor(anointed 100% dam ase x 6 pack)(new takedown)"""),
        ebayItemSummary("9", name = """Borderlands 3 “Teething St4kbot” SMGdmg/+5GRENADE/JWD (Xbox One)"""),
        ebayItemSummary("10", name = """Borderlands 3 “Teething St4kbot” SMGdmg/+5GRENADE/JWD (Xbox One)"""),
        ebayItemSummary("11", name = """call of duty pre-order bonus"""),
        ebayItemSummary("13", name = """Call of Duty WW2 no case XBOX 360"""),
        ebayItemSummary("14", name = """Call of Duty WW2 digital code XBOX"""),
        ebayItemSummary("15", name = """Call of Duty WW2 with carry bag XBOX"""),
        ebayItemSummary("16", name = """xbox game pass XBOX"""),
        ebayItemSummary("17", name = """xbox gamepass XBOX"""),
        ebayItemSummary("18", name = """fifa 2020 million 100 point XBOX"""),
        ebayItemSummary("19", name = """animal crossing dinosaur recipe card"""),
        ebayItemSummary("20", name = """fallout 76 5000 caps"""),
        ebayItemSummary("21", name = """borderlands 4 promotional copy""")
      ).pure[IO]

      doReturn(response).when(browseClient).search(any[String], anyMap[String, String])

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(cache, never).put(any[String], any[Unit])
        items mustBe Nil
      }
    }

    "filter out items that are not buy it now" in {
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      doReturn(List(ebayItemSummary(buyingOptions = List("AUCTION"))).pure[IO])
        .when(browseClient)
        .search(any[String], anyMap[String, String])

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(cache, never).put(any[String], any[Unit])
        items mustBe Nil
      }
    }

    "filter out items with bad description" in {
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      val response = List(
        ebayItemSummary(shortDescription = Some("this is a shared account")),
        ebayItemSummary(shortDescription = Some("shared xbox account. playable worldwide"))
      ).pure[IO]

      doReturn(response)
        .when(browseClient)
        .search(any[String], anyMap[String, String])

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(cache, never).put(any[String], any[Unit])
        items mustBe Nil
      }
    }

    "get item details for each item id" in {
      val (authClient, browseClient, cache) = mocks
      val videoGameSearchClient             = new LiveEbayClient[IO](config, authClient, browseClient, cache)

      when(cache.contains(any[String])).thenReturn(IO.pure(false))
      when(cache.put(any[String], any[Unit])).thenReturn(IO.unit)
      when(browseClient.search(any[String], anyMap[String, String])).thenReturn(IO.pure(ebayItemSummaries("item-1")))
      when(browseClient.getItem(accessToken, "item-1")).thenReturn(IO.pure(Some(ebayItem.copy(itemId = "item-1"))))

      val itemsResponse = videoGameSearchClient.latest[ItemDetails.Game](searchQuery, 15.minutes)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(cache).put("item-1", ())
        verify(authClient, times(2)).accessToken
        verify(browseClient).search(eqTo(accessToken), anyMap[String, String])
        verify(browseClient).getItem(eqTo(accessToken), any[String])
        items.map(_.itemDetails) mustBe(List(Game(Some("call of duty modern warfare"), Some("XBOX ONE"), Some("2019"), Some("Action"))))
      }
    }
  }

  def mocks: (EbayAuthClient[IO], EbayBrowseClient[IO], Cache[IO, String, Unit]) = {
    val authClient   = mock[EbayAuthClient[IO]]
    val browseClient = mock[EbayBrowseClient[IO]]
    val cache        = mock[Cache[IO, String, Unit]]
    when(authClient.accessToken).thenReturn(IO.pure(accessToken))
    (authClient, browseClient, cache)
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
      shortDescription: Option[String] = None
  ): EbayItemSummary =
    EbayItemSummary(
      id,
      name,
      Some(ItemPrice(BigDecimal.valueOf(30.00), "GBP")),
      ItemSeller(Some("168.robinhood"), Some(feedbackPercentage.toDouble), Some(feedbackScore)),
      itemGroup,
      buyingOptions.toSet,
      shortDescription
    )

  def ebayItem: EbayItem =
    EbayItem(
      "item-1",
      "call of duty modern warfare xbox one 2019",
      Some(
        "call of duty modern warfare xbox one 2019. Condition is New. Game came as part of bundle and not wanted. Never playes. Dispatched with Royal Mail 1st Class Large Letter."
      ),
      None,
      "Video Games & Consoles|Video Games",
      139973,
      ItemPrice(BigDecimal.valueOf(30.00), "GBP"),
      "New",
      Some(ItemImage("https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg")),
      ItemSeller(Some("168.robinhood"), Some(100), Some(150)),
      Some(
        List(
          ItemProperty("Game Name", "Call of Duty: Modern Warfare"),
          ItemProperty("Release Year", "2019"),
          ItemProperty("Platform", "Microsoft Xbox One"),
          ItemProperty("Genre", "Action")
        )
      ),
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
