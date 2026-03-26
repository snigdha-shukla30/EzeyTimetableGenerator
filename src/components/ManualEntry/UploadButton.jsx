import React from "react";

/**
 * Shared gradient upload button used by Classroom, Faculty pages.
 * Handles disabled/uploading state visually.
 */
const UploadButton = ({ onClick, uploading = false, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || uploading}
      className="h-[34px] px-4 min-w-[170px] rounded-[6px] text-white text-[12px] font-['Mulish'] font-medium
        bg-[linear-gradient(0deg,#265768_0%,#4BACCE_100%)]
        shadow-[0_2px_4px_rgba(0,0,0,0.12)]
        hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {uploading ? "Uploading..." : "Upload File ( CSV / XLSX )"}
    </button>
  );
};

export default UploadButton;
