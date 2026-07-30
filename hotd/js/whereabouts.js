/* HOUSE OF THE DRAGON — where every soul stands, episode by episode (the show)
   and section by section (Fire & Blood). Same model as the ASOIAF map:
   [season, episode, place] / [book, chapter, place]; a segment holds until the
   next one; null = off the map. Season lengths: S1 ten episodes, S2 eight.
   The book is Fire & Blood (b:1), chapters 1–8 = the Dance's eight movements. */

const WB_SPOTS = {};
const WB_SPOT_NAMES = {};

const WHEREABOUTS = {

  // ---------------- the crown ----------------
  "Viserys I Targaryen": [[1,1,"kings-landing"],[1,9,null]],
  "Rhaenyra Targaryen": [[1,1,"kings-landing"],[1,7,"dragonstone"],[1,8,"kings-landing"],[1,10,"dragonstone"],
    [2,1,"storms-end"],[2,2,"dragonstone"],[2,3,"kings-landing"],[2,4,"dragonstone"]],
  "Daemon Targaryen": [[1,1,"kings-landing"],[1,2,"dragonstone"],[1,3,"the-stepstones"],[1,4,"kings-landing"],
    [1,5,"runestone"],[1,6,"pentos"],[1,7,"driftmark"],[1,8,"kings-landing"],[1,10,"dragonstone"],
    [2,1,"kings-landing"],[2,2,"dragonstone"],[2,3,"harrenhal"]],
  "Alicent Hightower": [[1,1,"kings-landing"],[1,7,"driftmark"],[1,8,"kings-landing"],[2,8,"dragonstone"]],
  "Otto Hightower": [[1,1,"kings-landing"],[1,5,"oldtown"],[1,8,"kings-landing"]],
  "Aemma Arryn": [[1,1,"kings-landing"],[1,2,null]],
  "Aegon II Targaryen": [[1,3,"kings-landing"],[2,4,"rooks-rest"],[2,5,"kings-landing"],[2,8,null]],
  "Helaena Targaryen": [[1,6,"kings-landing"]],
  "Aemond Targaryen": [[1,6,"kings-landing"],[1,7,"driftmark"],[1,8,"kings-landing"],[1,10,"storms-end"],
    [2,1,"kings-landing"],[2,4,"rooks-rest"],[2,5,"kings-landing"]],
  "Daeron Targaryen": [[1,8,"oldtown"]],
  "Jaehaerys Targaryen": [[1,8,"kings-landing"],[2,2,null]],
  "Jaehaera Targaryen": [[1,8,"kings-landing"]],
  "Aegon the Younger": [[1,8,"kings-landing"],[1,10,"dragonstone"],[2,5,"the-eyrie"]],
  "Viserys the Younger": [[1,8,"kings-landing"],[1,10,"dragonstone"],[2,5,"the-eyrie"]],
  "Rhaenys Targaryen": [[1,1,"kings-landing"],[1,2,"driftmark"],[1,8,"kings-landing"],[1,10,"dragonstone"],[2,4,"rooks-rest"],[2,5,null]],

  // ---------------- House Velaryon ----------------
  "Corlys Velaryon": [[1,1,"kings-landing"],[1,2,"driftmark"],[1,3,"the-stepstones"],[1,5,"driftmark"],
    [1,8,"the-stepstones"],[1,10,"dragonstone"],[2,5,"driftmark"],[2,8,"dragonstone"]],
  "Laena Velaryon": [[1,1,"kings-landing"],[1,2,"driftmark"],[1,5,"kings-landing"],[1,6,"pentos"],[1,7,null]],
  "Laenor Velaryon": [[1,2,"driftmark"],[1,3,"the-stepstones"],[1,5,"kings-landing"],[1,7,null]],
  "Vaemond Velaryon": [[1,2,"driftmark"],[1,8,"kings-landing"],[1,9,null]],
  "Jacaerys Velaryon": [[1,6,"kings-landing"],[1,7,"driftmark"],[1,8,"kings-landing"],[1,10,"dragonstone"],
    [2,1,"castle-black"],[2,2,"dragonstone"]],
  "Lucerys Velaryon": [[1,6,"kings-landing"],[1,7,"driftmark"],[1,8,"kings-landing"],[1,10,"storms-end"],[2,1,null]],
  "Joffrey Velaryon": [[1,6,"kings-landing"],[1,7,"driftmark"],[1,10,"dragonstone"]],
  "Baela Targaryen": [[1,6,"pentos"],[1,7,"driftmark"],[1,8,"kings-landing"],[1,10,"dragonstone"],
    [2,3,"rooks-rest"],[2,4,"dragonstone"]],
  "Rhaena Targaryen": [[1,6,"pentos"],[1,7,"driftmark"],[1,8,"kings-landing"],[1,10,"dragonstone"],[2,5,"the-eyrie"]],
  "Alyn of Hull": [[2,2,"driftmark"]],
  "Addam of Hull": [[2,5,"driftmark"]],

  // ---------------- swords, seats & schemers ----------------
  "Criston Cole": [[1,1,"kings-landing"],[2,3,"rosby"],[2,4,"rooks-rest"],[2,5,"kings-landing"]],
  "Gwayne Hightower": [[2,3,"rosby"],[2,4,"rooks-rest"],[2,5,"kings-landing"]],
  "Lyonel Strong": [[1,1,"kings-landing"],[1,6,"harrenhal"],[1,7,null]],
  "Harwin Strong": [[1,4,"kings-landing"],[1,6,"harrenhal"],[1,7,null]],
  "Larys Strong": [[1,3,"kings-landing"]],
  "Simon Strong": [[2,3,"harrenhal"]],
  "Alys Rivers": [[2,3,"harrenhal"]],
  "Mysaria": [[1,1,"kings-landing"],[1,2,"dragonstone"],[1,4,"kings-landing"],[2,2,"dragonstone"]],
  "Rhea Royce": [[1,1,"runestone"],[1,6,null]],
  "Joffrey Lonmouth": [[1,5,"kings-landing"],[1,6,null]],
  "Craghas Drahar": [[1,2,"the-stepstones"],[1,4,null]],
  "Lyman Beesbury": [[1,1,"kings-landing"],[1,10,null]],
  "Arryk Cargyll": [[1,5,"kings-landing"],[2,2,"dragonstone"],[2,3,null]],
  "Erryk Cargyll": [[1,5,"kings-landing"],[1,10,"dragonstone"],[2,3,null]],
  "Steffon Darklyn": [[1,8,"kings-landing"],[1,10,"dragonstone"],[2,7,null]],
  "Gunthor Darklyn": [[2,3,"duskendale"],[2,5,null]],
  "Hugh Hammer": [[2,1,"kings-landing"],[2,6,"dragonstone"]],
  "Ulf the White": [[2,1,"kings-landing"],[2,7,"dragonstone"]],
  "Cregan Stark": [[2,1,"castle-black"],[2,2,"winterfell"]],
  "Jeyne Arryn": [[2,5,"the-eyrie"]],
  "Jason Lannister": [[1,3,"kings-landing"],[1,4,"casterly-rock"]],
  "Tyland Lannister": [[1,3,"kings-landing"],[2,8,"the-stepstones"]],
  "Borros Baratheon": [[1,10,"storms-end"]],
  "Willem Blackwood": [[1,4,"kings-landing"],[1,5,"raventree-hall"],[2,3,"harrenhal"]],
  "Sharako Lohar": [[2,8,"the-stepstones"]],
};

function whereaboutsAt(name, s, e) {
  const tl = WHEREABOUTS[name];
  if (!tl) return null;
  let loc = null;
  for (let i = 0; i < tl.length; i++) {
    const seg = tl[i];
    if (seg[0] < s || (seg[0] === s && seg[1] <= e)) loc = seg[2];
    else break;
  }
  return loc;
}

/* ============================================================================
   FIRE & BLOOD'S LEDGER — the same souls through the book's eight movements.
   The book's Dance runs past the show's, so these roads run to their true ends. */

const WHEREABOUTS_BOOK = {
  "Viserys I Targaryen": [[1,1,"kings-landing"],[1,2,null]],
  "Rhaenyra Targaryen": [[1,1,"kings-landing"],[1,2,"dragonstone"],[1,5,"kings-landing"],[1,6,"dragonstone"],[1,8,null]],
  "Daemon Targaryen": [[1,1,"the-stepstones"],[1,2,"dragonstone"],[1,3,"harrenhal"],[1,7,null]],
  "Alicent Hightower": [[1,1,"kings-landing"]],
  "Otto Hightower": [[1,1,"kings-landing"],[1,6,null]],
  "Aemma Arryn": [[1,1,"kings-landing"],[1,2,null]],
  "Aegon II Targaryen": [[1,1,"kings-landing"],[1,4,"rooks-rest"],[1,5,"dragonstone"],[1,7,"kings-landing"],[1,8,null]],
  "Helaena Targaryen": [[1,1,"kings-landing"],[1,7,null]],
  "Aemond Targaryen": [[1,1,"kings-landing"],[1,4,"rooks-rest"],[1,5,"harrenhal"],[1,7,null]],
  "Daeron Targaryen": [[1,1,"oldtown"],[1,5,"tumbleton"],[1,8,null]],
  "Jaehaerys Targaryen": [[1,1,"kings-landing"],[1,4,null]],
  "Jaehaera Targaryen": [[1,1,"kings-landing"]],
  "Maelor Targaryen": [[1,1,"kings-landing"],[1,6,"bitterbridge"],[1,7,null]],
  "Aegon the Younger": [[1,1,"dragonstone"],[1,5,"kings-landing"],[1,7,"dragonstone"],[1,8,"kings-landing"]],
  "Viserys the Younger": [[1,1,"dragonstone"],[1,5,"lys"]],
  "Rhaenys Targaryen": [[1,1,"driftmark"],[1,3,"dragonstone"],[1,4,"rooks-rest"],[1,5,null]],

  "Corlys Velaryon": [[1,1,"driftmark"],[1,3,"dragonstone"],[1,5,"kings-landing"]],
  "Laena Velaryon": [[1,1,"driftmark"],[1,2,null]],
  "Laenor Velaryon": [[1,1,"driftmark"],[1,2,null]],
  "Vaemond Velaryon": [[1,1,"driftmark"],[1,2,null]],
  "Qarl Correy": [[1,1,"driftmark"],[1,2,null]],
  "Jacaerys Velaryon": [[1,1,"dragonstone"],[1,2,"the-eyrie"],[1,3,"winterfell"],[1,4,"dragonstone"],[1,6,null]],
  "Lucerys Velaryon": [[1,1,"dragonstone"],[1,2,"storms-end"],[1,3,null]],
  "Joffrey Velaryon": [[1,1,"dragonstone"],[1,6,"kings-landing"],[1,7,null]],
  "Baela Targaryen": [[1,1,"dragonstone"]],
  "Rhaena Targaryen": [[1,1,"dragonstone"],[1,3,"the-eyrie"]],
  "Alyn of Hull": [[1,5,"driftmark"]],
  "Addam of Hull": [[1,5,"kings-landing"],[1,7,"tumbleton"],[1,8,null]],

  "Criston Cole": [[1,1,"kings-landing"],[1,4,"rooks-rest"],[1,5,"duskendale"],[1,6,null]],
  "Gwayne Hightower": [[1,1,"kings-landing"]],
  "Ormund Hightower": [[1,2,"oldtown"],[1,5,"tumbleton"],[1,6,null]],
  "Lyonel Strong": [[1,1,"harrenhal"],[1,2,null]],
  "Harwin Strong": [[1,1,"harrenhal"],[1,2,null]],
  "Larys Strong": [[1,1,"kings-landing"],[1,8,null]],
  "Simon Strong": [[1,3,"harrenhal"]],
  "Alys Rivers": [[1,3,"harrenhal"]],
  "Mysaria": [[1,1,"kings-landing"],[1,7,null]],
  "Rhea Royce": [[1,1,"runestone"],[1,2,null]],
  "Joffrey Lonmouth": [[1,1,"kings-landing"],[1,2,null]],
  "Craghas Drahar": [[1,1,"the-stepstones"],[1,2,null]],
  "Lyman Beesbury": [[1,1,"kings-landing"],[1,3,null]],
  "Arryk Cargyll": [[1,1,"kings-landing"],[1,3,"dragonstone"],[1,4,null]],
  "Erryk Cargyll": [[1,2,"dragonstone"],[1,4,null]],
  "Steffon Darklyn": [[1,1,"kings-landing"],[1,2,"dragonstone"],[1,6,null]],
  "Gunthor Darklyn": [[1,1,"duskendale"],[1,5,null]],
  "Hugh Hammer": [[1,5,"tumbleton"],[1,8,null]],
  "Ulf the White": [[1,5,"tumbleton"],[1,8,null]],
  "Cregan Stark": [[1,1,"winterfell"],[1,8,"kings-landing"]],
  "Jeyne Arryn": [[1,1,"the-eyrie"]],
  "Jason Lannister": [[1,1,"casterly-rock"],[1,4,"riverrun"],[1,6,null]],
  "Tyland Lannister": [[1,1,"kings-landing"]],
  "Borros Baratheon": [[1,1,"storms-end"],[1,7,"kings-landing"],[1,8,null]],
  "Dalton Greyjoy": [[1,3,"pyke"]],
};

function whereaboutsAtBook(name, b, ch) {
  const tl = WHEREABOUTS_BOOK[name];
  if (!tl || !Array.isArray(tl)) return null;
  let loc = null;
  for (let i = 0; i < tl.length; i++) {
    const seg = tl[i];
    if (seg[0] < b || (seg[0] === b && seg[1] <= ch)) loc = seg[2];
    else break;
  }
  return loc;
}
