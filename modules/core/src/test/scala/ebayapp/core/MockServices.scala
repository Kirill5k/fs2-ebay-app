package ebayapp.core

import cats.effect.IO
import ebayapp.core.services.{DealsService, NotificationService, ResellableItemService, RetailConfigService, Services, StockService}
import org.scalatestplus.mockito.MockitoSugar

object MockServices extends MockitoSugar {
  def make: Services[IO] = new Services[IO] {
    val notification: NotificationService[IO]     = mock[NotificationService[IO]]
    val resellableItem: ResellableItemService[IO] = mock[ResellableItemService[IO]]
    val retailConfig: RetailConfigService[IO]     = mock[RetailConfigService[IO]]
    val stock: List[StockService[IO]]             = List(mock[StockService[IO]], mock[StockService[IO]], mock[StockService[IO]])
    val deals: List[DealsService[IO]]             = List(mock[DealsService[IO]])
  }
}
