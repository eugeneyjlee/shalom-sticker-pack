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
- Ordinary taps, clicks and completed drags show no download text. Right-click an opened sticker or hold it still for 620 ms on touch to open **Download sticker**; choosing that menu action exports the isolated transparent PNG. Enter, the Context Menu key or Shift + F10 opens the same menu from a focused sticker; Escape closes it. Moving or scrolling cancels a pending hold. On touch, vertical gestures retain native scrolling; start a rearrangement horizontally before moving in another direction.
- **Pack it away** gathers the die cuts entirely above the open mouth before the sleeve rises. Each then descends vertically through the top opening, behind the front film; the header closes and the pack smoothly returns to its initial pose. Reduced-motion preferences use an immediate transition.

No build step, accounts, analytics or external runtime requests. A locally vendored MIT-licensed Three.js renderer adds a shallow inflated film shell, irregular geometry-based folds, crimped edges and paper thickness; reflections follow the pack’s rotation. CSS packaging remains available if WebGL is unavailable. All artwork stays local to the page, including export processing.

## Artwork

The four PNG assets were created using ChatGPT image generation and integrated with code-authored packaging. Cat variations retain a consistent fluffy silver-white identity with photographic fur, glossy epoxy rims and resin accessories. Original reference uploads are not included. See [ASSETS.md](ASSETS.md) for asset descriptions.

Pointer interaction uses no selection rectangle or move cursor. Keyboard focus is shown with a restrained silhouette glow; controls retain accessible names.

## Validation

The landscape edition was checked with actual seam drawing, keyboard opening, rotation, narrow-screen layout and individual save actions for all twenty stickers. Representative new downloads were visually inspected for complete isolated silhouettes. A full repack cycle returned the exact same measured transform and position as its initial sealed state. JavaScript syntax and Git whitespace checks pass.

The context-menu and top-entry update passes syntax/whitespace review and a transient Node handler check covering quiet tap/drag, context actions, hold cancellation, keyboard menu access, repack phase order and exact final sticker poses. Actual browser interaction, touch long-press and fresh PNG verification for this update remain pending because the connected browser/native surfaces were unavailable during implementation.

Touch scrolling follows the browser’s [Pointer Events gesture rules](https://www.w3.org/TR/pointerevents/); a native pan cancels the app drag and pending hold.
