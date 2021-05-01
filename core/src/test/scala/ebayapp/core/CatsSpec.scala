package ebayapp.core

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.core.clients.argos.responses.ArgosItem
import ebayapp.core.clients.cex.responses.CexItem
import ebayapp.core.clients.jdsports.mappers.JdsportsItem
import ebayapp.core.clients.nvidia.responses.NvidiaItem
import ebayapp.core.clients.scan.parsers.ScanItem
import ebayapp.core.clients.selfridges.mappers.SelfridgesItem
import ebayapp.core.common.Logger
import ebayapp.core.domain.ItemDetails
import ebayapp.core.services.{EbayDealsService, NotificationService, ResellableItemService, Services, StockService}
import org.mockito.ArgumentMatchersSugar
import org.mockito.scalatest.AsyncMockitoSugar
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec

trait CatsSpec extends AsyncWordSpec with Matchers with AsyncMockitoSugar with ArgumentMatchersSugar {

  implicit val rt: IORuntime      = IORuntime.global
  implicit val logger: Logger[IO] = MockLogger.make[IO]

  def servicesMock: Services[IO] = new Services[IO] {
    val notification: NotificationService[IO]                  = mock[NotificationService[IO]]
    val videoGame: ResellableItemService[IO, ItemDetails.Game] = mock[ResellableItemService[IO, ItemDetails.Game]]
    val ebayDeals: EbayDealsService[IO]                        = mock[EbayDealsService[IO]]
    val cexStock: StockService[IO, CexItem]                    = mock[StockService[IO, CexItem]]
    val selfridgesSale: StockService[IO, SelfridgesItem]       = mock[StockService[IO, SelfridgesItem]]
    val argosStock: StockService[IO, ArgosItem]                = mock[StockService[IO, ArgosItem]]
    val jdsportsSale: StockService[IO, JdsportsItem]           = mock[StockService[IO, JdsportsItem]]
    val nvidiaStock: StockService[IO, NvidiaItem]              = mock[StockService[IO, NvidiaItem]]
    val scanStock: StockService[IO, ScanItem]                  = mock[StockService[IO, ScanItem]]
  }
}
