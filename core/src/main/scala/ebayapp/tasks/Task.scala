package ebayapp.tasks

import fs2.Stream

trait Task[F[_]] {
  def run(): Stream[F, Unit]
}
