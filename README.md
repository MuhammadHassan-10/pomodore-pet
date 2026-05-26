# 🍅 Pomodoro Pet

A single-screen Pomodoro timer featuring a living, expressive SVG pet companion that reacts to your focus sessions in real time. Built as a frontend technical assessment.


---

## 🚀 How to run locally

You need **Node.js 18+** installed. ([Download Node.js](https://nodejs.org))

**1. Clone the repository**
```bash
git clone https://github.com/MuhammadHassan-10/pomodore-pet
cd pomodoro-pet
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.


---

## ✨ Features

| Feature | Detail |
|---|---|
| **Auto-cycling** | Flows automatically from focus → break → focus |
| **Configurable durations** | Sliders for focus (1–90 min) and break (1–30 min) |
| **Living pet companion** | 5 mood states: idle, focused, sleepy, curious, celebrate |
| **Drift-corrected timer** | Delta-time via `Date.now()` — never accumulates error |
| **8 synthesised sounds** | Web Audio API — no `.mp3` files; click, start, pause, resume, reset, focus-end, break-end, last-5-second tick |
| **Haptic feedback** | `navigator.vibrate()` on every button interaction (mobile) |
| **Daily history** | Persists across reloads via `localStorage`, auto-resets at midnight |
| **Responsive** | 360px phone → 1440px desktop, same layout |
| **Tab title sync** | ` 24:32 — focus` visible from other tabs |

---

## 🛠 Tech stack

- **React 18** — hooks-based component architecture
- **Vite** — fast dev server and build tool
- **Vanilla CSS** — keyframe animations, no animation library
- **Web Audio API** — synthesised sound, no external audio files
- **localStorage** — zero-backend session persistence

---

## 📁 Project structure

```
src/
├── App.jsx          Main layout, ambient background, confetti
├── useTimer.js      Drift-corrected state machine 
├── useAudio.js      8 synthesised sounds via Web Audio API
├── Pet.jsx          SVG creature with 5 mood states + particle system
├── TimerRing.jsx    SVG progress ring with tick marks and last-5spulse
├── Controls.jsx     Ripple buttons with haptic feedback
├── Settings.jsx     Collapsible duration sliders
├── History.jsx      Daily session log
├── storage.js       localStorage helpers (date-keyed, auto-purging)
└── index.css        Global styles, keyframe library
```
