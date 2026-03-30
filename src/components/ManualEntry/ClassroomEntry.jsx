"use client";

import React, { useRef, useState, useEffect } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import noDataImage from "../../assets/images/nodataa.png";
import { useNavigate } from "react-router-dom";
import {
  useGetClassroomsQuery,
  useAddClassroomMutation,
  useDeleteClassroomMutation,
  useUpdateClassroomMutation,
  useBulkUploadClassroomsMutation,
} from "../../redux/api/endpoints/classroomsApi";
import BackButton from "../../components/common/BackButton";
import Swal from "sweetalert2";
import ClassroomTable from "./ClassroomTable";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { CustomSelect } from "../../components/ui/CustomSelect";

const ClassroomEntry = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "lecture",
    capacity: "",
  });

  // ✅ Redux Hooks
  const { data: classroomsData, isLoading: isFetching } = useGetClassroomsQuery();
  const [addClassroom, { isLoading: isAdding }] = useAddClassroomMutation();
  const [updateClassroom, { isLoading: isUpdating }] = useUpdateClassroomMutation();
  const [deleteClassroom, { isLoading: isDeleting }] = useDeleteClassroomMutation();
  const [bulkUpload, { isLoading: isUploading }] = useBulkUploadClassroomsMutation();

  const classrooms = classroomsData?.data || [];

  const triggerFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
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
      e.target.value = "";
      return;
    }

    try {
      setError("");
      await bulkUpload(file).unwrap();
      Swal.fire({
        icon: "success",
        text: "Classrooms uploaded successfully",
        confirmButtonColor: "#4BACCE",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Failed to upload file: " + (err.data?.message || err.message || "Unknown error"),
        confirmButtonColor: "#4BACCE",
      });
    } finally {
      e.target.value = "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveClassroom = async () => {
    if (!form.name || !form.capacity) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setError("");
      const payload = {
        name: form.name,
        type: form.type,
        capacity: Number(form.capacity),
      };

      if (editingId) {
        await updateClassroom({ id: editingId, data: payload }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Classroom updated successfully.",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await addClassroom(payload).unwrap();
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Classroom added successfully.",
          timer: 1500,
          showConfirmButton: false
        });
      }

      resetForm();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.data?.message || err.message || "Failed to save classroom"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      type: item.type || "lecture",
      capacity: item.capacity?.toString?.() || "",
    });
    setError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      type: "lecture",
      capacity: "",
    });
    setError("");
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      text: `Delete "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        await deleteClassroom(id).unwrap();
        Swal.fire({ icon: "success", text: "Classroom deleted successfully", confirmButtonColor: "#28a745" });
      } catch (err) {
        Swal.fire({ icon: "error", text: "Failed to delete classroom", confirmButtonColor: "#4BACCE" });
      }
    }
  };

  const loading = isAdding || isUpdating || isDeleting || isUploading;

  return (
    <div className="h-screen overflow-hidden bg-[#F3F6FB]">
      <div className="w-full h-full pb-0">
        <div className="bg-white rounded-[10px] shadow-sm border relative w-full h-full flex flex-col" style={{ borderColor: "#e8e8e8" }}>
          <div className="px-6 pt-4 pb-4 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]" style={{ textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)" }}>
                Ezey
              </div>
              <BackButton className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition" />
            </div>

            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2">
                <img className="w-[24px] h-[24px]" alt="Classroom icon" src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/arcticons-classroom.svg" />
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">Quick add classroom</h2>
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="hidden" />
                <Button variant="upload" onClick={triggerFile} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload File ( CSV / XLSX )"}
                </Button>
              </div>
            </div>

            <div className="h-[3px] bg-[#0b84d6] rounded w-[calc(100%+48px)] -mx-6" style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }} />

            <div className="mt-6 text-[#265768]">
              <div className="grid grid-cols-[repeat(4,1fr)_200px] gap-x-8 gap-y-6 mr-8 items-end">
                <Input label="Enter classroom number" name="name" value={form.name} onChange={handleChange} placeholder="e.g. B-210" variant="standard" />
                <CustomSelect
                  label="Type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  options={[
                    { label: "Lecture Hall", value: "lecture" },
                    { label: "Computer Lab", value: "lab" },
                    { label: "Seminar Room", value: "seminar" },
                  ]}
                />
                <Input label="Classroom capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="e.g. 45" variant="standard" />
                <div />
                <div className="col-start-5 row-start-1 flex items-center justify-center gap-4 h-[40px] mb-[2px]">
                  <div className="flex flex-col items-center gap-1">
                    <Button variant="addItem" onClick={saveClassroom} disabled={loading} className="w-fit whitespace-nowrap">
                      {editingId ? (loading ? "Updating..." : "+ Update classroom") : (loading ? "Adding..." : "+ Add classroom")}
                    </Button>
                    {editingId && (
                      <button onClick={resetForm} className="text-[12px] text-[#F04438] hover:underline bg-transparent border-none cursor-pointer font-medium whitespace-nowrap">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-6" />

            {(error || isUploading) && (
              <div className={`mt-3 text-center text-sm font-medium ${error ? "text-red-500" : "text-blue-500"}`}>
                {isUploading ? "Uploading file..." : error}
              </div>
            )}

            {/* TABLE */}
            {isFetching ? (
              <div className="mt-6 text-center text-[#aeadad]">Loading classrooms...</div>
            ) : classrooms.length === 0 ? (
              <div
                className="mt-4 border rounded-lg flex flex-col justify-center items-center gap-1 px-4 flex-1"
                style={{ borderColor: "#DFDFDF" }}
              >
                <img src={noDataImage} alt="No Data" className="w-full max-w-[380px] h-auto object-contain mt-2 mb-[-10px]" />
                <div
                  className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  No Data !
                </div>
              </div>
            ) : (
              <div className="mt-6 pb-6 flex-1 flex flex-col min-h-0 overflow-hidden">
                <ClassroomTable
                  height="100%"
                  classrooms={classrooms}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdate={async (updatedItem) => {
                    try {
                      const payload = {
                        name: updatedItem.name,
                        type: updatedItem.type,
                        capacity: Number(updatedItem.capacity),
                      };
                      await updateClassroom({ id: updatedItem._id, data: payload }).unwrap();
                      Swal.fire({
                        icon: "success",
                        text: "Classroom updated successfully",
                        timer: 1500,
                        showConfirmButton: false,
                      });
                    } catch (err) {
                      Swal.fire({
                        icon: "error",
                        text: "Failed to update classroom: " + (err.data?.message || err.message),
                      });
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomEntry;
