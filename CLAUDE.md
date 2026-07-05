# CLAUDE.md — Neeksha's Summer Refreshment Bar

Kawaii make-believe cocktail-maker app built by **Neeksha (age 8)** with Claude; her dad **Neeraj** is continuing it here. Currently a single self-contained HTML file, headed toward PWA + Android.

## Read first

**`HANDOVER_for_Neeraj.md`** is the full handover: all 9 screens, features, localStorage keys, known issues, and the packaging roadmap. Don't skip it.

## Hard constraints

- **Age-appropriate always** — Neeksha is 8. All "cocktail" content is imaginary make-believe (fruits, herbs, tea — no alcohol references). Defer parental decisions to Neeraj.
- **Keep the aesthetic** — kawaii/anime visual language, kaomoji characters `♪( ´∀｀)` `人(´∀｀ )♪`, soft palette (rosy charcoal `#2B2B2B`, royal green `#2D6A4F`/`#52B788`, dusty rose `#C97B84`), Playfair Display + DM Sans.
- **No backend** — runs entirely in the browser; state lives in localStorage (`nk_ck`, `nk_glaze`, `nk_owned`, `nk_chef`).

## Gotchas (learned the hard way — see handover §Known Issues)

- Some **kaomoji contain hidden backticks** that break JS template literals. After editing anything near kaomoji strings, extract the inline `<script>` and run `node --check` on it.
- Don't store generated images in localStorage (`QuotaExceededError`) — generate fresh on download.
- No `confirm()` dialogs — blocked on many mobile browsers.
- Don't rely on `event.target` inside arrow functions — pass the element as a parameter.

## Current state & roadmap

- `neeksha-summer-app.html` (~2,030 lines: ~530 CSS, ~1,170 JS) — the whole app. JS syntax verified clean as of import.
- Roadmap from handover: **1)** split into multi-file structure (index.html, css/, js/ modules) → **2)** PWA (manifest.json + service worker) → **3)** Android via Bubblewrap/TWA or Capacitor → Play Store. Polish ideas: Web Audio ASMR, straw animation, haptics, time-of-day beach.

## Working style

Neeksha communicates in short bursts and redirects mid-build — adapt quickly, don't over-explain. When she's driving, keep responses playful and visual.
