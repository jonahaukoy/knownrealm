/* ============================================================================
   THE IRON LADDER — THINGS YOU CANNOT WALK AWAY FROM.

   The complaint this file answers, in the owner's words: "If a man charges at
   me or tries to rob me I cannot suddenly start travelling to a new town, or
   just go to the store then. If I were to start screaming, he might stop and
   go away, or just kill me to make me shut up, and I would have a new roll to
   do something in the last moment."

   TWO MECHANISMS, both small, and everything here is built out of them.

   1. `demand: true` — the screen SHUTS everything else while this scene is on
      the table. No travelling, no shopping, no walking into the smithy. The
      man in front of you is not going to wait, and the game stops pretending
      he might. play.js reads the flag; the engine only carries it.

   2. `chain: true` + `goto` — a confrontation is not one roll. Every branch
      hands off to another scene, so screaming at a man who has a knife is a
      real choice with three real answers: he goes, he stops caring, or the
      street turns round — and each of those is another card with another roll
      on it. THE LAST ROLL IS ALWAYS THE MOST DANGEROUS ONE, which is what
      makes the first one worth thinking about.

   Rules for adding to this file:
     - A chain event is never drawn by the deck (`chain: true`). It is only
       ever reached by `goto` from somewhere else. The checker asserts that
       every chain here is reachable.
     - Every stage must have an out that is not fighting. Fleeing, talking,
       submitting and paying are all answers; some of them are bad answers.
     - The final stage of a lethal chain must be able to KILL. If a chain
       cannot end a life, the player learns to walk into them.
   ========================================================================== */

window.IL_EVENTS = (window.IL_EVENTS || []).concat([

/* ==========================================================================
   BEING ROBBED IN THE STREET — the opening card, and four ways out of it.
   ========================================================================== */

{ id: "x-mugging", w: 6, demand: true,
  when: { wild: false, amenities: ["crowd"], anyPlaceTag: ["poor", "crime", "city", "port"] },
  dm: "A man steps out of a doorway at {spot} with a knife held low and close to his leg, the way men hold one when they have done this before. He says a number. He is close enough that you can smell what he had for dinner.",
  opts: [
    { label: "Give him the purse",
      res: { text: "You hold it out. He takes it left-handed, keeps the knife where it is, and walks backwards for four paces before he turns. The whole thing has taken eleven seconds.",
        eff: { coin: -9999, flags: ["robbed-in-the-street"], spared: 1 } } },
    { label: "Scream", hint: "He will do something about that.",
      res: { text: "It comes out of you far louder than you expected and half of {spot} turns round.", goto: "x-mugging-scream" } },
    { label: "Go for him", req: { armed: false },
      check: { attr: "might", dc: 14, perkBonus: [{ perk: "strong", n: 3 }, { perk: "cold-blood", n: 4 }, { perk: "quick", n: 2 }] },
      pass: { text: "Inside the arc of the knife, both hands on his wrist, and down. He is not a fighter, he is a man with a knife, and today those turn out to be different things.",
        eff: { coin: 30, items: ["knife"], health: -7, renown: 1, notoriety: 2, attr: { might: 1 } } },
      fail: { text: "You get a hand to it and it opens your forearm to the bone.", eff: { health: -22 }, goto: "x-mugging-bleeding" } },
    { label: "Draw on him", req: { armed: true },
      check: { attr: "might", dc: 10, perkBonus: [{ perk: "duellist", n: 3 }, { perk: "cold-blood", n: 3 }], itemBonus: [{ item: "sword", n: 2 }, { item: "good-sword", n: 3 }] },
      pass: { text: "Steel changes the arithmetic of a doorway instantly. He looks at it, and at you, and goes — not fast, because going fast would be an admission, but he goes.",
        eff: { renown: 1, standing: 1, spared: 1 } },
      fail: { text: "You are slower getting it out than he is getting in.", eff: { health: -18 }, goto: "x-mugging-bleeding" } },
    { label: "Run",
      check: { attr: "swiftness", dc: 12, perkBonus: [{ perk: "quick", n: 4 }] },
      pass: { text: "Three turnings and a yard and a wall, and by the time you stop your chest hurts and you still have everything you started with.", eff: { rest: -15 } },
      fail: { text: "He was expecting it and he is between you and the open end of the street.", eff: {}, goto: "x-mugging-cornered" } },
  ] },

{ id: "x-mugging-scream", chain: true, demand: true,
  dm: "Screaming was a decision, and it has been heard. He has a quarter of a second to decide what it means to him, and in that quarter of a second his face goes through three separate things.",
  opts: [
    { label: "Keep screaming",
      check: { attr: "grit", dc: 12, perkBonus: [{ perk: "cold-blood", n: 3 }] },
      pass: { text: "Four men come out of a pot-shop at a run, because a scream in this quarter is either sport or somebody they know. He is gone over a wall before they reach you, and you are shaking too hard to thank anybody.",
        eff: { rest: -20, health: -2, spared: 1, standing: 1, flags: ["the-street-came"] } },
      fail: { text: "Nobody comes. In this quarter people close shutters, and he has heard that silence before and knows exactly what it means.", eff: { health: -4 }, goto: "x-mugging-nobody-came" } },
    { label: "Scream and go at him while he is deciding",
      check: { attr: "swiftness", dc: 13, perkBonus: [{ perk: "quick", n: 4 }, { perk: "wolf-blood", n: 3 }] },
      pass: { text: "The noise is the feint. You are inside his arm on the second syllable and he goes down hard on the cobbles with your knee where it will do the most good.",
        eff: { coin: 25, items: ["knife"], health: -6, renown: 2, attr: { swiftness: 1 } } },
      fail: { text: "He has decided. He decides faster than you move.", eff: { health: -20 }, goto: "x-mugging-bleeding" } },
    { label: "Stop, and give him everything",
      res: { text: "You stop mid-breath and hold out the purse with both hands. He takes it and says something you do not hear, and you find you are still holding your hands out a full minute after he has gone.",
        eff: { coin: -9999, health: -2, standing: -1, flags: ["robbed-in-the-street"] } } },
  ] },

{ id: "x-mugging-nobody-came", chain: true, demand: true,
  dm: "Nobody came. He knows nobody came, and you know it, and the two of you are standing in a street where every shutter is now closed. He is not in a hurry any more, which is much worse than when he was.",
  opts: [
    { label: "Give him everything, slowly, and do not look at his face",
      res: { text: "He takes the purse and then your boots and then, after a pause you will think about for years, decides that is enough.",
        eff: { coin: -9999, standing: -2, health: -4, flags: ["robbed-in-the-street", "saw-a-bad-thing"] } } },
    { label: "Fight him anyway",
      check: { attr: "might", dc: 16, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "strong", n: 3 }], itemBonus: [{ item: "knife", n: 2 }, { item: "sword", n: 4 }, { item: "armour", n: 3 }] },
      pass: { text: "It is ugly and it is close and at the end of it he is on the ground and you are sitting against a wall opposite with your hands shaking and a great deal of somebody's blood on you.",
        eff: { kills: 1, coin: 30, health: -24, notoriety: 6, flags: ["killer"], attr: { grit: 1 } } },
      fail: { text: "A man who does this every week against a man who has never done it.", eff: { die: "knifed in an alley for a purse" } } },
    { label: "Run for the open end of the street",
      check: { attr: "swiftness", dc: 14, perkBonus: [{ perk: "quick", n: 4 }] },
      pass: { text: "You are eleven yards down the street before he moves and you do not stop until there are people again.", eff: { health: -6, rest: -20 } },
      fail: { text: "He gets two handfuls of your coat.", eff: { health: -26, coin: -9999 } } },
  ] },

{ id: "x-mugging-cornered", chain: true, demand: true,
  dm: "The street ends in a wall. You knew that and ran anyway, which is what running does to a person. He comes down it without hurrying, because there is no longer any reason to hurry.",
  opts: [
    { label: "Talk",
      check: { attr: "charm", dc: 14, perkBonus: [{ perk: "silver", n: 4 }, { perk: "honest", n: 3 }] },
      pass: { text: "You tell him what you have and offer all of it and ask his name, which is either the stupidest or the cleverest thing you have ever done. He tells you. Then he takes the purse and leaves the rest.",
        eff: { coin: -9999, spared: 1, secrets: 1, flags: ["knows-thieves"], attr: { charm: 1 } } },
      fail: { text: "He is not here to be talked to.", eff: {}, goto: "x-mugging-bleeding" } },
    { label: "Go through him",
      check: { attr: "might", dc: 15, perkBonus: [{ perk: "big", n: 4 }, { perk: "strong", n: 3 }], itemBonus: [{ item: "sword", n: 4 }, { item: "armour", n: 3 }] },
      pass: { text: "You put a shoulder into him at the run and both of you go down and only one of you gets up, and you take the knife with you.",
        eff: { items: ["knife"], health: -16, coin: 20, notoriety: 3 } },
      fail: { text: "He steps aside. It is a small movement and it decides everything.", eff: { health: -25 }, goto: "x-mugging-bleeding" } },
    { label: "Climb", req: { anyPerk: ["quick", "quiet"] },
      check: { attr: "swiftness", dc: 13, perkBonus: [{ perk: "quick", n: 5 }], itemBonus: [{ item: "rope", n: 3 }] },
      pass: { text: "Water butt, window ledge, roof, and you lie flat on somebody's tiles listening to him swear in the dark below you.", eff: { rest: -20, health: -4, attr: { swiftness: 1 } } },
      fail: { text: "You get one hand on the ledge.", eff: { health: -20 }, goto: "x-mugging-bleeding" } },
  ] },

{ id: "x-mugging-bleeding", chain: true, demand: true,
  dm: "You are on the ground and there is a great deal more blood than a person expects the first time. He is going through your coat and has stopped paying attention to your hands, which is the only thing you have left.",
  opts: [
    { label: "Lie still and let him finish",
      res: { text: "He takes everything, including the boots. Somebody finds you before the cold does, which is nearly the same thing as luck.",
        eff: { coin: -9999, health: -10, items: ["-cloak", "-cloak-warm"], flags: ["robbed-in-the-street", "saw-a-bad-thing"] } } },
    { label: "The last thing you have is one movement", hint: "There is no third try.",
      check: { attr: "cunning", dc: 15, perkBonus: [{ perk: "cold-blood", n: 5 }, { perk: "sly", n: 3 }], itemBonus: [{ item: "knife", n: 3 }] },
      pass: { text: "He is close and he is not looking and you have one hand free. Afterwards you sit against the wall with him beside you for some time before you can stand.",
        eff: { kills: 1, coin: 20, health: -14, notoriety: 5, flags: ["killer", "saw-a-bad-thing"], attr: { grit: 1, cunning: 1 } } },
      fail: { text: "He sees the hand move.", eff: { die: "bled out in a street, over a purse" } } },
    { label: "Beg",
      check: { attr: "charm", dc: 13, perkBonus: [{ perk: "honest", n: 3 }, { perk: "comely", n: 3 }] },
      pass: { text: "Something in what you say lands. He stops, and swears, and does something with your own belt above the cut before he goes — which is the strangest thing that has ever happened to you.",
        eff: { coin: -9999, health: -6, spared: 1, flags: ["saw-a-bad-thing", "owed-a-life"] } },
      fail: { text: "He has heard men beg before and it has never yet changed anything.", eff: { health: -22, coin: -9999 } } },
  ] },

/* ==========================================================================
   A MAN CHARGES YOU — no knife, no demand, no explanation.
   ========================================================================== */

{ id: "x-charged", w: 5, demand: true,
  when: { wild: false, amenities: ["crowd"] },
  dm: "A man comes across {spot} at you at a dead run. He has not said anything and there is no knife in his hand and there is no time at all to work out which of those two facts matters more.",
  opts: [
    { label: "Set yourself and meet him",
      check: { attr: "might", dc: 13, perkBonus: [{ perk: "strong", n: 3 }, { perk: "big", n: 4 }] },
      pass: { text: "You get low and he goes over you and lands badly, and it is only when he is on the ground that you see he is about seventeen and crying.", eff: { health: -6 }, goto: "x-charged-down" },
      fail: { text: "He is going faster than you judged and you are both on the cobbles with the wind out of you.", eff: { health: -12 }, goto: "x-charged-down" } },
    { label: "Step aside",
      check: { attr: "swiftness", dc: 11, perkBonus: [{ perk: "quick", n: 4 }, { perk: "wary", n: 3 }] },
      pass: { text: "He goes past you into a barrow and takes the whole thing over with him.", eff: {}, goto: "x-charged-down" },
      fail: { text: "You step the way he was already going.", eff: { health: -14 }, goto: "x-charged-down" } },
    { label: "Draw and put it between you", req: { armed: true },
      res: { text: "He runs onto it, or very nearly. He stops about eight inches short and stands there with his chest going.", goto: "x-charged-blade" } },
    { label: "Shout at him",
      check: { attr: "grit", dc: 12, perkBonus: [{ perk: "cold-blood", n: 3 }] },
      pass: { text: "One word, very loud, and he stops as though he had run into something.", eff: {}, goto: "x-charged-down" },
      fail: { text: "He does not hear you at all.", eff: { health: -16 }, goto: "x-charged-down" } },
  ] },

{ id: "x-charged-down", chain: true, demand: true,
  dm: "He is on the ground in front of you and the whole of {spot} has stopped to watch. He is a boy, and he is frightened rather than dangerous, and thirty yards behind him three men have come round the corner and slowed to a walk.",
  opts: [
    { label: "Stand over him and face the three",
      check: { attr: "grit", dc: 14, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "big", n: 3 }], itemBonus: [{ item: "sword", n: 3 }, { item: "armour", n: 3 }] },
      pass: { text: "You do not say anything. You simply do not move, and after a long moment the three of them decide that today is not worth it and become men walking somewhere else.",
        eff: { renown: 5, standing: 4, followers: 1, spared: 1, flags: ["kindness-remembered", "made-an-enemy"] } },
      fail: { text: "Three is three, and they have done this in front of a crowd before.", eff: { health: -26, notoriety: 3 } } },
    { label: "Get him up and both of you go",
      check: { attr: "swiftness", dc: 12, perkBonus: [{ perk: "quick", n: 3 }] },
      pass: { text: "A hand under his arm and four turnings at a run. He tells you what he did somewhere around the third one and it is not as bad as three men suggests.",
        eff: { followers: 1, spared: 1, rest: -18, flags: ["owed-a-life", "knows-thieves"] } },
      fail: { text: "He cannot run any more and you find that out at the mouth of the alley.", eff: { health: -18 }, goto: "x-charged-caught" } },
    { label: "Hold him for them",
      res: { text: "You put a foot on him and wait. They are grateful in the brief way of men who were going to get there anyway, and one of them gives you a coin. The boy does not say anything at all, and that is the part that stays.",
        eff: { coin: 30, standing: 2, notoriety: 2, flags: ["informer", "saw-a-bad-thing"] } } },
    { label: "Step over him and walk away",
      res: { text: "You go. Behind you the sound changes, and you do not turn round, and you get very good over the next few years at not turning round.",
        eff: { flags: ["walked-past-a-friend"], attr: { cunning: 1 } } } },
  ] },

{ id: "x-charged-blade", chain: true, demand: true,
  dm: "He is eight inches off the point and neither of you has moved. Behind him, three men have come round the corner and stopped, and they are looking at the steel rather than at him.",
  opts: [
    { label: "Lower it",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "honest", n: 4 }] },
      pass: { text: "You put it down slowly and ask what is going on, out loud, so all four of them hear it. It turns out to be a debt and a misunderstanding, and having it said in front of witnesses is what settles it.",
        eff: { standing: 3, renown: 2, spared: 1, secrets: 1 } },
      fail: { text: "The moment you drop the point they all move at once.", eff: { health: -20 }, goto: "x-charged-caught" } },
    { label: "Keep it up and tell the three to go",
      check: { attr: "grit", dc: 15, perkBonus: [{ perk: "cold-blood", n: 4 }], itemBonus: [{ item: "good-sword", n: 3 }, { item: "armour", n: 3 }] },
      pass: { text: "You hold it steady for as long as it takes, which is longer than anybody in the square is comfortable with, and they go.",
        eff: { renown: 6, notoriety: 4, standing: 3, followers: 1, flags: ["made-an-enemy"] } },
      fail: { text: "Holding a point at three men for a long time is exactly as tiring as it looks, and they can all see your arm.", eff: { health: -24, standing: -4 } } },
    { label: "Put it in him and be somewhere else",
      check: { attr: "might", dc: 11, perkBonus: [{ perk: "cold-blood", n: 4 }] },
      pass: { text: "It takes no time at all, which is the thing nobody tells you. You are two streets away before anybody has decided to shout.",
        eff: { kills: 1, notoriety: 16, flags: ["killer", "wanted"], health: -4, standing: -6 } },
      fail: { text: "He is closer than eight inches by the time you commit, and the three of them are running.", eff: { health: -22, notoriety: 10, flags: ["wanted"] }, goto: "arrest" } },
  ] },

{ id: "x-charged-caught", chain: true, demand: true,
  dm: "There are three of them and one of you and a wall behind you, and the boy is not going to be any use to anybody.",
  opts: [
    { label: "Give them what they came for",
      res: { text: "They take the boy and your purse, in that order, and are gone inside a minute. Nothing else happens to you at all, and you spend a long time deciding how you feel about that.",
        eff: { coin: -9999, health: -6, flags: ["saw-a-bad-thing", "walked-past-a-friend"] } } },
    { label: "Fight all three",
      check: { attr: "might", dc: 18, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "strong", n: 4 }, { perk: "duellist", n: 3 }], itemBonus: [{ item: "good-sword", n: 4 }, { item: "sword", n: 3 }, { item: "armour", n: 4 }, { item: "shield", n: 3 }] },
      pass: { text: "It should not have worked. Two of them go down and the third one runs, and afterwards you sit on the cobbles and cannot make your hands do anything at all for some minutes. People will tell this one for years.",
        eff: { kills: 2, renown: 14, notoriety: 8, health: -34, followers: 1, flags: ["killer", "made-an-enemy"], attr: { might: 1, grit: 1 } } },
      fail: { text: "Three men who know each other, against one who is tired.", eff: { die: "beaten to death in an alley over somebody else's quarrel" } } },
    { label: "Shout for the watch", req: { amenities: ["watch"] },
      reqWhy: "There is no watch in this quarter and everybody here knows it.",
      check: { attr: "grit", dc: 13 },
      pass: { text: "Two of them come at a walk, entirely uninterested, and that is enough — the three become men standing in a street and the boy goes over a wall.",
        eff: { spared: 1, standing: 2, health: -8, rel: { guard: 1 } } },
      fail: { text: "Nobody comes. Everybody in this quarter has heard somebody shout for the watch and knows what it is worth.", eff: { health: -28, coin: -9999 } } },
  ] },

/* ==========================================================================
   MARCHING ON THE RED KEEP. Three stages, and the third one kills you.
   You should be able to make a character, steal a sword, and be dead inside
   an hour if that is what you want to do with them.
   ========================================================================== */

{ id: "x-keep-march", chain: true, demand: true,
  dm: "You go up the hill. Not by the winding way the carts use — straight up, past the sept, past the good houses, with the Red Keep getting larger in front of you the whole time. Nobody stops you. Nobody stops anybody on this road; that is not where they stop people.",
  opts: [
    { label: "Straight at the gate",
      res: { text: "The gatehouse is bigger up close than it looks from the bottom of the hill. There are four men in the arch and two more above it, and above them, along the whole length of the wall, there are archers who have been standing there all day looking at exactly this road.",
        goto: "x-keep-gate" } },
    { label: "Go round to the postern and see how it is watched",
      check: { attr: "cunning", dc: 14, perkBonus: [{ perk: "quiet", n: 4 }, { perk: "wary", n: 3 }] },
      pass: { text: "Half a morning of walking about looking like somebody's errand. There is a door on the river side that opens twice a day for the kitchens and is watched by one man who is old.",
        eff: { secrets: 1, flags: ["cased-the-keep"], attr: { cunning: 1 } } },
      fail: { text: "Somebody notices a man walking round the Red Keep looking at doors. They always do, because that is what the men on the wall are for.", eff: { notoriety: 8, flags: ["wanted"] }, goto: "arrest" } },
    { label: "Stand at the foot of the wall and look up at it",
      res: { text: "It is seven drum-towers and eighty feet of red stone and it has never once been taken by anybody standing where you are standing. You go back down the hill. It is not cowardice; it is arithmetic.",
        eff: { attr: { wits: 1 }, flags: ["looked-at-the-keep"] } } },
  ] },

{ id: "x-keep-gate", chain: true, demand: true,
  dm: "Four men in the arch, two above it, and a wall full of archers who have all seen you now. One of the four takes a step forward and asks your business in the flat voice of a man who has asked it nine thousand times.",
  opts: [
    { label: "Give a reason and walk in",
      check: { attr: "charm", dc: 17, perkBonus: [{ perk: "silver", n: 4 }, { perk: "sly", n: 3 }], flagBonus: [{ flag: "highborn", n: 4 }, { flag: "knight", n: 3 }, { flag: "known-at-court", n: 4 }], itemBonus: [{ item: "clothes-court", n: 4 }, { item: "clothes-fine", n: 2 }, { item: "letters", n: 3 }] },
      pass: { text: "A name, a household and an errand, delivered as though being asked at all were mildly irritating. He steps back. You are inside the Red Keep with no more right to be than you had ninety seconds ago.",
        eff: { flags: ["inside-the-keep", "talked-past-a-guard"], secrets: 1, attr: { charm: 1 } } },
      fail: { text: "He asks which household, and then who the steward of it is, and you do not know.", eff: { notoriety: 6 }, goto: "arrest" } },
    /* DC 26. There are archers on that wall who have been standing there all
       day. A man who charges the gate of the Red Keep should die, nearly
       every time, and the roll is written so that only a natural twenty and a
       genuinely extraordinary character get past it. You are allowed to try. */
    { label: "Draw and go at them", hint: "There are archers on the wall.",
      check: { attr: "might", dc: 26, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "duellist", n: 4 }, { perk: "big", n: 3 }], itemBonus: [{ item: "good-sword", n: 4 }, { item: "sword", n: 2 }, { item: "plate", n: 5 }, { item: "armour", n: 3 }, { item: "shield", n: 3 }] },
      pass: { text: "You put two of them down in the arch. Nobody in this city will agree afterwards on how, and every version has your name in it, and you are through and running before the wall can find an angle.",
        eff: { kills: 2, renown: 30, notoriety: 40, health: -35, flags: ["inside-the-keep", "wanted", "hunted", "killer"], attr: { might: 1 } },
        goto: "x-keep-inside" },
      fail: { text: "You get perhaps four paces into the arch. The men on the wall have done nothing all day and have been waiting for somebody to do precisely this, and the first shaft goes through you before you have heard the string.",
        eff: { die: "shot down in the gateway of the Red Keep" } } },
    { label: "Turn round and go back down the hill",
      res: { text: "You turn round. He watches you the whole way to the bottom, and so does the wall, and nobody says anything at all. You have not lost anything except the ability to pretend you were going to.",
        eff: { attr: { grit: 1 }, flags: ["looked-at-the-keep"] } } },
  ] },

{ id: "x-keep-inside", chain: true, demand: true,
  dm: "You are in the outer yard of the Red Keep with a bloody sword and about ninety seconds before this becomes the largest thing that has happened in this city this year. There are three ways off this yard and you can see all of them.",
  opts: [
    { label: "Up the serpentine steps, towards the throne room",
      check: { attr: "swiftness", dc: 20, perkBonus: [{ perk: "quick", n: 4 }, { perk: "cold-blood", n: 4 }], flagBonus: [{ flag: "cased-the-keep", n: 5 }] },
      pass: { text: "Two flights, a gallery and a door, and what happens on the other side of that door takes a very short time and changes the realm. Nobody will ever satisfactorily explain how you got there.",
        eff: { kills: 1, renown: 60, notoriety: 60, standing: -30, health: -40, flags: ["kingslayer", "wanted", "hunted"], attr: { might: 2 } } },
      fail: { text: "The Kingsguard are seven, and two of them are on that stair, and they are the best the realm has.",
        eff: { die: "cut down on the serpentine steps, one floor short of a king" } } },
    { label: "Out through the kitchens and the river gate", req: { flags: ["cased-the-keep"] },
      reqWhy: "You do not know this castle. You know one gate and it is behind you.",
      check: { attr: "cunning", dc: 15, perkBonus: [{ perk: "quiet", n: 4 }, { perk: "sly", n: 3 }] },
      pass: { text: "The door that opens twice a day for the kitchens opens once more, and you are on the river stair with the whole city in front of you and a great deal of noise behind.",
        eff: { renown: 8, notoriety: 20, health: -10, flags: ["wanted", "hunted", "-inside-the-keep"] } },
      fail: { text: "The old man on the river door is old and is not slow.", eff: { die: "taken in the kitchens of the Red Keep" } } },
    { label: "Put down the sword and kneel",
      res: { text: "You put it on the stones and go down on both knees with your hands where they can see them. They do not kill you, which surprises everybody present including them. What happens instead takes rather longer.",
        eff: { jail: 4, health: -18, notoriety: 20, flags: ["wanted", "-inside-the-keep"] }, goto: "trial" } },
  ] },

]);

/* ==========================================================================
   THE DOOR INTO THE CHAIN — an action, so you may go and do it rather than
   waiting for it to be offered. Anywhere in King's Landing.
   ========================================================================== */
window.IL_ACTIONS = (window.IL_ACTIONS || []).concat([

  { id: "act-march-on-the-keep", icon: "&#128081;", group: "The street",
    when: { wild: false, places: ["flea-bottom", "street-of-steel", "kings-landing-docks", "great-sept", "red-keep"], notFlags: ["imprisoned"] },
    dm: "The Red Keep is up there. Everyone in this city can see it from wherever they are standing, which is rather the point of building it on a hill. The road up is not guarded until the last two hundred yards of it.",
    opts: [
      { label: "Go up the hill now",
        res: { text: "You start walking. Nobody who sees you go thinks anything of it.", goto: "x-keep-march" } },
      { label: "Look at it from here and go and find something to eat",
        res: { text: "You look at it for a while. Then you go and find something to eat, which is what nearly everybody in this city does about the Red Keep every day of their lives.",
          eff: { attr: { wits: 1 } } } },
    ] },

]);
