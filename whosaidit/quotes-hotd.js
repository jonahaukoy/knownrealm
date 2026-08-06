/* WHO SAID IT? — HOUSE OF THE DRAGON quote pool.
   Same contract as quotes-got.js: { d, fmt:"show"|"book", q, speaker, wrong:[3], s?/b?, hint, context }.
   speaker/wrong resolve to portraits through WS_PORTRAITS.hotd (portraits.js) — every name
   used here, correct or decoy, must exist in that table or one option renders as bare
   initials among three photographs and gives itself away.

   s = safe once SEEN that season (max 2); b = safe once READ Fire & Blood (max 1).
   When a line's season was uncertain it is tagged with the LATER one: over-gating costs a
   reader a question, under-gating costs them the plot.

   Three rules, the same three the GoT pool keeps: a line never names its own speaker; no
   house words, oaths or ritual phrases that a dozen characters recite; no two entries that
   are the same moment worded differently.

   A note on the book half. Fire & Blood is a maester's history, not a novel — it reports
   what was done far more often than what was said, and the little direct speech it records
   is mostly secondhand through Mushroom, Septon Eustace and Grand Maester Munkun. So the
   book pool here is small on purpose and will stay small; padding it would mean inventing
   dialogue the text does not contain. The setup screen says so plainly. */
window.QUOTES = window.QUOTES || {};
window.QUOTES.hotd = [

  /* ==================================================================== */
  /* THE SHOW — season one                                                */
  /* ==================================================================== */

  { d: 3, fmt: "show", q: "The heir for a day.",
    speaker: "Daemon Targaryen", wrong: ["Otto Hightower", "Corlys Velaryon", "Criston Cole"],
    s: 1, hint: "A cruel toast in a Flea Bottom pleasure house, mocking a royal infant barely a day dead.",
    context: "The jest at the death of Viserys's newborn son costs its speaker his place in the succession and his welcome at court." },

  { d: 1, fmt: "show", q: "We have royal wombs, you and I. The childbed is our battlefield.",
    speaker: "Aemma Arryn", wrong: ["Alicent Hightower", "Rhaenys Targaryen", "Rhaenyra Targaryen"],
    s: 1, hint: "A queen explaining her duty to her daughter, in the plainest and grimmest terms available.",
    context: "She is proved right within the hour, and does not survive the proving." },

  { d: 1, fmt: "show", q: "The dream. It was clearer than a memory. Our son was born wearing Aegon's iron crown.",
    speaker: "Viserys I Targaryen", wrong: ["Daemon Targaryen", "Helaena Targaryen", "Rhaenyra Targaryen"],
    s: 1, hint: "A king justifying a terrible choice by something he saw while asleep.",
    context: "The dream of a son is why he consents to what the maesters propose, and why he loses his wife." },

  { d: 3, fmt: "show", q: "These knights are as green as summer grass. None have known real war.",
    speaker: "Rhaenys Targaryen", wrong: ["Corlys Velaryon", "Otto Hightower", "Criston Cole"],
    s: 1, hint: "Watching a tourney from the royal box and unimpressed by all of it.",
    context: "A generation raised in the Old King's long peace, about to discover what the songs left out." },

  { d: 3, fmt: "show", q: "The gods have yet to make a man who lacks the patience for absolute power.",
    speaker: "Otto Hightower", wrong: ["Corlys Velaryon", "Larys Strong", "Lyonel Strong"],
    s: 1, hint: "A Hand warning his king about a brother — and describing himself without noticing.",
    context: "Said of Daemon, and true of very nearly everyone at the table it was said at." },

  { d: 3, fmt: "show", q: "A dragon's saddle is one thing, but the Iron Throne is the most dangerous seat in the realm.",
    speaker: "Viserys I Targaryen", wrong: ["Rhaenys Targaryen", "Otto Hightower", "Corlys Velaryon"],
    s: 1, hint: "A man who is being slowly cut to pieces by the chair he is describing.",
    context: "The throne's barbs open wounds on him that never close — the show's plainest image of what ruling costs." },

  { d: 3, fmt: "show", q: "To elude a storm, you can either sail into it, or around it.",
    speaker: "Corlys Velaryon", wrong: ["Laenor Velaryon", "Vaemond Velaryon", "Daemon Targaryen"],
    s: 1, hint: "A seafarer's advice on politics, offered by the most successful sailor alive.",
    context: "The Sea Snake has made a career of choosing the first option and calling it prudence." },

  { d: 3, fmt: "show", q: "We are the realm's second sons, Daemon. Our worth is not given. It must be made.",
    speaker: "Corlys Velaryon", wrong: ["Otto Hightower", "Vaemond Velaryon", "Laenor Velaryon"],
    s: 1, hint: "One overlooked man recruiting another for a war neither has been asked to fight.",
    context: "The pitch that begins the Stepstones campaign — and the whole argument of the man who made his own house great." },

  { d: 3, fmt: "show", q: "History does not remember blood. It remembers names.",
    speaker: "Corlys Velaryon", wrong: ["Otto Hightower", "Daemon Targaryen", "Viserys I Targaryen"],
    s: 1, hint: "The realm's greatest sailor, on why he built a house rather than merely inheriting one.",
    context: "The Sea Snake's creed — that a name outlasts the blood that carried it, and is worth any risk to make." },

  { d: 3, fmt: "show", q: "Many in my line have been dragonriders. Very few among us have been dreamers.",
    speaker: "Viserys I Targaryen", wrong: ["Daemon Targaryen", "Rhaenyra Targaryen", "Helaena Targaryen"],
    s: 1, hint: "A father handing his heir a secret that has been passed down since the Conquest.",
    context: "The night Aegon's Dream is given to Rhaenyra — the thread that runs all the way to the Long Night." },

  { d: 1, fmt: "show", q: "The truth does not matter, Rhaenyra. Only perception.",
    speaker: "Viserys I Targaryen", wrong: ["Otto Hightower", "Alicent Hightower", "Daemon Targaryen"],
    s: 1, hint: "A weary king teaching his daughter the one lesson of court that actually works.",
    context: "Advice that will be used against her by everyone who heard it, for the rest of her life." },

  { d: 3, fmt: "show", q: "When one is never invited to speak, one learns instead to observe.",
    speaker: "Larys Strong", wrong: ["Otto Hightower", "Mysaria", "Lyonel Strong"],
    s: 1, hint: "A quiet man explaining, quietly, exactly how dangerous he is.",
    context: "The Clubfoot's entire method in a sentence: everyone talks over him, and he keeps every word." },

  { d: 3, fmt: "show", q: "Is it not better to live in peace than to have songs sung after you are dead?",
    speaker: "Lyonel Strong", wrong: ["Otto Hightower", "Corlys Velaryon", "Lyman Beesbury"],
    s: 1, hint: "A sensible Hand asking a question nobody in this family has ever answered yes to.",
    context: "The plainest statement of the case against the whole story, made by a man who does not survive it." },

  { d: 3, fmt: "show", q: "This is why men wage war, because women would never be ready for the battle in time.",
    speaker: "Jason Lannister", wrong: ["Borros Baratheon", "Criston Cole", "Otto Hightower"],
    s: 1, hint: "A rich lord being charming at a hunt, and failing.",
    context: "Delivered to Rhaenyra as a compliment, which tells you everything about the courtship that follows." },

  { d: 3, fmt: "show", q: "Do keep trying, Ser Laenor. Soon or late, you may get one who looks like you.",
    speaker: "Alicent Hightower", wrong: ["Rhaenys Targaryen", "Rhaenyra Targaryen", "Mysaria"],
    s: 1, hint: "Congratulations on a new baby, sharpened into a knife and handed over in public.",
    context: "The accusation about Rhaenyra's brown-haired sons, said out loud at last, in the sweetest possible voice." },

  { d: 3, fmt: "show", q: "When steel is drawn, a fair match isn't something anyone should expect.",
    speaker: "Criston Cole", wrong: ["Daemon Targaryen", "Harwin Strong", "Arryk Cargyll"],
    s: 1, hint: "A tourney knight explaining why he fights the way he does, which is to say, to win.",
    context: "The philosophy of a man who will beat another to death at a wedding feast before the season is out." },

  { d: 3, fmt: "show", q: "The wise sailor flees the storm as it gathers.",
    speaker: "Laenor Velaryon", wrong: ["Corlys Velaryon", "Vaemond Velaryon", "Addam of Hull"],
    s: 1, hint: "A son quietly disagreeing with his father's whole approach to danger.",
    context: "And in the end he takes his own advice — sails away, and lets the realm believe him dead." },

  { d: 3, fmt: "show", q: "How sweetly the fox speaks when it's been cornered by the hounds.",
    speaker: "Alicent Hightower", wrong: ["Rhaenyra Targaryen", "Rhaenys Targaryen", "Otto Hightower"],
    s: 1, hint: "Refusing to be charmed by an old friend who has just remembered how to be charming.",
    context: "Two women who were girls together, neither of whom believes a word the other says any more." },

  { d: 3, fmt: "show", q: "What are children, but a weakness? A folly? A futility?",
    speaker: "Larys Strong", wrong: ["Otto Hightower", "Criston Cole", "Mysaria"],
    s: 1, hint: "A man with no children of his own, explaining the flaw he intends to exploit in everyone who has.",
    context: "Said to a queen whose every decision is made for her sons — a diagnosis and a threat at once." },

  { d: 1, fmt: "show", q: "Hand turns loom. Spool of green, spool of black. Dragons of flesh weaving dragons of thread.",
    speaker: "Helaena Targaryen", wrong: ["Alys Rivers", "Alicent Hightower", "Rhaena Targaryen"],
    s: 1, hint: "A young woman at her needlework, describing a war nobody has declared yet.",
    context: "The strangest of the family speaks in riddles that keep turning out to be reports." },

  { d: 3, fmt: "show", q: "No matter how fat the leech grows, it always wants for another meal.",
    speaker: "Daemon Targaryen", wrong: ["Otto Hightower", "Corlys Velaryon", "Larys Strong"],
    s: 1, hint: "One ambitious man's opinion of a rival ambitious man.",
    context: "The Hightower grip on the king, described by the one person at court with nothing to gain from politeness." },

  { d: 3, fmt: "show", q: "Daemon only ever does what is best for Daemon.",
    speaker: "Rhaenys Targaryen", wrong: ["Corlys Velaryon", "Alicent Hightower", "Otto Hightower"],
    s: 1, hint: "A cool assessment of a kinsman, from someone who has watched him her whole life.",
    context: "Broadly true, and yet the exceptions are what the whole story turns on." },

  { d: 1, fmt: "show", q: "What is this brief mortal life, if not the pursuit of legacy?",
    speaker: "Corlys Velaryon", wrong: ["Viserys I Targaryen", "Otto Hightower", "Daemon Targaryen"],
    s: 1, hint: "A self-made lord defending an ambition that has already cost him a daughter.",
    context: "It will cost him both sons as well before he is done asking the question." },

  { d: 3, fmt: "show", q: "Each of us is capable of depravity. And more than you would believe.",
    speaker: "Daemon Targaryen", wrong: ["Larys Strong", "Otto Hightower", "Criston Cole"],
    s: 1, hint: "A confession offered as a piece of general wisdom, by someone speaking from experience.",
    context: "He is not warning her about other people." },

  { d: 1, fmt: "show", q: "There is a debt to be paid. I shall have one of her son's eyes in return.",
    speaker: "Alicent Hightower", wrong: ["Rhaenyra Targaryen", "Rhaenys Targaryen", "Otto Hightower"],
    s: 1, hint: "A mother demanding payment in the hall at Driftmark, and not caring who hears the price.",
    context: "The night the two families stop pretending — and the night a queen picks up a blade herself." },

  { d: 1, fmt: "show", q: "It was a fair exchange. I may have lost an eye, but I gained a dragon.",
    speaker: "Aemond Targaryen", wrong: ["Daemon Targaryen", "Aegon II Targaryen", "Criston Cole"],
    s: 1, hint: "A boy comforting his own mother about the wound she is screaming for vengeance over.",
    context: "He claimed Vhagar, the largest dragon in the world, and never once counted the eye a loss." },

  { d: 3, fmt: "show", q: "A tyrant rules only through terror. If the King isn't feared, he is powerless.",
    speaker: "Daemon Targaryen", wrong: ["Otto Hightower", "Criston Cole", "Aemond Targaryen"],
    s: 1, hint: "An argument for cruelty, put to an heir who has just sworn off it.",
    context: "The oldest disagreement between these two, and the one their marriage never settles." },

  { d: 1, fmt: "show", q: "Her children are bastards! And she is a whore.",
    speaker: "Vaemond Velaryon", wrong: ["Otto Hightower", "Aemond Targaryen", "Borros Baratheon"],
    s: 1, hint: "Said in the throne room, in front of the king, by a man with about four seconds to live.",
    context: "The claim everyone had been whispering for years, shouted once — and answered with a sword." },

  { d: 1, fmt: "show", q: "He can keep his tongue.",
    speaker: "Daemon Targaryen", wrong: ["Criston Cole", "Aemond Targaryen", "Aegon II Targaryen"],
    s: 1, hint: "Four words, and then the head comes off anyway.",
    context: "A king threatens to take a man's tongue; his brother takes something else instead, mid-sentence." },

  { d: 3, fmt: "show", q: "The Stranger has visited me more times than I can count.",
    speaker: "Rhaenys Targaryen", wrong: ["Alicent Hightower", "Rhaenyra Targaryen", "Jeyne Arryn"],
    s: 1, hint: "A woman who has buried a husband's ambitions, a daughter, and a claim to the throne.",
    context: "The Queen Who Never Was has outlived nearly everything she was promised." },

  { d: 1, fmt: "show", q: "Beware the beast beneath the boards.",
    speaker: "Helaena Targaryen", wrong: ["Alys Rivers", "Rhaena Targaryen", "Baela Targaryen"],
    s: 1, hint: "Muttered at a feast by someone nobody is listening to, and the single most quoted line of the season.",
    context: "Nobody asks what she means. Everybody finds out." },

  { d: 3, fmt: "show", q: "I am six-and-seventy years old. I have known Viserys longer than any who sit at this table.",
    speaker: "Lyman Beesbury", wrong: ["Otto Hightower", "Corlys Velaryon", "Tyland Lannister"],
    s: 1, hint: "An old man standing up at a council he was not supposed to survive.",
    context: "The master of coin is the first blood spilled in the war, before a single banner is raised." },

  { d: 3, fmt: "show", q: "It is our fate, I think, to crave always what is given to another.",
    speaker: "Helaena Targaryen", wrong: ["Alicent Hightower", "Rhaenyra Targaryen", "Baela Targaryen"],
    s: 1, hint: "A quiet observation about her family that is also the plot of the entire series.",
    context: "The one person in the Red Keep who wants nothing is the one who understands everyone who does." },

  { d: 3, fmt: "show", q: "We do not rule, but we may guide the men that do.",
    speaker: "Alicent Hightower", wrong: ["Rhaenys Targaryen", "Mysaria", "Rhaenyra Targaryen"],
    s: 1, hint: "A woman making peace with the only kind of power she has been offered.",
    context: "And it is answered, brutally, by another woman who has spent her life refusing that bargain." },

  { d: 3, fmt: "show", q: "There is no power but what the people allow you to take.",
    speaker: "Mysaria", wrong: ["Otto Hightower", "Larys Strong", "Alicent Hightower"],
    s: 1, hint: "A view of power from a long way beneath the throne room.",
    context: "Said by someone who came up out of Flea Bottom and knows exactly how thin the crown's floor is." },

  { d: 3, fmt: "show", q: "Reluctance to murder is not a weakness!",
    speaker: "Alicent Hightower", wrong: ["Rhaenyra Targaryen", "Helaena Targaryen", "Rhaenys Targaryen"],
    s: 1, hint: "Shouted at a council that has just calmly proposed killing a woman and her children.",
    context: "The last moment before the greens stop arguing about whether, and start arguing about how." },

  { d: 1, fmt: "show", q: "We don't choose our destiny, Luke. It chooses us.",
    speaker: "Rhaenyra Targaryen", wrong: ["Daemon Targaryen", "Corlys Velaryon", "Rhaenys Targaryen"],
    s: 1, hint: "A mother reassuring an anxious son about an inheritance he does not want.",
    context: "Comfort offered to a boy who is about to be sent on the errand that kills him." },

  { d: 3, fmt: "show", q: "Stale oaths will not put you on the Iron Throne, Princess.",
    speaker: "Otto Hightower", wrong: ["Larys Strong", "Criston Cole", "Tyland Lannister"],
    s: 1, hint: "A negotiator arriving at Dragonstone with terms, and no intention of being refused politely.",
    context: "The greens' offer: bend the knee, keep your islands, forget the twenty years of vows sworn to you." },

  { d: 3, fmt: "show", q: "That girl is holding the realm together at present.",
    speaker: "Rhaenys Targaryen", wrong: ["Corlys Velaryon", "Viserys I Targaryen", "Lyonel Strong"],
    s: 1, hint: "Unexpected praise for a rival's daughter, from a woman with every reason to resent her.",
    context: "The Queen Who Never Was keeps seeing clearly, which is why nobody enjoys her company." },

  { d: 3, fmt: "show", q: "Hope is the fool's ally.",
    speaker: "Corlys Velaryon", wrong: ["Otto Hightower", "Daemon Targaryen", "Rhaenys Targaryen"],
    s: 1, hint: "A hard old man refusing to be comforted about a missing son.",
    context: "He says it, and then spends the rest of the war hoping anyway." },

  { d: 1, fmt: "show", q: "Which is it? King or Queen? The House of the Dragon does not seem to know who rules it.",
    speaker: "Borros Baratheon", wrong: ["Cregan Stark", "Jeyne Arryn", "Jason Lannister"],
    s: 1, hint: "A storm lord enjoying, very much, having two royal messengers in his hall at once.",
    context: "Storm's End, in the rain — the last civil moment before Vhagar goes up after Arrax." },

  { d: 1, fmt: "show", q: "I will not fight you. I came as a messenger, not a warrior.",
    speaker: "Lucerys Velaryon", wrong: ["Jacaerys Velaryon", "Joffrey Velaryon", "Aegon the Younger"],
    s: 1, hint: "A boy trying to leave a castle he should never have been sent to.",
    context: "He is not permitted to leave it. The war has its first prince." },

  { d: 1, fmt: "show", q: "A fight would be little challenge. No. I want you to put out your eye.",
    speaker: "Aemond Targaryen", wrong: ["Aegon II Targaryen", "Daemon Targaryen", "Criston Cole"],
    s: 1, hint: "Naming a price at Storm's End, and enjoying every syllable of it.",
    context: "The debt from Driftmark, called in on a fourteen-year-old in his cousin's hall." },

  { d: 3, fmt: "show", q: "You cannot live your life in fear, or you will forsake the best parts of it.",
    speaker: "Daemon Targaryen", wrong: ["Corlys Velaryon", "Viserys I Targaryen", "Rhaenyra Targaryen"],
    s: 1, hint: "Said while walking a sheltered heir through the worst streets in the city, at night.",
    context: "The night in King's Landing that changes what Rhaenyra wants — and what she is willing to risk for it." },

  { d: 3, fmt: "show", q: "Everyone says Targaryens are closer to gods than to men, but they say that because of our dragons.",
    speaker: "Rhaenyra Targaryen", wrong: ["Viserys I Targaryen", "Daemon Targaryen", "Baela Targaryen"],
    s: 1, hint: "A young rider being clear-eyed about the only thing that makes her family special.",
    context: "Without the dragons, she says, we are just like everyone else — and the war proves her right." },

  { d: 3, fmt: "show", q: "A marriage is a duty, yes. But that doesn't stop us from doing what we want.",
    speaker: "Daemon Targaryen", wrong: ["Laenor Velaryon", "Corlys Velaryon", "Criston Cole"],
    s: 1, hint: "A man explaining his own arrangements to someone he would rather be married to.",
    context: "The Targaryen view of vows, stated plainly, to a girl who is about to be sold into one." },

  { d: 3, fmt: "show", q: "The Iron Throne looms larger than me, larger than anyone in my family.",
    speaker: "Rhaenyra Targaryen", wrong: ["Alicent Hightower", "Viserys I Targaryen", "Aegon II Targaryen"],
    s: 1, hint: "An heir being honest about the size of the thing she has been promised.",
    context: "Understood young, and forgotten by everyone around her at exactly the wrong moment." },

  { d: 1, fmt: "show", q: "Dreams didn't make us kings. Dragons did.",
    speaker: "Daemon Targaryen", wrong: ["Aemond Targaryen", "Viserys I Targaryen", "Otto Hightower"],
    s: 1, hint: "Snarled with a hand at a queen's throat, moments after she shares a family secret.",
    context: "Told at last about Aegon's Dream, he does not believe a word of it — and cannot forgive being kept out." },

  /* ==================================================================== */
  /* THE SHOW — season two                                                */
  /* ==================================================================== */

  { d: 1, fmt: "show", q: "I want Aemond Targaryen.",
    speaker: "Rhaenyra Targaryen", wrong: ["Alicent Hightower", "Rhaenys Targaryen", "Baela Targaryen"],
    s: 2, hint: "Four flat words on the shore, breaking a whole hour of silent grief.",
    context: "Combing Shipbreaker Bay for what Vhagar left of her son Lucerys, the black queen names the price she means to collect." },

  { d: 1, fmt: "show", q: "Duty is sacrifice. It eclipses all things, even blood.",
    speaker: "Cregan Stark", wrong: ["Jacaerys Velaryon", "Corlys Velaryon", "Borros Baratheon"],
    s: 2, hint: "A northern welcome, delivered on top of a very cold wall.",
    context: "The Lord of Winterfell explains the North to a southern prince who came looking for swords." },

  { d: 3, fmt: "show", q: "Fly with me. It is a command.",
    speaker: "Daemon Targaryen", wrong: ["Rhaenyra Targaryen", "Aemond Targaryen", "Aegon II Targaryen"],
    s: 2, hint: "An invitation that stops being one halfway through the sentence.",
    context: "The habit of a man who has never once been able to ask for anything." },

  { d: 3, fmt: "show", q: "Not the dragons. The rats.",
    speaker: "Helaena Targaryen", wrong: ["Alys Rivers", "Alicent Hightower", "Baela Targaryen"],
    s: 2, hint: "A correction offered to a mother trying to comfort her about the wrong nightmare.",
    context: "The two men who came for her son were not dragons, and she will not let anyone soften it." },

  { d: 3, fmt: "show", q: "I will not be seen as weak.",
    speaker: "Aegon II Targaryen", wrong: ["Aemond Targaryen", "Otto Hightower", "Criston Cole"],
    s: 2, hint: "The entire ruling philosophy of a king who is, in fact, weak, and knows it.",
    context: "Every disaster of his reign begins with this sentence." },

  { d: 3, fmt: "show", q: "We are sworn to serve forthrightly, not to traffic in deception.",
    speaker: "Arryk Cargyll", wrong: ["Erryk Cargyll", "Criston Cole", "Steffon Darklyn"],
    s: 2, hint: "One white cloak objecting to an order that will end with him fighting a man with his own face.",
    context: "Sent to Dragonstone disguised as his own twin — and the twins meet, which is the point." },

  { d: 1, fmt: "show", q: "I do regret that business with Luke.",
    speaker: "Aemond Targaryen", wrong: ["Aegon II Targaryen", "Criston Cole", "Daemon Targaryen"],
    s: 2, hint: "The nearest thing to an apology this character is capable of, offered years too late and to the wrong person.",
    context: "A war that has killed thousands, summed up by its cause as 'that business'." },

  { d: 1, fmt: "show", q: "I wish to spill blood, not ink!",
    speaker: "Aegon II Targaryen", wrong: ["Aemond Targaryen", "Daemon Targaryen", "Criston Cole"],
    s: 2, hint: "A king bored senseless by the actual work of being king.",
    context: "Petitions and ledgers, when there is a war on and a dragon in the yard." },

  { d: 3, fmt: "show", q: "There is no war so hateful to the gods as a war between kin.",
    speaker: "Rhaenys Targaryen", wrong: ["Corlys Velaryon", "Alicent Hightower", "Rhaenyra Targaryen"],
    s: 2, hint: "The judgement of the one person in the family who never wanted any of it.",
    context: "She says it, and then rides out to Rook's Rest anyway, because somebody has to." },

  { d: 3, fmt: "show", q: "I hope you do not confuse mercy with pliancy.",
    speaker: "Rhaenyra Targaryen", wrong: ["Alicent Hightower", "Rhaenys Targaryen", "Mysaria"],
    s: 2, hint: "A queen sparing someone, and making very sure they understand the terms.",
    context: "She has decided not to be her husband. That does not mean she has decided to be safe." },

  { d: 1, fmt: "show", q: "I'm claiming Harrenhal.",
    speaker: "Daemon Targaryen", wrong: ["Aemond Targaryen", "Criston Cole", "Simon Strong"],
    s: 2, hint: "A grand announcement about the largest, emptiest, unluckiest ruin in Westeros.",
    context: "He takes it in an afternoon, and it spends the rest of the season taking him apart." },

  { d: 3, fmt: "show", q: "You may be surprised to learn it, but most folk pay no mind to a woman.",
    speaker: "Mysaria", wrong: ["Alicent Hightower", "Alys Rivers", "Rhaenys Targaryen"],
    s: 2, hint: "A spymaster explaining the source of her advantage to a queen who has never had it.",
    context: "Being overlooked is the whole trade of the White Worm, and she has made a fortune from it." },

  { d: 1, fmt: "show", q: "I'm no woman at all. I'm a barn owl.",
    speaker: "Alys Rivers", wrong: ["Mysaria", "Helaena Targaryen", "Baela Targaryen"],
    s: 2, hint: "An answer given to a prince at Harrenhal, and not obviously a joke.",
    context: "The witch of Harrenhal introduces herself in the only way that would unsettle a Targaryen." },

  { d: 3, fmt: "show", q: "Do you think simply wearing the crown imbues you with wisdom?",
    speaker: "Alicent Hightower", wrong: ["Rhaenyra Targaryen", "Otto Hightower", "Rhaenys Targaryen"],
    s: 2, hint: "A mother, to a son, about a hat.",
    context: "She spent twenty years putting him on that throne and about ten minutes regretting it." },

  { d: 3, fmt: "show", q: "Perhaps those who strive for it are the least suited to wear it.",
    speaker: "Daemon Targaryen", wrong: ["Corlys Velaryon", "Larys Strong", "Viserys I Targaryen"],
    s: 2, hint: "A late, unwelcome insight from the man who has striven for it hardest and longest.",
    context: "Harrenhal has been showing him things. This is one of them." },

  { d: 3, fmt: "show", q: "The enemy without may be fought with swords. The enemy within is more insidious.",
    speaker: "Larys Strong", wrong: ["Otto Hightower", "Mysaria", "Tyland Lannister"],
    s: 2, hint: "The master of whisperers explaining why he, personally, is indispensable.",
    context: "Every spymaster's argument for his own budget, and this one happens to be right." },

  { d: 3, fmt: "show", q: "Tales take on a life of their own, like weeds. Unless they are tended.",
    speaker: "Larys Strong", wrong: ["Mysaria", "Otto Hightower", "Alicent Hightower"],
    s: 2, hint: "On rumours, from a gardener who prefers to do his own weeding.",
    context: "The war is fought with dragons in the sky and with stories in the streets — and he only fights one of them." },

  { d: 3, fmt: "show", q: "They are unhappy. And unhappy people look for someone to hate.",
    speaker: "Alicent Hightower", wrong: ["Otto Hightower", "Rhaenyra Targaryen", "Mysaria"],
    s: 2, hint: "A queen explaining the smallfolk to her daughter, accurately, and far too late.",
    context: "King's Landing is starving behind a blockade, and the crown has noticed only that this is inconvenient." },

  { d: 3, fmt: "show", q: "Alicent holds love for our enemy. That makes her a fool.",
    speaker: "Aemond Targaryen", wrong: ["Aegon II Targaryen", "Criston Cole", "Otto Hightower"],
    s: 2, hint: "A son writing off his own mother, in front of the council, without raising his voice.",
    context: "The greens' most dangerous member decides the only obstacle left is sentiment." },

  { d: 3, fmt: "show", q: "We have always been meant to burn together.",
    speaker: "Rhaenyra Targaryen", wrong: ["Daemon Targaryen", "Alicent Hightower", "Aemond Targaryen"],
    s: 2, hint: "Said to the woman who was her closest friend, about what their families are going to do to each other.",
    context: "Two queens meeting in secret, both of whom already know how this ends." },

  { d: 3, fmt: "show", q: "Exhausting, wasn't it? Hiding beneath the cloak of your own righteousness.",
    speaker: "Rhaenyra Targaryen", wrong: ["Alicent Hightower", "Rhaenys Targaryen", "Baela Targaryen"],
    s: 2, hint: "One old friend finally saying the cruellest true thing to the other.",
    context: "Twenty years of being lectured about duty, answered in a single sentence." },

  { d: 3, fmt: "show", q: "The road ahead is uncertain, but the end is clear.",
    speaker: "Otto Hightower", wrong: ["Larys Strong", "Corlys Velaryon", "Criston Cole"],
    s: 2, hint: "A career politician's idea of reassurance.",
    context: "He is certain of the end right up until the moment his grandson dismisses him from the council." },

  /* ==================================================================== */
  /* THE BOOK — Fire & Blood                                              */
  /* ==================================================================== */

  { d: 3, fmt: "book", q: "A son for a son.",
    speaker: "Daemon Targaryen", wrong: ["Corlys Velaryon", "Otto Hightower", "Criston Cole"],
    b: 1, hint: "Five words of instruction, sent into the Red Keep with two hired killers.",
    context: "The contract for Lucerys's death — carried out, catastrophically, by Blood and Cheese in a royal nursery." },

  { d: 1, fmt: "book", q: "Seven save this realm if we seat a bastard on the Iron Throne.",
    speaker: "Criston Cole", wrong: ["Otto Hightower", "Aemond Targaryen", "Tyland Lannister"],
    b: 1, hint: "The argument that turns a private council into a coup, made by a man in a white cloak.",
    context: "At the green council, the case against Rhaenyra is not her sex but her sons — and this is who makes it." },

  { d: 3, fmt: "book", q: "All this must needs wait, until the question of succession is settled.",
    speaker: "Otto Hightower", wrong: ["Criston Cole", "Larys Strong", "Tyland Lannister"],
    b: 1, hint: "Cutting off a grand maester who has begun making arrangements for the wrong coronation.",
    context: "The old king is not yet cold, and the Hand has already decided the succession is an open question." },

  { d: 3, fmt: "book", q: "We will number twelve, even without Stormcloud. That is how we shall win this war.",
    speaker: "Rhaenys Targaryen", wrong: ["Corlys Velaryon", "Rhaenyra Targaryen", "Jacaerys Velaryon"],
    b: 1, hint: "Counting dragons at a war council on Dragonstone, and liking the arithmetic.",
    context: "The blacks begin the Dance with nearly twice the dragons. It is not remotely enough." },

];
