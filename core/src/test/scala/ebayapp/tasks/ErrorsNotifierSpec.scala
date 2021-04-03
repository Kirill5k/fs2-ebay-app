package ebayapp.tasks

import cats.effect.{Concurrent, IO, Timer}
import ebayapp.CatsSpec
import ebayapp.common.errors.AppError
import ebayapp.common.{Error, Logger}

import scala.concurrent.duration._

class ErrorsNotifierSpec extends CatsSpec {

  "An ErrorsNotifier" should {

    "send alerts on critical errors" in {
      val services = servicesMock
      when(services.notification.alert(any[Error])).thenReturn(IO.unit)
      val res = for {
        logger          <- Logger.make[IO]
        notifier        <- ErrorsNotifier.make[IO](services)(Concurrent[IO], logger, Timer[IO])
        notifierProcess <- notifier.run().interruptAfter(1.seconds).compile.drain.start
        _               <- logger.error("omg, error")
        _               <- logger.error("omg, error")
        _               <- notifierProcess.join
      } yield ()

      res.unsafeToFuture().map { r =>
        verify(services.notification).alert(any[Error])
        r mustBe ()
      }
    }

    "send termination signal on critical errors" in {
      val services = servicesMock
      val res = for {
        logger          <- Logger.make[IO]
        notifier        <- ErrorsNotifier.make[IO](services)(Concurrent[IO], logger, Timer[IO])
        notifierProcess <- notifier.run().interruptWhen(logger.awaitSigTerm).compile.drain.start
        _               <- logger.critical("omg, critical error")
        error           <- notifierProcess.join.attempt
      } yield error

      res.unsafeToFuture().map { r =>
        r mustBe Left(AppError.Critical("omg, critical error"))
      }
    }
  }
}
