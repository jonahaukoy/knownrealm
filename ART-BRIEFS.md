# Art briefs — the four game backdrops

Prompts to paste into a generative image tool, one set per game. Written to match how
`smallcouncil/assets/table1–5.webp` already works: **the game is played on an object in the
picture, and the picture changes as the round goes on.**

Save each set to `new_assets/<game>_screens/` the way you did with `connections_screens/`, and I
will trim, resize, convert to WebP and wire them up.

---

## READ THIS FIRST — the five rules that decide whether these work

These apply to every prompt below. Most of them are not obvious, and getting any of them wrong
means regenerating the whole set.

**1. The states must be the same picture, not four similar pictures.**
This is the one that matters most. The Small Council cross-fades between its five paintings, and
that only reads as *one desk freezing over* because every object stays in exactly the same place.
Four separately-generated halls will jump and look broken.

So: **generate state 1 only.** Then feed state 1 back into the tool and ask for the next state as
an edit — "same scene, same camera position, same objects in the same positions; change only the
light." In Midjourney use the image as a style/character reference or use Vary (Subtle) then edit;
in ChatGPT/Gemini/Firefly upload it and describe only the change. Never write a fresh prompt for
state 2.

**2. Leave the middle genuinely empty.**
Each brief names an area that must be flat, evenly lit and free of detail — that is where the
game's text goes. Not "mostly empty": no props crossing it, no shadows falling across it, no
decorative border creeping in. Detail and drama belong at the edges. If a candle or a hand needs
to overlap, it may overlap the *top edge only*, like the dead hand does on the desk.

**3. No text, anywhere.**
No letters, numbers, runes, carved inscriptions, book pages with writing, labelled banners. Image
models produce garbage lettering and it cannot be fixed. Say so in the prompt every time — it is
already in each one below.

**4. No recognisable actors, and nothing lifted from the show's production design.**
This site is commercial. A generated face that resembles an actor, or a set copied from the
series, is a real liability. Everything below is deliberately built from generic medieval
material — stone, candles, wax, oak, iron — so none of it depends on anyone's designs. Keep it
that way. Where faces are needed they are *masks*, not portraits.

**5. 4:3, and as large as the tool will give you.**
Match the desk: 4:3 landscape, minimum 1600 px wide. I downscale to 1600 and convert to WebP
(the desk set went 15.6 MB → 1.7 MB, so file size is not a concern — give me the big version).

---

## 1. WHO SAID IT? — the Hall of Faces  ✅ BUILT

_Done: five paintings delivered and wired up (`whosaidit/assets/hall1-5.webp`). The notes below
are kept as the record of what was asked for._

**5 images.** The chamber brightens as you get answers right: you start in near-darkness and end
with the wall ablaze. Unlike the Small Council, this progression is a *reward*, which is
deliberate — the two games should not feel like the same trick.

The four masks in the picture are only scenery. The site drops its own character portraits into
the layout on top, so the masks must stay small and off to the sides.

**Empty area required:** a broad panel across the middle of the wall, roughly the central 60% of
the width and from just under a fifth of the way down to near the bottom. Flat, unlit stone.

### State 1 — almost dark

> A dim underground chamber of a temple, carved from dark grey stone. Eye-level view facing a
> flat stone wall. Two shallow carved niches on the far left and two on the far right hold pale
> wax death masks, blank and eyeless, mounted on iron pegs. A single guttering candle stands on a
> low stone ledge at the bottom left, throwing a small pool of warm light that reaches only the
> nearest mask. The rest of the chamber falls away into near-blackness. The entire centre of the
> wall is bare, flat, unlit stone with no carving, no cracks, no props and no shadows crossing
> it — a plain empty panel. Cold blue-black darkness, one small warm flame, heavy atmosphere.
> Photorealistic, cinematic, shallow depth of field, 4:3. No text, no letters, no inscriptions,
> no writing of any kind. No people, no faces other than the blank wax masks.

### States 2, 3 and 4 — feed State 1 back in

Upload State 1 and change **only** the light. Same camera, same wall, same masks in the same
niches.

> State 2: same scene, same camera position, same masks in the same places. Now four candles burn
> instead of one — two more on the bottom ledge and one on a higher shelf at the right. The warm
> light reaches further and two of the masks are now visible. The centre of the wall stays bare
> and empty. Everything else identical.

> State 3: same scene, same camera position, same masks in the same places. Now a dozen candles
> burn along the ledge and in wall sconces on both sides. Warm amber light fills most of the
> chamber, all four masks clearly lit, faint smoke in the air. The centre of the wall stays bare
> and empty. Everything else identical.

> State 4: same scene, same camera position, same masks in the same places. The chamber is fully
> ablaze with candlelight — dozens of candles on every ledge and sconce, warm golden light, drifting
> smoke, the stone glowing. The centre of the wall stays bare and empty. Everything else identical.

---

## 2. SIGIL MATCH — the banner hall  ✅ BUILT

_Done: three paintings delivered and wired up (`sigilmatch/assets/hall1-3.webp`)._

**3 images.** A great hall seen down its length. It wakes up as you play: shuttered and cold, then
torchlit, then blazing for a feast.

**Two empty areas here, not one.** The centre is for the game, and the **side walls must be bare**
— that is where the site hangs the banners you have correctly named, so the hall fills with your
own collection as you go. Do not let the picture put its own banners there; they would clash with
the real ones.

**Empty areas required:** (a) the central third of the frame, top to bottom, kept clear for the
banner being asked about and the four answers; (b) a clean, evenly-lit strip of stone wall down
each side, unbroken by windows or hangings.

### State 1 — the hall cold

> The interior of a vast medieval great hall, viewed straight down its length from the main doors
> toward a raised stone dais at the far end. High timber rafters overhead, a flagstone floor, tall
> bare stone walls on both sides. The hall is cold and shuttered: no fire, no people, grey daylight
> falling from high clerestory windows, dust in the air. Long empty trestle tables pushed back
> against the walls. The side walls are completely bare stone — no banners, no tapestries, no
> hangings of any kind. The centre of the frame, from the rafters down to the floor, is open empty
> space with nothing in it. Muted grey-blue palette, cold, still, abandoned. Photorealistic,
> cinematic, deep perspective, 4:3. No text, no letters, no heraldry, no writing of any kind. No
> people.

### States 2 and 3 — feed State 1 back in

> State 2: same hall, same camera position, same architecture and same tables. Now iron torches
> burn in brackets along both side walls and a fire is lit in the hearth, casting warm orange light
> up the stone and across the rafters. The side walls stay completely bare — no banners or
> hangings. The centre of the frame stays open and empty. Everything else identical.

> State 3: same hall, same camera position, same architecture. Now the hall is lit for a feast —
> every torch burning, braziers along the floor, warm golden light filling the whole space, smoke
> hazing the rafters, the dais lit brightest of all. The side walls stay completely bare — no
> banners or hangings. The centre of the frame stays open and empty. Everything else identical.

---

## 3. TRIVIA OF THE REALM — the maester's cell, and the dawn

**5 images.** You are studying through the night. The sky in the window behind the desk goes from
black to full morning as you answer correctly — get ten right and you have studied until dawn; do
badly and you are still sitting in the dark.

The desk holds an **open book with two blank facing pages**, and the game is written on them: the
question on the left leaf, the answers on the right. That is why the book must be open, flat,
squarely on, and completely blank.

**Empty area required:** both pages of the open book — two clean cream rectangles, side by side,
squarely facing the camera, taking up the middle half of the frame. No writing, no illustration,
no hand resting on them, no object lying across them.

### State 1 — deep night

> A maester's study in a stone tower at night. Three-quarter view across a heavy oak desk toward a
> tall arched window behind it. On the desk, facing the camera squarely, lies a large open leather-
> bound book with two completely blank cream parchment pages, flat and evenly lit, filling the
> middle of the frame. Around it, at the edges of the desk: a burning candle in a brass holder, a
> brass astrolabe, a stack of rolled scrolls, an inkwell and quill, a raven perched on a wooden
> stand in the shadows at the right. Shelves of scrolls and bound volumes line the walls behind.
> Through the arched window, a black night sky with a scatter of stars — no light in it at all. The
> only light in the room is the candle, warm and close. The two blank pages stay clean and empty
> with nothing resting on them. Photorealistic, cinematic, warm candlelight against deep shadow,
> 4:3. No text, no letters, no writing, no illustration on the pages or anywhere else.

### States 2 to 5 — feed State 1 back in

Only the window and the light through it change. The desk, the book, the props and the camera stay
exactly as they are.

> State 2: same room, same camera, same desk and same open blank book. Through the window the
> night sky has turned the deep blue of the last hour before dawn. The candle still carries the
> room. The pages stay blank and empty. Everything else identical.

> State 3: same room, same camera, same desk and same open blank book. Through the window the sky
> is cold grey, first light, the stars gone. A faint grey light now falls across the desk alongside
> the candle. The pages stay blank and empty. Everything else identical.

> State 4: same room, same camera, same desk and same open blank book. Through the window the sky
> is banded pink and gold with sunrise. Warm dawn light spills across the desk and up the far wall,
> and the candle is guttering low. The pages stay blank and empty. Everything else identical.

> State 5: same room, same camera, same desk and same open blank book. Through the window is full
> bright morning, a pale clear sky. Clean daylight floods the room, the candle is out and smoking.
> The pages stay blank and empty. Everything else identical.

---

## 4. WHO ARE YOU IN THE REALM? — the blank shield in the godswood

**4 images.** The only exterior of the four, on purpose — the other three are all rooms, and this
one should not feel like another table.

A hedge knight with no house carries a **blank shield** until he earns arms. That is exactly what
this quiz is: you start with nothing on the shield and the answers paint it. The site draws the
heraldry into the shield as you answer, so the shield in the picture must be genuinely blank,
large, and squarely facing the camera.

The godswood warms from cold grey mist to a red blaze as the quiz progresses.

**Empty area required:** the face of the shield — a clean, evenly-lit, unpainted surface, upright
and square to the camera, occupying roughly the central third of the frame's width and most of its
height. No boss, no rivets across the middle, no leaves or branches falling in front of it.

### State 1 — cold and grey

> A godswood clearing at first light. In the centre of the frame, propped upright against the pale
> gnarled roots of an ancient white tree, stands a large kite-shaped wooden shield, completely
> blank and unpainted — a clean smooth pale wooden face, squarely facing the camera, with a plain
> iron rim and nothing on it at all. The ancient tree rises behind and around it, bone-white bark,
> dark red leaves, thick roots spreading across the mossy ground. Cold grey mist hangs between the
> trunks, the light flat and colourless, everything drained and still. Fallen red leaves on wet
> moss at the base. The face of the shield stays completely blank and evenly lit, with no branches,
> leaves or shadows falling across it. Photorealistic, cinematic, cold and quiet, 4:3. No text, no
> letters, no carving, no heraldry, no painted device on the shield or anywhere else.

### States 2, 3 and 4 — feed State 1 back in

> State 2: same clearing, same camera, same blank shield in the same position against the same
> roots. The mist has begun to thin and a little warmth has come into the light. The red leaves are
> slightly richer in colour. The shield face stays completely blank and evenly lit. Everything else
> identical.

> State 3: same clearing, same camera, same blank shield in the same position. Low golden
> afternoon sun now breaks through the trees in visible shafts, lighting the white bark and setting
> the red leaves glowing. The mist is nearly gone. The shield face stays completely blank and
> evenly lit. Everything else identical.

> State 4: same clearing, same camera, same blank shield in the same position. Deep red sunset
> light floods the whole godswood, the leaves blazing crimson, the white bark washed warm gold,
> long shadows across the moss. The shield face stays completely blank and evenly lit. Everything
> else identical.

---

## If a state comes back wrong

Two failures are common and both are worth catching before you generate the rest of the set:

- **The empty area gets decorated.** The model fills the blank book pages with squiggles, or drops
  a banner on the bare wall. Regenerate that state with the emptiness stated twice — once in the
  main description and once at the end — rather than trying to patch it.
- **The objects drift between states.** The candle moves, the book changes size, the shield tilts.
  This is what breaks the cross-fade, and it means the tool treated your state prompt as a new
  image rather than an edit. Go back to State 1 and re-do it as an edit of that exact file.

Send me State 1 of any set before you generate the rest and I will check the geometry against the
layout — it is much cheaper to find a problem on one image than on five.
