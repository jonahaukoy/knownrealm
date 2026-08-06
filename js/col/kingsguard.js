/* kingsguard — part of THE COLLECTIONS (see js/col/README-shape.txt).
   Every word here is original to this site. Nothing copied from any wiki. */

(window.COLLECTIONS = window.COLLECTIONS || []).push(
{
  id: "kingsguard", route: "kg", label: "The Kingsguard", glyph: "&#128737;",
  sub: (n) => "the white cloaks — " + n + " sworn brothers of note",
  intro: "Seven knights, chosen for life, sworn to guard the king with their bodies and keep his secrets. They hold no lands, take no wives, father no children, and inherit nothing — the whole design is to leave a man with nothing in the world but the vow. It works exactly as well as any system that depends on the king being worth dying for. The order has produced the finest knights in Westerosi history and some of its worst men, quite often in the same seven.",
  extra: "<a class=\"wk-bigbtn\" href=\"whitebook.html\">&#128737; Open the White Book &mdash; every sworn brother, page by page &rarr;</a>",
  items: [
    { id: "the-order", name: "The Order Itself", sub: "Founded by Visenya Targaryen",
      meta: [["Founded", "Early in Aegon I's reign"], ["Strength", "Seven, always"], ["Term", "For life"]],
      blurb: "Visenya's invention: seven knights with nothing to lose and no way out.",
      paras: [
        "The story goes that Visenya Targaryen drew a blade on her own brother in the street to prove that his guards could not protect him, and then designed the remedy. The White Book records every man who has ever worn the cloak — a few lines each, written by their brothers, and by far the most honest history in the Red Keep.",
        "The order's central problem is written into its vow: it swears obedience to the king, not to the realm, and not to any idea of goodness. What a Kingsguard does when those come apart is a question the books return to again and again, and every knight below answers it differently.",
      ] },

    { id: "barristan-selmy", wb: "barristan-selmy", name: "Ser Barristan Selmy", sub: "Barristan the Bold",
      meta: [["Served", "Jaehaerys II, Aerys II, Robert I, Daenerys"], ["Rank", "Lord Commander"]],
      blurb: "The finest knight of his generation, and the one who kept the vow longest and paid most for it.",
      paras: [
        "Barristan won a tourney as a boy in borrowed armour, cut his way into Duskendale alone to save a king who did not deserve it, and served three kings without a stain on him. His tragedy is that he served well through the Mad King's whole reign and only ever asked himself afterwards whether serving well had been the right thing at all.",
        "Dismissed by Joffrey with a sneer, he crossed the world to serve a Targaryen queen and finally got to be what he had always claimed to be: an old knight advising a young ruler to be better.",
      ] },

    { id: "arthur-dayne", wb: "arthur-dayne", name: "Ser Arthur Dayne", sub: "The Sword of the Morning",
      meta: [["Served", "Aerys II"], ["Blade", "Dawn, forged from a fallen star"]],
      blurb: "By common agreement the greatest swordsman anyone in the story ever saw.",
      paras: [
        "Arthur Dayne carried Dawn — not Valyrian steel but something rarer, pale as milkglass and forged from the heart of a fallen star, which only a Dayne judged worthy may wield. Every knight in the books who met him says the same thing: he was the best, and he was also decent, which is a rarer combination than the songs pretend.",
      ],
      fate: ["He died at the tower in the Dornish marches, three Kingsguard against seven northmen, in a fight only two men walked away from. That the finest knight in the realm was standing guard over a tower instead of at his king's side during a rebellion is the loudest unanswered question in the backstory — and the answer is upstairs."] },

    { id: "gerold-hightower", wb: "gerold-hightower", name: "Ser Gerold Hightower", sub: "The White Bull",
      meta: [["Served", "Aerys II"], ["Rank", "Lord Commander"]],
      blurb: "The Lord Commander who watched the Mad King burn men alive and did nothing, because the vow said nothing.",
      paras: [
        "The White Bull is the order's hardest case. He was brave, dutiful and entirely without corruption — and he stood in the throne room while Rickard Stark cooked in his own armour, on the grounds that a Kingsguard does not judge his king. Jaime Lannister's whole bitter worldview is built on having watched him do it.",
      ],
      fate: ["He died at the tower of joy alongside Arthur Dayne and Oswell Whent, still guarding whatever they had been ordered to guard."] },

    { id: "jaime-lannister", wb: "jaime-lannister-kg", name: "Ser Jaime Lannister", sub: "The Kingslayer",
      meta: [["Served", "Aerys II, Robert I, Joffrey, Tommen"], ["Rank", "Lord Commander"]],
      blurb: "The youngest man ever to wear the white cloak, and the one who broke the vow to save half a million people.",
      paras: [
        "Jaime put his sword through Aerys Targaryen to stop him burning King's Landing to the ground with wildfire, and then spent seventeen years being called Kingslayer by people who never asked why. He does not explain himself, partly from pride and partly because he learned early that the honourable thing and the right thing had already been separated for him.",
        "His pages in the White Book are famously nearly blank — a young man's brilliant beginning and then nothing. Filling them is the thing he actually wants, underneath everything else.",
      ] },

    { id: "duncan-the-tall", wb: "duncan-the-tall", name: "Ser Duncan the Tall", sub: "The hedge knight who rose",
      meta: [["Served", "Aegon V"], ["Rank", "Lord Commander"]],
      blurb: "From a Flea Bottom gutter to Lord Commander of the Kingsguard — the order's best argument for itself.",
      paras: [
        "Dunk was raised out of the worst part of King's Landing by an old hedge knight, learned chivalry as a thing you do rather than a thing you inherit, and ended up commanding the finest knights in the realm for the boy who had once been his squire. He is enormous, slow-thinking, painfully honest, and the moral centre of every story he appears in.",
      ],
      fate: ["Ser Duncan died at Summerhall with his king, in a fire nobody has ever fully explained. The White Book entry for him is said to be one of the longest in the volume."] },

    { id: "aemon-dragonknight", wb: "aemon-dragonknight", name: "Prince Aemon Targaryen", sub: "The Dragonknight",
      meta: [["Served", "Aegon IV"], ["Rank", "Lord Commander"], ["Era", "The century before the Blackfyres"]],
      blurb: "A prince of the blood who took the white cloak, and then spent his life guarding a brother worth none of it.",
      paras: [
        "Aemon had no need of the Kingsguard. He was a king's son, in line for lands and a wife and everything the vow takes away, and he swore it anyway — which is either the purest act in the order's history or the most wasteful, and the singers have never quite decided.",
        "The cruelty of it is the pairing. He was, by every account, the finest knight of his generation and a genuinely good man, and the king he was sworn to defend with his body was his own brother Aegon the Unworthy, who spent a long reign proving that a Kingsguard's vow makes no distinction between a king worth dying for and a king who is not. Aemon kept it anyway. Three centuries later Jaime Lannister is still measuring himself against him and coming up short.",
      ] },

    { id: "criston-cole", wb: "criston-cole", name: "Ser Criston Cole", sub: "The Kingmaker",
      meta: [["Served", "Viserys I, Aegon II"], ["Era", "The Dance"]],
      blurb: "The lowborn knight whose wounded pride helped start a civil war.",
      paras: [
        "Cole was a marcher lord's son with nothing but skill, made Kingsguard on merit and then — depending on which account you believe — either refused Rhaenyra or was refused by her. What is not in doubt is that he turned on her completely, put the crown on Aegon II's head, and became the greens' sword. The Dance has many causes; a slighted man in a white cloak is one of them.",
      ] },

    { id: "cargyll-twins", wb: "erryk-cargyll", name: "Ser Erryk & Ser Arryk Cargyll", sub: "The brothers who chose opposite sides",
      meta: [["Served", "Viserys I, then one each"], ["Era", "The Dance"]],
      blurb: "Identical twins in white cloaks who ended up on opposite sides of the Dance.",
      paras: [
        "The Cargylls were so alike that even their brothers could not always tell them apart, and when the realm split, one went with the blacks and one with the greens. Their duel — two men with identical faces and identical training trying to kill each other — is the Dance's whole tragedy compressed into one room, and the chroniclers say they wept while they did it.",
      ] },

    { id: "brienne-of-tarth", wb: "brienne-tarth", name: "Ser Brienne of Tarth", sub: "The first woman of the Kingsguard",
      meta: [["Served", "Renly (Rainbow Guard), later the Kingsguard"], ["Blade", "Oathkeeper"]],
      blurb: "Mocked her entire life for wanting to be a knight, and ends up writing the definitive entry in the White Book.",
      paras: [
        "Brienne is what happens when someone takes the songs completely seriously in a world that does not. She is laughed at, called a freak, and repeatedly proves to be the only person in the room who will actually keep a promise at cost to herself.",
        "That she is finally knighted at all — by Jaime Lannister, by firelight, on the eve of a battle everyone expects to lose — is one of the few unambiguously good things the story allows anyone.",
      ] },

    { id: "meryn-trant", wb: "meryn-trant", name: "Ser Meryn Trant", sub: "The obedient one",
      meta: [["Served", "Robert I, Joffrey, Tommen"]],
      blurb: "A competent swordsman who used a white cloak as cover for beating children on command.",
      paras: [
        "Trant is the order at its worst: a knight who understood the vow as permission. Ordered to strike Sansa Stark, he struck her, and enjoyed it. He is a deliberate contrast to Barristan — the same oath, the same cloak, and nothing behind it.",
      ],
      fate: ["He was killed in a Braavosi brothel by a blind girl he had never thought worth remembering — the second name crossed off a list he had helped create."] },

    { id: "sandor-clegane-note", wb: "mandon-moore", name: "Ser Mandon Moore", sub: "The knight with dead eyes",
      meta: [["Served", "Robert I, Joffrey"]],
      blurb: "A Kingsguard who tried to murder the Hand he was sworn to protect, in the middle of a battle.",
      paras: [
        "Moore is remembered chiefly for the moment he turned on Tyrion Lannister during the Blackwater and very nearly took his face off. Nobody ever satisfactorily establishes who told him to do it, which is itself the point: a white cloak is only as trustworthy as whoever is paying the man inside it.",
      ] },

    { id: "gregor-clegane", wb: "robert-strong", name: "Ser Gregor Clegane", sub: "The Mountain That Rides",
      meta: [["Served", "Tommen (as Robert Strong)"]],
      blurb: "A war criminal in plate armour, given a white cloak because a queen needed a champion.",
      paras: [
        "The Mountain's inclusion here is the order's final indignity. A man notorious for the sack of King's Landing and for atrocities that even his own side would not name aloud is made a sworn brother — silent, helmed, and never eating or sleeping — purely because Cersei Lannister required something that could win a trial by combat.",
      ] },

    { id: "loras-tyrell", wb: "loras-tyrell", name: "Ser Loras Tyrell", sub: "The Knight of Flowers",
      meta: [["Served", "Renly (Rainbow Guard), then Tommen"]],
      blurb: "The realm's darling in the lists, who took the white cloak to get out of a marriage and into a war.",
      paras: [
        "Loras was the most celebrated young tourney knight of his day — beautiful, showy, and better than he looked. His grief after Renly Baratheon's death is one of the more quietly handled things in the story, and his decision to take a vow that forbids marriage is not unrelated to it.",
      ] },

    { id: "lewyn-martell", wb: "lewyn-martell", name: "Prince Lewyn Martell", sub: "The Dornishman in white",
      meta: [["Served", "Aerys II"], ["Died", "The Trident"]],
      blurb: "The Kingsguard who commanded the Dornish spears at the Trident.",
      paras: [
        "Lewyn was Elia Martell's uncle, a Kingsguard serving a king who was holding his niece and her children hostage in all but name. He led the Dornish host at the Trident anyway and died there — a man keeping a vow to an institution that had already stopped deserving it.",
      ] },
  ],
}
);
