package ebayapp.monitor.actions

import cats.effect.std.Queue

final class ActionProcessor[F[_]](
    val actions: Queue[F, Action]
)
