import React, { useEffect, useState, useRef } from "react";
import {
  getBatches,
  getTimetablePreviewAPI,
  getTimetableVisualHTML,
  generateTimetable,
} from "../../services/api";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


import DataEntryTable from "../../components/ui/dataEntryTable";
import { Table } from "@mantine/core";
const PreviewIcon = () => (
  <img src="/preview.svg" alt="preview" className="w-[18px] opacity-100" />
);

export default function GenerateTT() {
  const [activeTab, setActiveTab] = useState("generate");
  const dropdownRef = useRef(null);

  // ✅ dropdown input text
  const [searchText, setSearchText] = useState("");

  // ✅ selected batchId (this is what backend needs)
  const [selectedBatchId, setSelectedBatchId] = useState("");

  // ✅ dropdown control
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ batches list from API
  const [batchOptions, setBatchOptions] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // generate api loader
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ preview api states
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewData, setPreviewData] = useState(null);

  // =====================================================
  // ✅ Fetch batches from API (for dropdown)
  // =====================================================
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setBatchLoading(true);
        const res = await getBatches();

        if (res?.success) {
          setBatchOptions(res.data || []);
        } else {
          setBatchOptions([]);
        }
      } catch (err) {
        console.error("Failed to fetch batches:", err);
        setBatchOptions([]);
      } finally {
        setBatchLoading(false);
      }
    };

    fetchBatches();

    // ✅ Click outside handler to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerate = async () => {
    if (!selectedBatchId) {
      Swal.fire({
        icon: "warning",
        text: "Please select batch from dropdown",
        confirmButtonColor: "#4BACCE",
      });
      return;
    }

    try {
      setLoading(true);

      // Call the generate timetable API
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
      setLoading(false);
    }
  };


  // =====================================================
  // ✅ Preview Tab fetch old timetable list
  // =====================================================
  const handlePreviewTabClick = async () => {
    setActiveTab("preview");

    try {
      setPreviewLoading(true);
      setPreviewError("");

      const res = await getTimetablePreviewAPI();
      setPreviewData(res);
    } catch (err) {
      console.error(err);
      setPreviewError("Failed to fetch preview timetable");
    } finally {
      setPreviewLoading(false);
    }
  };

  // =====================================================
  // ✅ helper for display label
  // =====================================================


  const formatBatchLabel = (b) => {
    const course = b?.course || b?.degree || "-";
    const department = b?.department || "-";
    const section = b?.name || b?.section || "-";
    const semester = b?.semester ?? "-";
    return `${course} - ${department} - ${section} (Semester ${semester})`;
  };


  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-0">

      {/* ===== Tabs ===== */}
      <div className="flex items-center gap-10 mb-5 border-b-[2px] border-[#D1D5DB] relative">
        <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-white" />

        <button
          onClick={() => setActiveTab("generate")}
          className={`pb-3 text-[14px] font-medium relative transition-colors ${
            activeTab === "generate"
              ? "text-[#265768]/90"
              : "text-[#9CA3AF] hover:text-[#265768]"
          }`}
        >
          Generate Timetable
          {activeTab === "generate" && (
            <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[140%] h-[8px] rounded-full bg-[#0077FF] border-[2px] border-white" />
          )}
        </button>

        <button
          onClick={handlePreviewTabClick}
          className={`pb-3 text-[14px] font-medium relative transition-colors ${
            activeTab === "preview"
              ? "text-[#265768]/90"
              : "text-[#9CA3AF] hover:text-[#265768]"
          }`}
        >
          Preview Timetable
          {activeTab === "preview" && (
            <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[140%] h-[8px] rounded-full bg-[#0077FF] border-[2px] border-white" />
          )}
        </button>
      </div>

      {/* ============================= */}
      {/* ✅ Generate tab (UI SAME) */}
      {/* ============================= */}
      {activeTab === "generate" && (
        <>
          {/* Search + Generate Row */}
          <div className="flex items-center justify-between gap-8 mb-6">
            <div className="w-[400px]" ref={dropdownRef}>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA5B6] group-focus-within:text-[#4BACCE] transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setShowDropdown(true);
                    setSelectedBatchId("");
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search batch (course / code / semester)"
                  className="w-full h-[40px] pl-11 pr-24 bg-[#F7FAFD] border border-[#BFBFBF] rounded-[16px] text-[#265768] text-sm placeholder:text-[#9AA5B6] focus:border-[#4BACCE] focus:ring-1 focus:ring-[#4BACCE]/20 outline-none transition-all duration-200"
                />

                {/* Add Batch Link */}
                <button
                  onClick={() => navigate("/manual/batches")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#4BACCE] hover:text-[#265768] transition-colors"
                >
                  + Add batch
                </button>
              </div>

              {/* Dropdown styling sync with SearchBar */}
              {showDropdown && (
                <div
                  className="absolute mt-2 bg-white
                  border border-[#E5E7EB] rounded-[10px] shadow-lg z-[100] 
                  max-h-40 overflow-y-auto w-[400px]"
                >
                  {batchLoading ? (
                    <div className="px-4 py-2 text-xs text-[#9CA3AF]">
                      Loading batches...
                    </div>
                  ) : (
                    <>
                      {batchOptions
                        .filter((b) => {
                          const label = formatBatchLabel(b).toLowerCase();
                          return label.includes(searchText.toLowerCase());
                        })
                        .map((b) => (
                          <div
                            key={b._id}
                            onClick={() => {
                              setSearchText(formatBatchLabel(b));
                              setSelectedBatchId(b._id);
                              setShowDropdown(false);
                            }}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-[#F7FAFD] text-[#374151] transition-colors"
                          >
                            {formatBatchLabel(b)}
                          </div>
                        ))}

                      {batchOptions.filter((b) =>
                        formatBatchLabel(b)
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-2 text-xs text-[#9CA3AF]">
                          No results found
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Generate Button standardized */}
            <Button
              variant="primary"
              onClick={handleGenerate}
              className="!w-[220px] !h-[40px] !text-[16px] !font-medium !rounded-[12px]"
            >
              {loading ? "Generating..." : "Generate Timetable"}
            </Button>
          </div>
        </>
      )}

      {/* ============================= */}
      {/* ✅ Preview tab (TABLE UI) */}
      {/* ============================= */}
      {activeTab === "preview" && (
        <div className="mt-4 flex-1 flex flex-col min-h-0">
          {previewLoading && (
            <p className="text-[#265768] font-semibold">Loading preview...</p>
          )}

          {previewError && (
            <p className="text-red-500 font-semibold">{previewError}</p>
          )}

          {!previewLoading &&
            !previewError &&
            previewData?.data?.length === 0 && (
              <p className="text-[#9CA3AF] font-semibold">
                No generated timetable found.
              </p>
            )}

          {!previewLoading &&
            !previewError &&
            previewData?.data?.length > 0 && (
              <DataEntryTable
                columns={[
                  { key: "course", label: "Degree / Course", width: "30%" },
                  { key: "dept", label: "Department", width: "25%" },
                  { key: "sem", label: "Semester", width: "15%" },
                  { key: "sec", label: "Section", width: "15%" },
                  { key: "view", label: "Preview Timetable", width: "15%" },
                ]}
                showActions={false}
                height="100%"
              >
                {previewData.data.map((tt) => {
                  const batch = tt?.batch;
                  const section =
                    typeof batch?.code === "string" && batch.code.length > 0
                      ? batch.code.slice(-1)
                      : "-";

                  return (
                    <Table.Tr key={tt._id} className="hover:bg-gray-50/50 transition-colors">
                      <Table.Td ta="left" className="text-[#265768]/70 py-4 pl-6">
                        {batch?.name || "-"}
                      </Table.Td>
                      <Table.Td ta="center" className="text-[#265768]/70 py-4">
                        {batch?.department || "-"}
                      </Table.Td>
                      <Table.Td ta="center" className="text-[#265768]/70 py-4">
                        {batch?.semester ?? "-"}
                      </Table.Td>
                      <Table.Td ta="center" className="text-[#265768]/70 py-4">
                        {section}
                      </Table.Td>
                      <Table.Td ta="center" className="py-2">
                        <div className="flex items-center justify-center cursor-pointer" onClick={() => navigate("/timetabledown")}>
                          <PreviewIcon />
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </DataEntryTable>
            )}
        </div>
      )}
    </div>
  );
}
