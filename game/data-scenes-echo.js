/* ============================================================================
   THE IRON LADDER — WHAT COMES BACK.

   Every event in this file is gated on a flag that an earlier choice set, and
   every one of them refers to the deed. That is the whole rule and it is the
   test for anything added here: IF THIS EVENT WOULD READ FINE TO SOMEBODY WHO
   NEVER DID THE THING, IT BELONGS IN ONE OF THE OTHER DECK FILES.

   The reason this file exists is a number. The checker counts flags set
   against flags read, and after the last content pass the score was two
   hundred and nineteen set against a hundred and eight read — which is to say
   half of everything a player did was recorded and then never mentioned again.
   A game that forgets is not a life, it is a slot machine with prose on it.

   It is not necessary that every flag come back. Several are pure record for
   the chronicle at the end, and a few are keys the same scene checks a moment
   later. What matters is that the LOUD ones return: killing a king, freeing a
   hostage, robbing the poor, going into the plague street, refusing a lord to
   his face. If a player can do something that would change how a world treats
   them, the world has to treat them differently.
   ========================================================================== */

window.IL_EVENTS = (window.IL_EVENTS || []).concat([

/* ======================================================= WHAT YOU KILLED = */

{ id: "e-kingslayer", w: 8, when: { wild: false, amenities: ["crowd"], flags: ["kingslayer"] },
  dm: "Somewhere behind you a hall goes quiet when you enter it. There is a word attached to your name now, and every man in this room has heard it before he heard the name.",
  opts: [
    { label: "Wear it",
      res: { text: "You do not explain and you do not apologise, and after a year of that the word stops being an accusation and becomes a description. It is not respect. It is close enough to work with.", eff: { renown: 8, standing: -4, attr: { grit: 1 }, flags: ["owned-it"] } } },
    { label: "Go somewhere the word has not reached",
      check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "quiet", n: 4 }] },
      pass: { text: "There is such a place, a long way off, and for a season nobody in it knows anything about you at all. It is the best season you have had.", eff: { notoriety: -20, move: "random", rest: 40, health: 8 } },
      fail: { text: "There is no such place. There are only places where they have not said it to your face yet.", eff: { notoriety: 5, rest: -15 } } },
    { label: "Find out who profited by it",
      check: { attr: "wits", dc: 14, perkBonus: [{ perk: "clever", n: 3 }, { perk: "connected", n: 3 }] },
      pass: { text: "Somebody did. Somebody always does, and the man who has done best out of the death of a king is not a man who was anywhere near the room.", eff: { secrets: 2, flags: ["knows-my-enemy", "dangerous-knowledge"], attr: { wits: 1 } } },
      fail: { text: "Four names, all of them plausible, and no way to choose between them.", eff: { rest: -10 } } },
  ] },

{ id: "e-owed-a-life", w: 6, when: { wild: false, amenities: ["crowd"], anyFlag: ["owed-a-life", "cut-a-man-down", "freed-a-slave", "freed-a-hostage"] },
  dm: "Somebody you pulled out of something finds you. It has taken them a long time and some expense, and they have brought what they have, which is not much and is all of it.",
  opts: [
    { label: "Take what they have brought and let them go",
      res: { text: "They will not be argued with. They go lighter than they came, and you sit with a purse you did not earn and a feeling you cannot name.", eff: { coin: 90, standing: 2, health: 4 } } },
    { label: "Take them on instead",
      res: { text: "They have no trade and no name and will do absolutely anything you ask, which is a dangerous thing to be given and a very useful one.", eff: { followers: 1, renown: 1, flags: ["sworn-man"] } } },
    { label: "Ask what they know",
      check: { attr: "charm", dc: 10 },
      pass: { text: "Where they have been since, and who they were with, and what those men are planning. People who owe you tell you things nobody else would.", eff: { secrets: 2, attr: { charm: 1 }, flags: ["knows-a-mark"] } },
      fail: { text: "They have been nowhere and know nothing and are simply grateful, which is its own kind of answer.", eff: { standing: 1 } } },
  ] },

{ id: "e-robbed-the-poor", w: 6, when: { wild: false, amenities: ["crowd"], anyFlag: ["robbed-the-poor", "looted-a-fire"] },
  dm: "You go back through a place you took something from. The place has not recovered, and it has not forgotten either, and there is a woman at a door who knows exactly who you are.",
  opts: [
    { label: "Put it back, with interest", cost: { coin: 90 }, req: { minCoin: 90 },
      res: { text: "You leave more than you took and you do not stay to be thanked, because being thanked for that would be worse than anything they could shout at you.", eff: { standing: 5, renown: 2, notoriety: -8, flags: ["-robbed-the-poor", "-looted-a-fire", "made-it-right"] } } },
    { label: "Face her",
      check: { attr: "grit", dc: 13, perkBonus: [{ perk: "honest", n: 4 }] },
      pass: { text: "You let her say the whole of it in the street without once interrupting. At the end of it she is finished and you are not forgiven, and both of you are better for it.", eff: { attr: { grit: 1 }, notoriety: -4, health: -3 } },
      fail: { text: "You answer back. The street takes her side, correctly.", eff: { standing: -6, notoriety: 4, health: -6 } } },
    { label: "Ride on through", res: { text: "You do not slow down. She shouts anyway, and it carries a surprisingly long way.", eff: { notoriety: 3, standing: -2 } } },
  ] },

/* ================================================== WHAT YOU DID WELL === */

{ id: "e-plague-remembered", w: 6, when: { wild: false, amenities: ["crowd"], anyFlag: ["went-into-the-plague", "tended-the-wounded", "fed-a-village"] },
  dm: "A man you do not recognise stops in front of you and will not move, and then says the name of a street, or a field, or a tent, and waits to see whether you remember it.",
  opts: [
    { label: "You remember it",
      res: { text: "He was one of the ones who lived. He is not sentimental about it — he simply tells everyone he drinks with, everywhere he goes, and has been doing so for a year.", eff: { renown: 6, standing: 5, followers: 1, health: 5 } } },
    { label: "Ask what became of the others",
      check: { attr: "grit", dc: 11 },
      pass: { text: "Four names. Two of them did well and one of them is a serjeant now and would like to see you, and the fourth he does not talk about.", eff: { secrets: 1, followers: 1, flags: ["noticed-by-a-captain"] } },
      fail: { text: "He tells you, at length, and it is a great deal worse than you had allowed yourself to assume.", eff: { health: -6, attr: { grit: 1 } } } },
    { label: "Ask him for something", req: { maxCoin: 40 },
      res: { text: "It costs him more than he has and he gives it without a pause, and you take it, and you will think about having taken it for a long while.", eff: { coin: 60, food: 50, standing: -1 } } },
  ] },

{ id: "e-preacher-again", w: 5, when: { wild: false, amenities: ["crowd"], anyFlag: ["saved-the-preacher", "spoke-against-the-lord", "heard-the-preacher"] },
  dm: "The man from the barrel is preaching again, three towns from where he was, and there are two hundred people listening rather than eleven. He sees you before you have decided whether to be seen.",
  opts: [
    { label: "Stand with him where the crowd can see",
      check: { attr: "grit", dc: 13, perkBonus: [{ perk: "honest", n: 4 }] },
      pass: { text: "You do not say anything. Standing there is the whole statement, and two hundred people make it for you by the end of the week.", eff: { renown: 8, notoriety: 12, standing: -6, followers: 3, flags: ["a-cause"] } },
      fail: { text: "Two hundred people is a great many, and about nine of them work for somebody.", eff: { notoriety: 10, flags: ["wanted", "watched"] } } },
    { label: "Get him to stop before this kills him",
      check: { attr: "charm", dc: 14, perkBonus: [{ perk: "silver", n: 4 }, { perk: "honest", n: 3 }] },
      pass: { text: "He listens, which he has never done. He goes north with a cart and a new name and you get a letter about it two years later.", eff: { spared: 1, standing: 2, secrets: 1, flags: ["saved-the-preacher"] } },
      fail: { text: "He tells you, kindly and in front of everybody, that you are afraid. He is right, and being right does not make it less of a thing to say.", eff: { standing: -4, health: -3 } } },
    { label: "Walk on past", res: { text: "You walk on. Somebody in the crowd says your name and you do not turn round.", eff: { attr: { cunning: 1 } } } },
  ] },

{ id: "e-arms-recognised", w: 5, when: { wild: false, amenities: ["crowd"], anyFlag: ["own-arms", "tourney-winner", "trial-by-battle"] },
  dm: "A herald at a gate looks at what you are carrying and asks, in the flat voice of a man who checks these things, where you had the right to it.",
  opts: [
    { label: "Answer him properly",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 3 }], flagBonus: [{ flag: "knight", n: 4 }, { flag: "highborn", n: 4 }] },
      pass: { text: "You give him a name and a place and a date, and he writes it down, and from this day forward there is a roll somewhere with your device on it. That is what heraldry is.", eff: { standing: 8, renown: 3, flags: ["on-the-rolls"] } },
      fail: { text: "You cannot, and he takes it off the shield with a knife while you stand there.", eff: { items: ["-painted-shield"], standing: -8 } } },
    { label: "Ask him what it would take to make it real",
      res: { text: "A lord's word, a fee, and a witness, and he tells you the order to do them in, which is worth more than the fee.", eff: { secrets: 1, attr: { wits: 1 }, flags: ["knows-the-way-up"] } } },
    { label: "Say nothing and go round", res: { text: "Another gate, no herald, and you are inside by dark.", eff: { rest: -8 } } },
  ] },

/* ===================================================== WHAT YOU LEARNED = */

{ id: "e-proof-in-hand", w: 6, when: { wild: false, anyFlag: ["holds-proof", "blackmailer", "sells-secrets"] },
  dm: "The letter is still where you put it. Somebody has begun asking, very politely and in several places at once, whether anybody knows where it is.",
  opts: [
    { label: "Sell it back to the man it belongs to",
      check: { attr: "charm", dc: 14, perkBonus: [{ perk: "silver", n: 4 }, { perk: "wary", n: 3 }] },
      pass: { text: "In a room with two doors and somebody of yours by one of them. He pays, in gold, without haggling, which tells you it was worth twice what you asked.", eff: { coin: 900, items: ["-letters"], flags: ["-holds-proof", "made-an-enemy"], standing: 2 } },
      fail: { text: "You go alone to a room with one door.", eff: { health: -30, items: ["-letters"], flags: ["-holds-proof", "hunted"] } } },
    { label: "Sell it to his enemy instead",
      check: { attr: "cunning", dc: 14, perkBonus: [{ perk: "connected", n: 4 }, { perk: "sly", n: 3 }] },
      pass: { text: "Less coin and far more consequence. A great house is going to lose a good deal over this and there will never be anything on paper linking it to you.", eff: { coin: 400, renown: 3, items: ["-letters"], flags: ["-holds-proof", "made-an-enemy", "allied"], secrets: 1 } },
      fail: { text: "His enemy takes the letter, thanks you, pays nothing, and has now got a piece of paper with your knowledge in it and no reason to keep you.", eff: { items: ["-letters"], flags: ["-holds-proof", "hunted"] } } },
    { label: "Burn it",
      res: { text: "It takes about four seconds. You are considerably poorer and you sleep for the first time in a season.", eff: { items: ["-letters"], flags: ["-holds-proof", "-blackmailer"], health: 10, rest: 40, attr: { grit: 1 } } } },
  ] },

{ id: "e-watched", w: 6, when: { wild: false, amenities: ["crowd"], flags: ["watched"] },
  dm: "The same man has been at the edge of three separate days. He is not good at it, which either means he is not good at it or means he is meant to be seen.",
  opts: [
    { label: "Lose him",
      check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "quiet", n: 4 }, { perk: "quick", n: 3 }] },
      pass: { text: "Four turnings, a market, and out through a house with two doors. He is still standing in the market an hour later, and you watch him from the other end of it.", eff: { flags: ["-watched"], attr: { cunning: 1 }, secrets: 1 } },
      fail: { text: "He is better than he looked, and now he knows you tried, which tells him something he did not have.", eff: { flags: ["watched", "hunted"], rest: -15 } } },
    { label: "Take him",
      check: { attr: "might", dc: 13, perkBonus: [{ perk: "strong", n: 3 }, { perk: "cold-blood", n: 3 }] },
      pass: { text: "In a yard, quickly, and he talks almost at once because he is paid by the week and has no reason not to. The name he gives is one you know.", eff: { secrets: 2, flags: ["-watched", "knows-my-enemy"], notoriety: 4 } },
      fail: { text: "He was expecting it and was not alone.", eff: { health: -22, flags: ["hunted"] } } },
    { label: "Let him watch, and give him something to report",
      check: { attr: "cunning", dc: 14, perkBonus: [{ perk: "sly", n: 4 }] },
      pass: { text: "You spend a fortnight doing a thing you are not doing, in front of him, thoroughly. Whoever is paying acts on it, and acting on it costs them a great deal.", eff: { secrets: 2, renown: 2, flags: ["-watched", "knows-my-enemy"], attr: { cunning: 1 } } },
      fail: { text: "He is not a fool and neither is the man reading his reports.", eff: { flags: ["hunted"], standing: -4 } } },
  ] },

{ id: "e-cold-word", w: 4, when: { wild: false, anyFlag: ["knows-whats-coming", "ranged-beyond", "knows-the-north"] },
  dm: "You try telling somebody. A steward, a captain, a septon — anybody with a hall behind him — about the villages standing open and what the free folk are all walking away from.",
  opts: [
    { label: "Tell it plainly",
      check: { attr: "charm", dc: 15, perkBonus: [{ perk: "honest", n: 4 }], flagBonus: [{ flag: "ranged-beyond", n: 4 }, { flag: "knight", n: 3 }] },
      pass: { text: "One man in four listens and this is the one. He does not believe you. He does write it down, and having it written down somewhere is not nothing.", eff: { standing: 3, renown: 2, secrets: 1, flags: ["someone-was-told"] } },
      fail: { text: "You are heard out, thanked, and afterwards described as a man who has been north too long.", eff: { standing: -5 } } },
    { label: "Say nothing and prepare for it yourself",
      res: { text: "Wood, salt, oil, a place with one door. It is the sensible thing and it makes you feel like a madman doing it.", eff: { food: 40, flags: ["a-place-to-lie-up", "resolved"], coin: -40, attr: { wits: 1 } } } },
    { label: "Decide you imagined it", res: { text: "You put it down and it does not stay down.", eff: { rest: -12 } } },
  ] },

/* ==================================================== WHO OWES WHOM ===== */

{ id: "e-bank-comes", w: 6, when: { wild: false, amenities: ["crowd"], anyFlag: ["bank-debt", "indebted", "on-borrowed-time"] },
  dm: "Two men in grey are waiting where you are going to be, and one of them has the sum, to the stag, and the date it was lent, and how long it has been.",
  opts: [
    { label: "Pay in full", cost: { coin: 420 }, req: { minCoin: 420 },
      res: { text: "They count it, thank you, write it down, and go. There is no gloating and no threat and the whole business takes four minutes.", eff: { flags: ["-indebted", "-bank-debt", "-on-borrowed-time", "paid-in-full"], standing: 6, renown: 2 } } },
    { label: "Offer them a share of something instead",
      check: { attr: "charm", dc: 15, perkBonus: [{ perk: "silver", n: 4 }, { perk: "connected", n: 3 }], flagBonus: [{ flag: "read-the-terms", n: 4 }, { flag: "bank-friend", n: 4 }] },
      pass: { text: "They are not moneylenders, whatever the name says — they are investors, and a man offering them a share of a real thing is a different proposition from a man offering excuses.", eff: { flags: ["-on-borrowed-time", "bank-friend"], coin: 200, standing: 4 } },
      fail: { text: "They listen to the whole of it and then repeat the sum and the date.", eff: { coin: -9999, health: -10 } } },
    { label: "Run",
      check: { attr: "cunning", dc: 16, perkBonus: [{ perk: "quiet", n: 4 }, { perk: "quick", n: 3 }] },
      pass: { text: "Across water, under a different name, in a city where nobody has heard yours. It works. It will work for years and it will not work forever.", eff: { move: { realm: "free-cities" }, flags: ["hunted", "on-borrowed-time"], coin: -50 } },
      fail: { text: "The Iron Bank has funded the toppling of kings over sums smaller than yours. It is very good indeed at finding one man.", eff: { health: -25, coin: -9999, jail: 2 }, goto: "arrest" } },
  ] },

{ id: "e-skimming-found", w: 5, when: { wild: false, amenities: ["crowd"], anyFlag: ["skimming", "cheated-a-guild", "dodged-the-tax"] },
  dm: "Somebody has been through the books. Not the books you keep — the other ones, the ones kept by the man who checks. He has not said anything yet. He has begun being polite to you.",
  opts: [
    { label: "Put it back before anyone says the word",
      cost: { coin: 200 }, req: { minCoin: 200 },
      res: { text: "It takes three nights and a great deal of arithmetic and by the end of it the books agree with each other. Nothing is ever said. He stops being polite, which is a relief.", eff: { flags: ["-skimming", "-cheated-a-guild"], standing: 2, attr: { wits: 1 } } } },
    { label: "Get to him first",
      check: { attr: "cunning", dc: 14, perkBonus: [{ perk: "sly", n: 4 }, { perk: "connected", n: 3 }] },
      pass: { text: "Everybody is in something. It takes a fortnight to find out what he is in, and after that the two of you are in the same thing.", eff: { secrets: 1, coin: 60, flags: ["a-partner"], notoriety: 3 } },
      fail: { text: "He is in nothing at all, which is rare and inconvenient, and he now knows you were looking.", eff: { standing: -8 }, goto: "arrest" } },
    { label: "Take what is left and be gone",
      check: { attr: "swiftness", dc: 12, perkBonus: [{ perk: "quick", n: 3 }] },
      pass: { text: "One night, one cart, and a road out before the quarter-day count. You are three hundred stags up and can never come back here.", eff: { coin: 300, move: "random", flags: ["wanted", "-skimming"], notoriety: 8 } },
      fail: { text: "The gate is watched on quarter-day. Everybody knows that except, apparently, you.", eff: {}, goto: "arrest" } },
  ] },

{ id: "e-company-calls", w: 5, when: { wild: false, amenities: ["crowd"], anyFlag: ["knows-a-company", "noticed-by-a-captain", "band-leader"] },
  dm: "A letter finds you, which means somebody went to trouble. A company is short of a serjeant and the man who wrote it remembers you doing something, once, correctly.",
  opts: [
    { label: "Go",
      check: { attr: "might", dc: 12, perkBonus: [{ perk: "strong", n: 3 }, { perk: "honest", n: 3 }], itemBonus: [{ item: "armour", n: 3 }, { item: "sword", n: 3 }] },
      pass: { text: "Twenty men, a wage that arrives, and the entire difference between being a soldier and being somebody soldiers look at when a thing goes wrong.", eff: { followers: 20, coin: 180, standing: 8, renown: 5, flags: ["sellsword", "band-leader", "at-war"], work: "sellsword" } },
      fail: { text: "The post was filled a month before the letter reached you, which is what happens to letters.", eff: { coin: 30, rest: -20 } } },
    { label: "Go, and take the men rather than the post",
      check: { attr: "charm", dc: 16, perkBonus: [{ perk: "silver", n: 4 }], flagBonus: [{ flag: "band-leader", n: 4 }, { flag: "tourney-winner", n: 3 }] },
      pass: { text: "You talk to them for a fortnight before you talk to him. When you leave, eleven of them leave with you, and that is how free companies are actually founded.", eff: { followers: 11, renown: 8, notoriety: 6, flags: ["band-leader", "made-an-enemy", "own-company"] } },
      fail: { text: "Somebody repeats what you have been saying to the man who wrote to you.", eff: { health: -18, standing: -6 } } },
    { label: "Burn the letter", res: { text: "You have done that and are doing something else. It is a decision, and it costs something to make it.", eff: { attr: { grit: 1 }, flags: ["resolved"] } } },
  ] },

{ id: "e-captain-friend", w: 5, when: { wild: false, amenities: ["crowd"], anyFlag: ["knows-a-captain", "knows-the-ships", "ran-cargo", "ship-berth"] },
  dm: "A captain you have dealt with before is in port and wants an hour of your time, which with a captain always means he wants something carried, bought or vouched for.",
  opts: [
    { label: "Take a share in the voyage", cost: { coin: 200 }, req: { minCoin: 200 },
      check: { attr: "wits", dc: 12, perkBonus: [{ perk: "clever", n: 3 }, { perk: "sea-legs", n: 2 }] },
      pass: { text: "A quarter share, and the voyage comes in. This is how every merchant house in the free cities began and most of them will not admit it.", eff: { coin: 620, standing: 5, flags: ["a-share-in-a-hull"], renown: 1 } },
      fail: { text: "The voyage does not come in. Nothing dramatic happens; the price simply moves and the cargo is worth less than the harbour dues.", eff: { coin: -200 } } },
    { label: "Buy the hull off him", cost: { coin: 3800 }, req: { minCoin: 3800, notItems: ["ship"] },
      res: { text: "He is old and wants a house on a hill, and you now own a ship, which in this half of the world is very nearly a title.", eff: { items: ["ship"], standing: 14, renown: 5 } } },
    { label: "Ask him where you could go that nobody would follow",
      res: { text: "He names three places and tells you what each of them costs and what each of them is like, and you keep all three.", eff: { secrets: 1, items: ["map"], flags: ["knows-a-way-out"] } } },
  ] },

{ id: "e-smith-friend", w: 4, when: { wild: false, amenities: ["crowd"], anyFlag: ["knows-a-smith", "knows-steel"] },
  dm: "The boy from the forge is not a boy any more and has his own fire, two streets from the one he worked at, and has been waiting for you to come past.",
  opts: [
    { label: "Have him make you something", cost: { coin: 120 }, req: { minCoin: 120, notItems: ["good-sword", "valyrian-steel"] },
      res: { text: "Four months, and it is better than the work on any wall in this city, and he charges you what the steel cost because you dealt with him when he was nobody.", eff: { items: ["good-sword"], standing: 3, renown: 1, rel: { smith: 3 } } } },
    { label: "Put money into the forge", cost: { coin: 250 }, req: { minCoin: 250 },
      check: { attr: "wits", dc: 11 },
      pass: { text: "Two more fires and three more hands inside a year, and a share of every blade that goes out of it for as long as it stands.", eff: { coin: 60, standing: 6, flags: ["a-share-in-a-forge"], renown: 2 } },
      fail: { text: "He is a magnificent smith and a catastrophic man of business, and both facts are now yours.", eff: { coin: -250, rel: { smith: 2 } } } },
    { label: "Have your gear seen to",
      res: { text: "Everything you own goes across his bench in an afternoon and comes back better than it has been since it was made.", eff: { items: ["whetstone"], health: 4, attr: { might: 1 } } } },
  ] },

/* ===================================================== WHAT YOU REFUSED = */

{ id: "e-refused-remembered", w: 5, when: { wild: false, amenities: ["crowd"], anyFlag: ["refused-the-lord", "refused-a-marriage", "refused-the-oath"] },
  dm: "The thing you refused has been given to somebody else, and the somebody else is here, and is doing extremely well out of it, and would like to buy you a cup.",
  opts: [
    { label: "Drink with him and mean it",
      check: { attr: "charm", dc: 11, perkBonus: [{ perk: "honest", n: 3 }] },
      pass: { text: "He is not a bad man and it was never a contest, and by the end of the evening you have a friend in a place you had written off entirely.", eff: { standing: 5, rel: { rival: 3 }, followers: 1, flags: ["allied"] } },
      fail: { text: "You are civil for an hour and then say the thing you have been not saying, and the evening ends.", eff: { standing: -4, flags: ["made-an-enemy"] } } },
    { label: "Find out what it actually cost him",
      check: { attr: "wits", dc: 12, perkBonus: [{ perk: "wary", n: 3 }] },
      pass: { text: "Rather more than it looks. There is a condition on it that was never mentioned to you, and you were refusing a leash without knowing there was one.", eff: { secrets: 1, attr: { wits: 1 }, health: 4 } },
      fail: { text: "It cost him nothing at all and he has never been happier.", eff: { health: -4 } } },
    { label: "Take the cup and say nothing", res: { text: "You drink it. It is very good wine and you cannot taste any of it.", eff: { attr: { grit: 1 } } } },
  ] },

{ id: "e-lords-man-again", w: 5, when: { wild: false, anyFlag: ["lords-man", "known-at-court", "spoke-for-the-small"] },
  dm: "{lord} sends for you, and the man who comes to fetch you does not know what it is about and is uneasy that he does not.",
  opts: [
    { label: "Go",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 3 }], flagBonus: [{ flag: "lords-man", n: 4 }] },
      pass: { text: "He wants advice, which is what men in halls want when they have run out of people who will disagree with them. You disagree with him and are asked back.", eff: { standing: 10, renown: 3, coin: 90, flags: ["lords-counsel"], attr: { charm: 1 } } },
      fail: { text: "He wants a name and you do not have one to give him, and he has to spend a quarter of an hour pretending that was not why he sent.", eff: { standing: -4 } } },
    { label: "Go, and ask for something while you are there",
      check: { attr: "charm", dc: 15, perkBonus: [{ perk: "silver", n: 4 }], flagBonus: [{ flag: "spoke-for-the-small", n: 3 }, { flag: "knight", n: 3 }] },
      pass: { text: "A holding. Small, badly drained, three villages and a mill that does not work — and land, in your name, on paper, which is the only door in this world that does not shut behind you.", eff: { holding: "a small holding of your own", flags: ["landed", "lord"], standing: 15, renown: 6, coin: -60 } },
      fail: { text: "You ask, and he is amused, and you spend the rest of the evening being the thing everyone is amused about.", eff: { standing: -8 } } },
    { label: "Do not go", res: { text: "You do not go. Nothing happens, immediately, which is the way these things always start.", eff: { standing: -6, flags: ["refused-the-lord"] } } },
  ] },

/* ================================================= WHAT WAS DONE TO YOU = */

{ id: "e-someone-tried-again", w: 5, when: { wild: false, amenities: ["crowd"], flags: ["someone-tried"] },
  dm: "It happens again — a cup, a stair, a horse that was fine yesterday. Once is a thing that happens to people. Twice is a person.",
  opts: [
    { label: "Find them",
      check: { attr: "cunning", dc: 15, perkBonus: [{ perk: "wary", n: 4 }, { perk: "sly", n: 3 }], flagBonus: [{ flag: "knows-my-enemy", n: 5 }] },
      pass: { text: "Working backwards from a saddle strap, through a stable boy, to a steward, to a name. You do not do anything about the name yet. You have it, which is the whole of the work.", eff: { secrets: 2, flags: ["knows-my-enemy", "-someone-tried"], attr: { cunning: 1 } } },
      fail: { text: "Everybody you ask is somebody's, and the asking gets back before the answering does.", eff: { health: -12, flags: ["hunted"] } } },
    { label: "Make yourself hard to reach",
      res: { text: "One door, one stair, one man on it who eats what you eat first. It costs, and you sleep.", eff: { coin: -120, followers: 1, rest: 40, health: 6, flags: ["guarded"] } } },
    { label: "Let them keep trying and watch how",
      check: { attr: "grit", dc: 15, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "iron-stomach", n: 3 }] },
      pass: { text: "Three more attempts and each one tells you more about the man behind it than a year of asking would. It is a bad way to learn and it is very fast.", eff: { secrets: 3, flags: ["knows-my-enemy", "-someone-tried"], health: -18, attr: { grit: 1 } } },
      fail: { text: "The fourth one nearly works.", eff: { health: -40, flags: ["sick"] } } },
  ] },

{ id: "e-sick", w: 6, when: { wild: false, amenities: ["crowd"], flags: ["sick"] },
  dm: "Whatever it was has not gone. It comes back in the cold and it takes a week out of every season, and you have begun arranging your life around it without admitting that is what you are doing.",
  opts: [
    { label: "Pay a maester properly", cost: { coin: 90 }, req: { minCoin: 90, amenities: ["maester"] },
      reqWhy: "There is nobody here with a chain around his neck.",
      check: { attr: "grit", dc: 11 },
      pass: { text: "Six weeks of something foul, and rest, and being told what not to do. At the end of it the thing is gone and you feel robbed of the six weeks.", eff: { flags: ["-sick"], health: 30, rest: 30 } },
      fail: { text: "He does what can be done and tells you honestly that what can be done is not very much.", eff: { health: 10 } } },
    { label: "Live with it",
      res: { text: "You work around it. It costs you a week a season for the rest of your life and you stop noticing you are paying it.", eff: { attr: { grit: 1 }, health: -6 } } },
    { label: "Try what the hedge-witch says", req: { anyPerk: ["healer-hands", "hardy"] },
      check: { attr: "wits", dc: 13, perkBonus: [{ perk: "healer-hands", n: 5 }] },
      pass: { text: "Boiled bark, and a thing about steam, and it works, and no maester in the Citadel would admit that it could.", eff: { flags: ["-sick"], health: 22, attr: { wits: 1 } } },
      fail: { text: "It is not medicine and you are considerably worse for a fortnight.", eff: { health: -18 } } },
  ] },

{ id: "e-pressed-return", w: 4, when: { wild: false, amenities: ["crowd"], anyFlag: ["pressed", "took-the-coin-and-ran", "deserter"] },
  dm: "Somebody in this town remembers a name on a list, and yours was on it, and the man who wrote it is still alive and still in the business.",
  opts: [
    { label: "Pay it off", cost: { coin: 150 }, req: { minCoin: 150 },
      res: { text: "It costs more than the coin you took and the arithmetic of that is not lost on either of you. He crosses the line out with a stub of charcoal.", eff: { flags: ["-pressed", "-took-the-coin-and-ran", "-deserter"], standing: 2 } } },
    { label: "Give him a season and have it done with",
      res: { text: "One season of somebody else's war, honestly served, and at the end of it the list has no name on it and you have a scar and a wage.", eff: { flags: ["-pressed", "-deserter", "soldier"], coin: 50, health: -14, attr: { grit: 1, might: 1 } } } },
    { label: "Be somewhere else entirely",
      check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "quiet", n: 3 }] },
      pass: { text: "A different town, a different name, and a resolution to stay out of ports for a year that you will keep for four months.", eff: { move: "random", notoriety: 2 } },
      fail: { text: "They put a man on the gate, because they always put a man on the gate.", eff: { health: -12 }, goto: "arrest" } },
  ] },

/* ===================================================== SMALLER ECHOES === */

{ id: "e-desert-enemy", w: 4, when: { wild: false, flags: ["desert-enemy"] },
  dm: "There is a rider on the ridge and there was one yesterday. In this country a man who takes water is followed until the following is finished, and there is no hurry about it whatsoever.",
  opts: [
    { label: "Ride out and settle it", req: { armed: true },
      check: { attr: "might", dc: 15, perkBonus: [{ perk: "duellist", n: 3 }, { perk: "cold-blood", n: 3 }], itemBonus: [{ item: "bow", n: 3 }, { item: "horse", n: 3 }] },
      pass: { text: "It takes a long afternoon and there is nobody watching, which is the strangest part. Afterwards there is nobody on the ridge for the rest of the year.", eff: { kills: 1, flags: ["-desert-enemy", "killer"], health: -18, renown: 2 } },
      fail: { text: "They have had three days to choose the ground and they have chosen well.", eff: { health: -32, water: -40 } } },
    { label: "Go back and pay for the water", cost: { coin: 60 }, req: { minCoin: 60 },
      res: { text: "It is triple what it was worth and it is a great deal cheaper than the alternative, and the man who takes it says nothing at all about it.", eff: { flags: ["-desert-enemy", "desert-guest"], standing: 1 } } },
    { label: "Outride them",
      check: { attr: "swiftness", dc: 14, perkBonus: [{ perk: "rider", n: 4 }], itemBonus: [{ item: "courser", n: 4 }, { item: "horse", n: 3 }] },
      pass: { text: "Two days at a pace neither horse should manage, and out of their country and into somebody else's.", eff: { flags: ["-desert-enemy"], rest: -30, water: -35, attr: { swiftness: 1 } } },
      fail: { text: "You are on their ground and they know where the water is and you do not.", eff: { health: -22, water: -50 } } },
  ] },

{ id: "e-khalasar-remembered", w: 4, when: { wild: false, anyFlag: ["rode-with-a-khalasar", "faced-a-khalasar"] },
  dm: "A rider comes into the town with three others and asks, in bad Common, for a man by a description that is unmistakably you. He is not angry. Dothraki very rarely bother to be.",
  opts: [
    { label: "Go out and meet him",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "honest", n: 3 }], flagBonus: [{ flag: "rode-with-a-khalasar", n: 5 }] },
      pass: { text: "His khal remembers a gift and has sent one back, which among the horselords is not politeness but arithmetic, and it is a very good horse.", eff: { items: ["courser"], renown: 3, standing: 3, flags: ["khal-friend"] } },
      fail: { text: "It is about a different man and a different debt, and it takes an hour and a great deal of gesturing to establish that.", eff: { rest: -10 } } },
    { label: "Stay indoors until they go",
      res: { text: "They wait two days in the square without dismounting and then they go, and the whole town is quietly furious with you for a month.", eff: { standing: -5 } } },
  ] },

{ id: "e-mummers-again", w: 4, when: { wild: false, amenities: ["crowd"], anyFlag: ["with-the-mummers", "knows-mummers"] },
  dm: "The cart is in this town and the play has changed, and there is a part in it that is unmistakably you, and it is not a flattering part.",
  opts: [
    { label: "Buy the company a night and get the part rewritten", cost: { coin: 30 }, req: { minCoin: 30 },
      check: { attr: "charm", dc: 11, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "By the following week you are the hero of it and considerably taller. Mummers go everywhere, and a story going everywhere is worth more than the coin.", eff: { renown: 6, coin: -30, flags: ["a-song-of-you"] } },
      fail: { text: "They take the coin and the part gets funnier.", eff: { coin: -30, renown: 2, standing: -3 } } },
    { label: "Watch it from the back",
      res: { text: "The crowd enjoys it enormously. Somewhere in the middle of it you find you are enjoying it too, which you had not planned on.", eff: { renown: 3, health: 4, rest: 15 } } },
    { label: "Stop the play",
      check: { attr: "might", dc: 12 },
      pass: { text: "You take the boy playing you off the cart by the collar and the crowd goes silent and the play does not resume. It also does not stop being told, and now it is told with this in it.", eff: { notoriety: 8, renown: 4, standing: -5 } },
      fail: { text: "A hundred people watch you fail to stop a play, which is now unquestionably the best part of the evening.", eff: { standing: -8, health: -6 } } },
  ] },

{ id: "e-coin-hidden-pays", w: 4, when: { wild: false, flags: ["coin-hidden"], anyFlag: ["robbed-on-the-road", "outlaw", "wanted"] },
  dm: "They took the purse. They took the purse and they patted you down for a second one and they did not go through the seams of your coat, because nobody ever does.",
  opts: [
    { label: "Get somewhere safe and unpick it",
      res: { text: "Everything you actually had is still there. The purse was the decoy and it was worth every hour you spent sewing.", eff: { coin: 180, attr: { cunning: 1 }, flags: ["-coin-hidden"] } } },
    { label: "Leave it where it is and travel poor",
      res: { text: "A man with nothing on him is not worth stopping, and you are now a man with nothing on him for as long as you can bear it.", eff: { standing: -2, attr: { cunning: 1 } } } },
  ] },

{ id: "e-sanctuary-ends", w: 4, when: { wild: false, flags: ["sanctuary"] },
  dm: "The septon who took you in is old and the man who will replace him is not the same kind of man, and has begun asking, in the mildest possible terms, how long you intend to stay.",
  opts: [
    { label: "Take vows and stay", req: { notFlags: ["sworn", "married"] },
      res: { text: "It closes behind you. You will never want for a bed or a meal again, and a great many other things are now finished.", eff: { flags: ["septon", "sworn", "sworn-celibate", "faithful", "-sanctuary", "-hunted"], work: "novice", standing: 8, attr: { wits: 1 } } } },
    { label: "Go before you are asked properly",
      res: { text: "You leave a gift you cannot afford on the altar and are on the road before light. Nobody comes after you and nobody has forgotten you either.", eff: { flags: ["-sanctuary"], coin: -50, move: "random", standing: 1 } } },
    { label: "Make yourself indispensable",
      check: { attr: "charm", dc: 13, perkBonus: [{ perk: "honest", n: 3 }, { perk: "silver", n: 3 }] },
      pass: { text: "The roof, the accounts, and the school for eleven children nobody had time for. The new man cannot get rid of you now without explaining who will do all of it.", eff: { flags: ["temple-friend"], standing: 6, renown: 2, food: 70, rest: 50 } },
      fail: { text: "He is perfectly polite and there is a bag by the door in the morning.", eff: { flags: ["-sanctuary", "hunted"], move: "random" } } },
  ] },

{ id: "e-hostage-grown", w: 4, when: { wild: false, anyFlag: ["befriended-a-hostage", "freed-a-hostage"] },
  dm: "The boy is not a boy. He has his father's seat now, and men, and a memory, and he has sent to say that he would like very much to see you.",
  opts: [
    { label: "Go to him",
      res: { text: "He remembers every single thing, in order, including the two bouts you lost on purpose, and he is not a fool about that either. What he offers is not charity; it is a place.", eff: { standing: 16, coin: 400, followers: 6, renown: 5, flags: ["allied", "known-at-court"] } } },
    { label: "Ask him for men instead of coin",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "Fifteen of them, sworn to you rather than lent, which took him some effort with his own bannermen and which he did without mentioning.", eff: { followers: 15, standing: 10, renown: 4, flags: ["allied"] } },
      fail: { text: "He gives you coin and an apology, and both of you understand exactly which of you is which now.", eff: { coin: 300, standing: 4 } } },
    { label: "Do not go", res: { text: "Some debts are better left standing. He does not send again, and knowing he would is worth something.", eff: { flags: ["allied"], attr: { wits: 1 } } } },
  ] },

{ id: "e-hedge-knight-echo", w: 4, when: { wild: false, anyFlag: ["hedge-knighted", "refused-the-oath", "on-the-rolls"] },
  dm: "A herald at a tourney gate reads your name off a list and then reads it again, and asks — not rudely, but in front of people — who exactly made you.",
  opts: [
    { label: "Name him",
      check: { attr: "grit", dc: 11, perkBonus: [{ perk: "honest", n: 4 }] },
      pass: { text: "You give the name of a man with no lands and no coin and a shield with the paint coming off, and you give it clearly, and a knight standing nearby says he knew him.", eff: { renown: 4, standing: 3, followers: 1, flags: ["owned-it"] } },
      fail: { text: "The list is checked and the name is not on it, because such names never are.", eff: { standing: -6 } } },
    { label: "Buy your way onto the roll", cost: { coin: 150 }, req: { minCoin: 150 },
      res: { text: "A fee, a witness and a stroke of a pen, and the question can never be asked of you again. It is not the same as being made and it is exactly as permanent.", eff: { standing: 8, flags: ["on-the-rolls"] } } },
    { label: "Fight the man who asked", req: { armed: true },
      check: { attr: "might", dc: 14, perkBonus: [{ perk: "duellist", n: 4 }] },
      pass: { text: "Answering it that way is itself an answer, and the crowd takes it as one, and nobody at this tourney asks you anything else all week.", eff: { renown: 6, notoriety: 5, health: -12, standing: -2 } },
      fail: { text: "The herald does not fight. A knight standing behind him does.", eff: { health: -26, standing: -8 } } },
  ] },

{ id: "e-good-name", w: 4, when: { wild: false, amenities: ["crowd"], anyFlag: ["made-it-right", "spoke-for-the-small", "paid-for-another", "kindness-remembered", "weathered-it"], minRenown: 8 },
  dm: "You come into a town you have never been to and somebody uses your name before you have given it, and they are pleased about it, which has not happened before.",
  opts: [
    { label: "Let it work",
      res: { text: "A room, a meal, and four people who want to be able to say they know you. It is the first time in your life that your name has done something for you rather than to you.", eff: { standing: 8, renown: 3, food: 70, rest: 50, coin: 40 } } },
    { label: "Find out what version of it they have",
      check: { attr: "wits", dc: 11 },
      pass: { text: "It is about half true and the half that is wrong is better than the half that is right, and there is no way to correct it that does not make it worse.", eff: { renown: 4, secrets: 1, attr: { wits: 1 } } },
      fail: { text: "It is about somebody else with the same name.", eff: { standing: -1 } } },
    { label: "Use it for something",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "Credit, a horse, and an introduction to the man who matters here, all on the strength of a story about something you actually did.", eff: { coin: 160, items: ["horse"], standing: 6, flags: ["connected-here"] } },
      fail: { text: "You reach for rather more than the story will carry and it comes apart in your hands.", eff: { standing: -6, renown: -2 } } },
  ] },

{ id: "e-turned-once", w: 5, when: { wild: false, amenities: ["crowd"], anyFlag: ["turncloak", "informer", "walked-past-a-friend"] },
  dm: "It gets about. Nobody says it to you and everybody has heard it, and the particular thing about this reputation is that the people who would use you for it trust you least of all.",
  opts: [
    { label: "Do one thing, publicly, that costs you",
      check: { attr: "grit", dc: 14, perkBonus: [{ perk: "honest", n: 4 }] },
      pass: { text: "You stand by somebody when standing by them is expensive and there is nothing in it for you and everybody can see both facts. It does not undo it. It puts something else beside it.", eff: { standing: 8, renown: 4, coin: -100, flags: ["-turncloak", "-informer", "made-it-right"] } },
      fail: { text: "It is read as exactly what it is, which is a man buying his reputation back, and that is worse than the reputation.", eff: { standing: -6, coin: -100 } } },
    { label: "Lean into it",
      check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "sly", n: 4 }] },
      pass: { text: "There is a living in being the man who will. It is well paid, it is steady, and you will never again be in a room where anybody relaxes.", eff: { coin: 260, flags: ["sells-secrets", "informer"], standing: -4, secrets: 2 } },
      fail: { text: "You misjudge which side is buying this week.", eff: { health: -20, flags: ["hunted"] } } },
    { label: "Go a very long way away",
      res: { text: "Across water, where nobody has the story. It works, and it costs you every single thing you had built here.", eff: { move: { realm: "free-cities" }, standing: -8, coin: -60, flags: ["-turncloak", "-informer"], renown: -4 } } },
  ] },

{ id: "e-a-cause", w: 4, when: { wild: false, amenities: ["crowd"], anyFlag: ["a-cause", "band-leader", "own-company"], minFollowers: 6 },
  dm: "There are enough of them now that they have started looking at you before they decide things, and one of them has asked, out loud, what it is you actually intend.",
  opts: [
    { label: "Tell them",
      check: { attr: "charm", dc: 14, perkBonus: [{ perk: "silver", n: 4 }, { perk: "honest", n: 4 }] },
      pass: { text: "You say it plainly, and it is a smaller thing than they expected and a great deal more possible, and that is why it works.", eff: { followers: 8, renown: 8, standing: 4, flags: ["a-cause", "resolved"], attr: { charm: 1 } } },
      fail: { text: "You do not have an answer and it takes about four seconds for all of them to know it.", eff: { followers: -3, standing: -5 } } },
    { label: "Give them a thing to do instead of an answer",
      check: { attr: "wits", dc: 12, perkBonus: [{ perk: "clever", n: 3 }] },
      pass: { text: "A holdfast, a road, a man who owes. Work answers the question for a season and a season is a long time.", eff: { coin: 220, followers: 2, notoriety: 5, health: -8 } },
      fail: { text: "The thing you give them to do goes badly and now they have both an unanswered question and a grievance.", eff: { followers: -4, health: -14 } } },
    { label: "Tell them to go home",
      res: { text: "Most of them do not. The ones who do are the ones who were going anyway, and what is left is smaller and considerably harder.", eff: { followers: -5, renown: 2, attr: { grit: 1 }, flags: ["resolved"] } } },
  ] },

]);
