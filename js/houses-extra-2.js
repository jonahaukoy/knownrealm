/* EXTRA HOUSES — BATCH TWO. More landed and lesser houses of Westeros, beyond
   the Crownlands batch in houses-extra.js. Same schema and same wiki engine:
     { id, name, region, seat, words?, liege?, sigil, blurb, paras? }
   Sigils point at assets/sigils/new/<id>.webp; where the art is not yet drawn,
   the wiki falls back to an elegant blank crest. All prose original to this site.

   This batch: Dorne, the Iron Islands, more of the Crownlands, and the North —
   the houses with real story behind them. More regions and houses to follow. */
window.EXTRA_HOUSES = (window.EXTRA_HOUSES || []).concat([

  /* ================= DORNE ================= */
  {
    id: "dayne", name: "House Dayne", region: "dorne", seat: "Starfall",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/dayne.webp",
    blurb: "An ancient Dornish house at Starfall on the Torentine, keepers of the pale sword Dawn and the title that goes with it — Sword of the Morning.",
    paras: [
      "House Dayne is older than the Andals and older than the kings, and unlike any other house in Westeros it carries a Valyrian-quality blade that is not Valyrian at all: Dawn, forged from the heart of a fallen star, milk-pale and impossibly sharp. Dawn is not handed down like an ordinary heirloom. Only a Dayne judged worthy may wield it, and that knight takes the title Sword of the Morning — a distinction rare enough that centuries can pass between one and the next.",
      "The most famous of them was Ser Arthur Dayne, the finest knight of his age, who wore the white cloak of Aerys's Kingsguard and died at the Tower of Joy at the end of Robert's Rebellion — cut down, the histories say, by Eddard Stark and his companions, though the manner of it is a wound the North does not like to reopen. His sister Ashara Dayne, a beauty spoken of long after her death, and the shadow of what happened at that tower, hang over the house still. Starfall keeps Dawn, and waits for the next worthy hand.",
    ],
  },
  {
    id: "yronwood", name: "House Yronwood", region: "dorne", seat: "Yronwood",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/yronwood.webp",
    blurb: "The Bloodroyal — once kings in their own right, and still the greatest Dornish house after the Martells, with more swords than Sunspear itself.",
    paras: [
      "Before the Rhoynar came and the Martells united Dorne, the Yronwoods were kings, styled the Bloodroyal, ruling the largest and most fertile part of the land from their castle of Yronwood in the eastern Dornish hills. They never entirely forgot it. Even sworn to Sunspear, the Yronwoods can field more spears than their overlords, and that arithmetic makes every Martell prince careful with them — a bannerman who could raise a rebellion is a bannerman you flatter, not one you slight.",
      "The blood between the two houses runs hot as well as proud. It was a Yronwood who killed Prince Oberyn Martell's paramour-in-arms in a duel that began as first blood and did not stop there, a grudge the Red Viper carried for the rest of his short, venomous life. To be fostered at Yronwood is an honour and a hostage-taking both, and the house's loyalty to Dorne has always been a thing measured rather than assumed.",
    ],
  },
  {
    id: "uller", name: "House Uller", region: "dorne", seat: "the Hellholt",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/uller.webp",
    blurb: "The hot-tempered lords of the Hellholt on the Brimstone, of whom it is said that half are half-mad, and the other half worse.",
    paras: [
      "The Ullers hold the Hellholt, a grim seat on the poisoned river Brimstone in the deep Dornish desert, and they have a reputation across the realm for tempers as harsh as their lands. \"Half the Ullers are half-mad,\" runs the saying, \"and the other half are worse\" — the kind of thing a house lives up to whether it wants to or not.",
      "The most notorious Uller of the age is Ellaria Sand, natural daughter of the lord of the Hellholt and paramour of Prince Oberyn Martell. In the books Ellaria is a voice of mercy, begging Dorne not to answer her lover's death with more slaughter; on the screen she becomes the opposite, seizing the venom of the Dornish cause and turning it, disastrously, on the innocent. Either way the Hellholt's blood ran through the heart of Dorne's quarrel with the crown.",
    ],
  },
  {
    id: "fowler", name: "House Fowler", region: "dorne", seat: "Skyreach",
    words: "Let Me Soar", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/fowler.webp",
    blurb: "Wardens of the Prince's Pass, whose castle guards the mountain road into Dorne, and whose twin daughters ride as the Sand Snakes' companions.",
    paras: [
      "Skyreach sits high in the Red Mountains astride the Prince's Pass, one of the only ways an army may march into Dorne from the Reach — which makes House Fowler the door-warden of the realm's most defensible kingdom. Their words, Let Me Soar, and their winged sigil suit a house that has looked down on invading hosts from a great height for thousands of years, and rolled boulders onto them.",
      "The Fowlers have old blood-ties to the Yronwoods and old feuds with the Reach houses across the mountains, particularly the Carons. In the recent tale the twin Fowler daughters, Jeyne and Jennelyn, ride among the wild company of Prince Oberyn's bastard daughters — reminders that in Dorne a highborn woman is as likely to carry a blade as a needle.",
    ],
  },
  {
    id: "manwoody", name: "House Manwoody", region: "dorne", seat: "Kingsgrave",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/manwoody.webp",
    blurb: "A house of the Dornish marches at the grim-named castle of Kingsgrave, loyal spears of Sunspear in every war against the Reach and the crown.",
    paras: [
      "Kingsgrave takes its name from an old story — a marcher king of the Reach buried where he fell trying to take it — and the Manwoodys have held that unforgiving stretch of the Red Mountains ever since. Theirs is a hard border country, forever raided and raiding, and the house has the flinty reputation of the marcher lords who live it.",
      "The Manwoodys rode with Prince Oberyn to the capital and stood with Dorne through the long cold war that followed the Red Viper's death, the kind of steady, unglamorous bannermen a prince counts on when the flashier houses are busy nursing grudges.",
    ],
  },
  {
    id: "qorgyle", name: "House Qorgyle", region: "dorne", seat: "Sandstone",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/qorgyle.webp",
    blurb: "Lords of Sandstone in the deep sands, whose three scorpions on a field of red warn plainly enough what waits for those who cross the desert to their gates.",
    paras: [
      "Sandstone stands alone in the dunes of the central Dornish desert, and the Qorgyles who hold it have made a virtue of the emptiness around them — an army that reaches their walls has already been half-beaten by the sun and the sand. Their sigil of three black scorpions is one of the more honest coats of arms in the realm.",
      "The Qorgyles are old and trusted Martell bannermen; a Qorgyle served for years as castellan of Sunspear and tutor to the prince's household, the sort of quiet, deep loyalty that binds Dorne together beneath its reputation for hot-blooded feud.",
    ],
  },
  {
    id: "allyrion", name: "House Allyrion", region: "dorne", seat: "Godsgrace",
    words: "No Foe May Pass", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/allyrion.webp",
    blurb: "Lords of Godsgrace on the Greenblood, a wealthy Dornish house whose heir wandered the world as a hedge knight before coming home to his inheritance.",
    paras: [
      "Godsgrace guards a crossing of the Greenblood, the great river down which the orphans of the Rhoyne pole their boats, and House Allyrion has grown rich on that traffic. The Lady Delonne rules there in the books, and her son Ser Ryon Allyrion is her heir.",
      "The house's most colourful son, Ser Daemon Sand, is a bastard of Godsgrace raised alongside the prince's children and made a knight — a Dornish Sand who earned his spurs and his place at court, the sort of story Dorne tells about itself to explain why its bastards are not the shameful things they are counted elsewhere.",
    ],
  },
  {
    id: "toland", name: "House Toland", region: "dorne", seat: "Ghost Hill",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/toland.webp",
    blurb: "Lords of Ghost Hill on the Sea of Dorne, whose coiling dragon sigil recalls a champion who danced with a foe until the man died of exhaustion.",
    paras: [
      "House Toland holds Ghost Hill in the green eastern reaches of Dorne, near the coast, and their green dragon biting its own tail commemorates an old tale: a Toland champion who, faced with a stronger foe, fenced and circled and gave ground until the enemy wore himself into the grave. It is a very Dornish way to win.",
      "Lady Nymella Toland stands among the loyal bannermen of Sunspear in the recent histories, one more of the steady southern houses that give Dorne its patient, waiting strength.",
    ],
  },
  {
    id: "wyl", name: "House Wyl", region: "dorne", seat: "the Boneway",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/wyl.webp",
    blurb: "Marcher lords of the Boneway with a black reputation earned over centuries of border war — the house of the infamous Wyl of Wyl.",
    paras: [
      "House Wyl guards the Boneway, the eastern mountain road into Dorne, and has spent its whole history bleeding the stormlanders and Reachmen who tried to force it. The house's name is a byword for cruelty in the marches thanks to one ancestor, remembered only as the Wyl of Wyl, whose atrocities against captured knights and their families the songs of the Reach still curse.",
      "A hard road makes hard lords, and the Wyls have never much cared what their neighbours to the north think of them — the Boneway has swallowed a great many invading hosts, and a house that holds it need not be loved.",
    ],
  },
  {
    id: "jordayne", name: "House Jordayne", region: "dorne", seat: "the Tor",
    words: "Let It Be Written", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/jordayne.webp",
    blurb: "Lords of the Tor, a lettered and cultured Dornish house whose words fit a family that has always valued the pen alongside the spear.",
    paras: [
      "The Jordaynes hold the Tor in the green lands near the Sea of Dorne, and their motto, Let It Be Written, marks them as a house that keeps its histories and grudges in ink. Lord Trebor Jordayne and his sharp-witted daughter Myria are among the Dornish notables of the age.",
      "In a kingdom famous for its heat and its feuds, the Jordaynes cultivate a reputation for learning and long memory — which, in Dorne, is only another kind of patience, and patience is the deadliest Dornish weapon of all.",
    ],
  },
  {
    id: "gargalen", name: "House Gargalen", region: "dorne", seat: "Salt Shore",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/gargalen.webp",
    blurb: "Lords of Salt Shore on the Dornish coast, whose cockatrice sigil warns of a house as venomous as its desert home.",
    paras: [
      "Salt Shore sits on the hot southern coast of Dorne, and House Gargalen has held it long enough to be counted among the principality's steadier bannermen. Their red-and-black cockatrice — a serpent with a rooster's head, deadly in legend — is a fittingly Dornish choice for a house of the salt and the sand.",
      "The Gargalens stood among the lords who answered Sunspear's call through the long quarrel with the Iron Throne, one more thread in the patient net Dorne weaves around its enemies.",
    ],
  },
  {
    id: "dalt", name: "House Dalt", region: "dorne", seat: "Lemonwood",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/dalt.webp",
    blurb: "The Knights of Lemonwood, a respected Dornish house of the green coast near Sunspear whose lord is close in the counsels of the prince.",
    paras: [
      "Lemonwood lies on the coast a short ride from Sunspear itself, its groves scenting the sea air, and its lords — styled Knights of Lemonwood rather than the grander titles some houses claim — sit close to the ear of the ruling prince. Ser Deziel Dalt, the Lemonknight, is remembered in Dornish song.",
      "Proximity to Sunspear makes the Dalts both trusted and watched: near enough to be useful, near enough to be dangerous, which in Dornish politics amounts to the same careful courtesy the Martells extend to all their stronger bannermen.",
    ],
  },
  {
    id: "santagar", name: "House Santagar", region: "dorne", seat: "Spottswood",
    words: "", liege: "House Martell of Sunspear", sigil: "assets/sigils/new/santagar.webp",
    blurb: "Lords of Spottswood, a lesser Dornish house whose spotted-cat sigil suits the dry hunting country they hold.",
    paras: [
      "The Santagars hold Spottswood in the green-and-brown country of central Dorne, and their sigil — a black-and-white spotted cat, a shadowcat of the mountains — marks a house of hunters and hill-fighters. Ser Sylva Santagar, called Spotted Sylva for her freckles, rides among the young Dornish nobles of the recent tale.",
      "Like most of the middling Dornish houses, the Santagars matter less for their own deeds than for the weight they add when Sunspear counts its spears — and in Dorne, the counting is always quietly going on.",
    ],
  },

  /* ================= THE IRON ISLANDS ================= */
  {
    id: "harlaw", name: "House Harlaw", region: "iron-islands", seat: "Ten Towers",
    words: "", liege: "House Greyjoy of Pyke", sigil: "assets/sigils/new/harlaw.webp",
    blurb: "The largest and steadiest of the ironborn houses, seated at Ten Towers on Harlaw — and, improbably, the home of the isles' most bookish lord.",
    paras: [
      "House Harlaw holds the island of Harlaw and the seat of Ten Towers, and commands more wealth and more men than any ironborn house save the Greyjoys themselves. Their Valyrian sword, Nightfall, and their long unbroken line make them the anchor the other salt-lords swing around at every kingsmoot.",
      "Their lord, Rodrik Harlaw, is called the Reader — a man who keeps the finest library in the islands and would rather win by wit than by axe, which his own countrymen count a shameful eccentricity. Rodrik thinks the reaving life a dead end and says so, calmly, in halls full of men who want to strike him for it. As uncle to Asha Greyjoy, he is one of the few voices of sense in a culture that prizes plunder over sowing.",
    ],
  },
  {
    id: "hoare", name: "House Hoare", region: "iron-islands", seat: "Harrenhal (formerly)",
    words: "", liege: "extinct", sigil: "assets/sigils/new/hoare.webp",
    blurb: "The extinct line of the old ironborn kings, who ruled the Iron Islands and the riverlands both — until Harren the Black raised Harrenhal, and a dragon burned him inside it.",
    paras: [
      "For centuries the Hoares were kings of the Iron Islands, and at their height they ruled the riverlands as well, holding the greenlands under the black iron heel. Their last and greatest folly was Harren the Black, who spent a generation and untold lives raising Harrenhal, the largest castle ever built in Westeros, its five towers meant to stand against any siege.",
      "Harren finished his monster of a castle in the same year Aegon the Conqueror came ashore. When Harren refused to kneel, Aegon flew the dragon Balerion over the walls the ironborn king had thought impregnable and burned him and his sons alive inside them. The Hoares died with him, the riverlands were freed, and Harrenhal has been a haunted, half-melted ruin — and a curse on whoever holds it — ever since.",
    ],
  },
  {
    id: "drumm", name: "House Drumm", region: "iron-islands", seat: "Old Wyk",
    words: "", liege: "House Greyjoy of Pyke", sigil: "assets/sigils/new/drumm.webp",
    blurb: "An old and proud ironborn house of Old Wyk, keepers of the Valyrian sword Red Rain, which they say an ancestor took the honest way — by reaving.",
    paras: [
      "House Drumm holds land on Old Wyk, the holiest of the Iron Islands, and among their treasures is the red-tinged Valyrian blade Red Rain. The Drumms insist it was won the proper ironborn way: taken in battle from an Andal knight by their ancestor Hilmar Drumm, called the Cunning, who is said to have done it while armed with almost nothing — a tale told to prove that cleverness beats good steel, and told very often.",
      "The head of the house in the recent tale is old, stubborn Dunstan Drumm, a hard traditionalist who was among the claimants at the kingsmoot on Old Wyk. To the Drumms, a sword taken by reaving is worth more than any bought with gold — which is the whole ironborn creed distilled into a single heirloom.",
    ],
  },
  {
    id: "goodbrother", name: "House Goodbrother", region: "iron-islands", seat: "Hammerhorn",
    words: "", liege: "House Greyjoy of Pyke", sigil: "assets/sigils/new/goodbrother.webp",
    blurb: "The largest house on Great Wyk, seated at Hammerhorn — numerous, scattered, and reliably among the loudest voices at any kingsmoot.",
    paras: [
      "The Goodbrothers hold Hammerhorn in the rugged hills of Great Wyk, the biggest of the Iron Islands, and are so numerous — with cadet branches at Downdelving, Crow Spike Keep and the Shatterstone — that a man can hardly throw a stone on Great Wyk without hitting one. Their sigil is a black war-horn banded in gold on blood red.",
      "Lord Gorold Goodbrother sends his sons and his questions to the maesters and the priests alike, and the house's many spears make it a bannerman no aspiring King of the Isles can afford to ignore. At a kingsmoot, numbers speak, and the Goodbrothers have always had numbers.",
    ],
  },
  {
    id: "blacktyde", name: "House Blacktyde", region: "iron-islands", seat: "Blacktyde",
    words: "", liege: "House Greyjoy of Pyke", sigil: "assets/sigils/new/blacktyde.webp",
    blurb: "Lords of the island of Blacktyde, unusual among the ironborn for having set aside the Drowned God for the Faith of the Seven — and unusual again for what it cost them.",
    paras: [
      "House Blacktyde holds its own black island in the north of the archipelago, and its lord in the recent tale, Baelor Blacktyde, is a rarity: an ironborn who spent years as a hostage in the green lands, came home a follower of the Seven, and cut his hair and put aside the old reaving ways. Among the salt-lords, that made him a soft and suspect figure.",
      "Baelor stood against Euron Greyjoy at the kingsmoot and paid for it. Euron is not a man who forgives opposition, and the fate the Crow's Eye handed the pious lord of Blacktyde was a warning to every other captain who might think of crossing him — a reminder that on the Iron Islands the old god is still very much in charge.",
    ],
  },
  {
    id: "codd", name: "House Codd", region: "iron-islands", seat: "Great Wyk",
    words: "Though All Men Do Despise Us", liege: "House Greyjoy of Pyke", sigil: "assets/sigils/new/codd.webp",
    blurb: "A despised ironborn house whose own words admit as much — descended, the other captains sneer, from a thrall and a salt wife rather than from proper reaver stock.",
    paras: [
      "Few houses own their low reputation as frankly as the Codds, whose words are the extraordinary Though All Men Do Despise Us. The other ironborn hold that the Codds descend not from a conqueror but from a thrall — a slave — and a salt wife, and in a culture obsessed with the Old Way and the iron price, no insult cuts deeper.",
      "And yet the Codds endure, and turn up in the reaving fleets and at the kingsmoots regardless, a house that has decided the world's contempt is simply weather to be sailed through. Ser Harras Harlaw's man-at-arms and the odd Codd captain crop up in the recent histories, despised and undeterred.",
    ],
  },
  {
    id: "botley", name: "House Botley", region: "iron-islands", seat: "Lordsport",
    words: "", liege: "House Greyjoy of Pyke", sigil: "assets/sigils/new/botley.webp",
    blurb: "Lords of Lordsport on Pyke itself, close bannermen of the Greyjoys — which, under a king as jealous as Euron, proved a dangerous place to stand.",
    paras: [
      "House Botley holds Lordsport, the harbour town on Pyke where the ironborn beach their longships beneath the Greyjoys' own castle, which makes them the Greyjoys' nearest and most useful bannermen. Sawane Botley was drowned on the orders of Balon Greyjoy for arguing over a crown; his kin remembered it.",
      "When Euron Greyjoy seized the Seastone Chair, Lord Tristifer Botley's loyalties and his love for Asha Greyjoy put him on the wrong side of the Crow's Eye, and the house learned again the old lesson of Lordsport: to sit closest to the Greyjoys is to sit closest to the drowning.",
    ],
  },
  {
    id: "merlyn", name: "House Merlyn", region: "iron-islands", seat: "Pebbleton",
    words: "", liege: "House Greyjoy of Pyke", sigil: "assets/sigils/new/merlyn.webp",
    blurb: "Lords of Pebbleton on Great Wyk, a substantial ironborn house of many small holdings and many longships.",
    paras: [
      "The Merlyns hold Pebbleton on Great Wyk, and Lord Meldred Merlyn — Quellon, to his fellow captains — commands a respectable fleet, enough that his voice carries at a gathering of the salt-lords. Their green sigil marks a house grown fat, by ironborn standards, on the reaving trade.",
      "Like the other captains of Great Wyk, the Merlyns rise and fall with the fortunes of whoever sits the Seastone Chair, sending their ships out to reave when the reaving is good and their heads down when the drowned god's chosen turns jealous.",
    ],
  },
  {
    id: "sunderly", name: "House Sunderly", region: "iron-islands", seat: "Saltcliffe",
    words: "", liege: "House Saltcliffe", sigil: "assets/sigils/new/sunderly.webp",
    blurb: "A small ironborn house of the island of Saltcliffe, of the old reaving stock, sworn beneath one of the drowned god's steadier lordships.",
    paras: [
      "The Sunderlys are a minor house of the small, wind-scoured island of Saltcliffe, one of the many lesser captains who make up the true strength of an ironborn fleet — men with a longship, a crew, and a grievance, waiting for a king to point them at the green lands.",
      "Their name surfaces among the salt wives and marriage-alliances that knit the ironborn houses together, the quiet weaving of blood that decides, as much as any axe, who will stand with whom when the horns blow for a kingsmoot.",
    ],
  },
  {
    id: "volmark", name: "House Volmark", region: "iron-islands", seat: "Harlaw",
    words: "", liege: "House Harlaw of Ten Towers", sigil: "assets/sigils/new/volmark.webp",
    blurb: "A house of Harlaw with a claim, through the female line, to the blood of the old Hoare kings — a claim they have never entirely let go of.",
    paras: [
      "The Volmarks hold land on the island of Harlaw beneath the great house of the same island, and they carry something few ironborn houses can boast: descent, through a daughter, from the extinct royal Hoares. A dozen generations on, the boldest Volmarks still mutter that the black blood of the old kings runs truer in their veins than in the Greyjoys'.",
      "It is the kind of quiet, ancient claim that means nothing until the day it means everything — the sort of thread a clever man like Euron Greyjoy keeps track of, in case a rival ever needs undermining or a marriage ever needs making.",
    ],
  },
  {
    id: "wynch", name: "House Wynch", region: "iron-islands", seat: "Iron Holt",
    words: "", liege: "House Greyjoy of Pyke", sigil: "assets/sigils/new/wynch.webp",
    blurb: "Lords of Iron Holt on Pyke, an old and respectable ironborn house whose lord was reckoned a possible king before Euron came home.",
    paras: [
      "House Wynch holds Iron Holt on the main island of Pyke, close to the Greyjoys, and Lord Waldon Wynch is counted among the more substantial captains of the isles — enough that his name was spoken, quietly, as a possible choice at the kingsmoot before the Crow's Eye blew his dragon horn and settled the matter his own way.",
      "The Wynches embody the ordinary strength of the ironborn: no famous sword, no royal claim, just a hard island keep, a fleet of longships, and generations of men who have never known any trade but the sea and the sword.",
    ],
  },
  {
    id: "sparr", name: "House Sparr", region: "iron-islands", seat: "Great Wyk",
    words: "", liege: "House Greyjoy of Pyke", sigil: "assets/sigils/new/sparr.webp",
    blurb: "An ironborn house of Great Wyk whose lord, styled simply the Sparr, is old enough and stubborn enough to have thrown his own name into a kingsmoot.",
    paras: [
      "The Sparrs hold a stretch of Great Wyk, and their aging lord — known plainly as the Sparr — stood among the claimants when the ironborn last gathered to choose a king by acclaim, a grey-bearded traditionalist for whom the Old Way is not nostalgia but simple sense.",
      "Houses like the Sparr are the ballast of the Iron Islands: never going to rule, never going to submit tamely either, forever grumbling about the softness of the young and the folly of kings while sharpening their axes for the next reaving all the same.",
    ],
  },

  /* ================= THE CROWNLANDS (more) ================= */
  {
    id: "celtigar", name: "House Celtigar", region: "the-crownlands", seat: "Claw Isle",
    words: "", liege: "The Iron Throne", sigil: "assets/sigils/new/celtigar.webp",
    blurb: "An old house of Valyrian descent on Claw Isle in Blackwater Bay, rich, proud, and keepers of a Valyrian axe called Red Rain's cousin.",
    paras: [
      "The Celtigars came out of Valyria alongside the Targaryens and settled Claw Isle in Blackwater Bay, and they have never let anyone forget the antiquity of their blood. Their red crab sigil flies over a house famous chiefly for its wealth and its love of it — Lord Ardrian Celtigar was mocked even by his allies for taxing everything down to the firewood and the crab-pots.",
      "For their Valyrian roots the Celtigars kept treasures from the old Freehold, including a Valyrian steel axe, and they were staunch men of the blacks in the Dance of the Dragons. In the recent wars they declared for Stannis Baratheon and shared in his defeat, an old and grasping house forever backing the losing dragon.",
    ],
  },
  {
    id: "darklyn", name: "House Darklyn", region: "the-crownlands", seat: "Duskendale (formerly)",
    words: "", liege: "extinct", sigil: "assets/sigils/new/darklyn.webp",
    blurb: "The extinguished lords of Duskendale, once kings of the narrow sea, undone in a single stroke by the folly of the Defiance of Duskendale.",
    paras: [
      "Before the Targaryens, the Darklyns were kings at Duskendale, the old port town on the Bay of Crabs, and even as lords under the dragon they remained proud, ancient, and rich on the trade that passed their walls. All of it ended in the reign of Aerys the Second, in the disaster the histories call the Defiance of Duskendale.",
      "Lord Denys Darklyn, chafing at royal taxes, seized the person of the king himself when Aerys came to hear his grievance, and held him captive for half a year. When Ser Barristan Selmy at last rescued the king by stealth, Aerys took a terrible revenge: House Darklyn was extinguished root and branch, every man, woman and child of the line put to death. The town passed to other hands, and the king's captivity is widely blamed for tipping Aerys the rest of the way into madness.",
    ],
  },
  {
    id: "slynt", name: "House Slynt", region: "the-crownlands", seat: "Harrenhal (briefly)",
    words: "", liege: "The Iron Throne", sigil: "assets/sigils/new/slynt.webp",
    blurb: "A jumped-up house of a single generation, raised from the gutter to a lordship and the ruin of Harrenhal — and cut down almost as fast at the Wall.",
    paras: [
      "House Slynt is the whole cynical machinery of King's Landing in one small, sordid story. Janos Slynt was a butcher's son who climbed the City Watch of the capital to its command, and learned early that gold cloaks answer to gold. For selling his loyalty — and betraying Eddard Stark — at the right moment, he was raised to lordship and granted Harrenhal itself, a beggar handed a castle for a well-timed treachery.",
      "The Lannisters found him too crude to keep, and shipped the new-minted lord off to the Wall to be rid of him. There his habit of buying and bullying met a different kind of authority: when Janos Slynt refused a direct order and sneered at a boy commander, Jon Snow took his head with his own sword. The house rose and fell inside a single lifetime — heraldry for a family that never should have had any.",
    ],
  },
  {
    id: "bar-emmon", name: "House Bar Emmon", region: "the-crownlands", seat: "Sharp Point",
    words: "", liege: "House Baratheon of Dragonstone", sigil: "assets/sigils/new/bar-emmon.webp",
    blurb: "Lords of Sharp Point at the mouth of the Blackwater, a minor Crownlands house sworn to Dragonstone and led, in the recent tale, by a boy.",
    paras: [
      "House Bar Emmon holds Sharp Point, the promontory that guards the seaward approach to the Blackwater Rush, which gives a small house an outsized strategic weight — whoever holds Sharp Point watches every ship bound for King's Landing. They are sworn to Dragonstone rather than directly to the throne.",
      "In the War of the Five Kings the house was led by a child, Lord Duram Bar Emmon, so that its banners followed wherever its regents and overlords pointed them — first to Stannis, then, after the Blackwater, wherever survival lay. Small houses on great sea-lanes rarely get to choose their wars.",
    ],
  },
  {
    id: "sunglass", name: "House Sunglass", region: "the-crownlands", seat: "Sweetport Sound",
    words: "", liege: "House Baratheon of Dragonstone", sigil: "assets/sigils/new/sunglass.webp",
    blurb: "A pious house of Sweetport Sound sworn to Dragonstone, whose lord learned too late what it costs to keep faith with the Seven under a red priestess's eye.",
    paras: [
      "House Sunglass holds Sweetport Sound near Dragonstone, and takes its devout reputation from its very sigil, and its history is a small tragedy of the Faith. When Stannis Baratheon took the Lord of Light as his god and let Melisandre burn the images of the Seven on the shore, Lord Guncer Sunglass protested — quietly, on grounds of conscience.",
      "For that protest Stannis had him arrested, and the red priestess had him burned, his lands and his life forfeit to a new god he would not accept. It was one of the first of Melisandre's fires, and a warning to every other lord of Dragonstone that the age of gentle faith on that island was over.",
    ],
  },
  {
    id: "chelsted", name: "House Chelsted", region: "the-crownlands", seat: "Chelsted",
    words: "", liege: "The Iron Throne", sigil: "assets/sigils/new/chelsted.webp",
    blurb: "A minor Crownlands house whose lord served briefly and bravely as Aerys the Mad King's Hand — and burned for the courage of asking a single question.",
    paras: [
      "House Chelsted would be a forgotten name but for the manner of one lord's death. Qarlton Chelsted served as Hand of the King to Aerys the Second in the mad king's final year, and when he discovered the caches of wildfire the king's pyromancers were secreting beneath King's Landing, he understood at last what Aerys meant to do with them.",
      "Chelsted resigned the Handship, threw down his chain of office, and for that defiance Aerys had him burned alive — one more of the men who fed the king's growing hunger for fire. That he grasped the plot to burn the whole city, and died rather than serve it, is nearly all history remembers of the house, and nearly enough.",
    ],
  },
  {
    id: "brune", name: "House Brune", region: "the-crownlands", seat: "the Dyre Den",
    words: "", liege: "The Iron Throne", sigil: "assets/sigils/new/brune.webp",
    blurb: "An ancient, obscure house of Crackclaw Point at the Dyre Den, First Men to the bone, who answer only to the Iron Throne and no lord between.",
    paras: [
      "House Brune holds the Dyre Den on Crackclaw Point, the wild, boggy, half-forgotten cape northeast of King's Landing whose houses cling fiercely to a peculiar independence — they bent the knee to Aegon the Conqueror himself and insist they owe fealty to no one but the dragon, no petty lord in between. The Brunes, of old First Men stock, are among the proudest of them.",
      "There are two branches, the landed Brunes of the Dyre Den and the poorer Brunes of Brownhollow, and the crab-eating men of Crackclaw Point turn up as loyal, prickly, and easily offended whenever the throne remembers they exist — which is seldom, exactly as they prefer it.",
    ],
  },
  {
    id: "buckwell", name: "House Buckwell", region: "the-crownlands", seat: "the Antlers",
    words: "Pride and Purpose", liege: "The Iron Throne", sigil: "assets/sigils/new/buckwell.webp",
    blurb: "Lords of the Antlers in the kingswood, a Crownlands house of hunters close enough to the capital to be forever in and out of its intrigues.",
    paras: [
      "House Buckwell holds the Antlers, a seat in the wooded hills of the Crownlands north of the kingswood, close enough to King's Landing that its lords are regular figures at court. Their words, Pride and Purpose, and their antlered sigil suit a house of the hunt.",
      "Being near the throne is a mixed blessing for a middling house: it means influence when the wind is fair and danger when it turns, and the Buckwells have spent generations reading the court's weather and trimming their sails to whichever king or queen holds the Red Keep that season.",
    ],
  },
  {
    id: "bywater", name: "House Bywater", region: "the-crownlands", seat: "near King's Landing",
    words: "", liege: "The Iron Throne", sigil: "assets/sigils/new/bywater.webp",
    blurb: "A small Crownlands house that gave the City Watch one of its rare honest commanders when the capital needed one most.",
    paras: [
      "House Bywater is a minor Crownlands family, but it earned a place in the chronicle through Ser Jacelyn Bywater, called Ironhand for the iron hand he wore in place of one lost at the Trident. When Tyrion Lannister needed a commander of the gold cloaks he could actually trust after Janos Slynt's corruption, he found one in Bywater.",
      "Ironhand held the walls during the battle on the Blackwater with a rare and unfashionable integrity — and was murdered for it by his own mutinous men in the chaos of victory, which is roughly what an honest man's loyalty was worth in King's Landing in those years.",
    ],
  },

  /* ================= THE NORTH ================= */
  {
    id: "umber", name: "House Umber", region: "the-north", seat: "Last Hearth",
    words: "", liege: "House Stark of Winterfell", sigil: "assets/sigils/new/umber.webp",
    blurb: "The giant-blooded lords of Last Hearth in the farthest north, great drinkers and greater fighters, among the fiercest of the Starks' bannermen.",
    paras: [
      "House Umber holds Last Hearth in the cold northeastern corner of the North, closest of the great houses to the Wall, and the Umbers are built to match their country: huge, loud, hard-drinking men who claim giant's blood and mostly look the part. Their sigil is a roaring giant breaking his chains.",
      "The Greatjon, Lord Umber, was among the loudest to hail Robb Stark King in the North — after first losing two fingers to Robb's direwolf for drawing steel at the table, then laughing about it. But the far north is exposed, and by the war of the dead the Umbers were split and broken, some bending to the Boltons, the last of the line a small boy whose fate at Last Hearth became one of the grimmest omens of the coming winter.",
    ],
  },
  {
    id: "ryswell", name: "House Ryswell", region: "the-north", seat: "the Rills",
    words: "", liege: "House Stark of Winterfell", sigil: "assets/sigils/new/ryswell.webp",
    blurb: "Horse-lords of the Rills in the western North, a house of many branches and many colours whose daughters married cannily into greater power.",
    paras: [
      "House Ryswell holds the Rills, the rolling horse country of the western North, and breeds some of the finest mounts north of the Neck. The house is oddly fond of variety — its members fly the running horse-head in different colours according to their branch, red, grey, brown, black and gold, as if unable to agree on a single banner.",
      "The Ryswells' real weapon has always been marriage. Lord Roose Bolton took a Ryswell to wife, and the shrewd, bitter Lady Barbrey Dustin was born a Ryswell of the Rills — which places the horse-lords quietly at the elbow of the North's most dangerous schemers during the ruin of the Starks, a middling house punching well above its weight through the beds of its daughters.",
    ],
  },
  {
    id: "tallhart", name: "House Tallhart", region: "the-north", seat: "Torrhen's Square",
    words: "Proud and Free", liege: "House Stark of Winterfell", sigil: "assets/sigils/new/tallhart.webp",
    blurb: "Masters of Torrhen's Square, a sturdy northern house sworn to Winterfell that gave its strength — and very nearly its whole line — to the Young Wolf's war.",
    paras: [
      "House Tallhart holds Torrhen's Square west of Winterfell, and its masters — they claim the humbler style of master rather than lord — are steady, unglamorous bannermen of the Starks, the kind of house on which the North's real strength rests. Their sigil is three sentinel trees on grey.",
      "The war unmade them. Ser Helman Tallhart marched south with Robb Stark; his brother Leobald and the household left behind were caught up in the ironborn seizure of the North and the Bolton treacheries that followed, and the house was gutted almost to extinction — one more proud northern name that answered its liege's call and paid for it with nearly everything.",
    ],
  },
]);
