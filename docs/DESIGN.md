# Dance Training — Technical & Design Document

An interactive web-based tutor that teaches Kakoune-style modal editing through the user's
own VS Code Dance keybindings. The user uploads their `keybindings.json` and the tutor
adapts every lesson, hint, and Clippy suggestion to the actual keys they have bound — taking
keyboard layout (OS layout vs printed hardware) into account.

## 1. Goals

1. **Adaptive lessons.** A lesson never says "press T"; it says "press T (the key labelled
   F on your QWERTY-printed keyboard, sent as `t` by your Colemak OS)". The keys come from
   the user's own bindings, not from the Kakoune defaults.
2. **Layout-aware rendering.** Support `[KeyT]` style layout-independent codes. Render the
   canonical Kak letter, the OS-layout letter, and the printed hardware letter side by
   side when they differ.
3. **Coverage analysis.** Tell the user which Dance commands they have not bound, which
   Kakoune commands have no Dance equivalent, and where Kak ↔ Dance behave differently.
4. **Structured curriculum.** Many short, focused lessons grouped into thematic folders.
   No mega-document. Vimtutor adapted to Kakoune is one folder; Vim Golf demos are another.
5. **Clippy as host.** A persistent assistant character (Clippy-style) introduces every
   lesson, gives hints, verifies steps, and roasts/celebrates the user.
6. **Static, installable.** Deploy as a static GitHub Pages site. Installable as a PWA
   so it works offline once visited.

## 2. Non-goals

- Running real Kakoune (no WASM kak); the Monaco editor is the practice surface.
- Teaching Kakoune's `:command` shell language beyond surface awareness.
- Multi-user accounts or cloud sync. Settings live in IndexedDB / localStorage.

## 3. Reference materials

| Source                              | Used for                                            |
| ----------------------------------- | --------------------------------------------------- |
| `https://igor-ramazanov.github.io/` | Canonical Kakoune normal-mode key reference.        |
| `mawww/kakoune` README + design doc | Philosophy, mention of vim-golf parity.             |
| `mawww/golf` (213 challenges)       | Vim Golf demo content. Each has `in`, `out`, `cmd`. |
| `vim/runtime/tutor/tutor1`          | Source text for vimtutor-style adaptation.          |
| `71/dance` package.json             | Authoritative Dance command list.                   |
| User's `keybindings.json`           | Source of truth for what keys do what.              |

Reference data is checked into `data/` so the build is hermetic.

## 4. Tech stack

| Concern         | Choice                                            | Notes                                                         |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| Package manager | **pnpm**                                          | Lockfile committed.                                           |
| Build           | **Vite** + React 19 + TypeScript                  | `base` configurable for GH Pages subpath.                     |
| Type checker    | **tsgo** (`@typescript/native-preview`)           | Replaces `tsc --noEmit`.                                      |
| Linter          | **oxlint**                                        | Fast, no plugin config beyond defaults.                       |
| Formatter       | **oxfmt**                                         | Pre-commit + CI.                                              |
| UI primitives   | **shadcn/ui** (Radix + Tailwind)                  | Components copied into `src/components/ui`.                   |
| Styling         | **Tailwind v4**                                   | Via `@tailwindcss/vite`.                                      |
| Editor          | **Monaco**                                        | Same engine as VS Code, lets us mimic Dance behaviour.        |
| State           | **Zustand**                                       | Single store, persisted slice for user prefs.                 |
| Routing         | **wouter**                                        | Tiny, hash-based for GH Pages compatibility.                  |
| Markdown        | **`marked`** with custom renderer                 | Lesson text. Inline `{{key:dance.select.right.jump}}` tokens. |
| PWA             | **vite-plugin-pwa** (Workbox)                     | Generates manifest + service worker.                          |
| Tests           | **Vitest** + **@testing-library/react**           | Unit + component.                                             |
| Hosting         | **GitHub Pages** (`gh-pages` branch via Actions). |
| CI              | **GitHub Actions** (`build.yml`, `deploy.yml`).   |

## 5. High-level architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  App shell (React)                                                   │
│  ┌──────────┐  ┌──────────────────────────────┐  ┌────────────────┐ │
│  │ Sidebar  │  │ Lesson viewport              │  │ Clippy panel   │ │
│  │ (folders │  │ ┌──────────────────────────┐ │  │ (narration,    │ │
│  │ +lessons)│  │ │ Lesson markdown          │ │  │ hints, success)│ │
│  │          │  │ │                          │ │  │                │ │
│  │          │  │ │ {{key tokens rendered}}  │ │  │                │ │
│  │          │  │ └──────────────────────────┘ │  │                │ │
│  │          │  │ ┌──────────────────────────┐ │  │                │ │
│  │          │  │ │ Monaco editor (Dance     │ │  │                │ │
│  │          │  │ │ emulator host)           │ │  │                │ │
│  │          │  │ └──────────────────────────┘ │  │                │ │
│  └──────────┘  └──────────────────────────────┘  └────────────────┘ │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │  Verifier (subscribes to editor events + emulated Dance bus)     ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### Layered packages (single `src/` tree, imports go inward)

```
src/
  data/            # Static data: kak ref, dance ref, discrepancies, mappings
  layout/          # Keyboard layout tables and conversion functions
  bindings/        # keybindings.json parser, command registry, coverage
  emulator/        # Monaco-based Dance behaviour mock + selection model
  lessons/         # Lesson DSL, runtime, verifier, golf challenges
  ui/              # React components (shadcn pieces under ui/components/ui)
  app/             # Routing, providers, layout shell
  pwa/             # Manifest icons, sw registration
```

## 6. Data model

### 6.1 Canonical Kakoune action

```ts
interface KakAction {
  id: string; // e.g. "kak.normal.seek.t"
  mode: "normal" | "insert" | "select" | "view" | "object" | "match";
  defaultKeys: KeySeq; // Kakoune's default keystroke (canonical, qwerty)
  description: string;
  category: KakCategory;
  // Mapping to Dance (may be partial)
  dance?: {
    commandId: string; // e.g. "dance.seek"
    args?: Record<string, unknown>;
    // notes: ways Dance behaviour deviates from Kak for this action
    discrepancies?: Discrepancy[];
  };
}
```

### 6.2 KeySeq — internal representation of a key sequence

```ts
type Modifier = "ctrl" | "alt" | "shift" | "cmd";

interface KeyChord {
  modifiers: Modifier[];
  // Either a layout-dependent character ("t") or a layout-independent code ("KeyT")
  key:
    | { kind: "char"; char: string } // depends on OS layout
    | { kind: "code"; code: string } // [KeyT], [Comma], [Digit1], …
    | { kind: "named"; name: NamedKey }; // Escape, Enter, Tab, F1, …
}

type KeySeq = KeyChord[];
```

VS Code's keybinding format already mixes these (e.g. `"shift+alt+[KeyW]"` and `"escape"`).
The parser normalises VS Code strings into `KeySeq[]` (whitespace separates chords for
multi-key sequences in VS Code's own grammar; we keep that behaviour).

### 6.3 Resolved binding

```ts
interface ResolvedBinding {
  // From the user's file:
  raw: string; // verbatim "key" string
  sequence: KeySeq;
  command: string; // dance.<command>, dance.run, dance.openMenu, ...
  args?: unknown;
  when?: string; // raw VS Code 'when' clause
  whenAst?: WhenAst; // parsed boolean expression
  // Inferred:
  dance?: { commandId: string; args?: unknown };
  isNegation: boolean; // "-foo" disables a default binding
  isDanceMenu: boolean; // dance.openMenu — recursed for nested keys
  isDanceRun: boolean; // dance.run — synthesised from sub-commands
  syntheticActions?: KakAction["id"][]; // for run/menu, what abstract actions it covers
}
```

### 6.4 Lesson DSL

Lessons are TypeScript modules (no separate format) returning a typed object. This keeps
authoring simple, lets agents author in parallel, and gives us full IDE help.

```ts
interface Lesson {
  id: string; // "basics/01-cursor-motion"
  folder: string; // "basics"
  title: string;
  blurb: string; // 1-2 sentences for sidebar
  est_minutes: number;
  // Pre-requisites: action ids the user must already understand
  requires: KakAction["id"][];
  // Things this lesson teaches
  teaches: KakAction["id"][];
  // Discrepancy callouts to surface in this lesson
  discrepancies?: Discrepancy["id"][];
  // Initial editor state
  initial: EditorState;
  // Goal predicate plus narrative
  steps: Step[];
}

interface Step {
  // Markdown narration shown by Clippy. Supports {{key:<id>}} tokens.
  narrate: string;
  // Optional inline hint shown after N seconds of inactivity
  hint?: string;
  // What the verifier looks for
  goal: Goal;
  // Optional cleanup hook between steps
  reset?: "preserve" | "initial" | EditorState;
}

type Goal =
  | { kind: "text-equals"; expected: string }
  | { kind: "selections-equal"; ranges: Range[] }
  | { kind: "cursor-at"; line: number; col: number }
  | { kind: "command-fired"; id: KakAction["id"]; count?: number }
  | { kind: "register"; name: string; equals: string }
  | { kind: "all"; goals: Goal[] }
  | { kind: "any"; goals: Goal[] };
```

Lesson files live as `src/lessons/content/<folder>/<id>.lesson.ts` and are auto-discovered
through `import.meta.glob`.

### 6.5 Vim Golf demo

```ts
interface GolfDemo {
  id: string; // hex from mawww/golf
  title: string; // human-friendly summary derived from in→out
  input: string;
  output: string;
  // The original Kak solution, parsed into chords
  kakSolution: { raw: string; chords: KakChord[]; length: number };
  // Optional Dance translation, keystroke-equivalent in user's bindings
  danceSolution?: { chords: KeySeq; length: number };
  // Optional commentary
  commentary?: string;
}
```

## 7. Keyboard layout system (deep dive)

### 7.1 Concepts

Three pieces of information per key event:

1. **Physical position** — `KeyT`, `Comma`, `Digit3`, identical across layouts, what VS Code
   uses inside `[…]`.
2. **OS-layout character** — what the OS produces when that physical key is pressed under
   the chosen layout (e.g. Colemak's `KeyT` → `f`, Dvorak's `KeyT` → `y`).
3. **Hardware-printed character** — what is engraved on the user's physical keyboard. Most
   users have a QWERTY-printed keyboard regardless of the OS layout they actually use.

We model layouts as immutable tables in `src/layout/tables/`:

```ts
// src/layout/tables/qwerty.ts
export const qwerty: LayoutTable = {
  id: "qwerty",
  label: "QWERTY (US)",
  // Indexed by KeyboardEvent.code
  keyToChar: {
    KeyA: { lower: "a", shift: "A" },
    KeyB: { lower: "b", shift: "B" },
    // …complete 47-key main block + digits + symbols
  },
};
```

We ship: `qwerty`, `qwerty-uk`, `colemak`, `colemak-dh`, `dvorak`, `programmer-dvorak`,
`workman`, `azerty-fr`, `qwertz-de`. Adding more is adding a table.

### 7.2 The two-layout user model

The user picks two layouts (each can default to QWERTY):

```ts
interface UserLayoutPrefs {
  os: LayoutId; // what the OS produces
  printed: LayoutId; // what's printed on the physical keys
}
```

If `os === printed` (the common case), nothing is hidden in suggestions. If they differ, a
muted secondary glyph appears alongside every key chip.

### 7.3 Resolution algorithm

For a Kakoune action with default key chord `c`:

```
function renderKey(c: KeyChord, bindings: ResolvedBinding[], prefs: UserLayoutPrefs): KeyView
  // 1. Find the user's binding (if any) whose target action matches c.action.
  //    If not bound, fall back to the canonical chord.
  bound = findBindingForAction(c.action) ?? canonical(c)

  // 2. Normalise to a physical position when possible.
  //    Dance uses "[KeyT]" forms in this user's file, so we already have a code.
  //    If the binding uses a bare char ("t"), we treat that as OS-layout char and
  //    inverse-look-up the physical key under prefs.os to get a code.
  position = toPhysicalCode(bound, prefs.os)

  // 3. Compute the three letters.
  canonical = bound.canonicalLetter           // what Kak docs say (e.g. "T")
  osLetter = lookup(prefs.os).keyToChar[position][shifted]   // what your OS sends
  printedLetter = lookup(prefs.printed).keyToChar[position][shifted]

  return { canonical, osLetter, printedLetter, modifiers: bound.modifiers }
```

The UI (`<KeyChip>`) then chooses a presentation:

- All three identical → show one big letter.
- `printedLetter !== canonical` → big canonical + small printed in subscript with a tooltip
  ("look for the **F** key on your keyboard").
- `osLetter !== canonical` → also annotate with what the OS will send.

### 7.4 `[KeyX]` parsing

VS Code's grammar is documented but informal. We support, in order:

- `[KeyA]`–`[KeyZ]` → letter codes
- `[Digit0]`–`[Digit9]`
- `[Numpad0]`–`[Numpad9]`
- `[Comma]`, `[Period]`, `[Slash]`, `[Backslash]`, `[Quote]`, `[Backquote]`,
  `[Semicolon]`, `[Equal]`, `[Minus]`, `[BracketLeft]`, `[BracketRight]`,
  `[IntlBackslash]`, `[IntlYen]`
- Named keys without brackets: `escape`, `tab`, `enter`, `space`, `backspace`, `delete`,
  `home`, `end`, `pageup`, `pagedown`, `up`, `down`, `left`, `right`, `f1`–`f24`
- Bare `a`–`z`, `0`–`9`, `,`, `.`, `/`, `\`, `;`, `'`, `` ` ``, `[`, `]`, `=`, `-` →
  treated as char (layout-dependent).

Parser source: `src/bindings/parseKey.ts`. It outputs `KeyChord` values that other layers
consume.

## 8. Lesson framework

### 8.1 Runtime overview

```
KeyboardEvent ─┐
               │   handles physical key + modifier
               ▼
     Layout decoder ──→ KeyChord (always with code)
                         │
                         ▼
              Binding matcher (against user's
              keybindings.json + Dance defaults)
                         │
                         ▼
                Dance command dispatcher (mock)
                         │
                         ▼
                Monaco mutation + selection update
                         │
                         ▼
                  Verifier → Clippy reactions
```

### 8.2 Dance emulator on Monaco

Monaco does not know Dance. We implement a small subset of Dance behaviour:

- Selection is _always_ non-empty (Kak/Dance invariant). If a Monaco selection is empty we
  inflate it to one character right of the caret on focus.
- Modes: `normal`, `insert`, `select`, `match`, `view`, `object`. A mode statusbar shows
  the current mode.
- The dispatcher accepts a `dance.<command>` id and `args` and applies a deterministic
  transformation to `{ text, selections, registers }`.
- `dance.run` is interpreted: we whitelist a small set of `vscode.commands.executeCommand`
  calls that we know about, and short-circuit unknown ones with a "this dance.run uses
  custom JS — running canonical fallback" notice. (We don't actually evaluate the JS string
  for safety.)

The emulator is implemented as `src/emulator/dance.ts`. It is the same code path that
verifies user input and that runs replay-mode demos for Vim Golf.

### 8.3 Verifier

The verifier subscribes to `(text, selections, mode, registers, commandLog)` after every
command. After each dispatch it checks the current step's `Goal`:

- `text-equals` compares full editor text after newline normalisation.
- `selections-equal` compares the set of `{ anchor, active }` ranges, order-independent.
- `command-fired` watches `commandLog` for the right id (and count if specified).
- Composite `all` / `any` short-circuits.

If matched: Clippy emits the success line and the lesson advances. If the user is
inactive for `step.hintAfterMs` (default 12 s), Clippy surfaces `step.hint`.

### 8.4 Clippy

Clippy is a cosmetic + behavioural component, not a brand. He is an SVG paperclip with
animation states (`idle`, `pointing`, `talking`, `cheering`, `sleeping`). His copy is
generated from a few archetypes:

```
intro       → "Welcome to lesson <n>. Today we …"
hint        → "Stuck? Try {{key:dance.select.right.jump}}."
success     → "Nice! That's the move."
discrepancy → "Heads up: in real Kakoune, this would also …; Dance does … instead."
missing-key → "You haven't bound this. The default would be {{kakkey:t}}."
```

Strings live in `src/ui/clippy/lines.ts` so they can be tone-tweaked centrally.

## 9. Coverage analyzer

Three diff sets, computed once on upload:

1. **Dance commands not bound** — every Dance command in the canonical list that has no
   binding (or only `-` negations) in the user's file. Sidebar badge: "X unbound".
2. **Kakoune actions with no Dance equivalent** — actions in the canonical Kak ref whose
   `dance` property is `undefined`. Shown in a "Kak-only" panel (and as inline callouts in
   relevant lessons).
3. **Discrepancies** — entries in `src/data/discrepancies.ts`. Each links to a Kak action
   id, a Dance command id, a category (`semantics` / `arguments` / `mode-side-effect`),
   and prose.

The analyzer page (`/coverage`) shows three searchable, sortable tables.

## 10. Discrepancy catalog (initial)

Curated from Dance README + my testing. Lessons reference these by id so the same prose is
shown wherever relevant.

| id                        | kak                      | dance                             | summary                                                  |
| ------------------------- | ------------------------ | --------------------------------- | -------------------------------------------------------- |
| `disc.selection.shape`    | block cursor on cell     | line cursor by default            | Selection looks like a vertical bar; toggle in settings. |
| `disc.register.default`   | `"` register is internal | `"` mirrors clipboard             | Yank goes to system clipboard.                           |
| `disc.pipe.shell`         | `\|` runs shell          | `\|` evaluates JS expression      | Pipe is "pipe expression", not shell.                    |
| `disc.linenumbers`        | not applicable           | mode toggles VS Code line numbers | Caused by Dance's mode hook.                             |
| `disc.macro.q`            | record/play with `q`     | `dance.history.recording.*`       | Recording UI differs.                                    |
| `disc.objects.tree`       | regex-based              | tree-sitter-based (experimental)  | `dance.seek.syntax.*`.                                   |
| `disc.search.case`        | smart-case via opts      | regex literal as input            | No "smart" by default; use `.smart`.                     |
| `disc.tabstop.@`          | `@` converts tabs↔spaces | no direct equivalent              | Surface as Kak-only.                                     |
| `disc.history.selections` | `<a-u>` selection undo   | `dance.history.undo.selections`   | Same idea, different key.                                |

(More entries are added as lessons are authored — the discrepancy file is append-only.)

## 11. PWA configuration

- Manifest: `name`, `short_name`, `theme_color: #0f172a`, `background_color: #0f172a`,
  `display: standalone`, two icons (192/512) generated at build time.
- Workbox precache: app shell + lesson assets + reference data.
- Runtime caches: none (everything is shipped).
- "Add to home screen" prompt deferred until 2nd visit.
- `registerType: "autoUpdate"` with a SkipWaiting flow that surfaces a toast.

## 12. CI/CD (GitHub Actions)

- `.github/workflows/check.yml` (PRs):
  - `pnpm install --frozen-lockfile`
  - `pnpm exec oxlint .`
  - `pnpm exec oxfmt --check .`
  - `pnpm exec tsgo --noEmit`
  - `pnpm test`
- `.github/workflows/deploy.yml` (push to `main`):
  - same checks, then
  - `pnpm build` (Vite, with `BASE_URL` from repo name)
  - `actions/upload-pages-artifact`
  - `actions/deploy-pages`

`vite.config.ts` reads `process.env.GITHUB_REPOSITORY` to derive `base` (`/<repo>/`).

## 13. Project structure

```
dance-training/
├── data/                          # vendored reference data
│   ├── golf/                      # 213 vim-golf challenges (in/out/cmd)
│   ├── vimtutor/tutor1.txt
│   └── (generated by scripts at build time:)
│       ├── dance-commands.json
│       └── kak-reference.json
├── docs/
│   └── DESIGN.md                  # this file
├── public/                        # static, included in build root
│   ├── icons/                     # PWA icons (192, 512, maskable)
│   └── samples/keybindings.json   # demo bindings for "try without uploading"
├── scripts/
│   ├── build-kak-ref.ts           # parse the kak shortcut HTML once
│   └── build-dance-ref.ts         # parse the dance package.json once
├── src/
│   ├── data/
│   │   ├── kakReference.ts        # KakAction[] (generated import + manual fixes)
│   │   ├── danceCommands.ts       # full canonical command list
│   │   └── discrepancies.ts
│   ├── layout/
│   │   ├── tables/{qwerty,colemak,…}.ts
│   │   └── resolve.ts             # toPhysicalCode, resolveKey, KeyView
│   ├── bindings/
│   │   ├── parseKey.ts            # "shift+alt+[KeyW]" → KeyChord
│   │   ├── parseKeybindings.ts    // load + normalise user JSON
│   │   ├── coverage.ts            // diff vs canonical sets
│   │   └── findBinding.ts         // action id → ResolvedBinding | null
│   ├── emulator/
│   │   ├── dance.ts               // command dispatcher
│   │   ├── selectionModel.ts
│   │   └── monacoBridge.tsx       // React component embedding Monaco
│   ├── lessons/
│   │   ├── runtime.tsx            // LessonRunner component
│   │   ├── verifier.ts
│   │   ├── catalog.ts             // import.meta.glob('content/**/*.lesson.ts')
│   │   ├── content/
│   │   │   ├── 01-vimtutor/        # vimtutor adapted (10–15 lessons)
│   │   │   ├── 02-basics/          # h/j/k/l, modes, escape
│   │   │   ├── 03-selections/      # selection-as-state
│   │   │   ├── 04-multi-cursor/    # split, filter, rotate, align
│   │   │   ├── 05-search-replace/  # /, ?, n, N, s, S
│   │   │   ├── 06-text-objects/    # word, paragraph, brackets
│   │   │   ├── 07-registers/       # yank, paste, named regs
│   │   │   ├── 08-macros/          # recording
│   │   │   ├── 09-view/            // scroll/center/lock
│   │   │   ├── 10-edit-power/      // align, copy-indent, pipe
│   │   │   └── 99-golf/            // demos w/ explanations
│   │   └── golf/
│   │       ├── catalog.ts          // generated from data/golf
│   │       └── runner.tsx          // Replay component
│   ├── ui/
│   │   ├── components/ui/          # shadcn primitives
│   │   ├── clippy/                 // SVG, animations, lines
│   │   ├── KeyChip.tsx             // canonical/printed/os letters
│   │   ├── Sidebar.tsx
│   │   └── …
│   ├── app/
│   │   ├── App.tsx                 // routes
│   │   ├── store.ts                // zustand
│   │   └── providers.tsx
│   ├── pwa/
│   │   └── registerSW.ts
│   ├── main.tsx
│   └── styles.css
├── tests/                         # vitest specs
├── .github/workflows/{check,deploy}.yml
├── .gitignore
├── .oxlintrc.json
├── .oxfmt.json
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── vite.config.ts
```

## 14. Lesson catalog (initial folders & lessons)

Each entry is one lesson file. Numbers are an authoring order, not a strict ordering for
the user — folders can be done in any order once basics are done.

### 14.1 `01-vimtutor` (Vim's tutor adapted to Kakoune+Dance)

Translates each numbered Vim lesson into Kakoune semantics, replacing `dw` (delete word)
with the Kakoune equivalent (`w` selects, `d` deletes), etc.

1. **1.1 Cursor motion** — `h j k l`, intro to selections-always-non-empty.
2. **1.2 Exiting** — `:q!` / Dance: closing the editor doesn't apply, so we re-frame as
   "switching back to insert mode and continuing".
3. **1.3 Deletion of a character** — Kak `d` requires a selection first; `xd` not `x`.
4. **1.4 Inserting** — `i` vs `a` vs `o`/`O`. Highlights Dance's caret-by-default.
5. **1.5 Appending at line end** — `A`.
6. **2.1 Word motion** — `w b e` and `<a-w> <a-b> <a-e>` for WORDs.
7. **2.2 Position to start/end** — `<a-h>` / `<a-l>`.
8. **2.3 Counts** — `<count>w` etc.
9. **2.4 Operators on selections** — Kak's "select-then-act" inversion of Vim.
10. **3.1 Put / paste** — `y p P <a-p> <a-P>`.
11. **3.2 Replace one char** — `r`.
12. **3.3 Change** — `c` keeps the verb-last spirit but acts on selection.
13. **4.1 Locating** — `g g`, `gg`, `G`/`<a-G>`.
14. **4.2 Search command** — `/` and `?`, `n N <a-n> <a-N>`.
15. **4.3 Match parens** — `m M`.
16. **5.1 Save & quit** — Dance's reality (`workbench.action.files.save`).
17. **6.1 Open below/above** — `o O`.
18. **6.2 Yank line / yank selection** — `y` always operates on selection.
19. **7.1 Help** — point at our coverage page.

### 14.2 `02-basics`

20. **Modes overview** — normal/insert/select. Discrepancy: `disc.linenumbers`.
21. **Escape & mode-set-temporarily** — `<a-;>` and how Dance binds it.
22. **Direction of selection** — `;`, `<a-;>`, `<a-:>`.
23. **Scroll and center** — `v` menu (Dance binds it as a menu, our user has it).

### 14.3 `03-selections`

24. **Selection is the noun** — philosophy step + small drill.
25. **Trim** — `_`.
26. **Expand to lines** — `x`, `<a-x>`.
27. **Whole buffer** — `%`.
28. **Reduce to cursor** — `;`.
29. **Splits at line boundary** — `<a-s>`.

### 14.4 `04-multi-cursor`

30. **Add cursor next match** — `N` vs `n`.
31. **Split by regex** — `s` then enter regex.
32. **Filter selections** — `<a-k>` / `<a-K>`.
33. **Keep only main / clear secondary** — `,` and `<a-,>`.
34. **Rotate** — `(` `)` `<a-)> <a-(>`.
35. **Align** — `&`. Show `dance.edit.align`.
36. **Copy indent** — `<a-&>`.
37. **Sort selections** — `dance.selections.sort` (no Kak default key — point this out).
38. **Pipe** — `|`. Discrepancy: `disc.pipe.shell`.

### 14.5 `05-search-replace`

39. **Forward search** — `/`.
40. **Backward search** — `?`.
41. **n / N / a-n / a-N**.
42. **Search current selection** — `<a-*>` analog (`dance.search.selection`).
43. **Smart variant** — discrepancy `disc.search.case`.
44. **Replace via search + paste** — `R`.

### 14.6 `06-text-objects`

45. **Object menu** — `<a-i>` and `<a-a>` (Dance's `dance.seek.askObject*`).
46. **Word object** — `<a-i>w`.
47. **Sentence/paragraph**.
48. **Bracket pairs** — including custom open/close.
49. **Indent object** — `<a-i>i`.
50. **Tree-sitter syntax object** — discrepancy `disc.objects.tree`.

### 14.7 `07-registers`

51. **Default register** — discrepancy `disc.register.default`.
52. **Named registers** — `"<r>` prefix; Dance `dance.selectRegister`.
53. **Insert register contents** — `<c-r>` in insert.
54. **Paste from named register**.

### 14.8 `08-macros`

55. **Record & play** — `Q` analog → `dance.history.recording.start/stop/play`.
56. **Counts** — replay N times.

### 14.9 `09-view`

57. **`v` menu**.
58. **Lock view** — `V`.
59. **Half-page scroll** — `<c-d> <c-u>`.

### 14.10 `10-edit-power`

60. **Indent / deindent** — `> < <a-> <a-<`.
61. **Case** — `` ` ~ <a-`> ``.
62. **Tabstop** — `@`. Surface as Kak-only on most users (no default Dance map).
63. **Newlines without leaving normal** — `<a-o> <a-O>`.

### 14.11 `99-golf`

For each chosen golf challenge: an explanation page + a "watch the keys" replay using the
emulator. The user can then attempt the same diff themselves and the verifier checks the
final text matches.

We bootstrap with **20 hand-picked challenges** out of the 213, chosen to cover diverse
skills (regex split, multi-cursor align, pipe, etc.). The other 193 land in a separate
"More challenges" page with auto-replay.

## 15. Authoring lessons in parallel

The lesson DSL is a TS file per lesson. To parallelise authoring, the lessons are split
into folder buckets, and each bucket is delegated to a separate sub-agent with:

- The lesson schema (this doc, §6.4).
- The list of `KakAction` ids that belong to its folder.
- The discrepancy ids that fall into its folder.
- The expected file layout (`src/lessons/content/<folder>/`).

After all agents finish, a consolidator pass:

- Imports every file via `import.meta.glob`.
- Validates `requires`/`teaches` against the canonical action list at startup.
- Builds the sidebar tree from the catalog.

## 16. Future work — running the real Dance extension

Today's emulator is hand-rolled: every Dance command in `src/emulator/dance.ts`
is a small TypeScript function that mutates `EditorState`. It covers the
commands lessons need (motion, edit, paste, replace, case, search, pipe, colon)
but it is **not** the same code path Dance ships in VS Code. So edge cases
inevitably drift — different word-boundary handling, missing object-class
behaviours, no tree-sitter syntax objects, and so on.

The honest fix is to **load the real Dance extension on top of a polyfilled
VS Code API**. The shape of that effort:

1. **Polyfill `vscode`** — implement enough of `vscode.window`,
   `vscode.workspace`, `vscode.commands`, `vscode.Position`, `vscode.Range`,
   `vscode.Selection`, `vscode.TextEditor`, `vscode.TextDocument`,
   `vscode.Uri`, `vscode.EventEmitter`, `vscode.Disposable`, and the
   command-keybinding registry that Dance touches.
2. **Bridge to Monaco** — back the polyfill's `TextEditor` and
   `TextDocument` with Monaco's model so edits flow both ways.
3. **Vendor compiled Dance** — pull the compiled `dance.js` from the
   published VSIX, expose our polyfill to it via a module shim
   (`vite-plugin-virtual` resolving the `vscode` import to our module).
4. **Trigger keybindings the way VS Code does** — read Dance's
   `package.json` contributes.keybindings + the user's overrides,
   evaluate `when` clauses against our context map, and dispatch by
   command id instead of running our own dispatcher.

`@codingame/monaco-vscode-api` does most of step 1 (and steps 2 & 4) already
but it adds ~10 MB to the bundle and changes how Monaco is instantiated; it
is closer to "VS Code in the browser" than "Monaco with extras". A leaner
in-house polyfill of the ~30-method subset Dance actually uses is
plausible but takes a few days of careful work — bigger than a single
iteration. In the meantime the emulator's gaps are tracked here:

- No tree-sitter syntax objects (`dance.seek.syntax.*`).
- Word boundaries are ASCII-only (`/[A-Za-z0-9_]/`); real Dance defers to VS
  Code's word-pattern config.
- No live regex preview during `/` or `s`.
- Macros are partially recorded but not replayed.
- `>` and `<` indent by hard-coded two spaces, not the editor's tab stop.

When the real-Dance backplane lands, the emulator becomes a fallback for
the demos that ship without bindings.

## 17. Risks & open questions

- **Monaco fidelity.** Some Kakoune-isms (selection-always-non-empty, multi-selection at
  the model level) don't map 1:1 to Monaco. We work around it; lessons that depend on
  edge cases (e.g. `_` trim on EOL) get a warning.
- **`dance.run` JS.** We don't sandbox-execute; we whitelist patterns. Lessons avoid
  depending on `dance.run`-only behaviour where possible.
- **Layout completeness.** Initial 9 layouts cover ~95 % of users; rare layouts (BÉPO,
  Russian phonetic) ship later.
- **Vimtutor licence.** Vim is Charityware; reproducing the _prose_ requires permission.
  We adapt — paraphrase + restructure for Kakoune — rather than copy verbatim.
- **Golf cmds with `:` commands.** Some Kak golf solutions use `:` colon-mode commands.
  Replay falls back to "show the keystrokes, narrate the effect" when the emulator can't
  execute a `:` command.
