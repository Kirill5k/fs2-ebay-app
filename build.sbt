ThisBuild / scalaVersion     := "2.13.3"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organization     := "io.github.kirill5k"

lazy val noPublish = Seq(
  publish := {},
  publishLocal := {},
  publishArtifact := false,
  publish / skip := true
)

lazy val docker = Seq(
  packageName := moduleName.value,
  version := sys.env.getOrElse("APP_VERSION", version.value),
  maintainer := "immotional@aol.com",
  dockerBaseImage := "jre-14.0.2_12_openj9-0.21.0-alpine",
  dockerUpdateLatest := true,
  makeBatScripts := List()
)

lazy val root = (project in file("."))
  .settings(noPublish)
  .settings(
    name := "fs2-ebay-app",
  )
  .aggregate(core)

lazy val core = (project in file("core"))
  .enablePlugins(JavaAppPackaging, JavaAgent, DockerPlugin)
  .settings(docker)
  .settings(
    name := "fs2-ebay-app-core",
    moduleName := "fs2-ebay-app-core",
    libraryDependencies ++= Dependencies.core ++ Dependencies.test
  )

