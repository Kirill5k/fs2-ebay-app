package ebayapp.core.clients

import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.argos.ArgosClient
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.ebay.EbayClient
import ebayapp.core.clients.frasers.FrasersClient
import ebayapp.core.clients.harveynichols.HarveyNicholsClient
import ebayapp.core.clients.jd.JdClient
import ebayapp.core.clients.mainlinemenswear.MainlineMenswearClient
import ebayapp.core.clients.nvidia.NvidiaClient
import ebayapp.core.clients.scan.ScanClient
import ebayapp.core.clients.selfridges.SelfridgesClient
import ebayapp.core.clients.telegram.TelegramClient
import ebayapp.core.common.{ConfigProvider, Logger, Resources}
import ebayapp.core.domain.Retailer
import ebayapp.core.domain.Retailer.Flannels

trait Clients[F[_]]:
  def cex: CexClient[F]
  def messenger: MessengerClient[F]
  def get(retailer: Retailer): SearchClient[F]

object Clients:
  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      resources: Resources[F]
  ): F[Clients[F]] =
    for
      cexClient              <- CexClient.graphql[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      telegramClient         <- TelegramClient.make[F](configProvider, resources.httpClientBackend)
      ebayClient             <- EbayClient.make[F](configProvider, resources.httpClientBackend)
      selfridgesClient       <- SelfridgesClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      argosClient            <- ArgosClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      jdClient               <- JdClient.jdsports[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      scottsClient           <- FrasersClient.scotts[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      tessutiClient          <- FrasersClient.tessuti[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      nvidiaClient           <- NvidiaClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      scanClient             <- ScanClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      harveyNicholsClient    <- HarveyNicholsClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      mainlineMenswearClient <- MainlineMenswearClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
      flannelsClient         <- FrasersClient.flannels[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
    yield new Clients[F] {
      def cex: CexClient[F]             = cexClient
      def messenger: MessengerClient[F] = telegramClient
      def get(retailer: Retailer): SearchClient[F] =
        retailer match
          case Retailer.Cex              => cexClient
          case Retailer.Ebay             => ebayClient
          case Retailer.Selfridges       => selfridgesClient
          case Retailer.Argos            => argosClient
          case Retailer.Scotts           => scottsClient
          case Retailer.Jdsports         => jdClient
          case Retailer.Tessuti          => tessutiClient
          case Retailer.Nvidia           => nvidiaClient
          case Retailer.Scan             => scanClient
          case Retailer.HarveyNichols    => harveyNicholsClient
          case Retailer.MainlineMenswear => mainlineMenswearClient
          case Retailer.Flannels         => flannelsClient
    }
