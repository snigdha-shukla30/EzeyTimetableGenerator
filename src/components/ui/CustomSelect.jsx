import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export const CustomSelect = ({
  label,
  placeholder = "Select an option",
  options = [],
  value,
  onChange,
  className = "",
  containerClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (opt) => {
    onChange?.({ target: { name: "", value: opt.value } });
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`} ref={dropdownRef}>
      {label && (
        <label className="text-[#265768] font-semibold text-[13px] ml-0.5">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`
            h-[40px] px-4 flex items-center justify-between
            bg-white border-2 rounded-md cursor-pointer transition-all duration-200
            font-mulish text-sm text-[#265768]
            ${isOpen ? "border-[#1A8FE3]" : "border-gray-300"}
            ${className}
          `}
        >
          <span className={!selectedOption ? "text-gray-400" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#1A8FE3]" : "text-gray-400"}`} />
        </div>

        {isOpen && (
          <div
            className="
              absolute top-full left-0 right-0 mt-1 z-[1000]
              bg-white border-2 border-[#1A8FE3] rounded-md
              shadow-lg max-h-[200px] overflow-y-auto
              custom-scroll
            "
          >
            {options.length === 0 ? (
              <div className="p-3 text-center text-gray-400 text-xs">No options</div>
            ) : (
              options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`
                    px-4 py-2.5 cursor-pointer text-[13px] font-medium font-mulish
                    transition-colors duration-150
                    ${value === opt.value ? "bg-[#F0F9FF] text-[#1A8FE3]" : "text-[#265768] hover:bg-[#F3F6FB]"}
                  `}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
