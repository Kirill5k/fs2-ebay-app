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
        const byKind = filters.kinds.length > 0 ? filters.kinds.includes(i.itemDetails.kind) : true

        return byRetailer && byBrand && bySize && byDiscount && byPrice && byKind
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
      "name": "Banora Croc Blouse (Croc Print)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-banora-croc-blouse-544187#colcode=54418799",
      "title": "Boss - Boss Banora Croc Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54418799_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:03.517013563Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 22.00,
      "discount": 89,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Flower Trk Pnt Sn21 (Black 99)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.829145155Z",
      "seller": "Flannels",
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
      "name": "Flower Trk Pnt Sn21 (Black 99)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.829314731Z",
      "seller": "Flannels",
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
      "name": "Senecy Tie Dye Sweater ( Miscellaneous)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-senecy-tie-dye-sweater-668875#colcode=66887599",
      "title": "Hugo - Senecy Tie Dye Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66887599_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.565162188Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "Herlene Trousers (Black)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-herlene-trousers-501401#colcode=50140103",
      "title": "Hugo - Herlene Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/50140103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.558681522Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
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
      "datePosted": "2023-04-20T12:13:45.567488952Z",
      "seller": "Scotts",
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
      "name": "Dareia Top (Natural)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dareia-top-659991#colcode=65999169",
      "title": "Hugo - Dareia Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65999169_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:51.579334179Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "name": "Trekili Short (Black 960)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-trekili-short-320963#colcode=32096303",
      "title": "Boss - Trekili Short",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32096303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:13.583257854Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "Trekili Short (Black 960)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-trekili-short-320963#colcode=32096303",
      "title": "Boss - Trekili Short",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32096303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:13.583278357Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "Tawakos Trousers (Medium Beige)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tawakos-trousers-595290#colcode=59529004",
      "title": "Boss - Tawakos Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59529004_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:03.518835810Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 44.00,
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
      "name": "Pocket Square (Medium Grey)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:15.527052605Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:07.548347441Z",
      "seller": "Scotts",
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
      "name": "Jolinn Blazer (Pastel Pink)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-jolinn-blazer-324879#colcode=32487906",
      "title": "BOSS - Jolinn Blazer",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32487906_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:03.511762710Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 78.00,
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
      "name": "Active Joggers (Dark Green)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-active-joggers-578133#colcode=57813315",
      "title": "Boss - Active Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57813315_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.465634582Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 24.00,
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
      "name": "Doak Square Track Pants (Black, 16048050)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:15:15.143983390Z",
      "seller": "Jdsports",
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
      "name": "Knitted Brazilian Pants (Black 00020)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-emporio-armani-knitted-brazilian-pants-424300#colcode=42430003",
      "title": "Emporio Armani - Emporio Armani Knitted Brazilian Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42430003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.401578012Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 8.00,
      "discount": 78,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Knitted Brazilian Pants (Black 00020)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-emporio-armani-knitted-brazilian-pants-424300#colcode=42430003",
      "title": "Emporio Armani - Emporio Armani Knitted Brazilian Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42430003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.726435393Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 8.00,
      "discount": 78,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brazilian Briefs (Pop Pink 20973)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-brazilian-briefs-424063#colcode=42406306",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42406306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.402081653Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 8.00,
      "discount": 77,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brazilian Briefs (Pop Pink 20973)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-brazilian-briefs-424063#colcode=42406306",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42406306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.727595702Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 8.00,
      "discount": 77,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sailing Bikini Set (Nero)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-sailing-bikini-set-325924#colcode=32592403",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.395841440Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 70,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Sailing Bikini Set (Nero)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-sailing-bikini-set-325924#colcode=32592403",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.719799193Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 39.00,
      "discount": 70,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Five-Pocket Jeans (Blue 0941)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-five-pocket-jeans-543876#colcode=54387618",
      "title": "EMPORIO ARMANI - Five-Pocket Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54387618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.395560311Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 70,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Five-Pocket Jeans (Blue 0941)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-five-pocket-jeans-543876#colcode=54387618",
      "title": "EMPORIO ARMANI - Five-Pocket Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54387618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.395572097Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 45.00,
      "discount": 70,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Crew Sweatshirt (Seafoam 0705)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-crew-sweatshirt-666707#colcode=66670718",
      "title": "Emporio Armani - Crew Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66670718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.395335374Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 70,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Crew Sweatshirt (Seafoam 0705)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-crew-sweatshirt-666707#colcode=66670718",
      "title": "Emporio Armani - Crew Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66670718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.395347409Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 48.00,
      "discount": 70,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Mono Track Pants (Camel 6201)",
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.034124226Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.034134604Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
      "size": "S (46"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-formal-pants-579102#colcode=57910202",
      "title": "OFF WHITE - Formal Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/57910202_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:12:37.033636506Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.035547591Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.035557541Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.035344768Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.835153424Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.877807624Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.835314634Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.833306246Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.833327205Z",
      "seller": "Flannels",
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
      "datePosted": "2023-04-20T12:15:32.828161400Z",
      "seller": "Flannels",
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
      "datePosted": "2023-04-20T12:15:32.828184021Z",
      "seller": "Flannels",
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
      "name": "Patchwork Shir Sn21 (Green 56)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.830716017Z",
      "seller": "Flannels",
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
      "name": "Patchwork Shir Sn21 (Green 56)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.830732316Z",
      "seller": "Flannels",
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
      "name": "Monogram Joggers (Black 99)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.832290139Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-kourt-80-sneakers-117295#colcode=11729501",
      "title": "KENZO - Kourt 80 Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11729501_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:15:32.833086777Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.834397785Z",
      "seller": "Flannels",
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
      "datePosted": "2023-04-20T12:15:32.834755984Z",
      "seller": "Flannels",
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
      "name": "Zaff Scarf Womens (Black 001)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:13:49.570446572Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:49.567450069Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:49.567434761Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:49.567419477Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:49.567398964Z",
      "seller": "Scotts",
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
      "name": "Triangle Rib Ld23 (Bright Yellow)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-triangle-rib-ld23-421917#colcode=42191713",
      "title": "Hugo - Hugo Triangle Rib Ld23",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42191713_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:59.598551696Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Triangle Bralt Ld24 (Bright Pink 670)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-triangle-bralt-ld24-425680#colcode=42568006",
      "title": "Hugo - Hugo Triangle Bralt Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42568006_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:59.597729524Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Triangle Bralt Ld24 (Bright Pink 670)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-triangle-bralt-ld24-425680#colcode=42568006",
      "title": "Hugo - Hugo Triangle Bralt Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42568006_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:59.597757206Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Triangle Bralt Ld24 (Black 001)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-triangle-bralt-ld24-425680#colcode=42568003",
      "title": "Hugo - Hugo Triangle Bralt Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42568003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:59.597181228Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Triangle Bralt Ld24 (Black 001)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-triangle-bralt-ld24-425680#colcode=42568003",
      "title": "Hugo - Hugo Triangle Bralt Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42568003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:59.597243896Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "The Icon Denim Jacket (Dark Grey 022)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-the-icon-denim-jacket-646685#colcode=64668502",
      "title": "Hugo - The Icon Denim Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64668502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.557542902Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "The Icon Denim Jacket (Dark Grey 022)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-the-icon-denim-jacket-646685#colcode=64668502",
      "title": "Hugo - The Icon Denim Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64668502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.557567512Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Terry Set Ld31 (Pink 682)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-terry-set-ld31-425824#colcode=42582406",
      "title": "Hugo - Hugo Terry Set Ld31",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42582406_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:49.569256306Z",
      "seller": "Scotts",
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
      "name": "Terry Set Ld31 (Pink 682)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-terry-set-ld31-425824#colcode=42582406",
      "title": "Hugo - Hugo Terry Set Ld31",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42582406_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:49.569273704Z",
      "seller": "Scotts",
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
      "name": "Sottavia Jumper (Natural)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-sottavia-jumper-324898#colcode=32489801",
      "title": "Hugo - Sottavia Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32489801_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.565357348Z",
      "seller": "Scotts",
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
      "name": "Sottavia Jumper (Natural)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-sottavia-jumper-324898#colcode=32489801",
      "title": "Hugo - Sottavia Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32489801_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.565369608Z",
      "seller": "Scotts",
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
      "name": "Sondelly Cropped Jumper (Black 001)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-sondelly-cropped-jumper-663492#colcode=66349203",
      "title": "Hugo - Sondelly Cropped Jumper",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66349203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.581593750Z",
      "seller": "Scotts",
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
      "name": "Sixtinny Logo T-shirt (Miscellaneous)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-sixtinny-logo-t-shirt-667105#colcode=66710506",
      "title": "Hugo - Sixtinny Logo T-shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66710506_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.576580432Z",
      "seller": "Scotts",
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
      "name": "Serlina Sweater (Light Yellow)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-serlina-sweater-668877#colcode=66887713",
      "title": "Hugo - Serlina Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66887713_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.579604909Z",
      "seller": "Scotts",
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
      "name": "Serlina Sweater (Light Yellow)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-serlina-sweater-668877#colcode=66887713",
      "title": "Hugo - Serlina Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66887713_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.579635798Z",
      "seller": "Scotts",
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
      "name": "Sajity Jog Ld24 (Open White 110)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-sajity-jog-ld24-328093#colcode=32809301",
      "title": "Hugo - Hugo Sajity Jog Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32809301_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.560401880Z",
      "seller": "Scotts",
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
      "name": "Sajity Jog Ld24 (Open White 110)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-sajity-jog-ld24-328093#colcode=32809301",
      "title": "Hugo - Hugo Sajity Jog Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32809301_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.560430113Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.581188368Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.581177976Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.581167145Z",
      "seller": "Scotts",
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
      "name": "Rib Pants Ld24 (Open White 110)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-rib-pants-ld24-578344#colcode=57834401",
      "title": "Hugo - Hugo Rib Pants Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57834401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:49.573684474Z",
      "seller": "Scotts",
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
      "name": "Red Label Crew Neck Sweater (Pastel Pink 680)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-red-label-crew-neck-sweater-665852#colcode=66585206",
      "title": "Hugo - Red Label Crew Neck Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66585206_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:49.573417440Z",
      "seller": "Scotts",
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
      "name": "Nurema Joggers (Black 001)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nurema-joggers-578316#colcode=57831603",
      "title": "HUGO - Nurema Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57831603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.580672959Z",
      "seller": "Scotts",
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
      "name": "Nurema Joggers (Black 001)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nurema-joggers-578316#colcode=57831603",
      "title": "HUGO - Nurema Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57831603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.580683959Z",
      "seller": "Scotts",
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
      "name": "Njamna Jogging Pants (Open White 110)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-njamna-jogging-pants-671983#colcode=67198301",
      "title": "Hugo - Njamna Jogging Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67198301_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.581984194Z",
      "seller": "Scotts",
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
      "name": "Nintje Active Jogging Pants (Black 001)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nintje-active-jogging-pants-450664#colcode=45066403",
      "title": "Hugo - Nintje Active Jogging Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/45066403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.567274385Z",
      "seller": "Scotts",
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
      "name": "Nikia Active Jogging Pants (Black 001)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nikia-active-jogging-pants-321120#colcode=32112003",
      "title": "Hugo - Nikia Active Jogging Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32112003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.575650388Z",
      "seller": "Scotts",
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
      "name": "Nessira Dress (Miscellaneous)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nessira-dress-651138#colcode=65113801",
      "title": "Hugo - Nessira Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65113801_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.566804705Z",
      "seller": "Scotts",
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
      "name": "Nessira Dress (Miscellaneous)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nessira-dress-651138#colcode=65113801",
      "title": "Hugo - Nessira Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65113801_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.566828762Z",
      "seller": "Scotts",
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
      "name": "Nemanie Dress (Black)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nemanie-dress-536268#colcode=53626803",
      "title": "Hugo - Nemanie Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/53626803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:20:11.682875184Z",
      "seller": "Scotts",
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
      "name": "Namara Logo Dress (Miscellaneous)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-namara-logo-dress-659826#colcode=65982606",
      "title": "Hugo - Namara Logo Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65982606_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.567722944Z",
      "seller": "Scotts",
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
      "name": "Kyle Boot Sn24 (Black 001)",
      "brand": "Hugo",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-kyle-boot-sn24-120085#colcode=12008503",
      "title": "Hugo - Hugo Kyle Boot Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/12008503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:20:09.726185149Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 60.00,
      "discount": 69,
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
      "size": "38"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-kenno-shirt-559197#colcode=55919718",
      "title": "Hugo - Kenno Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55919718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:51.579117108Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.575367431Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.575356321Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.575344755Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.575333309Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.575320493Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.574672421Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.574653579Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.574625422Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.565887248Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.565876824Z",
      "seller": "Scotts",
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
      "name": "Honesi Trousers ( Blue)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-honesi-trousers-679253#colcode=67925318",
      "title": "Hugo - Honesi Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67925318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561878655Z",
      "seller": "Scotts",
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
      "name": "Honesi Trousers ( Blue)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-honesi-trousers-679253#colcode=67925318",
      "title": "Hugo - Honesi Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67925318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561891248Z",
      "seller": "Scotts",
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
      "name": "Hilora Flow Shorts (Bright Yellow)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hilora-flow-shorts-573463#colcode=57346313",
      "title": "Hugo - Hilora Flow Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57346313_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.566173618Z",
      "seller": "Scotts",
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
      "name": "Hilora Flow Shorts (Bright Yellow)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hilora-flow-shorts-573463#colcode=57346313",
      "title": "Hugo - Hilora Flow Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57346313_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.566206182Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.559677378Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.559693303Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.559661063Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.559643840Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.560031512Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.559992842Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.560012242Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.559969162Z",
      "seller": "Scotts",
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
      "name": "Hesini Tailored Trousers (Medium Beige)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hesini-tailored-trousers-324999#colcode=32499904",
      "title": "Hugo - Hesini Tailored Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32499904_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561974605Z",
      "seller": "Scotts",
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
      "name": "Hemias Trousers (Miscellaneous)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hemias-trousers-678720#colcode=67872018",
      "title": "Hugo - Hemias Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67872018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.562018195Z",
      "seller": "Scotts",
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
      "name": "Hemias Trousers (Miscellaneous)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hemias-trousers-678720#colcode=67872018",
      "title": "Hugo - Hemias Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67872018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.562029196Z",
      "seller": "Scotts",
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
      "name": "Harlys Trousers (DBeige 251)",
      "brand": "Hugo",
      "size": "36W R (52"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-harlys-trousers-579508#colcode=57950804",
      "title": "Hugo - Harlys Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57950804_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.576042669Z",
      "seller": "Scotts",
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
      "size": "30W R (46"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-harlys-trousers-579508#colcode=57950804",
      "title": "Hugo - Harlys Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57950804_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.576022578Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:49.571393173Z",
      "seller": "Scotts",
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
      "name": "HBH Ralias1 Skt Ld09 ( Miscellaneous)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hbh-ralias1-skt-ld09-579472#colcode=57947299",
      "title": "Hugo - HBH Ralias1 Skt Ld09",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57947299_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.560817059Z",
      "seller": "Scotts",
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
      "name": "Girlfriend T Shirt (White 100)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-girlfriend-t-shirt-650484#colcode=65048401",
      "title": "Hugo - Girlfriend T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65048401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:51.581242952Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 23.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Girlfriend T Shirt (Pastel Green337)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-girlfriend-t-shirt-650484#colcode=65048415",
      "title": "Hugo - Girlfriend T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65048415_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:51.580821137Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 23.00,
      "discount": 69,
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
      "datePosted": "2023-04-20T12:13:47.579304240Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.579285532Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.579206555Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.579193948Z",
      "seller": "Scotts",
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
      "name": "Gilar Dnm Shirt Ld24 (Bright Blue 430)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-gilar-dnm-shirt-ld24-611993#colcode=61199318",
      "title": "Hugo - Hugo Gilar Dnm Shirt Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/61199318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561533397Z",
      "seller": "Scotts",
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
      "name": "Gilar Dnm Shirt Ld24 (Bright Blue 430)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-gilar-dnm-shirt-ld24-611993#colcode=61199318",
      "title": "Hugo - Hugo Gilar Dnm Shirt Ld24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/61199318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561546636Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.561784446Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.561773815Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.561761005Z",
      "seller": "Scotts",
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
      "size": "40W R (56"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.578037799Z",
      "seller": "Scotts",
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
      "size": "38W R (54"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.578024610Z",
      "seller": "Scotts",
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
      "size": "36W R (52"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.578010869Z",
      "seller": "Scotts",
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
      "size": "34W R (50"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.577991572Z",
      "seller": "Scotts",
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
      "size": "32W R (48"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-getlin-suit-trousers-579538#colcode=57953803",
      "title": "Hugo - Getlin Suit Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.577971853Z",
      "seller": "Scotts",
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
      "name": "Gayang Logo Jeans Womens (Turquoise)",
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
      "datePosted": "2023-04-20T12:13:47.580054021Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:49.569670612Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:49.569660266Z",
      "seller": "Scotts",
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
      "size": "38W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-fivan222-shorts-550578#colcode=55057804",
      "title": "Hugo - Fivan222 Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55057804_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.579125450Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.579114046Z",
      "seller": "Scotts",
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
      "name": "Evilya Shirt Womens (Natural)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-evilya-shirt-womens-324901#colcode=32490101",
      "title": "Hugo - Hugo Evilya Shirt Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32490101_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561006464Z",
      "seller": "Scotts",
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
      "name": "Evilya Shirt Womens (Natural)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-evilya-shirt-womens-324901#colcode=32490101",
      "title": "Hugo - Hugo Evilya Shirt Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32490101_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561021099Z",
      "seller": "Scotts",
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
      "name": "EthonCamoBckPck Sn24 (Mcellaneous960)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:13:47.582112702Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.565555822Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.565567708Z",
      "seller": "Scotts",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:13:49.569932693Z",
      "seller": "Scotts",
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
      "name": "Easy Briefs (Medium Blue)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-easy-briefs-424354#colcode=42435418",
      "title": "Hugo - Easy Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42435418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:59.598988926Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Easy Briefs (Medium Blue)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-easy-briefs-424354#colcode=42435418",
      "title": "Hugo - Easy Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42435418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:59.599002110Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Duzu Jog Sn24 (Natural 108)",
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
      "datePosted": "2023-04-20T12:13:47.578626502Z",
      "seller": "Scotts",
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
      "name": "Duzu Jog Sn24 (Natural 108)",
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
      "datePosted": "2023-04-20T12:13:47.578640202Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.574837022Z",
      "seller": "Scotts",
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
      "name": "Drsara T Shirt (Black)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-drsara-t-shirt-573452#colcode=57345203",
      "title": "Hugo - Drsara T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57345203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:49.571065870Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.578427683Z",
      "seller": "Scotts",
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
      "name": "Drowin Jogging Pants (Black 001)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-drowin-jogging-pants-482719#colcode=48271903",
      "title": "Hugo - Drowin Jogging Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48271903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.578451675Z",
      "seller": "Scotts",
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
      "name": "Double Logo Crop T-Shirt (Black)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-double-logo-crop-t-shirt-659830#colcode=65983003",
      "title": "Hugo - Double Logo Crop T-Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65983003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:49.573602545Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.579036146Z",
      "seller": "Scotts",
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
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dolidorio-shorts-430380#colcode=43038003",
      "title": "Hugo - Dolidorio Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/43038003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.579047447Z",
      "seller": "Scotts",
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
      "name": "Dogtooth High Waist Trousers (Grey Mono 998)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dogtooth-high-waist-trousers-328095#colcode=32809502",
      "title": "Hugo - Dogtooth High Waist Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32809502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:49.570871395Z",
      "seller": "Scotts",
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
      "name": "Doccia Sweater (Bright Red)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-doccia-sweater-663679#colcode=66367908",
      "title": "Hugo - Doccia Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66367908_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.565665302Z",
      "seller": "Scotts",
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
      "name": "Doccia Sweater (Bright Red)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-doccia-sweater-663679#colcode=66367908",
      "title": "Hugo - Doccia Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66367908_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.565677497Z",
      "seller": "Scotts",
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
      "name": "Diron Half Zip Hoodie (Black 001)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-diron-half-zip-hoodie-554509#colcode=55450903",
      "title": "Hugo - Diron Half Zip Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55450903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.565973268Z",
      "seller": "Scotts",
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
      "name": "Dibiusa Cotton T Shirt (White)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dibiusa-cotton-t-shirt-668827#colcode=66882701",
      "title": "Hugo - Dibiusa Cotton T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66882701_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:51.581037493Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 23.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Dibiusa Cotton T Shirt (White)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dibiusa-cotton-t-shirt-668827#colcode=66882701",
      "title": "Hugo - Dibiusa Cotton T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66882701_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:51.581050760Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 23.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Diametta Hoodie (Open White)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-diametta-hoodie-323223#colcode=32322301",
      "title": "Hugo - Diametta Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32322301_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.579883724Z",
      "seller": "Scotts",
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
      "name": "Diametta Hoodie (Open White)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-diametta-hoodie-323223#colcode=32322301",
      "title": "Hugo - Diametta Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32322301_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.579898595Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.575903116Z",
      "seller": "Scotts",
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
      "name": "Demella quarter Zip Fastening Jacket (Black)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-demella-quarter-zip-fastening-jacket-544234#colcode=54423403",
      "title": "Hugo - Demella quarter Zip Fastening Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54423403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561142722Z",
      "seller": "Scotts",
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
      "name": "Demella quarter Zip Fastening Jacket (Black)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-demella-quarter-zip-fastening-jacket-544234#colcode=54423403",
      "title": "Hugo - Demella quarter Zip Fastening Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54423403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561157044Z",
      "seller": "Scotts",
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
      "name": "Demali Reverse Logo T Shirt (Grey 032 SMU)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-demali-reverse-logo-t-shirt-658958#colcode=65895802",
      "title": "HUGO - Demali Reverse Logo T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65895802_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:55.573428302Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 17.00,
      "discount": 69,
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
      "datePosted": "2023-04-20T12:13:47.574306950Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.574331926Z",
      "seller": "Scotts",
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
      "name": "Deamia Long Sleeve Top (Grey Mono 998)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-deamia-long-sleeve-top-663481#colcode=66348102",
      "title": "Hugo - Deamia Long Sleeve Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66348102_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:49.573900727Z",
      "seller": "Scotts",
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
      "name": "Deamia Long Sleeve Top (Grey Mono 998)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-deamia-long-sleeve-top-663481#colcode=66348102",
      "title": "Hugo - Deamia Long Sleeve Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66348102_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:49.573914133Z",
      "seller": "Scotts",
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
      "name": "Datheltic Zip Jacket (Black 001)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:13:45.566076999Z",
      "seller": "Scotts",
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
      "name": "Daluise Active Sweatshirt (Black 001)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-daluise-active-sweatshirt-450541#colcode=45054103",
      "title": "Hugo - Daluise Active Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/45054103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.575772513Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:49.573778678Z",
      "seller": "Scotts",
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
      "name": "Cimina Blouse (Black)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-cimina-blouse-573456#colcode=57345603",
      "title": "Hugo - Cimina Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57345603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.561687472Z",
      "seller": "Scotts",
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
      "name": "Cajosi Blouse (Natural)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-cajosi-blouse-544252#colcode=54425269",
      "title": "Hugo - Cajosi Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54425269_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.560753045Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.577370677Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.577346515Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.577358615Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.577334037Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.577306730Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.577321355Z",
      "seller": "Scotts",
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
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-634/2-tapered-jeans-659166#colcode=65916618",
      "title": "Hugo - 634/2 Tapered Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65916618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.567614269Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.578840245Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.578819298Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.578804189Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.578793554Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.578780114Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.576413817Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:45.567048506Z",
      "seller": "Scotts",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:13:59.599248766Z",
      "seller": "Scotts",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:13:59.599407712Z",
      "seller": "Scotts",
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
      "name": "1993 Bralette (Pastel Pink)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-1993-bralette-421802#colcode=42180206",
      "title": "Hugo - 1993 Bralette",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42180206_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:59.598744312Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Hugo"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "1993 Bralette (Pastel Pink)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-1993-bralette-421802#colcode=42180206",
      "title": "Hugo - 1993 Bralette",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42180206_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:59.598762886Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 69,
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
      "datePosted": "2023-04-20T12:13:45.560868994Z",
      "seller": "Scotts",
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
      "name": "Swimsuit (Orca14763)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-swimsuit-354381#colcode=35438112",
      "title": "Emporio Armani - Swimsuit",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35438112_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.395955003Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Swimsuit (Orca14763)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-swimsuit-354381#colcode=35438112",
      "title": "Emporio Armani - Swimsuit",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/35438112_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.720188042Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 37.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "LADIES KNITTED PADDE (Pink 03812)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-ladies-knitted-padde-863003#colcode=86300306",
      "title": "Emporio Armani - LADIES KNITTED PADDE",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/86300306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.399814401Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 20.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "LADIES KNITTED PADDE (Pink 03812)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-ladies-knitted-padde-863003#colcode=86300306",
      "title": "Emporio Armani - LADIES KNITTED PADDE",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/86300306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.723486105Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 20.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "LADIES KNITTED LEGGI (Black)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-ladies-knitted-leggi-678418#colcode=67841803",
      "title": "Emporio Armani - LADIES KNITTED LEGGI",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67841803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.399752390Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 20.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "LADIES KNITTED LEGGI (Black)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-ladies-knitted-leggi-678418#colcode=67841803",
      "title": "Emporio Armani - LADIES KNITTED LEGGI",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/67841803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.723323262Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 20.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Knitted Set (Grey 00948)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-emporio-armani-knitted-set-422805#colcode=42280502",
      "title": "Emporio Armani - Emporio Armani Knitted Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42280502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.396157413Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Knitted Set (Grey 00948)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-emporio-armani-knitted-set-422805#colcode=42280502",
      "title": "Emporio Armani - Emporio Armani Knitted Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42280502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.720478408Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Knitted Set (Grey 00948)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-emporio-armani-knitted-set-422805#colcode=42280502",
      "title": "Emporio Armani - Emporio Armani Knitted Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42280502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.396176221Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Knitted Set (Grey 00948)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-emporio-armani-knitted-set-422805#colcode=42280502",
      "title": "Emporio Armani - Emporio Armani Knitted Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42280502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.720508857Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Knitted Set (Grey 00948)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-emporio-armani-knitted-set-422805#colcode=42280502",
      "title": "Emporio Armani - Emporio Armani Knitted Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42280502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.396191187Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Knitted Set (Grey 00948)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-emporio-armani-knitted-set-422805#colcode=42280502",
      "title": "Emporio Armani - Emporio Armani Knitted Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42280502_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.720540467Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 35.00,
      "discount": 69,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
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
      "datePosted": "2023-04-20T12:10:05.576664505Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.553538815Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.442075537Z",
      "seller": "Scotts",
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
      "name": "Zalava Ld24 (Black 001)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:15.527716312Z",
      "seller": "Scotts",
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
      "name": "Weste Check Waistcoat (Grey 061)",
      "brand": "Boss",
      "size": "UK44"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.552738338Z",
      "seller": "Scotts",
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
      "brand": "Boss",
      "size": "UK42"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.552726557Z",
      "seller": "Scotts",
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
      "brand": "Boss",
      "size": "UK40"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.552713252Z",
      "seller": "Scotts",
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
      "brand": "Boss",
      "size": "UK38"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.552700755Z",
      "seller": "Scotts",
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
      "brand": "Boss",
      "size": "UK36"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-weste-check-waistcoat-602683#colcode=60268302",
      "title": "BOSS - Weste Check Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/60268302_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.552686698Z",
      "seller": "Scotts",
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
      "name": "Vaggie Skirt (Open Blue)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-vaggie-skirt-570377#colcode=57037718",
      "title": "Boss - Vaggie Skirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57037718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549074056Z",
      "seller": "Scotts",
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
      "name": "Tullah Bermuda Shorts (Pastel Pink)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tullah-bermuda-shorts-572439#colcode=57243906",
      "title": "BOSS - Tullah Bermuda Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57243906_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.573686517Z",
      "seller": "Scotts",
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
      "name": "Tullah Bermuda Shorts (Pastel Pink)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tullah-bermuda-shorts-572439#colcode=57243906",
      "title": "BOSS - Tullah Bermuda Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57243906_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.573700236Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:15.523197250Z",
      "seller": "Scotts",
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
      "name": "Trekili Short (Beige 974)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-trekili-short-320963#colcode=32096304",
      "title": "Boss - Trekili Short",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32096304_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:15.527384756Z",
      "seller": "Scotts",
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
      "name": "Titanium-R_Slid_rb 10243417 01 (Black 007)",
      "brand": "Boss",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-titanium-rslidrb-10243417-01-124022#colcode=12402203",
      "title": "Boss - Titanium-R_Slid_rb 10243417 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/12402203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:13.591793598Z",
      "seller": "Scotts",
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
      "name": "Ticonia Trousers (Black 001)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ticonia-trousers-544484#colcode=54448403",
      "title": "Boss - Ticonia Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54448403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.569481180Z",
      "seller": "Scotts",
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
      "name": "Ticonia Trousers (Black 001)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ticonia-trousers-544484#colcode=54448403",
      "title": "Boss - Ticonia Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54448403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.569492977Z",
      "seller": "Scotts",
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
      "name": "Tibanisy High Waisted Pants (Lightl Blue)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tibanisy-high-waisted-pants-670534#colcode=67053418",
      "title": "Boss - Tibanisy High Waisted Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67053418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.568958312Z",
      "seller": "Scotts",
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
      "name": "Tibanisy High Waisted Pants (Lightl Blue)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tibanisy-high-waisted-pants-670534#colcode=67053418",
      "title": "Boss - Tibanisy High Waisted Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67053418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.568972032Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.578413778Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.464847964Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.464881317Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:15.527330319Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.574528069Z",
      "seller": "Scotts",
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
      "name": "Tavad Twill Trousers (Black)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tavad-twill-trousers-672864#colcode=67286403",
      "title": "Boss - Tavad Twill Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67286403_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549935404Z",
      "seller": "Scotts",
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
      "name": "Tatum Tapered Fit Jeans (Medium Blue 426)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:07.552568587Z",
      "seller": "Scotts",
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
      "brand": "Boss",
      "size": "34W S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tatum-tapered-fit-jeans-659189#colcode=65918918",
      "title": "BOSS - Tatum Tapered Fit Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65918918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.552557433Z",
      "seller": "Scotts",
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
      "brand": "Boss",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tatum-tapered-fit-jeans-659189#colcode=65918918",
      "title": "BOSS - Tatum Tapered Fit Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65918918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:19:43.528983749Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.468313268Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.468336981Z",
      "seller": "Scotts",
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
      "name": "Tacargo Trousers (Open Pink)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tacargo-trousers-670417#colcode=67041706",
      "title": "BOSS - Tacargo Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67041706_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.574114989Z",
      "seller": "Scotts",
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
      "name": "Tacargo Trousers (Open Pink)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tacargo-trousers-670417#colcode=67041706",
      "title": "BOSS - Tacargo Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67041706_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.574135148Z",
      "seller": "Scotts",
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
      "name": "Taberon Cargo Trousers (Medium Blue 424)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-taberon-cargo-trousers-513150#colcode=51315019",
      "title": "BOSS - Taberon Cargo Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51315019_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.440743444Z",
      "seller": "Scotts",
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
      "name": "T-Tie 6 cm knit Sn99 (Medium Beige)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:07.554751921Z",
      "seller": "Scotts",
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
      "name": "T-Perry Short Sleeve Polo Shirt Mens (Dark Blue)",
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
      "datePosted": "2023-04-20T12:10:05.576926660Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.551078638Z",
      "seller": "Scotts",
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
      "name": "T-Loren-Ar_Sz30 Sn99 (Dark Grey)",
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
      "datePosted": "2023-04-20T12:10:07.547161395Z",
      "seller": "Scotts",
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
      "name": "T-Loren-Ar_Sz30 Sn99 (Dark Grey)",
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
      "datePosted": "2023-04-20T12:10:07.547145981Z",
      "seller": "Scotts",
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
      "name": "Stanino Slim Fit Smart Stretch Trousers (Blue 402)",
      "brand": "Boss",
      "size": "54"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-stanino-slim-fit-smart-stretch-trousers-519346#colcode=51934618",
      "title": "Boss - Stanino Slim Fit Smart Stretch Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51934618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.463540638Z",
      "seller": "Scotts",
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
      "size": "52"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-stanino-slim-fit-smart-stretch-trousers-519346#colcode=51934618",
      "title": "Boss - Stanino Slim Fit Smart Stretch Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51934618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.463512088Z",
      "seller": "Scotts",
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
      "size": "46"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-stanino-slim-fit-smart-stretch-trousers-519346#colcode=51934618",
      "title": "Boss - Stanino Slim Fit Smart Stretch Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51934618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.463475963Z",
      "seller": "Scotts",
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
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-spectre-slim-trousers-360402#colcode=36040219",
      "title": "Boss - Spectre Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/36040219_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.553739951Z",
      "seller": "Scotts",
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
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-spectre-slim-trousers-360402#colcode=36040219",
      "title": "Boss - Spectre Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/36040219_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.553751849Z",
      "seller": "Scotts",
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
      "name": "Solga Trosuers ( White)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-solga-trosuers-544239#colcode=54423901",
      "title": "Boss - Solga Trosuers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54423901_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.463957620Z",
      "seller": "Scotts",
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
      "name": "Solga Trosuers ( White)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-solga-trosuers-544239#colcode=54423901",
      "title": "Boss - Solga Trosuers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54423901_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.463996457Z",
      "seller": "Scotts",
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
      "name": "Slim Delaware Jeans (Dark Blue 402)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:11.500660726Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:11.499895815Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.444423732Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.465491763Z",
      "seller": "Scotts",
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
      "name": "Short Sleeve Shirt Mens (Open Blue 489)",
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
      "datePosted": "2023-04-20T12:10:13.592032386Z",
      "seller": "Scotts",
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
      "name": "Shinobi Tape Trousers (Black 001)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-shinobi-tape-trousers-380406#colcode=38040603",
      "title": "Boss - Shinobi Tape Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/38040603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.553609898Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:13.590729916Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:13.589892764Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:13.589903161Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:13.590493451Z",
      "seller": "Scotts",
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
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-sefade-fleece-shorts-472315#colcode=47231518",
      "title": "Boss - Sefade Fleece Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47231518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:13.590511303Z",
      "seller": "Scotts",
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
      "name": "Scoop Neck T Shirt (Miscellaneous)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-scoop-neck-t-shirt-649613#colcode=64961369",
      "title": "Boss - Scoop Neck T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64961369_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:19.499945010Z",
      "seller": "Scotts",
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
      "name": "Sash Leather Belt Mens (Medium Brown)",
      "brand": "Boss",
      "size": "85"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-sash-leather-belt-mens-738410#colcode=73841069",
      "title": "Boss - Boss Sash Leather Belt Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/73841069_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:17.602965255Z",
      "seller": "Scotts",
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
      "name": "Ronnie Shirt (Medium Blue 425)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:15.524690893Z",
      "seller": "Scotts",
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
      "name": "Ronni_53F 10227 Sn99 (Black)",
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
      "datePosted": "2023-04-20T12:10:15.527477346Z",
      "seller": "Scotts",
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
      "name": "Rikki 53 Shirt (White 100)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-rikki-53-shirt-557755#colcode=55775501",
      "title": "Boss - Rikki 53 Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55775501_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:17.602809693Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:17.602528975Z",
      "seller": "Scotts",
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
      "name": "Relaxed Fit Hoodie (Black)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-relaxed-fit-hoodie-668689#colcode=66868903",
      "title": "Boss - Relaxed Fit Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66868903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.547354368Z",
      "seller": "Scotts",
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
      "name": "Reid Check Shirt (Open Green360)",
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
      "datePosted": "2023-04-20T12:10:15.523041494Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.554533642Z",
      "seller": "Scotts",
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
      "name": "Pocket Square (Bright Red)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:25.598843026Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.553292687Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.553311989Z",
      "seller": "Scotts",
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
      "name": "Parkour Running Trainers (Red 640)",
      "brand": "Boss",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-parkour-running-trainers-119854#colcode=11985408",
      "title": "Boss - Parkour Running Trainers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/11985408_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.548692728Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.576837128Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.547563334Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:15.527667624Z",
      "seller": "Scotts",
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
      "name": "Modrn WdeLg Jns Ld24 (Bright Blue 433)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.572591837Z",
      "seller": "Scotts",
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
      "name": "Modrn WdeLg Jns Ld24 (Bright Blue 433)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.572581182Z",
      "seller": "Scotts",
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
      "name": "Modrn WdeLg Jns Ld24 (Bright Blue 433)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.572571512Z",
      "seller": "Scotts",
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
      "name": "Modrn WdeLg Jns Ld24 (Bright Blue 433)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.572561217Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.500538479Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.500549878Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.500524535Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:15.527159547Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:17.602731511Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.551496769Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.551482544Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.551468965Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:07.551601384Z",
      "seller": "Scotts",
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
      "size": "48"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-mm-waistcoat-566004#colcode=56600418",
      "title": "Boss - MM Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/56600418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.550544426Z",
      "seller": "Scotts",
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
      "size": "46"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-mm-waistcoat-566004#colcode=56600418",
      "title": "Boss - MM Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/56600418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.550532932Z",
      "seller": "Scotts",
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
      "size": "44"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-mm-waistcoat-566004#colcode=56600418",
      "title": "Boss - MM Waistcoat",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/56600418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.550520976Z",
      "seller": "Scotts",
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
      "name": "Lyaran Scarf Womens (Black 001)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:09.465386666Z",
      "seller": "Scotts",
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
      "name": "Lyara Scarf Womens (Black)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:09.465268863Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:17.602882755Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.573999067Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.553492701Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.464183591Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.573536571Z",
      "seller": "Scotts",
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
      "name": "Lamont 69 Pant (Black 001)",
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
      "datePosted": "2023-04-20T12:10:07.550400951Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.550839752Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.550850274Z",
      "seller": "Scotts",
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
      "name": "Knitted Tie Mens (Dark Blue 404)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:13.592114925Z",
      "seller": "Scotts",
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
      "name": "Keith Jeans (Dark Blue 404)",
      "brand": "Boss",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-keith-jeans-654094#colcode=65409418",
      "title": "Boss - Keith Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65409418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.465126787Z",
      "seller": "Scotts",
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
      "name": "Katlin Bumbag-Tp 10228801 01 (Black)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:07.548462855Z",
      "seller": "Scotts",
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
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaitol-slim-trousers-514119#colcode=51411918",
      "title": "Boss - Kaitol Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51411918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.441709110Z",
      "seller": "Scotts",
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
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaitol-slim-trousers-514119#colcode=51411918",
      "title": "Boss - Kaitol Slim Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51411918_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.441737458Z",
      "seller": "Scotts",
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
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaito-trousers-510304#colcode=51030401",
      "title": "Boss - Kaito Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51030401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.444888219Z",
      "seller": "Scotts",
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
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-kaito-trousers-510304#colcode=51030401",
      "title": "Boss - Kaito Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51030401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.444909008Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.444015881Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.441208999Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.441184713Z",
      "seller": "Scotts",
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
      "size": "40"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-joy-shirt-329889#colcode=32988901",
      "title": "Boss - Joy Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32988901_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.443694027Z",
      "seller": "Scotts",
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
      "name": "Jason 10230062 Sn99 (Bright Blue)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:09.443300643Z",
      "seller": "Scotts",
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
      "name": "Ivili Camisole Top (Beige 974)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ivili-camisole-top-648256#colcode=64825604",
      "title": "Boss - Ivili Camisole Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64825604_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:15.523346736Z",
      "seller": "Scotts",
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
      "name": "Ivili Camisole Top (Beige 974)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ivili-camisole-top-648256#colcode=64825604",
      "title": "Boss - Ivili Camisole Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64825604_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:15.523369292Z",
      "seller": "Scotts",
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
      "name": "Isatina Top (Bright Pink)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-isatina-top-650562#colcode=65056206",
      "title": "Boss - Isatina Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65056206_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549546295Z",
      "seller": "Scotts",
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
      "name": "Isatina Top (Bright Pink)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-isatina-top-650562#colcode=65056206",
      "title": "Boss - Isatina Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65056206_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549577592Z",
      "seller": "Scotts",
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
      "name": "Isatina Top (Bright Pink)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-isatina-top-650562#colcode=65056206",
      "title": "Boss - Isatina Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65056206_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549593236Z",
      "seller": "Scotts",
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
      "name": "Inda High Neck Blouse (Leopard 974)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-inda-high-neck-blouse-543519#colcode=54351999",
      "title": "Boss - Inda High Neck Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54351999_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.554173333Z",
      "seller": "Scotts",
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
      "name": "Inda High Neck Blouse (Leopard 974)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-inda-high-neck-blouse-543519#colcode=54351999",
      "title": "Boss - Inda High Neck Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54351999_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.554186127Z",
      "seller": "Scotts",
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
      "name": "Ilyna Top (Black)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ilyna-top-570046#colcode=57004603",
      "title": "Boss - Ilyna Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57004603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.464346320Z",
      "seller": "Scotts",
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
      "name": "Hover Fleece Jogging Bottoms Mens (Black 001)",
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
      "datePosted": "2023-04-20T12:10:07.554022209Z",
      "seller": "Scotts",
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
      "name": "Hapron 5 Trousers (Navy 410)",
      "brand": "Boss",
      "size": "38"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-hapron-5-trousers-362019#colcode=36201922",
      "title": "Boss - Hapron 5 Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/36201922_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.444228051Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.500706846Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.500725909Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.575615828Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.575599497Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.575583009Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.575454200Z",
      "seller": "Scotts",
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
      "size": "32W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-trousers-579496#colcode=57949618",
      "title": "Boss - Genius Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57949618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.577394782Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.577382671Z",
      "seller": "Scotts",
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
      "size": "40W R (56"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.575936288Z",
      "seller": "Scotts",
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
      "size": "38W R (54"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.575913921Z",
      "seller": "Scotts",
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
      "size": "36W R (52"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.575886151Z",
      "seller": "Scotts",
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
      "size": "34W R (50"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.575867265Z",
      "seller": "Scotts",
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
      "size": "32W R (48"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.575844508Z",
      "seller": "Scotts",
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
      "size": "30W R (46"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-genius-drawstring-trousers-579534#colcode=57953404",
      "title": "Boss - Genius Drawstring Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57953404_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.575814548Z",
      "seller": "Scotts",
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
      "name": "Floriene Dress (Miscellaneous)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-floriene-dress-324883#colcode=32488306",
      "title": "BOSS - Floriene Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32488306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.567638473Z",
      "seller": "Scotts",
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
      "name": "Floriene Dress (Miscellaneous)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-floriene-dress-324883#colcode=32488306",
      "title": "BOSS - Floriene Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32488306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.567650361Z",
      "seller": "Scotts",
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
      "name": "Flori 10243108 01 (Miscellaneous)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-flori-10243108-01-663700#colcode=66370006",
      "title": "BOSS - Flori 10243108 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66370006_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.550195554Z",
      "seller": "Scotts",
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
      "name": "First Backpack Mens (Black)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.569066671Z",
      "seller": "Scotts",
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
      "name": "Feyah Ombre Sweater ( Miscellaneous)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-feyah-ombre-sweater-667514#colcode=66751499",
      "title": "Boss - Feyah Ombre Sweater",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66751499_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549770845Z",
      "seller": "Scotts",
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
      "name": "Fadenas Cardigan (Black)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-fadenas-cardigan-501368#colcode=50136803",
      "title": "Boss - Fadenas Cardigan",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/50136803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.577052140Z",
      "seller": "Scotts",
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
      "name": "Faden WK Cardigan (Black)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-faden-wk-cardigan-501379#colcode=50137903",
      "title": "Boss - Faden WK Cardigan",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/50137903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.577142802Z",
      "seller": "Scotts",
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
      "name": "Esoara Sleeveless Dress (Miscellaneous)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-esoara-sleeveless-dress-659951#colcode=65995199",
      "title": "Boss - Esoara Sleeveless Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65995199_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.568862106Z",
      "seller": "Scotts",
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
      "name": "Esoara Sleeveless Dress (Miscellaneous)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-esoara-sleeveless-dress-659951#colcode=65995199",
      "title": "Boss - Esoara Sleeveless Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65995199_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.568878212Z",
      "seller": "Scotts",
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
      "name": "Erya Mock Stripe Top (Miscellaneous)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-erya-mock-stripe-top-324938#colcode=32493899",
      "title": "Boss - Erya Mock Stripe Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32493899_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:13.592301318Z",
      "seller": "Scotts",
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
      "name": "Epiquata Zip Sweatshirt (White)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-epiquata-zip-sweatshirt-543802#colcode=54380201",
      "title": "Boss - Epiquata Zip Sweatshirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54380201_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.551658495Z",
      "seller": "Scotts",
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
      "name": "Emaya Sequin Zip Hoodie (Black 001)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-emaya-sequin-zip-hoodie-665343#colcode=66534303",
      "title": "Boss - Emaya Sequin Zip Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66534303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.547403416Z",
      "seller": "Scotts",
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
      "name": "Emaya Sequin Zip Hoodie (Black 001)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-emaya-sequin-zip-hoodie-665343#colcode=66534303",
      "title": "Boss - Emaya Sequin Zip Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66534303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.547416901Z",
      "seller": "Scotts",
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
      "name": "Emam T-Shirt (Open White)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-emam-t-shirt-324935#colcode=32493501",
      "title": "Boss - Boss Emam T-Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32493501_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:13.592193196Z",
      "seller": "Scotts",
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
      "name": "Ecanny Joggers (Silver)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ecanny-joggers-578121#colcode=57812111",
      "title": "Boss - Ecanny Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57812111_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549119549Z",
      "seller": "Scotts",
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
      "name": "Ecanny Joggers (Silver)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ecanny-joggers-578121#colcode=57812111",
      "title": "Boss - Ecanny Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57812111_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549131281Z",
      "seller": "Scotts",
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
      "name": "Ecanny Joggers (Silver)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ecanny-joggers-578121#colcode=57812111",
      "title": "Boss - Ecanny Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57812111_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549145200Z",
      "seller": "Scotts",
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
      "name": "Ebasy Hoodie (Open Misc)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ebasy-hoodie-663897#colcode=66389706",
      "title": "Boss - Ebasy Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66389706_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.551337932Z",
      "seller": "Scotts",
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
      "name": "Ebasy Hoodie (Open Misc)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ebasy-hoodie-663897#colcode=66389706",
      "title": "Boss - Ebasy Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66389706_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.551351298Z",
      "seller": "Scotts",
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
      "name": "Ebasy Hoodie (Open Misc)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ebasy-hoodie-663897#colcode=66389706",
      "title": "Boss - Ebasy Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66389706_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.551362275Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.575158491Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.575174715Z",
      "seller": "Scotts",
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
      "name": "Deva Tote M Ld23 (Black)",
      "brand": "Boss",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-deva-tote-m-ld23-713655#colcode=71365503",
      "title": "Boss - Boss Deva Tote M Ld23",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/71365503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:13.591001201Z",
      "seller": "Scotts",
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
      "name": "Denim Jacket (Pastel Pink)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-denim-jacket-659760#colcode=65976006",
      "title": "Boss - Denim Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65976006_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.576427162Z",
      "seller": "Scotts",
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
      "name": "Denim Jacket (Pastel Pink)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-denim-jacket-659760#colcode=65976006",
      "title": "Boss - Denim Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65976006_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.576464760Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.441548207Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.441522564Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.568593270Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.568582614Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.568571394Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.568551426Z",
      "seller": "Scotts",
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
      "name": "Datta Shirt Dress Womens (Pastel Blue)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-datta-shirt-dress-womens-659772#colcode=65977218",
      "title": "Boss - Boss Datta Shirt Dress Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65977218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.574584580Z",
      "seller": "Scotts",
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
      "name": "Datta Shirt Dress Womens (Pastel Blue)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-datta-shirt-dress-womens-659772#colcode=65977218",
      "title": "Boss - Boss Datta Shirt Dress Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65977218_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.574598245Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.553668081Z",
      "seller": "Scotts",
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
      "name": "Crosstown Phone Wallet Mens (Black)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.576343356Z",
      "seller": "Scotts",
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
      "name": "Classic Cotton Blouse (Bright Pink)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-classic-cotton-blouse-544184#colcode=54418406",
      "title": "Boss - Classic Cotton Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54418406_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:15.527623375Z",
      "seller": "Scotts",
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
      "name": "Catch GL BckPck Sn24 (Black 001)",
      "brand": "Boss",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-catch-gl-bckpck-sn24-715292#colcode=71529203",
      "title": "Boss - Boss Catch GL BckPck Sn24",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/71529203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.547044460Z",
      "seller": "Scotts",
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
      "name": "Catch Backpack Mens (Navy)",
      "brand": "Boss",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-catch-backpack-mens-715346#colcode=71534618",
      "title": "Boss - Boss Catch Backpack Mens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/71534618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.549820611Z",
      "seller": "Scotts",
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
      "name": "C_Jalis 10239920 01 (Pastel Blue)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cjalis-10239920-01-324876#colcode=32487618",
      "title": "Boss - C_Jalis 10239920 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32487618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.568055968Z",
      "seller": "Scotts",
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
      "name": "C_Jalis 10239920 01 (Pastel Blue)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cjalis-10239920-01-324876#colcode=32487618",
      "title": "Boss - C_Jalis 10239920 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32487618_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.568115705Z",
      "seller": "Scotts",
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
      "name": "C_Fabluna 10242387 01 (Blue)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cfabluna-10242387-01-525797#colcode=52579718",
      "title": "Boss - C_Fabluna 10242387 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/52579718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.550967669Z",
      "seller": "Scotts",
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
      "name": "C_Fabluna 10242387 01 (Blue)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cfabluna-10242387-01-525797#colcode=52579718",
      "title": "Boss - C_Fabluna 10242387 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/52579718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.550980593Z",
      "seller": "Scotts",
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
      "name": "C_Ejamika 10233818 01 (Pastel Pink)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cejamika-10233818-01-663611#colcode=66361106",
      "title": "Boss - C_Ejamika 10233818 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66361106_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.546499432Z",
      "seller": "Scotts",
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
      "name": "C_Ejamika 10233818 01 (Pastel Pink)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cejamika-10233818-01-663611#colcode=66361106",
      "title": "Boss - C_Ejamika 10233818 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66361106_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.546536845Z",
      "seller": "Scotts",
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
      "name": "C_Ebatiki 10238476 01 (Blue)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cebatiki-10238476-01-578053#colcode=57805318",
      "title": "Boss - C_Ebatiki 10238476 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57805318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.464573340Z",
      "seller": "Scotts",
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
      "name": "C_Ebatiki 10238476 01 (Blue)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cebatiki-10238476-01-578053#colcode=57805318",
      "title": "Boss - C_Ebatiki 10238476 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57805318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.464605495Z",
      "seller": "Scotts",
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
      "name": "C_Ebatika 10238476 01 (Blue)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cebatika-10238476-01-324874#colcode=32487418",
      "title": "Boss - C_Ebatika 10238476 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32487418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.442830230Z",
      "seller": "Scotts",
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
      "name": "C_Ebatika 10238476 01 (Blue)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cebatika-10238476-01-324874#colcode=32487418",
      "title": "Boss - C_Ebatika 10238476 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32487418_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.442867333Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.463202460Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:09.463157192Z",
      "seller": "Scotts",
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
      "size": "S (46"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-brem-trousers-554890#colcode=55489018",
      "title": "Boss - Brem Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55489018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.551126878Z",
      "seller": "Scotts",
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
      "size": "M (48"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-brem-trousers-554890#colcode=55489018",
      "title": "Boss - Brem Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/55489018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.551138796Z",
      "seller": "Scotts",
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
      "name": "Bold Logo T-Shirt (White)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bold-logo-t-shirt-659757#colcode=65975727",
      "title": "Boss - Bold Logo T-Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65975727_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:19.499495942Z",
      "seller": "Scotts",
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
      "name": "Bold Logo T-Shirt (White)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bold-logo-t-shirt-659757#colcode=65975727",
      "title": "Boss - Bold Logo T-Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65975727_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:19.499507201Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.577656300Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.577642238Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.577629971Z",
      "seller": "Scotts",
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
      "name": "Bemalong Blouse (Medium Pink)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bemalong-blouse-324758#colcode=32475806",
      "title": "Boss - Bemalong Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32475806_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:09.442551554Z",
      "seller": "Scotts",
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
      "name": "Bellevou Blouse (White)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bellevou-blouse-544206#colcode=54420601",
      "title": "Boss - Bellevou Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54420601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.548975430Z",
      "seller": "Scotts",
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
      "name": "Bellevou Blouse (White)",
      "brand": "Boss",
      "size": "2XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bellevou-blouse-544206#colcode=54420601",
      "title": "Boss - Bellevou Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54420601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:07.548963523Z",
      "seller": "Scotts",
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
      "name": "Banks Trousers (DBlue 402)",
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
      "datePosted": "2023-04-20T12:10:07.551740712Z",
      "seller": "Scotts",
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
      "name": "Banks Trousers (DBlue 402)",
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
      "datePosted": "2023-04-20T12:10:07.551729798Z",
      "seller": "Scotts",
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
      "name": "Banks Trousers (DBlue 402)",
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
      "datePosted": "2023-04-20T12:10:07.551718909Z",
      "seller": "Scotts",
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
      "name": "Banks Trousers (DBlue 402)",
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
      "datePosted": "2023-04-20T12:10:07.551706647Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.550769709Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.550757244Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.550684149Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:07.550672512Z",
      "seller": "Scotts",
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
      "name": "Balady Long Sleeve Shirt (Black 001)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-balady-long-sleeve-shirt-658328#colcode=65832803",
      "title": "Boss - Balady Long Sleeve Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65832803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.573048397Z",
      "seller": "Scotts",
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
      "name": "Balady Long Sleeve Shirt (Black 001)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-balady-long-sleeve-shirt-658328#colcode=65832803",
      "title": "Boss - Balady Long Sleeve Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65832803_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.573069984Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:19.499867371Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.500111955Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.500123881Z",
      "seller": "Scotts",
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
      "name": "Amber Crossb.-TP 10243681 01 (Pastel Pink)",
      "brand": "Boss",
      "size": "ONE SIZE"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-amber-crossb-tp-10243681-01-706795#colcode=70679506",
      "title": "Boss - Amber Crossb.-TP 10243681 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/70679506_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:19:43.521875012Z",
      "seller": "Scotts",
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
      "name": "Addison Shopper (Beige SMU)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.567449628Z",
      "seller": "Scotts",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.840377825Z",
      "seller": "Flannels",
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
      "name": "Sovanelly Rib Knitted Top (Bright Red)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-sovanelly-rib-knitted-top-323198#colcode=32319808",
      "title": "Hugo - Sovanelly Rib Knitted Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32319808_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.584644332Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.583728401Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.583746529Z",
      "seller": "Scotts",
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
      "name": "Saffatty Dress (Open White)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-saffatty-dress-659856#colcode=65985601",
      "title": "Hugo - Saffatty Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65985601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.558163535Z",
      "seller": "Scotts",
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
      "name": "Saffatty Dress (Open White)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-saffatty-dress-659856#colcode=65985601",
      "title": "Hugo - Saffatty Dress",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65985601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:45.558181511Z",
      "seller": "Scotts",
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
      "name": "Redlabel Dachibi Joggers (Pastel Pink 680)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-redlabel-dachibi-joggers-672173#colcode=67217306",
      "title": "Hugo - Redlabel Dachibi Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67217306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.583555354Z",
      "seller": "Scotts",
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
      "name": "Redlabel Dachibi Joggers (Pastel Pink 680)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-redlabel-dachibi-joggers-672173#colcode=67217306",
      "title": "Hugo - Redlabel Dachibi Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67217306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.583568019Z",
      "seller": "Scotts",
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
      "name": "Pure Bralette (Black)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-pure-bralette-352976#colcode=35297603",
      "title": "Hugo - Pure Bralette",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35297603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.538612805Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "name": "Pure Bralette (Black)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-pure-bralette-352976#colcode=35297603",
      "title": "Hugo - Pure Bralette",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35297603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.538624603Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "name": "Njola Jogging Pants (Open White 110)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-njola-jogging-pants-578148#colcode=57814801",
      "title": "Hugo - Njola Jogging Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57814801_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.584976096Z",
      "seller": "Scotts",
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
      "name": "Njola Jogging Pants (Open White 110)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-njola-jogging-pants-578148#colcode=57814801",
      "title": "Hugo - Njola Jogging Pants",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57814801_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.584988451Z",
      "seller": "Scotts",
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
      "name": "Nente Shorts (Bright Red)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nente-shorts-573235#colcode=57323508",
      "title": "Hugo - Nente Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57323508_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:53.569438536Z",
      "seller": "Scotts",
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
      "name": "Nente Shorts (Bright Red)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nente-shorts-573235#colcode=57323508",
      "title": "Hugo - Nente Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57323508_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:53.569463103Z",
      "seller": "Scotts",
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
      "name": "Nente Shorts (Bright Red)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nente-shorts-573235#colcode=57323508",
      "title": "Hugo - Nente Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57323508_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:53.569481904Z",
      "seller": "Scotts",
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
      "name": "Nelope T Shirt (Black)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nelope-t-shirt-323227#colcode=32322703",
      "title": "Hugo - Nelope T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32322703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:53.569238838Z",
      "seller": "Scotts",
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
      "name": "Nariane Bottoms (Natural)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nariane-bottoms-672190#colcode=67219069",
      "title": "Hugo - Nariane Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67219069_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.585099803Z",
      "seller": "Scotts",
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
      "name": "Nariane Bottoms (Natural)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nariane-bottoms-672190#colcode=67219069",
      "title": "Hugo - Nariane Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67219069_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.585109901Z",
      "seller": "Scotts",
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
      "name": "Nariane Bottoms (Natural)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-nariane-bottoms-672190#colcode=67219069",
      "title": "Hugo - Nariane Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67219069_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.585121332Z",
      "seller": "Scotts",
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
      "name": "Monogram Briefs (Miscellaneous)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-monogram-briefs-357345#colcode=35734518",
      "title": "Hugo - Monogram Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35734518_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.538933859Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "name": "Logo Brief Ld23 (Miscellaneous)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-logo-brief-ld23-357553#colcode=35755306",
      "title": "Hugo - Hugo Logo Brief Ld23",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35755306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.539022346Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "name": "Logo Brief Ld23 (Miscellaneous)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-logo-brief-ld23-357553#colcode=35755306",
      "title": "Hugo - Hugo Logo Brief Ld23",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35755306_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.539033559Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "name": "Leopard Bralette (Miscellaneous)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-leopard-bralette-350474#colcode=35047413",
      "title": "Hugo - Leopard Bralette",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35047413_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.538481777Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "name": "Leopard Bralette (Miscellaneous)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-leopard-bralette-350474#colcode=35047413",
      "title": "Hugo - Leopard Bralette",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35047413_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.538497904Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "datePosted": "2023-04-20T12:13:47.584426290Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.584400769Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.584375481Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.584810892Z",
      "seller": "Scotts",
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
      "name": "HBH Pad Sport Logo Ld23 (Light Beige)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hbh-pad-sport-logo-ld23-421801#colcode=42180105",
      "title": "Hugo - HBH Pad Sport Logo Ld23",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42180105_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.538085845Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "name": "HBH Pad Sport Logo Ld23 (Light Beige)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hbh-pad-sport-logo-ld23-421801#colcode=42180105",
      "title": "Hugo - HBH Pad Sport Logo Ld23",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42180105_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.538096871Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-gyte-trousers-512972#colcode=51297202",
      "title": "Hugo - Gyte Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51297202_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.584017675Z",
      "seller": "Scotts",
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
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-gyte-trousers-512972#colcode=51297202",
      "title": "Hugo - Gyte Trousers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/51297202_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.584036432Z",
      "seller": "Scotts",
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
      "name": "EthonNSzip Sn24 (Mscellaneous960)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:13:53.568744959Z",
      "seller": "Scotts",
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
      "name": "Ekea Striped Shirt (Pastel Pink)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-ekea-striped-shirt-324902#colcode=32490206",
      "title": "Hugo - Ekea Striped Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32490206_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.585314332Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:14:05.620035488Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:13:47.584735689Z",
      "seller": "Scotts",
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
      "name": "Denisse T-Shirt (White)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-denisse-t-shirt-323199#colcode=32319901",
      "title": "Hugo - Denisse T-Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32319901_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:53.568973086Z",
      "seller": "Scotts",
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
      "name": "Denisse T-Shirt (White)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-denisse-t-shirt-323199#colcode=32319901",
      "title": "Hugo - Denisse T-Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32319901_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:53.568998160Z",
      "seller": "Scotts",
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
      "name": "Dangaya Crop Hoodie (Pastel Pink)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dangaya-crop-hoodie-667037#colcode=66703706",
      "title": "Hugo - Dangaya Crop Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66703706_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.585487151Z",
      "seller": "Scotts",
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
      "name": "Dangaya Crop Hoodie (Pastel Pink)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dangaya-crop-hoodie-667037#colcode=66703706",
      "title": "Hugo - Dangaya Crop Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66703706_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.585499079Z",
      "seller": "Scotts",
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
      "name": "Dangaya Crop Hoodie (Open White)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dangaya-crop-hoodie-667037#colcode=66703701",
      "title": "Hugo - Dangaya Crop Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66703701_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.585390612Z",
      "seller": "Scotts",
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
      "name": "Dangaya Crop Hoodie (Black)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dangaya-crop-hoodie-667037#colcode=66703703",
      "title": "Hugo - Dangaya Crop Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66703703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.583368417Z",
      "seller": "Scotts",
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
      "name": "Dangaya Crop Hoodie (Black)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dangaya-crop-hoodie-667037#colcode=66703703",
      "title": "Hugo - Dangaya Crop Hoodie",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/66703703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.583379624Z",
      "seller": "Scotts",
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
      "name": "Dachibi Joggers (Pastel Pink)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dachibi-joggers-578110#colcode=57811006",
      "title": "Hugo - Dachibi Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57811006_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.584854217Z",
      "seller": "Scotts",
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
      "name": "Dachibi Joggers (Pastel Pink)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dachibi-joggers-578110#colcode=57811006",
      "title": "Hugo - Dachibi Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57811006_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.584865439Z",
      "seller": "Scotts",
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
      "name": "Dachibi Joggers (Black)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dachibi-joggers-578110#colcode=57811003",
      "title": "Hugo - Dachibi Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57811003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.584191505Z",
      "seller": "Scotts",
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
      "name": "Dachibi Joggers (Black)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-dachibi-joggers-578110#colcode=57811003",
      "title": "Hugo - Dachibi Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/57811003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:47.584205181Z",
      "seller": "Scotts",
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
      "name": "Classic Leopard Bikini Bottoms (Miscellaneous)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-classic-leopard-bikini-bottoms-357322#colcode=35732213",
      "title": "Hugo - Classic Leopard Bikini Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35732213_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.538811581Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "name": "Classic Leopard Bikini Bottoms (Miscellaneous)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-classic-leopard-bikini-bottoms-357322#colcode=35732213",
      "title": "Hugo - Classic Leopard Bikini Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35732213_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:57.538823859Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 14.00,
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
      "datePosted": "2023-04-20T12:13:45.558383581Z",
      "seller": "Scotts",
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
      "name": "Brazilian Briefs (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-brazilian-briefs-424296#colcode=42429603",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42429603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.402607752Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brazilian Briefs (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-brazilian-briefs-424296#colcode=42429603",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42429603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.728099451Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brazilian Briefs (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-brazilian-briefs-424296#colcode=42429603",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42429603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.402631266Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brazilian Briefs (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-brazilian-briefs-424296#colcode=42429603",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42429603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.728125163Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brazilian Briefs (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-brazilian-briefs-424296#colcode=42429603",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42429603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.402649165Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Brazilian Briefs (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-brazilian-briefs-424296#colcode=42429603",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42429603_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.728152007Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 12.00,
      "discount": 68,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani"
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
      "datePosted": "2023-04-20T12:10:11.496426556Z",
      "seller": "Scotts",
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
      "name": "Tillia 10242483 01 (Medium Yellow)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tillia-10242483-01-678595#colcode=67859513",
      "title": "BOSS - Tillia 10242483 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67859513_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.570588530Z",
      "seller": "Scotts",
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
      "name": "Tillia 10242483 01 (Medium Yellow)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-tillia-10242483-01-678595#colcode=67859513",
      "title": "BOSS - Tillia 10242483 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67859513_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.570609096Z",
      "seller": "Scotts",
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
      "name": "TChrsto LS Shrt Sn99 (Medium Pink)",
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
      "datePosted": "2023-04-20T12:10:05.570838127Z",
      "seller": "Scotts",
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
      "name": "TChrsto LS Shrt Sn99 (Medium Pink)",
      "brand": "Boss",
      "size": "41"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-tchrsto-ls-shrt-sn99-331208#colcode=33120806",
      "title": "Boss - Boss TChrsto LS Shrt Sn99",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/33120806_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.570853170Z",
      "seller": "Scotts",
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
      "name": "T-Pocket Square 33x33cm Mens (Dark Red)",
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
      "datePosted": "2023-04-20T12:10:21.502173494Z",
      "seller": "Scotts",
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
      "name": "Slim Delaware Jeans (Navy)",
      "brand": "Boss",
      "size": "34W R"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-slim-delaware-jeans-649128#colcode=64912856",
      "title": "Boss - Slim Delaware Jeans",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/64912856_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.497003385Z",
      "seller": "Scotts",
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
      "name": "Sefadelong Jogging Bottoms (Open Grey 090)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-sefadelong-jogging-bottoms-483886#colcode=48388602",
      "title": "BOSS - Sefadelong Jogging Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48388602_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.494993687Z",
      "seller": "Scotts",
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
      "name": "Sefadelong Jogging Bottoms (Open Grey 090)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-sefadelong-jogging-bottoms-483886#colcode=48388602",
      "title": "BOSS - Sefadelong Jogging Bottoms",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/48388602_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.495004159Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:11.495343682Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.497161003Z",
      "seller": "Scotts",
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
      "name": "RN24 Logo T Shirt (Burgundy 501)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-rn24-logo-t-shirt-595080#colcode=59508061",
      "title": "Boss - RN24 Logo T Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/59508061_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:20:13.578038641Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 9.00,
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
      "datePosted": "2023-04-20T12:10:21.502451154Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:21.502561517Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.496801954Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.496811380Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.496919129Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:05.570760303Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.496492770Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.495493706Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:27.497685336Z",
      "seller": "Scotts",
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
      "name": "Ivaleno Blouse (Miscellaneous)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ivaleno-blouse-543719#colcode=54371906",
      "title": "Boss - Ivaleno Blouse",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/54371906_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.570923181Z",
      "seller": "Scotts",
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
      "name": "Hicon Gym Shorts (Black 001)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:11.496693997Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:11.496614742Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.496162493Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.496174953Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.495693530Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:27.498163185Z",
      "seller": "Scotts",
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
      "name": "Emayla Gold Joggers Ladies (Light Brown 235)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-emayla-gold-joggers-ladies-672421#colcode=67242105",
      "title": "Boss - Boss Emayla Gold Joggers Ladies",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67242105_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.497051533Z",
      "seller": "Scotts",
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
      "name": "Emayla Gold Joggers Ladies (Black 001)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-emayla-gold-joggers-ladies-672421#colcode=67242103",
      "title": "Boss - Boss Emayla Gold Joggers Ladies",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67242103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.497204461Z",
      "seller": "Scotts",
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
      "name": "Emayla Gold Joggers Ladies (Black 001)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-emayla-gold-joggers-ladies-672421#colcode=67242103",
      "title": "Boss - Boss Emayla Gold Joggers Ladies",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67242103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.497306324Z",
      "seller": "Scotts",
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
      "name": "Ejoy Joggers (Open Beige 280)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ejoy-joggers-672563#colcode=67256304",
      "title": "Boss - Ejoy Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67256304_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.495898673Z",
      "seller": "Scotts",
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
      "name": "Ejoy Joggers (Open Beige 280)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-ejoy-joggers-672563#colcode=67256304",
      "title": "Boss - Ejoy Joggers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67256304_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.495921822Z",
      "seller": "Scotts",
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
      "name": "Defelize Shirt Dress Womens (Yellow)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-defelize-shirt-dress-womens-659819#colcode=65981913",
      "title": "Boss - Boss Defelize Shirt Dress Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65981913_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.571051205Z",
      "seller": "Scotts",
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
      "name": "Defelize Shirt Dress Womens (Yellow)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-boss-defelize-shirt-dress-womens-659819#colcode=65981913",
      "title": "Boss - Boss Defelize Shirt Dress Womens",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65981913_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.571063902Z",
      "seller": "Scotts",
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
      "name": "Crosstown Wallet Mens (Light Beige)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:05.571003929Z",
      "seller": "Scotts",
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
      "name": "C_Epalla 10241531 01 (White)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cepalla-10241531-01-659750#colcode=65975001",
      "title": "Boss - C_Epalla 10241531 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65975001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.497626329Z",
      "seller": "Scotts",
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
      "name": "C_Epalla 10241531 01 (White)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cepalla-10241531-01-659750#colcode=65975001",
      "title": "Boss - C_Epalla 10241531 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65975001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.497645552Z",
      "seller": "Scotts",
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
      "name": "C_Epalla 10241531 01 (White)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-cepalla-10241531-01-659750#colcode=65975001",
      "title": "Boss - C_Epalla 10241531 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65975001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:11.497657537Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:10:11.496761453Z",
      "seller": "Scotts",
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
      "name": "C Fabianca Cardigan (Miscellaneous)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-c-fabianca-cardigan-501378#colcode=50137813",
      "title": "BOSS - C Fabianca Cardigan",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/50137813_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.570141972Z",
      "seller": "Scotts",
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
      "name": "C Fabianca Cardigan (Miscellaneous)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-c-fabianca-cardigan-501378#colcode=50137813",
      "title": "BOSS - C Fabianca Cardigan",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/50137813_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:05.570158801Z",
      "seller": "Scotts",
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
      "name": "Bay Pool Sliders (Navy)",
      "brand": "Boss",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-bay-pool-sliders-222233#colcode=22223350",
      "title": "Boss - Bay Pool Sliders",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/22223350_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:19:57.487603593Z",
      "seller": "Scotts",
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
      "name": "AOP Pocket Square Mens (White 100)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:27.498332340Z",
      "seller": "Scotts",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:13:59.601370264Z",
      "seller": "Scotts",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:13:59.601380198Z",
      "seller": "Scotts",
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
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:14:01.651702852Z",
      "seller": "Scotts",
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
      "brand": "Boss",
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
      "datePosted": "2023-04-20T12:10:33.503861354Z",
      "seller": "Scotts",
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
      "name": "5P AS Uni Color CC 10244663 01 (White 100)",
      "brand": "Boss",
      "size": "9-11"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/boss-5p-as-uni-color-cc-10244663-01-411875#colcode=41187501",
      "title": "Boss - 5P AS Uni Color CC 10244663 01",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/41187501_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:37.492914240Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 9.00,
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
      "name": "Thong Leo Ld23 (Leopard)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-thong-leo-ld23-424684#colcode=42468413",
      "title": "Hugo - Hugo Thong Leo Ld23",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42468413_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:14:03.691541926Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 7.00,
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
      "name": "Thong Leo Ld23 (Leopard)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-hugo-thong-leo-ld23-424684#colcode=42468413",
      "title": "Hugo - Hugo Thong Leo Ld23",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42468413_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:14:03.691564110Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 7.00,
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
      "name": "Small Lpgo 2 Pack Crew Socks (Drk Grey 012)",
      "brand": "Hugo",
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
      "datePosted": "2023-04-20T12:14:05.623899109Z",
      "seller": "Scotts",
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
      "name": "Rib High Waisted Briefs (Bright Pink 670)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-rib-high-waisted-briefs-425665#colcode=42566506",
      "title": "Hugo - Rib High Waisted Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42566506_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:14:03.689280374Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 8.00,
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
      "name": "Rib High Waisted Briefs (Bright Pink 670)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-rib-high-waisted-briefs-425665#colcode=42566506",
      "title": "Hugo - Rib High Waisted Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42566506_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:14:03.689305460Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 8.00,
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
      "name": "Rib High Waisted Briefs (Black 001)",
      "brand": "Hugo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-rib-high-waisted-briefs-425665#colcode=42566503",
      "title": "Hugo - Rib High Waisted Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42566503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:14:03.688918993Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 8.00,
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
      "name": "Rib High Waisted Briefs (Black 001)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/hugo-rib-high-waisted-briefs-425665#colcode=42566503",
      "title": "Hugo - Rib High Waisted Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42566503_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:14:03.688942114Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 8.00,
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
      "datePosted": "2023-04-20T12:14:03.684161971Z",
      "seller": "Scotts",
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
      "name": "Visible Silicone Joggers (Black, 16541988)",
      "brand": "Emporio Armani EA7",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/black-emporio-armani-ea7-visible-silicone-joggers/16541988/",
      "title": "Emporio Armani EA7 Visible Silicone Joggers (black / M)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_551989_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:12:27.625406716Z",
      "seller": "Jdsports",
      "properties": {      }
    },
    "price": {
      "buy": 40.00,
      "discount": 56,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "Emporio Armani EA7"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Hadiko Joggers (Grey, 16606838)",
      "brand": "Boss",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/grey-boss-hadiko-joggers/16606838/",
      "title": "BOSS Hadiko Joggers (grey / XS)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_578136_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:51.071151806Z",
      "seller": "Jdsports",
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
      "name": "Hadiko Joggers (Grey, 16606838)",
      "brand": "Boss",
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
      "datePosted": "2023-04-20T11:51:24.225079435Z",
      "seller": "Jdsports",
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
      "name": "Branded-taping recycled-polyester bomber jacket (NERO)",
      "brand": "Emporio Armani",
      "size": "42"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-branded-taping-recycled-polyester-bomber-jacket_R04097175",
      "title": "Branded-taping recycled-polyester bomber jacket (NERO)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R04097175_NERO_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:24.210809213Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Branded-taping recycled-polyester bomber jacket (NERO)",
      "brand": "Emporio Armani",
      "size": "40"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-branded-taping-recycled-polyester-bomber-jacket_R04097175",
      "title": "Branded-taping recycled-polyester bomber jacket (NERO)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R04097175_NERO_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:26.210733373Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Breaker Overhead Jacket (Red, 18546115)",
      "brand": "Hugo",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.jdsports.co.uk/product/red-hugo-breaker-overhead-jacket/18546115/",
      "title": "HUGO Breaker Overhead Jacket (red / XS)",
      "category": "men",
      "shortDescription": null,
      "description": null,
      "image": "https://i8.amplience.net/i/jpl/jd_613416_a?qlt=92",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:15:34.572759639Z",
      "seller": "Jdsports",
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
      "name": "Turtleneck regular-fit wool jumper (NAVY)",
      "brand": "Emporio Armani",
      "size": "44"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990229",
      "title": "Turtleneck regular-fit wool jumper (NAVY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990229_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:38.278627516Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (NAVY)",
      "brand": "Emporio Armani",
      "size": "42"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990229",
      "title": "Turtleneck regular-fit wool jumper (NAVY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990229_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:40.278597906Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (NAVY)",
      "brand": "Emporio Armani",
      "size": "40"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990229",
      "title": "Turtleneck regular-fit wool jumper (NAVY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990229_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:32.761959548Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (GREEN)",
      "brand": "Emporio Armani",
      "size": "44"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990228",
      "title": "Turtleneck regular-fit wool jumper (GREEN)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990228_GREEN_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:44.852321313Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (GREEN)",
      "brand": "Emporio Armani",
      "size": "42"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990228",
      "title": "Turtleneck regular-fit wool jumper (GREEN)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990228_GREEN_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:50.279547268Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (GREEN)",
      "brand": "Emporio Armani",
      "size": "40"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990228",
      "title": "Turtleneck regular-fit wool jumper (GREEN)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990228_GREEN_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:46.279461828Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (GREEN)",
      "brand": "Emporio Armani",
      "size": "38"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990228",
      "title": "Turtleneck regular-fit wool jumper (GREEN)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990228_GREEN_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:48.279444947Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (BURGUNDY)",
      "brand": "Emporio Armani",
      "size": "44"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990227",
      "title": "Turtleneck regular-fit wool jumper (BURGUNDY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990227_BURGUNDY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:08:52.202730568Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (BURGUNDY)",
      "brand": "Emporio Armani",
      "size": "42"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990227",
      "title": "Turtleneck regular-fit wool jumper (BURGUNDY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990227_BURGUNDY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:08:44.683870819Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (BURGUNDY)",
      "brand": "Emporio Armani",
      "size": "40"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990227",
      "title": "Turtleneck regular-fit wool jumper (BURGUNDY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990227_BURGUNDY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:08:46.202648160Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (BURGUNDY)",
      "brand": "Emporio Armani",
      "size": "38"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990227",
      "title": "Turtleneck regular-fit wool jumper (BURGUNDY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990227_BURGUNDY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:08:50.202571849Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (BLACK)",
      "brand": "Emporio Armani",
      "size": "44"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990230",
      "title": "Turtleneck regular-fit wool jumper (BLACK)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990230_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:16:55.033900117Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (BLACK)",
      "brand": "Emporio Armani",
      "size": "42"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990230",
      "title": "Turtleneck regular-fit wool jumper (BLACK)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990230_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:08:40.201923371Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (BLACK)",
      "brand": "Emporio Armani",
      "size": "40"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990230",
      "title": "Turtleneck regular-fit wool jumper (BLACK)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990230_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:16:56.513962145Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Turtleneck regular-fit wool jumper (BLACK)",
      "brand": "Emporio Armani",
      "size": "38"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-turtleneck-regular-fit-wool-jumper_R03990230",
      "title": "Turtleneck regular-fit wool jumper (BLACK)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990230_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:16:58.513193483Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Panelled embossed-branding faux-leather running trainers (BLACK)",
      "brand": "Hugo",
      "size": "EUR 39 / 5 UK MEN"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/hugo-panelled-embossed-branding-faux-leather-running-trainers_R03870815",
      "title": "Panelled embossed-branding faux-leather running trainers (BLACK)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03870815_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:13:02.050417185Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Logo-print relaxed-fit cotton-poplin shirt (BLACK)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/hugo-logo-print-relaxed-fit-cotton-poplin-shirt_R03870800",
      "title": "Logo-print relaxed-fit cotton-poplin shirt (BLACK)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03870800_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:52:15.058128058Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
        "currentPrice": "49.00",
        "wasPrice": "65.00",
        "wasWasPrice": "99.00"
      }
    },
    "price": {
      "buy": 49.00,
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
      "name": "Quilted leather jacket (Black)",
      "brand": "Emporio Armani",
      "size": "44"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-quilted-leather-jacket_R03990242",
      "title": "Quilted leather jacket (Black)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990242_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:08:56.708616840Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Logo-badge reversible down shell jacket (Navy)",
      "brand": "Emporio Armani",
      "size": "46"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket (Navy)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:32.282307234Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Logo-badge reversible down shell jacket (Navy)",
      "brand": "Emporio Armani",
      "size": "44"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket (Navy)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:30.753837137Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Logo-badge reversible down shell jacket (Navy)",
      "brand": "Emporio Armani",
      "size": "42"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-logo-badge-reversible-down-shell-jacket_R03990217",
      "title": "Logo-badge reversible down shell jacket (Navy)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03990217_NAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:36.282301295Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "2-in-1 quilted-lining stretch-woven coat (BLU NAVY)",
      "brand": "Emporio Armani",
      "size": "48"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-2-in-1-quilted-lining-stretch-woven-coat_R03981581",
      "title": "2-in-1 quilted-lining stretch-woven coat (BLU NAVY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03981581_BLUNAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:16.210064577Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "2-in-1 quilted-lining stretch-woven coat (BLU NAVY)",
      "brand": "Emporio Armani",
      "size": "46"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-2-in-1-quilted-lining-stretch-woven-coat_R03981581",
      "title": "2-in-1 quilted-lining stretch-woven coat (BLU NAVY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03981581_BLUNAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:14.210566400Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "2-in-1 quilted-lining stretch-woven coat (BLU NAVY)",
      "brand": "Emporio Armani",
      "size": "44"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-2-in-1-quilted-lining-stretch-woven-coat_R03981581",
      "title": "2-in-1 quilted-lining stretch-woven coat (BLU NAVY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03981581_BLUNAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:06.682962496Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "2-in-1 quilted-lining stretch-woven coat (BLU NAVY)",
      "brand": "Emporio Armani",
      "size": "42"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-2-in-1-quilted-lining-stretch-woven-coat_R03981581",
      "title": "2-in-1 quilted-lining stretch-woven coat (BLU NAVY)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03981581_BLUNAVY_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:18.210090001Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
        "currentPrice": "320.00",
        "wasPrice": "390.00",
        "wasWasPrice": "650.00"
      }
    },
    "price": {
      "buy": 320.00,
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
      "name": "Logo-print slim-fit stretch cotton-blend jogging bottoms (BLACK)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/boss-logo-print-slim-fit-stretch-cotton-blend-jogging-bottoms_R03831781",
      "title": "Logo-print slim-fit stretch cotton-blend jogging bottoms (BLACK)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03831781_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:53:44.696243795Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
        "currentPrice": "59.00",
        "wasPrice": "85.00",
        "wasWasPrice": "119.00"
      }
    },
    "price": {
      "buy": 59.00,
      "discount": 51,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Virgil Abloh. Nike. ICONS (Nike Ablo)",
      "brand": "Taschen",
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
      "datePosted": "2023-04-20T12:12:37.717695772Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.038841465Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.038857410Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.708495014Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.037420029Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.037436254Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.037141177Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.037158029Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-mule-out-of-office-122621#colcode=12262102",
      "title": "OFF WHITE - Mule Out Of Office",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/12262102_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:12:37.041399569Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.706897557Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.043153905Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.038624497Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.039313559Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.039324369Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.042068216Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.042078497Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.717280610Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.717494237Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.037999577Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.038014231Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.037664525Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.037682502Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.036165691Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.036396692Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.036407565Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.717419697Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-wave-boots-110740#colcode=11074003",
      "title": "KENZO - Wave Boots",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11074003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:15:32.831592808Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.831107027Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.831126527Z",
      "seller": "Flannels",
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
      "name": "Turtleneck Jumper (Black 99)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.839804246Z",
      "seller": "Flannels",
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
      "name": "Tiger Zip Hoodie (Dark Khaki 51)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.836670147Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.836692092Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.836034490Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.836047195Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.840969483Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.840776675Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.836423347Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.836451050Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:33.440471304Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:33.440046787Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.832803433Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.832826701Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.831993991Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.832008889Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:33.440613180Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.838635233Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.838655191Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.839182090Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.839196722Z",
      "seller": "Flannels",
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
      "name": "Icon Tiger Jumper (Olive 49)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.833916050Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:33.441432487Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:33.441422389Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:33.441411958Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.831761819Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.832573884Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.832591393Z",
      "seller": "Flannels",
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
      "name": "Colour Block Joggers (Grey, 16541993)",
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
      "datePosted": "2023-04-20T12:12:31.618002938Z",
      "seller": "Jdsports",
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
      "name": "Colour Block Joggers (Grey, 16541993)",
      "brand": "Emporio Armani EA7",
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
      "datePosted": "2023-04-20T12:12:31.618034971Z",
      "seller": "Jdsports",
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
      "name": "Wrap Bikini (Orca 00163)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-wrap-bikini-325926#colcode=32592601",
      "title": "Emporio Armani - Wrap Bikini",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.396961153Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 75.00,
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
      "name": "Wrap Bikini (Orca 00163)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-wrap-bikini-325926#colcode=32592601",
      "title": "Emporio Armani - Wrap Bikini",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.720991368Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 75.00,
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
      "url": "https://www.scottsmenswear.com/emporio-armani-terry-shorts-470643#colcode=47064318",
      "title": "Emporio Armani - Terry Shorts",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/47064318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.400802459Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:11:17.724852807Z",
      "seller": "Tessuti",
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
      "datePosted": "2023-04-20T12:11:15.400812224Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:11:17.724872577Z",
      "seller": "Tessuti",
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
      "name": "Tank Top (Indigo 07634)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-tank-top-633457#colcode=63345718",
      "title": "Emporio Armani - Tank Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63345718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.401663742Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "Tank Top (Indigo 07634)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-tank-top-633457#colcode=63345718",
      "title": "Emporio Armani - Tank Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/63345718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.726612707Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "Tank Top (Indigo 07634)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-tank-top-633457#colcode=63345718",
      "title": "Emporio Armani - Tank Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/63345718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.401675749Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "Tank Top (Indigo 07634)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-tank-top-633457#colcode=63345718",
      "title": "Emporio Armani - Tank Top",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/63345718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.726642972Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "Swimsuit (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-swimsuit-354631#colcode=35463103",
      "title": "Emporio Armani - Swimsuit",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/35463103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.396594342Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 75.00,
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
      "name": "Swimsuit (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-swimsuit-354631#colcode=35463103",
      "title": "Emporio Armani - Swimsuit",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/35463103_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.720798579Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 75.00,
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
      "name": "Single-breasted regular-fit wool-blend blazer (GRIGIO)",
      "brand": "Emporio Armani",
      "size": "46"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/emporio-armani-single-breasted-regular-fit-wool-blend-blazer_R03994284",
      "title": "Single-breasted regular-fit wool-blend blazer (GRIGIO)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03994284_GRIGIO_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:10:02.280309006Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
        "currentPrice": "400.00",
        "wasPrice": "550.00",
        "wasWasPrice": "795.00"
      }
    },
    "price": {
      "buy": 400.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "emporio armani"
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
      "datePosted": "2023-04-20T12:11:15.403318883Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:11:17.729496549Z",
      "seller": "Tessuti",
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
      "datePosted": "2023-04-20T12:11:15.403334904Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:11:17.729514306Z",
      "seller": "Tessuti",
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
      "name": "Sailing Bikini Set (Ocra)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-sailing-bikini-set-325924#colcode=32592412",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592412_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.398350284Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (Ocra)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-sailing-bikini-set-325924#colcode=32592412",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592412_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.722095569Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (Ocra)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-sailing-bikini-set-325924#colcode=32592412",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592412_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.398377227Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (Ocra)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-sailing-bikini-set-325924#colcode=32592412",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592412_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.722123995Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (Ocra)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-sailing-bikini-set-325924#colcode=32592412",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592412_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.398400039Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (Ocra)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-sailing-bikini-set-325924#colcode=32592412",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592412_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.722150797Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (BiancoRosa77910)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-sailing-bikini-set-325924#colcode=32592401",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.397953218Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (BiancoRosa77910)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-sailing-bikini-set-325924#colcode=32592401",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.721741200Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (BiancoRosa77910)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-sailing-bikini-set-325924#colcode=32592401",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.397981490Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (BiancoRosa77910)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-sailing-bikini-set-325924#colcode=32592401",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.721768312Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (BiancoRosa77910)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-sailing-bikini-set-325924#colcode=32592401",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.398000854Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Sailing Bikini Set (BiancoRosa77910)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-sailing-bikini-set-325924#colcode=32592401",
      "title": "Emporio Armani - Sailing Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.721799331Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 65.00,
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
      "name": "Pyjamas (Bianco78810)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-pyjamas-425014#colcode=42501401",
      "title": "Emporio Armani - Pyjamas",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42501401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.397548476Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
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
      "name": "Pyjamas (Bianco78810)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-pyjamas-425014#colcode=42501401",
      "title": "Emporio Armani - Pyjamas",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42501401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.721407454Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
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
      "name": "Pyjamas (Bianco78810)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-pyjamas-425014#colcode=42501401",
      "title": "Emporio Armani - Pyjamas",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42501401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.397572929Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
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
      "name": "Pyjamas (Bianco78810)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-pyjamas-425014#colcode=42501401",
      "title": "Emporio Armani - Pyjamas",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42501401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.721446310Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
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
      "name": "Pyjamas (Bianco78810)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-pyjamas-425014#colcode=42501401",
      "title": "Emporio Armani - Pyjamas",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42501401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.397600229Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
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
      "name": "Pyjamas (Bianco78810)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-pyjamas-425014#colcode=42501401",
      "title": "Emporio Armani - Pyjamas",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42501401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.721469852Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
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
      "size": "9.5"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-logo-flip-flops-222520#colcode=22252008",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/22252008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.409588056Z",
      "seller": "Scotts",
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
      "size": "9.5"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-logo-flip-flops-222520#colcode=22252008",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/22252008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.734253215Z",
      "seller": "Tessuti",
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
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-logo-flip-flops-222520#colcode=22252008",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/22252008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.409575615Z",
      "seller": "Scotts",
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
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-logo-flip-flops-222520#colcode=22252008",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/22252008_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.734231560Z",
      "seller": "Tessuti",
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
      "size": "9.5"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-logo-flip-flops-222520#colcode=22252018",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/22252018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.409860883Z",
      "seller": "Scotts",
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
      "size": "9.5"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-logo-flip-flops-222520#colcode=22252018",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/22252018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.734613097Z",
      "seller": "Tessuti",
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
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-logo-flip-flops-222520#colcode=22252018",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/22252018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.409841061Z",
      "seller": "Scotts",
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
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-logo-flip-flops-222520#colcode=22252018",
      "title": "Emporio Armani - Logo Flip Flops",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/22252018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.734592453Z",
      "seller": "Tessuti",
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
      "name": "LADIES KNITTED LEGGI (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-ladies-knitted-leggi-679348#colcode=67934869",
      "title": "Emporio Armani - LADIES KNITTED LEGGI",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67934869_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.401025410Z",
      "seller": "Scotts",
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
      "name": "LADIES KNITTED LEGGI (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-ladies-knitted-leggi-679348#colcode=67934869",
      "title": "Emporio Armani - LADIES KNITTED LEGGI",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/67934869_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.725364281Z",
      "seller": "Tessuti",
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
      "name": "LADIES KNITTED LEGGI (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-ladies-knitted-leggi-679348#colcode=67934869",
      "title": "Emporio Armani - LADIES KNITTED LEGGI",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67934869_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.401037228Z",
      "seller": "Scotts",
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
      "name": "LADIES KNITTED LEGGI (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-ladies-knitted-leggi-679348#colcode=67934869",
      "title": "Emporio Armani - LADIES KNITTED LEGGI",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/67934869_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.725393620Z",
      "seller": "Tessuti",
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
      "name": "LADIES KNITTED LEGGI (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-ladies-knitted-leggi-679348#colcode=67934869",
      "title": "Emporio Armani - LADIES KNITTED LEGGI",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/67934869_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.401048808Z",
      "seller": "Scotts",
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
      "name": "LADIES KNITTED LEGGI (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-ladies-knitted-leggi-679348#colcode=67934869",
      "title": "Emporio Armani - LADIES KNITTED LEGGI",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/67934869_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.725417171Z",
      "seller": "Tessuti",
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
      "name": "LADIES KNITTED BODY (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-ladies-knitted-body-651747#colcode=65174769",
      "title": "Emporio Armani - LADIES KNITTED BODY",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65174769_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.401358153Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "LADIES KNITTED BODY (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-ladies-knitted-body-651747#colcode=65174769",
      "title": "Emporio Armani - LADIES KNITTED BODY",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/65174769_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.726032673Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "LADIES KNITTED BODY (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-ladies-knitted-body-651747#colcode=65174769",
      "title": "Emporio Armani - LADIES KNITTED BODY",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65174769_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.401369995Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "LADIES KNITTED BODY (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-ladies-knitted-body-651747#colcode=65174769",
      "title": "Emporio Armani - LADIES KNITTED BODY",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/65174769_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.726079620Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "LADIES KNITTED BODY (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-ladies-knitted-body-651747#colcode=65174769",
      "title": "Emporio Armani - LADIES KNITTED BODY",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/65174769_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.401381491Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "LADIES KNITTED BODY (Panna 09210)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-ladies-knitted-body-651747#colcode=65174769",
      "title": "Emporio Armani - LADIES KNITTED BODY",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/65174769_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.726127179Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 30.00,
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
      "name": "Brazillian Briefs (Indigo 07634)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-brazillian-briefs-424680#colcode=42468018",
      "title": "Emporio Armani - Brazillian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42468018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.408660095Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "Brazillian Briefs (Indigo 07634)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-brazillian-briefs-424680#colcode=42468018",
      "title": "Emporio Armani - Brazillian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42468018_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.732708994Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "Brazillian Briefs (Bianco 00010)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-brazillian-briefs-424680#colcode=42468001",
      "title": "Emporio Armani - Brazillian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42468001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.408535263Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "Brazillian Briefs (Bianco 00010)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-brazillian-briefs-424680#colcode=42468001",
      "title": "Emporio Armani - Brazillian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42468001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.732498725Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "Brazillian Briefs (Bianco 00010)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-brazillian-briefs-424680#colcode=42468001",
      "title": "Emporio Armani - Brazillian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42468001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.408547089Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "Brazillian Briefs (Bianco 00010)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-brazillian-briefs-424680#colcode=42468001",
      "title": "Emporio Armani - Brazillian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42468001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.732519885Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "Brazilian Briefs (Bianco 00010)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-brazilian-briefs-424296#colcode=42429601",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42429601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.407514389Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 19.00,
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
      "name": "Brazilian Briefs (Bianco 00010)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-brazilian-briefs-424296#colcode=42429601",
      "title": "Emporio Armani - Brazilian Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42429601_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.731382330Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 19.00,
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
      "name": "Bikini (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-bikini-325927#colcode=32592703",
      "title": "Emporio Armani - Bikini",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.397259529Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
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
      "name": "Bikini (Nero 00020)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-bikini-325927#colcode=32592703",
      "title": "Emporio Armani - Bikini",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592703_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.721186562Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 70.00,
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
      "name": "2 Pack Underwear Set (Indigo 07634)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-2-pack-underwear-set-424767#colcode=42476718",
      "title": "Emporio Armani - 2 Pack Underwear Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42476718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.403701711Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 23.00,
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
      "name": "2 Pack Underwear Set (Indigo 07634)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-2-pack-underwear-set-424767#colcode=42476718",
      "title": "Emporio Armani - 2 Pack Underwear Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42476718_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.730114238Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 23.00,
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
      "name": "2 Pack Logo Briefs (Navy)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-2-pack-logo-briefs-424243#colcode=42424318",
      "title": "EMPORIO ARMANI - 2 Pack Logo Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42424318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.408160141Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "2 Pack Logo Briefs (Navy)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-2-pack-logo-briefs-424243#colcode=42424318",
      "title": "EMPORIO ARMANI - 2 Pack Logo Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42424318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.732149556Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "2 Pack Logo Briefs (Navy)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-2-pack-logo-briefs-424243#colcode=42424318",
      "title": "EMPORIO ARMANI - 2 Pack Logo Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42424318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.408172341Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "2 Pack Logo Briefs (Navy)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-2-pack-logo-briefs-424243#colcode=42424318",
      "title": "EMPORIO ARMANI - 2 Pack Logo Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42424318_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.732171605Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "2 Pack Logo Briefs (Blk)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-2-pack-logo-briefs-424243#colcode=42424303",
      "title": "EMPORIO ARMANI - 2 Pack Logo Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42424303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.407950552Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "2 Pack Logo Briefs (Blk)",
      "brand": "Emporio Armani",
      "size": "XS"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-2-pack-logo-briefs-424243#colcode=42424303",
      "title": "EMPORIO ARMANI - 2 Pack Logo Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42424303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.731951627Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "2 Pack Logo Briefs (Blk)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-2-pack-logo-briefs-424243#colcode=42424303",
      "title": "EMPORIO ARMANI - 2 Pack Logo Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/42424303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.407962463Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "2 Pack Logo Briefs (Blk)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-2-pack-logo-briefs-424243#colcode=42424303",
      "title": "EMPORIO ARMANI - 2 Pack Logo Briefs",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/42424303_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.731973042Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 18.00,
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
      "name": "Logo-embroidered knitted virgin wool scarf (DARK BLUE)",
      "brand": "Boss",
      "size": "SIZE"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/boss-logo-embroidered-knitted-virgin-wool-scarf_R03782413",
      "title": "Logo-embroidered knitted virgin wool scarf (DARK BLUE)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03782413_DARKBLUE_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:55:32.700431929Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
        "currentPrice": "35.00",
        "wasPrice": "69.00"
      }
    },
    "price": {
      "buy": 35.00,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Egean Wave graphic-print cotton fitted sheet (MULTICOLOURED)",
      "brand": "Boss",
      "size": "KING"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/boss-egean-wave-graphic-print-cotton-fitted-sheet_R03906413",
      "title": "Egean Wave graphic-print cotton fitted sheet (MULTICOLOURED)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03906413_MULTICOLOURED_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:52:06.691144602Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
        "currentPrice": "72.50",
        "wasPrice": "145.00"
      }
    },
    "price": {
      "buy": 72.50,
      "discount": 50,
      "quantityAvailable": 1,
      "sell": null,
      "credit": null
    },
    "foundWith": "boss"
  },
  {
    "itemDetails": {
      "kind": "clothing",
      "name": "Relaxed Jogger Bottoms (Aqua)",
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.002764842Z",
      "seller": "Flannels",
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.002782697Z",
      "seller": "Flannels",
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.003812736Z",
      "seller": "Flannels",
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.003960862Z",
      "seller": "Flannels",
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.003983013Z",
      "seller": "Flannels",
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.001964465Z",
      "seller": "Flannels",
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.001983282Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
      "size": "S (46"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-arrow-shirt-557840#colcode=55784001",
      "title": "OFF WHITE - Scribble Arrow Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55784001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:12:37.036851805Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
      "size": "M (48"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/off-white-scribble-arrow-shirt-557840#colcode=55784001",
      "title": "OFF WHITE - Scribble Arrow Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/55784001_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:12:37.036867947Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.042912654Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.714751034Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.038516801Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.708089361Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.041667963Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.038342012Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.039639528Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.707651077Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.878202403Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.878257557Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-tiger-high-top-sneakers-110579#colcode=11057903",
      "title": "KENZO - Tiger High Top Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11057903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:15:32.837895967Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.842677930Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.842704329Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.884907415Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.884916737Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-swing-sneakers-111164#colcode=11116401",
      "title": "KENZO - Swing Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11116401_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:15:32.834170416Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-swing-low-profile-sneakers-111159#colcode=11115903",
      "title": "KENZO - Swing Low Profile Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11115903_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:15:32.834585412Z",
      "seller": "Flannels",
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
      "name": "Straight Jean Sn24 (Noir 99)",
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
      "datePosted": "2023-04-20T12:15:32.838047803Z",
      "seller": "Flannels",
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
      "name": "Straight Jean Sn24 (Noir 99)",
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
      "datePosted": "2023-04-20T12:15:32.838072873Z",
      "seller": "Flannels",
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
      "name": "Sport X Shorts (Black 99)",
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.884511032Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.884521480Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.841545220Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.841563888Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.838325985Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.838344972Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.878546250Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.878557996Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:33.440976691Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.884099232Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-school-low-sneakers-125460#colcode=12546003",
      "title": "Kenzo - School Low Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/12546003_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:15:32.838955643Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
      "size": "9"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-school-high-top-sneakers-110385#colcode=11038501",
      "title": "KENZO - School High Top Sneakers",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/11038501_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:15:32.837694097Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.835674981Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.837090255Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.837108489Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.842404459Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.842428847Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.837442290Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.837466783Z",
      "seller": "Flannels",
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
      "name": "Logo Denim Jacket (Black 99)",
      "brand": "Kenzo",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/kenzo-logo-denim-jacket-992592#colcode=99259203",
      "title": "KENZO - Logo Denim Jacket",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/99259203_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:15:32.832996861Z",
      "seller": "Flannels",
      "properties": {      }
    },
    "price": {
      "buy": 195.00,
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.841966511Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.841987748Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:33.440766101Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.833696467Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.833713136Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.836855407Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.836881243Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.835450278Z",
      "seller": "Flannels",
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
      "brand": "Kenzo",
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
      "datePosted": "2023-04-20T12:15:32.835466387Z",
      "seller": "Flannels",
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
      "name": "Leisure hooded relaxed-fit stretch-cotton jacket (OPEN WHITE)",
      "brand": "Hugo",
      "size": "36"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/hugo-leisure-hooded-relaxed-fit-stretch-cotton-jacket_R03870796",
      "title": "Leisure hooded relaxed-fit stretch-cotton jacket (OPEN WHITE)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03870796_OPENWHITE_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:52:19.529313758Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
        "currentPrice": "179.00",
        "wasPrice": "259.00",
        "wasWasPrice": "349.00"
      }
    },
    "price": {
      "buy": 179.00,
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
      "name": "Leisure checked regular-fit woven coat (OPEN MISCELLANEOUS)",
      "brand": "Hugo",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/hugo-leisure-checked-regular-fit-woven-coat_R03963154",
      "title": "Leisure checked regular-fit woven coat (OPEN MISCELLANEOUS)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03963154_OPENMISCELLANEOUS_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:03:09.536333038Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "datePosted": "2023-04-20T12:11:15.400588056Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:11:17.724457603Z",
      "seller": "Tessuti",
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
      "datePosted": "2023-04-20T12:11:15.400598865Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:11:17.724477633Z",
      "seller": "Tessuti",
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
      "datePosted": "2023-04-20T12:11:15.402151727Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:11:17.727720202Z",
      "seller": "Tessuti",
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
      "datePosted": "2023-04-20T12:11:15.402163462Z",
      "seller": "Scotts",
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
      "datePosted": "2023-04-20T12:11:17.727745774Z",
      "seller": "Tessuti",
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
      "name": "Bandeau Bikini Set (Ocra14763)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-bandeau-bikini-set-325923#colcode=32592312",
      "title": "Emporio Armani - Bandeau Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592312_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.399323856Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
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
      "name": "Bandeau Bikini Set (Ocra14763)",
      "brand": "Emporio Armani",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-bandeau-bikini-set-325923#colcode=32592312",
      "title": "Emporio Armani - Bandeau Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592312_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.722779134Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
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
      "name": "Bandeau Bikini Set (Ocra14763)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-bandeau-bikini-set-325923#colcode=32592312",
      "title": "Emporio Armani - Bandeau Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592312_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.399340260Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
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
      "name": "Bandeau Bikini Set (Ocra14763)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-bandeau-bikini-set-325923#colcode=32592312",
      "title": "Emporio Armani - Bandeau Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592312_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.722808882Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
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
      "name": "Bandeau Bikini Set (Bianco77910)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.scottsmenswear.com/emporio-armani-bandeau-bikini-set-325923#colcode=32592301",
      "title": "Emporio Armani - Bandeau Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.scottsmenswear.com/images/products/32592301_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:15.398902477Z",
      "seller": "Scotts",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
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
      "name": "Bandeau Bikini Set (Bianco77910)",
      "brand": "Emporio Armani",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.tessuti.co.uk/emporio-armani-bandeau-bikini-set-325923#colcode=32592301",
      "title": "Emporio Armani - Bandeau Bikini Set",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://www.tessuti.co.uk/images/products/32592301_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:11:17.722490201Z",
      "seller": "Tessuti",
      "properties": {      }
    },
    "price": {
      "buy": 58.00,
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.004195461Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.708580470Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.716993672Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.716859231Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.707790850Z",
      "seller": "Flannels",
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
      "brand": "OFF White",
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
      "datePosted": "2023-04-20T12:12:37.707871581Z",
      "seller": "Flannels",
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
      "name": "BOSS x NBA Lakers cotton-blend hoody (OPEN GREEN)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/boss-boss-x-nba-lakers-cotton-blend-hoody_R03963041",
      "title": "BOSS x NBA Lakers cotton-blend hoody (OPEN GREEN)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03963041_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:42:04.060312463Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode"
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
      "name": "BOSS x NBA Lakers cotton-blend hoody (OPEN GREEN)",
      "brand": "Boss",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/boss-boss-x-nba-lakers-cotton-blend-hoody_R03963041",
      "title": "BOSS x NBA Lakers cotton-blend hoody (OPEN GREEN)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03963041_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:42:12.060180383Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode"
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
      "name": "BOSS x NBA Lakers cotton-blend hoody (BLACK)",
      "brand": "Boss",
      "size": "S"
    },
    "listingDetails": {
      "url": "https://www.selfridges.com/GB/en/cat/boss-boss-x-nba-lakers-cotton-blend-hoody_R03963041",
      "title": "BOSS x NBA Lakers cotton-blend hoody (BLACK)",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.selfridges.com/is/image/selfridges/R03963041_BLACK_M",
      "condition": "NEW",
      "datePosted": "2023-04-20T11:41:50.060349928Z",
      "seller": "Selfridges",
      "properties": {
        "stockKeys": "SupplierColourName, SizeCode",
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
      "name": "Zip Through Sweatshirt (Black)",
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.004706044Z",
      "seller": "Flannels",
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.004732408Z",
      "seller": "Flannels",
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.502116340Z",
      "seller": "Flannels",
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
      "name": "Tipped Badge Logo Polo Shirt (Rosa Q)",
      "brand": "Stone Island",
      "size": "M"
    },
    "listingDetails": {
      "url": "https://www.flannels.com/stone-island-tipped-badge-logo-polo-shirt-540124#colcode=54012486",
      "title": "STONE ISLAND - Tipped Badge Logo Polo Shirt",
      "category": null,
      "shortDescription": null,
      "description": null,
      "image": "https://images.flannels.com/images/products/54012486_l.jpg",
      "condition": "NEW",
      "datePosted": "2023-04-20T12:09:59.502126825Z",
      "seller": "Flannels",
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
      "brand": "Stone Island",
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
      "datePosted": "2023-04-20T12:09:59.499662446Z",
      "seller": "Flannels",
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
      "datePosted": "2023-04-20T12:09:26.741087834Z",
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
      "quantityAvailable": 101,
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
      "datePosted": "2023-04-20T12:09:28.750945582Z",
      "seller": "Nvidia",
      "properties": {
        "retailer": "https://www.scan.co.uk/"
      }
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
      "datePosted": "2023-04-20T12:09:28.751308641Z",
      "seller": "Nvidia",
      "properties": {
        "retailer": "https://www.scan.co.uk/"
      }
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
