import React from "react";
import { Search } from "lucide-react";

export const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`flex-1 ${containerClassName}`}>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA5B6] group-focus-within:text-[#4BACCE] transition-colors duration-200">
          <Search size={16} />
        </div>
        
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`
            w-full h-[40px]
            bg-[#F7FAFD] border border-[#BFBFBF] rounded-[16px]
            pl-11 pr-4 text-sm text-[#374151]
            placeholder:text-[#9AA5B6]
            outline-none
            focus:border-[#4BACCE] focus:ring-1 focus:ring-[#4BACCE]/20
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};
