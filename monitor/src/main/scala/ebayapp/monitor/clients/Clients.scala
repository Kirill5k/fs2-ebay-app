package ebayapp.monitor.clients

trait Clients[F[_]]:
  def email: EmailClient[F]
  def http: HttpClient[F]
