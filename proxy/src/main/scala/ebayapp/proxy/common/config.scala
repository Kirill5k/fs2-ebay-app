package ebayapp.proxy.common

import pureconfig.ConfigSource
import pureconfig.generic.auto._

object config {

  final case class RedirectionUrisConfig(
      cex: String,
      selfridges: String,
      jdsports: String,
      scan: String
  )

  final case class ServerConfig(
      host: String,
      port: Int
  )

  final case class AppConfig(
      server: ServerConfig,
      uris: RedirectionUrisConfig
  )

  object AppConfig {

    def load: AppConfig =
      ConfigSource.default.loadOrThrow[AppConfig]
  }

}
