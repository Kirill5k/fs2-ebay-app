package ebayapp.core.tasks

import cats.effect.kernel.Outcome.Errored
import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.kernel.errors.AppError
import ebayapp.core.common.{Error, Logger}

import scala.concurrent.duration.*

class ErrorsNotifierSpec extends CatsSpec {

  "An ErrorsNotifier" should {

    "send alerts on critical errors" in {
      val services = servicesMock
      when(services.notification.alert(any[Error])).thenReturn(IO.unit)

      val res = Logger.make[IO].flatMap { implicit logger =>
        for
          notifier        <- ErrorsNotifier.make[IO](services)
          notifierProcess <- notifier.run.interruptAfter(2.seconds).compile.drain.start
          _               <- logger.error("omg, error")
          _               <- logger.error("omg, error")
          _               <- notifierProcess.join
        yield ()
      }

      res.asserting { r =>
        verify(services.notification).alert(any[Error])
        r mustBe ()
      }
    }

    "send termination signal on critical errors" in {
      val services = servicesMock
      val res = Logger.make[IO].flatMap { implicit logger =>
        for {
          logger          <- Logger.make[IO]
          notifier        <- ErrorsNotifier.make[IO](services)
          notifierProcess <- notifier.run.interruptWhen(logger.awaitSigTerm).compile.drain.start
          _               <- logger.critical("omg, critical error")
          error           <- notifierProcess.join.attempt
        } yield error
      }

      res.asserting { r =>
        r mustBe Right(Errored(AppError.Critical("omg, critical error")))
      }
    }
  }
}
