/* ============================================================================
   THE IRON LADDER — SCENES OF THE STREET, THE MARKET AND THE TOWN.

   Everything here is gated on what a place actually IS. A scene about a
   pot-shop cannot fire in a hamlet of nine houses; a scene about a hamlet of
   nine houses cannot fire in Braavos; and a scene about being robbed for
   looking rich cannot fire on a man in rags.

   HOW TO WRITE ONE SO IT BELONGS SOMEWHERE:

     when.amenities     what the place must HAVE (crowd, market, inn, brothel,
                        smith, harbour, temple, watch, hall...). This is the
                        first thing to reach for. It is derived from the tags
                        in data-world.js, so it is right for all one hundred
                        and forty places at once, including the ones built out
                        of a click on empty ground.
     when.anyPlaceTag   what KIND of place. poor/rich/crime/city/village.
     when.minCoin       who you are. A scene that only happens to a man with a
                        full purse belongs behind minCoin, not behind an
                        apology in the prose.

   AND THEN NAME THINGS. {spot} is a real corner of this place, {holder} the
   house that holds it, {lord} the man who sits in the hall, {folk} somebody
   who lives here, {dish} and {drink} what is put in front of you. All of them
   come out of data-flavour.js and all of them are stable for the length of a
   scene, so the outcome may safely name whoever the opening line named.

   NOTHING REPEATS. The engine takes the unseen events as the whole pool while
   any are left (see nextScene), so an event does not need `once: true` to stop
   happening twice — write it as though it may happen anywhere it fits, and
   the deck will not repeat it until it has run out of everything else.
   ========================================================================== */

window.IL_EVENTS = (window.IL_EVENTS || []).concat([

/* ==========================================================================
   BEING SOMEBODY IN A STREET FULL OF PEOPLE
   ========================================================================== */

/* GATED ON WHAT YOU LOOK LIKE, NOT WHAT YOU HAVE. A purse is invisible; a
   good cloak is not. A man with three hundred stags sewn into a torn tunic is
   a beggar with a secret, and this street treats him like one. See look() in
   engine.js — the way to be robbed for looking rich is to go and buy clothes. */
{ id: "t-rich-in-a-poor-street", w: 5, demand: true,
  when: { wild: false, amenities: ["crowd"], anyPlaceTag: ["poor", "crime"], minLook: 8 },
  dm: "You are the best-dressed thing on {spot} by a distance, and it has been noticed. Two of them come at you from the front to be looked at, which means there is a third.",
  opts: [
    { label: "Get your back to a wall before they close",
      check: { attr: "wits", dc: 12, perkBonus: [{ perk: "wary", n: 4 }, { perk: "quick", n: 2 }] },
      pass: { text: "You are against brick before the third one has finished coming round. He stops. They all stop. Then they are three men in a street who happen to be standing near you.", eff: { attr: { wits: 1 }, notoriety: 1 } },
      fail: { text: "The third one is behind you before you have thought about a third one, and your purse is four streets away by the time you turn round.", eff: { coin: -80, health: -6 } } },
    { label: "Hand over the purse and keep the rest",
      res: { text: "You give it up without a word, which surprises them into being almost polite about it. What is sewn into your coat is still in your coat.", eff: { coin: -55, spared: 1, attr: { cunning: 1 } } } },
    { label: "Draw on them", req: { armed: true },
      check: { attr: "might", dc: 13, perkBonus: [{ perk: "duellist", n: 3 }, { perk: "cold-blood", n: 3 }] },
      pass: { text: "Steel changes the arithmetic of a street instantly and permanently. They go, and the going is watched, and by evening this quarter has decided something about you.", eff: { renown: 3, notoriety: 4, standing: 1 } },
      fail: { text: "Three is three. You cut one of them and the other two take everything, including the sword.", eff: { coin: -100, health: -20, items: ["-sword", "-good-sword", "-knife"] } } },
    { label: "Say something so odd that they hesitate", req: { anyPerk: ["silver", "sly"] },
      check: { attr: "charm", dc: 13, perkBonus: [{ perk: "silver", n: 4 }] },
      pass: { text: "You ask them, warmly, whether they are {folk}'s men, and give a name they half recognise, and by the time they have decided you are lying you are not there.", eff: { attr: { charm: 1 }, secrets: 1 } },
      fail: { text: "They wait politely until you have finished and then rob you.", eff: { coin: -70, health: -4 } } },
  ] },

{ id: "t-poor-in-a-rich-street", w: 4,
  when: { wild: false, amenities: ["crowd"], anyPlaceTag: ["rich", "court", "city"], maxLook: 3 },
  dm: "You are the worst-dressed thing on {spot} and the street has arranged itself around that fact. A guard of {holder}'s has been watching you for a while now and has begun to walk over.",
  opts: [
    { label: "Have business here, loudly and specifically",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 4 }, { perk: "sly", n: 2 }] },
      pass: { text: "You are delivering something to a house you name, for a man you invent, and you are late, and would he kindly point you at the right door. He points.", eff: { attr: { charm: 1 }, flags: ["talked-past-a-guard"] } },
      fail: { text: "He asks the name of the house again and you give a different one.", eff: { health: -6, standing: -3 } } },
    { label: "Go before he arrives",
      check: { attr: "swiftness", dc: 10, perkBonus: [{ perk: "quick", n: 3 }, { perk: "quiet", n: 3 }] },
      pass: { text: "Two turnings and a yard and you are in a street where nobody has an opinion about your coat.", eff: {} },
      fail: { text: "He is faster than a man his size has any right to be, and the questioning happens against a wall.", eff: { health: -8, standing: -2 } } },
    { label: "Beg from him",
      check: { attr: "charm", dc: 14, perkBonus: [{ perk: "comely", n: 3 }, { perk: "honest", n: 3 }] },
      pass: { text: "He gives you two coppers out of his own purse and tells you which streets to keep out of, and means both kindly.", eff: { coin: 6, secrets: 1, standing: -1 } },
      fail: { text: "He moves you along with the flat of his hand between your shoulder blades, all the way to the end of the street.", eff: { health: -5, standing: -4 } } },
  ] },

{ id: "t-pot-shop", w: 4,
  when: { wild: false, amenities: ["inn", "crowd"], anyPlaceTag: ["poor", "city", "town"] },
  dm: "A pot-shop at {spot}: one pot, always on, never emptied, {dish} out of it into whatever you are holding. A man called {folk} is holding forth to four people about {holder}, and two of them are agreeing too loudly.",
  opts: [
    { label: "Eat, and listen", cost: { coin: 2 }, req: { minCoin: 2 },
      check: { attr: "wits", dc: 10, perkBonus: [{ perk: "quiet", n: 3 }] },
      pass: { text: "By the bottom of the bowl you know what the quarter thinks, who it blames, and which of them is being paid to be angry about it.", eff: { food: 40, secrets: 1, attr: { wits: 1 } } },
      fail: { text: "You get {dish} and a long story about somebody's brother-in-law.", eff: { food: 40 } } },
    { label: "Argue with him",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 3 }, { perk: "clever", n: 2 }] },
      pass: { text: "You take him apart in front of his own audience, kindly, and buy him a cup afterwards. Two of the four now think rather well of you.", eff: { renown: 2, standing: 2, coin: -4, followers: 1 } },
      fail: { text: "It turns out he does this every night and is extremely good at it, and you leave to laughing.", eff: { standing: -3 } } },
    { label: "Tell him who is really listening", req: { anyFlag: ["knows-a-whisper", "informer", "known-at-court"] },
      res: { text: "You lean in and tell him, quietly, that the man by the door has been there four nights. He goes white and leaves. You have made one friend and possibly one enemy and you do not yet know which is which.", eff: { secrets: 1, rel: { street: 2 }, flags: ["warned-a-man"] } } },
    { label: "Eat somewhere else", res: { text: "You take it outside and eat it on a step, which is what most people do.", eff: { food: 35 } } },
  ] },

{ id: "t-guild-work", w: 4,
  when: { wild: false, amenities: ["market", "smith"], notFlags: ["imprisoned"] },
  dm: "A guildmaster at {spot} is short of hands and long of work. He will not say what happened to the last man, which is either nothing or everything.",
  opts: [
    { label: "Take the work and do it properly",
      check: { attr: "grit", dc: 11, perkBonus: [{ perk: "hardy", n: 3 }] },
      pass: { text: "A season of it. He pays what he said he would, which in this world is remarkable enough to be worth remembering him for.", eff: { coin: 55, health: -5, standing: 2, rel: { guild: 2 }, attr: { grit: 1 } } },
      fail: { text: "You are not fast enough and he says so, and pays you off at half after three weeks.", eff: { coin: 14, standing: -2 } } },
    { label: "Find out what happened to the last man first",
      check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "wary", n: 4 }] },
      pass: { text: "He is in the ground, and it was not an accident, and the guildmaster owes money to people who take payment in other forms. You do not take the work. You do take the knowledge.", eff: { secrets: 1, flags: ["knows-a-debt"], attr: { cunning: 1 } } },
      fail: { text: "Everyone you ask says he moved on, in the flat voice people use when they have agreed on a sentence.", eff: {} } },
    { label: "Take the work and take rather more than the wage",
      check: { attr: "cunning", dc: 14, perkBonus: [{ perk: "sly", n: 4 }] },
      pass: { text: "Two of everything goes out of the yard for a season, and one of everything is written down. Nobody counts until the quarter-day, and by the quarter-day you are somewhere else.", eff: { coin: 140, notoriety: 6, flags: ["cheated-a-guild"] } },
      fail: { text: "Guilds count. Counting is very nearly all a guild is.", eff: { coin: -20, standing: -5 }, goto: "arrest" } },
  ] },

{ id: "t-hanging", w: 3,
  when: { wild: false, amenities: ["crowd", "watch"] },
  dm: "There is a crowd at {spot} because {holder} is hanging somebody this morning. The man on the cart is not much older than you and is looking at the faces rather than the rope.",
  opts: [
    { label: "Watch",
      res: { text: "It takes longer than you expect. Afterwards the crowd disperses talking about other things, and you find you cannot.", eff: { attr: { grit: 1 }, health: -3 } } },
    { label: "Find out what he did",
      check: { attr: "wits", dc: 10 },
      pass: { text: "Nothing, or nearly nothing — a debt, a wrong word to a wrong man, a lord's deer. You go away with the name of the man who swore against him.", eff: { secrets: 1, flags: ["saw-an-injustice"], attr: { wits: 1 } } },
      fail: { text: "Four people give you four crimes and none of them agree.", eff: {} } },
    { label: "Cut him down and run", hint: "In front of a hundred witnesses and {holder}'s men.",
      check: { attr: "swiftness", dc: 17, perkBonus: [{ perk: "quick", n: 4 }, { perk: "wolf-blood", n: 3 }], itemBonus: [{ item: "knife", n: 2 }, { item: "sword", n: 3 }] },
      pass: { text: "One cut, and a great deal of shouting, and the two of you go over a wall together. He tells you his name three streets later and swears he is yours.", eff: { followers: 1, renown: 6, notoriety: 20, flags: ["wanted", "cut-a-man-down"], spared: 1, health: -10 } },
      fail: { text: "You get halfway up the cart.", eff: { health: -22, notoriety: 15, flags: ["wanted"] }, goto: "arrest" } },
    { label: "Go the other way", res: { text: "You do not need to see it and you have things to do.", eff: {} } },
  ] },

{ id: "t-pickpocket-child", w: 4,
  when: { wild: false, amenities: ["crowd"], minCoin: 30 },
  dm: "A child's hand is in your purse at {spot}. You have it by the wrist before you have decided anything, and the child is very small and entirely unafraid, which tells you who they work for.",
  opts: [
    { label: "Let go",
      res: { text: "You open your hand. The child does not thank you or run — just walks, at the pace of somebody who has done this before. You are down a few coppers and up something you cannot name.", eff: { coin: -8, spared: 1, attr: { charm: 1 } } } },
    { label: "Keep hold and ask who they work for",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "comely", n: 3 }, { perk: "honest", n: 2 }] },
      pass: { text: "A name, a cellar and the hours. It costs you the coppers and a promise you may not keep.", eff: { coin: -8, secrets: 1, flags: ["knows-thieves", "knows-a-mark"] } },
      fail: { text: "The child screams as though you are killing them and the street turns, and you are explaining yourself to strangers within seconds.", eff: { standing: -4, coin: -20 } } },
    { label: "Hand them to the watch", req: { amenities: ["watch"] },
      res: { text: "They take the child by the collar without much interest. You do not follow it up and you make a point of not thinking about it, which works for about a week.", eff: { standing: 2, notoriety: 2, flags: ["informer"] } } },
    { label: "Break the wrist", hint: "It is a child.",
      res: { text: "It makes a small sound. Nobody in the street says anything, which is worse than if they had.", eff: { notoriety: 10, standing: -6, flags: ["cruel-deed"], attr: { cunning: 1 } } } },
  ] },

{ id: "t-fire", w: 3,
  when: { wild: false, anyPlaceTag: ["city", "town"], amenities: ["crowd"] },
  dm: "Something is burning three streets from {spot} and in a town built like this one that is everybody's problem within the hour. There is already a line of people passing buckets and not enough of them.",
  opts: [
    { label: "Get in the line",
      check: { attr: "grit", dc: 11, perkBonus: [{ perk: "hardy", n: 3 }, { perk: "strong", n: 2 }] },
      pass: { text: "Four hours of it, and the row holds. Afterwards there are people here who will know your face for the rest of their lives.", eff: { renown: 3, standing: 5, health: -8, rest: -25, followers: 1 } },
      fail: { text: "You are in the line when the roof comes in, and you are carried out of it by two men you never find again.", eff: { health: -26, standing: 3 } } },
    { label: "Go in after whoever is still in there",
      check: { attr: "grit", dc: 15, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "strong", n: 3 }] },
      pass: { text: "Two of them, one at a time, and the second time the stair was not there any more and you did it anyway. The town will not shut up about it for a year.", eff: { renown: 12, standing: 10, health: -22, followers: 2, attr: { grit: 1 } } },
      fail: { text: "You get as far as the doorway and the heat turns you round like a hand on your chest.", eff: { health: -18 } } },
    { label: "Go through the houses everyone has left",
      check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "sly", n: 4 }, { perk: "quiet", n: 3 }] },
      pass: { text: "Everyone is at the fire. Nobody is anywhere else. It is the best hour's work you have ever done and you will not tell anyone about it.", eff: { coin: 160, notoriety: 8, flags: ["looted-a-fire"] } },
      fail: { text: "Not everyone is at the fire. One old woman stayed with her house and she has seen you.", eff: { notoriety: 14, flags: ["wanted"], health: -6 } } },
    { label: "Get out of the quarter", res: { text: "You go downwind and out, which is what sensible people do and nobody sings about.", eff: { rest: -10 } } },
  ] },

{ id: "t-market-dispute", w: 4,
  when: { wild: false, amenities: ["market"] },
  dm: "Two traders at {spot} are shouting at each other over a set of scales, and a crowd has formed because a crowd always does. Both of them keep appealing to the people watching, which means the people watching are going to decide it.",
  opts: [
    { label: "Judge it, out loud, in front of everybody",
      check: { attr: "wits", dc: 12, perkBonus: [{ perk: "clever", n: 3 }, { perk: "silver", n: 2 }] },
      pass: { text: "The weights are shaved and you say which and why, and the crowd goes from watching to agreeing in about four seconds. You have been in this town a week.", eff: { renown: 3, standing: 4, attr: { charm: 1 } } },
      fail: { text: "You are wrong about the weights in a way that the guild's own man is delighted to explain.", eff: { standing: -4 } } },
    { label: "Take the losing man's side quietly afterwards",
      check: { attr: "charm", dc: 11 },
      pass: { text: "You find him at the back of his own stall an hour later. He tells you a great deal about who is really shaving what in this market.", eff: { secrets: 1, rel: { market: 2 }, flags: ["knows-a-mark"] } },
      fail: { text: "He is in no mood and tells you where to go.", eff: {} } },
    { label: "Take something while everyone is looking at the scales",
      check: { attr: "cunning", dc: 11, perkBonus: [{ perk: "sly", n: 4 }, { perk: "quick", n: 3 }] },
      pass: { text: "Two stalls down, unhurried, and away. This is why crowds form and it is why thieves love them.", eff: { coin: 36, food: 30, notoriety: 3 } },
      fail: { text: "The third trader along has been watching the crowd rather than the argument, because that is his job.", eff: { health: -8 }, goto: "arrest" } },
  ] },

{ id: "t-mummers", w: 3,
  when: { wild: false, amenities: ["crowd"], anyPlaceTag: ["town", "city", "market"] },
  dm: "A mummers' cart has set up at {spot} and is doing a play about {holder} in which {holder} comes out extremely well. Half the crowd is laughing at the parts that are not meant to be funny.",
  opts: [
    { label: "Watch it through",
      res: { text: "It is bad and long and you enjoy it far more than you expected. For two hours you are a person at a play rather than a person with a life.", eff: { rest: 25, health: 4, attr: { charm: 1 } } } },
    { label: "Get talking to the mummers afterwards",
      check: { attr: "charm", dc: 11, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "They are on the road eight months a year and they carry news the way other people carry lice. Two of the things they tell you are worth money.", eff: { secrets: 1, flags: ["knows-mummers"], attr: { charm: 1 } } },
      fail: { text: "They are packing and rude with it, which is what men are like after a bad house.", eff: {} } },
    { label: "Go on with them", req: { maxStanding: 30, notFlags: ["sworn", "soldier"] },
      check: { attr: "charm", dc: 13, perkBonus: [{ perk: "comely", n: 3 }, { perk: "silver", n: 3 }] },
      pass: { text: "A cart, a costume and a licence to be a different person in every town you enter. It is not respectable and it is one of the very few honest ways out of a place like this.", eff: { work: "mummer", flags: ["with-the-mummers"], coin: 15, move: "random" } },
      fail: { text: "They have enough mouths. The one who says so is not unkind about it.", eff: { standing: -1 } } },
    { label: "Shout the true version of the story", hint: "{holder}'s men are in this crowd.",
      check: { attr: "grit", dc: 14, perkBonus: [{ perk: "honest", n: 4 }] },
      pass: { text: "You say it plainly, once, and sit down. The laugh that goes round is not a nice one and it is not aimed at you.", eff: { renown: 5, notoriety: 8, standing: -4, flags: ["spoke-against-the-lord"] } },
      fail: { text: "Two of them take you out of the crowd by the elbows before you have finished the sentence.", eff: { health: -14, notoriety: 6 }, goto: "arrest" } },
  ] },

{ id: "t-village-hungry", w: 4,
  when: { wild: false, kinds: ["village"], anyPlaceTag: ["poor"] },
  dm: "There are eleven houses here and nobody in any of them has enough. {folk} is the closest thing to a headman and he wants to know, politely and without much hope, whether you are passing through or staying.",
  opts: [
    { label: "Share what you have with them", req: { minFood: 50 },
      res: { text: "It is not much and it goes round. Nobody makes a speech. In four villages between here and the sea somebody will say your name kindly this year.", eff: { food: -35, standing: 5, renown: 2, followers: 1, flags: ["fed-a-village"] } } },
    { label: "Work a season with them for a roof",
      check: { attr: "grit", dc: 10, perkBonus: [{ perk: "hardy", n: 3 }] },
      pass: { text: "Ditching, roofing, a wall put back. They feed you, which costs them, and they do it anyway, which costs them more.", eff: { food: 70, rest: 60, health: 8, standing: 3, coin: 6 } },
      fail: { text: "A season of hard work and a hungry village at the end of it, which is what most seasons are here.", eff: { food: 30, health: -6, coin: 2 } } },
    { label: "Take what there is", hint: "Eleven houses and no watch.",
      check: { attr: "might", dc: 11, perkBonus: [{ perk: "cruel", n: 3 }], itemBonus: [{ item: "sword", n: 4 }] },
      pass: { text: "There is not much and you take it. Nobody fights you for it, which is somehow the worst part.", eff: { food: 60, coin: 25, notoriety: 12, standing: -8, flags: ["killer", "robbed-the-poor"] } },
      fail: { text: "Eleven houses is eleven men with hayforks, and they have done this before.", eff: { health: -24, notoriety: 8 } } },
    { label: "Pass through", res: { text: "You say you are passing through, and you are, and that is that.", eff: { rest: -6 } } },
  ] },

{ id: "t-village-wedding", w: 3,
  when: { wild: false, anyPlaceTag: ["village", "town"], amenities: ["crowd"] },
  dm: "There is a wedding at {spot}. Everyone in the place is either at it or pretending not to want to be, and there is more {drink} out than there has been all year.",
  opts: [
    { label: "Go, and be good company",
      check: { attr: "charm", dc: 10, perkBonus: [{ perk: "silver", n: 3 }, { perk: "comely", n: 2 }] },
      pass: { text: "You dance badly, drink well and end the evening being told the entire history of a family you had never heard of. You sleep somewhere warm.", eff: { rest: 55, food: 60, health: 6, standing: 3, renown: 1 } },
      fail: { text: "You say the wrong thing about the bride's family within the first hour, and the rest of the night is spent being politely not talked to.", eff: { standing: -3, food: 30 } } },
    { label: "Work the crowd while everyone is drunk",
      check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "sly", n: 4 }] },
      pass: { text: "Cloaks come off at a wedding and purses go in the cloaks. Nobody notices anything until the morning and by then several stories are competing.", eff: { coin: 70, notoriety: 4 } },
      fail: { text: "You are caught with your hand in a cloak by the bride's uncle, at a wedding, in front of the whole village.", eff: { health: -16, standing: -8, notoriety: 6 } } },
    { label: "Dance with somebody", req: { minAge: 16, notFlags: ["married", "sworn-celibate"] },
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "comely", n: 4 }] },
      pass: { text: "Twice, and then out in the cold air by the wall, and the whole of it is the best hour of the year.", eff: { health: 8, rest: 20, flags: ["a-name-remembered"], attr: { charm: 1 } } },
      fail: { text: "You ask, and are refused, and the refusal is witnessed by four people who find it funny.", eff: { standing: -2 } } },
    { label: "Watch from outside", res: { text: "You stand where the light comes out and listen to it for a while, and then you go.", eff: { rest: 10, health: -2 } } },
  ] },

{ id: "t-debt-collector", w: 4,
  when: { wild: false, amenities: ["crowd"], anyFlag: ["knows-thieves", "gang", "indebted", "cheated-a-guild"] },
  dm: "Two men are waiting where you have to walk past, and they are not hiding, which means this is a message rather than an ambush. One of them says a name you were hoping had forgotten yours.",
  opts: [
    { label: "Pay", cost: { coin: 60 }, req: { minCoin: 60 },
      res: { text: "You pay, and they count it, and they thank you like tradesmen, which they are.", eff: { flags: ["-indebted"], standing: 1 } } },
    { label: "Talk your way to more time",
      check: { attr: "charm", dc: 13, perkBonus: [{ perk: "silver", n: 4 }, { perk: "connected", n: 3 }] },
      pass: { text: "A season. Not because they believe you but because a dead man pays nothing and they are not in a hurry.", eff: { flags: ["indebted", "on-borrowed-time"], attr: { charm: 1 } } },
      fail: { text: "They break something small to be going on with, and are professional and unhurried about which.", eff: { health: -18, flags: ["indebted"] } } },
    { label: "Fight them here in the street",
      check: { attr: "might", dc: 14, perkBonus: [{ perk: "strong", n: 3 }, { perk: "cold-blood", n: 3 }], itemBonus: [{ item: "sword", n: 3 }, { item: "armour", n: 2 }] },
      pass: { text: "Both of them, in about eleven seconds, in front of enough people that it will be told properly. Whoever sent them is going to have to think.", eff: { renown: 5, notoriety: 8, health: -14, flags: ["-indebted", "made-an-enemy"] } },
      fail: { text: "They do this for a living and you do not.", eff: { health: -28, coin: -60, flags: ["indebted"] } } },
  ] },

{ id: "t-plague-quarter", w: 2,
  when: { wild: false, anyPlaceTag: ["city", "poor"], amenities: ["crowd"] },
  dm: "A street off {spot} has been shut with boards and a man of {holder}'s stands at the end of it doing nothing at all. There is coughing behind the boards, and the coughing has children in it.",
  opts: [
    { label: "Go in and do what can be done", req: { anyPerk: ["healer-hands", "honest", "hardy"] },
      check: { attr: "grit", dc: 14, perkBonus: [{ perk: "healer-hands", n: 5 }, { perk: "hardy", n: 3 }], itemBonus: [{ item: "bandages", n: 3 }] },
      pass: { text: "Water, clean cloth, and moving the living away from the dead, which is most of what medicine is. Nine of them are alive at the end of it who would not have been.", eff: { renown: 8, standing: 8, health: -20, followers: 2, flags: ["went-into-the-plague"], attr: { grit: 1 } } },
      fail: { text: "You do what you can for four days and then you are one of the ones on the floor.", eff: { health: -40, flags: ["sick"] } } },
    { label: "Pass food over the boards", cost: { coin: 12 }, req: { minCoin: 12 },
      res: { text: "It is not enough and it is what you had. A hand takes it and a voice says something you do not catch.", eff: { standing: 3, renown: 1, spared: 1 } } },
    { label: "Ask the guard what he has been told",
      check: { attr: "charm", dc: 11 },
      pass: { text: "He has been told to stand here and nothing else, and he has been standing here for six days, and he tells you a great deal more than he should because you asked him anything at all.", eff: { secrets: 1, rel: { guard: 2 } } },
      fail: { text: "He has been told to stand here and nothing else and he is extremely good at it.", eff: {} } },
    { label: "Take the long way round", res: { text: "You go the long way round. So does everybody.", eff: { rest: -5 } } },
  ] },

{ id: "t-street-of-steel", w: 3,
  when: { wild: false, amenities: ["smith"], minCoin: 40 },
  dm: "A forge at {spot}. The master is a hard man about money and there is a boy on the bellows who has been watching you since you came in, because the boy is the one who actually made the thing on the wall.",
  opts: [
    { label: "Buy from the master and say nothing", cost: { coin: 45 }, req: { minCoin: 45, notItems: ["sword", "good-sword"] },
      res: { text: "Honest work at an honest price. The boy watches it go out of the door.", eff: { items: ["sword"] } } },
    { label: "Deal with the boy instead",
      check: { attr: "charm", dc: 12, perkBonus: [{ perk: "honest", n: 3 }, { perk: "silver", n: 2 }] },
      pass: { text: "He does work on his own time that is better than the shop's and half the price, and he wants somebody to know it. You have a blade and he has a customer, and both of you leave pleased.", eff: { coin: -25, items: ["sword"], rel: { smith: 3 }, flags: ["knows-a-smith"] } },
      fail: { text: "The master comes back through and the boy is at the bellows before the door has shut.", eff: {} } },
    { label: "Have your own arms painted on a shield", cost: { coin: 60 }, req: { minCoin: 60, items: ["shield"], notItems: ["painted-shield"] },
      res: { text: "You describe a device that is yours because you say it is. Half of knighthood is being recognisable at a distance and the other half is behaving as though you always were.", eff: { items: ["painted-shield", "-shield"], standing: 4, renown: 2, flags: ["own-arms"] } } },
    { label: "Ask what a good blade actually is",
      res: { text: "He talks for twenty minutes about folding and edges and where the balance sits, and by the end of it you can tell a good sword from an expensive one, which is not a thing most lords can do.", eff: { attr: { wits: 1 }, flags: ["knows-steel"] } } },
  ] },

{ id: "t-press-gang", w: 3,
  when: { wild: false, amenities: ["harbour", "inn"], maxStanding: 45 },
  dm: "You wake on a floor you do not recognise with a headache that has a shape to it, and there is a man in the doorway of the room with a list, saying that you took the captain's coin last night. You do not remember taking anything.",
  opts: [
    { label: "Say you did no such thing and make them prove it",
      check: { attr: "wits", dc: 13, perkBonus: [{ perk: "clever", n: 3 }, { perk: "lettered", n: 3 }] },
      pass: { text: "You ask to see the mark on the list, and then to see the man who witnessed it, and then who paid the witness. By the third question it is not worth their morning.", eff: { attr: { wits: 1 }, standing: 1 } },
      fail: { text: "The proof is a mark on a page and two large men, and the two large men are the part that counts.", eff: { flags: ["pressed", "ship-berth"], move: "random", health: -8, coin: -20 } } },
    { label: "Go with them and see where the ship goes",
      res: { text: "It is not slavery and it is not far off. Six months of it, and at the end you are somewhere else entirely with a wage and a set of hands that have changed shape.", eff: { flags: ["ship-berth"], work: "sailor", coin: 55, move: "random", health: -10, attr: { grit: 1, might: 1 } } } },
    { label: "Go out of the window",
      check: { attr: "swiftness", dc: 12, perkBonus: [{ perk: "quick", n: 4 }] },
      pass: { text: "Second floor, a roof, and a run through a town you do not know at all. Somewhere behind you a man is shouting about a list.", eff: { health: -6, rest: -15, attr: { swiftness: 1 } } },
      fail: { text: "It is a small window and you are halfway through it when they take hold of your legs.", eff: { health: -14, flags: ["pressed", "ship-berth"], move: "random" } } },
  ] },

{ id: "t-brothel-trouble", w: 3,
  when: { wild: false, amenities: ["brothel"], anyFlag: ["knows-a-whisper", "worked-a-brothel", "gang"] },
  dm: "There is a girl at the door of the house near {spot} who knows your name and did not get it from you. Somebody upstairs has stopped paying, or started hurting people, or both, and she has run out of people to ask.",
  opts: [
    { label: "Go up",
      check: { attr: "might", dc: 13, perkBonus: [{ perk: "strong", n: 3 }, { perk: "cold-blood", n: 3 }], itemBonus: [{ item: "knife", n: 2 }, { item: "sword", n: 3 }] },
      pass: { text: "He is a lordling with a purse and a temper and he goes down the stairs in a manner he will not enjoy explaining. The house will not forget it and neither will his family.", eff: { renown: 3, notoriety: 6, rel: { brothel: 4 }, flags: ["made-an-enemy", "brothel-friend"], health: -8 } },
      fail: { text: "He has two men on the landing, which she did not mention because she did not know.", eff: { health: -22, notoriety: 4 } } },
    { label: "Get her and whoever else out instead",
      check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "sly", n: 3 }] },
      pass: { text: "Down the back, out through the yard, and into a cart going somewhere else. Nothing is solved. Two people are alive who might not have been.", eff: { spared: 2, rel: { brothel: 3 }, flags: ["brothel-friend"], standing: 2 } },
      fail: { text: "The yard gate is chained and the noise brings everybody.", eff: { health: -14, notoriety: 5 } } },
    { label: "Find out who he is and sell it",
      check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "sly", n: 3 }, { perk: "connected", n: 3 }] },
      pass: { text: "A name with a house behind it, and a house that would pay a great deal for this not to be a story. It is the most profitable evening of your year and you do not sleep well after it.", eff: { coin: 240, secrets: 1, flags: ["blackmailer", "dangerous-knowledge"], standing: -2 } },
      fail: { text: "The house he belongs to has men whose whole employment is this, and one of them has been standing behind you for some time.", eff: { health: -16, notoriety: 8, flags: ["made-an-enemy"] } } },
    { label: "This is not your business", res: { text: "You say so. She does not argue, which is worse than if she had.", eff: { standing: -1 } } },
  ] },

{ id: "t-tax-day", w: 4,
  when: { wild: false, amenities: ["crowd", "watch"], notFlags: ["highborn"] },
  dm: "{holder}'s steward has a table at {spot} and a list, and the list has this quarter on it. The queue is long and nobody in it is talking.",
  opts: [
    { label: "Pay what is asked", cost: { coin: 25 }, req: { minCoin: 25 },
      res: { text: "You pay. It is more than last year, as it is every year, and the man behind you pays more than you.", eff: { standing: 1, flags: ["paid-the-tax"] } } },
    { label: "Argue the figure",
      check: { attr: "wits", dc: 13, perkBonus: [{ perk: "lettered", n: 4 }, { perk: "clever", n: 3 }] },
      pass: { text: "You take him through his own arithmetic in front of a queue of forty people, and he corrects it, and the queue watches him do it.", eff: { coin: -8, renown: 3, standing: 3, rel: { steward: -2 }, attr: { wits: 1 } } },
      fail: { text: "He listens, agrees you are right, and charges you the original figure anyway, because the list is the list.", eff: { coin: -30, standing: -2 } } },
    { label: "Be somewhere else this week",
      check: { attr: "cunning", dc: 11, perkBonus: [{ perk: "quiet", n: 4 }, { perk: "sly", n: 2 }] },
      pass: { text: "There are a great many people in this quarter and only one list, and the list has to find you.", eff: { attr: { cunning: 1 }, flags: ["dodged-the-tax"] } },
      fail: { text: "The list found you. There is a fine on top of the sum for having made them look.", eff: { coin: -45, notoriety: 3 } } },
    { label: "Pay for the family behind you as well", cost: { coin: 45 }, req: { minCoin: 45 },
      res: { text: "You put it on the table without saying anything about it. The woman does not know what to do with her face. The queue saw.", eff: { renown: 3, standing: 6, followers: 1, flags: ["paid-for-another"] } } },
  ] },

{ id: "t-hedge-preacher", w: 3,
  when: { wild: false, amenities: ["crowd", "temple"] },
  dm: "There is a man on a barrel at {spot} saying that lords are men and that the Seven made no lords, and a small crowd is listening with the particular stillness of people hearing something they have thought and never said.",
  opts: [
    { label: "Listen",
      res: { text: "He is not clever and he is not wrong, and the difference between those two turns out to matter less than you expected.", eff: { attr: { wits: 1 }, flags: ["heard-the-preacher"] } } },
    { label: "Speak up beside him",
      check: { attr: "charm", dc: 13, perkBonus: [{ perk: "silver", n: 4 }, { perk: "honest", n: 3 }] },
      pass: { text: "You say a true thing about {holder} that everyone present already knew and nobody had said out loud, and the sound the crowd makes is not one you will forget.", eff: { renown: 6, notoriety: 10, standing: -5, followers: 2, flags: ["spoke-against-the-lord"] } },
      fail: { text: "You lose the thread halfway and the crowd goes back to him.", eff: { standing: -2 } } },
    { label: "Get him off the barrel before the watch arrives",
      check: { attr: "wits", dc: 11, perkBonus: [{ perk: "wary", n: 3 }] },
      pass: { text: "You have him round a corner and out of the quarter about ninety seconds before four men in {holder}'s colours arrive at the barrel.", eff: { spared: 1, rel: { faith: 2 }, flags: ["saved-the-preacher"], renown: 1 } },
      fail: { text: "He will not come down. He is still on the barrel when they get there and you are still standing beside it.", eff: { health: -10, notoriety: 5 } } },
    { label: "Tell somebody who pays for this sort of thing", req: { anyFlag: ["known-at-court", "informer", "knows-a-whisper"] },
      res: { text: "It is worth a little, and it is easy, and afterwards you find you do not want to walk back through that square.", eff: { coin: 40, standing: 2, notoriety: 4, flags: ["informer"] } } },
  ] },

{ id: "t-old-soldier", w: 4,
  when: { wild: false, amenities: ["inn", "crowd"] },
  dm: "An old man at {spot} with one hand and a great deal of {drink} in him is telling the room about a battle. Half of it is true. The half that is true is the half nobody is listening to.",
  opts: [
    { label: "Buy him another and get the true half", cost: { coin: 3 }, req: { minCoin: 3 },
      check: { attr: "charm", dc: 10, perkBonus: [{ perk: "honest", n: 3 }] },
      pass: { text: "How a line actually breaks, what it sounds like, and what men do in the hour before. It is worth more than a season in a training yard and it costs three stags.", eff: { attr: { grit: 1, wits: 1 }, flags: ["learned-from-a-veteran"] } },
      fail: { text: "He goes to sleep in the middle of it, upright.", eff: { coin: -3 } } },
    { label: "Ask him where the fighting is now",
      check: { attr: "wits", dc: 11 },
      pass: { text: "He still gets letters, which surprises you. There is a company hiring, and a war that has not reached the songs yet, and he tells you the name of the man to ask for.", eff: { secrets: 1, flags: ["knows-a-company"], attr: { wits: 1 } } },
      fail: { text: "The war he tells you about ended eleven years ago.", eff: {} } },
    { label: "Take him home before the room turns on him",
      res: { text: "It is four streets and he weighs almost nothing and he talks the whole way. His daughter opens the door with the face of somebody who has done this before, and looks at you differently when she sees you have not taken anything.", eff: { standing: 3, rel: { veteran: 3 }, flags: ["kindness-remembered"] } } },
  ] },

{ id: "t-recruiter-2", w: 4,
  when: { wild: false, amenities: ["crowd"], notFlags: ["sworn", "soldier", "imprisoned"] },
  dm: "A serjeant has a table at {spot}, a jug, and a sheaf of names. He is signing men for somebody's war and he does not say whose until you sit down, and once you have sat down he does not much care whether you like the answer.",
  opts: [
    { label: "Sit down, take his coin, and join whatever army it is",
      res: { text: "It is {holder}'s, or it is somebody paying {holder}, and by the time you have the answer you have the coin in your hand and your name on the page.", eff: { coin: 40, flags: ["soldier", "sworn", "at-war"], work: "sellsword", standing: 3 } } },
    { label: "Sit down, but make him say whose war it is first",
      check: { attr: "wits", dc: 12, perkBonus: [{ perk: "clever", n: 3 }, { perk: "wary", n: 3 }] },
      pass: { text: "He tells you, because you asked in front of the four men behind you and they were all wondering. It changes your mind about one thing and not about another.", eff: { secrets: 1, coin: 40, flags: ["soldier", "sworn", "at-war", "knew-what-he-signed"], work: "sellsword", attr: { wits: 1 } } },
      fail: { text: "He tells you a name that means nothing and pushes the jug across, and you sign anyway.", eff: { coin: 30, flags: ["soldier", "sworn", "at-war"], work: "sellsword" } } },
    { label: "Sit down, take the coin, and be gone before the muster",
      check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "sly", n: 4 }, { perk: "quick", n: 3 }] },
      pass: { text: "Forty stags for an afternoon and a signature that is not quite your name. You are eleven leagues away when the horns go.", eff: { coin: 40, notoriety: 6, flags: ["took-the-coin-and-ran"] } },
      fail: { text: "They come for you at dawn, because they always come at dawn, and taking the coin and running has a name and a punishment.", eff: { health: -18, flags: ["deserter"] }, goto: "arrest" } },
    { label: "Do not sit down at all", res: { text: "You keep walking. He is still calling after you at the corner, and by the corner after that he has found somebody else.", eff: {} } },
  ] },

{ id: "t-cutpurse-caught", w: 3,
  when: { wild: false, amenities: ["crowd", "watch"], anyFlag: ["knows-thieves", "gang", "outlaw"], notFlags: ["imprisoned"] },
  dm: "Somebody you know by sight is being held by two of {holder}'s men at {spot}, and he has seen you, and he has not said your name yet.",
  opts: [
    { label: "Walk on",
      res: { text: "You walk on. He does not call after you, which is either loyalty or calculation, and you will not find out which.", eff: { flags: ["walked-past-a-friend"], notoriety: -1 } } },
    { label: "Cause enough of a scene for him to get loose",
      check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "quick", n: 3 }, { perk: "sly", n: 3 }] },
      pass: { text: "A barrow goes over and a horse takes exception and by the time it is sorted out there is one fewer man being held. He finds you that night and he is yours from then on.", eff: { followers: 1, notoriety: 5, rel: { thieves: 4 }, flags: ["knows-thieves", "owed-a-life"] } },
      fail: { text: "The scene is caused and nobody lets go of anybody, and one of them has a good long look at you.", eff: { notoriety: 8, flags: ["wanted"] } } },
    { label: "Buy him off them", cost: { coin: 50 }, req: { minCoin: 50 },
      check: { attr: "charm", dc: 11, perkBonus: [{ perk: "silver", n: 3 }] },
      pass: { text: "It is not a bribe, it is a fine, and it is paid on the spot to men who write nothing down. Everybody understands the arrangement perfectly.", eff: { rel: { thieves: 3 }, followers: 1, standing: -1 } },
      fail: { text: "They take the coin and keep him, and there is nobody you can complain to.", eff: { coin: -50, standing: -3 } } },
    { label: "Tell them what else he has done", req: { notFlags: ["gang"] },
      res: { text: "It is quick and it is quiet and it buys you something with the watch. The quarter will work out who talked within the month.", eff: { standing: 4, notoriety: 6, flags: ["informer"], rel: { thieves: -5 } } } },
  ] },

{ id: "t-lost-child", w: 3,
  when: { wild: false, amenities: ["crowd"] },
  dm: "There is a child sitting on the ground at {spot} not crying, which is worse than crying. Nobody in this street has stopped, because in a place this size nobody can afford to.",
  opts: [
    { label: "Stop, and find out where they belong",
      check: { attr: "charm", dc: 10, perkBonus: [{ perk: "comely", n: 2 }, { perk: "honest", n: 3 }] },
      pass: { text: "Two hours, four wrong doors and one right one. The mother does not thank you properly because she is too busy shouting at the child, which is how you know you got the right door.", eff: { standing: 3, renown: 1, rest: -10, flags: ["kindness-remembered"] } },
      fail: { text: "You cannot find anyone and in the end you leave them with a septa who is kind about it and does not entirely believe you.", eff: { standing: 1, rest: -12 } } },
    { label: "Give them what food you have", req: { minFood: 40 },
      res: { text: "They eat it looking at you the whole time. Somebody will come, or somebody will not.", eff: { food: -25, spared: 1, standing: 2 } } },
    { label: "There are a hundred of them in this city",
      res: { text: "There are. That is true, and it is the reason people give, and you give it.", eff: { attr: { cunning: 1 } } } },
  ] },

{ id: "t-gate-toll", w: 3,
  when: { wild: false, amenities: ["watch"], anyPlaceTag: ["city", "town"] },
  dm: "The man on the gate at {spot} has decided there is a toll today. There was no toll yesterday and there will be none tomorrow, and the difference is that today he has seen you.",
  opts: [
    { label: "Pay it", cost: { coin: 8 }, req: { minCoin: 8 },
      res: { text: "You pay and go through. It is not a great sum and it is not about the sum.", eff: { standing: -1 } } },
    { label: "Ask him to show you where it is written",
      check: { attr: "wits", dc: 12, perkBonus: [{ perk: "lettered", n: 4 }] },
      pass: { text: "He cannot, because it is not, and there are people behind you in the queue who now know that.", eff: { renown: 2, standing: 2, rel: { guard: -2 }, attr: { wits: 1 } } },
      fail: { text: "He shows you a piece of paper with writing on it. You cannot read it and he knows that too.", eff: { coin: -14, standing: -2 } } },
    { label: "Go in over the wall instead",
      check: { attr: "swiftness", dc: 13, perkBonus: [{ perk: "quick", n: 4 }], itemBonus: [{ item: "rope", n: 4 }] },
      pass: { text: "There is always a stretch nobody watches and finding it is a skill. You are inside for nothing and you now know a way in for later.", eff: { flags: ["knows-a-way-in"], attr: { swiftness: 1 } } },
      fail: { text: "There is always a stretch nobody watches and this was not it.", eff: { health: -10 }, goto: "arrest" } },
  ] },

{ id: "t-good-turn-repaid", w: 3,
  when: { wild: false, amenities: ["crowd"], anyFlag: ["kindness-remembered", "paid-for-another", "fed-a-village", "spoke-for-the-small"] },
  dm: "Somebody stops you at {spot} and uses your name, and it takes you a moment to place them, and when you do it is because of something you did and had stopped thinking about.",
  opts: [
    { label: "Let them do whatever they are trying to do for you",
      res: { text: "A meal, a bed, an introduction and a debt considered settled. You had not thought of it as a debt. They had thought of nothing else for a year.", eff: { food: 70, rest: 50, coin: 30, standing: 3, followers: 1, health: 6 } } },
    { label: "Ask them for something specific instead",
      check: { attr: "charm", dc: 11 },
      pass: { text: "You ask for the one thing they can actually give, which is a name and a word in the right ear, and they give it gladly because you asked for something they had.", eff: { secrets: 1, standing: 4, flags: ["connected-here", "known-at-court"], attr: { charm: 1 } } },
      fail: { text: "You ask for rather more than they have and watch them try to find a way to say so.", eff: { standing: -2 } } },
    { label: "Tell them it was nothing and go", res: { text: "It was not nothing and you both know it, and saying so would have cost you nothing at all.", eff: { attr: { grit: 1 } } } },
  ] },

]);
