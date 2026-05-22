import React from "react";
import "./AccountPageNav.scss";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/Language";
const AccountPageNav = () => {
  const { logout } = useAuth();
  const { currentLanguage } = useLanguage();

  return (
    <div className="account-nav-wrapper">
      <div className="account-nav-header">
        <h2>{currentLanguage === "en" ? "Settings" : "Konfigurimet"}</h2>
        <p>
          {currentLanguage === "en"
            ? "Here you can manage your account settings"
            : "Këtu mund të menaxhoni llogarinë tuaj"}
        </p>
      </div>
      <ul className="account-nav">
        <a className="account-nav-link" href="/account">
          <li>
            <span className="account-nav-link-badge">
              {currentLanguage === "en"
                ? "Account Information"
                : "Informacionet e llogarisë"}
            </span>
          </li>
        </a>
        <a className="account-nav-link" href="/account/wishlist">
          <li>{currentLanguage === "en" ? "Wishlist" : "Lista e dëshirave"}</li>
        </a>
        <a className="account-nav-link" href="/account/orders">
          <li>{currentLanguage === "en" ? "Orders" : "Gjurmo Porositë"}</li>
        </a>
        <a className="account-nav-link" href="/account/reservations">
          <li>{currentLanguage === "en" ? "Reservations" : "Rezervimet"}</li>
        </a>
        <a className="account-nav-link" href="/account/invoices">
          <li>{currentLanguage === "en" ? "Invoices" : "Faturat"}</li>
        </a>
        {/* <a className="account-nav-link" href="/account/statistics">
          <li>Statistikat</li>
        </a> */}
        <div className="account-nav-link" onClick={logout}>
          <li>{currentLanguage === "en" ? "Logout" : "Shkyçu"}</li>
        </div>
      </ul>
    </div>
  );
};

export default AccountPageNav;
