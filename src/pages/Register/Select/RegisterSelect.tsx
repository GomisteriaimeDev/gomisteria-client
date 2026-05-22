import React from "react";
import "./RegisterSelect.scss";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
import BlueButton from "../../../components/BlueButton/BlueButton";
import RegisterPerson from "../../../assets/svg/RegisterPerson.svg";
import RegisterPeople from "../../../assets/svg/RegisterPeople.svg";
import logo from "../../../assets/svg/Logo.svg";
import { useLanguage } from "../../../context/Language";

const RegisterSelect = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(currentLanguage === "sq" ? "en" : "sq");
  };
  return (
    <div className="registerSelectWrapper">
      <button onClick={toggleLanguage} className="languageToggle-auth">
        {currentLanguage === "en" ? (
          <>
            <img src="https://flagcdn.com/w40/gb.png" alt="English" />
          </>
        ) : (
          <>
            <img src="https://flagcdn.com/w40/al.png" alt="Shqip" />
          </>
        )}
      </button>
      <img src={logo} alt="gomisteriaLogo" className="intro-logo" />
      <div className="register-select">
        <div className="register-select-header">
          {currentLanguage === "en"
            ? "Create an account"
            : "Krijoni një llogari"}
        </div>
        <div className="register-select-buttons">
          <a href="/register/client" className="register-select-button">
            <OutlineButton>
              <img
                className="register-select-svg"
                src={RegisterPerson}
                alt="registerPersonImage"
              />
              {currentLanguage === "en"
                ? "Create individual account"
                : "Krijo Llogari Individuale"}
            </OutlineButton>
          </a>
          <a href="/register/business" className="register-select-button">
            <OutlineButton>
              <img
                className="register-select-svg"
                src={RegisterPeople}
                alt="registerPeopleImage"
              />
              {currentLanguage === "en"
                ? "Create business account"
                : "Krijo Llogari Biznesi"}
            </OutlineButton>
          </a>
          <span className="register-privacy-policy">
            {currentLanguage === "en"
              ? "By creating an account, you agree"
              : " Duke krijuar një llogari, ju pranoni"}{" "}
            <a href="/privacy-policy">
              {currentLanguage === "en"
                ? "Our Privacy Policy Terms"
                : "Kushtet tona të Politikës së Privatësisë"}{" "}
            </a>
          </span>
        </div>
        <div className="register-login-button">
          <a href="/login">
            <BlueButton>
              {currentLanguage === "en" ? "Login" : "Hyr"}
            </BlueButton>
          </a>
          <span className="posedon">
            {currentLanguage === "en"
              ? "Already have an account"
              : "Posedoni një llogari"}
            ?
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelect;
