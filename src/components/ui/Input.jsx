import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Input = ({
  label,
  type = "text",
  variant = "standard",
  value,
  onChange,
  placeholder,
  className = "",
  containerClassName = "",
  error = "",
  options = [], // For select variant
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseInputStyle = "w-full outline-none transition-all duration-200 font-mulish text-sm";

  const variants = {
    // Standard form input with label and bottom margin
    standard: `
      h-[40px] px-4
      bg-white border-2 border-gray-300 rounded-md
      text-[#265768] placeholder:text-gray-400
      focus:border-[#1A8FE3]
    `,

    // Inline table editing input
    edit: `
      h-[32px] px-2
      bg-white border border-[#BFBFBF] rounded
      text-center text-[#265768]
      focus:border-[#1A8FE3]
    `,

    // Search bar variant (handled by SearchBar generally, but available here)
    search: `
      h-[40px] pl-10 pr-4
      bg-[#F7FAFD] border border-[#BFBFBF] rounded-[16px]
      text-[#265768] placeholder:text-[#9AA5B6]
      focus:border-[#1A8FE3]
    `,

    // Select dropdown
    select: `
      h-[40px] px-4
      bg-white border-2 border-gray-300 rounded-md
      text-[#265768]
      focus:border-[#1A8FE3]
      cursor-pointer
    `,
  };

  const isPassword = type === "password" && variant !== "select";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[#265768] font-semibold text-[13px] ml-0.5">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {variant === "select" ? (
          <select
            value={value}
            onChange={onChange}
            className={`${baseInputStyle} ${variants.select} ${className}`}
            disabled={props.disabled}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {props.children}
          </select>
        ) : (
          <>
            <input
              type={inputType}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={`${baseInputStyle} ${variants[variant] || variants.standard} ${isPassword ? "pr-10" : ""} ${className}`}
              {...props}
            />

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </>
        )}
      </div>

      {error && <span className="text-red-500 text-[11px] font-medium ml-1">{error}</span>}
    </div>
  );
};
