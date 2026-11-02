# OBRIY (project-02)

Next.js App Router + TypeScript + Tailwind CSS 4 + next-intl (Ukrainian only) + Sanity.

## Development

```bash
npm run dev
```

- Site (Ukrainian): http://localhost:3000/
- Legacy `/uk/...` and `/en/...` redirect to unprefixed paths

Sanity Studio runs as a **standalone** Vite app (not embedded in Next.js):

```bash
npm run studio
```

- Studio: http://localhost:3333
- `/studio` on the Next site redirects there (or to `NEXT_PUBLIC_STUDIO_URL`)
- Deploy Studio: `npm run studio:deploy`

First-time local CORS (once per project; requires `sanity login`):

```bash
npx sanity cors add http://localhost:3333 --credentials
```

Also keep `http://localhost:3000` for the Next site preview / media.

```bash
npm run sanity:check
```

Copy `.env.example` to `.env.local` and fill public Sanity values if needed.
Set `NEXT_PUBLIC_STUDIO_URL=http://localhost:3333` for the `/studio` redirect.
Optional: `NEXT_PUBLIC_RWS_URL` for the Redient Web Studio footer credit link.
