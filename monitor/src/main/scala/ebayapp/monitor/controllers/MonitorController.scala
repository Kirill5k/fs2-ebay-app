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
import ebayapp.monitor.controllers.views.{
  ActivateMonitorRequest,
  CreateMonitorRequest,
  CreateMonitorResponse,
  MonitorView,
  MonitoringEventView
}
import ebayapp.monitor.domain.{HttpMethod, Monitor, Url}
import ebayapp.monitor.services.{MonitorService, MonitoringEventService}
import org.bson.types.ObjectId
import org.http4s.HttpRoutes
import sttp.model.StatusCode
import sttp.tapir.*
import sttp.tapir.generic.SchemaDerivation
import sttp.tapir.server.http4s.Http4sServerInterpreter

import scala.concurrent.duration.FiniteDuration

final private class LiveMonitorController[F[_]](
    private val monitorService: MonitorService[F],
    private val monitoringEventService: MonitoringEventService[F]
)(using
    F: Async[F]
) extends Controller[F] with SchemaDerivation:

  given methodSchema: Schema[HttpMethod] = Schema.string
  given urlSchema: Schema[Url]           = Schema.string
  given fdSchema: Schema[FiniteDuration] = Schema.string

  private val basePath   = "monitors"
  private val idPath     = basePath / path[String]
  private val eventsPath = idPath / "events"

  private def parseId(id: String): F[Monitor.Id] =
    F.fromEither(Either.cond(ObjectId.isValid(id), Monitor.Id(id), AppError.Invalid(s"Monitor id $id is invalid")))

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
      parseId(id)
        .flatMap(monitorService.find)
        .flatMap(monitor => F.fromOption(monitor, AppError.NotFound(s"Monitor with id $id does not exist")))
        .map(MonitorView.from(_).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val update = endpoint.put
    .in(idPath)
    .in(jsonBody[MonitorView])
    .errorOut(errorResponse)
    .out(statusCode(StatusCode.NoContent))
    .serverLogic { (id, mon) =>
      F.fromEither(Either.cond(id == mon.id, (), AppError.Failed(s"Id in path is different from id in the request body")))
        .flatMap(_ => monitorService.update(mon.toDomain))
        .as(().asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val createNew = endpoint.post
    .in(basePath)
    .in(jsonBody[CreateMonitorRequest])
    .errorOut(errorResponse)
    .out(statusCode(StatusCode.Created).and(jsonBody[CreateMonitorResponse]))
    .serverLogic { create =>
      monitorService
        .create(create.toDomain)
        .map(m => CreateMonitorResponse(m.id.value).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val activate = endpoint.put
    .in(idPath / "active")
    .in(jsonBody[ActivateMonitorRequest])
    .errorOut(errorResponse)
    .out(statusCode(StatusCode.NoContent))
    .serverLogic { (id, request) =>
      parseId(id)
        .flatMap(id => monitorService.activate(id, request.active))
        .map(_.asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val getEvents = endpoint.get
    .in(eventsPath)
    .errorOut(errorResponse)
    .out(jsonBody[List[MonitoringEventView]])
    .serverLogic { id =>
      parseId(id)
        .flatMap(monitoringEventService.find)
        .map(_.map(MonitoringEventView.from).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val delete = endpoint.delete
    .in(idPath)
    .errorOut(errorResponse)
    .out(statusCode(StatusCode.NoContent))
    .serverLogic { id =>
      parseId(id)
        .flatMap(monitorService.delete)
        .map(_.asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  override def routes: HttpRoutes[F] =
    Http4sServerInterpreter[F](serverOptions).toRoutes(List(getAll, getById, createNew, getEvents, activate, update, delete))

object MonitorController:
  def make[F[_]: Async](monitorService: MonitorService[F], monitoringEventService: MonitoringEventService[F]): F[Controller[F]] =
    Monad[F].pure(LiveMonitorController[F](monitorService, monitoringEventService))
