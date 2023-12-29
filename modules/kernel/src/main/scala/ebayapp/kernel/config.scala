package ebayapp.kernel

import pureconfig.*
import pureconfig.generic.derivation.default.*

import scala.concurrent.duration.*

object config:

  final case class ClientConfig(
      connectTimeout: FiniteDuration,
      proxyHost: Option[String],
      proxyPort: Option[Int]
  ) derives ConfigReader

  final case class ServerConfig(
      host: String,
      port: Int
  ) derives ConfigReader

  final case class MongoConfig(
      connectionUri: String,
      dbName: String
  ) derives ConfigReader
