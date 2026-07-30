/* THE WHITE BOOK — II. The Broad Realm and the Dance of the Dragons.
   Every word here is original to this site. Nothing is copied from any wiki.

   Shape (see js/whitebook-engine.js for the full contract):
     { id, name, house, epithet, era, arms, armsGlyph, blazon, served: [],
       lordCommander, raised, note, entry: [], fate: [], wiki } */

(window.WHITE_BOOK = window.WHITE_BOOK || []).push(

  /* ===================== THE BROAD REALM — VISERYS I ===================== */

  { id: "criston-cole", name: "Ser Criston Cole",
    epithet: "The Kingmaker", era: "The Broad Realm — Viserys I",
    armsGlyph: "⚔",
    blazon: "No arms are set down here. A steward’s son of the Dornish Marches.",
    served: ["Viserys I", "Aegon II"], lordCommander: true,
    raised: "105 AC, by King Viserys I",
    entry: [
      "Son of the steward who kept Blackhaven for the Lord Dondarrion, and so a man with no lands, no arms and no name worth the writing. He was raised on the Dornish Marches, where a boy learns the sword early or does not learn it at all, and he was knighted there in the ordinary way for ordinary service. Of his first years the Book records nothing, which is itself a kind of record.",
      "He came to court and won a tourney. That is the whole of it, and it was enough. He unhorsed men of far greater name than his own, the king’s own brother among them, and when a seat on the Kingsguard fell empty that same year, Princess Rhaenyra asked her father to give the white cloak to the marcher knight who had worn her favour. King Viserys, who denied his daughter very little, gave it. Ser Criston became her sworn shield, and for some years no man in the Red Keep stood closer to the heir than he did.",
      "Then something passed between the princess and her shield, and every chronicler of the age tells it differently. One account has it that he begged her to set aside her inheritance and sail away with him, and that she laughed. Another insists the offer ran the other way, that she came to him by night and he refused her because of his vows. A third says only that they quarrelled. The Book gives none of the three. In the margin of this page a line has been scraped out and written over in a later hand, and what stood there first cannot now be read.",
      "What is not in doubt is the direction he turned afterward. He became the queen’s man, Alicent of House Hightower’s man, and the tutor and champion of her sons. When the king died and the succession was settled behind closed doors in a single night, it was Ser Criston who set the Conqueror’s crown on the head of Aegon the Second before the city, and the smallfolk gave him a name for it that has stuck to him ever since. He was made Hand of the King, and thereafter fought his war on the ground, with horse and lance and gallows, while the dragons settled the matter in the air.",
      "He was diligent, temperate in drink, and never once accused of taking a bribe. He was also a man who carried a private injury into a public war and let a great many people pay for it. The Book, being kept by his own order and about his own order, praises the first and is quiet about the second.",
    ],
    fate: [
      "In 130 AC his host was caught in the open near the God’s Eye, in the killing the singers named the Butcher’s Ball. Ser Criston was offered terms and refused them, and then called out any man who cared to face him alone. No one did. He was brought down by arrows. A later hand has added a line to this page about the manner of his courage that the first scribe plainly did not write.",
    ] },

  { id: "erryk-cargyll", name: "Ser Erryk Cargyll",
    epithet: "Twin to Ser Arryk", era: "The Broad Realm — Viserys I",
    armsGlyph: "✦",
    blazon: "The Book does not set down the arms of Cargyll.",
    served: ["Viserys I", "Rhaenyra"],
    note: "Sworn to Rhaenyra",
    entry: [
      "One of two. He and his brother Arryk were born within the same hour and were alike enough that men who had known them for years could not tell one from the other unless they stood apart and spoke. Both were knighted young, both were taken into the Kingsguard by King Viserys, and for years the court treated them as a single article with two heads.",
      "Ser Erryk’s service under Viserys was unremarkable and therefore good. He kept the doors, rode the escorts, stood the night watches, and the Book has nothing further to say of him until the night the king died in his bed and the Kingsguard were called together and told what had been decided about the succession.",
      "The seven were asked, one by one. Ser Erryk would not have it. In his reckoning the vows he had spoken were sworn to the king, and the king had named his daughter heir before the assembled lords and never unsaid it, and so the oath went where the king’s word had gone. He got out of the Red Keep and across the water to Dragonstone, and there took his place among the queen’s sworn shields.",
      "His brother stayed. That is the whole of the quarrel, and it was not a small one: for the first time in the order’s history two men who had eaten at the same table for years wore the same cloak against each other. The Book sets both their names down on facing pages, which is either an accident of the ledger or a very old scribe making a point.",
    ],
    fate: [
      "He came face to face with Arryk on Dragonstone, and the two of them fought, and neither walked away. The favoured account has them knowing each other at once, weeping, and going at it anyway for the better part of an hour, each asking pardon of the other at the end. The fool Mushroom, who was there or claims he was, calls that a singer’s tidy lie and says they simply died together in a confused scuffle with a dozen other men about them. The Book keeps the first version. It would.",
    ] },

  { id: "arryk-cargyll", name: "Ser Arryk Cargyll",
    epithet: "Twin to Ser Erryk", era: "The Broad Realm — Viserys I",
    armsGlyph: "✦",
    blazon: "The Book does not set down the arms of Cargyll.",
    served: ["Viserys I", "Aegon II"],
    note: "Sworn to Aegon II",
    entry: [
      "The other of the two, and by most accounts the steadier, though nobody could have told at a glance. He was raised to the Kingsguard by King Viserys on the same day as his brother and served the same duties for the same years without complaint or distinction.",
      "When the king died and the order was asked to choose, Ser Arryk held that a Kingsguard has no business weighing claims. Seven men cannot be a council. There was a crowned king sitting the Iron Throne by morning, and it was that man’s life he was sworn to keep, and the rest was for lords and maesters to argue over. He put on his cloak and stood behind Aegon the Second.",
      "He kept the young king through the worst months in the Red Keep, including the night two men got into the castle with a rope and a butcher’s knife and did what was done to the queen’s children. Ser Arryk was not at that door. He hunted the pair afterwards and never found them, and the Book notes drily that he asked to be relieved of his cloak for it and was refused.",
      "Then he was sent to Dragonstone. The commission he was given is recorded plainly in some chronicles and denied outright in others, and since the man who gave it and the man who took it both ended badly, no one now living can settle it. What is agreed is that his brother was on that island, and that the two of them knew each other’s face better than their own.",
    ],
    fate: [
      "He and Ser Erryk killed each other, and the accounts of how are irreconcilable. The version the Book prefers is a long single combat between men who had shared a cradle, ending with both on the floor begging pardon of the other. Mushroom calls that a song and says the truth was uglier, quicker and more crowded. Whichever it was, House Cargyll lost both its sons in one afternoon, and the order has never quite stopped flinching from the page.",
    ] },

  { id: "steffon-darklyn", name: "Ser Steffon Darklyn", house: "Darklyn of Duskendale",
    epithet: "Who reached for a dragon", era: "The Broad Realm — Viserys I",
    armsGlyph: "☾",
    served: ["Viserys I", "Rhaenyra"],
    note: "Sworn to Rhaenyra",
    entry: [
      "Of the old Darklyn line of Duskendale, a house that had worn a crown of its own before the Targaryens came and had been reminded of it, painfully, more than once since. He was knighted in his father’s hall and brought to court young, and King Viserys gave him a white cloak in the middle years of the long peace.",
      "At the king’s death he went with the princess. Of the three who left the Red Keep for Dragonstone, Ser Steffon is the one whose reasons the chroniclers do not trouble to explain, which usually means they were the plain ones: he had been sworn to guard the king’s named heir, and she was still the king’s named heir in the morning.",
      "On Dragonstone he served as one of the queen’s shields through the first year of the war. When her cause ran short of riders and word went out that any man with a drop of dragon blood in him might try his luck with the beasts in the yard — the sowing, the singers call it, and they make it sound better than it was — Ser Steffon put his name forward. A Targaryen grandmother was claimed for him. He went into the yard in mail, with a whip.",
      "The Book is careful to record that no one ordered him to do it and that he was warned. It is a good deal less careful about who did the warning.",
    ],
    fate: [
      "The dragon Seasmoke let him come close and then killed him in front of the whole court. He was the first of the sowing to try and the first to die, and several men who had been laughing at the notion an hour earlier went ahead and tried anyway.",
    ] },

  { id: "willis-fell", name: "Ser Willis Fell", house: "Fell of Felwood",
    epithet: "Who carried the child out", era: "The Broad Realm — Viserys I",
    armsGlyph: "⚜",
    served: ["Viserys I", "Aegon II", "Aegon III"], lordCommander: true,
    entry: [
      "A stormlander of House Fell, raised to the Kingsguard by King Viserys and, on the evidence of a long and quiet service, chosen for reliability rather than for brilliance. No tourney of note is set against his name. Neither is any complaint.",
      "He stood with Aegon the Second when the order broke, and he is remembered above all for one night’s work. When two murderers got into Maegor’s Holdfast to take payment for the queen’s losses, it was Ser Willis who lifted the little Princess Jaehaera out of her bed and got her away through the castle in the dark while the killing went on behind them. The child lived. That is his monument, and it is a better one than most men in this book have.",
      "He fought the rest of the war without ever becoming one of its authors. When the Dance was done and a boy of eleven sat the Iron Throne with a council of regents standing behind his chair, Ser Willis was made Lord Commander of the Kingsguard, largely because he was one of the very few white cloaks left alive whom nobody on either side could accuse of anything.",
      "The Book allows itself an opinion here, in a hand two generations later than his: that the order needed a dull man badly, and was fortunate to have one.",
    ],
    fate: [
      "The winter fever came to King’s Landing in 133 AC and took him, and two of his sworn brothers with him, in the same season. He died in bed in the White Sword Tower, which after the years he had lived through counts as a mercy.",
    ] },

  { id: "rickard-thorne", name: "Ser Rickard Thorne",
    epithet: "Sworn to a small boy", era: "The Broad Realm — Viserys I",
    armsGlyph: "⚔",
    served: ["Viserys I", "Aegon II"],
    note: "Sworn to Aegon II",
    entry: [
      "Raised to the Kingsguard by King Viserys and given, in the ordinary course of things, the ordinary duties. The Book keeps no record of where he was knighted or by whom, and none of any deed of his before the war.",
      "He held for Aegon the Second at the breaking of the order. When the queen’s dragons came over the city and the royal children were sent out of King’s Landing by different roads, so that no single mischance could end the line, Ser Rickard was given the youngest of them — Prince Maelor, who was not yet three — and told to get him to Oldtown. He was given no escort worth the name, because an escort would have been noticed.",
      "He got as far as Bitterbridge. What happened at the inn there is one of the few episodes of the Dance that every chronicler tells the same way and that none of them enjoys telling: a knight in a white cloak, a small child, a crowded common room, and someone who recognised the boy for what he was worth.",
    ],
    fate: [
      "He was killed at Bitterbridge, fighting over the child, and the child did not survive the crowd that fought over him. Ser Rickard’s failure was not one of courage, and the Book does not pretend otherwise. It notes only that he was set an impossible task by men who were safely elsewhere.",
    ] },

  { id: "lorent-marbrand", name: "Ser Lorent Marbrand", house: "Marbrand of Ashemark",
    epithet: "Lord Commander of the queen’s shields", era: "The Broad Realm — Viserys I",
    arms: "assets/sigils/minor/ashemark.png",
    blazon: "A burning tree upon a field of smoke.",
    served: ["Viserys I", "Rhaenyra"], lordCommander: true,
    entry: [
      "Of House Marbrand of Ashemark, a westerland house of good standing and no great power, which in the Kingsguard is an advantage: a man with nothing to inherit is a man harder to buy. He was raised to the white cloaks by King Viserys and served him to the end of the reign.",
      "He was the third of the seven to leave the Red Keep for Dragonstone. When the princess was crowned, and afterwards took King’s Landing, it fell to Ser Lorent to rebuild the order almost from nothing on her behalf. He was made Lord Commander of her sworn shields and told to find six worthy men — a strange commission to give any knight, and stranger still in a city that had changed hands twice inside a year. The men he chose are written on the pages that follow.",
      "He commanded her guard through the short and bitter months in which she held the throne: the taxes, the confiscations, the executions, the slow souring of a city that had cheered her in the spring. When Flea Bottom rose and the mob went up the hill towards the Dragonpit, Ser Lorent did not barricade the Red Keep and wait. He took what knights and men-at-arms he had and went down into the streets to put a stop to it.",
      "The Book is dry about him, and its dryness reads like respect. He is one of very few men in this part of the record against whom nobody on either side ever wrote anything at all.",
    ],
    fate: [
      "He was killed in the rising in Flea Bottom, in among the crowd, trying to turn it. Mushroom says the queen wept when she was told the manner of it. Mushroom says a great many things, but the Book copied that one down.",
    ] },

  /* ===================== THE DANCE OF THE DRAGONS ===================== */

  { id: "glendon-goode", name: "Ser Glendon Goode",
    epithet: "Lord Commander for a day", era: "The Dance of the Dragons",
    armsGlyph: "✦",
    served: ["Rhaenyra"], lordCommander: true,
    raised: "130 AC, after the queen took King’s Landing",
    entry: [
      "A knight of no great fortune, chosen by Ser Lorent Marbrand to fill one of the empty seats when the queen came into King’s Landing and found she had a throne and almost nobody sworn to stand in front of it. Of his birth and his knighting the Book keeps nothing beyond the name, which suggests he was picked for what he could do rather than for who his father had been.",
      "He served through the whole of the queen’s brief tenure of the city. When the Lord Commander went down into Flea Bottom to break the rising, Ser Glendon went with him, and command of the queen’s shields passed to him in the middle of a riot, in the street, with the city burning behind him and no ceremony of any kind.",
      "He held it for less than a day. The Book records his elevation and the end of it in a single line, with no space between the two, and no later hand has tried to improve on that.",
    ],
    fate: [
      "He was pulled down and killed in the same rising that had taken his predecessor, within hours of being raised to command. It is the shortest tenure ever set against the title of Lord Commander, and the Book, which is fond of that office, has never enjoyed writing it.",
    ] },

  { id: "lyonel-bentley", name: "Ser Lyonel Bentley",
    epithet: "Of the flight from the city", era: "The Dance of the Dragons",
    armsGlyph: "⚔",
    served: ["Rhaenyra"],
    raised: "130 AC, by Queen Rhaenyra",
    note: "Sworn to Rhaenyra",
    entry: [
      "One of the knights found for the queen’s guard during her few months in King’s Landing. He was young — young enough that more than one chronicler thought it worth remarking on — and he had been in the cloak a matter of weeks when the city turned against her.",
      "When the queen went out of King’s Landing in haste, with a handful of riders and no army, Ser Lyonel rode in the party that took her north and east along the kingsroad. It was not a campaign. It was a flight, on tired horses, through country where nobody was yet certain which way to bow.",
      "Of his service the Book keeps no further record, and there was not a great deal of it to keep.",
    ],
    fate: [
      "He was killed on the kingsroad in the fighting that broke upon the queen’s party as it ran, his helm beaten in about his head. He had worn the white cloak less than a season.",
    ] },

  { id: "harrold-darke", name: "Ser Harrold Darke",
    epithet: "Of the last watch on Dragonstone", era: "The Dance of the Dragons",
    armsGlyph: "☾",
    served: ["Rhaenyra"],
    raised: "130 AC, by Queen Rhaenyra",
    note: "Sworn to Rhaenyra",
    entry: [
      "Another of the men Ser Lorent Marbrand found in a hurry. House Darke was an old crownlands name of small estate, and the Book’s scribes seem to have known nothing of him beyond that and his knighting, which they do not date.",
      "He went back to Dragonstone with the queen when King’s Landing was lost, and there stood one of the last watches of her cause, on an island held by men whose loyalty had begun to look like arithmetic. Of his service the Book keeps no further record. He was in the white cloak for something under a year.",
    ],
    fate: [
      "He was cut down on Dragonstone when the castle was taken from within, together with Ser Adrian Redfort and Ser Loreth Lansdale. The three died in the same hour and are written on three separate pages, each as short as this one.",
    ] },

  { id: "adrian-redfort", name: "Ser Adrian Redfort", house: "Redfort of the Vale",
    epithet: "Of the last watch on Dragonstone", era: "The Dance of the Dragons",
    armsGlyph: "⚔",
    served: ["Rhaenyra"],
    raised: "130 AC, by Queen Rhaenyra",
    note: "Sworn to Rhaenyra",
    entry: [
      "A Vale knight of House Redfort, raised to the queen’s guard in the season when she held King’s Landing and needed men more than she needed pedigrees — though in his case she got both.",
      "He followed her back to Dragonstone when the city was lost. Of his service the Book keeps no further record beyond the fact that he was still there at the end, which, given how many were not, is worth the setting down.",
    ],
    fate: [
      "He was killed on Dragonstone when the island was betrayed and taken, with Ser Harrold Darke and Ser Loreth Lansdale beside him.",
    ] },

  { id: "loreth-lansdale", name: "Ser Loreth Lansdale",
    epithet: "Of the last watch on Dragonstone", era: "The Dance of the Dragons",
    armsGlyph: "✦",
    served: ["Rhaenyra"],
    raised: "130 AC, by Queen Rhaenyra",
    note: "Sworn to Rhaenyra",
    entry: [
      "The last of the knights Ser Lorent Marbrand named to the queen’s guard whose name the Book has kept. Nothing is written here of his father, his knighting, or his years before the war.",
      "He crossed back to Dragonstone with the queen and served out the short remainder of her cause there. Of his service the Book keeps no further record. Where a chronicle has only a name, it is more honest to say so than to invent a deed to hang upon it.",
    ],
    fate: [
      "He died on Dragonstone with Ser Harrold Darke and Ser Adrian Redfort when the castle was opened to the king’s men from the inside.",
    ] },

  { id: "marston-waters", name: "Ser Marston Waters",
    epithet: "Bastard, Lord Commander, Hand", era: "The Dance of the Dragons",
    armsGlyph: "⚓",
    blazon: "A bastard’s name, and no arms of his own.",
    served: ["Aegon II", "Aegon III"], lordCommander: true,
    raised: "130 AC, by King Aegon II, for the taking of Dragonstone",
    entry: [
      "Born a bastard of the crownlands and given the name the crownlands gives such men. He was knighted on his own merits and had no expectation of anything beyond that, since a Waters may rise as high as a captaincy and there stop.",
      "He rose considerably higher. When Dragonstone was betrayed from within, a postern gate opened in the night and Ser Marston led the men who came through it. He took the castle’s maester in the rookery before a single raven could go up, which decided the matter as surely as any fighting did. In the confusion afterwards he put himself between a sword and the Lady Baela Targaryen, who was a prisoner and worth nothing to him, and saved her life. King Aegon the Second gave him a white cloak for it.",
      "He kept it into the next reign, which very few of Aegon’s men managed. Under the boy king Aegon the Third he was raised to Lord Commander of the Kingsguard by the regents — after those same regents had annulled the appointment the king himself had made to that office. For a time he held the Handship as well, which no sworn brother has any business holding, and he was not the man to say so.",
      "The Book is unusually frank about him. He was brave, he was loyal to whoever had last raised him, and he was out of his depth from the day they gave him a council chamber to sit in instead of a gate to guard.",
    ],
    fate: [
      "In 135 AC, in the confusion of the plot against the Rogares and the Hand, Ser Marston went down to the stables to arrest one of his own sworn brothers and was stabbed in the belly by him there. He had been Lord Commander of the Kingsguard and Hand of the King, and a bastard whom nobody had expected to outlive his twenties.",
    ] },

  { id: "gyles-belgrave", name: "Ser Gyles Belgrave", house: "Belgrave",
    epithet: "Who would not outlive his king", era: "The Dance of the Dragons",
    armsGlyph: "⚜",
    served: ["Aegon II"],
    raised: "By King Aegon II, in the last year of the war",
    note: "Sworn to Aegon II",
    entry: [
      "Of House Belgrave, a small name the Book has occasion to write only this once. He was given his white cloak by Aegon the Second late in the war, when the king had few men left he trusted and fewer still who wanted the honour.",
      "By then Aegon was the wreck of a man. He had been burned down one side of his body and had broken both his legs, and he could not walk unaided, or sit a horse, or hold a cup steady. Ser Gyles carried him. That was the greater part of the duty, and he did it without any recorded complaint, through a year in which the king grew crueller as he grew more helpless.",
      "When the war ended and the northern host came south, the Hand who held King’s Landing for six days arrested twenty-two men, Ser Gyles among them, and put to each the same question about the manner of the king’s last supper. Nineteen took the black. Ser Gyles did not. He said that a sworn brother of the Kingsguard has no business surviving the king he was set to guard, and that whether he had poured the wine himself or merely failed to stop it, the sentence came out at the same place.",
      "It is one of the very few pages in this book on which a man argues himself onto the block, and the scribe wrote it out without comment, which is comment enough.",
    ],
    fate: [
      "He was beheaded in the yard of the Red Keep by Lord Cregan Stark, who did the work himself with his own greatsword, as is the custom of his house. Whether Ser Gyles had any hand in the king’s death was never established and is argued over still.",
    ] }

);
