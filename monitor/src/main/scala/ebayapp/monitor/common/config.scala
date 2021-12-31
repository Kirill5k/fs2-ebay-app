package ebayapp.monitor.common

import cats.effect.Sync
import ebayapp.kernel.config.{MongoConfig, ServerConfig}
import pureconfig.*
import pureconfig.generic.derivation.default.*

object config {
  final case class EmailConfig(
      smtpHost: String,
      smtpPort: Int,
      username: String,
      password: String
  )

  final case class AppConfig(
      server: ServerConfig,
      mongo: MongoConfig,
      email: EmailConfig
  ) derives ConfigReader

  object AppConfig:
    def load[F[_]](using F: Sync[F]): F[AppConfig] =
      F.blocking(ConfigSource.default.loadOrThrow[AppConfig])
}
