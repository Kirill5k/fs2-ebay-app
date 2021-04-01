package ebayapp.clients.argos

import ebayapp.clients.argos.responses.ResponseData
import ebayapp.domain.{ItemDetails, ResellableItem}

private[argos] object mappers {

  trait ArgosItemMapper[D <: ItemDetails] {
    def toDomain(data: ResponseData): ResellableItem[D]
  }
}
