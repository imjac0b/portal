## Portal

Minimalist, full-screen ambient video player that surfaces random long‑form YouTube videos based on your saved keywords. It fetches results via a privacy-friendly Piped API, filters out Shorts, and auto-plays with an unobtrusive overlay for mute, play/pause, skip, and keyword management. Preferences persist in localStorage.

### Features

- **Keyword-driven discovery**: Add keywords; Portal fetches a random matching long-form video (excludes Shorts)
- **Ambient playback**: Auto-plays; automatically advances when a video ends
- **Overlay controls**: Mute/unmute, play/pause, skip, open settings
- **Local persistence**: Keywords are stored in `localStorage`

### Tech stack

- **Preact** + **Vite**
- **Tailwind CSS v4** (with `tw-animate-css` and Geist font)
- **TanStack Query v5** for data fetching and caching
- **ReactPlayer** for playback
- **@preact/signals** for lightweight state
- **shadcn/ui** components (`Button`, `Input`) and **lucide-react** icons

### Getting started

Prerequisites: Node 20+ (or Bun), pnpm/npm/yarn compatible.

Install dependencies:

```bash
# npm
npm install

# or pnpm
pnpm install

# or Bun (bun.lock present)
bun install
```

Run the dev server:

```bash
npm run dev
# then open the printed localhost URL
```

Build for production and preview:

```bash
npm run build
npm run preview
```

### Usage

- Hover or tap to reveal the control overlay.
- Click the settings button to manage your keyword list.
- Click a keyword chip to remove it. New keywords are saved immediately.
- When a video ends, the next random match auto-plays.

### Configuration

- API: Uses `https://api.piped.private.coffee/search` for discovery. To use a different Piped instance, update the endpoint in `src/app.tsx`.
- UI: Tailwind tokens and dark mode are defined in `src/index.css`.

### Project layout

- `src/app.tsx`: Main app UI, playback and keyword settings
- `src/main.tsx`: App bootstrap and TanStack Query provider
- `src/components/ui`: Reusable UI primitives (shadcn/ui-style)
- `src/index.css`: Tailwind v4 setup and design tokens

### Notes

- Shorts are filtered out via the `isShort === false` check.
- Keywords persist under the key `portal-keywords` in `localStorage`.
