import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

export const getStock = createAsyncThunk('stock/get', async () => {
  // TODO: get stock
  return testItems;
})

const initialState = {
  status: 'idle',
  items: []
}

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
        .addCase(getStock.pending, (state, action) => {
          state.status = 'loading'
        })
        .addCase(getStock.fulfilled, (state, action) => {
          state.status = 'succeeded'
          console.log('received stock', action)
          // Add any fetched posts to the array
          state.items = action.payload
        })
        .addCase(getStock.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        })
  }
})

export default stockSlice.reducer


const testItems = [
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Kenzo Flower Trk Pnt Sn21 (Black 99)",
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
      "datePosted": "2023-04-18T10:58:42.384599842Z",
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
      "name": "Kenzo Flower Trk Pnt Sn21 (Black 99)",
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
      "datePosted": "2023-04-18T10:58:42.384602497Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.365419181Z",
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
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-pocket-square-768388#colcode=76838802",
      "title": "Boss - Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/76838802_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:57.331983897Z",
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
      "name": "Lukas Check Shirt (Dark Blue 402)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-lukas-check-shirt-558808#colcode=55880818",
      "title": "Boss - Lukas Check Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55880818_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:57.332134534Z",
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
      "name": "HUGO Doak Square Track Pants (black, 16048050)",
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
      "datePosted": "2023-04-18T11:06:46.450312904Z",
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
      "name": "Lightweight Rain Jacket (Mid Blue)",
      "brand": "STONE ISLAND",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-lightweight-rain-jacket-619307#colcode=61930719",
      "title": "STONE ISLAND - Lightweight Rain Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/61930719_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:06:53.512090863Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 195.00,
      "discount": 70,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Lightweight Rain Jacket (Mid Blue)",
      "brand": "STONE ISLAND",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-lightweight-rain-jacket-619307#colcode=61930719",
      "title": "STONE ISLAND - Lightweight Rain Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/61930719_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T09:18:25.633862947Z",
      "seller": "FLANNELS",
      "properties": {      }
    },
    "price": {
      "buy": 195.00,
      "discount": 70,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "stone-island"
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
      "datePosted": "2023-04-18T10:56:51.939444459Z",
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
      "datePosted": "2023-04-18T10:56:51.939449541Z",
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
      "datePosted": "2023-04-18T10:56:51.938939476Z",
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
      "datePosted": "2023-04-18T10:56:51.940657001Z",
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
      "datePosted": "2023-04-18T10:56:51.940661598Z",
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
      "datePosted": "2023-04-18T10:56:51.940480756Z",
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
      "name": "Sport Monogram Fleece (Ink 78)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-18T10:58:42.384217201Z",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-18T10:58:42.384220410Z",
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
      "name": "Cord Trousers (Sand 08)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-18T10:58:42.387031564Z",
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
      "datePosted": "2023-04-18T10:58:42.387133257Z",
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
      "datePosted": "2023-04-18T10:58:42.387167558Z",
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
      "datePosted": "2023-04-18T10:58:42.386281942Z",
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
      "datePosted": "2023-04-18T10:58:42.386285378Z",
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
      "datePosted": "2023-04-18T10:58:42.385790077Z",
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
      "datePosted": "2023-04-18T10:58:42.386221187Z",
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
      "name": "Kenzo Patchwork Shir Sn21 (Green 56)",
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
      "datePosted": "2023-04-18T10:58:42.385014492Z",
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
      "name": "Kenzo Patchwork Shir Sn21 (Green 56)",
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
      "datePosted": "2023-04-18T10:58:42.385017089Z",
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
      "datePosted": "2023-04-18T10:58:42.386752658Z",
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
      "datePosted": "2023-04-18T10:58:42.386756112Z",
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
      "name": "Vin Waistcoat (Black 001)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:45.261467455Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:45.261463832Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:45.261460964Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:45.261457554Z",
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
      "name": "Vidal Shirt (Dark Red)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-vidal-shirt-329957#colcode=32995708",
      "title": "Hugo - Vidal Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32995708_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:47.246653935Z",
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
      "name": "Rip Tapered Jeans (Medium Blue 420)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.277155184Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.277151026Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:47.246403828Z",
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
      "name": "Hugo Zaff Scarf Womens (Black 001)",
      "brand": "Hugo",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-zaff-scarf-womens-902151#colcode=90215103",
      "title": "Hugo - Hugo Zaff Scarf Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/90215103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:45.262797002Z",
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
      "name": "Hugo Monogram Robe Sn24 (Mscellaneous961)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-monogram-robe-sn24-421047#colcode=42104708",
      "title": "Hugo - Hugo Monogram Robe Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42104708_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:43.275215425Z",
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
      "name": "Hugo Gayang Logo Jeans Womens (Turquoise)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.275283366Z",
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
      "name": "Hugo Gatora Slim Ld24 (Navy 415)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.277551566Z",
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
      "name": "Hugo Gatora Slim Ld24 (Navy 415)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.277546202Z",
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
      "name": "Hugo Gatora Slim Ld24 (Navy 415)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.277515349Z",
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
      "name": "Hugo Gatora Slim Ld24 (Navy 415)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.277511035Z",
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
      "name": "Hugo Gatora Slim Ld24 (Navy 415)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.277506063Z",
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
      "name": "Hugo EthonCamoBckPck Sn24 (Mcellaneous960)",
      "brand": "Hugo",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-ethoncamobckpck-sn24-715342#colcode=71534215",
      "title": "Hugo - Hugo EthonCamoBckPck Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/71534215_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:43.278064820Z",
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
      "name": "Hugo Duzu Jog Sn24 (Natural 108)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274340641Z",
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
      "name": "Hugo Duzu Jog Sn24 (Natural 108)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274346022Z",
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
      "name": "Hugo Boss Zula Belt 3.5cm Womens (Pastel Pink)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:45.264431678Z",
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
      "name": "Hugo Boss Zula Belt 3.5cm Womens (Pastel Pink)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:45.264427513Z",
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
      "name": "Howard214 Trousers (Light Beige 272)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272285689Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272282648Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272279471Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272272897Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272269541Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.366079760Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.366075650Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.366071331Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.364973396Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.364969788Z",
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
      "brand": "Hugo",
      "size": "38W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413918",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T09:18:29.225401256Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.362986303Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.362979732Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.362982802Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.362975724Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.362972354Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.363335359Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.363322717Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.363326277Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.363319100Z",
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
      "brand": "Hugo",
      "size": "30W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hetons-trousers-514139#colcode=51413903",
      "title": "Hugo - Hetons Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51413903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:41.363314361Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272531023Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272526332Z",
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
      "brand": "Hugo",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hbh-reborn-tab-xbdy-ld21-712484#colcode=71248403",
      "title": "Hugo - HBH Reborn Tab Xbdy Ld21",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/71248403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:45.263458935Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.275038944Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.275035656Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.275032204Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.275028161Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.364166219Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.364163258Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.364159064Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273755370Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273751280Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273747345Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273743173Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273735884Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:45.262497198Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274989208Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.364641587Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.364645442Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272048654Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274220293Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274936453Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272486514Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.365914584Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.365919525Z",
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
      "name": "Dagile T Shirt (Open Yellow 755)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:45.264241986Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273058921Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273053163Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273056050Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273047225Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273050292Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273041029Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.273044240Z",
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
      "name": "634/2 Tapered Jeans (Pastel Blue 450)",
      "brand": "Hugo",
      "size": "36W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634/2-tapered-jeans-659166#colcode=65916618",
      "title": "Hugo - 634/2 Tapered Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65916618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:41.365502227Z",
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
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "634 Rip Repair Jeans (Pastel Blue 450)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274616372Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274613153Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274605604Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274610045Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274600915Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.274594161Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.272676397Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.365169536Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.365166162Z",
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
      "name": "076 Denim Jacket (Turquoise440)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.363741088Z",
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
      "name": "Zolcon Jacket (Black)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.311291968Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.235024261Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252405817Z",
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
      "name": "Trollflash T Shirt (Dark Orange)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:55.586847513Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.228421784Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.254257064Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.254263792Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:57.332277556Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310259839Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.256048417Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.256043095Z",
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
      "name": "T-Perry Short Sleeve Polo Shirt (Light Pink)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.232468106Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.308714483Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.253554590Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.253549216Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.253542640Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.235297344Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.235291331Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.235284755Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.235277201Z",
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
      "name": "Skeefast Logo Joggers (Gold)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252741099Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.254787309Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:55.585576388Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:55.584971305Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:55.584976647Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:55.585432580Z",
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
      "name": "Ronni_F 10241263 01 (Light Beige 275)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ronnif-10241263-01-558727#colcode=55872704",
      "title": "Boss - Ronni_F 10241263 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55872704_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:57.330661528Z",
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
      "name": "Roan Shirt (Dark Blue 404)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-roan-shirt-558661#colcode=55866118",
      "title": "Boss - Roan Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55866118_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:57.332213079Z",
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
      "name": "Rikki 53 Shirt (Light Blue 450)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:59.494637689Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.235779412Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.234648738Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.234656006Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.311426657Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.229207556Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:57.332394473Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.318653937Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.318658008Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.318645919Z",
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
      "name": "Magneton Shirt (Bright Red)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:59.494739879Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.232997020Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.232989670Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.232981322Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.231055037Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.231048423Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.231039973Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:59.494781245Z",
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
      "name": "Loflash 101 Shirt (Dark Blue)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.234946531Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.253921067Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.253924770Z",
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
      "name": "Lamont 62 Joggers (Black 001)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.231687943Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.231693181Z",
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
      "name": "Kaitol Slim Trousers (Dark Blue 404)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252213025Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252209204Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252205625Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252201796Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252196676Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252894079Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252888237Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252882417Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252877459Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252869921Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252672568Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.251740497Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.251737752Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252612542Z",
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
      "name": "Hapron 5 Trousers (Navy 410)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252708124Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.318965757Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.318973249Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310573493Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310570297Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310567328Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310563841Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310514174Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.311703739Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310695365Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310691390Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310687390Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310683330Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310678988Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310674696Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310415959Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.310418965Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252037227Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.252028482Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.308003437Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.308000266Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.307997114Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.307992669Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.235174685Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.253359487Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.253352476Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.232610700Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.232619220Z",
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
      "name": "Boss Zalava Ld24 (Black 001)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-zalava-ld24-722759#colcode=72275903",
      "title": "Boss - Boss Zalava Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/72275903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:57.332438928Z",
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
      "name": "Boss T-Tie 6 cm knit Sn99 (Medium Beige)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-t-tie-6-cm-knit-sn99-738603#colcode=73860304",
      "title": "Boss - Boss T-Tie 6 cm knit Sn99",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/73860304_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:49.251456129Z",
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
      "name": "Boss T-Perry Short Sleeve Polo Shirt Mens (Dark Blue)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.311532260Z",
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
      "name": "Boss T-Loren-Ar_Sz30 Sn99 (Dark Grey)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.228719430Z",
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
      "name": "Boss T-Loren-Ar_Sz30 Sn99 (Dark Grey)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.228716042Z",
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
      "name": "Boss Skinny Jeans Womens (Medium Blue)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:51.254418149Z",
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
      "name": "Boss Short Sleeve Shirt Mens (Open Blue 489)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:55.585983916Z",
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
      "name": "Boss Ronni_53F 10227 Sn99 (Black)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:57.332339502Z",
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
      "name": "Boss Reid Check Shirt (Open Green360)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:55.586700314Z",
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
      "name": "Boss Pocket Square (Bright Red)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-pocket-square-772976#colcode=77297608",
      "title": "Boss - Boss Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/77297608_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:06:07.648483019Z",
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
      "name": "Boss Lyaran Scarf Womens (Black 001)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-lyaran-scarf-womens-902603#colcode=90260303",
      "title": "Boss - Boss Lyaran Scarf Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/90260303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:51.254646909Z",
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
      "name": "Boss Lyara Scarf Womens (Black)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-lyara-scarf-womens-901147#colcode=90114703",
      "title": "Boss - Boss Lyara Scarf Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/90114703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:51.254513248Z",
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
      "name": "Boss Long Sleeve Shirt Mens (White 100)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-long-sleeve-shirt-mens-558126#colcode=55812601",
      "title": "Boss - Boss Long Sleeve Shirt Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55812601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:55.586534964Z",
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
      "name": "Boss Lamont 69 Pant (Black 001)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-lamont-69-pant-483339#colcode=48333903",
      "title": "Boss - Boss Lamont 69 Pant",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48333903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:49.230888610Z",
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
      "name": "Boss Knitted Tie Mens (Dark Blue 404)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-knitted-tie-mens-756062#colcode=75606218",
      "title": "Boss - Boss Knitted Tie Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/75606218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:55.586134770Z",
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
      "name": "Boss Hover Fleece Jogging Bottoms Mens (Black 001)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.235521816Z",
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
      "name": "Boss First Backpack Mens (Black)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-first-backpack-mens-716759#colcode=71675918",
      "title": "Boss - Boss First Backpack Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/71675918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:47.308540216Z",
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
      "name": "Boss Crosstown Phone Wallet Mens (Black)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-crosstown-phone-wallet-mens-887140#colcode=88714003",
      "title": "Boss - Boss Crosstown Phone Wallet Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/88714003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:47.311119700Z",
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
      "name": "Boss Banks Trousers (DBlue 402)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.233286692Z",
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
      "name": "Boss Banks Trousers (DBlue 402)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.233280401Z",
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
      "name": "Boss Banks Trousers (DBlue 402)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.233273712Z",
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
      "name": "Boss Banks Trousers (DBlue 402)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.233265241Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.311797068Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.311791928Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.311785975Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.231567176Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.231558944Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.231405799Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:49.231396685Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:06:01.340953507Z",
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
      "name": "Authentic Jogging Bottoms (Medium Grey 039)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-authentic-jogging-bottoms-488275#colcode=48827526",
      "title": "Boss - Authentic Jogging Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48827526_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:06:01.340956872Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.318434331Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.318437806Z",
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
      "datePosted": "2023-04-18T11:05:49.234143159Z",
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
      "datePosted": "2023-04-18T11:05:49.234134100Z",
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
      "datePosted": "2023-04-18T11:05:49.234127942Z",
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
      "datePosted": "2023-04-18T11:05:49.234121502Z",
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
      "datePosted": "2023-04-18T11:05:49.234112999Z",
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
      "name": "Tatum Tapered Fit Jeans (Medium Blue 426)",
      "brand": "BOSS",
      "size": "32W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tatum-tapered-fit-jeans-659189#colcode=65918918",
      "title": "BOSS - Tatum Tapered Fit Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65918918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:49.234001153Z",
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
      "datePosted": "2023-04-18T11:05:51.251481864Z",
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
      "datePosted": "2023-04-18T11:05:53.318340338Z",
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
      "datePosted": "2023-04-18T11:05:57.332175379Z",
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
      "datePosted": "2023-04-18T11:05:47.310123864Z",
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
      "datePosted": "2023-04-18T11:05:47.310026608Z",
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
      "name": "Katlin Bumbag-Tp 10228801 01 (Black)",
      "brand": "BOSS",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-katlin-bumbag-tp-10228801-01-707792#colcode=70779203",
      "title": "BOSS - Katlin Bumbag-Tp 10228801 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/70779203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:49.229638150Z",
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
      "name": "Boss Modrn WdeLg Jns Ld24 (Bright Blue 433)",
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
      "datePosted": "2023-04-18T11:05:47.309732694Z",
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
      "name": "Boss Modrn WdeLg Jns Ld24 (Bright Blue 433)",
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
      "datePosted": "2023-04-18T11:05:47.309729296Z",
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
      "name": "Boss Modrn WdeLg Jns Ld24 (Bright Blue 433)",
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
      "datePosted": "2023-04-18T11:05:47.309726341Z",
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
      "name": "Boss Modrn WdeLg Jns Ld24 (Bright Blue 433)",
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
      "datePosted": "2023-04-18T11:05:47.309723094Z",
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
      "name": "Addison Shopper (Beige SMU)",
      "brand": "BOSS",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-addison-shopper-707618#colcode=70761869",
      "title": "BOSS - Addison Shopper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/70761869_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:47.304347861Z",
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
      "datePosted": "2023-04-18T10:58:42.388435289Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.279411163Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.279414775Z",
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
      "name": "Hugo EthonNSzip Sn24 (Mscellaneous960)",
      "brand": "Hugo",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-ethonnszip-sn24-702894#colcode=70289415",
      "title": "Hugo - Hugo EthonNSzip Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/70289415_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:49.236762295Z",
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
      "name": "Hugo Allie Belt 3.5cm Womens (Miscellaneous)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:49.251525224Z",
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
      "name": "Hugo Allie Belt 3.5cm Womens (Miscellaneous)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:49.251520816Z",
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
      "name": "Hugo Allie Belt 3.5cm Womens (Miscellaneous)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:49.251515991Z",
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
      "name": "Heston Trousers (Pastel Blue 459)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.279715802Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.279712722Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.279709551Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.279706159Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.280112961Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.279603661Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.279599791Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:06:01.233600879Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:43.279974717Z",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:41.362559309Z",
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
      "name": "Weevo Crew Sweatshirt (Navy 404)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316463241Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.317225020Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.317221272Z",
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
      "brand": "Boss",
      "size": "33W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-schino-tapered-cord-trousers-552431#colcode=55243115",
      "title": "Boss - Schino Tapered Cord Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55243115_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:53.317094546Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.317090975Z",
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
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-pocket-square-747384#colcode=74738402",
      "title": "Boss - Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/74738402_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:06:03.285150763Z",
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
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-pocket-square-747384#colcode=74738405",
      "title": "Boss - Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/74738405_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:06:03.285207123Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316757981Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316761824Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316984638Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.308990624Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316576716Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.315700692Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316305532Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316308880Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.315955718Z",
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
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-h-pocket-square-758821#colcode=75882101",
      "title": "Boss - H-Pocket Square",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/75882101_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:06:09.283996305Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316685075Z",
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
      "name": "Boss TChrsto LS Shrt Sn99 (Medium Pink)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.309080251Z",
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
      "name": "Boss TChrsto LS Shrt Sn99 (Medium Pink)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:47.309084202Z",
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
      "name": "Boss T-Pocket Square 33x33cm Mens (Dark Red)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:06:03.285015587Z",
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
      "name": "Boss Crosstown Wallet Mens (Light Beige)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-crosstown-wallet-mens-887138#colcode=88713804",
      "title": "Boss - Boss Crosstown Wallet Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/88713804_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:47.309181404Z",
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
      "name": "Boss Bold Belt Womens (Rust)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316066500Z",
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
      "name": "Boss Bold Belt Womens (Rust)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316062743Z",
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
      "name": "Boss Bold Belt Womens (Rust)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.316057826Z",
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
      "name": "Boss AOP Pocket Square Mens (White 100)",
      "brand": "Boss",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-aop-pocket-square-mens-757001#colcode=75700101",
      "title": "Boss - Boss AOP Pocket Square Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/75700101_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:06:09.284129180Z",
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
      "name": "Amber Belt 15cm 10199089 01 (Pastel Pink)",
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.317436634Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.317431821Z",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-18T11:05:53.317426126Z",
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
      "datePosted": "2023-04-18T11:05:53.315534164Z",
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
      "datePosted": "2023-04-18T11:06:09.283566619Z",
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
      "name": "AOP Trunks (Open Red 642)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-18T11:05:59.492557851Z",
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
      "name": "Emporio Armani Underwear Knit Trunks (Navy 00135)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-emporio-armani-underwear-knit-trunks-422985#colcode=42298501",
      "title": "Emporio Armani - Emporio Armani Underwear Knit Trunks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42298501_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:03:07.775114236Z",
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
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Emporio Armani Underwear Knit Trunks (Navy 00135)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-emporio-armani-underwear-knit-trunks-422985#colcode=42298501",
      "title": "Emporio Armani - Emporio Armani Underwear Knit Trunks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42298501_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:03:07.796063341Z",
      "seller": "TESSUTI",
      "properties": {      }
    },
    "price": {
      "buy": 9.00,
      "discount": 66,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "BOSS Hadiko Joggers (grey, 16606838)",
      "brand": "BOSS",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/grey-boss-hadiko-joggers/16606838/",
      "title": "BOSS Hadiko Joggers (grey / M)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_578136_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-18T07:28:41.019721495Z",
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
      "name": "HUGO Breaker Overhead Jacket (red, 18546115)",
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
      "datePosted": "2023-04-18T11:07:04.245145538Z",
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
      "datePosted": "2023-04-18T11:00:00.130967913Z",
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
      "datePosted": "2023-04-18T11:00:04.131001253Z",
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
      "datePosted": "2023-04-18T10:59:14.557208493Z",
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
      "datePosted": "2023-04-18T10:59:44.130022854Z",
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
      "datePosted": "2023-04-18T11:07:08.815200853Z",
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
      "datePosted": "2023-04-18T11:00:06.131015934Z",
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
      "datePosted": "2023-04-18T10:59:20.127915388Z",
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
      "datePosted": "2023-04-18T10:59:36.622067648Z",
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
      "datePosted": "2023-04-18T11:07:16.392074819Z",
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
      "datePosted": "2023-04-18T10:59:58.613144063Z",
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
      "datePosted": "2023-04-18T10:59:16.127904959Z",
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
      "datePosted": "2023-04-18T10:59:38.130067806Z",
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
      "datePosted": "2023-04-18T11:07:10.391266070Z",
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
      "datePosted": "2023-04-18T10:59:18.127862759Z",
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
      "datePosted": "2023-04-18T10:59:42.130061842Z",
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
      "datePosted": "2023-04-18T11:07:12.391183951Z",
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
      "datePosted": "2023-04-18T11:02:09.722968739Z",
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
      "size": "44 - Black"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-quilted-leather-jacket_R03990242",
      "title": "Quilted leather jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990242_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:59:48.609495295Z",
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
      "size": "46 - Navy"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:00:30.211078947Z",
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
      "size": "44 - Navy"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:00:28.735442124Z",
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
      "size": "42 - Navy"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:00:34.211078459Z",
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
      "size": "40 - Navy"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:00:36.211036402Z",
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
      "name": "High-neck longline shell-down jacket",
      "brand": "EMPORIO ARMANI",
      "size": "38 - Navy"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-high-neck-longline-shell-down-jacket_R03990218",
      "title": "High-neck longline shell-down jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990218_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:07:22.391498527Z",
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
      "datePosted": "2023-04-18T11:06:52.389993858Z",
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
      "datePosted": "2023-04-18T11:06:50.390075342Z",
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
      "datePosted": "2023-04-18T11:06:42.812469333Z",
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
      "datePosted": "2023-04-18T11:06:54.389975226Z",
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
      "quantityAvailable": 3,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Taschen Virgil Abloh. Nike. ICONS (Nike Ablo)",
      "brand": "Taschen",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/taschen-taschen-virgil-abloh-nike-icons-942231#colcode=94223199",
      "title": "Taschen - Taschen Virgil Abloh. Nike. ICONS",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/94223199_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.442311417Z",
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
      "datePosted": "2023-04-18T10:56:51.942880317Z",
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
      "datePosted": "2023-04-18T10:56:51.942886056Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-flyers-baseball-cap-393244#colcode=39324403",
      "title": "OFF WHITE - Scribble Flyers Baseball Cap",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39324403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.434936433Z",
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
      "datePosted": "2023-04-18T10:56:51.941902284Z",
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
      "datePosted": "2023-04-18T10:56:51.941908581Z",
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
      "datePosted": "2023-04-18T10:56:51.941754334Z",
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
      "datePosted": "2023-04-18T10:56:51.941760036Z",
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
      "datePosted": "2023-04-18T10:56:51.944507991Z",
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
      "datePosted": "2023-04-18T10:56:52.434093521Z",
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
      "datePosted": "2023-04-18T10:56:52.433974907Z",
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
      "datePosted": "2023-04-18T10:56:51.942731738Z",
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
      "datePosted": "2023-04-18T10:56:51.943503612Z",
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
      "datePosted": "2023-04-18T10:56:51.943509693Z",
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
      "datePosted": "2023-04-18T10:56:51.945265965Z",
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
      "datePosted": "2023-04-18T10:56:51.945272152Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-industrial-belt-stripe-socks-412270#colcode=41227001",
      "title": "OFF WHITE - Industrial Belt Stripe Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41227001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.441810675Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-industrial-belt-stripe-socks-412270#colcode=41227003",
      "title": "OFF WHITE - Industrial Belt Stripe Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41227003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.442130806Z",
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
      "datePosted": "2023-04-18T10:56:51.942243235Z",
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
      "datePosted": "2023-04-18T10:56:51.942249681Z",
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
      "datePosted": "2023-04-18T10:56:51.942046175Z",
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
      "datePosted": "2023-04-18T10:56:51.942053210Z",
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
      "datePosted": "2023-04-18T10:56:51.941159910Z",
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
      "datePosted": "2023-04-18T10:56:51.941295747Z",
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
      "datePosted": "2023-04-18T10:56:51.941299633Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-monogram-calf-socks-412740#colcode=41274005",
      "title": "OFF WHITE - Arrow Monogram Calf Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41274005_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.442022172Z",
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
      "datePosted": "2023-04-18T10:58:42.385237122Z",
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
      "datePosted": "2023-04-18T10:58:42.385448260Z",
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
      "datePosted": "2023-04-18T10:58:42.385451701Z",
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
      "datePosted": "2023-04-18T10:58:42.387544728Z",
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
      "datePosted": "2023-04-18T10:58:42.387547461Z",
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
      "datePosted": "2023-04-18T10:58:42.387405842Z",
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
      "datePosted": "2023-04-18T10:58:42.387408334Z",
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
      "datePosted": "2023-04-18T10:58:42.388524393Z",
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
      "datePosted": "2023-04-18T10:58:42.388494766Z",
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
      "datePosted": "2023-04-18T10:58:42.387480717Z",
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
      "datePosted": "2023-04-18T10:58:42.387483342Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-paris-card-holder-717715#colcode=71771503",
      "title": "KENZO - Paris Card Holder",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71771503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:58:42.807248196Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-paris-cap-393236#colcode=39323603",
      "title": "KENZO - Paris Cap",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39323603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:58:42.807130189Z",
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
      "datePosted": "2023-04-18T10:58:42.386080866Z",
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
      "datePosted": "2023-04-18T10:58:42.386083824Z",
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
      "datePosted": "2023-04-18T10:58:42.385664752Z",
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
      "datePosted": "2023-04-18T10:58:42.385668699Z",
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
      "datePosted": "2023-04-18T10:58:42.807321050Z",
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
      "datePosted": "2023-04-18T10:58:42.388106129Z",
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
      "datePosted": "2023-04-18T10:58:42.388109580Z",
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
      "datePosted": "2023-04-18T10:58:42.388238456Z",
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
      "datePosted": "2023-04-18T10:58:42.388241026Z",
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
      "name": "Kenzo Turtleneck Jumper (Black 99)",
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
      "datePosted": "2023-04-18T10:58:42.388329726Z",
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
      "size": "Super King - MULTICOLOURED"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/kenzo-k-poppy-floral-print-woven-single-fitted-sheet-90cm-x-200cm_R03920834",
      "title": "K POPPY floral-print woven single fitted sheet 90cm x 200cm",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03920834_MULTICOLOURED_M",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:06:25.401634237Z",
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
      "size": "Single - MULTICOLOURED"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/kenzo-k-poppy-floral-print-woven-single-fitted-sheet-90cm-x-200cm_R03920834",
      "title": "K POPPY floral-print woven single fitted sheet 90cm x 200cm",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03920834_MULTICOLOURED_M",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:06:23.919464287Z",
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
      "name": "K POPPY floral-print woven single duvet cover 140cm x 200cm",
      "brand": "KENZO",
      "size": "Standard - MULTICOLOURED"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/kenzo-k-poppy-floral-print-woven-single-duvet-cover-140cm-x-200cm_R03920833",
      "title": "K POPPY floral-print woven single duvet cover 140cm x 200cm",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03920833_MULTICOLOURED_M",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:05:17.255517241Z",
      "seller": "SELFRIDGES",
      "properties": {
        "stockKeys": "SizeCode / SupplierColourName",
        "currentPrice": "32.50",
        "wasPrice": "65.00"
      }
    },
    "price": {
      "buy": 32.50,
      "discount": 50,
      "quantityAvailable": 3,
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
      "datePosted": "2023-04-18T10:58:42.386568440Z",
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
      "datePosted": "2023-04-18T10:58:42.807831877Z",
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
      "datePosted": "2023-04-18T10:58:42.807810303Z",
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
      "datePosted": "2023-04-18T10:58:42.807805421Z",
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
      "datePosted": "2023-04-18T10:58:42.385336573Z",
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
      "datePosted": "2023-04-18T10:58:42.385931010Z",
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
      "datePosted": "2023-04-18T10:58:42.385933984Z",
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
      "name": "Emporio Armani EA7 Colour Block Joggers (grey, 16541993)",
      "brand": "Emporio Armani EA7",
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
      "datePosted": "2023-04-18T11:04:35.956759960Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.773606209Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.794397786Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.773610453Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.794400670Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.774593802Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.795500795Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.774596576Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.795503719Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:09.142734292Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.797217163Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:09.142730189Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.797210849Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:09.143157404Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.797515176Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:09.143153403Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.797508185Z",
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
      "datePosted": "2023-04-18T11:06:53.513470264Z",
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
      "datePosted": "2023-04-18T11:06:53.513473503Z",
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
      "datePosted": "2023-04-18T11:06:53.513683584Z",
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
      "datePosted": "2023-04-18T11:06:53.513687598Z",
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
      "datePosted": "2023-04-18T11:06:53.513255725Z",
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
      "datePosted": "2023-04-18T11:06:53.513258669Z",
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
      "datePosted": "2023-04-18T10:56:51.941594302Z",
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
      "datePosted": "2023-04-18T10:56:51.941599870Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-off-diag-wallet-sn24-719555#colcode=71955503",
      "title": "OFF WHITE - Off Diag Wallet Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71955503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:51.946063434Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-off-diag-ch-sn24-719553#colcode=71955303",
      "title": "OFF WHITE - Off Diag CH Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71955303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.440252789Z",
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
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-neen-arrow-sweatshirt-520713#colcode=52071303",
      "title": "OFF WHITE - Neen Arrow Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/52071303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:51.942566894Z",
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
      "datePosted": "2023-04-18T10:56:51.942572674Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-monogram-baseball-cap-392536#colcode=39253605",
      "title": "OFF WHITE - Monogram Baseball Cap",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39253605_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.434766931Z",
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
      "datePosted": "2023-04-18T10:56:51.944812339Z",
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
      "datePosted": "2023-04-18T10:56:51.942451220Z",
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
      "datePosted": "2023-04-18T10:56:51.943933697Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-arrow-bucket-hat-393214#colcode=39321403",
      "title": "OFF WHITE - Arrow Bucket Hat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39321403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.434278379Z",
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
      "name": "School Low Sneakers (Noir 99)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-18T10:58:42.388183071Z",
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
      "name": "Kenzo Straight Jean Sn24 (Noir 99)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-18T10:58:42.387963754Z",
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
      "name": "Kenzo Straight Jean Sn24 (Noir 99)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-18T10:58:42.387966640Z",
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
      "datePosted": "2023-04-18T10:58:42.389230565Z",
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
      "datePosted": "2023-04-18T10:58:42.389234351Z",
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
      "datePosted": "2023-04-18T10:58:42.387908887Z",
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
      "datePosted": "2023-04-18T10:58:42.388950262Z",
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
      "datePosted": "2023-04-18T10:58:42.388954723Z",
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
      "datePosted": "2023-04-18T10:58:42.390170626Z",
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
      "datePosted": "2023-04-18T10:58:42.390173531Z",
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
      "datePosted": "2023-04-18T10:58:42.386677507Z",
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
      "datePosted": "2023-04-18T10:58:42.386953026Z",
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
      "datePosted": "2023-04-18T10:58:42.389899495Z",
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
      "datePosted": "2023-04-18T10:58:42.389902630Z",
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
      "datePosted": "2023-04-18T10:58:42.388617920Z",
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
      "datePosted": "2023-04-18T10:58:42.388620909Z",
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
      "datePosted": "2023-04-18T10:58:42.388029937Z",
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
      "datePosted": "2023-04-18T10:58:42.388032750Z",
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
      "datePosted": "2023-04-18T10:58:42.389349366Z",
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
      "datePosted": "2023-04-18T10:58:42.389352956Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-sport-cap-392057#colcode=39205703",
      "title": "KENZO - Sport Cap",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/39205703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:58:42.807573850Z",
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
      "datePosted": "2023-04-18T10:58:42.389731353Z",
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
      "datePosted": "2023-04-18T10:58:42.387796020Z",
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
      "datePosted": "2023-04-18T10:58:42.387320372Z",
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
      "datePosted": "2023-04-18T10:58:42.387666768Z",
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
      "datePosted": "2023-04-18T10:58:42.387669942Z",
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
      "datePosted": "2023-04-18T10:58:42.388776210Z",
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
      "datePosted": "2023-04-18T10:58:42.388779321Z",
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
      "datePosted": "2023-04-18T10:58:42.387738080Z",
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
      "datePosted": "2023-04-18T10:58:42.387741116Z",
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
      "datePosted": "2023-04-18T10:58:42.388691986Z",
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
      "datePosted": "2023-04-18T10:58:42.388694592Z",
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
      "datePosted": "2023-04-18T10:58:42.807407502Z",
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
      "datePosted": "2023-04-18T10:58:42.386427212Z",
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
      "datePosted": "2023-04-18T10:58:42.386430095Z",
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
      "datePosted": "2023-04-18T10:58:42.387600998Z",
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
      "datePosted": "2023-04-18T10:58:42.387604010Z",
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
      "datePosted": "2023-04-18T10:58:42.387208195Z",
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
      "datePosted": "2023-04-18T10:58:42.387211068Z",
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
      "datePosted": "2023-04-18T10:52:01.102658652Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.773089926Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.794150777Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.773093591Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.794154293Z",
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
      "brand": "Emporio Armani",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-emporio-eagle-towel-sn22-797010#colcode=79701003",
      "title": "Emporio Armani - Emporio Eagle Towel Sn22",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/79701003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:03:07.773898621Z",
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
      "brand": "Emporio Armani",
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-emporio-eagle-towel-sn22-797010#colcode=79701003",
      "title": "Emporio Armani - Emporio Eagle Towel Sn22",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/79701003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T11:03:07.794608374Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.774295267Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.795188806Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.774298424Z",
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
      "brand": "Emporio Armani",
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
      "datePosted": "2023-04-18T11:03:07.795192326Z",
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
      "datePosted": "2023-04-18T11:06:53.513749109Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-thunder-beanie-907655#colcode=90765503",
      "title": "OFF WHITE - Thunder Beanie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/90765503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.435015909Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-flyer-socks-410496#colcode=41049603",
      "title": "OFF WHITE - Scribble Flyer Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41049603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.441607437Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-arrow-socks-410330#colcode=41033001",
      "title": "OFF WHITE - Scribble Arrow Socks",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/41033001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.441384996Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-joseph-square-frame-sunglasses-719714#colcode=71971408",
      "title": "OFF WHITE - Joseph Square Frame Sunglasses",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71971408_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.434454227Z",
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
      "size": "One Size"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-joseph-square-frame-sunglasses-719714#colcode=71971418",
      "title": "OFF WHITE - Joseph Square Frame Sunglasses",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/71971418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-18T10:56:52.434663205Z",
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
      "datePosted": "2023-04-18T11:06:28.284416217Z",
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
      "datePosted": "2023-04-18T11:06:14.284389353Z",
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
      "datePosted": "2023-04-18T11:06:36.284417760Z",
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
      "datePosted": "2023-04-18T11:06:53.513903334Z",
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
      "datePosted": "2023-04-18T11:06:53.513908362Z",
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
      "datePosted": "2023-04-18T11:06:54.065041866Z",
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
      "datePosted": "2023-04-18T11:06:54.064010765Z",
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
      "datePosted": "2023-04-18T11:03:40.228416099Z",
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
      "quantityAvailable": 100,
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
      "datePosted": "2023-04-18T11:04:26.506470284Z",
      "seller": "NVIDIA/https://www.scan.co.uk/",
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
      "datePosted": "2023-04-18T11:04:26.506690058Z",
      "seller": "NVIDIA/https://www.scan.co.uk/",
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
