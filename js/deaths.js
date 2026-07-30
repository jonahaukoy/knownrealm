/* THE KNOWN WORLD — the fallen, and the manner of their falling.
   DEATH_TALES holds a brief telling of each death (the show's telling). These are
   SPOILERS by nature: the app only ever shows them once the chosen episode/chapter
   is at or past the character's recorded death — never before.
   MAIN_CHARS is the short roll of principal players for the map's "main players only"
   people filter. deathSiteFor(name) finds where a death pin belongs: the last known
   place on the character's whereabouts timeline at the point of death. */

const MAIN_CHARS = new Set([
  "Eddard Stark", "Catelyn Stark", "Robb Stark", "Sansa Stark", "Arya Stark", "Bran Stark",
  "Rickon Stark", "Jon Snow", "Benjen Stark", "Hodor", "Talisa Stark",
  "Tyrion Lannister", "Cersei Lannister", "Jaime Lannister", "Tywin Lannister",
  "Joffrey Baratheon", "Tommen Baratheon", "Myrcella Baratheon",
  "Robert Baratheon", "Stannis Baratheon", "Renly Baratheon", "Gendry",
  "Davos Seaworth", "Melisandre", "Shireen Baratheon",
  "Daenerys Targaryen", "Viserys Targaryen", "Khal Drogo", "Jorah Mormont",
  "Barristan Selmy", "Missandei", "Grey Worm", "Daario Naharis",
  "Theon Greyjoy", "Yara Greyjoy", "Euron Greyjoy", "Balon Greyjoy",
  "Petyr Baelish", "Varys", "Sandor Clegane", "Gregor Clegane",
  "Brienne of Tarth", "Bronn", "Podrick Payne", "Samwell Tarly", "Gilly",
  "Jeor Mormont", "Ygritte", "Tormund Giantsbane", "Mance Rayder",
  "Ramsay Bolton", "Roose Bolton", "Walder Frey",
  "Margaery Tyrell", "Olenna Tyrell", "Loras Tyrell", "Oberyn Martell", "Ellaria Sand",
  "The High Sparrow", "Beric Dondarrion", "The Night King", "Jaqen H'ghar", "Lysa Arryn",
  // principals of the books' telling (hidden in show lore by inLore)
  "Asha Greyjoy", "Victarion Greyjoy", "Arianne Martell", "Quentyn Martell",
  "Jon Connington", "Aegon Targaryen", "Jeyne Westerling", "Val",
]);

/* where a death pin belongs when the whereabouts timeline can't say */
const DEATH_SITE_OVERRIDES = {
  "Jon Arryn": "kings-landing",
};

const DEATH_TALES = {
  // ---------------- Season One ----------------
  "Will of the Night's Watch": "Fled south from the massacre at the ranging camp and was taken as a deserter near Winterfell. Lord Eddard Stark heard his last words about white shadows in the wood, and swung the sword himself, as the old way demands.",
  "Ser Waymar Royce": "Led his first ranging into the haunted forest with a lordling's confidence and met the Others in the dark. He crossed swords with a White Walker, died for it, and rose again with eyes of blue.",
  "Gared": "The oldest hand on the doomed ranging, he saw what the cold had done and ran. The Wall punishes desertion with the block, and near Winterfell it found him.",
  "Jon Arryn": "The Hand of the King died suddenly of a burning fever, quick as a candle snuffed — and half the realm's troubles begin with that bed. He spent his last strength whispering 'the seed is strong,' having learned a truth about the royal children that could not be allowed to live.",
  "Mycah, the butcher's boy": "Arya's friend played at swords with a princess by the Trident and paid a prince's grudge for it. The Hound rode him down on the kingsroad; his father was given the body.",
  "Jory Cassel": "Winterfell's captain of guards followed his lord south and stood with him in the streets of King's Landing when Jaime Lannister came for a reckoning. He died with a dagger through the eye, defending Ned to the last.",
  "Vardis Egen": "Lysa Arryn's household knight was named her champion in Tyrion's trial by combat at the Eyrie. Bronn wore him down in his heavy plate, opened his throat, and sent him out the Moon Door.",
  "Viserys Targaryen": "The beggar king demanded his golden crown at swordpoint in Vaes Dothrak, where no blade may be drawn. Khal Drogo gave him one: molten gold, poured over his head. He was no dragon — fire cannot kill a dragon.",
  "Robert Baratheon": "The king hunted boar in the kingswood, sodden with wine his squire kept pouring, and the boar won. He died in the Red Keep naming Ned Stark Protector of the Realm — a testament altered and betrayed before the body cooled.",
  "Syrio Forel": "The First Sword of Braavos faced Ser Meryn Trant and five Lannister guardsmen with a wooden practice blade so Arya could run. What do we say to the god of death? Not today. He was never seen again.",
  "Septa Mordane": "When the Stark household was put to the sword she sent Sansa running and stood her ground on the steps of the sept. Her head ended on the walls beside her lord's — loyal service, cruelly repaid.",
  "Vayon Poole": "Winterfell's steward followed Lord Stark to King's Landing and died with the rest of the household when the Lannisters struck, cut down in the purge that spared almost no one wearing grey.",
  "Eddard Stark": "He confessed a treason he never committed on the steps of the Great Sept of Baelor, to buy his daughters' lives. Joffrey wanted a head anyway, and Ice — his own greatsword — came down before Sansa's eyes while Arya watched from a statue's plinth.",
  "Torrhen Karstark": "Rode in Robb's van into the Whispering Wood, where the Kingslayer was taken. Jaime Lannister cut him down sword in hand, a Karstark son spent for a Lannister prisoner — a price his father never forgave.",
  "Qotho": "Drogo's bloodrider raged against the maegi's sorcery and drew on Ser Jorah outside the khal's tent. The knight's steel settled it; the bloodrider died before his khal did.",
  "Khal Drogo": "A cut taken in a brawl of honor festered, and the maegi Mirri Maz Duur 'healed' him into a breathing husk — only death pays for life, and the life was his. Daenerys pressed a cushion to his face as a mercy, and burned him on a great pyre in the grass.",
  "Mirri Maz Duur": "The godswife traded Drogo's life for the life of Daenerys's unborn son and called it justice for her burned temple. Daenerys bound her to the khal's funeral pyre, and she sang her death song until the fire took the tune.",

  // ---------------- Season Two ----------------
  "Rakharo": "Sent to scout the red waste for the starving khalasar, he met a rival khal's riders. His horse came back with his head in a saddlebag and his braid cut — a Dothraki's deepest shame.",
  "Yoren": "The Watch's crusty recruiter died at the burning holdfast on the kingsroad, refusing to yield Robert's bastard to the gold cloaks. He took an axe and kept swinging until Ser Amory Lorch's men finished him.",
  "Lommy Greenhands": "A dyer's apprentice bound for the Wall, too lame to walk after the ambush on Yoren's column. Polliver asked if he could walk, then put Needle through his throat and carried the sword away.",
  "Renly Baratheon": "He crowned himself with a hundred thousand swords at his back, and none of them could guard him from what Melisandre birthed in the cave beneath Storm's End. A shadow with Stannis's face put a blade through his heart in his own tent.",
  "Irri": "Daenerys's gentle handmaid was strangled in Qarth when the dragons were stolen, killed in her khaleesi's chambers by a Dothraki who had sold himself to Xaro's coup.",
  "The High Septon": "He blessed Joffrey's procession on the day the starving city finally broke. The mob tore the crystal-crowned old man limb from limb in the streets, and the riot swallowed the rest of the afternoon.",
  "Rodrik Cassel": "Winterfell's old master-at-arms rode home into Theon's occupation and spat at his former ward. Theon's first execution was botched and butcherly — it took four strokes and a kick — but Ser Rodrik died as unbending as he lived.",
  "Matthos Seaworth": "Davos's devout son sailed beside his father into Blackwater Bay, sure the Lord of Light would deliver the city. The wildfire took his ship whole; the smuggler's luck that saved Davos found nothing of Matthos.",
  "Mandon Moore": "In the chaos of the Blackwater the white knight turned on the man he was sworn to guard and opened Tyrion's face to the bone. Podrick Payne drove a spear through him before the second cut fell — on whose gold, no one ever proved.",
  "Qhorin Halfhand": "Captured with Jon in the Skirling Pass, he ordered the boy to do the one thing that would buy the free folk's trust. He goaded Jon into the fight and died on his sword — a ranger spending his own life like a coin, for the Watch.",
  "Doreah": "The Lysene handmaid sold her mistress to Xaro Xhoan Daxos for a place in his bed. Daenerys found them together after the House of the Undying burned, and sealed them both alive in his empty vault.",
  "Xaro Xhoan Daxos": "The self-made merchant prince of Qarth bet everything on a coup and a stolen queen. His famous vault proved empty as his promises, and Daenerys locked him inside it with her traitor handmaid for company.",
  "Maester Luwin": "Speared by ironborn in Winterfell's godswood during the sack. He lived long enough to counsel the boys he'd raised one last time, and asked Osha for the mercy of a quick end beneath the heart tree.",

  // ---------------- Season Three ----------------
  "Hoster Tully": "The old Lord of Riverrun died abed of the long sickness while the war he never wanted burned across his rivers. His funeral boat carried him down the Tumblestone with fire arrows for a farewell — the third of them, at last, well shot.",
  "Jeor Mormont": "The Old Bear held the shattered remnant of his ranging together as far as Craster's Keep, and there his own starving brothers turned their knives. He died with a mutineer in his fists, urging Sam to reach the Wall with word of what was coming.",
  "Craster": "The wildling who wed his daughters and gave his sons to the cold gods called the Night's Watch guests and starved them. Karl Tanner put a knife through his mouth at his own board, and the Keep's grim hospitality ended with him.",
  "Rickard Karstark": "He butchered two captive Lannister boys in their cell to answer his sons' deaths, and dared his king to do something about it. Robb Stark took his head at Riverrun with his own hand — justice that cost him half his army.",
  "Ros": "The clever girl from the Winterfell brothel rose all the way into Littlefinger's confidence, and Varys's. When Baelish found the leak he gave her to Joffrey, who ended her with a crossbow in the Red Keep.",
  "Orell": "The eagle-warg fought Jon Snow at the Queenscrown tower when the raiding party turned on him. Jon's sword ended the man; his last act was to fly his eagle at Jon's face and mark him for life.",
  "Mero": "The Titan's Bastard drank, spat, and plotted to murder the dragon queen he was paid to fight. Daario Naharis chose a different employer and delivered his captains' heads to Daenerys's feet.",
  "Prendahl na Ghezn": "The Ghiscari captain of the Second Sons ordered Daario to kill Daenerys. Daario answered by bringing Prendahl's head to her tent instead, an offering from the company's new commander.",
  "Kraznys mo Nakloz": "The Good Master of Astapor traded eight thousand Unsullied for a dragon, sneering in Valyrian at the queen he assumed could not understand him. She understood every word. Dracarys.",
  "Talisa Stark": "The healer from Volantis who married a king for love came to the Twins carrying his child. The Freys' knives found her belly first when the Rains of Castamere began to play.",
  "Robb Stark": "The Young Wolf broke a marriage pact with Walder Frey, and the old man's revenge was a wedding. Under guest right, with the doors barred, Roose Bolton drove the blade home: 'The Lannisters send their regards.'",
  "Catelyn Stark": "She watched her firstborn murdered under a roof that had sworn them safety, with the Frey wife she'd bargained for standing witness. She opened Lady Frey's throat as her last act, and Black Walder opened hers.",

  // ---------------- Season Four ----------------
  "Joffrey Baratheon": "The boy king was poisoned with the Strangler at his own wedding feast, purpling and clawing in his mother's arms. The Queen of Thorns and Littlefinger had arranged it between them; Tyrion was handed the blame and Sansa the escape.",
  "Karl Tanner": "The mutineers' 'fookin' legend of Gin Alley' ruled Craster's Keep on rum and cruelty until the Watch came back for its own. Jon Snow fought him hand to hand, and a daughter of Craster's put the final knife in his back.",
  "Rast": "The whining mutineer who stabbed the Old Bear ran when the Watch retook Craster's Keep. He got as far as the treeline, where Ghost had been waiting a long time to see him again.",
  "Lysa Arryn": "The Lady of the Vale confessed she'd poisoned her own husband at Littlefinger's word, and threatened Sansa at the Moon Door in a jealous fury. Petyr calmed her, kissed her once — 'I have only loved one woman' — and pushed her through it.",
  "Oberyn Martell": "The Red Viper danced circles around the Mountain in Tyrion's trial by combat, demanding a confession for his sister Elia. He got the confession — with Gregor's thumbs in his eyes and his skull bursting in the Mountain's fists.",
  "Grenn": "Held the inner gate of Castle Black with five brothers against a giant of the free folk. The gate held. None of the six stood up afterward; they said the words as they died.",
  "Pyp": "The mummer's boy who could never shoot took Ygritte's arrow through the throat in the battle for Castle Black, and died in Sam's arms with the fight still roaring around them.",
  "Styr": "The Magnar of Thenn, scarred and earless, met Jon Snow in the yard of Castle Black when the wildlings breached the gate. He nearly beat Jon to death before taking a smith's hammer through the skull.",
  "Ygritte": "The girl kissed by fire drew her bow on Jon Snow in the burning yard of Castle Black and hesitated — and a boy from a village she'd raided didn't. She died in Jon's arms: 'We should have stayed in that cave.'",
  "Jojen Reed": "The boy who dreamed the future knew he would not survive the journey north, and went anyway. Wights dragged him down within sight of the three-eyed raven's cave; his sister gave him mercy, and the children's fire took the rest.",
  "Shae": "Tyrion's lover bore false witness at his trial and was found in his father's bed. She reached for a knife when he found her there, and Tyrion strangled her with the golden chain she wore — the Hand's chain.",
  "Tywin Lannister": "The great lion died on the privy in the Tower of the Hand, shot twice with a crossbow by the dwarf son he'd sentenced to death. He went insisting to the end that Tyrion was no son of his. A Lannister's debt, paid in full.",

  // ---------------- Season Five ----------------
  "Mance Rayder": "The King-Beyond-the-Wall refused the knee to Stannis and was bound to a pyre before the whole watching Wall. Jon Snow's arrow found his heart before the fire could claim its due — the last kindness between enemies.",
  "Janos Slynt": "The former commander of the gold cloaks, who sold Ned Stark and butchered Robert's bastards, refused a direct order from the new Lord Commander. Jon Snow took his head in the yard himself. 'I was afraid. I've always been afraid.'",
  "Barristan Selmy": "Barristan the Bold, the finest sword of his age, died in a Meereenese alley with a dozen Sons of the Harpy dead around him. He fell defending the city of a queen he'd crossed the world to serve.",
  "Maester Aemon": "Aemon Targaryen, maester of the Watch for sixty-seven years, died old and blind and gentle in his bed at Castle Black, laughing with his brother Egg in his last dreams. 'And now his watch is ended.'",
  "Karsi": "The free folk chieftain put her daughters on the boats at Hardhome first, then stood in the shield line when the dead came over the palisade. A ring of dead children brought her spear down — she couldn't strike them — and she rose again with the rest.",
  "Rattleshirt": "The Lord of Bones sneered one taunt too many at Tormund in front of the free folk gathered at Hardhome. Tormund took his own staff off him and beat him dead with it, then asked for the crowd's next objection.",
  "Hizdahr zo Loraq": "The nobleman who preached patience and married a queen to buy peace was knifed in the fighting pits by the very Sons of the Harpy he was thought to lead. The peace died in the same hour.",
  "Shireen Baratheon": "The sweetest soul in the story was given to the flames by her own father, in the snows before Winterfell, to buy a thaw and a victory. The Lord of Light took Melisandre's offering and gave Stannis nothing but ashes.",
  "Meryn Trant": "The Kingsguard brute who killed Syrio Forel and beat Sansa on command took his appetites to a Braavosi brothel. A girl with a borrowed face put out both his eyes before she cut his throat — the first name crossed off Arya's list by her own hand.",
  "Selyse Baratheon": "Stannis's queen, who watched her daughter burn and called it the Lord's will, broke before the march reached Winterfell. They found her hanging from a tree in the snow.",
  "Stannis Baratheon": "The last of his army broken before Winterfell's walls, his daughter's ashes behind him, Stannis was found wounded against a tree by Brienne of Tarth. She named her charge — the murder of Renly — and he answered 'Do your duty,' and she did.",
  "Myrcella Baratheon": "Ellaria Sand kissed the princess farewell at Sunspear's docks with poison on her lips. Myrcella died at sea in her father's arms — moments after telling Jaime she knew, and was glad.",

  // ---------------- Season Six ----------------
  "Doran Martell": "The patient Prince of Dorne, who played the long game while his country wanted vengeance, was stabbed in his own gardens by Ellaria Sand as his guards stood by. Weak men will never rule Dorne again, she told him as he bled.",
  "Areo Hotah": "Prince Doran's captain, who missed nothing for decades, was taken from behind with a dagger in the back by Tyene Sand in the very moment his prince was murdered — too quick even to lower his longaxe.",
  "Trystane Martell": "Doran's gentle son was murdered aboard ship in Blackwater Bay by his own cousins, a spear through the back of the head while he painted funeral stones — the Sand Snakes' coup made complete.",
  "Balon Greyjoy": "The Lord Reaper of Pyke met his long-lost brother Euron on a rope bridge in a storm and told him to get off his islands. Euron threw him from the bridge into the sea he'd made his god.",
  "Roose Bolton": "The Lord of the Dreadfort, who put a dagger in his king at the Red Wedding, received the same courtesy from his own bastard at Winterfell — Ramsay's blade in the gut the moment a trueborn heir was announced.",
  "Walda Bolton": "Fat Walda Frey, Roose's young wife, had barely delivered the Bolton heir when Ramsay led her and the newborn to the kennels. He was very much looking forward to meeting his brother, he said, and opened the gates.",
  "Alliser Thorne": "First Ranger, mutineer, and Jon Snow's oldest enemy at the Wall — he led the knives 'for the Watch' and hanged for it when Jon rose again. He went to the rope unbowed: 'I fought, I lost. Now I rest.'",
  "Olly": "The boy whose village Styr's Thenns butchered put the last knife in Jon Snow's heart, and hanged for it beside Thorne when the Lord Commander returned. Jon cut the ropes himself and never spoke of him after.",
  "Osha": "The spearwife who carried Rickon to safety across half the North was handed to the Boltons by the Umbers. She tried the knife-in-the-throat trick that had served her before; Ramsay had heard the story, and his blade was faster.",
  "The Three-Eyed Raven": "The last greenseer, a thousand years in a weirwood throne, kept the world's memory beneath the hill. The Night King touched Bran in a vision and followed the mark home — the old man dissolved into the dark with his work half-finished.",
  "Leaf": "One of the last children of the forest, who made the first White Walker in a desperate age and spent ten thousand years regretting it. She died buying seconds in the tunnel, a fire-bomb in her fist, swallowed by wights.",
  "Hodor": "Wylis the stableboy became Hodor in a single terrible moment threaded backward through time: Bran warged him in the past and present at once, and the boy heard his own death as a command. He held the door. He held it to the end.",
  "The Waif": "The faceless novice who hated the Stark girl hunted her one last time through Braavos — into a black cellar, where a blind girl's training and a single candle-cut ended the game. Her face joined the hall.",
  "Brynden Tully": "The Blackfish retook Riverrun in the war's ashes and refused every demand to yield it. When the siege broke in, the old knight sent Brienne to safety, drew his sword on the castle he was born in, and died as he chose — fighting.",
  "Lem Lemoncloak": "The yellow-cloaked outlaw hanged the villagers of a sept the Hound had come to call home. The Brotherhood gave Sandor Clegane his rope-work as restitution; Lem got the noose he'd earned.",
  "Rickon Stark": "Ramsay's 'game' let the youngest Stark run across the field before Winterfell while arrows fell around him. Jon rode for him; the last arrow was faster. The trap it baited nearly killed the North's whole cause.",
  "Ramsay Bolton": "He lost the Battle of the Bastards, his house, and his hounds' loyalty in a single afternoon. Sansa Stark watched from outside the kennel as the starved beasts he'd raised remembered they were hungry.",
  "Wun Wun": "The last giant of the free folk broke the gate of Winterfell for the Starks and died against its wall, feathered with arrows and bolts, Ramsay's final shaft in his eye. With him went the giants from the world of men.",
  "Grand Maester Pycelle": "The old maester who served five kings and betrayed most of them was lured to Qyburn's cellar and stabbed to death by little birds with little knives — the price of standing between Cersei and her new order.",
  "Lancel Lannister": "The cousin who shared Cersei's bed and then found the Faith followed a child into the tunnels beneath the Great Sept, and crawled with a cut spine toward the candles burning in a lake of wildfire. He was an arm's length short.",
  "The High Sparrow": "The barefoot septon brought queens to their knees and believed the Mother's mercy would shield him from one more. Cersei did not come to her trial; the wildfire came instead, and the Sept of Baelor rose into the sky.",
  "Margaery Tyrell": "The thrice-wed queen read the room the way she always did — she knew Cersei's absence meant death, and tried to empty the sept. The High Sparrow's certainty barred the doors, and the wildfire spared no one, not even the cleverest.",
  "Loras Tyrell": "The Knight of Flowers confessed, was mutilated with the Faith's seven-pointed star, and renounced Highgarden itself — minutes before the sept that broke him burned with him inside it. House Tyrell's future died the same morning.",
  "Mace Tyrell": "The amiable Lord of Highgarden followed his children into the Great Sept for Loras's trial and died with them in Cersei's green fire, the last Lord Tyrell of the old line.",
  "Kevan Lannister": "Tywin's steady brother, Hand to a boy king in a burning city, was in the Great Sept when the caches beneath it caught. All of Cersei's rivals in one building — her uncle counted among the acceptable losses.",
  "Tommen Baratheon": "The gentle boy king watched the Great Sept — and his queen inside it — vanish in green fire from his window. He set down his crown, and stepped quietly out into the air. The last of Cersei's children, as the prophecy promised.",
  "Walder Frey": "The Late Lord Frey dined alone on a pie he found oddly savory, served by a girl whose face was not her own. Arya Stark told him where his sons were before she cut his throat — the North remembers, and so do wolves.",

  // ---------------- Season Seven ----------------
  "Lothar Frey": "Lame Lothar, who planned the Red Wedding's seating and its slaughter, drank Arya Stark's toast at the feast that gathered every Frey man of worth. The wine was poisoned. The Freys' bridge outlived them all.",
  "Black Walder Rivers": "The hardest of Walder's brood, who cut Catelyn Stark's throat, raised his cup with the rest when 'Lord Walder' called the toast. Arya's poison left the women standing and House Frey's swords on the floor.",
  "Olyvar Frey": "One of Lord Walder's numberless sons, gathered in with the rest of the male line for the great toast at the Twins. When the cups were empty, House Frey was done.",
  "Obara Sand": "Oberyn's spear-daughter met Euron's boarding party when his fleet fell on Yara's in the night. He killed her with her own weapon and left her hung from her ship's prow.",
  "Nymeria Sand": "The whip-wielding Sand Snake fought Euron Greyjoy across a burning deck and lost. He strangled her with her own whip and displayed her beside her sister — a message to Dorne.",
  "Tyene Sand": "Captured with her mother and marched through King's Landing, she was given the same poisoned kiss Ellaria gave Myrcella — while Cersei made the mother watch, chained just out of reach, for as long as the light lasted.",
  "Olenna Tyrell": "When Highgarden fell to Jaime Lannister she bargained only for the manner of it: poison in wine, painless, on her own terms. She drank it down and then told Jaime the truth about Joffrey. 'Tell Cersei. I want her to know it was me.'",
  "Randyll Tarly": "Sam's iron father chose Cersei over the queen who beat him at the Blackwater Rush, and refused the knee with his son beside him. Daenerys gave the order; Drogon's fire left two suits of armor in the ash.",
  "Dickon Tarly": "The dutiful heir of Horn Hill stepped forward to share his father's sentence, to Randyll's pride and Sam's grief. Dracarys took the future of House Tarly along with its past.",
  "Thoros of Myr": "The red priest who brought Beric back nineteen times took a wight bear's jaws in the blizzard beyond the Wall, and the cold finished what the claws began. There was no one left to say the words over him.",
  "Benjen Stark": "First Ranger, half-saved by the children's magic after a Walker's touch, he spent his long twilight harrying the dead. He gave Jon his horse at the frozen lake and turned to face the swarm with a burning flail — a Stark's last watch, ended.",
  "Petyr Baelish": "The man who started the whole game — Jon Arryn's poison, the dagger, the letter — was tried in Winterfell's hall by the sisters he'd spent years playing against each other. Sansa passed the sentence; Arya's blade crossed his throat mid-plea.",

  // ---------------- Season Eight ----------------
  "Edd Tollett": "Dolorous Edd, last Lord Commander of the old Night's Watch, died in the Long Night doing exactly what he'd always grumbled he would — saving Samwell Tarly. A wight's blade took him from behind; he rose with the dead before the battle was old.",
  "Lyanna Mormont": "The little bear of Bear Island, ten years old and fiercer than her whole hall, was seized by an undead giant in Winterfell's yard. Crushed in its fist, she drove her dragonglass into its eye with her last strength and killed it as it killed her.",
  "Beric Dondarrion": "The Lord of Light's oft-returned knight spent his last resurrection the way the god apparently always intended: holding a corridor of wights off Arya Stark's back. The flaming sword went out for good, purpose served.",
  "Jorah Mormont": "The exile who betrayed his queen, was banished twice, and came back both times died in the snow at Winterfell with his sword in his hand, taking blow after blow meant for Daenerys. He fell at her feet; a dragon mourned over them both.",
  "Theon Greyjoy": "The broken man came home to the godswood to pay for Winterfell with his life. Bran told him he was a good man — then Theon charged the Night King alone, and died a Stark's death in a Greyjoy's skin.",
  "Melisandre": "The red priestess lit the Dothraki blades, fired the trench, and gave Arya the words that ended the Long Night: what do we say to the god of death? At dawn she walked out the gate, took off the choker, and let her centuries catch her in the snow.",
  "The Night King": "He walked through dragonfire to take Bran beneath the heart tree, and never saw the knife change hands. Arya Stark's Valyrian dagger — the same blade sent for Bran's throat years before — shattered him and all his host with him.",
  "Missandei": "Captured at sea and paraded in chains on the walls of King's Landing, the freedwoman of Naath was beheaded by the Mountain at Cersei's nod, in full view of her queen and Grey Worm. Her last word was Dracarys.",
  "Varys": "The Spider backed the realm one last time over its queen, whispering Jon Snow's secret to anyone who could use it. Tyrion informed; Daenerys sentenced; Drogon burned him on the Dragonstone shore at dusk.",
  "Harry Strickland": "The captain-general of the Golden Company drew his lines before the walls of King's Landing looking very fine. Drogon undid the company in one pass, and Grey Worm's thrown spear caught Harry mid-flight.",
  "Euron Greyjoy": "The crow's eye shot a dragon from the sky and washed ashore in time to duel Jaime Lannister beneath the falling Red Keep. He died grinning at his own wound: 'I'm the man who killed Jaime Lannister.' He wasn't.",
  "Qyburn": "The unchained maester who built the Mountain was struck dead by his own creation — Gregor swatted his master aside on the collapsing stair when Qyburn ordered him back to the queen's side. The scorpions, the little birds, all of it ended on the stones.",
  "Sandor Clegane": "The Hound climbed the falling Red Keep for the only appointment he'd ever kept faith with. He drove his undead brother through the crumbling wall, and they fell together into the fire that had shaped his whole life. Cleganebowl ended in flame.",
  "Gregor Clegane": "The Mountain — or the silent thing Qyburn made of him — met his brother on the stair as the Red Keep came down. Blades meant nothing to him anymore; the long fall into wildfire settled what steel couldn't.",
  "Jaime Lannister": "He rode north an oathbreaker and fought the Long Night a knight, then went home to the sister he could never leave. The Red Keep's cellars came down on them both; he died holding Cersei, the only person who never had to earn it.",
  "Cersei Lannister": "The last light of House Lannister's queen went out beneath the Red Keep, in Jaime's arms, as the map room's ceiling gave way. No trial, no wildfire, no prophecy's valonqar — just the castle her family ruled falling on their heads.",
  "Daenerys Targaryen": "She broke the wheel and burned a city, and stood at last before the throne she'd chased across the world. Jon Snow kissed her and put a dagger in her heart in the same breath. Drogon melted the Iron Throne and carried her east, toward Valyria.",
};

/* ============================================================================
   THE BOOKS' FALLEN — the same idea, in Martin's telling. Shown only in book
   lore, and only once the chosen chapter is at or past the recorded bookDeath. */

const DEATH_TALES_BOOK = {
  "Will of the Night's Watch": "In the prologue of the whole tale, Will watches the Others take Ser Waymar apart in the haunted forest and climbs a tree to hide. What comes up after him wears his commander's face and moves his commander's dead hands.",
  "Ser Waymar Royce": "The lordling ranger stood his ground when the pale shadows stepped from the trees, and called his first foe to the dance. His sword shattered against crystal; his own men found him after — and he found them first.",
  "Gared": "Fifty years a ranger, and what he saw in that forest sent him running past every warning he'd ever given greener men. Ned Stark took his head at the holdfast near Winterfell for desertion, and never learned what he was fleeing.",
  "Jon Arryn": "The Hand of the King burned out in days, a strong man eaten hollow by a sudden fever, whispering 'the seed is strong.' The tale opens with his death — and with the lie Lysa wrote to Winterfell about who arranged it.",
  "Mycah, the butcher's boy": "He played at swords with Arya by the Trident and a prince's lie made it treason. The Hound rode him down and brought the pieces back across his saddle. 'He ran,' Sandor said. 'But not very fast.'",
  "Jory Cassel": "Winterfell's captain died in the street outside Chataya's when Jaime Lannister came to answer Tyrion's arrest — a dagger through the eye, his men cut down around him, and his lord's leg shattered under a dying horse.",
  "Vardis Egen": "Lysa's household knight fought her sister's trial by combat in full plate against a sellsword who refused to stand still. Bronn wore him down around the Moon Door's mocking statue and opened his throat when the armor finally told.",
  "Viserys Targaryen": "He drew steel in Vaes Dothrak, where blades are death, and demanded the crown he was promised with a sword at his sister's belly. Khal Drogo melted his medallion belt in a stewpot and crowned him with it. He was no dragon.",
  "Robert Baratheon": "Wine, a boar, and a squire named Lancel who kept the king's cup full — the hunt in the kingswood opened him from navel to nipple. He died in the Red Keep amending his will at Ned's gentle dishonesty, easier in his mind than he'd been in years.",
  "Syrio Forel": "The First Sword of Braavos met Ser Meryn Trant's armored guardsmen with a splintered wooden blade so his pupil could run. The last Arya saw, he was still fighting. The books never say what do we find if we go back.",
  "Septa Mordane": "She stayed with her charges when the Stark household fell. Her head ended on the Red Keep's walls beside her lord's — Joffrey showed them both to Sansa and called it a lesson.",
  "Vayon Poole": "Winterfell's steward died with the rest of the household when the gold cloaks and Lannister men turned on Lord Eddard — one name in the purge that left his daughter Jeyne an orphan in Littlefinger's keeping.",
  "Eddard Stark": "He confessed treason on the steps of Baelor's sept to buy his daughters' lives, as the deal demanded. Joffrey wanted a head instead, and Ser Ilyn took it with Ice while Arya stared at the statue's plinth and Yoren pulled her away.",
  "Torrhen Karstark": "He rode in Robb's guard into the Whispering Wood and the Kingslayer's sword found him in the press. A Karstark son traded for a Lannister captive — the beginning of his father's long unraveling.",
  "Qotho": "Drogo's bloodrider tried to stop the maegi's bloodmagic at the khal's tent, and Ser Jorah met him steel to arakh. The knight took a hip wound; Qotho took the point through him.",
  "Khal Drogo": "A wound taken in courtesy festered into fire, and Mirri Maz Duur's 'healing' bought his life at the price of everything in it. Daenerys pressed a cushion to his face when she understood what remained. Only death pays for life.",
  "Mirri Maz Duur": "The godswife repaid the sack of her temple by trading Rhaego's life for a breathing husk of a khal, and told Daenerys the sun would rise in the west before Drogo returned. She was bound to his pyre — and from her death-song came dragons.",
  "Yoren": "The Watch's sour old wandering crow died at the holdfast by the Gods Eye, an axe in him and his recruits scattering, still refusing to yield anyone to Ser Amory Lorch. He'd promised Ned Stark he'd get the girl home.",
  "Lommy Greenhands": "The dyer's boy took a spear through his lame leg on the march and couldn't walk. When Raff the Sweetling asked if he could carry him and Lommy said yes, Raff drove the spear through his throat instead.",
  "Renly Baratheon": "In his pavilion at Storm's End, in front of Catelyn Stark and Brienne, a shadow with no body and his brother's face put a sword through the king in his rainbow armor. His hundred thousand swords went to other masters by morning.",
  "Doreah": "The Lysene handmaid sickened in the red waste with the rest of the weak, and died of the wasting fever in that burned country. Daenerys held her at the end — the books' Doreah earned a gentler death than the show's.",
  "The High Septon": "When the mob broke over Joffrey's procession in the starving city, they pulled the fat High Septon apart in the street — the man who spoke for the Seven torn seven ways, his crystal crown lost in the gutters.",
  "Mandon Moore": "On the Blackwater's burning bridge of ships the white knight turned his sword on Tyrion, whom he was sworn to protect. Podrick Payne shoved him into the river, and his enameled plate did the rest. Whose coin bought him, the books never confess.",
  "Matthos Seaworth": "Davos's most devout son believed the Lord of Light sailed with Stannis into Blackwater Bay. The wildfire took Black Betha and Fury's line whole; the sea gave his father back, but never Matthos.",
  "Rodrik Cassel": "The old castellan led Winterfell's strength out to break the sack of Torrhen's Square and rode back into Ramsay's trap. The Bastard of Bolton's men butchered his little army in front of the walls, and Ser Rodrik with it.",
  "Maester Luwin": "Speared in Winterfell's burning godswood, the little grey maester dragged himself beneath the heart tree. He counseled the boys one last time, told Osha which roads to trust — and asked her for the gift of mercy, which she gave.",
  "Old Nan": "The oldest voice in Winterfell, whose stories held more truth than the maesters allowed, vanishes from the tale in the castle's sack — carried off with the other captives toward the Dreadfort, her stories unfinished.",
  "Qhorin Halfhand": "Hunted through the Skirling Pass, the great ranger ordered Jon to turn his cloak and buy the free folk's trust with a death. He came at Jon like a storm and died on Longclaw as Ghost's teeth closed — exactly as he intended.",
  "Orell": "The eagle-skinchanger fell to Jon Snow's sword in the fight in the Skirling Pass — but a piece of him lived on in the bird, and the eagle's hatred of Jon never cooled. Skinchangers die twice, the free folk say.",
  "Chett": "The kennelman's plot to murder his officers at the Fist died under a triple horn-blast: the Others came first. The books' third volume opens with his last watch, cold hands closing in through the snow.",
  "Hoster Tully": "The Lord of Riverrun died slowly of the sickness in his belly while the war burned his rivers, calling out 'Tansy' for a wrong done long ago. Edmure fired three arrows over his funeral boat; the Blackfish's fourth wasn't needed.",
  "Rickard Karstark": "He broke into Riverrun's cells and butchered two Lannister squires, then dared his king to answer for it. Robb took his head in the rain in Riverrun's godswood with his own hand — and the Karstark strength rode home.",
  "Jeor Mormont": "The Old Bear brought the ranging's survivors as far as Craster's Keep, where hunger and mutiny finished what the Others began. He died with Dirk's blade in him, telling Sam to find his son Jorah and tell him to take the black.",
  "Craster": "He called the starving Watch guests and hid his stores, and Dirk opened his throat over the last of the bread — kinslaying under his own roof, if the wives are right about who fathered the Watch's mutineers' luck.",
  "Kraznys mo Nakloz": "The Good Master mocked the barbarian queen in High Valyrian while he sold her eight thousand Unsullied for a chained dragon. Dany answered him in his own tongue — and Drogon answered him in fire.",
  "Mero": "The Titan's Bastard escaped the rout at Yunkai and came for Daenerys with a beggar's face weeks later. Strong Belwas took a knife across the belly for her and gutted him in the dust — then complained about the scar.",
  "Prendahl na Ghezn": "The Ghiscari captain of the Stormcrows voted to hold Yunkai for the slavers. Daario Naharis disagreed, and settled the company's council by bringing Prendahl's head — and Sallor's — to the dragon queen in a sack.",
  "Robb Stark": "The Young Wolf came to the Twins to mend a broken marriage pact and died under guest right with the Rains of Castamere playing — quarrels from the galleries, Roose Bolton's blade, and Grey Wind's death howling in the yards.",
  "Catelyn Stark": "She watched her son die at his uncle's wedding feast and opened old Jinglebell's throat for a vengeance Walder Frey only laughed at. They cut her throat and threw her in the Green Fork naked — and what the river gave back three days later does not forgive.",
  "Dacey Mormont": "The she-bear of Bear Island danced at the Red Wedding in a gown instead of mail. When the music turned to murder she broke a flagon across Ser Ryman's face and made for the doors — an axe caught her belly before she reached them.",
  "Joffrey Baratheon": "At his own wedding feast the boy king choked purple on poisoned wine — the Strangler, worked into a hair-net's black amethysts by the Queen of Thorns while everyone watched the dwarf. Tyrion got the blame; Littlefinger got Sansa.",
  "Balon Greyjoy": "The Lord Reaper of Pyke walked his rope bridges in a storm as he always had, and the sea took him at last — the day before his brother Euron's Silence sailed into the harbor. The ironborn do not much believe in coincidence.",
  "Oberyn Martell": "The Red Viper fought the Mountain for Tyrion's life and his sister's memory, poison on his spear and 'say her name' on his lips. He had his confession — Gregor roared it while he crushed the prince's skull with his bare hands.",
  "Ygritte": "The girl kissed by fire fell in the battle beneath the Wall, an arrow through her chest that Jon prayed wasn't his. She died in his arms in the ashes of the fight, still telling him he knew nothing.",
  "Styr": "The earless Magnar of Thenn led the climb over the Wall's shoulder and the assault on Castle Black's naked southern face. The Watch's traps met him on the ice: he fell screaming from the Wall he'd beaten.",
  "Shae": "She bore false witness at Tyrion's trial and he found her in Tywin's own bed, the Hand's chain of golden hands around her throat. He twisted it. Wherever whores go, she went first.",
  "Tywin Lannister": "Tyrion climbed the privy tower on his escape and found his father where all men are mortal. Two quarrels from a crossbow answered a lifetime of contempt — and Tywin Lannister, in the end, did not shit gold.",
  "Lysa Arryn": "She confessed everything at the Moon Door with her hands on Sansa's back — the poisoned husband, the lying letter, all of it done for Petyr. Littlefinger pried her loose gently, said 'only Cat,' and pushed.",
  "Merrett Frey": "The Freys' soft, unlucky envoy rode to Oldstones with the ransom for Petyr Pimple and found the brotherhood waiting. They hanged them together — on the word of a hooded woman whose throat wound matched her wedding.",
  "Beric Dondarrion": "Six times the flame of R'hllor pulled the lightning lord back from death, each return leaving less of the man. At the Trident he spent the last of it, mouth to mouth, on a three-days-drowned corpse the brotherhood pulled from the river. What rose was Lady Stoneheart.",
  "Stevron Frey": "Lord Walder's patient heir, an old man who had waited sixty years for the Twins, took a wound at Oxcross and died of it three days later in the west — proving, his father grumbled, that waiting on Freys kills even Freys.",
  "Maester Aemon": "Sam carried the blind old maester south to save him from Melisandre's fires, and the sea's chill caught him past Braavos. He died aboard the Cinnamon Wind at a hundred and two, dreaming of his brother Egg and murmuring of a dragon with three heads.",
  "Arys Oakheart": "The white knight let Arianne Martell talk him into crowning Myrcella, and rode at Areo Hotah's line on the Greenblood when the plot broke. The captain's longaxe took him almost gently — Hotah liked him, and made it quick.",
  "Pate, the Citadel novice": "The pig boy of the Citadel sold a maester's key to a stranger with a face that wasn't his, for a gold dragon and a girl's freedom. The coin was still in his fist when he died — and someone left Oldtown wearing his name.",
  "Varamyr Sixskins": "The great skinchanger of the free folk, who wore a shadowcat and a bear and men's fears, died a beggar in the snows after the Wall broke Mance's host. His second life in his wolf One Eye opens the fifth book — and shows what waits inside the storm.",
  "Janos Slynt": "The butcher's son who sold Ned Stark refused the Lord Commander's order three times, sure his friends in King's Landing made him safe. Jon Snow did not hang him. He took Slynt's head himself, in the yard, with Longclaw — and Stannis nodded.",
  "Rattleshirt": "The Lord of Bones burned before the Wall wearing a king's face: Melisandre's glamour made the free folk see Mance Rayder in the flames. The real bag of bones died screaming in another man's name — her ruby's cruelest trick.",
  "Mance Rayder": "Before the whole Wall the King-Beyond-the-Wall burned in a cage of ice and wood — or so every watcher swore. The red woman's glamour burned Rattleshirt in his skin; the man himself went to Winterfell with six spearwives and a harp. So it seemed, and seeming is her trade.",
  "Yezzan zo Qaggaz": "The grotesquely vast Yunkish lord who bought Tyrion at auction was carried off by the pale mare — the bloody flux that rode through the siege camps of Meereen faster than any Dothraki. His slaves wept; he had been, by slaver standards, kind.",
  "Quentyn Martell": "The quiet prince crossed half the world with a marriage pact to claim a dragon queen, and reached for Viserion's chains when she flew. The dragons answered fire with fire. He lived three days after; the books call him the frog prince who died far from home.",
  "Kevan Lannister": "The steadiest Lannister was lured to Pycelle's chambers by a child's note and took a crossbow bolt between the ribs. Varys himself finished it with knives and an apology: Kevan was mending the realm too well, and the eunuch's dragon needed it broken.",
  "Grand Maester Pycelle": "The old maester who served five kings died at his own table, his skull broken by Varys's little birds before Kevan Lannister arrived to share the room's fate — the epilogue of the fifth book, and of Tywin's whole order.",
};

/* where the death pin belongs: the last known place on the whereabouts timeline
   at the point of death (falls back through nulls to the last real place) */
function deathSiteFor(name) {
  const c = CHARACTERS[name];
  if (!c || !c.death || c.death.s === 0) return null;
  if (DEATH_SITE_OVERRIDES[name]) return DEATH_SITE_OVERRIDES[name];
  const tl = (typeof WHEREABOUTS !== "undefined") ? WHEREABOUTS[name] : null;
  if (!tl) return null;
  let site = null;
  for (let i = 0; i < tl.length; i++) {
    const seg = tl[i];
    if (seg[0] < c.death.s || (seg[0] === c.death.s && seg[1] <= c.death.e)) {
      if (seg[2]) site = seg[2];
    } else break;
  }
  return site;
}

/* the same, in the books' telling: last known place at the bookDeath chapter */
function deathSiteForBook(name) {
  const c = CHARACTERS[name];
  if (!c || !c.bookDeath) return null;
  if (DEATH_SITE_OVERRIDES[name]) return DEATH_SITE_OVERRIDES[name];
  const tl = (typeof WHEREABOUTS_BOOK !== "undefined") ? WHEREABOUTS_BOOK[name] : null;
  if (!tl) return null;
  let site = null;
  for (let i = 0; i < tl.length; i++) {
    const seg = tl[i];
    if (seg[0] < c.bookDeath.b || (seg[0] === c.bookDeath.b && seg[1] <= c.bookDeath.ch)) {
      if (seg[2]) site = seg[2];
    } else break;
  }
  return site;
}
