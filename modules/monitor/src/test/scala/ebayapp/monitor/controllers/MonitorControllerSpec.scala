package ebayapp.monitor.controllers

import cats.effect.IO
import ebayapp.kernel.ControllerSpec
import ebayapp.kernel.errors.AppError
import ebayapp.monitor.services.{MonitorService, MonitoringEventService}
import ebayapp.monitor.domain.{CreateMonitor, Monitor, Monitors}
import org.http4s.implicits.*
import org.http4s.*
import org.scalatest.EitherValues

class MonitorControllerSpec extends ControllerSpec with EitherValues {

  "A MonitorController" when {

    "DELETE /monitors/:id" should {
      "delete a monitor and return 204" in {
        val (monSvc, meSvc) = mocks
        when(monSvc.delete(any[Monitor.Id])).thenReturnUnit

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val request  = Request[IO](uri = Uri.fromString(s"/monitors/${Monitors.id}").value, method = Method.DELETE)
        val response = controller.routes.orNotFound.run(request)

        verifyJsonResponse(response, Status.NoContent, None)
        verify(monSvc).delete(Monitors.id)
        verifyNoInteractions(meSvc)
      }

      "return 422 when id is invalid" in {
        val (monSvc, meSvc) = mocks
        val controller      = new LiveMonitorController[IO](monSvc, meSvc)

        val request  = Request[IO](uri = Uri.fromString(s"/monitors/fooo").value, method = Method.DELETE)
        val response = controller.routes.orNotFound.run(request)

        verifyJsonResponse(response, Status.UnprocessableEntity, Some("""{"message":"Monitor id fooo is invalid"}"""))
        verifyNoInteractions(meSvc, monSvc)
      }
    }

    "PUT /monitors/:id" should {
      "activate monitor and return 204" in {
        val monitor         = Monitors.monitor
        val (monSvc, meSvc) = mocks
        when(monSvc.update(any[Monitor])).thenReturnUnit

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val requestBody =
          s"""{
             |"id": "${monitor.id}",
             |"name": "${monitor.name}",
             |"active": true,
             |"interval": "10 minutes",
             |"connection": {
             |  "Http": {
             |    "url": "http://foo.bar",
             |    "method": "GET",
             |    "timeout": "1 minute"
             |  }
             |},
             |"contact": {
             |  "Email": {
             |    "email": "foo@bar.com"
             |  }
             |}
             |}""".stripMargin

        val request  = Request[IO](uri = Uri.fromString(s"/monitors/${Monitors.id}").value, method = Method.PUT).withEntity(requestBody)
        val response = controller.routes.orNotFound.run(request)

        verifyJsonResponse(response, Status.NoContent, None)
        verify(monSvc).update(monitor)
        verifyNoInteractions(meSvc)
      }

      "return 400 when ids do not match" in {
        val (monSvc, meSvc) = mocks
        val controller      = new LiveMonitorController[IO](monSvc, meSvc)

        val requestBody =
          s"""{
             |"id": "foo",
             |"name": "bar",
             |"active": true,
             |"interval": "10 minutes",
             |"connection": {
             |  "Http": {
             |    "url": "http://foo.bar",
             |    "method": "GET",
             |    "timeout": "1 minute"
             |  }
             |},
             |"contact": {
             |  "Email": {
             |    "email": "foo@bar.com"
             |  }
             |}
             |}""".stripMargin

        val request  = Request[IO](uri = Uri.fromString(s"/monitors/${Monitors.id}").value, method = Method.PUT).withEntity(requestBody)
        val response = controller.routes.orNotFound.run(request)

        verifyJsonResponse(response, Status.BadRequest, Some("""{"message":"Id in path is different from id in the request body"}"""))
        verifyNoInteractions(meSvc, monSvc)
      }
    }

    "PUT /monitors/:id/active" should {
      "activate monitor and return 204" in {
        val (monSvc, meSvc) = mocks
        when(monSvc.activate(any[Monitor.Id], any[Boolean])).thenReturnUnit

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val requestBody = """{"active":true}""".stripMargin

        val request =
          Request[IO](uri = Uri.fromString(s"/monitors/${Monitors.id}/active").value, method = Method.PUT).withEntity(requestBody)
        val response = controller.routes.orNotFound.run(request)

        verifyJsonResponse(response, Status.NoContent, None)
        verify(monSvc).activate(Monitors.id, true)
        verifyNoInteractions(meSvc)
      }

      "return 404 if monitor does not exist" in {
        val (monSvc, meSvc) = mocks
        when(monSvc.activate(any[Monitor.Id], any[Boolean])).thenReturn(IO.raiseError(AppError.NotFound("does not exist")))

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val requestBody = """{"active":true}""".stripMargin

        val request =
          Request[IO](uri = Uri.fromString(s"/monitors/${Monitors.id}/active").value, method = Method.PUT).withEntity(requestBody)
        val response = controller.routes.orNotFound.run(request)

        verifyJsonResponse(response, Status.NotFound, Some("""{"message":"does not exist"}"""))
        verify(monSvc).activate(Monitors.id, true)
        verifyNoInteractions(meSvc)
      }
    }

    "POST /monitors" should {
      "return 400 on malformed request" in {
        val monitor         = Monitors.monitor
        val (monSvc, meSvc) = mocks
        when(monSvc.create(any[CreateMonitor])).thenReturn(IO.pure(monitor))

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val requestBody = """{"foo": "bar"}""".stripMargin

        val request  = Request[IO](uri = uri"/monitors", method = Method.POST).withEntity(requestBody)
        val response = controller.routes.orNotFound.run(request)

        val error =
          "Invalid value for: body (Missing required field at 'name', Missing required field at 'connection', Missing required field at 'interval', Missing required field at 'contact')"
        verifyJsonResponse(response, Status.BadRequest, Some(s"""{"message":"$error"}"""))
        verifyNoInteractions(meSvc, monSvc)
      }

      "create new monitor and return 201 on success" in {
        val monitor         = Monitors.monitor
        val (monSvc, meSvc) = mocks
        when(monSvc.create(any[CreateMonitor])).thenReturn(IO.pure(monitor))

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val requestBody =
          s"""{
             |"name": "test",
             |"interval": "10 minutes",
             |"connection": {
             |  "Http": {
             |    "url": "http://foo.bar",
             |    "method": "GET",
             |    "timeout": "1 minute"
             |  }
             |},
             |"contact": {
             |  "Email": {
             |    "email": "foo@bar.com"
             |  }
             |}
             |}""".stripMargin

        val request  = Request[IO](uri = uri"/monitors", method = Method.POST).withEntity(requestBody)
        val response = controller.routes.orNotFound.run(request)

        verifyJsonResponse(response, Status.Created, Some(s"""{"id":"${Monitors.id}"}"""))
        verify(monSvc).create(Monitors.create())
        verifyNoInteractions(meSvc)
      }
    }

    "GET /monitors" should {

      "return all monitors on success" in {
        val monitor         = Monitors.monitor
        val (monSvc, meSvc) = mocks
        when(monSvc.getAll).thenReturn(IO.pure(List(monitor)))

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val request  = Request[IO](uri = uri"/monitors", method = Method.GET)
        val response = controller.routes.orNotFound.run(request)

        val expected =
          s"""[{
            |"id": "${monitor.id}",
            |"name": "${monitor.name}",
            |"active": true,
            |"interval": "10 minutes",
            |"connection": {
            |  "Http": {
            |    "url": "http://foo.bar",
            |    "method": "GET",
            |    "timeout": "1 minute",
            |    "headers": null
            |  }
            |},
            |"contact": {
            |  "Email": {
            |    "email": "foo@bar.com"
            |  }
            |}
            |}]""".stripMargin

        verifyJsonResponse(response, Status.Ok, Some(expected))
        verify(monSvc).getAll
        verifyNoInteractions(meSvc)
      }
    }

    "GET /monitors/:id" should {

      "return error when id invalid" in {
        val (monSvc, meSvc) = mocks

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val request  = Request[IO](uri = Uri.fromString(s"/monitors/foo").value, method = Method.GET)
        val response = controller.routes.orNotFound.run(request)

        verifyJsonResponse(response, Status.UnprocessableEntity, Some(s"""{"message":"Monitor id foo is invalid"}"""))
        verifyNoInteractions(monSvc, meSvc)
      }

      "return error when monitor does not exist" in {
        val (monSvc, meSvc) = mocks
        when(monSvc.find(any[Monitor.Id])).thenReturn(IO.pure(None))

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val request  = Request[IO](uri = Uri.fromString(s"/monitors/${Monitors.id}").value, method = Method.GET)
        val response = controller.routes.orNotFound.run(request)

        verifyJsonResponse(response, Status.NotFound, Some(s"""{"message":"Monitor with id ${Monitors.id} does not exist"}"""))
        verify(monSvc).find(Monitors.id)
        verifyNoInteractions(meSvc)
      }

      "find monitor by on success" in {
        val monitor         = Monitors.monitor
        val (monSvc, meSvc) = mocks
        when(monSvc.find(any[Monitor.Id])).thenReturn(IO.pure(Some(monitor)))

        val controller = new LiveMonitorController[IO](monSvc, meSvc)

        val request  = Request[IO](uri = Uri.fromString(s"/monitors/${monitor.id}").value, method = Method.GET)
        val response = controller.routes.orNotFound.run(request)

        val expected =
          s"""{
             |"id": "${monitor.id}",
             |"name": "${monitor.name}",
             |"active": true,
             |"interval": "10 minutes",
             |"connection": {
             |  "Http": {
             |    "url": "http://foo.bar",
             |    "method": "GET",
             |    "timeout": "1 minute",
             |    "headers": null
             |  }
             |},
             |"contact": {
             |  "Email": {
             |    "email": "foo@bar.com"
             |  }
             |}
             |}""".stripMargin

        verifyJsonResponse(response, Status.Ok, Some(expected))
        verify(monSvc).find(monitor.id)
        verifyNoInteractions(meSvc)
      }
    }
  }

  def mocks: (MonitorService[IO], MonitoringEventService[IO]) =
    (mock[MonitorService[IO]], mock[MonitoringEventService[IO]])
}
