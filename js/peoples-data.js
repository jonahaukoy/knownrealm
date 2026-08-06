/* ============================================================================
   THE PEOPLES AND POWERS OF THE KNOWN WORLD

   Every banner that has ever been painted across a stretch of this map, from
   the children of the forest to the council that elects a Broken King. The
   chronicle's territory map (timeline.html) colours the world by these; the
   wiki turns each one into a page of its own (js/col/peoples.js reads this
   file and hands it to the collections engine, so nothing here needs a second
   copy of the prose).

     { name, short, kind, color, when, blurb, paras[], pop?[[year, souls]] }

   COLOUR. Heraldic where a house has arms — Stark grey, Lannister crimson,
   Targaryen blood-red — and chosen for separation everywhere else. The set was
   run through a colour-blindness check pair by pair; every pair that can share
   a BORDER on the map is separable under protanopia, deuteranopia and
   tritanopia. Four are deliberately near-grey because that is what they are
   (Stark grey, the Watch's black, the free folk's undyed wool, the Others'
   ice); those, and the pairs that sit on opposite ends of the world and can
   never touch, are carried by the name label, the legend and the hover
   readout, never by colour alone.

   POPULATION. Westeros keeps no census and Martin has never published one.
   Every figure in this file and in js/timeline-territories.js is THIS SITE'S
   OWN RECKONING, and is labelled as such wherever it is shown. The anchors are
   the few numbers the books do give — half a million souls in King's Landing,
   the size of the banners each region calls, ten thousand ships out of the
   Rhoyne, forty thousand riders in a great khalasar — worked outward on the
   usual medieval assumption that a realm puts about one person in a hundred
   into the field. Deep history is reckoned looser still: a number there means
   "of this order", not "this many".

   A power with no `pop` of its own is counted by adding up the lands that
   answer to it in the year being asked about — the souls under the banner.
   ========================================================================== */

window.TL_POWERS = {

  /* ---------------- the elder peoples ---------------- */

  children: {
    name: "The Children of the Forest", short: "The children", kind: "elder people",
    color: "#35785C", when: "Before the First Men — and, in the deep wood, long after",
    blurb: "A small, dark-eyed people who kept no cities and wrote no books, carved faces into the weirwoods, and lost a continent one felled tree at a time.",
    paras: [
      "Everything set down about the children was set down by the people who took their land, thousands of years after the fact, which is a poor way to learn about anyone. The maesters describe them as small and brown and long-lived, armed with obsidian rather than bronze, living in caves and crannogs and the crowns of trees, ruled by no king anyone could name. What is not in dispute is that they were here first, that the whole of Westeros was forest when they held it, and that they are gone from every part of it a man can walk to.",
      "Their quarrel with the First Men was a quarrel about trees. Men came with bronze axes and cleared ground to farm; the weirwoods the children had given faces came down with everything else. The war ran for centuries and the children lost it slowly, twice trying to end it by breaking the land itself — the Arm of Dorne, and the Neck, if the songs are to be believed. The Pact signed on the Isle of Faces gave them the deep woods and gave men the open country, and the deep woods have been shrinking ever since.",
      "By the time of the Andals they had already withdrawn beyond the memory of the south, and by the time of the Targaryens most maesters had quietly filed them with grumkins and snarks. The North never stopped believing, which is the North's habit; and the few who go far enough beyond the Wall find that the North is right about this, as it is about most cold things.",
    ],
    pop: [[-12000, 500000], [-11000, 420000], [-10000, 300000], [-8000, 120000], [-6000, 40000], [-4000, 12000], [-1000, 2000], [1, 600], [200, 300], [298, 120], [303, 40], [306, 20]],
  },

  others: {
    name: "The Others", short: "The Others", kind: "the cold",
    color: "#CFE4EF", when: "The Long Night, and the long winter after",
    blurb: "Pale things with eyes like blue stars that came out of the farthest north when the sun failed, and raised the dead to walk behind them.",
    paras: [
      "They are the reason the Wall exists, and for eight thousand years they were also the reason nobody believed the Wall was necessary. The stories agree only on the essentials: a winter that did not end, a generation of darkness, an enemy that killed the living and then made use of them. The details vary by which fireside you sit at — the Last Hero and his twelve companions, a battle for the dawn, a dragonsteel blade, the founding of the Watch — and every version has been polished by eight millennia of telling.",
      "What the chronicle can say is that the histories of half the world remember the same darkness at roughly the same time. Asshai calls it something else, Yi Ti tells it with a different heroine, the Rhoynar sang of a river frozen to its bed. A story that turns up in a dozen unrelated tongues is usually a story about something that happened.",
      "Their return was announced quietly, in ranging reports nobody read, and loudly, on a beach at Hardhome in front of thousands of witnesses. The argument about whether they were real ended there.",
    ],
    pop: [[-8100, 0], [-8000, 200000], [-7900, 60000], [-6000, 20000], [1, 20000], [297, 30000], [300, 90000], [303, 200000], [305, 0]],
  },

  "first-men": {
    name: "The First Men", short: "The First Men", kind: "people",
    color: "#A87434", when: "c. 12,000 BC onward",
    blurb: "Men who came east over a land bridge with bronze blades, cut down the forests, married the old gods, and became the North.",
    paras: [
      "They arrived out of Essos across the Arm of Dorne carrying bronze and leather and horses, and they made no secret of what they wanted, which was farmland. What followed was the longest war in the recorded history of the continent, and the strangest peace: having spent centuries killing the children of the forest, the First Men then adopted their gods wholesale and spent the next four thousand years praying to trees with faces carved by the people they had displaced.",
      "The Age of Heroes belongs to them — Bran the Builder, Lann the Clever, Garth Greenhand, Durran Godsgrief, the Grey King — and so does every runic barrow and ringfort in the country. Every one of those names is doing far too much work in the histories to be one man, which is a maester's way of saying the record is songs.",
      "South of the Neck the Andals broke them, married them and converted them until First Men blood was a thing a southron lord mentioned only in a boast. North of it they simply carried on. When Ned Stark says his people have held Winterfell for eight thousand years, he is claiming descent in an unbroken line from these men, and no one in the North thinks that is a boast at all.",
    ],
  },

  andals: {
    name: "The Andals", short: "The Andals", kind: "people",
    color: "#8492B8", when: "c. 6,000 BC onward",
    blurb: "Iron-armed invaders out of Essos who brought the Seven, a new alphabet, and the end of the First Men's south.",
    paras: [
      "They came from the hills of Andalos, on the far shore of the narrow sea between what would become Pentos and Norvos, and by their own account they came because the Seven told them to. The maesters, unromantic to a man, note that they came in the direction away from Valyria and its dragons, and draw the obvious conclusion.",
      "They landed in the Vale first and worked outward, kingdom by kingdom, with iron against bronze and a faith that had no use for a tree. Where they could not conquer they married, which in the long run worked better: within a few centuries almost every great house south of the Neck could point to an Andal in its line, and the ones that could not — the Blackwoods, chiefly — made a point of saying so.",
      "The Neck stopped them, and the North kept the old gods, which is why the map of the Faith and the map of the weirwoods still divide Westeros along the same swamp today. Their other gift was writing: the runes of the First Men said little more than a name, and the histories of Westeros properly begin when the Andals arrived with an alphabet and the habit of using it.",
    ],
  },

  rhoynar: {
    name: "The Rhoynar", short: "The Rhoynar", kind: "people",
    color: "#157F84", when: "c. 3,000 BC – 700 BC",
    blurb: "A river civilisation of the Rhoyne, drowned by Valyria, whose survivors sailed ten thousand ships to Dorne and changed its law forever.",
    paras: [
      "Along a river longer than any in Westeros they built cities of stone and painted wood — Ny Sar, Ar Noy, Chroyane the festival city — and worshipped the river itself as Mother Rhoyne. They were famously peaceful, famously wealthy, and famously good at fighting when finally obliged to, which is a combination that attracts dragonlords.",
      "The wars with Valyria ran through generations and ended the way wars against dragons ended. Prince Garin raised a quarter of a million men, beat a Valyrian army in the field, and was defeated from the air; the Freehold's answer to a river people was to poison the river and leave the ruins to the fog. Chroyane has been the Sorrows ever since, and the greyscale that lives in that fog is the one part of the story the sailors still take seriously.",
      "What survived sailed away. Princess Nymeria took ten thousand ships west, lost most of them, and landed what remained in Dorne, where she married Mors Martell and burned the fleet on the beach so no one could argue about returning. Dornish law still lets an elder daughter inherit ahead of a younger son, which is a Rhoynish idea, and Dorne is still the one part of Westeros that has never quite agreed to be Westeros.",
    ],
    pop: [[-3000, 4000000], [-2000, 5500000], [-1000, 6000000], [-800, 3000000], [-700, 900000], [-690, 250000], [-600, 0]],
  },

  "free-folk": {
    name: "The Free Folk", short: "The free folk", kind: "people",
    color: "#A3B39A", when: "Since the Wall cut them off",
    blurb: "The First Men who happened to be standing on the wrong side of the Wall when it went up, and who have declined to kneel ever since.",
    paras: [
      "Everyone south of the Wall calls them wildlings; they call themselves the free folk, and the difference is the whole of their politics. They are the same people as the northmen — same blood, same old gods, same hard country — separated by seven hundred feet of ice and eight thousand years of being told they are savages by men who have never been north of it.",
      "They keep no lords and no laws, which sounds better in a song than it does in a village. What they have instead is a habit of following whoever is worth following, and about once a century somebody is: a King-beyond-the-Wall, gathering a hundred thousand people who have never agreed on anything into one army pointed south. Every such king so far has been broken on the Wall or on a northern host.",
      "The last of them gathered his people not to raid but to run, because the thing behind them was worse than the thing in front, and the Watch spent a great deal of blood learning to believe him.",
    ],
    pop: [[-7900, 90000], [-4000, 140000], [1, 160000], [200, 150000], [297, 130000], [300, 90000], [303, 55000], [306, 60000]],
  },

  /* ---------------- the orders and the kingdoms of Westeros ---------------- */

  "nights-watch": {
    name: "The Night's Watch", short: "The Watch", kind: "sworn order",
    /* pale ice, not the Watch's own black. The fill is a 42% multiply over a
       parchment chart, so a near-black (#3B4046, what this was) turned the
       basemap's own printed lettering — Castle Black, Queenscrown, The Gift —
       into an unreadable smear, and read as a dead grey slab beside the North.
       The Wall's colour serves the map better than the cloak's. */
    color: "#9FB1C4", when: "c. 8,000 BC – 305 AC",
    blurb: "The oldest institution in the world, holding a seven-hundred-foot wall against an enemy the realm spent eight thousand years deciding was imaginary.",
    paras: [
      "They took a vow with no end in it and then kept it for eighty centuries, which is either the most impressive thing any organisation in this history has done or the most stubborn. At its height the order held nineteen castles along the Wall and put ten thousand men in black. By the time a Stark's bastard took the black there were fewer than a thousand, holding three castles, and most of them were thieves, rapers and poachers given a choice between the Wall and a rope.",
      "The Gift, and later the New Gift, were lands granted south of the Wall to feed them; by the last century both were mostly empty, their smallfolk having worked out that a farm within reach of raiders is not a farm. The order's decline is the clearest measure of the realm's forgetting: the further the Others receded into story, the less anyone saw the point of paying for the men watching for them.",
      "Its final century is a study in an institution being right and unbearable at the same time. It was correct about the threat, correct about the free folk, and correct that letting a hundred thousand people freeze to death north of the Wall would simply arm the enemy — and it murdered its own Lord Commander for saying so.",
    ],
    pop: [[-7900, 10000], [-4000, 9000], [1, 6000], [200, 3000], [260, 1500], [298, 1000], [300, 700], [305, 500]],
  },

  stark: {
    name: "The Kings of Winter, and the Starks of Winterfell", short: "House Stark", kind: "royal house",
    color: "#5A6472", when: "c. 8,000 BC – 1 AC as kings; wardens after",
    blurb: "Eight thousand years of the same family in the same castle, which is longer than most of the world's civilisations have lasted.",
    paras: [
      "The Starks descend from Bran the Builder, and after him from a line of Kings of Winter who spent several thousand years absorbing everyone in the North who thought they might like a turn: the Barrow Kings, the Red Kings of the Dreadfort, the marsh kings, the Warg King, the Kings of Winter's own rebellious cousins. By the time the dragons came there was exactly one crown north of the Neck and it had been in the same hall a very long time.",
      "Torrhen Stark ended the kingdom on his knees at the Trident, having counted three dragons and his own thirty thousand men and done the arithmetic. He is called the King Who Knelt, usually by people who have never had to make that decision. The North kept its gods, its laws and its wardenship, and in eight thousand years the family has never once ruled from anywhere but Winterfell.",
      "Their words are not a boast, which is unusual. Every other great house promises something; the Starks issue a warning, and the warning is about the weather.",
    ],
  },

  arryn: {
    name: "The Kings of Mountain and Vale (House Arryn)", short: "House Arryn", kind: "royal house",
    color: "#7FC4E8", when: "c. 6,000 BC – 1 AC as kings",
    blurb: "The purest Andal blood in Westeros, sitting in a castle nobody has ever taken, behind a gate nobody has ever forced.",
    paras: [
      "Ser Artys Arryn is the founder in the songs — the Falcon Knight, who threw down the last First Men king of the Vale on the Giant's Lance — and the Arryns have been telling that story ever since. What is certainly true is that the Vale was the first part of Westeros the Andals took and the part where their blood ran least diluted, and that the Arryns have been kings or Lords Paramount of it for something like six thousand years.",
      "Geography did most of the work. The Bloody Gate has turned back every army sent at it, and the Eyrie is a castle you reach by a stair up a mountain, or not at all. Queen Sharra surrendered the Vale to Visenya Targaryen without a battle, largely because Visenya landed a dragon in the Eyrie's courtyard and thereby made the entire strategic argument obsolete in one afternoon.",
      "The habit of sitting out other people's wars behind those mountains is very old, and it has kept the Vale rich, intact, and thoroughly resented by everyone who bled while it watched.",
    ],
  },

  riverkings: {
    name: "The Kings of the Rivers", short: "The river kings", kind: "royal house",
    color: "#2E7FCC", when: "c. 4,000 BC – 40 BC",
    blurb: "House Mudd, then Justman, then Teague, then Blackwood, then Bracken — the riverlands have been conquered by everyone who ever wanted them, because they have no borders worth the name.",
    paras: [
      "The trouble with the Trident is that it is the best land in Westeros and has a mountain range on none of its sides. The First Men kings of House Mudd ruled from Oldstones for a thousand years and were thrown down by the Andals; the Andal Justmans lasted three centuries; the Teagues were burned out by their own lords with ironborn help. The riverlands have never once ended a war on the winning side while it was still being fought on their fields.",
      "Harwyn Hardhand of the Iron Islands took the whole of it three generations before the Conquest, and his grandson Harren the Black spent forty years and a great many river-born lives building Harrenhal to sit on it from. The riverlords cheerfully changed sides the moment Aegon offered them the chance, which is the single most riverlands thing in this history.",
      "House Tully were minor lords through all of it, elevated at last by Aegon for being the first to declare. Three hundred years later the rivers burned again, for the same reason as always: because they lay between two people who wanted to fight each other.",
    ],
  },

  ironborn: {
    name: "The Kings of the Iron Islands", short: "The ironborn", kind: "royal house",
    color: "#5E2E86", when: "The Age of Heroes – 1 AC as kings; and twice since",
    blurb: "A people who decided that taking things was a religion, and have been losing wars about it ever since.",
    paras: [
      "The ironborn trace themselves to the Grey King, who is said to have ruled a thousand years, married a mermaid and made a hall of the bones of a sea dragon; the Citadel's view of this account is not recorded, but can be guessed. What is real is the Drowned God, the iron price, and the salt kings and rock kings who once chose their high king at a kingsmoot on Old Wyk.",
      "At their height they held the whole western coast and the riverlands with it, and the Hoares ruled from Harrenhal. That ended in one afternoon when Balerion came over the walls. Aegon then let the islands choose their own lord, and they chose House Greyjoy, who had been kings before and have never entirely stopped acting like it.",
      "Twice in living memory a Greyjoy has crowned himself, and twice the arithmetic has been the same: a few hundred longships against a continent. The islands are stony, poor and thinly peopled, and the whole culture is an argument that this is a virtue.",
    ],
  },

  lannister: {
    name: "The Kings of the Rock (House Lannister)", short: "House Lannister", kind: "royal house",
    color: "#C9141F", when: "The Age of Heroes – 1 AC as kings; wardens after",
    blurb: "Gold, and the willingness to spend it on anything at all, including reputations.",
    paras: [
      "Lann the Clever is supposed to have taken Casterly Rock from House Casterly without drawing a sword, by a trick nobody has ever satisfactorily explained, and his descendants have been extracting things from people ever since. The Rock sits on the richest vein of gold in the world, which has decided most of what House Lannister has ever been able to do.",
      "King Loren the Last brought his host to the Field of Fire alongside the Gardeners, watched four thousand men burn, and knelt while there was still a family left to kneel. He kept the Rock and lost the crown, which given how House Gardener's day went was a good trade.",
      "Their true modern founder is Tywin, who inherited a house that was a standing joke and turned it into the most feared name in the realm by a programme of arithmetic and atrocity. His children spent the rest of the story finding out what it costs to be his children.",
    ],
  },

  gardener: {
    name: "The Kings of the Reach (House Gardener)", short: "House Gardener", kind: "royal house",
    color: "#2B6B33", when: "The Age of Heroes – 1 BC",
    blurb: "The green hand of Garth Greenhand, ruling the richest and most populous country in Westeros — until every last one of them died in a single afternoon.",
    paras: [
      "Garth Greenhand is the ancestor half the Reach claims: a First Men king said to have brought farming to Westeros, and to have fathered so many children that the Tyrells, Hightowers, Florents, Rowans, Oakhearts and a dozen others all descend from him if you ask them. His line, House Gardener, ruled from Highgarden for thousands of years and made the Reach the wealthiest region on the continent — more men, more grain and more chivalry than anywhere else, and a chip on its shoulder about Oldtown.",
      "King Mern IX brought the largest army the Conquest ever faced to the Field of Fire, together with his sons, his grandsons and his nephews. All three dragons flew that day, and House Gardener ended in the space of a few hours — the only great house of the Seven Kingdoms to be extinguished root and branch.",
      "Their steward knelt, and was given Highgarden for it. Which is why, three hundred years later, the rose flies over the Reach and half the Reach still remembers that the Tyrells were upjumped stewards.",
    ],
  },

  durrandon: {
    name: "The Storm Kings (House Durrandon)", short: "House Durrandon", kind: "royal house",
    color: "#22A0A0", when: "The Age of Heroes – 1 BC",
    blurb: "Durran Godsgrief married the sea god's daughter, and the gods have been trying to knock his castle down ever since.",
    paras: [
      "Storm's End was built seven times, the story goes, because the first six were thrown down by the storms that came for the man who had married Elenei against her parents' wishes. The seventh had a young Bran the Builder's hand in it, and it has never fallen — not to storm, not to siege, and not to the two brothers who tried it in living memory.",
      "The Durrandons ruled a kingdom that at its height ran from Cape Wrath up to the Trident and across to Massey's Hook, and spent the following centuries losing pieces of it to the riverlands, the Reach and Dorne. By the Conquest they held the stormlands proper and a great deal of pride.",
      "Argilac the Arrogant answered Aegon's offer of alliance by cutting the hands off the envoy, fought Orys Baratheon at the Last Storm and was killed there. Orys took his castle, his daughter and his arms and antlered banner, which is how a crowned stag came to sit on a black-and-gold field for the next three hundred years.",
    ],
  },

  martell: {
    name: "House Nymeros Martell of Dorne", short: "Dorne", kind: "royal house",
    color: "#E8531E", when: "700 BC onward",
    blurb: "The only kingdom the dragons could not take, joined to the realm at last by the far duller method of a marriage.",
    paras: [
      "Dorne is Rhoynish, Andal and First Men blood in a proportion found nowhere else, on land nobody else wants: deserts, red mountains, and three rivers doing an enormous amount of work. Nymeria's marriage to Mors Martell united a country of squabbling petty kings, and her descendants have titled themselves Prince rather than King ever since, in the Rhoynish style.",
      "Aegon's dragons burned Dorne and Dorne declined to notice. Princess Meria Martell, eighty years old and blind, sent the Conqueror a message to the effect that he could burn her country but not rule it, and was proved right across two decades of a war fought with knives in the dark. The Dornish killed one Targaryen king and one of the Conqueror's own sisters before the crown gave up.",
      "It joined the Seven Kingdoms in the reign of Daeron II, who married Princess Myriah and let Dorne keep its own laws — which it duly did, including the one that lets a first-born daughter inherit ahead of her brothers. Three centuries later the realm's dealings with Dorne still consist mostly of the realm assuming Dorne will behave like everyone else, and being wrong.",
    ],
  },

  targaryen: {
    name: "House Targaryen", short: "House Targaryen", kind: "royal house",
    color: "#7E1424", when: "114 BC – 283 AC, and once more after",
    blurb: "A minor Valyrian family that survived the end of the world because one girl had a bad dream and one father was strange enough to listen.",
    paras: [
      "The Targaryens were dragonlords of the fortieth rank in a Freehold full of them, and would be a footnote if Daenys had not dreamed of the Doom twelve years before it came. Her father sold everything, moved the family and five dragons to a rock in the narrow sea, and was laughed at until the day the Fourteen Flames burst.",
      "A century later Aegon and his sisters took a continent with three dragons and a very small army, and then spent three hundred years demonstrating what happens when a family that has married brother to sister for generations holds absolute power and periodically runs out of dragons. There were great kings — Jaehaerys, Daeron the Good — and there were Maegor and Aerys, and the realm never worked out a way to have the first kind reliably.",
      "The dynasty ended at a ford on the Trident, in a breastplate of rubies. What remained of it was two children across the narrow sea, and one boy in the North whose parentage half the realm would have killed him for.",
    ],
  },

  "iron-throne": {
    /* named for the REALM, not the chair: the wiki auto-links an entry's name
       wherever it appears in prose, and "the Iron Throne" is written on nearly
       every page of this site */
    name: "The Realm of the Iron Throne", short: "The Iron Throne", kind: "crown",
    color: "#E0A410", when: "1 AC onward",
    blurb: "A thousand swords melted into a chair deliberately unpleasant to sit in, and the three centuries of argument about who gets to.",
    paras: [
      "Aegon had the blades of his beaten enemies heaped up and worked by dragonflame into a seat with no comfort in it anywhere, on the theory that a king should never be at ease. It is a poor chair and a superb piece of political theatre, and it has cut nearly everyone who has sat on it, which the smallfolk consider a form of judgement.",
      "What it represents is newer than most of what it rules. Before 1 AC there had been seven or more kingdoms for thousands of years; the single realm is a three-hundred-year-old idea held together by dragons, then by roads and laws, then by habit, and then by nothing much at all. Every civil war in this chronicle is the realm briefly remembering that it used to be several countries.",
      "It ends melted, by a dragon that appears to have understood the argument better than anyone in the room. What replaces it is a council of tired lords electing a king, and a North that walks away from the arrangement — which is either a wheel broken or a wheel repaired with different spokes, depending on who is telling it.",
    ],
  },

  /* ---------------- the war of the five kings, and the Dance ---------------- */

  blacks: {
    name: "The Blacks — Queen Rhaenyra's party", short: "The blacks", kind: "faction",
    color: "#1E1B26", when: "129 – 131 AC",
    blurb: "The daughter her father named heir, the lords who had sworn to her, and rather more dragons than sense.",
    paras: [
      "Viserys I named Rhaenyra his heir, made the lords of the realm swear to her, and then had sons by a second wife and spent the rest of his reign refusing to say which promise he meant. When he died, the blacks held Dragonstone, the Vale, the North, the riverlands and the greater part of the dragons, and crowned the queen her father had made.",
      "Their strength was the air and their weakness was everything else: they never controlled the treasury, and King's Landing loved them only until the food ran out. Rhaenyra held the city for half a year and lost it to a riot.",
      "Her party won the war, in the narrow sense that her son took the throne. It cost her her children, her dragons, her life and the last age of dragonkind.",
    ],
  },

  greens: {
    name: "The Greens — King Aegon II's party", short: "The greens", kind: "faction",
    color: "#4E8A2E", when: "129 – 131 AC",
    blurb: "The queen's faction at court, who crowned the king's eldest son the moment the king was cold.",
    paras: [
      "They take their name from a tourney gown. Alicent Hightower wore green to the great tourney at King's Landing while the princess wore Targaryen black, and the court chose sides by colour, which is a fair summary of how seriously either party took the constitutional question.",
      "The greens held the capital, the crown's gold, the Hightowers and the Reach, and — crucially — the machinery of government, which meant that for the first year of the war they could pay soldiers while the blacks could only frighten them. Their case rested on the plain fact that Westeros had never crowned a queen and had already voted once, at the Great Council of 101, to say sons before daughters.",
      "Aegon II won the throne, outlived his rival by months, and was poisoned by his own side. Nobody who fought this war got what they wanted, which is the entire lesson of the Dance and one the realm forgot inside a century.",
    ],
  },

  bolton: {
    name: "House Bolton", short: "House Bolton", kind: "great house",
    color: "#C75B7A", when: "299 – 302 AC as Wardens",
    blurb: "The Red Kings of the Dreadfort, who once flayed Starks for sport and spent four thousand years waiting for another chance.",
    paras: [
      "The Boltons were kings in the North before the Starks put them down, and the peace between the two houses is measured in rebellions. Their sigil is a flayed man and their reputation is exactly what that suggests; the practice was outlawed a thousand years ago, and the Dreadfort's cellars have never been inspected by anyone who came back to file a report.",
      "Roose Bolton put his knife into his king at a wedding and was given the North for it by a crown that had no other candidate. He held it for three years, and the North — which forgets nothing and forgives less — spent every one of them waiting.",
    ],
  },

  frey: {
    name: "House Frey", short: "House Frey", kind: "great house",
    color: "#A9825B", when: "299 – 303 AC as Lords Paramount",
    blurb: "A toll bridge, six hundred years of resentment, and the worst thing anyone in this history does to a guest.",
    paras: [
      "The Freys built a crossing where the Green Fork was uncrossable and grew rich charging for it, and have been sneered at as upjumped toll collectors by better-born houses ever since. Walder Frey's answer to six centuries of that was to be indispensable, prolific, and entirely without illusions.",
      "Robb Stark broke a marriage oath to him. What followed at the Twins violated guest right, which is the one law in Westeros that even the ironborn keep, and it bought House Frey the riverlands for four years and the enduring hatred of everyone in them.",
    ],
  },

  renly: {
    name: "Renly Baratheon, king in Highgarden", short: "King Renly", kind: "claimant",
    color: "#3FBF6E", when: "299 AC",
    blurb: "The youngest of three brothers, with the best claim to nothing and the largest army in Westeros.",
    paras: [
      "Renly's case for the throne was that he would be good at it and had a hundred thousand men, which he regarded as sufficient and which was, in strict practice, not far wrong. He married Margaery Tyrell, brought the Reach and the stormlands with her, and made his camp the most cheerful war in the story.",
      "He was killed by a shadow in his own tent, before a single battle, by his own brother's sorcery. The Reach went over to the crown; the stormlords went over to Stannis; and Westeros never found out whether the affable king would have been a good one.",
    ],
  },

  stannis: {
    name: "Stannis Baratheon, the rightful heir", short: "King Stannis", kind: "claimant",
    color: "#14606E", when: "299 – 302 AC",
    blurb: "The man who was legally right about everything and could not persuade a single person to care.",
    paras: [
      "By every law in the Seven Kingdoms the throne was his: his elder brother's children were not his elder brother's. He said so, in writing, to every lord in Westeros, and almost nobody came — because he had held Dragonstone rather than Storm's End, because he had starved through a siege for Robert and been thanked with a rock, and because he was, by universal agreement, unpleasant to be in a room with.",
      "What he had instead was a red priestess, a smuggler, and an unshakeable sense of duty that eventually took him and his little fleet north to fight the only war that mattered — which is more than any other claimant managed, and is why the Watch remembers him more kindly than the realm does.",
    ],
  },

  greyjoy: {
    name: "House Greyjoy", short: "House Greyjoy", kind: "great house",
    color: "#5E2E86", when: "289 AC, and 299 – 305 AC",
    blurb: "We Do Not Sow — and, twice in twenty years, we do not win either.",
    paras: [
      "Balon Greyjoy crowned himself twice: once against Robert, who put him down in a season and took his last living son as a hostage, and once again the moment the realm cracked, on the theory that the North was busy. He was right that the North was busy and wrong about everything else.",
      "What the second rising actually accomplished was the destruction of the hostage: Theon Greyjoy took the castle that had raised him, could not hold it, and was flayed into somebody else for his trouble. The islands themselves ended the story where they began it — poor, stony, and arguing about a chair.",
    ],
  },

  /* ---------------- Essos ---------------- */

  valyria: {
    name: "The Valyrian Freehold", short: "Valyria", kind: "empire",
    color: "#8C1F2F", when: "c. 5,000 BC – 102 BC",
    blurb: "Shepherds who found dragons in a volcano and spent five thousand years using them, until the volcano answered.",
    paras: [
      "It was not an empire and had no king, which its citizens never tired of explaining: every freeholder with land had a voice, and two lords were elected annually to hold what authority there was. This was democracy of a kind, conducted over the largest slave population in the history of the world, and enforced from the backs of dragons.",
      "The Freehold broke the Old Empire of Ghis in five wars and salted the ruins; it broke the Rhoynar; it planted its colonies from Volantis to Lorath and drove the great roads that still run straighter than anything built since. Its steel is still the best steel there is, and nobody alive knows how it was made. Its capital sat on the Fourteen Flames and mined them with slaves in numbers no chronicle bothered to count.",
      "In one night it ended: the mountains burst, the peninsula shattered, and every dragonlord within reach died with their dragons. What caused it, nobody knows and everybody has a theory. The Smoking Sea is still there, and the sailors who go looking do not, as a rule, come back.",
    ],
    pop: [[-5000, 300000], [-4700, 1200000], [-3000, 4000000], [-2000, 7000000], [-1000, 11000000], [-300, 13000000], [-115, 14000000], [-102, 40000], [-100, 5000], [1, 1000]],
  },

  ghiscari: {
    name: "The Old Empire of Ghis, and New Ghis", short: "Ghis", kind: "empire",
    color: "#7A4A55", when: "Before Valyria — and again after",
    blurb: "The first empire the world remembers, with harpy banners and legions of slave soldiers, razed and salted by dragons five thousand years ago.",
    paras: [
      "Old Ghis was ancient when Valyria was a country of shepherds: brick cities, disciplined legions, and the slavery that every civilisation on that side of the world learned from it. Five wars decided which of them would rule the east, and the Ghiscari lost all five. In the last of them the Valyrians burned the capital, threw down its walls and sowed the fields with salt and skulls, which is thorough even by the standards of this history.",
      "The culture did not die with the city. Its colonies on Slaver's Bay carried on speaking a bastard Valyrian, wearing the tokar, and selling people, and the little island of New Ghis rebuilt the legions on a smaller scale. Every Ghiscari city since has claimed the empire's descent and none of them has come close to the empire's reach.",
    ],
  },

  slavers: {
    name: "The Masters of the Bay", short: "The Masters", kind: "cities",
    color: "#6B7C3A", when: "102 BC onward",
    blurb: "Astapor, Yunkai and Meereen — three cities living entirely on the buying and selling of human beings.",
    paras: [
      "When Valyria died, its Ghiscari possessions on the bay simply kept doing what they had been doing, without a Freehold to answer to. Astapor makes the Unsullied, by a training that begins with a knife and ends with a boy killing an infant; Yunkai breeds bed-slaves and calls itself yellow and wise; Meereen is the largest and the oldest and the most convinced of its own refinement.",
      "The bay's economy has no second leg. Everything the three cities have — the pyramids, the fighting pits, the fleets — rests on a trade that requires a steady supply of people taken from somewhere else, chiefly from the Dothraki, who supply the captives, and from the corsairs of the Basilisk Isles.",
      "A young queen with three dragons broke all three in the space of a year, discovered that breaking a thing is much easier than replacing it, and spent the next several years learning that lesson in public.",
    ],
  },

  dothraki: {
    name: "The Dothraki", short: "The Dothraki", kind: "people",
    color: "#C2622A", when: "Since before the Doom; masters of the grass since 100 BC",
    blurb: "Horse-lords of a grass sea the size of a continent, who took the greatest cities of the east apart after the dragons stopped watching them.",
    paras: [
      "They were there before the Doom, threescore quarrelsome tribes at war with each other, kept in their grass by the simple fact that Valyria had dragons and objections. When the Freehold ended, a khal named Mengo united them on his mother's advice and became the first khal of khals, and the century that followed is remembered in every city of Essos as the Century of Blood.",
      "The Kingdom of Sarnor, ancient and wealthy and famous for its chariots, is gone — its cities are named on maps as ruins and nothing else. Qohor bought its life with a fortune and three thousand Unsullied; Pentos and Norvos and Myr have paid tribute for centuries and call it gifts. The Dothraki neither farm nor build nor sail, and their word for a stone dwelling is an insult.",
      "A khalasar is a moving city of horses, wagons and everything it has taken. Forty thousand riders is a great khal's strength; the largest the histories name is closer to a hundred thousand, and it was crossing the grass for no better reason than that its khal had died and the horde had not yet finished arguing about it.",
    ],
    pop: [[-1000, 300000], [-200, 500000], [-100, 800000], [-1, 1000000], [130, 900000], [298, 800000], [301, 750000], [305, 600000]],
  },

  sarnori: {
    name: "The Kingdom of Sarnor", short: "Sarnor", kind: "kingdom",
    color: "#9BA8BE", when: "c. 5,000 BC – 90 BC",
    blurb: "The Tall Men of the northern grass, with chariots and a dozen cities, erased inside a single century.",
    paras: [
      "Sarnor was old — it fought Ghis when Ghis was the world's only empire — and it was rich, a confederation of city-kingdoms strung along the rivers of the northern grasslands, famous for scythed chariots and for quarrelling with itself. It never once managed to be one country for longer than a war took.",
      "That was fatal. When the Dothraki came out of the east united and the Sarnori did not, the cities fell one at a time over the course of the Century of Blood: Sathar, Sarys, Gornath, Kasath, Sallosh, and at the last Sarnath the Tall Town. The maps still print the names, followed by the word ruins.",
      "It is the clearest case in this history of a civilisation that was destroyed not because the enemy was stronger but because it could not agree to face it together — a lesson Westeros would have several occasions to relearn.",
    ],
    pop: [[-5000, 1500000], [-3000, 4000000], [-1000, 6000000], [-200, 6500000], [-100, 5000000], [-90, 900000], [-50, 100000], [1, 20000]],
  },

  lhazareen: {
    name: "The Lhazareen", short: "The Lamb Men", kind: "people",
    color: "#C0A94E", when: "Since the deep past",
    blurb: "Shepherds in the hills between the grass and the bay, worshipping a Great Shepherd, raided by everyone.",
    paras: [
      "The Dothraki call them the Lamb Men and mean it as contempt: a peaceful, flat-faced, copper-skinned people who keep sheep and goats in the hills above Slaver's Bay and do not fight back well. Their villages are the natural stopping place for any khalasar riding to the bay to sell captives, which is a geography that has decided their entire history.",
      "They are one of the few peoples in this chronicle who have never conquered anybody, never built an empire, and are still there — which, measured against Sarnor or Ghis or Valyria, is not the worst record on the map.",
    ],
    pop: [[-3000, 300000], [-1000, 450000], [1, 500000], [200, 480000], [298, 400000], [300, 300000], [305, 280000]],
  },

  braavos: {
    name: "Braavos", short: "Braavos", kind: "free city",
    color: "#2F4F9E", when: "c. 700 BC onward",
    blurb: "Founded in secret by escaped slaves in a fog-bound lagoon, and now the richest city in the world.",
    paras: [
      "It is the youngest of the Free Cities and the only one Valyria did not build. A fleet of slaves — of a hundred tongues and a hundred gods — took their masters' ships and hid in a lagoon behind a wall of pine-clad islands, and stayed hidden for over a century before announcing themselves. The day they did is still kept as the Uncloaking.",
      "Everything about the city follows from that beginning. Slavery is the one unforgivable crime; every faith has its temple on the Isle of the Gods; and the Iron Bank, which is what happens when people with no land and no farms decide that money is the thing to be very good at, holds paper on half the crowns of the world. Its motto on that subject is not a threat so much as an actuarial statement.",
      "It also keeps a temple to the god that everyone eventually meets, staffed by people who are extremely good at arranging the introduction.",
    ],
    pop: [[-700, 40000], [-500, 200000], [-102, 400000], [1, 600000], [200, 800000], [298, 1000000], [306, 1000000]],
  },

  volantis: {
    name: "Volantis", short: "Volantis", kind: "free city",
    color: "#8E3070", when: "c. 2,000 BC onward",
    blurb: "The eldest daughter of Valyria, which tried to inherit the Freehold and settled for five slaves to every free man.",
    paras: [
      "Volantis was the first and greatest of Valyria's colonies, at the mouth of the Rhoyne behind the Black Wall the dragonlords raised, and when the Doom came it declared itself the Freehold's heir. For two generations it made that stick: Myr and Lys were taken, and Volantene armies went as far as Valyria's ashes.",
      "It overreached, as the first city to move usually does. A coalition of the other Free Cities, Pentoshi gold and a Westerosi sellsword prince broke the attempt, and Volantis has spent the three centuries since being enormous, wealthy and no longer in charge of anything but itself.",
      "Five slaves for every free man is the figure the city itself quotes, and the tiger-and-elephant argument that runs its politics is an argument about which of them should be sent to war.",
    ],
    pop: [[-2000, 60000], [-1000, 400000], [-102, 900000], [-50, 1400000], [1, 1500000], [200, 1600000], [298, 1700000]],
  },

  "free-cities": {
    name: "The Free Cities", short: "The Free Cities", kind: "cities",
    color: "#B07ACB", when: "102 BC onward",
    blurb: "Pentos, Myr, Tyrosh, Lys, Norvos, Qohor and Lorath — nine daughters of Valyria who spend most of their history at each other's throats.",
    paras: [
      "Every one of them except Braavos began as a Valyrian colony, and when the Freehold ended they inherited its trade, its language and its habits, including slavery, which Pentos formally forbids and informally maintains. There is no league and no common government; there is a shifting set of alliances, a great deal of gold, and the standing business of hiring other people to do the fighting.",
      "The Disputed Lands between Myr, Lys and Tyrosh have been fought over for so long that the phrase has become the region's actual name on the maps, and the free companies that grew up to fight there are now the professional armies of half the east.",
      "Their real weapon is money. Pentos buys the Dothraki off; Qohor bought its life with a fortune and three thousand Unsullied; Myr and Lys buy fleets. It is a foreign policy that works until somebody arrives who cannot be paid.",
    ],
  },

  qarth: {
    name: "Qarth", short: "Qarth", kind: "city",
    color: "#2FA36B", when: "c. 500 BC onward",
    blurb: "The greatest city that ever was or will be, by its own account, sitting on the straits where two seas meet.",
    paras: [
      "Qarth grew where the Jade Gates join the Summer Sea to the Jade Sea, which is to say on top of a toll booth between two halves of the world. Three walls, thirteen milk-white towers, and the whole trade of the east passing through: it did not need to conquer anything and never seriously tried.",
      "Its power is held by three groups who dislike each other in a stable way — the Pureborn, the Thirteen, and the Tourmaline Brotherhood — and its warlocks were once genuinely feared and are, by the time this chronicle reaches them, mostly a smell of dust and a very good trick.",
      "The city is famous for its manners, its silks and its capacity to be perfectly polite while declining to help you.",
    ],
    pop: [[-500, 100000], [-102, 300000], [1, 500000], [200, 700000], [298, 800000]],
  },

  ibbenese: {
    name: "Ib", short: "Ib", kind: "island realm",
    color: "#4A5A5E", when: "Since the deep past",
    blurb: "A cold, forested island in the Shivering Sea whose people hunt whales and keep entirely to themselves.",
    paras: [
      "The Ibbenese are broad, hairy, short-legged and famously strong, speak a tongue related to nothing, and have hunted the whale in the Shivering Sea since before anyone was writing things down. Their island is thickly forested, their city is called Port Ibben, and their ships smell so strongly of whale oil that they are identifiable at a distance in fog.",
      "They have no empire, no interest in one, and no part in any of the wars in this chronicle. They appear here because they are on the map, which is more than can be said for several kingdoms that thought themselves very important.",
    ],
    pop: [[-3000, 200000], [1, 400000], [298, 500000]],
  },
};

/* ---------------------------------------------------------------------------
   WHERE TO READ MORE

   Several of these powers already have a page in the wiki — the Night's Watch
   and the free folk are orders in js/groups.js, the great houses are in
   js/data.js, Stannis and Renly are people. This file does NOT mint a second
   page for any of them; it points at the one that exists. (Duplicate pages for
   one subject is a mistake this site has made before and does not repeat.)

   Everything else gets an article of its own, built from the prose above by
   js/col/peoples.js. `page: true` is what marks it.
   --------------------------------------------------------------------------- */
(function () {
  var LINKED = {
    children:       "wiki.html#group=old-ones",
    others:         "wiki.html#group=old-ones",
    "free-folk":    "wiki.html#group=free-folk",
    "nights-watch": "wiki.html#group=nights-watch",
    dothraki:       "wiki.html#group=dothraki",
    slavers:        "wiki.html#group=slavers-bay",
    stark:          "wiki.html#house=stark",
    arryn:          "wiki.html#house=arryn",
    lannister:      "wiki.html#house=lannister",
    martell:        "wiki.html#house=martell",
    targaryen:      "wiki.html#house=targaryen",
    greyjoy:        "wiki.html#house=greyjoy",
    frey:           "wiki.html#house=frey",
    bolton:         "wiki.html#group=bolton",
    renly:          "wiki.html#char=Renly%20Baratheon",
    stannis:        "wiki.html#char=Stannis%20Baratheon",
  };
  Object.keys(window.TL_POWERS).forEach(function (k) {
    var p = window.TL_POWERS[k];
    if (LINKED[k]) { p.wiki = LINKED[k]; p.page = false; }
    else { p.wiki = "wiki.html#people=" + k; p.page = true; }
  });
})();
