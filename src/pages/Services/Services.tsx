import React from "react";
import "./Services.scss";
import serviceImage from "../../assets/images/serviceImage.jpeg";
import asistencaRrugore from "../../assets/images/asistencaRrugore.png";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useLanguage } from "../../context/Language";
const Services = () => {
  const { currentLanguage } = useLanguage();
  return (
    <>
      <Header />
      <div className="servicesWrapper">
        <div className="service-text">
          <h1>
            {currentLanguage === "en"
              ? "Services and Road Assistance"
              : "Shërbimet dhe Asistenca Rrugore"}
          </h1>
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less content of a page
            when looking at its layout.
          </p>
        </div>
        <div className="services-selection">
          <a href="/services/booking" className="services-selection-item">
            <h2 className="service-header">
              {currentLanguage === "en" ? "Services" : "Shërbimet"}
            </h2>
            <img
              src={serviceImage}
              alt="serviceImage"
              className="service-image-selection"
            />
          </a>
          <a
            href="/services/road-assistance"
            className="services-selection-item"
          >
            <h2 className="service-header">
              {currentLanguage === "en"
                ? "Road Assistance"
                : "Asistencë Rrugore"}
            </h2>
            <img
              src={asistencaRrugore}
              alt="serviceImage"
              className="service-image-selection"
            />
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services;
