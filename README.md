# Plex: Enhanced Player

All-in-one web player enhancement userscript for Plex Web (`app.plex.tv`, local PMS servers, and `*.plex.direct`). Adds aspect-ratio cropping presets, true cinema-black backdrop, instant 5-second skips with native UI integration, smooth playback speed adjustments, and a persistent on-screen display (OSD) HUD.

---

## ⚡ Quick Install

| Script | Target | Direct Install | Dev Loader |
| :--- | :--- | :--- | :--- |
| **Plex: Enhanced Player** | Plex Web (`app.plex.tv`, local servers) | [Install Script ➔](https://raw.githubusercontent.com/GreenlitNL/Plex-enhanced/main/plex-enhanced-player.user.js) | [`plex-enhanced-player.dev.user.js`](./plex-enhanced-player.dev.user.js) |

*Clicking the **Install Script** link above will automatically open Tampermonkey's installation dialog in Chrome.*

---

## 📖 Features

### 🎬 Aspect Ratio Cropping & Zooming
Cycle through custom aspect ratio presets to eliminate black bars on ultrawide monitors, laptop screens, or standard displays:
- **Original** (Default aspect ratio)
- **16:9** (Standard widescreen 1.78:1)
- **21:9** (Ultrawide cinema 2.37:1)
- **2.35:1** (CinemaScope anamorphic)
- **2.39:1** (Panavision theatrical scope)
- **1.85:1** (US theatrical flat)
- **2.00:1** (Univisium / modern streaming)
- **16:10** (MacBook & laptop displays)
- **IMAX** (1.43:1 full frame)
- **Fill Screen** (Stretch to fill)

### ⏩ 5-Second Forward & Backward Skip
- Replaces native skip behavior with snappy **5-second** jumps forward and backward.
- Dynamically injects native-styled geometric `5` icons matching Plex's design system into the player bar.
- Displays responsive on-screen badge animations with skip direction indicators.

### ⚡ Playback Speed Control
- Increment and decrement playback speed smoothly from **0.5x to 2.0x** (`0.5x`, `0.75x`, `1.0x`, `1.25x`, `1.5x`, `1.75x`, `2.0x`).
- Persistent speed guard: automatically re-synchronizes speed across buffer underruns and track changes.

### 🖥️ Persistent Player Status HUD
- Toggle a clean, non-intrusive status HUD in the corner displaying current crop mode, playback rate, and resolution info.

### 🖤 Cinema-Black Backdrop
- Enforces an absolute `#000000` backdrop behind the video container to eliminate white or grey letterbox flashes during aspect ratio shifts and scene transitions.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| <kbd>C</kbd> | **Cycle Crop Preset** | Cycles through 16:9, 21:9, 2.35:1, 2.39:1, 1.85:1, 2.00:1, 16:10, IMAX, Fill, and Original |
| <kbd>→</kbd> | **Skip Forward 5s** | Jumps ahead 5 seconds with an animated on-screen badge |
| <kbd>←</kbd> | **Skip Backward 5s** | Jumps back 5 seconds with an animated on-screen badge |
| <kbd>]</kbd> | **Increase Speed** | Increases playback speed (`0.5x` – `2.0x`) |
| <kbd>[</kbd> | **Decrease Speed** | Decreases playback speed (`0.5x` – `2.0x`) |
| <kbd>I</kbd> | **Toggle Status HUD** | Toggles persistent dual-setting player info HUD |

*Hotkeys are automatically disabled when typing in search bars, inputs, textareas, or slider controls.*

---

## 🌐 Supported Environments

- **Hosted Plex Web**: `https://app.plex.tv/*`, `https://*.plex.tv/*`
- **Local Plex Media Server**: `http://localhost:32400/web/*`, `http://127.0.0.1:32400/web/*`
- **LAN Subnets**: `http://192.168.*:32400/web/*`, `http://10.*:32400/web/*`, `http://172.16.*:32400/web/*`
- **Plex Direct**: `https://*.plex.direct:32400/web/*`

---

## 💻 Local Development Setup (Instant Reload)

Test local changes instantly in your browser without committing or waiting for caches:

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** (top-right toggle).
3. Click **Details** on **Tampermonkey** and switch ON **"Allow access to file URLs"**.
4. In Tampermonkey dashboard, create a new script and paste the contents of [`plex-enhanced-player.dev.user.js`](./plex-enhanced-player.dev.user.js).
5. Save. Any edits you make to `plex-enhanced-player.user.js` in your editor will take effect immediately upon browser refresh (`Cmd + R`).

---

## 🔄 Releasing Updates

1. Make your changes in `plex-enhanced-player.user.js`.
2. Bump `@version` in the userscript header (e.g. `6.0.0` → `6.1.0`).
3. Commit and push to `main`.
