import { ImageResponse } from "next/og";
import { getAppInfo, getAppInfoComparison } from "@/lib/apple";

export const runtime = "nodejs";

function cleanId(id: string) {
  return id.trim().replace(/^id/i, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawAppId = searchParams.get("appId") ?? "";
  const appId = cleanId(rawAppId);
  const targetObject = searchParams.get("object")?.trim();

  if (!appId) {
    return new Response("Missing appId", { status: 400 });
  }

  let title = `App ${appId}`;
  let subtitle = "Global App Store price snapshot";
  let objectLabel = "Base App";
  let cheapest = "N/A";

  try {
    const info = await getAppInfo(appId);
    const comparison = await getAppInfoComparison(appId);
    const selected =
      comparison.find((item) => (targetObject ? item.object === targetObject : item.object === "软件本体")) ??
      comparison[0];

    if (info[0]?.name) title = info[0].name;
    if (info[0]?.subtitle) subtitle = info[0].subtitle;
    if (selected?.object) objectLabel = selected.object;

    const cheapestItem = selected?.priceList?.[0];
    if (cheapestItem) {
      cheapest = `${cheapestItem.areaName} · ¥${cheapestItem.cnyPrice.toFixed(2)}`;
    }
  } catch {
    // Keep fallback text
  }

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background:
            "radial-gradient(circle at 12% 10%, rgba(255,134,94,0.45), transparent 42%), radial-gradient(circle at 90% 18%, rgba(142,127,255,0.42), transparent 40%), #140f24",
          color: "#f7f2ff",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, opacity: 0.95 }}>
          <span>Price Atlas</span>
          <span style={{ fontSize: 22, opacity: 0.7 }}>•</span>
          <span style={{ fontSize: 22, opacity: 0.85 }}>Share Card</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.08 }}>{title}</div>
          <div style={{ fontSize: 28, opacity: 0.86 }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 26 }}>
          <span style={{ opacity: 0.82 }}>Object: {objectLabel}</span>
          <strong>Cheapest: {cheapest}</strong>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );

  image.headers.set("cache-control", "public, s-maxage=1800, stale-while-revalidate=86400");
  return image;
}
