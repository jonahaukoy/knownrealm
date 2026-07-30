/* THE WHITE BOOK — IV. The Mad King, Aerys II.
   Every word here is original to this site. Nothing is copied from any wiki.

   Shape (see js/whitebook-engine.js for the full contract):
     { id, name, house, epithet, era, arms, armsGlyph, blazon, served: [],
       lordCommander, raised, note, entry: [], fate: [], wiki } */

(window.WHITE_BOOK = window.WHITE_BOOK || []).push(

  { id: "gerold-hightower", name: "Ser Gerold Hightower", house: "Hightower of Oldtown",
    epithet: "The White Bull", era: "The Mad King — Aerys II",
    arms: "assets/sigils/hightower.png",
    blazon: "A stepped tower crowned with fire, white upon smoke grey.",
    served: ["Aegon V", "Jaehaerys II", "Aerys II"], lordCommander: true,
    raised: "Under King Aegon the Fifth; Lord Commander by the reign of Jaehaerys",
    entry: [
      "Born to the Hightowers of Oldtown, the oldest and richest of the houses of the Reach, and knighted young into a family that had produced Sworn Brothers before him. He was a broad, thick-chested man even in youth, and the name the tourney grounds gave him — the White Bull — was meant first as a description and only later as a compliment.",
      "He came to the white cloak in the last years of Aegon the Fifth and rose to command the seven before Aerys was crowned. In all he served three kings, and the Book has him at the head of the order for the whole of the reign that this chapter records. No brother of his generation was longer in the cloak, and none was more exact in it.",
      "His great deed was done at Duskendale, where Lord Darklyn shut the gates with the king inside them. Ser Gerold rode to the walls alone and went in alone, unarmoured and unarmed but for his office, to demand his king back. He was kept there against his will for the better part of half a year, and he never once counselled the storming of the town, because the storming of the town would have killed the man he was sworn to keep alive. He was carried out at last with Aerys and returned to his post without comment.",
      "What the Book records of him is duty; what the men who served under him remembered was the way he explained it. A young brother once put to him the question that hung over the whole of that reign — what the seven were to do when the king himself was the danger — and the Lord Commander answered that a Sworn Brother’s vows leave him no room to weigh a king, only to guard him. He said it without heat, as a man states a rule of arithmetic. Every brother who stood in that throne room afterwards had that answer to lean on, and several of them plainly needed it.",
      "He was in the Reach and then in the south on the king’s business through the last year of the reign, sent to find Prince Rhaegar and bring him home. Of that errand the Book sets down the sending and not the finding.",
    ],
    fate: [
      "He never returned to King’s Landing. When the war was lost he was found far to the south, in the red mountains of Dorne, standing before a lonely tower with two of his brothers, and he died there against Lord Eddard Stark and his companions. Why the three of them were in that place, and what they were guarding, the Book does not say, and no later hand has been willing to write it down. Everything commonly told of it is inference.",
      "His body was burned and his bones were sent home to Oldtown. The order has never since had a Lord Commander who served so long or so narrowly.",
    ] },

  { id: "barristan-selmy", name: "Ser Barristan Selmy", house: "Selmy of Harvest Hall",
    epithet: "Barristan the Bold", era: "The Mad King — Aerys II",
    armsGlyph: "⚜",
    blazon: "Three stalks of yellow wheat upon brown.",
    served: ["Jaehaerys II", "Aerys II", "Robert I", "Joffrey I"], lordCommander: true,
    raised: "260 AC, in his twenty-third year, by King Jaehaerys II",
    entry: [
      "Son of Lord Lyonel Selmy of Harvest Hall in the stormlands, a small house of no particular consequence, which makes what follows the more remarkable. At ten years old he borrowed armour that did not fit him and rode into a tourney as a mystery knight, and was unhorsed, and was laughed at, and was given by a Targaryen prince the name he has carried ever since. He was knighted at sixteen for deeds done in the field rather than for his blood.",
      "The deed that made him was done in the Stepstones in the last of the Blackfyre wars, where he sought out Maelys the Monstrous, the last pretender of that line, and killed him in single combat and so ended the war. He was three-and-twenty when the old king put the white cloak on him, and there were men present who said aloud that the order had not been so well served in a lifetime.",
      "His service filled pages. He broke the Kingswood Brotherhood’s strength alongside two of his brothers and killed their captain. He rode in the great tourneys of the age and won more of them than any man then living. Above all, at Duskendale, where his Lord Commander had already been taken, he went over the wall by night alone, cut his way to the cell, and brought the king out through a town that wanted him dead. There is no clearer instance in the whole of this book of a brother doing the one thing the vows exist for.",
      "In the war that ended the reign he rode with the royal host and cut deep into the rebel van at the Trident, and was carried off the field so badly hurt that he was expected to die of it. He did not. The Book gives him more room than it gives any other brother of his century, and the hand that wrote most of it was not his own; brothers who had no reason to flatter him kept adding to the page.",
      "Of his temper the record says little, because there was little to say. He was courteous to servants, sparing with words, and inclined to blame himself for things no man could have prevented. He stood in the throne room through the worst of the reign like the rest of them, and in later years, when he spoke of it at all, he did not defend it.",
    ],
    fate: [
      "The victor of the war pardoned him where he lay, and named him Lord Commander, and he served the new king faithfully for the whole of that reign and thought the last years of it a waste of a good man.",
      "His dismissal came from a boy king in open court, on the excuse of his age, and was done crudely and in front of the others. He tore off the cloak and left it on the floor, and walked out of the Red Keep into a city that had no place for him. What followed took him east across the narrow sea, and is set down elsewhere; the Kingsguard’s book loses him at the door.",
    ],
    wiki: "wiki.html#char=Barristan Selmy" },

  { id: "lewyn-martell", name: "Prince Lewyn Martell", house: "Nymeros Martell of Sunspear",
    epithet: "The Dornishman", era: "The Mad King — Aerys II",
    arms: "assets/sigils/martell.svg",
    blazon: "A red sun pierced by a golden spear.",
    served: ["Aerys II"],
    raised: "In the reign of Aerys II; the year is not firmly set down",
    note: "A prince of Dorne",
    entry: [
      "A prince of the ruling house of Dorne, uncle to Princess Elia who married the crown prince, and the only man in these pages to have given up a place in a sovereign family for a white cloak. Dorne came into the realm by marriage rather than by conquest, and the presence of a Martell among the seven was understood on both sides to mean something beyond the man himself.",
      "He was raised in the reign of Aerys, though the Book is vague as to the year, and he was already a seasoned knight when he took the vows. He fought in the war in the Stepstones before he was a brother of the order. At court he was liked, which was not universal among the seven, and he was the one the Dornish at King’s Landing went to when they wanted something said to the Iron Throne without saying it themselves.",
      "It was widely known, and never written anywhere but in gossip, that he kept a woman in the city for many years. No Lord Commander disciplined him for it. The Book is silent, as the Book is silent about a great many things it does not wish to be asked about, and a reader who wants the order’s rule and the order’s practice to agree will not find comfort here.",
      "When the realm rose, the king gave him command of the Dornish spears — some ten thousand men, by the counts that survive — and set him on the left of the royal host on the Trident. That a Sworn Brother should command an army at all was irregular; the vows bind a man from lands and heirs, not from a battle line.",
    ],
    fate: [
      "He fell on the Trident, in the ruin of the royal left, and the Dornish who came home said he had been badly wounded before the fighting even reached him and refused to be taken from his men. His niece and her children were still in King’s Landing when he died, which Dorne has never entirely forgiven and has never entirely stopped mentioning.",
    ] },

  { id: "jonothor-darry", name: "Ser Jonothor Darry", house: "Darry of Darry",
    epithet: "The plain-spoken brother", era: "The Mad King — Aerys II",
    armsGlyph: "⚔",
    blazon: "A ploughman, black upon brown.",
    served: ["Aerys II"],
    raised: "In the reign of Aerys II",
    note: "Of the riverlands",
    entry: [
      "Of House Darry of the riverlands, whose lords had held for the dragons since before the Conquest was finished and went on holding for them longer than was good for the house. He was knighted in the ordinary way, in his father’s hall, and came to notice as a hard, reliable lance rather than a brilliant one.",
      "He was raised in the reign of Aerys and rode in the campaign against the outlaws of the Kingswood, where he served under a better swordsman than himself without visible resentment, which the Book notes because it is not always the case. He kept the king’s person, took his turns on the door, and was one of the men trusted with the night watches in the last uneasy years.",
      "He is remembered chiefly for a sentence. Standing outside a locked door in the Red Keep with a younger brother beside him, listening to what was happening on the other side of it, he told the boy the plain construction of the vows: that the seven are sworn to the king, and to no one else in the castle, and that a brother who has taken those vows does not get to choose which of the king’s doings he will permit. He was not being cruel. He was being accurate, and the accuracy is the thing this book has never found an answer to.",
      "Of his own opinion of what he guarded, no record survives at all. He said what the rule was and he kept it.",
    ],
    fate: [
      "He rode with the royal host to the Trident and died there, in the press around the royal standard, in the same hour that took the crown prince and the Dornish commander. His house survived him and chose the losing side twice more afterwards.",
    ] },

  { id: "oswell-whent", name: "Ser Oswell Whent", house: "Whent of Harrenhal",
    epithet: "The black bat", era: "The Mad King — Aerys II",
    armsGlyph: "☾",
    blazon: "Nine black bats upon a field of gold.",
    served: ["Aerys II"],
    raised: "In the reign of Aerys II",
    note: "Of Harrenhal",
    entry: [
      "Brother to Lord Walter Whent, who held Harrenhal, the vast ruined castle on the Gods Eye that has been unlucky for everyone who has ever owned it. He wore a black bat on his helm in the field, which made him easy to find in a melee and appears to have been the point.",
      "He was a dry, joking man, quick with a bitter word, and a better fighter than his manner suggested. He rode in the hunt for the Kingswood Brotherhood and was one of the party that broke them. Thereafter he was among the brothers closest to Prince Rhaegar, and went where the prince went more often than where the king was.",
      "In the year 281 his brother held a tourney at Harrenhal of a size the realm had not seen in living memory, and much of what followed in the next two years can be traced back to who spoke to whom there. That Ser Oswell had a hand in the arranging of it has been argued for a long time and proved by nobody; the Book records only that he attended, as a brother of the order attends his king.",
      "Of his service after that year the record thins sharply. He was seen riding south with the prince in the spring, and the entries stop.",
    ],
    fate: [
      "He was one of the three found at the tower in the Dornish mountains at the war’s end, and he died there with his Lord Commander and the Sword of the Morning against Lord Stark’s company. Only two men walked away from that field, and neither of them was ever willing to explain it fully.",
    ] },

  { id: "arthur-dayne", name: "Ser Arthur Dayne", house: "Dayne of Starfall",
    epithet: "The Sword of the Morning", era: "The Mad King — Aerys II",
    arms: "assets/sigils/minor/starfall.png",
    blazon: "A sword and a falling star, white upon lilac.",
    served: ["Aerys II"],
    raised: "In the reign of Aerys II, while still a young man",
    note: "Sword of the Morning",
    entry: [
      "Of House Dayne of Starfall, on the Torentine in the Dornish marches, an old house with one peculiar possession: a greatsword called Dawn, pale as milkglass, said to have been forged from the heart of a fallen star. It is not an inherited weapon in the ordinary way. Each generation the Daynes give it only to a knight of their blood they judge worthy of it, and he is called the Sword of the Morning, and in most generations there is nobody. In his there was.",
      "He was raised to the Kingsguard young, in the reign of Aerys, and by the common judgement of everyone qualified to judge — including two men in this book who had every reason to prefer some other answer — he was the finest knight of his age and possibly of several. He was not merely quick. He was quick and enormous at once, which is a combination the training yard produces about twice a century.",
      "His best-known campaign was against the Kingswood Brotherhood, outlaws who had made the royal forest impassable for years and were sheltered by the smallfolk because the smallfolk were being robbed by both sides and preferred the thieves who spoke their language. Ser Arthur did not burn villages. He rode into them, heard the complaints, paid what the crown owed, and hanged the crown’s own offenders where the complaints were just. Within a season the outlaws had no cover left, and he cut them apart in the open and killed their captain, a savage called the Smiling Knight, in single combat. He is said to have handed the man water first. On that campaign he knighted a boy of fifteen on the field, of whom more later in this book.",
      "The Book has an opinion of him and does not hide it. He was courteous without effort, generous with credit, and gentle with people who could do nothing for him, which is rarer in these pages than valour. Prince Rhaegar had no closer friend.",
      "And he stood in the throne room. That is the part the record sets down flatly and then walks past. When the king burned men in open court, the finest knight in the world was standing eight feet away in a white cloak, and he did nothing, because his vows told him the king’s will was the whole of the law and nobody had yet written a vow for the other case. Every honest reader of this book stops on that page.",
    ],
    fate: [
      "At the war’s end he was not with the royal host and not in the city. He was in the red mountains of Dorne with two of his brothers, at a tower with a name that has since become a joke about what it was called before. Lord Eddard Stark came there with six companions. Ser Arthur died on that ground, and Lord Stark carried Dawn home to Starfall and gave it back to the Daynes, and would not afterwards be drawn on any detail of the fight.",
      "What the three of them were doing there is the oldest argument in the realm. The Book declines to settle it, and so does this page.",
    ] },

  { id: "jaime-lannister-kg", name: "Ser Jaime Lannister", house: "Lannister of Casterly Rock",
    epithet: "The youngest brother ever raised", era: "The Mad King — Aerys II",
    arms: "assets/sigils/lannister.svg",
    blazon: "A lion rampant, gold upon crimson.",
    served: ["Aerys II", "Robert I", "Joffrey I"], lordCommander: true,
    raised: "281 AC, in his fifteenth year, by King Aerys II",
    entry: [
      "Eldest son of Lord Tywin Lannister of Casterly Rock, heir to the richest seat in the realm. He squired for Ser Sumner Crakehall and rode in the Kingswood against the outlaws while still a boy, and was knighted there on the field, at fifteen, by the Sword of the Morning himself.",
      "In the same year, at the tourney at Harrenhal, King Aerys named him to the Kingsguard. He was the youngest man ever to put on the white cloak, and the honour cost him his inheritance, his marriage prospects and his father’s office in a single afternoon, none of which the Book thought worth recording.",
      "Here the entry ends. The scribe wrote four lines and left the rest of the page white, as scribes do when a brother is very young and the deeds are expected to come later. They have not been added. Later hands have had opportunities and have left the space alone, and the blankness under his name has become a kind of statement in itself — the Book’s way of declining to say what it knows.",
    ],
    fate: [
      "At the sack of King’s Landing he killed Aerys Targaryen in the throne room and was found sitting on the Iron Throne when the rebels came in. The new king pardoned him and kept him in the cloak, and the realm gave him a name he never afterwards escaped, and he never once offered the court an explanation of what he had done or why. What was said in that room is not written anywhere.",
      "He was later named Lord Commander of the Kingsguard, the youngest in the order’s history, and it was in that office that he read his own four lines and understood exactly how much space was left.",
    ],
    wiki: "wiki.html#char=Jaime Lannister" }

);
