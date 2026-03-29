# appstore-price

全球 App Store 比價與匯率追蹤矩陣。

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel)](https://vercel.com/)

語言: [English](./README.md) | **繁體中文** | [Español](./README.es.md)

- 線上站點: [https://apple.w0x7ce.eu/](https://apple.w0x7ce.eu/)
- 專案倉庫: [https://github.com/tianrking/appstore-price](https://github.com/tianrking/appstore-price)

## 專案簡介

`appstore-price` 是使用 Node.js + React（Next.js）打造的全端 App Store 比價專案，支援 Vercel 與 Cloudflare Workers 雙平台部署。

## 專案重點

- 全球完整比價：軟體本體 + 內購項目跨區比較
- 可分享頁面（`/app/[id]`）+ 動態 Open Graph 比價卡片
- SEO 結構：`sitemap.xml`、`robots.txt`、JSON-LD
- 單一倉庫同時部署 Vercel 與 Cloudflare
- AdSense 整合 + 可選左右側廣告位
- 記憶體快取 + 可選分散式快取（KV / Redis）

## 致敬原始專案

本專案受以下原始專案啟發，並以 Node.js + React 進行現代化重構：

- 參考來源: [hypooo/app-store-price](https://github.com/hypooo/app-store-price)

感謝原始作者與社群。

## 主要功能

- 多地區 App 搜尋（iPhone / iPad / Mac / TV）
- 分區明細與人民幣換算
- 熱門搜尋 + 常用 App 快捷入口
- 深色 / 淺色 / 系統主題
- 物件級分享連結（`?object=`）
- 動態社群預覽卡片（`/api/og`）
- 舊版相容接口（`/app/*`）+ 新版 REST（`/api/*`）

## 免費資料來源

`appstore-price` 核心資料來源皆為可公開存取 / 免費查詢：

- Apple App Store 網頁：`https://apps.apple.com/...`
- 匯率服務：`https://open.er-api.com/v6/latest/{currency}`

## 技術棧

- 前端：Next.js App Router + React 19
- 後端：Next.js Route Handlers（Node runtime）
- 解析：`fetch + cheerio`
- 併發：`p-limit`
- 校驗：`zod`
- 快取：`lru-cache` + 可選 Cloudflare KV / Upstash Redis

## 本地啟動

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

## Vercel 部署

1. 將倉庫匯入 Vercel
2. Framework 選 Next.js（通常可自動識別）
3. Build Command：`npm run build`
4. Install Command：`npm install`
5. 可選環境變數：
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_ADSENSE_SLOT_HERO`
   - `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT`

## Cloudflare Workers 部署

```bash
npm run cf:build
npx wrangler deploy
```

可選腳本：

```bash
npm run cf:preview
npm run cf:deploy
```

## API

相容舊接口：

- `POST /app/getAreaList`
- `POST /app/getPopularSearchWordList`
- `POST /app/getAppList`
- `POST /app/getAppInfo`
- `POST /app/getAppInfoComparison`

新版接口：

- `GET /api/areas`
- `GET /api/popular-searches`
- `POST /api/apps/search`
- `GET /api/apps/:appId`
- `GET /api/apps/:appId/comparison`
- `GET /api/og?appId=...&object=...`
