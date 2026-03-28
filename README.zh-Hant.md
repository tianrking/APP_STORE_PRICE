# AppStore PriceScope 🔍

全球 App Store 比價與匯率追蹤矩陣

語言: [English](./README.md) | **繁體中文** | [Español](./README.es.md)

以 Node.js + React（Next.js）打造的全球 App Store 價格情報平台，完整支援 Vercel 部署。

## 功能

- 多地區 App 搜尋（iPhone / iPad / Mac / TV）
- 全球價格比對（軟體本體 + 內購項目）
- 分地區明細與人民幣換算
- 熱門搜尋詞
- 深色 / 淺色 / 系統主題
- 同時支援舊版相容接口（`/app/*`）與新版 REST 接口（`/api/*`）
- 預設記憶體快取，可選 Upstash Redis 做多實例共享快取

## 資料來源

- Apple App Store 網頁：`https://apps.apple.com/...`
- 匯率服務：`https://open.er-api.com/v6/latest/{currency}`

## 技術棧

- 前端：Next.js App Router + React 19
- 後端：Next.js Route Handlers（Node runtime）
- 解析：`fetch + cheerio`
- 併發：`p-limit`
- 校驗：`zod`
- 快取：`lru-cache` + 可選 Upstash Redis

## 本地啟動

```bash
npm install
npm run dev
```

打開 `http://localhost:3000`

## Vercel 部署

1. 將此倉庫匯入 Vercel
2. Framework 選 Next.js（通常會自動識別）
3. Build Command：`npm run build`
4. Install Command：`npm install`
5. 若要共享快取可加環境變數：
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

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
