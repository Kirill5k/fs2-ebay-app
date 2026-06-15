package ebayapp.core

import cats.MonadThrow
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.CurlImpersonateClient
import ebayapp.core.clients.CurlImpersonateClient.RetrySpec
import ebayapp.kernel.errors.AppError
import io.circe.Decoder
import io.circe.parser.decode
import sttp.model.StatusCode

object MockCurlImpersonateClient {

  def make[F[_]](
      responses: (String, (StatusCode, String))*
  )(using F: MonadThrow[F]): CurlImpersonateClient[F] =
    val responseMap = responses.toMap
    new CurlImpersonateClient[F]:
      override def get(url: String, headers: Map[String, String], retrySpec: RetrySpec): F[(StatusCode, String)] =
        F.fromOption(responseMap.get(url), AppError.Failed(s"MockCurlImpersonateClient: no response defined for $url"))

      override def getAs[A: Decoder](url: String, headers: Map[String, String], retrySpec: RetrySpec): F[(StatusCode, A)] =
        for
          (code, body) <- get(url, headers, retrySpec)
          decoded      <- F.fromEither(decode[A](body).left.map(e => AppError.Json(e.getMessage, body)))
        yield code -> decoded
}
