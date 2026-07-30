/* WORDLE OF THE REALM — the word pools.
 *
 * Curated by hand, three lengths. The rule the owner set: these are NORMAL
 * WORDS with an attachment to the world — DRAGON belongs, COMPUTER does not.
 * No character names, no house names, and no obscure places only a superfan
 * would know (Qohor, Eyrie, Umber, Royce, Reyne, Dayne, Swann were all pulled).
 * A real word that happens to double as a name is fine, so long as it is a word
 * first — a CROWN, a STORM, a THORN.
 *
 * Every entry must be a real English word (or a plain in-world noun everyone
 * knows) of exactly the length of its key. The engine validates lengths on load
 * and drops anything that does not fit, warning in the console.
 */
window.WORDLE_WORDS = {
  4: [
    "OATH", "KING", "LION", "WOLF", "CROW", "SNOW", "FIRE", "IRON", "GOLD", "KEEP",
    "LORD", "PACT", "ROSE", "BEAR", "HAWK", "STAG", "BOAR", "HORN", "MOON", "STAR",
    "DAWN", "DUSK", "WARD", "HALL", "GATE", "MOAT", "PIKE", "BOLT", "HELM", "MAIL",
    "SHIP", "SAIL", "TIDE", "SALT", "PEAK", "VALE", "WOOD", "TREE", "LEAF", "ROOT",
    "THAW", "WIND", "WARG", "PACK", "HUNT", "PREY", "FANG", "CLAW", "PELT", "HIDE",
    "MEAD", "WINE", "BONE", "TOMB", "PYRE", "COAL", "OARS", "RUNE", "VOWS", "SEER",
    "WALL", "MASK", "ROBE", "RING", "SILK", "FURS", "COLD", "WARM", "SCAR", "DUEL",
    "EDGE", "FORD", "REIN", "SPUR", "BARB", "DIRK", "PROW", "HULL", "DOCK", "REEF",
    "COVE", "MIRE", "REED", "MOSS", "PINE", "BARK", "MACE", "DART", "HAIL", "GALE",
    "MIST", "DEER", "HARE", "DOVE", "GULL", "FIST", "HEIR", "PAGE", "SERF", "MAID",
    "HOLD", "FORT", "TOLL", "WELL", "PATH", "ROAD", "LANE", "SEPT", "KILN", "SOOT",
  ],
  5: [
    "ARROW", "BLADE", "BLOOD", "CHAIN", "CLOAK", "CROWN", "CROWS", "FAITH", "FEAST", "FLAME",
    "FROST", "GIANT", "GREEN", "GUARD", "HONOR", "HORSE", "KINGS", "KNIFE", "LIGHT", "OATHS",
    "QUEEN", "RAVEN", "REALM", "RIVER", "SIEGE", "SPEAR", "STEEL", "STONE", "STORM", "SWORD",
    "THORN", "TOWER", "TRIAL", "WATCH", "WHITE", "WIGHT", "WINDS", "WOODS", "BEAST", "REIGN",
    "LANCE", "ARMOR", "VISOR", "CREST", "LIEGE", "NOBLE", "MOTTE", "NORTH", "SOUTH", "COAST",
    "CLIFF", "RIDGE", "MARSH", "GLADE", "GROVE", "BOUGH", "EMBER", "ASHEN", "SMOKE", "TORCH",
    "PYRES", "SKULL", "GRAVE", "CRYPT", "GHOST", "CURSE", "OMENS", "DREAM", "REAVE", "SCALE",
    "TALON", "WINGS", "ROOST", "MANOR", "VAULT", "FORGE", "ANVIL", "SPURS", "REINS", "STEED",
    "NIGHT", "BLAZE", "ROYAL", "WIDOW", "TENTS", "CAMPS", "FIELD", "CROWD", "SWORN", "SABLE",
    "KNOWN", "WORLD",
    "MOUNT", "STEEP", "HEATH", "GORGE", "SHORE", "SEDGE", "HEDGE", "FLARE", "GLINT", "GLEAM",
    "SHADE", "GLOOM", "BLEAK", "HARSH", "GRIME", "SLEET", "DRIFT", "MOORS", "FELLS", "CRAGS",
    "BLUFF", "KNOLL", "BROOK", "CREEK", "POOLS", "SPIRE", "ALTAR", "RELIC", "CREED", "HYMNS",
    "PIKES", "FLAIL", "SABER", "PARRY", "FEINT", "MELEE", "SCOUT", "FORAY", "REGAL", "COURT",
    "TITLE", "LANDS", "TITHE", "COINS", "HOUND", "EAGLE", "SNAKE", "VIPER", "TROUT", "CHILL",
    "GUSTS", "SLUSH", "HILTS",
  ],
  6: [
    "DRAGON", "WINTER", "THRONE", "KNIGHT", "CASTLE", "SQUIRE", "ARMOUR", "HELMET", "DAGGER", "QUIVER",
    "ARROWS", "SHIELD", "BANNER", "HERALD", "VASSAL", "WARDEN", "MASTER", "SEPTON", "RAVENS", "WOLVES",
    "HORSES", "RIDERS", "LANCES", "SWORDS", "BLADES", "BATTLE", "SIEGES", "CROWNS", "REALMS", "AUTUMN",
    "SUMMER", "FROSTS", "ICICLE", "FROZEN", "WIGHTS", "UNDEAD", "WRAITH", "FOREST", "GREENS", "MEADOW",
    "VALLEY", "RAVINE", "SUMMIT", "HARBOR", "GALLEY", "VOYAGE", "TEMPLE", "CANDLE", "ASHORE", "EMBERS",
    "CINDER", "WARMTH", "HEARTH", "MANTLE", "SIGNET", "GOBLET", "FLAGON", "SUPPER", "HUNGER", "FAMINE",
    "PLAGUE", "POISON", "EXILED", "RANSOM", "TREATY", "PARLEY", "SECRET", "BETRAY", "TURRET", "ORPHAN",
    "REGENT", "ARCHER", "LANCER", "RAIDER", "REAVER", "DONJON", "BAILEY", "SHROUD", "COFFIN", "TIMBER",
    "BRANCH", "BRIARS", "THORNS", "HEDGES", "GROVES", "GARDEN", "SWAMPS", "TUNDRA", "DELUGE", "SQUALL",
    "RAVAGE", "SORTIE", "COLUMN", "LEGION", "COHORT", "MUSTER", "LEVIES", "SADDLE", "BRIDLE", "GALLOP",
    "CANTER", "CHARGE", "CAPTOR", "DECREE", "PARDON", "MANORS", "KEEPER", "SEPTAS", "SPIRES", "CRYPTS",
    "WIDOWS",
  ],
};
