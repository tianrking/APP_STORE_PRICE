"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AppInfoComparisonItem, AppInfoItem, AppListItem } from "@/lib/types";

interface AreaOption {
  code: string;
  name: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

async function postJSON<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}

function formatPrice(price: number, locale = "zh-CN") {
  if (price === 0) return "Free";
  return Number(price).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toFlagEmoji(countryCode: string) {
  if (countryCode.length !== 2) return "🏳";
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join("");
}

export function AppStoreClient() {
  const [appName, setAppName] = useState("ChatGPT");
  const [areaCode, setAreaCode] = useState("us");
  const [areaList, setAreaList] = useState<AreaOption[]>([{ code: "us", name: "United States" }]);

  const [appList, setAppList] = useState<AppListItem[]>([]);
  const [loadingAppList, setLoadingAppList] = useState(false);
  const [errorAppList, setErrorAppList] = useState("");

  const [popularWords, setPopularWords] = useState<string[]>([]);
  const [showPopularWords, setShowPopularWords] = useState(false);

  const [selectedAppImage, setSelectedAppImage] = useState("");

  const [results, setResults] = useState<AppInfoItem[]>([]);
  const [comparisonResults, setComparisonResults] = useState<AppInfoComparisonItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");
  const [searched, setSearched] = useState(false);

  const [appListCollapsed, setAppListCollapsed] = useState(false);
  const [selectedComparisonIndex, setSelectedComparisonIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState<"comparison" | "list">("comparison");

  const [colorMode, setColorMode] = useState<"light" | "dark" | "system">("system");
  const [showTopButton, setShowTopButton] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    void (async () => {
      const [areasRes, popularRes] = await Promise.all([
        postJSON<AreaOption[]>("/app/getAreaList", {}),
        postJSON<string[]>("/app/getPopularSearchWordList", {})
      ]);

      if (areasRes.code === 0 && areasRes.data.length > 0) {
        setAreaList(areasRes.data);
      }
      if (popularRes.code === 0) {
        setPopularWords(popularRes.data ?? []);
      }
    })();

    const stored = localStorage.getItem("colorMode") as "light" | "dark" | "system" | null;
    setColorMode(stored ?? "system");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      colorMode === "dark" ||
      (colorMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", isDark);
    localStorage.setItem("colorMode", colorMode);
  }, [colorMode]);

  useEffect(() => {
    function onScroll() {
      setShowTopButton(window.scrollY > 500);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentApp = useMemo(() => {
    if (results.length === 0) return null;
    return results.find((item) => item.area.toLowerCase() === areaCode.toLowerCase()) ?? results[0];
  }, [results, areaCode]);

  async function fetchPopularWords() {
    const response = await postJSON<string[]>("/app/getPopularSearchWordList", {});
    if (response.code === 0) {
      setPopularWords(response.data ?? []);
    }
  }

  async function searchAppList() {
    const trimmed = appName.trim();
    if (!trimmed) {
      setErrorAppList("Please enter an app name");
      return;
    }
    if (trimmed.length > 20) {
      setErrorAppList("App name must be 20 characters or fewer");
      return;
    }

    setLoadingAppList(true);
    setErrorAppList("");
    setAppList([]);
    setResults([]);
    setComparisonResults([]);
    setErrorDetail("");
    setSearched(false);
    setAppListCollapsed(false);

    const response = await postJSON<AppListItem[]>("/app/getAppList", {
      appName: trimmed,
      areaCode
    });

    if (response.code === 0) {
      const list = response.data ?? [];
      setAppList(list);
      if (list.length === 0) {
        setErrorAppList("No results. Try another keyword or region.");
      }
    } else {
      setErrorAppList(response.message || "Search failed");
    }

    setLoadingAppList(false);
    await fetchPopularWords();
  }

  async function selectApp(app: AppListItem) {
    setSelectedAppImage(app.appImage);
    setResults([]);
    setComparisonResults([]);
    setErrorDetail("");
    setCurrentTab("comparison");
    setAppListCollapsed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    await searchApp(app.appId);
  }

  async function searchApp(id: string) {
    const cleanId = id.trim().replace(/^id/i, "");
    if (!cleanId) return;

    setLoadingDetail(true);
    setErrorDetail("");

    const infoRes = await postJSON<AppInfoItem[]>("/app/getAppInfo", { appId: cleanId });
    if (infoRes.code !== 0) {
      setErrorDetail(infoRes.message || "Failed to load details");
      setLoadingDetail(false);
      return;
    }

    const detail = infoRes.data ?? [];
    setResults(detail);
    setSearched(true);
    if (detail.length === 0) {
      setErrorDetail("No detailed result found for this app");
      setLoadingDetail(false);
      return;
    }

    const compareRes = await postJSON<AppInfoComparisonItem[]>("/app/getAppInfoComparison", { appId: cleanId });
    if (compareRes.code === 0) {
      setComparisonResults(compareRes.data ?? []);
      setSelectedComparisonIndex(0);
    }

    setLoadingDetail(false);
  }

  return (
    <div className="nova-shell">
      <div className="nova-bg-orb nova-bg-orb-a" />
      <div className="nova-bg-orb nova-bg-orb-b" />

      <header className="nova-topbar">
        <div className="nova-wrap nova-topbar-inner">
          <div className="nova-brand">
            <Image src="/image.png" alt="logo" width={30} height={30} className="nova-brand-logo" />
            <div>
              <div className="nova-brand-title">Price Atlas</div>
              <div className="nova-brand-sub">Global App Cost Intelligence</div>
            </div>
          </div>

          <div className="nova-theme-switch">
            <button
              className={colorMode === "system" ? "nova-theme-btn active" : "nova-theme-btn"}
              onClick={() => setColorMode("system")}
            >
              Auto
            </button>
            <button
              className={colorMode === "light" ? "nova-theme-btn active" : "nova-theme-btn"}
              onClick={() => setColorMode("light")}
            >
              Light
            </button>
            <button
              className={colorMode === "dark" ? "nova-theme-btn active" : "nova-theme-btn"}
              onClick={() => setColorMode("dark")}
            >
              Dark
            </button>
          </div>
        </div>
      </header>

      <main className="nova-wrap nova-main">
        <section className="nova-hero-panel">
          <p className="nova-kicker">App Store Arbitrage Lens</p>
          <h1>Discover pricing gaps before you buy</h1>
          <p className="nova-hero-copy">
            Search once, compare globally, and inspect in-app purchase tiers across markets.
          </p>
          <div className="nova-stat-row">
            <span className="nova-stat-pill">{areaList.length} regions tracked</span>
            <span className="nova-stat-pill">Hourly-access architecture</span>
            <span className="nova-stat-pill">Native in-app comparison</span>
          </div>
        </section>

        <section className="nova-search-panel">
          <div className="nova-search-grid">
            <label className="nova-field">
              <span>Region</span>
              <select
                className="nova-control"
                value={areaCode}
                onChange={(event) => setAreaCode(event.target.value)}
                disabled={loadingAppList || loadingDetail}
              >
                {areaList.map((area) => (
                  <option key={area.code} value={area.code}>
                    {area.name} ({area.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </label>

            <label className="nova-field nova-field-grow">
              <span>App Query</span>
              <div className="nova-input-wrap">
                <input
                  ref={inputRef}
                  className="nova-control"
                  value={appName}
                  maxLength={20}
                  placeholder="ChatGPT, Claude, CapCut ..."
                  onChange={(event) => setAppName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void searchAppList();
                    }
                  }}
                  onFocus={() => {
                    if (blurTimeoutRef.current) {
                      window.clearTimeout(blurTimeoutRef.current);
                      blurTimeoutRef.current = null;
                    }
                    setShowPopularWords(true);
                    void fetchPopularWords();
                  }}
                  onBlur={() => {
                    blurTimeoutRef.current = window.setTimeout(() => {
                      setShowPopularWords(false);
                    }, 200);
                  }}
                />

                {showPopularWords && popularWords.length > 0 ? (
                  <div className="nova-popover" onMouseDown={(event) => event.preventDefault()}>
                    <p className="nova-popover-title">Trending Searches</p>
                    <div className="nova-chip-row">
                      {popularWords.map((word) => (
                        <button
                          key={word}
                          className="nova-chip"
                          onClick={() => {
                            setAppName(word);
                            setShowPopularWords(false);
                            void searchAppList();
                          }}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </label>

            <button className="nova-search-btn" onClick={() => void searchAppList()} disabled={loadingAppList || loadingDetail}>
              {loadingAppList ? "Scanning..." : "Scan Prices"}
            </button>
          </div>

          {errorAppList ? <p className="nova-error">{errorAppList}</p> : null}
        </section>

        {appList.length > 0 && !loadingAppList ? (
          <section className="nova-results-panel">
            <div className="nova-panel-head">
              <h2>Candidate Apps · {appList.length}</h2>
              <button className="nova-text-btn" onClick={() => setAppListCollapsed((value) => !value)}>
                {appListCollapsed ? "Expand" : "Collapse"}
              </button>
            </div>

            {!appListCollapsed ? (
              <div className="nova-card-grid">
                {appList.map((app) => (
                  <button key={app.appId} className="nova-app-card" onClick={() => void selectApp(app)}>
                    <img
                      src={app.appImage}
                      alt={app.appName}
                      className="nova-app-icon"
                      onError={(event) => {
                        event.currentTarget.src = "/image.png";
                      }}
                    />
                    <div className="nova-app-meta">
                      <p className="nova-app-name">{app.appName}</p>
                      <p className="nova-app-desc">{app.appDesc || "App"}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="nova-collapsed">Results hidden. Tap to expand.</div>
            )}
          </section>
        ) : null}

        {loadingDetail ? <section className="nova-status">Building global price matrix...</section> : null}
        {errorDetail ? <section className="nova-error-panel">{errorDetail}</section> : null}

        {(results.length > 0 || comparisonResults.length > 0) && !loadingDetail && appListCollapsed ? (
          <section className="nova-analysis-panel">
            <div className="nova-tab-row">
              <button
                className={currentTab === "comparison" ? "nova-tab active" : "nova-tab"}
                onClick={() => setCurrentTab("comparison")}
              >
                Price Matrix
              </button>
              <button
                className={currentTab === "list" ? "nova-tab active" : "nova-tab"}
                onClick={() => setCurrentTab("list")}
              >
                Regional Ledger
              </button>
            </div>

            {currentTab === "comparison" ? (
              <>
                {currentApp ? (
                  <article className="nova-focus-card">
                    <img
                      src={selectedAppImage}
                      alt={currentApp.name}
                      className="nova-focus-icon"
                      onError={(event) => {
                        event.currentTarget.src = "/image.png";
                      }}
                    />
                    <div>
                      <h3>{currentApp.name || appName}</h3>
                      <p>{currentApp.subtitle}</p>
                      <p className="nova-muted">{currentApp.developer}</p>
                      <a href={currentApp.appStoreUrl} target="_blank" rel="noreferrer" className="nova-link">
                        Open in App Store
                      </a>
                    </div>
                  </article>
                ) : null}

                {comparisonResults.length > 0 ? (
                  <>
                    <div className="nova-object-tabs">
                      {comparisonResults.map((item, index) => (
                        <button
                          key={`${item.object}-${index}`}
                          className={index === selectedComparisonIndex ? "nova-object-tab active" : "nova-object-tab"}
                          onClick={() => setSelectedComparisonIndex(index)}
                        >
                          {item.object}
                        </button>
                      ))}
                    </div>

                    <div className="nova-price-grid">
                      {comparisonResults[selectedComparisonIndex]?.priceList.map((price, index) => (
                        <div key={`${price.area}-${index}`} className="nova-price-tile">
                          <p className="nova-price-area">
                            {toFlagEmoji(price.area)} {price.areaName}
                          </p>
                          <p className="nova-price-main">¥ {formatPrice(price.cnyPrice, "zh-CN")}</p>
                          <p className="nova-price-sub">
                            {price.currency} {price.price === 0 ? "Free" : formatPrice(price.price, price.locale)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="nova-ledger-list">
                {results.map((app) => (
                  <article key={app.area} className="nova-ledger-card">
                    <div className="nova-ledger-head">
                      <img
                        src={selectedAppImage}
                        alt={app.name}
                        className="nova-focus-icon"
                        onError={(event) => {
                          event.currentTarget.src = "/image.png";
                        }}
                      />
                      <div>
                        <h3>{app.name}</h3>
                        <p>{app.subtitle}</p>
                        <p className="nova-muted">{app.developer}</p>
                        <p className="nova-muted">
                          {toFlagEmoji(app.area)} {app.areaName}
                        </p>
                        <p className="nova-ledger-price">
                          {app.price.currency} {app.price.price === 0 ? "Free" : formatPrice(app.price.price, app.price.locale)}
                          {app.price.price > 0 ? `  ·  ≈ ¥${formatPrice(app.price.cnyPrice, "zh-CN")}` : ""}
                        </p>
                        <a href={app.appStoreUrl} target="_blank" rel="noreferrer" className="nova-link">
                          Open Store Page
                        </a>
                      </div>
                    </div>

                    <div className="nova-iap-table">
                      <div className="nova-iap-head">
                        <span>Item</span>
                        <span>Local</span>
                        <span>CNY</span>
                      </div>

                      {app.inAppPurchaseList.length === 0 ? (
                        <div className="nova-iap-empty">No in-app purchases</div>
                      ) : (
                        app.inAppPurchaseList.map((item, index) => (
                          <div key={`${item.object}-${index}`} className="nova-iap-row">
                            <span>{item.object}</span>
                            <span>
                              {item.price.price === 0
                                ? "Free"
                                : `${item.price.currency} ${formatPrice(item.price.price, item.price.locale)}`}
                            </span>
                            <span>{item.price.price > 0 ? `¥ ${formatPrice(item.price.cnyPrice, "zh-CN")}` : "-"}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {!loadingAppList && !loadingDetail && !errorAppList && !errorDetail && appList.length === 0 && !searched ? (
          <section className="nova-empty">Start with an app name to generate your first price atlas.</section>
        ) : null}
      </main>

      {showTopButton ? (
        <button className="nova-float" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Top
        </button>
      ) : null}
    </div>
  );
}
