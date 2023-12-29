package ebayapp.kernel

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import org.scalatest.Assertion
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec
import sttp.client3
import sttp.client3.*
import sttp.client3.httpclient.fs2.HttpClientFs2Backend
import sttp.client3.testing.SttpBackendStub
import sttp.model.{Header, HeaderNames, MediaType, Method}

import scala.concurrent.Future

trait SttpClientSpec extends AsyncWordSpec with Matchers {

  def backendStub: SttpBackendStub[IO, Any] =
    HttpClientFs2Backend.stub[IO]

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
    def hasContentType(contentType: MediaType): Boolean =
      hasHeader(HeaderNames.ContentType, contentType.toString())

  extension[A] (io: IO[A])
    def asserting(f: A => Assertion): Future[Assertion] =
      io.map(f).unsafeToFuture()(IORuntime.global)
}
