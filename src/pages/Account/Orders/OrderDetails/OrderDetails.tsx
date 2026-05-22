import React, { useEffect, useState } from "react";
import "./OrderDetails.scss";
import back from "../../../../assets/svg/backArrow.svg";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../../../services/api";
import BlueButton from "../../../../components/BlueButton/BlueButton";
import AccountPageNav from "../../../../components/AccountPageNav/AccountPageNav";
import Header from "../../../../components/Header/Header";
import { useLanguage } from "../../../../context/Language";
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
const StatusSteps = ({ currentStatus }: any) => {
  const { currentLanguage } = useLanguage();
  const steps = [
    {
      label: currentLanguage === "en" ? "Created" : "Krijuar",
      value: "CREATED",
    },
    {
      label: currentLanguage === "en" ? "Processing" : "Në Proces",
      value: "PROCESSING",
    },
    {
      label: currentLanguage === "en" ? "Shipped" : "Transportuar",
      value: "SHIPPED",
    },
    {
      label: currentLanguage === "en" ? "Delivered" : "Kompletuar",
      value: "DELIVERED",
    },
    {
      label: currentLanguage === "en" ? "Cancelled" : "Anuluar",
      value: "DELIVERED",
    },
  ];

  const getStatusClass = (status: any, currentStatus: any) => {
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

const OrderDetails = () => {
  const { currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [sale, setSale] = useState<any>({});
  const { id: orderId } = useParams();

  const fetchSale = async () => {
    const res = await getOrderById(orderId);
    setSale(res);

    setIsLoading(false);
  };
  const getOrderStatusLabel = (
    status?: keyof typeof ORDER_STATUS_LABELS,
    language?: string
  ): string => {
    if (!status) return "";

    const lang = language === "en" ? "en" : "sq"; // normalize
    return ORDER_STATUS_LABELS[status]?.[lang] ?? status;
  };
  useEffect(() => {
    fetchSale();
  }, []);

  const getStatusDot = (status: string) => {
    switch (status) {
      case "CREATED":
        return <span className="status-dot lightBlue"></span>;
      case "PROCESSING":
        return <span className="status-dot yellow"></span>;
      case "SHIPPED":
        return <span className="status-dot yellow"></span>;
      case "DELIVERED":
        return <span className="status-dot green"></span>;
      case "CANCELLED":
        return <span className="status-dot red"></span>;
      case "BORXH":
        return <span className="status-dot orange"></span>;
      default:
        return <span className="status-dot unknown"></span>;
    }
  };

  const downloadImage = () => {
    const base64PDF = sale.pdfBase64;
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
    (
      <div>
        <Header />
        <div className="account-order-wrapper">
          <AccountPageNav />
          <div className="salesWrapper">
            <div className="singleSales">
              <a href="/account/orders">
                <img src={back} alt="" />
              </a>
              <StatusSteps currentStatus={sale.status} />

              <div className="saleInfo">
                <div className="saleInfoSection">
                  <div className="saleDetails">
                    <h5>
                      {currentLanguage === "en"
                        ? "Infomration"
                        : "Informacionet shtesë"}
                    </h5>
                    <div className="saleInfoDetails">
                      {sale?.user?.role === "BUSINESS" ? (
                        <div className="saleInfoDetailsItem">
                          <p>
                            {currentLanguage === "en"
                              ? "Business Name"
                              : "Emri I Biznesit"}
                          </p>
                          <span>{sale?.user?.specialFields?.companyName || sale?.user?.specialFields?.fullName}</span>
                        </div>
                      ) : (
                        <div className="saleInfoDetailsItem">
                          <p>
                            {currentLanguage === "en"
                              ? "Full Name"
                              : "Emri i plotë"}
                          </p>
                          <span>{sale?.user?.specialFields?.companyName || sale?.user?.specialFields?.fullName}</span>
                        </div>
                      )}
                      {sale?.user?.specialFields?.nrARBK ? (
                        <div className="saleInfoDetailsItem">
                          <p>
                            {currentLanguage === "en"
                              ? "Business Number"
                              : "Numri i Biznesit (bazuar në ARBK)"}
                          </p>
                          <span>{sale?.user?.specialFields?.nrARBK}</span>
                        </div>
                      ) : null}

                      {sale.user?.specialFields.businessType ? (
                        <div className="saleInfoDetailsItem">
                          <p>
                            {currentLanguage === "en"
                              ? "Industry"
                              : "Industrija"}
                          </p>
                          <span>{sale?.user?.specialFields?.businessType}</span>
                        </div>
                      ) : null}
                      {sale?.discont > 0 ? (
                        <div className="saleInfoDetailsItem">
                          <p>
                            {currentLanguage === "en" ? "Discount" : "Zbritja"}
                          </p>
                          <span>-{sale?.discount}%</span>
                        </div>
                      ) : null}

                      <div className="saleInfoDetailsItem">
                        <p>Email</p>
                        <span>{sale?.user?.email}</span>
                      </div>
                    </div>
                  </div>
                  {sale?.qrCode ? (
                    <img src={sale?.qrCode} alt="orderQr" className="qrCode" />
                  ) : null}
                </div>

                <div className="saleInfoSection">
                  <div className="saleDetails">
                    <div className="saleInfoHeader">
                      <h5>
                        {currentLanguage === "en"
                          ? "Order Details"
                          : "Detajet e Porosisë"}
                      </h5>
                      <div className="orderNumberInfo">
                        {currentLanguage === "en"
                          ? "Order Number"
                          : "Numri i porosisë"}
                        : <span>#{sale?.orderNumber}</span>
                      </div>
                      <div className="orderStatusInfo">
                        {currentLanguage === "en"
                          ? "Order Status"
                          : "Statusi i porosisë"}
                        : {getStatusDot(sale.status)}
                         {getOrderStatusLabel(sale?.status, currentLanguage)}
                      </div>
                    </div>
                    <div className="saleInfoDetails">
                      <div className="saleInfoDetailsItem">
                        <p>
                          {currentLanguage === "en"
                            ? "Full Name"
                            : "Emri i Plotë"}
                        </p>
                        <span>{sale?.user?.specialFields?.companyName || sale?.user?.specialFields?.fullName}</span>
                      </div>
                      <div className="saleInfoDetailsItem">
                        <p>{currentLanguage === "en" ? "Country" : "Shteti"}</p>
                        <span>{sale.country}</span>
                      </div>
                      <div className="saleInfoDetailsItem">
                        <p>{currentLanguage === "en" ? "Cart" : "Shporta"}:</p>
                        {sale?.items?.map((data: any, index: any) => (
                          <a
                            href={`/${data?.productData?.extra2.toLowerCase()}/${
                              data?.ItemID
                            }`}
                            key={index}
                            className="order-item-link"
                          >
                            {data?.productData?.images?.[0] && (
                              <img
                                src={data?.productData?.images?.[0]}
                                alt={data?.productData?.description}
                                className="order-item-img"
                              />
                            )}
                            <span>
                              {data?.quantity}x {data?.productData?.description}
                            </span>
                          </a>
                        ))}
                      </div>
                      <div className="saleInfoDetailsItem">
                        <p>{currentLanguage === "en" ? "Total" : "Totali"}:</p>
                        <span>{sale?.total?.toFixed(2)}€</span>
                      </div>
                    </div>
                    <div className="saleInfoDetailsItemButtons">
                      <BlueButton onClick={downloadImage}>
                        {currentLanguage === "en"
                          ? "Download Invoice"
                          : "Shkarko Faturën"}
                      </BlueButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderDetails;
