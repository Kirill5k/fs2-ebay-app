package ebayapp.monitor.services

import cats.effect.IO
import ebayapp.kernel.MockitoMatchers
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar
import org.typelevel.log4cats.Logger
import org.typelevel.log4cats.slf4j.Slf4jLogger

class NotificationServiceSpec extends AsyncWordSpec with Matchers with MockitoMatchers with MockitoSugar {
  
  given logger: Logger[IO] = Slf4jLogger.getLogger[IO] 
  
  "A NotificationService" should {
    "email monitor is UP notification" in {
      pending
    }
    
    "email monitor is DOWN notification" in {
      pending
    }
  }
}
