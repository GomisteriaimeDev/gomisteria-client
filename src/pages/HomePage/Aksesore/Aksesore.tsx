import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import loader from "../../../assets/svg/Gomisteria_LOADER_1.gif";
import {
  getProData,
  fetchProDataFiltersByCategory,
} from "../../../services/api";
import "../HomePage.scss";
import "./Aksesore.scss";
import ProductItemPRO from "../../../components/ProductItemPRO/ProductItemPRO";
import { useLanguage } from "../../../context/Language";
import { useAuth } from "../../../context/AuthContext";

const ITEMS_PER_PAGE = 12;

const parseParam = (params: URLSearchParams, key: string): string[] => {
  const val = params.get(key);
  return val ? val.split(",").filter(Boolean) : [];
};

const Aksesore: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data & meta
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);

  // Filters — initialized from URL
  const [selectedklasifikimi3, setSelectedklasifikimi3] = useState<string[]>(
    () => parseParam(searchParams, "klasifikimi3")
  );
  const [selectedDepo, setSelectedDepo] = useState<string[]>(
    () => parseParam(searchParams, "depo")
  );

  // Filter options
  const [klasifikimi3Options, setklasifikimi3Options] = useState<string[]>([]);
  const [availableDepoOptions, setAvailableDepoOptions] = useState<string[]>(
    []
  );

  // Loading & error
  const [isBootLoading, setIsBootLoading] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Infinite scroll refs
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const requestIdRef = useRef(0);

  // Filters object
  const filters = useMemo(() => {
    const f: Record<string, string | string[]> = { category: "Aksesorë" };
    if (selectedklasifikimi3.length) f.klasifikimi3 = selectedklasifikimi3;
    if (selectedDepo.length) f.Warehouse = selectedDepo;
    return f;
  }, [selectedklasifikimi3, selectedDepo]);

  // Deduplication helper
  const dedupeByKey = useCallback((arr: any[]) => {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const it of arr) {
      const key = String(
        it?.itemCode ??
          it?.id ??
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

  // Fetch page
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
        setError("Failed to fetch products.");
      } finally {
        if (mode === "reset") setIsBootLoading(false);
        else setIsLoadingNext(false);
      }
    },
    [filters, dedupeByKey]
  );

  // Fetch filter options once
  useEffect(() => {
    (async () => {
      try {
        const result = await fetchProDataFiltersByCategory("Aksesorë");
        setklasifikimi3Options(result?.klasifikimi3 || []);
        setAvailableDepoOptions(result?.Warehouse || []);
      } catch (err) {
        console.error("Error loading filter options", err);
      }
    })();
  }, []);

  // Sync selected filters → URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedklasifikimi3.length) params.set("klasifikimi3", selectedklasifikimi3.join(","));
    if (selectedDepo.length) params.set("depo", selectedDepo.join(","));
    setSearchParams(params, { replace: true });
  }, [selectedklasifikimi3, selectedDepo, setSearchParams]);

  // Reset list when filters change
  useEffect(() => {
    setPage(1);
    setItems([]);
    setMeta({});
    fetchPage(1, "reset");
  }, [filters, fetchPage]);

  // Check if more pages exist
  const hasMore = useMemo(() => {
    const cur = Number(meta?.currentPage ?? 1);
    const total = Number(meta?.totalPages ?? 1);
    return cur < total;
  }, [meta]);

  // Infinite scroll observer
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

  // Filter checkbox handler
  const handleCheckboxChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const hasAnyFilterOptions =
    klasifikimi3Options.length > 0 ||
    availableDepoOptions.length > 0;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <div className="home-wrapper">
        {hasAnyFilterOptions && (
        <div className="homepage-filter">
          <div className="home-filter-left">
            <h3>{currentLanguage === "en" ? "Accessories" : "Aksesorë"}</h3>

            {klasifikimi3Options.length > 0 && (
              <div className="filter-item">
                {klasifikimi3Options.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedklasifikimi3.includes(option)}
                      onChange={() =>
                        handleCheckboxChange(option, setSelectedklasifikimi3)
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {currentUser &&
              currentUser?.specialFields?.country !== "Kosovo" &&
              (console.log(currentUser),
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
              ))}
          </div>
        </div>
        )}

        <div className="homepage-products">
          {isBootLoading && (
            <img
              src={loader}
              alt="loader"
              style={{ width: "300px", marginTop: "20px" }}
            />
          )}
          {!isBootLoading && items.length === 0 ? (
            <p>No products found</p>
          ) : (
            <>
              <div className="home-products-section-products">
                {items.map((product: any, index: number) => (
                  <ProductItemPRO
                    key={`${
                      product?.itemCode ?? product?.id ?? index
                    }-${index}`}
                    productData={product}
                  />
                ))}
              </div>

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

export default Aksesore;
