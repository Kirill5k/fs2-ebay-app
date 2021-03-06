package ebayapp.core.clients.ebay.mappers

import cats.implicits._
import ebayapp.core.domain.ItemDetails.Game
import ebayapp.core.domain.search.ListingDetails

private[mappers] object GameDetailsMapper {

  private val CONSOLE_REGEX_PATTERN =
    "((new|rare|cheapest|excellent|official|select) )?((very )?good )?(\\b(for|((also )?(works|only|playable|plays) )?on)\\b )?" +
      "((sony )?play( )?st(a)?(t)?(i)?(o)?(n)?(( )?(\\d|one|move))?|((microsoft|\\bms\\b) )?\\bx( )?(b)?(ox)?(( )?(live|(one (x)?)?series( )?(s|x)( )?(s|x)?|o(ne)?( x)?|\\d+))?\\b|\\bps( )?\\d\\b|(nintendo )?(switch|\\bwii( u)?\\b))" +
      "(( )?game(s)?)?( (promo|classics|platform|lot|only|shooter|basketball|exclusive|console|edition|version|action|wrestling|football))?( game(s)?)?( new)?( +20\\d\\d)?"

  private val LEVEL1_TITLE_WORDS_REPLACEMENTS = List(
    "(gold )?((greatest|playstation|ps) )?\\bhits\\b( (series|range|edition))?",
    "nintendo selects",
    s"(?<=.{10})$CONSOLE_REGEX_PATTERN(?s).*",
    "\\bday\\b (one|1|zero|0)( (edition|\\be(d)?(i)?(t)?(i)?\\b))?(?s).*$",
    //remove edition and preceding word
    "(\\bHD\\b|steel case|n(e)?xt l(e)?v(e)?l|headline|\\bel\\b \\w+|standar|nuketown|wild run|Lenticular Sleeve|lost|essential|exclusive|special|limited collectors|definitive|atlas|platinum|complete|std|classic(s)?|(\\d+th|ten year)? anniversary|remastered|elite|\\beu\\b|coll(ector(s)?)?|ltd|goty|(action )?game of|legacy( pro)?|(un)?limited|premium|((super|digital) )?deluxe|(\\w+)?ultimat).{0,20}(\\bCE\\b|\\bcoll(ection)?\\b|edn|edit(i)?on(s)?|\\be(d)?(i)?(t)?(i)?\\b)(?s).*$",
    "(?<=.{5})((new|pristine|\\binc\\b) )?(super|cheap( )?)?(free|fast|quick)?( )?(super( )?)?(prompt|free|fast|quick|(next|same|1|one) day|tracked|recorded|speedy|worldwide|bargain|\\bsc\\b|\\bfc\\b).{0,20}(dispatch|ship(ping)?|post(age)?|delivery|p( )?p).*$",
    "(?<=.{15})((brand )?new.{0,15})?(still )?((not |factory |un)?sealed|unopened|shrink( )?wrap)(?s).*$",
    "(?<=.{10})\\b(kids( \\w+)?|hack slash|single player|open world|Family Fun|basketball|(fun )?adventure|console single|tactical|3rd person|(action )?rpg|fps|survival|action|racing|role|wrestling|fighting|multi( )?player)\\b.{0,20}game(?s).*"
  ).mkString("(?i)", "|", "")

  private val LEVEL2_TITLE_WORDS_REPLACEMENTS = List(
    CONSOLE_REGEX_PATTERN,
    "\\d{5,}(\\w+)?",
    "\\d{3,}\\s+\\d{4,}",
    "for playstation( )?vr", "((ps( )?)?(vr|move)|kinect|fit|balance board) (needed|required|compatible)", "requires kinect( sensor)?",
    "(dbl|double|dual|triple|twin|expansion|comb|mega).{0,10}(pass|pack|pk)",
    "new in (wrapper|wrapping|cellophane|packaging|box)( still wrapped)?",
    "Now Released(?s).*$", "Release date(?s).*$",
    "includes( free(?s).*$|.{0,20}pack(?s).*$| \\w+)", "amazon.{0,20}exclusive(?s).*$",
    "(royal mail )?(1st|2nd|first) class.*$",
    "(?<=\\w+ )((all|fully) )?(boxed|complete) (\\bin\\b|with|case)(?s).*$",
    "exclusive to(?s).*$",
    "(\\bW\\b|with| inc(ludes)?|contain|bonus|plus).{0,20}(guide|dlc|pass|content|bonus|pack)(?s).*$",
    "(supplied|comes)? (with(out)?|\\bW( )?(O)?\\b|in original|\\bno\\b|missing|plus|has|inc(l)?(udes|uding)?).{0,15}(strategy guide|book|original|instruction|box|map|(slip )?case|manual)(?s).*$",
    "dis(c|k)(s)? (are|is|in)(?s).*$",
    "(in )?((absolutely|near) )?(great|(very )?good|incredible|ex(cellent)?|amazing|nice|mint|superb|(full(y)? )?working|perfect|used|(fully )?tested|lovely|clean|immaculate|fantastic|\\bfab\\b|decent|fair|\\bV\\b)(?s).*(dis(c|k)(s)?|working( (perfectly|fine))?|good|(working )?order|con(d)?(ition)?|value|prices)",
    "(\\bUK\\b|\\bEU\\b|genuine|european|platinum|original|essentials)( (edition|region|release|new|only|seller|version|stock|import|copy))?( 20\\d\\d)?",
    "cleaned( )?(fully )?tested",
    // removes common publishers
    "((from|by) )?(Disney(s)?( )?Pixar(s)?|rocksteady|Treyarch|Interactive Entertainment|WB Games|cideo|\\bTHQ\\b|Bethesda(s)?( Softworks)?|(EA|2k) (dice|music|sport(s)?|games)|Capcom|CD Projekt Red|DC Comics|Take (Two|2)( (NG|Interactive))?|elect(r)?onic arts|Warner Bro(ther)?s|rockstar games|ubisoft|(bandai )?namco|Bend Studio|EastAsiaSoft|Hideo Kojima|Naughty Dog|Activision( (NG|Blizzard))?|square enix|Dreamworks|Insomniac(s)?|LucasArt(s)?)( presents)?",
    "currys", "James Camerons", "\\bTom clan\\w+( S)?\\b", "gamecube", "James Bond", "Peter Jacksons", "\\bMarvel( )?s\\b", "Sid Meiers",
    "Microsoft( 20\\d\\d)?", "sony", "nintendo( \\d+)?", "Disneys", "Amazon(couk|com)?", "\\d games in (one|1)",
    "(?<=\\b(W)?(2k)?\\d+)\\s+(20\\d\\d|wrestling|basketball|footbal)(?s).*",
    "(?<=FIFA) (soccer|football)", "(?<=Minecraft) bedrock", "(?<=NBA) basketball", "(?<=WWE) wrestling", "(?<=(FIFA|NHL|Madden|MotoGP) )20(?=\\d\\d)",
    "(?<=F1)\\s+(Formula( )?(one|1)?)( racing)?", "(?<=20\\d\\d).*formula(?s).*",
    "(?<=Fifa 21.*) (NXT LVL|Next level)", "(?<=PGA Tour.*) golf.*",
    "(?<=Gran)d(?= turismo)", "(?<=No Mans Sky) Beyond", "(?<=Grand Theft Auto (\\d|\\b[VI]{1,2}\\b)).*map.*",
    "\\bGT(S|\\d)?\\b .*(?=gran turismo)", "(?<=Turismo( (\\d|sport))?) \\bGT(\\d|S)?\\b", "(?<=gears) of war(?= 5)",
    "bandicoot( CTR)? (?=team racing)", "(?<=resident evil (vii|7)).*biohazard.*",
    "(?<=Warhammer) (40k|40( )?000)", "Formula (1|One)\\s+(?=F1)", "Marvel(s)?\\s+(?=(iron man|deadpool|Spider))",
    "(?<=Sonic) Hedgehog", "Formula (1|One)\\s+(?=F1)", "Marvel(s)?\\s+(?=(iron man|deadpool|Spider))",
    "(?<=\\b[ivx]{1,4}\\b)(\\s+)\\d+", "(?<=\\d) \\b[ivx]{1,4}\\b", "(?<=1) \\bone\b",
    "(?<=resident evil village) (8|VIII)", "(?<=resident evil) (8|VIII) (?=village)",
    // removes year from some titles
    "(?<=(need for speed|minecraft|\\bLEGO\\b|Tomb Raider|call of duty|gran turismo|assassins creed|tom clanc).*)20\\d\\d(?s).*"
  ).mkString("(?i)", "|", "")

  private val LEVEL3_TITLE_WORDS_REPLACEMENTS = List(
    // removes the word GAME
    "((new|all) )?(fully )?(((very|super) )?rare|strictly limited|exclusive|limited run|(\\d+ )?new|pal|physical|great|boxed|full|two|complete|boxed complete) game(s)?( (\\d+|in one))?( new)?",
    "(\\b(\\d player|kids( \\w+)?|multiplayer|football sport|rally|driving|shooting|fighting|hacker|(car )?racing|Skateboarding|action|hit|official|strategy|console|gold|(base )?main|children)\\b.{0,15})?(video( )?)?game(s)?( (for kids|series|film|racing|good|boxed|collection|console|of (year|olympic(s)?|movie)))?( 20\\d\\d)?",
    // removes the word USED
    "((barely|condition|never|hardly|dlc) )?(un)?used( (once|twice))?(( very)? good)?( (game(s)?|condition))?",
    // removes the word VERSION
    "(official|20\\d\\d) version",
    // removes the word "BRAND NEW"
    "(sealed )?brand new( (condition|case|(factory )?sealed|still wrapped))?( in packaging)?( 20\\d\\d)?",
    // removes the word SEALED
    "(new )?(still )?((factory) )?sealed( in packaging)?", "(s|c)ellophane wrapped",
    "(official )?Strategy Combat( guide)?", "(First Person|FPS|1st) Shooter", "(american|soccer) football( 20\\d\\d)?", "(racing|auto|golf|football) sport(s)?",
    "Adventure role playing", "ice hockey", "shoot em up", "Sport(s)? (skateboard|basketball|football)", "football soccer( sim(ulator)?)?", "action stealth", "(car|motorcycles|rally) (Driving|Racing)",
    "((family fun|survival) )?Action Adventure( Open World)?", "(adventure )?survival horror", "fighting multiplayer", "Multi Player", "life simulation", "racing rally",
    "\\bpegi( \\d+)?\\b(?s).*$", "((\\d+|ten)th|(20|ten))( year(s)?)? (anniversary|celebration)", "\\b(\\d|both)?( )?(dis(c|k)(s)?|cd(s)?)( (version|set|mint))?\\b",
    "\\d \\d players", "1 ONE", "flash sale", "Fun Kids Play( Console)?", "with all extras", "free gift",
    "\\bID\\d+\\w", "SEEDESCRIPTIONFORDETAILS", "cheapest.*on ebay", "strategy guide", "((Enhanced|Optimi(s|z)ed) for )?Series \\b(S|X)\\b",
    "platinum", "(16|18) years", "limited run( \\d+)?", "box( )?set", "pre( )?(release|owned|enjoyed|loved)",
    "Ultimate Fighting Champion(ship)?", "available now", "cross gen", "Lenticular (cover|Sleeve)", "plays perfect", "100 trusted seller",
    "(Backward(s)? )?compatible", "(bundle|physical) copy", "nuevo", "(big|steel)( )?box( version)?", "Scratch Free", "no scratches", "(map\\s+)?(manual(s)?|instructions)(\\s+map)?( (is|are))?( not)?( (included|missing))?",
    "100 ebayer", "(condition )?very good", "reorderable", "(posted|sent|dispatch).{0,10}day( all orders placed)?( by \\d pm)?", "(last one )?in stock( now)?",
    "never( been)? (opened|played)", "(only )?played (once|twice)", "(great|best) price( on ebay)?", "Special Reserve", "Expertly Refurbished Product", "(quality|value) guaranteed",
    "(trusted )?(eBay|best|from ebays biggest) (shop|Seller)(s)?", "fully (working|tested)", "Order By 4pm", "Ultimate Fighting Championship",
    "remaster(ed)?( 20\\d\\d)?", "directors cut", "original", "english( language)?( version)?", "deluxe", "standard", "Official(l)?(y)? Licen(s|c)ed", "machine cleaned",
    "\\bctr\\b", "\\bgoty\\b", "mult(i)?( )?lang(uage)?(s)?( in game)?", "(with )?(fast|free|(1|one|same|next)( )?day)( )?(delivery|dispatch|post|\bPO\\b)", "for kids",
    "fast free", "blu( )?ray( film)?", "Console Exclusive", "playable on", "Definitive Experience", "Highly Rated", "essentials", "Re Mars tered", "booklet",
    "classic(s)?( (hit(s)?|version))?", "(case|box).{0,20}(complete|manual)", "(super|very) rare", "award winning", "Instruction(s)? Book", "works perfectly( fine)?",
    "Unwanted Gift", "limited (release|quantity)", "region (free|1|2)", "gift idea", "in case", "add( |-)?on(( content)? pack)?", "jeu console", "\\b(Rated )?(For )?age(s)?( )?\\d+(\\s+over)?\\b",
    "must see", "see (pictures|photos|pics)", "Refurbished", "shrink( )?wrapped", "\\bcert( )?\\d+\\b", "no dlc(s)?( included)?", "(still )?in wrap(p)?(ing|er)",
    "\\brated \\d+\\b", "\\d supplied", "((region|europe) )?(\\bPAL\\b|\\bNTSC\\b)( (\\d+|r2))?( (region|format|version))?", "\\ben\\b", "\\bcr\\b", "\\bnc\\b",
    "\\bfr\\b", "\\bes\\b", "(in )?\\bvg(c| con(d)?(ition)?)?\\b( condition)?", "\\ban\\b", "\\bLTD\\b", "\\b\\w+VG(C)?\\b", "\\bns\\b", "\\b(B)?NW(O)?T\\b",
    "\\bnsw\\b", "\\bsft\\b", "\\bsave s\\b", "\\bdmc\\b", "\\bBNI(B|P)\\b", "\\bNSO\\b", "\\bNM\\b", "\\bLRG\\b(( )?\\d+)?", "\\bWAR L\\d+\\b",
    "\\bUE\\b", "\\bBN(S)?\\b", "\\bRRP\\b(\\s|\\d)*", "\\bremake\\b( 20\\d\\d)?", "(ultra )?\\b(u)?hd(r)?\\b", "(\\b4k\\b|\\bone x\\b)( enhanced)?",
    "\\buns\\b", "\\bx360\\b", "\\bstd\\b", "\\bpsh\\b", "\\bAMP\\b", "\\bRPG\\b", "\\bBBFC\\b", "\\bPG(13)?\\b", "\\bDVD\\b", "\\bSE\\b",
    "\\bPA2\\b", "\\bWi1\\b", "\\bENG\\b", "\\bVGWO\\b", "\\bFPS\\b", "\\b(PS( )?)?VR\\b( version)?", "\\bDEFY\\b", "\\bArgos\\b",
    "\\bSRG(\\d+)?\\b", "\\bEA(N)?\\b", "\\bGC\\b", "\\bCIB\\b", "\\bFOR PC\\b", "\\bLOT 2\\b", "\\bSO4\\b", "\\bT18\\b",
    "(?<=\\d)PS\\d",
    "(100 )?((all|fully) )?complete( (map|mint|instructions|package))?", "(condition )?NEW(\\s+)?$"
  ).mkString("(?i)", "|", "")

  private val EDGE_WORDS_REPLACEMENTS = List(
    "Playstation( \\d)?\\s+(?=PS)",
    "^genuine ",
    "^bnwt ", "^(brand|condition) new ",
    "^\\w+ condition ",
    "^(((brand )?NEW|BNIB|Factory) )?SEALED( in Packaging)?( )?",
    s"^(\\d+ )?$CONSOLE_REGEX_PATTERN",
    "Standart$", "^SALE", "((condition|brand) )?new$", "^BOXED", "^NEW", "^best", "^software", "^un( )?opened",
    "un( )?opened$", "((super|very) )?rare$", "^((super|very) )?rare", "official$", "^bargain", "bargain$", "(near )?mint$", "\\bfor\\b$",
    "premium$", "\\bVERY\\b$", "\\bLIMITED\\b$", "(cleaned )?(fully )?(un)?tested$", "\\bON\\b$", "\\bBY\\b$", "^cheap(est)?( on ebay)?",
    "boxed$", "brand$", "good$", "brilliant$", "excellent$", "(fully )?working$", "immaculate$", "instructions$", "superb$", "marvel$", "^mint"
  ).mkString("(?i)", "|", "")

  private val SEPARATORS = List(
    "(?<=Far)(?=Cry)", "(?<=Star)(?=Wars)", "(?<=Mario)(?=Kart)", "(?<=Pro)(?=Street)", "(?<=player)(?=unknown)", "(?<=south)(?=park)",
    "(?<=Super)(?=Heroes)", "(?<=Rock)(?=Band)", "(?<=My)(?=Sims)", "(?<=Nier)(?=Automata)", "(?<=Race)(?=driver grid)",
    "(?<=(NBA|FIFA))(?=\\d+)", "(?<=BOX)(?=VR)", "(?<=WATCH)(?=DOGS)", "(?<=PES)(?=20\\d\\d)", "(?<=MICRO)(?=MACHINES)"
  ).mkString("(?i)", "|", "")

  private val PLATFORMS_MATCH_REGEX = List(
    "PS[1-5]", "PLAYSTATION(\\s+)?([1-5](?!\\d+)|one)", "PSVR",
    "NINTENDO SWITCH", "SWITCH",
    "\\bWII( )?U\\b", "\\bWII\\b",
    "SERIES \\bX\\b",
    "X( )?B(OX)?(\\s+)?((X )?SERIES|X|ONE|\\d+)",
    "X360", "XBOX"
  ).mkString("(?i)", "|", "").r

  private val PLATFORM_MAPPINGS: Map[String, String] = Map(
    "PS5"              -> "PLAYSTATION5",
    "PS4"              -> "PLAYSTATION4",
    "PS3"              -> "PLAYSTATION3",
    "PS2"              -> "PLAYSTATION2",
    "PS"               -> "PLAYSTATION",
    "PSVR"             -> "PLAYSTATION",
    "SONYPLAYSTATION5" -> "PLAYSTATION5",
    "SONYPLAYSTATION4" -> "PLAYSTATION4",
    "SONYPLAYSTATION3" -> "PLAYSTATION3",
    "SONYPLAYSTATION2" -> "PLAYSTATION2",
    "SONYPLAYSTATION1" -> "PLAYSTATION",
    "SONYPLAYSTATION"  -> "PLAYSTATION",
    "PLAYSTATIONONE"   -> "PLAYSTATION",
    "NINTENDOSWITCH"   -> "SWITCH",
    "XBOXSERIES"       -> "XBOX",
    "XBOXXSERIES"      -> "XBOX",
    "SERIESX"          -> "XBOX",
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
    "XBOXX"             -> "XBOX",
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
      .replaceAll("(?i)(\\bFormula 1\\b)", "F1")
      .replaceAll(EDGE_WORDS_REPLACEMENTS, "")
      .replaceAll(LEVEL1_TITLE_WORDS_REPLACEMENTS, "")
      .replaceAll(LEVEL2_TITLE_WORDS_REPLACEMENTS, "")
      .replaceAll(LEVEL3_TITLE_WORDS_REPLACEMENTS, "")
      .replaceAll(SEPARATORS, " ")
      .replaceFirst("(?<=\\w+ )(\\s+)?(?i)\\w+(?=\\s+(\\be(d)?(i)?(t)?(i)?(o)?(n)?\\b|coll(ection)?)) (\\be(d)?(i)?(t)?(i)?(o)?(n)?\\b|\\bedn\\b|coll(ection)?)(?s).*$", "")
      .replaceAll("(?i)\\bll\\b", "II")
      .replaceAll("(?i)\\blll\\b", "III")
      .replaceAll("(?i)(?<=Call of Duty )(?s).*World War (2|II)(?s).*", "WWII")
      .replaceAll("(?i)(resident evil 8)", "Resident Evil Village")
      .replaceAll("(?i)(littlebigplanet)", "Little Big Planet")
      .replaceAll("(?i)(littlebigplanet)", "Little Big Planet")
      .replaceAll("(?i)(Read Dead Redemption)", "Red Dead Redemption")
      .replaceAll("(?i)(W2K)", "WWE 2k")
      .replaceAll("(?i)Mortal Comba(t|r)", "Mortal Kombat")
      .replaceAll("(?i)(Hello Neighbour)", "Hello Neighbor")
      .replaceAll("(?i)(witcher iii)", "witcher 3")
      .replaceAll("(?i)(wolfenstein 2)", "Wolfenstein II")
      .replaceAll("(?i)(wafare|warefare)", "Warfare")
      .replaceAll("(?i)(as(s)?a(s)?(s)?in)", "Assassin")
      .replaceAll("(?i)(va(l)?(l)?hal(l)?a)", "Valhalla")
      .replaceAll("(?i)(diablo 3)", "diablo iii")
      .replaceAll("(?i)(\\bpart 2\\b)", "Part II")
      .replaceAll("(?i)(World Rally Championship)", "WRC")
      .replaceAll("(?i)(\\bPVZ\\b)", "Plants vs Zombies ")
      .replaceAll("(?i)(\\bnsane\\b)", "N Sane")
      .replaceAll("(?i)(\\bmoto gp\\b)", "MotoGP")
      .replaceAll("(?i)(\\bww2|ww11\\b)", "wwii")
      .replaceAll("(?i)(\\bcod\\b)", "Call of Duty ")
      .replaceAll("(?i)(?<=(^| ))RDR( )?(?=\\d)?", "Red Dead Redemption ")
      .replaceAll("(?i)(?<=(^| ))GTA( )?(?=\\d)?", "Grand Theft Auto ")
      .replaceAll("(?i)(\\bMGS\\b)", "Metal Gear Solid ")
      .replaceAll("(?i)(\\bRainbow 6\\b)", "Rainbow Six ")
      .replaceAll("(?i)(\\bLEGO Star Wars III\\b)", "LEGO Star Wars 3 ")
      .replaceAll("(?i)(\\bEpisodes From Liberty City\\b)", "Liberty")
      .replaceAll("(?i)(\\bIIII\\b)", "4")
      .replaceAll("(?i)(nitro( )?fuelled)", "Nitro Fueled")
      .replaceAll("(?i)(\\bGW\\b)", "Garden Warfare ")
      .replaceAll("(?i)(\\bGW2\\b)", "Garden Warfare 2")
      .replaceAll("(?i)(Telltale(\\s+series)?(\\s+season)?)", "Telltale")
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
      .filterNot(_.equalsIgnoreCase("SEEDESCRIPTIONFORDETAILS"))

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
        .replaceAll("&#\\d+;", "")
        .replaceAll("100%$", "")
        .replaceAll("(?i)(\\bAND\\b|\\bA\\b(?!\\.)|\\bTHE\\b)", "")
        .replaceAll("£\\d+(\\.\\d+)?", "")
        .replaceAll("[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{Z}\\p{Cf}\\p{Cs}\\s]", " ")
        .replaceAll("[\uD83C-\uDBFF\uDC00-\uDFFF]", " ")
        .replaceAll("é", "e")
        .replaceAll("\\P{Print}", "")
        .replaceAll("\\\\x\\p{XDigit}{2}", "")
        .replaceAll("[@~+%\"{}?_;`—–“”!•£&#’'*|.\\[\\]]", "")
        .replaceAll("[\\\\()/,:-]", " ")
        .replaceAll(" +", " ")
        .trim
  }
}
