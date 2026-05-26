# ANSWERS.md

## 1. How to run

To run this project locally on a fresh machine, ensure you have Node.js installed, then run the following commands in the root directory:

```bash
npm install
npm run dev
```

Open the provided localhost URL (typically **http://localhost:5173**) in your browser.


---

## 2. Stack & design choices

**Stack:** I chose React 18 with Vite. A component-based architecture is perfect for this application because it allows for a clean separation of concerns — I was able to isolate the complex, drift-corrected timer calculation (`useTimer.js`) and Web Audio synthesis (`useAudio.js`) from the UI layer (`App.jsx` and `Pet.jsx`). Vite provides an incredibly fast feedback loop during development without the heavy overhead of a framework like Next.js, which would be overkill for a client-side SPA.

---

**Decision 1: The Pet Companion as a primary state indicator**

Instead of building a utilitarian dashboard, I made the timer take up the central viewport alongside a state-driven SVG pet companion. I did this because the Pomodoro technique requires emotional endurance — staring at a cold countdown clock creates anxiety, not focus. Tying the timer's phase (`focus`, `break`, `paused`) directly to the pet's CSS keyframe animations and facial expressions (e.g., determined squinting with a sweat drop during focus vs. half-lidded sleepy eyes with floating Zzz's during break) provides immediate, at-a-glance visual state context while making the tool feel "alive" and encouraging. The pet also transitions into star-eyed "celebrate" mode with a particle burst and confetti when a session completes, giving users a small dopamine reward for finishing.

**Decision 2: Centered fixed-max-width column layout**

I picked a centered, fixed-max-width column layout (`maxWidth: 480px`) rather than a full-screen grid or multi-column layout. Even on a wide 1440px desktop, the app maintains the proportions of a physical desk clock or widget. This prevents the UI elements — controls, settings, history — from sprawling uncomfortably across empty space, and keeps the user's eye anchored directly on the progress ring without their gaze needing to travel horizontally. The background ambient orbs provide peripheral depth so the constrained column doesn't feel bare on large screens.

---

## 3. Responsive & accessibility

**Responsive behavior:** On a 360px-wide phone, the app uses `clamp()` for header typography and flexible padding to ensure the timer ring and controls fit perfectly without horizontal scrolling. The SVG ring scales with `maxWidth: 100%` so it never clips. Because of the 480px max-width constraint, the layout on a 1440px laptop remains essentially identical — a focused, widget-like column anchored in the center of the screen, with the ambient radial gradient providing visual weight to the surrounding space.

**Accessibility handled:** I added `aria-label` and `role="img"` to the inline SVG pet component (e.g., `aria-label="Pet mood: focused"`). Since the pet acts as a primary visual indicator of the app's phase, this ensures screen reader users aren't left guessing what phase the timer is in based purely on the countdown numbers. I also implemented `:focus-visible` styling on all control buttons to support full keyboard navigation, and synced the browser tab title to the current timer state (e.g., ` 24:32 — focus`) so users can monitor progress from another tab.

**Accessibility skipped:** I knowingly skipped implementing an `aria-live` region to announce every ticking second of the countdown. Having a screen reader announce every single second would be overwhelmingly noisy and actively counterproductive for a user trying to focus. Instead, I relied on the distinct synthesised audio chimes at session boundaries to signal state transitions non-visually.

---

## 4. AI usage

**Tool used:** Claude (Anthropic)

**What I asked / what it gave me:**

I asked for help resolving a bug where the timer was not automatically starting the countdown when transitioning from a focus session to a break session. The AI suggested adding `startInterval(nextSecs, 'break')` inside the `setTimeout` block of `handleCycleEnd`, and appending `startInterval` to the `useCallback` dependency array.

**What I changed and why:**

The AI's exact output caused a White Screen of Death due to a circular dependency — `handleCycleEnd` needed `startInterval` in its dependency array, but `startInterval` internally referenced `handleCycleEnd` via closure, creating a cycle that crashed React's Strict Mode (which runs effects twice to surface these issues). I rejected the direct output and refactored the logic by introducing a `useRef` (`handleCycleEndRef`). By storing the latest `handleCycleEnd` function in a ref and having `startInterval`'s interval callback read from that ref rather than closing over the function directly, I broke the circular dependency entirely. This allowed both functions to be defined with stable references without either depending on the other in React's dependency-tracking system.

---

## 5. Honest gap

**Gap: Browser background tab throttling**

While my timer uses delta-time (`Date.now() - startTime`) to calculate remaining seconds — which prevents standard `setInterval` drift on an active tab — modern browsers including Chrome and iOS Safari aggressively throttle intervals to as low as 1 tick per minute, or suspend them entirely, when a tab loses focus. If a user switches tabs for the duration of a session, the timer won't hit zero and trigger the audio chime until they bring the tab back into focus.

**How I would fix it:** With another day, I would move the interval out of the main thread and into a **Web Worker**. Web Workers are not subject to the same aggressive UI-thread throttling that applies to `setInterval` in background tabs, meaning the interval would fire accurately regardless of tab visibility. The worker would post a message to the main thread when the session ends, and the main thread would play the audio chime and update the UI. This would make the timer reliable even for users who work with many tabs open.
