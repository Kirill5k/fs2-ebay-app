package ebayapp.core.controllers

import cats.effect.Async
import ebayapp.core.common.config.RetailConfig
import ebayapp.core.services.RetailConfigService
import ebayapp.kernel.controllers.Controller
import io.circe.Printer
import org.http4s.HttpRoutes
import sttp.model.StatusCode
import sttp.tapir.*
import sttp.tapir.generic.auto.SchemaDerivation
import sttp.tapir.json.circe.TapirJsonCirce

final private[controllers] class RetailConfigController[F[_]](
    private val service: RetailConfigService[F]
)(using
    F: Async[F]
) extends Controller[F] {

  private val get = RetailConfigController.get
    .serverLogic { _ =>
      service.get.mapResponse(identity)
    }

  private val save = RetailConfigController.save
    .serverLogic { rc =>
      service.save(rc).voidResponse
    }

  override def routes: HttpRoutes[F] =
    serverInterpreter.toRoutes(List(get, save))
}

object RetailConfigController extends TapirJsonCirce with SchemaDerivation {
  override def jsonPrinter: Printer = Printer.spaces2.copy(dropNullValues = true)

  given Schema[RetailConfig] = Schema.string

  private val basePath = "retail-config"

  val get = endpoint.get
    .in(basePath)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[RetailConfig])

  val save = endpoint.post
    .in(basePath)
    .in(jsonBody[RetailConfig])
    .errorOut(Controller.errorResponse)
    .out(statusCode(StatusCode.NoContent))

  def make[F[_]](service: RetailConfigService[F])(using F: Async[F]): F[Controller[F]] =
    F.pure(RetailConfigController(service))
}
