import com.typesafe.sbt.packager.docker.*
import sbtghactions.JavaSpec

ThisBuild / scalaVersion                        := "3.5.1"
ThisBuild / version                             := scala.sys.process.Process("git rev-parse HEAD").!!.trim.slice(0, 7)
ThisBuild / organization                        := "io.github.kirill5k"
ThisBuild / githubWorkflowPublishTargetBranches := Nil
ThisBuild / githubWorkflowJavaVersions          := Seq(JavaSpec.temurin("23"))
ThisBuild / scalacOptions ++= Seq("-Wunused:all")

val noPublish = Seq(
  publish         := {},
  publishLocal    := {},
  publishArtifact := false,
  publish / skip  := true
)

val docker = Seq(
  Universal / javaOptions += "-Djdk.httpclient.allowRestrictedHeaders=cache-control,accept,accept-encoding,accept-language,connection,content-type,content-length,expect,host,referer",
  dockerEnvVars ++= Map("VERSION" -> version.value),
  packageName        := moduleName.value,
  version            := version.value,
  maintainer         := "immotional@aol.com",
  dockerUsername     := sys.env.get("DOCKER_USERNAME"),
  dockerRepository   := sys.env.get("DOCKER_REPO_URI"),
  dockerBaseImage    := "amazoncorretto:23-alpine",
  dockerUpdateLatest := true,
  dockerCommands := {
    val commands         = dockerCommands.value
    val (stage0, stage1) = commands.span(_ != DockerStageBreak)
    val (before, after)  = stage1.splitAt(4)
    val installBash      = Cmd("RUN", "apk update && apk upgrade && apk add bash && apk add curl")
    stage0 ++ before ++ List(installBash) ++ after
  }
)

val kernel = project
  .in(file("modules/kernel"))
  .settings(
    name       := "fs2-ebay-app-kernel",
    moduleName := "fs2-ebay-app-kernel",
    libraryDependencies ++= Dependencies.kernel ++ Dependencies.test,
    Test / scalacOptions += "-Wconf:msg=unused value of type:silent"
  )

val core = project
  .in(file("modules/core"))
  .dependsOn(kernel % "test->test;compile->compile")
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name                 := "fs2-ebay-app-core",
    moduleName           := "fs2-ebay-app-core",
    Docker / packageName := "fs2-app-core", // fs2-app/core
    Test / scalacOptions += "-Wconf:msg=unused value of type:silent"
  )

val proxy = project
  .in(file("modules/proxy"))
  .dependsOn(kernel % "test->test;compile->compile")
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name                 := "fs2-ebay-app-proxy",
    moduleName           := "fs2-ebay-app-proxy",
    Docker / packageName := "fs2-app-proxy", // fs2-app/proxy
    libraryDependencies ++= Dependencies.proxy,
    Test / scalacOptions += "-Wconf:msg=unused value of type:silent"
  )

val monitor = project
  .in(file("modules/monitor"))
  .dependsOn(kernel % "test->test;compile->compile")
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name                 := "fs2-ebay-app-monitor",
    moduleName           := "fs2-ebay-app-monitor",
    Docker / packageName := "fs2-app-monitor", // fs2-app/monitor
    libraryDependencies ++= Dependencies.monitor,
    Test / scalacOptions += "-Wconf:msg=unused value of type:silent"
  )

val root = project
  .in(file("."))
  .settings(noPublish)
  .settings(
    name := "fs2-ebay-app"
  )
  .aggregate(core, proxy, monitor)
