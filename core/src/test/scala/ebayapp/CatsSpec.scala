package ebayapp

import cats.effect.{ContextShift, IO, Timer}
import ebayapp.clients.argos.responses.ArgosItem
import ebayapp.clients.cex.responses.CexItem
import ebayapp.clients.selfridges.mappers.SelfridgesItem
import ebayapp.common.Logger
import ebayapp.domain.ItemDetails
import ebayapp.services.{EbayDealsService, NotificationService, ResellableItemService, Services, StockService}
import org.mockito.ArgumentMatchersSugar
import org.mockito.scalatest.AsyncMockitoSugar
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec

import scala.concurrent.ExecutionContext

trait CatsSpec extends AsyncWordSpec with Matchers with AsyncMockitoSugar with ArgumentMatchersSugar {

  implicit val cs: ContextShift[IO] = IO.contextShift(ExecutionContext.global)
  implicit val timer: Timer[IO]     = IO.timer(ExecutionContext.global)
  implicit val logger: Logger[IO]   = MockLogger.make[IO]

  def servicesMock: Services[IO] = Services[IO](
    mock[NotificationService[IO]],
    mock[ResellableItemService[IO, ItemDetails.Game]],
    mock[EbayDealsService[IO]],
    mock[StockService[IO, CexItem]],
    mock[StockService[IO, SelfridgesItem]],
    mock[StockService[IO, ArgosItem]]
  )
}
