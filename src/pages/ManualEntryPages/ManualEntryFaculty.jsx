import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import nodata from "../../assets/images/nodataa.png";
import {
  getFaculties,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  bulkUploadFaculties,
} from "../../services/api";
import BackButton from "../../components/common/BackButton";
import Swal from "sweetalert2";
import ManualEntryTable from "../../components/ui/manualEntryTable";
import FacultyData from "../../components/ManualEntry/FacultyData";
import UploadButton from "../../components/ManualEntry/UploadButton";
import FormInput from "../../components/ManualEntry/FormInput";
import { Button } from "../../components/ui/Button";




export const ManualEntryFaculty = () => {
  const [showTable, setShowTable] = useState(false);
  const [facultyName, setFacultyName] = useState("");
  const [email, setEmail] = useState("");
  const [maxLoad, setMaxLoad] = useState("");
  const [leaves, setLeaves] = useState("");
  const [assignedSubjects, setAssignedSubjects] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFaculties();

      if (response?.success && response?.data) {
        setFacultyList(Array.isArray(response.data) ? response.data : []);
        if (response.data.length > 0) setShowTable(true);
      } else if (Array.isArray(response)) {
        setFacultyList(response);
        if (response.length > 0) setShowTable(true);
      } else if (response?.faculties) {
        setFacultyList(response.faculties);
        if (response.faculties.length > 0) setShowTable(true);
      } else {
        setFacultyList([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load faculties");
      setFacultyList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.match(/\.(csv|xlsx|xls)$/i)
    ) {
      Swal.fire({
  icon: "warning",
  text: "Please upload a valid CSV or XLSX file",
  confirmButtonColor: "#4BACCE",
});

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      const response = await bulkUploadFaculties(file);

      if (response.success) {
        await loadFaculties();
        setShowTable(true);
      }
    } catch (err) {
      Swal.fire({
  icon: "error",
  text: "Failed to upload file: " + (err.message || "Unknown error"),
  confirmButtonColor: "#4BACCE",
});

    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleAddFaculty = async () => {
    if (!facultyName || !email || !maxLoad || !leaves) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const facultyData = {
        name: facultyName,
        email: email,
        maxLoad: parseInt(maxLoad),
        leavesPerMonth: parseInt(leaves),
        subjects: assignedSubjects
          ? assignedSubjects.split(",").map((s) => s.trim())
          : [],
      };

      if (editingId) {
        const response = await updateFaculty(editingId, facultyData);
        if (response.success || response._id) {
          await loadFaculties();
          resetForm();
          // alert("Faculty updated successfully!");
          Swal.fire({
  title: "Success!",
  text: "Faculty added successfully",
  icon: "success",
  confirmButtonColor: "#4BACCE",
});
        }
      } else {
        const response = await addFaculty(facultyData);
        if (response.success || response._id) {
          await loadFaculties();
          resetForm();
          setShowTable(true);
          // alert("Faculty added successfully!");
        }
      }
    } catch (err) {
      const msg = err.message || "Unknown error occurred";
      setError(msg);
      // alert("Failed to save faculty: " + msg);
      Swal.fire({
  icon: "error",
  text: "Failed to save faculty: " + msg,
  confirmButtonColor: "#4BACCE",
});

    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faculty) => {
    setFacultyName(faculty.name);
    setEmail(faculty.email);
    setMaxLoad(faculty.maxLoad?.toString() || "");
    setLeaves(faculty.leavesPerMonth?.toString() || "");
    setAssignedSubjects(faculty.subjects?.join(", ") || "");
    setEditingId(faculty._id);
  };

  const handleDelete = async (facultyId) => {
  const result = await Swal.fire({
    text: "Are you sure you want to delete this faculty?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F04438",
    cancelButtonColor: "#4BACCE",
    confirmButtonText: "Yes",
  });

  if (!result.isConfirmed) return;

  try {
    setLoading(true);
    setError("");
    const response = await deleteFaculty(facultyId);
    if (response.success) {
      await loadFaculties();
    }
  } catch (err) {
    const msg = err.message || "Unknown error occurred";

    Swal.fire({
      icon: "error",
      text: "Failed to delete faculty: " + msg,
      confirmButtonColor: "#4BACCE",
    });

    setError(msg);
  } finally {
    setLoading(false);
  }
};


  const resetForm = () => {
    setFacultyName("");
    setEmail("");
    setMaxLoad("");
    setLeaves("");
    setAssignedSubjects("");
    setEditingId(null);
    setError("");
  };


  return (
    <div className="h-screen bg-[#F3F6FB] overflow-hidden">
      <div className="w-full h-full">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full h-full"
          style={{
            borderColor: "#e8e8e8",
          }}
        >
          <div className="px-6 pt-4 pb-4">
            {/* HEADER (Row 1: Logo + Close) */}
            <div className="flex justify-between items-start mb-6">
              <div
                className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
                style={{ textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)" }}
              >
                Ezey
              </div>
              <button
                type="button"
                onClick={() => navigate("/form")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                aria-label="Close"
              >
                {/* <X size={28} color="#265768" strokeWidth={3} /> */}
                <BackButton />
              </button>
            </div>

            {/* TITLE ROW (Row 2: Title + Upload) */}
            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-[20px] h-[20px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#265768"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                  Quick add Faculty
                </h2>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <UploadButton onClick={handleUploadClick} uploading={uploading} />
              </div>
            </div>



            {/* blue line */}
            <div
              className="w-full h-[3px] bg-[#0b84d6] rounded"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            {/* form */}
            <div className="mt-6">
              <div className="grid grid-cols-12 gap-x-2 gap-y-6 mr-8">
                <div className="col-span-3">
                  <FormInput
                    label="Faculty Name"
                    type="text"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    placeholder="e.g. Mrs Pooja Shukla"
                    disabled={loading}
                  />
                </div>

                <div className="col-span-3">
                  <FormInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. poojasunshore@gmail.com"
                    disabled={loading}
                  />
                </div>

                <div className="col-span-3">
                  <FormInput
                    label="Max load per day"
                    type="number"
                    value={maxLoad}
                    onChange={(e) => setMaxLoad(e.target.value)}
                    placeholder="e.g. 5"
                    disabled={loading}
                  />
                </div>

                <div className="col-span-3">
                  <div className="flex items-end justify-around gap-2">
                    <div className="flex-1">
                      <FormInput
                        label="Leaves per month"
                        type="number"
                        value={leaves}
                        onChange={(e) => setLeaves(e.target.value)}
                        placeholder="e.g 5"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-end pb-0">
                      <Button
                        variant="addItem"
                        onClick={handleAddFaculty}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : editingId ? "+ Update faculty" : "+ Add faculty"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="col-span-3">
                  <FormInput
                    label="Assigned subjects"
                    type="text"
                    value={assignedSubjects}
                    onChange={(e) => setAssignedSubjects(e.target.value)}
                    placeholder="e.g. DAA, OS (comma separated)"
                    disabled={loading}
                  />
                </div>

                {editingId && (
                  <div className="col-span-3 flex items-end justify-end">
                    <button
                      onClick={resetForm}
                      className="text-xs text-[#F04438] hover:underline"
                      style={{ fontFamily: "'Mulish', sans-serif" }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

            {error && (
              <div className="mt-3 text-center text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            {showTable && facultyList.length > 0 ? (
              <FacultyData
                searchQuery=""
                facultyList={facultyList}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div
                className="mt-4 border rounded-lg flex flex-col justify-center items-center gap-1 px-4"
                style={{ height: "380px", borderColor: "#DFDFDF" }}
              >
                {loading ? (
                  <div
                    className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Loading...
                  </div>
                ) : (
                  <>
                    <img
                      src={nodata}
                      alt="No Data"
                      className="w-full max-w-[380px] h-auto object-contain mt-2 mb-[-10px]"
                    />
                    <div
                      className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      No Data !
                    </div>
                  </>
                )}
              </div>

            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManualEntryFaculty;









