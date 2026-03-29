# appstore-price

Matriz global de comparación de precios y seguimiento de tipo de cambio en App Store.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel)](https://vercel.com/)

Idioma: [English](./README.md) | [繁體中文](./README.zh-Hant.md) | **Español**

- Sitio en línea: [https://apple.w0x7ce.eu/](https://apple.w0x7ce.eu/)
- Repositorio: [https://github.com/tianrking/appstore-price](https://github.com/tianrking/appstore-price)

## Resumen

`appstore-price` es un proyecto full-stack de comparación de precios en App Store con Node.js + React (Next.js), con soporte de despliegue dual en Vercel y Cloudflare Workers.

## Puntos Clave

- Comparación global completa: app base + compras dentro de la app
- Páginas compartibles (`/app/[id]`) + tarjetas Open Graph dinámicas
- Estructura SEO: `sitemap.xml`, `robots.txt`, JSON-LD
- Un solo repositorio para Vercel + Cloudflare Workers
- Integración AdSense + slots manuales opcionales
- Caché en memoria + caché distribuido opcional (KV / Redis)

## Reconocimiento al proyecto original

Este proyecto está inspirado en el siguiente proyecto original y reconstruido con una arquitectura moderna en Node.js + React:

- Referencia: [hypooo/app-store-price](https://github.com/hypooo/app-store-price)

Gracias al autor original y a la comunidad.

## Funcionalidades

- Búsqueda multi-región (iPhone / iPad / Mac / TV)
- Vista detallada por región con conversión a CNY
- Búsquedas populares + accesos rápidos a apps comunes
- Tema oscuro / claro / sistema
- Enlaces compartibles por objeto (`?object=`)
- Generación dinámica de tarjeta social (`/api/og`)
- Endpoints heredados (`/app/*`) + REST moderno (`/api/*`)

## Fuentes de datos gratuitas

Las fuentes principales de `appstore-price` son públicas y gratuitas:

- Páginas de Apple App Store: `https://apps.apple.com/...`
- Tipo de cambio: `https://open.er-api.com/v6/latest/{currency}`

## Stack técnico

- Frontend: Next.js App Router + React 19
- Backend: Next.js Route Handlers (Node runtime)
- Parsing: `fetch + cheerio`
- Concurrencia: `p-limit`
- Validación: `zod`
- Caché: `lru-cache` + Cloudflare KV / Upstash Redis opcional

## Ejecución local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Despliegue en Vercel

1. Importa este repositorio en Vercel
2. Framework: Next.js (auto-detectado)
3. Build Command: `npm run build`
4. Install Command: `npm install`
5. Variables opcionales:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_ADSENSE_SLOT_HERO`
   - `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT`

## Despliegue en Cloudflare Workers

```bash
npm run cf:build
npx wrangler deploy
```

Scripts opcionales:

```bash
npm run cf:preview
npm run cf:deploy
```

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
- `GET /api/og?appId=...&object=...`
