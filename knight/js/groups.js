/* A KNIGHT OF THE SEVEN KINGDOMS — groups: great houses, orders & companies,
   and noble houses. A person can belong to more than one group, and a membership
   can be time-gated so it appears/changes exactly when the show or books reveal
   it. A member entry is either a plain name string (member for the whole tale)
   or an object: { n, showFrom:{s,e}, showUntil:{s,e}, bookFrom:{b,ch},
   bookUntil:{b,ch}, note }. When no episode or chapter is selected (whole-tale
   view), every membership shows. Great-house groups carry only {id, members};
   the rich name/words/seat/description come from WORLD.houses. Orders and noble
   houses are fully described here. */

const GROUP_SECTIONS = [
  {
    kind: "great", label: "The Great Houses",
    groups: [
      { id: "targaryen", members: [
        "King Daeron II Targaryen", "Baelor Breakspear", "Valarr Targaryen", "Aerys I Targaryen",
        "Prince Maekar Targaryen", "Aerion Brightflame", "Daeron Targaryen", "Aemon Targaryen",
        { n: "Egg", note: "a prince in a stableboy's skin" },
        { n: "Brynden Rivers", note: "Bloodraven — the old king's bastard, the realm's eyes" } ] },
      { id: "blackfyre", members: [
        { n: "John the Fiddler", bookUntil: { b: 3, ch: 9 }, note: "a golden mystery knight, bound for a wedding" },
        { n: "Daemon II Blackfyre", bookFrom: { b: 3, ch: 9 }, note: "the Fiddler unmasked — the black dragon's heir" },
        "Aegor Rivers, called Bittersteel" ] },
      { id: "baratheon", members: [ "Ser Lyonel Baratheon" ] },
      { id: "tyrell", members: [ "Lord Leo Tyrell, called Longthorn" ] },
      { id: "lannister", members: [ "Ser Tybolt Lannister" ] },
      { id: "stark", members: [ "Lord Beron Stark" ] },
      { id: "arryn", members: [ "The Lord Arryn of the Eyrie" ] },
      { id: "tully", members: [ "The Lord Tully of Riverrun" ] },
      { id: "greyjoy", members: [ "Dagon Greyjoy, the Last Reaver" ] },
      { id: "martell", members: [ "The Prince of Dorne" ] },
      { id: "ashford", members: [
        "Lord Ashford", "The Fair Maid of Ashford", "Ser Androw Ashford", "Ser Robert Ashford" ] },
      { id: "osgrey", members: [ "Ser Eustace Osgrey",
        { n: "Lady Rohanne Webber", bookFrom: { b: 2, ch: 10 }, note: "wed to Ser Eustace — peace, the old way" } ] },
      { id: "webber", members: [ "Lady Rohanne Webber",
        { n: "Ser Lucas Inchfield", note: "the Longinch, castellan of Coldmoat" },
        "Septon Sefton" ] },
      { id: "butterwell", members: [ "Lord Ambrose Butterwell",
        { n: "Black Tom Heddle", note: "his grim good-son" } ] },
      { id: "fossoway", members: [
        { n: "Ser Steffon Fossoway", note: "the red apple" },
        { n: "Raymun Fossoway", note: "knighted at Ashford — the first green apple" } ] },
      { id: "peake", members: [ "Lord Gormon Peake" ] },
    ],
  },
  {
    kind: "order", label: "Orders & Companies of the Road",
    groups: [
      { id: "hedge-knights", name: "The Hedge Knights", emblem: { glyph: "HK", color: "#5b7d9c" },
        words: "We serve where we will",
        blurb: "The landless knighthood of the Seven Kingdoms: men with a horse, a sword, and no lord, who sleep under hedges and sell their service tourney to tourney. The truest kind of knight, old Ser Arlan said — and the poorest.",
        members: [ "Ser Duncan the Tall", "Ser Arlan of Pennytree",
          { n: "Ser Bennis of the Brown Shield", note: "brown of shield, cloak, and soul" },
          "Ser Kyle the Cat", "Ser Maynard Plumm",
          { n: "Ser Uthor Underleaf", note: "the Snail — jousting as a trade" },
          { n: "Ser Glendon Ball", note: "the Knight of the Pussywillows, Fireball's son" } ] },
      { id: "kingsguard", name: "The Kingsguard", emblem: { glyph: "KG", color: "#c9ccd2" },
        words: "Sworn for life", seat: "kings-landing",
        blurb: "The seven white knights sworn to shield the king and his blood with their lives — which at Ashford Meadow puts three of them on the wrong side of a trial of seven, oath-bound to fight for a prince in the wrong.",
        members: [ "Ser Roland Crakehall", "Ser Donnel of Duskendale", "Ser Willem Wylde" ] },
      { id: "blackfyre-men", name: "The Black Dragon's Men", emblem: { glyph: "BD", color: "#8f1d2c" },
        words: "The king across the water",
        blurb: "The men who rose for Daemon Blackfyre at Redgrass Field and their unreconciled sons: broken lords, bitter knights, and schemers who toast 'the king across the water' — and gather, in 212, under a milk-white roof by the Gods Eye.",
        members: [
          { n: "John the Fiddler", bookUntil: { b: 3, ch: 9 }, note: "the wedding's golden guest" },
          { n: "Daemon II Blackfyre", bookFrom: { b: 3, ch: 9 }, note: "the pretender himself" },
          { n: "Lord Gormon Peake", note: "the conspiracy's iron spine" },
          { n: "Black Tom Heddle", note: "steel for the plot" },
          { n: "Ser Alyn Cockshaw", note: "gold and jealousy" },
          { n: "Lord Ambrose Butterwell", note: "the host who wanted it both ways" },
          { n: "Ser Eustace Osgrey", bookUntil: { b: 2, ch: 10 }, note: "an old soldier of Redgrass Field, reconciled at last" } ] },
      { id: "showfolk", name: "Smallfolk & Showfolk", emblem: { glyph: "SF", color: "#8a6d3b" },
        words: "The realm the lords ride past",
        blurb: "The puppeteers, armorers, innkeeps, and diggers the tale moves among — the people a hedge knight comes from, and the people he is sworn, in the old words, to protect.",
        members: [
          { n: "Tanselle", note: "Tanselle Too-Tall, puppeteer of Dorne" },
          { n: "Steely Pate", note: "master armorer of Ashford Meadow" } ] },
    ],
  },
  {
    kind: "noble", label: "The Noble Houses",
    groups: [
      { id: "dondarrion", name: "House Dondarrion", emblem: { img: "minor/blackhaven.png" }, words: "", seat: "blackhaven", region: "the-stormlands",
        blurb: "Marcher lords of Blackhaven under the purple lightning, born of a rider who outran two Dornish kings' men with a message and a storm at his back.",
        members: [ "Ser Manfred Dondarrion" ] },
      { id: "beesbury", name: "House Beesbury", emblem: { img: "minor/honeyholt.png" }, words: "Beware Our Sting", seat: "honeyholt", region: "the-reach",
        blurb: "Old lords of Honeyholt on the Honeywine, black and yellow as their hives — a gentle house that sends one very brave young knight to Ashford Meadow.",
        members: [ "Ser Humfrey Beesbury" ] },
      { id: "ball", name: "House Ball", emblem: { glyph: "FB", color: "#c93a2e" }, words: "", region: "the-riverlands",
        blurb: "The line of Quentyn Ball — Fireball, master-at-arms of the Red Keep, who shattered the king's van at Redgrass Field for the black dragon and died of a common archer. His son inherited the fury and none of the fortune.",
        members: [ "Ser Glendon Ball" ] },
      { id: "plumm", name: "House Plumm", emblem: { glyph: "P", color: "#7a3fb0" }, words: "Come Try Me", region: "the-westerlands",
        blurb: "An old westerlands house of purple grapes and tall tales. Whether the mocking Ser Maynard is truly one of them — or truly anyone at all — is a question best not asked at Whitewalls.",
        members: [ "Ser Maynard Plumm" ] },
      { id: "lothston", name: "House Lothston", emblem: { glyph: "L", color: "#3a3f47" }, words: "", seat: "harrenhal", region: "the-riverlands",
        blurb: "The ill-rumored bats of Harrenhal, holders of the cursed castle in this age — mad Lady Danelle rides out from it by night, the smallfolk whisper, and the whispers are getting worse.",
        members: [ "Lady Danelle Lothston" ] },
      { id: "frey", name: "House Frey", emblem: { glyph: "FR", color: "#7a8699" }, words: "We Stand Together", seat: "the-twins", region: "the-riverlands",
        blurb: "The bridge-lords of the Crossing, six hundred years rich on tolls and still hungry for standing — a Frey daughter's wedding to Lord Butterwell brings the Twins to Whitewalls.",
        members: [ "Lord Frey of the Crossing" ] },
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

/* which groups a character belongs to at pt — used on the character card */
function characterGroupsAt(name, pt) {
  return (CHAR_GROUPS[name] || [])
    .filter((e) => memberVisibleAt(e.m, pt))
    .map((e) => ({ kind: e.kind, id: e.id, note: groupMemberNote(e.m) }));
}
