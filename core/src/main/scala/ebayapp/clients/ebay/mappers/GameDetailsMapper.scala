package ebayapp.clients.ebay.mappers

import cats.implicits._
import ebayapp.domain.ItemDetails.Game
import ebayapp.domain.search.ListingDetails

private[mappers] object GameDetailsMapper {

  private val CONSOLE_REGEX_PATTERN =
    "((new|rare|official|select) )?((very )?good )?(\\b(for|((also )?(works|only|playable|plays) )?on)\\b )?(the )?" +
      "((sony )?play( )?st(a)?(t)?(i)?(o)?(n)?(( )?(\\d|one|move))?|(microsoft )?\\bx( )?b(ox)?(( )?(live|o(ne)?|\\d+))?\\b|\\bps( )?\\d\\b|(nintendo )?(switch|\\bwii( u)?\\b))" +
      "( game(s)?)?( (formula (1|one)|lot|only|shooter|basketball|exclusive|console|edition|version|action|wrestling|football))?( game(s)?)?( new)?( 20\\d\\d)?"

  private val LEVEL1_TITLE_WORDS_REPLACEMENTS = List(
    "(gold )?((greatest|playstation|ps) )?\\bhits\\b( (range|edition))?",
    "nintendo selects",
    s"(?<=.{10})$CONSOLE_REGEX_PATTERN(?s).*",
    "\\bday\\b (one|1|zero|0)( (edition|\\be(d)?(i)?(t)?(i)?\\b))?(?s).*$",
    "(the )?(\\bHD\\b|steel case|headline|standar|nuketown|wild run|lost|essential|exclusive|special|limited collectors|definitive|atlas|platinum|complete|std|classic(s)?|(\\d+(th)?)? anniversary|remastered|elite|\\beu\\b|coll(ector(s)?)?|ltd|goty|(action )?game of|legacy( pro)?|(un)?limited|premium|(digital )?deluxe|(\\w+)?ultimat).{0,20}(collection|edit(i)?on|\\be(d)?(i)?(t)?(i)?\\b)(?s).*$",
    "(?<=.{5})(the )?((new|pristine|\\binc\\b) )?(super|cheap( )?)?(free|fast|quick)?( )?(and )?(super( )?)?(prompt|free|fast|quick|(next|same|1|one) day|tracked|recorded|speedy|worldwide|bargain|\\bsc\\b|\\bfc\\b).{0,20}(dispatch|ship(ping)?|post(age)?|delivery|p( )?p).*$",
    "(?<=.{15})((brand )?new.{0,15})?(still )?((factory |un)?sealed|unopened|shrink( )?wrap)(?s).*$",
    "(?<=.{10})\\b(kids( \\w+)?|hack slash|single player|open world|Family Fun|basketball|(fun )?adventure|console single|tactical|3rd person|rpg|fps|survival|action|racing|role|wrestling|fighting|multi( )?player)\\b.{0,20}game(?s).*"
  ).mkString("(?i)", "|", "")

  private val LEVEL2_TITLE_WORDS_REPLACEMENTS = List(
    CONSOLE_REGEX_PATTERN,
    "[^\\p{L}\\p{N}\\p{P}\\p{Z}]",
    "\\d{5,}(\\w+)?",
    "\\d{3,}\\s+\\d{4,}",
    "for (the )?playstation( )?vr", "((ps( )?)?(vr|move)|kinect|fit|balance board) (needed|required|compatible)", "requires kinect( sensor)?",
    "(dbl|double|triple|twin|expansion|comb|mega).{0,10}(pack|pk)",
    "new in (wrapper|wrapping|cellophane|packaging|box)( still wrapped)?",
    "Now Released(?s).*$", "Release date(?s).*$",
    "includes.{0,20}pack(?s).*$",  "amazon.{0,20}exclusive(?s).*$",
    "(royal mail )?(1st|2nd|first) class.*$",
    "(?<=\\w+ )((all|fully) )?(boxed|complete) (\\bin\\b|with|case)(?s).*$",
    "exclusive to(?s).*$",
    "((with| inc(ludes)?|contain)).{0,20}(dlc|content|bonus|pack)(?s).*$",
    "(supplied|comes)? (with(out)?|\\bW( )?(O)?\\b|in original|\\bno\\b|missing|plus|has|inc(l)?(udes|uding)?).{0,15}(strategy guide|book|original|instruction|box|map|(slip )?case|manual)(?s).*$",
    "(the )?disc(s)? (are|is|in)(?s).*$",
    "(in )?(near )?(great|(very )?good|incredible|ex(cellent)?|amazing|nice|mint|superb|(full )?working|perfect|used|(fully )?tested|lovely|immaculate|fantastic|\\bfab\\b|decent|fair|\\bV\\b)(?s).*(dis(c|k)(s)?|working( (perfectly|fine))?|good|(working )?order|con(d)?(ition)?|value|prices)",
    "(\\bUK\\b|\\bEU\\b|genuine|european|platinum|original|essentials)( (edition|region|release|new|only|seller|version|stock|import|copy))?( 20\\d\\d)?",
    // removes common publishers
    "((from|by) )?(Disney(s)?( )?Pixar(s)?|rocksteady|WB Games|\\bTHQ\\b|Bethesda(s)?( Softworks)?|(EA|2k) (dice|music|sport(s)?|games)|Take (Two|2)( (NG|Interactive))?|elect(r)?onic arts|Warner Bros|rockstar games|ubisoft|(bandai )?namco|Bend Studio|EastAsiaSoft|Hideo Kojima|Naughty Dog|Activision|square enix|Dreamworks|Insomniac(s)?|LucasArt(s)?)( presents)?",
    "currys", "James Camerons", "\\bTom clancy(s)?\\b", "gamecube", "James Bond", "Peter Jacksons", "Marvels", "Sid Meiers",
    "Microsoft( 20\\d\\d)?", "sony", "nintendo( \\d+)?", "Disneys", "Amazon", "\\d games in (one|1)",
    "(?<=\\b(W)?(2k)?\\d+)\\s+(20\\d\\d|wrestling|basketball|footbal|formula)(?s).*",
    "(?<=FIFA) (soccer|football)", "(?<=NBA) basketball", "(?<=WWE) wrestling", "(?<=(FIFA|MotoGP) )20(?=\\d\\d)",
    "(?<=F1)\\s+(Formula (one|1))( racing)?", "(?<=\\b20\\d\\d)(\\s+)(version|formula)(?s).*",
    "\\bGT\\b (?=gran turismo)", "(?<=Turismo( (\\d|sport))?) \\bGT(\\d|S)?\\b", "(?<=Sonic) The Hedgehog", "Formula (1|One)\\s+(?=F1)", "Marvel(s)?\\s+(?=(deadpool|Spider))",
    "(?<=\\b[ivx]{1,4}\\b)(\\s+)\\d+", "(?<=\\d) \\b[ivx]{1,4}\\b", "(?<=1) \\bone\b"
  ).mkString("(?i)", "|", "")

  private val LEVEL3_TITLE_WORDS_REPLACEMENTS = List(
    // removes the word GAME
    "((new|all) )?(fully )?(((very|super) )?rare|limited run|(\\d+ )?new|pal|physical|great|boxed|full|complete|boxed( and)? complete) game(s)?( (\\d+|in one))?( new)?",
    "(the )?(\\b(\\d player|kids( \\w+)?|multiplayer|football sport|shooting|hacker|(car )?racing|Skateboarding|action|hit|official|console|gold|children)\\b.{0,15})?\\b(video( )?)?game(s)?\\b( (for kids|series|racing|good|boxed|console|of( the)? (year|olympic(s)?|movie)))?( 20\\d\\d)?",
    // removes the word USED
    "((barely|condition|never|hardly) )?(un)?used( (once|twice))?(( very)? good)?( (game(s)?|condition))?",
    "(the )?(official )?Strategy Combat( guide)?", "(First Person|FPS) Shooter", "(american|soccer) football( 20\\d\\d)?", "(racing|auto|golf|football) sport(s)?",
    "Adventure role playing", "ice hockey", "shoot em up", "Sport(s)? (skateboard|basketball|football)", "football soccer", "action stealth", "(car|motorcycles|rally) Racing",
    "((family fun|survival) )?Action Adventure( Open World)?", "(adventure )?survival horror", "fighting multiplayer", "Multi Player", "life simulation",
    "\\bpegi( \\d+)?\\b(?s).*$", "((\\d+|ten)th|(20|ten))( year(s)?)? (anniversary|celebration)", "(\\d|both)?( )?(dis(c|k)(s)?|cd(s)?)( (version|set|mint))?",
    "(sealed )?brand new( (case|sealed))?( in packaging)?( 20\\d\\d)?", "\\d \\d players", "1 ONE",
    "\\bID\\d+\\w", "SEEDESCRIPTIONFORDETAILS", "cheapest on ebay", "strategy guide", "Enhanced for Series X",
    "platinum", "(16|18) years", "limited run( \\d+)?", "box( )?set", "pre( )?(release|owned|enjoyed|loved)",
    "(Backwards )?compatible", "(bundle|physical) copy", "nuevo", "(big|steel)( )?box( version)?", "no scratches", "(map\\s+)?(manual|instructions)( (is|are))?( (included|missing))?",
    "100 ebayer", "(condition )?very good", "reorderable", "(posted|sent|dispatched).{0,10}day( by \\d pm)?", "in stock( now)?",
    "never played", "(only )?played (once|twice)", "best price", "Special Reserve", "Expertly Refurbished Product", "(quality|value) guaranteed",
    "(trusted|eBay|best|from ebays biggest) Seller(s)?", "fully (working|tested)", "Order By 4pm", "Ultimate Fighting Championship",
    "remaster(ed)?( 20\\d\\d)?", "directors cut", "original", "english", "deluxe", "standard", "Officially Licenced", "machine cleaned",
    "\\bctr\\b", "\\bgoty\\b", "mult(i)?( )?lang(uage)?(s)?( in game)?", "(with )?(fast|free|same day)( )?(delivery|dispatch|post)",
    "fast free", "blu( )?ray", "Console Exclusive", "playable on", "Definitive Experience", "Highly Rated", "essentials", "Re Mars tered", "booklet",
    "classic(s)?( (hit(s)?|version))?", "(case|box).{0,20}(complete|manual)", "very rare", "award winning", "official licenced", "Instruction(s)? Book",
    "Unwanted Gift", "limited quantity", "region (free|1)", "gift idea", "in case", "add( |-)?on( content pack)?", "jeu console", "\\b(For )?age(s)? \\d+\\b",
    "must see", "see (photos|pics)", "Refurbished", "shrink( )?wrapped", "\\bcert( )?\\d+\\b", "no dlc(s)?( included)?", "in wrappp(ing|er)",
    "\\brated \\d+\\b", "\\d supplied", "((region|europe) )?(\\bPAL\\b|\\bNTSC\\b)( \\d+)?( (region|format|version))?", "\\ben\\b", "\\bcr\\b", "\\bnc\\b",
    "\\bfr\\b", "\\bes\\b", "(in )?\\bvg(c| con(d)?(ition)?)?\\b", "\\ban\\b", "\\bLTD\\b", "\\b\\w+VG\\b", "\\bns\\b", "\\b(B)?NW(O)?T\\b",
    "\\bnsw\\b", "\\bsft\\b", "\\bsave s\\b", "\\bdmc\\b", "\\bBNI(B|P)\\b", "\\bNSO\\b", "\\bNM\\b", "\\bLRG\\b(( )?\\d+)?",
    "\\bUE\\b", "\\bBN(S)?\\b", "\\bRRP\\b(\\s|\\d)*", "\\bremake\\b( 20\\d\\d)?", "(ultra )?\\b(u)?hd(r)?\\b", "(\\b4k\\b|\\bone x\\b)( enhanced)?",
    "\\buns\\b", "\\bx360\\b", "\\bstd\\b", "\\bpsh\\b", "\\bAMP\\b", "\\bRPG\\b", "\\bBBFC\\b", "\\bPG(13)?\\b", "\\bDVD\\b", "\\bSE\\b",
    "\\bAND\\b", "\\bPA2\\b", "\\bWi1\\b", "\\bENG\\b", "\\bVGWO\\b", "\\bFPS\\b", "\\b(PS( )?)?VR\\b( version)?", "\\bDEFY\\b",
    "\\bSRG(\\d+)?\\b", "\\bEA(N)?\\b", "\\bGC\\b", "\\bCIB\\b", "\\bFOR PC\\b", "\\bLOT 2\\b", "\\bSO4\\b", "\\bT18\\b",
    "(100 )?((all|fully) )?complete( (mint|instructions|package))?", "SEALED(\\s+)?$", "NEW(\\s+)?$"
  ).mkString("(?i)", "|", "")

  private val EDGE_WORDS_REPLACEMENTS = List(
    "Playstation( \\d)?\\s+(?=PS)",
    "^genuine ",
    "^brand new ",
    "^(((brand )?NEW|BNIB|Factory) )?(and )?SEALED( in Packaging)?( )?",
    s"^$CONSOLE_REGEX_PATTERN",
    "Standart$", "^SALE", "(brand )?new$", "^BOXED", "^SALE", "^NEW", "^best", "^software", "^un( )?opened",
    "un( )?opened$", "rare$", "^rare", "official$", "^bargain", "bargain$", "(near )?mint$", "\\bfor\\b( the)?$",
    "premium$", "\\bvery\\b$", "\\bLIMITED\\b$", "(cleaned )?(fully )?(un)?tested$", "\\bON\\b$", "\\bBY\\b$", "^cheapest",
    "boxed$", "brand$", "good$", "brilliant$", "excellent$", "working$", "immaculate$", "instructions$", "superb$", "marvel$", "^mint"
  ).mkString("(?i)", "|", "")

  private val PLATFORMS_MATCH_REGEX = List(
    "PS\\d", "PLAYSTATION(\\s+)?(\\d|one)", "PSVR",
    "NINTENDO SWITCH", "SWITCH",
    "\\bWII( )?U\\b", "\\bWII\\b",
    "X( )?B(OX)?(\\s+)?(ONE|\\d+)", "X360", "XBOX"
  ).mkString("(?i)", "|", "").r

  private val PLATFORM_MAPPINGS: Map[String, String] = Map(
    "SONYPLAYSTATION4" -> "PS4",
    "PLAYSTATION4"     -> "PS4",
    "PSVR"             -> "PS4",
    "SONYPLAYSTATION3" -> "PS3",
    "PLAYSTATION3"     -> "PS3",
    "SONYPLAYSTATION2" -> "PS2",
    "PLAYSTATION2"     -> "PS2",
    "SONYPLAYSTATION1" -> "PS1",
    "SONYPLAYSTATION"  -> "PS",
    "PLAYSTATIONONE"   -> "PS1",
    "PLAYSTATION"      -> "PS",
    "NINTENDOSWITCH"   -> "SWITCH",
    "XBOX1"            -> "XBOX ONE",
    "XBOX360"          -> "XBOX 360",
    "XB1"              -> "XBOX ONE",
    "XB360"            -> "XBOX 360",
    "X360"             -> "XBOX 360",
    "XBOXONE"          -> "XBOX ONE",
    "XBONE"            -> "XBOX ONE",
    "MICROSOFTXBOXONE" -> "XBOX ONE",
    "MICROSOFTXBOX360" -> "XBOX 360",
    "MICROSOFTXBOX"    -> "XBOX",
    "XBOX"             -> "XBOX",
    "WIIU"             -> "WII U",
    "WII"              -> "WII"
  )

  def from(listingDetails: ListingDetails): Game =
    Game(
      name = sanitizeTitle(listingDetails.title),
      platform = mapPlatform(listingDetails),
      genre = mapGenre(listingDetails),
      releaseYear = listingDetails.properties.get("Release Year")
    )

  private def sanitizeTitle(title: String): Option[String] =
    title.withoutSpecialChars
      .replaceAll(EDGE_WORDS_REPLACEMENTS, "")
      .replaceAll(LEVEL1_TITLE_WORDS_REPLACEMENTS, "")
      .replaceAll(LEVEL2_TITLE_WORDS_REPLACEMENTS, "")
      .replaceAll(LEVEL3_TITLE_WORDS_REPLACEMENTS, "")
      .replaceFirst("(?<=\\w+ )(?i)(the )?\\w+(?=\\s+(\\be(d)?(i)?(t)?(i)?(o)?(n)?\\b|coll(ection)?)) (\\be(d)?(i)?(t)?(i)?(o)?(n)?\\b|coll(ection)?)(?s).*$", "")
      .replaceAll("(?i)\\bll\\b", "II")
      .replaceAll("(?i)\\blll\\b", "III")
      .replaceAll("(?i)playerunknown", "Player Unknown")
      .replaceAll("(?i)(littlebigplanet)", "Little Big Planet")
      .replaceAll("(?i)(farcry)", "Far Cry")
      .replaceAll("(?i)(superheroes)", "Super Heroes")
      .replaceAll("(?i)(W2K)", "WWE 2k")
      .replaceAll("(?i)(NierAutomata)", "Nier Automata")
      .replaceAll("(?i)(Hello Neighbour)", "Hello Neighbor")
      .replaceAll("(?i)(witcher iii)", "witcher 3")
      .replaceAll("(?i)(wolfenstein 2)", "Wolfenstein II")
      .replaceAll("(?i)(mariokart)", "Mario Kart")
      .replaceAll("(?i)(diablo 3)", "diablo iii")
      .replaceAll("(?i)(World Rally Championship)", "WRC")
      .replaceAll("(?i)(\\bPVZ\\b)", "Plants vs Zombies ")
      .replaceAll("(?i)(\\bnsane\\b)", "N Sane")
      .replaceAll("(?i)(\\bww2|ww11\\b)", "wwii")
      .replaceAll("(?i)(\\bcod\\b)", "Call of Duty ")
      .replaceAll("(?i)(\\bmysims\\b)", "my sims")
      .replaceAll("(?i)(?<=(^| ))RDR( )?(?=\\d)?", "Red Dead Redemption ")
      .replaceAll("(?i)(?<=(^| ))GTA( )?(?=\\d)?", "Grand Theft Auto ")
      .replaceAll("(?i)(\\bMGS\\b)", "Metal Gear Solid ")
      .replaceAll("(?i)(\\bRainbow 6\\b)", "Rainbow Six ")
      .replaceAll("(?i)(\\bLEGO Star Wars III\\b)", "LEGO Star Wars 3 ")
      .replaceAll("(?i)(\\bEpisodes From Liberty City\\b)", "Liberty")
      .replaceAll("(?i)(\\bIIII\\b)", "4")
      .replaceAll("(?i)(\\bGW\\b)", "Garden Warfare ")
      .replaceAll("(?i)(\\bGW2\\b)", "Garden Warfare 2")
      .replaceAll("(?i)((the|\\ba\\b)? Telltale(\\s+series)?(\\s+season)?)", " Telltale")
      .replaceAll(" +", " ")
      .replaceAll("[^\\d\\w]$", "")
      .trim()
      .replaceAll(EDGE_WORDS_REPLACEMENTS, "")
      .trim()
      .some
      .filterNot(_.isBlank)

  private def mapPlatform(listingDetails: ListingDetails): Option[String] =
    PLATFORMS_MATCH_REGEX
      .findFirstIn(listingDetails.title.withoutSpecialChars)
      .orElse(listingDetails.properties.get("Platform").map(_.split(",|/")(0)))
      .map(_.toUpperCase.trim)
      .map(_.replaceAll(" |-", ""))
      .map(platform => PLATFORM_MAPPINGS.getOrElse(platform, platform))
      .map(_.trim)

  private def mapGenre(listingDetails: ListingDetails): Option[String] =
    List(
      listingDetails.properties.get("Genre"),
      listingDetails.properties.get("Sub-Genre")
    )
      .filter(_.isDefined)
      .sequence
      .map(_.mkString(" / "))
      .filter(_.nonEmpty)

  implicit class StringOps(private val str: String) extends AnyVal {
    def withoutSpecialChars: String =
      str
        .replaceAll("100%$", "")
        .replaceAll("£\\d+(\\.\\d+)?", "")
        .replaceAll("é", "e")
        .replaceAll("\\P{Print}", "")
        .replaceAll("\\\\x\\p{XDigit}{2}", "")
        .replaceAll("[@~+%\"{}?_;`—–“”!•£&#’'*|.\\[\\]]", "")
        .replaceAll("[()/,:-]", " ")
        .replaceAll(" +", " ")
        .trim
  }
}
