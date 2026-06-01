package ebayapp.core.clients.jd

final case class RetryState(
    attempt: Int = 0,
    maxAttempts: Int = 10,
    exceptionAttempt: Int = 0,
    maxExceptionAttempts: Int = 3
) {
  def incAttempt: RetryState = copy(attempt = attempt + 1)
  def incExceptionAttempt: RetryState = copy(exceptionAttempt = exceptionAttempt + 1, attempt = 0)
}
