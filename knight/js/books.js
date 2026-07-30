/* A KNIGHT OF THE SEVEN KINGDOMS — the three published Tales of Dunk and Egg,
   part by part. The novellas have no numbered chapters, so each is divided here
   into reading "parts" (all from Dunk's point of view); every part belongs to a
   story movement, and selecting any part shows its movement's chronicle in the
   left panel — same format as the show's episodes, but book lore. */

const BOOKS = [

// ==================== THE HEDGE KNIGHT (209 AC) ====================
{ n: 1, name: "The Hedge Knight", short: "THK", chapters: 10, chs: [
["Dunk I", "On a hillside by the roseroad, Dunk digs a grave for Ser Arlan of Pennytree, the old hedge knight he has served since he was a boy of Flea Bottom — and decides to take the old man's arms, his horses, and his trade.", [["Ser Arlan of Pennytree","A chill on a wet road, and a quiet end — after a lifetime of other men's battles."]]],
["Dunk II", "At an inn on the road to Ashford, Dunk's plans meet a bald, sharp-tongued stableboy who washes up in a bucket, minds horses like a lordling's groom, and follows him out the door refusing to be sent home."],
["Dunk III", "Ashford Meadow: a hundred pavilions on the banks of the Cockleswhent. Dunk camps beneath a great elm, meets the Dornish puppeteers and the tall girl Tanselle, and watches her wooden dragon die to a wooden hero's lance."],
["Dunk IV", "Steely Pate takes Dunk's coin for good armor; Tanselle paints his shield — a shooting star above an elm. At the steward's table Dunk learns a hedge knight without a famous name must beg a place in the lists."],
["Dunk V", "The tourney opens: Lord Ashford's two sons, Ser Humfrey Hardyng, Ser Tybolt Lannister, and Prince Valarr hold the field as champions. Prince Baelor remembers an old knight named Arlan who once unhorsed him."],
["Dunk VI", "Ser Humfrey Hardyng unseats Aerion Brightflame fair and clean — and Aerion answers by driving his lance through the neck of Hardyng's horse, leaving the champion crushed and broken-legged beneath the carcass."],
["Dunk VII", "Night. Tanselle's puppet dragon offends the Bright Flame, and he breaks her fingers for it. Dunk hears the scream, knocks a prince of the blood into the dirt — and a hooded stableboy cries out that he is Aegon Targaryen."],
["Dunk VIII", "In his cell Dunk learns the price of striking a dragon: a hand and a foot. Aerion demands a trial of seven. Dunk begs the meadow for champions; Steffon Fossoway sells his promise to the prince, and his cousin Raymun is knighted at dawn to stand in his place."],
["Dunk IX", "The trial of seven, before gods and men: Baelor Breakspear takes up a plain shield to make Dunk's seven. Ser Humfrey Beesbury dies in the press; Aerion yields under Dunk's bare hands — and across the field, Maekar's mace glances off his brother's helm.", [["Ser Humfrey Beesbury","Slain in the trial of seven, standing for a hedge knight's honor."]]],
["Dunk X", "The blow that seemed nothing was everything: Baelor Breakspear dies of a broken skull. Maekar comes to Dunk with a question and an offer, Aerion goes to Lys, and a hedge knight rides for Dorne with a prince polishing his kettle helm.", [["Baelor Breakspear","The Hand of the King, dead of his brother's mace in a hedge knight's quarrel."],["Ser Humfrey Hardyng","Died of his wounds from the trial, unbowed to the last."]]],
], beats: [
  { from: 1, to: 4, title: "The Road to Ashford",
    throne: { king: "Daeron II Targaryen, the Good", house: "targaryen", hand: "Prince Baelor Breakspear" },
    events: [
      "Ser Arlan of Pennytree dies of a chill by the roseroad, and his towering squire buries him — then takes his sword, his shield, and his calling.",
      "At a wayside inn Dunk acquires an ale, a plan, and a bald stableboy named Egg who will not be left behind.",
      "Ashford Meadow spreads before them: pavilions, puppeteers, merchants — and a tourney with the fair maid of Ashford as its queen of love and beauty.",
      "Everything Dunk owns buys armor from Steely Pate; Tanselle's brush gives his shield its arms: elm and shooting star.",
    ],
    people: [
      { name: "Ser Duncan the Tall", loc: "ashford-meadow", note: "\"A hedge knight is the truest kind of knight, Dunk... we serve where we will.\"" },
      { name: "Egg", loc: "ashford-meadow", note: "Minds the horses suspiciously well and dodges every question about home." },
      { name: "Tanselle", loc: "ashford-meadow", note: "Tanselle Too-Tall, who paints dragons on shields and works them on strings." },
      { name: "Steely Pate", loc: "ashford-meadow", note: "The meadow's master armorer — gruff, fair, and good at his work." },
    ],
    power: { targaryen: 10, blackfyre: 2, baratheon: 7, tyrell: 8, lannister: 7, stark: 6, martell: 6, ashford: 4, fossoway: 3, peake: 3 },
    deaths: [
      { name: "Ser Arlan of Pennytree", note: "The old man of Pennytree, gone to whatever field the good knights go to." },
    ] },
  { from: 5, to: 7, title: "The Tourney",
    throne: { king: "Daeron II Targaryen, the Good", house: "targaryen", hand: "Prince Baelor Breakspear" },
    events: [
      "The champions hold the field; the Laughing Storm's bellow rolls over the meadow; Prince Baelor watches everything and says little.",
      "Aerion Brightflame, unhorsed fair by Ser Humfrey Hardyng, kills the champion's horse with a deliberate lance and leaves him broken beneath it.",
      "By torchlight the Bright Flame finds the puppet show, decides a wooden dragon is treason, and breaks Tanselle's fingers.",
      "A hedge knight of no name beats a prince of the blood into the mud — and the stableboy's hood falls back on Aegon Targaryen's shaved head.",
    ],
    people: [
      { name: "Ser Duncan the Tall", loc: "ashford-meadow", note: "His fists remember Flea Bottom even in Steely Pate's good mail." },
      { name: "Egg", loc: "ashford-meadow", note: "\"He was hurting her!\" — and the secret prince is a secret no more." },
      { name: "Aerion Brightflame", loc: "ashford-meadow", note: "Dreams he is a dragon in man's flesh; behaves like something worse." },
      { name: "Ser Humfrey Hardyng", loc: "ashford-meadow", note: "A champion crushed beneath a horse killed out of spite." },
      { name: "Baelor Breakspear", loc: "ashford-meadow", note: "The Hand of the King, watching a hedge knight with growing interest." },
    ],
    power: { targaryen: 10, blackfyre: 2, baratheon: 7, tyrell: 8, lannister: 7, stark: 6, martell: 6, ashford: 5, fossoway: 3, peake: 3 },
    deaths: [] },
  { from: 8, to: 10, title: "The Trial of Seven",
    throne: { king: "Daeron II Targaryen, the Good", house: "targaryen", hand: "Prince Baelor Breakspear" },
    events: [
      "Aerion names the old Andal way: seven against seven. Dunk must find six men willing to bleed for a hedge knight — or lose the hand and foot that touched a prince.",
      "Steffon Fossoway sells his sworn help to Aerion for advancement; the Laughing Storm knights his cousin Raymun at dawn to stand in his stead — the first green apple.",
      "One short at the horn, until Baelor Breakspear takes up a plain shield: 'It seems my helm is dusty.'",
      "Beesbury dies; Hardyng is carried in broken and fights anyway; Aerion yields to Dunk's bare hands — and Maekar's mace finds his brother's helm in the press.",
      "Baelor Breakspear dies of the blow days later. Maekar gives his son to the hedge knight's keeping, and Dunk and Egg take the road to Dorne.",
    ],
    people: [
      { name: "Ser Duncan the Tall", loc: "ashford-meadow", note: "Wins the judgment of the gods and carries the cost forever." },
      { name: "Egg", loc: "ashford-meadow", note: "His word made the trial possible; his father's grief made his future." },
      { name: "Baelor Breakspear", loc: "ashford-meadow", note: "The seventh man — the best man in the realm, on a hedge knight's side." },
      { name: "Prince Maekar Targaryen", loc: "ashford-meadow", note: "His mace, his brother's helm, his life's long shadow." },
      { name: "Raymun Fossoway", loc: "ashford-meadow", note: "Knighted at dawn; settles the family's honor against his own cousin." },
      { name: "Ser Lyonel Baratheon", loc: "ashford-meadow", note: "Laughs his way through the deadliest melee of the age." },
    ],
    power: { targaryen: 8, blackfyre: 3, baratheon: 7, tyrell: 8, lannister: 7, stark: 6, martell: 6, ashford: 4, fossoway: 4, peake: 3 },
    deaths: [
      { name: "Ser Humfrey Beesbury", note: "Slain in the trial of seven, standing for a hedge knight's honor." },
      { name: "Baelor Breakspear", note: "The Hand of the King, dead of his brother's mace — the realm's future with him." },
      { name: "Ser Humfrey Hardyng", note: "Died of his wounds, having demanded his place in the trial broken leg and all." },
    ] },
] },

// ==================== THE SWORN SWORD (211 AC) ====================
{ n: 2, name: "The Sworn Sword", short: "TSS", chapters: 10, chs: [
["Dunk I", "Two years on: Dunk and Egg serve old Ser Eustace Osgrey of Standfast as sworn swords through a drought that has burned the Reach brown. Riding home with the brown-shielded Ser Bennis, they find the Chequy Water dammed — the stream stolen by the Red Widow of Coldmoat."],
["Dunk II", "Standfast: a towerhouse, three fields, a dry wood, and a lord with a thousand years of glories to recount. Ser Eustace tells of the Marshals of the Northmarch, of his dead sons — and of Lady Rohanne Webber, who has buried four husbands and, men whisper, made some of the graves herself."],
["Dunk III", "At the dam, Bennis opens a digger's cheek with his sword — and Standfast braces for Coldmoat's answer. Dunk drills a handful of field hands into something like soldiers, knowing exactly how it will go against real knights."],
["Dunk IV", "Rather than watch smallfolk die for a stream, Dunk rides for Coldmoat to treat with the widow — past the parched ruin of Wat's Wood, past the dam and its diggers, to a moated castle flying the spotted spider."],
["Dunk V", "Coldmoat: Lady Rohanne is small, freckled, red-braided, and nothing like the ogress of the tales; her castellan Ser Lucas Inchfield — the Longinch — is exactly like his. The fat Septon Sefton pours wine and news: the Great Spring Sickness's scars, Dagon Greyjoy reaving the west, Bittersteel across the sea, and Bloodraven's thousand eyes and one."],
["Dunk VI", "The widow's terms want Bennis's blood; Ser Eustace's pride wants his stream. And then the old knight confesses what Dunk half-guessed: at Redgrass Field, the chequy lion flew for the black dragon. Dunk's oath is suddenly a stone in his chest."],
["Dunk VII", "Egg's counsel and a night's hard thinking. Before Dunk can settle his service, the horizon settles it for him: Wat's Wood burns in the dark, the drought's tinder gone up at a stroke — and Ser Eustace names the widow arsonist."],
["Dunk VIII", "The chequy lion rides to war with an army of five. At the Chequy Water the spider's column meets them — knights, crossbows, and the Longinch — and one wrong word from either bank will drown the marches in smallfolk blood."],
["Dunk IX", "Dunk names the quarrel his own: trial by combat, him against the Longinch, in the middle of the disputed stream. Steel in the water; Dunk half-drowned; and at the end Ser Lucas Inchfield floats and Ser Duncan the Tall — barely — does not.", [["Ser Lucas Inchfield","The Longinch, drowned in the Chequy Water on the point of a hedge knight's dagger — a trial the gods judged wet."]]],
["Dunk X", "Dunk wakes at Coldmoat, leeched and alive. Peace is made the old way: Ser Eustace Osgrey weds Lady Rohanne Webber, stream and honor mended in a sept. And the Red Widow pays a hedge knight's fee with a kiss — and keeps a lock of his hair in her book of debts before Dunk and Egg take the road again."],
], beats: [
  { from: 1, to: 3, title: "A Dry Summer",
    throne: { king: "Aerys I Targaryen", house: "targaryen", hand: "Brynden Rivers, Lord Bloodraven" },
    events: [
      "Two years after Ashford: King Daeron and both of Baelor's sons are dead of the Great Spring Sickness; bookish Aerys wears the crown and the sorcerer Bloodraven rules from behind it.",
      "Drought bakes the Reach. Dunk and Egg serve old Ser Eustace Osgrey of Standfast, last of the chequy lions, for bed, board, and a knight's fee.",
      "The Chequy Water runs dry: the Red Widow of Coldmoat has dammed the stream — and Ser Bennis of the Brown Shield opens a digger's cheek to answer it.",
      "Standfast arms its plowmen. Dunk counts real knights on the other side and likes the sum not at all.",
    ],
    people: [
      { name: "Ser Duncan the Tall", loc: "standfast", note: "A sworn sword learns that oaths have weight even when lords are foolish." },
      { name: "Egg", loc: "standfast", note: "Prince Aegon fetches, carries, and bites his tongue — mostly." },
      { name: "Ser Eustace Osgrey", loc: "standfast", note: "A thousand years of lost glories, recited nightly." },
      { name: "Ser Bennis of the Brown Shield", loc: "standfast", note: "Sour, brown, and free with other people's blood." },
      { name: "Lady Rohanne Webber", loc: "coldmoat", note: "Four husbands buried, a castle held, a stream taken." },
    ],
    power: { targaryen: 8, blackfyre: 3, baratheon: 7, tyrell: 8, lannister: 6, stark: 6, martell: 6, osgrey: 1, webber: 3, peake: 3 },
    deaths: [] },
  { from: 4, to: 7, title: "The Red Widow",
    throne: { king: "Aerys I Targaryen", house: "targaryen", hand: "Brynden Rivers, Lord Bloodraven" },
    events: [
      "Dunk rides to Coldmoat to talk instead of bleed, and finds the Red Widow smaller, sharper, and more dangerous than her legend.",
      "Septon Sefton's table-talk maps the age: the Spring Sickness's toll, Dagon Greyjoy loose in the west, Bittersteel biding in Tyrosh, and Bloodraven's whisperers everywhere.",
      "Ser Eustace confesses Redgrass Field: the chequy lion flew with the black dragon, and his sons died for it. Dunk's sworn service turns to stone in his chest.",
      "Wat's Wood burns in the night — the drought's tinder gone at a stroke — and the old knight names Lady Rohanne the arsonist and calls his five-man army to war.",
    ],
    people: [
      { name: "Ser Duncan the Tall", loc: "coldmoat", note: "Learns his lord's true history and keeps his oath anyway — his own way." },
      { name: "Lady Rohanne Webber", loc: "coldmoat", note: "\"I have a septon's list of my crimes. Most of them are even true.\"" },
      { name: "Ser Lucas Inchfield", loc: "coldmoat", note: "The Longinch: tall, cold, and certain a hedge knight ranks below his boot." },
      { name: "Septon Sefton", loc: "coldmoat", note: "Fat, shrewd, and generous with wine and news alike." },
      { name: "Ser Eustace Osgrey", loc: "standfast", note: "The black dragon's old soldier, with nothing left but pride and a stream." },
      { name: "Egg", loc: "standfast", note: "Offers to fix everything with one boot's worth of signet ring. Refused." },
    ],
    power: { targaryen: 8, blackfyre: 3, baratheon: 7, tyrell: 8, lannister: 6, stark: 6, martell: 6, osgrey: 1, webber: 3, peake: 3 },
    deaths: [] },
  { from: 8, to: 10, title: "The Chequy Water",
    throne: { king: "Aerys I Targaryen", house: "targaryen", hand: "Brynden Rivers, Lord Bloodraven" },
    events: [
      "Two armies meet at a stolen stream: five men behind a chequy lion, thirty-three behind a spotted spider — and the marches a spark away from smallfolk slaughter.",
      "Dunk makes the quarrel single combat: himself against the Longinch, in the middle of the disputed water, before the eyes of gods, knights, and diggers.",
      "Steel in the stream: Dunk is cut, battered, and half-drowned — and Ser Lucas Inchfield is dead in the water at the end of it.",
      "Peace the old way: Ser Eustace weds Lady Rohanne, the stream flows to Standfast again — and the Red Widow settles a hedge knight's fee with a kiss and keeps a lock of his hair.",
    ],
    people: [
      { name: "Ser Duncan the Tall", loc: "chequy-water", note: "Wins a trial by combat by refusing to lose it." },
      { name: "Lady Rohanne Webber", loc: "coldmoat", note: "Weds the man she warred with; keeps the debt she owes the other one." },
      { name: "Ser Eustace Osgrey", loc: "coldmoat", note: "The chequy lion ends his last war a bridegroom." },
      { name: "Egg", loc: "chequy-water", note: "Watches his knight nearly drown for a stream and two stubborn old people." },
      { name: "Ser Bennis of the Brown Shield", loc: "standfast", note: "Gone with the wind and Standfast's silver the moment real trouble came." },
    ],
    power: { targaryen: 8, blackfyre: 3, baratheon: 7, tyrell: 8, lannister: 6, stark: 6, martell: 6, osgrey: 2, webber: 3, peake: 3 },
    deaths: [
      { name: "Ser Lucas Inchfield", note: "The Longinch, drowned at the point of a dagger in the stream he came to hold." },
    ] },
] },

// ==================== THE MYSTERY KNIGHT (212 AC) ====================
{ n: 3, name: "The Mystery Knight", short: "TMK", chapters: 12, chs: [
["Dunk I", "Near Stoney Sept, Dunk and Egg pass gibbets heavy with hanged men — Lord Wyl's brigands, taken by the king's men. The realm is uneasy: Bloodraven hunts traitors, and rumor says the black dragon stirs. Dunk turns their road north, meaning to winter at Winterfell."],
["Dunk II", "On the kingsroad they fall in with a wedding party bound for Whitewalls: sour Lord Gormon Peake, amiable Ser Alyn Cockshaw, and the golden Ser John the Fiddler, who laughs easily, jousts brilliantly, and says he has dreamed of Dunk before."],
["Dunk III", "Whitewalls, the Milkhouse: Lord Butterwell weds a Frey of the Crossing, and every lord who ever drank to the black dragon is under one marble roof. The wedding gift that stops the hall: a dragon's egg, promised to the tourney's champion."],
["Dunk IV", "The bedding and the after-feast: Dunk drinks with the shrewd Ser Maynard Plumm, ducks Ser Alyn's strange hostility, and hears the Fiddler talk of dreams — a dragon hatching at Whitewalls, and Dunk in white armor with a white cloak."],
["Dunk V", "The tourney opens with the lists full of old Blackfyre men. Ser Glendon Ball — the Knight of the Pussywillows, Fireball's angry son — unhorses all comers; Dunk falls to the craft of Ser Uthor Underleaf, the Snail, and wakes with a dented head and a ransom owed."],
["Dunk VI", "The Snail proves a tradesman of the tilt: he shows Dunk how the fall was made and offers to buy his services. Egg moves among the squires, hearing what boys hear — and Lord Peake watches everything with a hungry eye."],
["Dunk VII", "The dragon's egg vanishes from Lord Butterwell's bedchamber in the night. The drawbridge comes up, the castle is sealed — and Ser Glendon Ball, whose father shattered the red dragon's van at Redgrass, is seized for the theft on no evidence but his blood."],
["Dunk VIII", "Ser Alyn Cockshaw draws Dunk aside to a quiet well — and pays bravos' wages for it. Ser Maynard Plumm proves quicker: Alyn goes down the well, and Plumm shows Dunk that he knows exactly who Egg is, and minds not at all.", [["Ser Alyn Cockshaw","Went to murder a hedge knight by a quiet well; went down it instead, on Maynard Plumm's steel."]]],
["Dunk IX", "The Fiddler unmasked: Ser John is Daemon the Second of House Blackfyre, come for a hatching and a crown. He offers Dunk a place at his side — a white cloak from a black king — and Dunk sees the whole wedding for the treason it is."],
["Dunk X", "Egg's boot yields Maekar's signet; Dunk spends its weight to buy Ser Glendon a knight's chance: trial by joust against the black dragon himself, the egg-theft charge to stand or fall with the tilt."],
["Dunk XI", "Fireball's son unhorses Daemon Blackfyre in one course — and the dawn shows Bloodraven's army ringed round Whitewalls. At the gates Black Tom Heddle bars Dunk's way with steel, and dies of it.", [["Black Tom Heddle","Lord Butterwell's grim good-son, cut down by Dunk at the gates of Whitewalls with treason still on his sword."]]],
["Dunk XII", "The net closes without a battle: Daemon taken, the wedding lords bled white with fines, Whitewalls forfeit — to be pulled down stone by stone. Bloodraven, a thousand eyes and one, lets a certain hedge knight and his squire ride free — with a nod that says he knows everything."],
], beats: [
  { from: 1, to: 4, title: "The Road to the Wedding",
    throne: { king: "Aerys I Targaryen", house: "targaryen", hand: "Brynden Rivers, Lord Bloodraven" },
    events: [
      "Gibbets by Stoney Sept: Bloodraven's justice hangs where all can see it, and rumor says the black dragon stirs across the sea.",
      "Dunk and Egg fall in with lords bound for Lord Butterwell's wedding at Whitewalls — Gormon Peake, Alyn Cockshaw, and the golden, laughing Ser John the Fiddler.",
      "The Milkhouse gleams over the Gods Eye, packed with every lord who ever drank to Daemon Blackfyre's memory.",
      "A dragon's egg is promised to the tourney champion, and the Fiddler tells Dunk of dreams: a dragon hatching at Whitewalls, and Dunk in a white cloak.",
    ],
    people: [
      { name: "Ser Duncan the Tall", loc: "gods-eye-road", note: "Smells the wrongness of the wedding long before he can name it." },
      { name: "Egg", loc: "gods-eye-road", note: "Recognizes the guest list for what it is: Redgrass Field's losing side." },
      { name: "John the Fiddler", loc: "whitewalls", note: "Golden, charming, and very sure the future has him in it." },
      { name: "Lord Gormon Peake", loc: "whitewalls", note: "Three castles on his banner, one in his hand, and a crown in his plans." },
      { name: "Lord Ambrose Butterwell", loc: "whitewalls", note: "A bridegroom sweating through his own wedding." },
    ],
    power: { targaryen: 8, blackfyre: 4, baratheon: 7, tyrell: 8, lannister: 6, stark: 6, martell: 6, butterwell: 4, peake: 4, tully: 5 },
    deaths: [] },
  { from: 5, to: 8, title: "The Mystery Knight",
    throne: { king: "Aerys I Targaryen", house: "targaryen", hand: "Brynden Rivers, Lord Bloodraven" },
    events: [
      "The wedding tourney opens: Ser Glendon Ball, Fireball's furious son, unhorses all comers, while Dunk falls to the Snail's craft and a ransom he cannot pay.",
      "Ser Maynard Plumm drifts through the feast knowing more than any hedge knight should — including whose head is under Egg's hood.",
      "The dragon's egg vanishes in the night; the castle is sealed; and Glendon Ball is seized for the theft on no evidence but his father's name.",
      "Ser Alyn Cockshaw lures Dunk to a quiet well with hired steel — and goes down it himself, with Plumm's blade to help him.",
    ],
    people: [
      { name: "Ser Duncan the Tall", loc: "whitewalls", note: "Unhorsed, half-drowned in debt, and still the only honest man in the castle." },
      { name: "Ser Glendon Ball", loc: "whitewalls", note: "The Knight of the Pussywillows: Fireball's blood, and prouder of it than any lord." },
      { name: "Ser Uthor Underleaf", loc: "whitewalls", note: "The Snail: jousting is his trade, and business is good." },
      { name: "Ser Maynard Plumm", loc: "whitewalls", note: "Sees through hoods, walls, and plots — almost as if he had a thousand eyes." },
      { name: "Egg", loc: "whitewalls", note: "A prince among squires, counting traitors." },
    ],
    power: { targaryen: 8, blackfyre: 5, baratheon: 7, tyrell: 8, lannister: 6, stark: 6, martell: 6, butterwell: 4, peake: 4, tully: 5 },
    deaths: [
      { name: "Ser Alyn Cockshaw", note: "Went to murder a hedge knight by a quiet well; went down it instead." },
    ] },
  { from: 9, to: 12, title: "The Black Dragon and the White",
    throne: { king: "Aerys I Targaryen", house: "targaryen", hand: "Brynden Rivers, Lord Bloodraven" },
    events: [
      "The Fiddler unmasked: Daemon the Second of House Blackfyre, come to hatch a dragon and a rebellion in the same marble hall.",
      "Egg's boot yields Maekar's signet ring, and Dunk spends its weight to buy Glendon Ball a knight's answer: trial by joust against the pretender himself.",
      "Fireball's son puts the black dragon in the dirt in a single course — and dawn shows Bloodraven's host ringed around Whitewalls.",
      "The Second Blackfyre Rebellion ends without a battle: Daemon taken, the wedding lords fined to the bone, Black Tom Heddle dead on Dunk's sword, and Whitewalls condemned to come down stone by stone.",
    ],
    people: [
      { name: "Ser Duncan the Tall", loc: "whitewalls", note: "Foils a rebellion with a signet ring, a stubborn streak, and one honest joust." },
      { name: "Egg", loc: "whitewalls", note: "His father's ring, spent exactly the way a prince should spend it." },
      { name: "Daemon II Blackfyre", loc: "whitewalls", note: "Dreamed a dragon would hatch at Whitewalls. It didn't." },
      { name: "Ser Glendon Ball", loc: "whitewalls", note: "Cleared the only way that counts: with a lance, fairly, in front of everyone." },
      { name: "Brynden Rivers", loc: "whitewalls", note: "Bloodraven: a thousand eyes, one, and an army that was never far away." },
      { name: "Lord Gormon Peake", loc: "whitewalls", note: "His third rebellion for the black dragon is his last as a free man." },
    ],
    power: { targaryen: 9, blackfyre: 2, baratheon: 7, tyrell: 8, lannister: 6, stark: 6, martell: 6, butterwell: 1, peake: 1, tully: 5 },
    deaths: [
      { name: "Black Tom Heddle", note: "Butterwell's grim good-son, cut down by Dunk at the gates with treason on his sword." },
    ] },
] },
];

/* POV label -> character display name (for faces + character cards).
   Every published Dunk & Egg part is told from Dunk's point of view. */
const POV_CHARS = {
  "Dunk": "Ser Duncan the Tall",
};
function povCharacter(label) {
  const parts = label.split(String.fromCharCode(183)); const name = parts.length > 1 ? parts[1].trim() : label.split(" ")[0];
  return POV_CHARS[name] || name;
}
