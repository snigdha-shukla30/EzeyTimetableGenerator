import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ added
import '../../styles/custom-scrollbar.css';
import noDataImage from '../../assets/images/nodataa.png';
import {
  getClassrooms,
  addClassroom,
  deleteClassroom,
  updateClassroom,
  bulkUploadClassrooms,
} from "../../services/api";
import BackButton from "../../components/common/BackButton";
import Swal from "sweetalert2";
import ManualEntryTable from "../../components/ui/manualEntryTable";
import ClassroomData from "../../components/ManualEntry/ClassroomData";
import UploadButton from "../../components/ManualEntry/UploadButton";
import FormInput from "../../components/ManualEntry/FormInput";
import FormSelect from "../../components/ManualEntry/FormSelect";
import { Button } from "../../components/ui/Button";






// Main ManualEntryClassroom Component
export const ManualEntryClassroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [classroomNumber, setClassroomNumber] = useState("");
  const [classroomType, setClassroomType] = useState("lecture");
  const [classroomCapacity, setClassroomCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await getClassrooms();
      if (response.success && response.data) {
        setClassrooms(response.data);
        if (response.data.length > 0) setShowTable(true);
      }
    } catch (err) {
      setError("Failed to load classrooms: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClassroom = async () => {
    // if (!classroomNumber || !classroomType || !classroomCapacity) {
    //   alert("Please fill in all fields");
    //   return;
    // }
    if (!classroomNumber || !classroomType || !classroomCapacity) {
      Swal.fire({
        icon: "warning",
        text: "Please fill in all fields",
        confirmButtonColor: "#4BACCE",
      });
      return;
    }


    try {
      setLoading(true);
      const newClassroom = {
        name: classroomNumber,
        type: classroomType,
        capacity: parseInt(classroomCapacity, 10),
      };

      const response = await addClassroom(newClassroom);

      if (response.success) {
        await fetchClassrooms();
        setClassroomNumber("");
        setClassroomType("lecture");
        setClassroomCapacity("");
        setShowTable(true);
      }
    } catch (err) {
      alert("Failed to add classroom: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClassroom = async (id) => {
    const result = await Swal.fire({
      text: "Are you sure you want to delete this classroom?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const response = await deleteClassroom(id);

      if (response.success) {
        await fetchClassrooms();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Failed to delete classroom: " + err.message,
        confirmButtonColor: "#4BACCE",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleEditClassroom = async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await updateClassroom(id, {
        name: updatedData.name,
        type: updatedData.type,
        capacity: parseInt(updatedData.capacity, 10),
      });

      if (response.success) {
        await fetchClassrooms();
      }
    } catch (err) {
      alert("Failed to update classroom: " + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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
      const response = await bulkUploadClassrooms(file);

      // if (response.success) {
      //   await fetchClassrooms();
      //   setShowTable(true);
      //   alert(`Successfully uploaded ${response.data?.count || "classrooms"}!`);
      // }
      if (response?.success || Array.isArray(response)) {
        await fetchClassrooms();
        setShowTable(true);
      }

    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Failed to upload file: " + err.message,
        confirmButtonColor: "#4BACCE",
      });

      console.error(err);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F3F6FB]">
      <div className="w-full h-full pb-0">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full h-full"
          style={{
            borderColor: "#e8e8e8",
          }}
        >
          <div className="px-6 pt-4 pb-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div
                className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
                style={{
                  textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
                }}
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

            <div className="flex justify-between items-end mb-3">
              {/* Title */}
              <div className="flex items-center gap-2">
                <img
                  className="w-[24px] h-[24px]"
                  alt="Classroom icon"
                  src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/arcticons-classroom.svg"
                />
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                  Quick add classroom
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

            <div
              className="h-[3px] bg-[#0b84d6] rounded w-[calc(100%+48px)] -mx-6"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            {/* FORM */}
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-4 gap-y-6 mr-0 lg:mr-8">
                <div className="lg:col-span-3">
                  <FormInput
                    label="Enter classroom number"
                    type="text"
                    value={classroomNumber}
                    onChange={(e) => setClassroomNumber(e.target.value)}
                    placeholder="e.g. B-210"
                  />
                </div>

                <div className="lg:col-span-3">
                  <FormSelect
                    label="Classroom type"
                    value={classroomType}
                    onChange={(e) => setClassroomType(e.target.value)}
                  >
                    <option value="lecture">Lecture Hall</option>
                    <option value="lab">Computer Lab</option>
                    <option value="seminar">Seminar Room</option>
                  </FormSelect>
                </div>

                <div className="lg:col-span-3">
                  <FormInput
                    label="Classroom capacity"
                    type="number"
                    value={classroomCapacity}
                    onChange={(e) => setClassroomCapacity(e.target.value)}
                    placeholder="e.g. 45"
                  />
                </div>

                {/* Add Button */}
                <div className="lg:col-span-3 flex items-end justify-start lg:justify-end">
                  <Button variant="addItem" onClick={handleAddClassroom} disabled={loading}>
                    {loading ? "Adding..." : "+ Add classroom"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

            {(error || uploading) && (
              <div
                className={`mt-3 text-center  text-sm font-medium ${error ? "text-red-500" : "text-blue-500"
                  }`}
              >
                {uploading ? "Uploading file..." : error}
              </div>
            )}

            {/* Table / No data */}
            {showTable ? (
              <ClassroomData
                classrooms={classrooms}
                onEdit={handleEditClassroom}
                onDelete={handleDeleteClassroom}
                searchQuery=""
              />
            ) : (
              <div
                className="mt-4 border rounded-lg flex flex-col justify-center items-center gap-1 px-4"
                style={{ height: "450px", borderColor: "#DFDFDF" }}
              >
                <img
                  src={noDataImage}
                  alt="No Data"
                  className="w-full max-w-[380px] h-auto object-contain mt-2 mb-[-10px]"
                />
                <div
                  className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  No Data !
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div >
  );
};

export default ManualEntryClassroom;






















