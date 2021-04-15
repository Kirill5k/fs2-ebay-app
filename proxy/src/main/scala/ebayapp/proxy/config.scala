package ebayapp.proxy

import cats.effect.{Blocker, ContextShift, Sync}
import pureconfig._
import pureconfig.generic.auto._
import pureconfig.module.catseffect.syntax._

object config {

  final case class RedirectionUrisConfig(
      cex: String,
      selfridges: String,
      jdsports: String
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

    def load[F[_]: Sync: ContextShift](blocker: Blocker): F[AppConfig] =
      ConfigSource.default.loadF[F, AppConfig](blocker)
  }

}
