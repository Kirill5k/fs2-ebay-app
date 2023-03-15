import com.typesafe.sbt.packager.docker._
import sbtghactions.JavaSpec

ThisBuild / scalaVersion                        := "3.2.2"
ThisBuild / version                             := scala.sys.process.Process("git rev-parse HEAD").!!.trim.slice(0, 7)
ThisBuild / organization                        := "io.github.kirill5k"
ThisBuild / githubWorkflowPublishTargetBranches := Nil
ThisBuild / githubWorkflowJavaVersions          := Seq(JavaSpec.temurin("19"))

val noPublish = Seq(
  publish         := {},
  publishLocal    := {},
  publishArtifact := false,
  publish / skip  := true
)

val docker = Seq(
  Universal / javaOptions += "-Djdk.httpclient.allowRestrictedHeaders=cache-control,accept,accept-encoding,accept-language,connection,content-type,content-length,expect,host,referer",
  packageName        := moduleName.value,
  version            := version.value,
  dockerUsername     := sys.env.get("DOCKER_USERNAME"),
  dockerRepository   := sys.env.get("DOCKER_REPO_URI"),
  maintainer         := "immotional@aol.com",
  dockerBaseImage    := "amazoncorretto:19.0.1-alpine",
  dockerUpdateLatest := true,
  dockerEnvVars ++= Map("VERSION" -> version.value),
  dockerCommands := {
    val commands         = dockerCommands.value
    val (stage0, stage1) = commands.span(_ != DockerStageBreak)
    val (before, after)  = stage1.splitAt(4)
    val installBash      = Cmd("RUN", "apk update && apk upgrade && apk add bash && apk add curl")
    stage0 ++ before ++ List(installBash) ++ after
  }
)

val kernel = project
  .in(file("kernel"))
  .settings(
    name       := "fs2-ebay-app-kernel",
    moduleName := "fs2-ebay-app-kernel",
    libraryDependencies ++= Dependencies.kernel ++ Dependencies.test
  )

val core = project
  .in(file("core"))
  .dependsOn(kernel % "test->test;compile->compile")
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name                 := "fs2-ebay-app-core",
    moduleName           := "fs2-ebay-app-core",
    Docker / packageName := "fs2-app-core" // fs2-app/core
  )

val proxy = project
  .in(file("proxy"))
  .dependsOn(kernel % "test->test;compile->compile")
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name                 := "fs2-ebay-app-proxy",
    moduleName           := "fs2-ebay-app-proxy",
    Docker / packageName := "fs2-app-proxy", // fs2-app/proxy
    libraryDependencies ++= Dependencies.proxy
  )

val monitor = project
  .in(file("monitor"))
  .dependsOn(kernel % "test->test;compile->compile")
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name                 := "fs2-ebay-app-monitor",
    moduleName           := "fs2-ebay-app-monitor",
    Docker / packageName := "fs2-app-monitor", // fs2-app/monitor
    libraryDependencies ++= Dependencies.monitor
  )

val root = project
  .in(file("."))
  .settings(noPublish)
  .settings(
    name := "fs2-ebay-app"
  )
  .aggregate(core, proxy, monitor)
