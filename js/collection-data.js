/* ============================================================================
   THE CABINET — what there is to collect, and the ladder you climb.

   Two things make a game worth coming back to when there is no opponent: a
   number that only goes up, and a shelf with gaps in it. This file is both.

   RENOWN is the number. Every game hands some out for playing and more for
   playing well, and the total is never spent — it only decides your rank.

   RELICS are the shelf. Each one is earned by doing a particular thing once,
   and each says plainly what that thing is BEFORE you have it, so the shelf is
   a list of things to try rather than a mystery box. Nothing here is random and
   nothing is bought: a relic you have is a thing you did.

   Adding a relic is a row in RELICS plus one call to KWCollection.award() at
   the moment it is earned. Adding a rank is a row in RANKS. Nothing else.

   The `at` field on a rank is the renown needed to reach it. Keep them rising.
   ========================================================================== */

window.KW_RANKS = [
  { at: 0,     name: "Smallfolk",        note: "You have a name and nothing else." },
  { at: 60,    name: "Sworn Sword",      note: "Somebody feeds you for holding a spear." },
  { at: 180,   name: "Hedge Knight",     note: "A horse, a sword, and no roof." },
  { at: 400,   name: "Household Knight", note: "A lord knows your face." },
  { at: 750,   name: "Landed Knight",    note: "A tower and forty acres." },
  { at: 1300,  name: "Bannerman",        note: "Men answer when you call." },
  { at: 2100,  name: "Lord of a House",  note: "Your words are written down." },
  { at: 3200,  name: "Lord Paramount",   note: "A kingdom answers to you." },
  { at: 4800,  name: "Hand of the King", note: "You do the ruling; another wears the crown." },
  { at: 7000,  name: "Crowned",          note: "There is nowhere further up." },
];

/* `how` is shown whether or not you have it — a locked relic is a suggestion.
   `rare` is only a label for the card's colour: common, fine, rare, legend. */
window.KW_RELICS = [
  /* ---------------- turning up at all ---------------- */
  { id: "first-blood",   name: "A First Question",   glyph: "&#10067;", rare: "common",
    how: "Finish a round of Trivia of the Realm." },
  { id: "first-voice",   name: "A Voice Recognised",  glyph: "&#128481;", rare: "common",
    how: "Finish a round of Who Said It?" },
  { id: "first-scales",  name: "The Scales",          glyph: "&#9878;",  rare: "common",
    how: "Finish a run of Higher or Lower." },
  { id: "first-word",    name: "A Word of the Realm", glyph: "&#128214;", rare: "common",
    how: "Solve a Wordle of the Realm." },
  { id: "first-council", name: "A Seat at the Table", glyph: "&#9819;",  rare: "common",
    how: "Seat a Small Council." },
  { id: "first-arms",    name: "A Banner Known",      glyph: "&#128737;", rare: "common",
    how: "Finish a round of Sigil Match." },
  { id: "first-life",    name: "A Life Lived",        glyph: "&#9876;&#65039;", rare: "common",
    how: "Live a character in The Iron Ladder all the way to their death." },

  /* ---------------- the Iron Ladder ---------------- */
  { id: "il-old",        name: "Died Old",            glyph: "&#128128;", rare: "fine",
    how: "Reach sixty years of age in The Iron Ladder. Most do not." },
  { id: "il-holding",    name: "Land of Your Own",    glyph: "&#127968;", rare: "fine",
    how: "Hold land in The Iron Ladder — a keep, a mill, a burnt holdfast, anything." },
  { id: "il-ambition",   name: "What You Came For",   glyph: "&#127919;", rare: "rare",
    how: "Die in The Iron Ladder having got the thing your character set out to get." },
  { id: "il-lord",       name: "A Lord in All But Title", glyph: "&#128081;", rare: "legend",
    how: "Climb high enough in one life that the world reckons you a lord." },

  /* ---------------- doing it well ---------------- */
  { id: "clean-ten",     name: "The Maester's Nod",   glyph: "&#127891;", rare: "fine",
    how: "Answer all ten trivia questions correctly in one round." },
  { id: "clean-voices",  name: "The Mummer's Ear",    glyph: "&#127917;", rare: "fine",
    how: "Name every speaker correctly in one round of Who Said It?" },
  { id: "hard-ten",      name: "The Citadel's Chain", glyph: "&#9939;",  rare: "rare",
    how: "Answer all ten correctly on HARD." },
  { id: "hard-voices",   name: "The Whisperer",       glyph: "&#128172;", rare: "rare",
    how: "Take a perfect round of Who Said It? on HARD." },
  { id: "long-scales",   name: "The Long Measure",    glyph: "&#128207;", rare: "rare",
    how: "Hold a streak of fifteen in Higher or Lower." },
  { id: "unaided",       name: "Unaided",             glyph: "&#128064;", rare: "fine",
    how: "Take a perfect round of Who Said It? without spending the hint or the fifty-fifty." },

  /* ---------------- coming back ---------------- */
  { id: "streak-3",      name: "Three Days Running",  glyph: "&#128293;", rare: "common",
    how: "Keep a daily streak for three days." },
  { id: "streak-7",      name: "A Turn of the Moon",  glyph: "&#127769;", rare: "fine",
    how: "Keep a daily streak for seven days." },
  { id: "streak-30",     name: "A Season Held",       glyph: "&#10052;", rare: "legend",
    how: "Keep a daily streak for thirty days." },

  /* ---------------- reading the realm, not just playing it ---------------- */
  { id: "all-sagas",     name: "Three Tales",         glyph: "&#128218;", rare: "fine",
    how: "Play a round in all three sagas — Game of Thrones, House of the Dragon, and Dunk & Egg." },
  { id: "book-reader",   name: "The Reader",          glyph: "&#128366;", rare: "rare",
    how: "Take a perfect round on the BOOK lines of Who Said It?" },
  { id: "shield-set",    name: "The Shield Raised",   glyph: "&#128737;", rare: "common",
    how: "Tell the spoiler shield how far you have come." },

  /* ---------------- the long haul ---------------- */
  { id: "hundred",       name: "A Hundred Answers",   glyph: "&#128200;", rare: "fine",
    how: "Answer a hundred questions correctly, across every game." },
  { id: "five-hundred",  name: "Five Hundred",        glyph: "&#127942;", rare: "legend",
    how: "Answer five hundred correctly, across every game." },
  { id: "every-game",    name: "The Whole Shelf",     glyph: "&#127920;", rare: "legend",
    how: "Play every game on this page at least once." },
];
