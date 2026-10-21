package ebayapp.core.clients

import cats.effect.{IO, Ref}
import ebayapp.core.clients.CurlImpersonateClient.{CommandResult, RetrySpec}
import ebayapp.kernel.errors.AppError
import kirill5k.common.cats.test.IOWordSpec
import sttp.model.StatusCode

import java.io.IOException
import scala.concurrent.duration.*

class CurlImpersonateClientSpec extends IOWordSpec {

  private val url     = "https://example.com/search?query=EA7%20Armani"
  private val headers = Map("x-api-key" -> "configured-key")
  private val body    = """{
      |  "query": "Men's \"T-Shirt\" & $HOME $(echo test) `echo test`",
      |  "page": 0
      |}""".stripMargin
  private val retrySpec = RetrySpec.Default.copy(maxRetries = 2, maxDelay = 1.millis)

  "A CurlImpersonateClient" should {
    "preserve GET arguments and parse the last HTTP status delimiter" in {
      val responseBody = "body containing ---HTTP_STATUS--- text"
      val result       = for
        (client, calls) <- recordingClient(_ => IO.pure(response(200, responseBody)), timeout = 12.seconds)
        response        <- client.get(url, headers)
        commands        <- calls.get
      yield response -> commands

      result.asserting { case (response, commands) =>
        response mustBe StatusCode.Ok -> s"$responseBody\n"
        commands mustBe Vector(
          List(
            "curl_chrome116",
            "-s",
            "-L",
            "--max-time",
            "12",
            "--cacert",
            "/etc/ssl/certs/ca-bundle.crt",
            "-w",
            "\n---HTTP_STATUS---%{http_code}",
            "-H",
            "x-api-key: configured-key",
            url
          )
        )
      }
    }

    "send a POST body as one literal argument and resend it unchanged after a retry" in {
      val result = for
        (client, calls) <- recordingClient(attempt => IO.pure(response(if (attempt == 0) 503 else 200, "response")))
        response        <- client.post(url, headers, body, retrySpec)
        commands        <- calls.get
      yield response -> commands

      result.asserting { case (response, commands) =>
        response mustBe StatusCode.Ok -> "response\n"
        commands must have size 2
        commands.distinct must have size 1
        commands.head.take(3) mustBe List("curl_chrome116", "-s", "-L")
        commands.head.takeRight(5) mustBe List("-H", "x-api-key: configured-key", "--data-raw", body, url)
        commands.head.count(_ == "--data-raw") mustBe 1
      }
    }

    "decode a GET response with getAs" in {
      val result = for
        (client, _) <- recordingClient(_ => IO.pure(response(200, """{"count": 3}""")))
        response    <- client.getAs[Map[String, Int]](url, headers)
      yield response

      result.asserting(_ mustBe StatusCode.Ok -> Map("count" -> 3))
    }

    "report JSON decoding errors from getAs" in {
      val result = for
        (client, _) <- recordingClient(_ => IO.pure(response(200, "not json")))
        response    <- client.getAs[Map[String, Int]](url, headers).attempt
      yield response

      result.asserting { response =>
        response.left.toOption.get mustBe a[AppError.Json]
        response.left.toOption.get.asInstanceOf[AppError.Json].input mustBe "not json\n"
      }
    }

    "stop retrying HTTP errors at the configured limit" in {
      val result = for
        (client, calls) <- recordingClient(_ => IO.pure(response(503, "unavailable")))
        response        <- client.get(url, headers, retrySpec)
        commands        <- calls.get
      yield response -> commands.size

      result.asserting { case (response, attempts) =>
        response mustBe StatusCode.ServiceUnavailable -> "unavailable\n"
        attempts mustBe 3
      }
    }

    "stop retrying mixed HTTP and connection errors at the configured limit" in {
      val error  = new IOException("connection reset")
      val result = for
        (client, calls) <- recordingClient {
          case 0 => IO.pure(response(503, "unavailable"))
          case _ => IO.raiseError(error)
        }
        response <- client.post(url, headers, body, retrySpec).attempt
        commands <- calls.get
      yield response -> commands

      result.asserting { case (response, commands) =>
        response mustBe Left(error)
        commands must have size 3
        commands.distinct must have size 1
      }
    }

    "return excluded HTTP errors without retrying" in {
      val result = for
        (client, calls) <- recordingClient(_ => IO.pure(response(404, "missing")))
        response        <- client.post(url, headers, body, retrySpec.copy(retryExcludedCodes = Set(StatusCode.NotFound)))
        commands        <- calls.get
      yield response -> commands.size

      result.asserting { case (response, attempts) =>
        response mustBe StatusCode.NotFound -> "missing\n"
        attempts mustBe 1
      }
    }

    "report nonzero process exits without parsing stdout" in {
      val result = for
        (client, calls) <- recordingClient(_ => IO.pure(CommandResult(28, "", "operation timed out")))
        response        <- client.post(url, headers, body, RetrySpec()).attempt
        commands        <- calls.get
      yield response -> commands.size

      result.asserting { case (response, attempts) =>
        response.left.toOption.get mustBe a[IOException]
        response.left.toOption.get.getMessage mustBe "curl failed (exit 28): operation timed out"
        attempts mustBe 1
      }
    }

    "retry nonzero process exits when connection retries are enabled" in {
      val result = for
        (client, calls) <- recordingClient {
          case 0 => IO.pure(CommandResult(7, "", "failed to connect"))
          case _ => IO.pure(response(200, "connected"))
        }
        response <- client.post(url, headers, body, retrySpec)
        commands <- calls.get
      yield response -> commands.size

      result.asserting { case (response, attempts) =>
        response mustBe StatusCode.Ok -> "connected\n"
        attempts mustBe 2
      }
    }

    "report missing HTTP status output" in {
      val result = for
        (client, _) <- recordingClient(_ => IO.pure(CommandResult(0, "no status marker", "")))
        response    <- client.get(url, headers, RetrySpec()).attempt
      yield response

      result.asserting { response =>
        response.left.toOption.get mustBe a[IOException]
        response.left.toOption.get.getMessage mustBe "curl response is missing HTTP status"
      }
    }

    "report malformed HTTP status output" in {
      val result = for
        (client, _) <- recordingClient(_ => IO.pure(CommandResult(0, "body\n---HTTP_STATUS---invalid", "")))
        response    <- client.get(url, headers, RetrySpec()).attempt
      yield response

      result.asserting { response =>
        response.left.toOption.get mustBe a[IOException]
        response.left.toOption.get.getMessage mustBe "curl response has invalid HTTP status"
      }
    }
  }

  private def response(status: Int, body: String): CommandResult =
    CommandResult(0, s"$body\n---HTTP_STATUS---$status", "")

  private def recordingClient(
      result: Int => IO[CommandResult],
      timeout: FiniteDuration = 30.seconds
  ): IO[(CurlImpersonateClient[IO], Ref[IO, Vector[List[String]]])] =
    for
      calls  <- Ref.of[IO, Vector[List[String]]](Vector.empty)
      client <- CurlImpersonateClient.withExecutor[IO](
        command => calls.modify(commands => (commands :+ command) -> commands.size).flatMap(result),
        timeout = timeout
      )
    yield client -> calls
}
