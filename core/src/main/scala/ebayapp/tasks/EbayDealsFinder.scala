package ebayapp.tasks

import cats.effect.IO
import ebayapp.domain.{ItemDetails, ResellableItem}
import fs2.Stream

trait EbayDealsFinder[F[_], D <: ItemDetails] {
  def searchForCheapItems(): Stream[IO, ResellableItem[D]]
}
