package ebayapp.proxy.common

import cats.effect.Sync
import ebayapp.kernel.config.ServerConfig
import pureconfig.*
import pureconfig.generic.derivation.default.*

object config:

  final case class AppConfig(
      server: ServerConfig
  ) derives ConfigReader

  object AppConfig:
    def load[F[_]](using F: Sync[F]): F[AppConfig] =
      F.blocking(ConfigSource.default.loadOrThrow[AppConfig])
