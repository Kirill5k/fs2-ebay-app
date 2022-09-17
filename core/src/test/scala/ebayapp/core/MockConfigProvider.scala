package ebayapp.core

import cats.MonadThrow
import cats.effect.Sync
import ebayapp.core.common.ConfigProvider
import ebayapp.core.common.config.{AppConfig, DealsFinderConfig, EbayConfig, GenericRetailerConfig, StockMonitorConfig, TelegramConfig}
import ebayapp.core.domain.Retailer
import fs2.Stream

object MockConfigProvider {

  def make[F[_]](
      cexConfig: Option[GenericRetailerConfig] = None,
      telegramConfig: Option[TelegramConfig] = None,
      ebayConfig: Option[EbayConfig] = None,
      selfridgesConfig: Option[GenericRetailerConfig] = None,
      argosConfig: Option[GenericRetailerConfig] = None,
      jdsportsConfig: Option[GenericRetailerConfig] = None,
      scottsConfig: Option[GenericRetailerConfig] = None,
      tessutiConfig: Option[GenericRetailerConfig] = None,
      nvidiaConfig: Option[GenericRetailerConfig] = None,
      scanConfig: Option[GenericRetailerConfig] = None,
      harveyNicholsConfig: Option[GenericRetailerConfig] = None,
      mainlineMenswearConfig: Option[GenericRetailerConfig] = None,
      stockMonitorConfigs: Map[Retailer, StockMonitorConfig] = Map.empty,
      dealsFinderConfigs: Map[Retailer, DealsFinderConfig] = Map.empty
  )(using
      F: MonadThrow[F]
  ) = new ConfigProvider[F]:
    private def fromOpt[A](config: Option[A], name: String): F[A] = F.fromOption(config, new RuntimeException(s"missing $name config"))
    override def config: F[AppConfig]                             = ???
    override def telegram: F[TelegramConfig]                      = fromOpt(telegramConfig, "telegram")
    override def ebay: F[EbayConfig]                              = fromOpt(ebayConfig, "ebay")
    override def selfridges: F[GenericRetailerConfig]             = fromOpt(selfridgesConfig, "selfridges")
    override def cex: F[GenericRetailerConfig]                    = fromOpt(cexConfig, "cex")
    override def argos: F[GenericRetailerConfig]                  = fromOpt(argosConfig, "argos")
    override def jdsports: F[GenericRetailerConfig]               = fromOpt(jdsportsConfig, "jdsports")
    override def scotts: F[GenericRetailerConfig]                 = fromOpt(scottsConfig, "scotts")
    override def tessuti: F[GenericRetailerConfig]                = fromOpt(tessutiConfig, "tessuti")
    override def nvidia: F[GenericRetailerConfig]                 = fromOpt(nvidiaConfig, "nvidia")
    override def scan: F[GenericRetailerConfig]                   = fromOpt(scanConfig, "scan")
    override def harveyNichols: F[GenericRetailerConfig]          = fromOpt(harveyNicholsConfig, "harvey-nichols")
    override def mainlineMenswear: F[GenericRetailerConfig]       = fromOpt(mainlineMenswearConfig, "mainline-menswear")
    override def stockMonitor(retailer: Retailer): Stream[F, StockMonitorConfig] = Stream(stockMonitorConfigs.get(retailer)).unNone
    override def dealsFinder(retailer: Retailer): Stream[F, DealsFinderConfig]   = Stream(dealsFinderConfigs.get(retailer)).unNone
}
