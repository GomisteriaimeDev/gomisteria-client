import React, { useEffect, useState, useCallback } from "react";
import "./Search.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { searchProducts } from "../../services/api";
import ProductItemPRO from "../../components/ProductItemPRO/ProductItemPRO";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/Language";
import loader from "../../assets/svg/Gomisteria_LOADER_1.gif";

const Search = () => {
  const [searchParams] = useSearchParams();
  const { currentLanguage } = useLanguage();
  const searchQuery = searchParams.get("searchTerm") || "";

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search failed", err);
      setError(
        currentLanguage === "en"
          ? "Failed to search products."
          : "Kërkimi dështoi."
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchResults(searchQuery);
  }, [searchQuery, fetchResults]);

  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      <div className="searchPageWrapper">
        <div className="searchTop">
          <h4>
            {currentLanguage === "en"
              ? `Search results: ${results.length}`
              : `Rezultate e kërkimit: ${results.length}`}
          </h4>
          {results.length > 0 ? (
            <h2>"{searchQuery}"</h2>
          ) : (
            !isLoading && searchQuery && (
              <h2>
                {currentLanguage === "en"
                  ? "The product you searched for was not found!"
                  : "Produkti i kërkuar nuk gjendet!"}
              </h2>
            )
          )}
        </div>

        <div className="searchProducts">
          {isLoading ? (
            <img
              src={loader}
              alt="loader"
              style={{ width: "300px", marginTop: "20px" }}
            />
          ) : (
            <>
              <div className="searchProductsList">
                {results.map((product: any, index: number) => (
                  <ProductItemPRO
                    key={product.code || product.id || index}
                    productData={product}
                  />
                ))}
              </div>
              {!results.length && <div style={{ minHeight: "30vh" }} />}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Search;
