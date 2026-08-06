/* ============================================================================
   THE CHRONICLE, IN FULL — the Dawn Age and the Age of Heroes.

   One article per moment on the timeline. The key is the moment's own id in
   js/timeline-data.js; js/col/moments.js reads both and hands the pair to the
   wiki's collections engine, so the timeline's "read further" button and the
   wiki article are guaranteed to be about the same thing.

     { paras: [...],                    the fuller tale
       sections: [{ h, paras }],        further titled blocks
       links: [[label, hash], ...],     where else to go in this wiki
       fate: [...] }                    only inside the spoiler fold

   PROSE RULES. All original — nothing lifted from any wiki, here or anywhere.
   Plain text with real Unicode punctuation, never HTML entities: the engine
   escapes what it renders, so "&mdash;" would print as those six characters.
   ========================================================================== */

Object.assign(window.MOMENT_ARTICLES = window.MOMENT_ARTICLES || {}, {

  "dawn-children": {
    paras: [
      "There is no reliable account of the children of the forest, and there cannot be one. They kept no annals, carved no inscriptions anyone has learned to read, and built nothing that survives above ground. Every word written about them was written thousands of years afterward, in a language they did not speak, by the descendants of the people who took their country. A maester reading his own order's histories on this subject is reading a rumour that has been copied out four hundred times.",
      "What can be said with some confidence is negative: before men, Westeros was forest, and the forest had inhabitants who were not men. The weirwoods with faces are real and are older than any castle. The obsidian arrowheads turned up by northern ploughs are real. The caves under the hills that nobody dug are real. Everything past that — the size of them, the length of their lives, the singing, the greenseers — comes down through the mouths of their enemies and should be held loosely.",
      "The account the maesters settled on describes a small, dark, long-lived people, brown-skinned and large-eyed, dressed in leaves and bark, armed with weapons of dragonglass because they had no metal. They lived in the deep wood and under it. They had no kings that anyone could identify and no cities to burn, which is one reason the war against them took so long: there was never a capital to take or a crown to knock off.",
      "Their gods had no names and no faces except the ones carved into the trees, and they became the gods of the men who killed them — which is the strangest thing in this whole strange chapter. A northern lord kneeling in his godswood today is praying at an altar built by a people his ancestors hunted to the edge of the world.",
    ],
    sections: [
      { h: "The song of earth", paras: [
        "The one power consistently attributed to them is the one hardest to test: greenseeing, the ability to look through the eyes of a weirwood, and through the eyes of beasts, and — in the most extravagant tellings — through time. The Citadel's position for three centuries was that this is a story told about a story. That position has not aged well for anyone who has followed the tale to its northern end.",
        "The other power the songs give them is the Hammer of the Waters: the breaking of a landmass by will. It is invoked twice, at the Arm of Dorne and at the Neck, and both times it is used to stop an invasion by drowning the road it came in on. Whether that is magic or a memory of an ordinary flood dressed up over ten thousand years is a question the sources cannot settle. What the map shows is that the Arm is broken and the Neck is a swamp, and both of them happen to sit exactly where an army would have to cross.",
      ] },
      { h: "Where they went", paras: [
        "They did not vanish in one generation. They were pushed, and then pushed further, and the pushing took so long that each generation of men could reasonably believe the children had always been a story. By the coming of the Andals they were gone from the south; by the Conquest they were a thing the North still half-believed in and the south laughed at; by the end of this chronicle there are perhaps a few dozen left, in a cave beyond the Wall, keeping a very old promise.",
      ] },
    ],
    links: [
      ["The Children & the Others", "#group=old-ones"],
      ["The Isle of Faces", "#loc=the-isle-of-faces"],
      ["The peoples of the world", "#cat=peoples"],
    ],
  },

  "dawn-firstmen": {
    paras: [
      "The First Men came out of Essos on foot, across a land bridge where the Stepstones and the broken Arm of Dorne are now, and they came for the same reason people have always moved: there was better land on the other side. They brought bronze, leather, horses and dogs, and they brought the habit of clearing ground — which is what actually started the war. To a farmer a forest is an obstacle. To the people already living in it, it was everything.",
      "The killing was not a campaign; it was two thousand years of a frontier moving slowly north and west, with atrocities on both sides that the songs are very selective about. Men cut down weirwoods, which to the children was not deforestation but murder. The children answered from cover, at night, with poisoned arrows and worse, which is why the First Men's own stories are full of things in the dark that hate you.",
      "Then the Arm broke. The songs say the greenseers gathered on Cape Wrath and called down the Hammer of the Waters, and the sea came through and the bridge was gone, and every man already in Westeros was in Westeros for good. It is the first time in this history that somebody breaks the world to win an argument, and it did not even work: enough men had crossed already.",
    ],
    sections: [
      { h: "What the First Men left behind", paras: [
        "They are the reason half the map is named the way it is. The runes on the barrows, the ringforts, the ancient dyke-and-ditch works that later lords built castles on top of — all theirs. So is the oldest law in Westeros, guest right, which they carried in with them and which is still the only rule in this story that everyone claims to keep and everyone is horrified to see broken.",
        "Their blood is thickest north of the Neck and in the mountains of the Vale, thinner in the Reach and the riverlands where the Andals settled hardest, and mixed everywhere. A southron lord who calls himself of the blood of the First Men is usually making a point about how old his line is. A northern lord saying the same thing is simply stating where he is from.",
      ] },
    ],
    links: [
      ["The First Men", "#people=first-men"],
      ["The Neck", "#loc=the-neck"],
      ["Dorne", "#house=martell"],
    ],
  },

  "dawn-pact": {
    paras: [
      "After some two thousand years of a war neither side could finish, the two peoples met on an island in the middle of a great lake at the centre of the country and made a bargain. Men would keep the open land — the fields, the coasts, the river valleys — and the children would keep the deep woods, and neither would take from the other. Every weirwood on the island was given a face so that the old gods, who were the children's gods, could witness it.",
      "That the meeting happened on an island is worth noticing. Neither party could be ambushed there and neither could bring an army, which suggests two exhausted peoples who had learned exactly how much to trust each other. The order of green men said to keep the island afterward is either a real priesthood or the way a later age explained why nobody farms good land in the middle of a lake.",
      "What follows is called the Age of Heroes, and it lasts four thousand years, which should tell you how little of it is history. It is the age of Bran the Builder, Lann the Clever, Garth Greenhand, Durran Godsgrief, the Grey King and Symeon Star-Eyes: names that every great house in Westeros descends from and that no maester can date within a millennium. The Citadel's private view is that most of them are titles worn by a dozen men each, or by nobody.",
    ],
    sections: [
      { h: "A peace that held, and then did not", paras: [
        "The Pact was kept for a long time by the standards of anything else in this chronicle — long enough that men and children fought side by side when something worse came out of the north. But the terms favoured whoever was growing, and it was men who were growing. The deep woods shrank a field at a time, without any treaty being broken in a way a maester could point at, which is how most agreements between an expanding people and a shrinking one end.",
        "The chronicle's map keeps the children's woods painted after the Pact for exactly this reason. Show the continent as one colour the moment the bargain is struck and you have told the reader the opposite of what the bargain said.",
      ] },
    ],
    links: [
      ["The Isle of Faces", "#loc=the-isle-of-faces"],
      ["The Gods Eye", "#loc=the-gods-eye"],
      ["The Children of the Forest", "#group=old-ones"],
    ],
  },

  "dawn-longnight": {
    paras: [
      "A winter came that did not end. The accounts agree on that and on almost nothing else. For a generation — the number is always a generation, which is how oral history says a very long time — the sun failed, the crops died, and famine did what famine does. Then, out of the farthest north, came the thing the stories have never had a settled name for: cold that moved with intent, and the dead getting up to walk behind it.",
      "The reason to take the Long Night seriously is not any single source but the number of unrelated ones. Westeros remembers it. The Rhoynar sang of a winter that froze their river to its bed. Yi Ti dates a whole dynasty's collapse to a darkness in the east. Asshai has its own version, older and worse. Stories drift, but a story that turns up independently in a dozen languages usually happened to somebody.",
      "How it ended is where the tellings scatter completely. The North has a Last Hero who went into the dead lands with twelve companions, a horse, a dog and a sword that froze and broke, and lost all of them before he found what he was looking for. Others tell of a battle for the dawn, or of a blade of dragonsteel, or of a woman with a monkey's tail, depending on who is singing. What every version keeps is the shape: everything was nearly lost, and something small and specific saved it.",
    ],
    sections: [
      { h: "The part everyone forgot", paras: [
        "The most consequential thing about the Long Night is not that it happened but that it was allowed to become a bedtime story. Eight thousand years is long enough for a real enemy to turn into a figure of speech. By the time this chronicle reaches its final century, the men whose whole institutional purpose was to watch for a second one had been reduced to a thousand thieves and poachers on a wall, and the lords of the realm considered the whole business a quaint northern superstition and resented paying for it.",
        "That is not stupidity. It is the ordinary working of memory over eighty centuries, and it is the closest thing this history has to a moral.",
      ] },
    ],
    links: [
      ["The Others", "#group=old-ones"],
      ["The return of the Long Night", "#prophecy=long-night-return"],
      ["The Wall", "#loc=the-wall"],
    ],
  },

  "dawn-wall": {
    paras: [
      "When the dark lifted, somebody built a wall. Seven hundred feet of ice across three hundred miles of the continent's narrowest point, and eight thousand years later it was still standing and still the largest structure made by men anywhere in the world. The songs give it to Bran the Builder, and give him Winterfell and Storm's End and a hand in the Hightower besides, which is a great deal of work for one lifetime and tells you what kind of name Bran the Builder is.",
      "The maesters who have looked at it closely are careful to say that the Wall is not simply piled ice. Something holds it. Whatever that something is, it is old, it is not written down anywhere, and the order sworn to hold the Wall stopped being able to explain it a very long time before the end.",
      "The Night's Watch was founded to man it, and took a vow with no term in it: no crown, no lands, no wife, no children, and no leaving. That vow was then kept, more or less, for eighty centuries. There is nothing else in this chronicle that lasted a tenth as long.",
    ],
    sections: [
      { h: "The people on the wrong side", paras: [
        "A wall drawn across a continent decides who is inside it. The men left north of the ice were the same people as the men left south of it — same blood, same gods, same hard country — and within a few generations the two halves had stopped recognising each other. The ones inside called the ones outside wildlings. The ones outside called themselves free folk and have declined to kneel for eight thousand years, which is a long time to keep making the same point.",
        "The Gift was granted later, a band of land south of the Wall to feed the garrison, and doubled centuries after that by a queen who visited and was appalled by what she found. By the last century both halves of it were mostly empty, because a farm within a raider's ride of the Wall is not a farm anyone keeps.",
      ] },
    ],
    links: [
      ["The Wall", "#loc=the-wall"],
      ["The Night's Watch", "#group=nights-watch"],
      ["Castle Black", "#loc=castle-black"],
    ],
  },

  "dawn-nightsking": {
    paras: [
      "The thirteenth Lord Commander of the Night's Watch has no name. That is the point of the story: whatever he was called was struck out of every record the North could reach, and the erasure is the only part of it that can be verified, because there is indeed a gap where a name should be.",
      "The tale as the North tells it: he saw a woman on the Wall with skin like the moon and eyes like blue stars, and he chased her, and he caught her, and giving her his seed he gave her his soul. He brought her back to the Nightfort, declared himself a king and her his queen, and ruled there thirteen years while the Watch did things no one afterward would write down. It ended when a King-beyond-the-Wall and a Stark of Winterfell — enemies, working together, which is the detail that makes the story feel true — came at the Nightfort from both sides and pulled it down.",
      "Old Nan told it as a Stark, and the maesters note that a story in which a Stark saves the world from a Watch gone bad is a very convenient story for the Starks. That does not make it false. It makes it a story with an interest.",
    ],
    sections: [
      { h: "Why it matters more than it should", paras: [
        "Strip out the horror and what is left is an institutional warning: the order that guards the realm can be turned, and the thing it guards against can turn it. That the Watch's own histories preserve a version of this at all is remarkable, and the vow every recruit still speaks — the shield that guards the realms of men — reads differently once you know that one Lord Commander stopped being a shield and became something else.",
      ] },
    ],
    links: [
      ["The Night's Watch", "#group=nights-watch"],
      ["The return of the Long Night", "#prophecy=long-night-return"],
      ["The Others", "#group=old-ones"],
    ],
  },

  "dawn-andals": {
    paras: [
      "The Andals crossed the narrow sea in ships, in waves, over a period the maesters cannot agree on to within four thousand years. Their own account is that the Seven told them to go. The Citadel's account is that they were being pushed from behind by the growth of Valyria, and that men fleeing dragons will tell themselves they were called rather than driven.",
      "They landed in the Vale first and worked outward. What they had that the First Men did not was iron, and what they had that mattered more was a faith with an organisation behind it. Where the sword failed the septons arrived, and where both failed the Andals simply married the daughters of the men they could not beat, which within three generations produced lords who were Andal by blood and First Men by descent and saw no contradiction in it.",
      "The Neck stopped them. Bog, fever, crannogmen who fought from water, and a causeway with Moat Cailin sitting on it: an invading host could take the North only by going through a swamp defended by people who knew it, and none of them managed it. So the line held at the Neck, and it is still there — the Faith of the Seven to the south of it, the old gods to the north, the same border eight thousand years later.",
    ],
    sections: [
      { h: "The gift nobody credits them for", paras: [
        "The Andals brought writing that could carry a sentence. First Men runes could record a name and a claim; Andal script could record an argument, a grievance, a tally, a story. Almost everything in this chronicle before their arrival is a song, and almost everything after it is a document, and the difference is entirely theirs.",
        "They also brought the seven-pointed star, cut into their own flesh on landing, and with it the idea that a faith might have opinions about who should be king — a notion the realm would find extremely expensive twice over, once under Maegor and once at the end.",
      ] },
    ],
    links: [
      ["The Andals", "#people=andals"],
      ["The Faith of the Seven", "#group=faith"],
      ["House Arryn", "#house=arryn"],
    ],
  },
});
