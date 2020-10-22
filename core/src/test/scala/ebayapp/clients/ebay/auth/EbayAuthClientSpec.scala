package ebayapp.clients.ebay.auth

import cats.effect.IO
import cats.effect.concurrent.Ref
import cats.implicits._
import ebayapp.SttpClientSpec
import ebayapp.clients.ebay.auth.EbayAuthClient.EbayAuthToken
import ebayapp.common.config.{EbayConfig, EbayCredentials, EbaySearchConfig}
import sttp.client
import sttp.client.{NothingT, Response, SttpBackend}
import sttp.model._

class EbayAuthClientSpec extends SttpClientSpec {

  val credentials = List(EbayCredentials("id-1", "secret-1"), EbayCredentials("id-2", "secret-2"))
  val config      = EbayConfig("http://ebay.com", credentials, EbaySearchConfig(5, 92))

  "EbayAuthClient" should {

    "make post request to obtain auth token" in {
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isAuthRequest(r) =>
            Response.ok(json("ebay/auth-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebayAuthClient = EbayAuthClient.make[IO](config, testingBackend)
      val accessToken    = ebayAuthClient.flatMap(_.accessToken)

      accessToken.unsafeToFuture().map { token =>
        token must be("KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA==")
      }
    }

    "return existing token if it is valid" in {
      implicit val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case _ => throw new RuntimeException()
        }

      val ebayAuthClient = (
        Ref.of[IO, EbayAuthToken](EbayAuthToken("test-token", 7200)),
        Ref.of[IO, List[EbayCredentials]](Nil)
      ).mapN((t, c) => new EbayAuthClient[IO](config, t, c))

      ebayAuthClient.flatMap(_.accessToken).unsafeToFuture().map { token =>
        token must be("test-token")
      }
    }

    "authenticate with different account when switched" in {
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isAuthRequest(r) && r.headers.contains(Header(HeaderNames.Authorization, "Basic aWQtMTpzZWNyZXQtMQ==")) =>
            throw new RuntimeException()
          case r if isAuthRequest(r) && r.headers.contains(Header(HeaderNames.Authorization, "Basic aWQtMjpzZWNyZXQtMg==")) =>
            Response.ok(json("ebay/auth-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val result = for {
        client <- EbayAuthClient.make[IO](config, testingBackend)
        _      <- client.switchAccount()
        token  <- client.accessToken
      } yield token

      result.unsafeToFuture().map { token =>
        token must be("KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA==")
      }
    }

    "make another request when original token has expired" in {
      implicit val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isAuthRequest(r) =>
            Response.ok(json("ebay/auth-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebayAuthClient = (
        Ref.of[IO, EbayAuthToken](EbayAuthToken("test-token", 0)),
        Ref.of[IO, List[EbayCredentials]](credentials)
      ).mapN((t, c) => new EbayAuthClient[IO](config, t, c))

      ebayAuthClient.flatMap(_.accessToken).unsafeToFuture().map { token =>
        token must be("KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA==")
      }
    }

    "retry on errors from ebay" in {
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenAnyRequest
        .thenRespondCyclicResponses(
          Response(json("ebay/auth-error-response.json"), StatusCode.BadRequest),
          Response(json("ebay/auth-error-response.json"), StatusCode.BadRequest),
          Response.ok(json("ebay/auth-success-response.json"))
        )

      val ebayAuthClient = EbayAuthClient.make[IO](config, testingBackend)
      val accessToken    = ebayAuthClient.flatMap(_.accessToken)

      accessToken.unsafeToFuture().map { token =>
        token must be("KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA==")
      }
    }

    "switch account when 429 received" in {
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isAuthRequest(r) && r.headers.contains(Header(HeaderNames.Authorization, "Basic aWQtMTpzZWNyZXQtMQ==")) =>
            Response(json("ebay/auth-error-response.json"), StatusCode.TooManyRequests)
          case r if isAuthRequest(r) && r.headers.contains(Header(HeaderNames.Authorization, "Basic aWQtMjpzZWNyZXQtMg==")) =>
            Response.ok(json("ebay/auth-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebayAuthClient = EbayAuthClient.make[IO](config, testingBackend)
      val accessToken    = ebayAuthClient.flatMap(_.accessToken)

      accessToken.unsafeToFuture().map { token =>
        token must be("KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA==")
      }
    }

    def isAuthRequest(req: client.Request[_, _]): Boolean =
      isGoingToWithSpecificContent(
        req,
        Method.POST,
        "ebay.com",
        List("identity", "v1", "oauth2", "token"),
        contentType = MediaType.ApplicationXWwwFormUrlencoded
      )
  }
}
