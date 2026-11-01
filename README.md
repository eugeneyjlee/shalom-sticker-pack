# Shalom sticker pack

A wide, tactile, rotatable cat sticker pack with glossy generated lettering, pearlescent die cuts and puffy clear packaging. Twenty distinct moods, one copy of each sticker.

[Open the live pack](https://eugeneyjlee.github.io/shalom-sticker-pack/)

## Try it

Serve this directory with any static web server, for example:

```sh
python3 -m http.server 4182
```

Open `http://localhost:4182`.

- Drag the sealed pack to turn it around. Arrow keys rotate a focused pack; Home faces front.
- Draw a long line across the seam in either direction to open. Focus the seam and press Enter or Space for a keyboard alternative.
- Drag an opened sticker to arrange it. Arrow keys move; Shift + arrows rotate.
- Tap or click a sticker to reveal **Save PNG**. The download contains only that isolated sticker on transparency; dragging does not trigger a save.
- **Pack it away** raises the sleeve from below, returns the stickers, then closes the paper header and seals the pack. Reduced-motion preferences use an immediate transition.

No build step, dependencies, accounts, analytics or external runtime requests. All artwork stays local to the page, including export processing.

## Artwork

The four PNG assets were created using ChatGPT image generation and integrated with code-authored packaging. Cat variations retain a consistent fluffy silver-white identity with photographic fur, glossy epoxy rims and resin accessories. Original reference uploads are not included. See [ASSETS.md](ASSETS.md) for asset descriptions.

Pointer interaction uses no selection rectangle or move cursor. Keyboard focus is shown with a restrained silhouette glow; controls retain accessible names.

## Validation

The landscape edition was checked with actual seam drawing, keyboard opening, rotation, narrow-screen layout and individual save actions for all twenty stickers. Representative new downloads were visually inspected for complete isolated silhouettes. A full repack cycle returned the exact same measured transform and position as its initial sealed state. JavaScript syntax and Git whitespace checks pass.
