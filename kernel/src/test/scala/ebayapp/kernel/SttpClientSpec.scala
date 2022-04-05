package ebayapp.kernel

import cats.effect.IO
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec
import sttp.client3
import sttp.client3.*
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend
import sttp.client3.testing.SttpBackendStub
import sttp.model.{Header, HeaderNames, MediaType, Method}

trait SttpClientSpec extends AsyncWordSpec with Matchers {

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

  def json(path: String): String = FileReader.fromResources(path)

  extension (req: client3.Request[_, _])
    def isPost: Boolean                                 = req.method == Method.POST
    def isGet: Boolean                                  = req.method == Method.GET
    def isPut: Boolean                                  = req.method == Method.PUT
    def hasBearerToken(token: String): Boolean          = req.headers.contains(new Header("Authorization", s"Bearer $token"))
    def hasBody(json: String): Boolean                  = req.body.toString.contains(json)
    def hasHost(host: String): Boolean                  = req.uri.host.contains(host)
    def hasPath(path: String): Boolean                  = req.uri.path == path.split("/").filter(_.nonEmpty).toList
    def hasHeader(name: String, value: String): Boolean = req.headers.map(h => h.name -> h.value).toSet.contains(name -> value)
    def bodyContains(body: String): Boolean             = req.body.toString.contains(body)
    def hasParams(params: Map[String, String]): Boolean = params.toSet.subsetOf(req.uri.params.toMap.toSet[(String, String)])
    def isGoingTo(url: String): Boolean = {
      val urlParts = url.split("/")
      hasHost(urlParts.head) && req.uri.path.startsWith(urlParts.tail.filter(_.nonEmpty).toList)
    }
}
