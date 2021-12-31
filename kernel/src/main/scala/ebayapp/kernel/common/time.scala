package ebayapp.kernel.common

import java.time.Instant
import scala.concurrent.duration._

object time:
  extension (ts: Instant)
    def durationBetween(otherTs: Instant): FiniteDuration =
      math.abs(ts.toEpochMilli - otherTs.toEpochMilli).millis
