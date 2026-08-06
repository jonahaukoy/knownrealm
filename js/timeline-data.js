/* THE TIMELINE OF THE KNOWN WORLD — the whole chronology in one scrubbable line,
   from the Dawn Age to the breaking of the wheel.

   Era:   { id, name, note }
   Event: { id, era, when, y, title, text,
            saga: "lore" | "got" | "hotd" | "knight",
            s?: season, b?: book,   — the spoiler anchor: this moment is safe once a
                                      reader has come that far in that saga's telling
            show?, book?,           — how each telling marks it, for display
            wiki? }                 — its own article in the wiki. Every moment now has
                                      one (js/moments/*.js + js/col/moments.js); before
                                      that these pointed at whatever page was nearest,
                                      which meant category indexes, another saga's wiki
                                      root, and one id that did not exist at all.

   Ordering is by array position, not by year: eight thousand years of legend and
   eight seasons of war cannot share a linear axis without crushing one of them.
   Dates are given as the maesters give them — AC counts from Aegon's Conquest. */

/* Each era now carries the YEARS it spans, so the chronicle's bar can write the
   age's name across its own stretch of the ruler. `short` is what fits when the
   stretch is narrow; the eras tile the whole axis end to end with no gaps. */
window.TIMELINE_ERAS = [
  { id: "dawn",     from: -12000, to: -6001, short: "Dawn Age",
    name: "The Dawn Age & the Age of Heroes", note: "Before history was written down, when the children still held the woods." },
  { id: "kingdoms", from: -6000, to: -3, short: "Kingdoms of Old",
    name: "The Seven Kingdoms of Old",        note: "Andals, Rhoynar, and the long centuries before the dragons came." },
  { id: "conquest", from: -2, to: 128, short: "Dragon Kings",
    name: "Aegon's Conquest & the Dragon Kings", note: "One king, one throne, and three hundred years of Targaryen rule." },
  { id: "dance",    from: 129, to: 136, short: "The Dance",
    name: "The Dance of the Dragons",         note: "Greens against blacks — the war that killed the dragons." },
  { id: "hedge",    from: 137, to: 259, short: "Blackfyre",
    name: "Blackfyre & the Hedge Knight's Road", note: "Pretenders, tourneys, and a big man with a small squire." },
  { id: "rebellion",from: 260, to: 289, short: "Fall of Dragons",
    name: "The Fall of the Dragons",          note: "Summerhall to the Trident: how the Targaryens lost the realm." },
  { id: "saga",     from: 290, to: 306, short: "Game of Thrones",
    name: "The Game of Thrones",              note: "From a dead Hand to a broken wheel." },
];

window.TIMELINE = [

  /* ================= The Dawn Age & the Age of Heroes ================= */
  {
    id: "dawn-children", era: "dawn", saga: "lore", y: -12000,
    when: "Some twelve thousand years before the Conquest",
    title: "The Dawn Age — the children of the forest",
    text: "Before men, Westeros belonged to the children of the forest: a small, dark-eyed people who carved faces into the weirwoods and sang a song of earth. They kept no cities and wrote no books, and everything we think we know of them comes to us through thousands of years of retelling — which is to say, through the mouths of the people who later took their land.",
    wiki: "wiki.html#moment=dawn-children",
  },
  {
    id: "dawn-firstmen", era: "dawn", saga: "lore", y: -12000,
    when: "c. 12,000 years before the Conquest",
    title: "The First Men cross the Arm of Dorne",
    text: "Men came east to west over a land bridge, carrying bronze blades and leather shields, and began cutting down the weirwoods as they went. The children answered with what the songs call the Hammer of the Waters, shattering the Arm and drowning the bridge — the first time in these histories that someone breaks the world to win a war, and not the last.",
    wiki: "wiki.html#moment=dawn-firstmen",
  },
  {
    id: "dawn-pact", era: "dawn", saga: "lore", y: -10000,
    when: "c. 10,000 years before the Conquest",
    title: "The Pact of the Isle of Faces",
    text: "After centuries of killing, the two peoples met on an island in the middle of a lake and agreed to share the country: the open land to men, the deep woods to the children, and every weirwood given a face so the old gods could watch the bargain hold. The Age of Heroes begins here — four thousand years of legend the maesters cannot verify and the northmen will not doubt.",
    wiki: "wiki.html#moment=dawn-pact",
  },
  {
    id: "dawn-longnight", era: "dawn", saga: "lore", y: -8000,
    when: "c. 8,000 years before the Conquest",
    title: "The Long Night",
    text: "A winter came that did not end. For a generation the sun did not rise, crops died, and out of the cold came the Others — pale things with eyes like blue stars, raising the dead to walk behind them. The stories agree that mankind nearly ended and disagree about everything else, including how it stopped: a Last Hero with a dragonsteel blade, a battle for the dawn, and something that has been half-forgotten ever since.",
    wiki: "wiki.html#moment=dawn-longnight",
  },
  {
    id: "dawn-wall", era: "dawn", saga: "lore", y: -7980,
    when: "In the Long Night's wake",
    title: "The Wall is raised, and the Watch takes its vow",
    text: "Bran the Builder — the same name the songs attach to Winterfell and to Storm's End, which should tell you how much weight it can carry — is said to have raised seven hundred feet of ice across the neck of the continent, and the Night's Watch was founded to hold it. The order kept the vow for eight thousand years, long after the realm stopped believing there was anything to keep it against.",
    wiki: "wiki.html#moment=dawn-wall",
  },
  {
    id: "dawn-nightsking", era: "dawn", saga: "lore", y: -7900,
    when: "Some generations after the Wall",
    title: "The Night's King",
    text: "The thirteenth Lord Commander is said to have taken a woman with skin like the moon and eyes like blue stars, given her his seed and his soul, and ruled the Nightfort as a king for thirteen years, until a Stark of Winterfell and a King-beyond-the-Wall threw him down together. His name was struck from every record — which is why the story survives only as a story.",
    wiki: "wiki.html#moment=dawn-nightsking",
  },
  {
    id: "dawn-andals", era: "kingdoms", saga: "lore", y: -6000,
    when: "Between six and four thousand years before the Conquest",
    title: "The Andals cross the narrow sea",
    text: "They came in waves with iron weapons, seven-pointed stars carved into their flesh, and a new faith that had no use for trees with faces. Kingdom by kingdom the First Men were beaten, married, or converted, until only the North — behind its neck of swamp and its stubbornness — still kept the old gods. Nearly every noble house south of the Neck counts Andal blood from here.",
    wiki: "wiki.html#moment=dawn-andals",
  },

  /* ================= The Seven Kingdoms of Old ================= */
  {
    id: "kd-nymeria", era: "kingdoms", saga: "lore", y: -700,
    when: "c. 700 years before the Conquest",
    title: "Nymeria burns her ships",
    text: "Driven out of the Rhoyne by Valyrian dragons, the warrior queen Nymeria brought ten thousand ships to Dorne, married Lord Mors Martell, and burned the fleet on the shore so no one could speak of going back. Dorne has been a different country ever since — Rhoynish in blood and law, which is why a daughter there inherits ahead of no one's younger brother.",
    wiki: "wiki.html#moment=kd-nymeria",
  },
  {
    /* The Citadel dates the Doom to 102 BC — "about a century" before the
       Conquest — though the figure varies by which maester you ask. */
    id: "kd-doom", era: "kingdoms", saga: "lore", y: -102,
    when: "102 BC — a century before the Conquest",
    title: "The Doom of Valyria",
    text: "In a single night the Freehold that had ruled half the world was unmade: the Fourteen Flames burst, the peninsula shattered, and every dragonlord within reach died with their dragons. What caused it, no one living knows. House Targaryen survived only because twelve years earlier a girl named Daenys had dreamed the ending and her father had been strange enough to believe her, and moved the family to a rock called Dragonstone.",
    wiki: "wiki.html#moment=kd-doom",
  },

  /* ================= Aegon's Conquest & the dragon kings ================= */
  {
    id: "cq-landing", era: "conquest", saga: "lore", y: -2,
    when: "2 years before the Conquest's end",
    title: "Aegon lands at the mouth of the Blackwater",
    text: "Aegon Targaryen came ashore with his two sisters, three dragons, and an army small enough to be a joke, and raised a wooden motte on a hill where a city would grow. He had a map of Westeros as one kingdom and no legal claim to any of it — which turned out to matter less than Balerion did.",
    wiki: "wiki.html#moment=cq-landing",
  },
  {
    id: "cq-harrenhal", era: "conquest", saga: "lore", y: -1,
    when: "1 year before the Conquest's end",
    title: "Harrenhal burns",
    text: "Harren the Black had spent forty years building the largest castle in Westeros, finishing it the very day Aegon landed, and he trusted his walls. Balerion went over them. The stone ran like candle wax with the Hoares still inside, and every lord in the riverlands promptly discovered they had always hated Harren. The ruin has been considered cursed by everyone who has held it since.",
    wiki: "wiki.html#moment=cq-harrenhal",
  },
  {
    id: "cq-fieldoffire", era: "conquest", saga: "lore", y: -1,
    when: "1 year before the Conquest's end",
    title: "The Field of Fire",
    text: "The Gardener king of the Reach and the Lannister king of the Rock brought fifty-five thousand men against Aegon's ten. All three dragons flew that day. Four thousand men burned, House Gardener ended entirely, and Ser Harlan Tyrell — the Gardeners' steward — knelt and was handed Highgarden for it, which is the whole answer to why the Tyrells rule the Reach.",
    wiki: "wiki.html#moment=cq-fieldoffire",
  },
  {
    id: "cq-throne", era: "conquest", saga: "lore", y: 1,
    when: "Year 1 AC",
    title: "The Iron Throne is forged, and the count begins",
    text: "Aegon had the swords of his beaten enemies heaped and melted by dragonflame into a chair deliberately uncomfortable to sit in — a king should never be at ease, he said. Anointed by the High Septon at Oldtown, he became the first king of the Seven Kingdoms, and the maesters began counting years from his crowning. Dorne, notably, was not conquered; it simply refused, for two centuries.",
    wiki: "wiki.html#moment=cq-throne",
  },
  {
    id: "cq-jaehaerys", era: "conquest", saga: "lore", y: 48,
    when: "48–103 AC",
    title: "Jaehaerys the Conciliator and the long peace",
    text: "After Maegor the Cruel's short and appalling reign, Jaehaerys I and his queen Alysanne gave the realm fifty-five years of peace — roads, laws, an end to the Faith's war on the crown, and more surviving children than any Targaryen before or since. The dynasty's high-water mark, and the reason the Great Council of 101 AC could settle a succession by debate rather than by dragon.",
    wiki: "wiki.html#moment=cq-jaehaerys",
  },
  {
    id: "cq-viserys", era: "conquest", saga: "hotd", s: 1, y: 103,
    when: "103–129 AC", show: "House of the Dragon",
    title: "Viserys I, and the question of who comes after",
    text: "A kind, weak, well-meaning king inherits a realm at peace and spends his reign avoiding the only decision that matters. He names his daughter Rhaenyra his heir and has the lords swear to her; then he takes a second wife, Alicent Hightower, and has sons. Everyone swears again and quietly makes other plans. Every drop of blood in the Dance is spilled out of this one unresolved sentence.",
    wiki: "wiki.html#moment=cq-viserys",
  },

  /* ================= The Dance of the Dragons ================= */
  {
    id: "dance-break", era: "dance", saga: "hotd", s: 1, b: 1, y: 129,
    when: "129 AC", show: "House of the Dragon, S1", book: "Fire & Blood",
    title: "The king dies and both sides crown themselves",
    text: "Viserys dies in his bed; before the body is cold the greens crown Aegon II in the Dragonpit, and on Dragonstone the blacks crown Rhaenyra. Two monarchs, two courts, one throne, and — for the first and last time in Westerosi history — dragons on both sides of a civil war. The maesters name it the Dance, which is a very pretty word for what follows.",
    wiki: "wiki.html#moment=dance-break",
  },
  {
    id: "dance-rooksrest", era: "dance", saga: "hotd", s: 1, b: 1, y: 129,
    when: "129 AC", show: "House of the Dragon, S1",
    title: "Rook's Rest — dragon against dragon",
    text: "The war's first great lesson, taught over a modest Crownlands castle: a dragon can be killed, and the thing most likely to kill it is another dragon. Both sides learn that their ultimate weapon is not invulnerable, and neither of them draws the sensible conclusion.",
    wiki: "wiki.html#moment=dance-rooksrest",
  },
  {
    id: "dance-godseye", era: "dance", saga: "hotd", s: 2, b: 1, y: 130,
    when: "130 AC", show: "House of the Dragon, S2", book: "Fire & Blood",
    title: "The Battle Above the Gods Eye",
    text: "Aemond Targaryen on Vhagar — the oldest, largest dragon left in the world — against Daemon Targaryen on Caraxes, over a lake at the heart of the realm. Both dragons and both riders are lost together. It is the single most costly exchange of the war and settles nothing at all.",
    wiki: "wiki.html#moment=dance-godseye",
  },
  {
    id: "dance-dragonpit", era: "dance", saga: "hotd", s: 2, b: 1, y: 130,
    when: "130 AC", book: "Fire & Blood",
    title: "The Storming of the Dragonpit",
    text: "Starving and furious, the smallfolk of King's Landing storm the great domed pit and kill the chained dragons inside with spears, hooks and their bare hands, dying in their hundreds to do it. The mob understands something the lords have missed all war: the dragons were never gods, only very large animals — and there were fewer of them every month.",
    wiki: "wiki.html#moment=dance-dragonpit",
  },
  {
    id: "dance-end", era: "dance", saga: "hotd", s: 2, b: 1, y: 131,
    when: "130–131 AC", book: "Fire & Blood",
    title: "The Dance ends, and the dragons end with it",
    text: "Rhaenyra is destroyed by her half-brother in the cruellest way the war could arrange, and Aegon II outlives her by months before he is poisoned. The throne passes to a traumatised boy, Aegon III, who will be remembered as the Dragonbane: within twenty years the last of the dragons is a stunted, sickly thing that dies in the Red Keep, and the Targaryens are simply a family with silver hair.",
    wiki: "wiki.html#moment=dance-end",
  },

  /* ================= Blackfyre & the hedge knight's road ================= */
  {
    id: "hk-daeron", era: "hedge", saga: "lore", y: 157,
    when: "157–161 AC",
    title: "The Young Dragon takes Dorne — briefly",
    text: "Daeron I conquered Dorne at fourteen with strategy instead of dragons, wrote a book about it, and lost it again to rebellion within four years, along with his own life and some fifty thousand men. Dorne would be joined to the realm only two reigns later, by the far duller method of a marriage.",
    wiki: "wiki.html#moment=hk-daeron",
  },
  {
    id: "hk-unworthy", era: "hedge", saga: "lore", y: 184,
    when: "184 AC",
    title: "Aegon the Unworthy legitimizes his bastards",
    text: "Dying, bloated and spiteful, Aegon IV signed a decree legitimizing every natural child he had ever fathered — an act one maester called the single most destructive thing any Targaryen ever did with a pen. Chief among them was Daemon Blackfyre, given the ancestral Valyrian sword of the kings. Five rebellions grew out of that afternoon.",
    wiki: "wiki.html#moment=hk-unworthy",
  },
  {
    id: "hk-redgrass", era: "hedge", saga: "knight", b: 1, y: 196,
    when: "196 AC", book: "The Dunk & Egg tales",
    title: "The Redgrass Field — the First Blackfyre Rebellion",
    text: "Daemon Blackfyre rose against his half-brother Daeron II and very nearly won. It ended on a field of red grass with Daemon and his twin sons shot down by Bloodraven's archers, and Bittersteel carrying the black dragon banner into exile across the narrow sea. The realm's next three generations are shaped by men who were either there or wish they had been.",
    wiki: "wiki.html#moment=hk-redgrass",
  },
  {
    id: "hk-ashford", era: "hedge", saga: "knight", s: 1, b: 1, y: 209,
    when: "209 AC", show: "A Knight of the Seven Kingdoms, S1", book: "The Hedge Knight",
    title: "The tourney at Ashford Meadow",
    text: "A hedge knight of enormous size and no particular breeding buries his old master, calls himself Ser Duncan the Tall, and rides for a tourney with a boy named Egg holding his horse. What follows — a broken puppeteer's hand, an accusation against a prince, and a trial of seven — is the beginning of the friendship that quietly determines the shape of the next century.",
    wiki: "wiki.html#moment=hk-ashford",
  },
  {
    id: "hk-sworn", era: "hedge", saga: "knight", s: 1, b: 2, y: 211,
    when: "211 AC", book: "The Sworn Sword",
    title: "A dry stream, and the Red Widow",
    text: "Dunk and Egg take service with a poor old knight in a drought, and find themselves in a small, bitter, entirely typical dispute between neighbours over a dammed stream — the kind of quarrel that never reaches a song, and the kind that fills most of a realm's actual history.",
    wiki: "wiki.html#moment=hk-sworn",
  },
  {
    id: "hk-whitewalls", era: "hedge", saga: "knight", s: 1, b: 3, y: 212,
    when: "212 AC", book: "The Mystery Knight",
    title: "The wedding at Whitewalls",
    text: "What looks like a tourney for a dragon's egg is in fact the seed of a second Blackfyre rising, and Dunk and Egg walk into the middle of it. The plot is unpicked before it can bloom, largely by the man nobody sees doing it — but it is a near thing, and it teaches Egg exactly how a realm is lost.",
    wiki: "wiki.html#moment=hk-whitewalls",
  },
  {
    id: "hk-summerhall", era: "hedge", saga: "lore", y: 259,
    when: "259 AC",
    title: "Summerhall",
    text: "Aegon V — the boy who held Dunk's horse, now an old king who never stopped trying to help the smallfolk — attempted something at Summerhall involving wildfire, seven eggs, and a desperate hope of waking dragons again. The pleasure palace burned with the king, his heir, and Ser Duncan the Tall inside it. Rhaegar Targaryen was born that same night, and was said to have been sad ever after.",
    wiki: "wiki.html#moment=hk-summerhall",
  },

  /* ================= The fall of the dragons ================= */
  {
    id: "rb-duskendale", era: "rebellion", saga: "lore", y: 277,
    when: "277 AC",
    title: "The Defiance of Duskendale",
    text: "Lord Denys Darklyn seized King Aerys II inside his own town walls and held him for half a year. Barristan Selmy went over the wall alone and brought the king out; House Darklyn was extinguished root and branch. Aerys went in eccentric and came out something else — the Mad King's reign is usually dated from this half-year in a cell.",
    wiki: "wiki.html#moment=rb-duskendale",
  },
  {
    id: "rb-harrenhal", era: "rebellion", saga: "lore", y: 281,
    when: "281 AC",
    title: "The tourney at Harrenhal",
    text: "The greatest tourney in living memory, at the cursed castle, attended by nearly everyone whose choices would matter. Rhaegar Targaryen won it — and then rode past his own wife to lay the crown of winter roses in the lap of Lyanna Stark, who was betrothed to Robert Baratheon. Men who were there say the silence lasted a very long time.",
    wiki: "wiki.html#moment=rb-harrenhal",
  },
  {
    id: "rb-war", era: "rebellion", saga: "lore", y: 282,
    when: "282 AC",
    title: "Rhaegar and Lyanna, and the war that follows",
    text: "Lyanna Stark went south with Rhaegar — carried off, or gone willingly, depending entirely on who is telling it. Her brother Brandon rode to King's Landing demanding satisfaction and was murdered with his father Rickard by a king who had stopped pretending to be sane. When Aerys demanded Ned Stark's and Robert Baratheon's heads too, half the realm rose.",
    wiki: "wiki.html#moment=rb-war",
  },
  {
    id: "rb-trident", era: "rebellion", saga: "lore", y: 283,
    when: "283 AC",
    title: "The Battle of the Trident",
    text: "Robert Baratheon and Rhaegar Targaryen met in the ford with the war resting on it, and Robert's warhammer ended three centuries of dragon kings by caving in a breastplate of rubies. The rubies washed downstream for years. Whatever Rhaegar had been trying to do — and there is real evidence he thought he was saving the world — died in the water with him.",
    wiki: "wiki.html#moment=rb-trident",
  },
  {
    id: "rb-sack", era: "rebellion", saga: "lore", y: 283,
    when: "283 AC",
    title: "The Sack of King's Landing",
    text: "Tywin Lannister arrived at the gates professing loyalty, was let in, and sacked the city. Aerys ordered his pyromancers to burn all half a million people in it rather than yield, and his own Kingsguard, Jaime Lannister, put a sword through his back — earning a name he will carry for the rest of his life from people who never asked what the alternative was.",
    wiki: "wiki.html#moment=rb-sack",
  },
  {
    id: "rb-throne", era: "rebellion", saga: "lore", y: 283,
    when: "283 AC",
    title: "Robert takes the throne, and a Stark rides south",
    text: "Robert Baratheon is crowned; Ned Stark rides on to the Dornish marches to find his sister, and comes home with her bones, a silence he keeps for fifteen years, and a boy he calls his bastard. The realm settles into seventeen years of an uneasy peace, held together by a Hand named Jon Arryn and by everyone agreeing not to say certain things out loud.",
    wiki: "wiki.html#moment=rb-throne",
  },
  {
    id: "rb-greyjoy", era: "rebellion", saga: "lore", y: 289,
    when: "289 AC",
    title: "The Greyjoy Rebellion",
    text: "Balon Greyjoy crowned himself King of the Iron Islands and was put down in a season. His last living son, Theon, was taken to Winterfell as a ward — which is a polite word for a hostage raised as a brother, and an arrangement that works perfectly right up until the moment it doesn't.",
    wiki: "wiki.html#moment=rb-greyjoy",
  },

  /* ================= The Game of Thrones ================= */
  {
    id: "gt-hand", era: "saga", saga: "got", s: 1, b: 1, y: 298,
    when: "298 AC", show: "S1 · E1", book: "AGOT, ch. 1",
    title: "A dead Hand, and a king rides north",
    text: "Jon Arryn dies in King's Landing and Robert rides to Winterfell to ask his oldest friend to replace him. Ned Stark takes a job he does not want, in a city that will kill him, because the alternative is refusing a king. In the same weeks a ranging beyond the Wall meets something that should not exist, and nobody who matters hears about it.",
    wiki: "wiki.html#moment=gt-hand",
  },
  {
    id: "gt-bran", era: "saga", saga: "got", s: 1, b: 1, y: 298,
    when: "298 AC", show: "S1 · E1", book: "AGOT, ch. 8",
    title: "A boy climbs, and is pushed",
    text: "Bran Stark sees what he should not have seen in a tower at Winterfell and is thrown from the window for it. He lives, which surprises everyone, and the attempt to finish the job puts a Valyrian dagger in Catelyn Stark's hands and sets the Starks and Lannisters at each other's throats.",
    wiki: "wiki.html#moment=gt-bran",
  },
  {
    id: "gt-drogo", era: "saga", saga: "got", s: 1, b: 1, y: 298,
    when: "298 AC", show: "S1 · E1", book: "AGOT, ch. 3",
    title: "A girl is sold across the narrow sea",
    text: "Viserys Targaryen trades his sister Daenerys to Khal Drogo for an army. What he buys instead — over a year of grass, cruelty, and unexpected love — is her: a frightened thirteen-year-old who discovers she is not frightened of fire, and who will outlive him by rather a lot.",
    wiki: "wiki.html#moment=gt-drogo",
  },
  {
    id: "gt-ned", era: "saga", saga: "got", s: 1, b: 1, y: 298,
    when: "298 AC", show: "S1 · E9", book: "AGOT, ch. 65",
    title: "The king's justice, on the steps of Baelor's sept",
    text: "Ned Stark works out the truth about Cersei's children, gives her the chance to run out of decency, and is betrayed for it. He confesses to treason to save his daughters — and a boy king kills him anyway. The story announces here, unmistakably, what kind of story it intends to be.",
    wiki: "wiki.html#moment=gt-ned",
  },
  {
    id: "gt-dragons", era: "saga", saga: "got", s: 1, b: 1, y: 298,
    when: "298 AC", show: "S1 · E10", book: "AGOT, ch. 72",
    title: "Fire and blood — three dragons wake",
    text: "Daenerys walks into her husband's pyre with three fossil eggs and comes out at dawn unburnt, with three living dragons on her. Magic, which the maesters had comfortably declared dead, returns to the world on the same night the last dragonlord's daughter has nothing left to lose.",
    wiki: "wiki.html#moment=gt-dragons",
  },
  {
    id: "gt-five-kings", era: "saga", saga: "got", s: 2, b: 2, y: 299,
    when: "299 AC", show: "S2", book: "A Clash of Kings",
    title: "The War of the Five Kings",
    text: "Robb Stark is crowned King in the North, Renly and Stannis Baratheon both claim their brother's throne, Balon Greyjoy claims the sea, and Joffrey holds the chair itself. A red comet hangs over all of it. Every one of them has a decent legal argument and an army, which is precisely the problem.",
    wiki: "wiki.html#moment=gt-five-kings",
  },
  {
    id: "gt-blackwater", era: "saga", saga: "got", s: 2, b: 2, y: 299,
    when: "299 AC", show: "S2 · E9", book: "ACOK, ch. 59",
    title: "The Blackwater burns green",
    text: "Stannis brings the largest fleet in the realm up the Blackwater Rush and Tyrion Lannister meets it with a single chain and a great deal of wildfire. The river burns, thousands die in it, and Tywin arrives with the Tyrells at the last moment to take the credit — and to make quite sure his son receives none of it.",
    wiki: "wiki.html#moment=gt-blackwater",
  },
  {
    id: "gt-redwedding", era: "saga", saga: "got", s: 3, b: 3, y: 299,
    when: "299 AC", show: "S3 · E9", book: "ASOS, ch. 51",
    title: "The Red Wedding",
    text: "Robb Stark broke a marriage oath to Walder Frey, and Walder Frey — with Roose Bolton's knife and Tywin Lannister's blessing — collected. Guest right is violated at the Twins and the King in the North, his mother, his wife and his army die between courses. The North does not forget it, and neither does anyone else.",
    wiki: "wiki.html#moment=gt-redwedding",
  },
  {
    id: "gt-purple", era: "saga", saga: "got", s: 4, b: 3, y: 300,
    when: "300 AC", show: "S4 · E2", book: "ASOS, ch. 60",
    title: "The Purple Wedding",
    text: "Joffrey Baratheon chokes to death at his own wedding feast, poisoned in front of several hundred witnesses, almost all of whom are pleased. Tyrion is blamed because he is the most convenient person to blame, and the trial that follows finally breaks whatever was left between him and his father.",
    wiki: "wiki.html#moment=gt-purple",
  },
  {
    id: "gt-tywin", era: "saga", saga: "got", s: 4, b: 3, y: 300,
    when: "300 AC", show: "S4 · E10", book: "ASOS, ch. 77",
    title: "A crossbow, and a privy",
    text: "Freed by his brother and armed with the truth about a woman he loved, Tyrion Lannister kills his father on the privy. Tywin's great project — the Lannister name, immortal and untouchable — dies with him in the least dignified room in the Red Keep, and the realm's last competent hand lets go of the reins.",
    wiki: "wiki.html#moment=gt-tywin",
  },
  {
    id: "gt-hardhome", era: "saga", saga: "got", s: 5, y: 301,
    when: "301 AC", show: "S5 · E8",
    title: "Hardhome",
    text: "Jon Snow sails north to bring the free folk south of the Wall, and the dead arrive first. What the Watch had treated as a story becomes a massacre on a beach with thousands of witnesses — and every single one of them is added to the enemy's army as they watch. The Night's King raises his arms, and the argument about whether the Others are real is over.",
    wiki: "wiki.html#moment=gt-hardhome",
  },
  {
    id: "gt-forthewatch", era: "saga", saga: "got", s: 5, b: 5, y: 301,
    when: "301 AC", show: "S5 · E10", book: "ADWD, ch. 69",
    title: "For the Watch",
    text: "Jon Snow does the necessary thing — letting the wildlings through the Wall to keep them out of the dead's army — and his own brothers put their knives in him for it. The Watch executes its Lord Commander for the crime of understanding the war they were founded to fight.",
    wiki: "wiki.html#moment=gt-forthewatch",
  },
  {
    id: "gt-sept", era: "saga", saga: "got", s: 6, y: 302,
    when: "302 AC", show: "S6 · E10",
    title: "The Sept of Baelor, and a queen crowned in ashes",
    text: "Cersei Lannister solves the problem of her trial by burning the Great Sept with her accusers, her rivals, and a great many bystanders inside it. Her last living child steps out of a window in response, and she takes the Iron Throne with nothing left to protect and no one left to restrain her.",
    wiki: "wiki.html#moment=gt-sept",
  },
  {
    id: "gt-sailwest", era: "saga", saga: "got", s: 6, y: 302,
    when: "302 AC", show: "S6 · E10",
    title: "The dragon sails west",
    text: "After six years of learning to rule in a foreign country, Daenerys Targaryen finally turns her fleet toward Westeros with dragons overhead, the Dothraki behind her, and the Greyjoy and Martell and Tyrell alliances in hand. Everything the story has been building toward on two continents is finally in the same sea.",
    wiki: "wiki.html#moment=gt-sailwest",
  },
  {
    id: "gt-wall", era: "saga", saga: "got", s: 7, y: 303,
    when: "303 AC", show: "S7 · E7",
    title: "The Wall comes down",
    text: "Eight thousand years of ice ends in an afternoon, brought down by a dead dragon with blue fire. Whatever the lords in the south are arguing about becomes, abruptly, a secondary matter — though it takes most of them a while to notice.",
    wiki: "wiki.html#moment=gt-wall",
  },
  {
    id: "gt-longnight", era: "saga", saga: "got", s: 8, y: 305,
    when: "305 AC", show: "S8 · E3",
    title: "The Long Night comes again",
    text: "The living make their stand at Winterfell in the dark, and lose most of it, until a girl nobody counted — trained by assassins she left behind — puts a Valyrian dagger where it needed to go. The war that the whole story has whispered about since its first page is decided in a single night, in a godswood, by the smallest person present.",
    wiki: "wiki.html#moment=gt-longnight",
  },
  {
    id: "gt-bells", era: "saga", saga: "got", s: 8, y: 305,
    when: "305 AC", show: "S8 · E5",
    title: "The bells of King's Landing",
    text: "Having lost her friends, her dragons and most of her reasons, Daenerys takes the city after it has already surrendered and burns it anyway. Whether this is a betrayal of the character or the destination she was always walking toward is the argument the fandom has been having ever since.",
    wiki: "wiki.html#moment=gt-bells",
  },
  {
    id: "gt-wheel", era: "saga", saga: "got", s: 8, y: 305,
    when: "305 AC", show: "S8 · E6",
    title: "The broken wheel",
    text: "Jon Snow kills the woman he loves in front of the throne she spent her life reaching for; the dragon melts the chair rather than the man. What replaces three hundred years of hereditary monarchy is a council of tired lords electing a boy who remembers everything — and a North that walks away from the whole arrangement. The wheel is not so much broken as quietly repaired with different spokes.",
    wiki: "wiki.html#moment=gt-wheel",
  },
];

/* ---------------------------------------------------------------------------
   ART FOR THE CHRONICLE
   Every era carries a picture, so the era buttons and the stream read as
   something to click rather than a wall of text. Individual moments may carry
   their own; where one does not, its era's picture stands in. A scene may serve
   several moments — better a picture in every slot than empty frames.
   --------------------------------------------------------------------------- */
window.TIMELINE_ERA_ART = {
  dawn:      "assets/scenes/battle-for-the-wall.webp",
  kingdoms:  "assets/scenes/winterfell.webp",
  conquest:  "assets/scenes/aegon-burning-armies.webp",
  dance:     "assets/scenes/dragon-study.webp",
  hedge:     "assets/scenes/trial-by-the-hangwoman.webp",
  rebellion: "assets/scenes/battle-of-the-trident.webp",
  saga:      "assets/scenes/the-iron-throne1.webp",
};

window.TIMELINE_ART = {
  "dawn-longnight":  "assets/scenes/surrounded-beyond-the-wall.webp",
  "dawn-wall":       "assets/scenes/castle-black.webp",
  "dawn-nightsking": "assets/scenes/surrounded-beyond-the-wall.webp",
  "dawn-andals":     "assets/scenes/winterfell-with-people.webp",
  "kd-doom":         "assets/scenes/the-doom-of-valyria.webp",
  "cq-harrenhal":    "assets/scenes/harrenhall-burning.webp",
  "cq-fieldoffire":  "assets/scenes/aegon-burning-armies.webp",
  "cq-throne":       "assets/scenes/iron-throne-large.webp",
  "cq-jaehaerys":    "assets/scenes/library.webp",
  "dance-godseye":   "assets/scenes/dragon-study.webp",
  "hk-ashford":      "assets/scenes/trial-by-the-hangwoman.webp",
  "hk-summerhall":   "assets/scenes/harrenhall-burning.webp",
  "rb-harrenhal":    "assets/scenes/harrenhall-burning.webp",
  "rb-trident":      "assets/scenes/battle-of-the-trident2.webp",
  "rb-sack":         "assets/scenes/the-iron-throne1.webp",
  "rb-throne":       "assets/scenes/iron-throne-large.webp",
  "gt-hand":         "assets/scenes/winterfell-with-people.webp",
  "gt-ned":          "assets/scenes/the-iron-throne1.webp",
  "gt-blackwater":   "assets/scenes/blackwater1.webp",
  "gt-redwedding":   "assets/scenes/winterfell-hanging.webp",
  "gt-hardhome":     "assets/scenes/hardhome.webp",
  "gt-forthewatch":  "assets/scenes/castle-black.webp",
  "gt-wall":         "assets/scenes/battle-for-the-wall.webp",
  "gt-longnight":    "assets/scenes/stannis-against-the-wildlings.webp",
  "gt-wheel":        "assets/scenes/iron-throne-large.webp",
  "gt-sailwest":     "assets/scenes/reed-keep.webp",
};
