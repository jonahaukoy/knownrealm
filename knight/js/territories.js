/* A KNIGHT OF THE SEVEN KINGDOMS — an ALLEGIANCE map: who each land answers to
   as the tale turns. Polygons are drawn generously past the coast in image-pixel
   space and clipped to dry land by assets/landmask.png (white = land). Toggled
   from The Map dropdown.

   Unlike the war-torn later age, this realm is WHOLE: every kingdom answers to
   the Iron Throne, so the map is colored by the lords paramount who hold each
   land for the dragon — with two restless exceptions (the free folk beyond the
   Wall, and Dagon Greyjoy's isles that reave in all but name), and one brief
   black flicker: the second Blackfyre rising at Whitewalls (The Mystery Knight).

   Each territory: `base` ruler + optional `own` ([season, episode, ruler]) and
   `ownBook` ([book, chapter, ruler]) timelines — from that point the land
   answers to the new ruler (null hides it). */

const RULERS = {
  "iron-throne":  { name: "The Iron Throne (House Targaryen)",     color: "#e0a410" },
  "stark":        { name: "House Stark, Wardens of the North",     color: "#5a6472" },
  "arryn":        { name: "House Arryn, Wardens of the East",      color: "#35b6e8" },
  "tully":        { name: "House Tully, Lords of the Trident",     color: "#2e5fcc" },
  "greyjoy":      { name: "Dagon Greyjoy's Iron Islands",          color: "#7a3fb0" },
  "lannister":    { name: "House Lannister, Wardens of the West",  color: "#c9141f" },
  "tyrell":       { name: "House Tyrell, Wardens of the South",    color: "#4c8a22" },
  "baratheon":    { name: "House Baratheon of Storm's End",        color: "#1f8a8a" },
  "martell":      { name: "House Martell, Princes of Dorne",       color: "#e06414" },
  "nights-watch": { name: "The Night's Watch",                     color: "#9fb1c4" },
  "free-folk":    { name: "The Free Folk",                         color: "#77876f" },
  "blackfyre":    { name: "The Black Dragon (House Blackfyre)",    color: "#3a1220" },
};

const TERRITORIES = [

  /* ---------------- beyond the Wall: no king's writ, ever ----------------
     ONE land, not three (Aug 2026) — see the long note in js/territories.js.
     Nothing walks up here in Dunk's century but free folk. Top edge is y=0:
     the chart draws dry land all the way to its own top border. */
  { id: "beyond-the-wall", name: "Beyond the Wall", base: "free-folk",
    pts: [[240,0],[1660,0],[1660,240],[1620,252],[1546,248],[1424,262],[1300,272],[1180,285],[1100,310],[950,340],[700,350],[400,360],[260,300]] },

  /* ---------------- the North: Lord Beron Stark's, for the dragon ---------------- */
  { id: "the-north", name: "The North", base: "stark",
    pts: [[360,380],[950,340],[1040,458],[1100,446],[1180,421],[1300,408],[1424,398],[1546,384],[1620,388],[1660,390],[1720,405],[1950,445],[1950,1230],[1600,1255],[1400,1240],[1250,1232],[1100,1258],[900,1285],[830,1310],[720,1352],[600,1362],[500,1345],[420,1330],[360,1335]] },
  { id: "the-north-isles", name: "Skagos & the northern isles", base: "stark",
    pts: [[1670,150],[1950,140],[1950,415],[1760,420],[1690,315]] },

  /* The Gift and the New Gift: the Watch's two bands immediately south of the
     Wall, from the Shadow Tower to Eastwatch (not out to Bear Island or the
     Grey Cliffs). REDRAWN Aug 2026 as two straight 25-league bands at 2.75px
     to the league — see js/territories.js for the working. By Dunk's day the
     New Gift is two centuries of emptying farmland the Watch cannot defend. */
  { id: "the-gift", name: "The Gift", base: "nights-watch",
    pts: [[1040,322],[1100,310],[1180,285],[1300,272],[1424,262],[1546,248],[1620,252],[1660,254],[1660,322],[1620,320],[1546,316],[1424,330],[1300,340],[1180,353],[1100,378],[1040,390]] },
  { id: "the-new-gift", name: "The New Gift", base: "nights-watch",
    pts: [[1040,390],[1100,378],[1180,353],[1300,340],[1424,330],[1546,316],[1620,320],[1660,322],[1660,390],[1620,388],[1546,384],[1424,398],[1300,408],[1180,421],[1100,446],[1040,458]] },

  /* ---------------- the Vale: quiet behind its mountains ---------------- */
  { id: "the-vale", name: "The Vale", base: "arryn",
    pts: [[1462,1330],[1520,1430],[1500,1520],[1478,1620],[1505,1720],[1560,1700],[1750,1680],[1950,1650],[1950,1285],[1830,1278],[1690,1288],[1580,1315],[1500,1345]] },

  /* ---------------- the Riverlands: Tully's, with restless corners ---------------- */
  { id: "the-riverlands", name: "The Riverlands", base: "tully",
    pts: [[600,1362],[720,1352],[830,1310],[900,1285],[1100,1258],[1250,1232],[1400,1240],[1560,1258],[1462,1330],[1520,1430],[1500,1520],[1478,1620],[1505,1720],[1560,1700],[1560,1810],[1620,1848],[1500,1898],[1440,1925],[1350,1870],[1260,1860],[1230,1920],[1240,2000],[1270,2080],[1170,2075],[1080,2060],[1030,1960],[1010,1880],[980,1820],[900,1750],[870,1655],[920,1640],[940,1500],[930,1370]] },

  /* Whitewalls & the Gods Eye shore: the black dragon's brief hour (books,
     The Mystery Knight) — then forfeit to the crown, to be pulled down. */
  { id: "whitewalls-rising", name: "Whitewalls & the Gods Eye shore", base: null, sub: true,
    ownBook: [[3,5,"blackfyre"],[3,11,"iron-throne"],[3,12,null]],
    pts: [[1310,1770],[1400,1762],[1420,1840],[1370,1890],[1300,1858]] },

  /* ---------------- the Iron Islands: Dagon Greyjoy's Old Way ---------------- */
  { id: "iron-islands", name: "The Iron Islands", base: "greyjoy",
    pts: [[560,1430],[820,1430],[870,1470],[930,1545],[900,1620],[860,1650],[790,1655],[700,1690],[590,1670],[520,1560]] },

  /* ---------------- the Westerlands ---------------- */
  { id: "the-westerlands", name: "The Westerlands", base: "lannister",
    pts: [[760,1660],[870,1655],[900,1750],[980,1820],[1010,1880],[1030,1960],[1080,2060],[950,2140],[850,2200],[740,2240],[640,2270],[480,2240],[510,1780],[730,1715]] },

  /* ---------------- the Crownlands (Crackclaw Point merged in, see GoT) ------- */
  { id: "the-crownlands", name: "The Crownlands", base: "iron-throne",
    pts: [[1560,1700],[1750,1680],[1950,1650],[1950,1878],[1725,1878],[1725,1985],[1950,1985],[1950,2225],[1650,2228],[1520,2212],[1400,2190],[1330,2140],[1270,2080],[1240,2000],[1230,1920],[1260,1860],[1350,1870],[1440,1925],[1500,1898],[1620,1848],[1560,1810]] },
  { id: "dragonstone-isle", name: "Dragonstone", base: "iron-throne", nomask: true,
    pts: [[1745,1898],[1786,1906],[1796,1934],[1772,1962],[1738,1954],[1728,1920]] },

  /* ---------------- the Reach: the rose, over the tale's small lions,
     spiders, and apples ---------------- */
  { id: "the-reach", name: "The Reach", base: "tyrell",
    /* SW border shared cleanly with Dorne — Sun House/Three Towers stay Reach,
       Starfall/Sandstone stay Dorne. */
    pts: [[1080,2060],[1170,2075],[1270,2080],[1330,2140],[1400,2190],[1350,2260],[1330,2380],[1230,2430],[1090,2470],[1010,2560],[940,2620],[925,2760],[912,2880],[905,3010],[560,2970],[430,2500],[480,2260],[640,2270],[740,2240],[850,2200],[950,2140]] },

  /* ---------------- the Stormlands ---------------- */
  { id: "the-stormlands", name: "The Stormlands", base: "baratheon",
    pts: [[1400,2190],[1520,2212],[1650,2228],[1950,2230],[1950,2610],[1600,2645],[1430,2625],[1305,2560],[1200,2565],[1100,2620],[1010,2560],[1090,2470],[1230,2430],[1330,2380],[1350,2260]] },

  /* ---------------- Dorne: joined by marriage, ruled by its princes ---------------- */
  { id: "dorne", name: "Dorne", base: "martell",
    /* western boundary shares one clean line with the Reach (940,2620 →
       905,3010) — no westward overlap. */
    pts: [[1010,2560],[1100,2620],[1200,2565],[1305,2560],[1430,2625],[1600,2645],[1950,2610],[1950,3050],[1300,3050],[905,3010],[912,2880],[925,2760],[940,2620]] },
];

/* In this age the crown never changes dynasty: the dragon holds the chair
   from the tale's first day to its last. */
const CROWN_SHOW = [];
function crownDynastyAt(pt) {
  return "iron-throne";
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
