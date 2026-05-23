import React from "react";
import "./ReservationSuccess.scss";
import successCheck from "../../../assets/svg/SuccessCheck.svg";
import Header from "../../../components/Header/Header";
import BlueButton from "../../../components/BlueButton/BlueButton";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
const ReservationSuccess = () => {
  return (
    <>
      <Header />
      <div className="successPageWrapper-services">
        <div className="successPageContent-services">
          <img src={successCheck} alt="checkmark-services" />
          <h4 className="successPageText-services">
          Ju faleminderit që bët rezervimin tek ne! Porosia juaj do te konfirmohet shume shpejt nga stafi.
            <br />
            <br /> Ju faleminderit per mirkuptimin tuaj.
          </h4>
          <div className="successPageButtons-services">
            <a href="/reservation/cart">
              <BlueButton>Shko te shporta</BlueButton>
            </a>
            <a href="/">
              <OutlineButton>Kthehu ne ballinë</OutlineButton>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationSuccess;
