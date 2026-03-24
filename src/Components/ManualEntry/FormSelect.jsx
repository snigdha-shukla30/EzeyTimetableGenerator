import React from "react";

/**
 * Reusable select/dropdown for all Manual Entry forms.
 * Same visual style as FormInput — same height, border, font.
 *
 * Props:
 *   options — array of { value, label }
 *   OR pass children directly for custom <option> elements
 */
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  children,
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-input w-full h-[40px] rounded-[15px] border-[1.5px] border-[#DFDFDF] px-3 text-[14px] font-['Mulish'] text-black bg-white focus:outline-none focus:border-[#4BACCE] disabled:opacity-60 appearance-none ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: "35px",
        }}
      >
        {children ||
          options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
    </div>
  );
};

export default FormSelect;
