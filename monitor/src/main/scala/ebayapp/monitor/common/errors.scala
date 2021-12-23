package ebayapp.monitor.common

import ebayapp.monitor.domain.Monitor

object errors {
  sealed trait AppError extends Throwable:
    def message: String
    override def getMessage: String = message

  object AppError:
    final case class MonitorNotFound(id: Monitor.Id) extends AppError:
      val message: String = s"Monitor with $id does not exist"
}
