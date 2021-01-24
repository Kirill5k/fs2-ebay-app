package ebayapp

import cats.effect.IO
import sttp.client3
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend
import sttp.client3.testing.SttpBackendStub
import sttp.model.{Header, HeaderNames, MediaType, Method}

import scala.io.Source

trait SttpClientSpec extends CatsSpec {

  def backendStub: SttpBackendStub[IO, Any] =
    AsyncHttpClientCatsBackend.stub[IO]

  def isGoingTo(
      req: client3.Request[_, _],
      method: Method,
      host: String,
      paths: Seq[String] = Nil,
      params: Map[String, String] = Map.empty
  ): Boolean =
    req.uri.host.get == host &&
      (paths.isEmpty || req.uri.path == paths) &&
      req.method == method &&
      req.uri.params.toMap.toSet[(String, String)].subsetOf(params.toSet)

  def isGoingToWithSpecificContent(
      req: client3.Request[_, _],
      method: Method,
      host: String,
      paths: Seq[String] = Nil,
      params: Map[String, String] = Map.empty,
      contentType: MediaType = MediaType.ApplicationJson
  ): Boolean =
    isGoingTo(req, method, host, paths, params) &&
      req.headers.contains(Header(HeaderNames.Accept, MediaType.ApplicationJson.toString())) &&
      req.headers.contains(Header(HeaderNames.ContentType, contentType.toString()))

  def json(path: String): String = Source.fromResource(path).getLines().toList.mkString
}
