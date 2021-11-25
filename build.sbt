import com.typesafe.sbt.packager.docker._

ThisBuild / scalaVersion                        := "3.1.0"
ThisBuild / version                             := scala.sys.process.Process("git rev-parse HEAD").!!.trim.slice(0, 7)
ThisBuild / organization                        := "io.github.kirill5k"
ThisBuild / githubWorkflowPublishTargetBranches := Nil
ThisBuild / githubWorkflowJavaVersions          := Seq("amazon-corretto@1.17")

lazy val noPublish = Seq(
  publish         := {},
  publishLocal    := {},
  publishArtifact := false,
  publish / skip  := true
)

lazy val docker = Seq(
  packageName        := moduleName.value,
  version            := version.value,
  dockerUsername     := sys.env.get("DOCKER_USERNAME"),
  dockerRepository   := sys.env.get("DOCKER_REPO_URI"),
  maintainer         := "immotional@aol.com",
  dockerBaseImage    := "amazoncorretto:17.0.1-alpine",
  dockerUpdateLatest := true,
  makeBatScripts     := Nil,
  dockerCommands := {
    val commands         = dockerCommands.value
    val (stage0, stage1) = commands.span(_ != DockerStageBreak)
    val (before, after)  = stage1.splitAt(4)
    val installBash      = Cmd("RUN", "apk update && apk upgrade && apk add bash && apk add curl")
    stage0 ++ before ++ List(installBash) ++ after
  }
)

lazy val root = project
  .in(file("."))
  .settings(noPublish)
  .settings(
    name := "fs2-ebay-app"
  )
  .aggregate(core, proxy)

lazy val core = project
  .in(file("core"))
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name                 := "fs2-ebay-app-core",
    moduleName           := "fs2-ebay-app-core",
    Docker / packageName := "fs2-app-core", // fs2-app/core
    libraryDependencies ++= Dependencies.core ++ Dependencies.test
  )

lazy val proxy = project
  .in(file("proxy"))
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name                 := "fs2-ebay-app-proxy",
    moduleName           := "fs2-ebay-app-proxy",
    Docker / packageName := "fs2-app-proxy", // fs2-app/proxy
    libraryDependencies ++= Dependencies.proxy ++ Dependencies.test
  )
