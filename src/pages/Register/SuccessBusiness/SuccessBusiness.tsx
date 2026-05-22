import React from "react";
import logo from "../../../assets/svg/Logo.svg";
import successCheck from "../../../assets/svg/SuccessCheck.svg";
import "./SuccessBusiness.scss";
import { useLanguage } from "../../../context/Language";
const SuccessBusiness = () => {
  const { currentLanguage } = useLanguage();
  return (
    <div className="successPageWrapper">
      <img
        src={logo}
        alt="gomisteriImeLogo"
        className="gomisteriaLogoSuccess"
      />
      <div className="successPageContent">
        <img src={successCheck} alt="checkmark" />
        <h4 className="successPageText">
          {currentLanguage === "en"
            ? "Thank you for signing up! Someone from the staff will confirm your business soon!"
            : "Ju faleminderit që u regjistruat! Dikush nga stafi së shpejti do ta konfirmoj biznesin tuaj!"}{" "}
          <br />
          <br />{" "}
          {currentLanguage === "en"
            ? "For delays contact +38346666333"
            : "Për vonesa kontakto +38346666333"}
        </h4>
      </div>
    </div>
  );
};

export default SuccessBusiness;
