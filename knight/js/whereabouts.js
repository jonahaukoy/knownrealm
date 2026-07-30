/* A KNIGHT OF THE SEVEN KINGDOMS — where every soul stands, episode by episode
   (the show's telling). Each entry is a timeline of [season, episode, place]:
   from that episode onward the person stands at that place, until the next entry
   changes it. A place of null means they are off the map from then on — not yet
   introduced, gone from the story, or dead (the card's own "alive as of" line
   stays spoiler-gated; the map only shows presence). Places are location ids
   from data.js, or named spots below for camps, roads and fields that have no
   pin of their own. Season lengths: S1 six episodes (The Hedge Knight). */

const WB_SPOTS = {
  "roseroad-grave":  [1190, 2330], // the hillside where Dunk buries Ser Arlan
  "cockleswent-inn": [1172, 2394], // the inn on the road to Ashford
  "road-to-dorne":   [1235, 2492], // the road south toward the Prince's Pass
  "chequy-water":    [963, 2247],  // the disputed stream between Standfast and Coldmoat
  "gods-eye-road":   [1300, 1862], // the lakeshore road to Whitewalls
};

/* how the nameless spots read on a traced road */
const WB_SPOT_NAMES = {
  "roseroad-grave":  "A grave by the roseroad",
  "cockleswent-inn": "The inn by the Cockleswhent",
  "road-to-dorne":   "The road to Dorne",
  "chequy-water":    "The Chequy Water",
  "gods-eye-road":   "The lakeshore road to Whitewalls",
};

const WHEREABOUTS = {

  // ---------------- the hedge knight and his squire ----------------
  "Ser Duncan the Tall": [[1,1,"cockleswent-inn"],[1,2,"ashford-meadow"],[1,6,"road-to-dorne"]],
  "Egg": [[1,1,"cockleswent-inn"],[1,2,"ashford-meadow"],[1,6,"road-to-dorne"]],
  "Ser Arlan of Pennytree": [[1,1,"roseroad-grave"],[1,2,null]],

  // ---------------- the blood of the dragon ----------------
  "King Daeron II Targaryen": [[1,1,"kings-landing"]],
  "Baelor Breakspear": [[1,1,"kings-landing"],[1,3,"ashford-meadow"]],
  "Valarr Targaryen": [[1,2,"ashford-meadow"],[1,6,"kings-landing"]],
  "Prince Maekar Targaryen": [[1,2,"ashford-meadow"]],
  "Aerion Brightflame": [[1,2,"ashford-meadow"],[1,6,"lys"]],
  "Daeron Targaryen": [[1,2,"ashford-meadow"]],
  "Aemon Targaryen": [[1,1,"oldtown"]],
  "Brynden Rivers": [[1,1,"kings-landing"]],

  // ---------------- Ashford Meadow ----------------
  "Tanselle": [[1,2,"ashford-meadow"],[1,6,null]],
  "Steely Pate": [[1,2,"ashford-meadow"]],
  "Lord Ashford": [[1,1,"ashford"]],
  "Ser Humfrey Hardyng": [[1,2,"ashford-meadow"]],
  "Ser Humfrey Beesbury": [[1,1,"honeyholt"],[1,2,"ashford-meadow"]],
  "Ser Lyonel Baratheon": [[1,1,"storms-end"],[1,2,"ashford-meadow"]],
  "Ser Tybolt Lannister": [[1,1,"casterly-rock"],[1,2,"ashford-meadow"]],
  "Raymun Fossoway": [[1,1,"cider-hall"],[1,2,"ashford-meadow"]],
  "Ser Steffon Fossoway": [[1,1,"cider-hall"],[1,2,"ashford-meadow"]],
  "Ser Robyn Rhysling": [[1,3,"ashford-meadow"]],
  "Ser Manfred Dondarrion": [[1,1,"blackhaven"],[1,2,"ashford-meadow"]],
  "Ser Roland Crakehall": [[1,2,"ashford-meadow"]],
  "Ser Donnel of Duskendale": [[1,2,"ashford-meadow"]],
  "Ser Willem Wylde": [[1,2,"ashford-meadow"]],
};

/* the place a person stands at season s, episode e — or null if off the map */
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
   THE BOOKS' LEDGER — where every soul stands, novella by novella, part by
   part, in Martin's telling: The Hedge Knight (1), The Sworn Sword (2),
   The Mystery Knight (3). */

const WHEREABOUTS_BOOK = {

  // ---------------- the hedge knight and his squire ----------------
  "Ser Duncan the Tall": [[1,1,"roseroad-grave"],[1,2,"cockleswent-inn"],[1,3,"ashford-meadow"],
    [1,10,"road-to-dorne"],[2,1,"standfast"],[2,4,"coldmoat"],[2,6,"standfast"],[2,8,"chequy-water"],
    [2,10,"coldmoat"],[3,1,"stoney-sept"],[3,2,"gods-eye-road"],[3,3,"whitewalls"]],
  "Egg": [[1,2,"cockleswent-inn"],[1,3,"ashford-meadow"],[1,10,"road-to-dorne"],
    [2,1,"standfast"],[2,8,"chequy-water"],[2,10,"coldmoat"],
    [3,1,"stoney-sept"],[3,2,"gods-eye-road"],[3,3,"whitewalls"]],
  "Ser Arlan of Pennytree": [[1,1,"roseroad-grave"],[1,2,null]],

  // ---------------- the blood of the dragon ----------------
  "King Daeron II Targaryen": [[1,1,"kings-landing"]],
  "Baelor Breakspear": [[1,1,"kings-landing"],[1,5,"ashford-meadow"]],
  "Valarr Targaryen": [[1,5,"ashford-meadow"],[1,10,"kings-landing"]],
  "Aerys I Targaryen": [[1,1,"kings-landing"]],
  "Prince Maekar Targaryen": [[1,5,"ashford-meadow"],[1,10,"summerhall"]],
  "Aerion Brightflame": [[1,5,"ashford-meadow"],[1,10,"lys"]],
  "Daeron Targaryen": [[1,5,"ashford-meadow"],[1,10,"summerhall"]],
  "Aemon Targaryen": [[1,1,"oldtown"]],
  "Brynden Rivers": [[1,1,"kings-landing"],[3,11,"whitewalls"],[3,12,"kings-landing"]],

  // ---------------- The Hedge Knight ----------------
  "Tanselle": [[1,3,"ashford-meadow"],[1,10,null]],
  "Steely Pate": [[1,3,"ashford-meadow"]],
  "Lord Ashford": [[1,1,"ashford"]],
  "Ser Humfrey Hardyng": [[1,5,"ashford-meadow"]],
  "Ser Humfrey Beesbury": [[1,1,"honeyholt"],[1,5,"ashford-meadow"]],
  "Ser Lyonel Baratheon": [[1,1,"storms-end"],[1,5,"ashford-meadow"],[1,10,"storms-end"]],
  "Ser Tybolt Lannister": [[1,1,"casterly-rock"],[1,5,"ashford-meadow"],[1,10,"casterly-rock"]],
  "Raymun Fossoway": [[1,1,"cider-hall"],[1,3,"ashford-meadow"],[1,10,"cider-hall"]],
  "Ser Steffon Fossoway": [[1,1,"cider-hall"],[1,3,"ashford-meadow"],[1,10,"cider-hall"]],
  "Ser Robyn Rhysling": [[1,8,"ashford-meadow"]],
  "Ser Manfred Dondarrion": [[1,1,"blackhaven"],[1,5,"ashford-meadow"]],
  "Ser Roland Crakehall": [[1,5,"ashford-meadow"]],
  "Ser Donnel of Duskendale": [[1,5,"ashford-meadow"]],
  "Ser Willem Wylde": [[1,5,"ashford-meadow"]],

  // ---------------- The Sworn Sword ----------------
  "Ser Eustace Osgrey": [[2,1,"standfast"],[2,8,"chequy-water"],[2,10,"coldmoat"]],
  "Lady Rohanne Webber": [[2,1,"coldmoat"],[2,8,"chequy-water"],[2,10,"coldmoat"]],
  "Ser Lucas Inchfield": [[2,1,"coldmoat"],[2,8,"chequy-water"]],
  "Septon Sefton": [[2,1,"coldmoat"]],
  "Ser Bennis of the Brown Shield": [[2,1,"standfast"],[2,9,null]],

  // ---------------- The Mystery Knight ----------------
  "John the Fiddler": [[3,2,"gods-eye-road"],[3,3,"whitewalls"],[3,9,null]],
  "Daemon II Blackfyre": [[3,9,"whitewalls"],[3,12,"kings-landing"]],
  "Lord Gormon Peake": [[3,2,"gods-eye-road"],[3,3,"whitewalls"],[3,12,"kings-landing"]],
  "Ser Alyn Cockshaw": [[3,2,"gods-eye-road"],[3,3,"whitewalls"]],
  "Lord Ambrose Butterwell": [[3,1,"whitewalls"]],
  "Black Tom Heddle": [[3,1,"whitewalls"]],
  "Ser Glendon Ball": [[3,3,"whitewalls"]],
  "Ser Maynard Plumm": [[3,2,"gods-eye-road"],[3,3,"whitewalls"],[3,12,null]],
  "Ser Uthor Underleaf": [[3,3,"whitewalls"],[3,12,null]],
  "Ser Kyle the Cat": [[3,1,"stoney-sept"],[3,2,"gods-eye-road"],[3,3,"whitewalls"]],
};

/* the place a person stands at book b, chapter ch — or null if off the map */
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
