package ebayapp.core.clients.mainlinemenswear

import cats.Monad
import cats.effect.{Ref, Temporal}
import cats.syntax.apply.*
import cats.syntax.applicative.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.mainlinemenswear.responses.{ProductData, ProductPreview, ProductResponse, SearchResponse}
import ebayapp.core.clients.mainlinemenswear.requests.{ProductRequest, SearchRequest}
import ebayapp.core.clients.mainlinemenswear.mappers.{mainlineMenswearClothingMapper, MainlineMenswearItem}
import ebayapp.core.clients.{HttpClient, SearchClient, SearchCriteria}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import sttp.client3.*
import sttp.client3.circe.asJson
import sttp.model.{Header, StatusCode}
import java.time.Instant

import scala.concurrent.duration.*

final private[mainlinemenswear] case class AccessToken(token: String, expirationTime: Instant)

final private class LiveMainlineMenswearClient[F[_]](
    private val config: GenericRetailerConfig,
    override val name: String,
    override val backend: SttpBackend[F, Any],
    private val token: Ref[F, Option[AccessToken]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  private val headers: Map[String, String] = defaultHeaders ++ config.headers

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    searchForItems(criteria)
      .filter(_.isOnSale)
      .metered(250.millis)
      .evalMap(getCompleteProduct)
      .unNone
      .map { p =>
        p.sizes.data.map { s =>
          MainlineMenswearItem(
            p.productID,
            p.name,
            p.brand,
            p.base_price,
            p.rrp1,
            s.content,
            s.onlinestock,
            p.mainimage,
            p.clean_url,
            p.category
          )
        }
      }
      .flatMap(Stream.emits)
      .map(mainlineMenswearClothingMapper.toDomain)
      .handleErrorWith(e => Stream.eval(logger.error(e)(e.getMessage)).drain)

  private def searchForItems(criteria: SearchCriteria): Stream[F, ProductPreview] =
    Stream
      .unfoldLoopEval(1) { page =>
        sendSearchQuery(criteria, page).map(items => (items, Option.when(items.nonEmpty)(page + 1)))
      }
      .flatMap(Stream.emits)

  private def sendSearchQuery(criteria: SearchCriteria, page: Int): F[List[ProductPreview]] =
    dispatchReqWithAuth {
      basicRequest
        .post(uri"${config.baseUri}/app/mmw/m/search/${criteria.query}")
        .body(SearchRequest(page, criteria.query).toJson)
        .headers(headers)
        .response(asJson[SearchResponse])
    }.flatMap { r =>
      r.body match {
        case Right(res) =>
          F.pure(res.data.products)
        case Left(DeserializationException(_, error)) =>
          logger.error(s"$name-search/json-error: ${error.getMessage}") *>
            F.pure(Nil)
        case Left(HttpError(_, s)) if s == StatusCode.Forbidden || s == StatusCode.TooManyRequests =>
          logger.error(s"$name-search/$s-critical") *>
            F.sleep(3.second) *> sendSearchQuery(criteria, page)
        case Left(HttpError(_, status)) if status.isClientError =>
          logger.error(s"$name-search/$status-error") *>
            F.pure(Nil)
        case Left(HttpError(_, status)) if status.isServerError =>
          logger.warn(s"$name-search/$status-repeatable") *>
            F.sleep(5.second) *> sendSearchQuery(criteria, page)
        case Left(error) =>
          logger.error(s"$name-search/error: ${error.getMessage}") *>
            F.sleep(5.second) *> sendSearchQuery(criteria, page)
      }
    }

  private def getCompleteProduct(pp: ProductPreview): F[Option[ProductData]] =
    dispatchReqWithAuth {
      basicRequest
        .post(uri"${config.baseUri}/app/mmw/m/product/${pp.productID}")
        .body(ProductRequest.toJson)
        .headers(headers)
        .response(asJson[ProductResponse])
    }.flatMap { r =>
      r.body match {
        case Right(res) =>
          F.pure(Some(res.data))
        case Left(DeserializationException(_, error)) =>
          logger.error(s"$name-product/json-error: ${error.getMessage}") *>
            F.pure(None)
        case Left(HttpError(_, s)) if s == StatusCode.Forbidden || s == StatusCode.TooManyRequests =>
          logger.error(s"$name-product/$s-critical") *>
            F.sleep(3.second) *> getCompleteProduct(pp)
        case Left(HttpError(_, status)) if status.isClientError =>
          logger.error(s"$name-product/$status-error") *>
            F.pure(None)
        case Left(HttpError(_, status)) if status.isServerError =>
          logger.warn(s"$name-product/$status-repeatable") *>
            F.sleep(5.second) *> getCompleteProduct(pp)
        case Left(error) =>
          logger.error(s"$name-product/error: ${error.getMessage}") *>
            F.sleep(5.second) *> getCompleteProduct(pp)
      }
    }

  private def dispatchReqWithAuth[T](request: Request[T, Any]): F[Response[T]] =
    (token.get, F.realTimeInstant)
      .mapN((token, time) => token.filter(_.expirationTime.isAfter(time)))
      .flatMap {
        case Some(t) => dispatchReq(request.auth.bearer(t.token))
        case None    => refreshAccessToken *> dispatchReqWithAuth(request)
      }

  private def refreshAccessToken: F[Unit] =
    (dispatchReq(basicRequest.get(uri"https://www.mainlinemenswear.co.uk")), F.realTimeInstant)
      .mapN { (res, time) =>
        res.headers
          .find(_.value.startsWith("access_token="))
          .flatMap(_.value.replace("access_token=", "").split(";").headOption)
          .map(token => AccessToken(token, time.plusSeconds(3.hours.toSeconds)))
      }
      .flatMap { accessToken =>
        logger.info(s"$name access token $accessToken") *> token.update(_ => accessToken)
      }
}

object MainlineMenswearClient:
  def make[F[_]: Temporal: Logger](
      config: GenericRetailerConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Ref.of[F, Option[AccessToken]](None).map(t => LiveMainlineMenswearClient[F](config, "mainline-menswear", backend, t))
