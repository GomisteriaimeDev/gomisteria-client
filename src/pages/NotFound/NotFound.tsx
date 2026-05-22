import React from "react";
import "./NotFound.scss";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useLanguage } from "../../context/Language";
const NotFound = () => {
  const { currentLanguage } = useLanguage();
  return (
    <div>
      <Header />
      <div className="notFound-wrapper">
        <div className="not-found">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7b7b7b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-alert-circle"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h1>{currentLanguage === "en" ? "Page Not Found" : "Faqja nuk u gjet"}</h1>
          <p>
            {currentLanguage === "en"
              ? "The page you are looking for does not exist."
              : "Faqja që po kërkoni nuk ekziston."}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
