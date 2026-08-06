/* ============================================================================
   THE IRON LADDER — WHAT YOU DO WHEN NOTHING IS BEING DONE TO YOU.

   The world offers a scene each season. This file is the other half of the
   bargain: the things you may decide to do instead. An ACTION is exactly the
   same shape as an event, so everything true of the deck is true here — the
   engine cannot tell them apart, and neither, deliberately, can the screen.

   The difference is only in how they are reached. A scene arrives. An action is
   chosen. Both cost the season, which is the whole tension of the game: the
   world is always offering you something, and taking it always means not doing
   the thing you meant to do.

   `when` decides whether an action is even listed. Keep them generous — a page
   with four things on it feels like a menu; a page with twelve feels like a
   life. But every one must be able to fail, or it is a button, not a choice.
   ========================================================================== */

/* The spine of the game: one number, and what the world calls you at it.
   See score() in engine.js for what feeds it. */
window.IL_LADDER = [
  { at: 0,    name: "Nobody",           note: "No name worth writing down." },
  { at: 40,   name: "A known face",     note: "Two streets know you, and one of them approves." },
  { at: 110,  name: "Somebody's man",   note: "You stand behind a chair that matters a little." },
  { at: 240,  name: "A name in the town", note: "People ask for you now, by name, for work." },
  { at: 420,  name: "A man of substance", note: "You are consulted. It is a strange feeling." },
  { at: 700,  name: "A power in the district", note: "Lords write to you. Some of them are polite." },
  { at: 1050, name: "A lord in all but title", note: "Whatever the rolls say, everyone here knows who decides." },
  { at: 1500, name: "A great lord",     note: "Your banner means something to men who have never met you." },
  { at: 2200, name: "A power in the realm", note: "The game is being played at your table now." },
  { at: 3200, name: "Crowned",          note: "There is nowhere further up, and no way down that is gentle." },
];

window.IL_ACTIONS = [

  /* ------------------------------------------------------------- WORKING -- */
  { id: "act-work-hard", w: 0, icon: "&#128296;", group: "Work",
    when: { wild: false, notFlags: ["imprisoned"] },
    dm: "You put your head down and work the season for everything it will give.",
    opts: [
      { label: "Work the season through",
        check: { attr: "grit", dc: 11, perkBonus: [{ perk: "hardy", n: 3 }] },
        pass: { text: "A hard season, honestly done. There is coin at the end of it and your hands are worse than they were.", eff: { coin: 34, health: -4, attr: { grit: 1 } } },
        fail: { text: "The work is there and the pay is not. Half of it goes to a man who says he is owed it.", eff: { coin: 10, health: -6 } } },
    ] },

  /* TAKING A JOB IS THE ONLY WAY TO HAVE A WAGE. `advance()` pays nothing to a
     character with no trade, so this action is the door to passive income and
     every option below actually SETS `work` rather than handing over a purse.
     What is on offer is whatever the place has — see the amenity gates. */
  { id: "act-seek-work", venue: "street", icon: "&#128188;", group: "Work",
    when: { wild: false, notFlags: ["imprisoned", "enslaved"] },
    dm: "You go looking for work. There is always somebody short of hands, and the only question is what they will have you doing.",
    opts: [
      { label: "Take a berth on the wharves", req: { amenities: ["harbour"] },
        reqWhy: "There is no harbour here.",
        check: { attr: "might", dc: 10, perkBonus: [{ perk: "strong", n: 3 }, { perk: "sea-legs", n: 3 }] },
        pass: { text: "Hauling and stacking, dawn to dusk, and a wage that arrives at the end of every week for as long as the ships do.", eff: { work: "sailor", coin: 14, flags: ["-unemployed", "has-a-job"], health: -4 } },
        fail: { text: "The mate looks at your hands and says something to the man beside him, and they both laugh.", eff: { standing: -2 } } },
      { label: "Ask at the smithy for a place", req: { amenities: ["smith"] },
        reqWhy: "There is no forge here.",
        check: { attr: "grit", dc: 11, perkBonus: [{ perk: "strong", n: 3 }] },
        pass: { text: "Bellows first, for a year, and then perhaps the hammer. It is hot, it pays properly, and it puts steel in your hands every day of your life.", eff: { work: "smith", coin: 10, flags: ["-unemployed", "has-a-job"] } },
        fail: { text: "He has a boy already and no room for a second one.", eff: {} } },
      { label: "Take a place in the stables or the yard", req: { amenities: ["stables"] },
        reqWhy: "There are no stables here.",
        check: { attr: "charm", dc: 10, perkBonus: [{ perk: "beast-friend", n: 4 }, { perk: "rider", n: 3 }] },
        pass: { text: "Mucking, feeding and walking horses that are worth more than you are. Steady, and the men who own them talk in front of you.", eff: { work: "servant", coin: 8, flags: ["-unemployed", "has-a-job"] } },
        fail: { text: "The head groom watches you approach a horse and that is the whole of the interview.", eff: { standing: -1 } } },
      { label: "Take the wage and the spear", req: { anyAmenity: ["watch", "hall"] },
        reqWhy: "There is nobody here who hires men to stand about with spears.",
        check: { attr: "might", dc: 11, itemBonus: [{ item: "sword", n: 3 }, { item: "armour", n: 3 }] },
        pass: { text: "A cloak with somebody else's arms on it, a spear, and a great deal of standing about in the cold for coin that comes every quarter-day.", eff: { work: "guard", coin: 16, flags: ["-unemployed", "has-a-job", "sworn"], standing: 3 } },
        fail: { text: "The serjeant says they are full, which is what he says to everybody he does not want.", eff: { standing: -2 } } },
      { label: "Work the fields for whoever owns them", req: { notAmenities: ["harbour"] },
        check: { attr: "grit", dc: 9, perkBonus: [{ perk: "hardy", n: 3 }] },
        pass: { text: "Slow, honest coin and a reason to be anywhere in the countryside without being questioned. It is not much and it is every season.", eff: { work: "farmer", coin: 6, flags: ["-unemployed", "has-a-job"], health: -3 } },
        fail: { text: "The steward has more hands than rows this year and tells you so kindly.", eff: {} } },
      { label: "Take whatever is going today, and nothing after it",
        res: { text: "Ditching, hauling, gutting — the work nobody asks twice about. It pays today and there is nothing waiting tomorrow.", eff: { coin: 16, health: -8, attr: { grit: 1 } } } },
      { label: "Give up the trade you have", req: { flags: ["has-a-job"] },
        reqWhy: "You have no trade to give up.",
        res: { text: "You do not turn up. That is the whole of the ceremony. Nothing will arrive at the end of this season or any other.", eff: { work: "none", flags: ["unemployed", "-has-a-job", "-sworn"], attr: { grit: 1 } } } },
    ] },

  { id: "act-beg", icon: "&#129330;", group: "Work",
    when: { wild: false, maxCoin: 6, notFlags: ["imprisoned"] },
    dm: "You have nothing. There is a step outside a sept, or a temple, or a rich man's gate, and people go past it all day.",
    opts: [
      { label: "Beg",
        check: { attr: "charm", dc: 10, perkBonus: [{ perk: "comely", n: 3 }] },
        pass: { text: "It is a bad day and it is not the worst one. You eat.", eff: { coin: 9, standing: -3 } },
        fail: { text: "Nothing, and then somebody moves you on with a boot.", eff: { health: -6, standing: -4 } } },
      { label: "Steal instead",
        check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quiet", n: 2 }] },
        pass: { text: "A loaf, a purse and a way out of the square.", eff: { coin: 14, notoriety: 2 } },
        fail: { text: "Caught, in front of everybody.", eff: {}, goto: "arrest" } },
    ] },

  /* ------------------------------------------------------------ TRAINING -- */
  { id: "act-train-arms", venue: "barracks", icon: "&#9876;&#65039;", group: "Train",
    when: { wild: false, notFlags: ["imprisoned"] },
    dm: "A yard, a post, and a season of hitting it. Nobody has ever enjoyed this part.",
    opts: [
      { label: "Train at arms",
        check: { attr: "grit", dc: 10 },
        pass: { text: "By the end of the season the movement is in your shoulders rather than your head, which is the whole point of it.", eff: { attr: { might: 1 }, health: -3 } },
        fail: { text: "You go at it too hard too early and spend three weeks with a shoulder that will not lift.", eff: { health: -12 } } },
      { label: "Pay a real master", cost: { coin: 45 }, req: { minCoin: 45 },
        check: { attr: "wits", dc: 11 },
        pass: { text: "He corrects four things you have been doing wrong since you first picked up a blade. You will never do them again.", eff: { attr: { might: 1, swiftness: 1 }, flags: ["trained"] } },
        fail: { text: "He takes the money and teaches you a form he is fond of, which is useless in an actual fight.", eff: { coin: -45, attr: { might: 1 } } } },
    ] },

  { id: "act-train-wits", venue: "temple", icon: "&#128218;", group: "Train",
    when: { wild: false },
    dm: "There is somebody here who knows things — a septon, a maester, a scribe, an old woman with a memory. Knowledge is cheaper than steel and considerably harder to carry.",
    opts: [
      { label: "Learn your letters, or improve them",
        check: { attr: "wits", dc: 11, perkBonus: [{ perk: "lettered", n: 3 }, { perk: "bookish", n: 3 }] },
        pass: { text: "It is slow and it is dull, and at the end of it a page is a thing you can read rather than a thing you look at.", eff: { attr: { wits: 1 }, flags: ["lettered-now"] } },
        fail: { text: "It will not go in. You are not a stupid person; you are simply not this kind of person.", eff: { attr: { grit: 1 } } } },
      { label: "Listen to people who know more than you",
        res: { text: "You say almost nothing for a season, which is difficult, and learn a great deal, which is the trade.", eff: { attr: { wits: 1 }, secrets: 1 } } },
    ] },

  { id: "act-train-guile", venue: "alleys", icon: "&#127183;", group: "Train",
    when: { wild: false, anyPlaceTag: ["city", "town", "port", "market", "crime"] },
    dm: "Every town has a quarter where a certain kind of skill is taught for a certain kind of fee, and no one writes anything down.",
    opts: [
      { label: "Learn the trade of the alleys",
        check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quiet", n: 2 }] },
        pass: { text: "Locks, purses, faces and the particular way of walking that makes people's eyes slide off you.", eff: { attr: { cunning: 1 }, flags: ["knows-thieves"] } },
        fail: { text: "You are taken for a mark by the people you came to learn from, which is at least educational.", eff: { coin: -20, attr: { cunning: 1 } } } },
    ] },

  /* ---------------------------------------------------------- THE PURSE --- */
  { id: "act-gamble", venue: "inn", icon: "&#127922;", group: "Coin",
    when: { wild: false, minCoin: 10, anyPlaceTag: ["town", "city", "port", "market", "warcamp"] },
    dm: "Dice in a back room, and men who play them for a living pretending they do not.",
    opts: [
      { label: "Play small", cost: { coin: 10 },
        check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "born-lucky", n: 4 }] },
        pass: { text: "You come out ahead and — much more importantly — you stop.", eff: { coin: 32 } },
        fail: { text: "You come out behind, which is what the room is for.", eff: { coin: -10 } } },
      { label: "Play deep", cost: { coin: 60 }, req: { minCoin: 60 },
        check: { attr: "cunning", dc: 15, perkBonus: [{ perk: "born-lucky", n: 4 }, { perk: "wary", n: 2 }] },
        pass: { text: "A run of four, and the table goes quiet, and you take a season's wages off a man who can afford it.", eff: { coin: 260, renown: 1 } },
        fail: { text: "It goes the other way and it goes fast.", eff: { coin: -60 } } },
      { label: "Cheat", req: { anyPerk: ["sly", "quick"] },
        check: { attr: "cunning", dc: 16, perkBonus: [{ perk: "sly", n: 4 }, { perk: "quick", n: 3 }] },
        pass: { text: "Nobody sees it. You take enough to matter and lose the last hand deliberately, which is the professional part.", eff: { coin: 180, attr: { cunning: 1 } } },
        fail: { text: "Somebody sees it. In rooms like this that is settled immediately and with hands.", eff: { health: -22, notoriety: 5, coin: -30 } } },
    ] },

  { id: "act-trade", icon: "&#9878;&#65039;", group: "Coin",
    when: { wild: false, minCoin: 40, anyPlaceTag: ["market", "port", "city", "town"] },
    dm: "Buy here, sell there. It is the least romantic road up and it works more reliably than any of the others.",
    opts: [
      { label: "Buy a cargo and move it", cost: { coin: 40 },
        check: { attr: "wits", dc: 13, perkBonus: [{ perk: "clever", n: 3 }, { perk: "connected", n: 2 }] },
        pass: { text: "You judged the price right and the season better. The margin is not large and it is entirely yours.", eff: { coin: 110, attr: { wits: 1 } } },
        fail: { text: "The price moves against you before you arrive, as it does to everybody eventually.", eff: { coin: -40 } } },
      { label: "Buy something forbidden and move that instead", req: { anyPerk: ["sly", "wary"] }, cost: { coin: 40 },
        check: { attr: "cunning", dc: 15, perkBonus: [{ perk: "sly", n: 3 }] },
        pass: { text: "Four times the margin, because four times the sentence.", eff: { coin: 300, notoriety: 6 } },
        fail: { text: "There is an inspection at the gate that everyone said had been paid off.", eff: { coin: -40 }, goto: "arrest" } },
    ] },

  /* THE SMITH. Prices are the `worth` field of the item table in engine.js and
     must stay in step with it — the market screen quotes from there, and a
     price here that disagrees with a price there is a bug the player sees. */
  { id: "act-buy-arms", venue: "smith", icon: "&#128481;", group: "Coin",
    when: { wild: false, amenities: ["smith"], minCoin: 4 },
    dm: "A smith at {spot} with steel on the wall, and a boy working the bellows who does not look up. Good steel is the difference between a hard fight and a short one.",
    opts: [
      { label: "A cudgel — 4 stags", cost: { coin: 4 }, req: { notItems: ["club", "sword", "good-sword", "axe"] },
        res: { text: "A length of ash with the end thickened and banded. Nobody arrests a man for carrying one.", eff: { items: ["club"] } } },
      { label: "A knife — 8 stags", cost: { coin: 8 }, req: { minCoin: 8, notItems: ["knife"] },
        res: { text: "Everyone has one. It is a tool, and it will do at a pinch, and the pinch always comes.", eff: { items: ["knife"] } } },
      { label: "A shield — 20 stags", cost: { coin: 20 }, req: { minCoin: 20, notItems: ["shield", "painted-shield"] },
        res: { text: "Oak, a rim of iron, and a strap for your arm. Unglamorous, and it is why men come home.", eff: { items: ["shield"] } } },
      { label: "A woodaxe — 22 stags", cost: { coin: 22 }, req: { minCoin: 22, notItems: ["axe", "sword", "good-sword"] },
        res: { text: "Meant for timber. Terrible on armour, and nobody looks twice at a man carrying one.", eff: { items: ["axe"] } } },
      { label: "A spear — 26 stags", cost: { coin: 26 }, req: { minCoin: 26, notItems: ["spear", "sword", "good-sword"] },
        res: { text: "Ash and a leaf of steel. The weapon that has won more battles than every sword in the songs put together.", eff: { items: ["spear"] } } },
      { label: "A bow — 30 stags", cost: { coin: 30 }, req: { minCoin: 30, notItems: ["bow"] },
        res: { text: "Yew, and a dozen shafts. The weapon of men who would rather the fight happened over there.", eff: { items: ["bow"] } } },
      { label: "Boiled leather — 35 stags", cost: { coin: 35 }, req: { minCoin: 35, notItems: ["leathers", "armour", "plate"] },
        res: { text: "Hardened hide, moulded and stitched. It will turn a knife and disappoint you against anything else.", eff: { items: ["leathers"] } } },
      { label: "A serviceable sword — 45 stags", cost: { coin: 45 }, req: { minCoin: 45, notItems: ["sword", "good-sword", "valyrian-steel"] },
        res: { text: "Plain, heavy, honest. It will do everything you need and nothing you would boast of. Men in the street look at your hip and then at your face.", eff: { items: ["sword"], standing: 1 } } },
      { label: "Mail and a helm — 130 stags", cost: { coin: 130 }, req: { minCoin: 130, notItems: ["armour", "plate"] },
        res: { text: "It is heavy, it is hot, and it is the single best purchase anyone in this world can make.", eff: { items: ["armour"], standing: 3 } } },
      { label: "A castle-forged sword — 180 stags", cost: { coin: 180 }, req: { minCoin: 180, notItems: ["good-sword", "valyrian-steel"], anyPlaceTag: ["city", "market", "rich", "court"] },
        reqWhy: "No smith in a place this size keeps work like that on the wall.",
        res: { text: "Balanced, and it makes a sound when you draw it that changes how people speak to you.", eff: { items: ["good-sword"], standing: 4, renown: 1 } } },
      { label: "A suit of plate — 4 dragons and 60 stags", cost: { coin: 900 }, req: { minCoin: 900, notItems: ["plate"], anyPlaceTag: ["city", "court", "rich"] },
        reqWhy: "Plate is made to measure by men who work nowhere but a great city.",
        res: { text: "Six weeks of fittings. At the end of it there is almost nothing an ordinary man carries that can get through you, and you cannot get up on your own.", eff: { items: ["plate"], standing: 8, renown: 2 } } },
      { label: "Sell what you are carrying", req: { anyItems: ["club", "knife", "axe", "spear", "shield", "leathers", "bow"] },
        reqWhy: "You have nothing he would take.",
        check: { attr: "charm", dc: 11, perkBonus: [{ perk: "silver", n: 3 }, { perk: "connected", n: 2 }] },
        pass: { text: "He gives you rather more than the thing is worth, because he can sell it again by Tuesday.", eff: { coin: 30, items: ["-knife", "-club"] } },
        fail: { text: "He names half what you paid and does not move from it, and you take it, because you are the one who needs coin today.", eff: { coin: 12, items: ["-knife", "-club"] } } },
      /* TAKE ONE OFF THE WALL. You should be able to walk into a forge with
         nothing, walk out with a sword, and find out immediately what that
         costs — which is the whole reason there is a smith and a watch in the
         same town. */
      { label: "Take one off the wall and run", hint: "The whole street will see.",
        check: { attr: "swiftness", dc: 14, perkBonus: [{ perk: "quick", n: 4 }, { perk: "sly", n: 3 }, { perk: "quiet", n: 2 }] },
        pass: { text: "Off the rack, out of the door, and down an alley before the apprentice has finished drawing breath to shout. It is the best sword you have ever held and you will never be able to sell it in this town.", eff: { items: ["sword"], notoriety: 12, flags: ["wanted", "thief-of-steel"], standing: -6 } },
        fail: { text: "A smith spends his life swinging a hammer. He gets a hand on your collar before you reach the door and the hand does not open.", eff: { health: -16, notoriety: 8 }, goto: "arrest" } },
      { label: "Handle the steel and buy nothing",
        res: { text: "You spend an hour learning what good work looks like, which costs nothing and is worth something.", eff: { attr: { wits: 1 } } } },
    ] },

  /* ----------------------------------------------------------- STANDING --- */
  { id: "act-recruit", icon: "&#128101;", group: "Men",
    when: { wild: false, minCoin: 25, notFlags: ["imprisoned", "enslaved"] },
    dm: "Men can be had. It is only ever a question of what they are being offered and what they are running from.",
    opts: [
      { label: "Hire what you can afford", cost: { coin: 25 },
        check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 3 }] },
        pass: { text: "Three of them, none of them good, all of them yours for as long as the coin lasts.", eff: { followers: 3 } },
        fail: { text: "Two take the earnest money and are not there in the morning.", eff: { coin: -25, followers: 1 } } },
      { label: "Speak, rather than pay",
        check: { attr: "charm", dc: 15, perkBonus: [{ perk: "silver", n: 4 }, { perk: "honest", n: 3 }] },
        pass: { text: "You tell them what you mean to do. Four of them decide they would like to be there when it happens, and men who come that way stay.", eff: { followers: 4, renown: 2, attr: { charm: 1 } } },
        fail: { text: "It does not land. You hear one of them repeating a phrase of yours in the street later, laughing.", eff: { standing: -3 } } },
    ] },

  { id: "act-court", icon: "&#127801;", group: "Men",
    when: { wild: false, minAge: 16, notFlags: ["married", "sworn-celibate", "imprisoned"] },
    dm: "There is somebody. Whether it is wise depends entirely on who they are, and you have not asked yourself that question honestly.",
    opts: [
      { label: "Court them properly",
        check: { attr: "charm", dc: 13, perkBonus: [{ perk: "comely", n: 3 }, { perk: "silver", n: 2 }] },
        pass: { text: "It goes well. It goes on going well, which is rarer.", eff: { flags: ["married"], health: 8, standing: 3, renown: 1 } },
        fail: { text: "It does not go well, and the way it does not is public.", eff: { standing: -4, health: -4 } } },
      { label: "Court somebody far above you",
        check: { attr: "charm", dc: 18, perkBonus: [{ perk: "comely", n: 3 }, { perk: "silver", n: 3 }], flagBonus: [{ flag: "knight", n: 3 }, { flag: "highborn", n: 4 }] },
        pass: { text: "Against every reasonable expectation, including theirs. Their family is appalled and can do nothing about it.", eff: { flags: ["married", "married-up", "allied"], standing: 18, coin: 200, followers: 4 } },
        fail: { text: "Their father has you removed from the hall by two men, and tells the story for years.", eff: { standing: -10, health: -6 } } },
    ] },

  { id: "act-carouse", venue: "inn", icon: "&#127866;", group: "Men",
    when: { wild: false, minCoin: 12, anyPlaceTag: ["town", "city", "port", "warcamp", "village"] },
    dm: "A season of being extremely good company. It is not nothing: half of everything in this world is decided by people who like each other.",
    opts: [
      { label: "Buy the room", cost: { coin: 12 },
        check: { attr: "charm", dc: 11, perkBonus: [{ perk: "silver", n: 3 }, { perk: "comely", n: 2 }] },
        pass: { text: "By the end of it you know everyone worth knowing here and two of them owe you something.", eff: { renown: 2, standing: 2, secrets: 1, attr: { charm: 1 } } },
        fail: { text: "You spend the coin and wake with no new friends and an argument you cannot remember starting.", eff: { coin: -12, health: -6, standing: -2 } } },
    ] },

  /* -------------------------------------------------------------- RISK ---- */
  { id: "act-trouble", icon: "&#128163;", group: "Risk",
    when: { wild: false, notFlags: ["imprisoned"] },
    dm: "You go looking for it. There is always something in a place like this that a person could get involved in, if they were determined to.",
    opts: [
      { label: "Find whoever is doing something dangerous, and join in",
        check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "wary", n: 3 }] },
        pass: { text: "You find it and it is exactly as bad as advertised, and there is money in it.", eff: { coin: 70, notoriety: 5, health: -8, renown: 2 } },
        fail: { text: "You find it and it is worse than advertised.", eff: { health: -22, notoriety: 4 } } },
      { label: "Pick a fight with somebody important",
        check: { attr: "might", dc: 15, perkBonus: [{ perk: "strong", n: 3 }, { perk: "wolf-blood", n: 3 }] },
        pass: { text: "You put a man with a name on his back in front of witnesses. It is not wise. It is very, very effective.", eff: { renown: 6, standing: -4, notoriety: 6, health: -10 } },
        fail: { text: "Important people have men. That is largely what makes them important.", eff: { health: -26, standing: -6 } } },
    ] },

  { id: "act-steal-big", icon: "&#128274;", group: "Risk",
    when: { wild: false, anyFlag: ["knows-thieves", "cased-a-castle", "outlaw"], notFlags: ["imprisoned"] },
    dm: "You know a way in. Not a purse in a market — a strongroom, a counting house, a tower with one door and a guard who drinks.",
    opts: [
      { label: "Do it alone",
        check: { attr: "cunning", dc: 16, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quiet", n: 3 }, { perk: "quick", n: 2 }], flagBonus: [{ flag: "cased-a-castle", n: 4 }] },
        pass: { text: "Four hours, no noise, and out through the same window. Nobody will know until the quarter-day count.", eff: { coin: 400, notoriety: 8, attr: { cunning: 1 } } },
        fail: { text: "Something is where it was not last time.", eff: { health: -14 }, goto: "arrest" } },
      { label: "Do it with men", req: { minFollowers: 3 },
        check: { attr: "wits", dc: 15, followerBonus: { per: 3, max: 5 } },
        pass: { text: "Six of you, in and out, and a share that makes every one of them yours for another year.", eff: { coin: 700, notoriety: 14, followers: 1, renown: 3 } },
        fail: { text: "One of them talks about it beforehand, in a tavern, at length.", eff: { followers: -2, health: -16 }, goto: "arrest" } },
    ] },

  /* ------------------------------------------------------------- QUIET ---- */
  { id: "act-rest", icon: "&#128564;", group: "Quiet",
    when: {},
    dm: "You stop. A season of nothing much, which is a luxury and occasionally a necessity.",
    opts: [
      /* RESTING HAS TO ACTUALLY REST YOU. These used to mend health and leave
         the rest bar exactly where it was, which made the one action named
         after sleep the one action that did not produce any. */
      { label: "Rest and mend", res: { text: "Sleep, food, and no decisions. You are noticeably better at the end of it.", eff: { health: 22, rest: 70, coin: -8 } } },
      { label: "Rest, and think about what you are doing", res: { text: "It is not a comfortable season. You come out of it clearer, and slept.", eff: { health: 12, rest: 55, attr: { wits: 1 } } } },
      { label: "Sleep for a week and then do it again", res: { text: "You do very nearly nothing for three months. It is the most restorative and least interesting season of your life.", eff: { health: 30, rest: 100, coin: -14, food: -10 } } },
    ] },

  { id: "act-pray", venue: "temple", icon: "&#10024;", group: "Quiet",
    when: {},
    dm: "There is a sept, a godswood, a red temple, a drowned man's cave or simply a quiet place. Whatever you believe, or do not, the practice is the same.",
    opts: [
      { label: "Pray",
        res: { text: "Nothing answers, which is what praying mostly is. You feel steadier for it anyway.", eff: { health: 6, attr: { grit: 1 }, flags: ["faithful"] } } },
      { label: "Give generously to the temple", cost: { coin: 40 }, req: { minCoin: 40 },
        res: { text: "The septon, or the priest, or whoever holds the plate, learns your name and uses it warmly and often.", eff: { standing: 6, renown: 2, flags: ["faithful", "temple-friend"] } } },
      { label: "Take vows", req: { notFlags: ["sworn", "married"] },
        res: { text: "It is a narrow door and it closes behind you. You will never want for a bed or a meal again, and a great many other things are now finished.", eff: { flags: ["septon", "sworn", "sworn-celibate", "faithful"], work: "novice", standing: 8, attr: { wits: 1, charm: 1 } } } },
    ] },

  { id: "act-tend-holdings", venue: "hall", icon: "&#127968;", group: "Quiet",
    when: { wild: false, flags: ["landed"] },
    dm: "You have land now, and land is not a prize — it is a job that never finishes.",
    opts: [
      { label: "Work the land properly",
        check: { attr: "wits", dc: 12 },
        pass: { text: "Ditches cleared, a mill mended, two disputes settled before they became feuds. The place is worth more than it was.", eff: { coin: 120, standing: 4, followers: 1 } },
        fail: { text: "A bad season, a worse steward, and a bill you did not see coming.", eff: { coin: -60, standing: -2 } } },
      { label: "Squeeze it", req: { anyPerk: ["cruel", "sly"] },
        res: { text: "The rents go up and the harvest goes to you. It works, this year.", eff: { coin: 260, standing: -6, notoriety: 6, followers: -1 } } },
      { label: "Hold court and hear the smallfolk",
        check: { attr: "charm", dc: 12, perkBonus: [{ perk: "honest", n: 3 }] },
        pass: { text: "Eleven petitions, six of them nonsense. You settle the other five and the whole district hears how.", eff: { standing: 8, renown: 3, followers: 2 } },
        fail: { text: "You settle it badly and both parties leave certain you were bought.", eff: { standing: -5 } } },
    ] },

  /* ------------------------------------------------------------- PRISON --- */
  { id: "act-cell-wait", icon: "&#9939;", group: "The cell",
    when: { flags: ["imprisoned"] },
    dm: "There is very little to do in here, and a great deal of time in which to do it.",
    opts: [
      { label: "Sit it out", res: { text: "Another season of stone.", eff: { health: -4, attr: { grit: 1 } } } },
      { label: "Talk to whoever else is in here",
        check: { attr: "charm", dc: 12 },
        pass: { text: "The man in the next cell was somebody once and tells you a great deal he should not.", eff: { secrets: 1, flags: ["knows-thieves"], attr: { charm: 1 } } },
        fail: { text: "The man in the next cell does not want to talk and objects to being asked.", eff: { health: -10 } } },
      { label: "Work at the wall",
        check: { attr: "grit", dc: 16, perkBonus: [{ perk: "hardy", n: 3 }] },
        pass: { text: "A stone comes loose. It is not enough to get out. It is enough to keep going.", eff: { attr: { grit: 1, might: 1 }, flags: ["loose-stone"] } },
        fail: { text: "Nothing but bleeding fingers.", eff: { health: -8 } } },
    ] },
];
