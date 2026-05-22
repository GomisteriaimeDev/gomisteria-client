import React, { useState } from "react";
import "./AccountReservations.scss";
import Header from "../../../components/Header/Header";
import AccountPageNav from "../../../components/AccountPageNav/AccountPageNav";
import BlueButton from "../../../components/BlueButton/BlueButton";
import useFetchData, { getPreordersByUserId } from "../../../services/api";
import formatDate from "../../../utils/FormatDate";
import { useAuth } from "../../../context/AuthContext";
import Pagination from "../../../components/Pagination/Pagination";
import Loader from "../../../components/Loader";
import { useLanguage } from "../../../context/Language";

const PREORDER_STATUS_LABELS = {
  PENDING: {
    en: "Pending",
    sq: "Në Pritje",
  },
  COMPLETED: {
    en: "Completed",
    sq: "Kompletuar",
  },
  CANCELLED: {
    en: "Cancelled",
    sq: "Anuluar",
  },
};

const AccountReservations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { currentLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const { data, isLoading } = useFetchData(
    getPreordersByUserId,
    currentUser.id,
    currentPage,
    10,
    "updatedAt",
    "desc"
  );
  const totalItems = data ? data.total : 0;
  const totalPages = Math.ceil(totalItems / 10);
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);
  const getPreorderStatusLabel = (
    status?: keyof typeof PREORDER_STATUS_LABELS,
    language?: string
  ): string => {
    if (!status) return "";

    const lang = language === "en" ? "en" : "sq";
    return PREORDER_STATUS_LABELS[status]?.[lang] ?? status;
  };

  return (
    <div>
      <Header />
      <div className="account-reservation-wrapper">
        <AccountPageNav />
        <div className="account-reservation-information">
          <h2>
            {currentLanguage === "en" ? "Reservations" : "Rezervimet"}
          </h2>
          <table className="account-reservation-table">
            <thead className="account-reservation-table-tr">
              <tr>
                <th className="account-reservation-table-th">
                  {currentLanguage === "en"
                    ? "Reservation Number"
                    : "Numri i rezervimit"}
                </th>
                <th className="account-reservation-table-th">
                  {currentLanguage === "en" ? "Date" : "Data"}
                </th>
                <th className="account-reservation-table-th">
                  {currentLanguage === "en" ? "Total" : "Totali"}
                </th>
                <th className="account-reservation-table-th">
                  {currentLanguage === "en" ? "Status" : "Statusi"}
                </th>
                <th className="account-reservation-table-th"></th>
              </tr>
            </thead>
            {isLoading ? <Loader /> : null}
            {data?.data?.map((preorder: any, index: any) => (
              <tbody className="account-reservation-table-tr" key={index}>
                <tr>
                  <td className="account-reservation-table-td">
                    #{preorder?.preOrderNumber}
                  </td>
                  <td className="account-reservation-table-td">
                    {formatDate(preorder?.createdAt)}
                  </td>
                  <td className="account-reservation-table-td">
                    {preorder?.total?.toFixed(2)}€
                  </td>
                  <td className="account-reservation-table-td">
                    {getPreorderStatusLabel(preorder?.status, currentLanguage)}
                  </td>
                  <td className="account-reservation-table-td">
                    <a href={`/account/reservation/${preorder?.id}`}>
                      <BlueButton>
                        {currentLanguage === "en"
                          ? "View Reservation"
                          : "Shiko Rezervimin"}
                      </BlueButton>
                    </a>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          <div className="paginationSection">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountReservations;
