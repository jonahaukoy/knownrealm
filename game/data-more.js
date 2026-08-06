/* ============================================================================
   THE IRON LADDER — THE WILD, AND THE STREET.

   Two additions, both about the same complaint: that the game told you what was
   happening instead of letting you decide what to do.

   1. THE STREET. If you are a nobody standing in Flea Bottom, the game should
      not have to offer you a scene before you can do anything. Everything below
      tagged `group: "The street"` is available the moment you arrive somewhere
      with people in it — eat, steal, whore, brawl, listen, or walk up the hill
      to the Red Keep and try to kill the king. That last one is in here because
      you should be *allowed* to, not because it will work.

   2. THE WILD. Out of a town, a turn is a DAY rather than a season and nothing
      is provided. Food, water and rest fall every day and take your attributes
      down with them, so the wilderness is not a place you pass through — it is
      a thing you survive, one decision at a time. Very little happens out here
      by itself; what happens is what you go and do.

   Appends to the same two arrays the rest of the game uses, so the engine and
   the checker cannot tell this file from the others. Load it last.
   ========================================================================== */

/* ==========================================================================
   THINGS TO DO, WHEREVER YOU ARE STANDING
   ========================================================================== */
window.IL_ACTIONS = (window.IL_ACTIONS || []).concat([

  /* ------------------------------------------------------- THE STREET ---- */
  { id: "act-eat", icon: "&#127830;", group: "The street",
    when: { wild: false, anyAmenity: ["inn", "market", "crowd"], notFlags: ["imprisoned"] },
    dm: "There is food to be had at {spot} — {dish}, if the smell is anything to go by. There is food here if you have coin, and food here if you do not. The two are obtained differently.",
    opts: [
      { label: "Buy a hot meal", cost: { coin: 3 }, req: { minCoin: 3 },
        res: { text: "{dish}, and a heel of bread with it. It is not good and it is a great deal better than nothing.", eff: { food: 45, water: 20, health: 4 } } },
      { label: "Buy properly — meat, bread and {drink}", cost: { coin: 14 }, req: { minCoin: 14, amenities: ["inn"] },
        reqWhy: "There is no inn here to do it in.",
        res: { text: "You eat until you are uncomfortable, which is a thing you have not done in a while.", eff: { food: 100, water: 45, rest: 15, health: 9 } } },
      { label: "Steal from a stall", req: { amenities: ["market"] }, reqWhy: "There is no market here to steal from.",
        check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quick", n: 3 }, { perk: "quiet", n: 2 }] },
        pass: { text: "A pie, straight off the board, and four streets between you and the man who baked it.", eff: { food: 55, notoriety: 2 } },
        fail: { text: "The pieman has a boy for exactly this and the boy is faster than you look.", eff: { health: -8 }, goto: "arrest" } },
      { label: "Beg a crust at a kitchen door",
        check: { attr: "charm", dc: 10, perkBonus: [{ perk: "comely", n: 3 }] },
        pass: { text: "A cook called {folk} with a soft heart and yesterday's bread. You eat on the step.", eff: { food: 35, standing: -2 } },
        fail: { text: "The door shuts. You hear laughing behind it.", eff: { standing: -3, rest: -5 } } },
    ] },

  /* THE WELL IS NOT EVERYWHERE. This action used to be offered to a man
     standing in the Dornish sand, which is where the whole amenity idea came
     from: the place declares what is in it, and every option below asks. */
  { id: "act-drink", icon: "&#128167;", group: "The street",
    when: { wild: false, notFlags: ["imprisoned"], anyAmenity: ["well", "inn", "stream", "harbour"] },
    dm: "You have not had a proper drink of anything today.",
    opts: [
      { label: "Drink at the well", req: { amenities: ["well"] }, reqWhy: "There is no well here.",
        res: { text: "Cold, and it tastes faintly of the bucket and slightly of the rope.", eff: { water: 70 } } },
      { label: "Drink at an inn", cost: { coin: 2 }, req: { minCoin: 2, amenities: ["inn"] },
        reqWhy: "There is nowhere here that sells a drink.",
        res: { text: "Small beer, which is safer than the well and better company.", eff: { water: 80, rest: 8, health: 2 } } },
      { label: "Find the stream and drink from that", req: { amenities: ["stream"], notAmenities: ["well"] },
        check: { attr: "wits", dc: 9 },
        pass: { text: "Running water above the town, which is the only water above a town worth drinking.", eff: { water: 75 } },
        fail: { text: "You drink below the town instead, and the town has been upstream of you all day.", eff: { water: 55, health: -6 } } },
      { label: "Beg a cup at a door", req: { maxCoin: 3 },
        check: { attr: "charm", dc: 9, perkBonus: [{ perk: "comely", n: 3 }] },
        pass: { text: "A cup, handed out through a half-open door and taken back the moment it is empty.", eff: { water: 55, standing: -1 } },
        fail: { text: "The door shuts.", eff: { rest: -4 } } },
    ] },

  { id: "act-sleep-town", icon: "&#128719;", group: "The street",
    when: { wild: false, notFlags: ["imprisoned"] },
    dm: "You need to sleep. Where you sleep is a question of coin.",
    opts: [
      { label: "Pay for a bed", cost: { coin: 4 }, req: { minCoin: 4, amenities: ["inn"] },
        reqWhy: "Nobody here rents beds to strangers.",
        res: { text: "A straw mattress, a door that shuts, and nobody standing over you at any point in the night.", eff: { rest: 100, health: 6 } } },
      { label: "Ask for a corner of somebody's floor", req: { notAmenities: ["inn"] },
        check: { attr: "charm", dc: 11, perkBonus: [{ perk: "honest", n: 3 }, { perk: "comely", n: 2 }] },
        pass: { text: "{folk} has a barn and no particular objection. You sleep warm and are gone before the household is up.", eff: { rest: 80, health: 3 } },
        fail: { text: "Nobody here takes in strangers, and one of them follows you to the edge of the houses to be sure you have gone.", eff: { rest: 25, health: -3 } } },
      { label: "Sleep rough",
        check: { attr: "grit", dc: 11, perkBonus: [{ perk: "hardy", n: 3 }] },
        pass: { text: "A doorway out of the wind. You wake stiff and unrobbed.", eff: { rest: 55, health: -2 } },
        fail: { text: "You wake with your boots gone and somebody's hand still going through your coat.", eff: { rest: 30, coin: -15, health: -6 } } },
    ] },

  { id: "act-brothel", venue: "brothel", icon: "&#127801;", group: "The street",
    when: { wild: false, minAge: 16, amenities: ["brothel"], notFlags: ["imprisoned", "sworn-celibate"] },
    dm: "There is a house near {spot} with a red lantern and a great deal of noise coming out of it. In a city this size there are said to be more of these than bakeries, and the sums involved suggest it is true.",
    opts: [
      { label: "Go in and spend the evening", cost: { coin: 8 }, req: { minCoin: 8 },
        res: { text: "Warm, loud, and for a few hours nobody wants anything from you that you cannot give them.", eff: { rest: 30, health: 5, coin: -8 } } },
      { label: "Go in to listen rather than anything else", cost: { coin: 8 }, req: { minCoin: 8 },
        check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "sly", n: 2 }] },
        pass: { text: "Men say things here they would not say at a council table, and the women remember all of it. One of them decides she likes you.", eff: { secrets: 1, rel: { brothel: 2 }, flags: ["knows-a-whisper"], attr: { cunning: 1 } } },
        fail: { text: "You spend the evening being charged for wine and learning nothing whatsoever.", eff: { coin: -10 } } },
      { label: "Look for work there", req: { maxCoin: 20 },
        check: { attr: "charm", dc: 13, perkBonus: [{ perk: "comely", n: 4 }] },
        pass: { text: "The keeper looks you over the way a man looks over a horse, and names a figure. It is more than you make in a season.", eff: { coin: 45, standing: -6, flags: ["worked-a-brothel"] } },
        fail: { text: "The keeper looks you over the way a man looks over a horse, and does not name a figure.", eff: { standing: -4 } } },
    ] },

  /* WHAT YOU HAVE ON YOUR HIP CHANGES THE OPTIONS, not merely the odds. A man
     with a sword is offered a killing; a man without one is offered a fist and
     a doorway. Both may go wrong. See `armed` in engine.js — this is the
     pattern for every scene where violence is on the table. */
  { id: "act-street-violence", venue: "street", icon: "&#128481;", group: "The street",
    when: { wild: false, amenities: ["crowd"], notFlags: ["imprisoned"] },
    dm: "There is a man at {spot} who has something you want, or has said something, or simply happens to be there. Nobody in this street is going to stop you.",
    opts: [
      { label: "Knock him down with your fists and take his purse", req: { armed: false },
        check: { attr: "might", dc: 13, perkBonus: [{ perk: "strong", n: 3 }, { perk: "big", n: 3 }, { perk: "cruel", n: 2 }] },
        pass: { text: "He goes down at the first blow and stays down. Eleven silver and a knife you keep.", eff: { coin: 11, items: ["knife"], notoriety: 5, standing: -2 } },
        fail: { text: "He is harder than he looked, or has friends, or both. It is very public and very brief.", eff: { health: -16, notoriety: 3 }, goto: "arrest" } },
      { label: "Show him the steel and take his purse", req: { armed: true },
        check: { attr: "might", dc: 10, perkBonus: [{ perk: "cruel", n: 3 }, { perk: "big", n: 2 }] },
        pass: { text: "You do not have to do anything with it. That is what a blade on the hip is for, and it is why men who own one are so seldom robbed.", eff: { coin: 26, notoriety: 6, standing: -2 } },
        fail: { text: "He looks at the sword, and then at you, and decides — correctly — that you have never used it.", eff: { health: -10, notoriety: 4, standing: -3 } } },
      { label: "Kill him with your bare hands", hint: "There is no undoing this.", req: { armed: false },
        check: { attr: "might", dc: 17, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "cruel", n: 3 }, { perk: "strong", n: 3 }] },
        pass: { text: "It takes far longer than you expected, and is far worse, and afterwards your hands will not stop.", eff: { kills: 1, coin: 12, notoriety: 16, flags: ["killer", "wanted"], attr: { grit: 1 }, health: -8 } },
        fail: { text: "You have never done this before and it shows in every part of it. He lives. Half the street saw.", eff: { health: -18, notoriety: 16, flags: ["wanted"] }, goto: "arrest" } },
      { label: "Put the blade in him", hint: "There is no undoing this.", req: { armed: true },
        check: { attr: "might", dc: 13, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "cruel", n: 3 }, { perk: "duellist", n: 3 }] },
        pass: { text: "It is done in a doorway and takes less time than it takes to describe. Somewhere behind you a woman starts screaming, and you are already two streets away.", eff: { kills: 1, coin: 18, notoriety: 14, flags: ["killer", "wanted"], attr: { grit: 1 } } },
        fail: { text: "A blade makes it quicker, not easier. He gets a hand on your wrist and there is a great deal of shouting.", eff: { health: -16, notoriety: 16, flags: ["wanted"] }, goto: "arrest" } },
      { label: "Pick a fight for the sake of it",
        check: { attr: "might", dc: 12, perkBonus: [{ perk: "strong", n: 3 }, { perk: "wolf-blood", n: 3 }] },
        pass: { text: "You win, and it is watched, and by evening two men in this quarter know your face for the right reasons.", eff: { renown: 2, health: -8, attr: { might: 1 } } },
        fail: { text: "You lose, and it is watched.", eff: { health: -14, standing: -3 } } },
      { label: "Think better of it", res: { text: "You walk on. He never knows how close it came.", eff: { spared: 1 } } },
    ] },

  { id: "act-listen", venue: "street", icon: "&#128064;", group: "The street",
    when: { wild: false, amenities: ["crowd"], notFlags: ["imprisoned"] },
    dm: "Stand still at {spot} for long enough and the place tells you things. Most of them are about {holder}.",
    opts: [
      { label: "Listen where people are waiting for something",
        check: { attr: "wits", dc: 11, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "clever", n: 2 }] },
        pass: { text: "Who is hiring, who is owed, and which of {holder}'s gates is never watched after dark.", eff: { secrets: 1, flags: ["knows-a-mark"], attr: { wits: 1 } } },
        fail: { text: "Nothing but complaints about bread and a long story about {folk}'s cousin.", eff: { rest: -8 } } },
      { label: "Ask questions directly", req: { anyPerk: ["silver", "connected"] },
        check: { attr: "charm", dc: 13 },
        pass: { text: "People tell you things when you ask as though you already half know them.", eff: { secrets: 1, standing: 1, attr: { charm: 1 } } },
        fail: { text: "Asking questions in a city like this is itself a piece of information, and you have just given it away.", eff: { notoriety: 3 } } },
    ] },

  { id: "act-gang", venue: "alleys", icon: "&#128101;", group: "The street",
    when: { wild: false, amenities: ["crowd"], anyPlaceTag: ["poor", "crime"], notFlags: ["imprisoned", "sworn"] },
    dm: "Every poor quarter has boys who run in a pack, and every pack has somebody it answers to. They have noticed you standing about at {spot}. The one who does the talking is called {folk}.",
    opts: [
      { label: "Run with them",
        check: { attr: "cunning", dc: 11 },
        pass: { text: "No oath, no wage, and a share of whatever the day turns up. Also nine people who will come if you shout.", eff: { followers: 3, coin: 8, notoriety: 5, flags: ["knows-thieves", "gang"] } },
        fail: { text: "They decide you are worth more as a mark than a member.", eff: { coin: -12, health: -8 } } },
      { label: "Take the pack off whoever runs it",
        check: { attr: "might", dc: 15, perkBonus: [{ perk: "strong", n: 3 }, { perk: "cruel", n: 3 }] },
        pass: { text: "It takes about ninety seconds in an alley, and afterwards there are nine boys looking at you and waiting to be told something.", eff: { followers: 9, renown: 3, notoriety: 8, flags: ["gang", "band-leader"], health: -10 } },
        fail: { text: "There were rather more of them than there appeared to be.", eff: { health: -22, standing: -3 } } },
      { label: "Have nothing to do with them", res: { text: "You keep walking. They watch you all the way down the street.", eff: {} } },
    ] },

  { id: "act-kill-the-king", venue: "street", icon: "&#128081;", group: "The street",
    when: { wild: false, anyPlaceTag: ["court"], notFlags: ["imprisoned"] },
    dm: "The king is up there. Everyone knows which building, and the road up the hill is not guarded until the last two hundred yards of it. Men have done this before. Almost none of them are alive.",
    opts: [
      { label: "Walk up the hill and try it now",
        check: { attr: "might", dc: 24, perkBonus: [{ perk: "cold-blood", n: 4 }, { perk: "duellist", n: 4 }, { perk: "big", n: 2 }], itemBonus: [{ item: "good-sword", n: 4 }, { item: "sword", n: 2 }, { item: "armour", n: 3 }] },
        pass: { text: "Nobody will ever satisfactorily explain how you got past the gate. There will be songs, and none of them will agree with each other, and every one of them will have your name in it.", eff: { kills: 1, renown: 60, notoriety: 60, standing: -30, flags: ["kingslayer", "wanted", "hunted"], health: -40, attr: { might: 2 } } },
        fail: { text: "You get further than most, which is to say the second courtyard. There are eight of them and they are the best the realm has.", eff: { die: "cut down in the yard, trying to reach a king" } } },
      { label: "Do it properly — learn the guard, the doors, the hours first",
        check: { attr: "wits", dc: 17, perkBonus: [{ perk: "clever", n: 3 }, { perk: "quiet", n: 3 }, { perk: "wary", n: 2 }] },
        pass: { text: "A season of watching. You know when the gate changes, which septon is let through unsearched, and which stair nobody uses. You have not done anything yet. You could.", eff: { secrets: 2, flags: ["cased-the-keep", "dangerous-knowledge"], attr: { wits: 1, cunning: 1 } } },
        fail: { text: "Somebody notices a man watching the gate for a season. They always do.", eff: { notoriety: 10, flags: ["wanted"], health: -6 } } },
      { label: "Go in by the way you found", req: { flags: ["cased-the-keep"] },
        check: { attr: "cunning", dc: 19, perkBonus: [{ perk: "quiet", n: 4 }, { perk: "cold-blood", n: 4 }, { perk: "sly", n: 3 }] },
        pass: { text: "You are in the room before anyone in the Red Keep knows there is a man in the Red Keep. What happens next takes a very short time and changes the realm.", eff: { kills: 1, renown: 70, notoriety: 70, flags: ["kingslayer", "wanted", "hunted", "-cased-the-keep"], health: -20, attr: { cunning: 2 } } },
        fail: { text: "The stair nobody uses is used tonight.", eff: { die: "taken in the Red Keep with a knife on you" } } },
      { label: "Stand at the bottom of the hill and look at it", res: { text: "You look at it for a long time and then go and find something to eat.", eff: { attr: { wits: 1 } } } },
    ] },

  /* ---------------------------------------------------------- THE WILD --- */
  { id: "act-forage", icon: "&#127807;", group: "Out here",
    when: { wild: true, notPlaceTags: ["sea"] },
    dm: "Somewhere in this country there is something you can eat. Finding it is the day's work.",
    opts: [
      { label: "Forage — roots, berries, whatever the season gives",
        check: { attr: "wits", dc: 12, perkBonus: [{ perk: "healer-hands", n: 3 }, { perk: "hardy", n: 2 }, { perk: "beast-friend", n: 2 }] },
        pass: { text: "Not much, and not good, and enough. You eat sitting down, which is the best part of it.", eff: { food: 40, rest: -6 } },
        fail: { text: "A long day of finding nothing, and one thing you ate that you should not have.", eff: { food: 22, health: -8, rest: -10 } } },
      { label: "Set snares and wait",
        check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "sly", n: 2 }, { perk: "wary", n: 2 }] },
        pass: { text: "Two rabbits by morning. You eat one and carry the other.", eff: { food: 60, rest: -4 } },
        fail: { text: "Empty snares, and something took the bait without tripping them.", eff: { food: 16, rest: -8 } } },
      { label: "Hunt", req: { items: ["bow"] },
        check: { attr: "swiftness", dc: 13, perkBonus: [{ perk: "quick", n: 3 }, { perk: "quiet", n: 3 }] },
        pass: { text: "A deer, at forty paces, cleanly. This is more meat than you can eat before it turns, which is its own kind of problem.", eff: { food: 100, coin: 6, attr: { swiftness: 1 } } },
        fail: { text: "You lose two arrows and the light.", eff: { food: 15, rest: -10 } } },
    ] },

  { id: "act-water", icon: "&#128167;", group: "Out here",
    when: { wild: true, notPlaceTags: ["sea"] },
    dm: "Water is the one that kills quickly. Three days without it and nothing else on this list matters.",
    opts: [
      { label: "Look for a stream",
        check: { attr: "wits", dc: 11, perkBonus: [{ perk: "clever", n: 2 }, { perk: "beast-friend", n: 3 }] },
        pass: { text: "Running water, cold and clean, an hour's walk downhill. You drink until your teeth ache and fill what you can carry.", eff: { water: 100, rest: -5 } },
        fail: { text: "Dry gullies all day.", eff: { water: 28, rest: -12 } } },
      { label: "Drink from whatever is standing here",
        check: { attr: "grit", dc: 13, perkBonus: [{ perk: "iron-stomach", n: 5 }] },
        pass: { text: "It is brown, it is warm, and it does not kill you.", eff: { water: 70 } },
        fail: { text: "It does not kill you either, but you spend two days wishing it had.", eff: { water: 45, health: -16, rest: -20 } } },
    ] },

  { id: "act-camp", icon: "&#128293;", group: "Out here",
    when: { wild: true, notPlaceTags: ["sea"] },
    dm: "Night is coming and you are outdoors. There is a right way to do this and a way most people do it.",
    opts: [
      { label: "Make a proper camp — fire, shelter, watch",
        check: { attr: "grit", dc: 12, perkBonus: [{ perk: "hardy", n: 3 }, { perk: "wary", n: 2 }] },
        pass: { text: "Dry, warm and nobody came near you. You wake feeling like a person.", eff: { rest: 85, health: 6 } },
        fail: { text: "The wood is wet, the fire will not take, and you sleep badly and cold.", eff: { rest: 30, health: -6 } } },
      { label: "Lie down where you are",
        res: { text: "You sleep the way an animal sleeps, in pieces, listening.", eff: { rest: 45, health: -3 } } },
      { label: "Keep walking through the night", req: { anyPerk: ["hardy", "cold-blood", "quick"] },
        check: { attr: "grit", dc: 15, perkBonus: [{ perk: "hardy", n: 4 }] },
        pass: { text: "You cover a great deal of ground and are still standing at dawn.", eff: { rest: -20, food: -10, renown: 0, attr: { grit: 1 } } },
        fail: { text: "You walk into a ditch in the dark and lie in it until it is light enough to climb out.", eff: { rest: -30, health: -12 } } },
    ] },

  { id: "act-rob-a-farm", icon: "&#127806;", group: "Out here",
    when: { wild: true, notPlaceTags: ["sea"], notFlags: ["imprisoned"] },
    dm: "There is a farmstead in the fold of the hill — a byre, a hayrick, a light in one window, and a dog that has not yet noticed you.",
    opts: [
      { label: "Take what you need from the barn in the dark",
        check: { attr: "cunning", dc: 12, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "sly", n: 3 }] },
        pass: { text: "Eggs, a round of hard cheese, and a sack of oats they will not miss until the count.", eff: { food: 80, water: 30, notoriety: 3 } },
        fail: { text: "The dog notices you. So does the farmer, who has a bill-hook and four sons.", eff: { health: -18, notoriety: 5, food: 25 } } },
      { label: "Knock, and ask",
        check: { attr: "charm", dc: 12, perkBonus: [{ perk: "honest", n: 3 }, { perk: "comely", n: 2 }] },
        pass: { text: "They feed you at their own table and put you in the hay, and ask for nothing, and you think about it for years.", eff: { food: 90, water: 60, rest: 70, health: 8, standing: 1 } },
        fail: { text: "The door does not open. A voice through it tells you where the road is.", eff: { rest: -8 } } },
      { label: "Take the place", hint: "There are four of them and one of you.",
        check: { attr: "might", dc: 16, perkBonus: [{ perk: "cruel", n: 4 }, { perk: "strong", n: 3 }], itemBonus: [{ item: "sword", n: 3 }] },
        pass: { text: "You eat at their table after all. In the morning you take the horse as well.", eff: { food: 100, water: 70, rest: 60, coin: 30, items: ["horse"], kills: 1, notoriety: 18, flags: ["killer"] } },
        fail: { text: "Farmers are not soldiers. They are also not helpless, and there are four of them.", eff: { health: -30, notoriety: 8 } } },
      { label: "Leave them alone", res: { text: "You go around the hill and are hungry about it.", eff: { spared: 1, rest: -6 } } },
    ] },

  { id: "act-leave-wild", icon: "&#128682;", group: "Out here",
    when: { wild: true, notPlaceTags: ["sea"] },
    dm: "You could walk out of this. There is a road somewhere south, or east, and at the end of it a place with a roof and somebody selling bread.",
    opts: [
      { label: "Walk until you find a town",
        check: { attr: "grit", dc: 12, perkBonus: [{ perk: "rider", n: 3 }, { perk: "hardy", n: 3 }], itemBonus: [{ item: "horse", n: 3 }] },
        pass: { text: "Three days, and then smoke on the horizon, and then a gate.", eff: { rest: -25, food: -25, water: -25 } },
        fail: { text: "You walk for three days and end up somewhere that looks a great deal like where you started.", eff: { rest: -35, food: -30, water: -35, health: -8 } } },
    ] },

]);

/* ==========================================================================
   THE FEW THINGS THAT COME TO YOU OUT HERE
   ========================================================================== */
window.IL_EVENTS = (window.IL_EVENTS || []).concat([

{ id: "w-traveller", w: 3, when: { wild: true },
  dm: "Somebody else is out here. One man, walking, with a stick and a bundle, and he has seen you at the same moment you saw him.",
  opts: [
    { label: "Share what you have", req: { minFood: 30 },
      check: { attr: "charm", dc: 11 },
      pass: { text: "He has salt and you have none, and he knows this country. He walks with you a day and tells you where the water is.", eff: { water: 40, food: -10, secrets: 1, standing: 1 } },
      fail: { text: "He takes what you offer and is gone before you wake.", eff: { food: -25, coin: -8 } } },
    { label: "Rob him",
      check: { attr: "might", dc: 12, perkBonus: [{ perk: "strong", n: 3 }, { perk: "cruel", n: 2 }] },
      pass: { text: "He has bread, a waterskin and nine coppers, and he is not going to argue about any of it.", eff: { food: 40, water: 40, coin: 9, notoriety: 4 } },
      fail: { text: "The stick is not a walking stick.", eff: { health: -14 } } },
    { label: "Pass on opposite sides of the road",
      res: { text: "Neither of you says anything. That is how it is usually done out here.", eff: {} } },
  ] },

{ id: "w-wolves", w: 3, when: { wild: true, anyPlaceTag: ["forest", "cold", "mountain"] },
  dm: "They have been pacing you since midday, out at the edge of what you can see. There are more of them than there were an hour ago.",
  opts: [
    { label: "Build a fire and sit with your back to something",
      check: { attr: "wits", dc: 12, perkBonus: [{ perk: "wary", n: 3 }, { perk: "hardy", n: 2 }] },
      pass: { text: "Fire holds them. You do not sleep, and in the morning they are gone.", eff: { rest: -30, health: -2 } },
      fail: { text: "The fire goes out at the worst hour of the night.", eff: { health: -22, rest: -35 } } },
    { label: "Kill one so the rest learn",
      check: { attr: "might", dc: 14, perkBonus: [{ perk: "strong", n: 3 }, { perk: "cold-blood", n: 2 }], itemBonus: [{ item: "sword", n: 3 }, { item: "bow", n: 4 }] },
      pass: { text: "They learn. And the one you killed is a great deal of meat.", eff: { food: 70, health: -8, renown: 1, attr: { might: 1 } } },
      fail: { text: "You are not the first thing they have hunted and you are not the largest.", eff: { health: -28 } } },
    { label: "Climb", req: { anyPerk: ["quick", "quiet"] },
      check: { attr: "swiftness", dc: 12, perkBonus: [{ perk: "quick", n: 4 }] },
      pass: { text: "You spend the night in a tree, which is cold and undignified and works perfectly.", eff: { rest: -25, health: -3 } },
      fail: { text: "The branch does not hold.", eff: { health: -20, rest: -25 } } },
  ] },

{ id: "w-burnt-village", w: 2, when: { wild: true },
  dm: "There was a village here about a month ago. There is not one now. Whatever came through did it thoroughly and did not stay.",
  opts: [
    { label: "Search it",
      check: { attr: "cunning", dc: 12 },
      pass: { text: "A root cellar they never found, with a crock of pork fat and two jars of preserves in it.", eff: { food: 85, coin: 12 } },
      fail: { text: "Nothing but what the fire left, and one thing under a doorframe you wish you had not turned over.", eff: { food: 8, health: -4, rest: -10 } } },
    { label: "Bury what is left",
      res: { text: "It takes all day and most of the strength you had. Nobody will ever know you did it.", eff: { rest: -30, food: -15, standing: 2, renown: 1, attr: { grit: 1 } } } },
    { label: "Keep walking", res: { text: "You do not stop. There is a great deal of this country lately.", eff: { rest: -8 } } },
  ] },

{ id: "w-storm", w: 3, when: { wild: true },
  dm: "The weather turns, and out here that is not an inconvenience but an event.",
  opts: [
    { label: "Find shelter and sit it out",
      check: { attr: "wits", dc: 11, perkBonus: [{ perk: "wary", n: 3 }] },
      pass: { text: "An overhang, a dry hour, and rainwater you can drink straight off the rock.", eff: { water: 60, rest: -10 } },
      fail: { text: "There is nowhere. You are soaked for two days and cannot get warm.", eff: { health: -14, rest: -30, water: 30 } } },
    { label: "Walk through it",
      check: { attr: "grit", dc: 14, perkBonus: [{ perk: "hardy", n: 4 }] },
      pass: { text: "Miserable and effective. You are a long way on by the time it clears.", eff: { water: 40, rest: -25, attr: { grit: 1 } } },
      fail: { text: "You should not have walked through it.", eff: { health: -20, rest: -35 } } },
  ] },

{ id: "w-hedge-knight", w: 2, when: { wild: true, sides: ["westeros"] },
  dm: "A knight is camped by the road — one horse, one shield with the paint coming off, and a fire he is very obviously willing to share because he has nothing to put on it.",
  opts: [
    { label: "Sit at his fire and share what you have", req: { minFood: 25 },
      res: { text: "He talks all night about a tourney at Ashford sixty years before he was born. In the morning he shows you three things about holding a sword that nobody has ever bothered to tell you.", eff: { food: -20, rest: 60, attr: { might: 1 }, health: 4 } } },
    { label: "Ask to serve him",
      check: { attr: "charm", dc: 13 },
      pass: { text: "He has no coin, no land and no lord, and he takes you on anyway, which is the entire character of hedge knights.", eff: { flags: ["squire-to-a-hedge-knight"], work: "squire", rest: 40, standing: 2 } },
      fail: { text: "He cannot feed himself, let alone you, and says so kindly.", eff: { rest: 20 } } },
    { label: "Take the horse in the night",
      check: { attr: "cunning", dc: 14, perkBonus: [{ perk: "quiet", n: 4 }] },
      pass: { text: "It is the only thing he owns. You are eleven leagues away by dawn.", eff: { items: ["horse"], notoriety: 6, standing: -4 } },
      fail: { text: "He sleeps beside it, as men who own one horse do.", eff: { health: -16 } } },
  ] },

{ id: "w-nothing", w: 6, filler: true, when: { wild: true },
  dm: "Nothing at all happens today. There is the country, and the weather, and the steady arithmetic of what you have left.",
  opts: [
    { label: "Walk on", res: { text: "You walk. The light goes. You walk a little further.", eff: { rest: -6 } } },
    { label: "Rest a while", res: { text: "You sit down for an hour and do not think about very much.", eff: { rest: 18, food: -4 } } },
  ] },

]);
