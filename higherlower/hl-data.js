/* ============================================================================
   Higher or Lower — the pool.

   ONE mixed game. Every round the engine picks a metric at random, shows a
   KNOWN thing (its value revealed) and a MYSTERY thing (hidden), and asks which
   is higher/lower FOR THAT METRIC. The metric changes round to round, so the
   big label at the top always tells you exactly what you're judging.

   A "deck" = one metric with a list of comparable things. The more items and
   the more decks, the less you ever see a pair twice.

   Entry shape:  { name, sub, v, img, frame }
     v      the number compared (same unit across the whole deck)
     img    path RELATIVE TO higherlower/ ("../assets/...")
     frame  "face" (portrait, filled) or "sigil" (arms on a plate)

   SPOILER TAGS, same shape as the trivia pool: `s` = safe once you have seen
   that season of Game of Thrones, `b` = safe once you have read that book.
   Either one satisfies the shield. A tag on the DECK hides the whole metric; a
   tag on an ITEM hides that one entry and leaves the rest of the deck playable.
   An untagged deck or item is ambient lore and always safe.

   Accuracy: reigns + history are hard canon (Fire & Blood / TWOIAF dates);
   hosts + populations + kills + POV-counts are the figures the books/fandom
   give and are flagged APPROXIMATE in-game (the deck's `src` line). Ties are
   accepted either-way by the engine, so near-parity never punishes you.
   ========================================================================== */
window.HL_DECKS = [

  /* ---------------------------------------------------------------- reigns */
  {
    id: "reigns", name: "Reign Length", emoji: "♚",
    tag: "Years seated on the Iron Throne", prompt: "Who wore the crown for longer?",
    more: "Longer reign", less: "Shorter reign", unit: "years",
    fmt: function (v) { return v + (v === 1 ? " year" : " years"); },
    src: "Regnal dates from the histories — Fire &amp; Blood and The World of Ice and Fire.",
    items: [
      { name: "Jaehaerys I", sub: "the Conciliator · 48–103 AC", v: 55, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Aegon I", sub: "the Conqueror · 1–37 AC", v: 37, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Viserys I", sub: "103–129 AC", v: 26, img: "../hotd/assets/people/viserys-i.jpg", frame: "face" },
      { name: "Aegon III", sub: "the Dragonbane · 131–157 AC", v: 26, img: "../hotd/assets/people/aegon-the-younger.jpg", frame: "face" },
      { name: "Aegon V", sub: "the Unlikely · 233–259 AC", v: 26, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Daeron II", sub: "the Good · 184–209 AC", v: 25, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Aerys II", sub: "the Mad King · 262–283 AC", v: 21, img: "../assets/people/aerys-targaryen.jpg", frame: "face" },
      { name: "Robert I", sub: "Baratheon · 283–298 AC", v: 15, img: "../assets/people/robert-baratheon.jpg", frame: "face" },
      { name: "Aegon IV", sub: "the Unworthy · 172–184 AC", v: 12, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Aerys I", sub: "209–221 AC", v: 12, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Maekar I", sub: "221–233 AC", v: 12, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Baelor I", sub: "the Blessed · 161–171 AC", v: 10, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Maegor I", sub: "the Cruel · 42–48 AC", v: 6, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Aenys I", sub: "37–42 AC", v: 5, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Daeron I", sub: "the Young Dragon · 157–161 AC", v: 4, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Jaehaerys II", sub: "259–262 AC", v: 3, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Aegon II", sub: "129–131 AC", v: 2, img: "../hotd/assets/people/aegon-ii.jpg", frame: "face" },
      /* the only reign here that ends INSIDE the story — the dates alone say
         when he stops being king, so this one entry waits for the shield */
      { name: "Joffrey I", sub: "Baratheon · 298–300 AC", v: 2, s: 4, b: 3, img: "../assets/people/joffrey-baratheon.jpg", frame: "face" },
      { name: "Viserys II", sub: "171–172 AC", v: 1, img: "../assets/sigils/targaryen.svg", frame: "sigil" }
    ]
  },

  /* ------------------------------------------------------------------ ages */
  {
    id: "ages", name: "Age at the Start", emoji: "⌛",
    tag: "How old, as A Game of Thrones opens", prompt: "Who is the elder?",
    more: "Older", less: "Younger", unit: "years old",
    fmt: function (v) { return v + (v === 1 ? " year old" : " years old"); },
    src: "Book ages at the opening of A Game of Thrones (~297–298 AC).",
    items: [
      { name: "Maester Aemon", sub: "of the Night's Watch", v: 100, img: "../assets/people/maester-aemon.jpg", frame: "face" },
      { name: "Walder Frey", sub: "Lord of the Crossing", v: 91, img: "../assets/people/walder-frey.jpg", frame: "face" },
      { name: "Grand Maester Pycelle", sub: "of the small council", v: 84, img: "../assets/people/pycelle.jpg", frame: "face" },
      { name: "Olenna Tyrell", sub: "the Queen of Thorns", v: 70, img: "../assets/sigils/tyrell.svg", frame: "sigil" },
      { name: "Barristan Selmy", sub: "Lord Commander of the Kingsguard", v: 63, img: "../assets/people/barristan-selmy.jpg", frame: "face" },
      { name: "Tywin Lannister", sub: "Lord of Casterly Rock", v: 57, img: "../assets/people/tywin-lannister.jpg", frame: "face" },
      { name: "Jorah Mormont", sub: "the exile", v: 42, img: "../assets/people/jorah-mormont.jpg", frame: "face" },
      { name: "Eddard Stark", sub: "Lord of Winterfell", v: 35, img: "../assets/people/eddard-stark.jpg", frame: "face" },
      { name: "Robert Baratheon", sub: "the king", v: 35, img: "../assets/people/robert-baratheon.jpg", frame: "face" },
      { name: "Catelyn Stark", sub: "Lady of Winterfell", v: 33, img: "../assets/people/catelyn-stark.jpg", frame: "face" },
      { name: "Cersei Lannister", sub: "the queen", v: 32, img: "../assets/people/cersei-lannister.jpg", frame: "face" },
      { name: "Jaime Lannister", sub: "the Kingslayer", v: 32, img: "../assets/people/jaime-lannister.jpg", frame: "face" },
      { name: "Petyr Baelish", sub: "Littlefinger", v: 28, img: "../assets/people/petyr-baelish.jpg", frame: "face" },
      { name: "Tyrion Lannister", sub: "the Imp", v: 24, img: "../assets/people/tyrion-lannister.jpg", frame: "face" },
      { name: "Theon Greyjoy", sub: "ward of Winterfell", v: 19, img: "../assets/people/theon-greyjoy.jpg", frame: "face" },
      { name: "Samwell Tarly", sub: "of the Night's Watch", v: 15, img: "../assets/people/samwell-tarly.jpg", frame: "face" },
      { name: "Robb Stark", sub: "heir to Winterfell", v: 14, img: "../assets/people/robb-stark.jpg", frame: "face" },
      { name: "Jon Snow", sub: "the bastard of Winterfell", v: 14, img: "../assets/people/jon-snow.jpg", frame: "face" },
      { name: "Daenerys Targaryen", sub: "wed to Khal Drogo", v: 13, img: "../assets/people/daenerys-targaryen.jpg", frame: "face" },
      { name: "Joffrey Baratheon", sub: "the crown prince", v: 12, img: "../assets/people/joffrey-baratheon.jpg", frame: "face" },
      { name: "Sansa Stark", sub: "of Winterfell", v: 11, img: "../assets/people/sansa-stark.jpg", frame: "face" },
      { name: "Arya Stark", sub: "of Winterfell", v: 9, img: "../assets/people/arya-stark.jpg", frame: "face" },
      { name: "Bran Stark", sub: "of Winterfell", v: 7, img: "../assets/people/bran-stark.jpg", frame: "face" },
      { name: "Rickon Stark", sub: "the youngest wolf", v: 3, img: "../assets/people/rickon-stark.jpg", frame: "face" }
    ]
  },

  /* ----------------------------------------------------------------- hosts */
  {
    id: "hosts", name: "Fighting Strength", emoji: "⚔️",
    tag: "Men under arms", prompt: "Which was the greater host?",
    more: "Bigger host", less: "Smaller host", unit: "men",
    fmt: function (v) { return v.toLocaleString("en-US") + (v === 1 ? " man" : " men"); },
    src: "The strengths the books name, or the hosts they describe (approximate).",
    items: [
      { name: "The Free Folk", sub: "Mance Rayder's host", v: 100000, img: "../assets/scenes/battle-for-the-wall.webp", frame: "face" },
      { name: "Renly's Host", sub: "the Reach and Stormlands", v: 80000, img: "../assets/people/renly-baratheon.jpg", frame: "face" },
      { name: "The Field of Fire", sub: "the Two Kings vs Aegon", v: 55000, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "Khal Drogo's Khalasar", sub: "Dothraki screamers", v: 40000, img: "../assets/people/khal-drogo.jpg", frame: "face" },
      { name: "Tywin's Host", sub: "at the Green Fork", v: 20000, img: "../assets/people/tywin-lannister.jpg", frame: "face" },
      { name: "Robb's Host", sub: "the Young Wolf's banners", v: 18000, img: "../assets/people/robb-stark.jpg", frame: "face" },
      { name: "Jaime's Host", sub: "the siege of Riverrun", v: 15000, img: "../assets/people/jaime-lannister.jpg", frame: "face" },
      { name: "The Golden Company", sub: "ten thousand, and elephants", v: 10000, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "The Unsullied", sub: "bought whole at Astapor", v: 8000, img: "../assets/people/grey-worm.jpg", frame: "face" },
      { name: "The Night's Watch", sub: "a shadow of ten thousand", v: 1000, img: "../assets/people/jeor-mormont.jpg", frame: "face" },
      { name: "The Tower of Joy", sub: "Ned's party", v: 7, img: "../assets/people/eddard-stark.jpg", frame: "face" },
      { name: "The Three Kingsguard", sub: "who held the tower", v: 3, img: "../assets/people/barristan-selmy.jpg", frame: "face" }
    ]
  },

  /* -------------------------------------------------------------- populace */
  {
    id: "population", name: "The Populace", emoji: "🏰",
    tag: "How many souls dwell there", prompt: "Which holds more people?",
    more: "More people", less: "Fewer people", unit: "souls",
    fmt: function (v) { return "~" + v.toLocaleString("en-US"); },
    src: "As the maesters reckon it — King's Landing near half a million; the rest ordered by the books (approximate).",
    items: [
      { name: "King's Landing", sub: "the capital of the realm", v: 500000, img: "../assets/scenes/red-keep.webp", frame: "face" },
      { name: "Oldtown", sub: "the old city of the Reach", v: 100000, img: "../assets/sigils/hightower.png", frame: "sigil" },
      { name: "Lannisport", sub: "port beneath Casterly Rock", v: 60000, img: "../assets/sigils/lannister.svg", frame: "sigil" },
      { name: "White Harbor", sub: "the North's only city", v: 40000, img: "../assets/scenes/winterfell-with-people.webp", frame: "face" },
      { name: "Gulltown", sub: "the port of the Vale", v: 35000, img: "../assets/sigils/arryn.svg", frame: "sigil" },
      { name: "The winter town", sub: "below Winterfell's walls", v: 3000, img: "../assets/scenes/winterfell.webp", frame: "face" },
      { name: "Castle Black", sub: "garrison of the Watch", v: 600, img: "../assets/scenes/castle-black.webp", frame: "face" },
      { name: "Craster's Keep", sub: "beyond the Wall", v: 40, img: "../assets/scenes/prologue-beyond-the-wall.webp", frame: "face" }
    ]
  },

  /* ------------------------------------------------------------------- kills */
  {
    /* THE WHOLE DECK waits for the end of the show. A tally of kills across
       eight seasons tells you plainly who is still standing in the eighth, and
       several of the subtitles below give away a turn of their own. */
    id: "kills", name: "On-Screen Kills", emoji: "🗡️", s: 8,
    tag: "Foes cut down on screen", prompt: "Who has the higher body count?",
    more: "More kills", less: "Fewer kills", unit: "kills",
    fmt: function (v) { return "≈ " + v + (v === 1 ? " kill" : " kills"); },
    src: "The fandom's on-screen tally for the HBO series — personal, hand-to-hand, and approximate.",
    items: [
      { name: "The Hound", sub: "Sandor Clegane", v: 25, img: "../assets/people/sandor-clegane.jpg", frame: "face" },
      { name: "Grey Worm", sub: "of the Unsullied", v: 20, img: "../assets/people/grey-worm.jpg", frame: "face" },
      { name: "Jon Snow", sub: "Lord Commander", v: 18, img: "../assets/people/jon-snow.jpg", frame: "face" },
      { name: "Arya Stark", sub: "no one", v: 15, img: "../assets/people/arya-stark.jpg", frame: "face" },
      { name: "Bronn", sub: "of the Blackwater", v: 12, img: "../assets/people/bronn.jpg", frame: "face" },
      { name: "Jaime Lannister", sub: "the Kingslayer", v: 11, img: "../assets/people/jaime-lannister.jpg", frame: "face" },
      { name: "Brienne of Tarth", sub: "the Maid of Tarth", v: 9, img: "../assets/people/brienne-of-tarth.jpg", frame: "face" },
      { name: "Jorah Mormont", sub: "the exile", v: 7, img: "../assets/people/jorah-mormont.jpg", frame: "face" },
      { name: "Theon Greyjoy", sub: "Reek, once", v: 5, img: "../assets/people/theon-greyjoy.jpg", frame: "face" },
      { name: "Tyrion Lannister", sub: "who slew his own father", v: 4, img: "../assets/people/tyrion-lannister.jpg", frame: "face" }
    ]
  },

  /* ----------------------------------------------------------------- history */
  {
    id: "history", name: "Long Ago", emoji: "📜",
    tag: "How long before the tale it happened", prompt: "Which was longer ago?",
    more: "Longer ago", less: "More recent", unit: "years before",
    fmt: function (v) { return v.toLocaleString("en-US") + " years before"; },
    src: "Reckoned from the start of A Game of Thrones (~298 AC); the deep past is as the legends tell it.",
    items: [
      { name: "The Long Night", sub: "and the raising of the Wall", v: 8000, img: "../assets/scenes/prologue-beyond-the-wall.webp", frame: "face" },
      { name: "Nymeria's landing", sub: "the founding of Dornish rule", v: 1000, img: "../assets/sigils/martell.svg", frame: "sigil" },
      { name: "The Doom of Valyria", sub: "the death of the Freehold", v: 400, img: "../assets/scenes/the-doom-of-valyria.webp", frame: "face" },
      { name: "Aegon's Conquest", sub: "the forging of the realm", v: 298, img: "../assets/scenes/aegon-burning-armies.webp", frame: "face" },
      { name: "The Dance of the Dragons", sub: "the Targaryen civil war", v: 168, img: "../assets/sigils/targaryen.svg", frame: "sigil" },
      { name: "The Blackfyre Rebellion", sub: "the first of five", v: 102, img: "../assets/sigils/new/blackfyre.webp", frame: "sigil" },
      { name: "The Tourney at Harrenhal", sub: "the year of the false spring", v: 17, img: "../assets/scenes/harrenhall-burning.webp", frame: "face" },
      { name: "The Sack of King's Landing", sub: "the end of the Mad King", v: 15, img: "../assets/scenes/throne-room-betrayal.webp", frame: "face" },
      { name: "The Greyjoy Rebellion", sub: "Balon's first crown", v: 9, img: "../assets/scenes/pyke.webp", frame: "face" }
    ]
  },

  /* --------------------------------------------------------------- povcount */
  {
    /* Likewise: who is still narrating by the fifth book is a list of who
       lived that long, and "and Lady Stoneheart" is a book-three ending in
       three words. The whole deck waits for a reader who has finished them. */
    id: "povchapters", name: "Point-of-View Chapters", emoji: "📖", b: 5,
    tag: "Chapters told through their eyes", prompt: "Who narrates more of the books?",
    more: "More chapters", less: "Fewer chapters", unit: "chapters",
    fmt: function (v) { return v + (v === 1 ? " chapter" : " chapters"); },
    src: "POV chapters counted across the five books through A Dance with Dragons.",
    items: [
      { name: "Tyrion Lannister", sub: "the most-read voice", v: 47, img: "../assets/people/tyrion-lannister.jpg", frame: "face" },
      { name: "Jon Snow", sub: "of the Night's Watch", v: 42, img: "../assets/people/jon-snow.jpg", frame: "face" },
      { name: "Arya Stark", sub: "the wandering wolf", v: 33, img: "../assets/people/arya-stark.jpg", frame: "face" },
      { name: "Daenerys Targaryen", sub: "across the narrow sea", v: 31, img: "../assets/people/daenerys-targaryen.jpg", frame: "face" },
      { name: "Catelyn Stark", sub: "and Lady Stoneheart", v: 25, img: "../assets/people/catelyn-stark.jpg", frame: "face" },
      { name: "Sansa Stark", sub: "the little bird", v: 24, img: "../assets/people/sansa-stark.jpg", frame: "face" },
      { name: "Bran Stark", sub: "the broken boy", v: 21, img: "../assets/people/bran-stark.jpg", frame: "face" },
      { name: "Jaime Lannister", sub: "the Kingslayer", v: 17, img: "../assets/people/jaime-lannister.jpg", frame: "face" },
      { name: "Eddard Stark", sub: "Hand of the King", v: 15, img: "../assets/people/eddard-stark.jpg", frame: "face" },
      { name: "Davos Seaworth", sub: "the Onion Knight", v: 13, img: "../assets/people/davos-seaworth.jpg", frame: "face" },
      { name: "Theon Greyjoy", sub: "Reek", v: 13, img: "../assets/people/theon-greyjoy.jpg", frame: "face" },
      { name: "Cersei Lannister", sub: "the queen regent", v: 12, img: "../assets/people/cersei-lannister.jpg", frame: "face" },
      { name: "Samwell Tarly", sub: "the slayer", v: 10, img: "../assets/people/samwell-tarly.jpg", frame: "face" },
      { name: "Brienne of Tarth", sub: "the maid", v: 8, img: "../assets/people/brienne-of-tarth.jpg", frame: "face" }
    ]
  }

];
