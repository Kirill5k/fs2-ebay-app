import sbt.*

object Dependencies {
  private object Versions {
    val mongo4cats  = "0.7.13"
    val commonScala = "0.1.26"
    val pureConfig  = "0.17.8"
    val circe       = "0.14.12"
    val sttp4       = "4.0.0"
    val sttp        = "3.10.3"
    val http4s      = "0.23.30"
    val logback     = "1.5.18"
    val log4cats    = "2.7.0"
    val tapir       = "1.11.20"
    val courier     = "3.2.0"
    val cronUtils   = "9.2.1"

    val mockJavaMail = "1.9"
  }

  private object Libraries {
    val courier      = "com.github.daddykotex"  %% "courier"       % Versions.courier
    val mockJavaMail = "org.jvnet.mock-javamail" % "mock-javamail" % Versions.mockJavaMail
    val cronUtils    = "com.cronutils"           % "cron-utils"    % Versions.cronUtils

    object commonScala {
      val cats       = "io.github.kirill5k" %% "common-cats"        % Versions.commonScala
      val http4s     = "io.github.kirill5k" %% "common-http4s"      % Versions.commonScala
      val syntax     = "io.github.kirill5k" %% "common-syntax"      % Versions.commonScala
      val testHttp4s = "io.github.kirill5k" %% "common-http4s-test" % Versions.commonScala
      val testSttp   = "io.github.kirill5k" %% "common-sttp-test"   % Versions.commonScala
    }

    object mongo4cats {
      val core     = "io.github.kirill5k" %% "mongo4cats-core"     % Versions.mongo4cats
      val circe    = "io.github.kirill5k" %% "mongo4cats-circe"    % Versions.mongo4cats
      val embedded = "io.github.kirill5k" %% "mongo4cats-embedded" % Versions.mongo4cats
    }

    object pureconfig {
      val core = "com.github.pureconfig" %% "pureconfig-core" % Versions.pureConfig
    }

    object logging {
      val logback  = "ch.qos.logback" % "logback-classic" % Versions.logback
      val log4cats = "org.typelevel" %% "log4cats-slf4j"  % Versions.log4cats

      val all = Seq(log4cats, logback)
    }

    object circe {
      val core    = "io.circe" %% "circe-core"    % Versions.circe
      val generic = "io.circe" %% "circe-generic" % Versions.circe
      val parser  = "io.circe" %% "circe-parser"  % Versions.circe

      val all = Seq(core, generic, parser)
    }

    object sttp {
      val core        = "com.softwaremill.sttp.client3" %% "core"  % Versions.sttp
      val circe       = "com.softwaremill.sttp.client3" %% "circe" % Versions.sttp
      val catsBackend = "com.softwaremill.sttp.client3" %% "fs2"   % Versions.sttp

      val all = Seq(core, circe, catsBackend)
    }

    object sttp4 {
      val core        = "com.softwaremill.sttp.client4" %% "core"  % Versions.sttp4
      val circe       = "com.softwaremill.sttp.client4" %% "circe" % Versions.sttp4
      val catsBackend = "com.softwaremill.sttp.client4" %% "fs2"   % Versions.sttp4

      val all = Seq(core, circe, catsBackend)
    }

    object http4s {
      val dsl         = "org.http4s" %% "http4s-dsl"          % Versions.http4s
      val emberClient = "org.http4s" %% "http4s-ember-client" % Versions.http4s
    }

    object tapir {
      val core   = "com.softwaremill.sttp.tapir" %% "tapir-core"          % Versions.tapir
      val circe  = "com.softwaremill.sttp.tapir" %% "tapir-json-circe"    % Versions.tapir
      val http4s = "com.softwaremill.sttp.tapir" %% "tapir-http4s-server" % Versions.tapir

      val all = Seq(core, circe, http4s)
    }
  }

  val kernel = Seq(
    Libraries.commonScala.cats,
    Libraries.commonScala.syntax,
    Libraries.commonScala.http4s,
    Libraries.mongo4cats.core,
    Libraries.mongo4cats.circe,
    Libraries.pureconfig.core,
    Libraries.http4s.dsl
  ) ++
    Libraries.circe.all ++
    Libraries.logging.all ++
    Libraries.sttp.all ++
    Libraries.sttp4.all ++
    Libraries.tapir.all

  val proxy = Seq(
    Libraries.http4s.emberClient
  )

  val monitor = Seq(
    Libraries.cronUtils,
    Libraries.courier,
    Libraries.mockJavaMail % Test
  )

  val test = Seq(
    Libraries.commonScala.testHttp4s % Test,
    Libraries.commonScala.testSttp   % Test,
    Libraries.mongo4cats.embedded    % Test
  )
}
