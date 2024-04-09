package ebayapp.core.common

import cats.effect.std.Queue
import cats.effect.{Async, Ref, Sync, Temporal}
import cats.effect.syntax.spawn.*
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import cats.syntax.functor.*
import ebayapp.core.common.config.{DealsFinderConfig, EbayConfig, GenericRetailerConfig, RetailConfig, StockMonitorConfig, TelegramConfig}
import kirill5k.common.cats.syntax.stream.*
import ebayapp.core.domain.Retailer
import fs2.Stream

import java.nio.file.Paths
import scala.concurrent.duration.*

trait RetailConfigProvider[F[_]]:
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
  def flannels: F[GenericRetailerConfig]
  def stockMonitor(retailer: Retailer): Stream[F, StockMonitorConfig]
  def dealsFinder(retailer: Retailer): Stream[F, DealsFinderConfig]

final private class FileRetailConfigProvider[F[_]](
    private val state: Ref[F, RetailConfig],
    private val updatePeriod: FiniteDuration
)(using
    F: Temporal[F]
) extends RetailConfigProvider[F] {
  override def telegram: F[TelegramConfig]                                     = state.get.map(_.telegram)
  override def cex: F[GenericRetailerConfig]                                   = state.get.map(_.retailer.cex)
  override def ebay: F[EbayConfig]                                             = state.get.map(_.retailer.ebay)
  override def selfridges: F[GenericRetailerConfig]                            = state.get.map(_.retailer.selfridges)
  override def argos: F[GenericRetailerConfig]                                 = state.get.map(_.retailer.argos)
  override def jdsports: F[GenericRetailerConfig]                              = state.get.map(_.retailer.jdsports)
  override def scotts: F[GenericRetailerConfig]                                = state.get.map(_.retailer.scotts)
  override def tessuti: F[GenericRetailerConfig]                               = state.get.map(_.retailer.tessuti)
  override def nvidia: F[GenericRetailerConfig]                                = state.get.map(_.retailer.nvidia)
  override def scan: F[GenericRetailerConfig]                                  = state.get.map(_.retailer.scan)
  override def harveyNichols: F[GenericRetailerConfig]                         = state.get.map(_.retailer.harveyNichols)
  override def mainlineMenswear: F[GenericRetailerConfig]                      = state.get.map(_.retailer.mainlineMenswear)
  override def flannels: F[GenericRetailerConfig]                              = state.get.map(_.retailer.flannels)
  override def stockMonitor(retailer: Retailer): Stream[F, StockMonitorConfig] = streamUpdates(state.get.map(_.stockMonitor.get(retailer)))
  override def dealsFinder(retailer: Retailer): Stream[F, DealsFinderConfig]   = streamUpdates(state.get.map(_.dealsFinder.get(retailer)))

  private def streamUpdates[C](getConfig: => F[Option[C]]): Stream[F, C] = for
    configs       <- Stream.eval(Queue.unbounded[F, C])
    currentConfig <- Stream.eval(Ref.of[F, Option[C]](None))
    configUpdate = Stream
      .eval(getConfig)
      .zip(Stream.eval(currentConfig.get))
      .evalMap {
        case (None, None)                                       => F.unit
        case (Some(latest), None)                               => currentConfig.set(Some(latest)) >> configs.offer(latest)
        case (Some(latest), Some(current)) if current != latest => currentConfig.set(Some(latest)) >> configs.offer(latest)
        case _                                                  => F.unit
      }
      .repeatEvery(updatePeriod)
    c <- Stream.fromQueueUnterminated(configs).concurrently(configUpdate)
  yield c
}

object RetailConfigProvider:
  private def loadRetailConfigFromMount[F[_]](using F: Async[F], logger: Logger[F]): F[RetailConfig] =
    logger.info("loading config from volume mount") >> RetailConfig.loadFromMount
  private def loadDefaultRetailConfig[F[_]](using F: Async[F], logger: Logger[F]): F[RetailConfig] =
    logger.info("loading default config") >> RetailConfig.loadDefault
  private def mountedConfigModifiedTs[F[_]](using F: Sync[F]): F[Long] =
    F.blocking(Paths.get(RetailConfig.mountedConfigPath).toFile.lastModified())

  def make[F[_]](checkEvery: FiniteDuration = 2.minutes)(using F: Async[F], logger: Logger[F]): F[RetailConfigProvider[F]] = {
    def reloadRetailConfigWhenUpdated(state: Ref[F, RetailConfig], previousLastModifiedTs: Option[Long]): F[Unit] = {
      val process = for
        modifiedTs <- mountedConfigModifiedTs
        isUpdated = previousLastModifiedTs.nonEmpty && previousLastModifiedTs.exists(_ != modifiedTs)
        _ <- F
          .whenA(isUpdated)(logger.info("config from volume mount has been updated") >> loadRetailConfigFromMount.flatMap(state.set))
          .handleErrorWith(e => logger.error(e)("error reloading updated config"))
      yield modifiedTs

      F.sleep(checkEvery) >> process.flatMap(ts => reloadRetailConfigWhenUpdated(state, Some(ts)))
    }

    loadRetailConfigFromMount[F]
      .flatMap(Ref.of)
      .flatTap(_ => logger.info("loaded config from a configmap volume mount"))
      .flatTap(s => reloadRetailConfigWhenUpdated(s, None).start.void)
      .handleErrorWith { e =>
        logger.warn(s"error loading config from a configmap volume mount: ${e.getMessage}") >>
          loadDefaultRetailConfig.flatMap(Ref.of)
      }
      .map(rc => FileRetailConfigProvider(rc, checkEvery))
  }
