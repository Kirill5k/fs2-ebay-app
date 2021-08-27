package ebayapp.proxy.common

import pureconfig.ConfigSource
import pureconfig.generic.auto._

object config {

  final case class ServerConfig(
      host: String,
      port: Int
  )

  final case class AppConfig(
      server: ServerConfig
  )

  object AppConfig {

    def load: AppConfig =
      ConfigSource.default.loadOrThrow[AppConfig]
  }

}
