/* ============================================================================
   THE IRON LADDER — THE DECK, PART TWO: CONSEQUENCE.

   Part one is things that happen TO you. This file is things that happen
   BECAUSE OF YOU — every event here is gated on a flag some earlier choice set,
   so nothing in it can fire in a life that did not earn it.

   The checker in _gamecheck.html is what produced this file. It reported sixty
   flags that were set by the deck and read by nothing, which is a precise
   measurement of how much of the game had no memory: you could inform on a man,
   break an oath, spare a prisoner, bury a hoard or be crowned, and the world
   would never mention it again. A choice with no downstream is set dressing.

   RULE FOR ANYTHING ADDED HERE: the `when` must name a flag, and the narration
   must refer to the thing that set it. If an event would read fine to a player
   who had never done the deed, it belongs in part one instead.

   Loaded AFTER data-events.js and appended to the same array, so the engine
   sees one deck and knows nothing about the split.
   ========================================================================== */

window.IL_EVENTS = (window.IL_EVENTS || []).concat([

/* ==========================================================================
   OATHS, ALLIANCES AND MARRIAGES
   ========================================================================== */

{ id: "c-alliance-called", w: 3, when: { wild: false, flags: ["allied"], minTurn: 6 },
  dm: "The family you married into has a war, or a lawsuit, or a feud — the distinction matters less than you would think. They are calling in the alliance, and they are quite clear that this is what an alliance is for.",
  opts: [
    { label: "Answer, with everything you have",
      check: { attr: "might", dc: 14, followerBonus: { per: 4, max: 5 } },
      pass: { text: "You turn up with more men than they expected and behave better than they hoped. The debt now runs the other way.", eff: { standing: 12, renown: 5, followers: 3, health: -10, flags: ["owed-a-favour"] } },
      fail: { text: "You turn up and it goes badly, and the family is polite about it in a way that is worse than shouting.", eff: { standing: -6, followers: -2, health: -14 } } },
    { label: "Send men and stay home",
      res: { text: "Half a gesture. It is noted as half a gesture.", eff: { followers: -2, standing: -2, coin: -20 } } },
    { label: "Refuse", res: { text: "The marriage survives. The alliance does not, and everyone in two districts hears which one you chose.", eff: { flags: ["-allied", "oathbreaker"], standing: -14, renown: 2 } } },
  ] },

{ id: "c-snubbed-family", w: 2, when: { wild: false, flags: ["refused-match"], minTurn: 8 },
  dm: "The family whose match you refused has done well since. Their new son-in-law is in the room, and so are they, and they have been telling the story of your refusal for years — with improvements.",
  opts: [
    { label: "Be gracious about it",
      check: { attr: "charm", dc: 14, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "You congratulate them warmly and at length, and the story stops being funny in front of you.", eff: { standing: 5, flags: ["-refused-match"], attr: { charm: 1 } } },
      fail: { text: "Graciousness from you is heard as condescension, which on this occasion it partly was.", eff: { standing: -5 } } },
    { label: "Tell the room why you refused",
      res: { text: "It is true, it is unkind, and the whole hall now has a much better story than the one they had.", eff: { renown: 3, standing: -8, notoriety: 3, flags: ["-refused-match"] } } },
    { label: "Leave before they see you", res: { text: "They see you.", eff: { standing: -3 } } },
  ] },

{ id: "c-oath-comes-due", w: 3, when: { wild: false, flags: ["godsworn"], minTurn: 8 },
  dm: "You swore something in front of a face cut in a tree. You have been careful not to think about it for some years. Tonight it is unavoidable: the thing you swore about is standing in front of you, and it is inconvenient.",
  opts: [
    { label: "Keep it, whatever it costs",
      check: { attr: "grit", dc: 15, perkBonus: [{ perk: "honest", n: 4 }] },
      pass: { text: "You do the thing. It costs you the friendship, the coin and most of the year, and something in your chest that had been tight for eight years lets go.", eff: { renown: 8, standing: 6, coin: -80, attr: { grit: 2 }, flags: ["-godsworn", "oathkeeper"] } },
      fail: { text: "You try, and you are not equal to it, and the failing is public.", eff: { standing: -8, health: -12, flags: ["-godsworn"] } } },
    { label: "Break it, and hope the old gods are as absent as they seem",
      res: { text: "Nothing happens. Nothing continues to happen, for years, and you keep checking.", eff: { flags: ["-godsworn", "oathbreaker"], standing: -6, coin: 60, attr: { grit: -1 } } } },
    { label: "Go back to the tree and ask to be released",
      check: { attr: "charm", dc: 16 },
      pass: { text: "There is nobody to ask. You talk anyway, for a long time, and walk away having decided something you can live with.", eff: { flags: ["-godsworn"], attr: { wits: 1, grit: 1 }, health: 8 } },
      fail: { text: "You sit in front of it until dark and come away with nothing settled at all.", eff: { health: -6 } } },
  ] },

{ id: "c-false-oath-found", w: 2, when: { wild: false, flags: ["false-oath"], minTurn: 10 },
  dm: "The lord you swore to — hollowly, with your fingers crossed behind eight years of good service — has found out. Somebody talked, or he simply watched you long enough.",
  opts: [
    { label: "Deny it to his face",
      check: { attr: "cunning", dc: 17, perkBonus: [{ perk: "sly", n: 4 }] },
      pass: { text: "You are extremely convincing. He apologises to you, which is the strangest moment of your life.", eff: { standing: 6, flags: ["-false-oath"], attr: { cunning: 1 } } },
      fail: { text: "He has the letter. There is no version of the next hour in which you keep his roof.", eff: { flags: ["-household", "-sworn", "-oathbound", "oathbreaker", "wanted"], standing: -18, notoriety: 10 } } },
    { label: "Admit it, and offer him a true one",
      check: { attr: "charm", dc: 16, perkBonus: [{ perk: "honest", n: 3 }] },
      pass: { text: "He is a harder man than you gave him credit for and a stranger one. He takes the second oath and never mentions the first again.", eff: { flags: ["-false-oath", "oathbound"], standing: 8, renown: 3 } },
      fail: { text: "He takes it as mockery. You are out of the gate with what you can carry.", eff: { flags: ["-household", "-sworn", "oathbreaker"], standing: -14 } } },
    { label: "Be gone before morning",
      res: { text: "You take a horse that is not yours and a start of six hours.", eff: { flags: ["-household", "-sworn", "-false-oath", "wanted"], items: ["horse"], notoriety: 8, move: "random" } } },
  ] },

{ id: "c-a-child", w: 3, once: true, when: { wild: false, flags: ["married"], minTurn: 6, minAge: 18 },
  dm: "You have a child. Whatever else this world has done to you, that is now also true, and it changes the arithmetic of every decision you will make from here.",
  opts: [
    { label: "Raise them well, and pay for it",
      res: { text: "It costs more than you have and more time than you can spare. You do it anyway.", eff: { flags: ["parent", "heir"], coin: -60, standing: 4, renown: 1, health: -4 } } },
    { label: "Raise them hard",
      check: { attr: "grit", dc: 13 },
      pass: { text: "They will be able to survive this world, and they will be some years learning to like you.", eff: { flags: ["parent", "heir", "hard-parent"], standing: 3, attr: { grit: 1 } } },
      fail: { text: "It is too hard, too early, and something between you does not knit properly.", eff: { flags: ["parent", "heir"], standing: -2, health: -4 } } },
    { label: "Send them to be fostered elsewhere",
      res: { text: "It is what highborn families do, and it works, and you see them four times before they are grown.", eff: { flags: ["parent", "heir", "fostered-out"], standing: 6, coin: -30 } } },
  ] },

{ id: "c-the-heir", w: 2, when: { wild: false, flags: ["heir"], minTurn: 24, minAge: 34 },
  dm: "Your child is grown, and has opinions, and is standing in front of you with one of them.",
  opts: [
    { label: "Give them a place at your side",
      check: { attr: "charm", dc: 12 },
      pass: { text: "They are better at some of it than you are. It is an uncomfortable and entirely welcome discovery.", eff: { followers: 5, standing: 6, renown: 2, flags: ["strong-heir"] } },
      fail: { text: "They are not ready and both of you find that out in front of other people.", eff: { standing: -4 } } },
    { label: "Send them away to make their own name",
      res: { text: "It is the kinder thing and the lonelier one. Word comes back, occasionally, and it is good word.", eff: { renown: 3, standing: 2, flags: ["strong-heir"] } } },
    { label: "Refuse them anything", req: { anyPerk: ["cruel"] },
      res: { text: "They go. They do not come back, and in eleven years they will be somebody you have to deal with.", eff: { standing: -6, flags: ["-heir", "estranged-heir"], attr: { grit: 1 } } } },
  ] },

/* ==========================================================================
   THE PAST CATCHING UP
   ========================================================================== */

{ id: "c-recognised", w: 3, when: { wild: false, anyFlag: ["escaped", "watch-deserter", "wanted"], minTurn: 6 },
  dm: "A man across the room has been looking at you for too long, and has just stopped looking, which is worse. He knows where he has seen your face, and he has remembered what was written under it.",
  opts: [
    { label: "Get to him first",
      check: { attr: "swiftness", dc: 14, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "cold-blood", n: 3 }] },
      pass: { text: "He is dealt with in an alley by a man he did not hear behind him.", eff: { kills: 1, notoriety: 6, health: -6, attr: { cunning: 1 } } },
      fail: { text: "He is quicker than you and louder, and the whole room learns what you are.", eff: { standing: -10 }, goto: "arrest" } },
    { label: "Buy his silence", req: { minCoin: 60 }, cost: { coin: 60 },
      check: { attr: "charm", dc: 13 },
      pass: { text: "He takes it and means it, for now, which is all silence ever is.", eff: { attr: { charm: 1 } } },
      fail: { text: "He takes it and sells you anyway, at a better price.", eff: { coin: -60 }, goto: "arrest" } },
    { label: "Be somewhere else within the hour",
      res: { text: "You leave everything you cannot carry and are on the road before he has found anyone to tell.", eff: { move: "random", coin: -20, health: -4 } } },
  ] },

{ id: "c-informer-found", w: 2, when: { wild: false, flags: ["informer"], minTurn: 8 },
  dm: "The men you gave up have friends, and one of those friends has spent three years finding out who talked. He found out some time ago. He has been waiting for a convenient evening.",
  opts: [
    { label: "Fight your way clear",
      check: { attr: "might", dc: 16, perkBonus: [{ perk: "strong", n: 3 }, { perk: "duellist", n: 3 }] },
      pass: { text: "Two of them do not get up. The word goes round that informing on you personally is a poor investment.", eff: { kills: 2, health: -20, notoriety: 8, renown: 2, flags: ["-informer"] } },
      fail: { text: "They have thought about this for three years and you have thought about it for four seconds.", eff: { health: -36, coin: -9999 } } },
    { label: "Give them somebody better", req: { anyPerk: ["sly"] },
      check: { attr: "cunning", dc: 15 },
      pass: { text: "You trade a name for your throat. The name belongs to a man who deserves it rather less than you do.", eff: { notoriety: 6, standing: -4, attr: { cunning: 1 }, flags: ["-informer"] } },
      fail: { text: "They are not interested in names any more.", eff: { health: -30 } } },
    { label: "Take the beating",
      check: { attr: "grit", dc: 13, perkBonus: [{ perk: "hardy", n: 4 }] },
      pass: { text: "It is thorough and it is finished. They consider the debt settled, which is more than you expected.", eff: { health: -22, flags: ["-informer"], attr: { grit: 1 } } },
      fail: { text: "They do not consider it settled.", eff: { health: -34 } } },
  ] },

{ id: "c-turncloak-known", w: 2, when: { wild: false, flags: ["turncloak"], minTurn: 8 },
  dm: "Everyone in this camp knows you changed sides once. Nobody says it out loud. It is in every conversation you have and every duty you are given, and today somebody has finally said it out loud.",
  opts: [
    { label: "Make an example of him",
      check: { attr: "might", dc: 14, perkBonus: [{ perk: "cruel", n: 3 }] },
      pass: { text: "It does not make anyone trust you. It does make them stop saying it, which was the achievable goal.", eff: { notoriety: 6, health: -10, standing: 2, kills: 1 } },
      fail: { text: "The camp watches you lose, and enjoys it a good deal.", eff: { health: -18, standing: -8 } } },
    { label: "Agree with him, loudly, and buy the tent a drink", cost: { coin: 25 },
      check: { attr: "charm", dc: 14, perkBonus: [{ perk: "silver", n: 4 }] },
      pass: { text: "You tell the whole story with the worst parts in, and it turns from an accusation into an anecdote.", eff: { standing: 6, renown: 3, flags: ["-turncloak"], attr: { charm: 1 } } },
      fail: { text: "The story does not improve in the telling.", eff: { standing: -6 } } },
    { label: "Change sides again", res: { text: "Third time. The pay is worse each time and the door is narrower.", eff: { coin: 40, standing: -10, notoriety: 8, flags: ["-at-war", "-soldier"] } } },
  ] },

{ id: "c-spared-returns", w: 2, when: { wild: false, flags: ["merciful"], minTurn: 10 },
  dm: "A man you did not kill is in front of you, older, better dressed, and with men of his own. He has been looking for you for a long time. He has not said yet which kind of looking it was.",
  opts: [
    { label: "Stand still and find out",
      res: { text: "He came to pay. There is coin, and an offer, and a very awkward embrace in front of both companies.", eff: { coin: 240, followers: 4, renown: 5, standing: 8, flags: ["owed-a-favour"] } } },
    { label: "Reach for your sword first",
      check: { attr: "swiftness", dc: 15 },
      pass: { text: "He was reaching for a purse. You both stop. He gives you the purse anyway, and rather less of the goodwill he arrived with.", eff: { coin: 90, standing: -2 } },
      fail: { text: "He was reaching for a purse, and his men were not, and the misunderstanding costs you a great deal.", eff: { health: -24, standing: -6 } } },
  ] },

{ id: "c-killer-reputation", w: 3, when: { wild: false, flags: ["killer"], minNotoriety: 12 },
  dm: "You have a name now, and it is not a good one. A man in a good cloak has sought you out precisely because of it, and would like to discuss an arrangement.",
  opts: [
    { label: "Take the work",
      check: { attr: "cunning", dc: 15, perkBonus: [{ perk: "cold-blood", n: 4 }] },
      pass: { text: "Done, paid, and nobody in the household ever established how it was done.", eff: { coin: 260, kills: 1, notoriety: 10, attr: { cunning: 1 } } },
      fail: { text: "The household was better guarded than the good cloak said, which suggests the good cloak wanted two problems solved.", eff: { health: -28, notoriety: 12, flags: ["hunted"] } } },
    { label: "Name a price nobody would pay",
      check: { attr: "charm", dc: 13 },
      pass: { text: "He pays it. You are now expensive, which is the best protection there is in this trade.", eff: { coin: 500, kills: 1, notoriety: 12, renown: 4, flags: ["expensive"] } },
      fail: { text: "He finds somebody cheaper and mentions to them that you were asked first.", eff: { flags: ["hunted"] } } },
    { label: "Tell him you have stopped",
      res: { text: "He does not believe you. Neither, entirely, do you.", eff: { notoriety: -6, standing: 2 } } },
  ] },

{ id: "c-shirker-shamed", w: 2, when: { wild: false, flags: ["shirker"], minTurn: 8 },
  dm: "The banners are called again, and the man reading the roll pauses at your name, and reads out — without comment, which is the comment — what you did last time.",
  opts: [
    { label: "Go, and be first up the ladder",
      check: { attr: "grit", dc: 16, perkBonus: [{ perk: "cold-blood", n: 3 }] },
      pass: { text: "You are over the wall before the second man is off the ground. Nobody mentions the last war again.", eff: { flags: ["-shirker", "soldier", "at-war"], renown: 10, standing: 10, health: -22 } },
      fail: { text: "You go, and you are ordinary, and ordinary is not enough to erase it.", eff: { flags: ["soldier", "at-war"], health: -14, standing: -2 } } },
    { label: "Pay a man to go in your place", cost: { coin: 90 }, req: { minCoin: 90 },
      res: { text: "It is entirely legal and everybody despises it, including the man you paid.", eff: { standing: -8, coin: -90 } } },
    { label: "Not this time either", res: { text: "Twice is a character, not an incident.", eff: { standing: -10, flags: ["coward"] } } },
  ] },

/* ==========================================================================
   FRIENDS MADE, FRIENDS USED
   ========================================================================== */

{ id: "c-friend-calls", w: 3,
  when: { wild: false, anyFlag: ["clan-friend", "dornish-friend", "bravo-friend", "wildling-friend",
                    "freedman-friend", "temple-friend", "khalasar-guest", "bloodrider-friend"],
          minTurn: 8 },
  dm: "Somebody you were once decent to has found you, a long way from where you met. They need something. They are careful to say that you owe them nothing, which is how you know how badly they need it.",
  opts: [
    { label: "Help them",
      check: { attr: "grit", dc: 13 },
      pass: { text: "It takes the season and a good deal of your own money, and at the end of it you have a friend rather than an acquaintance.", eff: { coin: -50, followers: 2, renown: 3, standing: 3, flags: ["owed-a-favour"] } },
      fail: { text: "It goes wrong for both of you and you are lucky to come out of it with only a debt.", eff: { coin: -70, health: -12 } } },
    { label: "Help them, and make it a business arrangement",
      check: { attr: "cunning", dc: 13 },
      pass: { text: "They agree to the terms, and mean them, and something between you has changed shape and will not change back.", eff: { coin: 120, followers: 1, standing: 1 } },
      fail: { text: "They agree to the terms and never speak to you again.", eff: { coin: 60, renown: -2 } } },
    { label: "Refuse", res: { text: "They take it well, which makes it worse.", eff: { standing: -2 } } },
  ] },

{ id: "c-favour-called", w: 3, when: { wild: false, flags: ["owed-a-favour"], minTurn: 6 },
  dm: "You are owed. It is a large debt and an old one, and this is the moment to spend it — favours, like fruit, do not keep.",
  opts: [
    { label: "Ask for men",
      res: { text: "They come. Not many, but they come armed and they come because of you.", eff: { followers: 10, flags: ["-owed-a-favour"], renown: 2 } } },
    { label: "Ask for coin",
      res: { text: "A chest arrives with no note, which is the polite way of doing it.", eff: { coin: 400, flags: ["-owed-a-favour"] } } },
    { label: "Ask for a word in the right ear",
      check: { attr: "wits", dc: 13 },
      pass: { text: "A door that has been shut to you for years opens, and stays open.", eff: { standing: 18, flags: ["-owed-a-favour", "knows-the-lords"], secrets: 1 } },
      fail: { text: "The word is said and lands badly, and the favour is spent for nothing.", eff: { flags: ["-owed-a-favour"], standing: 2 } } },
    { label: "Keep it for when you truly need it",
      res: { text: "You say nothing about it. It is the most valuable thing you own and it is entirely invisible.", eff: { attr: { wits: 1 } } } },
  ] },

/* ==========================================================================
   MONEY, DEBT AND PROPERTY
   ========================================================================== */

{ id: "c-bank-collects", w: 4, when: { wild: false, flags: ["indebted"], minTurn: 6 },
  dm: "A very polite man from Braavos has taken lodgings in this town, and has been there a fortnight, and has not yet come to see you. That is the part that is meant to frighten you, and it does.",
  opts: [
    { label: "Pay what you owe", req: { minCoin: 620 }, cost: { coin: 620 },
      res: { text: "He thanks you, writes something in a small book, and is gone the next morning. That is the whole of it, and it is worth every coin.", eff: { flags: ["-indebted"], standing: 6 } } },
    { label: "Pay what you can and beg time", req: { minCoin: 150 }, cost: { coin: 150 },
      check: { attr: "charm", dc: 15, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "He accepts a schedule. The Iron Bank is not unreasonable; it is only unforgetting.", eff: { standing: 2 } },
      fail: { text: "He accepts the coin and does not accept the schedule.", eff: { flags: ["bank-enemy"] } } },
    { label: "Run",
      check: { attr: "cunning", dc: 18, perkBonus: [{ perk: "quiet", n: 3 }] },
      pass: { text: "You are three realms away under another name inside a month. The Iron Bank has funded the overthrow of kings for less than you owe it.", eff: { move: { realm: "dothraki-sea" }, flags: ["bank-enemy", "wanted"], notoriety: 10 } },
      fail: { text: "They have done this for four hundred years and you have done it once.", eff: { coin: -9999, health: -20, flags: ["bank-enemy"] } } },
  ] },

{ id: "c-bank-enemy", w: 3, when: { wild: false, flags: ["bank-enemy"], minTurn: 4 },
  dm: "Nobody will lend to you. Nobody will ship for you. A contract you had is quietly not renewed, and the man who did not renew it will not meet your eye. This is what it looks like when a bank decides something about you.",
  opts: [
    { label: "Go to Braavos and settle it", req: { minCoin: 900 }, cost: { coin: 900 },
      res: { text: "You stand in a room of stone and pay, and a keyholder makes a mark, and the world starts working again within the month.", eff: { flags: ["-bank-enemy", "-indebted"], standing: 10, renown: 2 } } },
    { label: "Live with it",
      res: { text: "You learn to do business in cash, in person, with people who also have reasons. It is a smaller world.", eff: { coin: -40, standing: -4, attr: { cunning: 1 } } } },
    { label: "Find out who they are funding against you", req: { anyPerk: ["clever", "sly", "connected"] },
      check: { attr: "wits", dc: 16 },
      pass: { text: "A rival, two lords and one pretender, all of them drawing on the same purse. It is a frightening picture and a useful one.", eff: { secrets: 2, attr: { wits: 1 }, flags: ["dangerous-knowledge"] } },
      fail: { text: "You ask too many questions in the wrong city.", eff: { flags: ["hunted"], health: -10 } } },
  ] },

{ id: "c-hoard-dug", w: 2, when: { wild: false, flags: ["buried-hoard"], minTurn: 8 },
  dm: "The stone, and the count of paces. You have thought about this hole every month for years.",
  opts: [
    { label: "Dig it up",
      check: { attr: "wits", dc: 11, perkBonus: [{ perk: "wary", n: 3 }] },
      pass: { text: "Still there, still dry, and worth more than when you put it in because everything else has got worse.", eff: { coin: 420, flags: ["-buried-hoard"] } },
      fail: { text: "The hole is there. The chest is not, and the earth over it was turned some time ago.", eff: { flags: ["-buried-hoard"], standing: -2, health: -4 } } },
    { label: "Leave it another year", res: { text: "You put the turf back and walk away, and think about it every month for another year.", eff: {} } },
  ] },

{ id: "c-debts-collected", w: 3, when: { wild: false, flags: ["moneylender"], minTurn: 5 },
  dm: "Half this town owes you and about a third of them have stopped pretending they intend to pay.",
  opts: [
    { label: "Send men to collect", req: { minFollowers: 2 },
      check: { attr: "might", dc: 12, followerBonus: { per: 3, max: 4 } },
      pass: { text: "Most of it comes in within a fortnight, which tells you how much of lending is theatre.", eff: { coin: 300, notoriety: 6, standing: -3 } },
      fail: { text: "One of your men goes too far with a debtor everybody likes, and the town turns.", eff: { coin: 60, notoriety: 12, standing: -10, followers: -1 } } },
    { label: "Forgive the smallest debts publicly",
      check: { attr: "charm", dc: 13 },
      pass: { text: "It costs you a hundred and buys you the town. Two of the forgiven turn up the next week asking to serve you.", eff: { coin: -100, standing: 12, renown: 4, followers: 2, attr: { charm: 1 } } },
      fail: { text: "Everyone assumes you have simply given up collecting, and behaves accordingly.", eff: { coin: -140, standing: 2 } } },
    { label: "Sell the debts on at a discount",
      res: { text: "A harder man buys them for two-thirds and does what you did not want to do. You have the coin and, technically, clean hands.", eff: { coin: 220, standing: -4, notoriety: 3, flags: ["-moneylender"] } } },
  ] },

{ id: "c-the-ship", w: 3, when: { wild: false, flags: ["shipowner"], minTurn: 4 },
  dm: "Your captain wants a decision. There is a cargo, a season, and three ways to use a ship, and two of them are illegal somewhere.",
  opts: [
    { label: "Honest trade",
      check: { attr: "wits", dc: 12 },
      pass: { text: "Wine out, wool back, and a margin you could set a clock by.", eff: { coin: 180 } },
      fail: { text: "A storm, a spoiled hold and a repair bill.", eff: { coin: -120 } } },
    { label: "Carry what should not be carried",
      check: { attr: "cunning", dc: 15, perkBonus: [{ perk: "sly", n: 3 }] },
      pass: { text: "Four times the margin and nobody at either end asks a single question.", eff: { coin: 520, notoriety: 6 } },
      fail: { text: "The ship is taken at the harbour mouth. You lose the cargo, the ship and the captain's good opinion.", eff: { items: ["-ship"], flags: ["-shipowner"], coin: -60, notoriety: 8 } } },
    { label: "Take it privateering", req: { anyFlag: ["reaver", "at-war", "outlaw"] },
      check: { attr: "might", dc: 15, perkBonus: [{ perk: "sea-legs", n: 3 }] },
      pass: { text: "Two prizes and a hold full of other people's arrangements.", eff: { coin: 600, notoriety: 14, renown: 5, kills: 2 } },
      fail: { text: "The second ship you chose was a warship pretending not to be.", eff: { items: ["-ship"], flags: ["-shipowner"], health: -26, notoriety: 8 } } },
  ] },

/* ==========================================================================
   WHAT YOU KNOW
   ========================================================================== */

{ id: "c-blackmail", w: 3, when: { wild: false, flags: ["dangerous-knowledge"], minTurn: 4 },
  dm: "You know a thing about somebody who matters. Knowledge like this does not sit still: either you use it, or eventually it uses you.",
  opts: [
    { label: "Sell it to their enemy",
      check: { attr: "cunning", dc: 14 },
      pass: { text: "Paid handsomely, and the ruin that follows has nothing visibly to do with you.", eff: { coin: 450, flags: ["-dangerous-knowledge"], secrets: 1, notoriety: 4 } },
      fail: { text: "Their enemy is their friend this month. Politics moves faster than you do.", eff: { flags: ["hunted"], health: -10 } } },
    { label: "Sell it back to them",
      check: { attr: "charm", dc: 16, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "An arrangement, renewed yearly, that neither of you will ever describe out loud.", eff: { coin: 200, flags: ["pensioned"], standing: 4 } },
      fail: { text: "They decide that a dead man renews nothing.", eff: { flags: ["hunted"], health: -14 } } },
    { label: "Give it away, to everybody, at once",
      res: { text: "By the end of the month it is in three cities and a song. It costs you every coin it might have earned and it cannot now be taken back off you.", eff: { flags: ["-dangerous-knowledge", "-hunted"], renown: 10, standing: -6, notoriety: 6, secrets: 1 } } },
    { label: "Keep sitting on it", res: { text: "Another year of knowing. It gets heavier.", eff: { attr: { wits: 1 }, health: -3 } } },
  ] },

{ id: "c-cold-warning", w: 3, when: { wild: false, anyFlag: ["heard-of-the-cold", "saw-something"], minTurn: 6, notFlags: ["warned-the-realm"] },
  dm: "You have seen or been told something about what is north of the Wall, and you have not been able to put it down. Nobody south of the Neck will hear a word of it. You could stop trying.",
  opts: [
    { label: "Take it to somebody who matters",
      check: { attr: "charm", dc: 18, flagBonus: [{ flag: "knows-the-lords", n: 4 }, { flag: "councillor", n: 5 }, { flag: "maester", n: 4 }] },
      pass: { text: "One lord in eleven listens. He sends grain north and a hundred men, and calls you a fool while doing it. It is the most useful afternoon of your life.", eff: { renown: 8, standing: 6, flags: ["warned-the-realm"], attr: { charm: 1 }, secrets: 1 } },
      fail: { text: "You are laughed out of two halls and asked to leave a third. The word 'grumkins' is used.", eff: { standing: -8, renown: 1 } } },
    { label: "Go back and get proof",
      check: { attr: "grit", dc: 17, perkBonus: [{ perk: "cold-blood", n: 3 }, { perk: "hardy", n: 3 }] },
      pass: { text: "You come back with something in a sack that stops every conversation in every room you open it in.", eff: { renown: 12, secrets: 2, flags: ["warned-the-realm", "proof-of-the-cold"], health: -24 } },
      fail: { text: "You go north. Most of you comes back.", eff: { health: -38, secrets: 1 } } },
    { label: "Say nothing ever again",
      res: { text: "It is much easier. You sleep worse.", eff: { flags: ["warned-the-realm"], health: -4, attr: { grit: 1 } } } },
  ] },

{ id: "c-green-dream", w: 3, when: { wild: false, flags: ["greensight-touched"], minTurn: 5 },
  dm: "You dream of a thing that has not happened yet, in the flat and undramatic way that real memory works, and you wake certain of it. This has happened four times now. Three of them were right.",
  opts: [
    { label: "Act on it",
      check: { attr: "wits", dc: 14 },
      pass: { text: "You are in the right place a day early and it makes all the difference in the world to somebody.", eff: { renown: 4, secrets: 1, spared: 1, standing: 3, attr: { wits: 1 } } },
      fail: { text: "You are in the wrong place a day early, and it costs you the season.", eff: { coin: -40, standing: -3 } } },
    { label: "Tell somebody",
      check: { attr: "charm", dc: 15 },
      pass: { text: "You are believed, which is worse than not being believed, because now they want more.", eff: { renown: 5, flags: ["known-dreamer"], standing: 4 } },
      fail: { text: "You are marked down as touched, and it follows you into every hall you enter.", eff: { standing: -8, renown: 2 } } },
    { label: "Go north and find out what is doing it", req: { anyFlag: ["old-gods", "freefolk", "ranger"] },
      check: { attr: "grit", dc: 17 },
      pass: { text: "You find a tree, and something under it, and you are up there for a very long time. You come back different and considerably harder to lie to.", eff: { attr: { wits: 3, grit: 1 }, secrets: 3, age: 2, flags: ["greenseer"], health: -14 } },
      fail: { text: "You find a great many trees and nothing else, and nearly die of the cold looking.", eff: { health: -28, age: 1 } } },
  ] },

{ id: "c-forgery", w: 3, when: { wild: false, anyFlag: ["half-lettered", "lettered-now", "maester"], anyPerk: ["lettered", "sly", "bookish"], minTurn: 5 },
  dm: "You can read and write, which most cannot, and you have realised — as everyone who can eventually realises — that a letter is only ink, and a seal is only wax.",
  opts: [
    { label: "Forge a writ that opens a door",
      check: { attr: "wits", dc: 15, perkBonus: [{ perk: "lettered", n: 4 }], itemBonus: [{ item: "seal", n: 4 }] },
      pass: { text: "The gate guard reads three words, sees the wax, and steps aside. It works on almost everybody, almost always.", eff: { coin: 260, items: ["seal"], notoriety: 5, attr: { cunning: 1 } } },
      fail: { text: "The steward can read too, and has seen that seal a thousand times.", eff: {}, goto: "arrest" } },
    { label: "Forge a pardon for yourself", req: { anyFlag: ["wanted", "outlaw"] },
      check: { attr: "wits", dc: 18, perkBonus: [{ perk: "lettered", n: 4 }] },
      pass: { text: "It is beautiful work. You are, on paper, an honest man, and paper is what the world runs on.", eff: { flags: ["-wanted", "-outlaw", "forged-pardon"], notoriety: -20, standing: 6 } },
      fail: { text: "The hand is wrong for the reign. They keep the parchment and they keep you.", eff: {}, goto: "trial" } },
    { label: "Sell the skill quietly",
      res: { text: "You never touch the documents you write. It is steady, dull, extremely well paid work.", eff: { coin: 160, notoriety: 3, secrets: 1 } } },
  ] },

/* ==========================================================================
   RANK, COMMAND AND THE THINGS THAT COME WITH THEM
   ========================================================================== */

{ id: "c-officer-order", w: 3, when: { wild: false, flags: ["officer", "at-war"] },
  dm: "You have men, and an order, and the order is to take a position that will cost about a third of them. Your captain is not asking your opinion; he is watching to see what you do with your face.",
  opts: [
    { label: "Obey it exactly",
      check: { attr: "might", dc: 15, followerBonus: { per: 5, max: 5 } },
      pass: { text: "It costs a quarter, not a third, and the position holds. That is as well as this kind of thing ever goes.", eff: { followers: -4, renown: 8, standing: 8, health: -16, kills: 2 } },
      fail: { text: "It costs half, and the position does not hold, and you are the one who has to say so afterwards.", eff: { followers: -8, standing: -8, health: -22 } } },
    { label: "Find another way in",
      check: { attr: "wits", dc: 17, perkBonus: [{ perk: "clever", n: 3 }, { perk: "wary", n: 2 }] },
      pass: { text: "A drain, a night, and eleven men. The position is yours by dawn and your captain is furious and delighted in roughly equal measure.", eff: { renown: 14, standing: 10, followers: -1, attr: { wits: 1 }, kills: 1 } },
      fail: { text: "The other way is watched. You lose the surprise, the men and the argument.", eff: { followers: -6, standing: -10, health: -20 } } },
    { label: "Refuse the order",
      res: { text: "You say no in front of witnesses. Your men would follow you into the sea after this, and your captain will never trust you with anything again.", eff: { followers: 6, standing: -14, renown: 4, flags: ["-officer", "insubordinate"] } } },
  ] },

{ id: "c-council-secrets", w: 2, when: { wild: false, flags: ["councillor"], minTurn: 4 },
  dm: "You sit where the letters are read. This week's letters are worse than usual, and only four people in the world have seen them.",
  opts: [
    { label: "Do your job", res: { text: "You advise well, the crisis is managed, and nobody outside the room ever learns there was one.", eff: { standing: 8, coin: 120, secrets: 1 } } },
    { label: "Trade what you have read", req: { anyPerk: ["sly", "clever"] },
      check: { attr: "cunning", dc: 15 },
      pass: { text: "A merchant house buys three days of foreknowledge, and three days is an enormous amount of time.", eff: { coin: 600, notoriety: 6, flags: ["corrupt"], secrets: 1 } },
      fail: { text: "Somebody at the table did exactly the same thing and was caught, and now everyone's letters are counted.", eff: { standing: -12, flags: ["-councillor"] } } },
    { label: "Show the letters to the person they are about",
      check: { attr: "charm", dc: 14 },
      pass: { text: "They will never forget it. Neither will you, whenever you need something.", eff: { flags: ["owed-a-favour"], standing: -2, secrets: 1 } },
      fail: { text: "They take the letters to the very people you took them from.", eff: { flags: ["-councillor"], standing: -16, notoriety: 6 } } },
  ] },

{ id: "c-corrupt-audit", w: 2, when: { wild: false, flags: ["corrupt"], minTurn: 6 },
  dm: "There is a new man doing the accounts, and he is thorough, and he is young enough to still believe that this matters.",
  opts: [
    { label: "Put it all back before he gets there", req: { minCoin: 400 }, cost: { coin: 400 },
      res: { text: "It costs you nearly everything and the books balance, and he finds nothing, and says so at length.", eff: { flags: ["-corrupt"], standing: 4 } } },
    { label: "Buy him", cost: { coin: 120 }, req: { minCoin: 120 },
      check: { attr: "charm", dc: 15 },
      pass: { text: "He has debts of his own. Everyone does. The books are beautiful by the quarter-day.", eff: { flags: ["corrupt"], notoriety: 4, attr: { cunning: 1 } } },
      fail: { text: "He does not have debts of his own, and now he has a motive as well as a ledger.", eff: { standing: -10 }, goto: "trial" } },
    { label: "Ruin him first", req: { anyPerk: ["cruel", "sly"] },
      check: { attr: "cunning", dc: 16 },
      pass: { text: "By the time anybody reads his figures, nobody believes anything he writes.", eff: { notoriety: 8, standing: 2, secrets: 1 } },
      fail: { text: "He is better liked than you supposed.", eff: { standing: -14 }, goto: "trial" } },
  ] },

{ id: "c-king-uneasy", w: 3, when: { wild: false, flags: ["king"], minTurn: 2 },
  dm: "You are a king, which means that everyone who comes into the room wants something and everyone who leaves it has an opinion about you. Three of your bannermen have not answered a summons.",
  opts: [
    { label: "Ride on them with everything you have",
      check: { attr: "might", dc: 16, followerBonus: { per: 25, max: 6 } },
      pass: { text: "Two open their gates. The third does not, and afterwards there is no third.", eff: { renown: 10, notoriety: 10, followers: 15, kills: 2, health: -16, standing: 8 } },
      fail: { text: "Three becomes seven. This is how kingdoms end, and it is not usually slow.", eff: { followers: -40, standing: -20, health: -18 } } },
    { label: "Buy them", req: { minCoin: 600 }, cost: { coin: 600 },
      res: { text: "Land, titles, marriages. It works, and it will have to work again next year, and cost more.", eff: { followers: 12, standing: 6 } } },
    { label: "Go to them yourself, alone",
      check: { attr: "charm", dc: 18, perkBonus: [{ perk: "silver", n: 4 }, { perk: "honest", n: 3 }] },
      pass: { text: "It is either the bravest or the stupidest thing you have ever done, and it works so completely that men will argue about it for a century.", eff: { renown: 20, standing: 16, followers: 25, attr: { charm: 2 } } },
      fail: { text: "You went into another man's hall with no men. He has been thinking about what to do with a king for some time.", eff: { jail: 4, standing: -14, health: -16 }, goto: "cell" } },
  ] },

{ id: "c-crown-refused-later", w: 2, when: { wild: false, flags: ["refused-crown"], minTurn: 8 },
  dm: "The men who wanted to crown you have crowned somebody else. He is worse at it than you would have been, and he knows that you know.",
  opts: [
    { label: "Serve him well",
      check: { attr: "charm", dc: 14 },
      pass: { text: "He learns to rely on you completely, which is the same as ruling and involves far less risk of being killed for it.", eff: { title: "Hand", standing: 22, coin: 300, flags: ["kingmaker"], renown: 6 } },
      fail: { text: "He cannot be in a room with you, and arranges for the rooms to be different ones.", eff: { standing: -10, move: "random" } } },
    { label: "Take it off him", req: { minFollowers: 60 },
      check: { attr: "might", dc: 18, followerBonus: { per: 20, max: 6 } },
      pass: { text: "It takes a season and it is not close. You have the crown you would not take, and you took it the way crowns are actually taken.", eff: { title: "King", flags: ["king", "-refused-crown"], standing: 34, renown: 26, kills: 1, holding: "a crown", health: -20 } },
      fail: { text: "He has been expecting this since the day he was crowned.", eff: { followers: -30, health: -30, flags: ["hunted"] } } },
    { label: "Go a long way away", res: { text: "You take what you have and put four hundred leagues between you and the throne you refused. It is the first quiet year you have had.", eff: { move: { realm: "free-cities" }, health: 14, standing: -6, flags: ["-refused-crown"] } } },
  ] },

/* ==========================================================================
   TRADES AND LIVES YOU ENDED UP IN
   ========================================================================== */

{ id: "c-pit-famous", w: 3, when: { wild: false, flags: ["pit-fighter"], minRenown: 12 },
  dm: "You are a name on the sand now. A Great Master would like to buy your contract, a rival pit would like to buy you outright, and a very quiet man would like to talk about the fights nobody bets honestly on.",
  opts: [
    { label: "Take the Great Master's contract",
      res: { text: "Better food, better armour, and a slightly longer expected life. It is still a pit.", eff: { coin: 200, standing: 6, health: 10 } } },
    { label: "Buy your own freedom", req: { minCoin: 400 }, cost: { coin: 400 },
      res: { text: "It is the single best purchase anyone has ever made. You walk out of the gate on the side the crowd uses.", eff: { flags: ["-enslaved", "freedman", "-pit-fighter"], renown: 4, standing: 4 } } },
    { label: "Lose the fights you are told to lose",
      check: { attr: "cunning", dc: 15 },
      pass: { text: "You go down convincingly in the eighth and the man who paid you is delighted. This is far more lucrative than winning.", eff: { coin: 340, notoriety: 6, renown: -3, health: -12 } },
      fail: { text: "The crowd knows. Twenty thousand people know at the same moment, and they are extremely unhappy about it.", eff: { health: -26, renown: -8, standing: -10 } } },
  ] },

{ id: "c-faceless-work", w: 2, when: { wild: false, flags: ["faceless"], minTurn: 4 },
  dm: "A name is given to you. Not a reason — reasons are for people who still have names of their own. Only a name, and a city, and the understanding that it will be done.",
  opts: [
    { label: "Give the gift",
      check: { attr: "cunning", dc: 15, perkBonus: [{ perk: "quiet", n: 4 }, { perk: "cold-blood", n: 3 }] },
      pass: { text: "It is quiet, and kind, and nobody who was in that house will ever know it was not simply a bad heart.", eff: { kills: 1, coin: 60, secrets: 1, attr: { cunning: 1 } } },
      fail: { text: "You are seen. Being seen is the one thing the House does not forgive, and they will want a conversation.", eff: { health: -14, flags: ["hunted"] } } },
    { label: "Refuse the name",
      res: { text: "You give back what you were given and are shown, without any anger at all, the door you came in by. That is all. That is enough.", eff: { flags: ["-faceless", "-sworn"], standing: 2, attr: { grit: 1 } } } },
    { label: "Warn them instead",
      check: { attr: "swiftness", dc: 18 },
      pass: { text: "They are gone by the time the House sends the second servant. Nobody can prove it was you. The House does not require proof.", eff: { spared: 1, flags: ["-faceless", "hunted"], renown: 2 } },
      fail: { text: "The second servant was sent at the same time as the first.", eff: { die: "given the gift, by one of your own" } } },
  ] },

{ id: "c-drowned-summons", w: 2, when: { flags: ["drowned-man"], realms: ["iron-islands"], minTurn: 6 },
  dm: "The priests are calling a gathering on Old Wyk. Under the ribs of Nagga, men who have been drowned and come back put names forward, and the islands do what they have always done and shout about it.",
  opts: [
    { label: "Put your own name forward", req: { minRenown: 25 },
      check: { attr: "charm", dc: 19, followerBonus: { per: 10, max: 6 }, flagBonus: [{ flag: "iron-price", n: 4 }, { flag: "reaver", n: 3 }] },
      pass: { text: "A driftwood crown, on a hill of stone, in front of every captain in the islands. It is the oldest thing anyone here does and it has just happened to you.", eff: { title: "King of the Isles", flags: ["king"], standing: 34, renown: 30, followers: 40, holding: "the Seastone Chair" } },
      fail: { text: "You are heard out, and laughed at, and the laughter is remembered longer than the speech.", eff: { standing: -10, renown: 2 } } },
    { label: "Back somebody who can win",
      check: { attr: "wits", dc: 14 },
      pass: { text: "You pick right, and you pick early, and the man who is crowned knows exactly who was shouting first.", eff: { standing: 14, followers: 8, coin: 200, flags: ["owed-a-favour"] } },
      fail: { text: "You pick the wrong man loudly, and the right one has a long memory.", eff: { standing: -10 } } },
    { label: "Stay away from it", res: { text: "Whoever wins will remember that you were not there.", eff: { standing: -4 } } },
  ] },

{ id: "c-company-contract", w: 3, when: { wild: false, flags: ["company"], minTurn: 4 },
  dm: "The company has three offers on the table and the captains are arguing about them in front of everybody, which is how free companies decide things.",
  opts: [
    { label: "Argue for the best-paid contract",
      check: { attr: "charm", dc: 14, followerBonus: { per: 6, max: 4 } },
      pass: { text: "You carry the vote. The pay is excellent and so, unfortunately, is the enemy.", eff: { coin: 220, renown: 3, health: -12, flags: ["at-war"] } },
      fail: { text: "You are shouted down and the company takes a worse contract in a worse country.", eff: { coin: 60, flags: ["at-war"], standing: -3 } } },
    { label: "Argue for the safest one",
      res: { text: "Garrison duty in a city that is not going to be attacked. Dull, and everyone who took your advice is alive at the end of it.", eff: { coin: 90, followers: 2, standing: 3 } } },
    { label: "Take your own men and leave", req: { minFollowers: 12 },
      check: { attr: "charm", dc: 16, followerBonus: { per: 8, max: 5 } },
      pass: { text: "A third of the company walks out with you. That is not a mutiny; that is a new company, and you name it that evening.", eff: { followers: 20, flags: ["-company", "own-company"], renown: 8, notoriety: 4, attr: { charm: 1 } } },
      fail: { text: "Four men follow you. Four men is not a company; four men is an embarrassment with horses.", eff: { followers: -4, standing: -8, flags: ["-company"] } } },
  ] },

{ id: "c-own-company", w: 3, when: { wild: false, flags: ["own-company"], minTurn: 4 },
  dm: "It is your company. Your name on the contract, your seal, your problem when the pay is late — and the pay is late.",
  opts: [
    { label: "Pay them out of your own purse", req: { minCoin: 200 }, cost: { coin: 200 },
      res: { text: "They find out you did it, because these things are always found out, and it buys you something no contract can.", eff: { followers: 6, renown: 4, standing: 4, flags: ["good-captain"] } } },
    { label: "Take the town you are camped outside instead",
      check: { attr: "might", dc: 16, followerBonus: { per: 8, max: 6 } },
      pass: { text: "Your employer is horrified and your men are paid. Everyone in Essos understands this transaction perfectly.", eff: { coin: 500, notoriety: 14, renown: 6, kills: 2, followers: 2, health: -14 } },
      fail: { text: "The town has walls, and you have men who have not been paid.", eff: { followers: -10, health: -22, standing: -8 } } },
    { label: "Sell the contract to the other side",
      check: { attr: "cunning", dc: 15 },
      pass: { text: "Twice the money for the same season's work. Every free company in the Disputed Lands has done it and yours is no different.", eff: { coin: 420, notoriety: 10, flags: ["turncloak"], followers: 1 } },
      fail: { text: "Your own captains find out before your employer does.", eff: { followers: -14, flags: ["-own-company"], health: -16 } } },
  ] },

{ id: "c-house-succession", w: 2, when: { wild: false, flags: ["founded-house"], minTurn: 16 },
  dm: "You made a house out of nothing. The question that ends every house is the one in front of you now: who has it after you, and does anyone else agree?",
  opts: [
    { label: "Name your child", req: { flags: ["heir"] },
      res: { text: "Written, witnessed, sealed. It is the single most important sentence you will ever have somebody else write down.", eff: { flags: ["succession-set"], standing: 10, renown: 3 } } },
    { label: "Name your best man rather than your blood",
      check: { attr: "charm", dc: 16 },
      pass: { text: "Blood is furious and the household is relieved, and the household is what actually holds a house together.", eff: { flags: ["succession-set"], followers: 8, standing: 6, renown: 4 } },
      fail: { text: "Blood is furious and so is the household, and now there are two claims where there were none.", eff: { standing: -12, followers: -6, flags: ["disputed-house"] } } },
    { label: "Refuse to settle it", res: { text: "You are not dying yet and you dislike the conversation. Everyone in the hall begins quietly making arrangements.", eff: { flags: ["disputed-house"], standing: -4 } } },
  ] },

{ id: "c-disputed-house", w: 3, when: { wild: false, flags: ["disputed-house"], minTurn: 4 },
  dm: "There are two answers to who holds this house, and both of them are in the hall tonight, and both of them have brought friends.",
  opts: [
    { label: "Settle it now, in front of everybody",
      check: { attr: "charm", dc: 17, perkBonus: [{ perk: "silver", n: 3 }, { perk: "honest", n: 3 }] },
      pass: { text: "You say the name, and the reason, and the reason is good enough that the other side cannot argue it without arguing against themselves.", eff: { flags: ["-disputed-house", "succession-set"], standing: 12, renown: 4 } },
      fail: { text: "You say the name. The hall divides on the spot, and steel is drawn indoors, which nobody ever recovers from.", eff: { followers: -12, health: -14, standing: -14, kills: 1 } } },
    { label: "Have the loser of the argument removed", req: { anyPerk: ["cruel", "cold-blood"] },
      check: { attr: "cunning", dc: 15 },
      pass: { text: "There is now one claim. Nobody discusses how that came to be, and the house is stable for the first time in years.", eff: { flags: ["-disputed-house", "succession-set", "kinslayer"], kills: 1, notoriety: 12, standing: 4 } },
      fail: { text: "It is botched, and everybody knows, and being a suspected kinslayer is nearly as bad as being one.", eff: { notoriety: 16, standing: -18, followers: -8 } } },
    { label: "Let them fight it out after you are gone",
      res: { text: "You go to bed. The house you built will be two houses within a year of your death, and both of them smaller.", eff: { standing: -4, renown: -2 } } },
  ] },

/* ==========================================================================
   SMALL PAYOFFS
   ========================================================================== */

{ id: "c-loose-stone", w: 6, when: { wild: false, flags: ["loose-stone", "imprisoned"] },
  dm: "The stone you have been working at for a season comes out in your hands, and behind it there is not rock but a shaft, and cold air, and the smell of the river.",
  opts: [
    { label: "Go, tonight",
      check: { attr: "grit", dc: 13, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "hardy", n: 3 }] },
      pass: { text: "Through, down, and into water so cold it stops your heart for a moment. You come out a mile downstream with nothing at all and everything that matters.", eff: { free: 1, flags: ["-loose-stone", "escaped", "wanted"], notoriety: 10, health: -16, attr: { grit: 1 } } },
      fail: { text: "The shaft narrows. You are stuck in it for four hours and found in the morning, and after that they move you somewhere with better stone.", eff: { flags: ["-loose-stone"], health: -14, jail: 3 } } },
    { label: "Wait for a darker night",
      res: { text: "You put the stone back. It is a great deal harder to sleep now that the way out is a thing you have touched.", eff: { health: -3 } } },
    { label: "Sell the way out to the man in the next cell",
      check: { attr: "cunning", dc: 13 },
      pass: { text: "He goes. He leaves what he had, and the guards spend a fortnight convinced the shaft was his own work.", eff: { coin: 70, flags: ["-loose-stone"], spared: 1 } },
      fail: { text: "He goes, and is taken at the water, and tells them precisely whose idea it was.", eff: { flags: ["-loose-stone"], jail: 3, health: -12 } } },
  ] },

{ id: "c-sung-of", w: 2, when: { wild: false, flags: ["sung-of"], minTurn: 4 },
  dm: "The song has reached a place you have never been. You know this because you have just walked into an inn where somebody is singing it, badly, to people who believe every word.",
  opts: [
    { label: "Say nothing and listen",
      res: { text: "You hear your own life happen to a braver and much stupider man, and buy the singer a drink at the end of it.", eff: { renown: 3, health: 6, coin: -4 } } },
    { label: "Say who you are",
      check: { attr: "charm", dc: 13, flagBonus: [{ flag: "knight", n: 3 }] },
      pass: { text: "The room will talk about this evening for twenty years. Two men ask to follow you before you have finished your first cup.", eff: { renown: 6, followers: 2, standing: 4, coin: 20 } },
      fail: { text: "Nobody believes you, and the room decides you are a liar trading on somebody else's name, which is a particular kind of humiliation.", eff: { standing: -6, renown: -2 } } },
    { label: "Trade on it", req: { anyPerk: ["sly", "silver"] },
      check: { attr: "cunning", dc: 14 },
      pass: { text: "It turns out that being the man in the song is worth free lodging, credit, and a loan you have no intention of repaying.", eff: { coin: 180, notoriety: 4, attr: { cunning: 1 } } },
      fail: { text: "The man you borrowed from has met the actual singer, who described you.", eff: { standing: -8, notoriety: 6 } } },
  ] },

{ id: "c-treecutter-remembered", w: 2, when: { flags: ["treecutter"], realms: ["north", "beyond-the-wall", "riverlands"] },
  dm: "They know here. Somebody has told somebody, the way it always goes, and this village has decided what it thinks about a man who put an axe to a heart tree.",
  opts: [
    { label: "Face them down",
      check: { attr: "might", dc: 15, perkBonus: [{ perk: "cold-blood", n: 3 }, { perk: "big", n: 2 }] },
      pass: { text: "Nobody in that village will look at you and nobody in that village will touch you, and you sleep under a roof.", eff: { notoriety: 4, health: -6, attr: { grit: 1 } } },
      fail: { text: "There are forty of them and they have been thinking about it since noon.", eff: { health: -28, coin: -60 } } },
    { label: "Go south and keep going",
      res: { text: "You will not come north again. It is a large realm and there is a great deal of it that does not care about trees.", eff: { move: { realm: "crownlands" }, standing: -3 } } },
    { label: "Plant one", req: { minCoin: 60 }, cost: { coin: 60 },
      check: { attr: "charm", dc: 16 },
      pass: { text: "A weirwood sapling, brought at absurd expense, put in the ground by your own hands in front of the whole village. It will outlive everyone watching. They let you stay.", eff: { flags: ["-treecutter"], standing: 8, renown: 4, attr: { charm: 1 } } },
      fail: { text: "They watch you plant it and they wait for you to leave, and it is out of the ground by morning.", eff: { coin: -60, standing: -6 } } },
  ] },

{ id: "c-slaver-reckoning", w: 2, when: { wild: false, flags: ["slaver"], minTurn: 8 },
  dm: "Somebody you owned is standing in front of you, free, and has been rehearsing this for years.",
  opts: [
    { label: "Free everyone you hold and say so publicly",
      res: { text: "It costs you a great deal of money and rather more standing in a city built on the trade. Two of them stay, and stay paid.", eff: { flags: ["-slaver", "freedman-friend"], coin: -200, standing: -10, followers: 2, renown: 6, spared: 3 } } },
    { label: "Buy them off", req: { minCoin: 150 }, cost: { coin: 150 },
      check: { attr: "charm", dc: 15 },
      pass: { text: "They take it, and hate taking it, and go. It is settled in the only way you know how to settle anything.", eff: { standing: 1 } },
      fail: { text: "They throw it in the street and tell the whole quarter what you did and what you offered.", eff: { standing: -10, notoriety: 6, coin: -150 } } },
    { label: "Have them taken back up", req: { anyPerk: ["cruel"] },
      check: { attr: "might", dc: 13 },
      pass: { text: "It is entirely legal here. That is the worst thing about here.", eff: { coin: 90, notoriety: 12, standing: 4, flags: ["slaver"] } },
      fail: { text: "They are faster than your men and the street is on their side.", eff: { health: -16, notoriety: 10, standing: -6 } } },
  ] },

{ id: "c-chains-broken", w: 3, when: { wild: false, flags: ["breaker-of-chains"], minTurn: 3 },
  dm: "There are people following you now who were property a month ago. They have no food, no arms, and no idea what to do next, and they are looking at you as if you do.",
  opts: [
    { label: "Feed them, arm them, make them yours", cost: { coin: 120 }, req: { minCoin: 120 },
      check: { attr: "charm", dc: 15, perkBonus: [{ perk: "silver", n: 3 }, { perk: "honest", n: 3 }] },
      pass: { text: "It takes everything you have. In three months you have something no coin in Essos can buy: several hundred people with nowhere else to be and a reason to be there.", eff: { followers: 60, renown: 12, standing: 8, coin: -120, flags: ["liberator"] } },
      fail: { text: "You cannot feed them all. Most of them drift away and some of them are taken back, and you will think about it for a long time.", eff: { followers: 8, coin: -120, renown: 2, health: -8 } } },
    { label: "Take them north and sell them their freedom",
      check: { attr: "cunning", dc: 14 },
      pass: { text: "Passage for a price they can work off. It is not slavery. It is not far off it either, and it makes you rich.", eff: { coin: 400, followers: 6, renown: -4, notoriety: 6, standing: 4 } },
      fail: { text: "They understand exactly what you are offering.", eff: { followers: -10, renown: -8, notoriety: 8 } } },
    { label: "Tell them to go", res: { text: "They go. It was never your responsibility and that is not the same as it not being your doing.", eff: { renown: -3, standing: 1 } } },
  ] },

{ id: "c-old-friend-lord", w: 2, when: { wild: false, flags: ["knows-the-lords"], minTurn: 8 },
  dm: "A face you learned at a tourney years ago, when you were nobody and spent the day putting names to banners. He is a great deal more important now, and he is looking at you as though he half remembers.",
  opts: [
    { label: "Remind him where you met",
      check: { attr: "charm", dc: 13, perkBonus: [{ perk: "connected", n: 3 }] },
      pass: { text: "He is delighted, in the way that powerful men are delighted by anything that reminds them of being young.", eff: { standing: 10, coin: 80, flags: ["owed-a-favour"], attr: { charm: 1 } } },
      fail: { text: "He does not remember, and does not enjoy being told that he should.", eff: { standing: -4 } } },
    { label: "Sell what you know about him", req: { anyPerk: ["sly"] },
      check: { attr: "cunning", dc: 15 },
      pass: { text: "Old faces, old debts, old promises made in a pavilion. Somebody pays well for a map of who owes whom.", eff: { coin: 260, secrets: 1, notoriety: 4 } },
      fail: { text: "The man you sold it to is his cousin.", eff: { flags: ["hunted"], standing: -10 } } },
  ] },

{ id: "c-kinslayer", w: 3, when: { wild: false, flags: ["kinslayer"], minTurn: 3 },
  dm: "No hall in the Seven Kingdoms is comfortable with you now. Kinslaying is the one thing this world has never learned to shrug at, and the room goes quieter when you enter it than it does for murderers.",
  opts: [
    { label: "Live with it",
      check: { attr: "grit", dc: 15, perkBonus: [{ perk: "cold-blood", n: 4 }] },
      pass: { text: "You stop noticing after the fourth year. That is not the same as it stopping.", eff: { attr: { grit: 2 }, standing: -2 } },
      fail: { text: "You do not sleep, and it shows, and it makes people surer of what they already thought.", eff: { health: -14, standing: -6 } } },
    { label: "Take the black", req: { sides: ["westeros"], notFlags: ["nights-watch"] },
      res: { text: "The Wall takes any man and asks nothing about what he was. It is the only institution in the world that means that.", eff: { flags: ["nights-watch", "sworn", "-wanted", "-kinslayer"], notoriety: -30, standing: 0, move: "castle-black" }, goto: "wall-arrival" } },
    { label: "Go where nobody has heard of it",
      res: { text: "Essos does not care. Essos has never cared, about anything, which is either its great failing or its great mercy.", eff: { move: { realm: "free-cities" }, flags: ["-kinslayer"], standing: -4, coin: -60 } } },
  ] },

]);
