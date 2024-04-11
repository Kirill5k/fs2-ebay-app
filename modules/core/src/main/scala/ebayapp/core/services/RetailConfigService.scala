package ebayapp.core.services

import cats.Applicative
import ebayapp.core.common.config.RetailConfig
import ebayapp.core.repositories.RetailConfigRepository

trait RetailConfigService[F[_]]:
  def save(rc: RetailConfig): F[Unit]
  def get: F[Option[RetailConfig]]

final private class LiveRetailConfigService[F[_]](
    private val repository: RetailConfigRepository[F]
) extends RetailConfigService[F]:
  override def save(rc: RetailConfig): F[Unit] = repository.save(rc)
  override def get: F[Option[RetailConfig]]    = repository.get

object RetailConfigService:
  def make[F[_]: Applicative](repo: RetailConfigRepository[F]): F[RetailConfigService[F]] =
    Applicative[F].pure(LiveRetailConfigService(repo))
