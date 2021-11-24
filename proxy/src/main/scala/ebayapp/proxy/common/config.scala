package ebayapp.proxy.common

import pureconfig._
import pureconfig.generic.derivation.default._

object config {

  final case class ServerConfig(
      host: String,
      port: Int
  ) derives ConfigReader

  final case class AppConfig(
      server: ServerConfig
  ) derives ConfigReader

  object AppConfig {

    def load: AppConfig =
      ConfigSource.default.loadOrThrow[AppConfig]
  }

}
