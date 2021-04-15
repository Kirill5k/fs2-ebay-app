import com.typesafe.sbt.packager.docker._

ThisBuild / scalaVersion := "2.13.5"
ThisBuild / version := scala.sys.process.Process("git rev-parse HEAD").!!.trim.slice(0, 7)
ThisBuild / organization := "io.github.kirill5k"

lazy val noPublish = Seq(
  publish := {},
  publishLocal := {},
  publishArtifact := false,
  publish / skip := true
)

lazy val docker = Seq(
  packageName := moduleName.value,
  version := version.value,
  maintainer := "immotional@aol.com",
  dockerBaseImage := "adoptopenjdk/openjdk16-openj9:x86_64-alpine-jre-16_36_openj9-0.25.0",
  dockerUpdateLatest := true,
  makeBatScripts := List(),
  dockerRepository := Some("us.gcr.io"),
  dockerCommands := {
    val commands         = dockerCommands.value
    val (stage0, stage1) = commands.span(_ != DockerStageBreak)
    val (before, after)  = stage1.splitAt(4)
    val installBash      = Cmd("RUN", "apk update && apk upgrade && apk add bash")
    stage0 ++ before ++ List(installBash) ++ after
  }
)

lazy val root = (project in file("."))
  .settings(noPublish)
  .settings(
    name := "fs2-ebay-app"
  )
  .aggregate(core, proxy)

lazy val core = (project in file("core"))
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name := "fs2-ebay-app-core",
    moduleName := "fs2-ebay-app-core",
    Docker / packageName := "fs2-app/core",
    libraryDependencies ++= Dependencies.core ++ Dependencies.test
  )

lazy val proxy = (project in file("proxy"))
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name := "fs2-ebay-app-proxy",
    moduleName := "fs2-ebay-app-proxy",
    Docker / packageName := "fs2-app/proxy",
    libraryDependencies ++= Dependencies.proxy ++ Dependencies.test
  )
