/* THE KNOWN WORLD — where every soul stands, episode by episode (the show's telling).
   Each entry is a timeline of [season, episode, place]: from that episode onward the
   person stands at that place, until the next entry changes it. A place of null means
   they are off the map from then on — not yet introduced, gone from the story, or dead
   (the card's own "alive as of" line stays spoiler-gated; the map only shows presence).
   Places are location ids from data.js, or named spots below for camps, roads and
   battlefields that have no pin of their own. Season lengths: S1–S6 ten episodes,
   S7 seven, S8 six. */

const WB_SPOTS = {
  "crossroads-inn":  [1400, 1730], // the inn at the crossroads on the kingsroad
  "kingsroad-north": [1435, 1860], // the kingsroad just north of King's Landing
  "kingsroad-wall":  [1310, 500],  // the kingsroad between Winterfell and the Wall
  "green-fork":      [1235, 1590], // Tywin's camp & the battle of the Green Fork
  "whispering-wood": [1050, 1780], // Robb's trap outside Riverrun
  "riverlands-road": [1330, 1690], // the war-torn roads of the riverlands
  "haunted-forest":  [1452, 205],  // the wild woods beyond the Wall
  "weirwood-cave":   [1300, 78],   // the cave of the three-eyed raven, far north
  "frozen-lake":     [1505, 130],  // the frozen lake of the wight hunt
  "the-gift":        [1380, 330],  // the Gift, south of the Wall
  "wolfswood":       [1085, 660],  // the deep wood west of Winterfell
  "narrow-sea":      [2010, 2140], // fleets upon the narrow sea
  "blackwater-rush": [1420, 2140], // the roseroad west of King's Landing
  "dothraki-sea":    [3400, 1950], // the great grass sea
  "red-waste":       [4900, 2870], // the red desert east of Slaver's Bay
  "lhazar-pyre":     [4600, 2150], // Drogo's pyre on the empty plain
  "skagos":          [1760, 280],  // the cannibal isle (the books send Rickon here)
  "the-fingers":     [1975, 1545], // Littlefinger's bleak home peninsula
  "gulf-of-grief":   [3700, 3010], // the sea road to Slaver's Bay
};

/* how the nameless spots read on a traced road */
const WB_SPOT_NAMES = {
  "crossroads-inn":  "The Crossroads Inn",
  "kingsroad-north": "The Kingsroad, north of the capital",
  "kingsroad-wall":  "The kingsroad to the Wall",
  "green-fork":      "The Green Fork",
  "whispering-wood": "The Whispering Wood",
  "riverlands-road": "The war-torn riverlands",
  "haunted-forest":  "The haunted forest",
  "weirwood-cave":   "The cave of the three-eyed raven",
  "frozen-lake":     "The frozen lake beyond the Wall",
  "the-gift":        "The Gift",
  "wolfswood":       "The wolfswood",
  "narrow-sea":      "Upon the narrow sea",
  "blackwater-rush": "The Blackwater Rush",
  "dothraki-sea":    "The Dothraki sea",
  "red-waste":       "The red waste",
  "lhazar-pyre":     "Drogo's pyre, in Lhazar",
  "skagos":          "Skagos",
  "the-fingers":     "The Fingers",
  "gulf-of-grief":   "The Gulf of Grief",
};

const WHEREABOUTS = {

  // ---------------- the Starks of Winterfell ----------------
  "Eddard Stark": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[1,10,null]],
  "Catelyn Stark": [[1,1,"winterfell"],[1,3,"kings-landing"],[1,4,"crossroads-inn"],[1,5,"the-eyrie"],
    [1,8,"moat-cailin"],[1,9,"the-twins"],[1,10,"riverrun"],[2,1,"riverrun"],[2,3,"storms-end"],
    [2,6,"the-crag"],[3,1,"harrenhal"],[3,2,"riverrun"],[3,9,"the-twins"],[3,10,null]],
  "Robb Stark": [[1,1,"winterfell"],[1,8,"moat-cailin"],[1,9,"whispering-wood"],[1,10,"riverrun"],
    [2,1,"riverrun"],[2,4,"the-crag"],[3,1,"harrenhal"],[3,2,"riverrun"],[3,9,"the-twins"],[3,10,null]],
  "Talisa Stark": [[2,4,"the-crag"],[3,1,"harrenhal"],[3,2,"riverrun"],[3,9,"the-twins"],[3,10,null]],
  "Sansa Stark": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[4,3,"narrow-sea"],
    [4,5,"the-eyrie"],[5,1,"the-eyrie"],[5,3,"winterfell"],[6,1,"wolfswood"],[6,4,"castle-black"],
    [6,7,"bear-island"],[6,9,"winterfell"]],
  "Arya Stark": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[1,10,"kingsroad-north"],
    [2,1,"riverlands-road"],[2,4,"harrenhal"],[2,10,"riverlands-road"],[3,1,"riverlands-road"],
    [3,9,"the-twins"],[3,10,"riverlands-road"],[4,1,"riverlands-road"],[4,8,"the-bloody-gate"],
    [4,10,"narrow-sea"],[5,1,"braavos"],[6,10,"the-twins"],[7,1,"the-twins"],[7,2,"crossroads-inn"],
    [7,4,"winterfell"],[8,5,"kings-landing"]],
  "Bran Stark": [[1,1,"winterfell"],[3,1,"wolfswood"],[3,9,"queenscrown"],[4,1,"haunted-forest"],
    [4,5,"crasters-keep"],[4,6,"haunted-forest"],[4,10,"weirwood-cave"],[6,6,"haunted-forest"],
    [7,1,"castle-black"],[7,3,"winterfell"],[8,6,"kings-landing"]],
  "Rickon Stark": [[1,1,"winterfell"],[3,1,"wolfswood"],[3,9,"last-hearth"],[6,3,"winterfell"],[6,10,null]],
  "Jon Snow": [[1,1,"winterfell"],[1,2,"kingsroad-wall"],[1,3,"castle-black"],[1,7,"haunted-forest"],
    [1,8,"castle-black"],[2,1,"crasters-keep"],[2,3,"fist-of-the-first-men"],[2,6,"haunted-forest"],
    [3,1,"haunted-forest"],[3,9,"queenscrown"],[3,10,"castle-black"],[5,8,"hardhome"],[5,9,"castle-black"],
    [6,7,"bear-island"],[6,9,"winterfell"],[7,3,"dragonstone"],[7,5,"eastwatch-by-the-sea"],
    [7,6,"frozen-lake"],[7,7,"kings-landing"],[8,1,"winterfell"],[8,5,"kings-landing"],[8,6,"castle-black"]],
  "Benjen Stark": [[1,1,"winterfell"],[1,2,"kingsroad-wall"],[1,3,"castle-black"],[1,4,"haunted-forest"],
    [1,5,null],[6,6,"haunted-forest"],[7,6,"frozen-lake"],[7,7,null]],
  "Hodor": [[1,1,"winterfell"],[3,1,"wolfswood"],[3,9,"queenscrown"],[4,1,"haunted-forest"],
    [4,5,"crasters-keep"],[4,6,"haunted-forest"],[4,10,"weirwood-cave"],[6,6,null]],
  "Osha": [[1,6,"winterfell"],[3,1,"wolfswood"],[3,9,"last-hearth"],[6,3,"winterfell"],[6,5,null]],
  "Jojen Reed": [[3,2,"wolfswood"],[3,9,"queenscrown"],[4,1,"haunted-forest"],[4,5,"crasters-keep"],
    [4,6,"haunted-forest"],[4,10,"weirwood-cave"],[5,1,null]],
  "Meera Reed": [[3,2,"wolfswood"],[3,9,"queenscrown"],[4,1,"haunted-forest"],[4,5,"crasters-keep"],
    [4,6,"haunted-forest"],[4,10,"weirwood-cave"],[6,6,"haunted-forest"],[7,1,"castle-black"],
    [7,3,"winterfell"],[7,5,null]],
  "Maester Luwin": [[1,1,"winterfell"],[3,1,null]],
  "Old Nan": [[1,1,"winterfell"],[2,1,null]],
  "Rodrik Cassel": [[1,1,"winterfell"],[1,3,"kings-landing"],[1,5,"winterfell"],[2,7,null]],
  "Jory Cassel": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[1,6,null]],
  "Septa Mordane": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[1,9,null]],
  "Vayon Poole": [[1,1,"winterfell"],[1,3,"kings-landing"],[1,8,null]],
  "Jeyne Poole": [[1,1,"winterfell"],[1,3,"kings-landing"],[2,1,null]],
  "Mycah, the butcher's boy": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,null]],
  "Harwin": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[2,1,null]],

  // ---------------- the Lannisters ----------------
  "Tywin Lannister": [[1,7,"green-fork"],[2,1,"harrenhal"],[2,9,"kings-landing"],[5,1,null]],
  "Cersei Lannister": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[8,6,null]],
  "Jaime Lannister": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[1,6,"casterly-rock"],
    [1,8,"whispering-wood"],[1,10,"riverrun"],[2,1,"riverrun"],[2,8,"riverlands-road"],[3,3,"harrenhal"],
    [3,10,"kings-landing"],[5,4,"sunspear"],[5,10,"kings-landing"],[6,7,"riverrun"],[6,9,"kings-landing"],
    [7,3,"highgarden"],[7,4,"blackwater-rush"],[7,5,"kings-landing"],[8,1,"riverlands-road"],
    [8,2,"winterfell"],[8,5,"kings-landing"],[8,6,null]],
  "Tyrion Lannister": [[1,1,"winterfell"],[1,2,"kingsroad-wall"],[1,3,"castle-black"],[1,4,"crossroads-inn"],
    [1,5,"the-eyrie"],[1,7,"green-fork"],[1,10,"kings-landing"],[5,1,"pentos"],[5,3,"volantis"],
    [5,5,"valyria"],[5,6,"meereen"],[7,1,"dragonstone"],[7,7,"kings-landing"],[8,1,"winterfell"],
    [8,4,"dragonstone"],[8,5,"kings-landing"]],
  "Joffrey Baratheon": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[4,3,null]],
  "Tommen Baratheon": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[7,1,null]],
  "Myrcella Baratheon": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],
    [2,6,"sunspear"],[6,1,null]],
  "Kevan Lannister": [[1,7,"green-fork"],[2,1,"harrenhal"],[3,1,"casterly-rock"],[5,2,"kings-landing"],[7,1,null]],
  "Lancel Lannister": [[1,3,"kings-landing"],[7,1,null]],
  "Bronn": [[1,4,"crossroads-inn"],[1,5,"the-eyrie"],[1,7,"green-fork"],[1,10,"kings-landing"],
    [5,4,"sunspear"],[5,10,"kings-landing"],[7,4,"blackwater-rush"],[7,5,"kings-landing"],
    [8,4,"winterfell"],[8,6,"kings-landing"]],
  "Podrick Payne": [[2,1,"kings-landing"],[4,3,"riverlands-road"],[4,8,"the-bloody-gate"],
    [5,1,"riverlands-road"],[5,3,"wolfswood"],[6,4,"castle-black"],[6,7,"riverrun"],[6,10,"winterfell"],
    [7,7,"kings-landing"],[8,1,"winterfell"],[8,6,"kings-landing"]],
  "Shae": [[1,9,"green-fork"],[1,10,"kings-landing"],[5,1,null]],

  // ---------------- the Baratheons & Dragonstone ----------------
  "Robert Baratheon": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],[1,8,null]],
  "Stannis Baratheon": [[2,1,"dragonstone"],[2,9,"kings-landing"],[2,10,"dragonstone"],[4,6,"braavos"],
    [4,7,"dragonstone"],[4,10,"castle-black"],[5,7,"wolfswood"],[6,1,null]],
  "Renly Baratheon": [[1,3,"kings-landing"],[1,8,"highgarden"],[2,1,"storms-end"],[2,6,null]],
  "Selyse Baratheon": [[3,1,"dragonstone"],[5,1,"castle-black"],[5,7,"wolfswood"],[6,1,null]],
  "Shireen Baratheon": [[3,1,"dragonstone"],[5,1,"castle-black"],[5,7,"wolfswood"],[5,10,null]],
  "Davos Seaworth": [[2,1,"dragonstone"],[2,9,"kings-landing"],[3,1,"dragonstone"],[4,6,"braavos"],
    [4,7,"dragonstone"],[4,10,"castle-black"],[6,7,"bear-island"],[6,9,"winterfell"],[7,3,"dragonstone"],
    [7,5,"eastwatch-by-the-sea"],[7,7,"kings-landing"],[8,1,"winterfell"],[8,5,"kings-landing"]],
  "Matthos Seaworth": [[2,1,"dragonstone"],[2,9,"kings-landing"],[2,10,null]],
  "Melisandre": [[2,1,"dragonstone"],[3,6,"riverlands-road"],[3,8,"dragonstone"],[4,10,"castle-black"],
    [5,7,"wolfswood"],[5,10,"castle-black"],[6,9,"winterfell"],[6,10,"wolfswood"],[7,1,"dragonstone"],
    [7,4,"volantis"],[8,3,"winterfell"],[8,4,null]],
  "Gendry": [[1,1,"kings-landing"],[1,10,"kingsroad-north"],[2,1,"riverlands-road"],[2,4,"harrenhal"],
    [2,10,"riverlands-road"],[3,1,"riverlands-road"],[3,7,"dragonstone"],[4,1,null],
    [7,5,"eastwatch-by-the-sea"],[7,6,"frozen-lake"],[7,7,"dragonstone"],[8,1,"winterfell"],
    [8,5,"storms-end"],[8,6,"kings-landing"]],

  // ---------------- the Targaryens & the east ----------------
  "Daenerys Targaryen": [[1,1,"pentos"],[1,2,"dothraki-sea"],[1,4,"vaes-dothrak"],
    [1,8,"village-of-the-lhazareen"],[1,10,"lhazar-pyre"],[2,1,"red-waste"],[2,4,"qarth"],
    [3,1,"astapor"],[3,7,"yunkai"],[4,1,"meereen"],[5,10,"dothraki-sea"],[6,1,"vaes-dothrak"],
    [6,9,"meereen"],[7,1,"dragonstone"],[7,4,"blackwater-rush"],[7,5,"dragonstone"],[7,6,"frozen-lake"],
    [7,7,"kings-landing"],[8,1,"winterfell"],[8,4,"dragonstone"],[8,5,"kings-landing"],[8,6,null]],
  "Viserys Targaryen": [[1,1,"pentos"],[1,2,"dothraki-sea"],[1,4,"vaes-dothrak"],[1,7,null]],
  "Khal Drogo": [[1,1,"pentos"],[1,2,"dothraki-sea"],[1,4,"vaes-dothrak"],
    [1,8,"village-of-the-lhazareen"],[1,10,"lhazar-pyre"],[2,1,null]],
  "Jorah Mormont": [[1,1,"pentos"],[1,2,"dothraki-sea"],[1,4,"vaes-dothrak"],
    [1,8,"village-of-the-lhazareen"],[1,10,"lhazar-pyre"],[2,1,"red-waste"],[2,4,"qarth"],
    [3,1,"astapor"],[3,7,"yunkai"],[4,1,"meereen"],[4,9,null],[5,3,"volantis"],[5,5,"valyria"],
    [5,6,"meereen"],[6,1,"vaes-dothrak"],[6,5,null],[7,1,"oldtown"],[7,5,"dragonstone"],
    [7,6,"frozen-lake"],[7,7,"kings-landing"],[8,1,"winterfell"],[8,4,null]],
  "Barristan Selmy": [[1,1,"kings-landing"],[3,1,"astapor"],[3,7,"yunkai"],[4,1,"meereen"],[5,5,null]],
  "Missandei": [[3,1,"astapor"],[3,7,"yunkai"],[4,1,"meereen"],[7,1,"dragonstone"],[8,1,"winterfell"],
    [8,4,"kings-landing"],[8,5,null]],
  "Grey Worm": [[3,1,"astapor"],[3,7,"yunkai"],[4,1,"meereen"],[7,1,"dragonstone"],[7,3,"casterly-rock"],
    [7,7,"kings-landing"],[8,1,"winterfell"],[8,4,"dragonstone"],[8,5,"kings-landing"]],
  "Daario Naharis": [[3,7,"yunkai"],[4,1,"meereen"],[6,1,"vaes-dothrak"],[6,9,"meereen"]],
  "Mirri Maz Duur": [[1,8,"village-of-the-lhazareen"],[1,10,"lhazar-pyre"],[2,1,null]],
  "Doreah": [[1,1,"pentos"],[1,2,"dothraki-sea"],[1,4,"vaes-dothrak"],[1,8,"village-of-the-lhazareen"],
    [2,1,"red-waste"],[2,4,"qarth"],[3,1,null]],
  "Irri": [[1,1,"pentos"],[1,2,"dothraki-sea"],[1,4,"vaes-dothrak"],[1,8,"village-of-the-lhazareen"],
    [2,1,"red-waste"],[2,4,"qarth"],[2,6,null]],
  "Qotho": [[1,2,"dothraki-sea"],[1,4,"vaes-dothrak"],[1,8,"village-of-the-lhazareen"],[1,9,null]],
  "Rakharo": [[1,2,"dothraki-sea"],[1,4,"vaes-dothrak"],[1,8,"village-of-the-lhazareen"],
    [2,1,"red-waste"],[2,2,null]],
  "Aggo": [[1,2,"dothraki-sea"],[1,8,"village-of-the-lhazareen"],[2,1,"red-waste"],[2,5,null]],
  "Jhogo": [[1,2,"dothraki-sea"],[1,8,"village-of-the-lhazareen"],[2,1,"red-waste"],[3,1,null]],
  "Illyrio Mopatis": [[1,1,"pentos"]],
  "Xaro Xhoan Daxos": [[2,4,"qarth"],[3,1,null]],
  "Quaithe": [[2,4,"qarth"],[3,1,null]],
  "Kraznys mo Nakloz": [[3,1,"astapor"],[3,5,null]],
  "Razdal mo Eraz": [[3,7,"yunkai"],[6,9,"meereen"],[6,10,null]],
  "Yezzan zo Qaggaz": [[5,6,"meereen"],[6,10,null]],
  "Mero": [[3,7,"yunkai"],[3,9,null]],
  "Prendahl na Ghezn": [[3,7,"yunkai"],[3,9,null]],
  "Hizdahr zo Loraq": [[5,1,"meereen"],[5,10,null]],
  "Harry Strickland": [[8,1,"kings-landing"],[8,6,null]],

  // ---------------- the court at King's Landing ----------------
  "Varys": [[1,1,"kings-landing"],[5,1,"pentos"],[5,3,"volantis"],[5,10,"meereen"],[7,1,"dragonstone"],
    [8,1,"winterfell"],[8,4,"dragonstone"],[8,5,null]],
  "Petyr Baelish": [[1,1,"kings-landing"],[4,3,"narrow-sea"],[4,5,"the-eyrie"],[5,3,"winterfell"],
    [5,4,"kings-landing"],[6,4,"the-eyrie"],[6,9,"winterfell"],[8,1,null]],
  "Grand Maester Pycelle": [[1,1,"kings-landing"],[7,1,null]],
  "Qyburn": [[3,1,"harrenhal"],[3,10,"kings-landing"],[8,6,null]],
  "Meryn Trant": [[1,1,"kings-landing"],[5,9,"braavos"],[6,1,null]],
  "Ilyn Payne": [[1,1,"kings-landing"],[3,1,null]],
  "Boros Blount": [[1,1,"kings-landing"],[2,1,null]],
  "Mandon Moore": [[1,1,"kings-landing"],[2,10,null]],
  "Balon Swann": [[1,1,"kings-landing"],[2,1,null]],
  "Syrio Forel": [[1,3,"kings-landing"],[1,6,null]],
  "Tobho Mott": [[1,1,"kings-landing"]],
  "The High Septon": [[1,1,"kings-landing"],[2,7,null]],
  "The High Sparrow": [[5,3,"kings-landing"],[7,1,null]],
  "Septa Unella": [[5,4,"kings-landing"],[7,1,null]],
  "Ros": [[1,1,"winterfell"],[1,4,"kings-landing"],[3,7,null]],

  // ---------------- the Cleganes ----------------
  "Sandor Clegane": [[1,1,"winterfell"],[1,2,"crossroads-inn"],[1,3,"kings-landing"],
    [2,10,"riverlands-road"],[3,9,"the-twins"],[3,10,"riverlands-road"],[4,8,"the-bloody-gate"],
    [4,10,null],[6,7,"riverlands-road"],[7,5,"eastwatch-by-the-sea"],[7,6,"frozen-lake"],
    [7,7,"kings-landing"],[8,1,"winterfell"],[8,5,"kings-landing"],[8,6,null]],
  "Gregor Clegane": [[1,4,"kings-landing"],[1,6,"riverlands-road"],[2,4,"harrenhal"],
    [4,7,"kings-landing"],[8,6,null]],

  // ---------------- the Night's Watch ----------------
  "Jeor Mormont": [[1,3,"castle-black"],[2,1,"crasters-keep"],[2,3,"fist-of-the-first-men"],
    [3,1,"haunted-forest"],[3,3,"crasters-keep"],[3,5,null]],
  "Maester Aemon": [[1,3,"castle-black"],[5,8,null]],
  "Alliser Thorne": [[1,3,"castle-black"],[6,4,null]],
  "Samwell Tarly": [[1,4,"castle-black"],[2,1,"crasters-keep"],[2,3,"fist-of-the-first-men"],
    [3,1,"haunted-forest"],[3,3,"crasters-keep"],[3,5,"haunted-forest"],[3,10,"castle-black"],
    [6,6,"horn-hill"],[6,10,"oldtown"],[8,1,"winterfell"],[8,6,"kings-landing"]],
  "Gilly": [[2,1,"crasters-keep"],[3,5,"haunted-forest"],[3,10,"castle-black"],[6,6,"horn-hill"],
    [6,10,"oldtown"],[8,1,"winterfell"]],
  "Edd Tollett": [[2,1,"crasters-keep"],[2,3,"fist-of-the-first-men"],[3,1,"haunted-forest"],
    [3,3,"crasters-keep"],[3,5,"castle-black"],[5,8,"hardhome"],[5,9,"castle-black"],
    [8,1,"winterfell"],[8,4,null]],
  "Grenn": [[1,3,"castle-black"],[2,1,"crasters-keep"],[2,3,"fist-of-the-first-men"],
    [3,1,"haunted-forest"],[3,3,"crasters-keep"],[3,5,"castle-black"],[4,10,null]],
  "Pyp": [[1,3,"castle-black"],[4,10,null]],
  "Rast": [[1,3,"castle-black"],[2,1,"crasters-keep"],[2,3,"fist-of-the-first-men"],
    [3,3,"crasters-keep"],[4,6,null]],
  "Karl Tanner": [[2,1,"crasters-keep"],[2,3,"fist-of-the-first-men"],[3,3,"crasters-keep"],[4,6,null]],
  "Olly": [[4,3,"the-gift"],[4,5,"castle-black"],[6,4,null]],
  "Yoren": [[1,3,"castle-black"],[1,4,"crossroads-inn"],[1,5,"kings-landing"],[1,10,"kingsroad-north"],
    [2,1,"riverlands-road"],[2,4,null]],
  "Janos Slynt": [[1,3,"kings-landing"],[2,2,"castle-black"],[5,4,null]],
  "Qhorin Halfhand": [[2,5,"fist-of-the-first-men"],[2,7,"haunted-forest"],[3,1,null]],
  "Bowen Marsh": [[5,1,"castle-black"],[6,4,null]],
  "Will of the Night's Watch": [[1,1,"haunted-forest"],[1,2,null]],
  "Ser Waymar Royce": [[1,1,"haunted-forest"],[1,2,null]],
  "Gared": [[1,1,"haunted-forest"],[1,2,null]],

  // ---------------- the free folk & the far north ----------------
  "Mance Rayder": [[3,1,"haunted-forest"],[4,9,"castle-black"],[5,2,null]],
  "Ygritte": [[2,6,"haunted-forest"],[3,9,"queenscrown"],[3,10,"the-gift"],[4,9,"castle-black"],[4,10,null]],
  "Tormund Giantsbane": [[3,1,"haunted-forest"],[3,9,"queenscrown"],[3,10,"the-gift"],
    [4,9,"castle-black"],[5,8,"hardhome"],[5,9,"castle-black"],[6,9,"winterfell"],
    [7,2,"eastwatch-by-the-sea"],[7,6,"frozen-lake"],[7,7,"eastwatch-by-the-sea"],[8,1,"last-hearth"],
    [8,2,"winterfell"],[8,5,"castle-black"]],
  "Styr": [[4,1,"the-gift"],[4,9,"castle-black"],[4,10,null]],
  "Orell": [[3,1,"haunted-forest"],[3,9,"queenscrown"],[3,10,null]],
  "Rattleshirt": [[2,6,"haunted-forest"],[5,8,"hardhome"],[5,9,null]],
  "Craster": [[2,1,"crasters-keep"],[3,5,null]],
  "Karsi": [[5,8,"hardhome"],[5,9,null]],
  "Wun Wun": [[5,8,"hardhome"],[5,9,"castle-black"],[6,9,"winterfell"],[6,10,null]],
  "The Night King": [[4,4,"haunted-forest"],[5,8,"hardhome"],[6,1,"haunted-forest"],[7,6,"frozen-lake"],
    [7,7,"eastwatch-by-the-sea"],[8,1,"last-hearth"],[8,2,"winterfell"],[8,4,null]],
  "The Three-Eyed Raven": [[4,10,"weirwood-cave"],[6,6,null]],
  "Leaf": [[6,1,"weirwood-cave"],[6,6,null]],

  // ---------------- the brotherhood & the riverlands ----------------
  "Beric Dondarrion": [[1,5,"kings-landing"],[1,7,"riverlands-road"],[6,7,"riverlands-road"],
    [7,5,"eastwatch-by-the-sea"],[7,6,"frozen-lake"],[7,7,"eastwatch-by-the-sea"],[8,1,"last-hearth"],
    [8,2,"winterfell"],[8,4,null]],
  "Thoros of Myr": [[3,1,"riverlands-road"],[7,5,"eastwatch-by-the-sea"],[7,6,"frozen-lake"],[7,7,null]],
  "Anguy": [[3,2,"riverlands-road"],[4,1,null]],
  "Lem Lemoncloak": [[3,2,"riverlands-road"],[6,9,null]],
  "Jaqen H'ghar": [[2,1,"riverlands-road"],[2,4,"harrenhal"],[3,1,null],[5,2,"braavos"]],
  "The Waif": [[5,2,"braavos"],[6,9,null]],
  "Hot Pie": [[1,10,"kingsroad-north"],[2,1,"riverlands-road"],[2,4,"harrenhal"],[2,10,"riverlands-road"],
    [3,3,"crossroads-inn"]],
  "Lommy Greenhands": [[1,10,"kingsroad-north"],[2,1,"riverlands-road"],[2,4,null]],

  // ---------------- the Tullys & the Vale ----------------
  "Hoster Tully": [[1,1,"riverrun"],[3,3,null]],
  "Brynden Tully": [[3,2,"riverrun"],[3,9,"the-twins"],[3,10,"riverrun"],[6,9,null]],
  "Edmure Tully": [[3,2,"riverrun"],[3,9,"the-twins"],[6,7,"riverrun"],[6,9,"the-twins"],
    [8,6,"kings-landing"]],
  "Lysa Arryn": [[1,1,"the-eyrie"],[4,8,null]],
  "Robin Arryn": [[1,1,"the-eyrie"],[8,6,"kings-landing"]],
  "Yohn Royce": [[4,5,"the-eyrie"],[6,9,"winterfell"],[8,6,"kings-landing"]],
  "Vardis Egen": [[1,1,"the-eyrie"],[1,7,null]],

  // ---------------- the Freys ----------------
  "Walder Frey": [[1,9,"the-twins"],[7,1,null]],
  "Lothar Frey": [[3,6,"riverrun"],[3,9,"the-twins"],[6,8,"riverrun"],[6,9,"the-twins"],[7,1,null]],
  "Black Walder Rivers": [[3,6,"riverrun"],[3,9,"the-twins"],[6,8,"riverrun"],[6,9,"the-twins"],[7,1,null]],
  "Olyvar Frey": [[3,9,"the-twins"],[7,2,null]],
  "Roslin Frey": [[3,9,"the-twins"]],

  // ---------------- the Boltons & the northern houses ----------------
  "Roose Bolton": [[2,2,"riverrun"],[2,4,"the-crag"],[3,1,"harrenhal"],[3,9,"the-twins"],
    [3,10,"the-dreadfort"],[5,1,"winterfell"],[6,3,null]],
  "Ramsay Bolton": [[3,1,"the-dreadfort"],[4,7,"moat-cailin"],[4,8,"the-dreadfort"],[5,1,"winterfell"],
    [6,10,null]],
  "Walda Bolton": [[3,9,"the-twins"],[3,10,"the-dreadfort"],[5,1,"winterfell"],[6,3,null]],
  "Theon Greyjoy": [[1,1,"winterfell"],[1,8,"moat-cailin"],[1,9,"whispering-wood"],[1,10,"riverrun"],
    [2,2,"pyke"],[2,6,"winterfell"],[3,1,"the-dreadfort"],[4,7,"moat-cailin"],[4,8,"the-dreadfort"],
    [5,1,"winterfell"],[6,1,"wolfswood"],[6,2,"pyke"],[6,7,"volantis"],[6,9,"meereen"],
    [7,1,"dragonstone"],[7,2,"narrow-sea"],[7,3,"dragonstone"],[8,1,"narrow-sea"],[8,2,"winterfell"],
    [8,4,null]],
  "Rickard Karstark": [[1,8,"moat-cailin"],[1,9,"whispering-wood"],[1,10,"riverrun"],[2,1,"riverrun"],
    [2,4,"the-crag"],[3,1,"harrenhal"],[3,2,"riverrun"],[3,6,null]],
  "Torrhen Karstark": [[1,8,"moat-cailin"],[1,9,"whispering-wood"],[1,10,null]],
  "Lyanna Mormont": [[6,7,"bear-island"],[6,9,"winterfell"],[8,4,null]],

  // ---------------- the Greyjoys ----------------
  "Balon Greyjoy": [[2,1,"pyke"],[6,3,null]],
  "Yara Greyjoy": [[2,2,"pyke"],[4,6,"the-dreadfort"],[4,7,"pyke"],[6,5,"pyke"],[6,7,"volantis"],
    [6,9,"meereen"],[7,1,"dragonstone"],[7,2,"narrow-sea"],[7,3,"kings-landing"],[8,1,"narrow-sea"],
    [8,2,"pyke"],[8,6,"kings-landing"]],
  "Euron Greyjoy": [[6,2,"pyke"],[7,1,"kings-landing"],[7,2,"narrow-sea"],[7,3,"kings-landing"],
    [8,1,"kings-landing"],[8,6,null]],
  "Aeron Greyjoy": [[6,2,"pyke"]],

  // ---------------- the Tyrells & the Reach ----------------
  "Olenna Tyrell": [[3,1,"kings-landing"],[6,10,"highgarden"],[7,4,null]],
  "Mace Tyrell": [[3,6,"kings-landing"],[7,1,null]],
  "Margaery Tyrell": [[2,3,"storms-end"],[2,6,"highgarden"],[2,10,"kings-landing"],[7,1,null]],
  "Loras Tyrell": [[1,3,"kings-landing"],[2,1,"storms-end"],[2,6,"highgarden"],[3,1,"kings-landing"],
    [7,1,null]],
  "Randyll Tarly": [[6,6,"horn-hill"],[7,3,"highgarden"],[7,4,"blackwater-rush"],[7,5,null]],
  "Dickon Tarly": [[6,6,"horn-hill"],[7,3,"highgarden"],[7,4,"blackwater-rush"],[7,5,null]],
  "Melessa Tarly": [[6,6,"horn-hill"]],
  "Talla Tarly": [[6,6,"horn-hill"]],
  "Brienne of Tarth": [[2,3,"storms-end"],[2,6,"the-crag"],[2,8,"riverlands-road"],[3,3,"harrenhal"],
    [3,10,"kings-landing"],[4,3,"riverlands-road"],[4,8,"the-bloody-gate"],[5,1,"riverlands-road"],
    [5,3,"wolfswood"],[6,4,"castle-black"],[6,7,"riverrun"],[6,10,"winterfell"],[7,7,"kings-landing"],
    [8,1,"winterfell"],[8,6,"kings-landing"]],

  // ---------------- the Martells & Dorne ----------------
  "Doran Martell": [[5,1,"sunspear"],[6,2,null]],
  "Oberyn Martell": [[4,1,"kings-landing"],[4,9,null]],
  "Ellaria Sand": [[4,1,"kings-landing"],[5,1,"sunspear"],[7,2,"narrow-sea"],[7,3,"kings-landing"]],
  "Trystane Martell": [[5,1,"sunspear"],[5,10,"narrow-sea"],[6,2,null]],
  "Areo Hotah": [[5,1,"sunspear"],[6,2,null]],
  "Obara Sand": [[5,1,"sunspear"],[7,2,"narrow-sea"],[7,3,null]],
  "Nymeria Sand": [[5,1,"sunspear"],[7,2,"narrow-sea"],[7,3,null]],
  "Tyene Sand": [[5,1,"sunspear"],[7,2,"narrow-sea"],[7,3,"kings-landing"],[7,4,null]],
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
   THE BOOKS' LEDGER — the same idea, chapter by chapter through the five novels.
   Each entry is [book, chapter, place]; book lengths: AGOT 73 · ACOK 70 ·
   ASOS 82 · AFFC 46 · ADWD 73 (Prologue = chapter 1). The books diverge from
   the show, so this ledger is kept separately: Catelyn's road, Sansa's Vale,
   Theon's Winterfell, Stannis's march, the Greyjoy kingsmoot, Dorne's plots
   and the Essos slog all follow Martin's pages, not HBO's map. */

const WHEREABOUTS_BOOK = {

  // ---------------- the Starks of Winterfell ----------------
  "Eddard Stark": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],[1,67,null]],
  "Catelyn Stark": [[1,1,"winterfell"],[1,18,"kings-landing"],[1,28,"crossroads-inn"],[1,34,"the-eyrie"],
    [1,55,"moat-cailin"],[1,60,"the-twins"],[1,63,"riverrun"],[2,1,"riverrun"],[2,31,"storms-end"],
    [2,39,"riverrun"],[3,1,"riverrun"],[3,49,"the-twins"],[3,53,null]],
  "Robb Stark": [[1,1,"winterfell"],[1,53,"moat-cailin"],[1,60,"the-twins"],[1,63,"whispering-wood"],
    [1,71,"riverrun"],[2,1,"riverrun"],[2,45,"the-crag"],[3,1,"riverrun"],[3,49,"the-twins"],[3,53,null]],
  "Jeyne Westerling": [[2,45,"the-crag"],[3,14,"riverrun"]],
  "Sansa Stark": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],[3,61,"narrow-sea"],
    [3,68,"the-fingers"],[3,75,"the-eyrie"],[4,1,"the-eyrie"]],
  "Arya Stark": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],[1,65,"kingsroad-north"],
    [2,1,"riverlands-road"],[2,26,"harrenhal"],[2,64,"riverlands-road"],[3,1,"riverlands-road"],
    [3,50,"the-twins"],[3,52,"riverlands-road"],[3,74,"narrow-sea"],[4,6,"braavos"],[5,1,"braavos"]],
  "Bran Stark": [[1,1,"winterfell"],[2,66,"wolfswood"],[3,9,"wolfswood"],[3,40,"queenscrown"],
    [3,56,"castle-black"],[3,80,"haunted-forest"],[5,13,"weirwood-cave"]],
  "Rickon Stark": [[1,1,"winterfell"],[2,66,"wolfswood"],[3,9,"skagos"]],
  "Jon Snow": [[1,1,"winterfell"],[1,10,"kingsroad-wall"],[1,19,"castle-black"],[1,48,"haunted-forest"],
    [1,52,"castle-black"],[2,13,"crasters-keep"],[2,34,"fist-of-the-first-men"],[2,51,"haunted-forest"],
    [3,7,"haunted-forest"],[3,41,"queenscrown"],[3,55,"castle-black"],[4,1,"castle-black"],
    [5,1,"castle-black"]],
  "Benjen Stark": [[1,1,"winterfell"],[1,10,"kingsroad-wall"],[1,19,"castle-black"],[1,24,"haunted-forest"],
    [1,30,null]],
  "Hodor": [[1,1,"winterfell"],[2,66,"wolfswood"],[3,9,"wolfswood"],[3,40,"queenscrown"],
    [3,56,"castle-black"],[3,80,"haunted-forest"],[5,13,"weirwood-cave"]],
  "Osha": [[1,37,"winterfell"],[2,66,"wolfswood"],[3,9,"skagos"]],
  "Jojen Reed": [[2,21,"winterfell"],[2,66,"wolfswood"],[3,40,"queenscrown"],[3,56,"castle-black"],
    [3,80,"haunted-forest"],[5,13,"weirwood-cave"]],
  "Meera Reed": [[2,21,"winterfell"],[2,66,"wolfswood"],[3,40,"queenscrown"],[3,56,"castle-black"],
    [3,80,"haunted-forest"],[5,13,"weirwood-cave"]],
  "Maester Luwin": [[1,1,"winterfell"],[2,71,null]],
  "Old Nan": [[1,1,"winterfell"],[2,71,null]],
  "Rodrik Cassel": [[1,1,"winterfell"],[1,18,"kings-landing"],[1,28,"crossroads-inn"],[1,40,"winterfell"],
    [2,68,null]],
  "Jory Cassel": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],[1,37,null]],
  "Septa Mordane": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],[1,69,null]],
  "Vayon Poole": [[1,1,"winterfell"],[1,20,"kings-landing"],[1,50,null]],
  "Jeyne Poole": [[1,1,"winterfell"],[1,20,"kings-landing"],[5,32,"winterfell"],[5,62,"wolfswood"]],
  "Mycah, the butcher's boy": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,18,null]],
  "Harwin": [[1,1,"winterfell"],[1,20,"kings-landing"],[2,1,"riverlands-road"],[3,13,"riverlands-road"]],
  "Lyanna Mormont": [[1,1,"bear-island"]],
  "Maege Mormont": [[1,60,"the-twins"],[1,71,"riverrun"],[3,14,"riverlands-road"],[3,20,"moat-cailin"]],
  "Dacey Mormont": [[1,60,"the-twins"],[1,71,"riverrun"],[3,1,"riverrun"],[3,49,"the-twins"],[3,53,null]],

  // ---------------- the Lannisters ----------------
  "Tywin Lannister": [[1,56,"green-fork"],[2,14,"harrenhal"],[2,65,"kings-landing"],[3,1,"kings-landing"],
    [3,79,null]],
  "Cersei Lannister": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"]],
  "Jaime Lannister": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],
    [1,63,"whispering-wood"],[1,71,"riverrun"],[2,1,"riverrun"],[3,1,"riverlands-road"],[3,21,"harrenhal"],
    [3,62,"kings-landing"],[4,27,"harrenhal"],[4,33,"riverrun"],[5,48,"riverlands-road"]],
  "Tyrion Lannister": [[1,1,"winterfell"],[1,10,"kingsroad-wall"],[1,19,"castle-black"],
    [1,28,"crossroads-inn"],[1,34,"the-eyrie"],[1,42,"riverlands-road"],[1,56,"green-fork"],
    [2,1,"kings-landing"],[3,1,"kings-landing"],[4,1,null],[5,1,"pentos"],[5,22,"selhorys"],
    [5,40,"volantis"],[5,57,"meereen"]],
  "Joffrey Baratheon": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],[3,62,null]],
  "Tommen Baratheon": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"]],
  "Myrcella Baratheon": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],
    [3,1,"sunspear"]],
  "Kevan Lannister": [[1,56,"green-fork"],[2,14,"harrenhal"],[2,65,"kings-landing"],[5,73,"kings-landing"]],
  "Lancel Lannister": [[1,20,"kings-landing"],[4,30,"riverlands-road"]],
  "Genna Lannister": [[1,1,"casterly-rock"],[4,25,"riverrun"]],
  "Bronn": [[1,28,"crossroads-inn"],[1,34,"the-eyrie"],[1,42,"riverlands-road"],[1,56,"green-fork"],
    [2,1,"kings-landing"]],
  "Podrick Payne": [[2,1,"kings-landing"],[4,4,"riverlands-road"],[4,20,"maidenpool"],
    [4,37,"crossroads-inn"],[5,48,"riverlands-road"]],
  "Shae": [[1,56,"green-fork"],[2,1,"kings-landing"],[3,79,null]],

  // ---------------- the Baratheons & Dragonstone ----------------
  "Robert Baratheon": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],[1,51,null]],
  "Stannis Baratheon": [[2,1,"dragonstone"],[2,58,"kings-landing"],[2,66,"dragonstone"],
    [3,79,"castle-black"],[4,1,"castle-black"],[5,20,"wolfswood"]],
  "Renly Baratheon": [[1,20,"kings-landing"],[1,50,"highgarden"],[2,17,"bitterbridge"],
    [2,31,"storms-end"],[2,35,null]],
  "Selyse Baratheon": [[2,1,"dragonstone"],[5,10,"castle-black"]],
  "Shireen Baratheon": [[2,1,"dragonstone"],[5,10,"castle-black"]],
  "Edric Storm": [[2,10,"storms-end"],[3,10,"dragonstone"],[3,55,"lys"]],
  "Davos Seaworth": [[2,1,"dragonstone"],[2,58,"kings-landing"],[3,10,"dragonstone"],
    [5,9,"white-harbor"]],
  "Matthos Seaworth": [[2,1,"dragonstone"],[2,58,"kings-landing"],[2,59,null]],
  "Melisandre": [[2,1,"dragonstone"],[3,79,"castle-black"],[5,1,"castle-black"]],
  "Gendry": [[1,20,"kings-landing"],[1,65,"kingsroad-north"],[2,1,"riverlands-road"],[2,26,"harrenhal"],
    [2,47,"riverlands-road"],[3,13,"riverlands-road"],[4,37,"crossroads-inn"]],

  // ---------------- the Targaryens & the east ----------------
  "Daenerys Targaryen": [[1,4,"pentos"],[1,12,"dothraki-sea"],[1,37,"vaes-dothrak"],
    [1,62,"village-of-the-lhazareen"],[1,73,"lhazar-pyre"],[2,4,"red-waste"],[2,28,"qarth"],
    [3,8,"astapor"],[3,28,"yunkai"],[3,43,"meereen"],[4,1,"meereen"],[5,1,"meereen"],
    [5,68,"dothraki-sea"]],
  "Viserys Targaryen": [[1,4,"pentos"],[1,12,"dothraki-sea"],[1,37,"vaes-dothrak"],[1,48,null]],
  "Khal Drogo": [[1,4,"pentos"],[1,12,"dothraki-sea"],[1,37,"vaes-dothrak"],
    [1,62,"village-of-the-lhazareen"],[1,70,null]],
  "Jorah Mormont": [[1,4,"pentos"],[1,12,"dothraki-sea"],[1,37,"vaes-dothrak"],
    [1,62,"village-of-the-lhazareen"],[2,4,"red-waste"],[2,28,"qarth"],[3,8,"astapor"],[3,28,"yunkai"],
    [3,43,"meereen"],[3,72,null],[5,22,"selhorys"],[5,40,"volantis"],[5,57,"meereen"]],
  "Barristan Selmy": [[1,20,"kings-landing"],[1,58,null],[3,8,"astapor"],[3,28,"yunkai"],
    [3,43,"meereen"],[4,1,"meereen"],[5,1,"meereen"]],
  "Missandei": [[3,8,"astapor"],[3,28,"yunkai"],[3,43,"meereen"]],
  "Grey Worm": [[3,8,"astapor"],[3,28,"yunkai"],[3,43,"meereen"]],
  "Daario Naharis": [[3,28,"yunkai"],[3,43,"meereen"]],
  "Mirri Maz Duur": [[1,62,"village-of-the-lhazareen"],[1,73,"lhazar-pyre"],[2,1,null]],
  "Doreah": [[1,4,"pentos"],[1,12,"dothraki-sea"],[1,37,"vaes-dothrak"],[2,4,"red-waste"],[2,14,null]],
  "Irri": [[1,4,"pentos"],[1,12,"dothraki-sea"],[2,4,"red-waste"],[2,28,"qarth"],[3,8,"astapor"],
    [3,43,"meereen"]],
  "Qotho": [[1,12,"dothraki-sea"],[1,37,"vaes-dothrak"],[1,62,"village-of-the-lhazareen"],[1,70,null]],
  "Rakharo": [[1,12,"dothraki-sea"],[1,62,"village-of-the-lhazareen"],[2,4,"red-waste"],[2,28,"qarth"],
    [3,43,"meereen"]],
  "Aggo": [[1,12,"dothraki-sea"],[1,62,"village-of-the-lhazareen"],[2,4,"red-waste"],[2,28,"qarth"],
    [3,43,"meereen"]],
  "Jhogo": [[1,12,"dothraki-sea"],[1,62,"village-of-the-lhazareen"],[2,4,"red-waste"],[2,28,"qarth"],
    [3,43,"meereen"]],
  "Illyrio Mopatis": [[1,1,"pentos"]],
  "Xaro Xhoan Daxos": [[2,28,"qarth"],[5,16,"meereen"],[5,21,"qarth"]],
  "Quaithe": [[2,28,"qarth"]],
  "Kraznys mo Nakloz": [[3,8,"astapor"],[3,28,null]],
  "Razdal mo Eraz": [[3,28,"yunkai"]],
  "Yezzan zo Qaggaz": [[5,30,"meereen"],[5,53,null]],
  "Mero": [[3,28,"yunkai"],[3,60,null]],
  "Prendahl na Ghezn": [[3,28,"yunkai"],[3,43,null]],
  "Hizdahr zo Loraq": [[5,1,"meereen"]],
  "Quentyn Martell": [[5,2,"volantis"],[5,26,"meereen"],[5,71,null]],
  "Jon Connington": [[5,8,"volon-therys"],[5,45,"griffins-roost"]],
  "Aegon Targaryen": [[5,8,"volon-therys"],[5,45,"storms-end"]],
  "Harry Strickland": [[5,45,"storms-end"]],
  "Victarion Greyjoy": [[2,24,"moat-cailin"],[4,1,"pyke"],[5,54,"gulf-of-grief"]],

  // ---------------- the court at King's Landing ----------------
  "Varys": [[1,1,"kings-landing"]],
  "Petyr Baelish": [[1,1,"kings-landing"],[3,61,"narrow-sea"],[3,68,"the-fingers"],[3,75,"the-eyrie"],
    [4,1,"the-eyrie"]],
  "Grand Maester Pycelle": [[1,1,"kings-landing"],[5,73,"kings-landing"]],
  "Qyburn": [[2,26,"harrenhal"],[3,21,"harrenhal"],[3,62,"kings-landing"]],
  "Meryn Trant": [[1,1,"kings-landing"]],
  "Ilyn Payne": [[1,1,"kings-landing"],[4,27,"harrenhal"],[4,33,"riverrun"]],
  "Boros Blount": [[1,1,"kings-landing"]],
  "Mandon Moore": [[1,1,"kings-landing"],[2,62,null]],
  "Balon Swann": [[1,1,"kings-landing"],[5,2,"sunspear"]],
  "Syrio Forel": [[1,20,"kings-landing"],[1,52,null]],
  "Tobho Mott": [[1,1,"kings-landing"]],
  "The High Septon": [[1,1,"kings-landing"],[2,42,null]],
  "The High Sparrow": [[4,28,"kings-landing"]],
  "Septa Unella": [[4,28,"kings-landing"]],
  "The Kindly Man": [[4,6,"braavos"]],
  "The Waif": [[4,6,"braavos"]],
  "Jaqen H'ghar": [[2,5,"riverlands-road"],[2,26,"harrenhal"],[2,48,null],[4,1,"oldtown"]],
  "Pate, the Citadel novice": [[4,1,"oldtown"],[4,2,null]],

  // ---------------- the Cleganes ----------------
  "Sandor Clegane": [[1,1,"winterfell"],[1,14,"crossroads-inn"],[1,20,"kings-landing"],
    [2,65,"riverlands-road"],[3,34,"riverlands-road"],[3,50,"the-twins"],[3,52,"riverlands-road"],
    [3,75,null]],
  "Gregor Clegane": [[1,29,"kings-landing"],[1,43,"riverlands-road"],[2,26,"harrenhal"],
    [3,66,"kings-landing"],[4,1,null]],

  // ---------------- the Night's Watch ----------------
  "Jeor Mormont": [[1,19,"castle-black"],[2,13,"crasters-keep"],[2,34,"fist-of-the-first-men"],
    [3,12,"crasters-keep"],[3,35,null]],
  "Maester Aemon": [[1,19,"castle-black"],[4,7,"braavos"],[4,37,null]],
  "Alliser Thorne": [[1,19,"castle-black"],[1,45,"kings-landing"],[2,26,"castle-black"]],
  "Samwell Tarly": [[1,26,"castle-black"],[2,13,"crasters-keep"],[2,34,"fist-of-the-first-men"],
    [3,1,"haunted-forest"],[3,18,"crasters-keep"],[3,34,"haunted-forest"],[3,46,"castle-black"],
    [4,7,"braavos"],[4,45,"oldtown"],[5,1,"oldtown"]],
  "Gilly": [[2,14,"crasters-keep"],[3,34,"haunted-forest"],[3,46,"castle-black"],[4,7,"braavos"],
    [4,45,"horn-hill"]],
  "Edd Tollett": [[2,13,"crasters-keep"],[2,34,"fist-of-the-first-men"],[3,12,"crasters-keep"],
    [3,46,"castle-black"]],
  "Grenn": [[1,19,"castle-black"],[2,13,"crasters-keep"],[2,34,"fist-of-the-first-men"],
    [3,12,"crasters-keep"],[3,46,"castle-black"]],
  "Pyp": [[1,19,"castle-black"]],
  "Rast": [[1,19,"castle-black"],[2,13,"crasters-keep"],[2,34,"fist-of-the-first-men"],
    [3,18,"crasters-keep"]],
  "Yoren": [[1,19,"castle-black"],[1,27,"crossroads-inn"],[1,30,"kings-landing"],
    [1,65,"kingsroad-north"],[2,1,"riverlands-road"],[2,16,null]],
  "Janos Slynt": [[1,20,"kings-landing"],[2,9,"castle-black"],[5,9,null]],
  "Qhorin Halfhand": [[2,34,"fist-of-the-first-men"],[2,43,"haunted-forest"],[2,70,null]],
  "Bowen Marsh": [[1,19,"castle-black"]],
  "Cotter Pyke": [[1,19,"eastwatch-by-the-sea"],[5,58,"hardhome"]],
  "Chett": [[2,13,"crasters-keep"],[2,34,"fist-of-the-first-men"],[3,2,null]],
  "Will of the Night's Watch": [[1,1,"haunted-forest"],[1,2,null]],
  "Ser Waymar Royce": [[1,1,"haunted-forest"],[1,2,null]],
  "Gared": [[1,1,"haunted-forest"],[1,2,"winterfell"],[1,3,null]],

  // ---------------- the free folk & the far north ----------------
  "Mance Rayder": [[3,7,"haunted-forest"],[3,76,"castle-black"],[5,17,"winterfell"]],
  "Ygritte": [[2,51,"haunted-forest"],[3,41,"queenscrown"],[3,50,"castle-black"],[3,57,null]],
  "Tormund Giantsbane": [[3,7,"haunted-forest"],[3,76,"the-gift"],[5,58,"castle-black"]],
  "Styr": [[2,51,"haunted-forest"],[3,41,"queenscrown"],[3,56,null]],
  "Orell": [[2,43,"haunted-forest"],[2,69,null]],
  "Rattleshirt": [[2,51,"haunted-forest"],[3,76,"castle-black"],[5,12,null]],
  "Craster": [[2,13,"crasters-keep"],[3,35,null]],
  "Val": [[3,76,"castle-black"],[5,1,"castle-black"]],
  "Wun Wun": [[5,35,"castle-black"]],
  "Varamyr Sixskins": [[3,7,"haunted-forest"],[5,2,null]],
  "The Three-Eyed Raven": [[5,13,"weirwood-cave"]],
  "Leaf": [[5,13,"weirwood-cave"]],

  // ---------------- the brotherhood & the riverlands ----------------
  "Beric Dondarrion": [[1,29,"kings-landing"],[1,43,"riverlands-road"],[3,13,"riverlands-road"],
    [3,83,null]],
  "Thoros of Myr": [[1,29,"kings-landing"],[1,43,"riverlands-road"],[3,13,"riverlands-road"]],
  "Anguy": [[3,13,"riverlands-road"]],
  "Lem Lemoncloak": [[3,13,"riverlands-road"]],
  "Hot Pie": [[1,65,"kingsroad-north"],[2,1,"riverlands-road"],[2,26,"harrenhal"],
    [2,47,"riverlands-road"],[3,17,"crossroads-inn"]],
  "Lommy Greenhands": [[1,65,"kingsroad-north"],[2,1,"riverlands-road"],[2,21,null]],

  // ---------------- the Tullys & the Vale ----------------
  "Hoster Tully": [[1,1,"riverrun"],[3,47,null]],
  "Brynden Tully": [[1,34,"the-eyrie"],[1,60,"the-twins"],[1,63,"riverrun"],[2,1,"riverrun"],
    [3,1,"riverrun"],[4,44,"riverlands-road"]],
  "Edmure Tully": [[1,1,"riverrun"],[3,49,"the-twins"],[4,33,"riverrun"],[4,44,"casterly-rock"]],
  "Lysa Arryn": [[1,1,"the-eyrie"],[3,82,null]],
  "Robin Arryn": [[1,1,"the-eyrie"]],
  "Yohn Royce": [[1,1,"runestone"],[4,10,"the-eyrie"]],
  "Vardis Egen": [[1,1,"the-eyrie"],[1,41,null]],
  "Mya Stone": [[1,34,"the-eyrie"]],

  // ---------------- the Freys ----------------
  "Walder Frey": [[1,60,"the-twins"]],
  "Stevron Frey": [[1,60,"the-twins"],[1,63,"riverrun"],[2,32,"the-crag"],[2,41,null]],
  "Merrett Frey": [[1,60,"the-twins"],[3,81,"riverlands-road"],[3,82,null]],
  "Lothar Frey": [[3,45,"riverrun"],[3,49,"the-twins"]],
  "Black Walder Rivers": [[3,45,"riverrun"],[3,49,"the-twins"]],
  "Olyvar Frey": [[1,60,"the-twins"],[1,63,"riverrun"],[3,14,"riverrun"]],
  "Roslin Frey": [[3,49,"the-twins"]],

  // ---------------- the Boltons & the northern houses ----------------
  "Roose Bolton": [[1,56,"green-fork"],[2,14,"harrenhal"],[3,49,"the-twins"],[3,55,"the-dreadfort"],
    [5,32,"winterfell"]],
  "Ramsay Bolton": [[2,14,"the-dreadfort"],[2,37,"winterfell"],[3,1,"the-dreadfort"],[5,20,"moat-cailin"],
    [5,32,"winterfell"]],
  "Walda Bolton": [[3,49,"the-twins"],[3,55,"the-dreadfort"],[5,32,"winterfell"]],
  "Domeric Bolton": [[1,1,"the-dreadfort"]],
  "Theon Greyjoy": [[1,1,"winterfell"],[1,63,"whispering-wood"],[1,71,"riverrun"],[2,12,"pyke"],
    [2,37,"winterfell"],[3,1,"the-dreadfort"],[5,13,"moat-cailin"],[5,32,"winterfell"],
    [5,62,"wolfswood"]],
  "Rickard Karstark": [[1,60,"the-twins"],[1,63,"whispering-wood"],[1,71,"riverrun"],[2,1,"riverrun"],
    [3,1,"riverrun"],[3,22,null]],
  "Torrhen Karstark": [[1,60,"the-twins"],[1,63,"whispering-wood"],[1,65,null]],

  // ---------------- the Greyjoys ----------------
  "Balon Greyjoy": [[2,12,"pyke"],[4,3,null]],
  "Asha Greyjoy": [[2,12,"pyke"],[2,37,"wolfswood"],[4,12,"pyke"],[4,19,"wolfswood"],[5,20,"wolfswood"]],
  "Euron Greyjoy": [[4,2,"pyke"],[4,19,"oldtown"]],
  "Aeron Greyjoy": [[2,12,"pyke"],[4,2,"pyke"]],

  // ---------------- the Tyrells & the Reach ----------------
  "Olenna Tyrell": [[3,6,"kings-landing"],[4,12,"highgarden"]],
  "Mace Tyrell": [[2,17,"bitterbridge"],[3,6,"kings-landing"]],
  "Margaery Tyrell": [[2,17,"bitterbridge"],[2,31,"storms-end"],[2,45,"highgarden"],
    [3,6,"kings-landing"]],
  "Loras Tyrell": [[1,20,"kings-landing"],[2,17,"bitterbridge"],[2,31,"storms-end"],
    [3,6,"kings-landing"],[4,17,"dragonstone"]],
  "Willas Tyrell": [[1,1,"highgarden"]],
  "Garlan Tyrell": [[1,1,"highgarden"],[2,65,"kings-landing"],[4,17,"brightwater-keep"]],
  "Randyll Tarly": [[2,17,"bitterbridge"],[3,6,"kings-landing"],[4,10,"maidenpool"]],
  "Dickon Tarly": [[1,1,"horn-hill"]],
  "Melessa Tarly": [[1,1,"horn-hill"]],
  "Talla Tarly": [[1,1,"horn-hill"]],
  "Brienne of Tarth": [[2,17,"bitterbridge"],[2,31,"storms-end"],[2,39,"riverrun"],
    [3,1,"riverlands-road"],[3,21,"harrenhal"],[3,62,"kings-landing"],[4,4,"riverlands-road"],
    [4,9,"maidenpool"],[4,37,"crossroads-inn"],[5,48,"riverlands-road"]],

  // ---------------- the Martells & Dorne ----------------
  "Doran Martell": [[1,1,"sunspear"]],
  "Oberyn Martell": [[3,38,"kings-landing"],[3,72,null]],
  "Ellaria Sand": [[3,38,"kings-landing"],[4,2,"sunspear"]],
  "Arianne Martell": [[4,2,"sunspear"]],
  "Trystane Martell": [[1,1,"sunspear"]],
  "Areo Hotah": [[1,1,"sunspear"]],
  "Arys Oakheart": [[1,20,"kings-landing"],[3,1,"sunspear"],[4,23,null]],
  "Obara Sand": [[4,2,"sunspear"]],
  "Nymeria Sand": [[4,2,"sunspear"]],
  "Tyene Sand": [[4,2,"sunspear"]],
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
