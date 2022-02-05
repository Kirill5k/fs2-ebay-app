package ebayapp.core.clients.mainlinemenswear

import ebayapp.core.clients.ItemMapper
import ebayapp.core.domain.ResellableItem

private[mainlinemenswear] object mappers {

  final case class MainlineMenswearItem(
      id: Long,
      name: String,
      brand: String,
      currentPrice: BigDecimal,
      previousPrice: BigDecimal,
      size: String,
      onlineStock: Int,
      image: String,
      url: String,
      category: String
  )

  type MainlineMenswearItemMapper = ItemMapper[MainlineMenswearItem]

  val mainlineMenswearClothingMapper: MainlineMenswearItemMapper = new MainlineMenswearItemMapper {
    override def toDomain(jdi: MainlineMenswearItem): ResellableItem = ???
  }
}
