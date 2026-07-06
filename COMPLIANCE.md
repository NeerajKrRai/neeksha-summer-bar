# Google Play — Children's App Compliance & Launch Checklist

App: **Neeksha's Summer Bar** (`com.neeksha.summerbar`) — Capacitor Android app, fully offline.
This file is the launch runbook for Neeraj. Items marked ☐ need a human (account owner) to do them.

## Why this app is easy to make compliant

The app collects **zero data**: no accounts, no ads, no analytics, no third-party
SDKs, no network calls (fonts are self-hosted; the Android manifest declares **no
permissions at all**, not even INTERNET). That eliminates almost the entire
COPPA / UK-GDPR / Families-policy surface. The remaining work is declarations
and store assets, not engineering.

## 1. Developer account

- ☐ Google Play developer account — one-time **$25** fee (use a parent account; Play requires account holders to be 18+).
- ☐ Identity verification (individual: ID + address; can take a few days).
- ⚠️ **Closed-testing requirement:** personal accounts created after Nov 13 2023
  must run a **closed test with a minimum number of opted-in testers (12–20,
  Google has adjusted this — check Play Console at submission) for 14
  continuous days** before production access unlocks. Plan for this: recruit
  family/friends with Android phones early. This is usually the longest pole.

## 2. Target audience & Families policy

- ☐ In *Policy → App content → Target audience*, declare children's age groups
  (suggest **5 and under? No — pick 6–8** as primary; you may select multiple).
  Selecting any child group makes the **Families Policy** mandatory — this app
  already conforms:
  - No ads, no cross-promotion. ✓
  - No purchases (v1). ✓
  - No location, camera, mic — no permissions whatsoever. ✓
  - No social features, no user-generated content leaves the device. ✓
  - Content is make-believe fruit/herb/tea drinks; no alcohol references.
    (The word "cocktail" with 🍸/🍹 imagery in a clearly pretend, child-styled
    context has precedent in Families apps — e.g. pretend-kitchen games — but
    the reviewer has discretion; if pushed back, rename to "mocktails"/
    "refreshments" in the listing copy first, in-app second.) ✓
  - ☐ Optionally apply to the **Teacher Approved** program (extra review, better placement).

## 3. Data safety form & privacy policy

- ☑ **DONE** — privacy policy is live at
  **https://apps.neeksha.com/summer-bar/privacy.html** — paste that URL in
  *App content → Privacy policy*.
  Hosting architecture: `apps.neeksha.com` is the GitHub **user site**
  (repo `NeerajKrRai.github.io`, a "Neeksha's Apps" hub landing page); every
  project repo serves beneath it — this app (repo `summer-bar`) at
  **https://apps.neeksha.com/summer-bar/**. DNS: single Cloudflare CNAME
  `apps → neerajkrrai.github.io`, **proxied (orange)** with SSL/TLS mode
  "Full" + Always Use HTTPS — TLS is Cloudflare's edge cert. (GitHub's own
  cert can't issue while proxied; if "Full (strict)" is ever wanted, flip
  the record grey for an evening, let GitHub mint its cert, flip back.)
  Redeploy the app by refreshing its `gh-pages` branch from `HEAD:www`.
- ☐ Data safety form: answer **No** to data collection and sharing throughout.
  (Truthful because: no network permission → no transmission is possible.)

## 4. Content rating (IARC)

- ☐ Fill the IARC questionnaire honestly (no violence, no gambling — note the
  Sakura Glaze shop uses pretend points earned by play, no real money, no
  randomised loot). Expected result: **Everyone / PEGI 3**.

## 5. Build & signing (on your Mac)

```bash
npm install            # once
npx cap sync android   # after ANY change to www/
npx cap open android   # opens Android Studio (bundles its own JDK)
```
- ☐ In Android Studio: **Build → Generate Signed App Bundle** → create a
  keystore (keep it + passwords in a password manager; `.gitignore` already
  excludes keystores) → produce the `.aab`.
- ☐ Enroll in **Play App Signing** when uploading (recommended default).
- Target SDK: Capacitor 8 targets a current API level, satisfying Play's
  target-API policy for new apps. Revisit yearly.
- Orientation is locked to portrait (`userPortrait`) — matches the design.

## 6. Store listing assets

- App icon 512×512: `www/icons/icon-512.png` ✓ (generated, on-palette)
- ☐ Feature graphic 1024×500 (required) — ask Claude to generate one.
- ☐ At least 2 phone screenshots (take from the app; 4–8 recommended).
- ☐ Short description (80 chars) + full description. Lead with "make-believe",
  "pretend play", "no ads, no in-app purchases, no internet needed".

## 7. Monetisation options (Neeraj's question — the honest picture)

| Option | Allowed for kids? | Effort | Notes |
|---|---|---|---|
| **Free, no monetisation (recommended for v1)** | ✓ | none | Fastest approval; keeps the zero-data story pure; you can add paid extras later. |
| **Paid app** (one-time £1.99–£3.99) | ✓ | tiny | Families-friendly and simple, but paid walls crush discovery for unknown apps. Purchases go through Google's flow (Family Link parental approval applies). |
| **One-time IAP unlock** (e.g. "Deluxe Pantry Pack") | ✓ with rules | medium | Must use Google Play Billing (needs a Capacitor billing plugin); Families rules ban manipulative prompts ("buy now!!", timers, nagging characters). A simple non-consumable unlock needs **no backend** — Play manages the receipt; local entitlement check is fine at this scale. |
| **Ads** | technically, via Families-certified SDKs only | high | **Strongly advise against.** An ad SDK reintroduces data collection (destroys the all-"No" data-safety form, complicates the privacy policy, requires the INTERNET permission back), and the certified-SDK rules are strict. Not worth it here. |

Realistic expectation: niche kids' apps earn little; treat any of these as
pocket-money mechanics, not revenue. If you want one for the experience, the
one-time "Deluxe Pantry" unlock is the natural fit (more VIP ingredients,
extra straw colours) — say the word and it can be built.

## 8. Backend infrastructure — none required

- The app is 100% client-side; state lives in WebView localStorage.
- No servers to run, ever, for the current feature set.
- Only quasi-infrastructure: a public URL for the privacy policy (static page),
  and optionally static hosting (Netlify/GitHub Pages) if you also want the
  free web/PWA version shareable. Neither is a backend.
- If you later add cloud sync/sharing, that changes everything (COPPA/UK-GDPR
  data-controller obligations) — decide deliberately, not by accident.

## 9. Domain & edge security (configured 6 Jul 2026)

Applied on the `neeksha.com` Cloudflare zone: SPF `v=spf1 -all` + DMARC
`p=reject` + null DKIM (nobody can spoof @neeksha.com email), DNSSEC enabled
(verify it left "pending"), minimum TLS 1.2, HSTS 6-month, and a transform
rule adding `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin` to all responses.
Deliberately NOT set: `Permissions-Policy` (would block the motion sensors
tilt-to-sip needs). Manual/dashboard items: Bot Fight Mode toggle, 2FA on
GitHub + Cloudflare accounts. If Cloudflare **Web Analytics** is ever enabled,
add an honest "cookieless visitor counting on the website" line to
`www/privacy.html` — the Android app remains zero-network regardless.

## 10. Known creative quirks (left as-is — Neeksha's art direction)

- Store item "Crystal Spoon" uses 🩴 (a sandal) and "Blossom Stirrer" uses 🪥
  (a toothbrush). Possibly intentional 8-year-old whimsy. Ask the boss. 🌸
