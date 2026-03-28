import type { Metadata } from "next";
import { getAppInfo, getAppInfoComparison } from "@/lib/apple";

function cleanId(id: string) {
  return id.trim().replace(/^id/i, "");
}

function selectComparisonByObject(
  comparison: Awaited<ReturnType<typeof getAppInfoComparison>>,
  object: string | undefined
) {
  if (!comparison.length) return null;
  if (!object) return comparison[0];
  let decoded = object.trim();
  try {
    decoded = decodeURIComponent(object).trim();
  } catch {
    // Keep raw value.
  }
  return comparison.find((item) => item.object === decoded) ?? comparison[0];
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ object?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { object } = await searchParams;
  const appId = cleanId(id);

  try {
    const infoList = await getAppInfo(appId);
    const comparison = await getAppInfoComparison(appId);
    const selected = selectComparisonByObject(comparison, object);
    const selectedObject = selected?.object ?? "Base App";
    const first = infoList[0];
    const title = first?.name ? `${first.name} | Price Atlas` : `App ${appId} | Price Atlas`;
    const description = `${first?.subtitle || "Global App Store pricing snapshot."} Focus: ${selectedObject}.`;
    const encodedObject = selected?.object ? encodeURIComponent(selected.object) : "";
    const objectParam = encodedObject ? `?object=${encodedObject}` : "";
    const ogImage = `/api/og?appId=${appId}${encodedObject ? `&object=${encodedObject}` : ""}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `/app/${appId}${objectParam}`,
        images: [{ url: ogImage }]
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage]
      },
      alternates: {
        canonical: `/app/${appId}${objectParam}`
      }
    };
  } catch {
    return {
      title: `App ${appId} | Price Atlas`,
      description: "Global App Store pricing and in-app purchase comparison."
    };
  }
}

export default async function AppSharePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ object?: string }>;
}) {
  const { id } = await params;
  const { object } = await searchParams;
  const appId = cleanId(id);

  const infoList = await getAppInfo(appId);
  const comparison = await getAppInfoComparison(appId);
  const selectedComparison = selectComparisonByObject(comparison, object);

  const first = infoList[0];
  const cheapest = selectedComparison?.priceList?.[0];
  const offers = selectedComparison?.priceList?.slice(0, 6) ?? [];
  const objectLabel = selectedComparison?.object ?? "Base App";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: first?.name ?? `App ${appId}`,
    operatingSystem: "iOS, iPadOS, macOS, tvOS",
    applicationCategory: "UtilitiesApplication",
    description: first?.subtitle ?? "Global App Store pricing and in-app purchase comparison.",
    offers: offers.map((item) => ({
      "@type": "Offer",
      priceCurrency: item.currencyCode,
      price: item.price,
      availability: "https://schema.org/InStock",
      areaServed: item.areaName
    }))
  };

  return (
    <main className="share-wrap">
      <article className="share-card">
        <p className="share-kicker">Price Atlas • Share View</p>
        <h1>{first?.name ?? `App ${appId}`}</h1>
        <p className="share-subtitle">{first?.subtitle ?? "Global App Store pricing snapshot"}</p>

        <div className="share-meta">
          <span>Object: {objectLabel}</span>
          <span>Developer: {first?.developer ?? "Unknown"}</span>
          <span>Regions: {infoList.length}</span>
          <span>
            Cheapest: {cheapest ? `${cheapest.areaName} · ¥${cheapest.cnyPrice.toFixed(2)}` : "N/A"}
          </span>
        </div>

        <div className="share-price-grid">
          {offers.map((item) => (
            <div key={`${item.area}-${item.currencyCode}`} className="share-price-item">
              <p>{item.areaName}</p>
              <strong>¥ {item.cnyPrice.toFixed(2)}</strong>
              <small>
                {item.currency} {item.price.toFixed(2)}
              </small>
            </div>
          ))}
        </div>

        <a className="share-cta" href={`/?appId=${appId}`}>
          Open Interactive Comparison
        </a>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
