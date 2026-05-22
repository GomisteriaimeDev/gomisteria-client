import React, { useEffect, useRef, useState } from "react";
import "./Invoice.scss";
import Header from "../../../components/Header/Header";
import downlaod from "../../../assets/svg/download.svg";
import print from "../../../assets/svg/printer.svg";
import logo from "../../../assets/svg/Logo.svg";
import qr from "../../../assets/images/qr.png";
import { useReactToPrint } from "react-to-print";
import { getOrderById } from "../../../services/api";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import formatDate from "../../../utils/FormatDate";
import capitalize from "../../../utils/Capitalize";

const Invoice = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>({});
  const { id } = useParams();

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0); // 35% discount
  const [transportFee, setTransportFee] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setSubtotal(order?.total);

    setTransportFee(subtotal > 100 ? 0 : 20);

    const discountAmount = subtotal * (discount / 100);
    const newTotal = subtotal - discountAmount + transportFee;
    setTotal(newTotal);
  }, [order, discount, transportFee, subtotal]);

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => (componentRef.current ? componentRef.current : null),
    documentTitle: "Invoice",
  });

  const fetchOrder = async () => {
    const res = await getOrderById(id);
    setOrder(res);

    setIsLoading(false);
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  return (
    <div>
      <Header />
      <div className="invoice-wrapper">
        <div className="invoice-buttons">
          <a href="/account/orders" className="back-arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <rect width="30" height="30" rx="15" fill="#F5F5F6" />
              <path
                d="M21 15H9M9 15L15 21M9 15L15 9"
                stroke="#1E8CA5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <div className="invoice-buttons-actions">
            <div className="inovice-action" onClick={handlePrint}>
              <img src={downlaod} alt="" />
              Ruaj File-in
            </div>
            <div className="inovice-action">
              <img src={print} alt="" />
              Print
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="invoice" ref={componentRef}>
            <div className="invoice-top">
              <img src={logo} alt="" className="inovice-logo" />
              <div className="invoice-main-information">
                <div className="inovice-information">
                  Numri i faturës: <span>#{order?.orderNumber}</span>
                </div>
                <div className="inovice-information">
                  Data: <span>{formatDate(order?.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="invoice-data">
              <div className="invoice-data-section">
                <label>Informacione të Gomisteriaime</label>
                <div className="invoice-section-info">
                  <div className="inovice-information">
                    Kompania: <span>Gomisteriaime</span>
                  </div>
                  <div className="inovice-information">
                    Numri i Telefonit: <span>+383 11 222 333</span>
                  </div>
                  <div className="inovice-information">
                    Email Adresa: <span>info@gomisteriaime.com</span>
                  </div>
                  <div className="inovice-information">
                    Adresa: <span>Ferizaj, Kosovo</span>
                  </div>
                </div>
              </div>
              <div className="invoice-data-section">
                <label>Informacione të kompanisë</label>
                <div className="invoice-section-info">
                  <div className="inovice-information">
                    Emri: <span>Origin3Agency</span>
                  </div>
                  <div className="inovice-information">
                    Numri ARBK: <span>12D34S56E78S9</span>
                  </div>
                  <div className="inovice-information">
                    Email Adresa: <span>info@origin3agency.com</span>
                  </div>
                  <div className="inovice-information">
                    Numri i Telefonit: <span>+383 12 345 678</span>
                  </div>
                  <div className="inovice-information">
                    Adresa: <span>Prishtine, Kosovo</span>
                  </div>
                </div>
              </div>
              <img src={qr} alt="" className="qrCode" />
            </div>
            <div className="invoice-products">
              {order.items.map((item: any) => (
                <div className="invoice-product" key={item?.id}>
                  <div className="product-data">
                    <img
                      src={item?.product?.images?.[0]}
                      alt=""
                      className="product-data-image"
                    />
                    <div className="product-information">
                      <p>{item?.product.name}</p>
                      <div className="invoice-product-description">
                        <div className="inovice-information">
                          Marka: <span>{item?.product?.marka}</span>
                        </div>
                        <div className="inovice-information">
                          Kategoria:{" "}
                          <span>{capitalize(item?.product?.category)}</span>
                        </div>
                        <div className="inovice-information">
                          Sasia: <span>{item?.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="invoice-product-price">
                    {item?.product?.salePrice
                      ? item?.product?.salePrice.toFixed(2)
                      : item?.product?.pricetoFixed(2)}
                    €
                  </div>
                </div>
              ))}
            </div>
            <div className="invoice-totals">
              <div className="inovice-right-middle">
                <div className="inovice-price-details">
                  <div className="inovice-price-details-item">
                    {" "}
                    <p>Subtotal</p>
                    <span>{order?.total.toFixed(2)}€</span>
                  </div>
                  <div className="inovice-price-details-item">
                    {" "}
                    <p>Zbritje nga kodi:</p>
                    <span>-{order?.discount}%</span>
                  </div>
                  <div className="inovice-price-details-item">
                    {" "}
                    <p>Transporti</p>
                    <span>{transportFee}€</span>
                  </div>
                </div>
                <div className="inovice-price-total">
                  <h6>Total</h6>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
