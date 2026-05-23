// ServicesCart.tsx
import React from "react";
import "./ServicesCart.scss";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ServiceCartBox from "../../../components/ServiceCartBox/ServiceCartBox";
import { IServiceCartBoxProps } from "../../../utils/Types";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
import BlueButton from "../../../components/BlueButton/BlueButton";

const ServicesCart: React.FC = () => {
  const serviceData: IServiceCartBoxProps[] = [
    {
      serviceName: "Montim + Balacnim",
      date: "11/11/2023",
      time: "14:00",
      size: 18,
      peopleCount: 4,
      total: "20€",
      note: "Pagesa do të bëhet pas përfundimit të shërbimit!",
    },
    {
      serviceName: "Montim + Balacnim",
      date: "11/11/2023",
      time: "14:00",
      size: 18,
      peopleCount: 4,
      total: "20€",
      note: "Pagesa do të bëhet pas përfundimit të shërbimit!",
    },
    {
      serviceName: "Montim + Balacnim",
      date: "11/11/2023",
      time: "14:00",
      size: 18,
      peopleCount: 4,
      total: "20€",
      note: "Pagesa do të bëhet pas përfundimit të shërbimit!",
    },

    // ... more data objects
  ];

  return (
    <div>
      <Header />
      <div className="service-cart-wrapper">
        <div className="service-cart-middle">
          <h2>Shporta ime</h2>
          <div className="service-cart-boxes">
            {serviceData.map((service, index) => (
              <ServiceCartBox key={index} {...service} />
            ))}
          </div>
          <div className="service-cart-buttons-wrapper">
            <div className="service-cart-buttons">
              <OutlineButton>Anulo</OutlineButton>
              <a href="/services/cart/success">
                {" "}
                <BlueButton>Përfundo</BlueButton>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServicesCart;
