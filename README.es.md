# AppStore PriceScope 🔍

Matriz global de comparación de precios y seguimiento de tipo de cambio en App Store

Idioma: [English](./README.md) | [繁體中文](./README.zh-Hant.md) | **Español**

Plataforma completa de inteligencia de precios de App Store construida con Node.js + React (Next.js), optimizada para Vercel.

## Funcionalidades

- Búsqueda multi-región (iPhone / iPad / Mac / TV)
- Comparación global de precios (app base + compras dentro de la app)
- Vista detallada por región con conversión a CNY
- Palabras de búsqueda populares
- Tema oscuro / claro / sistema
- Compatibilidad con endpoints heredados (`/app/*`) y REST moderno (`/api/*`)
- Caché en memoria por defecto y caché compartido opcional con Upstash Redis

## Fuentes de datos

- Páginas de Apple App Store: `https://apps.apple.com/...`
- Tipo de cambio: `https://open.er-api.com/v6/latest/{currency}`

## Stack técnico

- Frontend: Next.js App Router + React 19
- Backend: Next.js Route Handlers (Node runtime)
- Parsing: `fetch + cheerio`
- Concurrencia: `p-limit`
- Validación: `zod`
- Caché: `lru-cache` + Upstash Redis opcional

## Ejecución local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`

## Despliegue en Vercel

1. Importa este repositorio en Vercel
2. Framework: Next.js (auto-detectado)
3. Build Command: `npm run build`
4. Install Command: `npm install`
5. Variables opcionales para caché compartido:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## API

Compatibilidad heredada:

- `POST /app/getAreaList`
- `POST /app/getPopularSearchWordList`
- `POST /app/getAppList`
- `POST /app/getAppInfo`
- `POST /app/getAppInfoComparison`

Moderna:

- `GET /api/areas`
- `GET /api/popular-searches`
- `POST /api/apps/search`
- `GET /api/apps/:appId`
- `GET /api/apps/:appId/comparison`
