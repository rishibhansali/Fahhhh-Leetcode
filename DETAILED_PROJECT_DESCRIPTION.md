# Detailed Project Description

This document explains what the extension is, the technologies behind it, what each file
does, and the full flow of execution from install to sound playback.

## What this is

A Chrome extension (Manifest V3) called **"Fahh Extension(leetcode)"** — it plays a meme
sound effect when you Run or Submit code on LeetCode, depending on whether the result was
a success (Accepted) or a failure (Wrong Answer, Runtime Error, etc.).

**Technologies:** vanilla JavaScript, HTML/CSS, and three Chrome Extension APIs —
`chrome.storage.local` (settings persistence), `chrome.runtime.getURL` (resolving bundled
asset paths), and the Manifest V3 `content_scripts` declaration (auto-injecting JS into
matching pages). No frameworks, no build step, no backend, no external API calls of any
kind.

## The files and their jobs

| File | Role |
|---|---|
| `manifest.json` | The extension's config — declares its name/version, that `popup.html` is the toolbar popup, that `content.js` should auto-inject into `leetcode.com/problems/*`, and that files under `sounds/` are allowed to be loaded by leetcode.com pages (`web_accessible_resources`). |
| `popup.html` / `popup.js` | The settings UI you see when you click the extension icon: pick success/fail sounds from 22 options, set volume/max-duration, preview sounds, and an enable/disable toggle. Saves everything to `chrome.storage.local`. |
| `content.js` | The actual worker — injected directly into every LeetCode problem page. Watches for Run/Submit results and triggers the right sound. |
| `sounds/*.mp3` | The 22 meme audio files bundled with the extension. |
| `icon*.png` | Toolbar/extensions-page icons. |

## Flow of execution

**1. Install / load time**
When you "Load unpacked" (or install from the store), Chrome reads `manifest.json`. It
registers `content.js` to auto-inject into any `leetcode.com/problems/*` page, and wires
the toolbar icon to open `popup.html`.

**2. Visiting a LeetCode problem**
The moment `leetcode.com/problems/...` finishes loading, Chrome injects `content.js` into
that page automatically — no action needed from you. This script runs in an "isolated
world": it can read/manipulate the page's DOM, but its own JS variables are invisible to
LeetCode's own scripts (a security boundary Chrome extensions always have).

**3. Opening the popup (optional, whenever you want to configure)**
Clicking the toolbar icon loads `popup.html` + `popup.js` in a separate, short-lived
context.
- On open, `popup.js` populates the two `<select>` dropdowns from a hardcoded `memeNames`
  map (filename → display name), reads any previously saved preferences from
  `chrome.storage.local`, and reflects them in the UI.
- Play (▶️) buttons let you preview a sound directly
  (`new Audio(chrome.runtime.getURL('sounds/...'))`).
- Clicking **Save Preferences** writes `successMeme`, `failMeme`, `volume`, `duration`
  into `chrome.storage.local`.
- The **Enable Extension** checkbox writes `extensionEnabled: true/false` to the same
  storage — this is the kill switch `content.js` checks before doing anything.

**4. You click Run or Submit on a problem**
`content.js` has a single `document.addEventListener('click', ...)` listener on the whole
page. It checks if the clicked button is Run or Submit (via LeetCode's
`data-e2e-locator` attributes, e.g. `console-run-button` / `console-submit-button`). If
so, it flips an internal `watching` flag to `true` and resets its "last seen result"
trackers.

**5. Polling for the result**
A `setInterval` ticks every 500ms while `watching` is true. Each tick it checks two
places in the DOM:
- `#submission-detail_tab`'s text — this is where Submit results land (e.g. "Accepted",
  "Wrong Answer").
- `[data-e2e-locator="console-result"]`'s text — this is where Run (test) results land,
  in a different part of the page than Submit results.

The moment either one shows a *new* value it hasn't seen before, that's a signal.

**6. Reacting to the result**
`content.js` first checks `chrome.storage.local` for `extensionEnabled` — if you've
toggled it off, it silently stops here. Otherwise:
- If the result text is `"Accepted"` → play the configured **success** sound.
- If it's one of `Wrong Answer` / `Runtime Error` / `Compile Error` /
  `Time Limit Exceeded` / `Memory Limit Exceeded` → play the configured **failure** sound.

Playing a sound means reading `successMeme`/`failMeme` + `volume` + `duration` from
storage, constructing `new Audio(chrome.runtime.getURL('sounds/<file>.mp3'))`, and
calling `.play()` — auto-stopping it after the configured duration via `setTimeout`.

## Why it's built this way (the interesting design constraints)

- **Polling instead of pure event-driven detection**: LeetCode is a heavy React SPA, and
  its result panels don't reliably fire clean, observable DOM events — a
  `MutationObserver` chasing exact node identity turned out to be fragile (this was
  actually the root cause of a real bug that got fixed: LeetCode's markup had changed
  since this extension was originally written, so the old selectors matched nothing). A
  cheap poll against two known, stable selectors is simpler and more robust.
- **Isolated storage per browser**: `chrome.storage.local` is scoped per-browser-install,
  not synced automatically — which is why the same extension can behave differently
  across two different browsers (e.g. Chrome vs. Arc) if their stored settings differ.
- **The `watching` gate**: prevents false positives — without it, simply loading a page
  that already shows a leftover "Accepted" from a previous session would immediately
  (and wrongly) trigger a sound.
