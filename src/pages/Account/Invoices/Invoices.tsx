import React, { useState } from "react";
import "./Invoices.scss";
import Header from "../../../components/Header/Header";
import AccountPageNav from "../../../components/AccountPageNav/AccountPageNav";
import BlueButton from "../../../components/BlueButton/BlueButton";
import useFetchData, { getOrdersByUserId } from "../../../services/api";
import formatDate from "../../../utils/FormatDate";
import { useAuth } from "../../../context/AuthContext";
import Pagination from "../../../components/Pagination/Pagination";
import { useLanguage } from "../../../context/Language";
const ORDER_STATUS_LABELS = {
  ALL: {
    en: "All",
    sq: "Të gjitha",
  },
  CREATED: {
    en: "Created",
    sq: "Krijuar",
  },
  PROCESSING: {
    en: "Processing",
    sq: "Në Proces",
  },
  SHIPPED: {
    en: "Shipped",
    sq: "Transportuar",
  },
  DELIVERED: {
    en: "Delivered",
    sq: "Kompletuar",
  },
  CANCELLED: {
    en: "Cancelled",
    sq: "Anuluar",
  },
};

const Invoices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useAuth();
  const { currentLanguage } = useLanguage();
  const { data } = useFetchData(
    getOrdersByUserId,
    currentUser.id,
    currentPage,
    10,
    "updatedAt",
    "desc"
  );

  const totalItems = data ? data.total : 0;
  const totalPages = Math.ceil(totalItems / 10);
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);
  const getOrderStatusLabel = (
    status?: keyof typeof ORDER_STATUS_LABELS,
    language?: string
  ): string => {
    if (!status) return "";

    const lang = language === "en" ? "en" : "sq"; // normalize
    return ORDER_STATUS_LABELS[status]?.[lang] ?? status;
  };

  const downloadImage = (base64PDF: any) => {
    if (!base64PDF) {
      alert("No PDF data available");
      return;
    }
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${base64PDF}`;
    link.download = "sale.pdf";
    link.click();
  };

  return (
    <div>
      <Header />
      <div className="account-order-wrapper">
        <AccountPageNav />
        <div className="account-order-information">
          <h2>{currentLanguage === "en" ? "Invoices" : "Faturat"}</h2>
          <table className="account-order-table">
            <thead className="account-order-table-tr">
              <tr>
                <th className="account-order-table-th">
                  {currentLanguage === "en"
                    ? "Order Number"
                    : "Numri i porosisë"}
                </th>
                <th className="account-order-table-th">
                  {currentLanguage === "en" ? "Order Date" : "Data e blerjes"}
                </th>
                <th className="account-order-table-th">
                  {currentLanguage === "en" ? "Total" : "Totali"}
                </th>
                <th className="account-order-table-th">
                  {currentLanguage === "en" ? "Discount" : "Zbritja"}
                </th>
                <th className="account-order-table-th">
                  {currentLanguage === "en" ? "Status" : "Statusi"}
                </th>
                <th className="account-order-table-th"></th>
              </tr>
            </thead>

            {data?.data?.map((order: any, index: any) => (
              <tbody className="account-order-table-tr" key={index}>
                <tr>
                  <td className="account-order-table-td">
                    #{order?.orderNumber}
                  </td>
                  <td className="account-order-table-td">
                    {formatDate(order?.createdAt)}
                  </td>
                  <td className="account-order-table-td">
                    {order?.total.toFixed(2)}€
                  </td>
                  <td className="account-order-table-td">{order?.discount}%</td>
                  <td className="account-order-table-td">
                    {getOrderStatusLabel(order?.status, currentLanguage)}
                  </td>
                  <td className="account-order-table-td">
                    <BlueButton onClick={() => downloadImage(order.pdfBase64)}>
                      {currentLanguage === "en"
                        ? "Download Invoice"
                        : "Shkarko Faturën"}
                    </BlueButton>
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

export default Invoices;
