/* ============================================================================
   THE IRON LADDER — THE DECK.

   Everything that can happen to you. The engine knows none of it: an event is
   data, and adding one is a paste job with no code change anywhere.

     { id, w, once?, max?, filler?, chain?, ambition?, when:{}, dm:"", opts:[…] }

   `when` is checked against the character (see meets() in engine.js). `w` is
   how often it comes up, 1 rare, 6 common. `once` fires at most once a life;
   `max: n` at most n times. `filler: true` marks a scene that may be used when
   nothing else fits, so the world never runs dry. `chain: true` takes it OUT of
   the random deck — it can then only be reached by another option's `goto`,
   which is how a scene becomes a sequence: arrest → trial → cell → the Wall.

   An option is one of two shapes:
     { label, hint?, req?, cost?, res: { text, eff, goto } }              certain
     { label, check:{attr,dc,…}, pass:{…}, fail:{…}, crit?, fumble? }   uncertain

   HOUSE RULES FOR WRITING ONE.
   1. Every option must be able to go badly, or it is not a decision.
   2. At least one option is always available to a penniless, friendless
      character — never write a scene whose only exits cost coin.
   3. Cruelty must pay something, or nobody believes the world. It should also
      cost something, or nobody respects it. Both, always.
   4. The narration never tells the player how to feel about what they did.
   5. Difficulty: DC 10 is a coin-toss for a competent person, 14 is hard, 18
      needs a specialist, 22 needs a specialist and luck.
   ========================================================================== */

window.IL_EVENTS = [

/* ==========================================================================
   1. THE ROAD, THE TAVERN, THE ORDINARY DAY  — anywhere, anyone
   ========================================================================== */

{ id: "tavern-brawl", w: 5, filler: true, when: { anyPlaceTag: ["town", "city", "village", "port"] },
  dm: "A big man in a wet cloak has decided that you looked at him. The common room has gone quiet in the particular way common rooms do, and the innkeep is quietly moving the good cups.",
  opts: [
    { label: "Break his nose before he finishes the sentence",
      check: { attr: "might", dc: 12, perkBonus: [{ perk: "strong", n: 3 }, { perk: "big", n: 2 }] },
      pass: { text: "You put him down with one honest blow and the room decides it saw nothing. Somebody buys you a drink for the entertainment.", eff: { coin: 6, renown: 1, attr: { might: 1 } } },
      fail: { text: "He is bigger than he looked and takes your first punch as a gift. You wake outside in the mud with a bad head and lighter pockets.", eff: { health: -12, coin: -10 } } },
    { label: "Talk him down and buy him a cup",
      check: { attr: "charm", dc: 11, perkBonus: [{ perk: "silver", n: 3 }, { perk: "comely", n: 2 }] },
      cost: { coin: 3 },
      pass: { text: "By the second cup he is telling you about his brother. By the third he would fight anyone in the realm on your behalf.", eff: { renown: 1, attr: { charm: 1 } } },
      fail: { text: "He drinks what you bought him and hits you anyway.", eff: { health: -8, coin: -3 } } },
    { label: "Leave. There is nothing here worth a broken hand",
      res: { text: "You are through the door before he has finished being offended. Two men laugh. You have heard worse.", eff: { standing: -1 } } },
    { label: "Cut him", req: { anyPerk: ["cruel", "sly"] }, hint: "There will be blood on the floor.",
      check: { attr: "swiftness", dc: 13, perkBonus: [{ perk: "duellist", n: 3 }, { perk: "quick", n: 2 }] },
      pass: { text: "It is over before most of the room understands it has begun. He sits down slowly, holding himself together, and nobody follows you out.", eff: { notoriety: 6, renown: 2, kills: 1, attr: { swiftness: 1 } } },
      fail: { text: "You are too slow and half the room is on you. They take the knife off you and use it a little.", eff: { health: -20, notoriety: 4 } } },
  ] },

{ id: "beggar-child", w: 4, filler: true, when: { anyPlaceTag: ["city", "town", "port"] },
  dm: "A child with a face like a knuckle follows you three streets, asking for a copper, then for bread, then just following.",
  opts: [
    { label: "Feed them", cost: { coin: 2 },
      res: { text: "They eat like they have not eaten. In a month they will still be here and so will the hunger, but today they ate.", eff: { renown: 1, standing: 1 } } },
    { label: "Give them work — carry, watch, run messages",
      check: { attr: "charm", dc: 12 },
      pass: { text: "They turn out to be quick, and to know every alley in the district. They start turning up wherever you are.", eff: { followers: 1, attr: { cunning: 1 } } },
      fail: { text: "They take the first coin and vanish, along with the purse you were not watching.", eff: { coin: -12 } } },
    { label: "Walk on", res: { text: "They fall away at the corner. There is always another corner.", eff: {} } },
  ] },

{ id: "corpse-on-road", w: 3, when: { notPlaceTags: ["court"] },
  dm: "There is a man face-down in the ditch, a day dead. His boots are better than yours and there is a purse on his belt that nobody has found.",
  opts: [
    { label: "Take it all", res: { text: "The boots fit. The purse holds eleven silver and a folded letter you cannot yet read.", eff: { coin: 11, items: ["letters"], standing: -1 } } },
    { label: "Take the purse, leave him his boots", res: { text: "A small mercy to a man who cannot know it. You feel obscurely better.", eff: { coin: 11 } } },
    { label: "Bury him and say the words",
      res: { text: "It takes most of the afternoon and costs you a day's walking. A carter who passes stops to help, and remembers your face for it.", eff: { renown: 1, standing: 2, health: -2 } } },
    { label: "Read the letter first", req: { anyPerk: ["lettered", "bookish", "clever"] },
      res: { text: "It is a report to a lord you have heard of, about grain, and about how little of it is where it should be. Somebody is stealing on a scale that would interest the crown.", eff: { items: ["letters"], secrets: 1, coin: 11, attr: { wits: 1 } } } },
  ] },

{ id: "recruiter", w: 4, when: { notFlags: ["sworn", "enslaved", "imprisoned"], anyPlaceTag: ["town", "city", "village", "port", "warcamp"] },
  dm: "A serjeant with a table, a jug and a sheaf of names is signing men for somebody's war. He does not say whose until you sit down, and once you have sat down he does not much care whether you like the answer.",
  opts: [
    { label: "Sit down, take his coin, and join whatever army it is",
      res: { text: "You make your mark. There is a shilling in your hand and a badge on your chest, and you belong to somebody now.", eff: { coin: 12, flags: ["soldier", "sworn"], standing: 3, attr: { might: 1 } } } },
    { label: "Sit down, but make him say whose war it is before you sign",
      check: { attr: "wits", dc: 12 },
      pass: { text: "He tells you more than he meant to: two lords, one bridge, and a third party paying both. You sign anyway, but you sign knowing.", eff: { coin: 12, flags: ["soldier", "sworn"], secrets: 1, attr: { wits: 1 } } },
      fail: { text: "He gives you the speech about honour. You sign to stop him giving it again.", eff: { coin: 10, flags: ["soldier", "sworn"] } } },
    { label: "Sit down, take the coin, and be gone before the muster",
      check: { attr: "cunning", dc: 14, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quiet", n: 2 }] },
      pass: { text: "You are three villages away before the muster. Nobody has your name; you gave him a good one that was not yours.", eff: { coin: 12, notoriety: 3, attr: { cunning: 1 } } },
      fail: { text: "They catch you at the ford. Deserters are flogged, and then they keep you anyway.", eff: { health: -18, flags: ["soldier", "sworn"], notoriety: 4 } } },
    { label: "Do not sit down at all", res: { text: "You walk past. He does not call after you; there is no shortage of men.", eff: {} } },
  ] },

{ id: "hard-winter", w: 3, when: { anyPlaceTag: ["cold", "village", "poor"] },
  dm: "The cold comes early and stays. The stores in this place were never meant for a winter this long, and people have begun to do arithmetic out loud about who is eating.",
  opts: [
    { label: "Endure it",
      check: { attr: "grit", dc: 13, perkBonus: [{ perk: "hardy", n: 3 }, { perk: "iron-stomach", n: 2 }] },
      pass: { text: "You get thin and you get through. Come the thaw you are still standing and half the ones who complained loudest are not.", eff: { attr: { grit: 1 }, health: -6, renown: 1 } },
      fail: { text: "The cold gets into your chest and does not leave for two months.", eff: { health: -22 } } },
    { label: "Take what you need from those who have it",
      check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "sly", n: 3 }] },
      pass: { text: "You eat. Somebody else does not, and never learns whose fault that was.", eff: { health: 6, coin: 8, notoriety: 4 } },
      fail: { text: "They catch you in the granary. There is no watch here, so the village does its own justice with sticks.", eff: { health: -20, standing: -6, notoriety: 6 } } },
    { label: "Share out what you have", req: { minCoin: 20 }, cost: { coin: 20 },
      res: { text: "It is not enough and everyone knows it is not enough. They remember anyway, for years.", eff: { renown: 3, standing: 4, followers: 1 } } },
    { label: "Go somewhere warmer", req: { minCoin: 8 }, cost: { coin: 8 },
      res: { text: "You leave before the worst of it, which is the sensible thing and will be held against you by everyone who could not.", eff: { move: "random", standing: -2 } } },
  ] },

{ id: "fever", w: 3, filler: true, when: { wild: false, minTurn: 3 },
  dm: "It starts as a headache and by the second night you cannot keep water down. There is no maester. There is a woman two doors along who is said to know things.",
  opts: [
    { label: "Sweat it out alone",
      check: { attr: "grit", dc: 14, perkBonus: [{ perk: "iron-stomach", n: 3 }, { perk: "hardy", n: 2 }] },
      pass: { text: "Four days you do not remember. On the fifth you are hollowed out but whole.", eff: { health: -10, attr: { grit: 1 } } },
      fail: { text: "It takes a great deal more of you than it should have, and leaves something behind in your chest.", eff: { health: -30 } } },
    { label: "Send for the woman", cost: { coin: 6 },
      check: { attr: "wits", dc: 10, perkBonus: [{ perk: "healer-hands", n: 3 }] },
      pass: { text: "She burns something bitter, makes you drink something worse, and sits with you. You are up in three days.", eff: { health: -6, rel: { healer: 2 } } },
      fail: { text: "What she gives you does no good at all, and possibly some harm. She does not offer to return the coin.", eff: { health: -20, coin: -6 } } },
    { label: "Pray", req: { anyFlag: ["septon", "faithful"] },
      res: { text: "You pray, and you get better, and you will never be able to prove those two facts are related.", eff: { health: -12, standing: 1 } } },
  ] },

{ id: "wedding-offer", w: 2, once: true, when: { wild: false, minAge: 17, notFlags: ["married", "enslaved", "sworn-celibate"] },
  dm: "A match is proposed. Whether it comes from a father, a matchmaker or a lord depends on what you are worth, and somebody has evidently done the sum.",
  opts: [
    { label: "Marry for love, and take the smaller portion",
      res: { text: "It is a poor bargain by every measure the world uses. You do not care, and neither, apparently, do they.", eff: { flags: ["married"], health: 6, standing: -2, renown: 1 } } },
    { label: "Marry for the alliance",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "connected", n: 3 }] },
      pass: { text: "The contract is signed in a cold room by people who are pleased with themselves. You are richer, better connected, and you will spend your life at that table.", eff: { flags: ["married", "allied"], coin: 140, standing: 10, followers: 3 } },
      fail: { text: "The negotiation goes badly and the other party finds someone better. The insult is public.", eff: { standing: -6 } } },
    { label: "Refuse the match",
      res: { text: "It is taken as an insult by everyone who arranged it, and as a fine joke by everyone who did not.", eff: { standing: -4, renown: 1, flags: ["refused-match"] } } },
  ] },

{ id: "the-dog", w: 2, once: true, filler: true, when: { wild: false, notItems: ["dog"] },
  dm: "A dog has decided to follow you. It is thin, ugly, and entirely certain about this.",
  opts: [
    { label: "Feed it", cost: { coin: 1 },
      res: { text: "That settles it. Wherever you go now, there are two of you.", eff: { items: ["dog"] } } },
    { label: "Drive it off", res: { text: "It goes fifty paces away and continues to follow you from there, which is worse.", eff: {} } },
    { label: "Kill it and eat it", req: { maxCoin: 3 },
      res: { text: "You have eaten worse and you were hungrier than you admitted. It is a bad night all the same.", eff: { health: 8, standing: -1 } } },
  ] },

/* ==========================================================================
   2. CRIME, THE WATCH, THE CELLS
   ========================================================================== */

{ id: "easy-purse", w: 5, when: { anyPlaceTag: ["market", "city", "town", "port"], notFlags: ["imprisoned"] },
  dm: "A fat merchant is arguing about the price of nails and his purse is hanging on the wrong side of him, in a crowd, in a street with four exits.",
  opts: [
    { label: "Take it",
      check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quick", n: 2 }, { perk: "quiet", n: 2 }] },
      pass: { text: "Two fingers and a shoulder-turn. You are out of the square before he has finished the argument.", eff: { coin: 34, attr: { cunning: 1 }, notoriety: 1 } },
      fail: { text: "His hand closes on your wrist and he has a very loud voice. The gold cloaks are on you in a moment.", eff: {}, goto: "arrest" },
      fumble: { text: "You misjudge everything. He shouts, the crowd closes, and somebody hits you with a stool before the watch even arrives.", eff: { health: -12 }, goto: "arrest" } },
    { label: "Follow him instead and learn where he lives", req: { anyPerk: ["sly", "clever", "quiet", "wary"] },
      check: { attr: "wits", dc: 13 },
      pass: { text: "A warehouse by the river, a wife, a habit of walking home alone after dark. You have not stolen anything today. You have acquired something better.", eff: { secrets: 1, attr: { wits: 1 }, flags: ["knows-a-mark"] } },
      fail: { text: "He notices you at the second corner and doubles back with two men who work for him.", eff: { health: -10 } } },
    { label: "Leave it", res: { text: "There will be another purse. There is always another purse.", eff: {} } },
  ] },

{ id: "arrest", chain: true,
  dm: "The gold cloaks — or whatever this place calls them — have you by both arms. The crowd is enjoying it. Somewhere ahead there is a cell, and after the cell there is a man who decides things.",
  opts: [
    { label: "Run",
      check: { attr: "swiftness", dc: 15, perkBonus: [{ perk: "quick", n: 4 }, { perk: "rider", n: 2 }] },
      pass: { text: "You tear loose, go over a wall, and lose them in three streets. Your description is now in a book somewhere.", eff: { notoriety: 8, flags: ["wanted"], attr: { swiftness: 1 } } },
      fail: { text: "You get four paces. They take the running out of you with a cudgel, at length.", eff: { health: -16 }, goto: "trial" } },
    { label: "Buy your way clear", req: { minCoin: 40 }, cost: { coin: 40 },
      res: { text: "The coin changes hands so smoothly that you suspect this is most of what the post pays. You are released into the street with a warning nobody means.", eff: { notoriety: 2 } } },
    { label: "Go quietly and speak well later", res: { text: "You do not resist. It is noted, in the way that such things are sometimes noted.", eff: {}, goto: "trial" } },
    { label: "Name somebody worse", req: { anyPerk: ["sly", "silver"] }, hint: "Somebody will suffer for this.",
      check: { attr: "cunning", dc: 14 },
      pass: { text: "You give them a name, a street, and enough true detail to hang it on. They let you go to fetch him.", eff: { notoriety: 3, standing: -3, flags: ["informer"], attr: { cunning: 1 } } },
      fail: { text: "The name you give is the name of a man who works for the captain's brother. It goes badly for you.", eff: { health: -10 }, goto: "trial" } },
  ] },

{ id: "trial", chain: true,
  dm: "You are brought before whoever holds justice here — a lord, a magister, a bored knight with a table. The charge is read. The room is not interested in you; it is interested in getting to dinner.",
  opts: [
    { label: "Plead, and plead well",
      check: { attr: "charm", dc: 14, perkBonus: [{ perk: "silver", n: 4 }, { perk: "comely", n: 2 }], flagBonus: [{ flag: "highborn", n: 3 }] },
      pass: { text: "You are fined, lectured and released. The lecture is the longer punishment.", eff: { coin: -25, standing: -3 } },
      fail: { text: "He has heard six of these today and yours is the worst told. The sentence is a season in the cells.", eff: { jail: 2, standing: -6 } } },
    { label: "Demand trial by combat", req: { sides: ["westeros"] }, hint: "The gods decide. So does your arm.",
      check: { attr: "might", dc: 15, perkBonus: [{ perk: "strong", n: 3 }, { perk: "duellist", n: 3 }], itemBonus: [{ item: "sword", n: 2 }, { item: "armour", n: 2 }] },
      pass: { text: "They give you a blunted sword and a man half again your size, and you put him in the dirt in front of everybody. The charge is dissolved. Nobody is happy about it except the crowd.", eff: { renown: 5, standing: 2, health: -14, attr: { might: 1 } } },
      fail: { text: "The gods, it seems, have opinions. He breaks your arm in the first exchange and the sentence stands with interest.", eff: { health: -25, jail: 3 } } },
    { label: "Take the sentence", res: { text: "You are led down a stair you cannot see the bottom of.", eff: { jail: 3, standing: -5 }, goto: "cell" } },
    { label: "Take the black", req: { sides: ["westeros"] }, hint: "The Wall takes any man, and asks nothing of what he was.",
      res: { text: "The words are said. Whatever you were is finished; whatever the Watch is, you are now that.", eff: { flags: ["nights-watch", "sworn", "-wanted"], move: "castle-black", standing: 0, notoriety: -20, coin: -9999 }, goto: "wall-arrival" } },
  ] },

{ id: "cell", chain: true,
  dm: "Wet stone, a bucket, and a slot of light that moves across the wall and is the only clock you have. There are three others in here and one of them has been here longest.",
  opts: [
    { label: "Keep your head down and serve it",
      check: { attr: "grit", dc: 12, perkBonus: [{ perk: "hardy", n: 3 }, { perk: "cold-blood", n: 2 }] },
      pass: { text: "You get through it. You come out thinner, harder, and with two names you did not have going in.", eff: { attr: { grit: 1, cunning: 1 }, health: -10, flags: ["knows-thieves"] } },
      fail: { text: "The others decide you are the one it will be. It is a long season.", eff: { health: -25, attr: { grit: 1 } } } },
    { label: "Work the gaoler", cost: { coin: 15 },
      check: { attr: "charm", dc: 13, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "Better food, then a blanket, then a door left unbarred one night because he has decided he likes you.", eff: { free: 1, coin: -15, notoriety: 2, attr: { charm: 1 } } },
      fail: { text: "He takes the coin and reports you for having had coin. They search you properly this time.", eff: { coin: -9999, health: -8 } } },
    { label: "Dig, cut, climb — get out",
      check: { attr: "cunning", dc: 17, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quick", n: 2 }] },
      pass: { text: "It takes eleven nights and a length of iron you should not have. You go over the wall into a river you cannot see.", eff: { free: 1, flags: ["wanted", "escaped"], notoriety: 12, health: -12, attr: { cunning: 2 } } },
      fail: { text: "They find the hole. They find you in it. After that they use the chains.", eff: { health: -20, jail: 4 } } },
    { label: "Sell what you know", req: { flags: ["knows-a-mark"] },
      res: { text: "You give up a warehouse and a habit. The captain is delighted, the merchant is ruined, and you walk out into the rain.", eff: { free: 1, standing: -4, notoriety: 4, flags: ["informer", "-knows-a-mark"] } } },
  ] },

{ id: "outlaw-band", w: 3, when: { anyFlag: ["wanted", "outlaw"], anyPlaceTag: ["forest", "wild", "mountain"] },
  dm: "Men who are also not welcome anywhere have a camp in these trees. They have seen you before you saw them, and they are deciding.",
  opts: [
    { label: "Join them",
      res: { text: "There is no oath. There is a fire, a share, and the understanding that the day you are a liability is the day you are alone again.", eff: { flags: ["outlaw"], followers: 2, coin: 10, notoriety: 6 } } },
    { label: "Take them over", req: { minRenown: 8 }, hint: "There is already a man who thinks he leads them.",
      check: { attr: "charm", dc: 16, perkBonus: [{ perk: "silver", n: 3 }, { perk: "cruel", n: 3 }], followerBonus: { per: 4, max: 4 } },
      pass: { text: "You do not have to kill him. You only have to make it obvious to the other nine that you could, and then offer him a place.", eff: { flags: ["outlaw", "band-leader"], followers: 9, renown: 4, notoriety: 8, attr: { charm: 1 } } },
      fail: { text: "He is more popular than you judged. They beat you and leave you the road.", eff: { health: -20, standing: -2 } } },
    { label: "Refuse and walk out of the wood",
      check: { attr: "grit", dc: 12 },
      pass: { text: "You keep walking and do not look back, and the arrow you were braced for does not come.", eff: { attr: { grit: 1 } } },
      fail: { text: "They take everything you have and let you keep your boots, which one of them says is generous.", eff: { coin: -9999, health: -6 } } },
  ] },

{ id: "murder-chance", w: 2, when: { wild: false, minNotoriety: 5, notFlags: ["imprisoned"] },
  dm: "There is a man asleep in a room you can reach, who has wronged somebody, and who is worth thirty silver to a person who asked you very carefully whether you were the sort.",
  opts: [
    { label: "Do it",
      check: { attr: "swiftness", dc: 14, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "quiet", n: 3 }, { perk: "cruel", n: 2 }] },
      pass: { text: "It is quieter than you expected. That is the part that stays with you, and the part you will be paid for.", eff: { coin: 30, kills: 1, notoriety: 10, flags: ["killer"], attr: { cunning: 1 } } },
      fail: { text: "He wakes. He is stronger than a sleeping man has any right to be, and the house wakes with him.", eff: { health: -22, notoriety: 14, flags: ["wanted"] }, goto: "arrest" } },
    { label: "Warn him instead, and see what he pays",
      check: { attr: "cunning", dc: 14 },
      pass: { text: "He pays better than the man who hired you, and now two people owe you something they cannot ask back.", eff: { coin: 55, secrets: 1, flags: ["double-dealer"] } },
      fail: { text: "He does not believe you, and tells the man who hired you that you came to him.", eff: { notoriety: 8, health: -10 } } },
    { label: "Refuse", res: { text: "You give back the earnest money. The man who offered it looks at you for a while and then decides you are not worth the trouble. Probably.", eff: { standing: 1 } } },
  ] },

/* ==========================================================================
   3. WAR — joining, fighting, and what is left after
   ========================================================================== */

{ id: "banners-called", w: 4, when: { wild: false, notFlags: ["imprisoned", "enslaved"], minTurn: 2 },
  dm: "A rider comes through with a summons. Somebody's lord has called his banners and somebody's lord is about to find out whether he should have. The muster is at the crossroads in nine days.",
  opts: [
    { label: "Go, and take a spear in the levy",
      res: { text: "You are given a boiled leather cap that does not fit and a place in the third rank, which is where men who have not been in a battle are put.", eff: { flags: ["soldier", "at-war"], coin: 8, attr: { grit: 1 } } } },
    { label: "Go, and offer to lead men", req: { minFollowers: 3 },
      check: { attr: "charm", dc: 14, followerBonus: { per: 4, max: 5 }, flagBonus: [{ flag: "highborn", n: 3 }] },
      pass: { text: "They give you a serjeant's place and forty men who are not sure about you. That is a start.", eff: { flags: ["soldier", "at-war", "officer"], followers: 8, standing: 5, renown: 2 } },
      fail: { text: "They look at your men, and at you, and put you all in the third rank together.", eff: { flags: ["soldier", "at-war"], standing: -2 } } },
    { label: "Sell them supplies instead", req: { minCoin: 40 }, cost: { coin: 40 },
      check: { attr: "wits", dc: 13, perkBonus: [{ perk: "clever", n: 3 }] },
      pass: { text: "Salt beef, boots and barrel hoops, bought cheap in peace and sold dear to men who cannot wait. War is very good for some people.", eff: { coin: 160, attr: { wits: 1 } } },
      fail: { text: "The host moves before your carts do. You are left with four hundredweight of salt beef and a rapidly warming summer.", eff: { coin: -40 } } },
    { label: "Do not go", res: { text: "Men who did not go are remembered as clearly as men who did, and for longer.", eff: { standing: -5, flags: ["shirker"] } } },
    { label: "Go, and fight for the other side", req: { anyFlag: ["outlaw", "wanted", "bastard"] }, hint: "Somebody is always hiring against.",
      res: { text: "You cross two valleys and take a different cloak. It pays better, which is usually why.", eff: { flags: ["soldier", "at-war", "turncloak"], coin: 30, standing: -8, notoriety: 6 } } },
  ] },

{ id: "the-battle", w: 6, when: { wild: false, flags: ["at-war"] },
  dm: "Dawn, a field, and eight thousand men who would all rather be elsewhere. The horns go. The line moves before you have decided anything, and then you are in it.",
  opts: [
    { label: "Hold the line",
      check: { attr: "grit", dc: 14, perkBonus: [{ perk: "hardy", n: 3 }, { perk: "cold-blood", n: 3 }], itemBonus: [{ item: "armour", n: 3 }] },
      pass: { text: "You hold. The man on your left does not, and the man on your right does, and by some arithmetic nobody understands the line holds and theirs does not.", eff: { renown: 4, health: -12, coin: 20, kills: 1, attr: { grit: 1 } } },
      fail: { text: "The line goes. You go with it, and are trampled, and wake among bodies with the field gone quiet.", eff: { health: -34, standing: -2 } } },
    { label: "Go for the man with the banner",
      check: { attr: "might", dc: 17, perkBonus: [{ perk: "strong", n: 3 }, { perk: "duellist", n: 3 }, { perk: "wolf-blood", n: 3 }], itemBonus: [{ item: "good-sword", n: 3 }, { item: "sword", n: 1 }] },
      pass: { text: "You cut your way to the standard and put it in the mud yourself. Four hundred men see you do it. That is the kind of thing that gets a man a name.", eff: { renown: 12, standing: 8, kills: 2, health: -20, attr: { might: 1 } },
        goto: "after-glory" },
      fail: { text: "You get within twenty feet. Somebody you never saw puts a spear through your thigh and the day continues without you.", eff: { health: -32, renown: 1 } } },
    { label: "Find the softest part of the line and be somewhere else",
      check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quiet", n: 3 }] },
      pass: { text: "You fight exactly as much as is required to be seen fighting, and no more. You come off the field whole, which most do not.", eff: { health: -4, coin: 10, attr: { cunning: 1 } } },
      fail: { text: "The soft part of the line is where their horse comes through.", eff: { health: -28 } } },
    { label: "Take a prisoner worth ransoming", req: { minTurn: 6 },
      check: { attr: "wits", dc: 15, itemBonus: [{ item: "sword", n: 2 }] },
      pass: { text: "You put a knight on his back, get his gauntlet off, and get his name before anybody else does. A name like that is worth more alive than dead.", eff: { coin: 180, renown: 3, spared: 1, health: -10, attr: { wits: 1 } } },
      fail: { text: "You get him down and three of his men get him back, and take a good deal of you in payment.", eff: { health: -24 } } },
  ] },

{ id: "after-glory", chain: true,
  dm: "The field is won and men are looking at you differently. A lord who did not know your name this morning is walking over with two of his household knights, and he is smiling.",
  opts: [
    { label: "Kneel", req: { sides: ["westeros"] },
      res: { text: "The sword touches both shoulders. In the name of the Warrior, bid him be brave. You get up as a knight, which yesterday was another kind of person entirely.", eff: { title: "Ser", flags: ["knight"], standing: 14, renown: 6, items: ["sword"] } } },
    { label: "Ask for land instead of honour",
      check: { attr: "cunning", dc: 16, flagBonus: [{ flag: "highborn", n: 3 }] },
      pass: { text: "He is startled, then amused, then thoughtful. There is a burnt holdfast three valleys away with nobody in it, and now it is yours to make something of.", eff: { holding: "a burnt holdfast", flags: ["landed"], standing: 10, followers: 4 } },
      fail: { text: "He decides you are grasping and gives the knighthood to somebody else. The word grasping follows you for a year.", eff: { standing: -6, renown: 2 } } },
    { label: "Ask for coin and go", res: { text: "He pays without a word and thinks less of you, and you are considerably richer than a knight.", eff: { coin: 220, standing: -3, renown: 3 } } },
    { label: "Ask for nothing", res: { text: "It confuses him, and confusing a lord is a strange kind of investment. He remembers your face for a long time.", eff: { renown: 5, standing: 4, rel: { lord: 3 } } } },
  ] },

{ id: "sack-of-the-town", w: 3, when: { wild: false, flags: ["at-war"] },
  dm: "The gate is down and the town is open. Your officers have stopped giving orders, which is itself an order. Men are already going through doors.",
  opts: [
    { label: "Take what you can carry",
      check: { attr: "swiftness", dc: 11 },
      pass: { text: "Silver, a good cloak, and a purse from a house where nobody was home. You do not look closely at the other houses.", eff: { coin: 90, notoriety: 6, standing: -2 } },
      fail: { text: "You are late to it and get a candlestick and a bruise from a man who was earlier.", eff: { coin: 8, health: -8 } } },
    { label: "Stand in a doorway and let nobody through it",
      check: { attr: "might", dc: 15, perkBonus: [{ perk: "strong", n: 3 }, { perk: "honest", n: 3 }] },
      pass: { text: "You hold one door for six hours. It is one door out of four hundred. The family inside will name a child after you, and you will never know.", eff: { renown: 4, standing: 6, spared: 4, health: -14, attr: { might: 1 } } },
      fail: { text: "They go around you, and then through you.", eff: { health: -20, spared: 1 } } },
    { label: "Find the man in charge of the town and kill him first", req: { anyPerk: ["cruel", "cold-blood"] },
      check: { attr: "cunning", dc: 15 },
      pass: { text: "You take the head of the watch in his own hall. It ends the fighting an hour early and saves more lives than the door-holders. Nobody thanks you.", eff: { kills: 1, renown: 5, notoriety: 8, coin: 40, spared: 2 } },
      fail: { text: "His guards are still with him and better than you.", eff: { health: -26 } } },
    { label: "Get out of the town entirely", res: { text: "You walk back out through the broken gate and sit on the hill until it is over. You are the only man on that hill.", eff: { standing: -3, renown: 1, spared: 1 } } },
  ] },

{ id: "spare-or-not", w: 3, when: { wild: false, anyFlag: ["at-war", "outlaw", "band-leader"], minTurn: 5 },
  dm: "The fighting is done and there is a man on his knees in front of you with his hands tied. He is somebody's son. He was trying to kill you an hour ago and would again. It is entirely your decision and everyone is watching you make it.",
  opts: [
    { label: "Kill him",
      res: { text: "It is over quickly. Your men approve, in the way that men approve of things they are glad they did not have to do.", eff: { kills: 1, notoriety: 5, renown: 2, followers: 1, attr: { grit: 1 } } } },
    { label: "Spare him and send him home",
      res: { text: "He does not thank you. Somewhere south, a house learns that their son is alive because of a name they had not heard before.", eff: { spared: 1, renown: 3, standing: 4, flags: ["merciful"], rel: { spared_house: 3 } } } },
    { label: "Spare him and keep him", req: { minFollowers: 2 },
      check: { attr: "charm", dc: 15, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "He has nowhere to go and you have somewhere for him to stand. In a year he will be one of your best.", eff: { followers: 3, spared: 1, renown: 1, attr: { charm: 1 } } },
      fail: { text: "He goes with you for eleven days and then goes home, taking your second-best horse.", eff: { coin: -30, spared: 1 } } },
    { label: "Ransom him", req: { minTurn: 8 },
      check: { attr: "wits", dc: 13 },
      pass: { text: "The letter goes south and the coin comes north, and everybody is content with an arrangement that has nothing to do with the war.", eff: { coin: 200, spared: 1 } },
      fail: { text: "His family will not pay, or cannot, and you have fed him for a season for nothing.", eff: { coin: -20, spared: 1 } } },
  ] },

{ id: "desert", w: 2, when: { wild: false, flags: ["soldier"] },
  dm: "The host has not moved in three weeks, the food is bad, and two men went over the wall the night before last and have not been brought back.",
  opts: [
    { label: "Go over the wall tonight",
      check: { attr: "cunning", dc: 14, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "quick", n: 2 }] },
      pass: { text: "You are gone before the watch changes and out of the county before the count is taken.", eff: { flags: ["-soldier", "-at-war", "-sworn", "deserter", "wanted"], notoriety: 8, move: "random" } },
      fail: { text: "They were waiting. Deserters are hanged, unless the captain is short of men, and he is.", eff: { health: -22, standing: -8 } } },
    { label: "Stay", res: { text: "You stay. Two more go the next night and one of them is a friend.", eff: { attr: { grit: 1 }, health: -4 } } },
    { label: "Report the next two who try it",
      res: { text: "The captain rewards you. So does nobody else, ever again, in that camp.", eff: { coin: 25, standing: 3, flags: ["informer"], followers: -1 } } },
  ] },

/* ==========================================================================
   4. CLIMBING — service, oaths, land, followers
   ========================================================================== */

{ id: "lord-needs-men", w: 4, when: { notFlags: ["sworn", "enslaved", "imprisoned"], anyPlaceTag: ["castle", "court", "keep"] },
  dm: "The household here is short of men, and the steward is looking over the yard with the expression of somebody making a list.",
  opts: [
    { label: "Offer your sword",
      check: { attr: "might", dc: 12, itemBonus: [{ item: "sword", n: 2 }, { item: "armour", n: 2 }] },
      pass: { text: "You are taken on. A wage, a cloak with a stranger's arms on it, and a bed you did not have yesterday.", eff: { flags: ["sworn", "household"], coin: 14, standing: 6, work: "guard" } },
      fail: { text: "He watches you handle a spear for ten seconds and finds somewhere else to look.", eff: { standing: -1 } } },
    { label: "Offer to keep his accounts", req: { anyPerk: ["lettered", "clever", "bookish"] },
      check: { attr: "wits", dc: 13 },
      pass: { text: "You find two errors in the first ledger and a third that is not an error at all. The steward's face changes. You are hired, and he is watching you.", eff: { flags: ["sworn", "household"], coin: 20, standing: 8, work: "steward", secrets: 1, attr: { wits: 1 } } },
      fail: { text: "Your hand is poor and your sums are worse. He is polite about it, which is the worst part.", eff: { standing: -2 } } },
    { label: "Offer nothing and look around the yard instead",
      check: { attr: "cunning", dc: 13 },
      pass: { text: "A postern with a broken bar, a guard who drinks at midday, and a strongroom under the west tower. You leave having taken nothing at all.", eff: { secrets: 1, flags: ["cased-a-castle"], attr: { cunning: 1 } } },
      fail: { text: "Somebody asks what you are doing here, twice, and the second time he brings friends.", eff: { health: -8, standing: -2 } } },
  ] },

{ id: "swear-to-lord", w: 2, when: { wild: false, flags: ["household"], notFlags: ["oathbound"], minTurn: 6 },
  dm: "You have served long enough that the lord knows your name and uses it. He offers you the oath — the real one, kneeling, with a hand on a hilt and witnesses.",
  opts: [
    { label: "Swear it and mean it",
      res: { text: "You give him your word and he gives you his. It is the oldest arrangement in the world and it works about half the time.", eff: { flags: ["oathbound"], standing: 12, followers: 2, coin: 30, renown: 2 } } },
    { label: "Swear it and mean nothing by it", req: { anyPerk: ["sly", "cold-blood"] },
      res: { text: "The words are the same. Only you know they are hollow, and that is a thing you now have to carry about with you.", eff: { flags: ["oathbound", "false-oath"], standing: 12, coin: 30, attr: { cunning: 1 } } } },
    { label: "Refuse, and say why",
      check: { attr: "charm", dc: 15, perkBonus: [{ perk: "honest", n: 4 }] },
      pass: { text: "You tell him you will serve for pay and not for life, and that you would rather he knew it. He does not like it. He respects it.", eff: { standing: 4, renown: 2, coin: 20, attr: { charm: 1 } } },
      fail: { text: "He hears it as an insult, because it partly was. You are out of the gate by evening.", eff: { flags: ["-household", "-sworn"], standing: -8 } } },
  ] },

{ id: "gather-men", w: 3, when: { wild: false, minRenown: 6, notFlags: ["imprisoned", "enslaved"] },
  dm: "Men have started attaching themselves to you — a boy who lost his village, a soldier whose lord is dead, a man who will not say what he was. They are waiting to see whether you intend to be somebody.",
  opts: [
    { label: "Feed them and swear them", cost: { coin: 30 },
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 3 }, { perk: "honest", n: 2 }] },
      pass: { text: "Bread, beer and a speech that turns out better than you expected. By morning there are eleven of them and they are calling it a company.", eff: { followers: 8, renown: 3, flags: ["company"], attr: { charm: 1 } } },
      fail: { text: "You feed them. In the morning most of them are gone and so is the food.", eff: { coin: -30, followers: 1 } } },
    { label: "Take only the useful ones",
      check: { attr: "wits", dc: 13 },
      pass: { text: "Four, chosen carefully, worth twenty chosen otherwise. The ones you turn away tell people about it.", eff: { followers: 4, standing: -2, attr: { wits: 1 } } },
      fail: { text: "You choose badly. The one you were surest of robs you within the month.", eff: { followers: 2, coin: -40 } } },
    { label: "Send them all away", res: { text: "You tell them you are nobody's captain. Some of them look relieved. Most look at you the way men look at a door closing.", eff: { renown: -2, standing: 1 } } },
  ] },

{ id: "found-a-house", w: 1, once: true, ambition: "power",
  when: { wild: false, minFollowers: 25, minRenown: 30, minCoin: 400, notFlags: ["founded-house"] },
  dm: "You have men, coin, a name people have heard, and — in a realm which has recently killed a great many people who owned things — a distinct shortage of anybody with a better claim to the valley you are standing in.",
  opts: [
    { label: "Declare a house, take arms, and dare the realm to argue", cost: { coin: 400 },
      check: { attr: "charm", dc: 17, followerBonus: { per: 8, max: 6 }, flagBonus: [{ flag: "knight", n: 3 }, { flag: "landed", n: 3 }] },
      pass: { text: "You raise a banner nobody has seen before over a keep that was somebody else's a year ago, and you hold a feast, and enough people come to the feast that it is now true.", eff: { flags: ["founded-house", "lord"], title: "Lord", holding: "your own seat", standing: 30, renown: 20, items: ["banner", "cloak"], attr: { charm: 1 } } },
      fail: { text: "Two neighbours and a bishop's worth of lawyers disagree. It costs you the coin, most of the year, and a great deal of face.", eff: { standing: -12, renown: -4 } } },
    { label: "Buy a legitimacy instead — a charter, a signature, a bought cousin", req: { minCoin: 800 }, cost: { coin: 800 },
      res: { text: "Somewhere a clerk writes your name into a roll of houses, for money. It is not glorious. It is, however, permanent.", eff: { flags: ["founded-house", "lord"], title: "Lord", holding: "a chartered seat", standing: 24, renown: 8, items: ["banner"] } } },
    { label: "Not yet", res: { text: "You put it away for another year. It is the sort of thing that gets harder to do the longer you think about it.", eff: {} } },
  ] },

{ id: "tourney", w: 3, when: { sides: ["westeros"], anyPlaceTag: ["town", "city", "castle", "court"], minTurn: 4 },
  dm: "A tourney. Lists, pavilions, a melee for anyone who can hold a weapon, and a purse that would keep a man for two years.",
  opts: [
    { label: "Enter the melee", cost: { coin: 5 },
      check: { attr: "might", dc: 15, perkBonus: [{ perk: "strong", n: 3 }, { perk: "duellist", n: 3 }, { perk: "big", n: 2 }], itemBonus: [{ item: "armour", n: 3 }, { item: "sword", n: 2 }] },
      pass: { text: "You are one of the last four standing in a field of ninety. The purse is real and so is the noise the crowd makes when they learn your name.", eff: { coin: 120, renown: 8, health: -14, standing: 5, attr: { might: 1 } },
        goto: "tourney-after" },
      fail: { text: "You go down in the first press under somebody's horse and are dragged out by the ankles.", eff: { health: -18, coin: -5 } } },
    { label: "Enter the archery", cost: { coin: 3 }, req: { items: ["bow"] },
      check: { attr: "swiftness", dc: 15, perkBonus: [{ perk: "quick", n: 3 }] },
      pass: { text: "Three shafts in the gold at two hundred paces. A lord's daughter asks who you are and somebody tells her, incorrectly.", eff: { coin: 70, renown: 5, attr: { swiftness: 1 } } },
      fail: { text: "The wind takes your third arrow into the crowd. Nobody is hurt. Everybody laughs.", eff: { standing: -3, coin: -3 } } },
    { label: "Work the crowd rather than the lists",
      check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quiet", n: 2 }] },
      pass: { text: "Ten thousand people watching something else is the finest working condition in the world.", eff: { coin: 85, notoriety: 3, attr: { cunning: 1 } } },
      fail: { text: "A hedge knight's squire catches your hand in his master's purse, and hedge knights are not gentle.", eff: { health: -14 }, goto: "arrest" } },
    { label: "Watch, and learn who is who",
      res: { text: "You spend the day putting faces to banners. It is worth more than the purse and considerably safer.", eff: { attr: { wits: 1 }, secrets: 1, flags: ["knows-the-lords"] } } },
  ] },

{ id: "tourney-after", chain: true,
  dm: "You are brought before the lord who paid for the tourney. He is old, rich, and has spent the afternoon watching you carefully.",
  opts: [
    { label: "Accept a place in his household",
      res: { text: "A wage, a bed, a cloak, and a lord who will remember he found you.", eff: { flags: ["sworn", "household"], standing: 10, coin: 40, work: "guard" } } },
    { label: "Ask him to knight you", req: { sides: ["westeros"], notFlags: ["knight"] },
      check: { attr: "charm", dc: 15, flagBonus: [{ flag: "highborn", n: 4 }] },
      pass: { text: "He does it there, in front of the pavilions, because it makes a better story than doing it privately.", eff: { title: "Ser", flags: ["knight"], standing: 14, renown: 6 } },
      fail: { text: "He explains, kindly and at length, what a knight is and what you are. The kindness is the worst of it.", eff: { standing: -4 } } },
    { label: "Take the purse and leave in the morning",
      res: { text: "You are on the road before the pavilions come down. He is insulted and will say so at dinner for a decade.", eff: { renown: 2, standing: -4 } } },
  ] },

/* ==========================================================================
   5. THE NORTH AND THE WALL
   ========================================================================== */

{ id: "heart-tree", w: 3, when: { realms: ["north", "beyond-the-wall", "riverlands"], anyPlaceTag: ["forest", "castle", "holy", "village"] },
  dm: "There is a weirwood in the godswood here, white as bone, with a face cut into it that is older than everyone who has ever knelt in front of it. It is weeping sap, which the locals will tell you it does more often lately.",
  opts: [
    { label: "Kneel and say nothing", res: { text: "You are there a long time and come away with your mind quieter than it was.", eff: { health: 6, attr: { grit: 1 }, flags: ["old-gods"] } } },
    { label: "Swear an oath here", req: { minTurn: 4 },
      res: { text: "The old gods do not answer and do not forget. Whatever you have promised is now on a ledger you cannot see.", eff: { flags: ["old-gods", "godsworn"], renown: 1, standing: 2 } } },
    { label: "Cut it down", req: { anyPerk: ["cruel", "cold-blood"] }, hint: "It will take a day and be remembered for a century.",
      check: { attr: "might", dc: 14 },
      pass: { text: "It takes until dark and the wood is white as flesh under the axe. Every northman who hears of it will hate you personally.", eff: { notoriety: 20, standing: -18, renown: 6, flags: ["treecutter"], coin: 40 } },
      fail: { text: "The axe turns in your hands and opens your leg to the bone, and the villagers who come running are in no hurry to help.", eff: { health: -28, notoriety: 12 } } },
    { label: "Look at the face for a long time", req: { anyPerk: ["clever", "bookish"] },
      check: { attr: "wits", dc: 15 },
      pass: { text: "You have the strong and unwelcome impression that the looking is not one-way. You leave knowing one thing you did not know, and unable to say how.", eff: { secrets: 1, attr: { wits: 1 }, flags: ["greensight-touched"] } },
      fail: { text: "It is a face cut in a tree. You feel foolish for standing there so long.", eff: {} } },
  ] },

{ id: "watch-recruiter", w: 3, when: { realms: ["north", "riverlands", "vale", "crownlands"], notFlags: ["nights-watch", "sworn"] },
  dm: "A black brother is on the road with three sullen boys in chains and one who came willingly. He is recruiting, which for the Watch means offering the only bargain nobody else will: whatever you have done, it stops mattering at the Wall.",
  opts: [
    { label: "Take the black", hint: "There is no leaving the Watch.",
      res: { text: "He does not congratulate you. He writes your name, gives you a place in the column, and does not ask any of the questions you were braced for.", eff: { flags: ["nights-watch", "sworn", "-wanted", "-outlaw"], notoriety: -30, move: "castle-black" }, goto: "wall-arrival" } },
    { label: "Buy one of the boys free", req: { minCoin: 50 }, cost: { coin: 50 },
      res: { text: "The brother shrugs and unlocks him. The boy stares at you, decides he does not understand, and follows you anyway.", eff: { followers: 1, renown: 2, standing: 2, spared: 1 } } },
    { label: "Ask him what is actually happening up there",
      check: { attr: "charm", dc: 13 },
      pass: { text: "He is quiet a while and then tells you about villages north of the Wall that are empty with the food still on the table. He does not say what he thinks it means.", eff: { secrets: 1, flags: ["heard-of-the-cold"], attr: { wits: 1 } } },
      fail: { text: "He gives you the recruiting speech, and it is the sixth time he has given it today.", eff: {} } },
    { label: "Walk on", res: { text: "The column goes north. One of the boys watches you until the road bends.", eff: {} } },
  ] },

{ id: "wall-arrival", chain: true,
  dm: "Castle Black: a scatter of buildings against seven hundred feet of ice, most of it empty, all of it cold. The Lord Commander is somewhere. The man in front of you is deciding which order you belong to.",
  opts: [
    { label: "Ask for the rangers", hint: "They go beyond the Wall. Some come back.",
      check: { attr: "might", dc: 12 },
      pass: { text: "Ranger. It is the only order anyone actually wants and the only one that regularly does not return.", eff: { flags: ["ranger"], work: "guard", attr: { grit: 1 } } },
      fail: { text: "Builder. You will spend your life carrying stone up a stair made of ice.", eff: { flags: ["builder"], work: "miner", attr: { might: 1 } } } },
    { label: "Ask for the stewards", hint: "The men who feed the Watch, and keep its books.",
      res: { text: "Steward. Half the brothers laugh. The Lord Commander's own steward is a steward, and knows more than any of them.", eff: { flags: ["steward-black"], work: "steward", attr: { wits: 1 } } } },
    { label: "Say nothing and take what you are given",
      res: { text: "Builder. There is a great deal of the Wall and it is always falling down somewhere.", eff: { flags: ["builder"], work: "miner", attr: { grit: 1 } } } },
  ] },

{ id: "wall-desert", w: 2, when: { wild: false, flags: ["nights-watch"], minTurn: 8 },
  dm: "There is a hole in the ice at the eastern end that the builders have not got to, and a horse you could take, and a road south. Desertion from the Watch is death, everywhere, from anybody. It is also very easy.",
  opts: [
    { label: "Go",
      check: { attr: "cunning", dc: 16, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "quick", n: 3 }] },
      pass: { text: "Three days south and nobody behind you. You will be looking over your shoulder for the rest of your life, and every man in the North is licensed to take your head.", eff: { flags: ["-nights-watch", "-sworn", "deserter", "wanted", "watch-deserter"], notoriety: 20, move: { realm: "north" }, attr: { cunning: 1 } } },
      fail: { text: "They take you at the second village. There is a block, and a lord, and no argument to make.", eff: { die: "beheaded as a deserter of the Night's Watch" } } },
    { label: "Stay", res: { text: "You go back to your bunk. In the morning somebody else's bunk is empty, and a week later there is a head on a spike at the gate.", eff: { attr: { grit: 1 }, standing: 2 } } },
    { label: "Report the hole", res: { text: "The builders fill it. Two brothers who were planning to use it look at you across the yard for the next four years.", eff: { standing: 4, flags: ["informer"] } } },
  ] },

{ id: "beyond-the-wall-ranging", w: 4, when: { anyFlag: ["ranger", "freefolk"], anyPlaceTag: ["cold"] },
  dm: "Three days north of anywhere, in a wood where the snow has not been disturbed by anything with two legs. There is a village ahead with smoke coming from one chimney and none from the other nine.",
  opts: [
    { label: "Go in",
      check: { attr: "grit", dc: 15, perkBonus: [{ perk: "cold-blood", n: 3 }, { perk: "wary", n: 3 }] },
      pass: { text: "One old woman, half mad, who will not say what happened to the rest and will not stop looking at the treeline. You get her south. She dies on the road but she talks first.", eff: { secrets: 2, renown: 3, health: -10, flags: ["heard-of-the-cold"], attr: { grit: 1 } } },
      fail: { text: "Whatever emptied the village has not finished. You lose two fingers to the cold and a great deal more to running.", eff: { health: -30, flags: ["heard-of-the-cold"] } } },
    { label: "Watch it from the trees until dark",
      check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "wary", n: 3 }] },
      pass: { text: "Nothing comes out. At moonrise something walks down the single street that does not walk like a man, and you are very glad of the trees.", eff: { secrets: 2, attr: { cunning: 1 }, flags: ["saw-something"], health: -4 } },
      fail: { text: "You fall asleep in the cold, which is how the cold prefers to do it, and wake at dawn barely able to stand.", eff: { health: -24 } } },
    { label: "Burn it and go", res: { text: "You fire the thatch and are two valleys south before the smoke is up. You will never know what was in there.", eff: { health: -6, notoriety: 2 } } },
  ] },

{ id: "wildling-raid", w: 3, when: { realms: ["north", "beyond-the-wall"] },
  dm: "Raiders. Free folk who came over or under or through, moving fast with no baggage, taking what they can carry and whoever will not fight.",
  opts: [
    { label: "Fight them",
      check: { attr: "might", dc: 14, perkBonus: [{ perk: "strong", n: 3 }, { perk: "wolf-blood", n: 2 }] },
      pass: { text: "They do not stay to make a battle of it; that is not how they fight. But two of them do not leave, and the village will feed you for a month.", eff: { renown: 4, kills: 2, coin: 20, health: -12, attr: { might: 1 } } },
      fail: { text: "They are faster than you and better in a wood than anyone you have ever fought.", eff: { health: -26, coin: -30 } } },
    { label: "Talk to them", req: { anyFlag: ["freefolk", "old-gods"] },
      check: { attr: "charm", dc: 15, flagBonus: [{ flag: "freefolk", n: 5 }] },
      pass: { text: "They are running from something that is not you, and they say so, and one of them tells you what.", eff: { secrets: 2, flags: ["heard-of-the-cold", "wildling-friend"], attr: { charm: 1 } } },
      fail: { text: "They do not want to talk. One of them puts an arrow through the meat of your shoulder to establish this.", eff: { health: -18 } } },
    { label: "Hide and let them pass",
      check: { attr: "cunning", dc: 11, perkBonus: [{ perk: "quiet", n: 3 }] },
      pass: { text: "You are under a byre floor for four hours. They take the grain, two women and a boy, and go.", eff: { standing: -3 } },
      fail: { text: "They find you under the byre floor and think it very funny, and take you along for two days before they lose interest.", eff: { health: -14, coin: -20 } } },
    { label: "Join them", req: { anyFlag: ["outlaw", "wanted", "deserter"] },
      res: { text: "They do not care what you were. Nobody up here does. That is rather the point of up here.", eff: { flags: ["freefolk", "wildling-friend", "-wanted"], move: { realm: "beyond-the-wall" }, notoriety: 4, followers: 2 } } },
  ] },

/* ==========================================================================
   6. THE IRON ISLANDS, DORNE, THE REACH, THE VALE
   ========================================================================== */

{ id: "reaving", w: 4, when: { realms: ["iron-islands"], notFlags: ["imprisoned"] },
  dm: "A captain is short of oars and going south. He does not say where. He does not have to; there is only one thing a longship goes south for.",
  opts: [
    { label: "Take an oar",
      check: { attr: "grit", dc: 13, perkBonus: [{ perk: "sea-legs", n: 3 }, { perk: "hardy", n: 2 }] },
      pass: { text: "Eleven days out, four villages, and a hold full of grain, iron and three people who did not want to come. Your share is honest by the standards of a trade with no honest part.", eff: { coin: 110, notoriety: 8, renown: 3, attr: { grit: 1 }, flags: ["reaver"] } },
      fail: { text: "A storm off the Cape takes the mast and six men. You are one of the ones who is bailed out onto a beach.", eff: { health: -22, coin: 10 } } },
    { label: "Take an oar, and pay the iron price for something of your own", req: { minTurn: 6 },
      check: { attr: "might", dc: 16, perkBonus: [{ perk: "strong", n: 3 }, { perk: "cruel", n: 2 }] },
      pass: { text: "You come off that beach with a sword that belonged to a man who was using it, which on these islands is the only kind of owning that counts.", eff: { items: ["good-sword"], coin: 60, renown: 5, kills: 1, notoriety: 8, flags: ["reaver", "iron-price"] } },
      fail: { text: "The man using it was better at using it.", eff: { health: -30, notoriety: 4 } } },
    { label: "Refuse", res: { text: "On these islands a man who will not reave is a man who ploughs, and there is nothing here to plough. They do not forget it.", eff: { standing: -6 } } },
  ] },

{ id: "drowned-priest", w: 2, when: { realms: ["iron-islands"] },
  dm: "A drowned man with salt in his beard and a skin of seawater offers to drown you properly, which is how these islands make a man theirs. Some of the drowned wake up.",
  opts: [
    { label: "Let him do it",
      check: { attr: "grit", dc: 14, perkBonus: [{ perk: "sea-legs", n: 3 }, { perk: "iron-stomach", n: 3 }] },
      pass: { text: "Water, dark, and a long time. Then a beach, and coughing, and a priest saying the words over you. What is dead may never die.", eff: { flags: ["drowned-man"], renown: 3, standing: 6, health: -10, attr: { grit: 2 } } },
      fail: { text: "They get you breathing again after a good deal longer than is usual, and something in your chest is never quite right afterwards.", eff: { health: -26, flags: ["drowned-man"] } } },
    { label: "Refuse", res: { text: "He looks at you the way a man looks at a dropped cup, and moves on down the beach.", eff: { standing: -3 } } },
  ] },

{ id: "dornish-poison", w: 2, when: { realms: ["dorne"] },
  dm: "A woman at the next table has been watching you for an hour, and has just sent over a cup of something the colour of a sunset. In Dorne this is either a compliment or a settlement of accounts, and the two are not always distinguishable.",
  opts: [
    { label: "Drink it",
      check: { attr: "grit", dc: 14, perkBonus: [{ perk: "iron-stomach", n: 4 }] },
      pass: { text: "It is only wine, and very good wine, and she comes over to see what sort of man drinks it. A useful sort of friend to have in Dorne.", eff: { rel: { dornish_lady: 3 }, coin: 20, flags: ["dornish-friend"], attr: { charm: 1 } } },
      fail: { text: "It is not only wine. You are ill for a fortnight and lose most of a stone.", eff: { health: -28 } } },
    { label: "Swap the cups", req: { anyPerk: ["sly", "quick", "quiet"] },
      check: { attr: "cunning", dc: 15 },
      pass: { text: "You are not sure until she drinks it and her face changes. She recovers. She sends no more cups, and speaks well of you afterwards, which in Dorne is a form of respect.", eff: { renown: 2, flags: ["dornish-friend"], attr: { cunning: 1 } } },
      fail: { text: "She watched you do it, and she was never going to drink from either cup.", eff: { health: -20, standing: -4 } } },
    { label: "Leave the cup and the room", res: { text: "You are outside before you have finished thinking about it. Whether that was cowardice or sense is a question for later.", eff: { standing: -1 } } },
    { label: "Ask her, plainly, what is in it",
      check: { attr: "charm", dc: 13 },
      pass: { text: "She laughs for a long time, tells you, and drinks it herself. You have made a friend by being the only person all year who asked.", eff: { flags: ["dornish-friend"], items: ["poison"], attr: { charm: 1 } } },
      fail: { text: "'Wine,' she says, and watches you, and you have now insulted a Dornishwoman in public.", eff: { standing: -5 } } },
  ] },

{ id: "citadel-offer", w: 2, once: true, when: { realms: ["reach"], anyPerk: ["lettered", "clever", "bookish"], notFlags: ["maester"] },
  dm: "An archmaester with ink to the elbow has been listening to you argue with a merchant about the price of parchment, and has concluded that you are wasted. The Citadel will take you. It will also keep you.",
  opts: [
    { label: "Go, and forge a chain",
      res: { text: "Years of it. Iron for ravenry, silver for healing, and one black link because you would not leave the histories alone. You come out with a chain and no family and no name but your own.", eff: { flags: ["maester", "sworn-celibate", "sworn"], items: ["chain"], attr: { wits: 3 }, standing: 12, age: 4, work: "scribe", secrets: 2 } } },
    { label: "Learn only what is useful, and leave", cost: { coin: 30 },
      check: { attr: "wits", dc: 14 },
      pass: { text: "Two years of somebody else's library, and then out of the gate with a great deal in your head that the Citadel would rather stayed inside it.", eff: { attr: { wits: 2, cunning: 1 }, secrets: 2, age: 2, flags: ["half-lettered"] } },
      fail: { text: "You are found out at the end of the second year and put out of the gate with nothing but the reputation.", eff: { standing: -6, age: 2, attr: { wits: 1 } } } },
    { label: "Decline", res: { text: "He is baffled, and says so, and goes back to his ink.", eff: {} } },
  ] },

{ id: "mountain-clans", w: 3, when: { realms: ["vale"], anyPlaceTag: ["mountain", "wild"] },
  dm: "The high road, and men on the rocks above it who have been robbing this road since before the Andals came. They are not hiding. They want you to see how many there are.",
  opts: [
    { label: "Pay the toll", req: { minCoin: 25 }, cost: { coin: 25 },
      res: { text: "It is a business arrangement of great antiquity. They take the coin, name you a friend of the Stone Crows for the length of the valley, and are perfectly polite about it.", eff: { flags: ["clan-friend"] } } },
    { label: "Fight through",
      check: { attr: "might", dc: 17, perkBonus: [{ perk: "strong", n: 3 }, { perk: "cold-blood", n: 3 }], followerBonus: { per: 3, max: 5 } },
      pass: { text: "They break off after the third man goes down the scree. Word gets about the mountains, and word in the mountains is faster than any raven.", eff: { renown: 6, kills: 2, health: -20, attr: { might: 1 } } },
      fail: { text: "They come down all at once and take everything, and are unhurried about it.", eff: { health: -28, coin: -9999 } } },
    { label: "Hire them", req: { minCoin: 120 }, cost: { coin: 120 },
      check: { attr: "charm", dc: 15, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "Nobody has ever offered them a wage before. Thirty of them come down off the rocks and follow you out of the mountains, which alarms every village you pass.", eff: { followers: 20, renown: 5, notoriety: 6, flags: ["clan-friend"], attr: { charm: 1 } } },
      fail: { text: "They take the coin as a toll and thank you for it.", eff: { standing: -3 } } },
  ] },

/* ==========================================================================
   7. ESSOS — chains, banks, bravos, khals
   ========================================================================== */

{ id: "the-block", w: 4, when: { placeTags: ["slave"], notFlags: ["enslaved"] },
  dm: "The auction block. A boy is being sold in front of you and the bidding is unhurried and businesslike, and the boy has stopped crying because crying does not help.",
  opts: [
    { label: "Buy him and free him", req: { minCoin: 90 }, cost: { coin: 90 },
      res: { text: "The clerk is baffled by the request and charges you extra to record it. The boy does not go anywhere. He waits by the door for you, because he has nowhere else and now no owner to tell him.", eff: { followers: 1, spared: 1, renown: 3, flags: ["freedman-friend"], standing: -4 } } },
    { label: "Buy him and use him", req: { minCoin: 90 }, cost: { coin: 90 },
      res: { text: "He works, and eats, and does not look at you. In this city that is simply what a household is, and you now have one.", eff: { followers: 1, standing: 6, flags: ["slaver"], notoriety: 4 } } },
    { label: "Start something", hint: "There are four hundred slaves in this square and eleven guards.",
      check: { attr: "charm", dc: 18, perkBonus: [{ perk: "silver", n: 4 }, { perk: "cruel", n: 2 }], followerBonus: { per: 4, max: 5 } },
      pass: { text: "You say eleven words in a language most of them barely speak. The square goes up like a barn. By nightfall you are somewhere else, with fifty people who will not leave you, and the Good Masters have your description.", eff: { followers: 40, renown: 14, notoriety: 25, flags: ["wanted", "breaker-of-chains"], health: -16, attr: { charm: 2 } } },
      fail: { text: "Nobody moves. The guards do. You are taken, and the block has a use for people who make speeches at it.", eff: { flags: ["enslaved"], jail: 3, health: -20 }, goto: "enslaved-life" } },
    { label: "Watch, and do nothing", res: { text: "He is sold to a man in yellow. You have seen four hundred of these and you will see four hundred more.", eff: { standing: 1, attr: { grit: 1 } } } },
  ] },

{ id: "enslaved-life", chain: true,
  dm: "A collar, a number, and a man who owns the hours of your day. There is a way out of this. There is always a way out; it is only that most of them kill you.",
  opts: [
    { label: "Work, watch, and wait",
      check: { attr: "grit", dc: 13, perkBonus: [{ perk: "hardy", n: 3 }, { perk: "quiet", n: 3 }] },
      pass: { text: "Two years. You learn the house, the guards, the accounts and three languages, and nobody notices you learning any of it.", eff: { age: 2, attr: { wits: 1, cunning: 2, grit: 1 }, secrets: 1, flags: ["knows-the-house"] } },
      fail: { text: "Two years, and they are exactly as bad as two years of that can be.", eff: { age: 2, health: -25, attr: { grit: 2 } } } },
    { label: "Run",
      check: { attr: "swiftness", dc: 16, perkBonus: [{ perk: "quick", n: 3 }, { perk: "quiet", n: 3 }] },
      pass: { text: "Over a wall, into a drain, out of a city that has walls precisely to prevent this. You are free, filthy, and worth money to anyone who recognises the collar-mark.", eff: { flags: ["-enslaved", "wanted", "freedman"], notoriety: 8, health: -14, attr: { swiftness: 1 } } },
      fail: { text: "They have dogs for this and a great deal of practice. What they do to you afterwards is designed to be seen by everybody else.", eff: { health: -34, attr: { grit: 1 } } } },
    { label: "Kill the man who owns you", hint: "It will not go unanswered.",
      check: { attr: "cunning", dc: 17, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "sly", n: 3 }], flagBonus: [{ flag: "knows-the-house", n: 4 }] },
      pass: { text: "Nobody in that house says a word. Half of them help you out of the city. The other half take what they can carry and go their own way, and the whole quarter is talking of it by morning.", eff: { flags: ["-enslaved", "freedman", "killer", "wanted"], kills: 1, notoriety: 18, renown: 8, followers: 4, coin: 120 } },
      fail: { text: "You are caught with the knife, and the city has an entire vocabulary for what happens next.", eff: { die: "killed for the murder of your master" } } },
    { label: "Make yourself indispensable", req: { attr: { wits: 6 } },
      check: { attr: "wits", dc: 15 },
      pass: { text: "You end up running his accounts, then his warehouses, then in practice his business. You still wear the collar. You have simply made it the least important thing about you.", eff: { attr: { wits: 2, charm: 1 }, coin: 80, standing: 8, flags: ["trusted-slave"], secrets: 2 } },
      fail: { text: "He finds your ambition amusing and tells his friends about it at dinner, with you standing behind his chair.", eff: { standing: -2, attr: { grit: 1 } } } },
  ] },

{ id: "sellsword-company", w: 4, when: { sides: ["essos"], notFlags: ["sworn", "enslaved"] },
  dm: "A free company is drinking its way through a contract in this city — a few hundred horse, a name with some history to it, and a paymaster with a table in the corner.",
  opts: [
    { label: "Sign on",
      res: { text: "The contract is read out in three languages and none of them makes it sound better. There is coin on the table, and a horse if you can ride.", eff: { flags: ["sellsword", "sworn", "company"], coin: 40, items: ["horse"], attr: { might: 1 } } } },
    { label: "Sign on and start climbing", req: { minRenown: 5 },
      check: { attr: "charm", dc: 15, perkBonus: [{ perk: "silver", n: 3 }, { perk: "duellist", n: 2 }] },
      pass: { text: "Within a season you have a lance of your own — twenty men who take your word for things. Free companies rise fast, because so many of them keep dying.", eff: { flags: ["sellsword", "sworn", "company", "officer"], followers: 18, coin: 60, renown: 4 } },
      fail: { text: "The serjeant takes against you immediately and permanently, and you spend the season with the baggage.", eff: { flags: ["sellsword", "sworn"], coin: 20, standing: -3 } } },
    { label: "Sell the company's plans to the other side", req: { anyPerk: ["sly", "clever"] }, hint: "This is how half of Essos is decided.",
      check: { attr: "cunning", dc: 16 },
      pass: { text: "The contract changes hands twice in one night, which in the Disputed Lands is considered normal practice by everyone except the men who die of it.", eff: { coin: 300, notoriety: 12, secrets: 1, flags: ["turncloak"], attr: { cunning: 1 } } },
      fail: { text: "The captain has done this longer than you have been alive and knew what you were before you did.", eff: { health: -26, notoriety: 8 } } },
  ] },

{ id: "iron-bank", w: 2, when: { places: ["braavos", "iron-bank", "ragmans-harbor"], minTurn: 4 },
  dm: "The Iron Bank will see you. This is not a compliment; it is a category. They see anyone who might one day owe them something, which is a category containing most of the world.",
  opts: [
    { label: "Borrow", req: { maxCoin: 200 },
      res: { text: "They lend readily and at terms that seem generous until you do the arithmetic on the way out. You have money. You now also have a creditor with no sense of humour.", eff: { coin: 500, flags: ["indebted"], standing: 4 } } },
    { label: "Deposit what you have", req: { minCoin: 200 },
      res: { text: "A receipt on thick paper. Wherever you go in the world, that paper is money — which is worth rather more than the money.", eff: { coin: -200, flags: ["bank-credit"], standing: 6, items: ["letters"] } } },
    { label: "Ask them for work",
      check: { attr: "wits", dc: 16, perkBonus: [{ perk: "clever", n: 3 }, { perk: "lettered", n: 3 }] },
      pass: { text: "They have debtors in Westeros who have stopped writing back. They would like someone unremarkable to go and find out why.", eff: { coin: 120, flags: ["bank-agent"], items: ["letters"], secrets: 1, attr: { wits: 1 } } },
      fail: { text: "The keyholder listens to you for a full minute, which is a long time, and then does not.", eff: { standing: -2 } } },
    { label: "Leave before they learn your name", res: { text: "A wise instinct. The Iron Bank forgets nothing, and its memory is written down.", eff: {} } },
  ] },

{ id: "bravo-duel", w: 3, when: { places: ["braavos", "ragmans-harbor"] },
  dm: "A young man in mismatched silks steps into your path on a bridge and asks, with enormous courtesy, whose beauty you would care to defend tonight. This is not a threat. It is, however, a duel.",
  opts: [
    { label: "Name a name and draw",
      check: { attr: "swiftness", dc: 16, perkBonus: [{ perk: "duellist", n: 4 }, { perk: "quick", n: 3 }] },
      pass: { text: "The water dance is all footwork and you have never seen it before, and you win anyway, which everyone on the bridge finds delightful. He bleeds cheerfully and buys you a drink.", eff: { renown: 4, health: -8, flags: ["bravo-friend"], attr: { swiftness: 1 } } },
      fail: { text: "He is very fast, very young and very good, and he opens your cheek to the bone and apologises while doing it.", eff: { health: -20, standing: -2 } } },
    { label: "Refuse with grace",
      check: { attr: "charm", dc: 13, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "You praise a woman he has also admired, at length, and he decides that killing you would be a waste of an evening.", eff: { flags: ["bravo-friend"], attr: { charm: 1 } } },
      fail: { text: "He takes the refusal as an insult to the lady, which she would be surprised to hear, and cuts you for it.", eff: { health: -14 } } },
    { label: "Push him in the canal", req: { anyPerk: ["big", "strong", "sly"] },
      check: { attr: "might", dc: 12 },
      pass: { text: "It is entirely against the spirit of the thing. The bridge laughs for a week and so, eventually, does he.", eff: { renown: 2, flags: ["bravo-friend"], attr: { might: 1 } } },
      fail: { text: "He is not there when your hands arrive, and you are, briefly, in the canal.", eff: { health: -6, standing: -4 } } },
  ] },

{ id: "faceless-offer", w: 1, once: true, when: { places: ["braavos", "house-black-white", "ragmans-harbor"], minNotoriety: 10 },
  dm: "Somebody has left an iron coin on your table. Nobody was near the table. There is a temple of black and white wood on a hill, and everyone in this city knows what it does and nobody discusses it.",
  opts: [
    { label: "Take the coin to the temple",
      check: { attr: "grit", dc: 17, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "quiet", n: 3 }] },
      pass: { text: "They ask you to give up your name. You say yes, and mean it, and discover over the following years that this was the easy part.", eff: { flags: ["faceless", "sworn"], items: ["coin-faceless"], attr: { cunning: 3, swiftness: 2 }, age: 3, renown: -10, standing: -10, secrets: 3 } },
      fail: { text: "They ask you to give up your name, and something in you refuses, and they show you the door with great gentleness. You will not be asked twice.", eff: { attr: { grit: 1 }, secrets: 1 } } },
    { label: "Keep the coin and use it once", res: { text: "You put it away. One day you will hand it to somebody with a name, and something will happen, and it will not be undone.", eff: { items: ["coin-faceless"], secrets: 1 } } },
    { label: "Throw it in the canal", res: { text: "It goes in without a splash you can hear. You feel watched for a month.", eff: { attr: { grit: 1 } } } },
  ] },

{ id: "khalasar", w: 3, when: { realms: ["dothraki-sea"] },
  dm: "Forty thousand riders and their herds are coming across the grass, and there is nowhere to be that is not in front of them. A bloodrider has ridden out to look at you, on a horse worth more than your life.",
  opts: [
    { label: "Stand still and meet his eye",
      check: { attr: "grit", dc: 15, perkBonus: [{ perk: "cold-blood", n: 4 }] },
      pass: { text: "He decides you are not prey, which out here is the only distinction that exists. You are taken to the khal's fire and fed, and nobody kills you, which is a form of welcome.", eff: { flags: ["khalasar-guest"], renown: 2, attr: { grit: 1 } } },
      fail: { text: "He decides otherwise. You are taken along on a rope for eleven days and sold at the end of it.", eff: { flags: ["enslaved"], health: -20 }, goto: "enslaved-life" } },
    { label: "Show him you can ride", req: { anyPerk: ["rider"] },
      check: { attr: "swiftness", dc: 14, perkBonus: [{ perk: "rider", n: 4 }], itemBonus: [{ item: "horse", n: 3 }] },
      pass: { text: "Among the Dothraki this is the entire vocabulary of respect, and you have just spoken it fluently. You ride with them for a season and are given a horse of your own at the end of it.", eff: { flags: ["khalasar-guest", "bloodrider-friend"], items: ["horse"], renown: 4, attr: { swiftness: 1 } } },
      fail: { text: "You are thrown in front of the entire khalasar, which is the funniest thing to happen to them all month.", eff: { health: -12, standing: -4 } } },
    { label: "Run",
      check: { attr: "swiftness", dc: 18, itemBonus: [{ item: "horse", n: 4 }] },
      pass: { text: "You are on the only patch of broken ground for fifty miles and they do not think you worth the ride. It is not a triumph but you are alive.", eff: { health: -10, move: "random" } },
      fail: { text: "Nobody outruns the Dothraki on the Dothraki sea. Nobody has ever outrun them there.", eff: { flags: ["enslaved"], health: -18 }, goto: "enslaved-life" } },
  ] },

{ id: "fighting-pit", w: 4, when: { realms: ["slavers-bay"], anyFlag: ["enslaved", "freedman"], },
  dm: "Daznak's Pit, and twenty thousand people who have paid to watch. Somewhere behind the gate opposite is a man who has been told the same thing you have: only one of you is going back through it.",
  opts: [
    { label: "Fight",
      check: { attr: "might", dc: 16, perkBonus: [{ perk: "strong", n: 3 }, { perk: "duellist", n: 3 }, { perk: "cold-blood", n: 2 }] },
      pass: { text: "It takes four minutes and twenty thousand people learn a name for you that is not the name you were born with. You are worth a great deal more than you were this morning.", eff: { renown: 10, kills: 1, coin: 60, health: -20, flags: ["pit-fighter"], attr: { might: 1 } } },
      fail: { text: "He is better. He is not, in the end, much better, and the crowd calls for you to be spared, and the man in the box considers it for a long moment.", eff: { health: -35, renown: 3, spared: 0 } } },
    { label: "Fight, and then refuse to finish him",
      check: { attr: "might", dc: 17, perkBonus: [{ perk: "strong", n: 3 }, { perk: "honest", n: 3 }] },
      pass: { text: "You put him down and then put the sword down, and twenty thousand people make a sound you will hear for the rest of your life. Half of it is fury and half of it is something else.", eff: { renown: 14, spared: 1, health: -22, coin: 30, flags: ["pit-fighter", "merciful"], attr: { might: 1, charm: 1 } } },
      fail: { text: "The mercy is not returned and you are opened from hip to shoulder for the trouble.", eff: { health: -40, renown: 5, spared: 1 } } },
    { label: "Go for the box instead of the man", hint: "The men who own you are twenty feet up and unguarded.",
      check: { attr: "swiftness", dc: 19, perkBonus: [{ perk: "quick", n: 4 }, { perk: "cold-blood", n: 3 }] },
      pass: { text: "You are up the wall before the sand has settled. The pit does not know whether to scream or cheer and does both. Nothing in this city is the same afterwards.", eff: { kills: 1, renown: 20, notoriety: 25, flags: ["wanted", "breaker-of-chains", "-enslaved"], health: -25, followers: 10 } },
      fail: { text: "The spearmen on the wall are there precisely for this and have done it before.", eff: { die: "speared on the wall of Daznak's Pit" } } },
  ] },

/* ==========================================================================
   8. AMBITION-FLAVOURED AND LATE-GAME
   ========================================================================== */

{ id: "the-council-seat", w: 2, ambition: "power", when: { minStanding: 45, minRenown: 25, anyPlaceTag: ["court"] },
  dm: "There is a seat empty at somebody's council table — a lord's, a king's, a magister's — and for reasons which are half merit and half the fact that the previous occupant is dead, your name is being said in connection with it.",
  opts: [
    { label: "Take it and be useful",
      check: { attr: "wits", dc: 16, perkBonus: [{ perk: "clever", n: 3 }, { perk: "lettered", n: 3 }] },
      pass: { text: "You are good at it, which surprises several people including you. Within a year nothing of consequence is decided without you in the room.", eff: { standing: 20, renown: 8, coin: 200, title: "Councillor", flags: ["councillor"], attr: { wits: 1 } } },
      fail: { text: "You are out of your depth and everyone at that table has been swimming since childhood. You last four months.", eff: { standing: -8, renown: 2, secrets: 1 } } },
    { label: "Take it and use it",
      check: { attr: "cunning", dc: 16, perkBonus: [{ perk: "sly", n: 4 }] },
      pass: { text: "Appointments, contracts, the movement of grain — a council seat is a hundred small levers and you pull every one of them for a year before anyone thinks to check.", eff: { coin: 700, standing: 12, notoriety: 8, flags: ["councillor", "corrupt"], secrets: 2, attr: { cunning: 1 } } },
      fail: { text: "The steward keeps better books than you assumed. You leave the table one step ahead of a very unpleasant conversation.", eff: { standing: -14, notoriety: 10, flags: ["wanted"] } } },
    { label: "Refuse it", res: { text: "You give a reason nobody believes. The seat goes to a fool, which is often what seats are for.", eff: { standing: -4, renown: 1 } } },
  ] },

{ id: "the-crown-offered", w: 1, once: true, ambition: "power",
  when: { wild: false, minFollowers: 120, minRenown: 70, flags: ["founded-house"] },
  dm: "Your men have started saying a word out loud that they used to only say when drunk. There is no king in this part of the world at present who can stop them saying it, which is precisely why they have started.",
  opts: [
    { label: "Let them crown you",
      check: { attr: "charm", dc: 20, followerBonus: { per: 15, max: 8 }, flagBonus: [{ flag: "knight", n: 3 }, { flag: "lord", n: 4 }] },
      pass: { text: "It is done in a field, with a circle of hammered iron, and it is ridiculous and it is real. You are a king. Somebody, somewhere, is already writing the letter that ends this.", eff: { title: "King", flags: ["king"], standing: 40, renown: 40, followers: 60, holding: "a crown" } },
      fail: { text: "Half of them cheer and half of them go very quiet, and the quiet half are the ones with the land. By spring you have neither the crown nor the half.", eff: { followers: -40, standing: -20, renown: 5 } } },
    { label: "Refuse the crown and keep the men",
      res: { text: "You tell them what happens to kings, at length, using names they know. They love you slightly more for it, which is exactly the problem.", eff: { renown: 10, followers: 10, standing: 8, flags: ["refused-crown"] } } },
    { label: "Find the man with the best claim and put him on it instead",
      check: { attr: "cunning", dc: 17 },
      pass: { text: "He is nineteen, biddable, and has a great-grandmother who married correctly. He wears the crown; you hold the seal. It is a far better arrangement than the crown.", eff: { title: "Hand", flags: ["kingmaker"], standing: 34, renown: 18, coin: 500, followers: 25, attr: { cunning: 2 } } },
      fail: { text: "He turns out to have opinions. Within the year he has other advisers and you have a long ride home.", eff: { standing: -10, renown: 4 } } },
  ] },

{ id: "old-enemy", w: 2, ambition: "vengeance", when: { wild: false, minTurn: 12, minRenown: 10, notFlags: ["avenged"] },
  dm: "You have found them. It took years and a great deal of asking the wrong people carefully. They are older than you remembered and they are alone.",
  opts: [
    { label: "Kill them",
      check: { attr: "might", dc: 14, perkBonus: [{ perk: "cold-blood", n: 3 }, { perk: "wolf-blood", n: 3 }] },
      pass: { text: "It is done. It is much shorter than the years of getting here, and afterwards you stand in the room for a while, waiting for something that does not arrive.", eff: { kills: 1, flags: ["avenged"], notoriety: 8, renown: 4, attr: { grit: 1 } } },
      fail: { text: "They are still, it turns out, dangerous. You leave with a wound and the knowledge that they now know you are looking.", eff: { health: -25, flags: ["hunted"] } } },
    { label: "Ruin them instead", req: { anyPerk: ["sly", "clever", "connected"] },
      check: { attr: "cunning", dc: 16 },
      pass: { text: "It takes a season, three letters and one well-placed lie. They lose the land, the name and the household, and live a long time afterwards.", eff: { flags: ["avenged"], renown: 5, secrets: 1, attr: { cunning: 2 } } },
      fail: { text: "The lie is traced back. You have made an enemy who is now paying attention.", eff: { standing: -10, flags: ["hunted"] } } },
    { label: "Let it go", res: { text: "You walk out and do not go back. It is the hardest thing you have done and nobody will ever know you did it.", eff: { flags: ["avenged", "let-it-go"], attr: { grit: 2, wits: 1 }, health: 10, renown: -2 } } },
  ] },

{ id: "the-hoard", w: 2, ambition: "gold", when: { wild: false, minCoin: 600, minTurn: 10 },
  dm: "You have more coin than you can carry and nowhere it is truly safe. This is a better problem than the one you had, and it is still a problem.",
  opts: [
    { label: "Buy land", cost: { coin: 500 },
      check: { attr: "wits", dc: 13 },
      pass: { text: "Fields, a mill and eleven households who now owe you rent. It is duller than gold and it does not get stolen.", eff: { holding: "a mill and its fields", standing: 14, flags: ["landed"], attr: { wits: 1 } } },
      fail: { text: "The title is bad, the previous claimant is alive, and you spend three years finding this out.", eff: { coin: -500, standing: -4 } } },
    { label: "Buy a ship", cost: { coin: 400 }, req: { anyPlaceTag: ["port"] },
      res: { text: "A cog, twelve hands and a captain who is only mostly honest. The sea is where money multiplies and where it drowns.", eff: { items: ["ship"], flags: ["shipowner"], standing: 8 } } },
    { label: "Lend it out at interest",
      check: { attr: "cunning", dc: 14 },
      pass: { text: "Half the town owes you now. Being owed is a form of power that requires no sword at all.", eff: { coin: 300, standing: 8, flags: ["moneylender"], notoriety: 4, attr: { cunning: 1 } } },
      fail: { text: "The biggest of your debtors dies, and his heirs have never heard of you, and the courts are for people with better names.", eff: { coin: -300 } } },
    { label: "Bury it and tell nobody", res: { text: "There is a stone, and a count of paces, and it is entirely safe forever, which is another way of saying it is now doing nothing at all.", eff: { flags: ["buried-hoard"], coin: -300 } } },
  ] },

{ id: "the-song", w: 2, ambition: "glory", when: { wild: false, minRenown: 30 },
  dm: "A singer has written a song about something you did. He has got most of it wrong, improved the parts he got right, and it is being sung in three towns.",
  opts: [
    { label: "Pay him to sing it everywhere", cost: { coin: 60 },
      res: { text: "By autumn it is in every inn between here and the sea, and people you have never met are certain they know what you are like.", eff: { renown: 12, standing: 6, flags: ["sung-of"] } } },
    { label: "Correct him",
      check: { attr: "charm", dc: 13 },
      pass: { text: "He listens, and rewrites it, and the true version is better than the invented one, which does not always happen.", eff: { renown: 6, standing: 4, attr: { charm: 1 } } },
      fail: { text: "He writes a second song, about a humourless man who corrects singers.", eff: { renown: 3, standing: -4 } } },
    { label: "Break his fingers", req: { anyPerk: ["cruel"] },
      res: { text: "The song stops. A different song starts, and this one spreads faster, and there is nothing in it you would want repeated.", eff: { renown: 5, notoriety: 12, standing: -8 } } },
  ] },

{ id: "the-secret", w: 2, ambition: "knowledge", when: { wild: false, minTurn: 8, anyPerk: ["clever", "lettered", "bookish", "wary"] },
  dm: "You have been pulling at a thread for two years — a name in a ledger, a date that does not work, a man who was in two places. Tonight there is a room you could be in, with the rest of it on a table.",
  opts: [
    { label: "Go in and read it all",
      check: { attr: "wits", dc: 16, perkBonus: [{ perk: "lettered", n: 4 }, { perk: "clever", n: 3 }] },
      pass: { text: "You read until it is light. What it says is worse than what you suspected and considerably more useful, and you are now one of perhaps four people alive who know it.", eff: { secrets: 2, attr: { wits: 2 }, flags: ["dangerous-knowledge"], renown: 2 } },
      fail: { text: "Somebody comes back for a cloak. You are out of the window with two pages and a bad idea of what the rest said.", eff: { secrets: 1, health: -8, flags: ["hunted"] } } },
    { label: "Sell what you already have", req: { minTurn: 10 },
      check: { attr: "cunning", dc: 14 },
      pass: { text: "A man in a plain cloak pays four times what you asked, which tells you your price was far too low.", eff: { coin: 400, secrets: 1, flags: ["dangerous-knowledge"], attr: { cunning: 1 } } },
      fail: { text: "The man in the plain cloak works for the person the secret is about.", eff: { flags: ["hunted"], health: -14 } } },
    { label: "Burn what you have and forget it",
      res: { text: "It is the safest thing you have ever done and you will think about it for the rest of your life.", eff: { flags: ["-dangerous-knowledge", "-hunted"], attr: { grit: 1 }, health: 6 } } },
  ] },

{ id: "hunted-down", w: 3, when: { wild: false, flags: ["hunted"] },
  dm: "They have found you. Two of them, in a town where you had begun to relax, and they are not in a hurry because they have already looked at the exits.",
  opts: [
    { label: "Fight",
      check: { attr: "might", dc: 15, perkBonus: [{ perk: "duellist", n: 3 }, { perk: "cold-blood", n: 3 }], itemBonus: [{ item: "sword", n: 2 }] },
      pass: { text: "Two is not enough, and whoever sent them will know that now.", eff: { kills: 2, health: -18, notoriety: 6, flags: ["-hunted"], renown: 3 } },
      fail: { text: "Two is quite enough.", eff: { health: -40, coin: -9999 } } },
    { label: "Run", check: { attr: "swiftness", dc: 14, perkBonus: [{ perk: "quick", n: 3 }] },
      pass: { text: "Over a roof, down an alley, into a cart. You are three realms away before you sleep properly.", eff: { move: "random", health: -6, attr: { swiftness: 1 } } },
      fail: { text: "There was a third one, at the end of the alley, which is why the first two were not in a hurry.", eff: { health: -32 } } },
    { label: "Buy them", req: { minCoin: 150 }, cost: { coin: 150 },
      check: { attr: "charm", dc: 14 },
      pass: { text: "They are professionals, and professionals have a price, and it is lower than you feared. They will report you dead.", eff: { flags: ["-hunted"], attr: { cunning: 1 } } },
      fail: { text: "They take the coin. They also take the contract seriously.", eff: { coin: -150, health: -28 } } },
  ] },

/* ==========================================================================
   9. FILLERS — so the world never runs dry
   ========================================================================== */

{ id: "quiet-season", w: 2, filler: true, when: { wild: false,},
  dm: "Nothing much happens. The season turns, the work gets done, and for once nobody wants anything from you.",
  opts: [
    { label: "Rest", res: { text: "You sleep properly for the first time in a long while.", eff: { health: 12 } } },
    { label: "Train at arms", res: { text: "Two hours a day at a post in the yard. It is dull and it works.", eff: { attr: { might: 1 }, health: -2 } } },
    { label: "Learn something", res: { text: "You find somebody who knows a thing and pester them until you know it too.", eff: { attr: { wits: 1 } } } },
    { label: "Drink the season away", res: { text: "It is a good season and you will not remember most of it.", eff: { coin: -12, health: -4, attr: { charm: 1 } } } },
  ] },

{ id: "rumours", w: 3, filler: true, when: { anyPlaceTag: ["town", "city", "market", "port", "village"] },
  dm: "The common room is full of news, most of it wrong. A king is dead, or a lord is, or nobody is; a fleet has sailed; there is a comet, or was; and something is happening in the north that three men will not talk about.",
  opts: [
    { label: "Listen carefully",
      check: { attr: "wits", dc: 12 },
      pass: { text: "You sort the four true things from the forty invented ones, and one of the four is worth knowing.", eff: { secrets: 1, attr: { wits: 1 } } },
      fail: { text: "You believe the wrong one, confidently, and repeat it for a month.", eff: { standing: -2 } } },
    { label: "Add a rumour of your own", req: { anyPerk: ["sly", "silver"] },
      check: { attr: "cunning", dc: 12 },
      pass: { text: "By the third town it has grown a dragon and your own name has come off it entirely, which is exactly what you wanted.", eff: { attr: { cunning: 1 }, renown: 2 } },
      fail: { text: "It is traced back to you within a week, in a small town where everyone knows everyone.", eff: { standing: -4, notoriety: 3 } } },
    { label: "Buy the loudest man a drink and let him talk", cost: { coin: 3 },
      res: { text: "He talks for two hours. Eleven minutes of it are useful.", eff: { secrets: 1 } } },
  ] },

{ id: "a-good-year", w: 2, filler: true, when: { wild: false, minCoin: 30, notFlags: ["imprisoned"] },
  dm: "Things go well. The work pays, nobody dies, and you find you have coin at the end of the season for the first time in a long while.",
  opts: [
    { label: "Put it away", res: { text: "It is not much. It is more than none.", eff: { coin: 30 } } },
    { label: "Buy arms", cost: { coin: 40 }, req: { minCoin: 40 },
      res: { text: "A sword that is honestly made, from a smith who did not lie about it.", eff: { items: ["sword"], standing: 2 } } },
    { label: "Buy a horse", cost: { coin: 70 }, req: { minCoin: 70 },
      res: { text: "Not a good horse. A horse.", eff: { items: ["horse"], standing: 3 } } },
    { label: "Spend it on other people", cost: { coin: 25 },
      res: { text: "A feast of sorts, for whoever is nearby. It buys nothing measurable and everyone remembers it.", eff: { renown: 2, standing: 3, followers: 1 } } },
  ] },

];
