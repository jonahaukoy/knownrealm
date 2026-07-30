/* HOUSE OF THE DRAGON — the book telling: Fire & Blood, Archmaester Gyldayn's
   history of the Dance of the Dragons, section by section. Eight "chapters" =
   the eight movements of the Dance in the book, from the Old King's council to
   the Hour of the Wolf. Each chapter is [label, summary, deaths?]; beats group
   chapters into wider movements (same panel format as the show's episodes).
   NOTE: the book's Dance runs to its true end — further than the show has. */

const BOOKS = [
{ n: 1, name: "Fire & Blood — The Dance of the Dragons", short: "F&B", chapters: 8, chs: [

["A Question of Succession",
  "The Old King's council at Harrenhal passes over Rhaenys for Viserys; a generation later Viserys passes over precedent for Rhaenyra. Aemma dies of the birthing bed, Alicent weds the king, and two courts grow inside one castle — the blacks and the greens, named for the gowns worn at a tourney. Daemon wins the Stepstones, weds Laena, loses her, and weds Rhaenyra over Laenor's convenient corpse — though the book's Laenor is truly murdered, cut down at Spicetown by his own favorite, Qarl Correy. Harrenhal burns its lord and his heir; the king rots slowly on his throne and dies whispering to no one the maesters record.",
  [["Queen Aemma Arryn", "Cut open to birth a son who lived a day. The king never forgave himself; the realm never let him forget."],
   ["Prince Baelon Targaryen", "The heir for a day."],
   ["Lady Rhea Royce", "Fell from her horse among Runestone's rocks — nine days after her husband paid his only visit in years."],
   ["Ser Joffrey Lonmouth", "The Knight of Kisses, dead of Ser Criston Cole's morningstar in the wedding tourney for Rhaenyra and Laenor."],
   ["Laena Velaryon", "Rider of Vhagar, dead of childbed at Driftmark — she rose from her bed to die beside her dragon."],
   ["Ser Laenor Velaryon", "Slain at Spicetown by Ser Qarl Correy as merchants watched — a lovers' quarrel, said some; a hired blade, said those watching Daemon."],
   ["Ser Harwin Strong", "Breakbones, burned at Harrenhal with his father — and with him the truth of three princes' blood."],
   ["Lord Lyonel Strong", "Hand of the King, dead in the same fire. Larys Clubfoot inherited everything, including suspicion."],
   ["Ser Vaemond Velaryon", "Beheaded by Daemon for naming the Velaryon heirs bastards — his tongue, the prince observed, they could keep."],
   ["King Viserys I Targaryen", "The Young King grown old, dead in his bed in the 129th year after the Conquest — and with him, the peace of the dragons."]]],

["The Blacks and the Greens",
  "The king is a day dead before the green council has crowned a new one: Aegon, the Conqueror's crown on his head, anointed before the mob in the Dragonpit while his sister labors on Dragonstone, unknowing. Grand Maester Orwyle is sent with terms; Rhaenyra answers with her father's crown on her own head. The realm chooses sides — the Vale, the North and the rivers for the queen, Oldtown, the Rock and Storm's End for the king. And at Storm's End, in a storm, Vhagar falls upon a boy flying home with an answer.",
  [["Lord Lyman Beesbury", "Master of coin, the one green councillor to say 'treason' aloud. Opened at the throat, or dead of a chill in a black cell — the accounts differ on everything but the timing."],
   ["Prince Lucerys Velaryon", "Lost with Arrax in Shipbreaker Bay — a messenger, unarmed, run down by Vhagar in the rain. The Dance's point of no return."]]],

["A Son for a Son",
  "Blood and Cheese come over the walls of the Red Keep with a purse of Daemon's gold and instructions that fit in five words. Queen Helaena is made to choose among her sons; they take Jaehaerys's head regardless. The greens answer with a mummer's Cargyll: twin meets twin at Dragonstone's gates and both die of it. Daemon takes Harrenhal without a blow; Bracken and Blackwood open the war of the rivers at the Burning Mill; and Ser Criston Cole, Hand and kingmaker, marches the green host into the crownlands.",
  [["Prince Jaehaerys Targaryen", "Six years old. 'A son for a son' — the debt for Lucerys, paid in a nursery."],
   ["Ser Arryk Cargyll", "Sent in his brother's likeness to kill a queen. His brother found him first."],
   ["Ser Erryk Cargyll", "They fought for the better part of an hour, weeping as they fought, and died in each other's arms."]]],

["The Red Dragon and the Gold",
  "Cole takes Duskendale and Rook's Rest by march and treachery; the trap at Rook's Rest is the war's first dragonfall. Rhaenys Targaryen, the Queen Who Never Was, answers the castle's ravens and finds two dragons waiting: Aegon on Sunfyre the Golden and Aemond on Vhagar. Meleys the Red Queen dies with her teeth in Sunfyre's throat; the king falls with her, burned half to nothing, and the realm passes to the regent Aemond — one eye, one dragon, no restraint.",
  [["Lord Gunthor Darklyn", "Lord of Duskendale, beheaded for keeping faith with the queen he had sworn to."],
   ["Princess Rhaenys Targaryen", "The Queen Who Never Was, dead at Rook's Rest with her Red Queen — she fell upon Sunfyre and near took the king with her."]]],

["Rhaenyra Triumphant",
  "The queen's arithmetic: the Red Sowing gives dragons to bastards and boasters — Hugh Hammer on Vermithor, Ulf White on Silverwing, Addam of Hull on Seasmoke — and the sky belongs to the blacks. The price is paid in the Gullet, where the Triarchy's ninety ships break the blockade and Prince Jacaerys falls with Vermax into the sea. But King's Landing cannot be held against six dragons: the gates open, Rhaenyra takes her father's throne — and the Hightower host coming up the roseroad meets betrayal at Tumbleton, where the Two Betrayers burn the town they were sworn to.",
  [["Ser Steffon Darklyn", "Burned on Dragonstone's slopes trying to claim Seasmoke — proof the dragons wanted blood, not pedigree."],
   ["Prince Jacaerys Velaryon", "The queen's heir, lost with Vermax in the Battle of the Gullet, last seen swimming as the Myrish crossbows found him."],
   ["Lord Ormund Hightower", "Commander of the green host, cut down at First Tumbleton when his own hired dragons turned."],
   ["Ser Criston Cole", "The Kingmaker, dead at the Butcher's Ball with three arrows in him — he refused to run, and the river lords obliged him."]]],

["Rhaenyra Overthrown",
  "The city that opened its gates learns what a queen's taxes and a queen's fears cost. Helaena Targaryen falls from Maegor's Holdfast onto the spikes below; the smallfolk name Rhaenyra kinslayer and rise behind the Shepherd. The Dragonpit is stormed by ten thousand hands — five dragons die in it, and Prince Joffrey with them, falling from Syrax's back. Rhaenyra flees a burning city as, above the Gods Eye, the uncles end each other: Daemon leaps from Caraxes onto Vhagar's back and puts Dark Sister through Aemond's remaining eye as both dragons fall.",
  [["Queen Helaena Targaryen", "The gentlest of them, dead on the spikes of Maegor's Holdfast — grief the assassins left behind."],
   ["Prince Joffrey Velaryon", "Rhaenyra's youngest by Harwin, dead trying to fly his mother's dragon out of the burning Dragonpit."],
   ["Prince Maelor Targaryen", "Aegon's last son, torn apart by a mob at Bitterbridge — a child the war would not overlook."],
   ["Prince Aemond Targaryen", "Dark Sister through the eye above the Gods Eye, locked with his uncle as Vhagar and Caraxes fell together."],
   ["Prince Daemon Targaryen", "The Rogue Prince, seen leaping, never found — the singers say what the maesters cannot."]]],

["The Short, Sad Reign of Aegon II",
  "Rhaenyra, sold by the garrison of Dragonstone, is given to Sunfyre in front of her son: the king watches his sister eaten, and thinks it justice. It buys him half a year. Second Tumbleton kills a Betrayer and the young Prince Daeron; Addam of Hull dies proving a bastard's honor at Second Tumbleton; and with the Wolf of the North marching south and no dragons left worth the name, Aegon II drinks poisoned wine poured by his own council. 'Let there be an end,' the lords agreed — and made one.",
  [["Queen Rhaenyra Targaryen", "Fed to Sunfyre in Dragonstone's yard before her son's eyes — the Half-Year Queen, first and last of her name."],
   ["Prince Daeron Targaryen", "Daeron the Daring, the best of Alicent's sons, dead in the fires of Second Tumbleton with Tessarion."],
   ["Hugh Hammer", "The Betrayer who dreamed of a crown — knifed at Tumbleton before Vermithor could make him one."],
   ["Ulf the White", "The other Betrayer, poisoned in his sleep for treasons past counting."],
   ["Ser Addam Velaryon", "Born of Hull, legitimized by the queen — died at Second Tumbleton proving that dragonseed is not treason's seed."],
   ["King Aegon II Targaryen", "Poisoned in his litter by his own lords with the northmen two days from the city. He outlived his sister by half a year and his dynasty's dragons by less."]]],

["The Hour of the Wolf",
  "Cregan Stark comes south too late for the war and just in time for the reckoning: for six days the Wolf of the North rules King's Landing in all but name, trying poisoners and turncloaks, taking heads where the new king's councillors would take pardons. Aegon the Younger — Rhaenyra's son, Aegon the Third — is crowned and wed to Aegon II's daughter Jaehaera, joining the broken halves. The dragons are done: a boy king who flinches from them, a realm of graves, and a peace made of exhaustion. The Dance is over. What it was for, the maesters still argue.",
  [["Lord Larys Strong", "The Clubfoot, last of his house — beheaded in the Hour of the Wolf, refusing the Wall with a shrug."],
   ["Ser Gyles Belgrave", "Kingsguard to Aegon II, who chose the block over the black: a knight who could not outlive the king he failed."]]],

], beats: [
  { from: 1, to: 2, title: "A Question of Succession",
    throne: { king: "Viserys I Targaryen, then two crowns at once", house: "targaryen", hand: "Ser Otto Hightower" },
    events: [
      "The council of 101 sets the precedent — the realm will not have a woman — and Viserys spends his reign unsetting it for his daughter.",
      "Two courts grow inside one Red Keep: the queen's greens and the princess's blacks, named at a tourney and armed within a generation.",
      "Daemon and the Sea Snake win the Stepstones; marriages, funerals and one convenient corpse bind Targaryen to Velaryon twice over.",
      "The king dies; the greens crown Aegon in the Dragonpit; the blacks crown Rhaenyra on Dragonstone — and Vhagar kills a boy over Shipbreaker Bay.",
    ],
    people: [
      { name: "Viserys I Targaryen", loc: "kings-landing", note: "Kept the peace a lifetime by refusing every hard choice in it." },
      { name: "Rhaenyra Targaryen", loc: "dragonstone", note: "Heir by oath of every lord in the realm — sworn while she was nine." },
      { name: "Alicent Hightower", loc: "kings-landing", note: "Wears green to the black heir's court and means it." },
      { name: "Daemon Targaryen", loc: "the-stepstones", note: "King of the Narrow Sea, wife-poor and grievance-rich." },
      { name: "Otto Hightower", loc: "kings-landing", note: "Hand to three kings; grandfather, he intends, to a fourth." },
      { name: "Corlys Velaryon", loc: "driftmark", note: "Nine great voyages, one blockade, and a hall called the Hall of Nine." },
    ],
    power: { targaryen: 10, velaryon: 9, hightower: 8, stark: 5, lannister: 6, arryn: 5, tully: 5, baratheon: 5, greyjoy: 3, tyrell: 5, martell: 4, frey: 3 },
    deaths: [
      { name: "King Viserys I Targaryen", note: "His peace died with him; the maesters date the Dance from his last breath." },
      { name: "Prince Lucerys Velaryon", note: "Vhagar over Shipbreaker Bay — after this, no ravens could carry peace." },
    ] },
  { from: 3, to: 4, title: "The Dance Begins",
    throne: { king: "Aegon II Targaryen — Rhaenyra crowned against him", house: "targaryen", hand: "Ser Criston Cole, the Kingmaker" },
    events: [
      "Blood and Cheese answer Shipbreaker Bay in a nursery; the Cargyll twins answer each other at Dragonstone's gates.",
      "Daemon takes Harrenhal; Bracken and Blackwood open the rivers' war at the Burning Mill; the Winter Wolves march south.",
      "Cole's host takes Duskendale by march and Rook's Rest by trap — and the trap costs the greens their king, burned under his own dragon.",
      "Aemond One-Eye rules as regent with Vhagar for a scepter, and the rivers burn wherever her shadow passes.",
    ],
    people: [
      { name: "Daemon Targaryen", loc: "harrenhal", note: "Holds Black Harren's seat with ghosts for a garrison." },
      { name: "Rhaenyra Targaryen", loc: "dragonstone", note: "Grief-mad and iron-willed, counting dragons on the painted table." },
      { name: "Aegon II Targaryen", loc: "rooks-rest", note: "Flew to his own trap uninvited; carried home in a litter." },
      { name: "Aemond Targaryen", loc: "kings-landing", note: "Regent, kinslayer-in-waiting, and the realm's most dangerous man." },
      { name: "Rhaenys Targaryen", loc: "rooks-rest", note: "The Queen Who Never Was, spending herself like a queen at last." },
      { name: "Criston Cole", loc: "rooks-rest", note: "The Kingmaker's marches win castles and lose kings." },
    ],
    power: { targaryen: 8, velaryon: 8, hightower: 9, stark: 6, lannister: 6, arryn: 5, tully: 6, baratheon: 6, greyjoy: 3, tyrell: 5, martell: 4, frey: 3 },
    deaths: [
      { name: "Princess Rhaenys Targaryen", note: "Rook's Rest — the first dragon to fall in the Dance, and far from the last." },
      { name: "Prince Jaehaerys Targaryen", note: "A son for a son: the war's cruelest ledger, opened by Blood and Cheese." },
    ] },
  { from: 5, to: 6, title: "The Fall of the Dragons",
    throne: { king: "Rhaenyra I Targaryen, the Half-Year Queen", house: "targaryen", hand: "Lord Corlys Velaryon, the Sea Snake" },
    events: [
      "The Red Sowing fills the black sky with bastard-ridden dragons; the Gullet breaks the blockade and takes the queen's heir under.",
      "King's Landing opens its gates; Rhaenyra sits her father's throne — and the city starves, whispers, and turns.",
      "Tumbleton burns twice-sworn; Helaena falls onto the spikes; the Shepherd's ten thousand storm the Dragonpit and butcher five dragons in their vaults.",
      "Above the Gods Eye, Daemon and Aemond end the question of the uncles the old way: Dark Sister, one eye, two dragons in the lake.",
    ],
    people: [
      { name: "Rhaenyra Targaryen", loc: "kings-landing", note: "Won the throne and lost the city holding it." },
      { name: "Daemon Targaryen", loc: "harrenhal", note: "His last flight ends the war's worst dragon — and himself." },
      { name: "Aemond Targaryen", loc: "harrenhal", note: "Burned the rivers to lure one man. It worked." },
      { name: "Corlys Velaryon", loc: "kings-landing", note: "Hand to the queen, jailer to none — he counsels mercy no one takes." },
      { name: "Hugh Hammer", loc: "tumbleton", note: "A crown dreamed on a blacksmith's brow — briefly." },
      { name: "Addam of Hull", loc: "kings-landing", note: "Flees a traitor's warrant to die proving it wrong." },
    ],
    power: { targaryen: 6, velaryon: 7, hightower: 7, stark: 6, lannister: 6, arryn: 5, tully: 6, baratheon: 6, greyjoy: 4, tyrell: 5, martell: 4, frey: 3 },
    deaths: [
      { name: "Prince Jacaerys Velaryon", note: "The Gullet took the best of the queen's sons and the war's best hope of grace." },
      { name: "Princes Daemon & Aemond Targaryen", note: "The Battle Above the Gods Eye — no victor, two graves, one lake." },
    ] },
  { from: 7, to: 8, title: "The Boy King's Peace",
    throne: { king: "Aegon II, then Aegon III Targaryen", house: "targaryen", hand: "From kingmakers to caretakers" },
    events: [
      "Dragonstone's own garrison sells the queen; Sunfyre is fed, and Aegon II calls it justice while the realm calls it horror.",
      "Second Tumbleton and the Kingsroad spend the last dragons and the last armies; the Betrayers get traitors' ends.",
      "With Cregan Stark's northmen two days out, Aegon II's own lords pour the wine: 'Let there be an end.'",
      "The Hour of the Wolf: six days of northern justice, a boy king crowned and wed to his rival's daughter, and a peace made of graves.",
    ],
    people: [
      { name: "Aegon II Targaryen", loc: "kings-landing", note: "Outlived his sister by half a year, his conscience by rather more." },
      { name: "Cregan Stark", loc: "kings-landing", note: "Came too late to fight, in time to judge — the Wolf's hour runs six days." },
      { name: "Corlys Velaryon", loc: "kings-landing", note: "From a black cell to the small council, as the tides turn a last time." },
      { name: "Alicent Hightower", loc: "kings-landing", note: "Outlives her father, her sons, and her war — a queen of empty rooms." },
      { name: "Baela Targaryen", loc: "dragonstone", note: "Flew Moondancer against a king and lived to see the peace." },
      { name: "Rhaena Targaryen", loc: "the-eyrie", note: "Kept the eggs; one of them, in time, is Morning." },
    ],
    power: { targaryen: 4, velaryon: 6, hightower: 5, stark: 8, lannister: 5, arryn: 5, tully: 6, baratheon: 5, greyjoy: 4, tyrell: 5, martell: 4, frey: 3 },
    deaths: [
      { name: "Queen Rhaenyra Targaryen", note: "The Half-Year Queen, ended in Dragonstone's yard by her brother's dragon." },
      { name: "King Aegon II Targaryen", note: "Poisoned by his own council — the Dance's last move was played without dragons." },
    ] },
] },
];

/* Section label -> the figure whose eyes the panel borrows (faces + card links). */
const POV_CHARS = {
  "A Question of Succession": "Viserys I Targaryen",
  "The Blacks and the Greens": "Alicent Hightower",
  "A Son for a Son": "Daemon Targaryen",
  "The Red Dragon and the Gold": "Rhaenys Targaryen",
  "Rhaenyra Triumphant": "Rhaenyra Targaryen",
  "Rhaenyra Overthrown": "Rhaenyra Targaryen",
  "The Short, Sad Reign of Aegon II": "Aegon II Targaryen",
  "The Hour of the Wolf": "Cregan Stark",
};
function povCharacter(label) {
  return POV_CHARS[label] || label;
}
