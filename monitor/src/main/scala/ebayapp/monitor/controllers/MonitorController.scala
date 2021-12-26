package ebayapp.monitor.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.applicativeError.*
import cats.syntax.either.*
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import ebayapp.kernel.errors.AppError
import ebayapp.kernel.controllers.Controller
import ebayapp.kernel.controllers.views.ErrorResponse
import ebayapp.monitor.controllers.views.{MonitorView, MonitoringEventView}
import ebayapp.monitor.domain.Monitor
import ebayapp.monitor.services.{MonitorService, MonitoringEventService}
import org.bson.types.ObjectId
import org.http4s.HttpRoutes
import sttp.tapir.*
import sttp.tapir.server.http4s.Http4sServerInterpreter

final private class LiveMonitorController[F[_]](
    private val monitorService: MonitorService[F],
    private val monitoringEventService: MonitoringEventService[F]
)(using
    F: Async[F]
) extends Controller[F]:

  given idCodec: Codec.PlainCodec[Monitor.Id] = Codec.string.mapDecode { id =>
    Either
      .cond(ObjectId.isValid(id), Monitor.Id(id), AppError.Invalid(s"Monitor id $id is invalid"))
      .fold(DecodeResult.Error(id, _), DecodeResult.Value.apply)
  }(_.value)

  private val basePath   = "monitors"
  private val idPath     = basePath / path[Monitor.Id]
  private val eventsPath = idPath / "events"

  private val getAll = endpoint.get
    .in(basePath)
    .errorOut(errorResponse)
    .out(jsonBody[List[MonitorView]])
    .serverLogic { _ =>
      monitorService.getAll
        .map(_.map(MonitorView.from).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val getById = endpoint.get
    .in(idPath)
    .errorOut(errorResponse)
    .out(jsonBody[MonitorView])
    .serverLogic { id =>
      monitorService
        .find(id)
        .flatMap(monitor => F.fromOption(monitor, AppError.NotFound(s"Monitor with id $id does not exist")))
        .map(MonitorView.from(_).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val getEvents = endpoint.get
    .in(eventsPath)
    .errorOut(errorResponse)
    .out(jsonBody[List[MonitoringEventView]])
    .serverLogic { id =>
      monitoringEventService
        .find(id)
        .map(_.map(MonitoringEventView.from).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  override def routes: HttpRoutes[F] =
    Http4sServerInterpreter[F](serverOptions).toRoutes(List(getAll, getById, getEvents))

object MonitorController:
  def make[F[_]: Async](monitorService: MonitorService[F], monitoringEventService: MonitoringEventService[F]): F[Controller[F]] =
    Monad[F].pure(LiveMonitorController[F](monitorService, monitoringEventService))
