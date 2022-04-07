package ebayapp.kernel.common

import java.time.{Instant, LocalDate, LocalDateTime, ZoneOffset}
import scala.concurrent.duration.*
import scala.util.Try

object time:
  extension (dateString: String)
    def toInstant: Either[Throwable, Instant] =
      val localDate =
        if (dateString.length == 10) Try(LocalDate.parse(dateString)).map(_.atStartOfDay().toInstant(ZoneOffset.UTC))
        else if (dateString.length == 19) Try(LocalDateTime.parse(dateString)).map(_.toInstant(ZoneOffset.UTC))
        else Try(Instant.parse(dateString))
      localDate.toEither
      
  extension (ts: Instant)
    def durationBetween(otherTs: Instant): FiniteDuration =
      math.abs(ts.toEpochMilli - otherTs.toEpochMilli).millis
