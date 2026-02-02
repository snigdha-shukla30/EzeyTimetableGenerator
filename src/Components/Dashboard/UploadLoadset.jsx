
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getBatches, generateTimetable } from "../../api/api";
import Swal from "sweetalert2";

const UploadLoadset = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchBatches();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await getBatches();
      if (res?.success) {
        setBatchOptions(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedBatchId) {
      Swal.fire({
        icon: "warning",
        text: "Please select a batch first",
        confirmButtonColor: "#4BACCE",
      });
      return;
    }

    try {
      setGenerating(true);
      await generateTimetable(selectedBatchId);
      Swal.fire({
        icon: "success",
        text: "Timetable generated successfully!",
        confirmButtonColor: "#4BACCE",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        text: err.message || "Failed to generate timetable",
        confirmButtonColor: "#4BACCE",
      });
    } finally {
      setGenerating(false);
    }
  };

  const formatBatchLabel = (b) => {
    const course = b?.course || b?.degree || "-";
    const department = b?.department || "-";
    const section = b?.name || b?.section || "-";
    const semester = b?.semester ?? "-";
    return `${course} - ${department} - ${section} (Semester ${semester})`;
  };

  return (
    <div
      className="w-[335px] h-[259px] bg-white rounded-[10px] border border-[#CACACA] p-6 flex flex-col"
      style={{
        boxShadow: "0px 4px 50px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Heading */}
      <h3 className="text-[16px] font-semibold text-[#265768] text-center mb-1">
        Quick Actions <span className="text-[15px]" style={{ filter: 'hue-rotate(180deg) saturate(0.2)' }}>⚡</span>
      </h3>

      {/* Line under Quick Actions (figma style) */}
      <div className="w-full h-[3px] bg-[#D9D9D9] mt-2 mb-4" />

      {/* 3 Buttons – centered, vertical */}
      <div className="flex-1 flex flex-col items-center justify-center gap-7">
        <div className="w-[230px] relative" ref={dropdownRef}>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShowDropdown(true);
                setSelectedBatchId("");
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Select Batch to Generate"
              className="w-full h-[35px] px-3 text-[12px] border border-[#B4D4DF] rounded-[8px] focus:outline-none focus:border-[#4BACCE]"
            />
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 w-full bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
              {loading ? (
                <div className="px-3 py-2 text-xs text-gray-500">Loading...</div>
              ) : (
                batchOptions
                  .filter((b) =>
                    formatBatchLabel(b)
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  )
                  .map((b) => (
                    <div
                      key={b._id}
                      onClick={() => {
                        setSearchText(formatBatchLabel(b));
                        setSelectedBatchId(b._id);
                        setShowDropdown(false);
                      }}
                      className="px-3 py-2 text-xs cursor-pointer hover:bg-gray-50 text-gray-700 truncate"
                      title={formatBatchLabel(b)}
                    >
                      {formatBatchLabel(b)}
                    </div>
                  ))
              )}
              {!loading && batchOptions.length === 0 && (
                <div className="px-3 py-2 text-xs text-gray-500">No batches found</div>
              )}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full mt-2 h-[30px] text-[12px] font-medium text-white bg-[#4BACCE] rounded-[6px] hover:bg-[#265768] transition-colors disabled:opacity-70"
          >
            {generating ? "Generating..." : "Generate Timetable"}
          </button>
        </div>

        {/* <button
          onClick={handleViewTimetable}
          className="w-[230px] h-[40px] text-[13px] font-medium text-[#4B8FA8] bg-white border border-[#B4D4DF] rounded-[10px] shadow-[0px_4px_20px_rgba(148,163,184,0.15)] hover:text-white transition-all group"
          style={{
            background: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(270deg, #265768 0%, #4BACCE 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
        >
          View Timetable
        </button> */}

        <button
          onClick={() => navigate("/dashboard")}
          className="w-[230px] h-[40px] text-[13px] font-medium text-[#4B8FA8] bg-white border border-[#B4D4DF] rounded-[10px] shadow-[0px_4px_20px_rgba(148,163,184,0.15)] hover:text-white transition-all group"
          style={{
            background: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(270deg, #265768 0%, #4BACCE 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
        >
          Manage Data
        </button>
      </div>
    </div>
  );
};

export default UploadLoadset;