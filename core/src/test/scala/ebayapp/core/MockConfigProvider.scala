package ebayapp.core

import cats.MonadThrow
import cats.effect.Sync
import ebayapp.core.common.ConfigProvider
import ebayapp.core.common.config.{AppConfig, EbayConfig, GenericRetailerConfig, TelegramConfig}

object MockConfigProvider {

  def make[F[_]](
      cexConfig: Option[GenericRetailerConfig] = None,
      telegramConfig: Option[TelegramConfig] = None,
      ebayConfig: Option[EbayConfig] = None,
      selfridgesConfig: Option[GenericRetailerConfig] = None
  )(using
      F: MonadThrow[F]
  ) = new ConfigProvider[F]:
    private def fromOpt[A](config: Option[A], name: String): F[A] = F.fromOption(config, new RuntimeException(s"missing $name config"))
    override def config: F[AppConfig]                             = ???
    override def telegram: F[TelegramConfig]                      = fromOpt(telegramConfig, "telegram")
    override def ebay: F[EbayConfig]                              = fromOpt(ebayConfig, "ebay")
    override def selfridges: F[GenericRetailerConfig]             = fromOpt(selfridgesConfig, "selfridges")
    override def cex: F[GenericRetailerConfig]                    = fromOpt(cexConfig, "cex")
}
