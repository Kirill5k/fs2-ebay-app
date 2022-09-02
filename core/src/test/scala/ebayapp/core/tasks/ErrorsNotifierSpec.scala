package ebayapp.core.tasks

import cats.effect.kernel.Outcome.Errored
import cats.effect.{IO, Temporal}
import ebayapp.core.CatsSpec
import ebayapp.kernel.errors.AppError
import ebayapp.core.common.{Error, Logger}

import scala.concurrent.duration.*

class ErrorsNotifierSpec extends CatsSpec {

  "An ErrorsNotifier" should {

    "send alerts on critical errors" in {
      val services = servicesMock
      when(services.notification.alert(any[Error])).thenReturn(IO.unit)
      val res = for {
        logger          <- Logger.make[IO]
        notifier        <- ErrorsNotifier.make[IO](services)(Temporal[IO], logger)
        notifierProcess <- notifier.run.interruptAfter(1.seconds).compile.drain.start
        _               <- logger.error("omg, error")
        _               <- logger.error("omg, error")
        _               <- notifierProcess.join
      } yield ()

      res.asserting { r =>
        verify(services.notification).alert(any[Error])
        r mustBe ()
      }
    }

    "send termination signal on critical errors" in {
      val services = servicesMock
      val res = for {
        logger          <- Logger.make[IO]
        notifier        <- ErrorsNotifier.make[IO](services)(Temporal[IO], logger)
        notifierProcess <- notifier.run.interruptWhen(logger.awaitSigTerm).compile.drain.start
        _               <- logger.critical("omg, critical error")
        error           <- notifierProcess.join.attempt
      } yield error

      res.asserting { r =>
        r mustBe Right(Errored(AppError.Critical("omg, critical error")))
      }
    }
  }
}
