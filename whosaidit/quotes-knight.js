/* WHO SAID IT? — A KNIGHT OF THE SEVEN KINGDOMS (Dunk & Egg) quote pool.
   Same contract as quotes-got.js. These are novella lines, so they carry `b`
   (1 Hedge Knight / 2 Sworn Sword / 3 Mystery Knight), not `s`.
   Knight has no character portraits (its own wiki uses initials too), so answers
   here render as lettered discs — expected, not a bug. Accuracy-first and small:
   only lines with a single certain speaker, none of which name that speaker. */
window.QUOTES = window.QUOTES || {};
window.QUOTES.knight = [

  { d: 3, fmt: "book", q: "It seems my helm is dusty. Ser Duncan, will you lend me a squire to polish it?",
    speaker: "Baelor Breakspear", wrong: ["Maekar", "Lyonel Baratheon", "Ser Eustace Osgrey"],
    b: 1, hint: "A prince stepping quietly into a hedge knight's seven, with a plain shield and no fuss.",
    context: "Baelor Breakspear completes Dunk's champions at the trial of seven — an act that will cost him his life." },

  { d: 1, fmt: "book", q: "A hedge knight is the truest kind of knight. Other knights serve the lords who keep them; we serve where we will.",
    speaker: "Ser Duncan the Tall", wrong: ["Ser Arlan of Pennytree", "Baelor Breakspear", "Ser Eustace Osgrey"],
    b: 1, hint: "A landless knight's proud creed, made from the one thing he has that lords do not: freedom.",
    context: "The philosophy of a poor wandering knight who owes his sword to no one but himself." },

  { d: 3, fmt: "book", q: "I am a dragon. You will treat me as one.",
    speaker: "Aerion", wrong: ["Daeron", "Baelor Breakspear", "Maekar"],
    b: 1, hint: "A beautiful, cruel prince who believes, quite literally, that he is not a man at all.",
    context: "Aerion Brightflame's self-regard — a madness that becomes horribly literal years after these tales end." },

  { d: 3, fmt: "book", q: "My fathers were Marshals of the Northmarch, once.",
    speaker: "Ser Eustace Osgrey", wrong: ["Ser Bennis of the Brown Shield", "Lucas Inchfield", "Ser Duncan the Tall"],
    b: 2, hint: "An old knight of a fallen house, forever reciting the glories that used to be.",
    context: "The lord of Standfast has a thousand years of lost greatness to recount — and three dry fields left to his name." },

  { d: 3, fmt: "book", q: "We could end all this. I need only show them my father's ring.",
    speaker: "Egg", wrong: ["Ser Duncan the Tall", "Ser Bennis of the Brown Shield", "Sam Stoops"],
    b: 2, hint: "A squire who could solve every quarrel with a single boot-heel — if his knight would only let him.",
    context: "The boy offers to reveal his royal blood to end the feud; his knight, on principle, refuses to use it." },

];
