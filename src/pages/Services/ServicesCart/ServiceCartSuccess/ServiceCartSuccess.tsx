import "./ServiceCartSuccess.scss";
import successCheck from "../../../../assets/svg/SuccessCheck.svg";
import Header from "../../../../components/Header/Header";
import BlueButton from "../../../../components/BlueButton/BlueButton";
import { useLanguage } from "../../../../context/Language";
const ServiceCartSuccess = () => {
  const { currentLanguage } = useLanguage();
  return (
    <>
      <Header />
      <div className="successPageWrapper-services">
        <div className="successPageContent-services">
          <img src={successCheck} alt="checkmark-services" />
          <h4 className="successPageText-services">
            {currentLanguage === "en"
              ? "Your appointment has been sent for confirmation, someone from the staff will contact you soon! For delays, contact +38346666333."
              : "Termini juaj ësht derguar për konfirmim,së shpejti dikush nga stafi do te ju kontaktoj! Për vonesa kontakto +38346666333."}
            <br />
            <br />
            {currentLanguage === "en"
              ? "Thank you for your understanding."
              : "Ju faleminderit per mirkuptimin tuaj."}
          </h4>
          <div className="successPageButtons-services">
            <a href="/services">
              <BlueButton>
                {currentLanguage === "en"
                  ? "Add another service"
                  : "Shto shërbim tjetër"}
              </BlueButton>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceCartSuccess;
