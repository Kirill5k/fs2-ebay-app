package ebayapp.kernel.syntax

import java.time.temporal.ChronoUnit
import java.time.{Instant, LocalDate, LocalDateTime, ZoneOffset}
import scala.concurrent.duration.*
import scala.util.Try

object time:
  extension (dateString: String)
    def toInstant: Either[Throwable, Instant] =
      val localDate = dateString.length match
        case 10 => s"${dateString}T00:00:00Z"
        case 19 => s"${dateString}Z"
        case _  => dateString
      Try(Instant.parse(localDate)).toEither

  extension (ts: Instant)
    def truncatedToSeconds: Instant = ts.truncatedTo(ChronoUnit.SECONDS)
    def durationBetween(otherTs: Instant): FiniteDuration =
      math.abs(ts.toEpochMilli - otherTs.toEpochMilli).millis

  extension (fd: FiniteDuration)
    def toReadableString: String =
      val days = fd.toDays
      val remHours = fd - days.days
      val hours   = remHours.toHours
      val remMins = remHours - hours.hours
      val minutes = remMins.toMinutes
      val remSecs = remMins - minutes.minutes
      val seconds = remSecs.toSeconds
      val result = s"""
         |${if days > 0 then s"${days}d " else ""}
         |${if hours > 0 then s"${hours}h " else ""}
         |${if minutes > 0 then s"${minutes}m " else ""}
         |${if seconds > 0 then s"${seconds}s " else ""}
         |""".stripMargin.trim.replaceAll("\n", "")
      if result == "" then "0s" else result
