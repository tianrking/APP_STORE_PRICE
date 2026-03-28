# AppStore PriceScope 🔍

全球 App Store 比价与汇率追踪矩阵

Language: **English** | [繁體中文](./README.zh-Hant.md) | [Español](./README.es.md)

A full-stack App Store price intelligence platform built with Node.js + React (Next.js), optimized for Vercel.

## Features

- Multi-region App search (iPhone / iPad / Mac / TV)
- Global price comparison (base app + in-app purchases)
- Region-level detail view with currency conversion to CNY
- Popular search words
- Dark / light / system theme
- Compatible legacy endpoints (`/app/*`) and modern REST endpoints (`/api/*`)
- In-memory cache by default, optional shared Redis cache for multi-instance deployments

## Data Sources

- Apple App Store webpages: `https://apps.apple.com/...`
- Exchange rates: `https://open.er-api.com/v6/latest/{currency}`

## Tech Stack

- Frontend: Next.js App Router + React 19
- Backend: Next.js Route Handlers (Node runtime)
- Parsing: `fetch + cheerio`
- Concurrency: `p-limit`
- Validation: `zod`
- Cache: `lru-cache` + optional Upstash Redis

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Deploy on Vercel

1. Import this repo into Vercel
2. Framework: Next.js (auto-detected)
3. Build Command: `npm run build`
4. Install Command: `npm install`
5. Optional env vars for shared cache:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

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
