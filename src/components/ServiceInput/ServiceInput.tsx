import React from "react";

const ServiceInput = ({ value, handleChange }: any) => {
  return (
    <div className="selector-with-label">
      <label className="input-label">
        <p>Madhësia:</p>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={`input-field ${value && "has-value"}`}
        />
      </label>
    </div>
  );
};

export default ServiceInput;
