import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ProductItemPRO from "../../../components/ProductItemPRO/ProductItemPRO";
import "../HomePage.scss";
import "./Goma.scss";
import {
  getProData,
  fetchProDataFiltersByCategory,
} from "../../../services/api";
import { useLanguage } from "../../../context/Language";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import loader from "../../../assets/svg/Gomisteria_LOADER_1.gif";
const ITEMS_PER_PAGE = 12;

const parseParam = (params: URLSearchParams, key: string): string[] => {
  const val = params.get(key);
  return val ? val.split(",").filter(Boolean) : [];
};

const Goma: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { currentUser } = useAuth();

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data + meta
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);

  // ---------- Size finder (moved from Home) ----------
  const [width, setWidth] = useState("");
  const [profile, setProfile] = useState("");
  const [rim, setRim] = useState("");

  const [widthOptions, setWidthOptions] = useState<string[]>([]);
  const [profileOptions, setProfileOptions] = useState<string[]>([]);
  const [rimOptions, setRimOptions] = useState<string[]>([]);

  const goFindTires = () => {
    setSelectedExtra6(width ? [width] : []);
    setSelectedExtra7(profile ? [profile] : []);
    setSelectedExtra5(rim ? [rim] : []);
  };
  // ---------------------------------------------------

  // Filters (selected) — initialized from URL
  const [selectedklasifikimi4, setSelectedklasifikimi4] = useState<string[]>(() => parseParam(searchParams, "klasifikimi4"));
  const [selectedbrand, setSelectedbrand] = useState<string[]>(() => parseParam(searchParams, "brand"));
  const [selectedDepo, setSelectedDepo] = useState<string[]>(() => parseParam(searchParams, "depo"));
  const [selectedExtra6, setSelectedExtra6] = useState<string[]>([]); // width — set from URL in existing effect
  const [selectedExtra7, setSelectedExtra7] = useState<string[]>([]); // profile — set from URL in existing effect
  const [selectedExtra5, setSelectedExtra5] = useState<string[]>([]); // rim — set from URL in existing effect

  // Filter options (available)
  const [allklasifikimi4Options, setAllklasifikimi4Options] = useState<
    string[]
  >([]);
  const [availablebrandOptions, setAvailablebrandOptions] = useState<string[]>(
    []
  );
  const [availableDepoOptions, setAvailableDepoOptions] = useState<string[]>(
    []
  );

  // Loading/error
  const [isBootLoading, setIsBootLoading] = useState<boolean>(true);
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // Infinite scroll machinery
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const requestIdRef = useRef(0);

  // Always include category Gomë
  const filters = useMemo(() => {
    const f: Record<string, string | string[]> = { category: "Gomë" };
    if (selectedklasifikimi4.length) f.klasifikimi4 = selectedklasifikimi4;
    if (selectedbrand.length) f.brand = selectedbrand;
    if (selectedDepo.length) f.Warehouse = selectedDepo;
    if (selectedExtra6.length) f.extra6 = selectedExtra6; // width
    if (selectedExtra7.length) f.extra7 = selectedExtra7; // profile
    if (selectedExtra5.length) f.extra5 = selectedExtra5; // rim (e.g. 15")
    return f;
  }, [
    selectedklasifikimi4,
    selectedbrand,
    selectedDepo,
    selectedExtra6,
    selectedExtra7,
    selectedExtra5,
  ]);

  // Deduplicate by stable key
  const dedupeByKey = useCallback((arr: any[]) => {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const it of arr) {
      const key = String(
        it?.itemCode ??
          it?.id ??
          it?.code ??
          it?.sku ??
          `${it?.name ?? "item"}-${it?.barcode ?? ""}`
      );
      if (!seen.has(key)) {
        seen.add(key);
        out.push(it);
      }
    }
    return out;
  }, []);

  // Fetch a page (reset vs append)
  const fetchPage = useCallback(
    async (pageToLoad: number, mode: "reset" | "append") => {
      const myRequestId = ++requestIdRef.current;

      if (mode === "reset") {
        setIsBootLoading(true);
        setError(null);
      } else {
        setIsLoadingNext(true);
      }

      try {
        const response = await getProData(ITEMS_PER_PAGE, pageToLoad, filters);
        if (myRequestId !== requestIdRef.current) return;

        const serverData = Array.isArray(response?.data) ? response.data : [];
        setMeta(response?.meta || {});
        setItems((prev) =>
          mode === "reset" ? serverData : dedupeByKey([...prev, ...serverData])
        );
      } catch (err) {
        if (myRequestId !== requestIdRef.current) return;
        setError(err);
      } finally {
        if (mode === "reset") setIsBootLoading(false);
        else setIsLoadingNext(false);
      }
    },
    [filters, dedupeByKey]
  );

  // Load filter options on mount (and size-finder options)
  useEffect(() => {
    (async () => {
      try {
        const result = await fetchProDataFiltersByCategory("Gomë");

        setAllklasifikimi4Options(result?.klasifikimi4 || []);
        setAvailablebrandOptions(result?.brand || []);
        setAvailableDepoOptions(result?.Warehouse || []);

        // size-finder options (moved from Home)
        setWidthOptions((result?.extra6 || []).sort());
        setProfileOptions((result?.extra7 || []).sort());
        setRimOptions((result?.extra5 || []).sort()); // values like 15"
      } catch (err) {
        console.error("Error fetching filter options", err);
      }
    })();
  }, []);

  // Read query string on mount to preselect size (including klasifikimi1 split)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    const q6 = (qs.get("extra6") || "").trim();
    const q7 = (qs.get("extra7") || "").trim();
    const q5 = (qs.get("extra5") || "").trim();

    const k1 = (qs.get("klasifikimi1") || "").trim(); // e.g. 1956515

    const deriveFromK1 = (s: string) => {
      if (!/^\d{7}$/.test(s)) return { w: "", p: "", r: "" };
      const w = s.slice(0, 3);
      const p = s.slice(3, 5);
      const r = s.slice(5, 7);
      return { w, p, r: `${r}"` };
    };

    const next6 = q6 || (k1 ? deriveFromK1(k1).w : "");
    const next7 = q7 || (k1 ? deriveFromK1(k1).p : "");
    const next5 = q5 || (k1 ? deriveFromK1(k1).r : "");

    if (next6) setSelectedExtra6([next6]);
    if (next7) setSelectedExtra7([next7]);
    if (next5) setSelectedExtra5([next5]);

    // Also sync visible size-finder controls:
    setWidth(next6);
    setProfile(next7);
    setRim(next5);
  }, []);

  // Sync selected filters → URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedklasifikimi4.length) params.set("klasifikimi4", selectedklasifikimi4.join(","));
    if (selectedbrand.length) params.set("brand", selectedbrand.join(","));
    if (selectedDepo.length) params.set("depo", selectedDepo.join(","));
    if (selectedExtra6.length) params.set("extra6", selectedExtra6[0]);
    if (selectedExtra7.length) params.set("extra7", selectedExtra7[0]);
    if (selectedExtra5.length) params.set("extra5", selectedExtra5[0]);
    setSearchParams(params, { replace: true });
  }, [selectedklasifikimi4, selectedbrand, selectedDepo, selectedExtra6, selectedExtra7, selectedExtra5, setSearchParams]);

  // Reset & fetch first page whenever filters change
  useEffect(() => {
    setPage(1);
    setItems([]);
    setMeta({});
    fetchPage(1, "reset");
  }, [filters, fetchPage]);

  // Has more pages?
  const hasMore = useMemo(() => {
    const cur = Number(meta?.currentPage ?? 1);
    const total = Number(meta?.totalPages ?? 1);
    return cur < total;
  }, [meta]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (isBootLoading || isLoadingNext) return;
        if (!hasMore) return;

        const next = page + 1;
        setPage(next);
        fetchPage(next, "append");
      },
      { root: null, rootMargin: "600px 0px 600px 0px", threshold: 0.01 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [page, hasMore, isBootLoading, isLoadingNext, fetchPage]);

  // Handlers
  const handleklasifikimi4Change = (value: string) => {
    setSelectedklasifikimi4((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const handlebrandChange = (brand: string) => {
    setSelectedbrand((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };
  const handleCheckboxChange = (value: string, stateSetter: any) => {
    stateSetter((prev: string[]) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const hasAnyFilterOptions =
    allklasifikimi4Options.length > 0 ||
    availablebrandOptions.length > 0 ||
    availableDepoOptions.length > 0;

  if (error)
    return <p>Error loading products: {error?.message ?? "Unknown error"}</p>;

  return (
    <div>
      <Header />
      <div className="home-wrapper">
          <div className="sizeFinderMobile container">
            <div className="sizeFinderRow">
              <div className="sizeCol">
                <select
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                >
                  <option value="">
                    {currentLanguage === "en" ? "Width" : "Gjerësia"}
                  </option>
                  {widthOptions.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sizeCol">
                <select
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                >
                  <option value="">
                    {currentLanguage === "en" ? "Profile" : "Lartësia"}
                  </option>
                  {profileOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sizeCol">
                <select value={rim} onChange={(e) => setRim(e.target.value)}>
                  <option value="">
                    {currentLanguage === "en" ? "Inch" : "Inchi"}
                  </option>
                  {rimOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <button className="sizeFindButton" onClick={goFindTires}>
                {currentLanguage === "en" ? "Find tires" : "Gjej gomat"}
              </button>
            </div>
          </div>
        {hasAnyFilterOptions && (
        <div className="homepage-filter">
          <div className="home-filter-left">
            <h3>{currentLanguage === "en" ? "Tires" : "Goma"}</h3>

            {allklasifikimi4Options.length > 0 && (
              <div className="filter-item">
                {allklasifikimi4Options.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedklasifikimi4.includes(option)}
                      onChange={() => handleklasifikimi4Change(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {availablebrandOptions.length > 0 && (
              <div className="filter-item">
                <h5>{currentLanguage === "en" ? "Brands" : "Brendet"}</h5>
                {availablebrandOptions.map((brand) => (
                  <label key={brand}>
                    <input
                      type="checkbox"
                      checked={selectedbrand.includes(brand)}
                      onChange={() => handlebrandChange(brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            )}
            {currentUser &&
              currentUser?.specialFields?.country !== "Kosovo" &&
              availableDepoOptions.length > 0 && (
                <div className="filter-item">
                  <h5>{currentLanguage === "en" ? "Warehouse" : "Depo"}</h5>
                  {availableDepoOptions.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        checked={selectedDepo.includes(option)}
                        onChange={() =>
                          handleCheckboxChange(option, setSelectedDepo)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
          </div>
        </div>
        )}

        <div className="homepage-products">
          {/* Size Finder */}
          <div className="sizeFinder container">
            <div className="sizeFinderRow">
              <div className="sizeCol">
                <select
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                >
                  <option value="">
                    {currentLanguage === "en" ? "Width" : "Gjerësia"}
                  </option>
                  {widthOptions.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sizeCol">
                <select
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                >
                  <option value="">
                    {currentLanguage === "en" ? "Profile" : "Lartësia"}
                  </option>
                  {profileOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sizeCol">
                <select value={rim} onChange={(e) => setRim(e.target.value)}>
                  <option value="">
                    {currentLanguage === "en" ? "Inch" : "Inchi"}
                  </option>
                  {rimOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <button className="sizeFindButton" onClick={goFindTires}>
                {currentLanguage === "en" ? "Find tires" : "Gjej gomat"}
              </button>
            </div>
          </div>
          {isBootLoading && <img src={loader} alt="loader" style={{width: '300px', marginTop: '20px'}}/>}

          {!isBootLoading && items.length === 0 ? (
            <p>No products found</p>
          ) : (
            <>
              <div className="home-products-section-products">
                {items.map((product: any, index: number) => (
                  <ProductItemPRO
                    key={`${
                      product?.itemCode ?? product?.id ?? product?.sku ?? index
                    }-${index}`}
                    productData={product}
                  />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} style={{ height: 1 }} />

              {isLoadingNext && (
                <div style={{ textAlign: "center", padding: 16 }}>
                  Loading more…
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Goma;
