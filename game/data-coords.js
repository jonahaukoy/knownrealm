/* ============================================================================
   THE IRON LADDER — WHERE THE PLACES ARE.

   Basemap pixel space, 5652 x 3682 — the same coordinate space every other map
   on this site uses, so a pin here lands exactly where the pin on map.html does.

   GENERATED, mostly. 81 of these come straight from LOCATION_ROWS in js/data.js,
   which the map has been using since the first build. A further 17 are districts,
   harbours or temples OF one of those, offset from the parent by hand: Flea
   Bottom is in King's Landing, the Citadel is in Oldtown, Lordsport is Pyke's
   harbour. Three more come from WB_SPOTS in js/whereabouts.js.

   39 of the game's places deliberately have NO entry here — Sisterton, Kayce,
   Orkmont, Asshai and the rest. I would have to invent a position for them, and
   on a map this well known an invented pin is worse than no pin: it is
   confidently wrong. Those places still appear in the travel list; they simply
   have no dot on the map. play.js treats a missing coordinate as "listed, not
   pinned", so adding one later is a row here and nothing else.

   If you add a place to data-world.js, it needs a row here or it will be
   reachable only from the list.
   ========================================================================== */

window.IL_XY = {
  "winterfell": [1207, 745],
  "wintertown": [1207, 779],   /* anchored to winterfell — the village under Winterfell's walls */
  "white-harbor": [1361, 1059],
  "barrowton": [962, 1047],
  "karhold": [1726, 559],
  "last-hearth": [1494, 495],
  "dreadfort": [1522, 692],
  "moat-cailin": [1228, 1120],
  "bear-island": [930, 415],
  "torrhens-square": [999, 865],
  "hornwood": [1463, 828],
  "widows-watch": [1780, 1016],
  "skagos": [1760, 280],   /* from WB_SPOTS in js/whereabouts.js */
  "castle-black": [1424, 258],
  "eastwatch": [1546, 255],
  "shadow-tower": [1286, 245],
  "moles-town": [1418, 304],   /* anchored to castle-black — half a day south of the Wall */
  "crasters-keep": [1351, 187],
  "hardhome": [1585, 115],
  "haunted-forest": [1452, 205],   /* from WB_SPOTS in js/whereabouts.js */
  "riverrun": [1088, 1765],
  "harrenhal": [1295, 1807],
  "the-twins": [1143, 1452],
  "maidenpool": [1533, 1860],
  "stoney-sept": [1142, 1945],
  "crossroads-inn": [1400, 1730],   /* from WB_SPOTS in js/whereabouts.js */
  "seagard": [1105, 1529],
  "raventree-hall": [1089, 1708],
  "stone-hedge": [1178, 1753],
  "gods-eye": [1338, 1866],
  "eyrie": [1587, 1593],
  "gulltown": [1800, 1642],
  "runestone": [1836, 1608],
  "bloody-gate": [1514, 1627],
  "mountains-of-the-moon": [1522, 1455],
  "pyke": [743, 1630],
  "lordsport": [773, 1644],   /* anchored to pyke — Pyke's own harbour */
  "casterly-rock": [740, 1956],
  "lannisport": [732, 1973],
  "golden-tooth": [948, 1858],
  "crakehall": [660, 2186],
  "ashemark": [848, 1825],
  "silverhill": [934, 2100],
  "deep-den": [975, 1999],
  "red-keep": [1549, 2045],   /* anchored to kings-landing — Aegon's High Hill */
  "flea-bottom": [1519, 2069],   /* anchored to kings-landing — the bottom of the city */
  "street-of-steel": [1531, 2039],   /* anchored to kings-landing — Visenya's Hill */
  "kings-landing-docks": [1555, 2073],   /* anchored to kings-landing — the Mud Gate on the Blackwater */
  "great-sept": [1517, 2049],   /* anchored to kings-landing — Visenya's Hill */
  "dragonstone": [1758, 1932],
  "rosby": [1513, 1967],
  "kingswood": [1565, 2185],
  "highgarden": [912, 2457],
  "oldtown": [720, 2668],
  "citadel": [706, 2674],   /* anchored to oldtown — the Citadel is in Oldtown */
  "bitterbridge": [1142, 2278],
  "horn-hill": [957, 2546],
  "old-oak": [705, 2307],
  "ashford": [1147, 2421],
  "brightwater": [740, 2548],
  "goldengrove": [914, 2297],
  "storms-end": [1654, 2358],
  "bronzegate": [1630, 2301],
  "nightsong": [1115, 2582],
  "blackhaven": [1300, 2508],
  "evenfall": [1811, 2323],
  "griffins-roost": [1608, 2411],
  "summerhall": [1440, 2383],
  "mistwood": [1672, 2541],
  "sunspear": [1798, 2863],
  "shadow-city": [1778, 2871],   /* anchored to sunspear — the warren under Sunspear's walls */
  "yronwood": [1328, 2719],
  "starfall": [964, 2757],
  "hellholt": [1199, 2852],
  "sandstone": [1072, 2872],
  "vaith": [1422, 2869],
  "kingsgrave": [1169, 2643],
  "braavos": [2201, 1413],
  "ragmans-harbor": [2187, 1425],   /* anchored to braavos — a harbour of Braavos */
  "house-black-white": [2205, 1429],   /* anchored to braavos — a temple on a Braavosi hill */
  "iron-bank": [2211, 1403],   /* anchored to braavos — a building in Braavos */
  "pentos": [2215, 2070],
  "myr": [2337, 2514],
  "lys": [2221, 2898],
  "tyrosh": [2059, 2531],
  "volantis": [2838, 2925],
  "norvos": [2602, 1830],
  "qohor": [2890, 1760],
  "vaes-dothrak": [4754, 1800],
  "khalasar": [4614, 1890],   /* anchored to vaes-dothrak — the grass around the one city */
  "womb-of-the-world": [4694, 1844],   /* anchored to vaes-dothrak — the lake by Vaes Dothrak */
  "ny-sar": [2616, 2168],
  "astapor": [4010, 2940],
  "yunkai": [4035, 2703],
  "meereen": [4113, 2612],
  "fighting-pits": [4129, 2626],   /* anchored to meereen — Daznak's, inside Meereen */
  "new-ghis": [4090, 3520],
  "mantarys": [3448, 2713],
  "qarth": [5283, 3186],
  "house-undying": [5295, 3174],   /* anchored to qarth — inside Qarth's walls */
  "red-waste": [4900, 2870],
};
