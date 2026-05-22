import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/svg/Logo.svg";
import successCheck from "../../../assets/svg/SuccessCheck.svg";
import "../SuccessBusiness/SuccessBusiness.scss";
import { useLanguage } from "../../../context/Language";
import BlueButton from "../../../components/BlueButton/BlueButton";

const SuccessClient = () => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login"); // Adjust path if login route is different
  };

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
            ? "Thank you for signing up! Your account has been successfully created. Please log in to start using our services."
            : "Faleminderit që u regjistruat! Llogaria juaj u krijua me sukses. Ju lutemi kyçuni për të filluar përdorimin e shërbimeve tona."}

          <br />
          <br />
          {currentLanguage === "en"
    ? "For help, contact +38346666333"
    : "Për ndihmë kontakto +38346666333"}
        </h4>
        <BlueButton className="goToLoginButton" onClick={handleGoToLogin}>
          {currentLanguage === "en" ? "Go to Login" : "Shko te Kyçja"}
        </BlueButton>
      </div>
    </div>
  );
};

export default SuccessClient;
