/* ============================================================================
   THE IRON LADDER — WHAT A LIFE IS MADE OF.

   Everything character creation offers, plus the six attributes the whole game
   rolls against. The creation screen is a renderer over this file: adding a
   house, a trade or a perk is a row here and nothing else.

   THE SIX. Every check in the game is  d20 + attribute  against a difficulty,
   and the player is shown all three numbers. That is the D&D bargain: you are
   allowed to lose, as long as you can see exactly how close you came. An
   attribute of 3 is feeble, 6 is ordinary, 10 is the best in a village, 14 is
   the best in a kingdom.

   WHERE VALUES COME FROM. base 3 → + birth → + trade → + 2 for each perk that
   names it → and then the life itself, because outcomes hand out attribute
   points and that is how a character grows. See engine.js: buildCharacter().

   Nothing here is secret; all of it is shown at creation. If a server is ever
   built (README.md) it must re-check a submitted character against this table,
   because a client-side table is a menu and never a rule.
   ========================================================================== */

window.IL_DATA = {

  /* --------------------------------------------------------- ATTRIBUTES --- */
  attrs: [
    { id: "might",     name: "Might",     emoji: "&#128170;",
      blurb: "Strength of arm — swinging, lifting, holding a line when it wants to break." },
    { id: "swiftness", name: "Swiftness", emoji: "&#127939;",
      blurb: "Speed and stealth — striking first, and not being where the blow lands." },
    { id: "wits",      name: "Wits",      emoji: "&#129504;",
      blurb: "Letters, numbers and plans. Seeing the shape of a thing before it finishes forming." },
    { id: "charm",     name: "Charm",     emoji: "&#128172;",
      blurb: "Making people want to help you — or at least want you to think well of them." },
    { id: "grit",      name: "Grit",      emoji: "&#127786;",
      blurb: "Enduring. Cold, hunger, pain, fear, and the long boredom between them." },
    { id: "cunning",   name: "Cunning",   emoji: "&#127183;",
      blurb: "Lying well, taking what is not yours well, and knowing when somebody is doing both to you." },
  ],

  /* ------------------------------------------------------------- HOUSES --- */
  /* Offered only to a highborn birth, and only in the matching realm. The first
     in each list is the great house; the rest are its bannermen, which is a
     materially different life. */
  houses: {
    north: [
      { id: "stark", name: "House Stark", words: "Winter is coming", rank: "great", seat: "winterfell" },
      { id: "manderly", name: "House Manderly", words: "We do not sow — we build", rank: "lord", seat: "white-harbor" },
      { id: "bolton", name: "House Bolton", words: "Our blades are sharp", rank: "lord", seat: "dreadfort" },
      { id: "umber", name: "House Umber", words: "We shall never fail you", rank: "lord", seat: "last-hearth" },
      { id: "mormont", name: "House Mormont", words: "Here we stand", rank: "minor", seat: "bear-island" },
      { id: "karstark", name: "House Karstark", words: "The sun of winter", rank: "lord", seat: "karhold" },
    ],
    riverlands: [
      { id: "tully", name: "House Tully", words: "Family, duty, honour", rank: "great", seat: "riverrun" },
      { id: "frey", name: "House Frey", words: "We stand together", rank: "lord", seat: "the-twins" },
      { id: "mallister", name: "House Mallister", words: "Above the rest", rank: "lord", seat: "seagard" },
      { id: "blackwood", name: "House Blackwood", words: "No words, only a raven", rank: "lord", seat: "raventree-hall" },
      { id: "bracken", name: "House Bracken", words: "No words, only a horse", rank: "lord", seat: "stone-hedge" },
    ],
    vale: [
      { id: "arryn", name: "House Arryn", words: "As high as honour", rank: "great", seat: "eyrie" },
      { id: "royce", name: "House Royce", words: "We remember", rank: "lord", seat: "runestone" },
      { id: "redfort", name: "House Redfort", words: "As strong as stone", rank: "lord", seat: "redfort" },
      { id: "corbray", name: "House Corbray", words: "No words, only a raven's talons", rank: "lord", seat: "heart-home" },
    ],
    "iron-islands": [
      { id: "greyjoy", name: "House Greyjoy", words: "We do not sow", rank: "great", seat: "pyke" },
      { id: "harlaw", name: "House Harlaw", words: "No words worth repeating", rank: "lord", seat: "ten-towers" },
      { id: "goodbrother", name: "House Goodbrother", words: "Honour the old ways", rank: "lord", seat: "hammerhorn" },
      { id: "blacktyde", name: "House Blacktyde", words: "No words, only a shield", rank: "minor", seat: "blacktyde" },
    ],
    westerlands: [
      { id: "lannister", name: "House Lannister", words: "Hear me roar", rank: "great", seat: "casterly-rock" },
      { id: "crakehall", name: "House Crakehall", words: "None so fierce", rank: "lord", seat: "crakehall" },
      { id: "marbrand", name: "House Marbrand", words: "No words, only a burning tree", rank: "lord", seat: "ashemark" },
      { id: "lefford", name: "House Lefford", words: "No words worth the carving", rank: "lord", seat: "golden-tooth" },
    ],
    crownlands: [
      { id: "baratheon", name: "House Baratheon", words: "Ours is the fury", rank: "great", seat: "red-keep" },
      { id: "velaryon", name: "House Velaryon", words: "The old, the true, the brave", rank: "lord", seat: "driftmark" },
      { id: "rykker", name: "House Rykker", words: "No words, only an oak", rank: "lord", seat: "duskendale" },
      { id: "stokeworth", name: "House Stokeworth", words: "Proud to be faithful", rank: "minor", seat: "stokeworth" },
    ],
    reach: [
      { id: "tyrell", name: "House Tyrell", words: "Growing strong", rank: "great", seat: "highgarden" },
      { id: "hightower", name: "House Hightower", words: "We light the way", rank: "lord", seat: "oldtown" },
      { id: "tarly", name: "House Tarly", words: "First in battle", rank: "lord", seat: "horn-hill" },
      { id: "redwyne", name: "House Redwyne", words: "No words, only a grape", rank: "lord", seat: "arbor" },
      { id: "florent", name: "House Florent", words: "No words, only a fox", rank: "lord", seat: "brightwater" },
    ],
    stormlands: [
      { id: "baratheon-se", name: "House Baratheon of Storm's End", words: "Ours is the fury", rank: "great", seat: "storms-end" },
      { id: "tarth", name: "House Tarth", words: "No words, only quartered suns and moons", rank: "lord", seat: "evenfall" },
      { id: "dondarrion", name: "House Dondarrion", words: "No words, only a lightning bolt", rank: "lord", seat: "blackhaven" },
      { id: "connington", name: "House Connington", words: "No words, only griffins", rank: "lord", seat: "griffins-roost" },
    ],
    dorne: [
      { id: "martell", name: "House Martell", words: "Unbowed, unbent, unbroken", rank: "great", seat: "sunspear" },
      { id: "yronwood", name: "House Yronwood", words: "We guard the way", rank: "lord", seat: "yronwood" },
      { id: "dayne", name: "House Dayne", words: "No words, only a falling star", rank: "lord", seat: "starfall" },
      { id: "uller", name: "House Uller", words: "No words worth trusting", rank: "lord", seat: "hellholt" },
    ],
  },

  bastardNames: {
    north: "Snow", riverlands: "Rivers", vale: "Stone", "iron-islands": "Pyke",
    westerlands: "Hill", crownlands: "Waters", reach: "Flowers",
    stormlands: "Storm", dorne: "Sand",
  },

  /* -------------------------------------------------------------- BIRTH --- */
  /* `only` narrows a birth to a side of the world, a set of realms, or places
     carrying a tag. Absent means everywhere. `w` weights the "surprise me"
     roll: being born trueborn of a great house should not be as likely as
     being born to a fisherman, and the die says so. */
  births: [
    { id: "trueborn", name: "Trueborn of a house", w: 1,
      only: { sides: ["westeros"] },
      blurb: "A name every innkeeper in the realm knows, and every enemy too. You begin with standing, coin, and a household that expects things of you.",
      note: "Doors open. So do knives.",
      start: { coin: 260, standing: 62, followers: 10, health: 100 },
      attr: { charm: 3, wits: 3, might: 1, grit: 0, swiftness: 1, cunning: 1 } },

    { id: "landed", name: "Of a landed knight's house", w: 3,
      only: { sides: ["westeros"] },
      blurb: "A tower, forty acres and a name nobody outside your own valley has heard. Respectable, and one bad harvest from nothing.",
      note: "The comfortable middle, which in this realm is very thin.",
      start: { coin: 95, standing: 34, followers: 4, health: 100 },
      attr: { might: 2, grit: 1, charm: 1, wits: 1, swiftness: 1, cunning: 0 } },

    { id: "bastard", name: "A bastard", w: 3,
      blurb: "Your father's face and none of his name. Highborn enough to be taught letters and arms; lowborn enough to be reminded of it daily.",
      note: "Nothing is owed you and nothing is expected of you. Both are useful.",
      start: { coin: 55, standing: 20, followers: 2, health: 100 },
      attr: { might: 1, grit: 2, wits: 2, cunning: 2, swiftness: 1, charm: 0 } },

    { id: "merchant", name: "Of a merchant family", w: 2,
      only: { sides: ["essos"] },
      blurb: "Ledgers, warehouses and a father who counts in three currencies. No blood worth boasting of, and rather more money than most who have it.",
      note: "In Essos, coin does what blood does in Westeros — and does it faster.",
      start: { coin: 220, standing: 30, followers: 3, health: 100 },
      attr: { wits: 4, charm: 2, cunning: 2, grit: 0, might: 0, swiftness: 1 } },

    { id: "freefolk", name: "Free folk", w: 4,
      only: { realms: ["beyond-the-wall"] },
      blurb: "No lord, no law, no taxes and no walls. You have knelt to nobody, and you will explain this to anyone who stands still long enough.",
      note: "The hardest country in the world, and the only one with no masters in it.",
      start: { coin: 6, standing: 4, followers: 2, health: 110 },
      attr: { grit: 4, might: 3, swiftness: 2, cunning: 1, wits: 0, charm: 0 } },

    { id: "slave", name: "Born a slave", w: 3,
      only: { placeTags: ["slave"] },
      blurb: "A collar, a number and somebody else's name for you. What you know, you learned by watching people who did not know you were listening.",
      note: "The lowest start in the game. There is no floor beneath it, and a great deal of room above.",
      start: { coin: 0, standing: 0, followers: 0, health: 95 },
      attr: { grit: 3, cunning: 3, wits: 2, swiftness: 1, might: 1, charm: 0 } },

    { id: "smallfolk", name: "Smallfolk", w: 7,
      blurb: "A village, a trade, and a lord you have seen twice. Nobody will ever write down what happens to you — unless you make them.",
      note: "The long climb. This is the game the game is named for.",
      start: { coin: 16, standing: 5, followers: 1, health: 100 },
      attr: { grit: 2, might: 2, wits: 1, cunning: 1, swiftness: 1, charm: 1 } },

    { id: "nobody", name: "A nobody", w: 2,
      blurb: "No village, no trade, no name worth giving. You woke somewhere and started walking. Nobody is looking for you, which cuts both ways.",
      note: "The hardest opening, and the only one with no leash on it at all.",
      start: { coin: 3, standing: 0, followers: 0, health: 100 },
      attr: { cunning: 3, swiftness: 3, grit: 2, wits: 1, might: 1, charm: 1 } },
  ],

  /* --------------------------------------------------------------- WORK --- */
  /* What you do for bread when the day has nothing else in it. Every trade
     earns; every trade is also a door to a different set of scenes later,
     because the deck asks what you do for a living. */
  works: [
    /* NO TRADE IS A REAL CHOICE, and it pays nothing. A wage is something a
       job gives you; a character who never took one is not handed coin every
       season for existing. Everything you have, you went and got. */
    { id: "none", name: "No trade at all", emoji: "&#10060;", wage: 0,
      blurb: "You do not have work and nobody is expecting you anywhere. Nothing arrives at the end of the season — everything you get, you go and get.",
      gives: ["Nobody's man", "No wage at all"], attr: { cunning: 1, swiftness: 1 } },
    { id: "farmer", name: "Farmhand", emoji: "&#127806;", wage: 6,
      blurb: "Slow, honest coin, and a reason to be anywhere in the countryside without being questioned.",
      gives: ["Steady", "Unwatched"], attr: { grit: 2, might: 1 } },
    { id: "smith", name: "Smith's apprentice", emoji: "&#128296;", wage: 11,
      blurb: "Hot work, good money, and the only trade that legally puts steel in your hands every day.",
      gives: ["Good pay", "Can make arms"], attr: { might: 2, grit: 1 } },
    { id: "sellsword", name: "Sellsword", emoji: "&#128481;", wage: 14,
      blurb: "Paid to be dangerous. The pay is uneven, the work is short, and it is the fastest road to wherever a war is.",
      gives: ["Arms", "Travels light"], attr: { might: 2, swiftness: 1, grit: 1 } },
    { id: "thief", name: "Cutpurse", emoji: "&#127760;", wage: 13,
      blurb: "Fast coin, faster consequences. The watch has a long memory and a short rope.",
      gives: ["Fast coin", "Risk of the block"], attr: { cunning: 3, swiftness: 1 } },
    { id: "sailor", name: "Sailor", emoji: "&#9875;", wage: 9,
      blurb: "The only work that carries you across water without paying for it. Half the world is reachable no other way.",
      gives: ["Free passage", "Gone for months"], attr: { grit: 2, swiftness: 1, might: 1 } },
    { id: "servant", name: "Household servant", emoji: "&#127869;", wage: 5,
      blurb: "Poor pay, a warm bed, and you are in the room when the important people forget you are in the room.",
      gives: ["Hears everything", "Poor pay"], attr: { cunning: 2, charm: 1, wits: 1 } },
    { id: "novice", name: "Novice of the Faith", emoji: "&#10014;", wage: 4,
      blurb: "Fed, lettered, and welcome in every holdfast in the Seven Kingdoms. Also sworn, watched, and expected to mean it.",
      gives: ["Welcome anywhere", "Vows"], attr: { wits: 2, charm: 2 }, only: { sides: ["westeros"] } },
    { id: "squire", name: "Squire", emoji: "&#128737;", wage: 5,
      blurb: "Someone else's armour, someone else's horse, and the only road to knighthood the realm recognises.",
      gives: ["Road to knighthood", "Bound to a knight"], attr: { might: 2, grit: 1, charm: 1 },
      need: ["trueborn", "landed", "bastard"] },
    { id: "steward", name: "Steward of the house", emoji: "&#128220;", wage: 12,
      blurb: "Ledgers, stores and the household's whole business held in your head. Dull, and quietly the most powerful post in any castle.",
      gives: ["Coin and letters", "Little glory"], attr: { wits: 3, cunning: 1 },
      need: ["trueborn", "landed", "merchant"] },
    { id: "hunter", name: "Hunter", emoji: "&#127993;", wage: 7,
      blurb: "A bow, a wood and a lord who owns both. Meat is easy to find and hard to explain.",
      gives: ["Bow", "Poaching is hanging"], attr: { swiftness: 2, grit: 1, cunning: 1 } },
    { id: "fisher", name: "Fisherman", emoji: "&#128031;", wage: 6,
      blurb: "Cold hands, small coin, and a boat — which is worth more than the coin the day you need to leave.",
      gives: ["A boat", "Small coin"], attr: { grit: 2, swiftness: 1 } },
    { id: "miner", name: "Miner", emoji: "&#9935;", wage: 8,
      blurb: "Down in the dark for someone else's gold. It ruins your lungs and builds everything else.",
      gives: ["Strong back", "Bad chest"], attr: { might: 3, grit: 1 } },
    { id: "mummer", name: "Mummer", emoji: "&#127917;", wage: 7,
      blurb: "A cart, a costume and a licence to be a different person in every town you enter.",
      gives: ["Disguise", "Nobody trusts you"], attr: { charm: 3, cunning: 1 } },
    { id: "singer", name: "Singer", emoji: "&#127925;", wage: 8,
      blurb: "You eat at the high table and sleep in the stable, and you hear things at both.",
      gives: ["Into any hall", "Kept for amusement"], attr: { charm: 3, wits: 1 } },
    { id: "healer", name: "Herb-woman or healer", emoji: "&#127807;", wage: 8,
      blurb: "You know what to boil and what to burn. Half the realm calls it wisdom and the other half calls it witchcraft.",
      gives: ["Mend wounds", "Suspicion"], attr: { wits: 3, grit: 1 } },
    { id: "guard", name: "House guard", emoji: "&#128296;", wage: 9,
      blurb: "A spear, a cloak with someone's arms on it, and a great deal of standing about in the cold.",
      gives: ["Arms and a wage", "Sworn"], attr: { might: 2, grit: 2 } },
    { id: "scribe", name: "Scribe", emoji: "&#128221;", wage: 10,
      blurb: "You write other people's letters, which means you read them first.",
      gives: ["Letters", "Sees secrets"], attr: { wits: 3, cunning: 1 } },
    { id: "trader", name: "Trader", emoji: "&#9878;&#65039;", wage: 12,
      blurb: "Buy in one town, sell in the next, and know the difference before you set out.",
      gives: ["Coin grows", "Debt grows faster"], attr: { wits: 2, charm: 2 } },
    { id: "innkeep", name: "Innkeeper's hand", emoji: "&#127866;", wage: 7,
      blurb: "Every traveller in the realm passes through a common room, and they all talk more than they mean to.",
      gives: ["Rumour", "Tied to one place"], attr: { charm: 2, wits: 1, cunning: 1 } },
    { id: "smuggler", name: "Smuggler", emoji: "&#128230;", wage: 15,
      blurb: "Cargo that pays four times, and a hand you might lose for carrying it.",
      gives: ["Very fast coin", "The block"], attr: { cunning: 3, swiftness: 2 },
      only: { placeTags: ["port"] } },
    { id: "pit-fighter", name: "Pit fighter", emoji: "&#9876;&#65039;", wage: 16,
      blurb: "Twenty thousand people want to watch you die, and will pay handsomely if you refuse.",
      gives: ["Fame fast", "Death faster"], attr: { might: 3, swiftness: 2 },
      only: { realms: ["slavers-bay"] } },
    { id: "reaver", name: "Reaver", emoji: "&#128739;", wage: 13,
      blurb: "What is not taken is not owned. You take, and the sea takes you back.",
      gives: ["Plunder", "Everyone hates you"], attr: { might: 2, grit: 2, swiftness: 1 },
      only: { realms: ["iron-islands"] } },
    { id: "spear-wife", name: "Raider of the free folk", emoji: "&#10052;&#65039;", wage: 4,
      blurb: "You take what you need from the woods, the wildlings south of you, and occasionally the Wall.",
      gives: ["Fears nothing", "Nothing to lose"], attr: { grit: 3, swiftness: 2 },
      only: { realms: ["beyond-the-wall"] } },
    { id: "acolyte", name: "Acolyte of the red temple", emoji: "&#128293;", wage: 6,
      blurb: "The night is dark, and the temple is warm, and the questions they ask you are not comfortable ones.",
      gives: ["Reads people", "Bound to a god"], attr: { charm: 2, wits: 2 },
      only: { sides: ["essos"] } },
  ],

  /* --------------------------------------------------------------- PERKS --- */
  /* Pick THREE. Each adds +2 to an attribute AND is checked by name in the
     event deck — so a perk is both a number and a key that unlocks options
     nobody else is offered. */
  perkPoints: 3,
  perks: [
    { id: "strong", name: "Strong", emoji: "&#128170;", attr: { might: 2 },
      blurb: "You win fights you should lose, and lose the ones you should win more slowly." },
    { id: "quick", name: "Quick", emoji: "&#127939;", attr: { swiftness: 2 },
      blurb: "First to strike, and first out of a room that is going wrong." },
    { id: "clever", name: "Clever", emoji: "&#129504;", attr: { wits: 2 },
      blurb: "You see the shape of a plan two moves before the people making it do." },
    { id: "comely", name: "Comely", emoji: "&#127801;", attr: { charm: 2 },
      blurb: "Doors open a little further. People remember you, which is not always what you want." },
    { id: "hardy", name: "Hardy", emoji: "&#127786;", attr: { grit: 2 },
      blurb: "Cold, hunger and bad water take longer to take you." },
    { id: "sly", name: "Sly", emoji: "&#127183;", attr: { cunning: 2 },
      blurb: "You lie at the speed of ordinary speech and nobody has yet caught the seam." },
    { id: "lettered", name: "Lettered", emoji: "&#128214;", attr: { wits: 2 },
      blurb: "You can read, write and — should the need arise — forge. In a realm where most cannot, that is a weapon." },
    { id: "silver", name: "Silver-tongued", emoji: "&#128172;", attr: { charm: 2 },
      blurb: "You talk people into things. Followers gathered by words stay longer than followers bought." },
    { id: "cruel", name: "Cruel", emoji: "&#128128;", attr: { might: 2 },
      blurb: "People do what you say sooner. They also leave the moment you are weak." },
    { id: "honest", name: "Honest", emoji: "&#9878;&#65039;", attr: { grit: 2 },
      blurb: "Slow to gain and slow to lose. Oaths sworn to you are kept more often than they are broken." },
    { id: "rider", name: "Born to the saddle", emoji: "&#128052;", attr: { swiftness: 2 },
      blurb: "You cross ground faster than other men, and arrive able to fight." },
    { id: "sea-legs", name: "Sea legs", emoji: "&#9973;", attr: { grit: 2 },
      blurb: "Ships do not frighten you, and captains take you cheap." },
    { id: "connected", name: "Well connected", emoji: "&#128279;", attr: { charm: 2 },
      blurb: "You know somebody wherever you go, and somebody knows what you owe." },
    { id: "wary", name: "Wary", emoji: "&#128064;", attr: { cunning: 2 },
      blurb: "You have never once sat with your back to a door, and it has already saved your life." },
    { id: "beast-friend", name: "Good with beasts", emoji: "&#128021;", attr: { charm: 2 },
      blurb: "Dogs come to you, horses stand for you, and ravens do not scream when you pass." },
    { id: "iron-stomach", name: "Iron stomach", emoji: "&#127830;", attr: { grit: 2 },
      blurb: "Bad meat, worse water, and a suspicious cup of wine have all failed to kill you so far." },
    { id: "duellist", name: "Duellist", emoji: "&#128481;", attr: { swiftness: 2 },
      blurb: "You were taught properly, by somebody who was paid well, and it shows in the first exchange." },
    { id: "born-lucky", name: "Born lucky", emoji: "&#127808;", attr: { cunning: 2 },
      blurb: "Things go your way slightly more often than they should. Nobody can explain it, least of all you." },
    { id: "big", name: "Uncommonly large", emoji: "&#127984;", attr: { might: 2 },
      blurb: "Men step aside in doorways. It is very difficult for you to go unnoticed anywhere." },
    { id: "quiet", name: "Easily overlooked", emoji: "&#129323;", attr: { cunning: 2 },
      blurb: "Nobody remembers your face an hour later. In this world that is nearly a magic power." },
    { id: "healer-hands", name: "Healing hands", emoji: "&#127807;", attr: { wits: 2 },
      blurb: "You know which wounds to close and which to leave open, and you recover from your own faster." },
    { id: "cold-blood", name: "Cold-blooded", emoji: "&#10052;&#65039;", attr: { grit: 2 },
      blurb: "Fear arrives late with you, and leaves early. You have done things afterwards that you should not have been able to do." },
    { id: "bookish", name: "Trained by a maester", emoji: "&#9939;", attr: { wits: 2 },
      blurb: "Somebody with a chain around his neck took an interest in you, and you can still hear him correcting you." },
    { id: "wolf-blood", name: "The wolf blood", emoji: "&#128058;", attr: { might: 2 },
      blurb: "A temper that arrives faster than thought. It has won you fights and lost you everything else." },
  ],

  /* ------------------------------------------------------------ AMBITION --- */
  /* Picked at creation. It does not restrict anything — it sets what the
     chronicle measures you against at the end, and the deck leans toward it. */
  ambitions: [
    { id: "power", name: "To rule", emoji: "&#128081;",
      blurb: "A seat, a title, and men who must do as you say. Measured in lands held and banners sworn." },
    { id: "gold", name: "To be rich", emoji: "&#128176;",
      blurb: "Enough coin that nobody may ever again tell you where to stand. Measured in what is in the chest at the end." },
    { id: "glory", name: "To be sung of", emoji: "&#127925;",
      blurb: "A name in the songs, whatever it costs the man who carries it. Measured in renown." },
    { id: "vengeance", name: "To have vengeance", emoji: "&#128481;",
      blurb: "Somebody did something. You intend to be there when it is answered for. Measured in enemies buried." },
    { id: "survive", name: "To die old", emoji: "&#127807;",
      blurb: "Warm, fed, and in a bed, with nobody in the room who wants you dead. Rarer than a crown. Measured in years." },
    { id: "knowledge", name: "To know", emoji: "&#128218;",
      blurb: "The world is full of things people insist are settled. You intend to check. Measured in secrets uncovered." },
  ],

  /* ------------------------------------------------------ NAME GENERATORS --- */
  names: {
    westeros: {
      first: ["Jonos", "Arryk", "Bennard", "Corwyn", "Dalla", "Elyn", "Garrek", "Hosteen",
        "Jeyne", "Lyra", "Marq", "Nella", "Osric", "Pella", "Quenten", "Robyn", "Sarra", "Torren",
        "Ulric", "Wyla", "Alys", "Beric", "Cregan", "Donnel", "Emma", "Fen", "Gwin", "Harwin",
        "Mya", "Rickard", "Talla", "Willem", "Edric", "Meera", "Symond", "Ysilla", "Denys", "Alyce"],
      last: ["Fisher", "Fielding", "Wode", "Stonehand", "Miller", "Longwater", "Thatch",
        "Harrow", "Reed", "Coldbrook", "Marsh", "Rivergate", "Hollow", "Bell", "Sawyer",
        "Cooper", "Blackmire", "Thorne", "Downs", "Ash"],
    },
    essos: {
      first: ["Tregar", "Sylvenna", "Qoren", "Nymeria", "Vogarro", "Talea", "Belicho", "Yandry",
        "Ezzelyno", "Marra", "Denyo", "Ternesio", "Lhara", "Moqorro", "Kojja", "Zhoe",
        "Illyrio", "Sarella", "Bharbo", "Meris"],
      last: ["Naharis", "Zalyne", "Terys", "Maegyr", "Vhassar", "Antaryon", "Uhoris", "Dhaez",
        "Prendahl", "Qhaedar", "Zhak", "Loraq", "Reznak", "Ghazdan"],
    },
    freefolk: {
      first: ["Tormund", "Val", "Osha", "Ygon", "Sigorn", "Munda", "Ryk", "Dalla", "Harma",
        "Errok", "Soren", "Morna", "Gerrick", "Devyn", "Halleck", "Nella"],
      last: ["", "", "", "", "Longspear", "Whitemask", "Hornfoot", "of the Frozen Shore",
        "Icemaker", "Weeper", "Greybeard"],
    },
  },
};
