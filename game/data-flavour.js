/* ============================================================================
   THE IRON LADDER — WHOSE GROUND THIS IS.

   The complaint this file answers: a scene set in "a town" is a scene set
   nowhere. An event that says "a man stops you in the street" is the same event
   in Braavos and in Barrowton, and after the third time a player stops reading
   it. An event that says "a man stops you on the Fishfoot Yard and wants to
   know whether you are one of {holder}'s" is a different event in every town in
   the world, written once.

   TWO LAYERS, AND THE SECOND ONE IS OPTIONAL.

     realms:  what is true of everywhere in a kingdom — the names its people
              are given, the lesser houses that hold its ground, the kind of
              corner a town there has, what is put in front of you to eat.
              Every place inherits its realm's lists, so a place needs no entry
              here at all to be named properly.

     places:  overrides for somewhere with a name of its own. The Street of
              Flour is in King's Landing and nowhere else, and the Moon Door is
              in exactly one castle. Where a `holder` is given it is the real
              house that holds the seat, which is why {holder} is worth using.

   The engine merges them (flavourFor in engine.js) and then resolves ONE cast
   per scene (castFor), so the opening line and the outcome name the same man.
   The lord of a place is drawn with a STABLE pick seeded off the place id — he
   is the same lord when you come back through the gate a year later, which
   Math.random() would not have managed.

   TOKENS THE DECK MAY USE, all filled from here:
     {holder}      the house or power that holds this ground
     {lord}        the man who sits in it, styled and named
     {localhouse}  a lesser house of this country, "House Vance"
     {folk} {folk2} two ordinary people of this country, by name
     {spot}        a named corner of this place
     {dish}        what is put in front of you
     {drink}       what it is washed down with
     {trade}       what people here do for bread
     {nearby}      the nearest settlement, if you are out in the country

   Nothing invented is presented as canon: the house names are the real lesser
   houses of each kingdom, the named corners are the ones the books name, and
   where a place has no documented street the realm's generic list supplies an
   honest one ("the market square") rather than a made-up proper noun.
   ========================================================================== */

window.IL_FLAVOUR = {

  /* ======================================================== BY KINGDOM ==== */
  realms: {

    north: {
      title: "Lord",
      folk: ["Wyl", "Hal", "Donnel", "Beth", "Alys", "Osric", "Rickard", "Torrhen", "Wylla",
        "Barth", "Gage", "Mikken", "Farlen", "Harwin", "Nan", "Bran", "Bryen", "Elsa", "Todder"],
      houses: ["Cerwyn", "Tallhart", "Glover", "Flint", "Ryswell", "Dustin", "Locke", "Slate",
        "Condon", "Woolfield", "Overton", "Stout", "Whitehill", "Reed", "Mollen"],
      spots: ["the market square", "the winter town lanes", "the smokehouse row", "the north gate",
        "the horse pool", "the godswood", "the timber yard", "the alehouse by the wall"],
      dishes: ["black bread and hard cheese", "mutton stew", "oatcakes and honey", "salt beef",
        "a bowl of neeps and barley", "blood sausage", "roast turnips and bacon"],
      drinks: ["brown ale", "hot spiced wine", "mead", "goat's milk gone slightly wrong"],
      trades: ["timber and furs", "the herds", "salt fish", "wool", "iron out of the hills"],
    },

    "beyond-the-wall": {
      title: "",
      holder: "nobody at all — there are no lords north of the Wall",
      folk: ["Tormund", "Val", "Ygon", "Munda", "Ryk", "Harma", "Errok", "Soren", "Morna",
        "Devyn", "Halleck", "Sigorn", "Dalla", "Gerrick"],
      houses: ["the Thenns", "the Hornfoot men", "the ice-river clans", "the Frozen Shore folk",
        "the Nightrunners", "the cave-dwellers of the Milkwater"],
      spots: ["the fire pit", "the hide tents", "the frozen stream", "the treeline",
        "the ridge above the camp", "the weirwood stand"],
      dishes: ["boiled elk", "smoked fish", "hard black bread", "pine-nut mash", "roast hare"],
      drinks: ["snow melted in a pot", "sour milk", "something distilled out of berries"],
      trades: ["hunting", "raiding southward", "following the herds", "mammoth ivory"],
    },

    riverlands: {
      title: "Lord",
      folk: ["Wat", "Pate", "Gyles", "Tansy", "Sharna", "Lem", "Bryen", "Rilla", "Merret",
        "Osgood", "Jeyne", "Willem", "Marq", "Kyra", "Hoster", "Elder Wat", "Dobber"],
      houses: ["Vance", "Piper", "Darry", "Mooton", "Whent", "Ryger", "Goodbrook", "Roote",
        "Wayn", "Lychester", "Charlton", "Erenford", "Haigh", "Smallwood", "Vypren", "Butterwell"],
      spots: ["the ford", "the mill race", "the market cross", "the river gate", "the ferry steps",
        "the tanners' row", "the inn yard", "the burnt sept"],
      dishes: ["river pike", "trout in butter", "onion soup and brown bread", "bacon and beans",
        "a pigeon pie", "eels"],
      drinks: ["ale", "cider", "watered wine"],
      trades: ["the barley", "the ferry", "the fish weirs", "the mills"],
    },

    vale: {
      title: "Lord",
      folk: ["Mya", "Osric", "Terrance", "Marillion", "Colemon", "Gretchel", "Mord", "Alayne",
        "Wallace", "Ossy", "Kyle", "Wyllas", "Donnel", "Mychel"],
      houses: ["Waynwood", "Belmore", "Hunter", "Templeton", "Grafton", "Melcolm", "Coldwater",
        "Egen", "Lynderly", "Tollett", "Sunderland", "Upcliff", "Shett", "Hersy"],
      spots: ["the high road", "the goat track", "the bridge over the Gullet", "the mule yard",
        "the sept on the crag", "the snowline", "the winch house"],
      dishes: ["goat and barley", "mountain trout", "hard white cheese", "apple cake", "black bread"],
      drinks: ["cider", "Arbor red, brought up at ruinous expense", "goat's milk"],
      trades: ["the goats", "the high road tolls", "silver out of the mountains", "orchards"],
    },

    "iron-islands": {
      title: "Lord",
      folk: ["Dagmer", "Gevin", "Wex", "Esgred", "Lorren", "Ulf", "Sigrin", "Gelmarr", "Tris",
        "Nute", "Hagen", "Ralf", "Qarl", "Rolfe"],
      houses: ["Botley", "Wynch", "Sparr", "Merlyn", "Farwynd", "Volmark", "Drumm", "Codd",
        "Kenning", "Orkwood", "Saltcliffe", "Stonetree", "Tawney", "Sunderly"],
      spots: ["the quay", "the boat sheds", "the drowned man's cave", "the sea stack",
        "the shingle", "the salt house", "the longship slips"],
      dishes: ["salt cod", "boiled crab", "mussels and seaweed bread", "smoked herring"],
      drinks: ["sour ale", "seawater and worse", "wine taken off somebody"],
      trades: ["the boats", "the salt", "what is taken rather than sown"],
    },

    westerlands: {
      title: "Lord",
      folk: ["Podrick", "Amabel", "Weese", "Gerion", "Melara", "Addam", "Lyle", "Rennifer",
        "Cleos", "Jeyne", "Willow", "Tybolt", "Sybell", "Harys"],
      houses: ["Payne", "Clegane", "Swyft", "Prester", "Banefort", "Brax", "Serrett", "Westerling",
        "Farman", "Sarsfield", "Broom", "Estren", "Lydden", "Moreland", "Plumm", "Vikary"],
      spots: ["the gold road", "the pithead", "the smelters' row", "the counting house steps",
        "the market under the Rock", "the guild hall", "the west gate"],
      dishes: ["roast pork", "spiced sausage", "applecakes", "capon and leeks", "white bread"],
      drinks: ["Arbor gold", "strong ale", "hippocras"],
      trades: ["the mines", "the smelters", "the ships out of Lannisport", "moneylending"],
    },

    crownlands: {
      title: "Lord",
      folk: ["Gendry", "Tobho", "Chataya", "Hot Pie", "Wat", "Lommy", "Yoren", "Alayaya",
        "Kettleblack", "Bronn", "Symon", "Gyles", "Mya", "Tanda", "Rugen"],
      houses: ["Rosby", "Stokeworth", "Hayford", "Rykker", "Massey", "Bar Emmon", "Celtigar",
        "Buckwell", "Byrch", "Chelsted", "Follard", "Gaunt", "Hogg", "Hollard", "Staunton",
        "Thorne", "Brune", "Wendwater", "Crabb", "Rambton"],
      spots: ["the Street of Flour", "the Hook", "Cobbler's Square", "the Muddy Way",
        "Pisswater Bend", "the Iron Gate", "the Gate of the Gods", "the fishmonger's square",
        "the Street of Silk", "the Dragon Gate", "the alley behind the pot-shops"],
      dishes: ["a bowl of brown", "pigeon pie", "eel pie", "lamprey and leeks", "grey sausage",
        "boiled beans and bacon", "a hot pie of uncertain parentage"],
      drinks: ["sour wine", "small beer", "watered ale", "Arbor red, if you are paying"],
      trades: ["the docks", "the markets", "somebody else's business", "the barges up the Blackwater"],
    },

    reach: {
      title: "Lord",
      folk: ["Alekyne", "Emmon", "Talla", "Melessa", "Dickon", "Garth", "Leyton", "Willas",
        "Elinor", "Mern", "Colin", "Rhea", "Osney", "Pate", "Hobb"],
      houses: ["Fossoway", "Ambrose", "Beesbury", "Bulwer", "Caswell", "Costayne", "Cuy",
        "Footly", "Graceford", "Grimm", "Hewett", "Inchfield", "Leygood", "Meadows",
        "Merryweather", "Mullendore", "Norcross", "Oakheart", "Peake", "Rowan", "Roxton",
        "Serry", "Varner", "Vyrwel", "Webber"],
      spots: ["the tourney field", "the orchard road", "the mummers' pitch", "the wool market",
        "the sept steps", "the cloth hall", "the river stairs", "the guildhall yard"],
      dishes: ["honeyed duck", "capon with cheese and grapes", "apple tart", "cream and berries",
        "roast goose", "a wheel of soft white cheese"],
      drinks: ["Arbor red", "Arbor gold", "cider", "mead", "hippocras"],
      trades: ["the harvest", "the wool", "the vineyards", "the tourneys", "the barges on the Mander"],
    },

    stormlands: {
      title: "Lord",
      folk: ["Davos", "Cortnay", "Gulian", "Lester", "Bryen", "Maric", "Elwood", "Rolland",
        "Guyard", "Jeyne", "Emmon", "Wylla", "Andrew", "Omer"],
      houses: ["Buckler", "Cafferen", "Caron", "Errol", "Estermont", "Fell", "Gower", "Grandison",
        "Hasty", "Herston", "Horpe", "Kellington", "Lonmouth", "Mertyns", "Morrigen", "Musgood",
        "Penrose", "Peasebury", "Rogers", "Selmy", "Staedmon", "Swann", "Trant", "Wensington", "Wylde"],
      spots: ["the sea wall", "the cliff path", "the rain-wet market", "the boat strand",
        "the drover's road", "the smokehouse", "the old sept in the wind"],
      dishes: ["venison", "oysters", "black bread and bacon", "salt beef and cabbage", "crab"],
      drinks: ["strongwine", "black ale", "cider"],
      trades: ["the herds", "the boats", "the timber out of the rainwood"],
    },

    dorne: {
      title: "Lord",
      folk: ["Areo", "Myria", "Caleotte", "Ricasso", "Manfrey", "Elia", "Dagos", "Sylva",
        "Ulwyck", "Nymella", "Timoth", "Alyse", "Deziel", "Perros"],
      houses: ["Allyrion", "Blackmont", "Dalt", "Drinkwater", "Fowler", "Gargalen", "Jordayne",
        "Ladybright", "Manwoody", "Qorgyle", "Santagar", "Toland", "Wells", "Wyl", "Vaith"],
      spots: ["the bazaar", "the shaded colonnade", "the water gardens' road", "the well court",
        "the sand road", "the date palms", "the rope-makers' lane"],
      dishes: ["snake stewed with dragon peppers", "blood oranges", "spiced flatbread and olives",
        "goat with lemons", "dates and hard white cheese"],
      drinks: ["strongwine", "sour goat's milk", "iced lemon water, if somebody is rich"],
      trades: ["the water", "the date groves", "the caravans", "the horses"],
    },

    "free-cities": {
      title: "Magister",
      holder: "the magisters of the city",
      folk: ["Illyrio", "Tregar", "Sylvenna", "Qoren", "Vogarro", "Talea", "Belicho", "Yandry",
        "Ezzelyno", "Denyo", "Ternesio", "Lhara", "Kojja", "Zhoe", "Marra", "Bharbo"],
      houses: ["Antaryon", "Maegyr", "Vhassar", "Uhoris", "Prendahl", "Qhaedar", "Zalyne",
        "Terys", "Dhaez", "Naharis"],
      spots: ["the canal steps", "the customs house", "the sellsword pitch", "the temple square",
        "the long bridge", "the fish market", "the counting house arcade", "the dye vats"],
      dishes: ["eel and onions", "fish stew with saffron", "flatbread and oil", "stuffed vine leaves",
        "roast lamb with figs"],
      drinks: ["pear brandy", "black Volantene wine", "watered wine with honey"],
      trades: ["the ships", "the banks", "the dye works", "the glassblowers", "sellswords"],
    },

    "dothraki-sea": {
      title: "",
      holder: "whichever khal is riding this grass",
      folk: ["Rakharo", "Jhiqui", "Aggo", "Irri", "Kovarro", "Malako", "Qotho", "Jommo",
        "Zollo", "Ogo", "Fogo", "Haggo"],
      houses: ["the khalasar of Khal Pono", "the khalasar of Khal Jhaqo", "the horselords",
        "the crones of the dosh khaleen"],
      spots: ["the horse lines", "the fire circle", "the Western Market", "the Eastern Market",
        "the horse gate", "the mother of mountains", "the open grass"],
      dishes: ["horse meat, hot off the fire", "hard cheese", "sausage of uncertain animal",
        "roasted grass-hen"],
      drinks: ["fermented mare's milk", "sour wine traded off a caravan"],
      trades: ["the horses", "the herds", "what a khalasar takes"],
    },

    "slavers-bay": {
      title: "",
      holder: "the Good Masters",
      folk: ["Kraznys", "Missandei", "Grazdan", "Mero", "Hizdahr", "Reznak", "Skahaz",
        "Rylona", "Ghael", "Yezzan", "Belaquo", "Khrazz"],
      houses: ["the Great Masters", "the Wise Masters", "the Good Masters", "the tokar-wearers",
        "the slavers' guild"],
      spots: ["the plaza of punishment", "the pyramid steps", "the fighting pit gates",
        "the slave market", "the brick kilns", "the harbour steps", "the Temple of the Graces"],
      dishes: ["honeyed locusts", "dog sausage", "olives and hard bread", "grilled fish with cumin"],
      drinks: ["sweet wine", "watered wine", "fig beer"],
      trades: ["the trade in people", "the brick kilns", "the pits", "the harbour"],
    },

    "summer-isles": {
      title: "Prince",
      holder: "the princes of the isles",
      folk: ["Xhondo", "Quhuru", "Jalabhar", "Kojja", "Tal", "Zabo", "Mira", "Chataya"],
      houses: ["the princely houses of Walano", "the swan-ship captains", "the archers' companies"],
      spots: ["the harbour steps", "the goldenheart grove", "the temple of the sun",
        "the spice quay", "the beach market"],
      dishes: ["fish grilled with fruit", "spiced rice", "roast plantain", "sweet melon"],
      drinks: ["sweet island wine", "coconut milk", "spiced water"],
      trades: ["the spice", "the goldenheart bows", "the swan ships", "the feathers"],
    },

    "the-east": {
      title: "",
      holder: "the Pureborn",
      folk: ["Xaro", "Pyat", "Quaithe", "Mirri", "Jhogo", "Yezzan", "Shiera", "Zhoa"],
      houses: ["the Thirteen", "the Tourmaline Brotherhood", "the Ancient Guild of Spicers",
        "the warlocks of the House of the Undying"],
      spots: ["the Gate of the Three Walls", "the spice bazaar", "the harbour of Qarth",
        "the shaded colonnade", "the caravanserai", "the road of bones"],
      dishes: ["spiced meats", "dates and honey", "saffron rice", "sea-snake in ginger"],
      drinks: ["shade of the evening, if you are that sort", "spiced wine", "iced sherbet"],
      trades: ["the caravans", "the spice", "the silk road east"],
    },
  },

  /* ======================================================= BY PLACE ======= */
  /* Only where the place has names of its own. Everything absent inherits its
     kingdom's lists above, which is why a hundred and forty places need sixty
     entries here. `holder` is the real house that holds the seat. */
  places: {

    /* ------------------------------------------------------- the north --- */
    "winterfell": { holder: "House Stark", title: "Lord",
      spots: ["the godswood", "the First Keep", "the crypts", "the glass gardens",
        "the broken tower", "the hunter's gate", "the hot pools", "the armoury yard"],
      note: "Hot springs run in the walls; the yard smells of iron and snow at once." },
    "wintertown": { holder: "House Stark",
      spots: ["the winter market", "the smokehouse row", "the alehouse under the wall",
        "the empty half of the town"] },
    "white-harbor": { holder: "House Manderly", title: "Lord",
      spots: ["the Wolf's Den", "the Seal Rock", "the Castle Stair", "the Fishfoot Yard",
        "the New Castle steps", "the Sept of the Snows", "the outer harbour"],
      dishes: ["lamprey pie", "crab and onions", "smoked cod"] },
    "barrowton": { holder: "House Dustin", title: "Lady",
      spots: ["the Great Barrow", "the barrow market", "the drovers' road", "the widow's hall"] },
    "deepwood-motte": { holder: "House Glover", spots: ["the timber wall", "the boat landing", "the wolfswood eaves"] },
    "karhold": { holder: "House Karstark", spots: ["the square keep", "the frozen yard", "the long hall"] },
    "last-hearth": { holder: "House Umber", spots: ["the hearth that is never let out", "the mead hall", "the ice road"] },
    "dreadfort": { holder: "House Bolton", spots: ["the flaying room nobody names", "the red walls", "the kennels", "the dungeon stair"] },
    "bear-island": { holder: "House Mormont", title: "Lady", spots: ["the timber hall", "the shingle beach", "the carved door"] },
    "hornwood": { holder: "House Hornwood", spots: ["the antler gate", "the timber yard"] },
    "torrhens-square": { holder: "House Tallhart", spots: ["the square wall", "the mill"] },
    "widows-watch": { holder: "House Locke", spots: ["the cliff path", "the watchtower"] },
    "castle-black": { holder: "the Night's Watch", title: "Lord Commander",
      folk: ["Donal", "Bowen", "Othell", "Hobb", "Pyp", "Grenn", "Edd", "Clydas", "Yarwyck"],
      spots: ["the lift cage", "the armoury", "the common hall", "the top of the Wall",
        "the wormways", "the practice yard", "the Lord Commander's Tower"],
      dishes: ["three-day-old mutton stew", "onion soup", "hard black bread"] },
    "eastwatch": { holder: "the Night's Watch", title: "Lord Commander",
      spots: ["the wharf", "the seal pens", "the wet stair", "the strand"] },
    "shadow-tower": { holder: "the Night's Watch", title: "Lord Commander",
      spots: ["the gorge bridge", "the western stair", "the mountain gate"] },
    "moles-town": { holder: "the Night's Watch", title: "Lord Commander",
      spots: ["the underground rooms", "the one street above ground", "the brewhouse"] },

    /* --------------------------------------------- beyond the wall ------ */
    "crasters-keep": { holder: "Craster, who is not a lord and would kill you for saying so",
      spots: ["the mud wall", "the longhouse fire", "the pig pen", "the treeline where the boys go"] },
    "hardhome": { spots: ["the burnt town", "the caves above the bay", "the shingle", "the stumps of the pier"] },
    "whitetree": { spots: ["the great weirwood", "the huts", "the ashes in the mouth of the tree"] },
    "thenn": { spots: ["the bronze works", "the terraced fields", "the vale road"] },

    /* -------------------------------------------------- the riverlands -- */
    "riverrun": { holder: "House Tully", title: "Lord",
      spots: ["the water gate", "the sluice", "the godswood by the Tumblestone", "the great hall"] },
    "harrenhal": { holder: "whoever the crown has given it to this year",
      spots: ["the Tower of Ghosts", "the Wailing Tower", "the Widow's Tower", "the melted stone",
        "the bathhouse", "the enormous empty hall"],
      note: "Everything here is built for men half again your size, and the top of it is melted." },
    "the-twins": { holder: "House Frey", title: "Lord",
      spots: ["the bridge", "the water tower", "the east castle gate", "the west castle yard"] },
    "maidenpool": { holder: "House Mooton", title: "Lord",
      spots: ["the pool itself", "the harbour", "the wall the war left", "the fish quay"] },
    "saltpans": { holder: "House Cox", spots: ["the salt pans", "the small keep", "the burnt quarter"] },
    "stoney-sept": { holder: "House Hunter of the Stoney Sept",
      spots: ["the alley where they hunted him", "the seven septs", "the market cross", "the bell tower"] },
    "crossroads-inn": { holder: "whoever is keeping the inn this year", title: "Goodwife",
      spots: ["the common room", "the stable yard", "the gallows tree", "the crossroads itself"] },
    "seagard": { holder: "House Mallister", title: "Lord",
      spots: ["the Booming Tower", "the harbour", "the sea gate"] },
    "darry": { holder: "House Darry", spots: ["the burnt village", "the ploughman's road"] },
    "raventree-hall": { holder: "House Blackwood", title: "Lord",
      spots: ["the dead weirwood", "the ravens at dusk", "the keep yard"] },
    "stone-hedge": { holder: "House Bracken", title: "Lord",
      spots: ["the horse paddocks", "the stone hedge itself", "the barley fields"] },
    "fairmarket": { spots: ["the wooden bridge", "the fair ground", "the river stair"] },
    "gods-eye": { holder: "the green men, whom nobody has met",
      spots: ["the carved faces", "the shore of the lake", "the still water"] },

    /* -------------------------------------------------------- the vale -- */
    "eyrie": { holder: "House Arryn", title: "Lord",
      spots: ["the Moon Door", "the sky cells", "the High Hall", "the winch", "the garden of blue flowers"],
      note: "Everything up here is white and cold and a very long way above everything else." },
    "gates-of-the-moon": { holder: "House Arryn", spots: ["the mule yard", "the lower gate", "the stone stair"] },
    "gulltown": { holder: "House Grafton", title: "Lord",
      spots: ["the harbour", "the old gate", "the fish market", "the Sept of the Gull"] },
    "runestone": { holder: "House Royce", title: "Lord",
      spots: ["the runed walls", "the bronze doors", "the cliff path"] },
    "redfort": { holder: "House Redfort", spots: ["the red walls", "the hill road"] },
    "heart-home": { holder: "House Corbray", spots: ["the hall", "the orchard"] },
    "bloody-gate": { holder: "the Knight of the Gate", title: "Ser",
      spots: ["the defile", "the two towers", "the road up"] },
    "sisterton": { holder: "House Borrell", title: "Lord",
      spots: ["the crooked wharf", "the eel market", "the Night Lamp", "the smugglers' stair"] },
    "longbow-hall": { holder: "House Hunter", spots: ["the butts", "the hall"] },
    "mountains-of-the-moon": { holder: "the mountain clans, who hold it by robbing it",
      spots: ["the high road", "the goat path", "the burnt caravan"] },

    /* ------------------------------------------------ the iron islands -- */
    "pyke": { holder: "House Greyjoy", title: "Lord",
      spots: ["the rope bridges", "the Sea Tower", "the Bloody Keep", "the stacks"] },
    "lordsport": { holder: "House Botley", title: "Lord",
      spots: ["the quay", "the boat sheds", "the sept the ironborn burned twice"] },
    "ten-towers": { holder: "House Harlaw", title: "Lord",
      spots: ["the Book Tower", "the ten mismatched towers", "the library"] },
    "old-wyk": { holder: "the drowned men",
      spots: ["Nagga's ribs", "the Grey King's hall", "the kingsmoot ground"] },
    "hammerhorn": { holder: "House Goodbrother", spots: ["the hill workings", "the iron door"] },
    "blacktyde": { holder: "House Blacktyde", spots: ["the small harbour", "the black cliffs"] },

    /* ------------------------------------------------- the westerlands -- */
    "casterly-rock": { holder: "House Lannister", title: "Lord",
      spots: ["the Lion's Mouth", "the golden gallery", "the deep mines", "the Stone Garden",
        "the hall of heroes"],
      note: "Three miles of hollowed mountain, and gold still coming out of the bottom of it." },
    "lannisport": { holder: "House Lannister", title: "Lord",
      spots: ["the harbour", "the guild halls", "the market under the Rock", "the shipwrights' yards"] },
    "golden-tooth": { holder: "House Lefford", title: "Lord", spots: ["the pass", "the mine head"] },
    "crakehall": { holder: "House Crakehall", spots: ["the boar pens", "the three towers"] },
    "ashemark": { holder: "House Marbrand", spots: ["the grey walls", "the hill road"] },
    "silverhill": { holder: "House Serrett", spots: ["the exhausted mine", "the good fields"] },
    "deep-den": { holder: "House Lydden", spots: ["the gold road", "the hillside gate"] },
    "castamere": { holder: "nobody, and there is a song about why",
      spots: ["the flooded workings", "the drowned hall", "the sunken pit"] },
    "kayce": { holder: "House Kenning of Kayce", spots: ["the harbour", "the fish quay"] },

    /* -------------------------------------------------- the crownlands -- */
    "red-keep": { holder: "the crown", title: "King",
      folk: ["Pycelle", "Varys", "Meryn", "Boros", "Preston", "Trant", "Rugen", "Chataya"],
      spots: ["the throne room", "the black cells", "Maegor's Holdfast", "the Tower of the Hand",
        "the outer yard", "the serpentine steps", "the godswood"],
      note: "Seven drum-towers, and the cells under them go down further than the towers go up." },
    "flea-bottom": { holder: "the crown, in theory",
      spots: ["the pot-shops", "Pisswater Bend", "Cobbler's Square", "the Street of Flour",
        "the alley they call the Chute", "the dye-house yard", "the Muddy Way"],
      dishes: ["a bowl of brown", "a hot pie of uncertain parentage", "grey sausage"],
      note: "More people than anyone has counted, and every one of them going somewhere." },
    "street-of-steel": { holder: "the armourers' guild",
      folk: ["Tobho", "Gendry", "Hallyne", "Salloreon"],
      spots: ["the top of the hill, where the good work is", "the bottom, where the cheap work is",
        "the forge yards", "the Great Sept above"] },
    "kings-landing-docks": { holder: "the master of ships",
      spots: ["the Mud Gate", "the fishmonger's square", "the barge wharves", "the customs shed"] },
    "great-sept": { holder: "the Faith", title: "High Septon",
      spots: ["the marble steps", "the hall of lamps", "the seven altars", "Baelor's statue"] },
    "dragonstone": { holder: "House Targaryen, and after them whoever the crown gives it to", title: "Lord",
      spots: ["the Stone Drum", "the Chamber of the Painted Table", "the Windwyrm", "the Dragonmont",
        "the smoking shore", "the gargoyle walls"] },
    "duskendale": { holder: "House Rykker", title: "Lord",
      spots: ["the Dun Fort", "the old harbour", "the market square where the crown once burned men"] },
    "rosby": { holder: "House Rosby", spots: ["the small keep", "the coast road"] },
    "stokeworth": { holder: "House Stokeworth", title: "Lady", spots: ["the fat fields", "the hall"] },
    "kingswood": { holder: "the crown, and periodically somebody else",
      spots: ["the deer runs", "the charcoal burners' clearing", "the old road", "the outlaw camp"] },
    "rooks-rest": { holder: "House Staunton", spots: ["the field they call the Burning", "the sea walls"] },
    "driftmark": { holder: "House Velaryon", title: "Lord",
      spots: ["High Tide", "the ruins of Spicetown", "the shipyards", "the Hull harbour"] },

    /* ------------------------------------------------------- the reach -- */
    "highgarden": { holder: "House Tyrell", title: "Lord",
      spots: ["the briar labyrinth", "the terraced gardens", "the three white walls",
        "the court of fountains", "the Mander stair"] },
    "oldtown": { holder: "House Hightower", title: "Lord",
      folk: ["Leyton", "Pate", "Alleras", "Marwyn", "Ebrose", "Rosey", "Armen"],
      spots: ["the Hightower itself", "the Starry Sept", "the Quill and Tankard",
        "the Honeywine", "the Scribe's Hearth", "the ravenry", "the maze of old streets"] },
    "citadel": { holder: "the Conclave", title: "Archmaester",
      spots: ["the Seneschal's court", "the ravenry", "the Scribe's Hearth", "the vaults"] },
    "bitterbridge": { holder: "House Caswell", title: "Lord",
      spots: ["the bridge", "the tourney meadow", "the inn called the Bell"] },
    "horn-hill": { holder: "House Tarly", title: "Lord", spots: ["the armoury", "the hunting wood"] },
    "old-oak": { holder: "House Oakheart", spots: ["the great oak", "the north road"] },
    "ashford": { holder: "House Ashford", spots: ["the tourney field by the river", "the market", "the ford"] },
    "brightwater": { holder: "House Florent", spots: ["the fox banners", "the orchards"] },
    "arbor": { holder: "House Redwyne", title: "Lord",
      spots: ["the vineyards", "the wine quays", "the Ryamsport road", "the fleet moorings"] },
    "goldengrove": { holder: "House Rowan", spots: ["the apple orchards", "the golden hall"] },

    /* -------------------------------------------------- the stormlands -- */
    "storms-end": { holder: "House Baratheon", title: "Lord",
      spots: ["the drum tower", "the sea wall", "the causeway", "the smugglers' cove below"] },
    "bronzegate": { holder: "House Buckler", spots: ["the bronze gates", "the pass"] },
    "nightsong": { holder: "House Caron", title: "Lord", spots: ["the marches road", "the singing hall"] },
    "blackhaven": { holder: "House Dondarrion", spots: ["the black basalt wall", "the marcher road"] },
    "evenfall": { holder: "House Tarth", title: "Lord", spots: ["the blue water", "the hall above the strait"] },
    "griffins-roost": { holder: "House Connington", spots: ["the causeway", "the headland", "the griffin gate"] },
    "summerhall": { holder: "nobody, since the fire",
      spots: ["the burnt hall", "the overgrown terrace", "the black stones"] },
    "weeping-town": { holder: "House Wylde", spots: ["the grey harbour", "the sacked quarter"] },
    "mistwood": { holder: "House Mertyns", spots: ["the dripping wood", "the damp hall"] },

    /* --------------------------------------------------------- dorne ---- */
    "sunspear": { holder: "House Martell", title: "Prince",
      spots: ["the Threefold Gate", "the Tower of the Sun", "the Spear Tower", "the Old Palace",
        "the winding walls"] },
    "shadow-city": { holder: "House Martell", title: "Prince",
      spots: ["the bazaar", "the mud-brick warren", "the pillow houses", "the winding alleys"] },
    "planky-town": { holder: "the orphans of the Greenblood",
      spots: ["the lashed decks", "the plank bridges", "the river mouth", "the poleboat moorings"] },
    "yronwood": { holder: "House Yronwood", title: "Lord", spots: ["the Bloodroyal's hall", "the mountain road"] },
    "starfall": { holder: "House Dayne", title: "Lord",
      spots: ["the pale towers", "the river mouth", "the Palestone Sword"] },
    "hellholt": { holder: "House Uller", spots: ["the deep sand", "the poison garden nobody calls that"] },
    "sandstone": { holder: "House Qorgyle", spots: ["the pale domes", "the well court"] },
    "vaith": { holder: "House Vaith", spots: ["the dry fork", "the small hall"] },
    "kingsgrave": { holder: "House Manwoody", spots: ["the mountain seat", "the king's cairn"] },
    "boneway": { holder: "nobody — it is a pass, and it is full of bones",
      spots: ["the towers of the Wyl", "the narrow gorge", "the bone field"] },

    /* -------------------------------------------------- the free cities - */
    "braavos": { holder: "the Sealord", title: "Sealord",
      spots: ["the Titan", "the Purple Harbor", "the Moon Pool", "the Sweetwater Canal",
        "the Iron Bank steps", "the Sealord's Palace", "the mummers' quarter"],
      dishes: ["fried cod and vinegar", "eel and onions", "oysters, clams and cockles"] },
    "ragmans-harbor": { holder: "the Sealord", title: "Sealord",
      spots: ["the Ship, which is a mummers' theatre", "the wharves", "the Happy Port",
        "the drowned town", "the cheap lodgings"] },
    "house-black-white": { holder: "the Many-Faced God", title: "the kindly man",
      spots: ["the black and white doors", "the pool of still water", "the hall of faces"] },
    "iron-bank": { holder: "the keyholders", title: "keyholder",
      spots: ["the counting hall", "the vault stair", "the courtyard of statues"] },
    "pentos": { holder: "the magisters", title: "Magister",
      spots: ["the square brick towers", "the harbour", "the prince's palace", "the bell towers"] },
    "myr": { holder: "the magisters", spots: ["the lens-grinders' street", "the lace market", "the harbour"] },
    "lys": { holder: "the conclave of magisters",
      spots: ["the pillow houses", "the perfumed gardens", "the harbour", "the alchemists' row"] },
    "tyrosh": { holder: "the Archon", title: "Archon",
      spots: ["the dye vats", "the sellsword pitch", "the fighting yards", "the harbour"] },
    "volantis": { holder: "the triarchs", title: "Triarch",
      spots: ["the Black Wall", "the Long Bridge", "the Merchant's House", "the fishmongers' square",
        "the red temple", "the slave markets"] },
    "norvos": { holder: "the bearded priests", title: "priest",
      spots: ["the stone steps between the cities", "the temple of the axe", "the three bells"] },
    "qohor": { holder: "the guild of smiths and the Black Goat",
      spots: ["the forge quarter", "the black goat's temple", "the forest road"] },
    "lorath": { holder: "the three Harmonies", spots: ["the maze", "the cold harbour", "the shell beaches"] },
    "disputed-lands": { holder: "whichever free city paid last",
      spots: ["the burnt olive groves", "the sellsword camp", "the road nobody repairs"] },

    /* ------------------------------------------------------ the east ---- */
    "vaes-dothrak": { holder: "the dosh khaleen", title: "crone",
      spots: ["the horse gate", "the Western Market", "the Eastern Market",
        "the mother of mountains", "the womb of the world"],
      note: "No walls, and no man may draw a blade inside them." },
    "khalasar": { holder: "the khal", title: "Khal",
      spots: ["the horse lines", "the fire circle", "the captives' train", "the open grass"] },
    "astapor": { holder: "the Good Masters",
      spots: ["the plaza of pride", "the plaza of punishment", "the brick walls", "the harbour"] },
    "yunkai": { holder: "the Wise Masters", spots: ["the yellow walls", "the slave pens", "the harbour"] },
    "meereen": { holder: "the Great Masters",
      spots: ["the Great Pyramid", "Daznak's Pit", "the Temple of the Graces",
        "the plaza of punishment", "the harbour steps"] },
    "fighting-pits": { holder: "the pit masters",
      spots: ["Daznak's", "the Pit of Ghrazz", "the fighters' cells", "the sand"] },
    "qarth": { holder: "the Pureborn",
      spots: ["the Gate of the Three Walls", "the spice bazaar", "the Garden of Gehane",
        "the harbour", "the palace of the Thirteen"] },
    "house-undying": { holder: "the warlocks", title: "warlock",
      spots: ["the long grey building", "the door with no windows above it", "the blue-lipped hall"] },
    "asshai": { holder: "nobody who will say", spots: ["the black stone quays", "the masked market", "the Ash"] },
    "tall-trees-town": { holder: "the prince of Walano", title: "Prince",
      spots: ["the harbour", "the goldenheart grove", "the spice quay"] },
  },
};
