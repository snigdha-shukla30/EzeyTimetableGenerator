import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const placeholderTexts = [
  "Search time table",
  "Search faculty",
  "Search classroom",
  "Search subject",
];

const headerStyles = `
  .header-search-input::placeholder {
    color: #4BACCE !important;
    opacity: 1 !important;
  }
`;

const Header = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{headerStyles}</style>
      <div className="w-full px-2 py-2 md:px-4 md:py-3 bg-white">
        <div
          className="flex items-center justify-between w-full px-3 py-2 md:px-5 md:py-3 bg-[#BFBFBF]/10"
          style={{ border: "1px solid #BFBFBF", borderRadius: "0px" }}
        >
          {/* Left - Search Bar */}
          <div className="relative w-[180px] md:w-[220px] lg:w-[260px]">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            {/* ✅ FIX: Removed wrong "placeholder-[#4BACCE]" class, added "header-search-input" */}
            <input
              type="text"
              placeholder={placeholderTexts[index]}
              className="header-search-input w-full pl-9 pr-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-700 bg-white focus:outline-none"
              style={{ border: "1.5px solid #BFBFBF", borderRadius: "8px" }}
            />
          </div>

          {/* Right - University Info */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden border-2 border-yellow-400 flex-shrink-0">
              <img
                src="logo.png"
                alt="Maharishi University"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] md:text-[13px] lg:text-[14px] font-bold text-gray-900">
                Maharishi University
              </p>
              <p className="text-[10px] md:text-[11px] lg:text-[12px] text-gray-500">
                Lucknow,UP
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;