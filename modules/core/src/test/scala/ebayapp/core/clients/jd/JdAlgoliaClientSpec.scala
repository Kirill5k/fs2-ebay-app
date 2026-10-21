package ebayapp.core.clients.jd

import cats.effect.{IO, Ref}
import ebayapp.core.MockLogger.given
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.clients.CurlImpersonateClient
import ebayapp.core.clients.CurlImpersonateClient.RetrySpec
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria}
import io.circe.{Decoder, Json}
import io.circe.parser.{decode, parse}
import kirill5k.common.cats.test.IOWordSpec
import kirill5k.common.test.FileReader
import sttp.model.StatusCode

import java.net.{URI, URLDecoder}
import scala.concurrent.duration.*

class JdAlgoliaClientSpec extends IOWordSpec {

  private case class Request(method: String, url: String, headers: Map[String, String], body: String, retrySpec: RetrySpec) {
    def json: Json = parse(body).toOption.get
    def page: Int  = json.hcursor.get[Int]("page").toOption.get
  }

  private val config = GenericRetailerConfig(
    "https://algolia.example/",
    headers = Map("x-algolia-api-key" -> "configured-key", "x-algolia-application-id" -> "configured-app"),
    delayBetweenIndividualRequests = Some(Duration.Zero)
  )
  private val criteria = SearchCriteria("EA7 Emporio Armani", category = Some("men"))
  // Raw fields adapted from the user-provided Algolia response; highlighting is removed in the fixture, not at runtime.
  private val fixture = parse(FileReader.fromResources("jdsports/algolia-search.json")).toOption.get
  private val hits    = fixture.hcursor.get[List[Json]]("hits").toOption.get
  private val hit     = hits.head

  private def changed(fields: (String, Json)*): Json = hit.deepMerge(Json.obj(fields*))

  private def page(items: List[Json], number: Int = 0, total: Int = 1): String =
    Json.obj("hits" -> Json.arr(items*), "page" -> Json.fromInt(number), "nbPages" -> Json.fromInt(total)).noSpaces

  private def ok(body: String): Either[Throwable, (StatusCode, String)] = Right(StatusCode.Ok -> body)

  private def search(
      responses: Map[Int, Either[Throwable, (StatusCode, String)]],
      retailerConfig: GenericRetailerConfig = config,
      searchCriteria: SearchCriteria = criteria
  ): IO[(List[ResellableItem], List[Request])] =
    for
      requests <- Ref.of[IO, List[Request]](Nil)
      curl = new CurlImpersonateClient[IO] {
        override def get(url: String, headers: Map[String, String], retrySpec: RetrySpec): IO[(StatusCode, String)] =
          requests.update(_ :+ Request("GET", url, headers, "", retrySpec)) >>
            IO.raiseError(new IllegalStateException("Algolia searches must not make GET requests"))

        override def getAs[A: Decoder](url: String, headers: Map[String, String], retrySpec: RetrySpec): IO[(StatusCode, A)] =
          get(url, headers, retrySpec).flatMap((code, body) => IO.fromEither(decode[A](body)).map(code -> _))

        override def post(
            url: String,
            headers: Map[String, String],
            body: String,
            retrySpec: RetrySpec
        ): IO[(StatusCode, String)] = {
          val request = Request("POST", url, headers, body, retrySpec)
          requests.update(_ :+ request) >> IO.defer {
            IO.fromEither(responses.getOrElse(request.page, Left(new IllegalStateException(s"Unexpected page ${request.page}"))))
          }
        }
      }
      provider = MockRetailConfigProvider.make[IO](jdsportsConfig = Some(retailerConfig))
      client <- JdClient.jdsportsAlgolia[IO](provider, curl)
      items  <- client.search(searchCriteria).compile.toList
      calls  <- requests.get
    yield items -> calls

  "A JD Sports Algolia client" should {
    "send the unchanged query, configured credentials and raw attributes in a browser-style POST" in {
      val query       = "  EA7 Emporio Armani & \"sale\"  "
      val agent       = "Algolia for JavaScript (4.23.3); Browser"
      val queryConfig = config.copy(queryParameters = Some(Map("x-algolia-agent" -> agent)))

      search(Map(0 -> ok(page(Nil))), queryConfig, SearchCriteria(query)).asserting { (items, requests) =>
        items mustBe empty
        requests.map(_.method) mustBe List("POST")
        val request = requests.head
        val uri     = URI.create(request.url)
        uri.getScheme mustBe "https"
        uri.getHost mustBe "algolia.example"
        uri.getPath mustBe "/1/indexes/jd_prod_products_en/query"
        URLDecoder.decode(uri.getRawQuery, "UTF-8") mustBe s"x-algolia-agent=$agent"
        val headers = request.headers.map((key, value) => key.toLowerCase -> value)
        headers("x-algolia-api-key") mustBe "configured-key"
        headers("x-algolia-application-id") mustBe "configured-app"
        headers("content-type") mustBe "application/json"
        headers("accept") mustBe "application/json"
        headers("origin") mustBe "https://www.jdsports.co.uk"
        headers("referer") mustBe "https://www.jdsports.co.uk/"
        request.json.hcursor.get[String]("query") mustBe Right(query)
        request.json.hcursor.get[List[String]]("ruleContexts") mustBe Right(List("web"))
        request.json.hcursor.get[Int]("hitsPerPage") mustBe Right(256)
        request.page mustBe 0
        request.json.hcursor.get[List[String]]("attributesToRetrieve").map(_.toSet) mustBe Right(
          Set("objectID", "name", "brand", "colour", "size", "categoryPageId", "price", "wasPrice", "image", "slug", "inStock")
        )
        request.json.hcursor.get[List[String]]("attributesToHighlight") mustBe Right(Nil)
        request.json.hcursor.downField("sortBy").focus mustBe None
        request.retrySpec.maxRetries mustBe 3
        request.retrySpec.maxDelay mustBe 1.minute
        request.retrySpec.retryOnConnectionError mustBe true
        request.retrySpec.retryOnServerError mustBe true
        request.retrySpec.retryOnClientError mustBe true
        request.retrySpec.retryExcludedCodes must contain allOf (StatusCode.BadRequest, StatusCode.Unauthorized, StatusCode.NotFound)
        request.retrySpec.retryExcludedCodes must not contain StatusCode.TooManyRequests
      }
    }

    "allow configured headers to override browser defaults without case-sensitive duplicates" in {
      val overrides = Map("content-type" -> "application/json; charset=utf-8", "ORIGIN" -> "https://custom.example", "referer" -> "custom")
      val custom    = config.copy(headers = config.headers ++ overrides)

      search(Map(0 -> ok(page(Nil))), custom).asserting { (_, requests) =>
        val normalized = requests.head.headers.toList.map((key, value) => key.toLowerCase -> value)
        normalized.count(_._1 == "content-type") mustBe 1
        normalized.count(_._1 == "origin") mustBe 1
        normalized.count(_._1 == "referer") mustBe 1
        normalized.toMap.apply("content-type") mustBe "application/json; charset=utf-8"
        normalized.toMap.apply("origin") mustBe "https://custom.example"
        normalized.toMap.apply("referer") mustBe "custom"
      }
    }

    "map discounted in-stock products and their sizes without further stock requests" in
      search(Map(0 -> ok(fixture.noSpaces))).asserting { (items, requests) =>
        items.map(_.itemDetails) mustBe List(
          Clothing("Badge Vertical T-Shirt (Black, 19745105)", "EA7 Emporio Armani", "M"),
          Clothing("Ventus Full Zip Hoodie (Grey, 19739630)", "EA7 Emporio Armani", "XS"),
          Clothing("Ventus Full Zip Hoodie (Grey, 19739630)", "EA7 Emporio Armani", "S"),
          Clothing("Ventus Full Zip Hoodie (Grey, 19739630)", "EA7 Emporio Armani", "M"),
          Clothing("Ventus Full Zip Hoodie (Grey, 19739630)", "EA7 Emporio Armani", "L"),
          Clothing("Ventus Full Zip Hoodie (Grey, 19739630)", "EA7 Emporio Armani", "XL"),
          Clothing("Ventus Full Zip Hoodie (Grey, 19739630)", "EA7 Emporio Armani", "2XL")
        )
        items.head.buyPrice mustBe BuyPrice(1, BigDecimal(25), Some(55))
        items.tail.map(_.buyPrice).distinct mustBe List(BuyPrice(1, BigDecimal(100), Some(20)))
        items.head.listingDetails.url mustBe "https://www.jdsports.co.uk/product/black-ea7-emporio-armani-badge-vertical-t-shirt/19745105/"
        items.head.listingDetails.image mustBe Some("https://i8.amplience.net/i/jpl/jd_782944_plc")
        items.map(_.listingDetails.category).distinct mustBe List(Some("men"))
        items.map(_.listingDetails.seller).distinct mustBe List("Jdsports")
        items.map(_.foundWith).distinct mustBe List(criteria)
        requests.map(_.method) mustBe List("POST")
      }

    "match root categories case-insensitively and exclude similarly named nested categories" in {
      val nestedOnly = changed("categoryPageId" -> Json.arr(Json.fromString("Women"), Json.fromString("Men > Mens Clothing")))
      search(Map(0 -> ok(page(List(hit, nestedOnly)))), searchCriteria = criteria.copy(category = Some("mEn"))).asserting { (items, _) =>
        items must have size 1
        items.head.listingDetails.category mustBe Some("men")
      }
    }

    "retain women and kids products when no category is requested" in
      search(Map(0 -> ok(fixture.noSpaces)), searchCriteria = criteria.copy(category = None)).asserting { (items, _) =>
        items must have size 13
        items.flatMap(_.listingDetails.category).distinct mustBe List("men", "women", "kids")
      }

    "exclude unavailable and non-discounted products and hits without a usable first brand or sizes" in {
      val excluded = List(
        changed("inStock"  -> Json.False),
        changed("wasPrice" -> Json.fromInt(25)),
        changed("wasPrice" -> Json.fromInt(20)),
        hit.mapObject(_.remove("wasPrice")),
        changed("wasPrice" -> Json.Null),
        changed("brand"    -> Json.arr()),
        hit.mapObject(_.remove("brand")),
        changed("brand" -> Json.Null),
        changed("brand" -> Json.arr(Json.fromString("  "), Json.fromString("EA7 Emporio Armani"))),
        changed("size"  -> Json.arr()),
        hit.mapObject(_.remove("size")),
        changed("size" -> Json.Null),
        changed("size" -> Json.arr(Json.fromString(" ")))
      )
      search(Map(0 -> ok(page(excluded :+ hit)))).asserting { (items, _) =>
        items must have size 1
        items.head.itemDetails mustBe Clothing("Badge Vertical T-Shirt (Black, 19745105)", "EA7 Emporio Armani", "M")
      }
    }

    "accept missing colour, use the first brand and trim usable sizes" in {
      val product = changed(
        "brand" -> Json.arr(Json.fromString("EA7 Emporio Armani"), Json.fromString("Ignored brand")),
        "size"  -> Json.arr(Json.fromString(" "), Json.fromString(" XXL "))
      ).mapObject(_.remove("colour"))
      search(Map(0 -> ok(page(List(product))))).asserting { (items, _) =>
        items.map(_.itemDetails) mustBe List(Clothing("Badge Vertical T-Shirt (19745105)", "EA7 Emporio Armani", "2XL"))
      }
    }

    "keep decimal prices exact and use the supplied slug for the product link" in {
      val product = changed("price" -> Json.fromBigDecimal(BigDecimal("19.99")), "slug" -> Json.fromString("canonical-product-slug"))
      search(Map(0 -> ok(page(List(product))))).asserting { (items, _) =>
        items.head.buyPrice mustBe BuyPrice(1, BigDecimal("19.99"), Some(64))
        items.head.listingDetails.url mustBe "https://www.jdsports.co.uk/product/canonical-product-slug/19745105/"
      }
    }

    "preserve Algolia ordering instead of sorting by price" in
      search(Map(0 -> ok(page(List(hits(1), hit))))).asserting { (items, _) =>
        items.map(_.buyPrice.rrp) mustBe List.fill(6)(BigDecimal(100)) :+ BigDecimal(25)
      }

    "fetch all declared pages and continue through pages containing only filtered-out hits" in {
      val responses = Map(
        0 -> ok(page(List(changed("inStock" -> Json.False)), total = 3)),
        1 -> ok(page(List(hit.mapObject(_.remove("wasPrice"))), number = 1, total = 3)),
        2 -> ok(page(List(hit), number = 2, total = 3))
      )
      search(responses).asserting { (items, requests) =>
        requests.map(_.page) mustBe List(0, 1, 2)
        items must have size 1
      }
    }

    "stop on an empty raw page even when more pages are advertised" in
      search(Map(0 -> ok(page(List(hit), total = 5)), 1 -> ok(page(Nil, number = 1, total = 5)))).asserting { (items, requests) =>
        requests.map(_.page) mustBe List(0, 1)
        items must have size 1
      }

    "stop at the final page without probing another page" in
      search(Map(0 -> ok(page(List(hit))))).asserting { (items, requests) =>
        requests.map(_.page) mustBe List(0)
        items must have size 1
      }

    "return no results for an empty search" in
      search(Map(0 -> ok(page(Nil, total = 0)))).asserting { (items, requests) =>
        items mustBe empty
        requests.map(_.page) mustBe List(0)
      }

    val failures = List(
      "an HTTP error"        -> Right(StatusCode.Unauthorized -> "invalid credentials"),
      "exhausted throttling" -> Right(StatusCode.TooManyRequests -> "rate limited"),
      "a server error"       -> Right(StatusCode.InternalServerError -> "unavailable"),
      "malformed JSON"       -> ok("not json"),
      "a malformed product"  -> ok(page(List(hit.mapObject(_.remove("name"))), number = 1, total = 3)),
      "a connection error"   -> Left(new java.io.IOException("connection failed"))
    )

    failures.foreach { (description, response) =>
      s"preserve earlier results and stop pagination after $description" in
        search(Map(0 -> ok(page(List(hit), total = 3)), 1 -> response)).asserting { (items, requests) =>
          items must have size 1
          requests.map(_.page) mustBe List(0, 1)
        }
    }
  }
}
