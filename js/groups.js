/* THE KNOWN WORLD — groups: great houses, orders & peoples, and noble houses.
   A person can belong to more than one group, and a membership can be time-gated so
   it appears/changes exactly when the show or books reveal it. A member entry is
   either a plain name string (member for the whole tale) or an object:
     { n, showFrom:{s,e}, showUntil:{s,e}, bookFrom:{b,ch}, bookUntil:{b,ch}, note }
   from/until are inclusive of the event: a membership with showUntil {s:1,e:7} is
   visible up to — but not on/after — S1·E7 (the moment it is revealed/ends). When no
   episode or chapter is selected (whole-tale view), every membership shows.
   Great-house groups carry only {id, members}; the rich name/words/seat/description
   come from WORLD.houses. Orders and noble houses are fully described here. */

const GROUP_SECTIONS = [
  {
    kind: "great", label: "The Great Houses",
    groups: [
      { id: "stark", members: [
        "Rickard Stark", "Eddard Stark", "Catelyn Stark", "Robb Stark", "Talisa Stark", "Jeyne Westerling",
        "Sansa Stark", "Arya Stark", "Bran Stark", "Rickon Stark", "Jon Snow",
        "Brandon Stark", "Benjen Stark", "Lyanna Stark",
        "Maester Luwin", "Rodrik Cassel", "Jory Cassel", "Vayon Poole", "Jeyne Poole", "Septa Mordane", "Old Nan", "Hodor", "Osha" ] },
      { id: "lannister", members: [
        "Tywin Lannister", "Joanna Lannister", "Kevan Lannister", "Genna Lannister", "Cersei Lannister", "Jaime Lannister", "Tyrion Lannister",
        "Lancel Lannister", "Joffrey Baratheon", "Myrcella Baratheon", "Tommen Baratheon" ] },
      { id: "baratheon", members: [
        "Robert Baratheon", "Stannis Baratheon", "Selyse Baratheon", "Shireen Baratheon",
        "Renly Baratheon", "Gendry", "Edric Storm", "Mya Stone", "Melisandre",
        { n: "Joffrey Baratheon", showUntil: { s: 1, e: 7 }, bookUntil: { b: 1, ch: 45 }, note: "known as Robert's heir" },
        { n: "Myrcella Baratheon", showUntil: { s: 1, e: 7 }, bookUntil: { b: 1, ch: 45 }, note: "known as Robert's daughter" },
        { n: "Tommen Baratheon", showUntil: { s: 1, e: 7 }, bookUntil: { b: 1, ch: 45 }, note: "known as Robert's son" } ] },
      { id: "targaryen", members: [
        "Aerys II Targaryen", "Rhaella Targaryen", "Rhaegar Targaryen", "Rhaenys Targaryen", "Elia Martell", "Viserys Targaryen", "Daenerys Targaryen",
        "Maester Aemon", "Aegon Targaryen",
        { n: "Jon Snow", showFrom: { s: 6, e: 10 }, bookFrom: { b: 6, ch: 1 }, note: "his true parentage, once revealed" } ] },
      { id: "tully", members: [ "Hoster Tully", "Brynden Tully", "Edmure Tully", "Roslin Frey", "Catelyn Stark", "Lysa Arryn" ] },
      { id: "arryn", members: [ "Jon Arryn", "Lysa Arryn", "Robin Arryn", "Yohn Royce" ] },
      { id: "greyjoy", members: [ "Balon Greyjoy", "Euron Greyjoy", "Victarion Greyjoy", "Aeron Greyjoy", "Yara Greyjoy", "Theon Greyjoy" ] },
      { id: "frey", members: [ "Walder Frey", "Stevron Frey", "Lothar Frey", "Merrett Frey", "Olyvar Frey", "Black Walder Rivers", "Roslin Frey", "Walda Bolton" ] },
      { id: "tyrell", members: [ "Olenna Tyrell", "Mace Tyrell", "Willas Tyrell", "Garlan Tyrell", "Loras Tyrell", "Margaery Tyrell" ] },
      { id: "martell", members: [ "Doran Martell", "Arianne Martell", "Quentyn Martell", "Trystane Martell", "Oberyn Martell", "Elia Martell", "Ellaria Sand", "Obara Sand", "Nymeria Sand", "Tyene Sand", "Areo Hotah" ] },
    ],
  },
  {
    kind: "order", label: "Orders, Faiths & Free Peoples",
    groups: [
      { id: "nights-watch", name: "The Night's Watch", emblem: { glyph: "NW", color: "#23262c" },
        words: "And now my watch begins", seat: "castle-black",
        blurb: "The black brothers of the Wall: an ancient sworn order of rangers, stewards, and builders who take no wife and hold no lands, guarding the realms of men against whatever comes out of the North.",
        members: [ "Jeor Mormont", "Maester Aemon", "Benjen Stark", "Alliser Thorne",
          { n: "Jon Snow", showFrom: { s: 1, e: 7 }, bookFrom: { b: 1, ch: 19 } },
          { n: "Samwell Tarly", showFrom: { s: 1, e: 7 }, bookFrom: { b: 1, ch: 24 } },
          "Yoren", "Grenn", "Pyp", "Edd Tollett", "Janos Slynt", "Qhorin Halfhand",
          "Will of the Night's Watch", "Ser Waymar Royce", "Gared", "Chett",
          "Bowen Marsh", "Cotter Pyke", "Rast", "Karl Tanner", "Olly" ] },
      { id: "kingsguard", name: "The Kingsguard", emblem: { glyph: "KG", color: "#c9ccd2" },
        words: "Sworn for life", seat: "kings-landing",
        blurb: "The seven white knights sworn to shield the king with their lives and their silence — the highest honor in the realm, and sometimes the heaviest chain.",
        members: [
          { n: "Barristan Selmy", showUntil: { s: 1, e: 8 }, bookUntil: { b: 1, ch: 57 } },
          "Jaime Lannister", "Meryn Trant", "Mandon Moore", "Boros Blount", "Balon Swann", "Arys Oakheart" ] },
      { id: "free-folk", name: "The Free Folk", emblem: { glyph: "FF", color: "#5a6b7a" },
        words: "We do not kneel",
        blurb: "The wildlings of the lands beyond the Wall — a hundred quarreling peoples of raiders, spearwives, cave-dwellers, cannibals, and giants, who bow to no king and call themselves free.",
        members: [ "Mance Rayder", "Tormund Giantsbane", "Ygritte", "Styr", "Val", "Karsi", "Rattleshirt", "Orell", "Wun Wun", "Gilly", "Craster" ] },
      { id: "brotherhood", name: "The Brotherhood Without Banners", emblem: { glyph: "BB", color: "#8a3320" },
        words: "The Lord of Light protects",
        blurb: "An outlaw band of the Riverlands who fight for no lord and no crown, only for the smallfolk caught between the armies — bound together by a red priest's fire.",
        members: [ "Beric Dondarrion", "Thoros of Myr", "Lem Lemoncloak", "Anguy", "Harwin",
          { n: "Gendry", showFrom: { s: 3, e: 1 }, bookFrom: { b: 3, ch: 1 } } ] },
      { id: "faith", name: "The Faith of the Seven", emblem: { glyph: "★", color: "#b89235" },
        words: "The Mother's mercy",
        blurb: "The dominant religion of the Seven Kingdoms — septons, septas, and the Most Devout, and in troubled times the armed and barefoot Faith Militant.",
        members: [ "The High Sparrow", "Septa Unella", "The High Septon", "Septa Mordane" ] },
      { id: "dothraki", name: "The Dothraki", emblem: { glyph: "DO", color: "#8a5a2b" },
        words: "It is known",
        blurb: "The horse-lords of the great grass sea of Essos: fearless mounted warriors who despise stone walls and salt water, and follow only a khal strong enough to lead them.",
        members: [ "Khal Drogo", "Qotho", "Rakharo", "Aggo", "Jhogo", "Irri" ] },
      { id: "unsullied", name: "The Unsullied", emblem: { glyph: "US", color: "#6a4a2a" },
        words: "Fear cuts deeper than swords",
        blurb: "The slave-soldiers of Astapor: eunuchs trained from childhood into the most disciplined and fearless infantry in the world, until a dragon queen bought and freed them.",
        members: [ "Grey Worm" ] },
      { id: "slavers-bay", name: "The Masters of Slaver's Bay", emblem: { glyph: "SB", color: "#9a7d2e" },
        words: "By blood and gold",
        blurb: "The slaver aristocracy of the old Ghiscari cities — Astapor, Yunkai, and Meereen — grown fat on the trade in human flesh, and unprepared for what sails into their bay.",
        members: [ "Kraznys mo Nakloz", "Razdal mo Eraz", "Yezzan zo Qaggaz", "Hizdahr zo Loraq" ] },
      { id: "sellswords", name: "Sellswords & Free Companies", emblem: { glyph: "SS", color: "#7a6a3a" },
        words: "Coin before crown",
        blurb: "The mercenary companies of the Free Cities — the Second Sons, the Golden Company, and their like — swords for hire whose loyalty lasts exactly as long as the pay.",
        members: [ "Daario Naharis", "Mero", "Prendahl na Ghezn", "Bronn", "Jon Connington", "Aegon Targaryen", "Harry Strickland", "Illyrio Mopatis" ] },
      { id: "faceless-men", name: "The Faceless Men", emblem: { glyph: "FM", color: "#3a3f47" },
        words: "Valar morghulis",
        blurb: "The guild of assassin-priests of the Many-Faced God, housed in the House of Black and White in Braavos, who wear the faces of the dead and give the gift of death for a price.",
        members: [ "Jaqen H'ghar", "The Waif", "The Kindly Man",
          { n: "Arya Stark", showFrom: { s: 5, e: 1 }, bookFrom: { b: 4, ch: 7 } } ] },
      { id: "old-ones", name: "The Children & the Others", emblem: { glyph: "❄", color: "#5b7fa6" },
        words: "Older than men",
        blurb: "The oldest powers of Westeros — the Children of the Forest and the greenseers who keep the memory of the world, and the White Walkers of ice and night who would end it.",
        members: [ "The Three-Eyed Raven", "Leaf", "The Night King",
          { n: "Bran Stark", showFrom: { s: 6, e: 5 }, bookFrom: { b: 6, ch: 1 }, note: "as the new Three-Eyed Raven" } ] },
    ],
  },
  {
    kind: "noble", label: "The Noble Houses",
    groups: [
      { id: "bolton", name: "House Bolton", emblem: { img: "bolton.svg" }, words: "Our Blades Are Sharp", seat: "the-dreadfort", region: "the-north",
        blurb: "Lords of the Dreadfort, the most powerful and most feared of the Stark bannermen — an ancient, sinister line whose flayed-man banner speaks for itself.",
        members: [ "Roose Bolton", "Domeric Bolton", "Ramsay Bolton", "Walda Bolton" ] },
      { id: "clegane", name: "House Clegane", emblem: { img: "clegane.svg" }, words: "", region: "the-westerlands",
        blurb: "A small westerlands house of sworn swords to the Lannisters, risen in three generations from a kennelmaster's courage — and known now for two monstrous brothers.",
        members: [ "Gregor Clegane", "Sandor Clegane" ] },
      { id: "mormont", name: "House Mormont", emblem: { img: "mormont.svg" }, words: "Here We Stand", seat: "bear-island", region: "the-north",
        blurb: "The hardy house of Bear Island, sworn to Stark: warriors and sailors, its women as fierce as its men, holding a hard rock in a cold sea.",
        members: [ "Jeor Mormont", "Jorah Mormont", "Maege Mormont", "Dacey Mormont", "Lyanna Mormont" ] },
      { id: "tarly", name: "House Tarly", emblem: { img: "tarly.svg" }, words: "First in Battle", seat: "horn-hill", region: "the-reach",
        blurb: "A proud martial house of the Reach sworn to Highgarden, holders of the Valyrian sword Heartsbane and a fearsome name in war.",
        members: [ "Randyll Tarly", "Melessa Tarly", "Samwell Tarly", "Dickon Tarly", "Talla Tarly" ] },
      { id: "karstark", name: "House Karstark", emblem: { img: "karstark.svg" }, words: "The Sun of Winter", seat: "karhold", region: "the-north",
        blurb: "A northern house of distant Stark blood, founded by a younger son of Winterfell an age ago, holding the grim keep of Karhold in the far northeast.",
        members: [ "Rickard Karstark", "Torrhen Karstark" ] },
      { id: "seaworth", name: "House Seaworth", emblem: { img: "seaworth.svg" }, words: "", region: "the-stormlands",
        blurb: "A new house, raised from a Flea Bottom smuggler to a knight and lord of the Rainwood for a single act of desperate loyalty to Stannis Baratheon.",
        members: [ "Davos Seaworth", "Matthos Seaworth" ] },
      { id: "baelish", name: "House Baelish", emblem: { img: "baelish.svg" }, words: "", seat: "the-fingers", region: "the-vale",
        blurb: "The smallest of small houses, a single stony tower on the Fingers — until its ambitious young lord climbed further from it than anyone in the realm thought possible.",
        members: [ "Petyr Baelish" ] },
      { id: "reed", name: "House Reed", emblem: { img: "reed.svg" }, words: "", region: "the-north",
        blurb: "The crannogmen of Greywater Watch, a secretive marsh-dwelling people of the Neck, the most loyal and uncanny of all the Stark bannermen.",
        members: [ "Jojen Reed", "Meera Reed" ] },
      { id: "tarth", name: "House Tarth", emblem: { img: "tarth.svg" }, words: "", region: "the-stormlands",
        blurb: "The Evenstar's house on the Sapphire Isle off the stormlands coast — old and honorable, if no longer rich, and mother to one very singular daughter.",
        members: [ "Brienne of Tarth" ] },
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
