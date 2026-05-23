import React from "react";
import "./ServiceTimePicker.scss"; // Ensure you have corresponding CSS styles

const ServiceTimePicker = ({ label, value, handleChange }: any) => {
  return (
    <div className="time-picker-with-label">
      <label className="input-label-time">
        <p>{label}:</p>
        <input
          type="time"
          value={value}
          onChange={handleChange}
          className={`time-field ${value ? "has-value" : ""}`}
          required
        />
      </label>
    </div>
  );
};

export default ServiceTimePicker;
