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
    map: {
      "Daemon Targaryen": "daemon-targaryen.jpg",
      "Rhaenyra Targaryen": "rhaenyra-targaryen.jpg",
      "Rhaenys Targaryen": "rhaenys-targaryen.jpg",
      "Corlys Velaryon": "corlys-velaryon.jpg",
      "Viserys I Targaryen": "viserys-i.jpg",
      "Aemond Targaryen": "aemond-targaryen.jpg",
      "Aegon II Targaryen": "aegon-ii.jpg",
      "Alicent Hightower": "alicent-hightower.jpg",
      "Otto Hightower": "otto-hightower.jpg",
      "Criston Cole": "criston-cole.jpg",
      "Helaena Targaryen": "helaena-targaryen.jpg",
      "Baela Targaryen": "baela-targaryen.jpg",
      "Laena Velaryon": "laena-velaryon.jpg",
      "Jacaerys Velaryon": "jacaerys-velaryon.jpg",
      "Lucerys Velaryon": "lucerys-velaryon.jpg",
    },
  },
  knight: {
    base: "../knight/assets/people/",
    map: {},
  },
};
