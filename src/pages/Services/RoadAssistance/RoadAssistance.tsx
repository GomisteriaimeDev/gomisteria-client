import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./RoadAssistance.scss";
import back from "../../../assets/svg/backArrow.svg";
import useFetchData, { getRoadAssistance } from "../../../services/api";
import { cityAliases, skopjeDistricts } from "../../../data/locations";
import DynamicMap from "../../../components/MapComponent/DynamicMap";
import { useLanguage } from "../../../context/Language";
const isBusinessOpen = (business: any): boolean => {
  if (business?.specialFields?.alwaysAvailable) return true;

  const workingHours = business?.specialFields?.workingHours;
  if (!workingHours) return false;

  // Get current day name (e.g., "Monday", "Tuesday", etc.)
  const now = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = daysOfWeek[now.getDay()];

  // Find today's working hours for the business.
  const todaysHours = workingHours.find((day: any) => day.day === today);
  if (!todaysHours) return false;

  // If either the opening or closing hour is "closed", the business is closed today.
  if (
    todaysHours.openingHour.toLowerCase() === "closed" ||
    todaysHours.closingHour.toLowerCase() === "closed"
  ) {
    return false;
  }

  // Convert hours to minutes for comparison.
  const [openHour, openMinute] = todaysHours.openingHour.split(":").map(Number);
  const [closeHour, closeMinute] = todaysHours.closingHour
    .split(":")
    .map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openingMinutes = openHour * 60 + openMinute;
  const closingMinutes = closeHour * 60 + closeMinute;

  return nowMinutes >= openingMinutes && nowMinutes <= closingMinutes;
};

const RoadAssistance = () => {
  const { currentLanguage } = useLanguage();
  const [selectedService, setSelectedService] = useState("Gomisteri");
  const [userCity, setUserCity] = useState<string | undefined>(undefined);
  const [locationLoading, setLocationLoading] = useState(true);
  const { data } = useFetchData(getRoadAssistance, selectedService);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 42.6629,
    lng: 21.1655,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=sq`
          );
          const geoData = await res.json();
          const city =
            geoData?.address?.city ||
            geoData?.address?.town ||
            geoData?.address?.municipality ||
            geoData?.address?.county;
          if (city) {
            setUserCity(cityAliases[city] || city);
          }
        } catch (err) {
          console.warn("Failed to reverse geocode location:", err);
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
      }
    );
  }, []);

  const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const isSkopje = normalize(userCity || "") === normalize("Skopje");

  const filteredData = userCity
    ? data?.filter((b: any) => {
        const bizCity = b?.specialFields?.city;
        if (!bizCity) return false;
        if (isSkopje && skopjeDistricts.some((d) => normalize(d) === normalize(bizCity))) {
          return true;
        }
        return normalize(bizCity).includes(normalize(userCity)) ||
          normalize(userCity).includes(normalize(bizCity));
      }) || []
    : data || [];

  const openData =
    filteredData.filter((business: any) => isBusinessOpen(business)) || [];

  const handleChange = (event: any) => {
    setSelectedService(event.target.value);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  return (
    <>
      <Header />
      <div className="services-booking">
        <aside className="service-menu">
          <h3>
            {currentLanguage === "en" ? "Road Assistance" : "Asistencë Rrugore"}
          </h3>
          {locationLoading ? (
            <p className="city-indicator">
              {currentLanguage === "en" ? "Detecting location..." : "Duke detektuar vendndodhjen..."}
            </p>
          ) : userCity ? (
            <p className="city-indicator">📍 {userCity}</p>
          ) : null}
          <div className="service-menu-selection">
            <label>
              <input
                type="radio"
                name="service"
                value="Gomisteri"
                checked={selectedService === "Gomisteri"}
                onChange={handleChange}
              />
              Gomisteri
            </label>
            <label>
              <input
                type="radio"
                name="service"
                value="Karrotrec"
                checked={selectedService === "Karrotrec"}
                onChange={handleChange}
              />
              Karrotrec
            </label>
            <label>
              <input
                type="radio"
                name="service"
                value="Taxi"
                checked={selectedService === "Taxi"}
                onChange={handleChange}
              />
              Taxi
            </label>
            <label>
              <input
                type="radio"
                name="service"
                value="Rent a Car"
                checked={selectedService === "Rent a Car"}
                onChange={handleChange}
              />
              Rent a Car
            </label>
          </div>
        </aside>
        <div className="service-section">
          {selectedService === "Gomisteri" && (
            <FormGomisteri
              data={openData}
              handleMapClick={handleMapClick}
              selectedLocation={selectedLocation}
              currentLanguage={currentLanguage}
            />
          )}
          {selectedService === "Karrotrec" && (
            <FormKarrotrec
              data={openData}
              handleMapClick={handleMapClick}
              currentLanguage={currentLanguage}
              selectedLocation={selectedLocation}
            />
          )}
          {selectedService === "Taxi" && (
            <FormTaxi
              data={openData}
              selectedLocation={selectedLocation}
              currentLanguage={currentLanguage}
            />
          )}
          {selectedService === "Rent a Car" && (
            <FormRent
              data={openData}
              handleMapClick={handleMapClick}
              currentLanguage={currentLanguage}
              selectedLocation={selectedLocation}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const FormGomisteri = ({
  data,
  handleMapClick,
  selectedLocation,
  currentLanguage,
}: any) => (
  <div className="service-picker">
      <a href="/services" className="backArrow">
        <img src={back} alt="" />
      </a>
      <div className="services-list">
        <div className="service-list-details">
          <h5>
            {currentLanguage === "en"
              ? `${data?.length} gomisteri found`
              : `U gjetën ${data?.length} gomisteri`}
          </h5>
          <div className="service-list-all">
            {data?.length > 0 && data?.map((business: any, index: any) => (
              <div className="service-list-item" key={index}>
                <p>{business?.specialFields?.companyName}</p>
                <div className="service-item-actions">
                  <a href={"tel:" + business?.specialFields?.phone}>
                    {currentLanguage === "en" ? "Contact" : "Kontakto"}
                  </a>
                  <span
                    className="service-map-action"
                    onClick={() => {
                      if (
                        business?.specialFields?.latitude &&
                        business?.specialFields?.longitude
                      ) {
                        handleMapClick(
                          business?.specialFields?.latitude,
                          business?.specialFields?.longitude
                        );
                      } else {
                        console.warn(
                          "No coordinates available for this business"
                        );
                      }
                    }}
                  >
                    {currentLanguage === "en"
                      ? "View on map"
                      : "Shiko në hartë"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="map-container">
          {selectedLocation ? (
            <DynamicMap
              latitude={selectedLocation.lat}
              longitude={selectedLocation.lng}
            />
          ) : (
            <p>Select a business to see its location on the map.</p>
          )}
        </div>
      </div>
    </div>
);

const FormKarrotrec = ({
  data,
  handleMapClick,
  selectedLocation,
  currentLanguage,
}: any) => (
  <div className="service-picker">
    <a href="/services" className="backArrow">
      <img src={back} alt="" />
    </a>
    <div className="services-list">
      <div className="service-list-details">
        <h5>
          {currentLanguage === "en"
            ? `${data?.length} karrotrec found`
            : `U gjetën ${data?.length} karrotrec`}
        </h5>
        <div className="service-list-all">
          {data?.map((business: any, index: any) => (
            <div className="service-list-item" key={index}>
              <p>{business?.specialFields?.companyName}</p>
              <div className="service-item-actions">
                <a href={"tel:" + business?.specialFields?.phone}>
                  {currentLanguage === "en" ? "Contact" : "Kontakto"}
                </a>
                <span
                  className="service-map-action"
                  onClick={() => {
                    if (
                      business?.specialFields?.latitude &&
                      business?.specialFields?.longitude
                    ) {
                      handleMapClick(
                        business?.specialFields?.latitude,
                        business?.specialFields?.longitude
                      );
                    } else {
                      console.warn(
                        "No coordinates available for this business"
                      );
                    }
                  }}
                >
                  {currentLanguage === "en" ? "View on map" : "Shiko në hartë"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="map-container">
        {selectedLocation ? (
          <DynamicMap
            latitude={selectedLocation.lat}
            longitude={selectedLocation.lng}
          />
        ) : (
          <p>Select a business to see its location on the map.</p>
        )}
      </div>
    </div>
  </div>
);

const FormTaxi = ({ data, selectedLocation, currentLanguage }: any) => (
  <div className="service-picker">
    <a href="/services" className="backArrow">
      <img src={back} alt="" />
    </a>
    <div className="services-list">
      <div className="service-list-details">
        <h5>
          {" "}
          {currentLanguage === "en"
            ? `${data?.length} taxi found`
            : `U gjetën ${data?.length} taxi`}
        </h5>
        <div className="service-list-all">
          {data?.map((data: any, index: any) => (
            <div className="service-list-item" key={index}>
              <p>{data?.specialFields?.companyName}</p>
              <div className="service-item-actions">
                <a href={"tel:" + data?.specialFields?.phone}>
                  {" "}
                  {currentLanguage === "en" ? "Contact" : "Kontakto"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="map-container">
        {selectedLocation ? (
          <DynamicMap
            latitude={selectedLocation.lat}
            longitude={selectedLocation.lng}
          />
        ) : (
          <p>Select a business to see its location on the map.</p>
        )}
      </div>
    </div>
  </div>
);

const FormRent = ({
  data,
  handleMapClick,
  selectedLocation,
  currentLanguage,
}: any) => (
  <div className="service-picker">
    <a href="/services" className="backArrow">
      <img src={back} alt="" />
    </a>
    <div className="services-list">
      <div className="service-list-details">
        <h5>
          {" "}
          {currentLanguage === "en"
            ? `${data?.length} Rent a Car found`
            : `U gjetën ${data?.length} Rent a Car`}
        </h5>
        <div className="service-list-all">
          {data?.map((business: any, index: any) => (
            <div className="service-list-item" key={index}>
              <p>{business?.specialFields?.companyName}</p>
              <div className="service-item-actions">
                <a href={"tel:" + business?.specialFields?.phone}>
                  {currentLanguage === "en" ? "Contact" : "Kontakto"}
                </a>
                <span
                  className="service-map-action"
                  onClick={() =>
                    handleMapClick(
                      business?.specialFields?.latitude,
                      business?.specialFields?.longitude
                    )
                  }
                >
                  {currentLanguage === "en" ? "View on map" : "Shiko në hartë"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="map-container">
        {selectedLocation ? (
          <DynamicMap
            latitude={selectedLocation.lat}
            longitude={selectedLocation.lng}
          />
        ) : (
          <p>Select a business to see its location on the map.</p>
        )}
      </div>
    </div>
  </div>
);

export default RoadAssistance;
