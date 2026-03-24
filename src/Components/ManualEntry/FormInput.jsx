import React from "react";

/**
 * Reusable input field for all Manual Entry forms.
 * Bakes in the shared label + input styling used across all 4 pages.
 */
const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  disabled = false,
  className = "",
}) => {
  return (
    <div>
      {label && (
        <div className="text-[14px] text-[#265768] font-['Mulish'] mb-1">
          {label}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input w-full h-[40px] rounded-[15px] border-[1.5px] border-[#DFDFDF] px-3 text-[14px] font-['Mulish'] text-black bg-white focus:outline-none focus:border-[#4BACCE] disabled:opacity-60 ${className}`}
      />
    </div>
  );
};

export default FormInput;
