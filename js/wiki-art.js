/* PICTURES FOR THE WIKI — which of the site's own paintings belongs to whom.

   The gallery (js/art-manifest.js) holds every piece of art the owner has made.
   Most of it was painted for a particular chapter or hour and is already filed
   against one in wiki.html's WIKI_IMAGES, so a chapter row and a season segment
   can find their own picture without anybody writing a second table.

   What this file adds is the one thing that could NOT be derived: which single
   painting stands for a PERSON at the top of their page.

   THE RULE FOR THIS TABLE, and it matters: a character's banner is shown to
   everybody, before the spoiler shield has been consulted at all. So it must
   never be the picture of how they die, how they are maimed, or of anything the
   reader has not reached. Ned Stark's banner is Ned in his own godswood, not
   the steps of Baelor's sept — the sept is in the season-one segment, which the
   shield can hold back, and that is where it belongs.

   Anything not listed here simply falls back to the empty frame, which is a
   perfectly good look and not a bug to be filled in a hurry. */

window.WIKI_PORTRAIT = {
  /* ---- the Starks ---- */
  "Eddard Stark":       "assets/scenes/ned-in-the-godswood.webp",
  "Catelyn Stark":      "assets/scenes/catelyn-and-littlefinger.webp",
  "Robb Stark":         "assets/scenes/ravens-call-the-banners.webp",
  "Sansa Stark":        "assets/scenes/sansa-to-queen-cersei.webp",
  "Arya Stark":         "assets/scenes/arya-watches-sparring.webp",
  "Bran Stark":         "assets/scenes/bran-climbs.webp",
  "Jon Snow":           "assets/scenes/jon-weirwood-vows.webp",
  "Benjen Stark":       "assets/scenes/benjen-rides-ranging.webp",

  /* ---- the Lannisters and the court ---- */
  "Tyrion Lannister":   "assets/scenes/tyrion-breakfast.webp",
  "Jaime Lannister":    "assets/scenes/jaime-street-ambush.webp",
  "Tywin Lannister":    "assets/scenes/tywins-war-tent.webp",
  "Cersei Lannister":   "assets/scenes/maggy-the-frog.webp",
  "Robert Baratheon":   "assets/scenes/the-winterfell-feast.webp",
  "Varys":              "assets/scenes/varys-in-the-hand-chambers.webp",
  "Petyr Baelish":      "assets/scenes/catelyn-and-littlefinger.webp",
  "Bronn":              "assets/scenes/bronn-vardis-moon-door.webp",
  "Barristan Selmy":    "assets/scenes/barristan-dismissed.webp",
  "Sandor Clegane":     "assets/scenes/hound-rides-down-mycah.webp",
  "Gendry":             "assets/scenes/tobho-motts-forge.webp",
  "Syrio Forel":        "assets/scenes/syrio-first-lesson.webp",
  "Jon Arryn":          "assets/scenes/jon-arryns-lineages.webp",
  "Lysa Arryn":         "assets/scenes/eyrie-welcome.webp",
  "Walder Frey":        "assets/scenes/entering-the-twins.webp",
  "Stannis Baratheon":  "assets/scenes/jon-baratheon-letter.webp",

  /* ---- across the narrow sea ---- */
  "Daenerys Targaryen": "assets/scenes/daenerys-wedding.webp",
  "Khal Drogo":         "assets/scenes/daenerys-and-drogo.webp",
  "Viserys Targaryen":  "assets/scenes/viserys-in-the-grass.webp",

  /* ---- the Wall and beyond ---- */
  "Jeor Mormont":       "assets/scenes/wight-in-mormonts-chambers.webp",
  "Samwell Tarly":      "assets/scenes/samwell-arrives.webp",
  "Euron Greyjoy":      "assets/scenes/euron-confrontation.webp",
};

/* Pictures that belong INSIDE the text, against a particular season, so they
   arrive where the reader is reading and are held back by the same shield that
   holds the season back. Anything with real weight in it lives here rather than
   in the banner table above.

   Shape: "char:<exact name>": [ { src, label, season } ]. */
window.WIKI_FIGURES = {
  "char:Eddard Stark": [
    { src: "assets/scenes/the-small-council.webp", label: "The small council, and six million in debt", season: 1 },
    { src: "assets/scenes/baelors-steps.webp", label: "The steps of Baelor's sept", season: 1 },
  ],
  "char:Arya Stark": [
    { src: "assets/scenes/syrio-holds-the-door.webp", label: "Syrio Forel holds the door", season: 1 },
    { src: "assets/scenes/arya-dragon-skulls.webp", label: "Among the dragon skulls", season: 1 },
  ],
  "char:Bran Stark": [
    { src: "assets/scenes/bran-pups-in-the-snow.webp", label: "Six pups in the snow", season: 1 },
    { src: "assets/scenes/three-eyed-raven.webp", label: "The three-eyed raven", season: 6 },
  ],
  "char:Jon Snow": [
    { src: "assets/scenes/jon-named-steward.webp", label: "Named to the stewards", season: 1 },
    { src: "assets/scenes/battle-for-the-wall.webp", label: "The battle for the Wall", season: 4 },
    { src: "assets/scenes/hardhome.webp", label: "Hardhome", season: 5 },
  ],
  "char:Daenerys Targaryen": [
    { src: "assets/scenes/daenerys-stallion-prophecy.webp", label: "The stallion who mounts the world", season: 1 },
    { src: "assets/scenes/drogos-pyre.webp", label: "Drogo's pyre", season: 1 },
    { src: "assets/scenes/house-of-the-undying-inside.webp", label: "Within the House of the Undying", season: 2 },
  ],
  "char:Tyrion Lannister": [
    { src: "assets/scenes/tyrion-sky-cell.webp", label: "A sky cell at the Eyrie", season: 1 },
    { src: "assets/scenes/blackwater2.webp", label: "The Blackwater", season: 2 },
  ],
  "char:Catelyn Stark": [
    { src: "assets/scenes/catspaw-in-the-sickroom.webp", label: "The catspaw in the sickroom", season: 1 },
    { src: "assets/scenes/red-wedding.webp", label: "The Red Wedding", season: 3 },
  ],
  "char:Robb Stark": [
    { src: "assets/scenes/king-in-the-north.webp", label: "The King in the North", season: 1 },
    { src: "assets/scenes/red-wedding.webp", label: "The Red Wedding", season: 3 },
  ],
  "char:Sansa Stark": [
    { src: "assets/scenes/sansa-pleads-for-ned.webp", label: "Pleading for her father", season: 1 },
  ],
  "char:Jaime Lannister": [
    { src: "assets/scenes/whispering-wood-jaime.webp", label: "Taken in the Whispering Wood", season: 1 },
  ],
  "char:Cersei Lannister": [
    { src: "assets/scenes/seed-is-strong-godswood.webp", label: "The seed is strong", season: 1 },
  ],
  "char:Theon Greyjoy": [
    { src: "assets/scenes/pyke.webp", label: "Pyke", season: 2 },
  ],
};
