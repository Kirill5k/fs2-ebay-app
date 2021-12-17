package ebayapp.core

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.core.common.Logger
import ebayapp.core.services.{DealsService, NotificationService, ResellableItemService, Services, StockService}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatestplus.mockito.MockitoSugar

trait CatsSpec extends AsyncWordSpec with Matchers with MockitoSugar with MockitoMatchers {

  given rt: IORuntime      = IORuntime.global
  given logger: Logger[IO] = MockLogger.make[IO]

  def servicesMock: Services[IO] = new Services[IO] {
    val notification: NotificationService[IO]     = mock[NotificationService[IO]]
    val resellableItem: ResellableItemService[IO] = mock[ResellableItemService[IO]]
    val stock: List[StockService[IO]]             = List(mock[StockService[IO]], mock[StockService[IO]], mock[StockService[IO]])
    val deals: List[DealsService[IO]]             = List(mock[DealsService[IO]])
  }
}
