package ebayapp.core.common

import cats.Monad
import cats.effect.{Async, Ref, Sync}
import cats.effect.syntax.spawn.*
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import cats.syntax.apply.*
import cats.syntax.functor.*
import ebayapp.core.common.config.AppConfig

import java.nio.file.Paths
import java.time.Instant
import scala.concurrent.duration.*

trait ConfigProvider[F[_]]:
  def config: F[AppConfig]

final private class LiveConfigProvider[F[_]](
    private val state: Ref[F, AppConfig]
)(using
    F: Monad[F]
) extends ConfigProvider[F] {
  override def config: F[AppConfig] = state.get
}

object ConfigProvider:

  def make[F[_]](reloadEvery: FiniteDuration)(using F: Async[F], logger: Logger[F]): F[ConfigProvider[F]] = {
    def reloadUpdatedConfig(state: Ref[F, AppConfig]): F[Unit] =
      F.sleep(reloadEvery) *>
        (mountedConfigModifiedDate, F.realTimeInstant).mapN { (modifiedDate, now) =>
          F.whenA(modifiedDate.plusSeconds(reloadEvery.toSeconds + 30L).isAfter(now)) {
            F.blocking(AppConfig.loadFromMount).flatMap(c => logger.info("reloading updated config from mount") *> state.set(c))
          }
        }.flatten *>
        reloadUpdatedConfig(state)

    F
      .blocking(AppConfig.loadFromMount)
      .flatMap(c => logger.info("loaded config from a configmap mount") *> Ref.of(c))
      .flatTap(s => reloadUpdatedConfig(s).start.void)
      .handleErrorWith { e =>
        logger.warn(s"error loading config from a configmap mount, will try resources: ${e.getMessage}") *>
          F.blocking(AppConfig.loadDefault).flatMap(c => Ref.of(c))
      }
      .map(LiveConfigProvider(_))
  }

  private def mountedConfigModifiedDate[F[_]](using F: Sync[F]): F[Instant] =
    F.delay(Paths.get(AppConfig.mountedConfigPath).toFile.lastModified()).map(Instant.ofEpochMilli)
