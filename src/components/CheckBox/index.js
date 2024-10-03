import React from "react";

const CheckBox = ({ text, isChecked, handleCheckboxChange }) => {
  return (
    <div className="container mt-5">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="form-checkbox h-5 w-5 text-blue-500"
        />
        <span className="text-white">{text}</span>
      </label>
    </div>
  );
};

export default CheckBox;
