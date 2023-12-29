package ebayapp.kernel

import cats.effect.IO
import org.mockito.stubbing.{Answer, OngoingStubbing, Stubber}
import org.mockito.verification.VerificationMode
import org.mockito.{ArgumentMatchers, Mockito}
import org.scalatestplus.mockito.MockitoSugar

trait MockitoMatchers extends MockitoSugar {

  def any[A]: A                                      = ArgumentMatchers.any[A]()
  def eqTo[A](value: A): A                           = ArgumentMatchers.eq[A](value)
  def doAnswer[A](answer: Answer[A]): Stubber        = Mockito.doAnswer(answer)
  def doThrow[A](error: Throwable): Stubber          = Mockito.doThrow(error)
  def when[A](mock: A): OngoingStubbing[A]           = Mockito.when(mock)
  def verify[A](mock: A, mode: VerificationMode): A  = Mockito.verify(mock, mode)
  def verify[A](mock: A): A                          = verify(mock, Mockito.times(1))
  def verifyNoInteractions(mocks: AnyRef*): Unit     = Mockito.verifyNoInteractions(mocks: _*)
  def verifyNoMoreInteractions(mocks: AnyRef*): Unit = Mockito.verifyNoMoreInteractions(mocks: _*)

  extension [A](stub: OngoingStubbing[IO[A]])
    def thenReturnIO(value: A): OngoingStubbing[IO[A]]           = stub.thenReturn(IO.pure(value))
    def thenRaiseError(error: Throwable): OngoingStubbing[IO[A]] = stub.thenReturn(IO.raiseError(error))

  extension (stub: OngoingStubbing[IO[Unit]]) def thenReturnUnit: OngoingStubbing[IO[Unit]] = stub.thenReturn(IO.unit)

  extension [A](stub: OngoingStubbing[fs2.Stream[IO, A]])
    def thenFailStream(error: Throwable) = stub.thenReturn(fs2.Stream.raiseError[IO](error))
    def thenStream(items: A*)            = stub.thenReturn(fs2.Stream.emits(items.toList))
    def thenStream(items: List[A])       = stub.thenReturn(fs2.Stream.emits(items))
    def thenReturnEmptyStream            = stub.thenReturn(fs2.Stream.empty)
}
