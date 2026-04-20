package ebayapp.core.common

import cats.effect.{Async, Ref, Temporal}
import cats.effect.syntax.spawn.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.common.config.{DealsFinderConfig, EbayConfig, GenericRetailerConfig, RetailConfig, StockMonitorConfig, TelegramConfig}
import ebayapp.core.domain.Retailer
import ebayapp.core.repositories.RetailConfigRepository
import fs2.Stream
import fs2.concurrent.Topic

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
      currentConfig <- Stream.eval(Ref.of[F, Option[C]](None))
      c             <- (Stream.eval(state.get) ++ updates.subscribeUnbounded)
        .map(getConfig)
        .zip(Stream.eval(currentConfig.get).repeat)
        .map {
          case (Some(latest), Some(current)) if current != latest => Some(latest)
          case (Some(latest), None)                               => Some(latest)
          case _                                                  => None
        }
        .unNone
        .evalTap(c => currentConfig.set(Some(c)))
    yield c
}

object RetailConfigProvider {
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

    for
      rc  <- initialConfig
      upd <- Topic[F, RetailConfig]
      _   <- repo.updates
        .evalTap(c => logger.info("received retail config update from database") >> rc.set(c))
        .through(upd.publish)
        .compile
        .drain
        .start
    yield ReactiveRetailConfigProvider(rc, upd)
  }
}
