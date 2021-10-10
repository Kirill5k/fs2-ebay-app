package ebayapp.core.clients.ebay

import ebayapp.core.clients.SearchCriteria
import ebayapp.core.clients.ebay.browse.responses.EbayItemSummary
import ebayapp.core.common.errors.AppError

import java.time.Instant

private[ebay] object search {
  trait EbaySearchParams {
    protected def categoryId: Int
    protected def searchFilterTemplate: String

    def filter: EbayItemSummary => Boolean

    def requestArgs(from: Instant, query: String): Map[String, String] =
      Map(
        "fieldgroups"  -> "EXTENDED",
        "category_ids" -> categoryId.toString,
        "filter"       -> searchFilterTemplate.format(from).replaceAll("\\{", "%7B").replaceAll("}", "%7D"),
        "limit"        -> "200",
        "q"            -> query
      )
  }

  object EbaySearchParams {
    def get(criteria: SearchCriteria): Either[Throwable, EbaySearchParams] =
      criteria.category
        .toRight(AppError.Critical("category kind is required in ebay-client"))
        .flatMap(EbaySearchParams.get)

    def get(category: String): Either[Throwable, EbaySearchParams] =
      category match {
        case "smart-lighting"            => Right(smartLightingSearchParams)
        case c if c.startsWith("games-") => Right(videoGameSearchParams)
        case c                           => Left(AppError.Critical(s"unable to find search params for category '$c' in EbayClient"))
      }

    private val smartLightingSearchParams = new EbaySearchParams {
      private val DEFAULT_SEARCH_FILTER = "conditionIds:{1000|1500|2000|2500|3000|4000|5000}," +
        "itemLocationCountry:GB," +
        "deliveryCountry:GB," +
        "price:[0..200]," +
        "priceCurrency:GBP," +
        "itemLocationCountry:GB,"

      override val searchFilterTemplate: String = DEFAULT_SEARCH_FILTER + "buyingOptions:{FIXED_PRICE},itemStartDate:[%s]"

      override val categoryId: Int = 11700

      private val ACCEPTER_BUYING_OPTIONS = Set("FIXED_PRICE", "BEST_OFFER")

      override def filter: EbayItemSummary => Boolean = { item =>
        item.buyingOptions.intersect(ACCEPTER_BUYING_OPTIONS).nonEmpty
      }
    }

    private val videoGameSearchParams = new EbaySearchParams {
      private val DEFAULT_SEARCH_FILTER = "conditionIds:{1000|1500|2000|2500|3000|4000|5000}," +
        "itemLocationCountry:GB," +
        "deliveryCountry:GB," +
        "price:[0..90]," +
        "priceCurrency:GBP," +
        "itemLocationCountry:GB,"

      private val LISTING_NAME_TRIGGER_WORDS = List(
        "bundle", "job( |-)?lot",
        "(\\d+|rune|perk|skill|(e)?xp(erience)?) (stats|points)", "postcards", "stickers",
        "(demo|game)( )?(code|disc|key|cart|pass)", "(store|reservation|access|cd|unlock|unused|digital|upgrade|test|psn|beta|no)( )?(redeem )?(\\bDL\\b|avatar|game|code|key)",
        "(software|cartridge(s)?|cart(s)?|game|disk(s)?|disc(s)?( \\d)?|cover|box|inlay|sleeve|book|cd|collection|manual|card|promo) only",
        "(case|variety|accessor(ies|y)|storage|charge|robot) (system|set|kit|box)", "no dis(c|k)", "Season( \\d)? Pass",
        "(canvas|replacement|cover|carry|travel(er)?|commuter|carrying|just( the)?|no|hard|storage|game|vault|phone|card|foreign|metal|protection|protective)\\s+(pouch|case|bag)",
        "(read|see) (detail|desc|post)", "please(?s).*read", "read(?s).*please", "(docking|charging) (station|stand)", "download",
        "credits", "instant delivery", "official server", "damaged", "Option File", "offline", "unlock all", "online", "mini dock",
        "coin", "skins", "collectors box", "soundtrack", "poster", "protection accessor", "PLAYSTAND", "Press Release",
        "(no|protective|case|silicone|phone|style|\\bUS\\b|miss(ing)?) cover(s)?", "promotional game", "starter pack", "Microphone", "KontrolFreek",
        "sniper thumbs", "(game|skin|thumb|Silicone|floating) grip", "thumb( )?stick", "(screen|grip) (protector|combat|stick)", "leg strap", "Cleaning Cloth",
        "dual( )?(shock|charge)", "efigs", "gamepad", "(toy|joy|ring)(\\s+)?con", "controller", "(card|stand) holder", "memory card", "(Spa|messenger)?( )?Bag", "keyring",
        "headset", "\\bhdmi\\b", "\\bUSB\\b", "\\bhdd\\b", "(nintendo|switch) labo", "(steering|racing|driving|official|nintendo|wii|race) wheel", "wristband",
        "horipad", "(cord|power|hdmi)( )?(adapter|level|supply)", "tv tuner",
        "starter (set|pack|bundle|kit)", "figure(s)? bundle", "k eso", "(mini|gift) toy", "pad pro", "cable pack", "dvd player",
        "pre(\\s+|-)?(order|sale)", "season pass", "(steel|art)( )?book", "(game|mini)( )?figure", "collectable", "collectible", "remote control", "(aux|charg(ing|e)|power|av) cable",
        "membership", "(subscription|gift)( |-)?card", "12 month", "(wallpaper|dynamic|ps\\d) theme", "themes", "account", "achievement pack",
        "(xp|level|lvl) boost", "gamer score", "trophy service", "platinum trophy", "arcade mini", "boosting levels", "rare promo",
        "samsung", "huawei", "iphone", "sandisk", "server", "wireless", "Tempered Glass", "Early Access", "beta test",
        "(usa|hungarian|scandinavian|asian|korea(n)?|polish|german|promo(tional)?|starter|demo|french|jap(an)?(ese)?|cz|dutch|italian|spanish|us(a)?|digital|nordic|\\bau\\b|multi(-)?language) (release|cover|pack|box|import|item|disc|vers|copy)",
        "arabic", "slovakian", "czech", "NTSC USA", "to be updated", "(ps\\d|xbox( one)?) digital",
        "\\bhori\\b", "\\bDE\\b", "ID\\d+z", "\\bemail\\b", "steel( )?(box|case)",
        "ark(?s).*(pvp|pve)", "Code(-| )?in(-| )?(a)?(-| )?Box",
        "diablo 3(\\s+(\\w+|\\d+)){6,}", "fortnite", "placeholder \\d",
        "skylander", "lego dimension", "disney infinity", "ring fit", "guitar hero",
        "villager(?s).*animal crossing", "animal crossing(?s).* (bell|million|diy|recipe|fossil|dino|egg|gold)",
        "(gta|grand theft)(?s).* (acc|lvl|fast run|bogdan|glitch|heist|character|cars|boost|cash|money|online|mill)",
        "(cod|of duty)(?s).* (points|boost|unlock|warzone)", "Destiny 2",
        "(ammo|damage|weapon|tesla|energy|minigun|mask|fixer|rifle|laser|lvc|blood|hand|lmg|legend|magazin|coat|x5|bear|arm|vamp|uniform|plan|blueprint|suit|outfit|shot|flame|armo|50|100|steel|leed|stimpack|power|cap|armo|recipe|gun)(?s).*fallout",
        "fallout(?s).* (ammo|damage|tesla|weapon|energy|minigun|mask|fixer|rifle|laser|lvc|blood|hand|lmg|legend|magazin|coat|x5|bear|arm|vamp|uniform|plan|blueprint|suit|outfit|shot|flame|armo|50|100|steel|leed|stimpack|power|cap|armo|recipe|gun)",
        "fifa(?s).* (\\d+k|team|money|milli|gener|player|gold|point)", "(\\d+k|team|money|milli|gener|player|gold|point).*fifa(?s)",
        "borderlands(?s).* (artifact|crit|recoil|level|lvl|takedown|damage|Teething|dmg|mayhem|lvl|cash|x50|legendary|money|mod)",
        "rocket l(?s).* (paint|hustle|ghost|Fennec|boost|level|reward|octane|item|bod|car|fire|import|trade|inventor|rare|crate|decal|wheel|goal|explos)",
        "\\bPS( vita|P|1|2|3)\\b", "\\bPlaystation( )?(psp|1|2|3)\\b", "XBOX( )?360"
      ).mkString("^.*?(?i)(", "|", ").*$").r

      private val LISTING_DESCRIPTION_TRIGGER_WORDS = List(
        "shared.*account", "playable worldwide", "will get ACCESS", "send.*instructions", "download code"
      ).mkString("^.*?(?i)(", "|", ").*$").r

      override val categoryId: Int = 139973

      override val searchFilterTemplate: String = DEFAULT_SEARCH_FILTER + "buyingOptions:{FIXED_PRICE},itemStartDate:[%s]"

      private val ACCEPTER_BUYING_OPTIONS = Set("FIXED_PRICE", "BEST_OFFER")

      override val filter: EbayItemSummary => Boolean = { item =>
        !LISTING_NAME_TRIGGER_WORDS.matches(item.title.replaceAll("[^a-zA-Z0-9 ]", "")) &&
        !LISTING_DESCRIPTION_TRIGGER_WORDS.matches(item.shortDescription.fold("")(_.replaceAll("[^a-zA-Z0-9 ]", ""))) &&
        item.buyingOptions.intersect(ACCEPTER_BUYING_OPTIONS).nonEmpty
      }
    }
  }
}
