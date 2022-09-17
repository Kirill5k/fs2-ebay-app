package ebayapp.core.common

import cats.Monad
import cats.effect.{Async, Ref, Sync}
import cats.effect.syntax.spawn.*
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import cats.syntax.functor.*
import ebayapp.core.common.config.{AppConfig, DealsFinderConfig, EbayConfig, GenericRetailerConfig, StockMonitorConfig, TelegramConfig}
import ebayapp.core.domain.Retailer

import java.nio.file.Paths
import java.time.Instant
import scala.concurrent.duration.*

trait ConfigProvider[F[_]]:
  def config: F[AppConfig]
  def cex: F[GenericRetailerConfig]
  def selfridges: F[GenericRetailerConfig]
  def telegram: F[TelegramConfig]
  def ebay: F[EbayConfig]
  def argos: F[GenericRetailerConfig]
  def jdsports: F[GenericRetailerConfig]
  def scotts: F[GenericRetailerConfig]
  def tessuti: F[GenericRetailerConfig]
  def nvidia: F[GenericRetailerConfig]
  def scan: F[GenericRetailerConfig]
  def harveyNichols: F[GenericRetailerConfig]
  def mainlineMenswear: F[GenericRetailerConfig]
  def stockMonitor(retailer: Retailer): F[Option[StockMonitorConfig]]
  def dealsFinder(retailer: Retailer): F[Option[DealsFinderConfig]]

final private class LiveConfigProvider[F[_]](
    private val state: Ref[F, AppConfig]
)(using
    F: Monad[F]
) extends ConfigProvider[F]:
  override def config: F[AppConfig]                                            = state.get
  override def telegram: F[TelegramConfig]                                     = config.map(_.telegram)
  override def cex: F[GenericRetailerConfig]                                   = config.map(_.retailer.cex)
  override def ebay: F[EbayConfig]                                             = config.map(_.retailer.ebay)
  override def selfridges: F[GenericRetailerConfig]                            = config.map(_.retailer.selfridges)
  override def argos: F[GenericRetailerConfig]                                 = config.map(_.retailer.argos)
  override def jdsports: F[GenericRetailerConfig]                              = config.map(_.retailer.jdsports)
  override def scotts: F[GenericRetailerConfig]                                = config.map(_.retailer.scotts)
  override def tessuti: F[GenericRetailerConfig]                               = config.map(_.retailer.tessuti)
  override def nvidia: F[GenericRetailerConfig]                                = config.map(_.retailer.nvidia)
  override def scan: F[GenericRetailerConfig]                                  = config.map(_.retailer.scan)
  override def harveyNichols: F[GenericRetailerConfig]                         = config.map(_.retailer.harveyNichols)
  override def mainlineMenswear: F[GenericRetailerConfig]                      = config.map(_.retailer.mainlineMenswear)
  override def stockMonitor(retailer: Retailer): F[Option[StockMonitorConfig]] = config.map(_.stockMonitor.get(retailer))
  override def dealsFinder(retailer: Retailer): F[Option[DealsFinderConfig]]   = config.map(_.dealsFinder.get(retailer))

object ConfigProvider:

  def make[F[_]](checkEvery: FiniteDuration)(using F: Async[F], logger: Logger[F]): F[ConfigProvider[F]] = {
    def reloadConfigWhenUpdated(state: Ref[F, AppConfig], previousLastModifiedTs: Option[Long]): F[Unit] = {
      val process = mountedConfigModifiedTs.flatMap { modifiedTs =>
        if (previousLastModifiedTs.isEmpty || previousLastModifiedTs.contains(modifiedTs)) F.pure(modifiedTs)
        else {
          logger.info("reloading updated config from volume mount") >>
            F.blocking(AppConfig.loadFromMount).flatMap(state.set).as(modifiedTs)
        }
      }
      F.sleep(checkEvery) >> process.flatMap(ts => reloadConfigWhenUpdated(state, Some(ts)))
    }

    F
      .blocking(AppConfig.loadFromMount)
      .flatMap(c => logger.info("loaded config from a configmap volume mount") >> Ref.of(c))
      .flatTap(s => reloadConfigWhenUpdated(s, None).start.void)
      .handleErrorWith { e =>
        logger.warn(s"error loading config from a configmap mount, will try resources: ${e.getMessage}") >>
          F.blocking(AppConfig.loadDefault).flatMap(Ref.of)
      }
      .map(LiveConfigProvider(_))
  }

  private def mountedConfigModifiedTs[F[_]](using F: Sync[F]): F[Long] =
    F.delay(Paths.get(AppConfig.mountedConfigPath).toFile.lastModified())
