import React, { useEffect, useState } from "react";
import "./ReservationPost.scss";
import BlueButton from "../../BlueButton/BlueButton";
import reservationTruck from "../../../assets/images/reservoTruck.png";
import capitalize from "../../../utils/Capitalize";
import { useLanguage } from "../../../context/Language";

const ReservationPost = ({ data }: any) => {
  const { currentLanguage } = useLanguage();
  const [countdownArrival, setCountdownArrival] = useState("");
  const [countdownOpen, setCountdownOpen] = useState("");

  const translations: any = {
    en: {
      days: "days",
      hours: "hours",
      minutes: "minutes",
      arrived: "Arrived",
      category: "Category",
      arrival: "Arrival Time",
      open: "Open",
      openStatus: "Open",
      closedStatus: "Closed",
    },
    sq: {
      days: "ditë",
      hours: "orë",
      minutes: "minuta",
      arrived: "Ka arritur",
      category: "Kategoria",
      arrival: "Koha arritjes",
      open: "Hapja",
      openStatus: "E hapur",
      closedStatus: "E mbyllur",
    },
  };

  const t: any = translations[currentLanguage] || translations.en;

  const calculateTimeLeft = (targetTime: string) => {
    const difference = +new Date(targetTime) - +new Date();
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      return `${days} ${t.days} ${hours} ${t.hours} ${minutes} ${t.minutes}`;
    }
    return t.arrived;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownOpen(calculateTimeLeft(data.openTime));
      setCountdownArrival(calculateTimeLeft(data.arrivalTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [data.arrivalTime, data.openTime, currentLanguage]);

  const isDisabled = countdownOpen !== t.arrived;

  return (
    <div className="reservation-post">
      <img src={reservationTruck} alt="" className="reservation-post-image" />
      <div className="reservation-post-content">
        <div className="post-content-header">
          <h5>{data.title}</h5>
          <div className="post-content-text">
            <p>
              {t.category}: <span>{capitalize(data.category)}</span>
            </p>
            <p>
              {t.arrival}: <span>{countdownArrival}</span>
            </p>
            <p>
              {t.open}: <span>{countdownOpen === t.arrived ? t.openStatus : t.closedStatus}</span>
            </p>
          </div>
        </div>
        <a
          href={`/reservation/${data.id}`}
          onClick={(e) => isDisabled && e.preventDefault()}
        >
          <button
            className={`reservation-link ${isDisabled ? "disabled-link" : ""}`}
            onClick={(e) => isDisabled && e.preventDefault()}
          >
            <BlueButton disabled={isDisabled}>
              {currentLanguage === "en" ? "View Products" : "Shiko produktet"}
            </BlueButton>
          </button>
        </a>
      </div>
    </div>
  );
};

export default ReservationPost;
