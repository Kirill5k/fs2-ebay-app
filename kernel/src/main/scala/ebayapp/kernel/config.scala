package ebayapp.kernel

import pureconfig.*
import pureconfig.generic.derivation.default.*

object config:
  final case class ServerConfig(host: String, port: Int) derives ConfigReader
  final case class MongoConfig(connectionUri: String, dbName: String) derives ConfigReader
