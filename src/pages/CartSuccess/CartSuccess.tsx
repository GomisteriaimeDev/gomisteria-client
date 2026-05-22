import React from "react";
import "./CartSuccess.scss";
import successCheck from "../../assets/svg/SuccessCheck.svg";
import Header from "../../components/Header/Header";
import BlueButton from "../../components/BlueButton/BlueButton";
import OutlineButton from "../../components/OutlineButton/OutlineButton";
import { useLanguage } from "../../context/Language";
const CartSuccess = () => {
  const { currentLanguage } = useLanguage();
  return (
    <>
      <Header />
      <div className="successPageWrapper-services">
        <div className="successPageContent-services">
          <img src={successCheck} alt="checkmark-services" />
          <h4 className="successPageText-services">
            {currentLanguage === "en"
              ? "Thank you for making the order! Your order will be confirmed by our staff shortly"
              : " Ju faleminderit që bët porosin tek ne! Porosia juaj do te konfirmohet shume shpejt nga stafi."}
            <br />
            <br />{" "}
            {currentLanguage === "en"
              ? "For delays contact "
              : "Për vonesa kontakto "}
            +38346666333
          </h4>
          <div className="successPageButtons-services">
            {/* <a href="/account/invoices">
              <BlueButton>
                {currentLanguage === "en"
                  ? "Generate invoice"
                  : "Gjeneroni faturë"}
              </BlueButton>
            </a> */}
            <a href="/home">
              <OutlineButton>
                {currentLanguage === "en" ? "Go Home" : "Kthehu te ballina"}
              </OutlineButton>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSuccess;
