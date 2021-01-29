package ebayapp.tasks

import cats.effect.{IO, Sync}
import ebayapp.CatsSpec
import ebayapp.common.{CriticalError, Logger}
import ebayapp.domain.ItemDetails
import ebayapp.services._

import scala.concurrent.duration._

class ErrorsNotifierSpec extends CatsSpec {

  "An ErrorsNotifier" should {

    "send alerts on critical errors" in {
      val services = mocks
      when(services.notification.alert(any[CriticalError])).thenReturn(IO.unit)
      val res = for {
        logger          <- Logger.make[IO]
        notifier        <- ErrorsNotifier.make[IO](services)(Sync[IO], logger)
        notifierProcess <- notifier.alertOnErrors().interruptAfter(1.seconds).compile.drain.start
        _               <- logger.critical("omg, critical error")
        _               <- notifierProcess.join
      } yield ()

      res.unsafeToFuture().map { r =>
        verify(services.notification).alert(any[CriticalError])
        r mustBe ()
      }
    }
  }

  def mocks: Services[IO] = Services[IO](
    mock[NotificationService[IO]],
    mock[ResellableItemService[IO, ItemDetails.Game]],
    mock[EbayDealsService[IO]],
    mock[CexStockService[IO]],
    mock[SelfridgesSaleService[IO]]
  )
}
