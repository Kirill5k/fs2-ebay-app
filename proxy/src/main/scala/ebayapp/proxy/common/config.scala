package ebayapp.proxy.common

import cats.effect.Sync
import cats.implicits.*
import pureconfig.*
import pureconfig.generic.derivation.default.*

object config:

  final case class ServerConfig(
      host: String,
      port: Int
  ) derives ConfigReader

  final case class AppConfig(
      server: ServerConfig
  ) derives ConfigReader

  object AppConfig:
    def load[F[_]](using F: Sync[F]): F[AppConfig] =
      F.blocking(ConfigSource.default.loadOrThrow[AppConfig])
