import "./Footer.scss";
import logo from "../../assets/svg/Logo.svg";
import { useLanguage } from "../../context/Language";
const Footer = () => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="footerWrapper">
      <div className="footer-top">
        <div className="footer-logo">
          <img src={logo} alt="gomisteriaime-logo" className="footerLogo" />
          <div className="footer-contact-info">
            <a href="mailto:gomisteriaime@gmail.com">gomisteriaime@hotmail.com</a>
            <a href="tel:123456789">+383 46 666 333</a>
          </div>
        </div>
        <div className="footer-content">
          <div className="footer-content-left">
            <h5>Kontenti</h5>
            <div className="footer-navigation">
              <a href="/">
                <p>Kushtet & Rregullat</p>
              </a>
              <a href="/privacy-policy">
                <p>
                  {currentLanguage === "en"
                    ? "Privacy Policy"
                    : "Politika e privatësisë"}
                </p>
              </a>
              <a href="/about-us">
                <p>{currentLanguage === "en" ? "About Us" : "Rreth nesh"}</p>
              </a>
              <a href="/goma">
                <p>{currentLanguage === "en" ? "Products" : "Produktet"}</p>
              </a>
              <a href="/services">
                <p>{currentLanguage === "en" ? "Services" : "Shërbimet"}</p>
              </a>
            </div>
          </div>
          <div className="footer-content-right">
            <div className="footer-content-right-inside">
              <h5>{currentLanguage === "en" ? "Location" : "Lokacioni"}</h5>
              <p>Prelezi i Muhaxherve, Ferizaj, Kosova</p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy;{" "}
          {currentLanguage === "en"
            ? "2026 Gomisteriaime. Powered by Fortuna-f"
            : "2026 Gomisteriaime. Powered by Fortuna-f"}
        </p>
      </div>
    </div>
  );
};

export default Footer;
