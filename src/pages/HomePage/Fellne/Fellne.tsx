import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ProductItemPRO from "../../../components/ProductItemPRO/ProductItemPRO";
import {
  getProData,
  fetchProDataFiltersByCategory,
} from "../../../services/api";
import "../HomePage.scss";
import "./Fellne.scss";
import { useLanguage } from "../../../context/Language";
import { useAuth } from "../../../context/AuthContext";
import loader from "../../../assets/svg/Gomisteria_LOADER_1.gif";
const ITEMS_PER_PAGE = 12;

const parseParam = (params: URLSearchParams, key: string): string[] => {
  const val = params.get(key);
  return val ? val.split(",").filter(Boolean) : [];
};

const Fellne: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data + meta
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);

  // Filters (selected) — initialized from URL
  const [selectedNgjyra, setSelectedNgjyra] = useState<string[]>(() => parseParam(searchParams, "ngjyra"));
  const [selectedVetura, setSelectedVetura] = useState<string[]>(() => parseParam(searchParams, "vetura"));
  const [selectedVrimat, setSelectedVrimat] = useState<string[]>(() => parseParam(searchParams, "vrimat"));
  const [selectedDepo, setSelectedDepo] = useState<string[]>(() => parseParam(searchParams, "depo"));
  const [selectedextra1, setSelectedextra1] = useState<string[]>(() => parseParam(searchParams, "extra1"));
  const [selectedDimenzionet, setSelectedDimenzionet] = useState<string[]>(() => parseParam(searchParams, "dimenzionet"));
  const [selectedextra5, setSelectedextra5] = useState<string[]>(() => parseParam(searchParams, "extra5"));

  // Filter options (available)
  const [availableVeturaOptions, setAvailableVeturaOptions] = useState<
    string[]
  >([]);
  const [availableNgjyraOptions, setAvailableNgjyraOptions] = useState<
    string[]
  >([]);
  const [availableVrimatOptions, setAvailableVrimatOptions] = useState<
    string[]
  >([]);
  const [availableDepoOptions, setAvailableDepoOptions] = useState<string[]>(
    []
  );
  const [availableextra1Options, setAvailableextra1Options] = useState<
    string[]
  >([]);
  const [availableDimenzionetOptions, setAvailableDimenzionetOptions] =
    useState<string[]>([]);
  const [availableextra5Options, setAvailableextra5Options] = useState<
    string[]
  >([]);

  // Loading/error
  const [isBootLoading, setIsBootLoading] = useState<boolean>(true);
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // Infinite scroll machinery
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const requestIdRef = useRef(0);

  // Always force Fellne server-side; add user filters
  const filters = useMemo(() => {
    const f: Record<string, string | string[]> = { category: "Fellne" };
    if (selectedNgjyra.length) f.klasifikimi4 = selectedNgjyra;
    if (selectedVetura.length) f.klasifikimi1 = selectedVetura;
    if (selectedVrimat.length) f.klasifikimi3 = selectedVrimat;
    if (selectedDepo.length) f.Warehouse = selectedDepo;
    if (selectedextra1.length) f.extra1 = selectedextra1;
    if (selectedDimenzionet.length) f.klasifikimi2 = selectedDimenzionet;
    if (selectedextra5.length) f.extra5 = selectedextra5;
    return f;
  }, [
    selectedNgjyra,
    selectedVetura,
    selectedVrimat,
    selectedDepo,
    selectedextra1,
    selectedDimenzionet,
    selectedextra5,
  ]);

  // Strict Fellne-only guard (drop anything else)
  const enforceFellneOnly = useCallback((list: any[]) => {
    const norm = (v: any) =>
      typeof v === "string" ? v.trim().toLowerCase() : null;
    return (list || []).filter((item: any) => {
      const raw =
        item?.extra2 ??
        item?.Extra2 ??
        item?.category ??
        item?.Category ??
        null;
      return norm(raw) === "fellne";
    });
  }, []);

  // Stable dedupe by key
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

  // Fetch products (reset vs append)
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
        const felneOnly = enforceFellneOnly(serverData);

        setMeta(response?.meta || {});
        setItems((prev) =>
          mode === "reset" ? felneOnly : dedupeByKey([...prev, ...felneOnly])
        );
      } catch (err) {
        if (myRequestId !== requestIdRef.current) return;
        setError(err);
      } finally {
        if (mode === "reset") setIsBootLoading(false);
        else setIsLoadingNext(false);
      }
    },
    [filters, enforceFellneOnly, dedupeByKey]
  );

  // Initial load for filter options
  useEffect(() => {
    (async () => {
      try {
        const result = await fetchProDataFiltersByCategory("Fellne");
        setAvailableVeturaOptions(result?.klasifikimi1 || []);
        setAvailableNgjyraOptions(result?.klasifikimi4 || []);
        setAvailableVrimatOptions(result?.klasifikimi3 || []);
        setAvailableDepoOptions(result?.Warehouse || []);
        setAvailableextra1Options(result?.extra1 || []);
        setAvailableDimenzionetOptions(result?.klasifikimi2 || []);
        setAvailableextra5Options(result?.extra5 || []);
      } catch (err) {
        console.error("Error loading initial filter options", err);
      }
    })();
  }, []);

  // Sync selected filters → URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedNgjyra.length) params.set("ngjyra", selectedNgjyra.join(","));
    if (selectedVetura.length) params.set("vetura", selectedVetura.join(","));
    if (selectedVrimat.length) params.set("vrimat", selectedVrimat.join(","));
    if (selectedDepo.length) params.set("depo", selectedDepo.join(","));
    if (selectedextra1.length) params.set("extra1", selectedextra1.join(","));
    if (selectedDimenzionet.length) params.set("dimenzionet", selectedDimenzionet.join(","));
    if (selectedextra5.length) params.set("extra5", selectedextra5.join(","));
    setSearchParams(params, { replace: true });
  }, [selectedNgjyra, selectedVetura, selectedVrimat, selectedDepo, selectedextra1, selectedDimenzionet, selectedextra5, setSearchParams]);

  // Dependent filters: when Vetura changes, fetch available options from the server
  useEffect(() => {
    (async () => {
      try {
        const extraFilters = selectedVetura.length > 0
          ? { klasifikimi1: selectedVetura }
          : undefined;
        const result = await fetchProDataFiltersByCategory("Fellne", extraFilters);

        const newNgjyra = result?.klasifikimi4 || [];
        const newVrimat = result?.klasifikimi3 || [];
        const newDepo = result?.Warehouse || [];
        const newExtra1 = result?.extra1 || [];
        const newDimenzionet = result?.klasifikimi2 || [];
        const newExtra5 = result?.extra5 || [];

        setAvailableNgjyraOptions(newNgjyra);
        setAvailableVrimatOptions(newVrimat);
        setAvailableDepoOptions(newDepo);
        setAvailableextra1Options(newExtra1);
        setAvailableDimenzionetOptions(newDimenzionet);
        setAvailableextra5Options(newExtra5);

        // Prune selected values that are no longer available
        if (selectedVetura.length > 0) {
          setSelectedNgjyra((prev) => prev.filter((v) => newNgjyra.includes(v)));
          setSelectedVrimat((prev) => prev.filter((v) => newVrimat.includes(v)));
          setSelectedDepo((prev) => prev.filter((v) => newDepo.includes(v)));
          setSelectedextra1((prev) => prev.filter((v) => newExtra1.includes(v)));
          setSelectedDimenzionet((prev) => prev.filter((v) => newDimenzionet.includes(v)));
          setSelectedextra5((prev) => prev.filter((v) => newExtra5.includes(v)));
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    })();
  }, [selectedVetura]);

  // Reset items when filters change; then load page 1
  useEffect(() => {
    setPage(1);
    setItems([]); // only reset here (never on append)
    setMeta({});
    fetchPage(1, "reset");
  }, [filters, fetchPage]);

  // Compute hasMore once per meta change
  const hasMore = useMemo(() => {
    const cur = Number(meta?.currentPage ?? 1);
    const total = Number(meta?.totalPages ?? 1);
    return cur < total;
  }, [meta]);

  // IntersectionObserver (append-only, no resets)
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

    return () => {
      observerRef.current?.disconnect();
    };
  }, [page, hasMore, isBootLoading, isLoadingNext, fetchPage]);

  const handleCheckboxChange = (value: string, stateSetter: any) => {
    stateSetter((prev: string[]) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const hasAnyFilterOptions =
    availableVeturaOptions.length > 0 ||
    availableNgjyraOptions.length > 0 ||
    availableVrimatOptions.length > 0 ||
    availableDepoOptions.length > 0 ||
    availableextra1Options.length > 0 ||
    availableDimenzionetOptions.length > 0 ||
    availableextra5Options.length > 0;

  if (error)
    return <p>Error loading products: {error?.message ?? "Unknown error"}</p>;

  return (
    <div>
      <Header />
      <div className="home-wrapper">
        {hasAnyFilterOptions && (
        <div className="homepage-filter">
          <div className="home-filter-left">
            <h3>{currentLanguage === "en" ? "Rims" : "Fellne"}</h3>

            {/* Vetura */}
            {availableVeturaOptions.length > 0 && (
              <div className="filter-item">
                <h5>Vetura</h5>
                {availableVeturaOptions.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedVetura.includes(option)}
                      onChange={() =>
                        handleCheckboxChange(option, setSelectedVetura)
                      }
                    />
                    {option}
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
            {availableextra5Options.length > 0 && ( // extra5
              <div className="filter-item">
                <h5>{currentLanguage === "en" ? "Diameter" : "Diametër"}</h5>
                {availableextra5Options.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedextra5.includes(option)}
                      onChange={() =>
                        handleCheckboxChange(option, setSelectedextra5)
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {availableNgjyraOptions.length > 0 && (
              <div className="filter-item">
                <h5>{currentLanguage === "en" ? "Color" : "Ngjyra"}</h5>
                {availableNgjyraOptions.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedNgjyra.includes(option)}
                      onChange={() =>
                        handleCheckboxChange(option, setSelectedNgjyra)
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {availableVrimatOptions.length > 0 && (
              <div className="filter-item">
                <h5> {currentLanguage === "en" ? "Holes" : "Vrimat"}</h5>
                {availableVrimatOptions.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedVrimat.includes(option)}
                      onChange={() =>
                        handleCheckboxChange(option, setSelectedVrimat)
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {availableDimenzionetOptions.length > 0 && (
              <div className="filter-item">
                <h5>
                  {currentLanguage == "en" ? "Dimensions" : "Dimenzionet"}
                </h5>
                {availableDimenzionetOptions.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedDimenzionet.includes(option)}
                      onChange={() =>
                        handleCheckboxChange(option, setSelectedDimenzionet)
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {availableextra1Options.length > 0 && (
              <div className="filter-item">
                <h5>Fellne Teke</h5>
                {availableextra1Options.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedextra1.includes(option)}
                      onChange={() =>
                        handleCheckboxChange(option, setSelectedextra1)
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
            {isBootLoading && <img src={loader} alt="loader" style={{width: '300px', marginTop: '20px'}}/>}
          {!isBootLoading && items.length === 0 ? (
            <h5>
              {currentLanguage === "en"
                ? "No products found"
                : "Nuk u gjetën produkte"}
            </h5>
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

              {/* sentinel */}
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

export default Fellne;
