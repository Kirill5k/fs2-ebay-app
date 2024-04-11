package ebayapp.core.services

import cats.{Applicative, MonadThrow}
import cats.syntax.flatMap.*
import ebayapp.core.common.config.RetailConfig
import ebayapp.core.repositories.RetailConfigRepository
import ebayapp.kernel.errors.AppError

trait RetailConfigService[F[_]]:
  def save(rc: RetailConfig): F[Unit]
  def get: F[RetailConfig]

final private class LiveRetailConfigService[F[_]](
    private val repository: RetailConfigRepository[F]
)(using
    F: MonadThrow[F]
) extends RetailConfigService[F]:
  override def save(rc: RetailConfig): F[Unit] =
    repository.save(rc)
  override def get: F[RetailConfig] =
    repository.get.flatMap(rc => F.fromOption(rc, AppError.NotFound("couldn't find retail config in database")))

object RetailConfigService:
  def make[F[_]: MonadThrow](repo: RetailConfigRepository[F]): F[RetailConfigService[F]] =
    Applicative[F].pure(LiveRetailConfigService(repo))
