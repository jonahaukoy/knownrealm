/* HOUSE FAMILY TREES — short, NON-SPOILER descriptions for the character cards.
   One or two sentences on who a person is, never how their story ends. Keyed by
   the exact name shown in the tree; only unambiguous names are keyed (short
   names shared by several people — Aegon, Viserys, Rhaenys, Brandon, Benjen,
   Rickon — are left to their node title to avoid mixing people up). */
const BIOS = {
  // ---- Targaryen ----
  "Aegon I Targaryen": "The Conqueror who forged the Seven Kingdoms into one realm with three dragons and two sister-wives, and raised the Iron Throne from the swords of his enemies.",
  "Maegor I": "Aegon's younger son by Visenya, a warrior of terrible strength and temper who takes wife after wife in search of an heir.",
  "Jaehaerys I": "The Old King and the Conciliator, who with his sister-queen Alysanne gives the realm the longest and most peaceful reign it has ever known.",
  "Alysanne": "The Good Queen, beloved of the smallfolk, who flies her dragon Silverwing the length of the realm and softens her brother-husband's harder edges.",
  "Viserys I": "A warm, peace-loving king who wants nothing so much as family and quiet, and rules a golden age he is too gentle to defend.",
  "Rhaenyra": "Viserys's firstborn and named heir, the Realm's Delight — a proud, dragon-riding princess raised to a throne many swear a woman may never hold.",
  "Daemon": "The Rogue Prince: rider of Caraxes, bearer of the Valyrian blade Dark Sister, and the most dangerous man in Westeros — a warrior his brother can neither tame nor be rid of.",
  "Aegon II": "Alicent's eldest son, rider of Sunfyre the Golden — an easy, pleasure-loving prince with a claim his mother's people press harder than he does.",
  "Helaena": "The gentlest of Alicent's children, dreamer and rider of Dreamfyre, who speaks in riddles the court laughs off until they come true.",
  "Aemond": "Alicent's second son, cold and clever, who as a boy claims the monstrous Vhagar — the greatest dragon in the world — and never forgets a slight.",
  "Aegon IV": "The Unworthy: a gluttonous, scheming king whose appetites and favourites sow the seeds of a century of rebellion.",
  "Daeron II": "The Good, a bookish and just king who binds Dorne to the realm at last by marrying its princess.",
  "Maekar I": "A stern, martial king, the youngest of Daeron the Good's sons, once a hedge knight's unlikely liege.",
  "Aegon V": "The Unlikely — 'Egg', a hedge knight's squire who never expected a crown, and rules with a common man's sympathies and a dreamer's hopes.",
  "Aerys II": "A king who begins bright and generous and curdles, by degrees, into suspicion and fire.",
  "Rhaegar": "The last dragon prince: a melancholy, gifted knight who would rather read prophecy and play the harp than rule, and whom half the realm loves.",
  "Daenerys": "The last child of the old dynasty, born in exile amid salt and smoke — a girl sold across the narrow sea who means to take back what was taken.",
  "Jon Snow": "Raised as Ned Stark's bastard son at Winterfell, a sworn brother of the Night's Watch, quiet and dutiful and always a half-step apart.",

  // ---- Velaryon ----
  "Corlys Velaryon": "The Sea Snake: the greatest sailor the realm has known, master of a fleet larger than the crown's and of a fortune to match, lord of Driftmark.",
  "Laena": "Corlys and Rhaenys's daughter, a bold and joyful woman who rides the ancient dragon Vhagar.",
  "Laenor": "Corlys and Rhaenys's son, a gallant knight and rider of Seasmoke whose heart is his own to give.",
  "Vaemond Velaryon": "The Sea Snake's younger brother, a proud captain with firm opinions about who should inherit Driftmark.",
  "Jacaerys": "Rhaenyra's eldest son and heir, earnest and dutiful, a young dragonrider eager to prove himself worthy of a crown.",
  "Lucerys": "Rhaenyra's gentle second son, heir to Driftmark, happier at his books than at the thought of ruling.",
  "Addam of Hull": "A shipwright's son of Driftmark with silver Velaryon hair, who claims a riderless dragon and, with it, a name.",
  "Alyn of Hull": "Addam's brother, a bold young sailor of the Sea Snake's fleet marked for a great future on the water.",

  // ---- Hightower ----
  "Otto Hightower": "Hand to two kings, the clever, patient second son of Oldtown who places his daughter beside the throne and plays the long game better than anyone.",
  "Alicent": "Otto's daughter, once Rhaenyra's dearest friend, made a queen at fifteen — and, in time, the fiercest champion of her own sons' claim.",
  "Gwayne": "Alicent's brother, a polished knight of Oldtown with a dry wit.",

  // ---- Stark ----
  "Cregan Stark": "The Wolf of the North, a hard young Lord of Winterfell of the old blood who keeps his oaths the way his house keeps winter stores.",
  "Rickard Stark": "Lord of Winterfell and Warden of the North, an ambitious lord who looks to bind his house to the south by marriage.",
  "Eddard": "Lord of Winterfell and Warden of the North, the most honourable man in the realm — a soldier who wants nothing so much as to go home.",
  "Robb": "Ned and Catelyn's eldest, a brave and dutiful boy with his father's sense of honour and a direwolf named Grey Wind.",
  "Sansa": "The elder Stark daughter, courteous and dreaming of songs and gallant knights, with far more steel in her than anyone yet suspects.",
  "Arya": "The younger Stark daughter — wilful, quick, and happier with a blade than a needle.",
  "Bran": "The second Stark son, a fearless climber who dreams of knighthood, with a direwolf named Summer.",
  "Lyanna": "Ned's beautiful, headstrong sister, the winter rose of the North, betrothed to Robert Baratheon.",

  // ---- Lannister ----
  "Tywin": "The Great Lion of Casterly Rock, Hand of the King and the most feared lord in the realm — cold, brilliant, and utterly without mercy.",
  "Cersei": "Tywin's golden daughter, a queen of fierce ambition and fiercer love for her children, who chafes at every limit her sex places on her.",
  "Jaime": "The Kingslayer: the finest sword in the realm and the youngest man ever to wear a white cloak, quick of tongue and quicker of blade.",
  "Tyrion": "The Imp: Tywin's dwarf son, scorned by his father and mocked by the realm, who arms himself with wine, wit, and books.",
  "Kevan": "Tywin's steadfast younger brother, a capable and loyal soldier content to stand in his brother's shadow.",
  "Jason Lannister": "Lord of Casterly Rock in the days of the Dance, golden and gallant and sure of his own worth.",
  "Tyland Lannister": "Jason's shrewd twin, master of ships and then of coin, the sharpest ledger in the realm.",

  // ---- Baratheon ----
  "Rogar Baratheon": "Lord of Storm's End and Hand of the King in the early days of the dynasty, wed to the queen dowager.",
  "Robert": "The Lord of Storm's End turned warhammer-swinging rebel, a mighty and charming warrior who loves battle, feasting, and little else.",
  "Stannis": "Robert's dour, iron-willed middle brother, a grim and rigid man with an unbending sense of duty and a grievance for every kindness.",
  "Renly": "Robert's youngest brother, charming and beloved, Lord of Storm's End, with an easy smile and large ambitions.",
  "Gendry": "A bull-strong smith's apprentice of Flea Bottom, black of hair and blue of eye, who has no idea whose blood runs in him.",
  "Borros": "Lord of Storm's End in the days of the Dance, a proud and prickly stormlord with four daughters and no sons.",

  // ---- Tully ----
  "Hoster Tully": "Lord of Riverrun, a proud and canny river lord who marries his daughters into the great houses to bind the realm to the Trident.",
  "Catelyn": "Born a Tully of Riverrun, Lady of Winterfell by marriage — fierce in the defence of her children and steady where her lord is troubled.",
  "Lysa": "Hoster's younger daughter, wed to the old Lord of the Eyrie — anxious, doting, and fiercely protective of her sickly son.",
  "Edmure": "Hoster's son and heir to Riverrun, warm-hearted and eager, forever trying to live up to his father's shadow.",
  "Brynden Tully": "The Blackfish: Hoster's brother and the finest soldier the rivers ever made, who quarrelled with his family and never took a wife.",

  // ---- Arryn ----
  "Jon Arryn": "Lord of the Eyrie and Warden of the East, an old and honourable lord who fostered two rebel boys and would not give them up.",
  "Jeyne Arryn": "The Maiden of the Vale, Lady of the Eyrie in her own right, who holds her seat against every cousin who thinks a woman cannot.",
  "Robin Arryn": "The sickly young Lord of the Vale, doted upon by his fearful mother and coddled far past his years.",

  // ---- Martell ----
  "Doran": "Prince of Dorne, a patient, gout-stricken ruler who plays a longer and colder game than anyone around him guesses.",
  "Oberyn": "The Red Viper: Doran's brother, a brilliant, dangerous prince as skilled with poison and blade as with a jest, and slow to forgive.",
  "Elia": "Doran's gentle sister, a princess of Dorne wed to the last dragon prince.",
  "Arianne": "Doran's fiery eldest, the heir to Sunspear, proud and impatient for the power she believes is being kept from her.",
  "Quentyn": "Doran's quiet, dutiful son, an unassuming young prince sent east on a secret errand far grander than he is.",
  "Trystane": "Doran's youngest, a good-natured boy prince betrothed young to a princess of the west.",

  // ---- Tyrell ----
  "Mace": "Lord of Highgarden and Warden of the South, a vain and blustering lord kept afloat by cleverer hands around him.",
  "Loras": "The Knight of Flowers, the dazzling young heir's brother, the most gifted and beautiful jouster in the realm.",
  "Margaery": "Mace's clever, gracious daughter, as skilled at winning the love of the smallfolk as her grandmother is at winning games of power.",
  "Willas": "Mace's eldest, the crippled heir to Highgarden, a thoughtful lord of hounds, hawks, and horses.",
  "Garlan": "Mace's second son, called the Gallant, a modest and deadly knight overshadowed only by his famous brother.",

  // ---- Greyjoy ----
  "Dalton Greyjoy": "The Red Kraken, Lord Reaper of Pyke at sixteen, a bold and bloody reaver who reads a realm at war as an open invitation.",
  "Balon": "The proud, hard Lord of the Iron Islands, who dreams of the old way of reaving and pays the iron price.",
  "Euron": "The Crow's Eye: Balon's exiled brother, a cunning and terrifying pirate-lord who fears nothing under any god.",
  "Victarion": "Balon's brother, Lord Captain of the Iron Fleet, a huge and pious warrior of few words and fewer doubts.",
  "Aeron": "Balon's brother, the Damphair, a drowned priest of the Drowned God, grim and holy.",
  "Asha": "Balon's fierce daughter, a true ironborn captain who commands her own ship and men, and means to command more.",
  "Theon": "Balon's last living son, raised a ward and hostage at Winterfell, caught his whole life between the wolves and the krakens.",
};
