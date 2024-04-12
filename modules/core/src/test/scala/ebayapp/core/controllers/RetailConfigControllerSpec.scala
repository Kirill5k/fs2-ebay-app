package ebayapp.core.controllers

import cats.effect.{IO, Ref}
import ebayapp.core.common.config.RetailConfig
import ebayapp.core.services.RetailConfigService
import kirill5k.common.http4s.test.HttpRoutesWordSpec
import org.http4s.implicits.*
import org.http4s.*

class RetailConfigControllerSpec extends HttpRoutesWordSpec {

  val testConfigJson =
    """{
      |  "telegram" : {
      |    "baseUri" : "https://api.telegram.org",
      |    "botKey" : "BOT-KEY",
      |    "mainChannelId" : "MAIN",
      |    "secondaryChannelId" : "SECONDARY",
      |    "alertsChannelId" : "ALERTS"
      |  },
      |  "retailer" : {
      |    "ebay" : {
      |      "baseUri" : "https://api.ebay.com",
      |      "credentials" : [
      |        {
      |          "clientId" : "id1",
      |          "clientSecret" : "secret1"
      |        },
      |        {
      |          "clientId" : "id2",
      |          "clientSecret" : "secret2"
      |        }
      |      ],
      |      "search" : {
      |        "minFeedbackScore" : 5,
      |        "minFeedbackPercentage" : 92,
      |        "maxListingDuration" : "20 minutes"
      |      }
      |    },
      |    "selfridges" : {
      |      "baseUri" : "https://proxy-kirill5k.cloud.okteto.net",
      |      "headers" : {
      |        "X-Reroute-To" : "https://www.selfridges.com",
      |        "X-Reload-On-403" : "true",
      |        "api-key" : "key"
      |      },
      |      "proxied" : null,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : "2 seconds",
      |      "queryParameters" : null
      |    },
      |    "argos" : {
      |      "baseUri" : "https://www.argos.co.uk",
      |      "headers" : {
      |
      |      },
      |      "proxied" : true,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : null,
      |      "queryParameters" : null
      |    },
      |    "jdsports" : {
      |      "baseUri" : "https://fs2-proxy.herokuapp.com",
      |      "headers" : {
      |        "X-Reload-On-403" : "true",
      |        "X-Reroute-To" : "https://www.jdsports.co.uk"
      |      },
      |      "proxied" : null,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : "2 seconds",
      |      "queryParameters" : null
      |    },
      |    "tessuti" : {
      |      "baseUri" : "https://fs2-proxy.herokuapp.com",
      |      "headers" : {
      |        "X-Reload-On-403" : "true",
      |        "X-Reroute-To" : "https://www.tessuti.co.uk"
      |      },
      |      "proxied" : null,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : "2 seconds",
      |      "queryParameters" : null
      |    },
      |    "scotts" : {
      |      "baseUri" : "https://fs2-proxy.herokuapp.com",
      |      "headers" : {
      |        "X-Reload-On-403" : "true",
      |        "X-Reroute-To" : "https://www.scottsmenswear.com"
      |      },
      |      "proxied" : null,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : "2 seconds",
      |      "queryParameters" : null
      |    },
      |    "harveyNichols" : {
      |      "baseUri" : "https://proxy-kirill5k.cloud.okteto.net",
      |      "headers" : {
      |        "x-requested-with" : "XMLHttpRequest",
      |        "X-Reload-On-403" : "true",
      |        "Connection" : "keep-alive",
      |        "Accept" : "application/json, text/javascript, */*; q=0.01",
      |        "Cache-Control" : "no-cache",
      |        "X-Reroute-To" : "https://www.harveynichols.com",
      |        "Accept-Language" : "en-GB,en-US;q=0.9,en;q=0.8",
      |        "Accept-Encoding" : "gzip, deflate, br",
      |        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36 OPR/82.0.4227.33"
      |      },
      |      "proxied" : null,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : "15 seconds",
      |      "queryParameters" : null
      |    },
      |    "mainlineMenswear" : {
      |      "baseUri" : "https://fs2-proxy.herokuapp.com",
      |      "headers" : {
      |        "X-Reroute-To" : "https://livewebapi.mainlinemenswear.co.uk"
      |      },
      |      "proxied" : null,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : null,
      |      "queryParameters" : null
      |    },
      |    "nvidia" : {
      |      "baseUri" : "https://proxy-kirill5k.cloud.okteto.net",
      |      "headers" : {
      |        "User-Agent" : "PostmanRuntime/7.29.2",
      |        "X-Reroute-To" : "https://api.nvidia.partners"
      |      },
      |      "proxied" : null,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : null,
      |      "queryParameters" : null
      |    },
      |    "scan" : {
      |      "baseUri" : "https://www.scan.co.uk",
      |      "headers" : {
      |        "X-Forwarded-For" : "92.7.76.29"
      |      },
      |      "proxied" : true,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : null,
      |      "queryParameters" : null
      |    },
      |    "cex" : {
      |      "baseUri" : "https://wss2.cex.uk.webuy.io",
      |      "headers" : {
      |        "X-Reroute-To" : "https://lnnfeewzva-dsn.algolia.net"
      |      },
      |      "proxied" : null,
      |      "cache" : {
      |        "expiration" : "24 hours",
      |        "validationPeriod" : "1 hour"
      |      },
      |      "delayBetweenIndividualRequests" : null,
      |      "queryParameters" : {
      |        "x-algolia-agent" : "Algolia for JavaScript (4.13.1); Browser (lite); instantsearch.js (4.41.1); Vue (2.6.14); Vue InstantSearch (4.3.3); JS Helper (3.8.2)"
      |      }
      |    },
      |    "flannels" : {
      |      "baseUri" : "https://reqfol.fly.dev",
      |      "headers" : {
      |        "X-Reroute-To" : "https://www.flannels.com"
      |      },
      |      "proxied" : null,
      |      "cache" : null,
      |      "delayBetweenIndividualRequests" : null,
      |      "queryParameters" : null
      |    }
      |  },
      |  "stockMonitor" : {
      |    "cex" : {
      |      "monitoringFrequency" : "10 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "iphone 14 pro max unlocked",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : null
      |    },
      |    "nvidia" : {
      |      "monitoringFrequency" : "10 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "geforce",
      |            "category" : "GPU",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : true,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        }
      |      ],
      |      "delayBetweenRequests" : null,
      |      "filters" : {
      |        "minDiscount" : null,
      |        "maxPrice" : null,
      |        "allow" : null,
      |        "deny" : [
      |          "GTX 1650",
      |          "GTX 1660"
      |        ]
      |      }
      |    },
      |    "jdsports" : {
      |      "monitoringFrequency" : "6 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "Emporio Armani EA7",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Calvin Klein",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 59,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Boss",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss-loungewear",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Hugo",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "tommy-hilfiger",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 59,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 49,
      |        "maxPrice" : null,
      |        "allow" : null,
      |        "deny" : [
      |          "size xxl",
      |          "size xl",
      |          "size l"
      |        ]
      |      }
      |    },
      |    "tessuti" : {
      |      "monitoringFrequency" : "6 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "Emporio Armani",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 49,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Hugo",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 53,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Boss",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 53,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "calvin-klein-jeans",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 53,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Tommy Hilfiger",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 53,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Moschino",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 49,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Stone Island",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 39,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Kenzo",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 49,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Moncler",
      |            "category" : "men",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 29,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 29,
      |        "maxPrice" : 80,
      |        "allow" : null,
      |        "deny" : [
      |          "size xxl",
      |          "size xl",
      |          "size l"
      |        ]
      |      }
      |    },
      |    "mainline-menswear" : {
      |      "monitoringFrequency" : "12 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "moschino",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "ea7 emporio armani",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss bodywear",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss athleisure",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss casual",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "emporio armani",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 54,
      |        "maxPrice" : null,
      |        "allow" : null,
      |        "deny" : [
      |          "size xxl",
      |          "size xl",
      |          "size l"
      |        ]
      |      }
      |    },
      |    "scan" : {
      |      "monitoringFrequency" : "15 minutes",
      |      "monitoringRequests" : [
      |      ],
      |      "delayBetweenRequests" : null,
      |      "filters" : null
      |    },
      |    "argos" : {
      |      "monitoringFrequency" : "10 minutes",
      |      "monitoringRequests" : [
      |      ],
      |      "delayBetweenRequests" : null,
      |      "filters" : null
      |    },
      |    "ebay" : {
      |      "monitoringFrequency" : "10 minutes",
      |      "monitoringRequests" : [
      |      ],
      |      "delayBetweenRequests" : null,
      |      "filters" : null
      |    },
      |    "scotts" : {
      |      "monitoringFrequency" : "6 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "Emporio Armani EA7",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Boss",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 53,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Hugo",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 53,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "emporio-armani-loungewear",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 53,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 49,
      |        "maxPrice" : 250,
      |        "allow" : null,
      |        "deny" : [
      |          "size xxl",
      |          "size xl",
      |          "size l"
      |        ]
      |      }
      |    },
      |    "harvey-nichols" : {
      |      "monitoringFrequency" : "12 minutes",
      |      "monitoringRequests" : [
      |      ],
      |      "delayBetweenRequests" : "2 minutes",
      |      "filters" : null
      |    },
      |    "flannels" : {
      |      "monitoringFrequency" : "12 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "balenciaga",
      |            "category" : "mens",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : null,
      |              "maxPrice" : null,
      |              "allow" : [
      |                "triple s",
      |                "bag"
      |              ],
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "stone-island",
      |            "category" : "mens",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 28,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : [
      |                "shadow",
      |                "knit",
      |                "marina"
      |              ]
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "dolce-and-gabbana",
      |            "category" : "mens",
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : null,
      |              "maxPrice" : null,
      |              "allow" : [
      |                "slide",
      |                "slider",
      |                "sneaker",
      |                "airmaster"
      |              ],
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : true
      |        }
      |      ],
      |      "delayBetweenRequests" : "3 minutes",
      |      "filters" : {
      |        "minDiscount" : 25,
      |        "maxPrice" : 700,
      |        "allow" : [
      |          "combat",
      |          "hoodie",
      |          "sweatshirt",
      |          "trousers",
      |          "jogger",
      |          "jeans",
      |          "t(-)?shirt",
      |          "tee",
      |          "trainer",
      |          "runner",
      |          "slide",
      |          "sneaker",
      |          "shorts"
      |        ],
      |        "deny" : [
      |          "size (\\dX(S|L)|(X)?L|\\b[1-8]\\b|\\b1\\d\\b|3[2-9]R)",
      |          "\\bmask\\b",
      |          "socks|formal pants|leopard|GRAFFITI|TAILORED|LUMINARIE|paint"
      |        ]
      |      }
      |    },
      |    "selfridges" : {
      |      "monitoringFrequency" : "6 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "stone-island",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 39,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "emporio armani",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 44,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "kenzo",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 49,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "moncler",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 10,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "tommy hilfiger",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 59,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "polo ralph lauren",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 59,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "hugo",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 48,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss",
      |            "category" : null,
      |            "itemKind" : null,
      |            "minDiscount" : null,
      |            "filters" : {
      |              "minDiscount" : 48,
      |              "maxPrice" : null,
      |              "allow" : null,
      |              "deny" : null
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true,
      |          "disableNotifications" : null
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 18,
      |        "maxPrice" : null,
      |        "allow" : null,
      |        "deny" : [
      |          "size xxl",
      |          "size xl",
      |          "size l"
      |        ]
      |      }
      |    }
      |  },
      |  "dealsFinder" : {
      |    "ebay" : {
      |      "searchFrequency" : "60 seconds",
      |      "searchRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "PS4",
      |            "category" : "games-ps4-ps5",
      |            "itemKind" : "video-game",
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "minMargin" : 45,
      |          "maxQuantity" : 10
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "XBOX ONE",
      |            "category" : "games-xbox-one-series-x",
      |            "itemKind" : "video-game",
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "minMargin" : 45,
      |          "maxQuantity" : 10
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "PS5",
      |            "category" : "games-ps4-ps5",
      |            "itemKind" : "video-game",
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "minMargin" : 45,
      |          "maxQuantity" : 10
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "XBOX SERIES",
      |            "category" : "games-xbox-one-series-x",
      |            "itemKind" : "video-game",
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "minMargin" : 45,
      |          "maxQuantity" : 10
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "SWITCH",
      |            "category" : "games-switch",
      |            "itemKind" : "video-game",
      |            "minDiscount" : null,
      |            "filters" : null
      |          },
      |          "minMargin" : 45,
      |          "maxQuantity" : 10
      |        }
      |      ],
      |      "delayBetweenRequests" : "5 seconds"
      |    }
      |  }
      |}""".stripMargin

  "A RetailConfigController" when {
    "GET /retail-config" should {
      "return current retail config" in {
        val response = for
          rc         <- RetailConfig.loadDefault[IO]
          service    <- serviceMock(rc)
          controller <- RetailConfigController.make(service)
          req = Request[IO](uri = uri"/retail-config", method = Method.GET)
          res <- controller.routes.orNotFound.run(req)
        yield res

        response mustHaveStatus (Status.Ok, Some(testConfigJson))
      }
    }

    "POST /retail-config" should {
      "save retail config" in {
        val response = for
          rc         <- RetailConfig.loadDefault[IO]
          service    <- serviceMock(rc)
          controller <- RetailConfigController.make(service)
          req = Request[IO](uri = uri"/retail-config", method = Method.POST).withBody(testConfigJson)
          res           <- controller.routes.orNotFound.run(req)
          updatedConfig <- service.get
          _ = updatedConfig mustBe rc
        yield res

        response mustHaveStatus (Status.NoContent, None)
      }
    }
  }

  private def serviceMock(rc: RetailConfig): IO[RetailConfigService[IO]] =
    Ref
      .of[IO, RetailConfig](rc)
      .map { ref =>
        new RetailConfigService[IO]:
          override def save(rc: RetailConfig): IO[Unit] = ref.set(rc)
          override def get: IO[RetailConfig]            = ref.get
      }
}
