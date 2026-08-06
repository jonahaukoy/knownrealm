/* THE WHITE BOOK — I. The Conquest and the Long Peace.
   Every word here is original to this site. Nothing is copied from any wiki.

   Shape (see js/whitebook-engine.js for the full contract):
     { id, name, house, epithet, era, arms, armsGlyph, blazon, served: [],
       lordCommander, raised, note, entry: [], fate: [], wiki } */

(window.WHITE_BOOK = window.WHITE_BOOK || []).push(

  /* ===================== THE CONQUEST — AEGON I ========================== */

  { id: "corlys-velaryon-kg", wiki: "hotd/wiki.html#char=Corlys Velaryon", name: "Ser Corlys Velaryon", house: "Velaryon of Driftmark",
    epithet: "The first of the seven", era: "The Conquest — Aegon I",
    armsGlyph: "⚓",
    blazon: "A silver seahorse upon a sea-green field.",
    served: ["Aegon I"], lordCommander: true, raised: "10 AC, at the first swearing",
    note: "The first Lord Commander",
    entry: [
      "Of the ancient Valyrian house of Driftmark, sworn to the dragon before ever the dragon had a throne. The order he was to command did not yet exist when he was born; it was made because knives had come close. After men with Dornish gold in their purses tried for the king’s life in the streets of his own half-built city, Queen Visenya told her brother-husband that a king with a hundred guards has no guard at all, and that seven would serve better. Aegon listened. Seven were chosen, and it was Ser Corlys who knelt first, and so his is the first name in this book.",
      "It fell to him to invent what the rest of us have only inherited. The vows themselves — to serve for life, to take no wife, hold no lands, father no children, and keep the king’s secrets to the grave — were set down in his time, and he is said to have argued for every clause of them. A guard that can be bribed with a lordship is no guard at all. The white cloak, the white armour, the plain unadorned shield: all of it dates from those first years, and all of it was meant to say that a man who wears it has nothing else left to want.",
      "He commanded the seven through the long stretch of years in which the Conquest was still being finished with fire, and he is remembered chiefly for a thing that never happened. In all that time no man came near enough to Aegon the Dragon to draw steel on him. It is not the sort of deed a singer can make a song of, which is precisely why the Book records it.",
    ],
    fate: [
      "He died in his bed, an old man, which for a Lord Commander of the Kingsguard is very nearly a miracle and was recorded as one.",
    ] },

  { id: "richard-roote", name: "Ser Richard Roote", house: "Roote",
    epithet: "Of the first seven", era: "The Conquest — Aegon I",
    armsGlyph: "⚔",
    served: ["Aegon I"], raised: "10 AC, among the first seven",
    note: "Of the first seven",
    entry: [
      "A knight of the riverlands, of the house of Roote, raised to the white when the order was founded. He was among the men Queen Visenya judged quick enough and hard enough to stand at her brother’s shoulder, and that judgement is the whole of the testimony the Book can offer for him. She was not known to be generous with her opinions.",
      "He served through the years when the Conqueror’s peace was still being argued over with swords, and he broke none of his vows that any scribe thought worth the ink. Of his deeds, his campaigns and the manner of his going, the Book keeps no further record. That is not a slight. The first seven were guards, not champions, and a guard who is never written about has usually done his work.",
    ],
    fate: [
      "The Book gives no account of his end.",
    ] },

  { id: "addison-hill", name: "Ser Addison Hill", house: "Cornfield, base-born",
    epithet: "The Bastard of Cornfield", era: "The Conquest — Aegon I",
    arms: "assets/sigils/minor/cornfield.png",
    served: ["Aegon I"], lordCommander: true, raised: "10 AC, among the first seven",
    entry: [
      "Base-born of Cornfield in the westerlands, and known by that fact all his life, for the name Hill is given to men whose fathers did not marry their mothers and is not easily set down. He was knighted for his sword rather than his blood, and when the first seven were chosen he was one of them — a thing worth pausing over, since it means that from the very first day the order was founded, the white cloak was open to a man with no lands, no lordship and no legitimate name.",
      "He served the Dragon faithfully, and in time he was given command of the order. Only two men had held that office before the Conqueror’s reign was done, and the second of them was a bastard. Later hands have made a good deal of this. The original scribe simply wrote it down and moved on, which is the better instinct.",
      "What the Book allows itself about him is short and clear enough: he was diligent, he was obeyed, and no brother sworn under him is recorded as having complained of his justice. For an order barely a generation old, with no precedent to fall back on and no tradition to shame a man into good behaviour, that is a considerable achievement.",
    ],
    fate: [
      "The manner and hour of his death are not written here.",
    ] },

  { id: "gregor-goode", name: "Ser Gregor Goode", house: "Goode",
    epithet: "Elder of the two brothers", era: "The Conquest — Aegon I",
    armsGlyph: "✦",
    served: ["Aegon I"], raised: "10 AC, among the first seven",
    note: "Of the first seven",
    entry: [
      "One of two brothers of the house of Goode who took the white together at the founding of the order, and the elder of them. That two men of one blood should hold two of seven places has troubled every Lord Commander since, since the vows were framed precisely to leave a brother with no family but his sworn brothers. It did not trouble the Conqueror. He wanted good swords and he took them where he found them.",
      "He served, and his brother served beside him, and between them they held a quarter of the king’s life in their hands for years together. Of his deeds the Book keeps no further record.",
    ],
    fate: [
      "Nothing is written here of his end.",
    ] },

  { id: "griffith-goode", name: "Ser Griffith Goode", house: "Goode",
    epithet: "Brother to Ser Gregor", era: "The Conquest — Aegon I",
    armsGlyph: "✦",
    served: ["Aegon I"], raised: "10 AC, among the first seven",
    note: "Of the first seven",
    entry: [
      "Brother to Ser Gregor, and raised with him on the same day, at the same swearing, to the same vows. The Book names them in the same breath and has almost never had cause to name them apart.",
      "He kept his cloak clean so far as any record shows, and served out his years in the Red Keep and on the roads of a realm that was still deciding whether it wished to be one. Of his service, his campaigns and his ending the Book keeps no further record. Two brothers of the first seven, and between them barely a page — which tells its own truth about how the order began. It was not yet an honour. It was work.",
    ],
    fate: [
      "Nothing is written here of his end.",
    ] },

  { id: "humfrey-the-mummer", name: "Ser Humfrey the Mummer",
    epithet: "Born to no house at all", era: "The Conquest — Aegon I",
    armsGlyph: "✶",
    blazon: "No arms are recorded. He had none to record.",
    served: ["Aegon I"], raised: "10 AC, among the first seven",
    note: "Of the first seven",
    entry: [
      "Alone among the first seven he was born to no house whatever, and the byname he carried all his life came from the playing folk. Where the others brought castles and bloodlines to the swearing, he brought a sword and whatever a man learns growing up among travelling players, which is a great deal about crowds, and about watching a crowd for the one face in it that is not laughing.",
      "He was knighted, and he was chosen, and the Conqueror set him to guard his person along with lords’ sons and a lord’s bastard. No scribe of the time thought this remarkable enough to explain. It became remarkable only later, when the white cloak grew grand and great houses began to treat a place in the seven as something owed to them by birth.",
      "Of his service the Book keeps no further record beyond the fact of it, and the fact is the point. The first name of low birth in this book stands seven places from the beginning.",
    ],
    fate: [
      "The Book gives no account of his end.",
    ] },

  { id: "robin-darklyn", name: "Ser Robin Darklyn", house: "Darklyn of Duskendale",
    epithet: "Darkrobin", era: "The Conquest — Aegon I",
    armsGlyph: "☾",
    served: ["Aegon I"], raised: "10 AC, among the first seven",
    note: "Darkrobin",
    entry: [
      "Of Duskendale, whose lords had been kings on that stretch of coast before the dragons came, and who had bent the knee rather than burn. He was called Darkrobin from his youth, and the name stuck to him more firmly than his own, as such names do.",
      "Queen Visenya chose him for the first seven. That a Darklyn should be set to guard the king so soon after his house had stopped being kings themselves was either an act of trust or an act of policy, and the Book has never troubled to decide which. Both are things a wise monarch does.",
      "He served, and he is the first of his blood to be written in these pages, though he was not the last; a later hand has added, in a cramped and satisfied script, that seven Darklyns in all would come to wear the white before the line was done. Of Ser Robin’s own deeds the Book keeps no further record.",
    ],
    fate: [
      "Nothing is written here of his end.",
    ] },

  /* ======== THE SONS OF THE DRAGON — AENYS I AND MAEGOR THE CRUEL ======== */

  { id: "raymont-baratheon", name: "Ser Raymont Baratheon", house: "Baratheon of Storm’s End",
    epithet: "Who woke at the right moment",
    era: "The Sons of the Dragon — Aenys I and Maegor the Cruel",
    arms: "assets/sigils/baratheon.svg",
    blazon: "A crowned stag, black upon gold.",
    served: ["Aenys I"], raised: "In the reign of King Aenys",
    note: "Saved King Aenys",
    entry: [
      "A knight of the stormlands and of the king’s own kin by marriage, raised to the white in the reign of Aenys, first son of the Conqueror. Here the Book must be careful. One account names him plainly and gives him the whole of the deed; another version of the same history leaves the knight nameless, and there are maesters who hold that the name was added later by a hand that disliked a hero without one. The deed itself no one disputes.",
      "It was done in the worst year of Aenys’s reign, when the Faith had turned on the crown and the pious poor were preaching the king’s destruction from every crossroads. The royal family were lodged in a manse on Visenya’s Hill while the Red Keep was still rising. Two of the Poor Fellows came over the wall by night, found their way to the king’s bedchamber and got inside it with steel in their hands. They did not get out again. The Kingsguard on duty was awake, or was woken in time, and Aenys lived to see morning.",
      "That is the whole of what is asked of this order, condensed into a few heartbeats in the dark. Every knight in these pages has sworn to be the man in that doorway. Very few have ever been tested at it. He was, and he held.",
      "The Book records no other deed of his, and needs none. A brother who is there on the one night it matters has discharged the vow entire.",
    ],
    fate: [
      "How he ended the Book does not say. He was gone before his king’s brother came for the throne, which spared him a choice that broke better men than he.",
    ] },

  { id: "davos-darklyn", name: "Ser Davos Darklyn", house: "Darklyn of Duskendale",
    epithet: "Who marshalled the king’s host",
    era: "The Sons of the Dragon — Aenys I and Maegor the Cruel",
    armsGlyph: "☾",
    served: ["Aenys I", "Maegor I"], raised: "In the reign of King Aenys",
    note: "Of Duskendale",
    entry: [
      "The second Darklyn to be written in this book, raised to the white under Aenys and left standing in it when Aenys was gone and Aenys’s brother had the crown. That is the ugly hinge of this whole age, and the Book has never found a graceful way to write it. The vow binds a man to the king. It does not ask him whether he approves of the king.",
      "He chose to stay. When Maegor’s nephew Aegon, called the Uncrowned, raised his banners and came east for the throne his father had held, it was Ser Davos who gathered the strength of King’s Landing — some thousands of swords, mustered fast and marched out west to meet the rebels before they could reach the walls. A Kingsguard is not ordinarily a commander of armies. In that reign the ordinary arrangements had stopped applying.",
      "The two hosts met near the Gods Eye in the latter half of the year, and the sky above them was the true battlefield, for both claimants rode dragons and only one came down alive. On the ground the fighting was brief and one-sided, and among all the king’s men, Ser Davos was the only loss anyone thought worth naming.",
      "What kind of brother he was depends entirely on which account you credit and how you weigh an oath against a conscience. He kept his word to a king who deserved none. Later hands have called that loyalty, and later hands have called it worse.",
    ],
    fate: [
      "He was cut down in the battle beneath the Gods Eye by Lord Qarl Corbray of Heart’s Home, who carried the Valyrian steel blade Lady Forlorn. It is recorded as a clean death, which in that reign was a rarer thing than a brave one.",
    ] },

  { id: "owen-bush", name: "Ser Owen Bush", house: "Bush",
    epithet: "The king’s hand at the dungeon door",
    era: "The Sons of the Dragon — Aenys I and Maegor the Cruel",
    armsGlyph: "⚔",
    served: ["Aenys I", "Maegor I"], raised: "In the reign of King Aenys",
    note: "Kept Maegor’s cells",
    entry: [
      "Raised under Aenys, and kept in his place by Maegor, whom he served for the whole of that reign. He was one of the two white cloaks the king used for the work that could not be given to a herald: arrests in the small hours, the walk down to the black cells, the standing at the door afterwards.",
      "With his sworn brother Ser Maladon Moore he brought Queen Tyanna of the Tower down to the dungeons at the end, and there she made her confession, and it emptied the court like a fire. Of the darker business the accounts flatly disagree. One version holds that Maegor’s first queen, Ceryse of Oldtown, gave him a sharp answer once too often and that the king ordered her tongue cut out; that Ser Maladon held her; and that Ser Owen’s knife went further than it was meant to. Another version, kept by the Hightowers and by no one else, says she died peacefully in her sleep and the whole story was invented by men who wished to blacken a dead king who needed no help. The Book sets down both and settles neither.",
      "What kind of brother he was is a question this page cannot answer kindly, and yet it must be recorded that he was the one man of that seven who spoke against the torment of the king’s own nephew, a boy in Maegor’s keeping. It availed nothing. It is still the only voice raised in that room that anyone bothered to write down.",
    ],
    fate: [
      "He was killed in a brothel of King’s Landing in the last days of the reign, and the men who did it left him arranged in a manner that told the whole city what they thought of him. No one was ever taken for it. By then the king had few friends left to inquire.",
    ] },

  { id: "maladon-moore", name: "Ser Maladon Moore", house: "Moore",
    epithet: "Of the Cruel King’s seven",
    era: "The Sons of the Dragon — Aenys I and Maegor the Cruel",
    armsGlyph: "⚔",
    served: ["Maegor I"], raised: "By King Maegor",
    note: "Of Maegor’s seven",
    entry: [
      "A knight of House Moore, given a white cloak by Maegor himself, which in that reign meant something rather different from an honour. The king did not want brothers. He wanted instruments, and he chose men he judged unlikely to ask questions.",
      "Ser Maladon and Ser Owen Bush were the pair he used for such work. It was the two of them who took Queen Tyanna to the cells beneath the castle at the end of her favour, and it is in the accounts of that reign that Ser Maladon’s name appears most often — always at a door, always at a shoulder, always where an obedient sword was wanted.",
      "The worst of the tales told about him concerns the death of Queen Ceryse. One account has him holding the queen down while another man used the knife. Another insists that no such thing happened at all and that the lady died in her bed of natural causes. Both accounts were written by men with reasons to lie, and the Book does not pretend to know.",
      "This is where the order’s oldest problem is written plainest. A Kingsguard swears to obey. When the king is butchering his own subjects, obedience is not innocence, and every brother after him has had to reckon with the fact that the vow gives no guidance whatever on the point. Three centuries later it had still not been solved.",
    ],
    fate: [
      "When Maegor was gone and the boy king Jaehaerys came to the throne, Ser Maladon alone of the surviving seven was given no choice. He was put to death for his part in the murder of Queen Tyanna. His sworn brothers were offered the Wall. He was not.",
    ] },

  { id: "olyver-bracken", name: "Ser Olyver Bracken", house: "Bracken of Stone Hedge",
    epithet: "Who rode away",
    era: "The Sons of the Dragon — Aenys I and Maegor the Cruel",
    arms: "assets/sigils/minor/stone-hedge.png",
    blazon: "A red stallion upon gold, and a golden shield.",
    served: ["Maegor I"], raised: "By King Maegor",
    note: "Of Maegor’s seven",
    entry: [
      "Of the Brackens of Stone Hedge, a riverlands house that had bent the knee early and been rewarded for it. He was raised to the white by Maegor and wore the cloak through the years when wearing it meant standing very still while terrible things were done in the next room.",
      "In the last year of that reign the realm came apart. The lords of the Trident would not answer the king’s summons, the storm lords declared for the boy Jaehaerys, and one morning the Iron Throne had a garrison and very little else. It was then that Ser Olyver and Ser Raymund Mallery, sworn brothers both, took their horses out of King’s Landing and rode for the prince.",
      "Two of seven. The Book has never been able to agree with itself about what to call that. A brother who abandons a monster is still a brother who abandoned his king, and the vow makes no allowance for the quality of the man it binds you to. He had sworn for life, and he had sworn to a living king, and he went anyway.",
      "What is certain is that their going did more damage to Maegor than any battle of that year. When the Kingsguard themselves will not stand at a king’s back, the realm has already delivered its verdict.",
    ],
    fate: [
      "Jaehaerys would not have him. The young king held that a man who breaks one oath will break another, and refused the service of both deserters. Offered death or the Wall, Ser Olyver took the black and went north, where the cloaks are black and the vows are the same length.",
    ] },

  { id: "raymund-mallery", name: "Ser Raymund Mallery", house: "Mallery",
    epithet: "Who rode away with him",
    era: "The Sons of the Dragon — Aenys I and Maegor the Cruel",
    arms: "assets/sigils/new/mallery.png",
    served: ["Maegor I"], raised: "By King Maegor",
    note: "Of Maegor’s seven",
    entry: [
      "A knight of House Mallery, raised to the white by Maegor and named in this book almost always in the same line as Ser Olyver Bracken, since whatever the two of them did, they did together.",
      "They served the Cruel King through his wars against the Faith and his wars against his own kin, and then, in the last year, they stopped. When the boy Jaehaerys put forward his claim and the great houses began to slide toward him, the two of them left the city and went over to the prince.",
      "The Book records the act without ornament and lets the reader weigh it. Of Ser Raymund himself — his father, his knighting, his temper, whether he argued the thing out with Ser Olyver over a jug or simply followed a friend — no record survives at all. He is a name, a house, and one decision.",
      "It happens to be the decision that this order has spent three hundred years failing to agree about, so perhaps one is enough.",
    ],
    fate: [
      "Like Ser Olyver, he was turned away by the new king, who wanted no oathbreakers about him whatever oath they had broken and whyever they had broken it. He was given the choice of the sword or the Wall, and he took the Wall.",
    ] },

  { id: "harrold-langward", name: "Ser Harrold Langward", house: "Langward",
    epithet: "Who would not kneel to the boy",
    era: "The Sons of the Dragon — Aenys I and Maegor the Cruel",
    arms: "assets/sigils/new/langward.png",
    served: ["Maegor I"], raised: "By King Maegor",
    note: "Of Maegor’s seven",
    entry: [
      "A knight of House Langward, raised to the white by Maegor, and of all that seven the one who never wavered by so much as a step. Where others left in the night or made their peace afterwards, he did neither.",
      "He was in the Red Keep to the last, in a city that had turned, in the service of a king the realm had stopped obeying. When it was over, the surviving white cloaks were brought before the new boy king and his mother the Queen Regent, and the question put to them was not whether they had done wrong but only whether they would consent to live.",
      "Ser Harrold would not have it that he had done wrong at all. He had sworn to Maegor; Maegor had been king; there was nothing further to discuss. When judgement was pronounced he refused it and demanded the ancient right of any knight who thinks himself wronged: let it be settled with swords, and let the gods say who was in the right.",
      "The Book, which has no love for him, is obliged to note that this was consistent. He had taken the vow as it was written and not as men wished it had been written, and he declined to pretend otherwise merely because the pretending would have saved him.",
    ],
    fate: [
      "King Jaehaerys wished to answer the challenge himself and was forbidden it by his mother, being a boy of fourteen and the only Targaryen left worth the name. Ser Gyles Morrigen went out in his stead, and made short work of it. Ser Harrold died on the field he had asked for, which is more than most of that reign were granted.",
    ] },

  { id: "jon-tollett", name: "Ser Jon Tollett", house: "Tollett",
    epithet: "Of the Cruel King’s seven",
    era: "The Sons of the Dragon — Aenys I and Maegor the Cruel",
    armsGlyph: "⚔",
    served: ["Maegor I"], raised: "By King Maegor",
    note: "Of Maegor’s seven",
    entry: [
      "Raised to the white by Maegor, and one of the six who were still alive to answer for it when that reign ended. What he did in it the Book does not say, which may mean he did little, or may only mean that the men who kept the records were busy with worse.",
      "He is written here because the order keeps every name, the shameful along with the shining, and because a reader who reads only the great ones has not understood what the Kingsguard mostly is. Most brothers stand watches. Most brothers are remembered by a line.",
      "Of his service the Book keeps no further record.",
    ],
    fate: [
      "He was offered death or the Night’s Watch, and took the black in the first year of King Jaehaerys. The Wall received four of Maegor’s white cloaks that year. What became of any of them there is not written in this book.",
    ] },

  { id: "symond-crayne", name: "Ser Symond Crayne", house: "Crayne",
    epithet: "Of the Cruel King’s seven",
    era: "The Sons of the Dragon — Aenys I and Maegor the Cruel",
    armsGlyph: "⚔",
    served: ["Maegor I"], raised: "By King Maegor",
    note: "Of Maegor’s seven",
    entry: [
      "Another of Maegor’s seven, and another of whom the histories preserve a name and very little else. He was raised in that reign, he kept the cloak through it, and he was standing in the Red Keep at the end of it.",
      "The Book keeps no record of his blood, his knighting or any single deed of his service. A scrupulous hand has added the observation that a man may be present at a great deal of evil without ever being the one who is written down, and that this is not the same thing as innocence, and not the same thing as guilt either.",
    ],
    fate: [
      "Given the choice between the headsman and the Wall, he chose the Wall, and rode north with three of his sworn brothers in the first year of the new reign.",
    ] },

  /* =================== THE LONG SUMMER — JAEHAERYS I ===================== */

  { id: "gyles-morrigen", name: "Ser Gyles Morrigen", house: "Morrigen of Crow’s Nest",
    epithet: "The first of the new seven", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "✶",
    blazon: "A black crow upon green, wings spread.",
    served: ["Jaehaerys I"], lordCommander: true, raised: "48 AC, the first of the new seven",
    entry: [
      "A knight of the stormlands, of Crow’s Nest, and nephew to Ser Damon the Devout, who had led the Warrior’s Sons in their war against Maegor and paid for it. That parentage matters. When the boy Jaehaerys came to build a Kingsguard out of the wreckage of his uncle’s, he began with a man whose own house had bled on the other side.",
      "Ser Gyles had declared for the prince early, when declaring was still dangerous. His place was won in the plainest way imaginable: when the last of Maegor’s loyal knights refused judgement and demanded a trial by battle, the king — fourteen years old and eager, and quite serious about doing it himself — was overruled by his mother, and Ser Gyles asked for the honour instead. He took it, and it did not take him long. That same day the young king gave him a white cloak and the command of the order, and so the second Kingsguard of the realm was founded on a man who had earned it in front of everybody.",
      "He commanded for decades, through the whole flowering of that long reign, and he is the reason the white cloak stopped being a hazard and became an honour. Under Maegor a brother’s chief qualification had been a strong stomach. Under Ser Gyles it was skill, and the order recovered its name.",
      "He is remembered too for a day when he set himself against the King’s Hand. The Hand came with armed men to take the young king and queen in hand, as men do who have decided a boy cannot mean what he says. Ser Gyles and his sworn brothers made a wall of white in front of them and made it clear, without raising a voice, who would be dying first if a single sword came out. Nobody drew. The realm dates a good deal from that morning.",
    ],
    fate: [
      "He held the command until age took it from him, and the Book records no stain upon his years. He was succeeded, in time, by the finest lance of the age.",
    ] },

  { id: "joffrey-doggett", name: "Ser Joffrey Doggett", house: "Doggett",
    epithet: "The Red Dog of the Hills", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "✶",
    served: ["Jaehaerys I"], raised: "48 AC, by King Jaehaerys I",
    note: "The Red Dog of the Hills",
    entry: [
      "He came to the white by the strangest road any brother in this book has travelled. He was a knight of the Warrior’s Sons — the militant order of the Faith, outlawed by the crown — and when their Grand Captain fell fighting Maegor, it was Joffrey Doggett who was chosen to take his place. For years afterwards he held the hill country north of the Golden Tooth without any lord’s leave, and the smallfolk there called him the Red Dog of the Hills and did as he said.",
      "By rights the crown ought to have hanged him. Instead he came to Oldtown in the company of the Lord of Riverrun to see the new young king, and asked that the laws outlawing his brotherhood be repealed. Jaehaerys refused him, plainly, and then offered him a white cloak in the same breath.",
      "What happened next is the part the Book relishes. The Red Dog drew his sword. Every man in the hall went cold. Then he laid it at the boy’s feet and swore.",
      "He served out his life in that cloak and never gave the crown a day’s trouble. What it bought the realm was larger than one sword: the most dangerous surviving captain of the Faith Militant was now the king’s own man, and the war that had eaten two reigns quietly stopped being a war. He also knighted at least one brother of his own seven, so the Faith’s last great captain has descendants of a sort in these pages after all.",
    ],
    fate: [
      "The Book records no end for him but an ordinary one, in the king’s service, with his vows unbroken.",
    ] },

  { id: "lorence-roxton", name: "Ser Lorence Roxton", house: "Roxton of the Ring",
    epithet: "Won in the melee", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "⚔",
    served: ["Jaehaerys I"], raised: "49 AC, won in the War for the White Cloaks",
    note: "Won his cloak in the melee",
    entry: [
      "Five places in the seven still stood empty in the year after Jaehaerys took the throne, and the Queen Regent proposed that they be fought for. So they were, at the tourney that followed her own wedding, in seven days of melees and duels that the maesters afterwards called the War for the White Cloaks with only half a smile. The young king ruled that the contenders would fight on foot rather than tilt, on the sensible ground that a man who means to kill a king rarely does it from horseback.",
      "Hundreds came. Of the five who won through, Ser Lorence Roxton of the Ring was the only one of noble birth — the other four were hedge knights and men of no house at all, which says something about how the hundreds were sorted and something else about who wanted the cloak badly enough.",
      "He served long and well. When the King’s Hand came in force to take the royal children into his keeping, Ser Lorence and Ser Joffrey Doggett stood the guard at that meeting, and the thing was settled with words because the alternative was standing plainly in the room.",
      "He was still good enough in the tenth year of the reign to be put down in the lists by a young Redwyne nobody had yet heard of, which the Book notes only because of what that young man became.",
    ],
    fate: [
      "The Book keeps no account of his ending.",
    ] },

  { id: "willam-the-wasp", name: "Ser Willam the Wasp",
    epithet: "Won in the melee", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "✦",
    blazon: "No arms are recorded.",
    served: ["Jaehaerys I"], raised: "49 AC, won in the War for the White Cloaks",
    note: "Won his cloak in the melee",
    entry: [
      "One of the four low-born victors of the War for the White Cloaks, and known by a byname rather than a house, as such men are. He fought his way through seven days of it and came out with a cloak that no lord could have bought for him.",
      "The Book keeps no record of his father, his birthplace or the man who knighted him, and this is the honest shape of most Kingsguard lives. Of the seven who served Jaehaerys in his early years, more than half had no arms to paint on a shield. That seven is reckoned by a good many maesters the finest the order has ever fielded.",
      "Of his particular deeds the Book keeps no further record. He served in the best-guarded reign in the history of the Iron Throne, and no man came near the king. That is the entire craft, and it leaves nothing behind but silence.",
    ],
    fate: [
      "Nothing is written here of his end.",
    ] },

  { id: "pate-the-woodcock", name: "Ser Pate the Woodcock",
    epithet: "Who lowered his spear at a Hand", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "✦",
    blazon: "No arms are recorded.",
    served: ["Jaehaerys I"], raised: "49 AC, won in the War for the White Cloaks",
    note: "Won his cloak in the melee",
    entry: [
      "Born to nothing in particular, knighted by Ser Joffrey Doggett, and raised to the Kingsguard with his sword and both his hands in the melees that followed the Queen Regent’s wedding. In the space of a few years he went from a man with a byname to a man with a white cloak, and the Book cannot find that he ever once behaved as though this had surprised him.",
      "His moment came when the King’s Hand — a great lord, a warrior of real reputation, and at that hour convinced he knew better than a crowned boy — came to the young king and queen with armed men behind him and told the guards to stand aside.",
      "The accounts differ on who answered him. This book gives the deed to Ser Pate, who is said to have lowered his spear at the great man’s chest and told him, without heat, exactly which of them would be dying first. Another hand gives the words to the Lord Commander. It hardly matters. What matters is that seven men in white stood in front of two children and did not move, and the most powerful lord in the realm found he had run out of arguments.",
      "That is the day the white cloak got its authority back. Not in a battle, and not in a song. In a corridor, against the king’s own Hand.",
    ],
    fate: [
      "The Book keeps no account of his ending.",
    ] },

  { id: "samgood-of-sour-hill", name: "Ser Samgood of Sour Hill",
    epithet: "Won in the melee", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "✦",
    blazon: "No arms are recorded.",
    served: ["Jaehaerys I"], raised: "49 AC, won in the War for the White Cloaks",
    note: "Won his cloak in the melee",
    entry: [
      "Of Sour Hill, a place no maester has troubled to fix upon a map, and of no house that any herald acknowledges. He was one of the four men of low birth who won a white cloak with an axe or a sword in the seven days of melees, and he wore it for the rest of his life.",
      "He served in the seven that many maesters hold to be the best the order has ever assembled, alongside a former captain of the Faith Militant, a lord’s son, a knight named for a wasp and another named for a bird. It was an odd company by the standards of later reigns, when great houses came to expect white cloaks as their due. It also happens to have been the most effective.",
      "Of his deeds the Book keeps no further record.",
    ],
    fate: [
      "Nothing is written here of his end.",
    ] },

  { id: "victor-the-valiant", name: "Ser Victor the Valiant",
    epithet: "Won in the melee", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "✦",
    blazon: "No arms are recorded.",
    served: ["Jaehaerys I"], raised: "49 AC, won in the War for the White Cloaks",
    note: "Won his cloak in the melee",
    entry: [
      "The last of the five to win a cloak in the War for the White Cloaks, and like three of the others he carried a byname where a house should be. Valiant is a heavy word to be stuck with, and the Book notes drily that he was given it by the crowd rather than by any herald, which is at least a form of testimony.",
      "He served King Jaehaerys in the seven that steadied the realm after two reigns of fire, and the whole of what is asked of such a man he appears to have done. Of his service the Book keeps no further record.",
    ],
    fate: [
      "Nothing is written here of his end.",
    ] },

  { id: "ryam-redwyne", name: "Ser Ryam Redwyne", house: "Redwyne of the Arbor",
    epithet: "The finest lance of his age", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "✦",
    blazon: "A burgundy grape cluster upon blue.",
    served: ["Jaehaerys I", "Viserys I"], lordCommander: true,
    raised: "In the years after the Shivers, by King Jaehaerys I",
    entry: [
      "A younger son of the Arbor, and by common consent of everyone who saw him the greatest knight of his generation with sword or lance in hand. He came to the notice of the court in the plague years, when the Shivers went through King’s Landing and took a great many people who could not be replaced; his elder brother was given the command of the City Watch, and Ryam was given a white cloak.",
      "He had already been unhorsing the king’s own Kingsguard in the lists as a young man barely knighted. The rest of his career in the tilts is the sort of thing that gets exaggerated, except that it does not need to be. At the tourney held to mark the fiftieth year of the reign, he and Ser Clement Crabb of his own order rode against each other until they had broken some thirty lances between them and neither could be unseated, and the king finally ended it by declaring them both champions. Men who were there spent the rest of their lives telling people about it.",
      "In time he rose to command the order, and he held that office into the reign of the next king. He was, by every account, a magnificent knight and an exemplary Lord Commander.",
      "He was also, for one year, Hand of the King, and this the Book records with a certain relish, because he was frankly dreadful at it. Ruling a realm is not jousting. A later hand has added, in the margin, that the fault lay with whoever appointed him rather than with him, which is generous, and probably true.",
    ],
    fate: [
      "He gave up the Handship after a year and returned to the work he understood, and died in the white cloak, still Lord Commander, having outlived the king who raised him.",
    ] },

  { id: "lucamore-strong", name: "Ser Lucamore Strong", house: "Strong",
    epithet: "Lucamore the Lusty", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "⚔",
    served: ["Jaehaerys I"], raised: "In the middle years of Jaehaerys I",
    note: "Lucamore the Lusty",
    entry: [
      "A knight of House Strong, raised to the white in the middle years of the long reign, when the order stood high in the realm’s regard and a place in it was reckoned among the great prizes a landless son could hope for.",
      "For years he was by all appearances a good brother: capable, cheerful, well liked by the men he served with, and diligent enough that nobody thought to look at him twice. The Book is obliged to say that this is precisely the description that ought to make a Lord Commander uneasy.",
      "The vows he had sworn were the ones Ser Corlys Velaryon had argued for at the founding, and the strictest of them are not about courage at all. A brother of the Kingsguard takes no wife. He holds no lands. He fathers no children. The reasoning is simple and has never been improved upon: a man with sons has something he would rather protect than the king.",
      "The name the singers gave him afterwards was Lucamore the Lusty, and they made it merry, as singers will. There was nothing merry in it. The order had been given three centuries of good reasons for that vow within a single lifetime, and here was a brother who had simply decided it did not apply to him.",
    ],
    fate: [
      "Late in the seventy-third year after the Conquest, Ser Ryam Redwyne discovered what his sworn brother had been doing with his liberty. Ser Lucamore had married three women in secret, none of whom knew of the others, and had fathered sixteen children upon them. He was gelded by the brothers he had sworn beside, and King Jaehaerys sent him to the Wall to finish his life in the black. His wives and children were dispersed; the singers were still making sport of him a hundred years later.",
    ] },

  { id: "clement-crabb", name: "Ser Clement Crabb", house: "Crabb of Crackclaw Point",
    epithet: "Who broke thirty lances", era: "The Long Summer — Jaehaerys I",
    armsGlyph: "✦",
    served: ["Jaehaerys I"], raised: "In the later years of Jaehaerys I",
    note: "Co-champion of the jubilee",
    entry: [
      "Of the Crabbs of Crackclaw Point, a stubborn old crannog-and-cave sort of people who had been in that country since before anyone was counting, and who are not much given to producing courtiers. He came to the white in the later years of the long reign.",
      "He is written here for one afternoon. At the great tourney called to mark fifty years of King Jaehaerys upon the Iron Throne, Ser Clement was drawn against Ser Ryam Redwyne, his own Lord Commander and the acknowledged finest lance in the Seven Kingdoms. He should have lost inside three passes. Instead the two of them rode at one another until they had broken something on the order of thirty lances, and neither man could put the other down, and the king at last stood up and declared them both champions rather than watch them do it until dark.",
      "It is still spoken of as the finest jousting the realm has seen. What the Book chooses to note is subtler: it was two Kingsguard, of the same seven, sworn to the same king, riding at each other in front of the whole court for nothing but the pleasure of finding out. That is what the order had become by then, three reigns on from the men who invented it. Not a hazard. A brotherhood good enough to be worth showing off.",
      "Of the rest of his service the Book keeps little. He was there, in white, in the best-kept peace the realm has ever had.",
    ],
    fate: [
      "The Book gives no account of his end.",
    ] }

);
