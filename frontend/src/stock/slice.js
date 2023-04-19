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
    max: 10000,
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
      state.selectedFilters = {...action.payload}
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
          state.filters.sizes = distinct(action.payload.map(i => i.itemDetails.sizes))
          state.filters.retailers = distinct(action.payload.map(i => i.listingDetails.seller))
          state.selectedFilters = {...state.filters}
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
      "datePosted": "2023-04-19T06:44:05.805049927Z",
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
      "datePosted": "2023-04-19T06:43:17.422396648Z",
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
      "datePosted": "2023-04-19T06:41:37.206789797Z",
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
      "datePosted": "2023-04-19T06:43:02.059325824Z",
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
      "datePosted": "2023-04-19T06:43:02.059338212Z",
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
      "datePosted": "2023-04-19T06:43:02.058227822Z",
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
      "datePosted": "2023-04-19T06:43:02.153620230Z",
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
      "datePosted": "2023-04-19T06:43:02.153634612Z",
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
      "datePosted": "2023-04-19T06:43:02.152836330Z",
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
      "datePosted": "2023-04-19T06:44:09.454511955Z",
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
      "datePosted": "2023-04-19T06:44:09.454504052Z",
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
      "datePosted": "2023-04-19T06:44:09.454496391Z",
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
      "datePosted": "2023-04-19T06:44:09.454483143Z",
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
      "datePosted": "2023-04-19T06:44:07.465101419Z",
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
      "datePosted": "2023-04-19T06:44:07.465094130Z",
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
      "datePosted": "2023-04-19T06:44:07.465084959Z",
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
      "datePosted": "2023-04-19T06:44:11.365376178Z",
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
      "datePosted": "2023-04-19T06:44:07.458676294Z",
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
      "datePosted": "2023-04-19T06:44:07.458667748Z",
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
      "datePosted": "2023-04-19T06:44:07.458658985Z",
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
      "datePosted": "2023-04-19T06:44:07.458649988Z",
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
      "datePosted": "2023-04-19T06:44:07.458641153Z",
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
      "datePosted": "2023-04-19T06:44:07.457915063Z",
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
      "datePosted": "2023-04-19T06:44:07.457906764Z",
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
      "datePosted": "2023-04-19T06:44:07.457892845Z",
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
      "datePosted": "2023-04-19T06:44:05.710736942Z",
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
      "datePosted": "2023-04-19T06:44:05.710729843Z",
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
      "datePosted": "2023-04-19T06:44:05.641508867Z",
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
      "datePosted": "2023-04-19T06:44:05.641492548Z",
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
      "datePosted": "2023-04-19T06:44:05.641500829Z",
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
      "datePosted": "2023-04-19T06:44:05.641484014Z",
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
      "datePosted": "2023-04-19T06:44:05.641475217Z",
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
      "datePosted": "2023-04-19T06:44:05.695354797Z",
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
      "datePosted": "2023-04-19T06:44:05.695337813Z",
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
      "datePosted": "2023-04-19T06:44:05.695346962Z",
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
      "datePosted": "2023-04-19T06:44:05.695316033Z",
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
      "datePosted": "2023-04-19T06:44:07.459405807Z",
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
      "datePosted": "2023-04-19T06:44:07.459393158Z",
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
      "datePosted": "2023-04-19T06:44:09.467096901Z",
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
      "datePosted": "2023-04-19T06:44:07.463489089Z",
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
      "datePosted": "2023-04-19T06:44:07.463478226Z",
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
      "datePosted": "2023-04-19T06:44:07.463468138Z",
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
      "datePosted": "2023-04-19T06:44:07.463454462Z",
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
      "datePosted": "2023-04-19T06:44:05.696716158Z",
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
      "datePosted": "2023-04-19T06:44:05.696709808Z",
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
      "datePosted": "2023-04-19T06:44:05.696702353Z",
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
      "datePosted": "2023-04-19T06:44:07.461874110Z",
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
      "datePosted": "2023-04-19T06:44:07.461863651Z",
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
      "datePosted": "2023-04-19T06:44:07.461853250Z",
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
      "datePosted": "2023-04-19T06:44:07.461820653Z",
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
      "datePosted": "2023-04-19T06:44:07.461804589Z",
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
      "datePosted": "2023-04-19T06:44:09.459444393Z",
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
      "datePosted": "2023-04-19T06:44:07.463365520Z",
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
      "datePosted": "2023-04-19T06:44:05.710225915Z",
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
      "datePosted": "2023-04-19T06:44:05.710233756Z",
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
      "datePosted": "2023-04-19T06:44:07.458276141Z",
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
      "datePosted": "2023-04-19T06:44:07.462311511Z",
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
      "datePosted": "2023-04-19T06:44:07.463263957Z",
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
      "datePosted": "2023-04-19T06:44:07.459247916Z",
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
      "datePosted": "2023-04-19T06:44:07.457288698Z",
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
      "datePosted": "2023-04-19T06:44:07.457343694Z",
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
      "datePosted": "2023-04-19T06:44:05.711004780Z",
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
      "datePosted": "2023-04-19T06:44:09.472668807Z",
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
      "datePosted": "2023-04-19T06:44:07.461178822Z",
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
      "datePosted": "2023-04-19T06:44:07.461187372Z",
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
      "datePosted": "2023-04-19T06:44:07.461160392Z",
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
      "datePosted": "2023-04-19T06:44:07.461169434Z",
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
      "datePosted": "2023-04-19T06:44:07.461138750Z",
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
      "datePosted": "2023-04-19T06:44:07.461147105Z",
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
      "datePosted": "2023-04-19T06:44:07.461116528Z",
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
      "datePosted": "2023-04-19T06:44:07.461130362Z",
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
      "datePosted": "2023-04-19T06:44:07.462857137Z",
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
      "datePosted": "2023-04-19T06:44:07.462848293Z",
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
      "datePosted": "2023-04-19T06:44:07.462802071Z",
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
      "datePosted": "2023-04-19T06:44:07.462808858Z",
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
      "datePosted": "2023-04-19T06:44:07.462793934Z",
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
      "datePosted": "2023-04-19T06:44:07.462781592Z",
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
      "datePosted": "2023-04-19T06:44:07.460039530Z",
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
      "datePosted": "2023-04-19T06:44:05.797898236Z",
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
      "datePosted": "2023-04-19T06:44:05.797886410Z",
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
      "datePosted": "2023-04-19T06:44:19.401071969Z",
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
      "datePosted": "2023-04-19T06:44:19.403098478Z",
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
      "datePosted": "2023-04-19T06:44:05.696044782Z",
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
      "datePosted": "2023-04-19T06:44:09.466269979Z",
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
      "datePosted": "2023-04-19T06:44:07.464193694Z",
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
      "datePosted": "2023-04-19T06:44:07.465631115Z",
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
      "datePosted": "2023-04-19T06:44:07.465618502Z",
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
      "datePosted": "2023-04-19T06:44:07.465607622Z",
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
      "datePosted": "2023-04-19T06:44:07.465598197Z",
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
      "datePosted": "2023-04-19T06:44:07.465588322Z",
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
      "datePosted": "2023-04-19T06:44:07.462525236Z",
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
      "datePosted": "2023-04-19T06:44:07.462535520Z",
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
      "datePosted": "2023-04-19T06:44:09.473230984Z",
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
      "datePosted": "2023-04-19T06:44:09.473219993Z",
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
      "datePosted": "2023-04-19T06:43:07.349620341Z",
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
      "datePosted": "2023-04-19T06:43:09.449763113Z",
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
      "datePosted": "2023-04-19T06:43:11.291257169Z",
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
      "datePosted": "2023-04-19T06:43:09.447222180Z",
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
      "datePosted": "2023-04-19T06:43:09.447211119Z",
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
      "datePosted": "2023-04-19T06:43:09.447199955Z",
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
      "datePosted": "2023-04-19T06:43:09.447188751Z",
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
      "datePosted": "2023-04-19T06:43:09.447176885Z",
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
      "datePosted": "2023-04-19T06:43:17.400288932Z",
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
      "datePosted": "2023-04-19T06:43:15.521964248Z",
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
      "datePosted": "2023-04-19T06:43:07.352171063Z",
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
      "datePosted": "2023-04-19T06:43:11.349134991Z",
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
      "datePosted": "2023-04-19T06:43:11.350189866Z",
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
      "datePosted": "2023-04-19T06:43:17.424573926Z",
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
      "datePosted": "2023-04-19T06:43:07.343494224Z",
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
      "datePosted": "2023-04-19T06:43:11.369341765Z",
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
      "datePosted": "2023-04-19T06:43:11.369354278Z",
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
      "datePosted": "2023-04-19T06:43:11.369366565Z",
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
      "datePosted": "2023-04-19T06:43:11.369310924Z",
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
      "datePosted": "2023-04-19T06:43:11.369330691Z",
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
      "datePosted": "2023-04-19T06:43:11.286663342Z",
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
      "datePosted": "2023-04-19T06:43:09.371417131Z",
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
      "datePosted": "2023-04-19T06:43:07.339516580Z",
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
      "datePosted": "2023-04-19T06:43:11.299700522Z",
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
      "datePosted": "2023-04-19T06:43:11.299684211Z",
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
      "datePosted": "2023-04-19T06:43:11.299659444Z",
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
      "datePosted": "2023-04-19T06:43:09.450377556Z",
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
      "datePosted": "2023-04-19T06:43:09.450365920Z",
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
      "datePosted": "2023-04-19T06:43:09.450353635Z",
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
      "datePosted": "2023-04-19T06:43:09.450340199Z",
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
      "datePosted": "2023-04-19T06:43:13.455180025Z",
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
      "datePosted": "2023-04-19T06:43:13.451934591Z",
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
      "datePosted": "2023-04-19T06:43:11.292887899Z",
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
      "datePosted": "2023-04-19T06:43:11.360585483Z",
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
      "datePosted": "2023-04-19T06:43:15.517007975Z",
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
      "datePosted": "2023-04-19T06:43:15.467538102Z",
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
      "datePosted": "2023-04-19T06:43:15.467553435Z",
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
      "datePosted": "2023-04-19T06:43:15.468547116Z",
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
      "datePosted": "2023-04-19T06:43:17.405622475Z",
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
      "datePosted": "2023-04-19T06:43:19.369307115Z",
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
      "datePosted": "2023-04-19T06:43:09.451521677Z",
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
      "datePosted": "2023-04-19T06:43:09.448614122Z",
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
      "datePosted": "2023-04-19T06:43:09.448625632Z",
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
      "datePosted": "2023-04-19T06:43:07.350010647Z",
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
      "datePosted": "2023-04-19T06:43:09.362253845Z",
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
      "datePosted": "2023-04-19T06:43:17.425247434Z",
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
      "datePosted": "2023-04-19T06:43:13.453458631Z",
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
      "datePosted": "2023-04-19T06:43:13.453474096Z",
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
      "datePosted": "2023-04-19T06:43:13.453437267Z",
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
      "datePosted": "2023-04-19T06:43:17.424135164Z",
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
      "datePosted": "2023-04-19T06:43:19.369722536Z",
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
      "datePosted": "2023-04-19T06:43:09.371901769Z",
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
      "datePosted": "2023-04-19T06:43:09.371894582Z",
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
      "datePosted": "2023-04-19T06:43:09.371881133Z",
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
      "datePosted": "2023-04-19T06:43:09.372152911Z",
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
      "datePosted": "2023-04-19T06:43:09.370029094Z",
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
      "datePosted": "2023-04-19T06:43:09.370018475Z",
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
      "datePosted": "2023-04-19T06:43:09.370006517Z",
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
      "datePosted": "2023-04-19T06:43:19.370035568Z",
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
      "datePosted": "2023-04-19T06:43:07.343161483Z",
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
      "datePosted": "2023-04-19T06:43:09.449125166Z",
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
      "datePosted": "2023-04-19T06:43:11.348306127Z",
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
      "datePosted": "2023-04-19T06:43:11.348334326Z",
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
      "datePosted": "2023-04-19T06:43:07.342842586Z",
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
      "datePosted": "2023-04-19T06:43:09.371119139Z",
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
      "datePosted": "2023-04-19T06:43:09.371132156Z",
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
      "datePosted": "2023-04-19T06:43:09.363166740Z",
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
      "datePosted": "2023-04-19T06:43:11.288093601Z",
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
      "datePosted": "2023-04-19T06:43:11.288081966Z",
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
      "datePosted": "2023-04-19T06:43:11.288070846Z",
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
      "datePosted": "2023-04-19T06:43:11.288059633Z",
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
      "datePosted": "2023-04-19T06:43:11.288040756Z",
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
      "datePosted": "2023-04-19T06:43:11.293257028Z",
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
      "datePosted": "2023-04-19T06:43:11.293240945Z",
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
      "datePosted": "2023-04-19T06:43:11.293229623Z",
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
      "datePosted": "2023-04-19T06:43:11.293218222Z",
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
      "datePosted": "2023-04-19T06:43:11.293204227Z",
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
      "datePosted": "2023-04-19T06:43:11.292535982Z",
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
      "datePosted": "2023-04-19T06:43:11.287231192Z",
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
      "datePosted": "2023-04-19T06:43:11.287221182Z",
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
      "datePosted": "2023-04-19T06:43:11.292267534Z",
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
      "datePosted": "2023-04-19T06:43:13.455439784Z",
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
      "datePosted": "2023-04-19T06:43:11.292697914Z",
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
      "datePosted": "2023-04-19T06:43:13.455672412Z",
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
      "datePosted": "2023-04-19T06:43:13.455691495Z",
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
      "datePosted": "2023-04-19T06:43:07.348168199Z",
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
      "datePosted": "2023-04-19T06:43:07.348157772Z",
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
      "datePosted": "2023-04-19T06:43:07.348146976Z",
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
      "datePosted": "2023-04-19T06:43:07.348127224Z",
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
      "datePosted": "2023-04-19T06:43:07.347765560Z",
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
      "datePosted": "2023-04-19T06:43:07.350559481Z",
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
      "datePosted": "2023-04-19T06:43:07.348693134Z",
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
      "datePosted": "2023-04-19T06:43:07.348680857Z",
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
      "datePosted": "2023-04-19T06:43:07.348668095Z",
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
      "datePosted": "2023-04-19T06:43:07.348655602Z",
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
      "datePosted": "2023-04-19T06:43:07.348641378Z",
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
      "datePosted": "2023-04-19T06:43:07.348620123Z",
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
      "datePosted": "2023-04-19T06:43:07.347206059Z",
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
      "datePosted": "2023-04-19T06:43:07.347223219Z",
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
      "datePosted": "2023-04-19T06:43:11.287695521Z",
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
      "datePosted": "2023-04-19T06:43:11.287676939Z",
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
      "datePosted": "2023-04-19T06:43:07.338085301Z",
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
      "datePosted": "2023-04-19T06:43:07.338074359Z",
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
      "datePosted": "2023-04-19T06:43:07.338067403Z",
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
      "datePosted": "2023-04-19T06:43:07.338059243Z",
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
      "datePosted": "2023-04-19T06:43:09.450122057Z",
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
      "datePosted": "2023-04-19T06:43:11.299272801Z",
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
      "datePosted": "2023-04-19T06:43:11.299246094Z",
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
      "datePosted": "2023-04-19T06:43:09.371567973Z",
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
      "datePosted": "2023-04-19T06:43:09.371581415Z",
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
      "datePosted": "2023-04-19T06:43:07.350780643Z",
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
      "datePosted": "2023-04-19T06:43:07.350769407Z",
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
      "datePosted": "2023-04-19T06:43:07.350751635Z",
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
      "datePosted": "2023-04-19T06:43:09.370806956Z",
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
      "datePosted": "2023-04-19T06:43:09.370787296Z",
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
      "datePosted": "2023-04-19T06:43:09.370526341Z",
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
      "datePosted": "2023-04-19T06:43:09.370505958Z",
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
      "datePosted": "2023-04-19T06:43:21.353001932Z",
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
      "datePosted": "2023-04-19T06:43:13.452640560Z",
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
      "datePosted": "2023-04-19T06:43:13.452663780Z",
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
      "datePosted": "2023-04-19T06:43:07.337321387Z",
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
      "datePosted": "2023-04-19T06:43:17.425433501Z",
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
      "datePosted": "2023-04-19T06:43:09.451916763Z",
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
      "datePosted": "2023-04-19T06:43:07.350197397Z",
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
      "datePosted": "2023-04-19T06:43:09.361442640Z",
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
      "datePosted": "2023-04-19T06:43:09.361425852Z",
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
      "datePosted": "2023-04-19T06:43:11.350674414Z",
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
      "datePosted": "2023-04-19T06:43:15.541820474Z",
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
      "datePosted": "2023-04-19T06:43:17.424879723Z",
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
      "datePosted": "2023-04-19T06:43:15.543440124Z",
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
      "datePosted": "2023-04-19T06:43:27.337442289Z",
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
      "datePosted": "2023-04-19T06:43:07.341945950Z",
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
      "datePosted": "2023-04-19T06:43:07.341939083Z",
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
      "datePosted": "2023-04-19T06:43:07.341931641Z",
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
      "datePosted": "2023-04-19T06:43:07.341919808Z",
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
      "datePosted": "2023-04-19T06:43:11.356167170Z",
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
      "datePosted": "2023-04-19T06:43:11.350948265Z",
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
      "datePosted": "2023-04-19T06:43:15.542203696Z",
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
      "datePosted": "2023-04-19T06:43:11.291979417Z",
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
      "datePosted": "2023-04-19T06:43:09.450806649Z",
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
      "datePosted": "2023-04-19T06:43:07.338997244Z",
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
      "datePosted": "2023-04-19T06:43:07.349307507Z",
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
      "datePosted": "2023-04-19T06:43:09.372311725Z",
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
      "datePosted": "2023-04-19T06:43:09.372304821Z",
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
      "datePosted": "2023-04-19T06:43:09.372298567Z",
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
      "datePosted": "2023-04-19T06:43:09.372290642Z",
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
      "datePosted": "2023-04-19T06:44:07.553209221Z",
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
      "datePosted": "2023-04-19T06:44:07.553229667Z",
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
      "datePosted": "2023-04-19T06:44:07.558464826Z",
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
      "datePosted": "2023-04-19T06:44:07.558456746Z",
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
      "datePosted": "2023-04-19T06:44:07.558448113Z",
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
      "datePosted": "2023-04-19T06:44:07.558438206Z",
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
      "datePosted": "2023-04-19T06:44:07.559341548Z",
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
      "datePosted": "2023-04-19T06:44:07.557841619Z",
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
      "datePosted": "2023-04-19T06:44:07.557807875Z",
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
      "datePosted": "2023-04-19T06:44:25.385266875Z",
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
      "datePosted": "2023-04-19T06:44:07.559160665Z",
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
      "datePosted": "2023-04-19T06:44:05.568043490Z",
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
      "datePosted": "2023-04-19T06:44:13.315034622Z",
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
      "datePosted": "2023-04-19T06:44:13.315412460Z",
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
      "datePosted": "2023-04-19T06:44:13.315406794Z",
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
      "datePosted": "2023-04-19T06:44:13.315400367Z",
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
      "datePosted": "2023-04-19T06:43:13.390393104Z",
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
      "datePosted": "2023-04-19T06:43:13.399094374Z",
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
      "datePosted": "2023-04-19T06:43:13.399081420Z",
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
      "datePosted": "2023-04-19T06:43:13.388309738Z",
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
      "datePosted": "2023-04-19T06:43:13.398728143Z",
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
      "datePosted": "2023-04-19T06:43:23.362015865Z",
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
      "datePosted": "2023-04-19T06:43:23.362263074Z",
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
      "datePosted": "2023-04-19T06:43:13.398067064Z",
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
      "datePosted": "2023-04-19T06:43:13.398092270Z",
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
      "datePosted": "2023-04-19T06:43:13.398460735Z",
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
      "datePosted": "2023-04-19T06:43:07.340068331Z",
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
      "datePosted": "2023-04-19T06:43:13.390613964Z",
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
      "datePosted": "2023-04-19T06:43:13.388734541Z",
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
      "datePosted": "2023-04-19T06:43:29.662612481Z",
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
      "datePosted": "2023-04-19T06:43:13.397515404Z",
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
      "datePosted": "2023-04-19T06:43:13.397041479Z",
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
      "datePosted": "2023-04-19T06:43:13.390087208Z",
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
      "datePosted": "2023-04-19T06:43:13.390104950Z",
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
      "datePosted": "2023-04-19T06:43:13.389319853Z",
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
      "datePosted": "2023-04-19T06:43:29.663520640Z",
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
      "datePosted": "2023-04-19T06:43:13.397770870Z",
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
      "datePosted": "2023-04-19T06:43:13.399353843Z",
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
      "datePosted": "2023-04-19T06:43:13.399324787Z",
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
      "datePosted": "2023-04-19T06:43:13.399308348Z",
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
      "datePosted": "2023-04-19T06:43:07.340219672Z",
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
      "datePosted": "2023-04-19T06:43:07.340229906Z",
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
      "datePosted": "2023-04-19T06:43:23.361654903Z",
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
      "datePosted": "2023-04-19T06:43:23.361114773Z",
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
      "datePosted": "2023-04-19T06:43:07.340508561Z",
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
      "datePosted": "2023-04-19T06:43:13.389567015Z",
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
      "datePosted": "2023-04-19T06:43:13.389552595Z",
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
      "datePosted": "2023-04-19T06:43:13.389533390Z",
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
      "datePosted": "2023-04-19T06:43:29.664109146Z",
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
      "datePosted": "2023-04-19T06:44:19.405477666Z",
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
      "datePosted": "2023-04-19T06:44:19.405488873Z",
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
      "datePosted": "2023-04-19T06:44:21.313725240Z",
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
      "datePosted": "2023-04-19T06:43:33.962055087Z",
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
      "datePosted": "2023-04-19T06:44:21.347637367Z",
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
      "datePosted": "2023-04-19T06:44:25.390185791Z",
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
      "datePosted": "2023-04-19T06:41:44.299482977Z",
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
      "datePosted": "2023-04-19T06:41:03.851982862Z",
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
      "datePosted": "2023-04-19T06:41:15.722551661Z",
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
      "datePosted": "2023-04-19T06:41:40.722953024Z",
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
      "datePosted": "2023-04-19T06:41:44.174749083Z",
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
      "datePosted": "2023-04-19T06:42:06.227691790Z",
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
      "datePosted": "2023-04-19T06:41:02.166799460Z",
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
      "datePosted": "2023-04-19T06:41:06.173552636Z",
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
      "datePosted": "2023-04-19T06:42:02.695031076Z",
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
      "datePosted": "2023-04-19T06:40:56.163479703Z",
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
      "datePosted": "2023-04-19T06:41:50.952712636Z",
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
      "datePosted": "2023-04-19T06:41:08.165633602Z",
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
      "datePosted": "2023-04-19T06:42:08.249767262Z",
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
      "datePosted": "2023-04-19T06:40:48.774028909Z",
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
      "datePosted": "2023-04-19T06:41:58.262245346Z",
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
      "datePosted": "2023-04-19T06:41:00.754081457Z",
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
      "datePosted": "2023-04-19T06:42:04.249443570Z",
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
      "datePosted": "2023-04-19T06:40:50.254282428Z",
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
      "datePosted": "2023-04-19T06:41:52.249330358Z",
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
      "datePosted": "2023-04-19T06:42:06.251299520Z",
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
      "datePosted": "2023-04-19T06:40:54.162223237Z",
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
      "datePosted": "2023-04-19T06:41:54.249272926Z",
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
      "datePosted": "2023-04-19T06:42:24.719902125Z",
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
      "datePosted": "2023-04-19T06:42:48.269294Z",
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
      "datePosted": "2023-04-19T06:42:46.816668727Z",
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
      "datePosted": "2023-04-19T06:42:52.264908701Z",
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
      "datePosted": "2023-04-19T06:41:14.171278957Z",
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
      "datePosted": "2023-04-19T06:41:34.172305378Z",
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
      "datePosted": "2023-04-19T06:41:32.173355050Z",
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
      "datePosted": "2023-04-19T06:41:24.674060881Z",
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
      "datePosted": "2023-04-19T06:41:36.175446512Z",
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
      "datePosted": "2023-04-19T06:43:02.890251513Z",
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
      "datePosted": "2023-04-19T06:43:02.248310898Z",
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
      "datePosted": "2023-04-19T06:43:02.248328425Z",
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
      "datePosted": "2023-04-19T06:43:02.879268511Z",
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
      "datePosted": "2023-04-19T06:43:02.174227908Z",
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
      "datePosted": "2023-04-19T06:43:02.175037230Z",
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
      "datePosted": "2023-04-19T06:43:02.169728491Z",
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
      "datePosted": "2023-04-19T06:43:02.169779255Z",
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
      "datePosted": "2023-04-19T06:43:02.256108953Z",
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
      "datePosted": "2023-04-19T06:43:02.261247878Z",
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
      "datePosted": "2023-04-19T06:43:02.261011507Z",
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
      "datePosted": "2023-04-19T06:43:02.247566799Z",
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
      "datePosted": "2023-04-19T06:43:02.253258925Z",
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
      "datePosted": "2023-04-19T06:43:02.253274717Z",
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
      "datePosted": "2023-04-19T06:43:02.258279180Z",
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
      "datePosted": "2023-04-19T06:43:02.258294384Z",
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
      "datePosted": "2023-04-19T06:43:02.888996640Z",
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
      "datePosted": "2023-04-19T06:43:02.889560285Z",
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
      "datePosted": "2023-04-19T06:43:02.176718590Z",
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
      "datePosted": "2023-04-19T06:43:02.176737319Z",
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
      "datePosted": "2023-04-19T06:43:02.175782478Z",
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
      "datePosted": "2023-04-19T06:43:02.175802121Z",
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
      "datePosted": "2023-04-19T06:43:02.161110427Z",
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
      "datePosted": "2023-04-19T06:43:02.161582132Z",
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
      "datePosted": "2023-04-19T06:43:02.161592893Z",
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
      "datePosted": "2023-04-19T06:43:02.889311321Z",
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
      "datePosted": "2023-04-19T06:43:26.753809865Z",
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
      "datePosted": "2023-04-19T06:43:25.351722392Z",
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
      "datePosted": "2023-04-19T06:41:46.219692432Z",
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
      "datePosted": "2023-04-19T06:41:42.217497514Z",
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
      "datePosted": "2023-04-19T06:40:26.917869284Z",
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
      "datePosted": "2023-04-19T06:40:26.918086374Z",
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
      "datePosted": "2023-04-19T06:40:09.646546543Z",
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
      "datePosted": "2023-04-19T06:40:05.762980483Z",
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
      "datePosted": "2023-04-19T06:40:09.646668346Z",
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
      "datePosted": "2023-04-19T06:40:05.763132960Z",
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
      "datePosted": "2023-04-19T06:40:09.946804252Z",
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
      "datePosted": "2023-04-19T06:40:05.955635025Z",
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
      "datePosted": "2023-04-19T06:40:09.946876177Z",
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
      "datePosted": "2023-04-19T06:40:05.955755982Z",
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
      "datePosted": "2023-04-19T06:40:10.146382189Z",
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
      "datePosted": "2023-04-19T06:40:06.557026243Z",
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
      "datePosted": "2023-04-19T06:40:10.146332585Z",
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
      "datePosted": "2023-04-19T06:40:06.556965750Z",
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
      "datePosted": "2023-04-19T06:40:13.153320763Z",
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
      "datePosted": "2023-04-19T06:40:06.569077779Z",
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
      "datePosted": "2023-04-19T06:40:13.153300345Z",
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
      "datePosted": "2023-04-19T06:40:06.569003765Z",
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
      "datePosted": "2023-04-19T06:40:07.948598203Z",
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
      "datePosted": "2023-04-19T06:40:07.948700050Z",
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
      "datePosted": "2023-04-19T06:40:08.562600692Z",
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
      "datePosted": "2023-04-19T06:40:08.562670174Z",
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
      "datePosted": "2023-04-19T06:40:07.856745928Z",
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
      "datePosted": "2023-04-19T06:40:07.856840697Z",
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
      "datePosted": "2023-04-19T06:43:02.168855909Z",
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
      "datePosted": "2023-04-19T06:43:02.168908058Z",
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
      "datePosted": "2023-04-19T06:43:02.260391620Z",
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
      "datePosted": "2023-04-19T06:43:02.880074391Z",
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
      "datePosted": "2023-04-19T06:43:02.246891133Z",
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
      "datePosted": "2023-04-19T06:43:02.878907580Z",
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
      "datePosted": "2023-04-19T06:43:02.257013638Z",
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
      "datePosted": "2023-04-19T06:43:02.254201366Z",
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
      "datePosted": "2023-04-19T06:43:02.878023576Z",
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
      "datePosted": "2023-04-19T06:44:25.558926313Z",
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
      "datePosted": "2023-04-19T06:40:09.570801629Z",
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
      "datePosted": "2023-04-19T06:40:05.752187675Z",
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
      "datePosted": "2023-04-19T06:40:09.572970505Z",
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
      "datePosted": "2023-04-19T06:40:05.752407430Z",
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
      "datePosted": "2023-04-19T06:40:09.847735844Z",
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
      "datePosted": "2023-04-19T06:40:05.768493500Z",
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
      "datePosted": "2023-04-19T06:40:09.861074413Z",
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
      "datePosted": "2023-04-19T06:40:05.860319685Z",
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
      "datePosted": "2023-04-19T06:40:09.861156163Z",
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
      "datePosted": "2023-04-19T06:40:05.860519222Z",
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
      "datePosted": "2023-04-19T06:40:08.571061233Z",
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
      "datePosted": "2023-04-19T06:43:02.879380536Z",
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
      "datePosted": "2023-04-19T06:43:02.888501356Z",
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
      "datePosted": "2023-04-19T06:43:02.888055208Z",
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
      "datePosted": "2023-04-19T06:43:02.878390281Z",
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
      "datePosted": "2023-04-19T06:43:02.878576473Z",
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
      "datePosted": "2023-04-19T06:40:08.581263818Z",
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
      "datePosted": "2023-04-19T06:40:08.581328623Z",
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
      "datePosted": "2023-04-19T06:40:12.158647578Z",
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
      "datePosted": "2023-04-19T06:40:12.046324561Z",
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
      "datePosted": "2023-04-19T06:40:03.651948613Z",
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
      "datePosted": "2023-04-19T06:40:03.651686717Z",
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
      "datePosted": "2023-04-19T06:40:03.758892466Z",
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
