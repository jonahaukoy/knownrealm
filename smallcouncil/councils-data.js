/* THE SMALL COUNCIL — the daily seating.
 *
 * WRITTEN FOR PEOPLE WHO WATCHED THE SHOW. Nothing here asks you to recall a
 * name from an appendix. Every tile is something a viewer has seen: a face, a
 * place, a sword, a sigil, a title someone was called, a death that happened on
 * screen. The difficulty is in the SORTING, never in the recall.
 *
 * That is the whole design rule. A puzzle is hard because four things you know
 * perfectly well could plausibly go in two different piles — Ice was Valyrian
 * steel before it was melted down, so it belongs with the named swords and not
 * with the things that kill the dead; Littlefinger poisoned Jon Arryn, but here
 * he is one of Arya's kills and Jon Arryn is one of the poisoned. It is never
 * hard because you have not read enough.
 *
 * The other half of the rule: NO WORD MAY HONESTLY FIT TWO GROUPS. Where one
 * could, it was cut rather than left to argue about. That is what separates a
 * hard puzzle from an unfair one.
 *
 * Shape:
 *   { id, name, saga: "got"|"hotd"|"knight", s?, b?, <- spoiler depth, as Trivia
 *     groups: [ { c: "t1".."t4", t: title, note: why, w: [four tiles] } ] }
 *
 * c: t1 is meant to be the kindest tier and t4 the cruelest, but the tiles are
 * shuffled, so colour is only ever revealed by solving.
 *
 * Show-only material carries no `b` tag on purpose: a reader who has not
 * watched cannot be expected to know it, so book progress must not unlock it.
 *
 * All prose original to this site.
 */
window.COUNCILS = [

  {
    id: "what-they-call-them",
    name: "What They Call Them",
    saga: "got", s: 4, b: 3,
    groups: [
      { c: "t1", t: "Names the realm gave them",
        note: "Not one of these is a name anybody was born with. Two are animals, one is a mountain, and one is the smallest coin there is.",
        w: ["The Hound", "The Mountain", "Littlefinger", "The Spider"] },
      { c: "t2", t: "Titles Daenerys claims",
        note: "She recites them at anyone who will stand still long enough, and one or two she earned twice over.",
        w: ["Mother of Dragons", "Breaker of Chains", "Khaleesi", "Stormborn"] },
      { c: "t3", t: "Actual offices of the realm",
        note: "Jobs, with duties and a seat at a table &mdash; not nicknames and not boasts.",
        w: ["Hand of the King", "Master of Coin", "Lord Commander", "Warden of the North"] },
      { c: "t4", t: "Armies for hire, and armies that were bought",
        note: "Fighting forces rather than titles. One was bought with a dragon, one rides, and two sell themselves.",
        w: ["Unsullied", "Dothraki", "Golden Company", "Second Sons"] },
    ],
  },

  {
    id: "the-iron-throne",
    name: "The Iron Throne",
    saga: "got", s: 6,
    groups: [
      { c: "t1", t: "They actually sat on it",
        note: "Whatever else is true of them, all four of these put themselves in that chair.",
        w: ["Robert", "Joffrey", "Tommen", "Cersei"] },
      { c: "t2", t: "They claimed it and never sat on it",
        note: "Four crowns that never reached King's Landing. One of them never even left the Iron Islands.",
        w: ["Stannis", "Renly", "Viserys", "Balon Greyjoy"] },
      { c: "t3", t: "Hands of the King or Queen",
        note: "The one who does the actual ruling, and the job that keeps killing whoever takes it.",
        w: ["Jon Arryn", "Ned Stark", "Tywin", "Qyburn"] },
      { c: "t4", t: "Sworn to the Kingsguard",
        note: "White cloaks. One of them was dead before he put it on.",
        w: ["Barristan Selmy", "Meryn Trant", "Jaime", "Gregor Clegane"] },
    ],
  },

  {
    id: "north-of-winterfell",
    name: "North of Winterfell",
    saga: "got", s: 5,
    groups: [
      { c: "t1", t: "Free folk",
        note: "They will tell you they kneel to no one, and they are mostly telling the truth.",
        w: ["Ygritte", "Tormund", "Mance Rayder", "Osha"] },
      { c: "t2", t: "Sworn brothers of the Night's Watch",
        note: "Men of the Wall. Note who is missing from this list &mdash; he would have fitted in more than one pile.",
        w: ["Samwell Tarly", "Alliser Thorne", "Jeor Mormont", "Maester Aemon"] },
      { c: "t3", t: "Places in the far north",
        note: "Two castles, a ruined village on a frozen shore, and the keep where the Boltons flay people.",
        w: ["Winterfell", "Castle Black", "Hardhome", "the Dreadfort"] },
      { c: "t4", t: "Things that live beyond the Wall",
        note: "Creatures, not people. Two of them are dead and walking.",
        w: ["White Walkers", "wights", "giants", "mammoths"] },
    ],
  },

  {
    id: "across-the-narrow-sea",
    name: "Across the Narrow Sea",
    saga: "got", s: 6, b: 5,
    groups: [
      { c: "t1", t: "Cities of Slaver's Bay",
        note: "The three cities Daenerys took, and the arena she reopened in the last of them.",
        w: ["Astapor", "Yunkai", "Meereen", "the Fighting Pits"] },
      { c: "t2", t: "Those who followed Daenerys",
        note: "A knight, a translator, a soldier and a sellsword &mdash; the people who actually kept her alive.",
        w: ["Jorah", "Missandei", "Grey Worm", "Daario"] },
      { c: "t3", t: "Free Cities and the Dothraki lands",
        note: "Essos outside the bay. Three cities that were never hers, and the one place the horselords call a city.",
        w: ["Braavos", "Pentos", "Volantis", "Vaes Dothrak"] },
      { c: "t4", t: "Things you find in Braavos",
        note: "A bank, a statue, the assassins who train in the temple, and the god they kill for. The city itself is not in this group.",
        w: ["the Iron Bank", "the Titan", "the Faceless Men", "the Many-Faced God"] },
    ],
  },

  {
    id: "kings-landing",
    name: "King's Landing",
    saga: "got", s: 6, b: 4,
    groups: [
      { c: "t1", t: "Lannisters",
        note: "One family, and most of the trouble in the city.",
        w: ["Tywin", "Cersei", "Jaime", "Tyrion"] },
      { c: "t2", t: "Places in the capital",
        note: "A castle, a sept, the poorest street in the city, and the ruin where the dragons were kept.",
        w: ["the Red Keep", "the Sept of Baelor", "Flea Bottom", "the Dragonpit"] },
      { c: "t3", t: "The Faith",
        note: "The religion of most of Westeros, its armed wing, and the two people who made Cersei walk.",
        w: ["the High Sparrow", "Septa Unella", "the Faith Militant", "the Seven"] },
      { c: "t4", t: "Maesters",
        note: "Grey robes and chains. One of them stopped wearing his and started doing much worse work.",
        w: ["Pycelle", "Qyburn", "Maester Luwin", "Maester Aemon"] },
    ],
  },

  {
    id: "steel-and-fire",
    name: "Steel and Fire",
    saga: "got", s: 5, b: 3,
    groups: [
      { c: "t1", t: "Swords with names",
        note: "Four particular blades. One of them was melted down to make two of the others' cousins.",
        w: ["Needle", "Longclaw", "Oathkeeper", "Ice"] },
      { c: "t2", t: "What kills the dead",
        note: "The short list. Three of the four named swords above are made of one of these &mdash; but the swords are not in this group.",
        w: ["dragonglass", "Valyrian steel", "fire", "dragonfire"] },
      { c: "t3", t: "Direwolves",
        note: "Six were found in the snow. These four had names you heard often enough to remember.",
        w: ["Ghost", "Grey Wind", "Lady", "Summer"] },
      { c: "t4", t: "Beasts on the banners",
        note: "Heraldry, not pets: what four great houses put on their arms.",
        w: ["lion", "stag", "kraken", "falcon"] },
    ],
  },

  {
    id: "the-butchers-bill",
    name: "The Butcher's Bill",
    saga: "got", s: 8,
    groups: [
      { c: "t1", t: "Died at the Red Wedding",
        note: "The Freys, the Boltons, and a night at Walder Frey's table that nobody who watched it has forgotten.",
        w: ["Robb", "Catelyn", "Talisa", "Grey Wind"] },
      { c: "t2", t: "Died in the Sept of Baelor",
        note: "Cersei's answer to her trial, delivered from under the building.",
        w: ["the High Sparrow", "Margaery", "Loras", "Mace Tyrell"] },
      { c: "t3", t: "Killed by Arya Stark",
        note: "Her list, and the one kill that was not on it.",
        w: ["Meryn Trant", "Walder Frey", "Littlefinger", "the Night King"] },
      { c: "t4", t: "Poisoned",
        note: "Four cups. One of them was poured by a woman who confessed to it years later, with great satisfaction.",
        w: ["Joffrey", "Jon Arryn", "Myrcella", "Olenna"] },
    ],
  },

  {
    id: "the-dance-of-the-dragons",
    name: "The Dance of the Dragons",
    saga: "hotd", s: 2, b: 1,
    groups: [
      { c: "t1", t: "Dragons",
        note: "The beasts themselves. Their riders are in the other groups.",
        w: ["Syrax", "Caraxes", "Vhagar", "Sunfyre"] },
      { c: "t2", t: "The blacks &mdash; Rhaenyra's side",
        note: "The queen who was named heir, her uncle-husband, and the lord and lady of Driftmark.",
        w: ["Rhaenyra", "Daemon", "Rhaenys", "Corlys"] },
      { c: "t3", t: "The greens &mdash; Aegon's side",
        note: "The queen who was married to the king, her father, her one-eyed son, and her sworn shield.",
        w: ["Alicent", "Otto", "Aemond", "Criston Cole"] },
      { c: "t4", t: "Castles",
        note: "Seats, not people &mdash; and one of them is cursed, everybody says so.",
        w: ["Dragonstone", "Driftmark", "Harrenhal", "Storm's End"] },
    ],
  },

  {
    id: "house-stark",
    name: "House Stark",
    saga: "got", s: 8,
    groups: [
      { c: "t1", t: "Ned and Catelyn's children",
        note: "The trueborn ones. The one who is not on this list is the reason for the group below.",
        w: ["Robb", "Sansa", "Arya", "Bran"] },
      { c: "t2", t: "Names Jon Snow has answered to",
        note: "What he was called at the Wall, what the northern lords shouted, the office he was elected to, and the name he was actually born with.",
        w: ["Lord Snow", "King in the North", "Lord Commander", "Aegon Targaryen"] },
      { c: "t3", t: "Northern houses",
        note: "Bannermen of Winterfell. One of them turned its cloak, and one sent a ten-year-old girl to shame the rest.",
        w: ["Bolton", "Karstark", "Umber", "Mormont"] },
      { c: "t4", t: "The household at Winterfell",
        note: "Not family and not lords &mdash; the people who raised the children and ran the castle.",
        w: ["Hodor", "Old Nan", "Maester Luwin", "Septa Mordane"] },
    ],
  },

  {
    id: "the-great-game",
    name: "The Great Game",
    saga: "got", s: 6,
    groups: [
      { c: "t1", t: "Great houses",
        note: "Family names. Their castles are in another group, so read carefully.",
        w: ["Stark", "Lannister", "Baratheon", "Tyrell"] },
      { c: "t2", t: "The seats of those houses",
        note: "The castles themselves &mdash; a keep in the snow, a rock, a storm-beaten fortress and a garden.",
        w: ["Winterfell", "Casterly Rock", "Storm's End", "Highgarden"] },
      { c: "t3", t: "Battles",
        note: "Four fights you watched happen. One is named for a river, one for a castle, one for a village, and one for two brothers who hated each other.",
        w: ["the Blackwater", "Castle Black", "Hardhome", "the Bastards"] },
      { c: "t4", t: "Sworn orders and brotherhoods",
        note: "Men bound by an oath rather than by blood &mdash; a bodyguard, a garrison, a religion under arms, and outlaws with a cause.",
        w: ["the Kingsguard", "the Night's Watch", "the Faith Militant", "the Brotherhood"] },
    ],
  },

  {
    id: "the-southern-houses",
    name: "The Southern Houses",
    saga: "got", s: 6, b: 5,
    groups: [
      { c: "t1", t: "House Tyrell",
        note: "The rose of Highgarden. The old thorn who rules in truth, the queen she made, the knight of flowers, and the lord who is nominally her son.",
        w: ["Olenna", "Margaery", "Loras", "Mace"] },
      { c: "t2", t: "Of Dorne",
        note: "Sunspear and the Water Gardens. A prince, his hot-blooded brother, his son, and the paramour who avenged them.",
        w: ["Doran", "Oberyn", "Trystane", "Ellaria"] },
      { c: "t3", t: "House Greyjoy",
        note: "The kraken of Pyke. Two brothers who each took the salt crown, the daughter who wanted it, and the son the Starks raised.",
        w: ["Balon", "Euron", "Yara", "Theon"] },
      { c: "t4", t: "House Baratheon",
        note: "The stag of Storm's End. The king who won the throne, the brother who claimed it, the brother who only feasted, and the daughter one of them burned. Three of these were called king &mdash; but the answer here is the blood, not the crown.",
        w: ["Robert", "Stannis", "Renly", "Shireen"] },
    ],
  },

  {
    id: "read-the-banner",
    name: "Read the Banner",
    saga: "got", s: 4, b: 4,
    groups: [
      { c: "t1", t: "Sigils &mdash; the beast or charge",
        note: "Four emblems torn off four different banners &mdash; the animals and charges only, not the castles they fly over nor the words stitched beneath.",
        w: ["direwolf", "three-headed dragon", "golden rose", "sun and spear"] },
      { c: "t2", t: "House words",
        note: "The mottos. Not one of these is a boast a person made &mdash; each belongs to a whole house.",
        w: ["Winter is Coming", "Fire and Blood", "Growing Strong", "Unbowed, Unbent, Unbroken"] },
      { c: "t3", t: "The seats &mdash; castles",
        note: "The ancestral keeps: one in the snow, one an island of old dragons, one a garden, one a spear in the sand.",
        w: ["Winterfell", "Dragonstone", "Highgarden", "Sunspear"] },
      { c: "t4", t: "The most famous face of each house",
        note: "People, this time. Every tile in this puzzle belongs to just four houses &mdash; Stark, Targaryen, Tyrell, Martell &mdash; and the whole trap was the urge to gather each house's four things into one pile. Sort by what a thing IS, not by whose it is.",
        w: ["Ned Stark", "Daenerys", "Olenna Tyrell", "Oberyn Martell"] },
    ],
  },

  {
    id: "four-courts",
    name: "Four Courts",
    saga: "got", s: 5, b: 5,
    groups: [
      { c: "t1", t: "Daenerys's inner circle",
        note: "Meereen and the long road east. The exiled knight, the queen's own voice, the Unsullied commander, and the spider who found her last.",
        w: ["Jorah", "Missandei", "Grey Worm", "Varys"] },
      { c: "t2", t: "Stannis's court at Dragonstone",
        note: "The smuggler he knighted and shortened, the red priestess, his queen, and his daughter.",
        w: ["Davos", "Melisandre", "Selyse", "Shireen"] },
      { c: "t3", t: "Robb Stark's own &mdash; kin and bannermen",
        note: "The Young Wolf's camp: his mother, his great-uncle the Blackfish, his queen, and the bannerman he should never have turned his back on.",
        w: ["Catelyn", "the Blackfish", "Talisa", "Roose Bolton"] },
      { c: "t4", t: "The lions of Casterly Rock",
        note: "The old lion, his daughter the queen, his son the Kingslayer, and the cousin who found the Faith. One of these sat in Robb's camp too &mdash; as his prisoner, not his man.",
        w: ["Tywin", "Cersei", "Jaime", "Lancel"] },
    ],
  },

  {
    id: "the-faith-and-the-gods",
    name: "The Faith and the Gods",
    saga: "got", s: 6, b: 5,
    groups: [
      { c: "t1", t: "Servants of the Lord of Light",
        note: "R'hllor's own. A priestess, a drunk priest, a knight brought back six times &mdash; and the king who burned for the red god. The night is dark and full of terrors.",
        w: ["Melisandre", "Thoros", "Beric", "Stannis"] },
      { c: "t2", t: "The Faith of the Seven",
        note: "The religion of most of Westeros. The barefoot zealot, the septa with the bell, Sansa's septa, and the man beneath the crystal crown.",
        w: ["the High Sparrow", "Septa Unella", "Septa Mordane", "the High Septon"] },
      { c: "t3", t: "The old gods of the North",
        note: "No septs, no statues &mdash; a face carved in a tree and the woods that keep it. Note who watches from among them.",
        w: ["the heart tree", "the godswood", "the Children of the Forest", "the Three-Eyed Raven"] },
      { c: "t4", t: "The Many-Faced God of Braavos",
        note: "Death has many faces, and these serve it. Two of the men here could pass for a priest of any god &mdash; that is rather the point.",
        w: ["Jaqen H'ghar", "the Waif", "the Kindly Man", "the Hall of Faces"] },
    ],
  },

  {
    id: "read-the-banner-2",
    name: "Read the Banner Again",
    saga: "got", s: 3, b: 3,
    groups: [
      { c: "t1", t: "Sigils &mdash; the charge on the shield",
        note: "Four more banners, the emblems only. A fish, a bird, a sea-beast, and the worst thing to see coming over a hill.",
        w: ["trout", "falcon and moon", "kraken", "flayed man"] },
      { c: "t2", t: "House words",
        note: "The mottos. Two of them contain the same word and still belong to different houses &mdash; read carefully.",
        w: ["Family, Duty, Honor", "As High as Honor", "We Do Not Sow", "Our Blades Are Sharp"] },
      { c: "t3", t: "The seats &mdash; castles",
        note: "A river castle, a mountain fastness, an island of iron, and the keep where they hang the flayed.",
        w: ["Riverrun", "the Eyrie", "Pyke", "the Dreadfort"] },
      { c: "t4", t: "The head of the house",
        note: "People. Tully, Arryn, Greyjoy, Bolton &mdash; and the trap, again, is to rake each house's four things into one pile. Sort them by what they ARE.",
        w: ["Catelyn Tully", "Jon Arryn", "Balon Greyjoy", "Roose Bolton"] },
    ],
  },

  {
    id: "where-they-ended-up",
    name: "Where They Ended Up",
    saga: "got", s: 8,
    groups: [
      { c: "t1", t: "Ruled something when the wheel stopped",
        note: "The broken boy on a new throne, the lady of the North, the queen of the isles, and the lord who only wanted to leave the privy council.",
        w: ["Bran", "Sansa", "Yara", "Robin Arryn"] },
      { c: "t2", t: "Went back beyond the Wall",
        note: "North of the Wall, where the last free man belongs. A king, a wildling, and a wolf who was owed a proper farewell.",
        w: ["Jon Snow", "Tormund", "Ghost", "the free folk"] },
      { c: "t3", t: "Sailed away from Westeros",
        note: "West of Westeros, and east of it, and south to an island with no more slaves. One of these carried a body in its claws.",
        w: ["Arya", "Grey Worm", "Drogon", "the Unsullied"] },
      { c: "t4", t: "Died in the last war",
        note: "Four ends inside a single year: a queen, a queen, the brother who loved one of them, and the thing the whole war had forgotten to fear.",
        w: ["Daenerys", "Cersei", "Jaime", "the Night King"] },
    ],
  },

  {
    id: "blood-will-tell",
    name: "Blood Will Tell",
    saga: "got", s: 8,
    groups: [
      { c: "t1", t: "Killed by their own blood",
        note: "A father by his son, another father by his son, a brother by a brother, and a brother by a brother's shadow.",
        w: ["Tywin", "Roose Bolton", "Balon", "Renly"] },
      { c: "t2", t: "Kinslayers &mdash; they did the killing",
        note: "The other half of the ledger. The men who spilled their own family's blood; the gods are said to have no mercy for them.",
        w: ["Tyrion", "Ramsay", "Euron", "Stannis"] },
      { c: "t3", t: "Wed into a house not their own",
        note: "Born to one banner, married under another. A lion who became a stag's queen, a rose who did the same, a wolf-girl wed twice over, and a foreign lady at a wolf's side.",
        w: ["Cersei", "Margaery", "Sansa", "Talisa"] },
      { c: "t4", t: "Sworn to father no children",
        note: "Vows, a chain, a knife in the dark, and the cruellest cut of all &mdash; four men who will leave no blood behind them, whatever else they leave.",
        w: ["Barristan Selmy", "Maester Aemon", "Varys", "Grey Worm"] },
    ],
  },

  {
    id: "the-watch-and-the-wildlings",
    name: "The Watch and the Wildlings",
    saga: "got", s: 5,
    groups: [
      { c: "t1", t: "Sworn brothers of the Night's Watch",
        note: "Black cloaks. One of them will end up on the wrong side of the Wall's politics, but here they are all sworn men.",
        w: ["Jon Snow", "Samwell", "Edd", "Grenn"] },
      { c: "t2", t: "Free folk",
        note: "They kneel to no king. A woman who taught a crow he knew nothing, a red-bearded giant of a man, the King-Beyond-the-Wall, and Craster's own daughter.",
        w: ["Ygritte", "Tormund", "Mance Rayder", "Gilly"] },
      { c: "t3", t: "Things that hunt beyond the Wall",
        note: "Not men. The cold gods, the corpses they raise, the big folk, and the blue-eyed thing that leads them all.",
        w: ["White Walkers", "wights", "giants", "the Night King"] },
      { c: "t4", t: "Castles along the Wall",
        note: "Nineteen were raised; most stand empty now. Here are four the black brothers still speak of.",
        w: ["Castle Black", "Eastwatch", "the Nightfort", "the Shadow Tower"] },
    ],
  },

  {
    id: "the-riverlands",
    name: "The Riverlands",
    saga: "got", s: 6, b: 5,
    groups: [
      { c: "t1", t: "House Tully of Riverrun",
        note: "Family, duty, honor. The mother of wolves, her brother the lord, her uncle the Blackfish, and the old lord sent down the river in flames.",
        w: ["Catelyn", "Edmure", "the Blackfish", "Hoster"] },
      { c: "t2", t: "House Frey of the Twins",
        note: "The house that keeps the crossing, and keeps no faith. The old lord and three of his all-but-countless brood.",
        w: ["Walder Frey", "Black Walder", "Lothar Frey", "Roslin"] },
      { c: "t3", t: "The Brotherhood Without Banners",
        note: "Outlaws with a cause and a red god. A lord who will not stay dead, his drunken priest, a bowman, and a big dog who joined late.",
        w: ["Beric", "Thoros", "Anguy", "the Hound"] },
      { c: "t4", t: "They held cursed Harrenhal",
        note: "The great burned ruin no house holds for long. A schemer named its lord, a flayer garrisoned it, a monster tortured in it, and a lion made it his seat.",
        w: ["Littlefinger", "Roose Bolton", "the Mountain", "Tywin"] },
    ],
  },

  {
    id: "beasts-banners-and-blades",
    name: "Beasts, Banners, and Blades",
    saga: "got", s: 6, b: 5,
    groups: [
      { c: "t1", t: "Direwolves",
        note: "Found in the snow, one for each Stark. Four of the six &mdash; the living animals, with names.",
        w: ["Ghost", "Grey Wind", "Nymeria", "Shaggydog"] },
      { c: "t2", t: "Dragons",
        note: "Real beasts of fire and blood. Three hatched in the east in living memory, and one long dead whose skull sits under the Red Keep.",
        w: ["Drogon", "Rhaegal", "Viserion", "Balerion"] },
      { c: "t3", t: "Swords with names",
        note: "Particular blades, not the beasts on the banners nor the animals in the yard.",
        w: ["Needle", "Longclaw", "Widow's Wail", "Heartsbane"] },
      { c: "t4", t: "Beasts on the banners",
        note: "Heraldry only. The temptation is to herd every creature here into one pen &mdash; but a sigil is not a wolf, and neither is a sword.",
        w: ["falcon", "kraken", "stag", "trout"] },
    ],
  },

  {
    id: "know-the-realm",
    name: "Know the Realm",
    saga: "got", s: 6, b: 5,
    groups: [
      { c: "t1", t: "Regions of the Seven Kingdoms",
        note: "Whole countries, each once a kingdom of its own.",
        w: ["the North", "the Reach", "Dorne", "the Iron Islands"] },
      { c: "t2", t: "The lord who rules each",
        note: "People &mdash; the head of the greatest house of each region.",
        w: ["Ned Stark", "Mace Tyrell", "Doran Martell", "Balon Greyjoy"] },
      { c: "t3", t: "The seat each rules from",
        note: "The castles: a winter keep, a garden, a spear in the sand, and a pile of wet black stone.",
        w: ["Winterfell", "Highgarden", "Sunspear", "Pyke"] },
      { c: "t4", t: "The words of each region's house",
        note: "Mottos. Everything in this puzzle sorts four ways by kingdom &mdash; which is exactly the wrong way. Sort by what each thing IS: a land, a lord, a castle, or a cry.",
        w: ["Winter is Coming", "Growing Strong", "Unbowed, Unbent, Unbroken", "We Do Not Sow"] },
    ],
  },

  /* ===== A Knight of the Seven Kingdoms — Dunk & Egg ===== *
   * Book-only material, so it carries a `b` tag and no `s`. The three tales run
   * b1 The Hedge Knight, b2 The Sworn Sword, b3 The Mystery Knight; a council
   * drawing on all three is tagged to the deepest of them. */
  {
    id: "the-hedge-knights-road",
    name: "The Hedge Knight's Road",
    saga: "knight", b: 3,
    groups: [
      { c: "t1", t: "Keeps he came to",
        note: "Four holdfasts along Ser Duncan's road, from the meadow where it all began to the wedding where it nearly ended. Sort the places from the people in them.",
        w: ["Ashford", "Standfast", "Coldmoat", "Whitewalls"] },
      { c: "t2", t: "Dragons at the Ashford tourney",
        note: "Trueborn princes of House Targaryen, all at the meadow the day a Trial of Seven was called. One was the Hand of the King, one broke him, and two more would matter a great deal later.",
        w: ["Baelor Breakspear", "Maekar", "Aerion", "Daeron"] },
      { c: "t3", t: "The quarrel over a dammed stream",
        note: "The drought-year feud between Standfast and Coldmoat. A stubborn old knight, the widow he circled, and the hard man who spoke for each of them.",
        w: ["Eustace Osgrey", "Rohanne Webber", "Bennis of the Brown Shield", "Lucas Inchfield"] },
      { c: "t4", t: "The plot at Whitewalls",
        note: "A wedding feast that hid a second Blackfyre rising. The host who lent his hall, the lord who schemed, the baseborn knight who would not sell a tilt &mdash; and the fiddler who was no fiddler at all.",
        w: ["Lord Butterwell", "Gormon Peake", "Glendon Ball", "the Fiddler"] },
    ],
  },

  {
    id: "shields-steeds-and-sayings",
    name: "Shields, Steeds and Sayings",
    saga: "knight", b: 3,
    groups: [
      { c: "t1", t: "Bynames the singers gave",
        note: "Sort by the name, not the man. A prince who was Hand of the King, a bellowing Baratheon, a tall cold castellan, and a knight who tilts by patience.",
        w: ["Breakspear", "the Laughing Storm", "the Longinch", "the Snail"] },
      { c: "t2", t: "Arms upon a shield",
        note: "Heraldry only &mdash; the charge, not the house that bears it. A checkered cat, a black beast, a red beast, and a hedge knight's own device.",
        w: ["the chequy lion", "the black dragon", "the red dragon", "a falling star"] },
      { c: "t3", t: "Things of the tales",
        note: "Not people and not places. A knight's warhorse, a tourney's impossible prize, a puppeteer's craft, and a prince's hidden seal.",
        w: ["Thunder", "a dragon's egg", "a puppet dragon", "a signet ring"] },
      { c: "t4", t: "The four sons of Prince Maekar",
        note: "The red dragon's own blood &mdash; sort the family from the shields, steeds and sayings all around them.",
        w: ["Daeron", "Aerion", "Aemon", "Egg"] },
    ],
  },

  {
    id: "read-the-hedge-knights-realm",
    name: "Read the Hedge Knight's Realm",
    saga: "knight", b: 3,
    groups: [
      { c: "t1", t: "Castles and holdfasts",
        note: "Places, not the people in them. A tourney meadow, a poor towerhouse, a moated seat, and a wedding hall of white marble.",
        w: ["Ashford", "Standfast", "Coldmoat", "Whitewalls"] },
      { c: "t2", t: "Targaryen kings of Dunk's own lifetime",
        note: "Four who wore the crown across his years &mdash; the Good, the bookish one Bloodraven ruled behind, the stern fourth son who never expected it, and the squire who grew into it.",
        w: ["Daeron II", "Aerys I", "Maekar I", "Aegon V"] },
      { c: "t3", t: "Words spoken in the tales",
        note: "Lines that leave a mouth, not a banner. A hedge knight's proud creed, a mad prince's boast, a plain shield's quiet joke, and the whisper of the realm's spymaster.",
        w: ["the truest kind of knight", "I am a dragon", "my helm is dusty", "a thousand eyes and one"] },
      { c: "t4", t: "The drought-year feud",
        note: "Everything on this board sorts by which tale it belongs to &mdash; which is the wrong way. Sort by what each thing IS: a castle, a king, a spoken line, or the four who quarreled over a stream.",
        w: ["Eustace Osgrey", "Rohanne Webber", "Bennis of the Brown Shield", "Lucas Inchfield"] },
    ],
  },

  {
    id: "the-black-dragons-shadow",
    name: "The Black Dragon's Shadow",
    saga: "knight", b: 3,
    groups: [
      { c: "t1", t: "Great Bastards of King Aegon the Unworthy",
        note: "The baseborn children a dying king owned all at once, and the ruin they bred. A sword given a black dragon, a bitter half-brother, a pale sorcerer of a thousand eyes, and their star-eyed sister.",
        w: ["Daemon Blackfyre", "Bittersteel", "Bloodraven", "Shiera Seastar"] },
      { c: "t2", t: "Battles, trials and burnings",
        note: "Not people and not castles &mdash; the days the tales turn on. A rebellion drowned in blood, a fight of seven against seven, a wood set alight, and a plague that emptied the throne.",
        w: ["the Redgrass Field", "the Trial of Seven", "the burning of Wat's Wood", "the Great Spring Sickness"] },
      { c: "t3", t: "The four sons of Prince Maekar",
        note: "Blood of the RED dragon, not the black. Maekar's brood, sorted from the traitors around them &mdash; and one of these boys will wear the crown the pretenders die for.",
        w: ["Daeron", "Aerion", "Aemon", "Egg"] },
      { c: "t4", t: "Keeps of the marches and the rivers",
        note: "Places again, to keep the sorting honest. A poor tower, a moated seat, a marble wedding hall, and the meadow where it all began.",
        w: ["Standfast", "Coldmoat", "Whitewalls", "Ashford"] },
    ],
  },

  /* ===== more Game of Thrones ===== */
  {
    id: "words-of-the-realm",
    name: "Words of the Realm",
    saga: "got", s: 3, b: 3,
    groups: [
      { c: "t1", t: "House words",
        note: "The mottos, stitched under four different banners. Not one of these is a boast a single person made.",
        w: ["Winter is Coming", "Hear Me Roar", "We Do Not Sow", "Ours is the Fury"] },
      { c: "t2", t: "Titles Daenerys recites",
        note: "She has a great many, and lists them at anyone who stands still long enough. Four of them here.",
        w: ["Mother of Dragons", "Breaker of Chains", "the Unburnt", "Stormborn"] },
      { c: "t3", t: "A by-name for one man",
        note: "Each of these points at a single person, not a house. A oathbreaking knight, a clever dwarf, a lowborn smuggler, and the smallest coin there is.",
        w: ["the Kingslayer", "the Imp", "the Onion Knight", "Littlefinger"] },
      { c: "t4", t: "Lines people actually say",
        note: "Words that leave a mouth, not a banner nor a title. A Braavosi greeting to death, a wildling's favourite jab, a red prayer, and a command to a dragon.",
        w: ["Valar Morghulis", "You know nothing", "the night is dark and full of terrors", "Dracarys"] },
    ],
  },

  {
    id: "sigils-seats-swords-songs",
    name: "Sigils, Seats, Swords and Songs",
    saga: "got", s: 4, b: 4,
    groups: [
      { c: "t1", t: "Sigil charges",
        note: "The emblem only &mdash; the beast or bloom on the shield, never the house that flies it.",
        w: ["the golden rose", "the flayed man", "the leaping trout", "the three-headed dragon"] },
      { c: "t2", t: "Ancestral seats",
        note: "The castles those same houses rule from &mdash; a garden, a torture-keep, a river fork, and an island of old dragons.",
        w: ["Highgarden", "the Dreadfort", "Riverrun", "Dragonstone"] },
      { c: "t3", t: "Named swords",
        note: "Particular blades of Valyrian steel. Two were cut from one melted greatsword; one guards the Wall.",
        w: ["Widow's Wail", "Heartsbane", "Oathkeeper", "Longclaw"] },
      { c: "t4", t: "Songs and sayings",
        note: "Words on the air. Two are songs the realm knows by heart, two are lines it repeats. Everything here BEGS to be sorted by house &mdash; sort by what a thing IS instead.",
        w: ["The Rains of Castamere", "The Bear and the Maiden Fair", "the North Remembers", "Valar Dohaeris"] },
    ],
  },

  /* ===== more House of the Dragon ===== */
  {
    id: "beasts-bynames-seats-slaughters",
    name: "Beasts, Bynames, Seats and Slaughters",
    saga: "hotd", s: 2, b: 1,
    groups: [
      { c: "t1", t: "Dragons of the Dance",
        note: "The beasts themselves, not their riders &mdash; the Red Queen, a dreaming she-dragon, the Bronze Fury, and the Blue Queen.",
        w: ["Meleys", "Dreamfyre", "Vermithor", "Tessarion"] },
      { c: "t2", t: "Bynames of the great",
        note: "Sort by the name the realm gave them, not the person. A restless prince, a nine-voyage sailor, a passed-over queen, and a princess the songs adored.",
        w: ["the Rogue Prince", "the Sea Snake", "the Queen Who Never Was", "the Realm's Delight"] },
      { c: "t3", t: "Seats of the realm",
        note: "Castles, not the people inside them &mdash; a smoking island, a sea-lord's hall, a cursed ruin, and the city itself.",
        w: ["Dragonstone", "Driftmark", "Harrenhal", "King's Landing"] },
      { c: "t4", t: "Bloody days and nights",
        note: "Not places and not people &mdash; the killings the Dance is remembered for.",
        w: ["the Gullet", "Shipbreaker Bay", "Blood and Cheese", "the Red Sowing"] },
    ],
  },

  {
    id: "fire-made-flesh",
    name: "Fire Made Flesh",
    saga: "hotd", s: 2, b: 1,
    groups: [
      { c: "t1", t: "Dragons",
        note: "Four more of the beasts &mdash; a young pair lost early to the war, a dragon that chose its own rider, and the Golden.",
        w: ["Arrax", "Vermax", "Seasmoke", "Sunfyre"] },
      { c: "t2", t: "The dragonseeds of the Sowing",
        note: "Smallfolk and bastards who dared the flames on Dragonstone. Three of them rose; one only burned trying.",
        w: ["Hugh Hammer", "Ulf the White", "Addam of Hull", "Steffon Darklyn"] },
      { c: "t3", t: "Battles of the Dance",
        note: "Where the war was actually fought &mdash; a castle's trap, a river town twice burned, a stormed pit, and the council that lit the whole fuse.",
        w: ["Rook's Rest", "Tumbleton", "the Storming of the Dragonpit", "the Great Council"] },
      { c: "t4", t: "Seats and holdfasts",
        note: "Castles, sorted clear of the beasts, the seeds and the battles. A bronze Vale keep, a storm seat, the maesters' city, and a cursed river ruin.",
        w: ["Runestone", "Storm's End", "Oldtown", "Harrenhal"] },
    ],
  },

];
