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
      |      "delayBetweenIndividualRequests" : "2 seconds"
      |    },
      |    "argos" : {
      |      "baseUri" : "https://www.argos.co.uk",
      |      "headers" : {
      |
      |      },
      |      "proxied" : true
      |    },
      |    "jdsports" : {
      |      "baseUri" : "https://fs2-proxy.herokuapp.com",
      |      "headers" : {
      |        "X-Reload-On-403" : "true",
      |        "X-Reroute-To" : "https://www.jdsports.co.uk"
      |      },
      |      "delayBetweenIndividualRequests" : "2 seconds"
      |    },
      |    "tessuti" : {
      |      "baseUri" : "https://fs2-proxy.herokuapp.com",
      |      "headers" : {
      |        "X-Reload-On-403" : "true",
      |        "X-Reroute-To" : "https://www.tessuti.co.uk"
      |      },
      |      "delayBetweenIndividualRequests" : "2 seconds"
      |    },
      |    "scotts" : {
      |      "baseUri" : "https://fs2-proxy.herokuapp.com",
      |      "headers" : {
      |        "X-Reload-On-403" : "true",
      |        "X-Reroute-To" : "https://www.scottsmenswear.com"
      |      },
      |      "delayBetweenIndividualRequests" : "2 seconds"
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
      |      "delayBetweenIndividualRequests" : "15 seconds"
      |    },
      |    "mainlineMenswear" : {
      |      "baseUri" : "https://fs2-proxy.herokuapp.com",
      |      "headers" : {
      |        "X-Reroute-To" : "https://livewebapi.mainlinemenswear.co.uk"
      |      }
      |    },
      |    "nvidia" : {
      |      "baseUri" : "https://proxy-kirill5k.cloud.okteto.net",
      |      "headers" : {
      |        "User-Agent" : "PostmanRuntime/7.29.2",
      |        "X-Reroute-To" : "https://api.nvidia.partners"
      |      }
      |    },
      |    "scan" : {
      |      "baseUri" : "https://www.scan.co.uk",
      |      "headers" : {
      |        "X-Forwarded-For" : "92.7.76.29"
      |      },
      |      "proxied" : true
      |    },
      |    "cex" : {
      |      "baseUri" : "https://wss2.cex.uk.webuy.io",
      |      "headers" : {
      |        "X-Reroute-To" : "https://lnnfeewzva-dsn.algolia.net"
      |      },
      |      "cache" : {
      |        "expiration" : "24 hours",
      |        "validationPeriod" : "1 hour"
      |      },
      |      "queryParameters" : {
      |        "x-algolia-agent" : "Algolia for JavaScript (4.13.1); Browser (lite); instantsearch.js (4.41.1); Vue (2.6.14); Vue InstantSearch (4.3.3); JS Helper (3.8.2)"
      |      }
      |    },
      |    "flannels" : {
      |      "baseUri" : "https://reqfol.fly.dev",
      |      "headers" : {
      |        "X-Reroute-To" : "https://www.flannels.com"
      |      }
      |    }
      |  },
      |  "stockMonitor" : {
      |    "cex" : {
      |      "monitoringFrequency" : "10 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "iphone 14 pro max unlocked"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds"
      |    },
      |    "scotts" : {
      |      "monitoringFrequency" : "6 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "Emporio Armani EA7"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Boss",
      |            "filters" : {
      |              "minDiscount" : 53
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Hugo",
      |            "filters" : {
      |              "minDiscount" : 53
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "emporio-armani-loungewear",
      |            "filters" : {
      |              "minDiscount" : 53
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 49,
      |        "maxPrice" : 250,
      |        "deny" : [
      |          "size xxl",
      |          "size xl",
      |          "size l"
      |        ]
      |      }
      |    },
      |    "ebay" : {
      |      "monitoringFrequency" : "10 minutes",
      |      "monitoringRequests" : [
      |      ]
      |    },
      |    "jdsports" : {
      |      "monitoringFrequency" : "6 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "Emporio Armani EA7",
      |            "category" : "men"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Calvin Klein",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 59
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Boss",
      |            "category" : "men"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss-loungewear",
      |            "category" : "men"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Hugo",
      |            "category" : "men"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "tommy-hilfiger",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 59
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 49,
      |        "deny" : [
      |          "size xxl",
      |          "size xl",
      |          "size l"
      |        ]
      |      }
      |    },
      |    "nvidia" : {
      |      "monitoringFrequency" : "10 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "geforce",
      |            "category" : "GPU"
      |          },
      |          "monitorStockChange" : true,
      |          "monitorPriceChange" : true
      |        }
      |      ],
      |      "filters" : {
      |        "deny" : [
      |          "GTX 1650",
      |          "GTX 1660"
      |        ]
      |      }
      |    },
      |    "mainline-menswear" : {
      |      "monitoringFrequency" : "12 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "moschino"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "ea7 emporio armani"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss bodywear"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss athleisure"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss casual"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "emporio armani"
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 54,
      |        "deny" : [
      |          "size xxl",
      |          "size xl",
      |          "size l"
      |        ]
      |      }
      |    },
      |    "argos" : {
      |      "monitoringFrequency" : "10 minutes",
      |      "monitoringRequests" : [
      |      ]
      |    },
      |    "selfridges" : {
      |      "monitoringFrequency" : "6 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "stone-island",
      |            "filters" : {
      |              "minDiscount" : 39
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "emporio armani",
      |            "filters" : {
      |              "minDiscount" : 44
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "kenzo",
      |            "filters" : {
      |              "minDiscount" : 49
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "moncler",
      |            "filters" : {
      |              "minDiscount" : 10
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "tommy hilfiger",
      |            "filters" : {
      |              "minDiscount" : 59
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "polo ralph lauren",
      |            "filters" : {
      |              "minDiscount" : 59
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "hugo",
      |            "filters" : {
      |              "minDiscount" : 48
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "boss",
      |            "filters" : {
      |              "minDiscount" : 48
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 18,
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
      |            "filters" : {
      |              "minDiscount" : 49
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Hugo",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 53
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Boss",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 53
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "calvin-klein-jeans",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 53
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Tommy Hilfiger",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 53
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Moschino",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 49
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Stone Island",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 39
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Kenzo",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 49
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "Moncler",
      |            "category" : "men",
      |            "filters" : {
      |              "minDiscount" : 29
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        }
      |      ],
      |      "delayBetweenRequests" : "30 seconds",
      |      "filters" : {
      |        "minDiscount" : 29,
      |        "maxPrice" : 80,
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
      |      "delayBetweenRequests" : "2 minutes"
      |    },
      |    "scan" : {
      |      "monitoringFrequency" : "15 minutes",
      |      "monitoringRequests" : [
      |      ]
      |    },
      |    "flannels" : {
      |      "monitoringFrequency" : "12 minutes",
      |      "monitoringRequests" : [
      |        {
      |          "searchCriteria" : {
      |            "query" : "balenciaga",
      |            "category" : "mens",
      |            "filters" : {
      |              "allow" : [
      |                "triple s",
      |                "bag"
      |              ]
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
      |            "filters" : {
      |              "minDiscount" : 28,
      |              "deny" : [
      |                "shadow",
      |                "knit",
      |                "marina"
      |              ]
      |            }
      |          },
      |          "monitorStockChange" : false,
      |          "monitorPriceChange" : true
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "dolce-and-gabbana",
      |            "category" : "mens",
      |            "filters" : {
      |              "allow" : [
      |                "slide",
      |                "slider",
      |                "sneaker",
      |                "airmaster"
      |              ]
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
      |            "itemKind" : "video-game"
      |          },
      |          "minMargin" : 45,
      |          "maxQuantity" : 10
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "XBOX ONE",
      |            "category" : "games-xbox-one-series-x",
      |            "itemKind" : "video-game"
      |          },
      |          "minMargin" : 45,
      |          "maxQuantity" : 10
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "PS5",
      |            "category" : "games-ps4-ps5",
      |            "itemKind" : "video-game"
      |          },
      |          "minMargin" : 45,
      |          "maxQuantity" : 10
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "XBOX SERIES",
      |            "category" : "games-xbox-one-series-x",
      |            "itemKind" : "video-game"
      |          },
      |          "minMargin" : 45,
      |          "maxQuantity" : 10
      |        },
      |        {
      |          "searchCriteria" : {
      |            "query" : "SWITCH",
      |            "category" : "games-switch",
      |            "itemKind" : "video-game"
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
