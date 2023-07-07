package ebayapp.core.clients.ebay

import ebayapp.core.clients.ebay.browse.responses.EbayItemSummary
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.kernel.errors.AppError

import java.time.Instant
import java.time.temporal.ChronoUnit

private[ebay] object search {
  trait EbaySearchParams {
    def categoryId: Int
    protected def searchFilterTemplate: String

    def filter: EbayItemSummary => Boolean

    def queryParams(from: Instant, query: String): Map[String, String] =
      Map(
        "fieldgroups"  -> "EXTENDED",
        "category_ids" -> categoryId.toString,
        "filter"       -> searchFilterTemplate.format(from.truncatedTo(ChronoUnit.SECONDS)),
        "limit"        -> "200",
        "q"            -> query
      )
  }

  object EbaySearchParams {
    def get(criteria: SearchCriteria): Either[AppError, EbaySearchParams] =
      criteria.category
        .toRight(AppError.Critical("category kind is required in ebay-client"))
        .flatMap(EbaySearchParams.get)

    def get(category: String): Either[AppError, EbaySearchParams] =
      category match {
        case "smart-lighting"            => Right(SmartLightingSearchParams)
        case c if c.startsWith("games-") => Right(VideoGameSearchParams)
        case c                           => Left(AppError.Critical(s"unable to find search params for category '$c' in EbayClient"))
      }

    private object SmartLightingSearchParams extends EbaySearchParams {
      private val DEFAULT_SEARCH_FILTER = "conditionIds:{1000|1500|2000|2500|3000|4000|5000}," +
        "itemLocationCountry:GB," +
        "deliveryCountry:GB," +
        "price:[0..200]," +
        "priceCurrency:GBP," +
        "itemLocationCountry:GB,"

      override val searchFilterTemplate: String = DEFAULT_SEARCH_FILTER + "buyingOptions:{FIXED_PRICE},itemStartDate:[%s]"

      override val categoryId: Int = 11700

      private val ACCEPTER_BUYING_OPTIONS = Set("FIXED_PRICE", "BEST_OFFER")

      override def filter: EbayItemSummary => Boolean =
        item => item.buyingOptions.intersect(ACCEPTER_BUYING_OPTIONS).nonEmpty
    }

    private object VideoGameSearchParams extends EbaySearchParams {
      private val DEFAULT_SEARCH_FILTER = "conditionIds:{1000|1500|2000|2500|3000|4000|5000}," +
        "itemLocationCountry:GB," +
        "deliveryCountry:GB," +
        "price:[0..90]," +
        "priceCurrency:GBP," +
        "itemLocationCountry:GB,"

      // format: off
      private val LISTING_NAME_TRIGGER_WORDS = List(
        "bundle", "job( |-)?lot",
        "(\\d+|rune|perk|skill|(e)?xp(erience)?) (stats|points)", "(memory|trading|post|sd)( )?card", "stickers", "digital delivery",
        "(subscription|gift|ps\\d|steam|network)( |-)?(card|code|key)",
        "(demo|game)( )?(code|disc|key|cart|pass)", "(store|reservation|access|cd|unlock|unused|digital|upgrade|test|psn|beta|\\bUK\\b|no)( )?(redeem )?(\\bDL\\b|avatar|game|code|key)",
        "(software|cartridge(s)?|cart(s)?|game|disk(s)?|disc(s)?( \\d)?|cover|box|inlay|sleeve|book|cd|collection|manual|card|promo) only",
        "(case|variety|accessor(ies|y)|storage|charge|robot) (system|set|kit|box)", "no dis(c|k)", "Season( \\d)? Pass", "switch.*(alu|unicorn).*\\bcase\\b",
        "(canvas|replacement|cover|carry|travel(er)?|commuter|carrying|just( the)?|no|hard|storage|game|vault|phone|card|foreign|metal|console|protection|protective|nintendo switch|empty)\\s+(sleeve|pouch|case|bag)",
        "(read|see) (detail|desc|post)", "please(?s).*read", "read(?s).*please", "(docking|charging) (dock|station|stand)", "download",
        "credits", "instant delivery", "official (server|magazin)", "damaged", "Option File", "offline", "unlock all", "online", "mini dock", "credit(?s).*accoun",
        "coin", "skins", "(collectors|empty|steel)( )?((game )?box|case)", "soundtrack", "poster", "protection accessor", "PLAYSTAND", "Press Release", "starlink(?s).*pack",
        "(no|protective|foreign|case|slip|silicone|phone|style|\\bUS\\b|miss(ing)?) cover(s)?", "promotional game", "starter pack", "Microphone", "KontrolFreek",
        "sniper thumbs", "(game|skin|thumb|Silicone|floating) grip", "thumb( )?stick", "(screen|grip) (protector|combat|stick)", "(sports|leg) strap", "Cleaning Cloth",
        "dual( )?(shock|charge)", "efigs", "gamepad", "(toy|joy|ring)(\\s+)?con", "controller", "(card|stand|ring) holder", "(Spa|messenger)?( )?Bag", "keyring",
        "headset", "\\bhdmi\\b", "\\bUSB\\b", "\\bhdd\\b", "(nintendo|switch) labo", "(steering|racing|driving|official|nintendo|wii|race) wheel", "wristband",
        "horipad", "(mouse|keyboard|cord|power|\\bAC\\b|hdmi)( )?(adapter|level|supply)", "tv tuner", "home circuit", "Origami Sheets",
        "starter (set|pack|bundle|kit)", "figure(s)? bundle", "k eso", "(mini|gift) toy", "pad pro", "cable (adapter|pack)",
        "pre(\\s+)?(order|sale)", "season pass", "(steel|art)( )?book", "(game|mini)( )?figure", "collectable", "collectible", "remote control", "(aux|charg(ing|e)|power|av) cable",
        "membership", "12 month", "(wallpaper|dynamic|ps\\d) theme", "themes", "account", "achievement pack", "FN ACC", "RDS Industries",
        "(xp|level|lvl) boost", "gamer score", "trophy service", "platinum trophy", "arcade mini", "boosting levels", "rare promo", "LUGGAGE TAG",
        "samsung", "huawei", "iphone", "\\bipad\\b", "sandisk", "server", "wireless", "Tempered Glass", "Early Access", "beta test",
        "(usa|hungarian|scandinavian|asian|korea(n)?|polish|german|promo(tional)?|starter|demo|french|jap(an)?(ese)?|cz|dutch|italian|spanish|us(a)?|digital|nordic|\\bau\\b|multi(-)?language) (release|cover|pack|box|import|item|disc|vers|copy)",
        "arabic", "slovakian", "czech", "\\bNTSC(-J)?\\b", "to be updated", "(ps\\d|xbox( one)?) digital", "Dreamcast", "Handheld System", "PC MAC",
        "\\bhori\\b", "\\bDE\\b", "ID\\d+z", "\\bemail\\b", "PC( )?(comp|win|game|CD|DVD)", "\\n digit code", "Commodore 64",
        "(pvp|pve|reaper|lvl)(?s).*ark", "ark(?s).*(pvp|SMALLTRIBE|breeding|deadpool|pve|reaper|lvl|Tek)", "Code( )?in( )?(a)?( )?Box",
        "diablo 3(\\s+(\\w+|\\d+)){6,}", "fortnite", "placeholder( listing)? \\d", "character skin", "overwatch\\s+(sony|ps|xbox|legendary|origins|game)",
        "(rune|item|gold|softcore|(nm|nightmare) dungeon|\\bGEM\\b|weapon|\\bPC\\b|\\bXP\\b).*diablo", "diablo.*(rune|item|gold|softcore|(nm|nightmare) dungeon|\\bGEM\\b|weapon|\\bXP\\b|\\bPC\\b)",
        "nexigo", "fan cooling", "Eve Valkyrie", "invaders plush", "xbox original", "Original Xbox 1",
        "skylander", "lego dimension", "disney infinity", "ring fit", "guitar hero", "million bell", "(touch|split|control)( )?pad", "Touch( )?Screen", "Make Your Selection",
        "animal crossing", "SCARLET.*VIOLET", "Patch Cable", "kinect sensor", "gaming locker", "eso gold", "gaming locker",
        "(gta|grand theft)(?s).*(acc|lvl|modded|trading|rank|fast run|bogdan|glitch|heist|billion|(full|max) stat|trillion|character|cars|boost|cash|money|online|mil)",
        "(cod|of duty|mw2|warzone)(?s).*(dmz|jack link|crossbow|code|items|camo|points|boost|hyper|unlock|mountain dew|warzone|skin|level|card|\\bXP\\b)", "Destiny 2", "Destiny.*taken king", "heatsink", "Destiny\\s+the coll",
        "Temperature Sensor", "RGB LED", "powerstand", "not duped", "amiibo", "DIY material", "Steep X ", "Switch pedal", "game not included",
        "(toggle|indicator|network|light|battery|pressure|pump|lifter|window( control)?|Mechanical|battery|\\blamp\\b|\\balarm\\b|push|compressor) Switch", "Switching Sack",
        "(ammo|damage|weapon|tesla|energy|minigun|mask|fixer|rifle|laser|lvc|blood|hand|lmg|legend|magazin|coat|x5|bear|arm|vamp|uniform|plan|blueprint|suit|outfit|shot|flame|armo|50|100|steel|leed|stimpack|power|cap|armo|recipe|gun)(?s).*fallout",
        "fallout(?s).* (ammo|damage|tesla|weapon|energy|minigun|mask|fixer|rifle|laser|lvc|blood|hand|lmg|legend|magazin|coat|x5|bear|arm|vamp|uniform|plan|blueprint|suit|outfit|shot|flame|armo|50|100|steel|leed|stimpack|power|cap|armo|recipe|gun)",
        "fifa.*(\\d+k|team|money|milli|gener|player|gold|point)", "(\\d+k|team|money|milli|gener|player|gold|point).*fifa",
        "borderlands.*(artifact|crit|recoil|level|lvl|takedown|damage|Teething|dmg|mayhem|lvl|cash|x50|legendary|money|mod)",
        "minecraft.*(item)", "No Mans Sky.*(Ship Pack|Interceptor)", "BO3.*(Divinium|Cryptokey)", "\\bto update\\b",
        "Hogwarts Legacy.*(onyx|potion|shop)", "DYING LIGHT.*(EGG-SPLOSIVE|THROWABLE)", "PS Crossplay",
        "(rune|million|level)(?s).*elden ring", "elden ring(?s).*(rune|million|level)", "Pok(e|é)?mon",
        "dying light.*(damage|tier|legendary)", "ACNH.*(tool|ticket)", "Temtem.*Pansun", "To be edited", "random Blank", "Dummy( game)? Listing",
        "\\bTBC\\b", "windows( )?(\\d|xp|vista)", "\\b(2|3)DS\\b", "Master System", "Sega Master System",
        "forza.*Wheelspin", "demon soul.*level", "\\bBDSP\\b", " DS PEGI", "\\bWII\\b", "Roblox", "\\bVPN\\b", "\\bDVD\\b",
        "rocket l(?s).*(paint|hustle|ghost|Fennec|boost|level|dueli|dragon|reward|octane|item|bod|car|fire|import|trade|inventor|rare|crate|decal|wheel|goal|explos)",
        "\\bPS( )?(vita|one|P|1|2|3)\\b", "\\bPlay( )?station( )?(one|vita|psp|1|2|3)\\b", "\bSNES\\b", "\\bANDROID\\b",
        "X(BOX)?( )?360", "(super )?nintendo ((3)?ds|wii)", "\\b(3)?DS\\b ninten(t|d)o", "gamecube", "\\bN64\\b", "\\bDS\\b game",
        "PlayStation 3.?PS3", "PlayStation 2.?PS2"
      ).mkString("^.*?(?i)(", "|", ").*$").r
      // format: on

      private val LISTING_DESCRIPTION_TRIGGER_WORDS = List(
        "shared.*account",
        "playable worldwide",
        "will get ACCESS",
        "send.*instructions",
        "download code"
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
