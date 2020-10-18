ThisBuild / scalaVersion     := "2.13.3"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organization     := "io.github.kirill5k"

lazy val noPublish = Seq(
  publish := {},
  publishLocal := {},
  publishArtifact := false,
  publish / skip := true
)

lazy val root = (project in file("."))
  .settings(noPublish)
  .settings(
    name := "fs2-ebay-app",
  )
  .aggregate(core)

lazy val core = (project in file("core"))
  .settings(
    name := "fs2-ebay-app-core",
    scalafmtOnCompile := true,
    libraryDependencies ++= Dependencies.core ++ Dependencies.test
  )

