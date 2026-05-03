# Dance Training

End-to-end demos (recorded by the Playwright suite):

- [`docs/demos/cursor-motion-lesson.webm`](docs/demos/cursor-motion-lesson.webm)
  — walks the **Cursor motion** lesson to completion using fallback Kak
  defaults (no uploaded keybindings).
- [`docs/demos/colemak-keybindings-lesson.webm`](docs/demos/colemak-keybindings-lesson.webm)
  — uploads the bundled `keybindings.json` (a Colemak-tailored Dance setup
  with `dance.run`-with-`code` blocks for the `e` and `i` keys) and drives
  the same lesson with the user's actual keys (Colemak `o e i n` = raw
  `Semicolon KeyK KeyL KeyJ`).

An interactive web tutor that teaches Kakoune-style modal editing **using your own VS Code Dance keybindings**. Upload your `keybindings.json` and the lessons, hints, and Clippy suggestions all render the keys _you_ use — taking your OS keyboard layout and the labels printed on your hardware into account.

> Status: scaffolding & lesson library are landing. See `docs/DESIGN.md` for the full architecture.

## Quick start

```sh
pnpm install
pnpm dev          # dev server on http://localhost:5173
pnpm test         # vitest
pnpm typecheck    # tsgo --noEmit
pnpm lint         # oxlint
pnpm fmt:check    # oxfmt --check .
pnpm build        # production build into dist/
```

The dev server runs Monaco + the Dance emulator + Clippy.

## What's inside

| Path                          | What it is                                                               |
| ----------------------------- | ------------------------------------------------------------------------ |
| `docs/DESIGN.md`              | Full technical & design doc — read first.                                |
| `data/golf/<id>/{in,out,cmd}` | 213 vim-golf challenges with their original Kakoune solutions, vendored. |
| `data/vimtutor/tutor1.txt`    | Vim's tutor source. We adapt — not reproduce — for Kakoune.              |
| `src/data/`                   | Canonical Kak ↔ Dance reference + curated discrepancies.                 |
| `src/layout/`                 | Keyboard-layout tables (qwerty, colemak, dvorak, …) + resolution.        |
| `src/bindings/`               | JSONC parser, key-string parser, coverage analyzer.                      |
| `src/emulator/`               | Monaco-driven Dance behaviour mock + dispatcher.                         |
| `src/lessons/`                | Lesson DSL, runtime, verifier, golf catalog, content.                    |
| `src/ui/`                     | shadcn-based components + Clippy + KeyChip.                              |
| `src/app/`                    | Routing shell, Zustand store.                                            |

## Hosting

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on push to `main`. The `base` is auto-derived from the repository name.

## Tech stack

- pnpm + Vite + React 19 + TypeScript
- tsgo (`@typescript/native-preview`) for type checking
- oxlint + oxfmt for lint & format
- Tailwind v4 + shadcn/ui (Radix)
- Monaco editor (`@monaco-editor/react`)
- Zustand + wouter
- vite-plugin-pwa (Workbox)
- Vitest

## License

Code: MIT. Reference data is vendored under its original licences (vim-golf challenges per `mawww/golf`; vimtutor adapted, not reproduced — Vim is Charityware).
