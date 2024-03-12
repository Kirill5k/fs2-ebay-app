package ebayapp.kernel

import pureconfig.*
import pureconfig.generic.derivation.default.*
import kirill5k.common.http4s.Server

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

  object ServerConfig:
    given Conversion[ServerConfig, Server.Config] =
      (sc: ServerConfig) => Server.Config(sc.host, sc.port)

  final case class MongoConfig(
      connectionUri: String,
      dbName: String
  ) derives ConfigReader
