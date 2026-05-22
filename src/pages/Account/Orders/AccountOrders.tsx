import React, { useState } from "react";
import "./AccountOrders.scss";
import Header from "../../../components/Header/Header";
import AccountPageNav from "../../../components/AccountPageNav/AccountPageNav";
import BlueButton from "../../../components/BlueButton/BlueButton";
import useFetchData, { getOrdersByUserId } from "../../../services/api";
import formatDate from "../../../utils/FormatDate";
import { useAuth } from "../../../context/AuthContext";
import Pagination from "../../../components/Pagination/Pagination";
import Loader from "../../../components/Loader";
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
  BORXH: {
    en: "Debt",
    sq: "Borxh",
  },
};

const AccountOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { currentLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const { data, isLoading } = useFetchData(
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

  return (
    <div>
      <Header />
      <div className="account-order-wrapper">
        <AccountPageNav />
        <div className="account-order-information">
          <h2>
            {currentLanguage === "en" ? "Order Tracking" : "Gjurmo Porositë"}
          </h2>
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
            {isLoading ? <Loader /> : null}
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
                    <a href={`/account/order/${order?.id}`}>
                      <BlueButton>
                        {currentLanguage === "en"
                          ? "View Order"
                          : "Shiko porosinë"}
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

export default AccountOrders;
