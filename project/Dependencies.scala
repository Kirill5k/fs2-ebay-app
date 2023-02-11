import sbt._

object Dependencies {
  private object Versions {
    val mongo4cats      = "0.6.5"
    val pureConfig      = "0.17.2"
    val circe           = "0.14.4"
    val sttp            = "3.8.11"
    val http4s          = "0.23.18"
    val http4sJdkClient = "0.9.0"
    val logback         = "1.4.5"
    val log4cats        = "2.5.0"
    val tapir           = "1.2.8"
    val courier         = "3.2.0"

    val scalaTest    = "3.2.15"
    val mockito      = "3.2.15.0"
    val mockJavaMail = "1.9"
  }

  private object Libraries {
    val courier      = "com.github.daddykotex"  %% "courier"       % Versions.courier
    val mockJavaMail = "org.jvnet.mock-javamail" % "mock-javamail" % Versions.mockJavaMail

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

    object http4s {
      val core          = "org.http4s" %% "http4s-core"            % Versions.http4s
      val dsl           = "org.http4s" %% "http4s-dsl"             % Versions.http4s
      val server        = "org.http4s" %% "http4s-server"          % Versions.http4s
      val emberServer   = "org.http4s" %% "http4s-ember-server"    % Versions.http4s
      val emberClient   = "org.http4s" %% "http4s-ember-client"    % Versions.http4s
      val jdkHttpClient = "org.http4s" %% "http4s-jdk-http-client" % Versions.http4sJdkClient

      val all = Seq(core, dsl, server, emberServer)
    }

    object tapir {
      val core   = "com.softwaremill.sttp.tapir" %% "tapir-core"          % Versions.tapir
      val circe  = "com.softwaremill.sttp.tapir" %% "tapir-json-circe"    % Versions.tapir
      val http4s = "com.softwaremill.sttp.tapir" %% "tapir-http4s-server" % Versions.tapir

      val all = Seq(core, circe, http4s)
    }

    val scalaTest = "org.scalatest"     %% "scalatest"   % Versions.scalaTest
    val mockito   = "org.scalatestplus" %% "mockito-4-6" % Versions.mockito
  }

  val kernel = Seq(
    Libraries.mongo4cats.core,
    Libraries.mongo4cats.circe,
    Libraries.pureconfig.core
  ) ++
    Libraries.circe.all ++
    Libraries.http4s.all ++
    Libraries.logging.all ++
    Libraries.sttp.all ++
    Libraries.tapir.all

  val proxy = Seq(
    Libraries.http4s.emberClient,
    Libraries.http4s.jdkHttpClient
  )

  val monitor = Seq(
    Libraries.courier,
    Libraries.mockJavaMail % Test
  )

  val test = Seq(
    Libraries.scalaTest           % Test,
    Libraries.mockito             % Test,
    Libraries.mongo4cats.embedded % Test
  )
}
