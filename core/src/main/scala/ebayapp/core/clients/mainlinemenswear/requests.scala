package ebayapp.core.clients.mainlinemenswear

private[mainlinemenswear] object requests {

  case object ProductRequest:
    def toJson: String  =
      s"""
         |{
         |    "data": {
         |        "isCom": "N",
         |        "webLocale": "gb",
         |        "fbEventID": 1644065182772120000,
         |        "sendViewContent": true
         |    },
         |    "mainCustomer": {
         |        "version": "1.1.11",
         |        "campaign": "",
         |        "source": "",
         |        "medium": "",
         |        "gclid": "",
         |        "rakutenSiteID": "",
         |        "customerType": "",
         |        "enforcedLogout": "N",
         |        "mode": "0",
         |        "deviceOS": "ios",
         |        "deviceToken": "",
         |        "pushToken": "",
         |        "paymentID": "23",
         |        "shippingID": 3,
         |        "adyenPaymentMethod": "",
         |        "geoCountryCode": "GB",
         |        "realGeoCountryCode": "GB",
         |        "isCom": "N",
         |        "webLocale": "gb",
         |        "amazon_order_reference_id": "",
         |        "selectedCountryCode": "",
         |        "currencyID": 1,
         |        "selectedCur": 0,
         |        "exchangerate": "1.000000",
         |        "cur_pretext": "£",
         |        "cur_checkout": "Y",
         |        "loggedin": "N",
         |        "languageID": "1",
         |        "siteID": "1",
         |        "page_id": "1",
         |        "logPaymentError": 0,
         |        "giftCertPurchase": "N",
         |        "shopAvailable": "Y",
         |        "jssCart": "eab3bbf1c5bcff16130bfd098c402311",
         |        "jssHash": "d75277cdffef995a46ae59bdaef1db86",
         |        "default_country": 222,
         |        "jssCustomer": 0,
         |        "default_address": 0,
         |        "email": "",
         |        "platform": "mmw_web",
         |        "cur_code": "GBP",
         |        "cart_content": {
         |            "db_free_delivery": "N",
         |            "is_free_delivery": "N",
         |            "shipping_discount": 0,
         |            "shipping_discount_code": "",
         |            "bask_abandon_url": "",
         |            "hasFullPriceItem": "N",
         |            "cart_uid": "eab3bbf1c5bcff16130bfd098c402311",
         |            "total": "0.00",
         |            "base_total": "0.00",
         |            "content": [],
         |            "abandonID": 0,
         |            "droppedContent": 0,
         |            "msg": [
         |                {
         |                    "msg-text": "Free 72 Hour UK Delivery on all orders over £35.00."
         |                },
         |                {
         |                    "msg-text": "Spend an additional £35.00 to qualify."
         |                }
         |            ]
         |        },
         |        "orderID": 0,
         |        "surname": "",
         |        "forename": "",
         |        "order_details": [],
         |        "loginDetails": {
         |            "jssCustomer": 0,
         |            "loggedin": "N",
         |            "default_address": 0,
         |            "default_country": 222,
         |            "email": "",
         |            "surname": "",
         |            "forename": "",
         |            "jssCart": "eab3bbf1c5bcff16130bfd098c402311",
         |            "jssHash": "d75277cdffef995a46ae59bdaef1db86"
         |        },
         |        "devicePlatforms": [
         |            "web",
         |            "other",
         |            "pc",
         |            "",
         |            "www.mainlinemenswear.co.uk"
         |        ],
         |        "httpReferer": "https://www.mainlinemenswear.co.uk/",
         |        "countryGroup": "uk",
         |        "privacyUpdate": "25/05/2018",
         |        "consentRef": "1.0",
         |        "permitRef": "1.0",
         |        "savedItemCount": 0,
         |        "clearPayPromo": "N",
         |        "url": "/search/s:/emporio armani/?s=emporio armani&page=2",
         |        "mmwSessionID": "SpAUOLZAXMTXrMXjPhvrMcUyWGcgwjhbshYn",
         |        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.58",
         |        "fbEventID": 1644063588012126200
         |    },
         |    "error": {}
         |}
         |""".stripMargin
  
  final case class SearchRequest(page: Int, query: String):
    def toJson: String =
      s"""
         |{
         |    "data": {
         |        "request_platform": "mmw_webCount",
         |        "price": "",
         |        "size": "",
         |        "legsize": "",
         |        "colour": "",
         |        "category": "",
         |        "brand": "",
         |        "isort": "",
         |        "page": $page,
         |        "isCom": "N",
         |        "webLocale": "gb",
         |        "fbEventID": 1644063588012126200
         |    },
         |    "mainCustomer": {
         |        "version": "1.1.11",
         |        "campaign": "",
         |        "source": "",
         |        "medium": "",
         |        "gclid": "",
         |        "rakutenSiteID": "",
         |        "customerType": "",
         |        "enforcedLogout": "N",
         |        "mode": "0",
         |        "deviceOS": "ios",
         |        "deviceToken": "",
         |        "pushToken": "",
         |        "paymentID": "23",
         |        "shippingID": 3,
         |        "adyenPaymentMethod": "",
         |        "geoCountryCode": "GB",
         |        "realGeoCountryCode": "GB",
         |        "isCom": "N",
         |        "webLocale": "gb",
         |        "amazon_order_reference_id": "",
         |        "selectedCountryCode": "",
         |        "currencyID": 1,
         |        "selectedCur": 0,
         |        "exchangerate": "1.000000",
         |        "cur_pretext": "£",
         |        "cur_checkout": "Y",
         |        "loggedin": "N",
         |        "languageID": "1",
         |        "siteID": "1",
         |        "page_id": "1",
         |        "logPaymentError": 0,
         |        "giftCertPurchase": "N",
         |        "shopAvailable": "Y",
         |        "jssCart": "eab3bbf1c5bcff16130bfd098c402311",
         |        "jssHash": "d75277cdffef995a46ae59bdaef1db86",
         |        "default_country": 222,
         |        "jssCustomer": 0,
         |        "default_address": 0,
         |        "email": "",
         |        "platform": "mmw_web",
         |        "cur_code": "GBP",
         |        "cart_content": {
         |            "db_free_delivery": "N",
         |            "is_free_delivery": "N",
         |            "shipping_discount": 0,
         |            "shipping_discount_code": "",
         |            "bask_abandon_url": "",
         |            "hasFullPriceItem": "N",
         |            "cart_uid": "eab3bbf1c5bcff16130bfd098c402311",
         |            "total": "0.00",
         |            "base_total": "0.00",
         |            "content": [],
         |            "abandonID": 0,
         |            "droppedContent": 0,
         |            "msg": [
         |                {
         |                    "msg-text": "Free 72 Hour UK Delivery on all orders over £35.00."
         |                },
         |                {
         |                    "msg-text": "Spend an additional £35.00 to qualify."
         |                }
         |            ]
         |        },
         |        "orderID": 0,
         |        "surname": "",
         |        "forename": "",
         |        "order_details": [],
         |        "loginDetails": {
         |            "jssCustomer": 0,
         |            "loggedin": "N",
         |            "default_address": 0,
         |            "default_country": 222,
         |            "email": "",
         |            "surname": "",
         |            "forename": "",
         |            "jssCart": "eab3bbf1c5bcff16130bfd098c402311",
         |            "jssHash": "d75277cdffef995a46ae59bdaef1db86"
         |        },
         |        "devicePlatforms": [
         |            "web",
         |            "other",
         |            "pc",
         |            "",
         |            "www.mainlinemenswear.co.uk"
         |        ],
         |        "httpReferer": "https://www.mainlinemenswear.co.uk/",
         |        "countryGroup": "uk",
         |        "privacyUpdate": "25/05/2018",
         |        "consentRef": "1.0",
         |        "permitRef": "1.0",
         |        "savedItemCount": 0,
         |        "clearPayPromo": "N",
         |        "url": "/search/s:/emporio armani/?s=$query&page=2",
         |        "mmwSessionID": "SpAUOLZAXMTXrMXjPhvrMcUyWGcgwjhbshYn",
         |        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.58",
         |        "fbEventID": 16440635832524504
         |    },
         |    "error": {}
         |}
         |""".stripMargin
}
