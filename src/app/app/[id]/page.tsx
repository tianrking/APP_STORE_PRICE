import type { Metadata } from "next";
import { getAppInfo, getAppInfoComparison } from "@/lib/apple";

function cleanId(id: string) {
  return id.trim().replace(/^id/i, "");
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const appId = cleanId(id);

  try {
    const infoList = await getAppInfo(appId);
    const first = infoList[0];
    const title = first?.name ? `${first.name} | Price Atlas` : `App ${appId} | Price Atlas`;
    const description = first?.subtitle || "Global App Store pricing, region comparison, and in-app purchase matrix.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `/app/${appId}`,
        images: [{ url: `/app/${appId}/opengraph-image` }]
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`/app/${appId}/opengraph-image`]
      },
      alternates: {
        canonical: `/app/${appId}`
      }
    };
  } catch {
    return {
      title: `App ${appId} | Price Atlas`,
      description: "Global App Store pricing and in-app purchase comparison."
    };
  }
}

export default async function AppSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appId = cleanId(id);

  const infoList = await getAppInfo(appId);
  const comparison = await getAppInfoComparison(appId);

  const first = infoList[0];
  const cheapest = comparison[0]?.priceList?.[0];
  const offers = comparison[0]?.priceList?.slice(0, 6) ?? [];

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
