package ebayapp.core

import org.mockito.{ArgumentMatchers, Mockito}
import org.mockito.stubbing.OngoingStubbing
import org.mockito.verification.VerificationMode

trait MockitoMatchers {

  def any[A]: A                                     = ArgumentMatchers.any[A]()
  def eqTo[A](value: A): A                          = ArgumentMatchers.eq[A](value)
  def when[A](mock: A): OngoingStubbing[A]          = Mockito.when(mock)
  def verify[A](mock: A, mode: VerificationMode): A = Mockito.verify(mock, mode)
  def verify[A](mock: A): A                         = verify(mock, Mockito.times(1))
}
