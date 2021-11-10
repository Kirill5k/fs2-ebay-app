package ebayapp.core.clients.ebay

import cats.effect.IO
import cats.syntax.applicative._
import cats.syntax.option._
import ebayapp.core.CatsSpec
import ebayapp.core.clients.SearchCriteria
import ebayapp.core.clients.ebay.auth.EbayAuthClient
import ebayapp.core.clients.ebay.browse.EbayBrowseClient
import ebayapp.core.clients.ebay.browse.responses._
import ebayapp.core.common.config.{EbayConfig, EbayCredentials, EbaySearchConfig}
import ebayapp.core.common.errors.AppError
import ebayapp.core.domain.{ItemDetails, ItemKind}
import org.mockito.ArgumentCaptor
import org.mockito.Mockito.{never, times, verifyNoInteractions}

import java.util.UUID
import scala.concurrent.duration._
import scala.jdk.CollectionConverters._

class EbayClientSpec extends CatsSpec {

  val accessToken = "access-token"
  val criteria    = SearchCriteria("xbox", itemKind = Some(ItemKind.VideoGame), category = Some("games-xbox"))

  val credentials = List(EbayCredentials("id-1", "secret-1"), EbayCredentials("id-2", "secret-2"))
  val config      = EbayConfig("http://ebay.com", credentials, EbaySearchConfig(5, 92, 20.minutes))

  "An EbayClient" should {

    "return error when invalid category specified" in {
      val (authClient, browseClient)                              = mocks
      val videoGameSearchClient                                   = new LiveEbayClient[IO](config, authClient, browseClient)

      val itemsResponse = videoGameSearchClient.search(criteria.copy(category = None))

      itemsResponse.attempt.compile.last.unsafeToFuture().map { res =>
        verifyNoInteractions(authClient, browseClient)
        res mustBe Some(Left(AppError.Critical("category kind is required in ebay-client")))
      }
    }

    "search for video games" in {
      val searchParamsCaptor: ArgumentCaptor[Map[String, String]] = ArgumentCaptor.forClass(classOf[Map[String, String]])
      val (authClient, browseClient)                              = mocks
      val videoGameSearchClient                                   = new LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], searchParamsCaptor.capture())).thenReturn(IO.pure(List()))

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(authClient).accessToken
        verify(browseClient).search(eqTo(accessToken), searchParamsCaptor.capture())
        searchParamsCaptor.getAllValues.asScala must have size 2
        searchParamsCaptor.getValue()("q") mustBe "xbox"
        searchParamsCaptor.getValue()("fieldgroups") mustBe "EXTENDED"
        searchParamsCaptor.getValue()("limit") mustBe "200"
        searchParamsCaptor.getValue()("category_ids") mustBe "139973"
        searchParamsCaptor.getValue()("filter") must startWith(
          "conditionIds:%7B1000|1500|2000|2500|3000|4000|5000%7D,itemLocationCountry:GB,deliveryCountry:GB,price:[0..90],priceCurrency:GBP,itemLocationCountry:GB,buyingOptions:%7BFIXED_PRICE%7D,itemStartDate:["
        )
        items mustBe Nil
      }
    }

    "switch ebay account on autherror" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = new LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(authClient.switchAccount()).thenReturn(IO.unit)
      when(browseClient.search(any[String], any[Map[String, String]])).thenReturn(IO.raiseError(AppError.Auth("Too many requests")))

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.unsafeToFuture().map { error =>
        verify(authClient).accessToken
        verify(authClient).switchAccount()
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient, never).getItem(any[String], any[String])
        error mustBe Nil
      }
    }

    "return empty on http error" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = new LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]]))
        .thenReturn(IO.raiseError(AppError.Http(400, "Bad request")))

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.unsafeToFuture().map { error =>
        verify(authClient).accessToken
        verify(authClient, never).switchAccount()
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient, never).getItem(any[String], any[String])
        error mustBe Nil
      }
    }

    "filter out items with bad feedback" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = new LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]]))
        .thenReturn(List(ebayItemSummary("1", feedbackPercentage = 90), ebayItemSummary("1", feedbackScore = 4)).pure[IO])

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(authClient).accessToken
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient, never).getItem(any[String], any[String])
        items mustBe Nil
      }
    }

    "filter out items are part of a group" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = new LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]]))
        .thenReturn(List(ebayItemSummary("1", itemGroup = Some("USER_DEFINED"))).pure[IO])

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(authClient).accessToken
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient, never).getItem(any[String], any[String])
        items mustBe Nil
      }
    }

    "filter out items with bad names" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = new LiveEbayClient[IO](config, authClient, browseClient)

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

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]])).thenReturn(response)

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        items mustBe Nil
      }
    }

    "filter out items that are not buy it now" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = new LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]]))
        .thenReturn(List(ebayItemSummary(buyingOptions = List("AUCTION"))).pure[IO])

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        items mustBe Nil
      }
    }

    "filter out items with bad description" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = new LiveEbayClient[IO](config, authClient, browseClient)

      val response = List(
        ebayItemSummary(shortDescription = Some("this is a shared account")),
        ebayItemSummary(shortDescription = Some("shared xbox account. playable worldwide"))
      ).pure[IO]

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]])).thenReturn(response)

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        items mustBe Nil
      }
    }

    "get item details for each item id" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = new LiveEbayClient[IO](config, authClient, browseClient)

      when(authClient.accessToken).thenReturn(IO.pure(accessToken))
      when(browseClient.search(any[String], any[Map[String, String]])).thenReturn(IO.pure(ebayItemSummaries("item-1")))
      when(browseClient.getItem(accessToken, "item-1")).thenReturn(IO.pure(Some(ebayItem.copy(itemId = "item-1"))))

      val itemsResponse = videoGameSearchClient.search(criteria)

      itemsResponse.compile.toList.unsafeToFuture().map { items =>
        verify(authClient, times(2)).accessToken
        verify(browseClient).search(eqTo(accessToken), any[Map[String, String]])
        verify(browseClient).getItem(eqTo(accessToken), any[String])
        items.map(_.itemDetails) mustBe (List(
          ItemDetails.VideoGame(Some("call of duty modern warfare"), Some("XBOX ONE"), Some("2019"), Some("Action"))
        ))
      }
    }

    "return error when there is not item-kind passes" in {
      val (authClient, browseClient) = mocks
      val videoGameSearchClient      = new LiveEbayClient[IO](config, authClient, browseClient)

      val itemsResponse = videoGameSearchClient.search(criteria.copy(itemKind = None))

      itemsResponse.compile.drain.attempt.unsafeToFuture().map { err =>
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
