package ebayapp.monitor.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.flatMap.*
import ebayapp.kernel.errors.AppError
import ebayapp.kernel.controllers.Controller
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
import sttp.tapir.generic.auto.SchemaDerivation
import sttp.tapir.json.circe.TapirJsonCirce

import scala.concurrent.duration.FiniteDuration

final private class LiveMonitorController[F[_]](
    private val monitorService: MonitorService[F],
    private val monitoringEventService: MonitoringEventService[F]
)(using
    F: Async[F]
) extends Controller[F] {

  private def parseId(id: String): F[Monitor.Id] =
    F.fromEither(Either.cond(ObjectId.isValid(id), Monitor.Id(id), AppError.Invalid(s"Monitor id $id is invalid")))

  private val getAll = MonitorController.getAll
    .serverLogic { _ =>
      monitorService.getAll.mapResponse(_.map(MonitorView.from))
    }

  private val getById = MonitorController.getById
    .serverLogic { id =>
      parseId(id)
        .flatMap(monitorService.find)
        .flatMap(monitor => F.fromOption(monitor, AppError.NotFound(s"Monitor with id $id does not exist")))
        .mapResponse(MonitorView.from)
    }

  private val update = MonitorController.update
    .serverLogic { (id, mon) =>
      F.raiseWhen(id != mon.id)(AppError.Failed(s"Id in path is different from id in the request body"))
        .flatMap(_ => monitorService.update(mon.toDomain))
        .voidResponse
    }

  private val createNew = MonitorController.createNew
    .serverLogic { create =>
      monitorService
        .create(create.toDomain)
        .mapResponse(m => CreateMonitorResponse(m.id.value))
    }

  private val activate = MonitorController.activate
    .serverLogic { (id, request) =>
      parseId(id)
        .flatMap(id => monitorService.activate(id, request.active))
        .voidResponse
    }

  private val getEvents = MonitorController.getEvents
    .serverLogic { (id, limit) =>
      parseId(id)
        .flatMap(mid => monitoringEventService.find(mid, limit.getOrElse(25)))
        .mapResponse(_.map(MonitoringEventView.from))
    }

  private val delete = MonitorController.delete
    .serverLogic { id =>
      parseId(id)
        .flatMap(monitorService.delete)
        .voidResponse
    }

  override def routes: HttpRoutes[F] =
    serverInterpreter.toRoutes(List(getAll, getById, createNew, getEvents, activate, update, delete))
}

object MonitorController extends TapirJsonCirce with SchemaDerivation {
  given Schema[HttpMethod]         = Schema.string
  given Schema[Url]                = Schema.string
  given Schema[FiniteDuration]     = Schema.string
  given Schema[Monitor.Contact]    = Schema.string
  given Schema[Monitor.Connection] = Schema.string
  given Schema[Monitor.Status]     = Schema.string

  private val basePath   = "monitors"
  private val idPath     = basePath / path[String]
  private val eventsPath = idPath / "events"

  val getAll = endpoint.get
    .in(basePath)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[List[MonitorView]])

  val getById = endpoint.get
    .in(idPath)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[MonitorView])

  val update = endpoint.put
    .in(idPath)
    .in(jsonBody[MonitorView])
    .errorOut(Controller.errorResponse)
    .out(statusCode(StatusCode.NoContent))

  val createNew = endpoint.post
    .in(basePath)
    .in(jsonBody[CreateMonitorRequest])
    .errorOut(Controller.errorResponse)
    .out(statusCode(StatusCode.Created).and(jsonBody[CreateMonitorResponse]))

  val activate = endpoint.put
    .in(idPath / "active")
    .in(jsonBody[ActivateMonitorRequest])
    .errorOut(Controller.errorResponse)
    .out(statusCode(StatusCode.NoContent))

  val getEvents = endpoint.get
    .in(eventsPath)
    .in(query[Option[Int]]("limit"))
    .errorOut(Controller.errorResponse)
    .out(jsonBody[List[MonitoringEventView]])

  val delete = endpoint.delete
    .in(idPath)
    .errorOut(Controller.errorResponse)
    .out(statusCode(StatusCode.NoContent))

  def make[F[_]: Async](monitors: MonitorService[F], monitoringEvents: MonitoringEventService[F]): F[Controller[F]] =
    Monad[F].pure(LiveMonitorController[F](monitors, monitoringEvents))
}
