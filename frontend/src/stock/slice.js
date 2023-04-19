import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {distinct} from "../common/collections";

export const getStock = createAsyncThunk('stock/get', async () => {
  // TODO: get stock
  return testItems;
})

const initialFilters = {
  kinds: [],
  retailers: [],
  brands: [],
  sizes: [],
  price: {
    min: 0,
    max: 5000,
  },
  discount: {
    min: 0,
    max: 100
  }
}

const initialState = {
  status: 'idle',
  items: [],
  selectedItems: [],
  filters: initialFilters,
  selectedFilters: initialFilters
}

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    filter: (state, action) => {
      const filters = {...action.payload}
      state.selectedFilters = filters
      state.selectedItems = state.items.filter(i => {
        const currentDiscount = i.price.discount || 0
        const currentPrice = i.price.buy || 0

        const byRetailer = filters.retailers.length > 0 ? filters.retailers.includes(i.listingDetails.seller) : true
        const byBrand = filters.brands.length > 0 ? filters.brands.includes(i.itemDetails.brand) : true
        const bySize = filters.sizes.length > 0 ? filters.sizes.includes(i.itemDetails.size) : true
        const byDiscount = currentDiscount >= filters.discount.min && currentDiscount < filters.discount.max
        const byPrice = currentPrice >= filters.price.min && currentPrice < filters.price.max

        return byRetailer && byBrand && bySize && byDiscount && byPrice
      })
    }
  },
  extraReducers: builder => {
    builder
        .addCase(getStock.pending, (state, action) => {
          state.status = 'loading'
        })
        .addCase(getStock.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.items = action.payload
          state.selectedItems = action.payload
          state.filters.kinds = distinct(action.payload.map(i => i.itemDetails.kind))
          state.filters.brands = distinct(action.payload.map(i => i.itemDetails.brand))
          state.filters.sizes = distinct(action.payload.map(i => i.itemDetails.size))
          state.filters.retailers = distinct(action.payload.map(i => i.listingDetails.seller))
        })
        .addCase(getStock.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        })
  }
})

export const { filter } = stockSlice.actions
export default stockSlice.reducer

const testItems = [
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Flower Trk Pnt Sn21 (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-kenzo-flower-trk-pnt-sn21-488128#colcode=48812803",
      "title": "KENZO - Kenzo Flower Trk Pnt Sn21",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48812803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.361649545Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 72.00,
      "discount": 80,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Flower Trk Pnt Sn21 (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-kenzo-flower-trk-pnt-sn21-488128#colcode=48812803",
      "title": "KENZO - Kenzo Flower Trk Pnt Sn21",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48812803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.361655339Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 72.00,
      "discount": 80,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Dolidorix Shorts (Black 001)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dolidorix-shorts-472404#colcode=47240403",
      "title": "Hugo - Dolidorix Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47240403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.539501149Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 28.00,
      "discount": 79,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Pocket Square (Medium Grey)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-pocket-square-768388#colcode=76838802",
      "title": "Boss - Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/76838802_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:43.313924300Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 16.00,
      "discount": 79,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kedno Pole Shorts (OWhite 118)",
      "brand": "BOSS",
      "size": "28W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kedno-pole-shorts-325342#colcode=32534201",
      "title": "Boss - Kedno Pole Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32534201_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.399001785Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 79,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Doak Square Track Pants (Black, 16048050)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/black-hugo-doak-square-track-pants/16048050/",
      "title": "HUGO Doak Square Track Pants (black / S)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_381286_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:52.885257139Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 20.00,
      "discount": 78,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Mono Track Pants (Camel 6201)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-mono-track-pants-498054#colcode=49805404",
      "title": "OFF WHITE - Mono Track Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/49805404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.225053091Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 209.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Mono Track Pants (Camel 6201)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-mono-track-pants-498054#colcode=49805404",
      "title": "OFF WHITE - Mono Track Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/49805404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.225057521Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 209.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Formal Pants (Light Grey 0500)",
      "brand": "OFF WHITE",
      "size": "S (46)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-formal-pants-579102#colcode=57910202",
      "title": "OFF WHITE - Formal Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/57910202_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.224639748Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 245.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Arrow Track Pants (Red 2501)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-track-pants-498043#colcode=49804308",
      "title": "OFF WHITE - Arrow Track Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/49804308_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.225791522Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 125.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Arrow Track Pants (Red 2501)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-track-pants-498043#colcode=49804308",
      "title": "OFF WHITE - Arrow Track Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/49804308_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.225795511Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 125.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Arrow Track Pants (Blue 4301)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-track-pants-498043#colcode=49804318",
      "title": "OFF WHITE - Arrow Track Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/49804318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.225651025Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 125.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Zip Logo Cardigan (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-zip-logo-cardigan-559003#colcode=55900303",
      "title": "KENZO - Zip Logo Cardigan",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55900303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366570254Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Denim Shirt (Navy)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-denim-shirt-642038#colcode=64203822",
      "title": "KENZO - Tiger Denim Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/64203822_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.372624085Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 44.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Crest Jumper (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-crest-jumper-559897#colcode=55989703",
      "title": "KENZO - Tiger Crest Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55989703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366632057Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Cap (Black 99H)",
      "brand": "KENZO",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-cap-391011#colcode=39101141",
      "title": "KENZO - Tiger Cap",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39101141_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.872316532Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 26.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tech Tracksuit Bottoms (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tech-tracksuit-bottoms-511047#colcode=51104703",
      "title": "KENZO - Tech Tracksuit Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/51104703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362579947Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 82.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tech Tracksuit Bottoms (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tech-tracksuit-bottoms-511047#colcode=51104703",
      "title": "KENZO - Tech Tracksuit Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/51104703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362586350Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 82.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport Monogram Fleece (Ink 78)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-monogram-fleece-554286#colcode=55428618",
      "title": "Kenzo - Sport Monogram Fleece",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55428618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.361469754Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 135.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport Monogram Fleece (Ink 78)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-monogram-fleece-554286#colcode=55428618",
      "title": "Kenzo - Sport Monogram Fleece",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55428618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.361476968Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 135.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Monogram Joggers (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-monogram-joggers-483545#colcode=48354503",
      "title": "KENZO - Monogram Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48354503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362247752Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 88.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kourt 80 Sneakers (White 01)",
      "brand": "KENZO",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-kourt-80-sneakers-117295#colcode=11729501",
      "title": "KENZO - Kourt 80 Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11729501_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362529145Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 82.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Elasticated Waist Belt Shorts (Glacier 62)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-elasticated-waist-belt-shorts-478256#colcode=47825602",
      "title": "KENZO - Elasticated Waist Belt Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/47825602_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366156565Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 75.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Elasticated Waist Belt Shorts (Glacier 62)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-elasticated-waist-belt-shorts-478256#colcode=47825602",
      "title": "KENZO - Elasticated Waist Belt Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/47825602_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366163998Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 75.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Cord Trousers (Sand 08)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-cord-trousers-510952#colcode=51095204",
      "title": "Kenzo - Cord Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/51095204_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366396862Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 75.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Patchwork Shir Sn21 (Green 56)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-kenzo-patchwork-shir-sn21-557747#colcode=55774715",
      "title": "KENZO - Kenzo Patchwork Shir Sn21",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55774715_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.361782281Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 119.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Patchwork Shir Sn21 (Green 56)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-kenzo-patchwork-shir-sn21-557747#colcode=55774715",
      "title": "KENZO - Kenzo Patchwork Shir Sn21",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55774715_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.361787511Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 119.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Vin Waistcoat (Black 001)",
      "brand": "HUGO",
      "size": "UK52"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-vin-waistcoat-606732#colcode=60673203",
      "title": "Hugo - Vin Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60673203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.474099748Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Vin Waistcoat (Black 001)",
      "brand": "HUGO",
      "size": "UK50"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-vin-waistcoat-606732#colcode=60673203",
      "title": "Hugo - Vin Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60673203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.474094386Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Vin Waistcoat (Black 001)",
      "brand": "HUGO",
      "size": "UK48"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-vin-waistcoat-606732#colcode=60673203",
      "title": "Hugo - Vin Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60673203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.474089276Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Vin Waistcoat (Black 001)",
      "brand": "HUGO",
      "size": "UK46"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-vin-waistcoat-606732#colcode=60673203",
      "title": "Hugo - Vin Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60673203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.474083708Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Rip Tapered Jeans (Medium Blue 420)",
      "brand": "HUGO",
      "size": "34W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-rip-tapered-jeans-659709#colcode=65970918",
      "title": "Hugo - Rip Tapered Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65970918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.550158956Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Rip Tapered Jeans (Medium Blue 420)",
      "brand": "HUGO",
      "size": "32W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-rip-tapered-jeans-659709#colcode=65970918",
      "title": "Hugo - Rip Tapered Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65970918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.550152968Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Rip Tapered Jeans (Medium Blue 420)",
      "brand": "HUGO",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-rip-tapered-jeans-659709#colcode=65970918",
      "title": "Hugo - Rip Tapered Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65970918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.550146691Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kenno Shirt (Blue 413)",
      "brand": "HUGO",
      "size": "38(15)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-kenno-shirt-559197#colcode=55919718",
      "title": "Hugo - Kenno Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55919718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:59.401274313Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 24.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard214 Trousers (Light Beige 272)",
      "brand": "HUGO",
      "size": "40W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard214-trousers-512272#colcode=51227204",
      "title": "Hugo - Howard214 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51227204_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485885266Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard214 Trousers (Light Beige 272)",
      "brand": "HUGO",
      "size": "38W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard214-trousers-512272#colcode=51227204",
      "title": "Hugo - Howard214 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51227204_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485878627Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard214 Trousers (Light Beige 272)",
      "brand": "HUGO",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard214-trousers-512272#colcode=51227204",
      "title": "Hugo - Howard214 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51227204_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485872201Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard214 Trousers (Light Beige 272)",
      "brand": "HUGO",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard214-trousers-512272#colcode=51227204",
      "title": "Hugo - Howard214 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51227204_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485865329Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard214 Trousers (Light Beige 272)",
      "brand": "HUGO",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard214-trousers-512272#colcode=51227204",
      "title": "Hugo - Howard214 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51227204_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485858167Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard214 Trousers (Dark Blue 405)",
      "brand": "HUGO",
      "size": "38W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard214-trousers-512272#colcode=51227218",
      "title": "Hugo - Howard214 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51227218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485512733Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard214 Trousers (Dark Blue 405)",
      "brand": "HUGO",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard214-trousers-512272#colcode=51227218",
      "title": "Hugo - Howard214 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51227218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485505334Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard214 Trousers (Dark Blue 405)",
      "brand": "HUGO",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard214-trousers-512272#colcode=51227218",
      "title": "Hugo - Howard214 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51227218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485496822Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard Trousers (DGreen 306)",
      "brand": "HUGO",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard-trousers-514152#colcode=51415215",
      "title": "Hugo - Howard Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51415215_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.538837566Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 52.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Howard Trousers (DGreen 306)",
      "brand": "HUGO",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-howard-trousers-514152#colcode=51415215",
      "title": "Hugo - Howard Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51415215_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.538831398Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 52.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hetons Trousers (DBlue 401)",
      "brand": "HUGO",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413918",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.535426868Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hetons Trousers (DBlue 401)",
      "brand": "HUGO",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413918",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.535415857Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hetons Trousers (DBlue 401)",
      "brand": "HUGO",
      "size": "34W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413918",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.535421445Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hetons Trousers (DBlue 401)",
      "brand": "HUGO",
      "size": "32W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413918",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.535410349Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hetons Trousers (DBlue 401)",
      "brand": "HUGO",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413918",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.535404199Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hetons Trousers (Black 001)",
      "brand": "HUGO",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413903",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.535891966Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hetons Trousers (Black 001)",
      "brand": "HUGO",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413903",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.535870269Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hetons Trousers (Black 001)",
      "brand": "HUGO",
      "size": "34W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413903",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.535879880Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hetons Trousers (Black 001)",
      "brand": "HUGO",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413903",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.535851897Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Harlys Trousers (DBeige 251)",
      "brand": "HUGO",
      "size": "36W R (52)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-harlys-trousers-579508#colcode=57950804",
      "title": "Hugo - Harlys Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57950804_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.486232144Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Harlys Trousers (DBeige 251)",
      "brand": "HUGO",
      "size": "30W R (46)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-harlys-trousers-579508#colcode=57950804",
      "title": "Hugo - Harlys Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57950804_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.486224249Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "HBH Reborn Tab Xbdy Ld21 (Black 001)",
      "brand": "HUGO",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hbh-reborn-tab-xbdy-ld21-712484#colcode=71248403",
      "title": "Hugo - HBH Reborn Tab Xbdy Ld21",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/71248403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.486141101Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Gimberly Straight Jeans (Bright Blue)",
      "brand": "HUGO",
      "size": "31W L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-gimberly-straight-jeans-633210#colcode=63321018",
      "title": "Hugo - Gimberly Straight Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63321018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.549339856Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Gimberly Straight Jeans (Bright Blue)",
      "brand": "HUGO",
      "size": "30W L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-gimberly-straight-jeans-633210#colcode=63321018",
      "title": "Hugo - Gimberly Straight Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63321018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.549333808Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Gimberly Straight Jeans (Bright Blue)",
      "brand": "HUGO",
      "size": "29W L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-gimberly-straight-jeans-633210#colcode=63321018",
      "title": "Hugo - Gimberly Straight Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63321018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.549327677Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Gimberly Straight Jeans (Bright Blue)",
      "brand": "HUGO",
      "size": "28W L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-gimberly-straight-jeans-633210#colcode=63321018",
      "title": "Hugo - Gimberly Straight Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63321018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.549320448Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Getlin212 Trousers (DarkBlueChck402)",
      "brand": "HUGO",
      "size": "40W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin212-trousers-579139#colcode=57913918",
      "title": "Hugo - Getlin212 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57913918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.536748308Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Getlin212 Trousers (DarkBlueChck402)",
      "brand": "HUGO",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin212-trousers-579139#colcode=57913918",
      "title": "Hugo - Getlin212 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57913918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.536741380Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Getlin212 Trousers (DarkBlueChck402)",
      "brand": "HUGO",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin212-trousers-579139#colcode=57913918",
      "title": "Hugo - Getlin212 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57913918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.536733777Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Getlin Suit Trousers (Charcoal 016)",
      "brand": "HUGO",
      "size": "40W R (56)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.493761658Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Getlin Suit Trousers (Charcoal 016)",
      "brand": "HUGO",
      "size": "38W R (54)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.493753489Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Getlin Suit Trousers (Charcoal 016)",
      "brand": "HUGO",
      "size": "36W R (52)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.493744824Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Getlin Suit Trousers (Charcoal 016)",
      "brand": "HUGO",
      "size": "34W R (50)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.493735227Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Getlin Suit Trousers (Charcoal 016)",
      "brand": "HUGO",
      "size": "32W R (48)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.493717614Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Ganeva Logo Jeggings (Black 001)",
      "brand": "HUGO",
      "size": "27 R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-ganeva-logo-jeggings-679145#colcode=67914503",
      "title": "Hugo - Ganeva Logo Jeggings",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67914503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.485063833Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Ganeva Logo Jeggings (Black 001)",
      "brand": "HUGO",
      "size": "26 R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-ganeva-logo-jeggings-679145#colcode=67914503",
      "title": "Hugo - Ganeva Logo Jeggings",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67914503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.485055897Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Fivan222 Shorts (Light Beige 272)",
      "brand": "HUGO",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-fivan222-shorts-550578#colcode=55057804",
      "title": "Hugo - Fivan222 Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55057804_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.549271690Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Enalu 10234784 01 (Open Blue 461)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-enalu-10234784-01-608108#colcode=60810818",
      "title": "Hugo - Enalu 10234784 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60810818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.538418117Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 52.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Enalu 10234784 01 (Open Blue 461)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-enalu-10234784-01-608108#colcode=60810818",
      "title": "Hugo - Enalu 10234784 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60810818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.538424675Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 52.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Elpy Relaxed Fit Short Sleeve Shirt (Black 001)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-elpy-relaxed-fit-short-sleeve-shirt-557190#colcode=55719003",
      "title": "Hugo - Elpy Relaxed Fit Short Sleeve Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55719003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.485286972Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Duscly Fleece Joggers (Black 001)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-duscly-fleece-joggers-483604#colcode=48360403",
      "title": "Hugo - Duscly Fleece Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48360403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485639821Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Drowin Jogging Pants (Black 001)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-drowin-jogging-pants-482719#colcode=48271903",
      "title": "Hugo - Drowin Jogging Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48271903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.494064375Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Dolidorio Shorts (Black 001)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dolidorio-shorts-430380#colcode=43038003",
      "title": "Hugo - Dolidorio Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/43038003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.549197389Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "DenergyX OTH Hoodie (Black 001)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-denergyx-oth-hoodie-535190#colcode=53519003",
      "title": "Hugo - DenergyX OTH Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/53519003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.486174935Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Dechi Track Pants (Black 001)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dechi-track-pants-483482#colcode=48348203",
      "title": "Hugo - Dechi Track Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48348203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485255215Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Dechi Track Pants (Black 001)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dechi-track-pants-483482#colcode=48348203",
      "title": "Hugo - Dechi Track Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48348203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.485268757Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Datheltic Zip Jacket (Black 001)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-datheltic-zip-jacket-554846#colcode=55484603",
      "title": "Hugo - Datheltic Zip Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55484603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.539016196Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 52.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Dagile T Shirt (Open Yellow 755)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dagile-t-shirt-323128#colcode=32312813",
      "title": "Hugo - Dagile T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32312813_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.495735302Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 27.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "708 Rip Slim Jeans (Blue 440)",
      "brand": "HUGO",
      "size": "36W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-708-rip-slim-jeans-654911#colcode=65491115",
      "title": "Hugo - 708 Rip Slim Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65491115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.487095128Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "708 Rip Slim Jeans (Blue 440)",
      "brand": "HUGO",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-708-rip-slim-jeans-654911#colcode=65491115",
      "title": "Hugo - 708 Rip Slim Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65491115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.487101868Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "708 Rip Slim Jeans (Blue 440)",
      "brand": "HUGO",
      "size": "34W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-708-rip-slim-jeans-654911#colcode=65491115",
      "title": "Hugo - 708 Rip Slim Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65491115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.487081611Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "708 Rip Slim Jeans (Blue 440)",
      "brand": "HUGO",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-708-rip-slim-jeans-654911#colcode=65491115",
      "title": "Hugo - 708 Rip Slim Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65491115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.487088296Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "708 Rip Slim Jeans (Blue 440)",
      "brand": "HUGO",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-708-rip-slim-jeans-654911#colcode=65491115",
      "title": "Hugo - 708 Rip Slim Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65491115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.487068606Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "708 Rip Slim Jeans (Blue 440)",
      "brand": "HUGO",
      "size": "32W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-708-rip-slim-jeans-654911#colcode=65491115",
      "title": "Hugo - 708 Rip Slim Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65491115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.487074998Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "708 Rip Slim Jeans (Blue 440)",
      "brand": "HUGO",
      "size": "30W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-708-rip-slim-jeans-654911#colcode=65491115",
      "title": "Hugo - 708 Rip Slim Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65491115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.487055141Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "708 Rip Slim Jeans (Blue 440)",
      "brand": "HUGO",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-708-rip-slim-jeans-654911#colcode=65491115",
      "title": "Hugo - 708 Rip Slim Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65491115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.487061800Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 Rip Repair Jeans (Pastel Blue 450)",
      "brand": "HUGO",
      "size": "38W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-rip-repair-jeans-657055#colcode=65705518",
      "title": "Hugo - 634 Rip Repair Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65705518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.494338657Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 Rip Repair Jeans (Pastel Blue 450)",
      "brand": "HUGO",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-rip-repair-jeans-657055#colcode=65705518",
      "title": "Hugo - 634 Rip Repair Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65705518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.494331620Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 Rip Repair Jeans (Pastel Blue 450)",
      "brand": "HUGO",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-rip-repair-jeans-657055#colcode=65705518",
      "title": "Hugo - 634 Rip Repair Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65705518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.494316888Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 Rip Repair Jeans (Pastel Blue 450)",
      "brand": "HUGO",
      "size": "34W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-rip-repair-jeans-657055#colcode=65705518",
      "title": "Hugo - 634 Rip Repair Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65705518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.494324522Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 Rip Repair Jeans (Pastel Blue 450)",
      "brand": "HUGO",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-rip-repair-jeans-657055#colcode=65705518",
      "title": "Hugo - 634 Rip Repair Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65705518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.494309625Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 Rip Repair Jeans (Pastel Blue 450)",
      "brand": "HUGO",
      "size": "30W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-rip-repair-jeans-657055#colcode=65705518",
      "title": "Hugo - 634 Rip Repair Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65705518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.494301419Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 Jeans (Turquoise440)",
      "brand": "HUGO",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-jeans-655973#colcode=65597318",
      "title": "Hugo - 634 Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65597318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.486497011Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 GD Jeans (Medium Grey 033)",
      "brand": "HUGO",
      "size": "31W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-gd-jeans-654193#colcode=65419302",
      "title": "Hugo - 634 GD Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65419302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.539221356Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 52.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 GD Jeans (Medium Grey 033)",
      "brand": "HUGO",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-gd-jeans-654193#colcode=65419302",
      "title": "Hugo - 634 GD Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65419302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.539214795Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 52.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "3 Pack Trunks (White 100)",
      "brand": "HUGO",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-3-pack-trunks-422769#colcode=42276901",
      "title": "Hugo - 3 Pack Trunks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42276901_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:07.577529588Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 11.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "3 Pack Trunks (Navy 410)",
      "brand": "HUGO",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-3-pack-trunks-422769#colcode=42276922",
      "title": "Hugo - 3 Pack Trunks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42276922_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:07.577851005Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 11.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "076 Denim Jacket (Turquoise440)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-076-denim-jacket-602702#colcode=60270218",
      "title": "Hugo - 076 Denim Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60270218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.536264768Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Zaff Scarf Womens (Black 001)",
      "brand": "HUGO",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-zaff-scarf-womens-902151#colcode=90215103",
      "title": "Hugo - Hugo Zaff Scarf Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/90215103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.485578706Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Gayang Logo Jeans Womens (Turquoise)",
      "brand": "HUGO",
      "size": "30W L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-gayang-logo-jeans-womens-659828#colcode=65982818",
      "title": "Hugo - Hugo Gayang Logo Jeans Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65982818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.549598603Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Gatora Slim Ld24 (Navy 415)",
      "brand": "HUGO",
      "size": "30 L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-gatora-slim-ld24-658143#colcode=65814319",
      "title": "Hugo - Hugo Gatora Slim Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65814319_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.550386746Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Gatora Slim Ld24 (Navy 415)",
      "brand": "HUGO",
      "size": "29 L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-gatora-slim-ld24-658143#colcode=65814319",
      "title": "Hugo - Hugo Gatora Slim Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65814319_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.550380365Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Gatora Slim Ld24 (Navy 415)",
      "brand": "HUGO",
      "size": "28 L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-gatora-slim-ld24-658143#colcode=65814319",
      "title": "Hugo - Hugo Gatora Slim Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65814319_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.550374159Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Gatora Slim Ld24 (Navy 415)",
      "brand": "HUGO",
      "size": "27 L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-gatora-slim-ld24-658143#colcode=65814319",
      "title": "Hugo - Hugo Gatora Slim Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65814319_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.550367837Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Gatora Slim Ld24 (Navy 415)",
      "brand": "HUGO",
      "size": "26 L32"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-gatora-slim-ld24-658143#colcode=65814319",
      "title": "Hugo - Hugo Gatora Slim Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65814319_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.550361114Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " EthonCamoBckPck Sn24 (Mcellaneous960)",
      "brand": "HUGO",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-ethoncamobckpck-sn24-715342#colcode=71534215",
      "title": "Hugo - Hugo EthonCamoBckPck Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/71534215_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.550600032Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Duzu Jog Sn24 (Natural 108)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-duzu-jog-sn24-483914#colcode=48391401",
      "title": "Hugo - Hugo Duzu Jog Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48391401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.494169672Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Duzu Jog Sn24 (Natural 108)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-duzu-jog-sn24-483914#colcode=48391401",
      "title": "Hugo - Hugo Duzu Jog Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48391401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.494177030Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Boss Zula Belt 3.5cm Womens (Pastel Pink)",
      "brand": "HUGO",
      "size": "85 (10 M)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-boss-zula-belt-35cm-womens-945255#colcode=94525506",
      "title": "Hugo - Hugo Boss Zula Belt 3.5cm Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94525506_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.496192322Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 27.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Boss Zula Belt 3.5cm Womens (Pastel Pink)",
      "brand": "HUGO",
      "size": "80 (8 S)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-boss-zula-belt-35cm-womens-945255#colcode=94525506",
      "title": "Hugo - Hugo Boss Zula Belt 3.5cm Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94525506_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.496179331Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 27.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Zolcon Jacket (Black)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-zolcon-jacket-324046#colcode=32404603",
      "title": "Boss - Zolcon Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32404603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.377083969Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Zip Sweatshirt (Navy 410)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-zip-sweatshirt-554637#colcode=55463719",
      "title": "Boss - Zip Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55463719_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409260571Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Zip Sweatshirt (Black 001)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-zip-sweatshirt-554637#colcode=55463703",
      "title": "Boss - Zip Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55463703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401688688Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Weste Check Waistcoat (Grey 061)",
      "brand": "BOSS",
      "size": "UK44(EU54)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.408586498Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Weste Check Waistcoat (Grey 061)",
      "brand": "BOSS",
      "size": "UK42(EU52)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.408578947Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Weste Check Waistcoat (Grey 061)",
      "brand": "BOSS",
      "size": "UK40(EU50)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.408571485Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Weste Check Waistcoat (Grey 061)",
      "brand": "BOSS",
      "size": "UK38(EU48)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.408563772Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Weste Check Waistcoat (Grey 061)",
      "brand": "BOSS",
      "size": "UK36(EU46)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.408556289Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Trollflash T Shirt (Dark Orange)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-trollflash-t-shirt-587032#colcode=58703212",
      "title": "Boss - Trollflash T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/58703212_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:43.311783158Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Titanium-R_Slid_rb 10243417 01 (Black 007)",
      "brand": "BOSS",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-titanium-rslidrb-10243417-01-124022#colcode=12402203",
      "title": "Boss - Titanium-R_Slid_rb 10243417 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/12402203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:41.347065286Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Throbtino1 Tank Top (Open Green)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-throbtino1-tank-top-593245#colcode=59324515",
      "title": "Boss - Throbtino1 Tank Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59324515_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.377578333Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Thias T Shirt (Dark Blue)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-thias-t-shirt-593420#colcode=59342018",
      "title": "Boss - Thias T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59342018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403391547Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Thias T Shirt (Dark Blue)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-thias-t-shirt-593420#colcode=59342018",
      "title": "Boss - Thias T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59342018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403397738Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tessler 173 T-shirt (Dark Blue)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tessler-173-t-shirt-323354#colcode=32335418",
      "title": "Boss - Tessler 173 T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32335418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:43.314185812Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 27.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Teo Knit T Shirt (Beige 131)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-teo-knit-t-shirt-595369#colcode=59536901",
      "title": "Boss - Teo Knit T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59536901_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.375752051Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tatum Tapered Fit Jeans (Medium Blue 426)",
      "brand": "BOSS",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tatum-tapered-fit-jeans-659189#colcode=65918918",
      "title": "BOSS - Tatum Tapered Fit Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65918918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.408478876Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tatum Tape Jeans Mens (Dark Blue 405)",
      "brand": "BOSS",
      "size": "34W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tatum-tape-jeans-mens-639067#colcode=63906718",
      "title": "Boss - Tatum Tape Jeans Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63906718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.404788076Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tatum Tape Jeans Mens (Dark Blue 405)",
      "brand": "BOSS",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tatum-tape-jeans-mens-639067#colcode=63906718",
      "title": "Boss - Tatum Tape Jeans Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63906718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T07:19:11.330603700Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tatum Tape Jeans Mens (Dark Blue 405)",
      "brand": "BOSS",
      "size": "34W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tatum-tape-jeans-mens-639067#colcode=63906718",
      "title": "Boss - Tatum Tape Jeans Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63906718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.404795677Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tatum Tape Jeans Mens (Dark Blue 405)",
      "brand": "BOSS",
      "size": "32W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tatum-tape-jeans-mens-639067#colcode=63906718",
      "title": "Boss - Tatum Tape Jeans Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63906718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.404771655Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tatum Tape Jeans Mens (Dark Blue 405)",
      "brand": "BOSS",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tatum-tape-jeans-mens-639067#colcode=63906718",
      "title": "Boss - Tatum Tape Jeans Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63906718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.404780374Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Taberon Cargo Trousers (Medium Blue 424)",
      "brand": "BOSS",
      "size": "46 (S)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-taberon-cargo-trousers-513150#colcode=51315019",
      "title": "BOSS - Taberon Cargo Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51315019_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.400945769Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "T-Perry Short Sleeve Polo Shirt (Light Pink)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-t-perry-short-sleeve-polo-shirt-543624#colcode=54362406",
      "title": "Boss - T-Perry Short Sleeve Polo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54362406_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.404224284Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "T-Delaware 3 Jeans (Bright Blue 434)",
      "brand": "BOSS",
      "size": "36W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-t-delaware-3-jeans-654616#colcode=65461618",
      "title": "Boss - T-Delaware 3 Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65461618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.369080730Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Stanino Slim Fit Smart Stretch Trousers (Blue 402)",
      "brand": "BOSS",
      "size": "54 (64)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-stanino-slim-fit-smart-stretch-trousers-519346#colcode=51934618",
      "title": "Boss - Stanino Slim Fit Smart Stretch Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51934618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403063055Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Stanino Slim Fit Smart Stretch Trousers (Blue 402)",
      "brand": "BOSS",
      "size": "52 (62)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-stanino-slim-fit-smart-stretch-trousers-519346#colcode=51934618",
      "title": "Boss - Stanino Slim Fit Smart Stretch Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51934618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403051073Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Stanino Slim Fit Smart Stretch Trousers (Blue 402)",
      "brand": "BOSS",
      "size": "46 (56)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-stanino-slim-fit-smart-stretch-trousers-519346#colcode=51934618",
      "title": "Boss - Stanino Slim Fit Smart Stretch Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51934618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403041834Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Spectre Slim Trousers (Open Blue 489)",
      "brand": "BOSS",
      "size": "54 (XXL)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-spectre-slim-trousers-360402#colcode=36040219",
      "title": "Boss - Spectre Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/36040219_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409429884Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Spectre Slim Trousers (Open Blue 489)",
      "brand": "BOSS",
      "size": "52 (XL)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-spectre-slim-trousers-360402#colcode=36040219",
      "title": "Boss - Spectre Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/36040219_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409421696Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Spectre Slim Trousers (Open Blue 489)",
      "brand": "BOSS",
      "size": "48 (M)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-spectre-slim-trousers-360402#colcode=36040219",
      "title": "Boss - Spectre Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/36040219_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409410034Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Spectre Slim Trousers (Open Blue 489)",
      "brand": "BOSS",
      "size": "46 (S)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-spectre-slim-trousers-360402#colcode=36040219",
      "title": "Boss - Spectre Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/36040219_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409402054Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Slim Delaware Jeans (Dark Blue 402)",
      "brand": "BOSS",
      "size": "36W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-slim-delaware-jeans-649128#colcode=64912851",
      "title": "Boss - Slim Delaware Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64912851_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.433882075Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Skiles Zip Sweatshirt (Black 001)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-skiles-zip-sweatshirt-554258#colcode=55425803",
      "title": "BOSS - Skiles Zip Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55425803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.433445895Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Skeefast Logo Joggers (Gold)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-skeefast-logo-joggers-483666#colcode=48366610",
      "title": "Boss - Skeefast Logo Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48366610_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402476890Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sidney 11 Fleece Jacket (Black)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-sidney-11-fleece-jacket-550662#colcode=55066203",
      "title": "Boss - Sidney 11 Fleece Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55066203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403646626Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sefade Fleece Shorts (Pastel Red 630)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-sefade-fleece-shorts-472315#colcode=47231508",
      "title": "Boss - Sefade Fleece Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47231508_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:41.346719875Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sefade Fleece Shorts (Open Grey 080)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-sefade-fleece-shorts-472315#colcode=47231502",
      "title": "Boss - Sefade Fleece Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47231502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:41.346303247Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sefade Fleece Shorts (Open Grey 080)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-sefade-fleece-shorts-472315#colcode=47231502",
      "title": "Boss - Sefade Fleece Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47231502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:41.346312529Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sefade Fleece Shorts (Medium Blue 424)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-sefade-fleece-shorts-472315#colcode=47231518",
      "title": "Boss - Sefade Fleece Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47231518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:41.346607935Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Ronnie Shirt (Medium Blue 425)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ronnie-shirt-556488#colcode=55648818",
      "title": "Boss - Ronnie Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55648818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:43.312250920Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Rikki 53 Shirt (Light Blue 450)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-rikki-53-shirt-557755#colcode=55775518",
      "title": "Boss - Rikki 53 Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55775518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:45.490658012Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 24.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Polston 19 Shirt (Black)",
      "brand": "BOSS",
      "size": "N/A"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-polston-19-shirt-543943#colcode=54394303",
      "title": "Boss - Polston 19 Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54394303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409792201Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Peo Crew Neck Jumper (Open Blue)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-peo-crew-neck-jumper-324000#colcode=32400018",
      "title": "Boss - Peo Crew Neck Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32400018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409048902Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Peo Crew Neck Jumper (Open Blue)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-peo-crew-neck-jumper-324000#colcode=32400018",
      "title": "Boss - Peo Crew Neck Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32400018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409055477Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Parlay 155 Polo Shirt (Dark Blue 404)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-parlay-155-polo-shirt-544245#colcode=54424518",
      "title": "BOSS - Parlay 155 Polo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54424518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:41.345569757Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Parkour Running Trainers (Red 640)",
      "brand": "BOSS",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-parkour-running-trainers-119854#colcode=11985408",
      "title": "Boss - Parkour Running Trainers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/11985408_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.399235147Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 52.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Padas Quarter Zip Jumper (Open Blue)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-padas-quarter-zip-jumper-323991#colcode=32399118",
      "title": "Boss - Padas Quarter Zip Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32399118_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.377194178Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Padas Quarter Zip Jumper (Medium Grey)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-padas-quarter-zip-jumper-323991#colcode=32399102",
      "title": "Boss - Padas Quarter Zip Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32399102_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.398643038Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "My Soft Shirt (White 100)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-my-soft-shirt-558430#colcode=55843001",
      "title": "Boss - My Soft Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55843001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:43.314487353Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 27.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Maine Regular Jeans (Black 002)",
      "brand": "BOSS",
      "size": "40W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-maine-regular-jeans-649060#colcode=64906003",
      "title": "Boss - Maine Regular Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64906003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.433677890Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Maine Regular Jeans (Black 002)",
      "brand": "BOSS",
      "size": "40W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-maine-regular-jeans-649060#colcode=64906003",
      "title": "Boss - Maine Regular Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64906003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.433685856Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Maine Regular Jeans (Black 002)",
      "brand": "BOSS",
      "size": "30W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-maine-regular-jeans-649060#colcode=64906003",
      "title": "Boss - Maine Regular Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64906003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.433668749Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Magneton Short Sleeve Shirt (Navy 404)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-magneton-short-sleeve-shirt-557404#colcode=55740422",
      "title": "BOSS - Magneton Short Sleeve Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55740422_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:43.314049546Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 27.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Magneton Shirt (Bright Red)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-magneton-shirt-329722#colcode=32972208",
      "title": "Boss - Magneton Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32972208_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:45.504071791Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 24.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "MODERN WIDE 2.0 10243080 01 (Turquoise)",
      "brand": "BOSS",
      "size": "29W L30"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-modern-wide-20-10243080-01-659767#colcode=65976718",
      "title": "Boss - MODERN WIDE 2.0 10243080 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65976718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407576389Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "MODERN WIDE 2.0 10243080 01 (Turquoise)",
      "brand": "BOSS",
      "size": "28W L30"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-modern-wide-20-10243080-01-659767#colcode=65976718",
      "title": "Boss - MODERN WIDE 2.0 10243080 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65976718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407568630Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "MODERN WIDE 2.0 10243080 01 (Turquoise)",
      "brand": "BOSS",
      "size": "27W L30"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-modern-wide-20-10243080-01-659767#colcode=65976718",
      "title": "Boss - MODERN WIDE 2.0 10243080 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65976718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407560255Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "MODERN MOM 2.0 10235838 03 (Bright Blue)",
      "brand": "BOSS",
      "size": "28W L30"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-modern-mom-20-10235838-03-323192#colcode=32319218",
      "title": "Boss - MODERN MOM 2.0 10235838 03",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32319218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407742113Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "MM Waistcoat (Navy 419)",
      "brand": "BOSS",
      "size": "48 (58)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-mm-waistcoat-566004#colcode=56600418",
      "title": "Boss - MM Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/56600418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.403591647Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "MM Waistcoat (Navy 419)",
      "brand": "BOSS",
      "size": "46 (56)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-mm-waistcoat-566004#colcode=56600418",
      "title": "Boss - MM Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/56600418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.403585379Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "MM Waistcoat (Navy 419)",
      "brand": "BOSS",
      "size": "44 (54)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-mm-waistcoat-566004#colcode=56600418",
      "title": "Boss - MM Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/56600418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.403578688Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Lukas 53 Long Sleeve Shirt (Dark Blue 402)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-lukas-53-long-sleeve-shirt-558747#colcode=55874718",
      "title": "Boss - Lukas 53 Long Sleeve Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55874718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:45.504171635Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 24.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Lovvo Shacket (Open Beige 288)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-lovvo-shacket-608935#colcode=60893504",
      "title": "BOSS - Lovvo Shacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60893504_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.375423927Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Loflash 101 Shirt (Dark Blue)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-loflash-101-shirt-559474#colcode=55947418",
      "title": "Boss - Loflash 101 Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55947418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409211771Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Locky Long Sleeve Shirt (Open White 131)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-locky-long-sleeve-shirt-556494#colcode=55649401",
      "title": "Boss - Locky Long Sleeve Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55649401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403218175Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Locky Long Sleeve Shirt (Open White 131)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-locky-long-sleeve-shirt-556494#colcode=55649401",
      "title": "Boss - Locky Long Sleeve Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55649401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403225456Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Landye Overshirt (Dark Blue 404)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-landye-overshirt-608454#colcode=60845418",
      "title": "BOSS - Landye Overshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60845418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.375193101Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Lamont 62 Joggers (Black 001)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-lamont-62-joggers-482403#colcode=48240303",
      "title": "Boss - Lamont 62 Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48240303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.404026530Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Lamont 62 Joggers (Black 001)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-lamont-62-joggers-482403#colcode=48240303",
      "title": "Boss - Lamont 62 Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48240303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.404034074Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Katlin Bumbag-Tp 10228801 01 (Black)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-katlin-bumbag-tp-10228801-01-707792#colcode=70779203",
      "title": "BOSS - Katlin Bumbag-Tp 10228801 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/70779203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.399084133Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 52.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaitol Slim Trousers (Dark Blue 404)",
      "brand": "BOSS",
      "size": "54 (XXL)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaitol-slim-trousers-514119#colcode=51411918",
      "title": "Boss - Kaitol Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51411918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401485750Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaitol Slim Trousers (Dark Blue 404)",
      "brand": "BOSS",
      "size": "52 (XL)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaitol-slim-trousers-514119#colcode=51411918",
      "title": "Boss - Kaitol Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51411918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401476250Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaitol Slim Trousers (Dark Blue 404)",
      "brand": "BOSS",
      "size": "50 (L)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaitol-slim-trousers-514119#colcode=51411918",
      "title": "Boss - Kaitol Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51411918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401467811Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaitol Slim Trousers (Dark Blue 404)",
      "brand": "BOSS",
      "size": "48 (M)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaitol-slim-trousers-514119#colcode=51411918",
      "title": "Boss - Kaitol Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51411918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401459623Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaitol Slim Trousers (Dark Blue 404)",
      "brand": "BOSS",
      "size": "46 (S)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaitol-slim-trousers-514119#colcode=51411918",
      "title": "Boss - Kaitol Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51411918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401450636Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaito Trousers (Open White 131)",
      "brand": "BOSS",
      "size": "54 (XXL)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaito-trousers-510304#colcode=51030401",
      "title": "Boss - Kaito Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51030401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402643928Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaito Trousers (Open White 131)",
      "brand": "BOSS",
      "size": "52 (XL)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaito-trousers-510304#colcode=51030401",
      "title": "Boss - Kaito Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51030401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402635089Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaito Trousers (Open White 131)",
      "brand": "BOSS",
      "size": "50 (L)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaito-trousers-510304#colcode=51030401",
      "title": "Boss - Kaito Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51030401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402626079Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaito Trousers (Open White 131)",
      "brand": "BOSS",
      "size": "48 (M)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaito-trousers-510304#colcode=51030401",
      "title": "Boss - Kaito Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51030401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402617362Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kaito Trousers (Open White 131)",
      "brand": "BOSS",
      "size": "46 (S)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaito-trousers-510304#colcode=51030401",
      "title": "Boss - Kaito Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51030401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402608079Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Julios Knit T Shirt (Dark Blue)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-julios-knit-t-shirt-329924#colcode=32992418",
      "title": "Boss - Julios Knit T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32992418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402355374Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Julios Knit T Shirt (Bright Orange)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-julios-knit-t-shirt-733598#colcode=73359801",
      "title": "Boss - Julios Knit T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/73359801_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401152157Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Julios Knit T Shirt (Bright Orange)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-julios-knit-t-shirt-733598#colcode=73359801",
      "title": "Boss - Julios Knit T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/73359801_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401145514Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Joy Shirt (White)",
      "brand": "BOSS",
      "size": "40(15.7)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-joy-shirt-329889#colcode=32988901",
      "title": "Boss - Joy Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32988901_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402214996Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Jersey Polo Shirt (Dark Blue)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-jersey-polo-shirt-331188#colcode=33118818",
      "title": "Boss - Jersey Polo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/33118818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.433947667Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hapron 5 Trousers (Navy 410)",
      "brand": "BOSS",
      "size": "38 (54)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-hapron-5-trousers-362019#colcode=36201922",
      "title": "Boss - Hapron 5 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/36201922_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402417212Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hadiko X Jogging Bottoms (Pastel Pink 682)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-hadiko-x-jogging-bottoms-482085#colcode=48208506",
      "title": "Boss - Hadiko X Jogging Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48208506_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.434027923Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hadiko X Jogging Bottoms (Pastel Pink 682)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-hadiko-x-jogging-bottoms-482085#colcode=48208506",
      "title": "Boss - Hadiko X Jogging Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48208506_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.434037729Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "H Lenon Trousers (DBlue 401)",
      "brand": "BOSS",
      "size": "40W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-h-lenon-trousers-579501#colcode=57950118",
      "title": "Boss - H Lenon Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57950118_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376453727Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "H Lenon Trousers (DBlue 401)",
      "brand": "BOSS",
      "size": "38W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-h-lenon-trousers-579501#colcode=57950118",
      "title": "Boss - H Lenon Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57950118_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376446834Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "H Lenon Trousers (DBlue 401)",
      "brand": "BOSS",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-h-lenon-trousers-579501#colcode=57950118",
      "title": "Boss - H Lenon Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57950118_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376439829Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "H Lenon Trousers (DBlue 401)",
      "brand": "BOSS",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-h-lenon-trousers-579501#colcode=57950118",
      "title": "Boss - H Lenon Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57950118_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376432465Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "H Genius Trousers (DBlue 401)",
      "brand": "BOSS",
      "size": "32W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-h-genius-trousers-514135#colcode=51413518",
      "title": "Boss - H Genius Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376352241Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Genius Trousers (DBlue 402)",
      "brand": "BOSS",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-trousers-579496#colcode=57949618",
      "title": "Boss - Genius Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57949618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.377392304Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Genius Drawstring Trousers (Medium Beige260)",
      "brand": "BOSS",
      "size": "40W R (56)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376659952Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Genius Drawstring Trousers (Medium Beige260)",
      "brand": "BOSS",
      "size": "38W R (54)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376651417Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Genius Drawstring Trousers (Medium Beige260)",
      "brand": "BOSS",
      "size": "36W R (52)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376643016Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Genius Drawstring Trousers (Medium Beige260)",
      "brand": "BOSS",
      "size": "34W R (50)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376633469Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Genius Drawstring Trousers (Medium Beige260)",
      "brand": "BOSS",
      "size": "32W R (48)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376624894Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Genius Drawstring Trousers (Medium Beige260)",
      "brand": "BOSS",
      "size": "30W R (46)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376614943Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Dilio Crew Neck Jumper (Open Green)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-dilio-crew-neck-jumper-323960#colcode=32396015",
      "title": "Boss - Dilio Crew Neck Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32396015_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376158675Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Dilio Crew Neck Jumper (Open Green)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-dilio-crew-neck-jumper-323960#colcode=32396015",
      "title": "Boss - Dilio Crew Neck Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32396015_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376166433Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Delaware Jeans (Rust)",
      "brand": "BOSS",
      "size": "33W L"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-delaware-jeans-656780#colcode=65678008",
      "title": "Boss - Delaware Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65678008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401298658Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Delaware Jeans (Rust)",
      "brand": "BOSS",
      "size": "31W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-delaware-jeans-656780#colcode=65678008",
      "title": "Boss - Delaware Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65678008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.401291181Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Delaware 3-1 Edge Jeans (Navy)",
      "brand": "BOSS",
      "size": "33W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-delaware-3-1-edge-jeans-656642#colcode=65664218",
      "title": "Boss - Delaware 3-1 Edge Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65664218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.360392267Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 72.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Delaware 3-1 Edge Jeans (Navy)",
      "brand": "BOSS",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-delaware-3-1-edge-jeans-656642#colcode=65664218",
      "title": "Boss - Delaware 3-1 Edge Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65664218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.360386077Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 72.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Delaware 3-1 Edge Jeans (Navy)",
      "brand": "BOSS",
      "size": "31W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-delaware-3-1-edge-jeans-656642#colcode=65664218",
      "title": "Boss - Delaware 3-1 Edge Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65664218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.360380478Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 72.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Delaware 3-1 Edge Jeans (Navy)",
      "brand": "BOSS",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-delaware-3-1-edge-jeans-656642#colcode=65664218",
      "title": "Boss - Delaware 3-1 Edge Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65664218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.360373104Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 72.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Damin Jumper (Open Grey)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-damin-jumper-323954#colcode=32395402",
      "title": "Boss - Damin Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32395402_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409328619Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "C-Leon Trousers (DBlue 404)",
      "brand": "BOSS",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-c-leon-trousers-513266#colcode=51326618",
      "title": "Boss - C-Leon Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51326618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402949589Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "C-Leon Trousers (DBlue 404)",
      "brand": "BOSS",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-c-leon-trousers-513266#colcode=51326618",
      "title": "Boss - C-Leon Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51326618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402941388Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brem Trousers (Navy 410)",
      "brand": "BOSS",
      "size": "S (46)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-brem-trousers-554890#colcode=55489018",
      "title": "Boss - Brem Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55489018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407308485Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brem Trousers (Navy 410)",
      "brand": "BOSS",
      "size": "M (48)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-brem-trousers-554890#colcode=55489018",
      "title": "Boss - Brem Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55489018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407320253Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Ben Trousers (Navy 417)",
      "brand": "BOSS",
      "size": "38W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ben-trousers-579510#colcode=57951018",
      "title": "Boss - Ben Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57951018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.377459686Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Ben Trousers (Navy 417)",
      "brand": "BOSS",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ben-trousers-579510#colcode=57951018",
      "title": "Boss - Ben Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57951018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.377451375Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Ben Trousers (Navy 417)",
      "brand": "BOSS",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ben-trousers-579510#colcode=57951018",
      "title": "Boss - Ben Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57951018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.377444146Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Bank SPWZ Trousers (DBlue 402)",
      "brand": "BOSS",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bank-spwz-trousers-514128#colcode=51412818",
      "title": "Boss - Bank SPWZ Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51412818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.403928336Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Bank SPWZ Trousers (DBlue 402)",
      "brand": "BOSS",
      "size": "28W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bank-spwz-trousers-514128#colcode=51412818",
      "title": "Boss - Bank SPWZ Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51412818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.403921177Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Bank SPWZ Trousers (Black 001)",
      "brand": "BOSS",
      "size": "38W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bank-spwz-trousers-514128#colcode=51412803",
      "title": "Boss - Bank SPWZ Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51412803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.403798491Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Bank SPWZ Trousers (Black 001)",
      "brand": "BOSS",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bank-spwz-trousers-514128#colcode=51412803",
      "title": "Boss - Bank SPWZ Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51412803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.403790683Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Authentic Jogging Bottoms (Medium Grey 039)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-authentic-jogging-bottoms-488275#colcode=48827526",
      "title": "Boss - Authentic Jogging Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48827526_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:47.345239950Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 23.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Atipok Sweater (Open White)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-atipok-sweater-323950#colcode=32395001",
      "title": "Boss - Atipok Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32395001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.433533325Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Atipok Sweater (Open White)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-atipok-sweater-323950#colcode=32395001",
      "title": "Boss - Atipok Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32395001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.433538738Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Addison Shopper (Beige SMU)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-addison-shopper-707618#colcode=70761869",
      "title": "BOSS - Addison Shopper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/70761869_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.360015762Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 72.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Zalava Ld24 (Black 001)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-zalava-ld24-722759#colcode=72275903",
      "title": "Boss - Boss Zalava Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/72275903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:43.314610590Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 27.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " T-Tie 6 cm knit Sn99 (Medium Beige)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-t-tie-6-cm-knit-sn99-738603#colcode=73860304",
      "title": "Boss - Boss T-Tie 6 cm knit Sn99",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/73860304_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.414628546Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " T-Perry Short Sleeve Polo Shirt Mens (Dark Blue)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-t-perry-short-sleeve-polo-shirt-mens-327364#colcode=32736418",
      "title": "Boss - Boss T-Perry Short Sleeve Polo Shirt Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32736418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.377244996Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " T-Loren-Ar_Sz30 Sn99 (Dark Grey)",
      "brand": "BOSS",
      "size": "95"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-t-loren-arsz30-sn99-738023#colcode=73802302",
      "title": "Boss - Boss T-Loren-Ar_Sz30 Sn99",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/73802302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.398356038Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " T-Loren-Ar_Sz30 Sn99 (Dark Grey)",
      "brand": "BOSS",
      "size": "85"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-t-loren-arsz30-sn99-738023#colcode=73802302",
      "title": "Boss - Boss T-Loren-Ar_Sz30 Sn99",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/73802302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.398348926Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Skinny Jeans Womens (Medium Blue)",
      "brand": "BOSS",
      "size": "26 L30"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-skinny-jeans-womens-636073#colcode=63607318",
      "title": "Boss - Boss Skinny Jeans Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63607318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403471922Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Short Sleeve Shirt Mens (Open Blue 489)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-short-sleeve-shirt-mens-556296#colcode=55629618",
      "title": "Boss - Boss Short Sleeve Shirt Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55629618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:41.347247620Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Ronni_53F 10227 Sn99 (Black)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-ronni53f-10227-sn99-329720#colcode=32972003",
      "title": "Boss - Boss Ronni_53F 10227 Sn99",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32972003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:43.314313371Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 27.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Reid Check Shirt (Open Green360)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-reid-check-shirt-559363#colcode=55936315",
      "title": "Boss - Boss Reid Check Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55936315_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:43.311529813Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Pocket Square (Bright Red)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-pocket-square-772976#colcode=77297608",
      "title": "Boss - Boss Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/77297608_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:53.383095149Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 17.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Modrn WdeLg Jns Ld24 (Bright Blue 433)",
      "brand": "BOSS",
      "size": "30W"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-modrn-wdelg-jns-ld24-653228#colcode=65322818",
      "title": "BOSS - Boss Modrn WdeLg Jns Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65322818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.371059694Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 60.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Modrn WdeLg Jns Ld24 (Bright Blue 433)",
      "brand": "BOSS",
      "size": "29W"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-modrn-wdelg-jns-ld24-653228#colcode=65322818",
      "title": "BOSS - Boss Modrn WdeLg Jns Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65322818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.371047185Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 60.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Modrn WdeLg Jns Ld24 (Bright Blue 433)",
      "brand": "BOSS",
      "size": "28W"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-modrn-wdelg-jns-ld24-653228#colcode=65322818",
      "title": "BOSS - Boss Modrn WdeLg Jns Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65322818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.371038409Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 60.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Modrn WdeLg Jns Ld24 (Bright Blue 433)",
      "brand": "BOSS",
      "size": "27W"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-modrn-wdelg-jns-ld24-653228#colcode=65322818",
      "title": "BOSS - Boss Modrn WdeLg Jns Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65322818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.371029481Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 60.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Lyaran Scarf Womens (Black 001)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-lyaran-scarf-womens-902603#colcode=90260303",
      "title": "Boss - Boss Lyaran Scarf Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/90260303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403563833Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Lyara Scarf Womens (Black)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-lyara-scarf-womens-901147#colcode=90114703",
      "title": "Boss - Boss Lyara Scarf Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/90114703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.403517237Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Knitted Tie Mens (Dark Blue 404)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-knitted-tie-mens-756062#colcode=75606218",
      "title": "Boss - Boss Knitted Tie Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/75606218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:41.347317371Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Jason 10230062 Sn99 (Bright Blue)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-jason-10230062-sn99-327274#colcode=32727418",
      "title": "Boss - Boss Jason 10230062 Sn99",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32727418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:37.402007671Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 42.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Hover Fleece Jogging Bottoms Mens (Black 001)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-hover-fleece-jogging-bottoms-mens-483750#colcode=48375003",
      "title": "Boss - Boss Hover Fleece Jogging Bottoms Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48375003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.409587253Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " First Backpack Mens (Black)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-first-backpack-mens-716759#colcode=71675918",
      "title": "Boss - Boss First Backpack Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/71675918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.360685129Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 72.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Crosstown Phone Wallet Mens (Black)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-crosstown-phone-wallet-mens-887140#colcode=88714003",
      "title": "Boss - Boss Crosstown Phone Wallet Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/88714003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.376933615Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Banks Trousers (DBlue 402)",
      "brand": "BOSS",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-banks-trousers-514129#colcode=51412918",
      "title": "Boss - Boss Banks Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51412918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407867958Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Banks Trousers (DBlue 402)",
      "brand": "BOSS",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-banks-trousers-514129#colcode=51412918",
      "title": "Boss - Boss Banks Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51412918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407861950Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Banks Trousers (DBlue 402)",
      "brand": "BOSS",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-banks-trousers-514129#colcode=51412918",
      "title": "Boss - Boss Banks Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51412918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407855628Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Banks Trousers (DBlue 402)",
      "brand": "BOSS",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-banks-trousers-514129#colcode=51412918",
      "title": "Boss - Boss Banks Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51412918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:35.407847141Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Rolled Cuff Jeans (Dark Blue 76)",
      "brand": "KENZO",
      "size": "28W R"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-rolled-cuff-jeans-648001#colcode=64800122",
      "title": "KENZO - Rolled Cuff Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/64800122_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.368701920Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Smati Turtleneck Jumper (Dark Blue)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-smati-turtleneck-jumper-324034#colcode=32403418",
      "title": "Hugo - Smati Turtleneck Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32403418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.553807075Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Smati Turtleneck Jumper (Dark Blue)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-smati-turtleneck-jumper-324034#colcode=32403418",
      "title": "Hugo - Smati Turtleneck Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32403418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.553838891Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Heston Trousers (Pastel Blue 459)",
      "brand": "HUGO",
      "size": "40W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-heston-trousers-579207#colcode=57920718",
      "title": "Hugo - Heston Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57920718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.554306741Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Heston Trousers (Pastel Blue 459)",
      "brand": "HUGO",
      "size": "38W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-heston-trousers-579207#colcode=57920718",
      "title": "Hugo - Heston Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57920718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.554300355Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Heston Trousers (Pastel Blue 459)",
      "brand": "HUGO",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-heston-trousers-579207#colcode=57920718",
      "title": "Hugo - Heston Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57920718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.554294296Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Heston Trousers (Pastel Blue 459)",
      "brand": "HUGO",
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-heston-trousers-579207#colcode=57920718",
      "title": "Hugo - Heston Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57920718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.554287784Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hesten 182 Trousers (BBlue 438)",
      "brand": "HUGO",
      "size": "28W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hesten-182-trousers-514148#colcode=51414818",
      "title": "Hugo - Hesten 182 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51414818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.554708581Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Gyte Trousers (Medium Grey 030)",
      "brand": "HUGO",
      "size": "48 (M)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-gyte-trousers-512972#colcode=51297202",
      "title": "Hugo - Gyte Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51297202_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.554115338Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Gyte Trousers (Medium Grey 030)",
      "brand": "HUGO",
      "size": "46 (S)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-gyte-trousers-512972#colcode=51297202",
      "title": "Hugo - Gyte Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51297202_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.554108571Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Double Logo Socks (Pastel Pink)",
      "brand": "HUGO",
      "size": "36-42"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-double-logo-socks-803016#colcode=80301606",
      "title": "Hugo - Double Logo Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/80301606_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:13.458091964Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 5.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Doldberg Jogging Pants (Dark Green 304)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-doldberg-jogging-pants-483354#colcode=48335415",
      "title": "Hugo - Doldberg Jogging Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48335415_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.554598502Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brenon Jacket (Black 001)",
      "brand": "HUGO",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-brenon-jacket-619090#colcode=61909003",
      "title": "Hugo - Brenon Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/61909003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:53.534785220Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 68.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 Taper Jeans (Bright Blue 430)",
      "brand": "HUGO",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634-taper-jeans-649043#colcode=64904318",
      "title": "Hugo - 634 Taper Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64904318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:55.555018955Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " EthonNSzip Sn24 (Mscellaneous960)",
      "brand": "HUGO",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-ethonnszip-sn24-702894#colcode=70289415",
      "title": "Hugo - Hugo EthonNSzip Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/70289415_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:01.500805522Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 22.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Allie Belt 3.5cm Womens (Miscellaneous)",
      "brand": "HUGO",
      "size": "90 (12 L)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-allie-belt-35cm-womens-945247#colcode=94524703",
      "title": "Hugo - Hugo Allie Belt 3.5cm Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94524703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:01.501281765Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 22.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Allie Belt 3.5cm Womens (Miscellaneous)",
      "brand": "HUGO",
      "size": "85 (10 M)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-allie-belt-35cm-womens-945247#colcode=94524703",
      "title": "Hugo - Hugo Allie Belt 3.5cm Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94524703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:01.501276457Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 22.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Allie Belt 3.5cm Womens (Miscellaneous)",
      "brand": "HUGO",
      "size": "80 (8 S)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-allie-belt-35cm-womens-945247#colcode=94524703",
      "title": "Hugo - Hugo Allie Belt 3.5cm Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94524703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:01.501269849Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 22.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Weevo Crew Sweatshirt (Navy 404)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weevo-crew-sweatshirt-522427#colcode=52242720",
      "title": "Boss - Weevo Crew Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/52242720_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.430858004Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Super Skinny Crop Jeans (Dark Blue 406)",
      "brand": "BOSS",
      "size": "27 L30"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-super-skinny-crop-jeans-650728#colcode=65072818",
      "title": "Boss - Super Skinny Crop Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65072818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.432021499Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Super Skinny Crop Jeans (Dark Blue 406)",
      "brand": "BOSS",
      "size": "26 L30"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-super-skinny-crop-jeans-650728#colcode=65072818",
      "title": "Boss - Super Skinny Crop Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65072818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.432011482Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "See Acid Jogging Pants (Black 001)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-see-acid-jogging-pants-483737#colcode=48373703",
      "title": "BOSS - See Acid Jogging Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48373703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.429707175Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Schino Tapered Cord Trousers (Open Green)",
      "brand": "BOSS",
      "size": "31W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-schino-tapered-cord-trousers-552431#colcode=55243115",
      "title": "Boss - Schino Tapered Cord Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55243115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.431783551Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Pocket Square (Open Grey)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-pocket-square-747384#colcode=74738402",
      "title": "Boss - Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/74738402_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:49.346351117Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 22.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Pocket Square (Dark Brown)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-pocket-square-747384#colcode=74738405",
      "title": "Boss - Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/74738405_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:49.346388367Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 22.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Parlay Polo Shirt (Black 001)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-parlay-polo-shirt-543286#colcode=54328603",
      "title": "Boss - Parlay Polo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54328603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.431440067Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Parlay Polo Shirt (Black 001)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-parlay-polo-shirt-543286#colcode=54328603",
      "title": "Boss - Parlay Polo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54328603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.431449202Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Parlay 97 Polo Shirt (Black)",
      "brand": "BOSS",
      "size": "N/A"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-parlay-97-polo-shirt-543928#colcode=54392803",
      "title": "Boss - Parlay 97 Polo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54392803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.431624450Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Paoli Hoodie (Medium Grey)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-paoli-hoodie-323998#colcode=32399802",
      "title": "Boss - Paoli Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32399802_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.369568327Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 68.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Lukas 53 Shirt (Light Blue 450)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-lukas-53-shirt-325366#colcode=32536619",
      "title": "Boss - Lukas 53 Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32536619_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.431027560Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Locky 1 Long Sleeve Shirt (Open White 131)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-locky-1-long-sleeve-shirt-608486#colcode=60848601",
      "title": "Boss - Locky 1 Long Sleeve Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60848601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.429960047Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Lecco 80 T Shirt (Navy 402)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-lecco-80-t-shirt-602266#colcode=60226622",
      "title": "BOSS - Lecco 80 T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60226622_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:43.381977512Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hicon Gym Shorts (Black 001)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-hicon-gym-shorts-472800#colcode=47280003",
      "title": "Boss - Hicon Gym Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47280003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.431325947Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Headlow 2 Shorts (Black 001)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-headlow-2-shorts-472799#colcode=47279903",
      "title": "Boss - Headlow 2 Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47279903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.431229248Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hadiko 1 Joggers (Open Blue 481)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-hadiko-1-joggers-483479#colcode=48347918",
      "title": "Boss - Hadiko 1 Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48347918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.430601195Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hadiko 1 Joggers (Open Blue 481)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-hadiko-1-joggers-483479#colcode=48347918",
      "title": "Boss - Hadiko 1 Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48347918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.430613230Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hadiko 1 Joggers (Navy)",
      "brand": "BOSS",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-hadiko-1-joggers-483584#colcode=48358419",
      "title": "Boss - Hadiko 1 Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48358419_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.430152397Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "H-Pocket Square (Open White)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-h-pocket-square-758821#colcode=75882101",
      "title": "Boss - H-Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/75882101_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:43.382284681Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "C-Leon Trousers (OBlue 464)",
      "brand": "BOSS",
      "size": "28W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-c-leon-trousers-513270#colcode=51327018",
      "title": "Boss - C-Leon Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51327018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.431384784Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Amber Belt 15cm 10199089 01 (Pastel Pink)",
      "brand": "BOSS",
      "size": "90 (12 L)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-amber-belt-15cm-10199089-01-945548#colcode=94554806",
      "title": "Boss - Amber Belt 15cm 10199089 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94554806_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.432199650Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Amber Belt 15cm 10199089 01 (Pastel Pink)",
      "brand": "BOSS",
      "size": "85 (10 M)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-amber-belt-15cm-10199089-01-945548#colcode=94554806",
      "title": "Boss - Amber Belt 15cm 10199089 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94554806_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.432189162Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Amber Belt 15cm 10199089 01 (Pastel Pink)",
      "brand": "BOSS",
      "size": "80 (8 S)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-amber-belt-15cm-10199089-01-945548#colcode=94554806",
      "title": "Boss - Amber Belt 15cm 10199089 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94554806_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.432176312Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " TChrsto LS Shrt Sn99 (Medium Pink)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-tchrsto-ls-shrt-sn99-331208#colcode=33120806",
      "title": "Boss - Boss TChrsto LS Shrt Sn99",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/33120806_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.369690745Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 68.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " TChrsto LS Shrt Sn99 (Medium Pink)",
      "brand": "BOSS",
      "size": "41(16)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-tchrsto-ls-shrt-sn99-331208#colcode=33120806",
      "title": "Boss - Boss TChrsto LS Shrt Sn99",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/33120806_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.369700393Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 68.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " T-Pocket Square 33x33cm Mens (Dark Red)",
      "brand": "BOSS",
      "size": "PCS."
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-t-pocket-square-33x33cm-mens-731811#colcode=73181101",
      "title": "Boss - Boss T-Pocket Square 33x33cm Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/73181101_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:49.346310504Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 22.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Rudolf Belt Mens (Black 001)",
      "brand": "BOSS",
      "size": "95"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-rudolf-belt-mens-700754#colcode=70075403",
      "title": "Boss - Boss Rudolf Belt Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/70075403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:49.346145986Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 22.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Crosstown Wallet Mens (Light Beige)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-crosstown-wallet-mens-887138#colcode=88713804",
      "title": "Boss - Boss Crosstown Wallet Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/88713804_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:33.369936033Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 68.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Bold Belt Womens (Rust)",
      "brand": "BOSS",
      "size": "85 (10 M)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-bold-belt-womens-945568#colcode=94556805",
      "title": "Boss - Boss Bold Belt Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94556805_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.430299508Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Bold Belt Womens (Rust)",
      "brand": "BOSS",
      "size": "80 (8 S)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-bold-belt-womens-945568#colcode=94556805",
      "title": "Boss - Boss Bold Belt Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94556805_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.430286935Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Bold Belt Womens (Rust)",
      "brand": "BOSS",
      "size": "75 (6 XS)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-bold-belt-womens-945568#colcode=94556805",
      "title": "Boss - Boss Bold Belt Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/94556805_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:39.430274698Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " AOP Pocket Square Mens (White 100)",
      "brand": "BOSS",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-aop-pocket-square-mens-757001#colcode=75700101",
      "title": "Boss - Boss AOP Pocket Square Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/75700101_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:43.382415414Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "3 Pack Briefs (Black 001)",
      "brand": "HUGO",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-3-pack-briefs-422770#colcode=42277003",
      "title": "Hugo - 3 Pack Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42277003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:07.584879707Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 11.00,
      "discount": 67,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "3 Pack Briefs (Black 001)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-3-pack-briefs-422770#colcode=42277003",
      "title": "Hugo - 3 Pack Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42277003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:07.584886397Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 11.00,
      "discount": 67,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "2 Pack Of Stretch Cotton Jersey Trunks (White 100)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-2-pack-of-stretch-cotton-jersey-trunks-422181#colcode=42218101",
      "title": "HUGO - 2 Pack Of Stretch Cotton Jersey Trunks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42218101_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:09.478773218Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 9.00,
      "discount": 67,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Three Pack Of Briefs (Blk)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-three-pack-of-briefs-422306#colcode=42230699",
      "title": "Boss - Three Pack Of Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42230699_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:49.337248924Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 11.00,
      "discount": 67,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "AOP Trunks (Open Red 642)",
      "brand": "HUGO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-aop-trunks-423413#colcode=42341308",
      "title": "Hugo - AOP Trunks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42341308_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:11.413375692Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 9.00,
      "discount": 66,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Small Lpgo 2 Pack Crew Socks (Drk Grey 012)",
      "brand": "HUGO",
      "size": "MENS 3-4.5"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-small-lpgo-2-pack-crew-socks-411247#colcode=41124702",
      "title": "Hugo - Hugo Small Lpgo 2 Pack Crew Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/41124702_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:13.463468764Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 4.00,
      "discount": 66,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Enalu Overshirt (Brown, 16586467)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/brown-hugo-enalu-overshirt/16586467/",
      "title": "HUGO Enalu Overshirt (brown / M)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_572944_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T08:26:59.753772465Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 50.00,
      "discount": 62,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Pirol Polo Shirt (Black, 16580249)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/black-boss-pirol-polo-shirt/16580249/",
      "title": "BOSS Pirol Polo Shirt (black / M)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_574210_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T08:06:22.650449615Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 40.00,
      "discount": 60,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Hadiko Joggers (Grey, 16606838)",
      "brand": "BOSS",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/grey-boss-hadiko-joggers/16606838/",
      "title": "BOSS Hadiko Joggers (grey / S)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_578136_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:07.821686762Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 60.00,
      "discount": 54,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Branded-taping recycled-polyester bomber jacket",
      "brand": "EMPORIO ARMANI",
      "size": "44 - NERO"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-branded-taping-recycled-polyester-bomber-jacket_R04097175",
      "title": "Branded-taping recycled-polyester bomber jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R04097175_NERO_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:44.601549301Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "200.00",
        "wasPrice": "250.00",
        "wasWasPrice": "420.00"
      }
    },
    "price": {
      "buy": 200.00,
      "discount": 53,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Branded-taping recycled-polyester bomber jacket",
      "brand": "EMPORIO ARMANI",
      "size": "40 - NERO"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-branded-taping-recycled-polyester-bomber-jacket_R04097175",
      "title": "Branded-taping recycled-polyester bomber jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R04097175_NERO_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:48.134166851Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "200.00",
        "wasPrice": "250.00",
        "wasWasPrice": "420.00"
      }
    },
    "price": {
      "buy": 200.00,
      "discount": 53,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Breaker Overhead Jacket (Red, 18546115)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/red-hugo-breaker-overhead-jacket/18546115/",
      "title": "HUGO Breaker Overhead Jacket (red / M)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_613416_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:21.708170356Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 130.00,
      "discount": 52,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "46 - NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990229",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990229_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:06.133115204Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "44 - NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990229",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990229_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:10.131127822Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 7,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "44 - GREEN"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990228",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990228_GREEN_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:06.654396537Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 9,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "44 - BURGUNDY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990227",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990227_BURGUNDY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:00.130161574Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 2,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "44 - BLACK"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990230",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990230_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:54.656249507Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 4,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "42 - NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990229",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990229_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:12.130259627Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 6,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "42 - GREEN"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990228",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990228_GREEN_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:12.136077220Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 10,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "42 - BURGUNDY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990227",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990227_BURGUNDY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:25:52.602535043Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 13,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "42 - BLACK"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990230",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990230_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:02.135199572Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 12,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "40 - NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990229",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990229_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:04.574344299Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 3,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "40 - GREEN"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990228",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990228_GREEN_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:08.135306004Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 10,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "40 - BURGUNDY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990227",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990227_BURGUNDY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:25:54.129600471Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 6,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "40 - BLACK"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990230",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990230_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:56.135138128Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 5,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "38 - GREEN"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990228",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990228_GREEN_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:10.135272281Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "38 - BURGUNDY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990227",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990227_BURGUNDY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:25:58.131108305Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Turtleneck regular-fit wool jumper",
      "brand": "EMPORIO ARMANI",
      "size": "38 - BLACK"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990230",
      "title": "Turtleneck regular-fit wool jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990230_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:58.137037768Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "120.00",
        "wasPrice": "150.00",
        "wasWasPrice": "249.00"
      }
    },
    "price": {
      "buy": 120.00,
      "discount": 52,
      "quantityAvailable": 2,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Pixel Full Zip Tracksuit (Black, 16606836)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/black-boss-pixel-full-zip-tracksuit/16606836/",
      "title": "BOSS Pixel Full Zip Tracksuit (black / M)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_578128_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T09:16:54.338691482Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 125.00,
      "discount": 52,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Panelled embossed-branding faux-leather running trainers",
      "brand": "HUGO",
      "size": "EUR 39 / 5 UK MEN - BLACK"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/hugo-panelled-embossed-branding-faux-leather-running-trainers_R03870815",
      "title": "Panelled embossed-branding faux-leather running trainers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03870815_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:52.903076331Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "99.00",
        "wasPrice": "109.00",
        "wasWasPrice": "199.00"
      }
    },
    "price": {
      "buy": 99.00,
      "discount": 51,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Quilted leather jacket",
      "brand": "EMPORIO ARMANI",
      "size": "44 - BLACK"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-quilted-leather-jacket_R03990242",
      "title": "Quilted leather jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990242_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:28.609989181Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "650.00",
        "wasPrice": "750.00",
        "wasWasPrice": "1303.00"
      }
    },
    "price": {
      "buy": 650.00,
      "discount": 51,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo-badge reversible down shell jacket",
      "brand": "EMPORIO ARMANI",
      "size": "46 - NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:52.140119977Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "300.00",
        "wasPrice": "350.00",
        "wasWasPrice": "601.00"
      }
    },
    "price": {
      "buy": 300.00,
      "discount": 51,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo-badge reversible down shell jacket",
      "brand": "EMPORIO ARMANI",
      "size": "44 - NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:50.622365034Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "300.00",
        "wasPrice": "350.00",
        "wasWasPrice": "601.00"
      }
    },
    "price": {
      "buy": 300.00,
      "discount": 51,
      "quantityAvailable": 6,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo-badge reversible down shell jacket",
      "brand": "EMPORIO ARMANI",
      "size": "42 - NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:56.140567340Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "300.00",
        "wasPrice": "350.00",
        "wasWasPrice": "601.00"
      }
    },
    "price": {
      "buy": 300.00,
      "discount": 51,
      "quantityAvailable": 6,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "High-neck longline shell-down jacket",
      "brand": "EMPORIO ARMANI",
      "size": "38 - NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-high-neck-longline-shell-down-jacket_R03990218",
      "title": "High-neck longline shell-down jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990218_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:18.133128248Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "300.00",
        "wasPrice": "350.00",
        "wasWasPrice": "601.00"
      }
    },
    "price": {
      "buy": 300.00,
      "discount": 51,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "2-in-1 quilted-lining stretch-woven coat",
      "brand": "EMPORIO ARMANI",
      "size": "48 - BLU NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-2-in-1-quilted-lining-stretch-woven-coat_R03981581",
      "title": "2-in-1 quilted-lining stretch-woven coat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03981581_BLUNAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:38.135147367Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "320.00",
        "wasPrice": "390.00",
        "wasWasPrice": "650.00"
      }
    },
    "price": {
      "buy": 320.00,
      "discount": 51,
      "quantityAvailable": 2,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "2-in-1 quilted-lining stretch-woven coat",
      "brand": "EMPORIO ARMANI",
      "size": "46 - BLU NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-2-in-1-quilted-lining-stretch-woven-coat_R03981581",
      "title": "2-in-1 quilted-lining stretch-woven coat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03981581_BLUNAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:36.133696706Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "320.00",
        "wasPrice": "390.00",
        "wasWasPrice": "650.00"
      }
    },
    "price": {
      "buy": 320.00,
      "discount": 51,
      "quantityAvailable": 2,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "2-in-1 quilted-lining stretch-woven coat",
      "brand": "EMPORIO ARMANI",
      "size": "44 - BLU NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-2-in-1-quilted-lining-stretch-woven-coat_R03981581",
      "title": "2-in-1 quilted-lining stretch-woven coat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03981581_BLUNAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:28.621357707Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "320.00",
        "wasPrice": "390.00",
        "wasWasPrice": "650.00"
      }
    },
    "price": {
      "buy": 320.00,
      "discount": 51,
      "quantityAvailable": 2,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "2-in-1 quilted-lining stretch-woven coat",
      "brand": "EMPORIO ARMANI",
      "size": "42 - BLU NAVY"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-2-in-1-quilted-lining-stretch-woven-coat_R03981581",
      "title": "2-in-1 quilted-lining stretch-woven coat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03981581_BLUNAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:26:40.133750716Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "320.00",
        "wasPrice": "390.00",
        "wasWasPrice": "650.00"
      }
    },
    "price": {
      "buy": 320.00,
      "discount": 51,
      "quantityAvailable": 2,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Virgil Abloh. Nike. ICONS (Nike Ablo)",
      "brand": "TASCHEN",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/taschen-taschen-virgil-abloh-nike-icons-942231#colcode=94223199",
      "title": "Taschen - Taschen Virgil Abloh. Nike. ICONS",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/94223199_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.743865766Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Off Dye Knit Sweater (Bluette)",
      "brand": "STONE ISLAND",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-off-dye-knit-sweater-322587#colcode=32258718",
      "title": "STONE ISLAND - Off Dye Knit Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32258718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.705973076Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 159.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Script Logo Joggers (Black 1001)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-script-logo-joggers-488420#colcode=48842003",
      "title": "OFF WHITE - Script Logo Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48842003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.227268414Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 219.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Script Logo Joggers (Black 1001)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-script-logo-joggers-488420#colcode=48842003",
      "title": "OFF WHITE - Script Logo Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48842003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.227272840Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 219.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Scribble Flyers Baseball Cap (Blk)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-flyers-baseball-cap-393244#colcode=39324403",
      "title": "OFF WHITE - Scribble Flyers Baseball Cap",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39324403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.741674887Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 105.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Rib Turtleneck (Peacock 4545)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-rib-turtleneck-326898#colcode=32689818",
      "title": "OFF WHITE - Rib Turtleneck",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32689818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226620690Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 245.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Rib Turtleneck (Peacock 4545)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-rib-turtleneck-326898#colcode=32689818",
      "title": "OFF WHITE - Rib Turtleneck",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32689818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226626427Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 245.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Rib Turtleneck (Black 1010)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-rib-turtleneck-326898#colcode=32689803",
      "title": "OFF WHITE - Rib Turtleneck",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32689803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226516696Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 245.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Rib Turtleneck (Black 1010)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-rib-turtleneck-326898#colcode=32689803",
      "title": "OFF WHITE - Rib Turtleneck",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32689803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226522102Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 245.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Mule Out Of Office (Lght Gry 0561)",
      "brand": "OFF WHITE",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-mule-out-of-office-122621#colcode=12262102",
      "title": "OFF WHITE - Mule Out Of Office",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/12262102_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.227918587Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 185.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Mona Lisa Short Sleeve T Shirt (White Blue 0145)",
      "brand": "OFF WHITE",
      "size": "2XS"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-mona-lisa-short-sleeve-t-shirt-324909#colcode=32490901",
      "title": "OFF WHITE - Mona Lisa Short Sleeve T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32490901_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.740948348Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 135.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Mona Lisa Short Sleeve T Shirt (Black Blue 1045)",
      "brand": "OFF WHITE",
      "size": "2XS"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-mona-lisa-short-sleeve-t-shirt-324909#colcode=32490903",
      "title": "OFF WHITE - Mona Lisa Short Sleeve T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32490903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.228918352Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 135.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Mona Lisa Oth Hoodie (Black Blue 1045)",
      "brand": "OFF WHITE",
      "size": "2XS"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-mona-lisa-oth-hoodie-536280#colcode=53628003",
      "title": "OFF WHITE - Mona Lisa Oth Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53628003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.227163094Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 225.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Laundry T Shirt (Aubergine 3535)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-laundry-t-shirt-598449#colcode=59844924",
      "title": "OFF WHITE - Laundry T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/59844924_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.227460327Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 209.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Laundry T Shirt (Aubergine 3535)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-laundry-t-shirt-598449#colcode=59844924",
      "title": "OFF WHITE - Laundry T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/59844924_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.227464594Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 209.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Industrial Belt Swim Shorts (Black 1010)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-industrial-belt-swim-shorts-326895#colcode=32689503",
      "title": "OFF WHITE - Industrial Belt Swim Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32689503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.228268755Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 155.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Industrial Belt Swim Shorts (Black 1010)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-industrial-belt-swim-shorts-326895#colcode=32689503",
      "title": "OFF WHITE - Industrial Belt Swim Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32689503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.228272496Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 155.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Industrial Belt Stripe Socks (White 0118)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-industrial-belt-stripe-socks-412270#colcode=41227001",
      "title": "OFF WHITE - Industrial Belt Stripe Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41227001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.743470759Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 40.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Industrial Belt Stripe Socks (Black 1018)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-industrial-belt-stripe-socks-412270#colcode=41227003",
      "title": "OFF WHITE - Industrial Belt Stripe Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41227003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.743681823Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 40.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "For All Slim Track Pant (Black 1010)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-for-all-slim-track-pant-498063#colcode=49806303",
      "title": "OFF WHITE - For All Slim Track Pant",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/49806303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226868762Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 229.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "For All Slim Track Pant (Black 1010)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-for-all-slim-track-pant-498063#colcode=49806303",
      "title": "OFF WHITE - For All Slim Track Pant",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/49806303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226873731Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 229.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Degrade Thunder Skate Sweatshirt (Black)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-degrade-thunder-skate-sweatshirt-526256#colcode=52625603",
      "title": "OFF WHITE - Degrade Thunder Skate Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52625603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226721825Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 239.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Degrade Thunder Skate Sweatshirt (Black)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-degrade-thunder-skate-sweatshirt-526256#colcode=52625603",
      "title": "OFF WHITE - Degrade Thunder Skate Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52625603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226726821Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 239.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Arrow Track Top (Red 2501)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-track-top-554998#colcode=55499808",
      "title": "OFF WHITE - Arrow Track Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55499808_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226086838Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 249.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Arrow Track Top (Blue 4301)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-track-top-554998#colcode=55499818",
      "title": "OFF WHITE - Arrow Track Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55499818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226148141Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 249.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Arrow Track Top (Blue 4301)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-track-top-554998#colcode=55499818",
      "title": "OFF WHITE - Arrow Track Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55499818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226151821Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 249.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Arrow Monogram Calf Socks (Camel 6210)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-monogram-calf-socks-412740#colcode=41274005",
      "title": "OFF WHITE - Arrow Monogram Calf Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41274005_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.743581531Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 40.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Wave Boots (Black 99)",
      "brand": "KENZO",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-wave-boots-110740#colcode=11074003",
      "title": "KENZO - Wave Boots",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11074003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362013254Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 239.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Varsity Hoodie (Mid Blue 77)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-varsity-hoodie-536899#colcode=53689918",
      "title": "KENZO - Varsity Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53689918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.361916440Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 239.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Varsity Hoodie (Mid Blue 77)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-varsity-hoodie-536899#colcode=53689918",
      "title": "KENZO - Varsity Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53689918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.361925437Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 239.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Zip Hoodie (Dark Khaki 51)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-zip-hoodie-554859#colcode=55485915",
      "title": "KENZO - Tiger Zip Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55485915_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367276832Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Zip Hoodie (Dark Khaki 51)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-zip-hoodie-554859#colcode=55485915",
      "title": "KENZO - Tiger Zip Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55485915_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367283858Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Zip Hoodie (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-zip-hoodie-554859#colcode=55485903",
      "title": "KENZO - Tiger Zip Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55485903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367004292Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Zip Hoodie (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-zip-hoodie-554859#colcode=55485903",
      "title": "KENZO - Tiger Zip Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55485903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367010457Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Crest Jumper (Navy 76)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-crest-jumper-559897#colcode=55989722",
      "title": "KENZO - Tiger Crest Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55989722_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.370227173Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 115.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Crest Jumper (Dove Grey 95)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-crest-jumper-559897#colcode=55989702",
      "title": "KENZO - Tiger Crest Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55989702_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.370106059Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 115.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Logo Oversized Hoodie (Ink 78)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-logo-oversized-hoodie-534590#colcode=53459018",
      "title": "KENZO - Sport X Logo Oversized Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53459018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367147333Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Logo Oversized Hoodie (Ink 78)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-logo-oversized-hoodie-534590#colcode=53459018",
      "title": "KENZO - Sport X Logo Oversized Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53459018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367155389Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Paris Card Holder (Black 99)",
      "brand": "KENZO",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-paris-card-holder-717715#colcode=71771503",
      "title": "KENZO - Paris Card Holder",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71771503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.873043109Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Paris Cap (Black 99)",
      "brand": "KENZO",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-paris-cap-393236#colcode=39323603",
      "title": "KENZO - Paris Cap",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39323603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.872869370Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 55.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Monogram Track Pant (Black 99J)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-monogram-track-pant-488430#colcode=48843003",
      "title": "KENZO - Monogram Track Pant",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48843003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362437119Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 189.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Monogram Track Pant (Black 99J)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-monogram-track-pant-488430#colcode=48843003",
      "title": "KENZO - Monogram Track Pant",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48843003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362443007Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 189.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Monogram Track Jacket (Black 99J)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-monogram-track-jacket-554590#colcode=55459003",
      "title": "KENZO - Monogram Track Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55459003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362159386Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 205.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Monogram Track Jacket (Black 99J)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-monogram-track-jacket-554590#colcode=55459003",
      "title": "KENZO - Monogram Track Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55459003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362165425Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 205.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo T Shirt (Elect Blue 74)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-logo-t-shirt-599813#colcode=59981320",
      "title": "KENZO - Logo T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/59981320_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.873192012Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 50.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Hoodie (Mid Blue 77)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-logo-hoodie-532459#colcode=53245918",
      "title": "KENZO - Logo Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53245918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.368152499Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 135.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Hoodie (Mid Blue 77)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-logo-hoodie-532459#colcode=53245918",
      "title": "KENZO - Logo Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53245918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.368158922Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 135.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Hoodie (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-logo-hoodie-532459#colcode=53245903",
      "title": "KENZO - Logo Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53245903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.368389064Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 125.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Hoodie (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-logo-hoodie-532459#colcode=53245903",
      "title": "KENZO - Logo Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53245903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.368394170Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 125.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "K POPPY floral-print woven single fitted sheet 90cm x 200cm",
      "brand": "KENZO",
      "size": "SUPER KING - MULTICOLOURED"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/kenzo-k-poppy-floral-print-woven-single-fitted-sheet-90cm-x-200cm_R03920834",
      "title": "K POPPY floral-print woven single fitted sheet 90cm x 200cm",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03920834_MULTICOLOURED_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:50.404622220Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "94.50",
        "wasPrice": "189.00"
      }
    },
    "price": {
      "buy": 94.50,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "K POPPY floral-print woven single fitted sheet 90cm x 200cm",
      "brand": "KENZO",
      "size": "SINGLE - MULTICOLOURED"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/kenzo-k-poppy-floral-print-woven-single-fitted-sheet-90cm-x-200cm_R03920834",
      "title": "K POPPY floral-print woven single fitted sheet 90cm x 200cm",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03920834_MULTICOLOURED_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:48.936188280Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "54.50",
        "wasPrice": "109.00"
      }
    },
    "price": {
      "buy": 54.50,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Icon Tiger Jumper (Olive 49)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-icon-tiger-jumper-322324#colcode=32232404",
      "title": "KENZO - Icon Tiger Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32232404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362808310Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 169.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Flower Socks (Black 99)",
      "brand": "KENZO",
      "size": "42-45"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-flower-socks-410313#colcode=41031303",
      "title": "KENZO - Flower Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41031303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.874098748Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Flower Socks (Black 99)",
      "brand": "KENZO",
      "size": "39-41"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-flower-socks-410313#colcode=41031303",
      "title": "KENZO - Flower Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41031303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.874091756Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Flower Socks (Black 99)",
      "brand": "KENZO",
      "size": "36-38"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-flower-socks-410313#colcode=41031303",
      "title": "KENZO - Flower Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41031303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.874084743Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Cable Knit Wool Jumper (Off White 02)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-cable-knit-wool-jumper-324608#colcode=32460801",
      "title": "KENZO - Cable Knit Wool Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32460801_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362067813Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 239.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Boke Intarsia Crew Sweater (Mid Grey 96)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-boke-intarsia-crew-sweater-324607#colcode=32460702",
      "title": "KENZO - Boke Intarsia Crew Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32460702_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362335995Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 189.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Boke Intarsia Crew Sweater (Mid Grey 96)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-boke-intarsia-crew-sweater-324607#colcode=32460702",
      "title": "KENZO - Boke Intarsia Crew Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32460702_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362341544Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 189.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Turtleneck Jumper (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-kenzo-turtleneck-jumper-559546#colcode=55954603",
      "title": "KENZO - Kenzo Turtleneck Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55954603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.368531438Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 125.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Dyssop Embroidered Square Joggers (Green, 17253236)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/green-hugo-dyssop-embroidered-square-joggers/17253236/",
      "title": "HUGO Dyssop Embroidered Square Joggers (green / M)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_572912_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:01.728406585Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 50.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Doak Square Logo Joggers (Grey, 16539609)",
      "brand": "HUGO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/grey-hugo-doak-square-logo-joggers/16539609/",
      "title": "HUGO Doak Square Logo Joggers (grey / M)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_549720_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:57.712057693Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 50.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Colour Block Joggers (Grey, 16541993)",
      "brand": "EMPORIO ARMANI EA7",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/grey-emporio-armani-ea7-colour-block-joggers/16541993/",
      "title": "Emporio Armani EA7 Colour Block Joggers (grey / XS)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_551973_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:53.665281715Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 50.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani EA7"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Colour Block Joggers (Grey, 16541993)",
      "brand": "EMPORIO ARMANI EA7",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/grey-emporio-armani-ea7-colour-block-joggers/16541993/",
      "title": "Emporio Armani EA7 Colour Block Joggers (grey / S)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_551973_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:27:53.665310153Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 50.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani EA7"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Colour Block Joggers (Grey, 16541993)",
      "brand": "EMPORIO ARMANI EA7",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/grey-emporio-armani-ea7-colour-block-joggers/16541993/",
      "title": "Emporio Armani EA7 Colour Block Joggers (grey / M)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_551973_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-19T08:38:21.839102178Z",
      "seller": "JDSPORTS",
      "properties": {      }
    },
    "price": {
      "buy": 50.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani EA7"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Terry Shorts (Blue)",
      "brand": "EMPORIO ARMANI",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-terry-shorts-470643#colcode=47064318",
      "title": "Emporio Armani - Terry Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47064318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.400503818Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Terry Shorts (Blue)",
      "brand": "EMPORIO ARMANI",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-terry-shorts-470643#colcode=47064318",
      "title": "Emporio Armani - Terry Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/47064318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.769897238Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Terry Shorts (Blue)",
      "brand": "EMPORIO ARMANI",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-terry-shorts-470643#colcode=47064318",
      "title": "Emporio Armani - Terry Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47064318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.400507746Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Terry Shorts (Blue)",
      "brand": "EMPORIO ARMANI",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-terry-shorts-470643#colcode=47064318",
      "title": "Emporio Armani - Terry Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/47064318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.769904924Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Shiny Eagle T-shirt (Black00020)",
      "brand": "EMPORIO ARMANI",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-shiny-eagle-t-shirt-596372#colcode=59637203",
      "title": "Emporio Armani - Shiny Eagle T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59637203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.401402455Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 24.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Shiny Eagle T-shirt (Black00020)",
      "brand": "EMPORIO ARMANI",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-shiny-eagle-t-shirt-596372#colcode=59637203",
      "title": "Emporio Armani - Shiny Eagle T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/59637203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.771515204Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 24.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Shiny Eagle T-shirt (Black00020)",
      "brand": "EMPORIO ARMANI",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-shiny-eagle-t-shirt-596372#colcode=59637203",
      "title": "Emporio Armani - Shiny Eagle T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59637203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.401418763Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 24.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Shiny Eagle T-shirt (Black00020)",
      "brand": "EMPORIO ARMANI",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-shiny-eagle-t-shirt-596372#colcode=59637203",
      "title": "Emporio Armani - Shiny Eagle T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/59637203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.771520969Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 24.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Flip Flops (Flame M583)",
      "brand": "EMPORIO ARMANI",
      "size": "9.5 (43.5)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-logo-flip-flops-222520#colcode=22252008",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/22252008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.402413478Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Flip Flops (Flame M583)",
      "brand": "EMPORIO ARMANI",
      "size": "9.5 (43.5)"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-logo-flip-flops-222520#colcode=22252008",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/22252008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.777598626Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Flip Flops (Flame M583)",
      "brand": "EMPORIO ARMANI",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-logo-flip-flops-222520#colcode=22252008",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/22252008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.402408519Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Flip Flops (Flame M583)",
      "brand": "EMPORIO ARMANI",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-logo-flip-flops-222520#colcode=22252008",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/22252008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.777591487Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Flip Flops (Cobalt 00087)",
      "brand": "EMPORIO ARMANI",
      "size": "9.5 (43.5)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-logo-flip-flops-222520#colcode=22252018",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/22252018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.402540367Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Flip Flops (Cobalt 00087)",
      "brand": "EMPORIO ARMANI",
      "size": "9.5 (43.5)"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-logo-flip-flops-222520#colcode=22252018",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/22252018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.779414959Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Flip Flops (Cobalt 00087)",
      "brand": "EMPORIO ARMANI",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-logo-flip-flops-222520#colcode=22252018",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/22252018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.402535536Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Flip Flops (Cobalt 00087)",
      "brand": "EMPORIO ARMANI",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-logo-flip-flops-222520#colcode=22252018",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/22252018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.779408007Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Relaxed Jogger Bottoms (Aqua)",
      "brand": "STONE ISLAND",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-relaxed-jogger-bottoms-481221#colcode=48122118",
      "title": "STONE ISLAND - Relaxed Jogger Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48122118_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.706715858Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 129.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Relaxed Jogger Bottoms (Aqua)",
      "brand": "STONE ISLAND",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-relaxed-jogger-bottoms-481221#colcode=48122118",
      "title": "STONE ISLAND - Relaxed Jogger Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48122118_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.706723139Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 129.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Cargo Trousers (Navy)",
      "brand": "STONE ISLAND",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-cargo-trousers-518283#colcode=51828318",
      "title": "STONE ISLAND - Cargo Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/51828318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.711357511Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 119.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Cargo Trousers (Beige)",
      "brand": "STONE ISLAND",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-cargo-trousers-518283#colcode=51828304",
      "title": "STONE ISLAND - Cargo Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/51828304_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.711464757Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 119.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Cargo Trousers (Beige)",
      "brand": "STONE ISLAND",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-cargo-trousers-518283#colcode=51828304",
      "title": "STONE ISLAND - Cargo Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/51828304_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.711471275Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 119.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Cargo Pants (Blue)",
      "brand": "STONE ISLAND",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-cargo-pants-518483#colcode=51848318",
      "title": "STONE ISLAND - Cargo Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/51848318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.706374186Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 135.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Cargo Pants (Blue)",
      "brand": "STONE ISLAND",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-cargo-pants-518483#colcode=51848318",
      "title": "STONE ISLAND - Cargo Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/51848318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.706380793Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 135.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Scribble Arrow Shirt (Wht)",
      "brand": "OFF WHITE",
      "size": "S (46)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-arrow-shirt-557840#colcode=55784001",
      "title": "OFF WHITE - Scribble Arrow Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55784001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226328994Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 249.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Scribble Arrow Shirt (Wht)",
      "brand": "OFF WHITE",
      "size": "M (48)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-arrow-shirt-557840#colcode=55784001",
      "title": "OFF WHITE - Scribble Arrow Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55784001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.226337628Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 249.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Off Diag Wallet Sn24 (Black 1001)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-off-diag-wallet-sn24-719555#colcode=71955503",
      "title": "OFF WHITE - Off Diag Wallet Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71955503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.228705919Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Off Diag CH Sn24 (Black 1001)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-off-diag-ch-sn24-719553#colcode=71955303",
      "title": "OFF WHITE - Off Diag CH Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71955303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.742177364Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 88.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Neen Arrow Sweatshirt (Black 1001)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-neen-arrow-sweatshirt-520713#colcode=52071303",
      "title": "OFF WHITE - Neen Arrow Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52071303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.227080992Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 235.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Monogram Baseball Cap (Camel)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-monogram-baseball-cap-392536#colcode=39253605",
      "title": "OFF WHITE - Monogram Baseball Cap",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39253605_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.741417706Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 109.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Mona Lisa Double Sleeve T Shirt (White Blue 0145)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-mona-lisa-double-sleeve-t-shirt-587333#colcode=58733301",
      "title": "OFF WHITE - Mona Lisa Double Sleeve T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/58733301_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.228067702Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 169.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Metal Arrow Sweatshirt (White1039)",
      "brand": "OFF WHITE",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-metal-arrow-sweatshirt-520939#colcode=52093903",
      "title": "OFF WHITE - Metal Arrow Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52093903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.227010986Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 235.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Diagonal Tab Sweater (Khaki 5656)",
      "brand": "OFF WHITE",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-diagonal-tab-sweater-522655#colcode=52265515",
      "title": "OFF WHITE - Diagonal Tab Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52265515_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.227598504Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 215.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Arrow Bucket Hat (Black 1001)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-bucket-hat-393214#colcode=39321403",
      "title": "OFF WHITE - Arrow Bucket Hat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39321403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.741209136Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 129.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Joggers (Dove Grey 95)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-joggers-482596#colcode=48259602",
      "title": "KENZO - Tiger Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48259602_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.372712665Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 98.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Joggers (Dove Grey 95)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-joggers-482596#colcode=48259602",
      "title": "KENZO - Tiger Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48259602_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.372718987Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 98.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger High Top Sneakers (Black 99)",
      "brand": "KENZO",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-high-top-sneakers-110579#colcode=11057903",
      "title": "KENZO - Tiger High Top Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11057903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367803081Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Crest Sweatshirt (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-crest-sweatshirt-524929#colcode=52492903",
      "title": "KENZO - Tiger Crest Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52492903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.372337781Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 109.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Crest Sweatshirt (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-crest-sweatshirt-524929#colcode=52492903",
      "title": "KENZO - Tiger Crest Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52492903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.372345410Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 109.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Crest Logo Shirt (Navy 76)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-crest-logo-shirt-558541#colcode=55854122",
      "title": "KENZO - Tiger Crest Logo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55854122_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.373847442Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 78.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tiger Crest Logo Shirt (Navy 76)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-crest-logo-shirt-558541#colcode=55854122",
      "title": "KENZO - Tiger Crest Logo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55854122_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.373854502Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 78.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Swing Sneakers (White 01)",
      "brand": "KENZO",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-swing-sneakers-111164#colcode=11116401",
      "title": "KENZO - Swing Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11116401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366029475Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 175.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Swing Low Profile Sneakers (Black 99)",
      "brand": "KENZO",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-swing-low-profile-sneakers-111159#colcode=11115903",
      "title": "KENZO - Swing Low Profile Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11115903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366285298Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 175.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Shorts (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-shorts-472386#colcode=47238603",
      "title": "KENZO - Sport X Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/47238603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.373468754Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 88.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Shorts (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-shorts-472386#colcode=47238603",
      "title": "KENZO - Sport X Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/47238603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.373475414Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 88.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Oversized Sweatshirt (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-oversized-sweatshirt-524282#colcode=52428203",
      "title": "KENZO - Sport X Oversized Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52428203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.370476083Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 109.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Oversized Sweatshirt (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-oversized-sweatshirt-524282#colcode=52428203",
      "title": "KENZO - Sport X Oversized Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52428203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.370484027Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 109.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Logo Oversized Hoodie (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-logo-oversized-hoodie-534590#colcode=53459003",
      "title": "KENZO - Sport X Logo Oversized Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53459003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.368016714Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 139.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Logo Oversized Hoodie (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-logo-oversized-hoodie-534590#colcode=53459003",
      "title": "KENZO - Sport X Logo Oversized Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53459003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.368022971Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 139.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Jogging Bottoms (Ink 78)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-jogging-bottoms-482348#colcode=48234818",
      "title": "KENZO - Sport X Jogging Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48234818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.372890687Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 98.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport X Jogging Bottoms (Ink 78)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-x-jogging-bottoms-482348#colcode=48234818",
      "title": "KENZO - Sport X Jogging Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/48234818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.372898941Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 98.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sport Cap (Black 99)",
      "brand": "KENZO",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-cap-392057#colcode=39205703",
      "title": "KENZO - Sport Cap",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39205703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.873682566Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Skinny Jeans (Black 99)",
      "brand": "KENZO",
      "size": "28W R"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-skinny-jeans-640053#colcode=64005303",
      "title": "KENZO - Skinny Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/64005303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.373312497Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 88.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "School Low Sneakers (Noir 99)",
      "brand": "KENZO",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-school-low-sneakers-125460#colcode=12546003",
      "title": "Kenzo - School Low Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/12546003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.368277554Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 135.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "School High Top Sneakers (Cream 04)",
      "brand": "KENZO",
      "size": "9 (43)"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-school-high-top-sneakers-110385#colcode=11038501",
      "title": "KENZO - School High Top Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11038501_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367702896Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Relaxed Tailored Pants (Mid Blue 77)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-relaxed-tailored-pants-670378#colcode=67037818",
      "title": "KENZO - Relaxed Tailored Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/67037818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366856239Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 159.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Paris Sweater (Med Red 21)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-paris-sweater-523893#colcode=52389308",
      "title": "KENZO - Paris Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52389308_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367487767Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Paris Sweater (Med Red 21)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-paris-sweater-523893#colcode=52389308",
      "title": "KENZO - Paris Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52389308_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367494324Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Long Sleeve Flower T Shirt (Black 99J)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-long-sleeve-flower-t-shirt-587451#colcode=58745103",
      "title": "KENZO - Long Sleeve Flower T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/58745103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.372119313Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 109.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Long Sleeve Flower T Shirt (Black 99J)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-long-sleeve-flower-t-shirt-587451#colcode=58745103",
      "title": "KENZO - Long Sleeve Flower T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/58745103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.372132063Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 109.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo T Shirt (Mid Blue 77)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-logo-t-shirt-599813#colcode=59981319",
      "title": "KENZO - Logo T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/59981319_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.873562671Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Hoodie (Kahki 51A)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-logo-hoodie-532459#colcode=53245915",
      "title": "KENZO - Logo Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53245915_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367605293Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Logo Hoodie (Kahki 51A)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-logo-hoodie-532459#colcode=53245915",
      "title": "KENZO - Logo Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53245915_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367611575Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Knit Monogram T Shirt (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-knit-monogram-t-shirt-322331#colcode=32233103",
      "title": "KENZO - Knit Monogram T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32233103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.370656331Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 109.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Knit Monogram T Shirt (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-knit-monogram-t-shirt-322331#colcode=32233103",
      "title": "KENZO - Knit Monogram T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32233103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.370663636Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 109.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Icon Tiger T Shirt (Grey 95 (2))",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-icon-tiger-t-shirt-598352#colcode=59835226",
      "title": "KENZO - Icon Tiger T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/59835226_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.873354031Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Icon Tiger T Shirt (Grey 95 (2))",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-icon-tiger-t-shirt-598352#colcode=59835226",
      "title": "KENZO - Icon Tiger T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/59835226_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.873361714Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Boke Jumper (Black 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-boke-jumper-324610#colcode=32461003",
      "title": "KENZO - Boke Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32461003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362721276Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 185.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Boke Jumper (Black 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-boke-jumper-324610#colcode=32461003",
      "title": "KENZO - Boke Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/32461003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.362726295Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 185.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Big Flower Sweatshirt (Mid Blue 77)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-big-flower-sweatshirt-523408#colcode=52340818",
      "title": "KENZO - Big Flower Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52340818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367376115Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Big Flower Sweatshirt (Mid Blue 77)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-big-flower-sweatshirt-523408#colcode=52340818",
      "title": "KENZO - Big Flower Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52340818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367384899Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Back Flower Sweatshirt (Grass Green 57)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-back-flower-sweatshirt-523768#colcode=52376815",
      "title": "KENZO - Back Flower Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52376815_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366700245Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 159.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Back Flower Sweatshirt (Grass Green 57)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-back-flower-sweatshirt-523768#colcode=52376815",
      "title": "KENZO - Back Flower Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52376815_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.366707242Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 159.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Straight Jean Sn24 (Noir 99)",
      "brand": "KENZO",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-kenzo-straight-jean-sn24-655754#colcode=65575403",
      "title": "Kenzo - Kenzo Straight Jean Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/65575403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367908762Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": " Straight Jean Sn24 (Noir 99)",
      "brand": "KENZO",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-kenzo-straight-jean-sn24-655754#colcode=65575403",
      "title": "Kenzo - Kenzo Straight Jean Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/65575403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:22:29.367915812Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 145.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "kenzo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Leisure checked regular-fit woven coat",
      "brand": "HUGO",
      "size": "M - OPEN MISCELLANEOUS"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/hugo-leisure-checked-regular-fit-woven-coat_R03963154",
      "title": "Leisure checked regular-fit woven coat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03963154_OPENMISCELLANEOUS_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:21:38.419703515Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "219.00",
        "wasPrice": "259.00",
        "wasWasPrice": "429.00"
      }
    },
    "price": {
      "buy": 219.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Underwear Set (Marine00135)",
      "brand": "EMPORIO ARMANI",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-underwear-set-421787#colcode=42178718",
      "title": "Emporio Armani - Underwear Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42178718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.400337272Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 38.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Underwear Set (Marine00135)",
      "brand": "EMPORIO ARMANI",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-underwear-set-421787#colcode=42178718",
      "title": "Emporio Armani - Underwear Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42178718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.769546821Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 38.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Underwear Set (Marine00135)",
      "brand": "EMPORIO ARMANI",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-underwear-set-421787#colcode=42178718",
      "title": "Emporio Armani - Underwear Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42178718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.400340935Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 38.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Underwear Set (Marine00135)",
      "brand": "EMPORIO ARMANI",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-underwear-set-421787#colcode=42178718",
      "title": "Emporio Armani - Underwear Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42178718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.769553817Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 38.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Emporio Eagle Towel Sn22 (Navy 06935)",
      "brand": "EMPORIO ARMANI",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-emporio-eagle-towel-sn22-797010#colcode=79701003",
      "title": "Emporio Armani - Emporio Eagle Towel Sn22",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/79701003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T07:17:09.240443835Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Emporio Eagle Towel Sn22 (Navy 06935)",
      "brand": "EMPORIO ARMANI",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-emporio-eagle-towel-sn22-797010#colcode=79701003",
      "title": "Emporio Armani - Emporio Eagle Towel Sn22",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/79701003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T07:17:07.283178096Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 33.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Eagle Label T-shirt (Dark Grey06749)",
      "brand": "EMPORIO ARMANI",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-eagle-label-t-shirt-596373#colcode=59637302",
      "title": "Emporio Armani - Eagle Label T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59637302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.401110414Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 28.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Eagle Label T-shirt (Dark Grey06749)",
      "brand": "EMPORIO ARMANI",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-eagle-label-t-shirt-596373#colcode=59637302",
      "title": "Emporio Armani - Eagle Label T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/59637302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.770989974Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 28.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Eagle Label T-shirt (Dark Grey06749)",
      "brand": "EMPORIO ARMANI",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-eagle-label-t-shirt-596373#colcode=59637302",
      "title": "Emporio Armani - Eagle Label T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59637302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:19.401114756Z",
      "seller": "SCOTTS",
      "properties": {      }
    },
    "price": {
      "buy": 28.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Eagle Label T-shirt (Dark Grey06749)",
      "brand": "EMPORIO ARMANI",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-eagle-label-t-shirt-596373#colcode=59637302",
      "title": "Emporio Armani - Eagle Label T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/59637302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:28:17.770997747Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 28.00,
      "discount": 49,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Pull Over Polo Shirt (Salmon)",
      "brand": "STONE ISLAND",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-pull-over-polo-shirt-543993#colcode=54399312",
      "title": "STONE ISLAND - Pull Over Polo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/54399312_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.711547990Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 115.00,
      "discount": 48,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Thunder Beanie (Black)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-thunder-beanie-907655#colcode=90765503",
      "title": "OFF WHITE - Thunder Beanie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/90765503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.741798501Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 105.00,
      "discount": 48,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Scribble Flyer Socks (Blk)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-flyer-socks-410496#colcode=41049603",
      "title": "OFF WHITE - Scribble Flyer Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41049603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.743297653Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 44.00,
      "discount": 48,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Scribble Arrow Socks (Wht)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-arrow-socks-410330#colcode=41033001",
      "title": "OFF WHITE - Scribble Arrow Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41033001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.743134061Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 44.00,
      "discount": 48,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Joseph Square Frame Sunglasses (Red 2507)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-joseph-square-frame-sunglasses-719714#colcode=71971408",
      "title": "OFF WHITE - Joseph Square Frame Sunglasses",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71971408_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.741265685Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 115.00,
      "discount": 48,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Joseph Square Frame Sunglasses (Blue 4507)",
      "brand": "OFF WHITE",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-joseph-square-frame-sunglasses-719714#colcode=71971418",
      "title": "OFF WHITE - Joseph Square Frame Sunglasses",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71971418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:31:49.741305703Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 115.00,
      "discount": 48,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "off-white"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "BOSS x NBA Lakers cotton-blend hoody",
      "brand": "BOSS",
      "size": "S - OPEN GREEN"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/boss-boss-x-nba-lakers-cotton-blend-hoody_R03963041",
      "title": "BOSS x NBA Lakers cotton-blend hoody",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03963041_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:59.415049645Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName"
      }
    },
    "price": {
      "buy": 89.00,
      "discount": 48,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "BOSS x NBA Lakers cotton-blend hoody",
      "brand": "BOSS",
      "size": "S - BLACK"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/boss-boss-x-nba-lakers-cotton-blend-hoody_R03963041",
      "title": "BOSS x NBA Lakers cotton-blend hoody",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03963041_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:32:45.417367926Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "89.00",
        "wasPrice": "169.00"
      }
    },
    "price": {
      "buy": 89.00,
      "discount": 48,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "BOSS x NBA Lakers cotton-blend hoody",
      "brand": "BOSS",
      "size": "M - OPEN GREEN"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/boss-boss-x-nba-lakers-cotton-blend-hoody_R03963041",
      "title": "BOSS x NBA Lakers cotton-blend hoody",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03963041_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:33:07.414947005Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName"
      }
    },
    "price": {
      "buy": 89.00,
      "discount": 48,
      "quantityAvailable": 3,
      "sell": null,
      "credit": null
    },
    "foundWith": "boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Zip Through Sweatshirt (Black)",
      "brand": "STONE ISLAND",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-zip-through-sweatshirt-531853#colcode=53185303",
      "title": "STONE ISLAND - Zip Through Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53185303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.711680086Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 245.00,
      "discount": 30,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Zip Through Sweatshirt (Black)",
      "brand": "STONE ISLAND",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-zip-through-sweatshirt-531853#colcode=53185303",
      "title": "STONE ISLAND - Zip Through Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53185303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:12.711686498Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 245.00,
      "discount": 30,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Tipped Badge Logo Polo Shirt (Rosa Q)",
      "brand": "STONE ISLAND",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-tipped-badge-logo-polo-shirt-540124#colcode=54012486",
      "title": "STONE ISLAND - Tipped Badge Logo Polo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/54012486_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:13.231729606Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 105.00,
      "discount": 30,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Pullover Hoodie (Rose)",
      "brand": "STONE ISLAND",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-pullover-hoodie-531861#colcode=53186106",
      "title": "STONE ISLAND - Pullover Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/53186106_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:29:13.229854951Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 182.00,
      "discount": 30,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "generic",
      "name": "Watch Ultra (Cel) NO STRAP, Titanium, 49mm, A"
    },
    "listingDetails": {
      "url": "https://uk.webuy.com/product-detail/?id=SAWATUCTI49A",
      "title": "Watch Ultra (Cel) NO STRAP, Titanium, 49mm, A",
      "category": "Apple Watch",
      "shortDescription": null,
      "description": null,
      "image": null,
      "condition": "USED / A",
      "datePosted": "2023-04-19T10:30:11.176122336Z",
      "seller": "CEX",
      "properties": {
        "exchangePerc": "75",
        "firstPrice": "800",
        "previousPrice": "620",
        "priceLastChanged": "2023-04-15 02:01:01"
      }
    },
    "price": {
      "buy": 590,
      "discount": null,
      "quantityAvailable": 99,
      "sell": 383,
      "credit": 442
    },
    "foundWith": "Watch Series Ultra (Cel) NO STRAP, Titanium"
  },
  {
    "itemDetails": {
      "kind": "generic",
      "name": "NVIDIA RTX 4090 (19/19)"
    },
    "listingDetails": {
      "url": "https://www.scan.co.uk/",
      "title": "NVIDIA RTX 4090",
      "category": "GPU",
      "shortDescription": null,
      "description": null,
      "image": "https://assets.nvidia.partners/images/png/GeForce-RTX4090-Back.png",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:30:27.904731156Z",
      "seller": "NVIDIA",
      "properties": {      }
    },
    "price": {
      "buy": 1599.0,
      "discount": null,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "geforce"
  },
  {
    "itemDetails": {
      "kind": "generic",
      "name": "NVIDIA RTX 4070 (19/19)"
    },
    "listingDetails": {
      "url": "https://www.scan.co.uk/",
      "title": "NVIDIA RTX 4070",
      "category": "GPU",
      "shortDescription": null,
      "description": null,
      "image": "https://assets.nvidia.partners/images/png/GeForce-ADA-RTX4070-Back.png",
      "condition": "NEW",
      "datePosted": "2023-04-19T10:30:27.904954643Z",
      "seller": "NVIDIA",
      "properties": {      }
    },
    "price": {
      "buy": 589.0,
      "discount": null,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "geforce"
  }
]
