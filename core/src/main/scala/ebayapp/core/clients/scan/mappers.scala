package ebayapp.core.clients.scan

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.scan.parsers.ScanItem
import ebayapp.core.domain.ItemDetails

object mappers {

  type ScanItemMapper[D <: ItemDetails] = ItemMapper[ScanItem, D]
}
