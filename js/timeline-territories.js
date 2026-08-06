/* ============================================================================
   THE KNOWN WORLD, YEAR BY YEAR — the chronicle's allegiance map.

   The interactive map (js/territories.js) answers "who holds this at THIS
   EPISODE". This file answers "who holds this in THIS YEAR", from twelve
   thousand years before the Conquest to the breaking of the wheel — so the
   timeline can repaint the world as the reader drags along it.

   The two files are deliberately separate. They share a coordinate space and
   a few polygons, and nothing else: one is keyed to seasons and chapters and
   only covers the eight years of the saga, the other is keyed to years and
   covers a hundred and twenty centuries.

     { id, name, sub, pts, nomask?,
       hold: [[year, powerId | null], …]   ascending; the last entry at or
                                           before the asked-for year wins.
                                           null = no banner flies here.
       pop:  [[year, souls], …]            straight-line between points }

   COORDINATES are basemap pixels (5652 x 3682), the same space the pins use.
   Polygons are drawn GENEROUSLY past every coast and clipped to dry land by
   assets/landmask.png, exactly as the interactive map does it — so a blob that
   spills into the sea is not a bug, it is the method. What a blob must never
   do is spill onto a DIFFERENT landmass.

   YEARS are the maesters': negative is Before the Conquest, positive is After.
   There is no year 0; the engine steps straight from 1 BC to 1 AC.

   DATES. Where the sources give a year, the year is used: the Doom in 102 BC,
   Nymeria's landing about 700 BC, Aenar Targaryen's flight to Dragonstone
   twelve years before the Doom, Dorne sworn to the Iron Throne in 187 AC when
   Maron Martell wed Daenerys Targaryen. Where they give only "some thousands
   of years ago" — the Long Night, the Andal landings, the raising of the Wall
   — the round number the Citadel prefers is used and should be read as the
   argument it is. The maesters themselves cannot agree whether the Andals came
   six thousand years ago or two.

   POPULATION is this site's own reckoning, never canon; see the long note at
   the head of js/peoples-data.js for how it is arrived at, and note that every
   panel that shows it says so.
   ========================================================================== */

window.TL_LANDS = [

  /* ================= beyond the Wall =================
     ONE land, not two (Aug 2026, at the owner's request). This used to be cut
     into "The Lands of Always Winter" and "The Haunted Forest", which meant a
     seam to keep byte-identical between them and, worse, a pale stripe of ice
     lying across the top of the chart in years when the Others were nowhere.

     It is now the country everyone in the books names in one breath, and it
     belongs to the free folk — the only people who actually live there. The
     Others hold it twice and twice only: while they gather for the first Long
     Night, and while they gather for the second.

     The top edge is now y=0, the top of the chart itself. The old y=40 line
     left a strip of drawn land (x 624-1296 at the very top) unpainted. */
  {
    id: "beyond-the-wall", name: "Beyond the Wall", sub: "The free folk's country, past the ice",
    pts: [[240, 0], [1660, 0], [1660, 240], [1620, 252], [1546, 248],
          [1424, 262], [1300, 272], [1180, 285], [1100, 310], [950, 340], [700, 350], [400, 360], [260, 300]],
    /* the children first, then the First Men who followed them north, then the
       Long Night, then eight thousand years of people who were simply left on
       the wrong side of a wall — and then the Long Night again */
    hold: [[-12000, "children"], [-10000, "first-men"], [-8100, "others"], [-7900, "free-folk"],
           [300, "others"], [305, "free-folk"]],
    pop: [[-12000, 60000], [-10000, 90000], [-8000, 110000], [-7900, 53000], [-4000, 125000],
          [1, 156000], [200, 151000], [297, 135000], [300, 100000], [303, 58000], [306, 63000]],
  },
  /* THE DANCE, 129-131 AC. The realm does not simply stay gold through the
     Dance: the blacks held the North, the Vale, the riverlands, the Iron
     Islands (Dalton Greyjoy, the Red Kraken) and Dragonstone, and the greens
     held King's Landing, the Westerlands, the Reach and the stormlands. Both
     crowns are folded into each land's history below rather than kept as a
     separate overlay, so a reader dragging through 130 AC sees the realm cut
     in two and then stitched back together in 131. */

  /* ================= the North ================= */
  {
    id: "the-north", name: "The North", sub: "Winterfell and the wolfswood",
    pts: [[360, 380], [950, 340], [1040, 458], [1100, 446], [1180, 421], [1300, 408], [1424, 398],
          [1546, 384], [1620, 388], [1660, 390], [1720, 405], [1950, 445], [1950, 1230], [1600, 1255], [1400, 1240], [1250, 1232],
          [1100, 1258], [900, 1285], [830, 1310], [720, 1352], [600, 1362], [500, 1345], [420, 1330], [360, 1335]],
    /* Bran the Builder's line takes the North out of the Long Night and holds
       it for eight thousand years; Torrhen kneels in 1 AC; Robb is crowned in
       298; the Boltons are given it after the Red Wedding in 299; the bastards
       settle it in 302 */
    hold: [[-12000, "children"], [-10000, "first-men"], [-8000, "others"], [-7900, "stark"],
           [1, "iron-throne"], [129, "blacks"], [131, "iron-throne"],
           [298, "stark"], [299, "bolton"], [302, "stark"]],
    pop: [[-12000, 30000], [-10000, 60000], [-8000, 140000], [-7900, 70000], [-4000, 700000],
          [-1000, 2000000], [1, 2900000], [130, 3300000], [260, 3800000], [298, 4000000],
          [300, 3300000], [303, 3000000], [306, 2900000]],
  },
  {
    id: "the-north-isles", name: "Skagos & the northern isles", sub: "Where the North stops trying",
    pts: [[1670, 150], [1950, 140], [1950, 415], [1760, 420], [1690, 315]],
    hold: [[-12000, "first-men"], [-8000, "others"], [-7900, "stark"], [1, "iron-throne"],
           [129, "blacks"], [131, "iron-throne"],
           [298, "stark"], [299, "bolton"], [302, "stark"]],
    pop: [[-4000, 12000], [1, 25000], [298, 40000], [306, 38000]],
  },

  /* THE GIFT AND THE NEW GIFT — redrawn twice in Aug 2026, and the second time
     is the one that matters. They were briefly two flat rectangles, which the
     owner rightly called awful: a grey slab floating in the middle of the North
     with sea on either side of it, painted ON TOP of the North rather than
     beside it, and dark enough to bury the chart's own "Castle Black".

     They are now three bands that TILE, sharing their edges point for point so
     there is neither a seam nor a doubled multiply:

         beyond the Wall     …its southern edge is
         the Gift            …whose southern edge, 68px on, is
         the New Gift        …whose southern edge, 68px on, is
         the North           …top edge

     Change one of those edges and you must change the two that touch it.

     The depth is not arbitrary: the Wall is 100 leagues long and spans
     x1272-x1547 here, so the chart runs at 2.75 pixels to the league, and each
     grant is 25 leagues — about 68px. East and west the bands are drawn well
     out past both coasts (x 1040 and x 1660) and the land mask cuts them at
     the shoreline, which is how every polygon in this file is built.

     Splitting the two also lets the New Gift keep its real history: it is not
     the Watch's land at all until Good Queen Alysanne gives it to them in 58
     AC, and before that year it simply shows the North underneath. */
  {
    id: "the-gift", name: "The Gift", sub: "Brandon's grant, 25 leagues of it",
    pts: [[1040, 322], [1100, 310], [1180, 285], [1300, 272], [1424, 262], [1546, 248],
          [1620, 252], [1660, 254], [1660, 322], [1620, 320], [1546, 316], [1424, 330],
          [1300, 340], [1180, 353], [1100, 378], [1040, 390]],
    /* Before the Watch is given it, this ground is simply the North's, and it
       holds exactly what the North holds so the two read as one country — the
       map drops the line between lands of the same colour, so no border is
       drawn across the Wall's country for the eight thousand years before
       there was a Watch to draw one for. */
    hold: [[-12000, "children"], [-10000, "first-men"], [-8000, "others"], [-7980, "nights-watch"],
           [300, "others"], [305, "nights-watch"]],
    /* granted at the Wall's raising and emptied by four hundred years of raids
       that nobody was left to stop */
    pop: [[-7980, 30000], [-4000, 45000], [1, 50000], [58, 52000], [103, 70000], [200, 55000],
          [260, 25000], [298, 10000], [303, 3000], [306, 6000]],
  },
  {
    id: "the-new-gift", name: "The New Gift", sub: "Good Queen Alysanne's grant, 58 AC",
    pts: [[1040, 390], [1100, 378], [1180, 353], [1300, 340], [1424, 330], [1546, 316],
          [1620, 320], [1660, 322], [1660, 390], [1620, 388], [1546, 384], [1424, 398],
          [1300, 408], [1180, 421], [1100, 446], [1040, 458]],
    /* The North's own ground for eight thousand years, and it says so: until
       58 AC it holds whatever the North holds, so the map draws no line and no
       colour of its own there. It used to be `null` before that year, which
       left a blank hole in the middle of the North — the ground was real, it
       simply had nobody assigned to it.

       Then Alysanne Targaryen flew Silverwing to the Wall, was appalled at what
       the Watch had left to live on, and had her husband take another 25
       leagues out of the North and give it to them — over the North's loud
       objection, which it never really withdrew. The land emptied anyway. */
    hold: [[-12000, "children"], [-10000, "first-men"], [-8000, "others"], [-7900, "stark"],
           [1, "iron-throne"], [58, "nights-watch"], [300, "others"], [305, "nights-watch"]],
    pop: [[58, 23000], [103, 50000], [200, 35000], [260, 15000], [298, 5000],
          [303, 1000], [306, 3000]],
  },

  /* ================= the Vale ================= */
  {
    id: "the-vale", name: "The Vale of Arryn", sub: "Behind the Bloody Gate",
    pts: [[1462, 1330], [1520, 1430], [1500, 1520], [1478, 1620], [1505, 1720], [1560, 1700], [1750, 1680],
          [1950, 1650], [1950, 1285], [1830, 1278], [1690, 1288], [1580, 1315], [1500, 1345]],
    /* the first ground the Andals took, and the last place their blood ran
       unmixed; the Vale then sits out three centuries of other people's wars */
    hold: [[-12000, "children"], [-10000, "first-men"], [-8000, "others"], [-7900, "first-men"],
           [-6000, "andals"], [-5900, "arryn"], [1, "iron-throne"], [129, "blacks"], [131, "iron-throne"],
           [298, "arryn"], [302, "stark"], [305, "iron-throne"]],
    pop: [[-12000, 25000], [-10000, 50000], [-8000, 120000], [-7900, 60000], [-6000, 300000],
          [-4000, 900000], [-1000, 2400000], [1, 3200000], [130, 3500000], [298, 4000000], [306, 3900000]],
  },

  /* ================= the Riverlands ================= */
  {
    id: "the-riverlands", name: "The Riverlands", sub: "The Trident, and everyone's road",
    pts: [[600, 1362], [720, 1352], [830, 1310], [900, 1285], [1100, 1258], [1250, 1232], [1400, 1240],
          [1560, 1258], [1462, 1330], [1520, 1430], [1500, 1520], [1478, 1620], [1505, 1720], [1560, 1700],
          [1560, 1810], [1620, 1848], [1500, 1898], [1440, 1925], [1350, 1870], [1260, 1860], [1230, 1920],
          [1240, 2000], [1270, 2080], [1170, 2075], [1080, 2060], [1030, 1960], [1010, 1880], [980, 1820],
          [900, 1750], [870, 1655], [920, 1640], [940, 1500], [930, 1370]],
    /* House Mudd, then the Andal river kings, then Harwyn Hardhand's ironborn
       three generations before the Conquest, then everyone in turn */
    hold: [[-12000, "children"], [-10000, "first-men"], [-8000, "others"], [-7900, "first-men"],
           [-4000, "riverkings"], [-60, "ironborn"], [1, "iron-throne"], [129, "blacks"], [131, "iron-throne"],
           [298, "stark"], [299, "frey"], [303, "iron-throne"]],
    pop: [[-12000, 40000], [-10000, 80000], [-8000, 200000], [-7900, 100000], [-4000, 1000000],
          [-1000, 2600000], [1, 3400000], [130, 3300000], [260, 4000000], [298, 4000000],
          [299, 3400000], [303, 3200000], [306, 3300000]],
  },

  /* ================= the Iron Islands ================= */
  {
    id: "iron-islands", name: "The Iron Islands", sub: "The iron price",
    pts: [[560, 1430], [820, 1430], [870, 1470], [930, 1545], [900, 1620], [860, 1650], [790, 1655], [700, 1690], [590, 1670], [520, 1560]],
    /* the Grey King's islands; kings of their own until Balerion came over
       Harrenhal, and twice since for a season apiece */
    hold: [[-12000, "first-men"], [-6000, "ironborn"], [1, "iron-throne"], [129, "blacks"], [131, "iron-throne"],
           [289, "greyjoy"], [290, "iron-throne"], [299, "greyjoy"], [305, "iron-throne"]],
    pop: [[-4000, 60000], [-1000, 300000], [1, 600000], [130, 700000], [298, 1000000], [306, 900000]],
  },

  /* ================= the Westerlands ================= */
  {
    id: "the-westerlands", name: "The Westerlands", sub: "Casterly Rock and the gold",
    pts: [[760, 1660], [870, 1655], [900, 1750], [980, 1820], [1010, 1880], [1030, 1960], [1080, 2060],
          [950, 2140], [850, 2200], [740, 2240], [640, 2270], [480, 2240], [510, 1780], [730, 1715]],
    /* Lann the Clever takes the Rock in the Age of Heroes */
    hold: [[-12000, "children"], [-10000, "first-men"], [-7000, "lannister"], [1, "iron-throne"], [129, "greens"], [131, "iron-throne"],
           [298, "lannister"], [305, "iron-throne"]],
    pop: [[-12000, 30000], [-10000, 60000], [-8000, 150000], [-7900, 75000], [-7000, 200000],
          [-4000, 1200000], [-1000, 3200000], [1, 4400000], [130, 4600000], [298, 5500000],
          [300, 5200000], [306, 5100000]],
  },

  /* ================= the Crownlands ================= */
  {
    id: "the-crownlands", name: "The Crownlands", sub: "The throne's own country",
    pts: [[1560, 1700], [1750, 1680], [1950, 1650], [1950, 1878], [1725, 1878], [1725, 1985], [1950, 1985],
          [1950, 2225], [1650, 2228], [1520, 2212], [1400, 2190], [1330, 2140], [1270, 2080], [1240, 2000],
          [1230, 1920], [1260, 1860], [1350, 1870], [1440, 1925], [1500, 1898], [1620, 1848], [1560, 1810]],
    /* nobody's kingdom before the Conquest — the river kings held the north of
       it and the Storm Kings the south. Aegon made a country out of the ground
       around his own new city. */
    hold: [[-12000, "children"], [-10000, "first-men"], [-8000, "others"], [-7990, "first-men"],
           [-4000, "riverkings"], [-60, "ironborn"], [-2, "targaryen"], [1, "iron-throne"],
           [129, "greens"], [131, "iron-throne"], [302, "lannister"], [305, "iron-throne"]],
    /* King's Landing is founded on a hill of mud in 1 AC and is half a million
       souls three centuries later — the fastest thing that happens to any
       number in this file */
    pop: [[-12000, 20000], [-4000, 300000], [-1000, 500000], [1, 600000], [50, 900000],
          [130, 1100000], [260, 1400000], [298, 1500000], [302, 1300000], [305, 1000000], [306, 1050000]],
  },
  {
    id: "dragonstone-isle", name: "Dragonstone", sub: "The rock in the narrow sea", nomask: true,
    pts: [[1745, 1898], [1786, 1906], [1796, 1934], [1772, 1962], [1738, 1954], [1728, 1920]],
    /* a Valyrian outpost, bought by Aenar Targaryen twelve years before the
       Doom; Stannis's seat when the realm cracks; the dragon queen's beachhead */
    hold: [[-500, "valyria"], [-114, "targaryen"], [1, "iron-throne"], [129, "blacks"], [131, "iron-throne"],
           [299, "stannis"], [302, "iron-throne"], [303, "targaryen"], [305, "iron-throne"]],
    pop: [[-500, 2000], [-114, 4000], [1, 10000], [130, 18000], [298, 20000], [306, 12000]],
  },

  /* ================= the Reach ================= */
  {
    id: "the-reach", name: "The Reach", sub: "The green country, and the most of it",
    pts: [[1080, 2060], [1170, 2075], [1270, 2080], [1330, 2140], [1400, 2190], [1350, 2260], [1330, 2380],
          [1230, 2430], [1090, 2470], [1010, 2560], [940, 2620], [925, 2760], [912, 2880], [905, 3010],
          [560, 2970], [430, 2500], [480, 2260], [640, 2270], [740, 2240], [850, 2200], [950, 2140]],
    /* House Gardener from Garth Greenhand to the Field of Fire, where the
       entire line ends in an afternoon */
    /* Garth Greenhand's line is the oldest crown in Westeros; the Gardeners
       are already kings when Bran the Builder is raising the Wall */
    hold: [[-12000, "children"], [-10000, "first-men"], [-9000, "gardener"],
           [-1, "iron-throne"], [129, "greens"], [131, "iron-throne"],
           [299, "renly"], [300, "iron-throne"], [303, "lannister"], [305, "iron-throne"]],
    pop: [[-12000, 60000], [-10000, 120000], [-8000, 300000], [-7900, 160000], [-4000, 2400000],
          [-1000, 6500000], [1, 8500000], [130, 9500000], [260, 11000000], [298, 12000000],
          [300, 11500000], [303, 11000000], [306, 11200000]],
  },

  /* ================= the Stormlands ================= */
  {
    id: "the-stormlands", name: "The Stormlands", sub: "Storm's End, which has never fallen",
    pts: [[1400, 2190], [1520, 2212], [1650, 2228], [1950, 2230], [1950, 2610], [1600, 2645], [1430, 2625],
          [1305, 2560], [1200, 2565], [1100, 2620], [1010, 2560], [1090, 2470], [1230, 2430], [1330, 2380], [1350, 2260]],
    /* Durran Godsgrief raises Storm's End with Bran the Builder's help */
    hold: [[-12000, "children"], [-10000, "first-men"], [-7600, "durrandon"],
           [1, "iron-throne"], [129, "greens"], [131, "iron-throne"],
           [299, "renly"], [300, "stannis"], [301, "iron-throne"]],
    pop: [[-12000, 25000], [-10000, 50000], [-8000, 130000], [-7900, 65000], [-4000, 700000],
          [-1000, 1500000], [1, 1900000], [130, 2000000], [260, 2400000], [298, 2500000],
          [300, 2300000], [306, 2300000]],
  },

  /* ================= Dorne ================= */
  {
    id: "dorne", name: "Dorne", sub: "Sand, mountains, and a different set of laws",
    pts: [[1010, 2560], [1100, 2620], [1200, 2565], [1305, 2560], [1430, 2625], [1600, 2645], [1950, 2610],
          [1950, 3050], [1300, 3050], [905, 3010], [912, 2880], [925, 2760], [940, 2620]],
    /* petty kings until Nymeria's ten thousand ships; never conquered by the
       dragons; sworn to the Iron Throne at last in 187 AC by a marriage */
    /* the Young Dragon conquers Dorne at fourteen in 157 AC and it is lost
       again with him by 161; it joins the realm for good only in 187, when
       Maron Martell weds Daenerys Targaryen */
    hold: [[-12000, "first-men"], [-6000, "andals"], [-700, "rhoynar"], [-690, "martell"],
           [157, "iron-throne"], [161, "martell"], [187, "iron-throne"], [302, "martell"], [305, "iron-throne"]],
    pop: [[-12000, 20000], [-6000, 200000], [-1000, 900000], [-700, 1100000], [-690, 1300000],
          [1, 1900000], [130, 2100000], [187, 2400000], [298, 3000000], [306, 2950000]],
  },

  /* ================= Essos: the narrow-sea shore ================= */
  {
    id: "braavos-lands", name: "Braavos & the northern lagoon", sub: "The city no dragonlord ever found",
    pts: [[2040, 1250], [2320, 1300], [2520, 1360], [2560, 1500], [2470, 1640], [2300, 1720], [2130, 1700], [2040, 1520]],
    /* pine islands and fog and nobody at all, until a fleet of runaway slaves
       hid there and stayed hidden for a century */
    hold: [[-12000, null], [-700, "braavos"]],
    pop: [[-700, 40000], [-500, 300000], [-102, 700000], [1, 1200000], [200, 2200000], [298, 3000000], [306, 3000000]],
  },
  {
    id: "pentos-lands", name: "The Flatlands & the hills of Andalos", sub: "Where the Andals came from",
    pts: [[2040, 1700], [2300, 1720], [2470, 1780], [2520, 1980], [2470, 2180], [2330, 2320], [2150, 2350], [2040, 2200]],
    /* the Andals' own country before they crossed the sea; Valyrian afterward,
       and one of the Free Cities when the Freehold ended */
    hold: [[-12000, null], [-8000, "andals"], [-1500, "valyria"], [-102, "free-cities"]],
    pop: [[-8000, 200000], [-6000, 500000], [-4000, 300000], [-1500, 600000], [-102, 1100000],
          [1, 1300000], [298, 1800000]],
  },
  {
    id: "norvos-lands", name: "The Hills of Norvos", sub: "Bearded priests and a great bell",
    pts: [[2470, 1640], [2620, 1540], [2780, 1580], [2820, 1780], [2740, 1950], [2600, 1995], [2500, 1930], [2460, 1780]],
    hold: [[-12000, null], [-1500, "valyria"], [-102, "free-cities"]],
    pop: [[-1500, 300000], [-102, 900000], [1, 1100000], [298, 1600000]],
  },
  {
    id: "qohor-lands", name: "The Forest of Qohor", sub: "Smiths who can rework Valyrian steel",
    pts: [[2860, 1540], [3060, 1500], [3230, 1580], [3280, 1780], [3210, 1990], [3020, 2080], [2870, 2020], [2820, 1800]],
    /* it bought its life from the Dothraki once with a fortune and three
       thousand Unsullied, which is the only time in this file anybody does */
    hold: [[-12000, null], [-1500, "valyria"], [-102, "free-cities"]],
    pop: [[-1500, 250000], [-102, 800000], [1, 1000000], [298, 1600000]],
  },
  {
    id: "disputed-lands", name: "The Disputed Lands", sub: "Myr, Lys, Tyrosh and three hundred years of war",
    pts: [[1990, 2400], [2200, 2380], [2400, 2420], [2480, 2560], [2440, 2720], [2320, 2860], [2180, 2950],
          [2020, 2900], [1972, 2700], [1965, 2520]],
    /* Volantis held Myr and Lys for two generations after the Doom, and then
       nobody has held any of it for longer than a campaigning season */
    hold: [[-12000, null], [-1500, "valyria"], [-102, "volantis"], [-40, "free-cities"]],
    pop: [[-1500, 400000], [-102, 1600000], [1, 2400000], [200, 3000000], [298, 3600000]],
  },

  {
    id: "stepstones", name: "The Stepstones", sub: "The islands everybody wants and nobody keeps",
    nomask: true,
    /* A chain of rocks across the shipping lane, so whoever holds them taxes
       half the world's trade and is therefore attacked by the other half. The
       one time in three hundred years anybody really held them, it was Daemon
       Targaryen, who took them with Corlys Velaryon between 106 and 109 AC,
       had himself crowned King of the Narrow Sea, and had lost interest and
       gone home by 115. The Triarchy took them back, and after that they
       belong to whichever pirate is winning. */
    pts: [[1962, 2660], [2030, 2645], [2090, 2690], [2075, 2760], [1995, 2775], [1948, 2725]],
    hold: [[-12000, null], [-1500, "valyria"], [-102, "free-cities"],
           [109, "targaryen"], [115, "free-cities"]],
    pop: [[-102, 20000], [1, 26000], [109, 26000], [298, 30000]],
  },

  /* ================= Essos: the Rhoyne ================= */
  {
    id: "upper-rhoyne", name: "The Upper Rhoyne", sub: "Ny Sar, Ar Noy, and the Sorrows",
    pts: [[2500, 2050], [2700, 2020], [2850, 2120], [2900, 2350], [2850, 2560], [2740, 2680], [2600, 2620],
          [2520, 2400], [2480, 2200]],
    /* the heart of the Rhoynish cities, and after Garin's war a stretch of fog,
       ruins and greyscale that nobody has ruled since */
    hold: [[-12000, null], [-3000, "rhoynar"], [-700, null]],
    pop: [[-3000, 1800000], [-1500, 2600000], [-1000, 2800000], [-800, 1400000], [-700, 200000],
          [-600, 30000], [1, 12000], [298, 8000]],
  },
  {
    id: "volantis-lands", name: "Volantis & the Orange Shore", sub: "The eldest daughter of Valyria",
    pts: [[2600, 2650], [2740, 2680], [2900, 2700], [2980, 2820], [2960, 2960], [2850, 3010], [2650, 2980],
          [2520, 2900], [2500, 2760]],
    hold: [[-12000, null], [-3000, "rhoynar"], [-2000, "valyria"], [-102, "volantis"]],
    pop: [[-3000, 400000], [-2000, 500000], [-1000, 1500000], [-102, 2600000], [1, 3600000],
          [200, 4400000], [298, 5000000]],
  },

  /* ================= Essos: Valyria ================= */
  {
    id: "valyria-peninsula", name: "The Lands of the Long Summer", sub: "Valyria, and what the Doom left",
    pts: [[3020, 2700], [3250, 2620], [3500, 2620], [3680, 2690], [3760, 2840], [3680, 3050], [3600, 3250],
          [3450, 3480], [3300, 3620], [3130, 3580], [3010, 3350], [2980, 3020], [2985, 2820]],
    /* the Fourteen Flames, five thousand years of dragonlords, and then one
       night. Mantarys, Tolos and Elyria cling to the ashes afterward. */
    hold: [[-12000, null], [-5000, "valyria"], [-102, null]],
    pop: [[-5000, 300000], [-4000, 1500000], [-2000, 4000000], [-1000, 6000000], [-115, 7000000],
          [-102, 60000], [-50, 90000], [1, 100000], [298, 120000]],
  },

  /* ================= Essos: the bay, and Ghis ================= */
  {
    id: "meereen-lands", name: "Meereen", sub: "The great pyramid and the fighting pits",
    pts: [[3980, 2470], [4230, 2500], [4300, 2640], [4180, 2720], [4020, 2680], [3950, 2560]],
    hold: [[-12000, null], [-8000, "ghiscari"], [-4700, "valyria"], [-102, "slavers"], [300, "targaryen"]],
    pop: [[-8000, 200000], [-4700, 400000], [-102, 600000], [1, 700000], [298, 900000], [301, 800000], [306, 800000]],
  },
  {
    id: "yunkai-lands", name: "Yunkai", sub: "The yellow city",
    pts: [[3900, 2660], [4130, 2670], [4180, 2800], [4040, 2860], [3900, 2790]],
    hold: [[-12000, null], [-8000, "ghiscari"], [-4700, "valyria"], [-102, "slavers"],
           [300, "targaryen"], [301, "slavers"], [302, "targaryen"]],
    pop: [[-8000, 120000], [-102, 350000], [1, 400000], [298, 500000], [306, 450000]],
  },
  {
    id: "astapor-lands", name: "Astapor", sub: "Where the Unsullied are made",
    pts: [[3860, 2850], [4110, 2870], [4160, 3020], [4030, 3110], [3880, 3040]],
    hold: [[-12000, null], [-8000, "ghiscari"], [-4700, "valyria"], [-102, "slavers"],
           [300, "targaryen"], [301, "slavers"]],
    pop: [[-8000, 100000], [-102, 300000], [1, 350000], [298, 400000], [301, 250000], [306, 240000]],
  },
  {
    id: "ghiscar", name: "Ghiscar", sub: "Old Ghis, salted; New Ghis, rebuilt",
    pts: [[3900, 3080], [4150, 3060], [4250, 3200], [4230, 3400], [4130, 3560], [3990, 3560], [3880, 3380], [3850, 3200]],
    /* the first empire the world remembers, razed by Valyria five thousand
       years ago and never once the same size again */
    hold: [[-12000, null], [-8000, "ghiscari"], [-4700, "valyria"], [-102, "ghiscari"]],
    pop: [[-8000, 900000], [-5000, 2600000], [-4700, 400000], [-2000, 400000], [-102, 450000],
          [1, 500000], [298, 600000]],
  },
  {
    id: "lhazar", name: "Lhazar", sub: "The Lamb Men, and their hills",
    pts: [[4150, 2350], [4450, 2330], [4650, 2400], [4680, 2560], [4520, 2650], [4300, 2650], [4160, 2540]],
    hold: [[-12000, null], [-3000, "lhazareen"]],
    pop: [[-3000, 300000], [-1000, 450000], [1, 500000], [200, 480000], [298, 400000], [300, 300000], [306, 280000]],
  },

  /* ================= Essos: the grass ================= */
  {
    id: "sarnor-plain", name: "The Kingdom of Sarnor", sub: "The Tall Men and their chariots",
    pts: [[3300, 1380], [3900, 1340], [4350, 1370], [4400, 1620], [4250, 1900], [3900, 2020], [3550, 2020],
          [3330, 1850], [3270, 1600]],
    /* a dozen city-kingdoms that could never agree to be one country, and were
       taken apart one at a time in the Century of Blood */
    hold: [[-12000, null], [-5000, "sarnori"], [-90, "dothraki"]],
    pop: [[-5000, 1500000], [-3000, 4000000], [-1000, 6000000], [-200, 6500000], [-100, 5000000],
          [-90, 900000], [-50, 120000], [1, 60000], [298, 30000]],
  },
  {
    id: "dothraki-sea", name: "The Dothraki Sea", sub: "Grass to the horizon, and Vaes Dothrak",
    pts: [[4400, 1380], [5000, 1400], [5220, 1550], [5240, 1850], [5100, 2100], [4850, 2250], [4550, 2300],
          [4250, 2250], [4180, 2020], [4300, 1700], [4400, 1560]],
    hold: [[-12000, null], [-1000, "dothraki"]],
    pop: [[-1000, 250000], [-200, 400000], [-100, 600000], [1, 700000], [130, 680000], [298, 700000], [306, 520000]],
  },

  /* ================= Essos: the far corners ================= */
  {
    id: "qarth-lands", name: "Qarth", sub: "The greatest city that ever was or will be",
    pts: [[5100, 3020], [5350, 3000], [5500, 3080], [5520, 3260], [5380, 3360], [5180, 3320], [5080, 3160]],
    hold: [[-12000, null], [-500, "qarth"]],
    pop: [[-500, 100000], [-102, 300000], [1, 500000], [200, 700000], [298, 900000]],
  },
  {
    id: "ib", name: "Ib", sub: "Whale-hunters in the Shivering Sea",
    pts: [[4560, 1020], [4900, 980], [5080, 1060], [5100, 1230], [4950, 1300], [4700, 1280], [4560, 1160]],
    hold: [[-12000, "ibbenese"]],
    pop: [[-3000, 200000], [1, 400000], [298, 500000]],
  },

  /* ==========================================================================
     THE DEEP WOODS THE CHILDREN KEPT

     The Pact struck on the Isle of Faces did not hand Westeros to the First Men
     entire: it gave men the open land and the children the deep woods, and for
     a long age both halves of that bargain held. Without these the map paints
     the whole continent one bronze colour the moment the Pact is signed, which
     tells the reader the opposite of what happened.

     They are listed LAST so they draw on top of the kingdoms beneath them, and
     each one turns to `null` when the children are finally gone from it — at
     which point it simply disappears and whoever holds the wider land shows
     through. The south loses them to the Andals, who had no use for a tree with
     a face; the northern woods keep them for thousands of years longer; and the
     Isle of Faces, where the Pact was sworn, has never lost them at all.
     ========================================================================== */
  {
    id: "the-wolfswood", name: "The Wolfswood", sub: "The deep wood west of Winterfell",
    pts: [[880, 545], [1080, 525], [1170, 620], [1140, 770], [990, 815], [870, 720]],
    hold: [[-12000, "children"], [-8000, "others"], [-7900, "children"], [-2000, null]],
    pop: [[-12000, 40000], [-10000, 34000], [-8000, 12000], [-6000, 9000], [-3000, 3000], [-2000, 800]],
  },
  {
    id: "the-neck", name: "The Neck", sub: "Bog, crannog and the Children's last road south",
    pts: [[1085, 1075], [1235, 1055], [1305, 1140], [1250, 1235], [1115, 1225], [1055, 1150]],
    hold: [[-12000, "children"], [-8000, "others"], [-7900, "children"], [-2000, null]],
    pop: [[-12000, 30000], [-10000, 26000], [-8000, 9000], [-4000, 12000], [-2000, 4000]],
  },
  {
    id: "the-kingswood", name: "The Kingswood", sub: "The wood that outlived its children",
    pts: [[1470, 2115], [1620, 2105], [1685, 2180], [1630, 2265], [1495, 2255], [1445, 2175]],
    hold: [[-12000, "children"], [-4000, null]],
    pop: [[-12000, 26000], [-6000, 14000], [-4000, 2000]],
  },
  {
    id: "the-rainwood", name: "The Rainwood", sub: "Wet, dark, and the last of it in the south",
    pts: [[1680, 2370], [1830, 2360], [1885, 2445], [1820, 2540], [1700, 2525], [1648, 2440]],
    hold: [[-12000, "children"], [-3500, null]],
    pop: [[-12000, 24000], [-6000, 12000], [-3500, 1500]],
  },
  {
    id: "isle-of-faces", name: "The Isle of Faces", sub: "Where the Pact was sworn, and is kept",
    nomask: true,
    /* CORRECTED (Aug 2026). This island used to be painted the children's for
       the whole twelve thousand years, right down to the last page — which is
       more than the books will support. What the books say is that the Pact was
       sworn here and that the GREEN MEN have kept the island ever since, and
       the green men are not the children: they are described as men, whatever
       else is said of them, and nobody has set foot there to check in an age.
       The children themselves were driven out of the south by the Andals along
       with every other wood they held.

       So the children keep it as their last southern ground until the Andals
       finish the riverlands, and after that it answers to nobody the maps can
       name — which is the honest reading, and reads on the map as the one
       island in Westeros with no banner over it. */
    pts: [[1312, 1846], [1360, 1846], [1368, 1878], [1338, 1894], [1306, 1876]],
    hold: [[-12000, "children"], [-2000, null]],
    pop: [[-12000, 900], [-10000, 600], [-4000, 200], [-2000, 90]],
  },
];

/* --------------------------------------------------------------------------
   THE READERS. Both take a year on the maesters' scale (negative = BC).
   -------------------------------------------------------------------------- */

/* who flies a banner over this land in this year (null = nobody does) */
window.tlHolderAt = function (land, year) {
  var out = null, h = land.hold || [];
  for (var i = 0; i < h.length; i++) {
    if (h[i][0] <= year) out = h[i][1]; else break;
  }
  return out;
};

/* the souls living here, straight-lined between the reckoned points. Returns
   null before the first point — "the chronicle does not reckon this yet". */
window.tlPopAt = function (series, year) {
  if (!series || !series.length) return null;
  if (year <= series[0][0]) return year < series[0][0] ? null : series[0][1];
  for (var i = 1; i < series.length; i++) {
    if (year <= series[i][0]) {
      var a = series[i - 1], b = series[i];
      var t = (year - a[0]) / (b[0] - a[0] || 1);
      return Math.round(a[1] + (b[1] - a[1]) * t);
    }
  }
  return series[series.length - 1][1];
};

/* every land a power holds in a given year, and the souls under that banner */
window.tlPowerAt = function (powerId, year) {
  var lands = [], souls = 0, reckoned = false;
  (window.TL_LANDS || []).forEach(function (l) {
    if (window.tlHolderAt(l, year) !== powerId) return;
    lands.push(l);
    var p = window.tlPopAt(l.pop, year);
    if (p != null) { souls += p; reckoned = true; }
  });
  return { lands: lands, souls: reckoned ? souls : null };
};
