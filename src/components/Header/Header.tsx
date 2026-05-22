import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Header.scss";
import smallLogo from "../../assets/svg/gomisteriaSmallLogo.svg";
import logo from "../../assets/svg/Logo.svg";
import box from "../../assets/svg/box.svg";
import user from "../../assets/svg/user.svg";
import search from "../../assets/svg/search.svg";
import shoppingBag from "../../assets/svg/shoppingBag.svg";
import heart from "../../assets/svg/heart (1).svg";
import arrow from "../../assets/svg/arrow-down.svg";
import rezervo from "../../assets/svg/tabler_reserved-line.svg";
import sherbime from "../../assets/svg/Sherbime.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import ProductPreview from "./ProductPreview";
import useFetchData, { getProData, searchProducts } from "../../services/api";
import { useWishlist } from "../../context/WishlistContext";
import { useLanguage } from "../../context/Language";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { currentUser, priceHidden, setPriceHidden } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();

  const isBusiness =
    currentUser?.role === "business" ||
    !!currentUser?.specialFields?.businessType;
  const dropdownItems = [
    { label: currentLanguage === "en" ? "Rims" : "Fellne", value: "fellne" },
    { label: currentLanguage === "en" ? "Tires" : "Goma", value: "goma" },
    {
      label: currentLanguage === "en" ? "Accessories" : "Aksesorë",
      value: "aksesorë",
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isProductPreviewVisible, setIsProductPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const productPreviewRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      setIsProductPreviewVisible(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        productPreviewRef.current &&
        !productPreviewRef.current.contains(event.target as Node)
      ) {
        setIsProductPreviewVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Fetch data from the API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetch = async () => {
      if (debouncedQuery.trim().length < 2) {
        setFilteredProducts([]);
        return;
      }
      setLoading(true);
      try {
        const results = await searchProducts(debouncedQuery);
        setFilteredProducts(results);
      } catch (e) {
        console.error("Search failed", e);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [debouncedQuery]);

  const handleSelectProduct = (product: any) => {
    setSearchQuery("");
    setIsProductPreviewVisible(false);
    navigate(`/${product?.extra2.toLowerCase()}/${product?.code}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 1) return;
    setIsProductPreviewVisible(false);
    setIsSearchVisible(false);
    navigate(`/search?searchTerm=${encodeURIComponent(searchQuery.trim())}`);
  };

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };
  const toggleLanguage = () => {
    setLanguage(currentLanguage === "sq" ? "en" : "sq");
  };
  return (
    <>
      <header className="header">
        <div className="header-left">
          <a href="/home">
            <img
              className="bigLogo"
              src={logo}
              alt="gomisteriaImeLogo"
              style={{ width: 226, height: 40, marginBottom: -6 }}
            />
            <img className="smallLogo" src={smallLogo} alt="" />
          </a>
          <div className="header-buttons">
            <Dropdown
              label={currentLanguage === "en" ? "Products" : "Produktet"}
              items={dropdownItems}
              navigate={navigate}
            />
            <Button
              label={currentLanguage === "en" ? "Services" : "Shërbimet"}
              img={sherbime}
              to="services"
              navigate={navigate}
            />
            <Button
              label={currentLanguage === "en" ? "Preorder" : "Rezervo"}
              img={rezervo}
              to="reservation"
              navigate={navigate}
            />
          </div>
        </div>
        <div className="header-right">
          <form
            className="search-form"
            onSubmit={handleSearchSubmit}
            ref={searchContainerRef}
          >
            <div className="search-input-wrapper">
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder={currentLanguage === "en" ? "Search products..." : "Kërko produkte..."}
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setIsProductPreviewVisible(true);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredProducts([]);
                    setIsProductPreviewVisible(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="search-submit"
                aria-label={currentLanguage === "en" ? "Search" : "Kërko"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
          </form>
          {searchQuery && isProductPreviewVisible && (
            <>
              {loading ? (
                <div className="search-dropdown">
                  <div className="search-dropdown-status">
                    <svg className="search-spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    <span>{currentLanguage === "en" ? "Searching..." : "Duke kërkuar..."}</span>
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <ProductPreview
                  ref={productPreviewRef}
                  products={filteredProducts}
                  onSelectProduct={handleSelectProduct}
                />
              ) : (
                <div className="search-dropdown">
                  <div className="search-dropdown-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                    <span>{currentLanguage === "en" ? "No products found" : "Produkti nuk u gjet"}</span>
                    <small>{currentLanguage === "en" ? "Try a different search term" : "Provoni një term tjetër kërkimi"}</small>
                  </div>
                </div>
              )}
            </>
          )}
          <div className="header-user-actions">
            {isBusiness && (
              <button
                className="hide-price-toggle"
                onClick={() => setPriceHidden(!priceHidden)}
                title={priceHidden ? "Show prices" : "Hide prices"}
              >
                {priceHidden ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            )}
            {currentUser?.profileImage ? (
              <a className="header-user" href="/account">
                <img
                  className="header-user"
                  src={currentUser.profileImage}
                  alt=""
                />
              </a>
            ) : (
              <a href="/account">
                <img src={user} alt="" />
              </a>
            )}
            <a href="/account/wishlist" className="cart-icon-wrapper">
              <img src={heart} alt="" className="shoppingBag" />
              {wishlist?.items?.length > 0 && (
                <span className="cart-count-indicator">
                  {wishlist?.items?.length}
                </span>
              )}
            </a>
            <a href="/cart" className="cart-icon-wrapper">
              <img src={shoppingBag} alt="" className="shoppingBag" />
              {cartCount > 0 && (
                <span className="cart-count-indicator">{cartCount}</span>
              )}
            </a>
            <LanguageDropdown
              currentLanguage={currentLanguage}
              setLanguage={setLanguage}
            />
          </div>
        </div>
      </header>

      <header className="headerMobile">
        <div className="headerMobileTop">
          <a href="/home">
            <img src={smallLogo} alt="" />
          </a>
          <div className="mobileQuickNav">
            <div className="header-user-actions">
              {isBusiness && (
                <button
                  className="hide-price-toggle"
                  onClick={() => setPriceHidden(!priceHidden)}
                  title={priceHidden ? "Show prices" : "Hide prices"}
                >
                  {priceHidden ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </button>
              )}
              <img
                src={search}
                alt=""
                className="mobileSearch"
                onClick={toggleSearch}
              />
              {isSearchVisible && (
                <div className="mobileSearchForm">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="mobile-search-input-wrapper">
                      <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                      <input
                        className="mobileSearchInput"
                        type="text"
                        placeholder={currentLanguage === "en" ? "Search products..." : "Kërko produkte..."}
                        value={searchQuery}
                        autoFocus
                        onChange={(event) => {
                          setSearchQuery(event.target.value);
                          setIsProductPreviewVisible(true);
                        }}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          className="search-clear"
                          onClick={() => {
                            setSearchQuery("");
                            setFilteredProducts([]);
                            setIsProductPreviewVisible(false);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      )}
                      <button
                        type="submit"
                        className="search-submit"
                        aria-label={currentLanguage === "en" ? "Search" : "Kërko"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                      </button>
                    </div>
                  </form>
                  {searchQuery && isProductPreviewVisible && (
                    <>
                      {loading ? (
                        <div className="search-dropdown">
                          <div className="search-dropdown-status">
                            <svg className="search-spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                            </svg>
                            <span>{currentLanguage === "en" ? "Searching..." : "Duke kërkuar..."}</span>
                          </div>
                        </div>
                      ) : filteredProducts.length > 0 ? (
                        <ProductPreview
                          ref={productPreviewRef}
                          products={filteredProducts}
                          onSelectProduct={handleSelectProduct}
                        />
                      ) : (
                        <div className="search-dropdown">
                          <div className="search-dropdown-empty">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8"/>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                              <line x1="8" y1="11" x2="14" y2="11"/>
                            </svg>
                            <span>{currentLanguage === "en" ? "No products found" : "Produkti nuk u gjet"}</span>
                            <small>{currentLanguage === "en" ? "Try a different search term" : "Provoni një term tjetër kërkimi"}</small>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              {currentUser?.profileImage ? (
                <a className="header-user" href="/account">
                  <img
                    className="header-user"
                    src={currentUser.profileImage}
                    alt=""
                  />
                </a>
              ) : (
                <a href="/account">
                  <img src={user} alt="" />
                </a>
              )}
              <a href="/account/wishlist" className="cart-icon-wrapper">
                <img src={heart} alt="" className="shoppingBag" />
                {wishlist?.items?.length > 0 && (
                  <span className="cart-count-indicator">
                    {wishlist?.items?.length}
                  </span>
                )}
              </a>
              <a href="/cart" className="cart-icon-wrapper">
                <img src={shoppingBag} alt="" className="shoppingBag" />
                {cartCount > 0 && (
                  <span className="cart-count-indicator">{cartCount}</span>
                )}
              </a>
            </div>
            <LanguageDropdown
              currentLanguage={currentLanguage}
              setLanguage={setLanguage}
            />
          </div>
        </div>

        <div className="headerMobileBottom">
          <Dropdown
            label={currentLanguage === "en" ? "Products" : "Produktet"}
            items={dropdownItems}
            navigate={navigate}
          />
          <Button
            label="Shërbimet"
            img={sherbime}
            to="services"
            navigate={navigate}
          />
          <Button
            label="Rezervo"
            img={rezervo}
            to="reservation"
            navigate={navigate}
          />
        </div>
      </header>
    </>
  );
};

export default Header;

interface IDropdownItem {
  label: string;
  value: string;

  icon?: string;
}

interface IDropdownProps {
  label: string;
  items: IDropdownItem[];
  navigate: (path: string) => void;
}

const Dropdown: React.FC<IDropdownProps> = ({ label, items, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = items.some((item) =>
    location.pathname.includes(`/${item.value}`)
  );

  const handleItemClick = (value: string) => {
    setIsOpen(false); // Close dropdown on click
    navigate(`/${value}`);
  };

  return (
    <div className="dropdown-wrapper">
      <div
        className={`dropdown ${isOpen ? "open" : ""} ${
          isActive ? "active" : ""
        }`}
      >
        <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          <img src={box} alt="" /> {label} <img src={arrow} alt="" />
        </button>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path d="M5 0L9.33013 9.75H0.669873L5 0Z" fill="#fff" />
          </svg>
          {items.map((item, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => handleItemClick(item.value)}
            >
              {item.icon && <img src={item.icon} alt="" />}
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const LanguageDropdown: React.FC<{
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}> = ({ currentLanguage, setLanguage }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen(!open);
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "en", label: "English", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "sq", label: "Shqip", flag: "https://flagcdn.com/w40/al.png" },
  ];

  const current = languages.find((lang) => lang.code === currentLanguage);

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="language-toggle">
        <img src={current?.flag} alt={current?.label} />
      </button>
      {open && (
        <ul className="language-options">
          {languages.map((lang) => (
            <li key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
              <img src={lang.flag} alt={lang.label} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Button: React.FC<{
  label: string;
  img: any;
  to: string;
  navigate: (path: string) => void;
}> = ({ label, img, to, navigate }) => {
  const location = useLocation();
  const isActive = location.pathname === `/${to}`;

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(`/${to}`);
  };

  return (
    <a href={`/${to}`} onClick={handleButtonClick}>
      <button className={`action-button ${isActive ? "active" : ""}`}>
        <img src={img} alt="" />
        {label}
      </button>
    </a>
  );
};
