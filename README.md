# Shalom sticker pack

A tactile, rotatable cat sticker pack with glossy generated lettering, pearlescent die cuts and puffy clear packaging. Nine distinct moods, one copy of each sticker.

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
- **Pack it away** returns the sleeve, header and stickers in a short sealing sequence. Reduced-motion preferences use an immediate transition.

No build step, dependencies, accounts, analytics or external runtime requests. All artwork stays local to the page, including export processing.

## Artwork

The three PNG assets were created using ChatGPT image generation and integrated with code-authored packaging. Cat variations retain a consistent fluffy silver-white identity with photographic fur, glossy epoxy rims and resin accessories. Original reference uploads are not included. See [ASSETS.md](ASSETS.md) for asset descriptions.

Pointer interaction uses no selection rectangle or move cursor. Keyboard focus is shown with a restrained silhouette glow; controls retain accessible names.
