import React, { useRef, useState, useEffect } from "react";

export default function MultiSelect({
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
    const isSelected = selectedItems.some((item) => item._id === option._id);
    if (!isSelected) {
      onToggle(option);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const filteredOptions = options.filter((option) => {
    const isNotSelected = !selectedItems.some((item) => item._id === option._id);
    const matchesSearch =
      option[displayKey]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (secondaryKey &&
        option[secondaryKey]?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      additionalKeys.some((key) =>
        option[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    return isNotSelected && matchesSearch;
  });

  const labelStyle = {
    color: "#265768",
    fontFamily: "'Mulish', sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "8px",
  };

  const selectStyle = {
    width: "100%",
    height: "40px",
    border: "1.5px solid #DFDFDF",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Mulish', sans-serif",
    color: "#000000",
    padding: "0 12px",
    boxSizing: "border-box",
    cursor: "pointer",
    background: "white",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: "35px",
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <div style={labelStyle}>{label}</div>

      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...selectStyle,
          display: "flex",
          alignItems: "center",
          color: selectedItems.length === 0 ? "#999" : "#000",
        }}
      >
        {selectedItems.length === 0
          ? placeholder
          : `${selectedItems.length} selected`}
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
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              padding: "8px",
              borderBottom: "1px solid #f0f0f0",
              position: "sticky",
              top: 0,
              background: "white",
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              autoFocus
              style={{
                width: "100%",
                padding: "6px 10px",
                border: "1px solid #DFDFDF",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "'Mulish', sans-serif",
                outline: "none",
              }}
            />
          </div>

          <div>
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: "12px",
                  textAlign: "center",
                  color: "#999",
                  fontSize: "13px",
                  fontFamily: "'Mulish', sans-serif",
                }}
              >
                No options available
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option._id}
                  onClick={() => handleSelect(option)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f5f5f5",
                    fontFamily: "'Mulish', sans-serif",
                    fontSize: "14px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E8F4F8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <div style={{ fontWeight: "500", color: "#333" }}>
                    {option[displayKey]}
                  </div>
                  {secondaryKey && option[secondaryKey] && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                      {option[secondaryKey]}
                    </div>
                  )}
                  {additionalKeys.length > 0 && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                      {additionalKeys
                        .filter((key) => option[key])
                        .map((key) => option[key])
                        .join(" • ")}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
