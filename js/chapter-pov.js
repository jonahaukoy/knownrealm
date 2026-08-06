/* WHOSE EYES EACH CHAPTER LOOKS THROUGH.

   Every chapter in the five books is titled for its point-of-view character —
   "Bran I", "Tyrion IV", and in the later books a description instead of a name
   ("Reek", "Alayne", "The Prophet"). This maps the title's stem to the exact
   key that person is filed under in js/characters.js, so a character page can
   list their own chapters, in order, with the one-line retelling each chapter
   already carries.

   The stem is the title with its trailing roman numeral stripped, so "Arya VII"
   and "Arya I" both arrive here as "Arya". Prologues and epilogues keep their
   whole title because that is how js/books.js writes them.

   A stem with no entry here simply means no character page claims those
   chapters — which is correct for a prologue whose viewpoint never appears
   again. Add a row when a new POV name enters the data. */

window.CHAPTER_POV = {
  /* ---- the recurring viewpoints ---- */
  "Tyrion":   "Tyrion Lannister",
  "Jon":      "Jon Snow",
  "Arya":     "Arya Stark",
  "Daenerys": "Daenerys Targaryen",
  "Catelyn":  "Catelyn Stark",
  "Sansa":    "Sansa Stark",
  "Bran":     "Bran Stark",
  "Jaime":    "Jaime Lannister",
  "Eddard":   "Eddard Stark",
  "Davos":    "Davos Seaworth",
  "Cersei":   "Cersei Lannister",
  "Samwell":  "Samwell Tarly",
  "Theon":    "Theon Greyjoy",
  "Brienne":  "Brienne of Tarth",
  "Asha":     "Asha Greyjoy",
  "Barristan": "Barristan Selmy",
  "Quentyn":  "Quentyn Martell",
  "Victarion": "Victarion Greyjoy",
  "Aeron":    "Aeron Greyjoy",
  "Areo":     "Areo Hotah",
  "Arianne":  "Arianne Martell",
  "Arys":     "Arys Oakheart",
  "Melisandre": "Melisandre",
  "Connington": "Jon Connington",

  /* ---- the names a viewpoint hides behind ---- */
  /* Theon in Winterfell, after Ramsay has finished with his name */
  "Reek":     "Theon Greyjoy",
  /* Sansa in the Vale, under Littlefinger's invented daughter */
  "Alayne":   "Sansa Stark",

  /* ---- the chapters that stand outside the count ---- */
  "Prologue · Will":       "Will of the Night's Watch",
  "Prologue · Chett":      "Chett",
  "Prologue · Varamyr":    "Varamyr Sixskins",
  "Epilogue · Kevan":      "Kevan Lannister",
  "Epilogue · Merrett Frey": "Merrett Frey",
  /* Maester Cressen (ACOK) and Pate the novice (AFFC) have no character page,
     so their prologues are claimed by nobody. That is not an oversight. */
};
