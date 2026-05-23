import React from "react";
import "./ServiceSelect.scss";
const ServiceSelect = ({ label, value, handleChange, options }: any) => {
  return (
    <div className="selector-with-label">
      <label className="input-label-select">
        <p>{label} </p>

        <select
          value={value}
          onChange={handleChange}
          className={`select-field ${value ? "has-value" : ""}`}
          required
        >
          <option value="">--</option>

          {options?.map((option: any, index: number) => (
            <option key={index} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ServiceSelect;
