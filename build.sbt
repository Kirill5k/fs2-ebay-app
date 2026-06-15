import com.typesafe.sbt.packager.docker.*
import sbtghactions.JavaSpec
import org.typelevel.scalacoptions.ScalacOptions

githubWorkflowDir := (LocalRootProject / baseDirectory).value / ".github"

ThisBuild / scalaVersion                        := "3.8.3"
ThisBuild / version                             := scala.sys.process.Process("git rev-parse HEAD").!!.trim.slice(0, 7)
ThisBuild / organization                        := "io.github.kirill5k"
ThisBuild / githubWorkflowPublishTargetBranches := Nil
ThisBuild / githubWorkflowJavaVersions          := Seq(JavaSpec.corretto("26"))
ThisBuild / scalacOptions ++= Seq("-Wunused:all")

val noPublish = Seq(
  publish         := {},
  publishLocal    := {},
  publishArtifact := false,
  publish / skip  := true
)

val docker = Seq(
  dockerEnvVars ++= Map("VERSION" -> version.value),
  packageName        := moduleName.value,
  version            := version.value,
  maintainer         := "immotional@aol.com",
  dockerUsername     := sys.env.get("DOCKER_USERNAME"),
  dockerRepository   := sys.env.get("DOCKER_REPO_URI"),
  dockerBaseImage    := "amazoncorretto:26",
  dockerUpdateLatest := true,
  dockerCommands     := {
    val commands         = dockerCommands.value
    val (stage0, stage1) = commands.span(_ != DockerStageBreak)
    val (before, after)  = stage1.splitAt(4)
    val installDeps = Cmd("RUN", "dnf install -y --allowerasing bash curl nss ca-certificates zlib tar gzip shadow-utils && dnf clean all")
    val installCurlImpersonate = Cmd(
      "RUN",
      "curl -sL https://github.com/lwthiker/curl-impersonate/releases/download/v0.6.1/curl-impersonate-v0.6.1.x86_64-linux-gnu.tar.gz -o /tmp/curl-impersonate.tar.gz && " +
        "tar -xzf /tmp/curl-impersonate.tar.gz -C /usr/local/bin && " +
        "rm /tmp/curl-impersonate.tar.gz"
    )
    stage0 ++ before ++ List(installDeps, installCurlImpersonate) ++ after
  }
)

val common = Seq(
  Test / tpolecatExcludeOptions ++= Set(ScalacOptions.warnNonUnitStatement),
  tpolecatExcludeOptions ++= Set(ScalacOptions.fatalWarnings),
  scalacOptions += "-Werror"
)

val kernel = project
  .in(file("modules/kernel"))
  .settings(common)
  .settings(
    name       := "fs2-ebay-app-kernel",
    moduleName := "fs2-ebay-app-kernel",
    libraryDependencies ++= Dependencies.kernel ++ Dependencies.test
  )

val core = project
  .in(file("modules/core"))
  .dependsOn(kernel % "test->test;compile->compile")
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(common)
  .settings(docker)
  .settings(
    name                 := "fs2-ebay-app-core",
    moduleName           := "fs2-ebay-app-core",
    Docker / packageName := "fs2-app-core" // fs2-app/core
  )

val proxy = project
  .in(file("modules/proxy"))
  .dependsOn(kernel % "test->test;compile->compile")
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(common)
  .settings(
    name                 := "fs2-ebay-app-proxy",
    moduleName           := "fs2-ebay-app-proxy",
    Docker / packageName := "fs2-app-proxy", // fs2-app/proxy
    libraryDependencies ++= Dependencies.proxy
  )

val monitor = project
  .in(file("modules/monitor"))
  .dependsOn(kernel % "test->test;compile->compile")
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(common)
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
