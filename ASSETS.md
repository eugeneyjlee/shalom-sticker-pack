# Artwork provenance

All four runtime PNGs are generated visual assets produced with the built-in ChatGPT image generation tool. Original user-supplied reference uploads, local conversation records and earlier project history are excluded.

- `assets/shalom-balloon-v1.png`: exact word Shalom, capital S, in a single line of pale-lavender/pink-silver chrome balloon lettering with curved studio highlights and restrained aqua rims. Transparent background; no additional words or decoration.
- `assets/cloud-cat-resin-v3.png`: nine consistent fluffy silver-white cats with green eyes and pink noses, photographic fur, pearly epoxy edges and small resin accessories. Bow, sunglasses, blanket nap, wave, shark hood, bashful paws, curious star, heart hug and ribbon stretch. A spacing refinement preserves complete silhouettes in a transparent 3×3 atlas.
- `assets/candy-charms-v1.png`: four original dimensional accents: pink resin heart and bow, silver-pink chrome flower and iridescent lavender star. Transparent 2×2 atlas, studio reflections and rounded glass-like edges.

The packaging, film highlights, seams, rotation, line gesture, repacking sequence and export processing are authored in HTML, CSS and JavaScript. Individual PNG export selects one atlas crop, retains its main connected die-cut silhouette and adds transparent padding; it does not include packaging or other stickers.

- `assets/cloud-cat-companions-v2.png`: companion sheet with headphones, strawberry boba, duck raincoat, astronaut, cupcake baker, party hat, frog cap, reading, camera, angel wings and knitting cats. These eleven variants join the original nine for exactly twenty distinct stickers. A twelfth generated pose on the atlas is unused. Same silver-white identity, photographic fur, glossy epoxy rim and pastel resin accents.

Generation used the original cat atlas as an identity/style reference. Refinement preserved the twelve illustrations and reduced their size in a transparent three-column/four-row atlas to protect complete silhouettes. Runtime processing isolates each selected die cut once; display, reverse masks and downloads share those same clean cutouts.

### Companion atlas prompt set

Generation: Create a companion production sticker atlas matching the original fluffy silver-white green-eyed cat identity and pearly glossy epoxy die-cut aesthetic. Twelve new distinct poses in a strict three-column/four-row portrait atlas. Complete silhouettes, generous transparent gutters, photoreal fur, grey forehead markings, pink nose, rounded expressive face, thin iridescent pink/aqua rims and resin accessories. Row one: pink headphones, strawberry boba, yellow duck raincoat. Row two: silver astronaut helmet, cupcake baker, pastel party hat with attached confetti. Row three: frog cap, lavender book, pink toy camera. Row four: pearly angel wings, knitting a pink yarn heart, paws framing a heart. No labels, background rectangles, external shadows or detached flecks. Do not duplicate the original nine poses.

Final refinement: Preserve all twelve cats, glossy rims and accessories; shrink each to sixty-five percent and center in a strict three-column/four-row atlas with large transparent gutters. Centers at x16.67/50/83.33 percent and y12.5/37.5/62.5/87.5 percent. All hats, paws, wings and yarn remain inside their cells. Remove detached flecks; no new objects or typography. The first eleven refined companions are used.

## Material renderer

`material.js` authors the clear pouch geometry and reflection shader in code; it does not use a reference photograph as a texture. The front and reverse reference images are excluded. `vendor/three.module.js` and `vendor/three.core.js` are Three.js, distributed under the included MIT `vendor/LICENSE`. All runtime modules are served locally.
