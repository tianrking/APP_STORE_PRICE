# appstore-price

Global App Store price comparison and exchange-rate tracking matrix.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel)](https://vercel.com/)

Language: **English** | [繁體中文](./README.zh-Hant.md) | [Español](./README.es.md)

- Live: [https://apple.w0x7ce.eu/](https://apple.w0x7ce.eu/)
- Repo: [https://github.com/tianrking/appstore-price](https://github.com/tianrking/appstore-price)

## Overview

`appstore-price` is a full-stack App Store price comparison project built with Node.js + React (Next.js), with dual deployment support for Vercel and Cloudflare Workers.

## Project Highlights

- Global comparison: base app + in-app purchases across regions
- Shareable pages (`/app/[id]`) + dynamic Open Graph comparison cards
- SEO structure: `sitemap.xml`, `robots.txt`, JSON-LD
- Single repository for Vercel + Cloudflare Workers deployment
- AdSense integration + optional manual side ad slots
- In-memory cache + optional distributed cache (KV / Redis)

## Acknowledgement

This project is inspired by the original project below and rebuilt with a modern Node.js + React stack:

- Reference: [hypooo/app-store-price](https://github.com/hypooo/app-store-price)

Thanks to the original author and community.

## Features

- Multi-region app search (iPhone / iPad / Mac / TV)
- Region-level detail view with CNY conversion
- Trending searches + quick app shortcuts
- Dark / light / system theme
- Shareable app pages with object-level share links (`?object=`)
- Dynamic social preview card generation (`/api/og`)
- Legacy-compatible endpoints (`/app/*`) and modern REST endpoints (`/api/*`)

## Free Data Sources

All core sources used by `appstore-price` are publicly accessible/free to query:

- Apple App Store webpages: `https://apps.apple.com/...`
- Exchange rates: `https://open.er-api.com/v6/latest/{currency}`

## Tech Stack

- Frontend: Next.js App Router + React 19
- Backend: Next.js Route Handlers (Node runtime)
- Parsing: `fetch + cheerio`
- Concurrency: `p-limit`
- Validation: `zod`
- Cache: `lru-cache` + optional Cloudflare KV / Upstash Redis

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy on Vercel

1. Import this repo into Vercel
2. Framework: Next.js (auto-detected)
3. Build Command: `npm run build`
4. Install Command: `npm install`
5. Optional env vars:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_ADSENSE_SLOT_HERO`
   - `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT`

## Deploy on Cloudflare Workers

```bash
npm run cf:build
npx wrangler deploy
```

Optional helper scripts:

```bash
npm run cf:preview
npm run cf:deploy
```

## API

Legacy-compatible:

- `POST /app/getAreaList`
- `POST /app/getPopularSearchWordList`
- `POST /app/getAppList`
- `POST /app/getAppInfo`
- `POST /app/getAppInfoComparison`

Modern:

- `GET /api/areas`
- `GET /api/popular-searches`
- `POST /api/apps/search`
- `GET /api/apps/:appId`
- `GET /api/apps/:appId/comparison`
- `GET /api/og?appId=...&object=...`
