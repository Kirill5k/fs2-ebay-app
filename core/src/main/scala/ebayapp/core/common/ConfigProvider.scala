package ebayapp.core.common

import cats.effect.std.Queue
import cats.effect.{Async, Ref, Sync, Temporal}
import cats.effect.syntax.spawn.*
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import cats.syntax.functor.*
import ebayapp.core.common.config.{AppConfig, DealsFinderConfig, EbayConfig, GenericRetailerConfig, StockMonitorConfig, TelegramConfig}
import ebayapp.kernel.common.stream.*
import ebayapp.kernel.common.effects.*
import ebayapp.core.domain.Retailer
import fs2.Stream

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
  def stockMonitor(retailer: Retailer): Stream[F, StockMonitorConfig]
  def dealsFinder(retailer: Retailer): Stream[F, DealsFinderConfig]

final private class LiveConfigProvider[F[_]](
    private val state: Ref[F, AppConfig],
    private val updatePeriod: FiniteDuration
)(using
    F: Temporal[F]
) extends ConfigProvider[F] {
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
  override def stockMonitor(retailer: Retailer): Stream[F, StockMonitorConfig] = streamUpdates(config.map(_.stockMonitor.get(retailer)))
  override def dealsFinder(retailer: Retailer): Stream[F, DealsFinderConfig]   = streamUpdates(config.map(_.dealsFinder.get(retailer)))

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

object ConfigProvider:
  private def loadConfigFromMount[F[_]](using F: Async[F]): F[AppConfig] =
    F.blocking(AppConfig.loadFromMount)
  private def loadDefaultConfig[F[_]](using F: Async[F]): F[AppConfig] =
    F.blocking(AppConfig.loadDefault)
  private def mountedConfigModifiedTs[F[_]](using F: Sync[F]): F[Long] =
    F.blocking(Paths.get(AppConfig.mountedConfigPath).toFile.lastModified())

  def make[F[_]](checkEvery: FiniteDuration)(using F: Async[F], logger: Logger[F]): F[ConfigProvider[F]] = {
    def reloadConfigWhenUpdated(state: Ref[F, AppConfig], previousLastModifiedTs: Option[Long]): F[Unit] = {
      val process = for
        modifiedTs <- mountedConfigModifiedTs
        isUpdated = previousLastModifiedTs.nonEmpty && previousLastModifiedTs.exists(_ != modifiedTs)
        _ <- F.whenA(isUpdated)(logger.info("reloading updated config from volume mount") >> loadConfigFromMount.flatMap(state.set))
      yield modifiedTs

      F.sleep(checkEvery) >> process.flatMap(ts => reloadConfigWhenUpdated(state, Some(ts)))
    }

    loadConfigFromMount
      .flatTap(_ => logger.info("loaded config from a configmap volume mount"))
      .flatMap(Ref.of)
      .flatTap(s => reloadConfigWhenUpdated(s, None).start.void)
      .handleErrorWith { e =>
        logger.warn(s"error loading config from a configmap volume mount, will use default: ${e.getMessage}") >>
          loadDefaultConfig.flatMap(Ref.of)
      }
      .map(LiveConfigProvider(_, checkEvery))
  }
