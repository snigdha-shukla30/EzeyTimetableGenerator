import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

function MultiSelect({
  label,
  placeholder,
  options,
  selectedItems,
  onToggle,
  onRemove,
  displayKey = "name",
  secondaryKey = null,
  additionalKeys = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    const isSelected = selectedItems.some((item) => (item._id || item) === (option._id || option));
    if (isSelected) {
      onRemove(option);
    } else {
      onToggle(option);
    }
    // Note: Removed setIsOpen(false) to keep dropdown open for multiple selections
  };

  const filteredOptions = options.filter((option) => {
    const matchesSearch =
      option[displayKey]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (secondaryKey &&
        option[secondaryKey]?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      additionalKeys.some((key) =>
        option[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  const labelStyle = {
    color: "#265768",
    fontFamily: "'Mulish', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
  };

  const selectStyle = {
    width: "100%",
    height: "40px",
    border: "1.5px solid #DFDFDF",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "'Mulish', sans-serif",
    color: "#265768",
    padding: "0 12px",
    boxSizing: "border-box",
    cursor: "pointer",
    background: "white",
    display: "flex",
    alignItems: "center",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef} className="w-full">
      <div style={labelStyle}>{label}</div>

      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...selectStyle,
          borderColor: isOpen ? "#4BACCE" : "#DFDFDF",
          color: selectedItems.length === 0 ? "#9AA5B6" : "#265768",
        }}
        className="relative pr-8 overflow-hidden whitespace-nowrap text-ellipsis"
      >
        {selectedItems.length === 0
          ? placeholder
          : `${selectedItems.length} items selected`}
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke={isOpen ? "#4BACCE" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: "white",
            border: "1.5px solid #4BACCE",
            borderRadius: "8px",
            maxHeight: "280px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          className="custom-scroll"
        >
          <div
            style={{
              padding: "8px",
              borderBottom: "1px solid #f0f0f0",
              position: "sticky",
              top: 0,
              background: "white",
              zIndex: 10,
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              autoFocus
              className="w-full px-3 py-1.5 border border-[#DFDFDF] rounded-md text-[13px] outline-none focus:border-[#4BACCE]"
              style={{ fontFamily: "'Mulish', sans-serif" }}
            />
          </div>

          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-[13px] font-['Mulish']">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedItems.some((item) => (item._id || item) === (option._id || option));
                return (
                  <div
                    key={option._id || option}
                    onClick={() => handleSelect(option)}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors duration-150 ${isSelected ? "bg-[#F0F9FF]" : "hover:bg-[#F3F6FB]"}`}
                    style={{ fontFamily: "'Mulish', sans-serif" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-medium truncate ${isSelected ? "text-[#1A8FE3]" : "text-[#265768]"}`}>
                        {option[displayKey]}
                      </div>
                      {(secondaryKey && option[secondaryKey]) || additionalKeys.length > 0 ? (
                        <div className="text-[11px] text-[#8A96A8] truncate mt-0.5">
                          {secondaryKey && option[secondaryKey] ? `${option[secondaryKey]} ` : ""}
                          {additionalKeys.length > 0 && 
                            additionalKeys
                              .filter((key) => option[key])
                              .map((key) => option[key])
                              .join(" • ")
                          }
                        </div>
                      ) : null}
                    </div>
                    {isSelected && (
                      <div className="ml-2 text-[#1A8FE3] shrink-0">
                        <Check size={16} strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
