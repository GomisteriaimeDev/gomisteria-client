import React, { useEffect, useState } from "react";
import "./IntroPage.scss";
import logo from "../../assets/svg/Logo.svg";
import BlueButton from "../../components/BlueButton/BlueButton";
import OutlineButton from "../../components/OutlineButton/OutlineButton";
import { useLanguage } from "../../context/Language";
import { getHomepageCms } from "../../services/api";
const IntroPage = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [introBg, setIntroBg] = useState<string | null>(null);

  useEffect(() => {
    getHomepageCms()
      .then((data) => {
        if (data?.introPage?.imageUrl) {
          setIntroBg(data.introPage.imageUrl);
        }
      })
      .catch(() => {});
  }, []);

  const toggleLanguage = () => {
    setLanguage(currentLanguage === "sq" ? "en" : "sq");
  };
  return (
    <div className="intro">
      {/* <div className="maintenanceOverlay">
        <div className="maintenanceContent">
          <h2>Gomisteriaime.com</h2>
          <p>
            Gomisteriaime.com aktualisht është duke u zhvilluar nga programerët
            tanë dhe për momentin është e padisponueshme. Sapo të përfundojë
            puna, ju do të njoftoheni përmes një SMS-je, dhe më pas mund të
            vazhdoni normalisht me porositë online.
          </p>
          <p>Faleminderit për mirëkuptimin!</p>
        </div>
      </div> */}
      <div
        className="intro-left"
        style={introBg ? { backgroundImage: `url(${introBg})` } : undefined}
      >
        
        
      </div>
      <div className="intro-right">
        <img src={logo} alt="gomisteriaLogo" className="intro-logo" />
        <div className="intro-buttons">
          <a href="/login">
            <BlueButton>
              {currentLanguage === "en" ? "Login" : "Kyçu"}
            </BlueButton>
          </a>
          <a href="/register/select">
            <OutlineButton>
              {currentLanguage === "en"
                ? "Create an account"
                : "Krijo një llogari"}
            </OutlineButton>
          </a>
        </div>
      </div>
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
    </div>
  );
};

export default IntroPage;
