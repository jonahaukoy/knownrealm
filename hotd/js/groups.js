/* HOUSE OF THE DRAGON — groups: great houses, orders & factions, noble houses.
   Same model as the ASOIAF map: a member entry is a plain name string or
   { n, showFrom:{s,e}, showUntil:{s,e}, bookFrom:{b,ch}, bookUntil:{b,ch}, note }.
   Great-house groups carry only {id, members}; name/words/seat/description come
   from WORLD.houses. Orders and noble houses are fully described here. */

const GROUP_SECTIONS = [
  {
    kind: "great", label: "The Great Houses",
    groups: [
      { id: "targaryen", members: [
        "Viserys I Targaryen", "Aemma Arryn", "Rhaenyra Targaryen", "Daemon Targaryen", "Rhaenys Targaryen",
        "Aegon II Targaryen", "Helaena Targaryen", "Aemond Targaryen", "Daeron Targaryen",
        "Jaehaerys Targaryen", "Jaehaera Targaryen", "Maelor Targaryen",
        "Aegon the Younger", "Viserys the Younger", "Baela Targaryen", "Rhaena Targaryen" ] },
      { id: "velaryon", members: [
        "Corlys Velaryon", "Rhaenys Targaryen", "Laena Velaryon", "Laenor Velaryon", "Vaemond Velaryon",
        "Jacaerys Velaryon", "Lucerys Velaryon", "Joffrey Velaryon",
        { n: "Addam of Hull", showFrom: { s: 2, e: 6 }, bookFrom: { b: 1, ch: 5 }, note: "claimed by Seasmoke — and, in time, the name" },
        { n: "Alyn of Hull", showFrom: { s: 2, e: 2 }, bookFrom: { b: 1, ch: 5 }, note: "the Sea Snake's unclaimed blood" } ] },
      { id: "hightower", members: [ "Otto Hightower", "Alicent Hightower", "Gwayne Hightower", "Ormund Hightower" ] },
      { id: "stark", members: [ "Cregan Stark" ] },
      { id: "arryn", members: [ "Jeyne Arryn", "Aemma Arryn" ] },
      { id: "lannister", members: [ "Jason Lannister", "Tyland Lannister" ] },
      { id: "tully", members: [] },
      { id: "baratheon", members: [ "Borros Baratheon" ] },
      { id: "greyjoy", members: [ "Dalton Greyjoy" ] },
      { id: "tyrell", members: [] },
      { id: "martell", members: [] },
      { id: "frey", members: [] },
    ],
  },
  {
    kind: "order", label: "Courts, Orders & Factions",
    groups: [
      { id: "blacks", name: "The Blacks — the Queen's Party", emblem: { glyph: "◆", color: "#1a1a1a" },
        words: "All hail Rhaenyra, first of her name", seat: "dragonstone",
        blurb: "The party of Princess — then Queen — Rhaenyra: the painted table's council of dragons and ships. The Velaryon fleet, the Vale, the North and the riverlands answer to the black banners.",
        members: [
          "Rhaenyra Targaryen", "Daemon Targaryen", "Corlys Velaryon", "Rhaenys Targaryen",
          "Jacaerys Velaryon", "Lucerys Velaryon", "Joffrey Velaryon", "Baela Targaryen", "Rhaena Targaryen",
          { n: "Steffon Darklyn", showFrom: { s: 1, e: 10 }, bookFrom: { b: 1, ch: 2 }, note: "brought the queen her father's crown" },
          { n: "Erryk Cargyll", showFrom: { s: 1, e: 10 }, bookFrom: { b: 1, ch: 2 } },
          { n: "Mysaria", showFrom: { s: 2, e: 2 }, bookFrom: { b: 1, ch: 3 }, note: "the White Worm, turned to the queen" },
          { n: "Cregan Stark", showFrom: { s: 2, e: 1 }, bookFrom: { b: 1, ch: 2 }, note: "the Pact of Ice and Fire" },
          { n: "Jeyne Arryn", showFrom: { s: 2, e: 5 }, bookFrom: { b: 1, ch: 2 }, note: "the Vale, for the queen" },
          { n: "Willem Blackwood", showFrom: { s: 2, e: 3 }, note: "kneels to Daemon at Raventree" } ] },
      { id: "greens", name: "The Greens — the King's Party", emblem: { glyph: "◆", color: "#3f6b3a" },
        words: "All hail Aegon, second of his name", seat: "kings-landing",
        blurb: "The party of Queen Alicent and King Aegon II, named for the Hightower green she wore to a black court. Oldtown, the Rock and Storm's End march under the green king's dragon.",
        members: [
          "Alicent Hightower", "Otto Hightower", "Gwayne Hightower", "Ormund Hightower", "Larys Strong", "Criston Cole",
          { n: "Aegon II Targaryen", showFrom: { s: 1, e: 9 }, bookFrom: { b: 1, ch: 2 }, note: "crowned in the Dragonpit" },
          "Aemond Targaryen", "Helaena Targaryen", "Daeron Targaryen",
          "Jason Lannister", "Tyland Lannister",
          { n: "Borros Baratheon", showFrom: { s: 1, e: 10 }, bookFrom: { b: 1, ch: 2 }, note: "four daughters, one pact" },
          { n: "Arryk Cargyll", showFrom: { s: 1, e: 10 }, bookFrom: { b: 1, ch: 2 } } ] },
      { id: "kingsguard", name: "The Kingsguard", emblem: { glyph: "KG", color: "#c9ccd2" },
        words: "Sworn for life", seat: "kings-landing",
        blurb: "The seven white cloaks sworn to shield the king — an oath the Dance splits down the middle, brother against brother, queensguard against kingsguard.",
        members: [ "Criston Cole", "Arryk Cargyll", "Erryk Cargyll", "Steffon Darklyn" ] },
      { id: "city-watch", name: "The City Watch", emblem: { glyph: "GC", color: "#b89235" },
        words: "The gold cloaks",
        blurb: "The watchmen of King's Landing, two thousand strong — given their gold cloaks and their teeth by Prince Daemon, and loyal to his memory long after the crown forgot it.",
        members: [
          { n: "Daemon Targaryen", showUntil: { s: 1, e: 2 }, bookUntil: { b: 1, ch: 2 }, note: "their first commander" },
          { n: "Harwin Strong", showUntil: { s: 1, e: 6 }, bookUntil: { b: 1, ch: 1 }, note: "Breakbones, their captain" } ] },
      { id: "dragonseeds", name: "The Dragonseeds", emblem: { glyph: "DS", color: "#8a3320" },
        words: "The Red Sowing",
        blurb: "Bastards and smallfolk with the blood of old Valyria in them, summoned by the queen to try the riderless dragons. Dozens burned; a handful rose — and changed the war's arithmetic.",
        members: [
          { n: "Addam of Hull", showFrom: { s: 2, e: 6 }, bookFrom: { b: 1, ch: 5 }, note: "Seasmoke" },
          { n: "Hugh Hammer", showFrom: { s: 2, e: 7 }, bookFrom: { b: 1, ch: 5 }, note: "Vermithor, the Bronze Fury" },
          { n: "Ulf the White", showFrom: { s: 2, e: 7 }, bookFrom: { b: 1, ch: 5 }, note: "Silverwing" } ] },
      { id: "triarchy", name: "The Triarchy", emblem: { glyph: "TR", color: "#6a4a2a" },
        words: "The Three Daughters",
        blurb: "The alliance of Lys, Myr and Tyrosh that rules the Stepstones' tolls — the Crabfeeder's paymasters, and later the green crown's hired fleet of ninety warships.",
        members: [ "Craghas Drahar", "Sharako Lohar" ] },
    ],
  },
  {
    kind: "noble", label: "The Noble Houses",
    groups: [
      { id: "strong", name: "House Strong", emblem: { img: "strong.svg" }, words: "", seat: "harrenhal", region: "the-riverlands",
        blurb: "Lords of Harrenhal in the Dance's generation: a house of able counselors and strong backs — and of fires that always seem to burn in Larys Clubfoot's favor.",
        members: [ "Lyonel Strong", "Harwin Strong", "Larys Strong", "Simon Strong",
          { n: "Alys Rivers", note: "a bastard of the house" } ] },
      { id: "royce", name: "House Royce", emblem: { glyph: "RY", color: "#7a6a3a" }, words: "We Remember", seat: "runestone", region: "the-vale",
        blurb: "The bronze-armored Royces of Runestone, First Men blood older than the Andals — proud, stubborn, and owed better than the marriage the crown gave their lady.",
        members: [ "Rhea Royce" ] },
      { id: "blackwood", name: "House Blackwood", emblem: { glyph: "BW", color: "#26221e" }, words: "", seat: "raventree-hall", region: "the-riverlands",
        blurb: "Old-gods riverlords of Raventree Hall, nine hundred years at feud with the Brackens across the stream — early and eager swords for the black queen.",
        members: [ "Willem Blackwood" ] },
      { id: "bracken", name: "House Bracken", emblem: { glyph: "BR", color: "#7a4a2a" }, words: "", seat: "stone-hedge", region: "the-riverlands",
        blurb: "The Blackwoods' ancient enemies at Stone Hedge, keepers of the other half of a grudge nine centuries deep — and, mostly to spite Raventree, swords for the green king.",
        members: [] },
      { id: "darklyn", name: "House Darklyn", emblem: { glyph: "DK", color: "#3d4a5c" }, words: "", seat: "duskendale", region: "the-crownlands",
        blurb: "The old kings of Duskendale, long since bent to the Iron Throne but proud as ever of the port that was theirs before King's Landing was a fishing village.",
        members: [ "Gunthor Darklyn", "Steffon Darklyn" ] },
    ],
  },
];

/* ---- membership helpers ---- */
function groupMemberName(m) { return typeof m === "string" ? m : m.n; }
function groupMemberNote(m) { return typeof m === "string" ? "" : (m.note || ""); }

function _showReached(g, pt) { return g.s < pt.s || (g.s === pt.s && g.e <= pt.e); }
function _bookReached(g, pt) { return g.b < pt.b || (g.b === pt.b && g.ch <= pt.ch); }

/* is this membership entry visible at story point pt (null = whole tale, show all)? */
function memberVisibleAt(m, pt) {
  if (typeof m === "string" || !pt) return true;
  if (pt.type === "show") {
    if (m.showFrom && !_showReached(m.showFrom, pt)) return false;   // not yet
    if (m.showUntil && _showReached(m.showUntil, pt)) return false;  // ended
    return true;
  }
  if (m.bookFrom && !_bookReached(m.bookFrom, pt)) return false;
  if (m.bookUntil && _bookReached(m.bookUntil, pt)) return false;
  return true;
}

/* ordered member names for a group, visible at pt */
function groupMembersAt(group, pt) {
  return group.members.filter((m) => memberVisibleAt(m, pt)).map(groupMemberName);
}

/* flat lookup of every group by id */
const GROUP_BY_ID = {};
GROUP_SECTIONS.forEach((sec) => sec.groups.forEach((g) => { GROUP_BY_ID[g.id] = { sec: sec.kind, group: g }; }));

/* reverse index: character name -> list of {kind, id, member-entry} it appears in */
const CHAR_GROUPS = {};
GROUP_SECTIONS.forEach((sec) => sec.groups.forEach((g) => {
  g.members.forEach((m) => {
    const name = groupMemberName(m);
    (CHAR_GROUPS[name] = CHAR_GROUPS[name] || []).push({ kind: sec.kind, id: g.id, m });
  });
}));

/* the groups a character belongs to at story point pt */
function characterGroupsAt(name, pt) {
  return (CHAR_GROUPS[name] || [])
    .filter((e) => memberVisibleAt(e.m, pt))
    .map((e) => ({ kind: e.kind, id: e.id, note: groupMemberNote(e.m) }));
}
