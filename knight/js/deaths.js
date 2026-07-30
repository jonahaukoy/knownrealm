/* A KNIGHT OF THE SEVEN KINGDOMS — the fallen, and the manner of their falling.
   DEATH_TALES holds a brief telling of each death (the show's telling). These are
   SPOILERS by nature: the app only ever shows them once the chosen episode/part
   is at or past the character's recorded death — never before.
   MAIN_CHARS is the short roll of principal players for the map's "main players only"
   people filter. deathSiteFor(name) finds where a death pin belongs: the last known
   place on the character's whereabouts timeline at the point of death. */

const MAIN_CHARS = new Set([
  "Ser Duncan the Tall", "Egg", "Ser Arlan of Pennytree",
  "King Daeron II Targaryen", "Baelor Breakspear", "Valarr Targaryen",
  "Prince Maekar Targaryen", "Aerion Brightflame", "Daeron Targaryen",
  "Aemon Targaryen", "Aerys I Targaryen", "Brynden Rivers",
  "Tanselle", "Steely Pate", "Raymun Fossoway", "Ser Steffon Fossoway",
  "Ser Lyonel Baratheon", "Ser Humfrey Hardyng", "Ser Humfrey Beesbury",
  "Ser Tybolt Lannister", "Lord Ashford",
  // principals of the books' telling (hidden in show lore by only:"book")
  "Ser Eustace Osgrey", "Lady Rohanne Webber", "Ser Lucas Inchfield",
  "Septon Sefton", "Ser Bennis of the Brown Shield",
  "John the Fiddler", "Daemon II Blackfyre", "Lord Gormon Peake",
  "Lord Ambrose Butterwell", "Black Tom Heddle", "Ser Alyn Cockshaw",
  "Ser Glendon Ball", "Ser Maynard Plumm", "Ser Kyle the Cat",
]);

/* where a death pin belongs when the whereabouts timeline can't say */
const DEATH_SITE_OVERRIDES = {};

const DEATH_TALES = {
  // ---------------- Season One ----------------
  "Ser Arlan of Pennytree": "The old hedge knight of Pennytree took a chill on a rain-soaked road and died as quietly as he lived, in a wayside camp with only his squire beside him. Dunk dug the grave on a hillside facing west, so the old man could watch the sun go down — and took up his sword, his shield, and his trade.",
  "Ser Humfrey Beesbury": "The bold young knight of Honeyholt stood with a hedge knight in the trial of seven at Ashford Meadow, against three princes of the blood and the white cloaks of the Kingsguard. He died in the press of the melee — one of the two men the gods took to prove Dunk's innocence.",
  "Ser Humfrey Hardyng": "A champion of Ashford Meadow, crushed beneath the horse Aerion Brightflame deliberately killed under him — and still he demanded his place in the trial of seven, carried to the lists with his leg in splints. He fought from the saddle he could not rise from, and died of his wounds when it was over.",
  "Baelor Breakspear": "The Prince of Dragonstone, Hand of the King, hero of Redgrass Field — the best man in the realm — took up a plain shield to make a hedge knight's seven when no other man would. In the melee his brother Maekar's mace glanced across his helm; he finished the fight, gave the judgment, and died days later of a broken skull. All Westeros mourned, and the realm's future cracked with him.",
};

const DEATH_TALES_BOOK = {
  // ---------------- The Hedge Knight ----------------
  "Ser Arlan of Pennytree": "The old man of Pennytree died of a chill on the road to Ashford Meadow, after a lifetime of serving lords who barely remembered his name. His squire buried him on a hillside facing west and inherited everything he owned: a sword, a shield, two horses, and a knight's calling.",
  "Ser Humfrey Beesbury": "The young knight of the black-and-yellow stripes made one of Dunk's seven at Ashford, and was slain in the trial — his life the first part of the price the gods set on a hedge knight's innocence.",
  "Ser Humfrey Hardyng": "Unhorsed by treachery when Aerion's lance killed his mount, he was carried to the trial of seven with his leg in splints and fought anyway. His wounds finished what the dying horse began.",
  "Baelor Breakspear": "'It seems my helm is dusty.' The heir to the Iron Throne made a hedge knight's seven complete, took his brother's mace across the helm in the press, and finished the fight before anyone knew how badly he was hurt. He died days later, and the good years of Daeron's reign began their long ending.",

  // ---------------- between the tales ----------------
  "King Daeron II Targaryen": "Daeron the Good died in the Great Spring Sickness of 209, with tens of thousands of his people — the gentle king who gave the realm Dorne and peace, gone in a season of dying that spared neither crowns nor cradles.",
  "Valarr Targaryen": "The Young Prince survived Ashford only to die two years later in the Great Spring Sickness, with his own young sons beside him — and the crown that should have been Baelor's line's passed sideways, to Aerys.",

  // ---------------- The Sworn Sword ----------------
  "Ser Lucas Inchfield": "The Longinch met Dunk in trial by combat in the middle of the Chequy Water, the stream his lady dammed. He was the better swordsman and it did not save him: half-drowned and bleeding, Dunk bore him under and put a dagger through him. The gods' verdict floated downstream.",

  // ---------------- The Mystery Knight ----------------
  "Ser Alyn Cockshaw": "Jealous of the Fiddler's regard for a lowborn hedge knight, he lured Dunk to a quiet well at Whitewalls with hired steel waiting. Ser Maynard Plumm was quicker: Alyn Cockshaw went down the well he'd chosen, and Whitewalls never missed him.",
  "Black Tom Heddle": "Lord Butterwell's grim good-son held the gates of Whitewalls with treason on his sword when Bloodraven's army ringed the castle. He crossed steel with Ser Duncan the Tall and died of it, in the last fight of the Second Blackfyre Rebellion — a rebellion that never managed a battle.",
};

/* where the death pin belongs: the last known place on the whereabouts timeline
   at the point of death (falls back through nulls to the last real place) */
function deathSiteFor(name) {
  const c = CHARACTERS[name];
  if (!c || !c.death || c.death.s === 0) return null;
  if (DEATH_SITE_OVERRIDES[name]) return DEATH_SITE_OVERRIDES[name];
  const tl = (typeof WHEREABOUTS !== "undefined") ? WHEREABOUTS[name] : null;
  if (!tl) return null;
  let site = null;
  for (let i = 0; i < tl.length; i++) {
    const seg = tl[i];
    if (seg[0] < c.death.s || (seg[0] === c.death.s && seg[1] <= c.death.e)) {
      if (seg[2]) site = seg[2];
    } else break;
  }
  return site;
}

/* the same, in the books' telling: last known place at the bookDeath chapter */
function deathSiteForBook(name) {
  const c = CHARACTERS[name];
  if (!c || !c.bookDeath) return null;
  if (DEATH_SITE_OVERRIDES[name]) return DEATH_SITE_OVERRIDES[name];
  const tl = (typeof WHEREABOUTS_BOOK !== "undefined") ? WHEREABOUTS_BOOK[name] : null;
  if (!tl) return null;
  let site = null;
  for (let i = 0; i < tl.length; i++) {
    const seg = tl[i];
    if (seg[0] < c.bookDeath.b || (seg[0] === c.bookDeath.b && seg[1] <= c.bookDeath.ch)) {
      if (seg[2]) site = seg[2];
    } else break;
  }
  return site;
}
