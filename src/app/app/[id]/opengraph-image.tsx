import { ImageResponse } from "next/og";
import { getAppInfo, getAppInfoComparison } from "@/lib/apple";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function cleanId(id: string) {
  return id.trim().replace(/^id/i, "");
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appId = cleanId(id);

  let title = `App ${appId}`;
  let subtitle = "Global App Store price snapshot";
  let cheapest = "N/A";

  try {
    const info = await getAppInfo(appId);
    const comparison = await getAppInfoComparison(appId);
    if (info[0]?.name) title = info[0].name;
    if (info[0]?.subtitle) subtitle = info[0].subtitle;
    const item = comparison[0]?.priceList?.[0];
    if (item) cheapest = `${item.areaName} · ¥${item.cnyPrice.toFixed(2)}`;
  } catch {
    // Keep fallback text
  }

  return new ImageResponse(
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
          <span style={{ fontSize: 22, opacity: 0.85 }}>App Store Matrix</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.08 }}>{title}</div>
          <div style={{ fontSize: 30, opacity: 0.86 }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28 }}>
          <span style={{ opacity: 0.82 }}>Cheapest Region</span>
          <strong>{cheapest}</strong>
        </div>
      </div>
    ),
    size
  );
}
