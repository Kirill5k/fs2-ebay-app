package ebayapp.core.clients.ebay

import ebayapp.core.clients.ebay.browse.responses.EbayItemSummary
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.kernel.errors.AppError

import java.time.Instant
import java.time.temporal.ChronoUnit

private[ebay] object search {
  // electronics - https://www.ebay.co.uk/b/bn_7000259660 - 259086
  // headphones - https://www.ebay.co.uk/b/bn_877754 - 293 (sound & vision) -> 15052 (portable audio & headphones) -> 112529 (headphones)

  trait EbaySearchParams {
    def categoryId: Int
    protected def searchFilterTemplate: String

    def filter: EbayItemSummary => Boolean

    private val withItemStartDate = (filter: String, from: Instant) => s"$filter,itemStartDate:[${from.truncatedTo(ChronoUnit.SECONDS)}]"
    private val withSeller        = (filter: String, seller: String) => s"$filter,sellers:{$seller}"

    def queryParams(from: Instant, query: String, seller: Option[String] = None): Map[String, String] = {
      val baseFilter       = withItemStartDate(searchFilterTemplate, from)
      val filterWithSeller = seller.fold(baseFilter)(s => withSeller(baseFilter, s))

      Map(
        "fieldgroups"  -> "EXTENDED",
        "category_ids" -> categoryId.toString,
        "filter"       -> filterWithSeller,
        "limit"        -> "200",
        "q"            -> query
      )
    }
  }

  object EbaySearchParams {
    def get(criteria: SearchCriteria): Either[AppError, EbaySearchParams] =
      criteria.category
        .toRight(AppError.Critical("category kind is required in ebay-client"))
        .flatMap(EbaySearchParams.get)

    def get(category: String): Either[AppError, EbaySearchParams] =
      category match {
        case "portable-audio"            => Right(PortableAudioSearchParams)
        case "smart-lighting"            => Right(SmartLightingSearchParams)
        case c if c.startsWith("games-") => Right(VideoGameSearchParams)
        case c                           => Left(AppError.Critical(s"unable to find search params for category '$c' in EbayClient"))
      }

    private object PortableAudioSearchParams extends EbaySearchParams {

      override val categoryId: Int = 15052

      override val searchFilterTemplate: String = "conditionIds:{1000|1500|2000|2500|2750|3000|4000|5000|6000}," +
        "deliveryCountry:GB," +
        "priceCurrency:GBP," +
        "itemLocationCountry:GB," +
        "buyingOptions:{FIXED_PRICE}"

      override val filter: EbayItemSummary => Boolean =
        item => item.buyingOptions.intersect(Set("FIXED_PRICE", "BEST_OFFER")).nonEmpty
    }

    private object SmartLightingSearchParams extends EbaySearchParams {
      override val searchFilterTemplate: String = "conditionIds:{1000|1500|2000|2500|2750|3000|4000|5000|6000}," +
        "deliveryCountry:GB," +
        "price:[0..200]," +
        "priceCurrency:GBP," +
        "itemLocationCountry:GB," +
        "buyingOptions:{FIXED_PRICE}"

      override val categoryId: Int = 11700

      private val ACCEPTER_BUYING_OPTIONS = Set("FIXED_PRICE", "BEST_OFFER")

      override val filter: EbayItemSummary => Boolean =
        item => item.buyingOptions.intersect(ACCEPTER_BUYING_OPTIONS).nonEmpty
    }

    private object VideoGameSearchParams extends EbaySearchParams {
      private val LISTING_NAME_TRIGGER_TAGS = List(
        "\\(DS\\)",
        "\\(XBOX\\)"
      ).mkString("^.*?(?i)(", "|", ").*$").r

      // format: off
      private val LISTING_NAME_TRIGGER_WORDS = List(
        "\\bPC(CD)?\\b",
        "^NA -.*", "^(PS4|xbox|switch) games$", "^\\d+( )?game$",
        "\\d+( )?(x)?( (various|used))?( (XBOX( ONE)?|PS4|PS5|playstation|nintendo switch))?( video)? games",
        "(PS(4|5)?|XBOX) game(s)?( X)? \\d+",
        "(various video|nintendo switch) games","(various video|nintendo switch) games", "set of \\d",
        "bundle", "job( |-)?lot", "games lot", "lot of \\d+", "placeholder( listing)? \\d", "^game \\d+", "^listing \\d+", "video game(s)? \\d",
        "upcoming.{1,5}game",
        "lots to choose from", "not sold in shops", "^xbox one games", "ps4 \\d games", "buy any \\d for",
        "\\b200[0-9]\\b", "(demo|game|global|premium|shop)( )?(code|disc|key|cart|pass)",
        "\\bhdmi\\b", "\\bUSB(C)?\\b", "\\bhdd\\b", "blox fruit",
        "(m|b)illion (pure)? cash", "\\d+M (cash|money)", "\\d+ mill",
        "switch.*(alu|unicorn).*\\bcase\\b", "credit(?s).*accoun", "credits", "test (listing|page)", "In Game Item",
        "case for (switch|nintendo)", "Fightpad", "Official Kinect( 2)? Sensor",
        "(starter|craft|diy|achievement|icon|BADGE PIN|racing)( )?(set|pack|bundle|kit)", "starlink(?s).*pack", "digital edition",
        "(\\d+|rune|perk|microsoft|skill|(e)?xp(erience)?)\\s+(stats|points)", "(memory|trading|post|sd|nfc( mini)?)( )?card", "stickers",
        "(subscription|gift|ps\\d|steam|network|digital|will send|insta(nt)?|digital)( |-)?(card|code|key)", "disc \\d missing", "(instant|digital) delivery", "faulty", "damaged",
        "(store|reservation|access|cd|unlock|unused|digital|upgrade|test|psn|beta|\\bUK\\b|no)( )?(redeem )?(\\bDL\\b|eshop|avatar|game|code|key)",
        "(software|cartridge(s)?|cart(s)?|game|disk(s)?|disc(s)?( \\d)?|cover|box|inlay|sleeve|book|cd|collection|manual|card(s)?|promo|Accessories|cloth map|disc (one|two|\\d)) only",
        "only cart", "STAND HUB", "nacon", "stereo hset", "Subsonic PRO", "Japanese",
        "(case|variety|accessor(ies|y)|storage|charge|robot|dice|charging|streaming) (pack|system|set|kit|box)", "no dis(c|k)", "Season( \\d)? Pass", "pass set", "keychain",
        "(canvas|replacement|cover|carry|travel(er)?|commuter|carrying|just( the)?|no|hard|storage|game|vault|phone|card|foreign|metal|console|protection|protective|nintendo switch|empty|cargo|slim|lux)\\s+(sleeve|pouch|case|bag)",
        "(read|see) (detail|desc|post)", "please(?s).*read", "read(?s).*please", "(docking|charging|power|desk|console|media|portable)( )?(charging|dock|station|stand)", "download",
        "official (server|magazin)", "Option File", "offline", "online", "unlock all", "mini dock", "Press Release", "Pre( )?Release", "card reader",
        "coin", "skins", "(pencil|traveller|system|collectors|empty|steel|slim|display|switch|messenger)( )?((game )?box|case)", "soundtrack", "poster", "protection accessor", "PLAYSTAND", "(character|SILICONE) skin",
        "(no|protective|foreign|case|slip|silicone|phone|style|\\bUS\\b|miss(ing)?) cover(s)?", "promotional game", "Microphone", "KontrolFreek", "fitness ring",
        "sniper thumbs", "(game|skin|thumb|Silicone|floating) +grip", "(screen|grip|case|fighting) (protector|combat|stick)", "(sports|leg) strap", "Cleaning Cloth",
        "dual( )?(sense|shock|charge)", "efigs", "gamepad", "(toy|joy|ring)(\\s+)?con", "wired control", "controller", "(card|stand|ring|game) holder", "(Spa|messenger)?( )?Bag", "keyring",
        "headset", "(nintendo|switch) (dock|labo)", "(steering|racing|driving|official|nintendo|wii|race) wheel", "wristband", "lenovo", "smoby", "calling card",
        "Nendoroid", "orb full set", "LC.{0,1}Power", "Wired Rockcandy", "guitar hero", "message for details", "RARE MOD", "NTSC-U ", "WARFRAME",
        "Gigaset COMFORT", "Curtain(s)? for Patio", "\\d+( )?mAh", "official license", "Levitating Globe", "plus.*subscription", "lucidsound", "dog shoe",
        "horipad", "(camera|mouse|keyboard|cord|power|\\bAC\\b|hdmi|cockpit|plug +play)( )?(adapt(e|o)r|level|supply)", "tv tuner", "home circuit", "Origami Sheets", "\\bPlaygro\\b",
        "figure(s)? bundle", "k eso", "(Person(n)?alisation|mini|plush|gift|grip(s)?( n play)?) (kit|set|toy)", "pad pro", "thumb( )?(tread|stick|pack)", "cable (guy|adapter|pack)", "Philips",
        "pre(\\s+)?(order|sale)", "(steel|art)( )?book", "(game|vinyl|mini|pvc)( )?figure", "collectable", "collectible", "remote control", "(ethernet|patch|aux|charg(ing|e)|power|av|adapter|network) cable",
        "membership", "12 month", "(wallpaper|dynamic|ps\\d) theme", "themes", "account", "(MODDED|FN) ACC", "RDS Industries", "verbatim", "nook mile ticket",
        "(xp|level|lvl) boost", "gamer( )?score", "(platinum|trophy) service", "platinum trophy", "arcade mini", "boosting levels", "rare promo", "LUGGAGE TAG",
        "samsung", "huawei", "nokia", "iphone", "\\bipad\\b", "sandisk", "server", "wireless", "Tempered Glass", "(early|beta) (test|access)", "closed", "Funko Pop",
        "(usa|hungarian|scandinavian|asian|korea(n)?|polish|asia(n)?|german|promo(tional)?|starter|demo|french|jap(an)?(ese)?|cz|dutch|italian|spanish|us(a)?|digital|nordic|\\bau\\b|multi(-)?language) (issue|release|cover|pack|box|import|item|disc|vers|copy)",
        "arabic", "slovakian", "czech", "\\bNTSC(-J)?\\b", "to be updated", "(ps\\d|xbox( one)?) digital", "Dreamcast", "Handheld System", "hard drive",
        "\\bhori\\b", "\\bDE\\b", "ID\\d+z", "\\bemail\\b", "\\n digit code", "Commodore 64", "leap tv", "smart band", "Contour Design", "Breeding Pair",
        "TOPModel", "Sleeping Mask", "Juwel", "game( +)?watch", "Wonder Pin", "Trigger Treadz", "Painting on Canvas", "Life is Strange Before the Storm",
        "(pvp|pve|reaper|lvl)(?s).*ark", "ark(?s).*(pvp|SMALLTRIBE|breeding|deadpool|pve|reaper|lvl|Tek)", "Code( )?in( )?(a|the)?( )?Box", "Creativ Company",
        "fortnite", "overwatch\\s+(sony|ps|xbox|legendary|origins|game)", "earphone", "Crossbody", "DRESSING GOWN", "drinks cooler", "hair dryer",
        "Miss Melody", "Thrustmaster", "Xiaomi", "OTL Technologies", "logitech", "mechanical keyboard", "Gioteck", "\\bd( )?link\\b", "duvet cover",
        "Cheats Bible", "500gb console", "tiktok", "modded outfit", "riding gloves", "electric scooter", "figurine", "arcade machine", "hoodie",
        "(campaign|farm|season|unique|x10|admission|party|rune|item|gold|softcore|(nm|nightmare) dungeon|modded|\\bGEM(s)?\\b|weapon|\\bPC\\b|\\bXP\\b).*(diablo|\\bD2\\b)",
        "(diablo|\\bD2\\b).*(campaign|farm|season|unique|x10|admission|party|rune|item|gold|softcore|(nm|nightmare) dungeon|modded|\\bGEM(s)?\\b|weapon|\\bXP\\b|\\bPC\\b)",
        "nexigo", "fan cooling", "Eve Valkyrie", "invaders plush", "xbox (360|original|classic)", "Original Xbox", "figpin", "Smallstuff", "LEXIBOOK",
        "battery lid", "media remote", "game \\d+ for", "NTSCjp", "ZX SPECTRUM", "all platforms", "AutoPop Trophies", "Candlestick", "Loungefly",
        "SACKit", "DANTOY", "BIOPlast", "Clementoni", "Magsafe", "headphones", "Stainless Steel", "Additional Content", "In game Items", "heatsink",
        "skylander", "lego dimension", "disney infinity", "ring fit", "guitar hero", "(million|max) bell", "(touch|split|control)( )?pad", "Touch( )?Screen", "Make Your Selection",
        "animal crossing", "SCARLET.*VIOLET", "kinect sensor", "gaming locker", "eso gold", "gaming locker", "WOW Generation", "Track Connector",
        "Temperature Sensor", "RGB LED", "not duped", "amiibo", "DIY material", "Steep X ", "(Switch|lag) pedal", "game not included", "car charger",
        "LED Light", "check description", "loot run", "bluetooth", "(personalised|gift) mug", "Expansion Pack", "Sega Mega Drive, 19\\d\\d",
        "Strikepack Horizon", "twitch", "Best Buy Exclusive", "POP UP PARADE", "wrist rest", "Mushkin", "Portable Gadgets", "Triangle Strategy Notebook",
        "Modiphius", "Lapse disc",
        "(toggle|indicator|network|light|battery|pressure|pump|lifter|window( control)?|Mechanical|battery|\\blamp\\b|\\balarm\\b|push|compressor|lag) Switch", "Switching Sack",
        "(treasure|rare|apparel|ammo|damage|weapon|tesla|energy|minigun|mask|fixer|rifle|laser|lvc|blood|hand|lmg|legend|magazin|coat|x5|bear|arm|vamp|uniform|plan|blueprint|suit|outfit|shot|flame|armo|50|100|steel|leed|stimpack|power|cap|armo|recipe|gun)(?s).*fallout",
        "fallout(?s).* (treasure|rare|apparel|ammo|damage|tesla|weapon|energy|minigun|mask|fixer|rifle|laser|lvc|blood|hand|lmg|legend|magazin|coat|x5|bear|arm|vamp|uniform|plan|blueprint|suit|outfit|shot|flame|armo|50|100|steel|leed|stimpack|power|cap|armo|recipe|gun)",
        "fifa.*(\\d+k|team|money|milli|gener|player|gold|point|coins)", "(\\d+k|team|money|milli|gener|player|gold|point|coins).*fifa",
        "\\bFC\\b.*(coins|bot|trading|points|qualifiction)", "Lords of the Fallen.*(Weapons|MAX|LEVEL)",
        "(gta|grand theft)(?s).*(acc|lvl|modded|trading|rank|car|mxd|fast run|bogdan|glitch|heist|billion|(full|max) stat|trillion|character|cars|boost|cash|money|online|mil)",
        "(bo\\d|black ops|cod|of duty|mw(\\d|z)|warzone)(?s).*(unlock|instant|experience|dual weap|walls|Hella Chill|big red one|plan|tool|skill|bot|rank|zombi|legendary|tools|season|monster|energy|blueprint|schematic|burger|dmz|jack link|service|crossbow|code|items|camo|points|boost|hyper|unlock|mountain dew|warzone|skin|level|card|\\b(\\d)?XP\\b)",
        "modern warfare.*(camo)", "YuGiOh.*(Gems)", "pubg.*(pack|troll|duracell)", "Numberplate", "bottle opener",
        "Destiny 2", "Destiny.*taken king", "Destiny\\s+the coll", "team( )?group", "via ebay message",
        "borderlands.*(grind|loot|gold|players|artifact|crit|recoil|level|lvl|takedown|damage|Teething|dmg|mayhem|lvl|cash|x50|legendary|money|mod)",
        "starfield.*(credit|max pow)", "Elder Scrolls.*(tamriel|morrowind|Summerset)",
        "spiderman.*(trophy|campaign|service)", "(10k|traps).*save( the)? world",
        "Genshin Impact", "red dead.*(gold)", "ea fc.*(\\b\\d+K\\b|rank|wins)",
        "BO3.*(Divinium|Cryptokey|level|anime|camo|modded|classes|perks)",
        "minecraft.*(item)", "(No Mans Sky|\\bNMS\\b).*(companion|element|Ship|Interceptor)", "\\bto update\\b",
        "shadow rpg.*(skin)", "F76.*(mod|plan)", "paper mario.*(magnets)",
        "Hogwarts Legacy.*(onyx|potion|shop)", "DYING LIGHT.*(EGG-SPLOSIVE|THROWABLE)", "PS Crossplay", "[A-Z]\\d{4,6}(A|Z)",
        "(rune|million|level|crafting|material|armour|set)(?s).*elden ring", "elden ring(?s).*(armour|set|rune|million|level|crafting|material)",
        "Pok(e|é)?mon", "dragon(s)? dogma(?s).*(item|upgraded|gold|stone|pack|weapon|ring|each|corset)", "\\bCD32\\b",
        "dying light.*(damage|tier|legendary)", "ACNH.*(tool|ticket)", "Temtem.*Pansun", "To be edited", "random Blank", "Dummy( game)? Listing",
        "\\bTBC\\b", "windows( )?(pc|\\d|xp|vista)", "\\b(2|3)DS\\b", "Master System", "sega (game gear|saturn)",
        "forza.*(cars|Wheelspin)", "demon soul.*level", "\\bBDSP\\b", " DS PEGI", "\\bWII\\b", "Roblox", "\\bVPN\\b", "\\bDVD\\b", "\\bNDS\\b", "\\bOLED\\b",
        "rocket l(?s).*(paint|hustle|ghost|Fennec|boost|level|dueli|dragon|reward|octane|item|bod|car|fire|import|trade|inventor|rare|crate|decal|wheel|goal|explos)",
        "\\bPS( )?(vita|one|P|1|2|3)\\b", "\\bPlay( )?station( )?(one|vita|psp|1|2|3)\\b", "\b(S)?NES\\b", "\\bANDROID\\b", "\\bvbucks\\b",
        "X(BOX)?(\\s+)?360","(super )?nintendo ((3)?ds|Entertainment System|wii|nes|eshop)", "\\b(3)?DS\\b ninten(t|d)o", "gamecube", "\\bN64\\b", "\\bDS\\b game", "nintendo (3)?ds",
        "PlayStation (2|3)", "gameboy", "switch.*Accessories",
      ).mkString("^.*?(?i)(", "|", ").*$").r
      // format: on

      private val LISTING_DESCRIPTION_TRIGGER_WORDS = List(
        "shared.*account",
        "playable worldwide",
        "will get ACCESS",
        "send.*instructions",
        "download code",
        "redeem"
      ).mkString("^.*?(?i)(", "|", ").*$").r

      override val categoryId: Int = 139973

      override val searchFilterTemplate: String = "conditionIds:{1000|1500|2000|2500|2750|3000|4000|5000|6000}," +
        "deliveryCountry:GB," +
        "price:[0..90]," +
        "priceCurrency:GBP," +
        "itemLocationCountry:GB," +
        "buyingOptions:{FIXED_PRICE}"

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
