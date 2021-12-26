package ebayapp.monitor.controllers

import cats.effect.IO
import ebayapp.kernel.ControllerSpec
import ebayapp.monitor.services.{MonitorService, MonitoringEventService}
import ebayapp.monitor.domain.{Monitor, Monitors}
import org.http4s.implicits.*
import org.http4s.*
import org.scalatest.EitherValues

class MonitorControllerSpec extends ControllerSpec with EitherValues {

  "A MonitorController" when {

    "GET /monitors" should {

      "return all monitors on success" in {
        val monitor = Monitors.gen()
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
            |    "timeout": "1 minute"
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
        val monitor = Monitors.gen()
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
             |    "timeout": "1 minute"
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
