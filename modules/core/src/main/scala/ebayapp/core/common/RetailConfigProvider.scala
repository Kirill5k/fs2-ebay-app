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
import ebayapp.core.repositories.RetailConfigRepository
import fs2.Stream
import fs2.concurrent.Topic

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

final private class LiveRetailConfigProvider[F[_]](
    private val state: Ref[F, RetailConfig]
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
      .repeatEvery(15.seconds)
    c <- Stream.fromQueueUnterminated(configs).concurrently(configUpdate)
  yield c
}

final private class ReactiveRetailConfigProvider[F[_]](
    private val state: Ref[F, RetailConfig],
    private val updates: Topic[F, RetailConfig]
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
  override def stockMonitor(retailer: Retailer): Stream[F, StockMonitorConfig] = streamUpdates(_.stockMonitor.get(retailer))
  override def dealsFinder(retailer: Retailer): Stream[F, DealsFinderConfig]   = streamUpdates(_.dealsFinder.get(retailer))

  private def streamUpdates[C](getConfig: RetailConfig => Option[C]): Stream[F, C] =
    for
      initialConfig <- Stream.eval(state.get.map(getConfig))
      currentConfig <- Stream.eval(Ref.of[F, Option[C]](initialConfig))
      c <- updates.subscribeUnbounded
        .map(getConfig)
        .zip(Stream.eval(currentConfig.get).repeat)
        .map {
          case (None, None)                                       => None
          case (Some(latest), None)                               => Some(latest)
          case (Some(latest), Some(current)) if current != latest => Some(latest)
          case _                                                  => None
        }
        .unNone
        .evalTap(c => currentConfig.set(Some(c)))
    yield c
}

object RetailConfigProvider {
  private def loadRetailConfigFromMount[F[_]](using F: Async[F], logger: Logger[F]): F[RetailConfig] =
    logger.info("loading config from volume mount") >> RetailConfig.loadFromMount

  private def loadDefaultRetailConfig[F[_]](using F: Async[F], logger: Logger[F]): F[RetailConfig] =
    logger.info("loading default config") >> RetailConfig.loadDefault

  private def mountedConfigModifiedTs[F[_]](using F: Sync[F]): F[Long] =
    F.blocking(Paths.get(RetailConfig.mountedConfigPath).toFile.lastModified())

  def file[F[_]](checkEvery: FiniteDuration = 2.minutes)(using F: Async[F], logger: Logger[F]): F[RetailConfigProvider[F]] = {
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
      .map(rc => LiveRetailConfigProvider(rc))
  }

  def mongo[F[_]](repo: RetailConfigRepository[F])(using F: Async[F], logger: Logger[F]): F[RetailConfigProvider[F]] = {
    val initialConfig = repo.get.flatMap {
      case Some(rc) =>
        logger.info("loaded retail config from the database") >> Ref.of(rc)
      case None =>
        for
          _     <- logger.info("could not find retail config in database. loading from file")
          rc    <- RetailConfig.loadDefault[F]
          _     <- repo.save(rc)
          state <- Ref.of(rc)
        yield state
    }

    initialConfig
      .flatTap { rc =>
        repo.updates
          .evalTap(_ => logger.info("received retail config update from database"))
          .evalMap(rc.set)
          .compile
          .drain
          .start
          .void
      }
      .map(rc => LiveRetailConfigProvider(rc))
  }

  def mongoV2[F[_]](repo: RetailConfigRepository[F])(using F: Async[F], logger: Logger[F]): F[RetailConfigProvider[F]] = {
    val initialConfig = repo.get.flatMap {
      case Some(rc) =>
        logger.info("loaded retail config from the database") >> Ref.of(rc)
      case None =>
        for
          _     <- logger.info("could not find retail config in database. loading from file")
          rc    <- RetailConfig.loadDefault[F]
          _     <- repo.save(rc)
          state <- Ref.of(rc)
        yield state
    }

    for
      rc  <- initialConfig
      upd <- Topic[F, RetailConfig]
      _ <- repo.updates
        .evalTap(c => logger.info("received retail config update from database") >> rc.set(c))
        .through(upd.publish)
        .compile
        .drain
        .start
    yield ReactiveRetailConfigProvider(rc, upd)
  }
}
