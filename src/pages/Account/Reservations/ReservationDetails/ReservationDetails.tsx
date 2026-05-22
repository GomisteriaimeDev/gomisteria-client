import React, { useEffect, useState } from "react";
import "./ReservationDetails.scss";
import back from "../../../../assets/svg/backArrow.svg";
import { useParams } from "react-router-dom";
import { getPreorderById, getProductsById } from "../../../../services/api";
import AccountPageNav from "../../../../components/AccountPageNav/AccountPageNav";
import Header from "../../../../components/Header/Header";
import { useLanguage } from "../../../../context/Language";

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

const StatusSteps = ({ currentStatus }: any) => {
  const { currentLanguage } = useLanguage();
  const steps = [
    {
      label: currentLanguage === "en" ? "Pending" : "Në Pritje",
      value: "PENDING",
    },
    {
      label: currentLanguage === "en" ? "Completed" : "Kompletuar",
      value: "COMPLETED",
    },
    {
      label: currentLanguage === "en" ? "Cancelled" : "Anuluar",
      value: "CANCELLED",
    },
  ];

  const getStatusClass = (status: any, currentStatus: any) => {
    if (currentStatus === "CANCELLED") {
      if (status === "CANCELLED") return "active";
      if (status === "PENDING") return "completed";
      return "inactive";
    }
    const statusIndex = steps.findIndex((step) => step.value === status);
    const currentIndex = steps.findIndex(
      (step) => step.value === currentStatus
    );
    if (currentIndex > statusIndex) return "completed";
    if (currentIndex === statusIndex) return "active";
    return "inactive";
  };

  return (
    <div className="status-steps">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${getStatusClass(step.value, currentStatus)}`}
        >
          {index === steps.length - 1 ? (
            <div className="circle-check">&#10003;</div>
          ) : (
            <div className="circle"></div>
          )}
          <div className="label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

const ReservationDetails = () => {
  const { currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [preorder, setPreorder] = useState<any>({});
  const { id: preorderId } = useParams();

  const fetchPreorder = async () => {
    const res = await getPreorderById(preorderId);
    if (res?.items?.length) {
      const productDetails = await Promise.all(
        res.items.map((item: any) => getProductsById(item.productId))
      );
      res.items = res.items.map((item: any, index: number) => ({
        ...item,
        product: {
          ...item.product,
          images: productDetails[index]?.images || [],
        },
      }));
    }
    setPreorder(res);
    setIsLoading(false);
  };

  const getPreorderStatusLabel = (
    status?: keyof typeof PREORDER_STATUS_LABELS,
    language?: string
  ): string => {
    if (!status) return "";
    const lang = language === "en" ? "en" : "sq";
    return PREORDER_STATUS_LABELS[status]?.[lang] ?? status;
  };

  useEffect(() => {
    fetchPreorder();
  }, []);

  const getStatusDot = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="status-dot yellow"></span>;
      case "COMPLETED":
        return <span className="status-dot green"></span>;
      case "CANCELLED":
        return <span className="status-dot red"></span>;
      default:
        return <span className="status-dot unknown"></span>;
    }
  };

  return (
    <div>
      <Header />
      <div className="account-reservation-wrapper">
        <AccountPageNav />
        <div className="salesWrapper">
          <div className="singleSales">
            <a href="/account/reservations">
              <img src={back} alt="" />
            </a>
            <StatusSteps currentStatus={preorder.status} />

            <div className="saleInfo">
              <div className="saleInfoSection">
                <div className="saleDetails">
                  <h5>
                    {currentLanguage === "en"
                      ? "Information"
                      : "Informacionet shtesë"}
                  </h5>
                  <div className="saleInfoDetails">
                    {preorder?.user?.role === "BUSINESS" ? (
                      <div className="saleInfoDetailsItem">
                        <p>
                          {currentLanguage === "en"
                            ? "Business Name"
                            : "Emri I Biznesit"}
                        </p>
                        <span>
                          {preorder?.user?.specialFields?.companyName ||
                            preorder?.user?.specialFields?.fullName}
                        </span>
                      </div>
                    ) : (
                      <div className="saleInfoDetailsItem">
                        <p>
                          {currentLanguage === "en"
                            ? "Full Name"
                            : "Emri i plotë"}
                        </p>
                        <span>
                          {preorder?.user?.specialFields?.companyName ||
                            preorder?.user?.specialFields?.fullName}
                        </span>
                      </div>
                    )}
                    {preorder?.user?.specialFields?.nrARBK ? (
                      <div className="saleInfoDetailsItem">
                        <p>
                          {currentLanguage === "en"
                            ? "Business Number"
                            : "Numri i Biznesit (bazuar në ARBK)"}
                        </p>
                        <span>{preorder?.user?.specialFields?.nrARBK}</span>
                      </div>
                    ) : null}
                    {preorder?.user?.specialFields?.businessType ? (
                      <div className="saleInfoDetailsItem">
                        <p>
                          {currentLanguage === "en"
                            ? "Industry"
                            : "Industrija"}
                        </p>
                        <span>{preorder?.user?.specialFields?.businessType}</span>
                      </div>
                    ) : null}
                    <div className="saleInfoDetailsItem">
                      <p>Email</p>
                      <span>{preorder?.user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="saleInfoSection">
                <div className="saleDetails">
                  <div className="saleInfoHeader">
                    <h5>
                      {currentLanguage === "en"
                        ? "Reservation Details"
                        : "Detajet e Rezervimit"}
                    </h5>
                    <div className="orderNumberInfo">
                      {currentLanguage === "en"
                        ? "Reservation Number"
                        : "Numri i rezervimit"}
                      : <span>#{preorder?.preOrderNumber}</span>
                    </div>
                    <div className="orderStatusInfo">
                      {currentLanguage === "en"
                        ? "Status"
                        : "Statusi"}
                      : {getStatusDot(preorder.status)}
                       {getPreorderStatusLabel(preorder?.status, currentLanguage)}
                    </div>
                  </div>
                  <div className="saleInfoDetails">
                    {preorder?.fullName ? (
                      <div className="saleInfoDetailsItem">
                        <p>
                          {currentLanguage === "en"
                            ? "Full Name"
                            : "Emri i Plotë"}
                        </p>
                        <span>{preorder?.fullName}</span>
                      </div>
                    ) : null}
                    {preorder?.country ? (
                      <div className="saleInfoDetailsItem">
                        <p>
                          {currentLanguage === "en" ? "Country" : "Shteti"}
                        </p>
                        <span>{preorder.country}</span>
                      </div>
                    ) : null}
                    <div className="saleInfoDetailsItem">
                      <p>
                        {currentLanguage === "en" ? "Items" : "Produktet"}:
                      </p>
                      {preorder?.items?.map((item: any, index: any) => (
                        <div key={index} className="order-item-link">
                          {item?.product?.images?.[0]?.url && (
                            <img
                              src={item?.product?.images?.[0]?.url}
                              alt={item?.product?.name}
                              className="order-item-img"
                            />
                          )}
                          <span>
                            {item?.quantity}x {item?.product?.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    {preorder?.total ? (
                      <div className="saleInfoDetailsItem">
                        <p>
                          {currentLanguage === "en" ? "Total" : "Totali"}:
                        </p>
                        <span>{preorder?.total?.toFixed(2)}€</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
