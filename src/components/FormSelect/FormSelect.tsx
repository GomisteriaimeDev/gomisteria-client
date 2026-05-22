import React from "react";
import "./FormSelect.scss";

const CustomSelect = ({ data, title, onSelectChange }: any) => {
  return (
    <select onChange={onSelectChange} className="select">
      <option value="">Select an option</option>
      {data?.map((item: any, index: any) => (
        <option key={index} value={item} className="select-option">
          {item}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;
