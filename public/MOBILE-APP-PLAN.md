# Plan: Tunnelbanebingo as a real mobile app

## Context

The current app is a Nuxt 4 SPA (`ssr: false`) deployed as static output to GitHub Pages. It already has the right shape for a mobile port: no SSR, all state local, Google Drive sync handles "your account, anywhere" already, OAuth client ID is the only real secret in the public bundle, and the only server route (`server/api/vehicles.get.ts`) exists solely to hide the Trafiklab key.

The goals: (a) be on the App Store and Google Play, (b) update data and rotate API keys without re-submitting, and (c) explore three new features that only really make sense in a native context: live "go somewhere closer" GPS mode, a party-game multi-user sync, and an opt-in heatmap of past locations stored locally.

---

## Q1 — Best framework for the existing Vue/Nuxt setup

**Recommendation: Capacitor** (with `@nuxt/capacitor` if it ends up easier than the bare CLI; otherwise plain Capacitor + `nuxt generate`).

Why this and not the alternatives:

| Option | Verdict |
|---|---|
| **Capacitor** (Ionic) | ✅ Wraps the existing SPA in a WebView shell, native plugin bridge for GPS/storage/OAuth/etc. Designed exactly for this scenario: SPA → app store. `nuxt generate` already produces the static bundle it needs. Leaflet, Web Audio API, `@nuxt/ui`, `canvas-confetti` all keep working untouched. |
| **Tauri Mobile** | ❌ iOS support is still rough; Rust-side native plugin ecosystem is thin compared to Capacitor's. Not worth the friction here. |
| **Ionic Vue** | ❌ Would require rewriting components on Ionic primitives. You'd lose `@nuxt/ui`. |
| **PWA-only (Add to Home Screen)** | ❌ Solves "feels like an app" but not the App Store presence requirement. iOS PWAs also lose access to many native APIs (background location, push) and have no app store discoverability. Worth doing as a *side effect* (PWA manifest costs nothing) but not the primary answer. |
| **React Native / Flutter rewrite** | ❌ Discard everything you have. No. |

**Concrete shape of the port:**

1. `npm i -D @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android`
2. `npx cap init Tunnelbanebingo se.iveo.tunnelbanebingo --web-dir=.output/public`
3. `npm run generate` → produces the static SPA in `.output/public` (verify, may be `dist/`)
4. `npx cap add ios && npx cap add android` — creates `ios/` and `android/` dirs (commit them)
5. `npx cap sync` after every web build to copy the bundle into the native projects
6. Add `capacitor.config.ts` with `server.url` for live-reload in dev (points at `https://<your-mac-ip>:3011` over LAN), unset for production builds

The Vehicles API route (`server/api/vehicles.get.ts`) cannot run inside the Capacitor app — there's no Nuxt server. That logic moves into a serverless edge function (see Q4).

**Things that need adapting in the existing code:**
- `useCloudSync.ts` line 47–53 loads Google Identity Services from `accounts.google.com/gsi/client`. GIS web flow does not work the same in a WebView. Use `@codetrix-studio/capacitor-google-auth` (community) or `@capacitor-firebase/authentication` to get a Google access token natively, then keep the existing Drive REST calls verbatim. Same `drive.appdata` scope, same file format, same V2 schema — the web and mobile clients will sync to the same `bingo-state.json`.
- Replace `localStorage` reads/writes with `@capacitor/preferences` (KV, async). Provide a thin sync wrapper so the existing composables (`useVisitedStations`, `useHomeStation`, `useTramsIncluded`, `useOnboarding`) don't have to change shape much. Keep `localStorage` as fallback for the web build.
- Remove `server/` from the production bundle for the mobile build (or just don't reference `/api/vehicles` — replace with the edge function URL via runtime config).

---

## Q2 — Testing on a real iOS device

You already have a Mac, which is the only hard requirement.

**One-time setup:**
1. Install Xcode from the Mac App Store (~10 GB; takes a while).
2. Open Xcode once, accept license, install command-line tools.
3. Sign in to Xcode with your Apple ID under **Settings → Accounts**. A free Apple ID gets you a "Personal Team" provisioning profile — that's enough for sideloading to your own device, no $99 needed *for testing*.
4. `sudo gem install cocoapods` (Capacitor uses CocoaPods on iOS).

**Per-build flow:**
```bash
npm run generate          # build web bundle
npx cap sync ios          # copy bundle + plugins into ios/
npx cap open ios          # opens Xcode
```

In Xcode: select your iPhone from the device dropdown (plug in via USB once, then it works wirelessly on the same Wi-Fi), hit ⌘R. First run on the device requires you to trust the developer profile under **iPhone Settings → General → VPN & Device Management**.

**Live-reload during development** (so you don't have to rebuild for every change):
- Set `server.url` in `capacitor.config.ts` to `https://<your-mac-lan-ip>:3011`
- Run `npm run dev` on the Mac (it already binds to the LAN with `--host`, but check; you may need `nuxt dev --host`)
- The phone's WebView loads from your dev server with HMR working. The `localhost.pem` cert won't be trusted on the phone — easiest workaround is using `cap run ios -l --external` which handles this, or adding the cert to the device.

**Free-tier limit:** apps installed from a free Apple ID expire after 7 days and require a re-install. Fine for development; you'll hit the $99/year wall when you want to ship.

---

## Q3 — Getting it onto the App Store and Google Play

### Apple App Store — what you need

| Item | Cost / Effort |
|---|---|
| Apple Developer Program membership | **$99/year**, recurring |
| App Store Connect account | Included with the above |
| App icons | 1024×1024 master + auto-generated sizes (Capacitor + `cordova-res` or `@capacitor/assets` automate this) |
| Launch screen | One image, themeable |
| App Store screenshots | At least one screenshot per required device size (currently 6.9" iPhone + 6.5" iPhone). Can generate with simulator. |
| App description, keywords, category, age rating | Filled in App Store Connect |
| Privacy policy URL | **Required**. Must be a public URL — host on the existing GitHub Pages site as a `/privacy` page |
| Privacy "nutrition label" | Form in App Store Connect declaring what data you collect. For you: location (if Q5/Q7 ship), email (Google sign-in), analytics (GoatCounter). Be honest, it's checked. |
| Demo account / review notes | If review needs to test sign-in, provide a Google account they can use. The reviewer needs to be able to use the app fully. |
| Build upload | `npx cap build ios --release` then archive in Xcode → upload to App Store Connect |
| Review time | First submission usually 1–3 days. Rejections are common on first try; iterate. |

### Google Play — what you need

| Item | Cost / Effort |
|---|---|
| Google Play Console account | **$25 one-time** |
| App icon, feature graphic, screenshots | Similar to Apple but specs differ |
| Privacy policy URL | Same one |
| Data Safety form | Equivalent of Apple's nutrition label, more granular |
| Signed AAB (Android App Bundle) | `npx cap build android --release`, sign with a keystore you generate once and **back up safely** (lose the keystore = can't ship updates) |
| Content rating questionnaire | Quick |
| Closed/internal testing tracks | Use these before public release; way faster review than full release |
| Review time | Often hours for closed test, days for public release. Newer accounts get extra scrutiny. |

### What will trip you up specifically

- **Sign in with Apple is required** if you offer Google sign-in. Apple's rule: any third-party social login requires Sign in with Apple as a peer option. Add `@capacitor-community/apple-sign-in` and a flow that writes to the same Drive file (or a parallel iCloud sync — but Drive-only is fine for review).
- **App Tracking Transparency** prompt is required if you do any cross-app/site tracking. GoatCounter is first-party and anonymous, so probably not — but document it in the privacy label.
- **Background location** (Q7) gets extra scrutiny on iOS. Be prepared to write a paragraph defending the use case in review notes.

---

## Q4 — Updating data and rotating API keys without resubmitting

Three things you'd want to update OTA:

| Thing | Strategy |
|---|---|
| Station/route data | Host versioned JSON manifest on a CDN; app fetches on launch with cache + ETag |
| Trafiklab key (and any future keys) | Never bundle. Proxy through a serverless function. App calls your URL, function forwards with the key from its env |
| Bug fixes / UI tweaks | OTA JS-bundle updates via Capgo or Capawesome's free updater (or paid Ionic Live Updates) |

### Recommended setup: a thin Cloudflare Workers project

Create a tiny separate repo, `tunnelbanebingo-edge`, deployed to Cloudflare Workers (free tier: 100k requests/day). It does three jobs:

1. **`/data/manifest.json`** — returns `{ version, stationsUrl, routesUrl, citiesUrl }` with long-lived cached JSON files. App loads on first launch, caches in `@capacitor/preferences`, refreshes in the background. To update Stockholm with a new station, push JSON to the worker repo, deploy in seconds — every user sees it within a launch or two.

2. **`/vehicles?city=stockholm`** — exact same logic as the current `server/api/vehicles.get.ts`, but on Cloudflare. `TRAFIKLAB_API_KEY` lives in Cloudflare environment, never in the app bundle. Both the web app and the mobile app point at this URL via `runtimeConfig.public.edgeBase`. This also fixes the GitHub Pages "static can't run server routes" blocker mentioned in CLAUDE.md.

3. **`/party/*`** — see Q6.

The current `app/data/stations.ts` and `routes.ts` stop being the source of truth. They become a one-time export to JSON. Going forward you edit the JSON in the edge repo. Mobile and web both pull from there. Keep them as a fallback bundle for first-launch-with-no-network.

### About JS-bundle OTA updates

Apple's guideline (4.3 / 3.3.2) tolerates JS bundle updates as long as they don't "substantially change features or functionality." In practice: shipping bug fixes, copy changes, new station data, new cities — all fine. Shipping an entirely new game mode without review — gray area. Don't push the limit; ship big features through normal review.

Capgo's `@capgo/capacitor-updater` is the most-used free option. Worth wiring up from day one for emergencies.

---

## Q5 — Live GPS mode ("random but closer")

Cleanly an extension of the existing weighting logic.

**Plumbing:** `@capacitor/geolocation` for current position. iOS needs `NSLocationWhenInUseUsageDescription` in `Info.plist`; Android needs `ACCESS_FINE_LOCATION` in the manifest. Capacitor handles the permission prompt.

**Algorithm:** the current home-station weighting in `useBingoAnimation.ts` does Dijkstra from a fixed home station then exponential decay over travel time. Live mode swaps the source: pick the *nearest station* to the user's current GPS location (haversine) as the implicit "home", run the same Dijkstra, sample. The exact same weighting code works.

**Live traffic** plugs in here too: optionally bias toward stations the user can actually reach soon. The Trafiklab GTFS-RT feed gives current vehicle positions; combined with route topology you can estimate "next train at this station departs in N minutes" and downweight stations with no upcoming service. Real-time *delays* (stop-time updates, not just positions) require a different Trafiklab feed (`TripUpdates.pb`) — likely a v1.5 feature.

**Suggested UX:** an extra toggle in settings, "Use my location instead of home station". When on, the app re-samples the source station each time the user hits Bingo.

---

## Q6 — Party-game multi-user sync

Constraint: "frictionless" + "temporary." Translation: no accounts, room codes, ephemeral state.

**Recommendation: PartyKit on Cloudflare Workers** (or Cloudflare Durable Objects directly).

A "party room" is a Durable Object instance. One person creates a room → gets a 4-letter code (`KFTR`). They share it (text, AirDrop, scan a QR code printed on screen). Other phones connect via WebSocket to the same room. Each phone uploads its `visited` set on join. The room maintains the *union* of everyone's visited sets and broadcasts updates. When someone hits "Spin," the room locally computes the *complement* (stations no one has visited) and seeds the random pick with a shared seed so everyone sees the same animation winner.

Why this and not Supabase/Firebase:
- No accounts needed. Room codes are the only state. Match dies when everyone disconnects.
- No GDPR/privacy footprint — nothing persists past the session.
- Cheap. Cloudflare Durable Objects free tier covers a lot of casual play.
- Lives in the same edge repo from Q4, no separate provider.

If you ever want *persistent* groups ("our friend group's shared bingo"), upgrade to Supabase later — schema is trivial and the existing Google sign-in can be the auth.

---

## Q7 — Background location heatmap (privacy-preserving)

Doable. The privacy framing is actually a feature for App Store review — "data never leaves the device" is exactly what reviewers like to hear in the privacy label.

**Plugin:** `@capacitor-community/background-geolocation` is the de facto choice. iOS requires `NSLocationAlwaysAndWhenInUseUsageDescription` plus a "Background Modes → Location updates" capability in Xcode. Android needs `ACCESS_BACKGROUND_LOCATION` + a foreground-service notification (Android 10+ shows a persistent notification while tracking — there's no way around it on modern Android).

**Storage:** SQLite via `@capacitor-community/sqlite`. Schema: `(timestamp, lat, lng, accuracy)`. Throttle to one point every ~60s + min 50m movement to keep size down. A user walking around all day generates ~50 KB/day raw, less compressed.

**Heatmap rendering:** `leaflet.heat` plugin. Aggregate into bins (Geohash level 7 or so) before rendering — drawing 50,000 raw points is slow.

**Privacy guarantees to make explicit in UI:**
- "Location history is stored only on this device. We never send it anywhere."
- One-tap "Erase all location history" button. Make it prominent.
- Default off. User opts in. The opt-in screen itself explains what's stored, where, and why.

**App Store review concern:** Apple is increasingly hostile to "Always" location permission. Be ready to explain *why* it must run in background — answer: "to record where the user has actually visited so we can suggest unvisited areas next time, without the user having to open the app on every trip." If they push back, fall back to "While Using" + "Significant Location Changes" (lower battery, lower accuracy, no foreground service needed). That might be a better v1 anyway.

---

## Confirmed scope

**v1 — Port + GPS + Party** (decided):
- Capacitor scaffolding, iOS + Android targets, Apple Developer account active
- Replace `localStorage` with `@capacitor/preferences`
- Native Google sign-in plugin, keep existing Drive sync (same `bingo-state.json`, same V2 schema)
- Add Sign in with Apple (App Store requirement)
- Cloudflare Worker (`tunnelbanebingo-edge`) hosting:
  - `/vehicles?city=…` — Trafiklab proxy (replaces `server/api/vehicles.get.ts`)
  - `/data/manifest.json` + versioned station/route/city JSON
  - `/party/*` — Durable Object (or PartyKit) for ephemeral rooms
- Move `stations.ts` / `routes.ts` / `cities.ts` to runtime JSON manifests, keep last-known-good bundled fallback
- `@capacitor/geolocation` + "use my location" toggle in settings; reuses existing Dijkstra weighting with the nearest station as the source
- Party mode UI: room code (4 letters), QR-code share sheet, live merged-visited set, deterministic shared seed for the random pick
- Privacy policy page (new `app/pages/privacy.vue`)
- Submit to TestFlight + Google Play internal track first; iterate on review feedback before public release

**v2 — Heatmap (Q7), deferred:**
- `@capacitor-community/background-geolocation` + `@capacitor-community/sqlite`
- `leaflet.heat` for rendering
- Default off, prominent erase button, "data never leaves device" framing
- Likely needs its own App Store review cycle because of the "Always" location permission

---

## Critical files to touch in v1

**App repo (this one):**
- `nuxt.config.ts` — add `runtimeConfig.public.edgeBase`, confirm `nuxt generate` output dir matches Capacitor `webDir`
- `package.json` — add `@capacitor/{cli,core,ios,android,preferences,geolocation}`, `@codetrix-studio/capacitor-google-auth` (or `@capacitor-firebase/authentication`), `@capacitor-community/apple-sign-in`
- New: `capacitor.config.ts` at repo root; `ios/`, `android/` directories committed
- `app/composables/useCloudSync.ts:42–88` — replace GIS web flow with native plugin token acquisition; keep Drive REST calls (lines 90–146) verbatim
- `app/composables/useVisitedStations.ts`, `useHomeStation.ts`, `useTramsIncluded.ts`, `useOnboarding.ts` — wrap `localStorage` with a Preferences-backed adapter (keep `localStorage` fallback for the web build)
- `app/composables/useVehiclePositions.ts` — point at `${edgeBase}/vehicles` not `/api/vehicles`
- `app/data/stations.ts`, `routes.ts`, `cities.ts` — refactor to load from manifest at runtime, keep current contents as bundled fallback
- New: `app/composables/useLiveLocation.ts` — wraps `@capacitor/geolocation`, exposes nearest-station ref
- `app/composables/useBingoAnimation.ts` — accept a "source station" parameter (currently uses home station); when live mode is on, source = nearest live station
- New: `app/composables/useParty.ts` — WebSocket client for the Durable Object, exposes `roomCode`, `members`, `mergedVisited`, `createRoom`, `joinRoom`, `leaveRoom`
- New: `app/components/PartyDialog.vue` — room code entry + QR display
- New: `app/pages/privacy.vue` (Swedish + English via i18n)
- `server/api/vehicles.get.ts` — keep for local web dev (gated by env flag) or delete after worker is live

**New repo (`tunnelbanebingo-edge`, separate Cloudflare Workers project):**
- `wrangler.toml` with `TRAFIKLAB_API_KEY` secret, Durable Object binding for party rooms
- `src/index.ts` — router for `/vehicles`, `/data/manifest.json`, `/data/*.json`, `/party/*`
- `src/party.ts` — `PartyRoom` Durable Object class (WebSocket hibernation API for cost), tracks members + merged visited set + broadcasts updates
- `data/` — committed JSON files (stations, routes, cities), one per city, versioned in `manifest.json`

---

## Verification (v1)

End-to-end smoke test before submitting to TestFlight / internal track:

1. `npm run generate && npx cap sync ios && npx cap open ios` — app builds and runs on a connected iPhone via Xcode
2. Bingo button works, animation runs, tick sound plays, confetti fires (Web Audio + canvas-confetti work in iOS WebView)
3. Map loads with stations + route polylines (Leaflet works in WebView)
4. Sign in with Google → existing Drive `bingo-state.json` is downloaded → visited stations match the web app
5. Mark a new station on mobile → re-open web app → it appears (round-trip sync via Drive)
6. Sign in with Apple flow completes (App Store requirement)
7. `/vehicles` from the edge worker returns vehicles (verify with the Trafiklab key set on the worker, not in the app)
8. Force-quit, change a station name in the edge JSON, re-launch → new name shows up (manifest fetch works)
9. **GPS mode:** toggle "use my location" in settings → grant permission prompt → hit Bingo → the picked station weighting is centered on a station near the user's actual location, not the home station
10. **Party mode:** create a room on phone A → get a code → enter code on phone B → both devices show each other in the member list → mark a station on phone A → it appears as "visited" on phone B → hit Bingo on either phone → both phones run the same animation and land on the same station, drawn from the complement of all members' visited sets
11. Run on Android emulator, repeat 1–10
12. TestFlight build + Google Play internal track build install on devices with no dev cert
