/* THE KNOWN WORLD — an ALLEGIANCE map: who each land answers to as the story
   turns. Polygons are drawn generously past the coast in image-pixel space and
   clipped to dry land by assets/landmask.png (white = land). Toggled from The
   Map dropdown.

   The realm opens WHOLE: every kingdom of Westeros answers to the Iron Throne
   (gold) while Robert lives. Then the kings rise and it splits — Robb's grey
   North and riverlands, Renly's emerald south, Stannis's dark-sea claim, the
   krakens' violet reavings — and keeps moving to the very last council.

   Each territory: `base` ruler + optional `own` ([season, episode, ruler]) and
   `ownBook` ([book, chapter, ruler]) timelines — from that point the land
   answers to the new ruler until the next entry; null dissolves the territory
   into whatever lies beneath it. `sub: true` marks campaign overlays (armies,
   occupations) drawn solid ON TOP of the kingdom below; `nomask: true` skips
   the land-mask (Dragonstone's isle, which the mask can miss).
   Show timelines follow the episodes; book timelines follow Martin's chapters
   (verified against awoiaf.westeros.org & gameofthrones.fandom.com — e.g. the
   ironborn hold Deepwood/Moat Cailin until ADWD, the crown storms Dragonstone
   in AFFC, the Golden Company lands on Cape Wrath at ADWD's end). */

const RULERS = {
  "iron-throne":    { name: "The Iron Throne",                        color: "#e0a410" },
  "stark":          { name: "The King in the North (House Stark)",    color: "#5a6472" },
  "tully":          { name: "House Tully",                            color: "#2e5fcc" },
  "frey":           { name: "House Frey, for the crown",              color: "#a9825b" },
  "arryn":          { name: "House Arryn (the Vale keeps its own)",   color: "#35b6e8" },
  "lannister":      { name: "House Lannister",                        color: "#c9141f" },
  "targaryen":      { name: "House Targaryen",                        color: "#4a0f18" },
  "baratheon":      { name: "House Baratheon",                        color: "#1f8a8a" },
  "stannis":        { name: "Stannis Baratheon, the rightful heir",   color: "#0f5460" },
  "renly":          { name: "Renly Baratheon, king in Highgarden",    color: "#3fbf6e" },
  "tyrell":         { name: "House Tyrell",                           color: "#4c8a22" },
  "greyjoy":        { name: "House Greyjoy",                          color: "#7a3fb0" },
  "bolton":         { name: "House Bolton, Wardens of the North",     color: "#c75b7a" },
  "martell":        { name: "House Martell",                          color: "#e06414" },
  "nights-watch":   { name: "The Night's Watch",                      color: "#9fb1c4" },
  "white-walkers":  { name: "The White Walkers",                      color: "#b7cfdd" },
  "free-folk":      { name: "The Free Folk",                          color: "#77876f" },
  "brotherhood":    { name: "The Brotherhood Without Banners",        color: "#26221e" },
  "masters":        { name: "The Masters",                            color: "#8a6d3b" },
  "golden-company": { name: "The Golden Company, for Aegon",          color: "#9c6f1b" },
};

const TERRITORIES = [

  /* ---------------- beyond the Wall ----------------
     ONE land, not three (Aug 2026, at the owner's request). It used to be cut
     into three horizontal bands — "The Lands of Always Winter", "the haunted
     forest, deep" and "the haunted forest" — which fell to the dead one after
     another. Three bands meant three seams to keep identical and, worse, a
     permanent pale stripe across the top of the map, as though the Others were
     standing in the far north at every hour of the story.

     Now it is a single country called what everyone in the books calls it, and
     it belongs to the free folk, who are the only people who actually live
     there. It answers to the Others ONLY while they are abroad: from the
     massacre at Hardhome (S5E8) — the hour the free folk abandon the lands
     beyond the Wall altogether — to the dawn after the Long Night (S8E4). In
     the books' telling the turn is the Fist of the First Men (ASOS ch 1).

     The top edge is now the top of the chart: the basemap draws dry land right
     up to y=0 (x 624-1296), which the old y=40 line left unpainted. */
  { id: "beyond-the-wall", name: "Beyond the Wall", base: "free-folk",
    own: [[5,8,"white-walkers"],[8,4,"free-folk"]],
    ownBook: [[3,1,"white-walkers"]],
    pts: [[240,0],[1660,0],[1660,240],[1620,252],[1546,248],[1424,262],[1300,272],[1180,285],[1100,310],[950,340],[700,350],[400,360],[260,300]] },

  /* ---------------- the North ----------------
     The crown's while Robert lives; Robb's when the banners rise; Bolton by
     royal decree after the Red Wedding; Stark again after the bastards fight. */
  /* Timing corrected: SHOW — Robb is crowned "King in the North" in the S1E10
     finale (not E8), and the North passes to the Boltons at the Red Wedding,
     S3E9 "The Rains of Castamere" (not E10). BOOK — "The King in the North!"
     is AGOT ch 72 (Catelyn XI), and the North falls to Bolton at the Red
     Wedding, ACOK... no: ASOS ch 52 (Catelyn VII, where Roose himself gives
     Robb the blade) — previously mis-set to ch 58 and ch 55, both unrelated
     POV chapters (Sansa/Davos). */
  { id: "the-north", name: "The North", base: "iron-throne",
    own: [[1,10,"stark"],[3,9,"bolton"],[6,9,"stark"]],
    ownBook: [[1,72,"stark"],[3,52,"bolton"]],
    /* NE corner covers the Grey Cliffs; the top edge now also hugs the Gift's
       eastern edge up to (1645,340) so there is no untenanted spit between the
       Gift and the North on the Bay of Seals. */
    pts: [[360,380],[950,340],[1040,458],[1100,446],[1180,421],[1300,408],[1424,398],[1546,384],[1620,388],[1660,390],[1720,405],[1950,445],[1950,1230],[1600,1255],[1400,1240],[1250,1232],[1100,1258],[900,1285],[830,1310],[720,1352],[600,1362],[500,1345],[420,1330],[360,1335]] },
  /* Skagos, Skane and the small northern isles — trimmed so the polygon stays
     over the islands (north of the North's mainland top edge) instead of
     dipping south to y≈480 onto the Grey Cliffs, where its fill used to overlap
     the North's and darken under the multiply blend. The Bay of Seals water
     between island and mainland is clipped away by the land mask. */
  { id: "the-north-isles", name: "Skagos & the northern isles", base: "iron-throne",
    own: [[1,10,"stark"],[3,9,"bolton"],[6,9,"stark"]],
    ownBook: [[1,72,"stark"],[3,52,"bolton"]],
    pts: [[1670,150],[1950,140],[1950,415],[1760,420],[1690,315]] },

  /* THE GIFT AND THE NEW GIFT — the Watch's two bands south of the Wall.
     Redrawn twice in Aug 2026, and the second time is the one that matters.
     They were briefly two flat rectangles, which the owner rightly called
     awful: a grey slab floating in the middle of the North with sea on either
     side of it, painted ON TOP of the North rather than beside it, and dark
     enough to bury the chart's own printed "Castle Black".

     They are now three bands that TILE, sharing their edges point for point so
     there is neither a seam nor a doubled multiply:

         beyond the Wall     …its southern edge is
         the Gift            …whose southern edge, 68px on, is
         the New Gift        …whose southern edge, 68px on, is
         the North           …top edge

     Change one of those edges and you must change the two that touch it.

     The depth is not arbitrary: the Wall is 100 leagues long and spans
     x1272-x1547 on this chart, so it runs at 2.75 pixels to the league, and
     each grant is 25 leagues — about 68px. East and west the bands are drawn
     well out past both coasts (x 1040 and x 1660) and the land mask cuts them
     at the shoreline, which is how every polygon in this file is built. That
     is what puts them on the water's edge at both ends instead of stopping in
     open country.

     Overrun when the Wall falls, restored at the dawn. */
  { id: "the-gift", name: "The Gift", base: "nights-watch",
    own: [[7,7,"white-walkers"],[8,4,"nights-watch"]],
    pts: [[1040,322],[1100,310],[1180,285],[1300,272],[1424,262],[1546,248],[1620,252],[1660,254],[1660,322],[1620,320],[1546,316],[1424,330],[1300,340],[1180,353],[1100,378],[1040,390]] },
  { id: "the-new-gift", name: "The New Gift", base: "nights-watch",
    own: [[7,7,"white-walkers"],[8,4,"nights-watch"]],
    pts: [[1040,390],[1100,378],[1180,353],[1300,340],[1424,330],[1546,316],[1620,320],[1660,322],[1660,390],[1620,388],[1546,384],[1424,398],[1300,408],[1180,421],[1100,446],[1040,458]] },

  /* Theon's prize: Winterfell and its heartland, held for one bloody season.
     BOOK seizure corrected to ACOK ch 38 (Theon III, "Theon Greyjoy takes his
     foster home with twenty men") — previously ch 37, which is Tyrion VIII
     ("Stannis has sailed"), a King's Landing chapter. It ends ch 67 (Theon VI,
     Ramsay sacks and burns Winterfell). */
  { id: "winterfell-heart", name: "Winterfell & its heartland", base: null, sub: true,
    own: [[2,6,"greyjoy"],[2,10,null]],
    ownBook: [[2,38,"greyjoy"],[2,67,null]],
    pts: [[1110,630],[1320,620],[1370,760],[1300,890],[1140,900],[1070,770]] },

  /* The ironborn's stolen western strip: the Stony Shore, Deepwood Motte,
     Torrhen's Square, Moat Cailin. The east — the Dreadfort, White Harbor,
     Karhold — never bends, and the map shows it.
     BOOK seizure corrected to ACOK ch 25 (Theon II, "Theon raids the Stony
     Shore as his sister sails for Deepwood Motte") — previously ch 24, which
     is Jon III at Craster's Keep, wholly beyond the Wall and nothing to do
     with the ironborn. It ends when Stannis retakes Deepwood in ADWD ch 27
     (Asha I) — previously ch 26. */
  { id: "iron-coast", name: "The Ironborn's stolen coast", base: null, sub: true,
    own: [[2,5,"greyjoy"],[6,2,null]],
    ownBook: [[2,25,"greyjoy"],[5,27,null]],
    pts: [[600,500],[770,520],[830,700],[900,830],[1030,900],[1050,1010],[980,1060],[860,1010],[750,970],[670,790],[595,650]] },
  /* Moat Cailin: a separate amphibious seizure, barring the causeway — seized
     in the same invasion wave (ACOK ch 25, Theon II; was ch 24 = Jon III),
     retaken by Ramsay in the show (S4E8) and by Reek's ruse in the books
     (ADWD ch 21, Reek II). */
  { id: "iron-moat-cailin", name: "Moat Cailin, held against the North", base: null, sub: true,
    own: [[2,5,"greyjoy"],[4,8,null]],
    ownBook: [[2,25,"greyjoy"],[5,21,null]],
    pts: [[1160,1060],[1290,1055],[1310,1140],[1250,1190],[1160,1160]] },

  /* The dead's road to Winterfell: Last Hearth and the eastern kingsroad,
     eaten mile by mile between the Wall's fall and the dawn. */
  { id: "ww-north-march", name: "The dead's march", base: null, sub: true,
    own: [[8,1,"white-walkers"],[8,4,null]],
    pts: [[1370,480],[1570,468],[1660,520],[1650,700],[1460,770],[1350,700],[1330,560]] },

  /* ---------------- the Vale: neutral behind its mountains ---------------- */
  { id: "the-vale", name: "The Vale", base: "iron-throne",
    own: [[1,7,"arryn"],[6,9,"stark"],[8,6,"iron-throne"]],
    ownBook: [[1,50,"arryn"]],
    /* the old SE corner ran clear to the map edge at x1950, swallowing all of
       Crackclaw Point and Claw Isle — both Crownlands, not Vale. The border
       now follows the actual land-neck south of Gulltown (kept inside) and
       north of Wickenden/Crackclaw Point (now given to the Crownlands below). */
    pts: [[1462,1330],[1520,1430],[1500,1520],[1478,1620],[1505,1720],[1560,1700],[1750,1680],[1950,1650],[1950,1285],[1830,1278],[1690,1288],[1580,1315],[1500,1345]] },

  /* ---------------- the Riverlands ----------------
     They rally to the Young Wolf, bleed for it, and are handed to the Freys
     after the Red Wedding. The last council restores Riverrun's trout. */
  /* Rally to the Young Wolf (SHOW S1E10; BOOK AGOT ch 64, Catelyn X — the
     Whispering Wood, where Robb takes the Trident by force), handed to the
     Freys at the Red Wedding (SHOW S3E9; BOOK ASOS ch 52, Catelyn VII — was
     ch 53), and folded back into the crown's peace — SHOW when Arya poisons
     every Frey of worth (S7E1); BOOK when Jaime's campaign retakes Riverrun
     and pacifies the rivers (AFFC ch 39, Jaime VI). */
  { id: "the-riverlands", name: "The Riverlands", base: "iron-throne",
    own: [[1,10,"stark"],[3,9,"frey"],[7,1,"iron-throne"]],
    ownBook: [[1,64,"stark"],[3,52,"frey"],[4,39,"iron-throne"]],
    /* the eastern edge below the Vale (…[1505,1720]→[1560,1700]→[1560,1810]…)
       now follows the Vale's southern corner down and shares an exact border
       line with the Crownlands, closing the untenanted patch that used to sit
       south of the Bloody Gate and west of Wickenden. */
    pts: [[600,1362],[720,1352],[830,1310],[900,1285],[1100,1258],[1250,1232],[1400,1240],[1560,1258],[1462,1330],[1520,1430],[1500,1520],[1478,1620],[1505,1720],[1560,1700],[1560,1810],[1620,1848],[1500,1898],[1440,1925],[1350,1870],[1260,1860],[1230,1920],[1240,2000],[1270,2080],[1170,2075],[1080,2060],[1030,1960],[1010,1880],[980,1820],[900,1750],[870,1655],[920,1640],[940,1500],[930,1370]] },

  /* The Brotherhood moves: the hollow hills first, the crossroads country later. */
  { id: "brotherhood-hollow", name: "The Hollow Hills", base: null, sub: true,
    own: [[3,2,"brotherhood"],[4,1,null]],
    ownBook: [[3,13,"brotherhood"]],
    pts: [[1080,1780],[1200,1770],[1250,1830],[1230,1930],[1140,1980],[1060,1930],[1040,1850]] },
  { id: "brotherhood-crossroads", name: "The crossroads country", base: null, sub: true,
    own: [[4,1,"brotherhood"],[7,1,null]],
    ownBook: [[4,30,"brotherhood"]],
    pts: [[1330,1660],[1480,1650],[1530,1740],[1470,1820],[1360,1810],[1310,1730]] },

  /* ---------------- the Iron Islands: the second kingsmoot crown ---------------- */
  { id: "iron-islands", name: "The Iron Islands", base: "iron-throne",
    own: [[2,2,"greyjoy"],[8,6,"iron-throne"]],
    ownBook: [[2,12,"greyjoy"]],
    pts: [[560,1430],[820,1430],[870,1470],[930,1545],[900,1620],[860,1650],[790,1655],[700,1690],[590,1670],[520,1560]] },

  /* ---------------- the Westerlands ----------------
     The lion's from the moment the realm splits; pierced by Robb's western
     war; broken at the Blackwater Rush when the dragons come. */
  { id: "the-westerlands", name: "The Westerlands", base: "iron-throne",
    /* was [7,3,...]: S7E3 "The Queen's Justice" is Highgarden falling (Reach,
       not here). The Loot Train raid on the Westerlands road is S7E4 "The
       Spoils of War" — one episode later. */
    own: [[1,7,"lannister"],[7,4,"targaryen"],[7,5,"lannister"],[8,6,"iron-throne"]],
    ownBook: [[1,50,"lannister"]],
    pts: [[760,1660],[870,1655],[900,1750],[980,1820],[1010,1880],[1030,1960],[1080,2060],[950,2140],[850,2200],[740,2240],[640,2270],[480,2240],[510,1780],[730,1715]] },
  { id: "westerlands-hills", name: "The hills of the West (Robb's war)", base: null, sub: true,
    own: [[2,4,"stark"],[3,3,null]],
    ownBook: [[2,32,"stark"],[3,19,null]],
    pts: [[730,1715],[900,1745],[1000,1830],[1025,1950],[950,1975],[830,1925],[760,1850]] },

  /* ---------------- the Crownlands ----------------
     The throne's own — colored by whichever dynasty holds the chair
     (see CROWN_SHOW below: gold → Lannister crimson → Targaryen → gold). */
  /* The Crownlands — now a SINGLE region including Crackclaw Point and Wickenden
     (previously a separate `crackclaw-point` territory, which read as its own
     little realm; Crackclaw Point is simply part of the Crownlands, so it's
     merged here). The northern arm reaches up to the Vale's southern border and
     the Riverlands' eastern edge; the Blackwater Bay notch is carved from the
     east side. */
  { id: "the-crownlands", name: "The Crownlands", base: "iron-throne",
    pts: [[1560,1700],[1750,1680],[1950,1650],[1950,1878],[1725,1878],[1725,1985],[1950,1985],[1950,2225],[1650,2228],[1520,2212],[1400,2190],[1330,2140],[1270,2080],[1240,2000],[1230,1920],[1260,1860],[1350,1870],[1440,1925],[1500,1898],[1620,1848],[1560,1810]] },

  /* Dragonstone: Stannis's rock when he declares, abandoned after his fall,
     the dragon queen's beachhead. In the books the crown's fleet storms it —
     Loras Tyrell takes it and is grievously burned, news that reaches Cersei
     in AFFC ch 40 (Cersei IX); previously ch 32 (Brienne VI, the crossroads
     inn), an unrelated riverlands chapter. */
  { id: "dragonstone-isle", name: "Dragonstone", base: "iron-throne", nomask: true,
    own: [[2,1,"stannis"],[6,1,null],[7,1,"targaryen"],[8,6,"iron-throne"]],
    ownBook: [[2,1,"stannis"],[4,40,"iron-throne"]],
    pts: [[1745,1898],[1786,1906],[1796,1934],[1772,1962],[1738,1954],[1728,1920]] },

  /* The narrow-sea lords who declared for Stannis the instant his ravens flew
     (ACOK ch 11, Davos I): Velaryon of Driftmark, Celtigar of Claw Isle, Bar
     Emmon of Sharp Point, Sunglass, Massey of Stonedance, Seaworth. This patch
     is Massey's Hook, the southern arm of Blackwater Bay. Book-only — the show
     never depicts these houses; it dissolves back to the crown after the
     Blackwater breaks Stannis (ACOK ch 63). */
  { id: "narrow-sea-stannis", name: "Massey's Hook & the narrow-sea lords, for Stannis", base: null, sub: true,
    ownBook: [[2,11,"stannis"],[2,63,null]],
    pts: [[1690,2075],[1815,2085],[1875,2150],[1815,2210],[1705,2170],[1668,2115]] },
  /* Driftmark, the Velaryon fleet's isle — declares with Stannis (ACOK ch 11)
     and holds until Dragonstone itself falls (AFFC ch 40). Book-only. */
  { id: "driftmark-stannis", name: "Driftmark (Velaryon, for Stannis)", base: null, sub: true, nomask: true,
    ownBook: [[2,11,"stannis"],[4,40,null]],
    pts: [[1710,2032],[1756,2036],[1766,2062],[1742,2078],[1708,2064]] },

  /* ---------------- the Reach ----------------
     The Tyrells marry into Renly's cause and raise the Reach for him; after his
     death Highgarden allies with the crown, and at last the lions take it.
     SHOW: Renly is not king on screen until S2E1 (crowned off-season after
     fleeing King's Landing in S1E7), so his claim starts S2E1 — NOT S1E9, when
     he has only fled. After his death (S2E5) the Reach answers the crown (S2E6),
     then falls to the Lannisters outright when Jaime sacks Highgarden at the
     Queen's Justice (S7E3).
     BOOK: Renly is "the newly crowned Renly" as of ACOK ch 8 (Catelyn I) — the
     old AGOT ch 63 was Tyrion VIII on the Green Fork. At Renly's death (ACOK
     ch 34, Catelyn IV) the great body of the Reach (Highgarden) goes over to
     the crown-and-Lannister alliance; a chunk does NOT — see the Florents,
     below. Previously reverted at ch 35 (Jon IV, the Fist of the First Men),
     a chapter beyond the Wall. */
  { id: "the-reach", name: "The Reach", base: "iron-throne",
    own: [[2,1,"renly"],[2,6,"iron-throne"],[7,3,"lannister"],[8,6,"iron-throne"]],
    ownBook: [[2,8,"renly"],[2,34,"iron-throne"]],
    /* the SW tail used to swing east to Starfall's own doorstep before turning
       toward Oldtown, wrongly claiming the whole Dornish coast around Sun
       House as Reach land. It now shares one clean border line with Dorne, run
       from the Red Mountains (940,2620) down to the south coast (905,3010),
       keeping Sun House and Three Towers in the Reach and Starfall/Sandstone
       in Dorne. */
    pts: [[1080,2060],[1170,2075],[1270,2080],[1330,2140],[1400,2190],[1350,2260],[1330,2380],[1230,2430],[1090,2470],[1010,2560],[940,2620],[925,2760],[912,2880],[905,3010],[560,2970],[430,2500],[480,2260],[640,2270],[740,2240],[850,2200],[950,2140]] },

  /* Brightwater Keep and the Florent lands — the one great chunk of the Reach
     that goes to STANNIS, not the crown, after Renly's death: Queen Selyse is
     a Florent, and Lord Alester and Ser Axell serve Stannis. They hold for him
     from Renly's death (ACOK ch 34) until the triumphant Tyrells strip
     Brightwater from them and claim it for Highgarden (AFFC, ch 1). Book-only;
     the show never follows the Florents. */
  { id: "florent-stannis", name: "Brightwater Keep (Florent, for Stannis)", base: null, sub: true,
    ownBook: [[2,34,"stannis"],[4,1,null]],
    pts: [[660,2470],[820,2470],[860,2560],[800,2640],[680,2620],[620,2540]] },

  /* ---------------- the Stormlands ----------------
     Renly's crown, Stannis's by blood and shadow, the throne's after the
     Blackwater; the Golden Company's at the last (books).
     SHOW: Renly from S2E1 (see the Reach), then the stormlords go to Stannis
     when the shadow kills Renly (S2E6), then the land submits to the crown once
     Stannis breaks on the Blackwater (S3E1).
     BOOK: Renly from ACOK ch 8; at his death (ch 34, Catelyn IV) the assembled
     stormlords go over to Stannis; after the Blackwater (ASOS ch 1) the main
     Stormlands bow to the crown — but STORM'S END itself does not (see below).
     At the very end the Golden Company lands on Cape Wrath (ADWD ch 61). */
  { id: "the-stormlands", name: "The Stormlands", base: "iron-throne",
    own: [[2,1,"renly"],[2,6,"stannis"],[3,1,"iron-throne"]],
    ownBook: [[2,8,"renly"],[2,34,"stannis"],[3,1,"iron-throne"],[5,61,"golden-company"]],
    pts: [[1400,2190],[1520,2212],[1650,2228],[1950,2230],[1950,2610],[1600,2645],[1430,2625],[1305,2560],[1200,2565],[1100,2620],[1010,2560],[1090,2470],[1230,2430],[1330,2380],[1350,2260]] },

  /* Storm's End: the seat Stannis takes and never loses. In the books Ser
     Cortnay Penrose holds it against Stannis after Renly's death until the
     shadow kills him (ACOK ch 43, Davos II); Stannis's garrison under Ser
     Gilbert Farring then holds it FOR HIM through the Blackwater, through his
     march to the Wall, and to the last page written — so while the rest of the
     Stormlands bow to the crown after the Blackwater, this one point stays
     Stannis's. Drawn on top of the Stormlands so it overrides that reversion.
     Book-only (the show does not track the castle after Stannis leaves). */
  { id: "storms-end-loyal", name: "Storm's End, held for Stannis", base: null, sub: true,
    ownBook: [[2,43,"stannis"]],
    pts: [[1600,2320],[1700,2320],[1712,2400],[1650,2412],[1588,2380]] },

  /* ---------------- Dorne: its own as soon as the realm cracks;
     sworn to the dragon queen for her war; a new prince at the end. ---------------- */
  { id: "dorne", name: "Dorne", base: "iron-throne",
    own: [[1,10,"martell"],[6,10,"targaryen"],[8,6,"iron-throne"]],
    ownBook: [[1,64,"martell"]],
    /* western boundary reworked: the previous fix over-corrected and dragged
       Dorne far up the west coast (to x≈720, past Sun House), overlapping the
       Reach. Dorne now shares ONE clean border line with the Reach — from the
       Red Mountains (940,2620) down to the south coast (905,3010) — so Starfall
       (964,2757) and Sandstone (1076,2864) stay Dornish while Sun House
       (797,2864) and Three Towers (660,2761) stay in the Reach, with no overlap
       and no gap. */
    pts: [[1010,2560],[1100,2620],[1200,2565],[1305,2560],[1430,2625],[1600,2645],[1950,2610],[1950,3050],[1300,3050],[905,3010],[912,2880],[925,2760],[940,2620]] },

  /* ---------------- Slaver's Bay: the conquest, city by city ---------------- */
  { id: "astapor-lands", name: "Astapor", base: "masters",
    own: [[3,4,"targaryen"],[4,4,"masters"]],
    ownBook: [[3,28,"targaryen"],[4,1,"masters"]],
    pts: [[3900,2860],[4100,2870],[4130,3000],[4040,3080],[3920,3030]] },
  { id: "yunkai-lands", name: "Yunkai", base: "masters",
    own: [[3,8,"targaryen"],[4,4,"masters"],[6,9,"targaryen"]],
    ownBook: [[3,29,"targaryen"],[4,1,"masters"]],
    pts: [[3930,2640],[4110,2650],[4140,2760],[4030,2800],[3930,2760]] },
  { id: "meereen-lands", name: "Meereen", base: "masters",
    own: [[4,3,"targaryen"]],
    ownBook: [[3,43,"targaryen"]],
    pts: [[4020,2520],[4200,2530],[4240,2650],[4130,2700],[4040,2660]] },
];

/* The crown itself changes hands: whoever sits the Iron Throne colors every
   land that answers to it. Robert's (and Joffrey's, and Tommen's) gold becomes
   Lannister crimson when Cersei takes the chair, Targaryen for one burning
   day, and gold again under the Broken King. (Books: the boy king's gold.) */
const CROWN_SHOW = [[6,10,"lannister"],[8,5,"targaryen"],[8,6,"iron-throne"]];
function crownDynastyAt(pt) {
  if (!pt || pt.type === "book") return "iron-throne";
  let d = "iron-throne";
  for (let i = 0; i < CROWN_SHOW.length; i++) {
    const seg = CROWN_SHOW[i];
    if (seg[0] < pt.s || (seg[0] === pt.s && seg[1] <= pt.e)) d = seg[2];
    else break;
  }
  return d;
}

/* who holds a territory at the given story point (null hides it) */
function territoryRulerAt(t, pt, lore) {
  let ruler = t.base;
  if (!pt) return ruler; // no point chosen: the realm as the tale opens
  const tl = pt.type === "book" ? (t.ownBook || null) : (t.own || null);
  if (!tl) return ruler;
  const a = pt.type === "book" ? pt.b : pt.s;
  const b = pt.type === "book" ? pt.ch : pt.e;
  for (let i = 0; i < tl.length; i++) {
    const seg = tl[i];
    if (seg[0] < a || (seg[0] === a && seg[1] <= b)) ruler = seg[2];
    else break;
  }
  return ruler;
}

/* repaint every territory for the chosen story point & telling */
function applyTerritoryOwners(pt, lore) {
  const layer = document.getElementById("territory-layer");
  if (!layer) return;
  layer.querySelectorAll("[data-territory]").forEach((path) => {
    const t = TERRITORIES.find((x) => x.id === path.getAttribute("data-territory"));
    if (!t) return;
    let ruler = territoryRulerAt(t, pt, lore);
    if (ruler === "iron-throne") ruler = crownDynastyAt(pt); // crown lands wear the ruling dynasty's color
    if (!ruler) { path.style.display = "none"; return; }
    path.style.display = "";
    const r = RULERS[ruler];
    path.setAttribute("fill", r.color);
    const title = path.querySelector("title");
    if (title) title.textContent = `${t.name} — ${r.name}`;
  });
}

(function () {
  const layer = document.getElementById("territory-layer");
  const pathFor = (t) => {
    const d = "M " + t.pts.map((p) => `${p[0]} ${p[1]}`).join(" L ") + " Z";
    const r = t.base ? RULERS[t.base] : null;
    return `<path class="territory${t.sub ? " territory-sub" : ""}" data-territory="${t.id}" d="${d}"
      fill="${r ? r.color : "#000"}" ${r ? "" : 'style="display:none"'}><title>${t.name}${r ? " — " + r.name : ""}</title></path>`;
  };
  let s = `<defs>
    <mask id="landMask" maskUnits="userSpaceOnUse" x="0" y="0" width="5652" height="3682">
      <image href="assets/landmask.png" x="0" y="0" width="5652" height="3682" preserveAspectRatio="none"/>
    </mask>
  </defs>
  <g mask="url(#landMask)">`;
  TERRITORIES.filter((t) => !t.nomask).forEach((t) => { s += pathFor(t); });
  s += "</g>";
  // unmasked extras (small isles the landmask may miss)
  TERRITORIES.filter((t) => t.nomask).forEach((t) => { s += pathFor(t); });
  layer.innerHTML = s;
})();
