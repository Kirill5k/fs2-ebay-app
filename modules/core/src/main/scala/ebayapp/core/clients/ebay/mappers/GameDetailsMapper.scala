package ebayapp.core.clients.ebay.mappers

import ebayapp.core.domain.ItemDetails.VideoGame
import ebayapp.core.domain.search.ListingDetails

private[mappers] object GameDetailsMapper {
  // format: off
  private val CONSOLE_REGEX_PATTERN = List(
    "(sony )?play( )?st(a)?(t)?(i)?(o)?(n)?(( )?(\\d|one|move))?",
    "\\bPS(-| )?(\\d|one)\\b",
    "(nintendo )?(switch(( )?2)?|\\bwii( u)?\\b)",
    "((m(i)?(c)?(r)?(o)?soft(s)?|\\bMS\\b) )?\\bX( )?(B)?(OX)?( )?(live|one( )?(x)?|(x)?(s)?( )?series( )?(s|x)?( )?(s|x)?|o(ne)?( x)?|\\d{1,3}|sx)\\b"
  ).mkString(
    "((new|(super )?rare|cheapest|excellent|official|select|enhanced|Officially Licensed) )?((very )?good )?(\\b(for|((also )?(works|only|playable|plays) )?on)\\b )?(",
    "|",
    ")( )?(game(s)?)?( )?(promo|classics|platform|lot|only|shooter|basketball|exclusive|console|edition|version|action|wrestling|football)?( game(s)?)?( new)?( )?(20\\d\\d)?"
  )

  private val LEVEL1_TITLE_WORDS_REPLACEMENTS = List(
    "(gold )?((greatest|playstation|ps) )?\\bhits\\b( (series|range|edition))?",
    "nintendo (selects|presents)",
    s"(?<=.{10})$CONSOLE_REGEX_PATTERN(?s).*",
    "(console )?\\bday\\b (one|1|zero|0)( (edition|\\be(d)?(i)?(t)?(i)?\\b))?(?s).*$",
    // remove edition and preceding word
    "(\\bVR\\b|\\bHD\\b|disk|Super Mario Mash Up|Sam Kerr|Shadow Of( The)? Erdtree|lifeline|UAC( pack)?|Michael Jordan|Legion Of Dawn|Fire Fades|Fully Loaded|Cross Gen|Higgs Variant|steel case|n(e)?xt l(e)?v(e)?l|headline|\\bel\\b \\w+|standar|nuketown|wild run|Lenticular Sleeve|lost|essential|exclusive|special|limited collectors|definitive|atlas|platinum|complete|std|classic(s)?|(\\d+th|ten year)? anniversary|remastered|elite|\\beu\\b|coll(ector(s)?)?|ltd|goty|(action )?game of|legacy( pro)?|(un)?limited|premium|((super|digital) )?deluxe|(\\w+)?ultimat).{0,20}(\\bCE\\b|\\bcoll(ection)?\\b|edn|edit(i)?on(s)?|\\be(d)?(i)?(t)?(i)?\\b)(?s).*$",
    "(?<=.{5})((new|pristine|\\binc\\b) )?(super|cheap( )?)?(free|fast|quick)?( )?(super( )?)?(prompt|free|fast|quick|(next|same|1|one) day|tracked|recorded|speedy|worldwide|bargain|\\bsc\\b|\\bfc\\b).{0,20}(dispatch|ship(ping)?|post(age)?|delivery|p( )?p).*$",
    "(?<=.{15})((brand )?new.{0,15})?(still )?((not |factory |un)?sealed|unopened|shrink( )?wrap)(?s).*$",
    "(?<=.{10})\\b(kids( \\w+)?|hack slash|single player|open world|Family Fun|basketball|((action|fun) )?adventure|console single|tactical|3rd person|(action )?rpg|fps|survival|action|racing|role|wrestling|(octagon|ultimate)? fighting|multi( )?player)\\b.{0,20}game(?s).*"
  ).mkString("(?i)", "|", "")

  private val LEVEL2_TITLE_WORDS_REPLACEMENTS = List(
    CONSOLE_REGEX_PATTERN,
    "(\\w+)?\\d{5,}(\\w+)?", "\\d{3,}\\s+\\d{4,}", "for playstation( )?vr(2)?", "((ps( )?)?(vr(2)?|move)|kinect|fit|balance board) (needed|required|compatible)",
    "requires kinect( sensor)?", "(dbl|double|dual|triple|twin|expansion|comb|mega).{0,10}(pass|pack|pk)",
    "new in (wrapper|wrapping|cellophane|packaging|box)( still wrapped)?",
    "Now Released(?s).*$", "Release date(?s).*$", "includes( free(?s).*$|.{0,20}pack(?s).*$| \\w+)", "amazon.{0,20}exclusive(?s).*$",
    "(royal mail )?(1st|2nd|first) class.*$",
    "(?<=\\w+ )((all|fully|this game is) )?((un)?boxed|complete) (\\bin\\b|with|case)(?s).*$",
    "exclusive to(?s).*$", "clean(ed)?( )?(fully )?tested",
    "((\\bC\\b )?\\bW\\b|with| inc(ludes)?|including|contain|((\\d|no) )?bonus|plus).{0,20}(game|insert|guide|dlc|pass|level|content|bonus|pack)(?s).*$",
    "(supplied|comes)?( )?(with(out)?|\\bW( )?(O)?\\b|in original|\\bno\\b|missing|\\bart\\b|official|plus|has|inc(l)?(udes|uding)?).{0,15}(strategy guide|book|original|instruction|card(s)?|box|map|slipcover|(slip )?case|manual)(?s).*$",
    "(both )?dis(c|k)(s)? (are|is|in)(?s).*$", "\\b(\\d|both)?( )?(dis(c|k)(s)?|cd(s)?)( (version|set|mint))?\\b",
    "(in )?((absolutely|near) )?(great|(very )?good|ex(cellent)?|amazing|nice|mint|superb|(full(y)? )?working|perfect|used|(fully )?tested|lovely|clean|immaculate|fantastic|\\bfab\\b|decent|fair|\\bV\\b)(?s).*{0,9}(dis(c|k)(s)?|working( (perfectly|fine))?|good|(working )?order|con(d)?(ition)?|perfectly|value|prices)",
    "(official\\s+)?(\\bUK\\b|\\bEU(R)?\\b|genuine|european|platinum|original|essentials)( (edition|region|release|new|only|seller|version|stock|import|copy))?( 20\\d\\d)?",
    // removes common publishers
    "((from|by) )?(Disney(s)?( )?Pixar(s)?|Outright Games|Pix N Love|proje(k|c)t red|rocksteady|Gearbox|Treyarch|Interactive Entertainment|WB Games|cideo|\\bTHQ\\b|Bethesda(s)?( Softworks)?|(EA|2k) (dice|music|sport(s)?|games)|Codemasters|Capcom|CD Projekt Red|red art|DC Comics|Take (Two|2)( (NG|Interactive))?|elect(r)?onic arts|Warner Bro(ther)?s|rockstar games|ubisoft|(bandai )?namco|Bend Studio|Crytek|EastAsiaSoft|Hideo Kojima|Naughty Dog|koch media|Activision( (NG|Blizzard))?|TOPLITZ PRODUCTIONS|square enix|hard copy|Dreamworks|Insomniac(s)?|lucasfilm|LucasArt(s)?)( (games|presents|publishing))?",
    "currys", "James Camerons", "\\bTom clan\\w+( S)?\\b", "Sid Meiers",
    "gamecube", "James Bond", "Peter Jacksons", "\\bMarvel( )?s\\b",
    "Microsoft(s)?( 20\\d\\d)?", "(by )?sony", "nintendo( \\d+)?", "Disneys", "Amazon(couk|com)?", "xbox()?(original)?",
    "\\d games in (one|1)",
    "(?<=\\b(W)?(2k)?\\d+)\\s+(20\\d\\d|wrestling|basketball|footbal)(?s).*", "(?<=FIFA( \\d\\d)?) (soccer|football)",
    "(?<=Minecraft) bedrock", "(?<=NBA) basketball", "(?<=WWE) wrestling",
    "(?<=(FIFA|NHL|Madden|MotoGP) )20(?=\\d\\d)",
    "(?<=Fifa 21.*) (NXT LVL|Next level)", "(?<=PGA Tour.*) golf.*", "(?<=Super meat)( )?(?=boy)",
    "(?<=harry potter).*years.*", "(?<=Gran)d(?= turismo)", "(?<=No Mans Sky) Beyond", "(?<=Mario) Plus(?= Rabbid)",
    "(?<=Grand Theft Auto (\\d|\\b[VI]{1,2}\\b)).*map.*", "(?<=just cause 3.*map.*", "\\bGT(S|\\d)?\\b .*(?=gran turismo)", "(?<=MX) (?=GP)",
    "(?<=Turismo( (\\d|sport))?) \\bGT(\\d|S)?\\b", "(?<=gears) of war(?= 5)", "bandicoot( CTR)? (?=team racing)",
    "(?<=cyber) (?=punk)", "(?<=Warhammer) (40k|40( )?000)", "zero dawn.*(?=forbidden)",
    "Formula (1|One)\\s+(?=F1)", "(?<=F1)\\s+(Formula( )?(one|1)?)( racing)?", "(?<=20\\d\\d).*formula(?s).*",
    "Marvel(s)?\\s+(?=(iron man|deadpool|Spider))", "(?<=Sonic) Hedgehog",
    "(?<=\\b[ivx]{1,4}\\b)(\\s+)\\d+", "(?<=\\d) \\b[ivx]{1,4}\\b", "(?<=1) \\bone\b",
    "COD\\s+(?=Call of duty)", "AC\\s+(?=assassins creed)", "ACNH\\s+(?=Animal Crossing New Horizons)",
    "(?<=resident evil (vii|7)).*biohazard.*", "(?<=Fallout 76) wastelanders","(?<=resident evil village) (8|VIII)", "(?<=resident evil) (8|VIII)(?= village)",
    // removes year from some titles
    "(?<=(need for speed|minecraft|\\bLEGO\\b|Tomb Raider|call of duty|gran turismo|assassins creed|tom clanc).*)20\\d\\d(?s).*"
  ).mkString("(?i)", "|", "")

  private val LEVEL3_TITLE_WORDS_REPLACEMENTS = List(
    // removes the word GAME
    "((new|\\ball\\b) )?(fully )?(((very|super) )?rare|strictly limited|exclusive|(limited|LTD) run|(\\d+( )?(x )?)?new|pal|physical|great|boxed|full|two|complete|\\bbase\\b|boxed complete) game(s)?( )?(\\d+|in one)?( new)?",
    "(\\b(\\d player|kids( \\w+)?|multiplayer|(active )?dance|puzzle|extreme sport(s)?|soccer|football sport|rally|driving|shooting|fighting|hacker|((car|motorbike|driving) )?racing|Skateboarding|action|hit|official|strategy|console|gold|(base )?main|children)\\b.{0,15})?(video( )?)?game(s)?( )?(for kids|series|film|racing|good|box(ed)?|(&)?watch|collection|console|of (year|olympic(s)?|movie))?( 20\\d\\d)?",
    "real driving simulator",
    // removes the word USED
    "((barely|condition|never|hardly|dlc|only) )?(un)?used( (once|twice))?(( very)? good)?( (game(s)?|condition))?",
    // removes the word VERSION
    "(official|exclusive|cartridge|20\\d\\d) version",
    // removes the word "BRAND NEW"
    "(sealed )?brand new( (condition|case|(factory )?sealed|still wrapped))?( in packaging)?( 20\\d\\d)?",
    // removes the word SEALED
    "(new )?(still )?((factory) )?(un)?sealed( in packaging)?",
    // removes DLCs
    "(Harley Quinn)? DLC",
    // removes remaster or similar
    "Re( )?(elect|Master|make)(ed)?( 20\\d\\d)?",
    "(s|c)ellophane wrapped", "free\\s+upgrade", "(official )?Strategy Combat( guide)?", "upgrade available",
    "(First Person|FPS|1st) Shooter", "(american|soccer) football( 20\\d\\d)?", "(racing|auto|golf|football) sport(s)?",
    "Adventure role playing", "ice hockey", "shoot em up", "Sport(s)? (skateboard|basketball|football( soccer)?)",
    "football soccer( sim(ulator)?)?", "action (action|survival|stealth|thriller)", "(car|motorcycles|rally) (Driving|Racing)",
    "((family fun|survival) )?Action Adventure( Open World)?", "(adventure )?survival horror", "fighting multiplayer",
    "(Multi|Single)( )?Player", "life simulation", "racing rally", "100 feedback",
    "\\bpegi( \\d+)?\\b(?s).*$",
    "((\\d+|ten)th|(10|20|ten))( year(s)?)? (anniversary|celebration)", "free gift",
    "\\d \\d players", "1 ONE", "(flash|xmas|christmas) sale", "Fun Kids Play( Console)?", "with all extras",
    "deleted title", "\\bID\\d+\\w", "SEEDESCRIPTIONFORDETAILS", "cheapest.*on ebay", "strategy guide", "ebays cheapest",
    "((Enhanced|Optimi(s|z)ed) for )?Series \\b(S|X)( )?(X|S)?\\b", "\\bRev\\d+\\b",
    "Formula One World Championship", "\\bNo Figure(s)?\\b",
    "platinum", "(16|18) years", "limited run( \\d+)?", "box( )?set", "pre( )?(release|owned|enjoyed|loved)",
    "Stric(t|k)ly limited", "Ultimate Fighting Champion(ship)?", "available now", "cross gen", "(inc|with)? Lenticular (cover|Sleeve)",
    "plays perfect", "100 trusted seller", "(Backward(s)? )?compatible( with)?", "(bundle|physical|1st|2nd) copy", "nuevo", "(big|steel)( )?box( version)?",
    "Scratch Free", "no scratches", "(map\\s+)?(manual(s)?|instructions)(\\s+map)?( (is|are))?( not)?( (included|missing))?",
    "100 ebayer", "(condition )?very good", "reorderable", "(posted|sent|dispatch).{0,10}day( all orders placed)?( by \\d pm)?",
    "(last one )?in stock( now)?", "never( been)? (opened|played)", "(only )?played (once|twice)",
    "(great|best) price( on ebay)?", "Special Reserve", "Expertly Refurbished Product", "(quality|value) guaranteed",
    "(trusted )?(eBay|best|from ebays biggest) (shop|Seller)(s)?", "fully (working|tested)", "Order By 4pm",
    "directors cut", "original", "english( language)?( version)?", "(limited )?amazing offer",
    "deluxe", "standard", "Official(l)?(y)? Licen(s|c)ed", "machine cleaned", "Reuse Reduce Recycle",
    "deluxe", "standard", "Official(l)?(y)? Licen(s|c)ed", "machine cleaned", "Reuse Reduce Recycle",
    "\\bctr\\b", "\\bgoty\\b", "mult(i)?( )?lang(uage)?(s)?( in game)?", "(in )?\\bvg(c| con(d)?(ition)?)?\\b( condition)?",
    "(with )?(fast|free|(1|one|same|next)( )?day)( )?(delivery|dispatch|post(age)?|\bPO\\b)", "for kids",
    "fast free", "blu( )?ray( film)?", "Console Exclusive", "playable on", "Definitive Experience", "Highly Rated",
    "essentials", "Re Mars tered", "booklet", "classic(s)?( (hit(s)?|version))?", "huge saving(s)?",
    "(\\bcase\\b|box|map).{0,20}(cart(ridge)?|included|complete|manual)", "(super|very|mega) rare", "award winning",
    "Instruction(s)? Book", "works (great|perfectly( fine)?)", "Unwanted Gift", "limited (release|quantity)",
    "region (free|1|2)", "gift idea", "in case", "add( |-)?on(( content)? pack)?", "jeu console",
    "\\brated \\d+\\b",  "\\b(Rated )?(For )?age(s)?( )?\\d+(\\s+over)?\\b", "must see", "3 for 2",
    "shrink( )?wrapped", "\\bcert( )?\\d+\\b", "no dlc(s)?( included)?", "dlc( not)? included",
    "(still )?in( (plastic|cellophane))? wrap(p)?(ing|er)", "\\d supplied", "see (pictures|photos|pics)", "Refurbished",
    "((region|europe) )?((R2( )?)?\\bPAL\\b|\\bNTSC\\b)( (\\d+|r2))?( (region|format|version))?",
    "\\ben\\b", "\\bcr\\b", "\\bnc\\b", "\\bfr\\b", "\\bes\\b", "\\ban\\b", "\\bLTD\\b", "\\bREF( )?(\\w)?( )?\\d+\\b",
    "\\b\\w+VG(C)?\\b", "\\bns\\b", "\\b(B)?NW(O)?T\\b", "\\bnsw\\b", "\\bsft\\b", "uac pack",
    "\\bsave s\\b", "\\bdmc\\b", "\\bBNI(B|P)\\b", "\\bNSO\\b", "\\bNM\\b", "\\bLRG(( )?\\d+)?\\b",
    "\\bWAR L\\d+\\b", "\\bUE\\b", "\\bBN(S)?\\b", "\\bRRP\\b(\\s|\\d)*",
    "(ultra )?\\b(u)?hd(r)?\\b", "(\\b4k\\b|\\bone x\\b)( enhanced)?", "\\buns\\b", "\\bx360\\b",
    "\\bstd\\b", "\\bpsh\\b", "\\bAMP\\b", "\\bRPG\\b", "\\bBBFC\\b", "\\bPG(13)?\\b", "\\bDVD\\b",
    "\\bSE\\b", "\\bPA2\\b", "\\bWi1\\b", "\\bENG\\b", "\\bVGWO\\b", "\\bFPS\\b", "\\b(PS( |\\d)?)?VR(2)?\\b( (version|virtual reality))?",
    "\\bDEFY\\b", "\\bArgos\\b", "\\bGD\\b", "\\bSRG(\\d+)?\\b", "\\bEA(N)?\\b", "\\bGC\\b", "\\bCIB\\b",
    "\\bFOR PC\\b", "\\bLOT 2\\b", "\\bSO4\\b", "\\bT18\\b", "(?<=\\d)PS\\d", "\bXBOX\b", "\bCASED\b",
    "(100 )?((all|fully) )?complete( (map|mint|instructions|package))?", "(condition )?NEW(\\s+)?$"
  ).mkString("(?i)", "|", "")

  private val EDGE_WORDS_REPLACEMENTS = List(
    "Playstation( \\d)?\\s+(?=PS)", "^genuine ", "^bnwt ", "^(brand|condition) new ", "^Pristine",
    "^\\w+ condition ", "^(((brand )?NEW|BNIB|Factory) )?(UN)?SEALED( in Packaging)?( )?",
    s"^(\\d+ )?$CONSOLE_REGEX_PATTERN", "Standart$", "^SALE", "((condition|brand) )?new$",
    "^(UN)?BOXED", "^NEW", "^best", "^\\bread\\b", "^software", "^un( )?opened", "un( )?opened$",
    "((super|very) )?rare$", "^((super|very) )?rare", "official$", "^bargain", "bargain$",
    "(near )?mint$", "\\bfor\\b$", "premium$", "\\bVERY\\b$", "\\bLIMITED\\b$",
    "(cleaned )?(fully )?(un)?tested$", "\\bON\\b$", "\\bBY\\b$", "^cheap(est)?( on ebay)?",
    "boxed$", "brand$", "good$", "brilliant$", "excellent$", "(fully )?working$",
    "immaculate$", "instructions$", "superb$", "marvel$", "combo$", "^mint", "^sale", "^boxed",
    "^NA ",
  ).mkString("(?i)", "|", "")

  private val SEPARATORS = List(
    "(?<=Far)(?=Cry)", "(?<=Star)(?=Wars)", "(?<=Mario)(?=Kart)", "(?<=Pro)(?=Street)", "(?<=player)(?=unknown)",
    "(?<=south)(?=park)", "(?<=Super)(?=Heroes)", "(?<=Rock)(?=Band)", "(?<=My)(?=Sims)", "(?<=Nier)(?=Automata)",
    "(?<=Race)(?=driver grid)", "(?<=(NBA|FIFA))(?=\\d+)", "(?<=BOX)(?=VR)", "(?<=WATCH)(?=DOGS)",
    "(?<=PES)(?=20\\d\\d)", "(?<=MICRO)(?=MACHINES)", "(?<=ARK)(?=PARK)",
    "(?<=BACK)(?=4BLOOD)", "(?<=BACK( )?4)(?=BLOOD)",
    "(?<=Dragon)(?=Ball)"
  ).mkString("(?i)", "|", "")
  // format: on

  private val PLATFORMS_MATCH_REGEX = List(
    "(?<![a-zA-Z])PS( )?[1-5]",
    "PLAY( )?STATION(\\s+)?([1-5](?!\\d+)|one)",
    "PSVR(2)?( virtual reality)?",
    "NINTENDO \\bSWITCH(( )?2)?\\b",
    "\\bSWITCH(( )?2)?\\b",
    "\\bWII( )?U\\b",
    "\\bWII\\b",
    "SERIES( )?\\b(X|S)( )?(X|S)?\\b",
    "XBOX(?= 20\\d\\d)",
    "X( )?B(OX)?(\\s+)?((X )?SERIES|X|ONE|\\d+)",
    "X360",
    "XBOX"
  ).mkString("(?i)", "|", "").r

  private val PLATFORM_MAPPINGS: Map[String, String] = Map(
    "PLAYSTATION5"           -> "PS5",
    "PLAYSTATION4"           -> "PS4",
    "PLAYSTATION3"           -> "PS3",
    "PLAYSTATION2"           -> "PS2",
    "PLAYSTATION"            -> "PS",
    "PS5"                    -> "PS5",
    "PS4"                    -> "PS4",
    "PS3"                    -> "PS3",
    "PS2"                    -> "PS2",
    "PS"                     -> "PS",
    "PSONE"                  -> "PS",
    "PSVR"                   -> "PS",
    "SONYPLAYSTATION5"       -> "PS5",
    "SONYPLAYSTATION4"       -> "PS4",
    "SONYPLAYSTATION3"       -> "PS3",
    "SONYPLAYSTATION2"       -> "PS2",
    "SONYPLAYSTATION1"       -> "PS",
    "SONYPLAYSTATION"        -> "PS",
    "PLAYSTATIONONE"         -> "PS",
    "NINTENDOSWITCH2"        -> "SWITCH 2",
    "SWITCH2"                -> "SWITCH 2",
    "NINTENDOSWITCH"         -> "SWITCH",
    "XBOXSERIES"             -> "XBOX",
    "XBOXXSERIES"            -> "XBOX",
    "SERIESX"                -> "XBOX",
    "SERIESXS"               -> "XBOX",
    "XBOX1"                  -> "XBOX ONE",
    "XBOX360"                -> "XBOX 360",
    "XB1"                    -> "XBOX ONE",
    "XB360"                  -> "XBOX 360",
    "X360"                   -> "XBOX 360",
    "XBOXONE"                -> "XBOX ONE",
    "XBONE"                  -> "XBOX ONE",
    "MICROSOFTXBOXONE"       -> "XBOX ONE",
    "MICROSOFTXBOX360"       -> "XBOX 360",
    "MICROSOFTXBOX"          -> "XBOX",
    "MICROSOFTXBOXSERIESX|S" -> "XBOX",
    "XBOXX"                  -> "XBOX",
    "WIIU"                   -> "WII U",
    "WII"                    -> "WII"
  )

  def from(listingDetails: ListingDetails): VideoGame =
    VideoGame(
      name = sanitizeTitle(listingDetails.title).orElse(listingDetails.properties.get("Game Name")),
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
      .replaceFirst(
        "(?<=\\w+ )(\\s+)?(?i)\\w+(?=\\s+(\\be(d)?(i)?(t)?(i)?(o)?(n)?\\b|coll(ection)?)) (\\be(d)?(i)?(t)?(i)?(o)?(n)?\\b|\\bedn\\b|coll(ection)?)(?s).*$",
        ""
      )
      .replaceAll("(?i)\\bll\\b", "II")
      .replaceAll("(?i)\\blll\\b", "III")
      .replaceAll("(?i)(\\bww2|ww11\\b)", "wwii")
      .replaceAll("(?i)(\\bcod\\b)", "Call of Duty ")
      .replaceAll("(?i)(?<=Call of Duty )(?s).*World War (2|II)(?s).*", "WWII")
      .replaceAll("(?i)(\\bSF( )?6\\b)", "Street Fighter 7")
      .replaceAll("(?i)(\\bGT( )?7\\b)", "Gran Turismo 7")
      .replaceAll("(?i)(resident evil \\bVII\\b)", "Resident Evil 7")
      .replaceAll("(?i)(resident evil (8|\\bVIII\\b))", "Resident Evil Village")
      .replaceAll("(?i)(littlebigplanet)", "Little Big Planet")
      .replaceAll("(?i)(Read Dead Redemption)", "Red Dead Redemption")
      .replaceAll("(?i)(?<!WWE )(W2K)", "WWE 2k")
      .replaceAll("(?i)(\\bR6\\b)", "Rainbow Six")
      .replaceAll("(?i)Mortal Comba(t|r)", "Mortal Kombat")
      .replaceAll("(?i)(Hello Neighbour)", "Hello Neighbor")
      .replaceAll("(?i)((?<=f1 manager )(?=\\b\\d{2}\\b))", "20")
      .replaceAll("(?i)(witcher iii)", "witcher 3")
      .replaceAll("(?i)(wolfenstein (II|2))", "Wolfenstein")
      .replaceAll("(?i)(wafare|warefare)", "Warfare")
      .replaceAll("(?i)(as(s)?a(s)?(s)?in)", "Assassin")
      .replaceAll("(?i)(va(l)?(l)?hal(l)?a)", "Valhalla")
      .replaceAll("(?i)(World Rally Championship)", "WRC")
      .replaceAll("(?i)(\\bPVZ\\b)", "Plants vs Zombies ")
      .replaceAll("(?i)(\\bnsane\\b)", "N Sane")
      .replaceAll("(?i)(\\bmoto gp\\b)", "MotoGP")
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
      .replaceAll("(?i)(\\bMWIII\\b)", "MW3")
      .replaceAll("(?i)(\\bMWII\\b)", "MW2")
      .replaceAll("(?i)(Telltale(\\s+series)?(\\s+season)?)", "Telltale")
      .replaceAll("(?i)(Grand Theft Auto\\s+){2,}", "Grand Theft Auto ")
      .replaceAll(" +", " ")
      .replaceAll("[^\\d\\w]$", "")
      .trim()
      .replaceAll(EDGE_WORDS_REPLACEMENTS, "")
      .maybeNonBlank

  private def mapPlatform(listingDetails: ListingDetails): Option[String] =
    PLATFORMS_MATCH_REGEX
      .findFirstIn(listingDetails.title.withoutSpecialChars)
      .orElse(listingDetails.properties.get("Platform").map(_.split("[,/]")(0)))
      .map(_.toUpperCase.trim)
      .map(_.replaceAll("[ \\-]", ""))
      .map(platform => PLATFORM_MAPPINGS.getOrElse(platform, platform))
      .map(_.trim)
      .filterNot(_.equalsIgnoreCase("SEEDESCRIPTIONFORDETAILS"))

  private def mapGenre(listingDetails: ListingDetails): Option[String] =
    List(
      listingDetails.properties.get("Genre"),
      listingDetails.properties.get("Sub-Genre")
    ).flatten
      .mkString(" / ")
      .maybeNonBlank

  extension (str: String)
    def maybeNonBlank: Option[String] =
      Option.when(!str.isBlank)(str.trim)
    def withoutSpecialChars: String =
      str
        .replaceAll("ß", "b")
        .replaceAll("&#\\d+;", "")
        .replaceAll("#\\d{4,};", "")
        .replaceAll("100%$", "")
        .replaceAll("(?i)(\\bAND\\b| \\bA\\b(?!\\.)|\\bTHE\\b)", "")
        .replaceAll("£\\d+(\\.\\d+)?", "")
        .replaceAll("[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{Z}\\p{Cf}\\p{Cs}\\s]", " ")
        .replaceAll("é", "e")
        .replaceAll("\\P{Print}", "")
        .replaceAll("\\\\x\\p{XDigit}{2}", "")
        .replaceAll("[@~+%\"{}?_;`—–“”!•£#’'*|.\\[\\]]", "")
        .replaceAll("[\\\\()/&,:-]", " ")
        .replaceAll(" +", " ")
        .trim
}
