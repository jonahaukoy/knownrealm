/* THE WHITE BOOK — V. The Stag, the War of the Five Kings, and after.
   Every word here is original to this site. Nothing is copied from any wiki.

   Shape (see js/whitebook-engine.js for the full contract):
     { id, name, house, epithet, era, arms, armsGlyph, blazon, served: [],
       lordCommander, raised, note, entry: [], fate: [], wiki } */

(window.WHITE_BOOK = window.WHITE_BOOK || []).push(

  { id: "boros-blount", name: "Ser Boros Blount", house: "Blount of Blount’s Rock",
    epithet: "A short page", era: "The Stag — Robert I",
    armsGlyph: "✦",
    served: ["Robert I", "Joffrey I"],
    raised: "In the early years of Robert I",
    note: "Of the crownlands",
    entry: [
      "Of a minor crownlands house of no great lands and less renown. He was knighted young, served in the storm of the rebellion on the winning side, and was given a white cloak in the first years of the new reign, when the order had four places to fill at once and the new king filled them quickly.",
      "He was bald, heavy, sour-tempered and loud about it, and he quarrelled with his brothers over precedence and over the duty roster more often than he faced anyone with a sword in his hand. He kept his post. He drew his pay. He was never once accused of disloyalty.",
      "Of his service the Book keeps no further record, and this is not an oversight. Four decades of a man’s life fit on a third of a page because nothing was ever set down worth the ink, and the brothers who kept the Book in his time knew exactly what they were doing by leaving it short.",
    ],
    fate: [
      "In the war he was taken alive on the Blackwater and ransomed back, which some in the order held against him. Afterwards the queen regent stripped him of his cloak in disgrace for yielding up a royal child to armed men on the road without offering battle — the page’s account; he was restored later, humiliated, and set to tasting the young king’s food for poison, which is where the order had come to by then.",
    ],
    wiki: "wiki.html#char=Boros Blount" },

  { id: "meryn-trant", name: "Ser Meryn Trant", house: "Trant",
    epithet: "Obedient in all things", era: "The Stag — Robert I",
    armsGlyph: "⚔",
    served: ["Robert I", "Joffrey I"],
    raised: "In the reign of Robert I",
    note: "Of the stormlands",
    entry: [
      "A knight of a small house, raised to the Kingsguard in the reign of Robert on the strength of respectable service in the rebellion and a reputation as a sound, unimaginative sword. He was competent with a blade, better than several of his brothers, and entirely without any quality that would make a man argue with an order.",
      "That last is the whole of him, and the reason his name is remembered at all. Under a young king who liked to test what a white cloak could be made to do, Ser Meryn was the brother the king reached for first. He beat a highborn girl bloody in open court at the throne’s word, more than once, and did it with the flat competence of a man clearing a table.",
      "The Book records the command and not the deed. That is the convention: a Sworn Brother executing his king’s instruction has done his office, and the office is what these pages exist to record. It is worth noticing, all the same, how many entries in this chapter are protected by that convention and how few of them deserve it.",
      "He was disliked by every brother who served beside him, including the ones with no standing to dislike anybody.",
    ],
    fate: [
      "Here page and screen part ways. In the books he is still in his cloak, still at his post, and the entry is unfinished. The screen’s telling follows him to Braavos on an errand of the crown’s and ends him there, in a brothel, at the hands of a girl he had good reason to remember and did not recognise.",
    ],
    wiki: "wiki.html#char=Meryn Trant" },

  { id: "preston-greenfield", name: "Ser Preston Greenfield", house: "Greenfield",
    epithet: "Little recorded", era: "The Stag — Robert I",
    armsGlyph: "✶",
    served: ["Robert I", "Joffrey I"],
    raised: "In the reign of Robert I",
    note: "Of the westerlands",
    entry: [
      "Of a westerlands house sworn to Casterly Rock. He was raised in the reign of Robert and served without distinction and without complaint, which in that reign counted as a career.",
      "He took his turns on the king’s door and on the queen’s, rode escort, stood at feasts, and appears in the ledgers of the White Sword Tower and almost nowhere else. He was well enough liked. He was thought sensible.",
      "Of his service the Book keeps no further record.",
    ],
    fate: [
      "He was killed in the great riot in King’s Landing, when the city rose against a starving winter and a boy king in the same hour and the royal party was pulled apart in the street. He died trying to reach a man who was already lost, which was probably the most creditable thing he ever did and is set down in one line.",
      "The screen’s telling of that riot does not name him among the dead.",
    ] },

  { id: "mandon-moore", name: "Ser Mandon Moore", house: "Moore",
    epithet: "The man with no friends", era: "The Stag — Robert I",
    armsGlyph: "☾",
    served: ["Robert I", "Joffrey I"],
    raised: "In the reign of Robert I, at the Hand’s recommendation",
    note: "Of the Vale",
    entry: [
      "A knight of the Vale of Arryn, brought to King’s Landing in the train of the Hand of the King and put in a white cloak not long after. Nothing in his history explains the appointment and nothing in it argues against one; he was clean, correct, and available.",
      "He was pale to the point of oddness, with dead flat eyes that did not move when he spoke, and he spoke very little. He never drank to excess, never gambled, never took a woman, never once broke a rule of the order. He was, on paper, the most observant brother of his generation.",
      "The Master of Whisperers, who made it his business to know what could be done with a man, observed of Ser Mandon that he had no friends at all — no wife, no lover, no brother he was close to, nobody in the city who would notice what he did or ask him afterwards why he had done it. He meant it as an assessment of usefulness, and it was the most perceptive line ever written about the man.",
      "Whose creature he actually was is disputed and always has been. He took his orders from the throne, like every brother; whether he also took them from elsewhere was never established while he lived.",
    ],
    fate: [
      "He died on the Blackwater in the fighting at the mud gate, drowned in the river in his armour after the king’s own Hand had been cut down beside him. What happened in the moments before is the whole question: the Hand’s squire and the Hand himself both maintained afterwards that Ser Mandon had turned his sword on the Hand in the confusion, deliberately and with intent to kill.",
      "No proof was ever produced, no one confessed to sending him, and the two men most often named as his paymaster have been argued for with equal confidence. The Book records that he fell in the king’s defence, which is what a dead brother is always given.",
    ],
    wiki: "wiki.html#char=Mandon Moore" },

  { id: "arys-oakheart", name: "Ser Arys Oakheart", house: "Oakheart of Old Oak",
    epithet: "The scrupulous brother", era: "The Stag — Robert I",
    arms: "assets/sigils/minor/old-oak.png",
    blazon: "Three green oak leaves upon gold.",
    served: ["Robert I", "Joffrey I"],
    raised: "In the later years of Robert I",
    note: "Of the Reach",
    entry: [
      "Son of Ser Gwayne Oakheart of Old Oak in the Reach, from a house that has given the order more brothers than most and takes visible pride in it. He was the last man raised in Robert’s reign, and the youngest of that seven by some years.",
      "He is worth a page because he is the only brother of his generation who found the work difficult. He obeyed his king. He also went away afterwards and turned it over, and reasoned himself into and out of it, and asked a septon about it, and obeyed again the next time. The Book does not have a word for that condition. It records duty performed and takes no interest in what the performing cost.",
      "In the second year of the war he was sent south to Dorne as sworn shield to a princess of the blood who had been given in betrothal to seal an alliance, and so passed out of the daily reckoning of the seven. A brother detached to guard a hostage is still a brother, but he is a long way from the White Sword Tower and from anyone who might tell him no.",
      "A note on the record: this brother belongs to the page and not to the screen. He is not among the Kingsguard the screen shows at that court, and nothing set down here about him is drawn from that telling.",
    ],
    fate: [
      "In Dorne he was taken up by a princess of Sunspear who wanted a white cloak for a plan of her own, and he broke his vows for her, and then broke faith with the crown as well. When the plot was caught on the road he chose not to be taken, and rode alone into the captain of the Dornish guard and was cut down for it. He appears to have preferred the charge to the explanation.",
    ],
    wiki: "wiki.html#char=Arys Oakheart" },

  { id: "sandor-clegane-kg", name: "Sandor Clegane", house: "Clegane",
    epithet: "No ser", era: "The War of the Five Kings — Joffrey I and Tommen I",
    arms: "assets/sigils/clegane.svg",
    blazon: "Three black dogs upon a field of yellow.",
    served: ["Joffrey I"],
    raised: "By King Joffrey I, to fill the place of the dismissed Lord Commander",
    note: "Never knighted",
    entry: [
      "Younger son of a landed knight sworn to Casterly Rock, a house raised out of nothing within living memory for a service done to the lions. He came to court as a boy and was made sworn shield to a prince, and grew into the largest and most feared man in the Red Keep with the exception of one, and that one was his brother.",
      "He was never knighted. This was not an oversight and not a slight; it was refused, repeatedly and in public, and he was rude about it. He held that the anointing is a lie told over men who have no intention of keeping it, and he had watched enough anointed knights at close range to make the argument well. He would not kneel for it and nobody could make him.",
      "When a boy king dismissed the Lord Commander of the Kingsguard in open court, the white cloak he had thrown down was offered to a man who had never taken a vow in a sept in his life. The Book sets down no earlier instance of an unknighted man in the seven. Whether he is truly the first in three centuries cannot be proved from these pages, but the scribe of the day thought it novel enough to note.",
      "He kept the office better than several who had earned it properly. He stood his watches, guarded his king through a riot that nearly ended the reign, and was the one brother who never pretended the arrangement was honourable.",
    ],
    fate: [
      "On the night of the battle at the Blackwater the burning ships broke him — he had been badly burned as a child and had never mastered the fear of fire — and he walked off the wall, out of the castle and out of the order in the middle of the fighting, and did not come back. He was cried craven for it by men who had not been on that wall.",
      "What became of him afterwards belongs to another book, and the tellings differ.",
    ],
    wiki: "wiki.html#char=Sandor Clegane" },

  { id: "balon-swann", name: "Ser Balon Swann", house: "Swann of Stonehelm",
    epithet: "A true knight, late in the day", era: "The War of the Five Kings — Joffrey I and Tommen I",
    arms: "assets/sigils/minor/stonehelm.png",
    blazon: "Swans combatant, black and white, upon a field parted the same.",
    served: ["Joffrey I"],
    raised: "After the battle on the Blackwater, to fill a place left empty",
    note: "Of the stormlands",
    entry: [
      "Second son of the Lord of Stonehelm on the Cape of Wrath, out of a house whose arms — two swans fighting, one black and one white, on a field split down the middle — turned out to be an unusually honest piece of heraldry. In the war his family sent one son to each side and waited to see. He was the son sent to the throne.",
      "He was among the best archers in the realm and a good enough lance to be worth watching in a tourney, and he had fought hard on the walls and in the field on the day the city was saved. When the smoke cleared the order had two places open and a court that needed to look as though it were rewarding merit, and for once the two requirements pointed at the same man.",
      "He proved a genuinely good brother: even-tempered, courteous to people beneath him, and stubborn about the parts of the rule that had stopped being observed. He was one of the very few men in this chapter whom the other Sworn Brothers respected without qualification, and he was later trusted with delicate business in Dorne on the crown’s behalf.",
      "This brother, too, belongs to the page and not the screen. He does not appear in the screen’s telling of that court, and nothing recorded here is taken from it.",
    ],
    fate: [
      "His story is not finished in the books. He was last set down in Dorne, carrying out an errand for the crown that would have tested a far less scrupulous man, and the page under his name is still open.",
    ] },

  { id: "osmund-kettleblack", name: "Ser Osmund Kettleblack", house: "Kettleblack",
    epithet: "The queen’s creature", era: "The War of the Five Kings — Joffrey I and Tommen I",
    armsGlyph: "⚔",
    served: ["Joffrey I"],
    raised: "After the battle on the Blackwater, at the queen regent’s insistence",
    note: "Raised by favour",
    entry: [
      "Eldest of three brothers out of nowhere in particular — sellswords, or something less tidy than that, who had been selling their arms up and down the narrow sea and arrived at King’s Landing at the moment the crown was buying. Their father’s name is not written here and probably was not worth writing.",
      "He was raised to the Kingsguard within a year of coming to court, over the heads of better men, because the queen regent wanted brothers in the seven who belonged to her rather than to the office. The Book, which by convention records the deed that earned each cloak, records no deed at all in his case. That silence is the entry.",
      "He was a big, cheerful, black-haired man with a ready grin and a very good opinion of himself, and he told anyone who would listen that he was the equal of the great swords of the last generation. Nobody who had seen him work believed it. He was, on the evidence, an adequate fighter and an excellent flatterer, and he understood precisely which of the two had bought him the cloak.",
      "He kept his brothers close and their advancement in mind throughout, which is the exact behaviour the vows were written to prevent, and no Lord Commander of that court was in any position to say so.",
      "He belongs to the page. The screen’s telling has no place for him.",
    ],
    fate: [
      "When the crown fell out with the Faith, he was named in the accusations laid against the queen regent and was one of the men she looked to for a champion in the trial that followed. His page in the books is not yet closed, but nothing about the direction of it is encouraging.",
    ] },

  { id: "loras-tyrell", name: "Ser Loras Tyrell", house: "Tyrell of Highgarden",
    epithet: "The Knight of Flowers", era: "The War of the Five Kings — Joffrey I and Tommen I",
    arms: "assets/sigils/tyrell.svg",
    blazon: "A golden rose upon a field of green.",
    served: ["Joffrey I"],
    raised: "After the alliance of Highgarden and the Iron Throne",
    note: "Of Highgarden",
    entry: [
      "Third son of the Lord of Highgarden, knighted young, and by the time he was seventeen the most talked-about lance in the Seven Kingdoms. He won tourneys the way other men win arguments — constantly, and without appearing to work at it — and he once took a joust off a far heavier opponent with a trick of horseflesh rather than of arms, which the crowd loved and the losers did not.",
      "He was beautiful, vain, devout in a young man’s absolute way, and much better in a real fight than his tourney reputation suggested. When Highgarden came over to the Iron Throne and sealed it with a marriage, a son of that house in a white cloak was part of the price, and he took the vows willingly. A third son gives up little land by it, and he had reasons of his own that the Book does not enquire into.",
      "He asked, and was given, the duty of guarding his own sister the queen — an arrangement no Lord Commander of the old order would have permitted for a heartbeat, and which nobody at that court thought worth objecting to. The rule that a brother has no family is the oldest clause in the vows. By this reign it had become a formality.",
      "The record must be plain here. It is the page and not the screen that puts this knight in the Kingsguard. In the screen’s telling he never joins the order at all, and his story there runs another way entirely.",
    ],
    fate: [
      "In the books he asked for the command of the assault on Dragonstone, took the castle, and was carried out of it so badly burned and broken that the maesters would not promise he would live. Reports out of that siege contradict one another to a degree that has made some readers doubt all of them, and the crown had reasons to want the doubt.",
      "The screen’s telling gives him a different end altogether, in the sept at King’s Landing, and it should not be read back into the books.",
    ] },

  { id: "robert-strong", name: "Ser Robert Strong", epithet: "The silent giant",
    era: "The War of the Five Kings — Joffrey I and Tommen I",
    armsGlyph: "✶",
    served: ["Tommen I"],
    raised: "By the crown, at the urging of a dismissed maester",
    note: "Name and blood unproved",
    entry: [
      "The strangest name in three hundred years of this book, and the only one whose bearer nobody can vouch for. He was presented at court by a man who had been stripped of his maester’s chain by the Citadel for experiments the Citadel would not describe, and was named to the Kingsguard on that man’s word.",
      "He stands nearly eight feet in his armour. He has never been seen to eat, to drink, to sleep, or to lift his visor. He does not speak. He made his vows in silence, and the explanation offered for the silence was that he had sworn to say no word until the crown’s enemies were dealt with, which is not a form of oath the order has ever used before.",
      "The Book records the name given and nothing else, because nothing else has been established. It is very widely held at court and in the streets that the armour contains a knight who was reported dead, and the resemblance in height and reach is not easily dismissed; it is equally true that no one has looked, that the man who made him will not say, and that a great many confident accounts of what is inside that helm are guesses wearing a firm voice. The Book does not settle it and neither will this page.",
      "He is a creature of the books. The screen has a figure who serves the same purpose at the same court, but the screen never names him to the seven, and the two should not be treated as one entry.",
    ],
    fate: [
      "He was raised to be a champion in a trial by battle, and that is the entirety of his purpose. What he does in that trial, and what it costs the woman who commissioned him, is not yet written.",
    ] },

  { id: "brienne-tarth", name: "Ser Brienne of Tarth", house: "Tarth of Evenfall Hall",
    epithet: "The first woman in this book", era: "After the war",
    arms: "assets/sigils/tarth.svg",
    blazon: "Quartered, suns of gold and moons of silver, upon rose and azure.",
    served: ["Bran I"], lordCommander: true,
    raised: "After the last war, in the reign that followed",
    entry: [
      "The record must open by saying what it is. This entry belongs to the screen’s telling and to that telling alone; the books have not reached it, and no page of the true Book of the Brothers yet carries a woman’s name.",
      "Only surviving child of Lord Selwyn Tarth, called the Evenstar, whose seat is Evenfall Hall on the Sapphire Isle. She was very tall, very strong, and by the standards of a court that valued neither in a woman, plain — and she was told so at every stage of a childhood in which three betrothals were arranged for her and three came apart. She learned arms instead. She beat men who had been trained since they could walk, and their reward for losing to her was to insist that it had not happened properly.",
      "She served in the guard of a king in the south before that king’s cause ended, and afterwards took service with a lady of the riverlands, and afterwards discharged an oath sworn to that lady across a war-torn country with a stubbornness that would have looked excessive in a septon. She was, throughout, not a knight. No one would knight her. The rule is not written anywhere; it did not need to be.",
      "That was set right at last on the eve of the worst battle the North has ever fought, in a hall full of people who expected to die before morning, when a Sworn Brother of this order knelt her and said the words over her — an anointing no septon witnessed and no one present thought irregular. She is, so far as anyone can establish, the first woman ever made a knight in the Seven Kingdoms.",
      "In the reign that followed she was named to the Kingsguard and given command of it. She is the first woman to bear that office and the first Lord Commander in a long while whose appointment nobody at court could explain away as a favour.",
    ],
    fate: [
      "Her first act with the Book in front of her, in the screen’s telling, was not to write her own page. She turned back to a page an earlier hand had left short — four lines and a great deal of white — and she filled in the rest of it herself, plainly and at length, setting down the deeds and leaving the judgements to whoever reads them. Then she signed off the entry and closed the book.",
      "It is the only moment in three centuries where the Book is shown being kind on purpose.",
    ],
    wiki: "wiki.html#char=Brienne of Tarth" },

  { id: "podrick-payne", name: "Ser Podrick Payne", house: "Payne",
    epithet: "The squire", era: "After the war",
    armsGlyph: "✦",
    served: ["Bran I"],
    raised: "After the last war, in the reign that followed",
    note: "Of the screen’s telling",
    entry: [
      "This entry, like the one before it, is the screen’s and not the page’s. In the books he is a squire still, and no one has suggested otherwise.",
      "Of a poor and disgraced branch of a westerlands house, given to a lord’s son as a squire mostly to get him out of the way. He turned out to be steadier than anyone had bothered to notice: quiet, willing, entirely unimpressed by rank, and capable of remembering exactly who had been decent to him. He served two masters through a war and a siege and a long march, and neither of them ever had cause to doubt him.",
      "The screen’s telling sets him among the Kingsguard at the end of it all, in the white, at the door of the council chamber, addressed as ser. The Book has raised men for far less and written far longer entries about them.",
    ],
    fate: [
      "Nothing further is recorded. His page, in both tellings, is still open.",
    ],
    wiki: "wiki.html#char=Podrick Payne" }

);
