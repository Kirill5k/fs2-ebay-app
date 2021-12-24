package ebayapp.monitor.services

import cats.effect.IO
import ebayapp.kernel.MockitoMatchers
import ebayapp.monitor.actions.ActionDispatcher
import ebayapp.monitor.clients.HttpClient
import ebayapp.monitor.domain.Monitors
import ebayapp.monitor.repositories.{MonitorRepository, MonitoringEventRepository}
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar

class MonitoringEventServiceSpec extends AsyncWordSpec with Matchers with MockitoMatchers with MockitoSugar {

  val monitor = Monitors.gen()

  "A MonitoringEventService" when {
    "UP - DOWN" should {
      "clear downtime and send notification" in {
        pending
      }
    }

    "UP - UP" should {
      "no downtime and no notification" in {
        pending
      }
    }

    "UP - None" should {
      "no downtime and no notification" in {
        pending
      }
    }

    "DOWN - DOWN" should {
      "keep downtime and no notification" in {
        pending
      }
    }

    "DOWN - UP" should {
      "record downtime and send notification" in {
        pending
      }
    }

    "DOWN - None" should {
      "record downtime and no notification" in {
        pending
      }
    }
  }

  def mocks: (ActionDispatcher[IO], MonitoringEventRepository[IO], HttpClient[IO]) =
    (mock[ActionDispatcher[IO]], mock[MonitoringEventRepository[IO]], mock[HttpClient[IO]])
}
