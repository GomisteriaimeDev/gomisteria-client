import React, { useEffect, useState } from "react";
import "./PhoneNumberInput.scss"; // Assuming you have SASS installed and configured
import rks from "../../assets/svg/rks.svg";
import alb from "../../assets/svg/alb.svg";
import mkd from "../../assets/svg/mkd.svg";

const PhoneNumberInput = ({ value, onChange, error, touched }: any) => {
  const [phone, setPhone] = useState(value.phone || "");
  const [countryCode, setCountryCode] = useState(value.countryCode || "+383");

  const countryCodes = [
    { code: "+383", flag: rks },
    { code: "+355", flag: alb },
    { code: "+389", flag: mkd },
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    onChange({ phone: newPhone, countryCode });
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value;
    setCountryCode(newCountryCode);
    onChange({ phone, countryCode: newCountryCode });
  };

  return (
    <div className="phone-number-input">
      <select
        className="country-code-dropdown"
        value={countryCode}
        onChange={handleCountryCodeChange}
        name="countryCode"
      >
        {countryCodes.map((country) => (
          <option key={country.code} value={country.code}>
            {country.code}
          </option>
        ))}
      </select>
      <input
        type="text"
        className={`phone-input ${touched && error ? 'error' : ''}`}
        value={phone}
        onChange={handlePhoneChange}
        name="phone"
      />
      {touched && error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PhoneNumberInput;
