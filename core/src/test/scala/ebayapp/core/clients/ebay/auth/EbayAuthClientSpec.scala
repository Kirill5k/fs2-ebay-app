package ebayapp.core.clients.ebay.auth

import cats.effect.IO
import cats.effect.Ref
import cats.syntax.apply.*
import ebayapp.core.MockConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.clients.ebay.auth.EbayAuthClient.OAuthToken
import ebayapp.core.common.config.{EbayConfig, EbaySearchConfig, OAuthCredentials}
import ebayapp.kernel.{Clock, MockClock, SttpClientSpec}
import sttp.client3
import sttp.client3.{Response, SttpBackend}
import sttp.model.*

import java.time.Instant
import scala.concurrent.duration.*

class EbayAuthClientSpec extends SttpClientSpec {

  val now                = Instant.parse("2020-01-01T00:00:00Z")
  given clock: Clock[IO] = MockClock(now)

  val credentials = List(OAuthCredentials("id-1", "secret-1"), OAuthCredentials("id-2", "secret-2"))
  val ebayConfig  = EbayConfig("http://ebay.com", credentials, EbaySearchConfig(5, 92, 20.minutes))
  val config      = MockConfigProvider.make[IO](ebayConfig = Some(ebayConfig))

  "EbayAuthClient" should {

    "make post request to obtain auth token" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isAuthRequest(r) =>
            Response.ok(json("ebay/auth-success-response.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      val ebayAuthClient = EbayAuthClient.make[IO](config, testingBackend)
      val accessToken    = ebayAuthClient.flatMap(_.accessToken)

      accessToken.asserting { token =>
        token mustBe "KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA=="
      }
    }

    "return existing token if it is valid" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial { case r => throw new RuntimeException(r.uri.toString) }

      val ebayAuthClient = (
        Ref.of[IO, Option[OAuthToken]](Some(OAuthToken("test-token", now.plusSeconds(3600)))),
        Ref.of[IO, List[OAuthCredentials]](Nil)
      ).mapN((t, c) => new LiveEbayAuthClient[IO](ebayConfig, t, c, testingBackend))

      ebayAuthClient.flatMap(_.accessToken).asserting { token =>
        token mustBe "test-token"
      }
    }

    "authenticate with different account when switched" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isAuthRequest(r) && r.headers.contains(Header(HeaderNames.Authorization, "Basic aWQtMTpzZWNyZXQtMQ==")) =>
            throw new RuntimeException()
          case r if isAuthRequest(r) && r.headers.contains(Header(HeaderNames.Authorization, "Basic aWQtMjpzZWNyZXQtMg==")) =>
            Response.ok(json("ebay/auth-success-response.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      val result = for
        client <- EbayAuthClient.make[IO](config, testingBackend)
        _      <- client.switchAccount()
        token  <- client.accessToken
      yield token

      result.asserting { token =>
        token mustBe "KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA=="
      }
    }

    "make another request when original token has expired" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isAuthRequest(r) =>
            Response.ok(json("ebay/auth-success-response.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      val ebayAuthClient = (
        Ref.of[IO, Option[OAuthToken]](Some(OAuthToken("test-token", now.minusSeconds(60)))),
        Ref.of[IO, List[OAuthCredentials]](credentials)
      ).mapN((t, c) => new LiveEbayAuthClient[IO](ebayConfig, t, c, testingBackend))

      ebayAuthClient.flatMap(_.accessToken).asserting { token =>
        token mustBe "KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA=="
      }
    }

    "retry on errors from ebay" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response(json("ebay/auth-error-response.json"), StatusCode.BadRequest),
          Response(json("ebay/auth-error-response.json"), StatusCode.BadRequest),
          Response.ok(json("ebay/auth-success-response.json"))
        )

      val ebayAuthClient = EbayAuthClient.make[IO](config, testingBackend)
      val accessToken    = ebayAuthClient.flatMap(_.accessToken)

      accessToken.asserting { token =>
        token mustBe "KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA=="
      }
    }

    "switch account when 429 received" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isAuthRequest(r) && r.headers.contains(Header(HeaderNames.Authorization, "Basic aWQtMTpzZWNyZXQtMQ==")) =>
            Response(json("ebay/auth-error-response.json"), StatusCode.TooManyRequests)
          case r if isAuthRequest(r) && r.headers.contains(Header(HeaderNames.Authorization, "Basic aWQtMjpzZWNyZXQtMg==")) =>
            Response.ok(json("ebay/auth-success-response.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      val ebayAuthClient = EbayAuthClient.make[IO](config, testingBackend)
      val accessToken    = ebayAuthClient.flatMap(_.accessToken)

      accessToken.asserting { token =>
        token mustBe "KTeE7V9J5VTzdfKpn/nnrkj4+nbtl/fDD92Vctbbalh37c1X3fvEt7u7/uLZ93emB1uu/i5eOz3o8MfJuV7288dzu48BEAAA=="
      }
    }

    def isAuthRequest(req: client3.Request[_, _]): Boolean =
      req.isPost &&
        req.hasContentType(MediaType.ApplicationXWwwFormUrlencoded) &&
        req.isGoingTo("ebay.com/identity/v1/oauth2/token")
  }
}
