package ebayapp.proxy.common

import cats.effect.Sync
import ebayapp.kernel.config.{ClientConfig, ServerConfig}
import pureconfig.*
import pureconfig.generic.derivation.default.*

import scala.concurrent.duration.FiniteDuration

object config:

  final case class InterrupterConfig(
      initialDelay: FiniteDuration
  ) derives ConfigReader

  final case class AppConfig(
      server: ServerConfig,
      client: ClientConfig,
      interrupter: InterrupterConfig
  ) derives ConfigReader

  object AppConfig:
    def load[F[_]](using F: Sync[F]): F[AppConfig] =
      F.blocking(ConfigSource.default.loadOrThrow[AppConfig])
