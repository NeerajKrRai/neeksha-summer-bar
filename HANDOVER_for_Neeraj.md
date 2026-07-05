# 🍹 Neeksha's Summer Refreshment Bar — Claude Code Handover

> **Hi Neeraj!** Neeksha has been building this app over several sessions with Claude. This document gives you everything you need to continue the project in **Claude Code** and eventually ship it to Android.

---

## 📦 What's Been Built

A single-file HTML app (`neeksha-summer-app.html`) — **~109KB**, self-contained, no dependencies except Google Fonts. It runs entirely in the browser with no backend.

### 9 Screens
| Screen | ID | Description |
|---|---|---|
| Loading | `sLoad` | Orbiting berries, animated cocktail glass |
| Dashboard | `sDash` | Welcome with chef nickname, nav buttons |
| Beach | `sBeach` | Kaomoji girls walk to cocktail stall |
| Fridge | `sFridge` | Pick 3 fruits (step 1 of 4) |
| Freezer | `sFreezer` | Ice, herbs, frozen fruits, herb pack (step 2 of 4) |
| Garnish | `sGarnish` | Decorations + tea bags, done switch (step 3 of 4) |
| Secret Pantry | `sPantry` | VIP ingredients — unlocks at 10 cocktails (step 4 of 4) |
| Drink | `sDrink` | Kaomoji girls sip with custom straws, tilt-to-sip |
| File | `sFile` | Swipeable vertical card carousel of saved cocktails |
| Store | `sStore` | Sakura Glaze merit shop — cutlery, cups, decor |

---

## 🎮 Features Summary

### Core Flow
- Pick 3 fruits → pick ice/herbs → pick garnish → Secret Pantry → sip!
- **Tilt phone** to take imaginary sips (DeviceOrientation API)
- **Done switch** must be flipped twice to proceed from garnish

### Characters
- Two kaomoji girls: `♪( ´∀｀)` and `人(´∀｀ )♪`
- Walk across the beach together with alternating bob animation
- React with **side speech bubbles** during ingredient selection (per ingredient, in English + Japanese style)
- React with **speech bubbles + new kaomoji faces** during sipping

### Special Items
- **🎁 Herb Pack** (freezer) — slides up a modal showing Mint, Thyme, Rosemary, Summer Ginger, Lemon Grass. Swipe down to trash packaging
- **🫖 Mini Tea Bag** (garnish) — slides up modal with 4 iced tea flavours. Swipe down to trash wrapper

### Progression System
- **Cocktail counter** — saves to `localStorage` key `nk_ck`
- **Secret Pantry unlocks at 10 cocktails** — celebration overlay with sparkles + confetti
- Before unlock: shows *"Soz!! Only for VIP!!"* tease with progress bar

### Sakura Glaze (Merits)
- Earn **🌸 +5** per VIP ingredient picked in the Secret Pantry
- Saved to `localStorage` key `nk_glaze`
- **5-petal flower widget** floats top-right, tapping opens the store
- Store has 3 sections: Cutlery, Cups & Glasses, Decor (19 items total)
- Purchases saved to `localStorage` key `nk_owned`

### Other Systems
- **Nickname** — first launch asks for chef name, saves to `nk_chef`
- **Live cocktail preview** — mini glass floats top-right during selection screens, updates as you pick
- **Image export** — Canvas API draws a cocktail card PNG (800×480), downloadable with custom filename
- **Swipeable file** — vertical swipe carousel, dot indicators, delete cards with 🗑
- **Custom straws** — straw picker modal before sipping, 10 colour options each girl

### Design
- **Palette:** Rosy charcoal (`#2B2B2B`), Royal green (`#2D6A4F`/`#52B788`), Dusty rose (`#C97B84`)
- **Fonts:** Playfair Display (headings), DM Sans (body)
- **Audio:** None (Web Audio API not yet implemented)

---

## 🗂️ localStorage Keys

| Key | Value | Description |
|---|---|---|
| `nk_ck` | JSON array | Saved cocktail cards (fruits, ice, garnish, date, name) |
| `nk_glaze` | String number | Sakura Glaze balance |
| `nk_owned` | JSON object | Purchased store items (`{id: true}`) |
| `nk_chef` | String | Chef nickname |

---

## ⚠️ Known Issues & Watch-outs

1. **Backtick kaomoji** — some kaomoji contain hidden backtick `` ` `` characters that break JS template literals. Always run a syntax check after editing kaomoji strings. Use `node --check file.js` to verify.

2. **localStorage quota** — images were previously stored in localStorage causing `QuotaExceededError`. Fixed: images are now generated fresh on download, never stored.

3. **`confirm()` on mobile** — replaced with direct delete (no dialog) because `confirm()` is blocked on many mobile browsers.

4. **`event.target` in arrow functions** — always pass the element directly as a parameter instead of relying on `event.target` inside arrow functions.

5. **Old saved cocktails** — the load filter now keeps all entries with a valid `id`, normalising old formats.

---

## 🚀 Recommended Next Steps for Neeraj

### Immediate (polish)
- [ ] Add Web Audio API ASMR sounds for sipping, ice clinking, bubbles
- [ ] Animate the straw actually going into the glass SVG
- [ ] Add haptic feedback (`navigator.vibrate()`) on sip
- [ ] Make the beach scene time-of-day aware (sunset/night mode)

### Android Packaging Options

#### Option A — PWA + TWA (cheapest, recommended first)
1. Add a `manifest.json` and service worker to make it a **Progressive Web App (PWA)**
2. Use **Bubblewrap** (Google's CLI tool) to wrap the PWA as a **Trusted Web Activity (TWA)**
3. Upload the generated `.aab` to Google Play — one-time $25 fee

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-netlify-url.netlify.app/manifest.json
bubblewrap build
```

#### Option B — Capacitor (more native features)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Neeksha Summer Bar" "com.neeksha.summerbar"
npx cap add android
npx cap open android   # opens Android Studio
```
Then in Android Studio → Build → Generate Signed Bundle → upload to Play Store.

#### Option C — Host on Netlify first (easiest, 5 minutes)
1. Go to [netlify.com](https://netlify.com) → drag and drop the `.html` file
2. Share the URL — works on any phone browser
3. Users can **Add to Home Screen** for an app-like experience

---

## 📁 File Structure (current)
```
neeksha-summer-app.html    ← entire app, single file (~109KB)
HANDOVER_for_Neeraj.md     ← this document
```

### To Convert to Multi-File (recommended before Capacitor)
```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js          (routing, boot)
│   ├── screens.js      (screen builders)
│   ├── data.js         (FRUITS, ICE, GARNISH, VIP_ITEMS, STORE_ITEMS)
│   ├── glaze.js        (merit system)
│   ├── cocktail.js     (glass SVG, canvas export)
│   └── reactions.js    (kaomoji reaction data)
├── manifest.json       (for PWA)
└── sw.js              (service worker for offline)
```

---

## 💬 Notes from Neeksha's Sessions

- Neeksha communicates in short bursts and redirects mid-build — adapt quickly without over-explaining
- Strong aesthetic preferences: kawaii/anime visual language, kaomoji reactions, soft palettes
- All cocktail content is **imaginary make-believe** — not real drinks
- Neeksha is 8 years old — keep content age-appropriate
- Neeraj is the guardian — defer anything requiring parental decision to him

---

## 🌸 Quick Start for Claude Code

Paste this as your first message in Claude Code:

```
I'm continuing a project my daughter Neeksha built with Claude. 
It's a single HTML file called neeksha-summer-app.html — a kawaii 
summer cocktail maker app. Please read the HANDOVER_for_Neeraj.md 
file first, then read neeksha-summer-app.html, and help me:
1. Convert it to a proper multi-file PWA structure
2. Add a manifest.json and service worker
3. Package it for Android using Capacitor

The app must stay age-appropriate (she's 8). All cocktail content 
is imaginary/make-believe.
```

---

*Built with love by Neeksha 🍹 — ♪( ´∀｀)人(´∀｀ )♪ ～♥︎*
