/* WHO SAID IT? — A KNIGHT OF THE SEVEN KINGDOMS (Dunk & Egg) quote pool.
   Same contract as quotes-got.js. These are novella lines, so they carry `b`
   (1 The Hedge Knight / 2 The Sworn Sword / 3 The Mystery Knight), not `s`.

   Knight has NO character portraits — knight/assets/people/ is empty and its own
   wiki uses lettered discs too — so every answer here renders as initials. That
   is uniform, which is what matters: the danger elsewhere on the site is ONE
   faceless option sitting among three photographs, which silently marks it out.
   Here there are no photographs at all, so nothing is marked.

   The pool is book-only. The HBO adaptation exists, but its dialogue is not
   quoted here: a line invented for the screen and attributed to the novella
   would be a lie in a game whose whole point is knowing who said what. The setup
   screen disables the Show chip for this saga rather than pretending otherwise.

   Three rules, as everywhere: a line never names its own speaker; no oaths or
   formulaic phrases half the cast recites (which is why the famous "a hedge
   knight is the truest kind of knight" is NOT here — Ser Arlan says it first and
   Dunk repeats it after him, so two answers would be defensible); no two entries
   that are the same moment worded differently. */
window.QUOTES = window.QUOTES || {};
window.QUOTES.knight = [

  /* ==================================================================== */
  /* THE HEDGE KNIGHT                                                     */
  /* ==================================================================== */

  { d: 1, fmt: "book", q: "Dunk the lunk, thick as a castle wall.",
    speaker: "Ser Duncan the Tall", wrong: ["Ser Arlan of Pennytree", "Egg", "Ser Steffon Fossoway"],
    b: 1, hint: "A rhyme somebody carries around inside their own head, and takes out whenever they have erred.",
    context: "The self-judgement of a very large, very slow, very decent man — and the closest thing these tales have to a refrain." },

  { d: 1, fmt: "book", q: "I should beat you bloody and send you on your way, but the truth is, I have no pavilion and I have no squire either.",
    speaker: "Ser Duncan the Tall", wrong: ["Ser Arlan of Pennytree", "Ser Lyonel Baratheon", "Ser Steffon Fossoway"],
    b: 1, hint: "A grumbling, entirely unconvincing telling-off, which ends with the offender being hired.",
    context: "A bald stableboy has followed him out of Ashford and refuses to go back. The partnership of the age begins here." },

  { d: 3, fmt: "book", q: "Aerion is your brother, and the septons say we must love our brothers.",
    speaker: "Baelor Breakspear", wrong: ["Maekar", "Daeron", "Ser Duncan the Tall"],
    b: 1, hint: "A gentle uncle failing to sound convinced by his own theology.",
    context: "Said to a young Egg about the brother who has just been cruel to nearly everyone at the tourney." },

  { d: 3, fmt: "book", q: "Maekar is angry, and must needs have a target for his wrath. He has chosen you.",
    speaker: "Baelor Breakspear", wrong: ["Lord Ashford", "Ser Arlan of Pennytree", "Ser Lyonel Baratheon"],
    b: 1, hint: "One prince explaining another prince's temper to the man about to be crushed by it.",
    context: "Two of Maekar's sons have disgraced him at Ashford, and neither can be punished — so a hedge knight will do." },

  { d: 1, fmt: "book", q: "I remind you that any knight accused of a crime has the right to demand trial by combat. So I ask you once again — how good a knight are you? Truly?",
    speaker: "Baelor Breakspear", wrong: ["Maekar", "Aerion", "Ser Lyonel Baratheon"],
    b: 1, hint: "A judge quietly showing the accused the one door out of the room, and asking whether he can fit through it.",
    context: "The alternative is losing a hand and a foot. The question sets the whole trial of seven in motion." },

  { d: 3, fmt: "book", q: "There has not been a trial of seven for more than a hundred years, do you know that?",
    speaker: "Ser Lyonel Baratheon", wrong: ["Baelor Breakspear", "Maekar", "Ser Humfrey Hardyng"],
    b: 1, hint: "A famously loud knight delighted to be part of something nobody alive has seen.",
    context: "The Laughing Storm joins Dunk's seven largely because it sounds like tremendous fun." },

  { d: 3, fmt: "book", q: "The debt is Aerion's, and we mean to collect it.",
    speaker: "Ser Humfrey Hardyng", wrong: ["Ser Lyonel Baratheon", "Ser Raymun Fossoway", "Ser Steffon Fossoway"],
    b: 1, hint: "Why a knight with a grudge of his own is happy to fight on a stranger's side.",
    context: "Dunk needs six champions and no lord owes him anything. What he has instead is Aerion's list of enemies." },

  { d: 1, fmt: "book", q: "I am the seventh, but for the other side.",
    speaker: "Ser Steffon Fossoway", wrong: ["Ser Raymun Fossoway", "Ser Humfrey Hardyng", "Ser Lyonel Baratheon"],
    b: 1, hint: "The worst possible answer to 'and you make six', delivered with a smile.",
    context: "A betrayal so casual it splits House Fossoway in half — and gives the world the green apple branch." },

  { d: 1, fmt: "book", q: "I fear I am still not ripe... but better green than wormy, eh?",
    speaker: "Ser Raymun Fossoway", wrong: ["Ser Steffon Fossoway", "Ser Duncan the Tall", "Egg"],
    b: 1, hint: "A brand-new knight making a joke about fruit, moments after changing his own sigil out of disgust.",
    context: "Knighted on the spot to fill out Dunk's seven, he takes the green apple rather than share his cousin's red one." },

  { d: 1, fmt: "book", q: "The dragon is not mocked.",
    speaker: "Aerion", wrong: ["Maekar", "Daeron", "Baelor Breakspear"],
    b: 1, hint: "A prince who does not consider 'dragon' a figure of speech when applied to himself.",
    context: "Aerion Brightflame's self-regard — a madness that turns horribly literal long after these tales end." },

  { d: 3, fmt: "book", q: "Brother, have you taken leave of your senses?",
    speaker: "Maekar", wrong: ["Aerion", "Daeron", "Lord Ashford"],
    b: 1, hint: "Asked out loud, in front of thousands, when a prince of the realm does something unforgivable to his own family.",
    context: "Baelor has just joined the hedge knight's side — against Maekar's own sons — and Maekar cannot believe it." },

  { d: 1, fmt: "book", q: "This man protected the weak, as every true knight must.",
    speaker: "Baelor Breakspear", wrong: ["Maekar", "Ser Lyonel Baratheon", "Ser Raymun Fossoway"],
    b: 1, hint: "The whole of one man's defence of another, offered as if it settled the matter — which, to the speaker, it did.",
    context: "The Prince of Dragonstone rides in out of the river mist to make Dunk's seventh, and gives this as his only reason." },

  { d: 1, fmt: "book", q: "My father was only nine-and-thirty. He had it in him to be a great king, the greatest since Aegon the Dragon. Why would the gods take him, and leave you?",
    speaker: "Valarr", wrong: ["Maekar", "Aerion", "Daeron"],
    b: 1, hint: "Grief turned into a question with no possible answer, asked of the man who is still breathing.",
    context: "The cruellest thing anyone says to Dunk in three novellas, and he has no reply to it, because there isn't one." },

  /* ==================================================================== */
  /* THE SWORN SWORD                                                      */
  /* ==================================================================== */

  { d: 3, fmt: "book", q: "My fathers were Marshals of the Northmarch, once.",
    speaker: "Ser Eustace Osgrey", wrong: ["Ser Bennis of the Brown Shield", "Lucas Inchfield", "Ser Duncan the Tall"],
    b: 2, hint: "An old knight of a fallen house, forever reciting the glories that used to be.",
    context: "The lord of Standfast has a thousand years of lost greatness to recount — and three dry fields left to his name." },

  { d: 3, fmt: "book", q: "We could end all this. I need only show them my father's ring.",
    speaker: "Egg", wrong: ["Ser Duncan the Tall", "Ser Bennis of the Brown Shield", "Sam Stoops"],
    b: 2, hint: "A squire who could solve every quarrel with a single boot-heel — if his knight would only let him.",
    context: "The boy offers to reveal his royal blood to end the feud; his knight, on principle, refuses to use it." },

  { d: 1, fmt: "book", q: "You are quite mad. If you were better born, I'd marry you.",
    speaker: "Lady Rohanne Webber", wrong: ["Tanselle", "Ser Eustace Osgrey", "Egg"],
    b: 2, hint: "A compliment and a refusal, folded into the same breath, by somebody who has buried four husbands.",
    context: "The Red Widow's verdict on a hedge knight who has just done something enormous, honest and very stupid on her account." },

  { d: 3, fmt: "book", q: "Common boys fight with wooden swords too, only theirs are sticks and broken branches.",
    speaker: "Ser Duncan the Tall", wrong: ["Egg", "Ser Eustace Osgrey", "Ser Bennis of the Brown Shield"],
    b: 2, hint: "A reminder, from someone who grew up in Flea Bottom, that highborn childhood is not the only kind.",
    context: "The gap between Dunk's upbringing and his squire's is the quiet argument running under all three tales." },

  /* ==================================================================== */
  /* THE MYSTERY KNIGHT                                                   */
  /* ==================================================================== */

  { d: 3, fmt: "book", q: "Is that gallantry I smell, or just stupidity?",
    speaker: "Ser Uthor Underleaf", wrong: ["Ser Kyle the Cat", "Lord Gormon Peake", "Ser Glendon Ball"],
    b: 3, hint: "A professional asking a very reasonable question of an amateur about to ruin himself on principle.",
    context: "The Snail makes his living ransoming knights he unhorses, and finds Dunk's motives incomprehensible." },

  { d: 3, fmt: "book", q: "The boy may be a bastard, my lords, but he's Fireball's bastard.",
    speaker: "Ser Kyle the Cat", wrong: ["Ser Uthor Underleaf", "Ser Duncan the Tall", "Lord Gormon Peake"],
    b: 3, hint: "The one voice in a hall full of lords willing to say a word for the accused.",
    context: "Glendon Ball stands charged with theft and murder, and his only defence is who his father was said to be." },

  { d: 3, fmt: "book", q: "He's bastard born. All bastards are thieves, or worse. Blood will tell.",
    speaker: "Ser Harbert Paege", wrong: ["Lord Costayne", "Lord Gormon Peake", "Ser Uthor Underleaf"],
    b: 3, hint: "A lordly opinion offered as though it were a law of nature.",
    context: "The prejudice that convicts Glendon Ball before anybody troubles to examine the evidence." },

  { d: 3, fmt: "book", q: "No one honors Fireball more than I do. I will not believe this false knight is his seed.",
    speaker: "Daemon II Blackfyre", wrong: ["Lord Gormon Peake", "Lord Costayne", "Ser Uthor Underleaf"],
    b: 3, hint: "A would-be king defending the memory of his father's greatest champion — and misjudging the man in front of him.",
    context: "Fireball died for the first Blackfyre. His son's regard for the name does not extend to the bastard carrying it." },

  { d: 3, fmt: "book", q: "I will settle this as my father would. I shall meet him in the lists, and let the gods determine guilt and innocence.",
    speaker: "Daemon II Blackfyre", wrong: ["Lord Gormon Peake", "Ser Duncan the Tall", "Lord Butterwell"],
    b: 3, hint: "A pretender reaching for his father's reputation and getting his father's luck instead.",
    context: "The tilt he demands is the one that undoes his whole rebellion before it has properly begun." },

  { d: 3, fmt: "book", q: "To remove him from your path. His Lordship bought your other foes with gold and promises, but Ball was not for sale.",
    speaker: "Ser Duncan the Tall", wrong: ["Egg", "Ser Kyle the Cat", "Ser Maynard Plumm"],
    b: 3, hint: "A hedge knight standing up in a hall of conspirators and explaining, to their faces, how the tourney was fixed.",
    context: "Every other champion at Whitewalls has been paid to lose. The one who could not be bought was framed instead." },

  { d: 3, fmt: "book", q: "You come late to the feast, ser, and I see you wear a sword again.",
    speaker: "Ser Uthor Underleaf", wrong: ["Lord Gormon Peake", "Lord Butterwell", "Ser Kyle the Cat"],
    b: 3, hint: "A greeting that is really a reminder of an unpaid debt.",
    context: "Dunk owes this man a ransom, and the sword at his hip is the collateral." },

];
