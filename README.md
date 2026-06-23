# Karaoke Frontend

Guest registration and host panel for karaoke night. Deploy this repo to Vercel.

## Pages

| Route | User | Description |
|-------|------|-------------|
| `/` | Guest | Register with name, song, and artist |
| `/host` | Host/Admin | Pick random guest, announce via microphone, manage queue |

## Setup

### 1. Deploy the backend first

Follow the [backend README](../backend/README.md) and note your API URL (e.g. `https://karaoke-api.vercel.app`).

### 2. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add environment variables:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your backend URL (no trailing slash) |
| `VITE_ADMIN_SECRET` | Same value as `ADMIN_SECRET` on the backend |

4. Deploy.

### 3. Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL and admin secret
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Microphone announcement

The host panel uses the browser **Web Speech API** (`speechSynthesis`) to announce the next guest. For a live event:

1. Open the **Host** page on the machine connected to the venue speakers.
2. Pick a random guest, then click **Announce via microphone**.
3. The browser will speak: *"Next up: [Name]! Please come to the stage to sing [Song] by [Artist]."*

Use Chrome or Edge for the best speech support.

## Sharing links

- **Guests:** share your frontend URL (e.g. `https://karaoke.vercel.app`)
- **Host only:** share `https://karaoke.vercel.app/host` — keep the admin secret private via env vars, not in the URL
