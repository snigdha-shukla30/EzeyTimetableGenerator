"use client";

import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import nodata from "../../assets/images/nodataa.png";
import { useNavigate } from "react-router-dom";
import {
  useGetFacultiesQuery,
  useAddFacultyMutation,
  useDeleteFacultyMutation,
  useUpdateFacultyMutation,
  useBulkUploadFacultiesMutation,
} from "../../redux/api/endpoints/facultyApi";
import { useGetSubjectsQuery } from "../../redux/api/endpoints/subjectsApi";
import BackButton from "../../components/common/BackButton";
import Swal from "sweetalert2";
import FacultyTable from "./FacultyTable";
import MultiSelect from "./MultiSelect";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const FacultyEntry = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupItems, setPopupItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    maxLoad: "",
    leavesPerMonth: "",
    assignedSubjects: [],
  });

  // ✅ Redux Hooks
  const { data: facultyData, isLoading: isFetching } = useGetFacultiesQuery();
  const { data: subjectsData } = useGetSubjectsQuery();
  const [addFaculty, { isLoading: isAdding }] = useAddFacultyMutation();
  const [updateFaculty, { isLoading: isUpdating }] = useUpdateFacultyMutation();
  const [deleteFaculty] = useDeleteFacultyMutation();
  const [bulkUpload, { isLoading: isUploading }] = useBulkUploadFacultiesMutation();

  const facultyList = facultyData?.data || [];
  const subjectsList = subjectsData?.data || [];

  const openListPopup = (title, items) => {
    setPopupTitle(title);
    setPopupItems(items);
    setShowPopup(true);
  };

  const triggerFile = () => fileInputRef.current?.click();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      Swal.fire({ icon: "warning", text: "Please upload a valid CSV or XLSX file", confirmButtonColor: "#4BACCE" });
      e.target.value = "";
      return;
    }

    try {
      setError("");
      await bulkUpload(file).unwrap();
      Swal.fire({ icon: "success", text: "Faculty uploaded successfully", confirmButtonColor: "#4BACCE" });
    } catch (err) {
      Swal.fire({ icon: "error", text: "Failed to upload file: " + (err.data?.message || err.message || "Unknown error"), confirmButtonColor: "#4BACCE" });
    } finally {
      e.target.value = "";
    }
  };

  const toggleSubject = (subject) => {
    setForm((prev) => {
      const exists = prev.assignedSubjects.find((s) => s._id === subject._id);
      return {
        ...prev,
        assignedSubjects: exists
          ? prev.assignedSubjects.filter((s) => s._id !== subject._id)
          : [...prev.assignedSubjects, subject],
      };
    });
  };

  const removeSubject = (subjectId) => {
    setForm((prev) => ({
      ...prev,
      assignedSubjects: prev.assignedSubjects.filter((s) => s._id !== subjectId),
    }));
  };

  const saveFaculty = async () => {
    if (!form.name || !form.email || !form.maxLoad || !form.leavesPerMonth) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setError("");
      const payload = {
        name: form.name,
        email: form.email,
        maxLoad: parseInt(form.maxLoad, 10),
        leavesPerMonth: parseInt(form.leavesPerMonth, 10),
        subjects: form.assignedSubjects.map((s) => s._id),
      };

      if (editingId) {
        await updateFaculty({ id: editingId, data: payload }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Faculty updated successfully.",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await addFaculty(payload).unwrap();
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Faculty added successfully.",
          timer: 1500,
          showConfirmButton: false
        });
      }
      resetForm();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.data?.message || err.message || "Failed to save faculty"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      email: item.email || "",
      maxLoad: (item.maxLoad || item.max_load)?.toString() || "",
      leavesPerMonth: (item.leavesPerMonth || item.leaves_per_month)?.toString() || "",
      assignedSubjects: item.subjects || [],
    });
    setError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", email: "", maxLoad: "", leavesPerMonth: "", assignedSubjects: [] });
    setError("");
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      text: name ? `Delete faculty "${name}"?` : "Are you sure you want to delete this faculty?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      setError("");
      await deleteFaculty(id).unwrap();
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Failed to delete faculty: " + (err.data?.message || err.message),
      });
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F3F6FB]">
      <div className="w-full h-full pb-0">
        <div className="bg-white rounded-[10px] shadow-sm border relative w-full h-full flex flex-col" style={{ borderColor: "#e8e8e8" }}>
          <div className="px-6 pt-4 pb-4 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]" style={{ textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)" }}>Ezey</div>
              <BackButton className="hover:bg-gray-100 transition" />
            </div>

            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#265768" />
                </svg>
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">Quick add faculty</h2>
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
                <Input label="Faculty Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Pooja Shukla" />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. pooja@gmail.com" />
                <Input label="Max load per day" name="maxLoad" type="number" value={form.maxLoad} onChange={handleChange} placeholder="e.g. 5" />
                <Input label="Leaves per month" name="leavesPerMonth" type="number" value={form.leavesPerMonth} onChange={handleChange} placeholder="e.g. 2" />

                <div className="col-start-5 row-start-1 flex items-center justify-center gap-4 h-[40px] mb-[2px]">
                  <div className="flex flex-col items-center gap-1">
                    <Button variant="addItem" onClick={saveFaculty} disabled={isAdding || isUpdating} className="w-fit">
                      {editingId ? "+ Update faculty" : "+ Add faculty"}
                    </Button>
                    {editingId && (
                      <button onClick={resetForm} className="text-[12px] text-[#F04438] hover:underline font-medium">Cancel Edit</button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <MultiSelect label="Assigned subjects" placeholder="Select subjects" options={subjectsList} selectedItems={form.assignedSubjects} onToggle={toggleSubject} onRemove={removeSubject} displayKey="name" secondaryKey="code" />
                </div>
                <div className="col-span-3" />
                <div />
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-6" />

            {error && <div className="mt-3 text-center text-red-500 text-sm font-medium">{error}</div>}

            {isFetching ? (
              <div className="mt-6 text-center text-[#aeadad]">Loading faculties...</div>
            ) : facultyList.length === 0 ? (
              <div className="mt-4 border rounded-lg flex flex-col justify-center items-center gap-1 px-4 h-[calc(100vh-380px)]" style={{ borderColor: "#DFDFDF" }}>
                <img src={nodata} alt="No Data" className="w-full max-w-[380px] h-auto object-contain mt-2 mb-[-10px]" />
                <div className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]">No Data !</div>
              </div>
            ) : (
              <div className="mt-6 pb-6 flex-1 flex flex-col min-h-0 overflow-hidden">
                <FacultyTable
                  height="100%"
                  facultyList={facultyList}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onOpenPopup={openListPopup}
                  onUpdate={async (updatedItem) => {
                    try {
                      const payload = {
                        name: updatedItem.name,
                        email: updatedItem.email,
                        maxLoad: parseInt(updatedItem.maxLoad || updatedItem.max_load, 10),
                        leavesPerMonth: parseInt(updatedItem.leavesPerMonth || updatedItem.leaves_per_month, 10),
                        subjects: updatedItem.subjects.map((s) => s._id || s),
                      };
                      await updateFaculty({ id: updatedItem._id, data: payload }).unwrap();
                      Swal.fire({ icon: "success", text: "Faculty updated successfully", timer: 1500, showConfirmButton: false });
                    } catch (err) {
                      Swal.fire({ icon: "error", text: "Failed to update faculty: " + (err.data?.message || err.message) });
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center shrink-0" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setShowPopup(false)}>
          <div className="bg-white rounded-[10px] shadow-lg border" style={{ width: "420px", maxHeight: "420px", overflow: "hidden", borderColor: "#e8e8e8" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <div className="text-[16px] font-semibold text-[#265768] font-['Mulish']">{popupTitle}</div>
              <button onClick={() => setShowPopup(false)} className="bg-transparent border-none cursor-pointer">
                <X size={18} color="#265768" />
              </button>
            </div>
            <div className="p-4 custom-scroll" style={{ maxHeight: "340px", overflowY: "auto" }}>
              {popupItems.length === 0 ? (
                <div className="text-center text-gray-400 py-10 font-['Mulish']">No data</div>
              ) : (
                <ul className="space-y-2 list-none p-0 m-0">
                  {popupItems.map((x, i) => (
                    <li key={`${x?._id || "item"}-${i}`} className="text-[13px] text-[#265768] border rounded px-3 py-2 font-['Mulish']" style={{ borderColor: "#DFDFDF" }}>
                      {x.name || "-"} {x.code ? `(${x.code})` : ""} {x.email ? ` - ${x.email}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyEntry;
