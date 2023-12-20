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

      private val LISTING_NAME_TRIGGER_TAGS = List(
        "\\(PC\\)",
        "\\(DS\\)",
        "\\(XBOX\\)"
      ).mkString("^.*?(?i)(", "|", ").*$").r

      // format: off
      private val LISTING_NAME_TRIGGER_WORDS = List(
        "bundle", "job( |-)?lot", "games lot", "lot of \\d+", "placeholder( listing)? \\d", "^game \\d+", "^listing \\d+", "video game \\d+",
        "upcoming.{1,5}game", "various video games", "nintendo switch \\d{1,2}", "\\d x nintendo switch games", "ps games x \\d", "PS4 game \\d+",
        "lots to choose from", "not sold in shops", "^xbox one games",
        "\\b200[0-9]\\b", "(demo|game|global|premium)( )?(code|disc|key|cart|pass)",
        "\\bhdmi\\b", "\\bUSB\\b", "\\bhdd\\b",
        "switch.*(alu|unicorn).*\\bcase\\b", "credit(?s).*accoun", "credits", "test (listing|page)",
        "(\\d+|rune|perk|microsoft|skill|(e)?xp(erience)?)\\s+(stats|points)", "(memory|trading|post|sd|nfc( mini)?)( )?card", "stickers",
        "(subscription|gift|ps\\d|steam|network|will send|insta)( |-)?(card|code|key)", "disc \\d missing", "(instant|digital) delivery", "faulty", "damaged",
        "(store|reservation|access|cd|unlock|unused|digital|upgrade|test|psn|beta|\\bUK\\b|no)( )?(redeem )?(\\bDL\\b|avatar|game|code|key)",
        "(software|cartridge(s)?|cart(s)?|game|disk(s)?|disc(s)?( \\d)?|cover|box|inlay|sleeve|book|cd|collection|manual|card|promo|Accessories|cloth map) only",
        "(case|variety|accessor(ies|y)|storage|charge|robot|dice) (system|set|kit|box)", "no dis(c|k)", "Season( \\d)? Pass", "pass set", "keychain",
        "(canvas|replacement|cover|carry|travel(er)?|commuter|carrying|just( the)?|no|hard|storage|game|vault|phone|card|foreign|metal|console|protection|protective|nintendo switch|empty)\\s+(sleeve|pouch|case|bag)",
        "(read|see) (detail|desc|post)", "please(?s).*read", "read(?s).*please", "(docking|charging|power|desk)( )?(dock|station|stand)", "download",
        "official (server|magazin)", "Option File", "offline", "online", "unlock all", "mini dock", "Press Release", "starlink(?s).*pack", "(pencil|traveller) case",
        "coin", "skins", "(collectors|empty|steel|slim|display)( )?((game )?box|case)", "soundtrack", "poster", "protection accessor", "PLAYSTAND", "(character|SILICONE) skin",
        "(no|protective|foreign|case|slip|silicone|phone|style|\\bUS\\b|miss(ing)?) cover(s)?", "promotional game", "starter pack", "Microphone", "KontrolFreek",
        "sniper thumbs", "(game|skin|thumb|Silicone|floating) grip", "thumb( )?(stick|pack)", "(screen|grip|case) (protector|combat|stick)", "(sports|leg) strap", "Cleaning Cloth",
        "dual( )?(sense|shock|charge)", "efigs", "gamepad", "(toy|joy|ring)(\\s+)?con", "wired control", "controller", "(card|stand|ring) holder", "(Spa|messenger)?( )?Bag", "keyring",
        "headset", "(nintendo|switch) labo", "(steering|racing|driving|official|nintendo|wii|race) wheel", "wristband", "lenovo", "smoby", "calling card",
        "horipad", "(mouse|keyboard|cord|power|\\bAC\\b|hdmi|cockpit|plug +play)( )?(adapt(e|o)r|level|supply)", "tv tuner", "home circuit", "Origami Sheets", "\\bPlaygro\\b",
        "(starter|craft|diy|BADGE PIN) (set|pack|bundle|kit)", "figure(s)? bundle", "k eso", "(mini|plush|gift|grip(s)?) (set|toy)", "pad pro", "cable (guy|adapter|pack)", "Philips",
        "pre(\\s+)?(order|sale)", "(steel|art)( )?book", "(game|vinyl|mini|pvc)( )?figure", "collectable", "collectible", "remote control", "(patch|aux|charg(ing|e)|power|av|adapter) cable",
        "membership", "12 month", "(wallpaper|dynamic|ps\\d) theme", "themes", "account", "achievement pack", "(MODDED|FN) ACC", "RDS Industries", "verbatim",
        "(xp|level|lvl) boost", "gamer score", "(platinum|trophy) service", "platinum trophy", "arcade mini", "boosting levels", "rare promo", "LUGGAGE TAG",
        "samsung", "huawei", "iphone", "\\bipad\\b", "sandisk", "server", "wireless", "Tempered Glass", "(early|beta) (test|access)", "closed", "Funko Pop",
        "(usa|hungarian|scandinavian|asian|korea(n)?|polish|german|promo(tional)?|starter|demo|french|jap(an)?(ese)?|cz|dutch|italian|spanish|us(a)?|digital|nordic|\\bau\\b|multi(-)?language) (release|cover|pack|box|import|item|disc|vers|copy)",
        "arabic", "slovakian", "czech", "\\bNTSC(-J)?\\b", "to be updated", "(ps\\d|xbox( one)?) digital", "Dreamcast", "Handheld System", "hard drive",
        "\\bhori\\b", "\\bDE\\b", "ID\\d+z", "\\bemail\\b", "PC( )?(mac|steam|comp|win|game|CD|DVD)", "\\n digit code", "Commodore 64", "leap tv", "smart band",
        "TOPModel", "Sleeping Mask", "Juwel", "game( +)?watch", "Wonder Pin", "Trigger Treadz", "Painting on Canvas", "Life is Strange Before the Storm",
        "(pvp|pve|reaper|lvl)(?s).*ark", "ark(?s).*(pvp|SMALLTRIBE|breeding|deadpool|pve|reaper|lvl|Tek)", "Code( )?in( )?(a)?( )?Box", "Creativ Company",
        "fortnite", "overwatch\\s+(sony|ps|xbox|legendary|origins|game)", "earphone", "Crossbody", "DRESSING GOWN", "drinks cooler", "hair dryer",
        "Miss Melody", "Thrustmaster", "Xiaomi", "OTL Technologies", "logitech", "mechanical keyboard", "Gioteck", "\\bd( )?link\\b", "duvet cover",
        "Cheats Bible", "500gb console", "tiktok",
        "(season|unique|x10|admission|party|rune|item|gold|softcore|(nm|nightmare) dungeon|modded|\\bGEM(s)?\\b|weapon|\\bPC\\b|\\bXP\\b).*diablo",
        "diablo.*(season|unique|x10|admission|party|rune|item|gold|softcore|(nm|nightmare) dungeon|modded|\\bGEM(s)?\\b|weapon|\\bXP\\b|\\bPC\\b)",
        "nexigo", "fan cooling", "Eve Valkyrie", "invaders plush", "xbox (360|original|classic)", "Original Xbox", "figpin", "Smallstuff", "LEXIBOOK",
        "battery lid", "media remote", "game \\d+ for", "NTSCjp", "ZX SPECTRUM", "all platforms", "AutoPop Trophies", "Candlestick", "Loungefly",
        "SACKit", "DANTOY", "BIOPlast", "Clementoni", "Magsafe", "headphones", "Stainless Steel", "Additional Content", "In game Items", "heatsink",
        "skylander", "lego dimension", "disney infinity", "ring fit", "guitar hero", "million bell", "(touch|split|control)( )?pad", "Touch( )?Screen", "Make Your Selection",
        "animal crossing", "SCARLET.*VIOLET", "kinect sensor", "gaming locker", "eso gold", "gaming locker", "WOW Generation", "Track Connector",
        "Temperature Sensor", "RGB LED", "not duped", "amiibo", "DIY material", "Steep X ", "(Switch|lag) pedal", "game not included",
        "(toggle|indicator|network|light|battery|pressure|pump|lifter|window( control)?|Mechanical|battery|\\blamp\\b|\\balarm\\b|push|compressor|lag) Switch", "Switching Sack",
        "(ammo|damage|weapon|tesla|energy|minigun|mask|fixer|rifle|laser|lvc|blood|hand|lmg|legend|magazin|coat|x5|bear|arm|vamp|uniform|plan|blueprint|suit|outfit|shot|flame|armo|50|100|steel|leed|stimpack|power|cap|armo|recipe|gun)(?s).*fallout",
        "fallout(?s).* (ammo|damage|tesla|weapon|energy|minigun|mask|fixer|rifle|laser|lvc|blood|hand|lmg|legend|magazin|coat|x5|bear|arm|vamp|uniform|plan|blueprint|suit|outfit|shot|flame|armo|50|100|steel|leed|stimpack|power|cap|armo|recipe|gun)",
        "fifa.*(\\d+k|team|money|milli|gener|player|gold|point|coins)", "(\\d+k|team|money|milli|gener|player|gold|point|coins).*fifa",
        "\\bFC\\b.*(coins|bot|trading|points|qualifiction)", "Lords of the Fallen.*(Weapons|MAX|LEVEL)",
        "(gta|grand theft)(?s).*(acc|lvl|modded|trading|rank|car|mxd|fast run|bogdan|glitch|heist|billion|(full|max) stat|trillion|character|cars|boost|cash|money|online|mil)",
        "(cod|of duty|mw\\d|warzone)(?s).*(schematic|burger|dmz|jack link|service|crossbow|code|items|camo|points|boost|hyper|unlock|mountain dew|warzone|skin|level|card|\\bXP\\b)",
        "modern warfare.*(camo)", "YuGiOh.*(Gems)", "pubg.*(troll|duracell)",
        "Destiny 2", "Destiny.*taken king", "Destiny\\s+the coll",
        "borderlands.*(artifact|crit|recoil|level|lvl|takedown|damage|Teething|dmg|mayhem|lvl|cash|x50|legendary|money|mod)",
        "starfield.*(credit|max pow)", "Elder Scrolls.*(tamriel|morrowind)",
        "spiderman.*(trophy|campaign|service)", "(10k|traps).*save( the)? world",
        "minecraft.*(item)", "No Mans Sky.*(element|Ship Pack|Interceptor)", "BO3.*(Divinium|Cryptokey)", "\\bto update\\b",
        "Hogwarts Legacy.*(onyx|potion|shop)", "DYING LIGHT.*(EGG-SPLOSIVE|THROWABLE)", "PS Crossplay", "[A-Z]\\d{4,6}(A|Z)",
        "(rune|million|level)(?s).*elden ring", "elden ring(?s).*(rune|million|level)", "Pok(e|é)?mon",
        "dying light.*(damage|tier|legendary)", "ACNH.*(tool|ticket)", "Temtem.*Pansun", "To be edited", "random Blank", "Dummy( game)? Listing",
        "\\bTBC\\b", "windows( )?(pc|\\d|xp|vista)", "\\b(2|3)DS\\b", "Master System", "Sega Master System", "sega game gear",
        "forza.*Wheelspin", "demon soul.*level", "\\bBDSP\\b", " DS PEGI", "\\bWII\\b", "Roblox", "\\bVPN\\b", "\\bDVD\\b", "\\bNDS\\b", "\\bOLED\\b",
        "rocket l(?s).*(paint|hustle|ghost|Fennec|boost|level|dueli|dragon|reward|octane|item|bod|car|fire|import|trade|inventor|rare|crate|decal|wheel|goal|explos)",
        "\\bPS( )?(vita|one|P|1|2|3)\\b", "\\bPlay( )?station( )?(one|vita|psp|1|2|3)\\b", "\bSNES\\b", "\\bANDROID\\b",
        "X(BOX)?(\\s+)?360","(super )?nintendo ((3)?ds|wii|nes|eshop)", "\\b(3)?DS\\b ninten(t|d)o", "gamecube", "\\bN64\\b", "\\bDS\\b game", "nintendo (3)?ds",
        "PlayStation 3.?PS3", "PlayStation 2.?PS2", "\\bPlayStation (2|3)\\b", "gameboy", "switch.*Accessories"
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
        !LISTING_NAME_TRIGGER_TAGS.matches(item.title) &&
        !LISTING_NAME_TRIGGER_WORDS.matches(item.title.replaceAll("[^a-zA-Z0-9 ]", "")) &&
        !LISTING_DESCRIPTION_TRIGGER_WORDS.matches(item.shortDescription.fold("")(_.replaceAll("[^a-zA-Z0-9 ]", ""))) &&
        item.buyingOptions.intersect(ACCEPTER_BUYING_OPTIONS).nonEmpty
      }
    }
  }
}
