import React, { useState } from "react";
import "./Reservation.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useFetchData, { getNgarkesas } from "../../services/api";
import Pagination from "../../components/Pagination/Pagination";
import ReservationPost from "../../components/Reservation/ReservationPost/ReservationPost";
import shoppingBag from "../../assets/svg/shoppingBag.svg";
import { usePreorder } from "../../context/PreorderContext";
import { useLanguage } from "../../context/Language";
const Reservation = () => {
  const { currentLanguage } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const { preorderCartCount } = usePreorder();
  const { data } = useFetchData(
    getNgarkesas,
    currentPage,
    10,
    "updatedAt",
    "desc"
  );
  const totalItems = data ? data.total : 0;
  const totalPages = Math.ceil(totalItems / 10);
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      {data?.data.length > 0 ? (
        <div className="reservationProductsWrapper">
          <div className="reservation-cart-icon">
            <h5>Shport juaj: </h5>
            <a
              href="/reservation/cart"
              className="reservation-cart-icon-wrapper"
            >
              <img
                src={shoppingBag}
                alt=""
                className="reservation-shoppingBag"
              />
              {preorderCartCount > 0 && (
                <span className="reservation-cart-count-indicator">
                  {preorderCartCount}
                </span>
              )}
            </a>
          </div>
          <div className="reservation-posts">
            {data?.data?.map((data: any, index: any) => (
              <ReservationPost data={data} key={index} />
            ))}
          </div>
          <div className="paginationSection">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </div>
        </div>
      ) : (
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
            <h1>
              {currentLanguage === "en"
                ? "No active preorders"
                : "Nuk ka ngarkesa aktive"}
            </h1>
            <p>
              {currentLanguage === "en"
                ? "Currently, no preorders are available. Stay tuned for exciting updates!"
                : "Aktualisht, nuk ka ngarkesa aktive. Qëndroni të informuar për përditësime emocionuese!"}
            </p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Reservation;
