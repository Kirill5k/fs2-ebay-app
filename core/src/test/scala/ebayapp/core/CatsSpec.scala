package ebayapp.core

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.core.common.Logger
import ebayapp.core.services.{EbayDealsService, NotificationService, ResellableItemService, Services, StockService}
import org.mockito.ArgumentMatchersSugar
import org.mockito.scalatest.AsyncMockitoSugar
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec

trait CatsSpec extends AsyncWordSpec with Matchers with AsyncMockitoSugar with ArgumentMatchersSugar {

  implicit val rt: IORuntime      = IORuntime.global
  implicit val logger: Logger[IO] = MockLogger.make[IO]

  def servicesMock: Services[IO] = new Services[IO] {
    val notification: NotificationService[IO]     = mock[NotificationService[IO]]
    val resellableItem: ResellableItemService[IO] = mock[ResellableItemService[IO]]
    val ebayDeals: EbayDealsService[IO]           = mock[EbayDealsService[IO]]
    val cexStock: StockService[IO]                = mock[StockService[IO]]
    val selfridgesSale: StockService[IO]          = mock[StockService[IO]]
    val argosStock: StockService[IO]              = mock[StockService[IO]]
    val jdsportsSale: StockService[IO]            = mock[StockService[IO]]
    val tessutiSale: StockService[IO]             = mock[StockService[IO]]
    val nvidiaStock: StockService[IO]             = mock[StockService[IO]]
    val scanStock: StockService[IO]               = mock[StockService[IO]]
  }
}
