/* WHO SAID IT? — HOUSE OF THE DRAGON quote pool.
   Same contract as quotes-got.js: { d, fmt:"show"|"book", q, speaker, wrong:[3], s?/b?, hint, context }.
   speaker/wrong resolve to portraits through WS_PORTRAITS.hotd (portraits.js).
   s = safe once SEEN that season (max 2); b = safe once READ that far in the Dance (max 1).
   Accuracy-first, deliberately kept tight: only lines with a single, certain speaker are here,
   held to the same three rules as the GoT pool (no self-naming, no shared/formulaic lines, no
   colliding quotes). Grow it only with lines whose wording and speaker you can verify. */
window.QUOTES = window.QUOTES || {};
window.QUOTES.hotd = [

  { d: 3, fmt: "show", q: "The heir for a day.",
    speaker: "Daemon Targaryen", wrong: ["Otto Hightower", "Corlys Velaryon", "Criston Cole"],
    s: 1, hint: "A cruel toast in a Flea Bottom pleasure house, mocking a royal infant barely a day dead.",
    context: "The jest at the death of Viserys's newborn son costs its speaker his place in the succession and his welcome at court." },

  { d: 1, fmt: "show", q: "I want Aemond Targaryen.",
    speaker: "Rhaenyra Targaryen", wrong: ["Alicent Hightower", "Rhaenys Targaryen", "Baela Targaryen"],
    s: 2, hint: "Four flat words on the shore, breaking a whole hour of silent grief.",
    context: "Combing Shipbreaker Bay for what Vhagar left of her son Lucerys, the black queen names the price she means to collect." },

  { d: 3, fmt: "show", q: "Men would sooner put the realm to the torch than see a woman ascend the Iron Throne.",
    speaker: "Rhaenys Targaryen", wrong: ["Alicent Hightower", "Rhaenyra Targaryen", "Otto Hightower"],
    s: 1, hint: "A hard warning from the Queen Who Never Was to the girl who hopes to be a queen.",
    context: "Rhaenys tells Rhaenyra that the order of the world will not simply yield to the better claim." },

  { d: 3, fmt: "show", q: "History does not remember blood. It remembers names.",
    speaker: "Corlys Velaryon", wrong: ["Otto Hightower", "Daemon Targaryen", "Viserys I Targaryen"],
    s: 1, hint: "The realm's greatest sailor, on why he built a house rather than merely inheriting one.",
    context: "The Sea Snake's creed — that a name outlasts the blood that carried it, and is worth any risk to make." },

  { d: 1, fmt: "show", q: "An eye for a dragon. I would call that a fair exchange.",
    speaker: "Aemond Targaryen", wrong: ["Daemon Targaryen", "Aegon II Targaryen", "Criston Cole"],
    s: 1, hint: "A one-eyed prince, reckoning the largest dragon in the world cheap at the price.",
    context: "He lost the eye as a boy in the brawl that followed his claiming of Vhagar, and never once regretted the trade." },

  { d: 1, fmt: "show", q: "I never wanted to rule.",
    speaker: "Aegon II Targaryen", wrong: ["Aemond Targaryen", "Daemon Targaryen", "Jacaerys Velaryon"],
    s: 1, hint: "A reluctant king, dragged from hiding to a coronation his mother's faction spent years arranging.",
    context: "That much of his defense is true — he is crowned, and later killed, defending a chair he never sought." },

  { d: 3, fmt: "book", q: "A son for a son.",
    speaker: "Daemon Targaryen", wrong: ["Corlys Velaryon", "Otto Hightower", "Criston Cole"],
    b: 1, hint: "Five words of instruction, sent into the Red Keep with two hired killers.",
    context: "The contract for Lucerys's death — carried out, catastrophically, by Blood and Cheese in a royal nursery." },

];
