/* WHO SAID IT? — per-saga portrait resolver.
   The root js/people.js defines the GoT portrait table as `const PEOPLE_IMGS`, and
   the HotD/Knight people.js files use the SAME const name, so they cannot all be
   loaded on one page. This game therefore keeps its own saga -> { base, map } table:
   GoT reuses the already-loaded PEOPLE_IMGS (the single source of truth, no drift);
   the HotD block lists only the faces this game actually quotes, copied verbatim from
   hotd/js/people.js; Knight has no character portraits (its own wiki uses initials),
   so its map is empty and answers fall back to initials — which is expected. */
window.WS_PORTRAITS = {
  got: {
    base: "../assets/people/",
    map: (typeof PEOPLE_IMGS !== "undefined" ? PEOPLE_IMGS : {}),
  },
  hotd: {
    base: "../hotd/assets/people/",
    /* Every face that exists on disk, not merely the ones quoted today. A name
       missing from here renders as bare initials among three photographs, which
       is a silent tell for which option is the odd one out — so a decoy may only
       be drawn from this list. Copied from hotd/js/people.js (the honorific
       aliases are dropped; the game always uses the plain name). */
    map: {
      // ---- the royal line ----
      "Viserys I Targaryen": "viserys-i.jpg",
      "Rhaenyra Targaryen": "rhaenyra-targaryen.jpg",
      "Daemon Targaryen": "daemon-targaryen.jpg",
      "Alicent Hightower": "alicent-hightower.jpg",
      "Aegon II Targaryen": "aegon-ii.jpg",
      "Helaena Targaryen": "helaena-targaryen.jpg",
      "Aemond Targaryen": "aemond-targaryen.jpg",
      "Jaehaerys Targaryen": "jaehaerys-targaryen.jpg",
      "Jaehaera Targaryen": "jaehaera-targaryen.jpg",
      "Aegon the Younger": "aegon-the-younger.jpg",
      "Viserys the Younger": "viserys-the-younger.jpg",
      "Aemma Arryn": "aemma-arryn.jpg",
      "Rhaenys Targaryen": "rhaenys-targaryen.jpg",
      "Baela Targaryen": "baela-targaryen.jpg",
      "Rhaena Targaryen": "rhaena-targaryen.jpg",

      // ---- House Velaryon ----
      "Corlys Velaryon": "corlys-velaryon.jpg",
      "Laena Velaryon": "laena-velaryon.jpg",
      "Laenor Velaryon": "laenor-velaryon.jpg",
      "Vaemond Velaryon": "vaemond-velaryon.jpg",
      "Jacaerys Velaryon": "jacaerys-velaryon.jpg",
      "Lucerys Velaryon": "lucerys-velaryon.jpg",
      "Joffrey Velaryon": "joffrey-velaryon.jpg",
      "Alyn of Hull": "alyn-of-hull.jpg",
      "Addam of Hull": "addam-of-hull.jpg",

      // ---- the greens ----
      "Otto Hightower": "otto-hightower.jpg",
      "Gwayne Hightower": "gwayne-hightower.jpg",
      "Criston Cole": "criston-cole.jpg",
      "Larys Strong": "larys-strong.jpg",
      "Lyman Beesbury": "lyman-beesbury.jpg",
      "Arryk Cargyll": "arryk-cargyll.jpg",
      "Erryk Cargyll": "erryk-cargyll.jpg",

      // ---- House Strong & Harrenhal ----
      "Lyonel Strong": "lyonel-strong.jpg",
      "Harwin Strong": "harwin-strong.jpg",
      "Simon Strong": "simon-strong.jpg",
      "Alys Rivers": "alys-rivers.jpg",

      // ---- the court & the realm ----
      "Mysaria": "mysaria.jpg",
      "Rhea Royce": "rhea-royce.jpg",
      "Joffrey Lonmouth": "joffrey-lonmouth.jpg",
      "Craghas Drahar": "craghas-drahar.jpg",
      "Steffon Darklyn": "steffon-darklyn.jpg",
      "Gunthor Darklyn": "gunthor-darklyn.jpg",
      "Hugh Hammer": "hugh-hammer.jpg",
      "Ulf the White": "ulf-the-white.jpg",
      "Cregan Stark": "cregan-stark.jpg",
      "Jeyne Arryn": "jeyne-arryn.jpg",
      "Jason Lannister": "jason-lannister.jpg",
      "Tyland Lannister": "tyland-lannister.jpg",
      "Borros Baratheon": "borros-baratheon.jpg",
      "Willem Blackwood": "willem-blackwood.jpg",
      "Sharako Lohar": "sharako-lohar.jpg",
    },
  },
  knight: {
    base: "../knight/assets/people/",
    map: {},
  },
};
