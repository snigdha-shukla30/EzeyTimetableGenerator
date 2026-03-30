"use client";

import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import nodata from "../../assets/images/nodataa.png";
import { useNavigate } from "react-router-dom";
import {
  useGetSubjectsQuery,
  useAddSubjectMutation,
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
  useBulkUploadSubjectsMutation,
} from "../../redux/api/endpoints/subjectsApi";
import BackButton from "../../components/common/BackButton";
import Swal from "sweetalert2";
import SubjectTable from "./SubjectTable";
import { Button } from "../ui/Button";
import { Input } from "../../components/ui/Input";
import { CustomSelect } from "../../components/ui/CustomSelect";

const SubjectEntry = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    code: "",
    department: "",
    section: "",
    semester: "",
    hrsWeek: "",
    type: "theory",
    course: "",
    isElective: false,
  });

  const { data, isLoading: isFetching } = useGetSubjectsQuery();
  const [addSubject, { isLoading: isAdding }] = useAddSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();
  const [bulkUpload, { isLoading: isUploading }] = useBulkUploadSubjectsMutation();

  const subjects = (data?.data || []).map((s) => ({
    _id: s._id,
    name: s.name,
    code: s.code,
    department: s.department,
    semester: s.semester || "--",
    section: s.section || "--",
    type: s.type,
    hrsWeek: s.hoursPerWeek,
    course: s.course || "",
    isElective: s.isElective || false,
  }));

  const triggerFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError("");
      await bulkUpload(file).unwrap();
      Swal.fire({
        icon: "success",
        text: "Subjects uploaded successfully",
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveSubject = async () => {
    if (!form.name || !form.code) {
      setError("Please enter Subject name and Subject code");
      return;
    }

    try {
      setError("");
      const payload = {
        name: form.name,
        code: form.code,
        department: form.department,
        course: form.course,
        section: form.section,
        semester: Number(form.semester),
        type: form.type,
        isElective: form.isElective,
        hoursPerWeek: Number(form.hrsWeek || 0),
      };

      if (editingId) {
        await updateSubject({ id: editingId, data: payload }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Subject updated successfully.",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await addSubject(payload).unwrap();
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Subject added successfully.",
          timer: 1500,
          showConfirmButton: false
        });
      }

      resetForm();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.data?.message || err.message || "Failed to save subject"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      code: item.code || "",
      department: item.department || "",
      section: item.section === "--" ? "" : item.section || "",
      semester: item.semester === "--" ? "" : item.semester || "",
      hrsWeek: item.hrsWeek?.toString() || "",
      type: item.type || "theory",
      course: item.course || "",
      isElective: !!item.isElective,
    });
    setError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      code: "",
      department: "",
      section: "",
      semester: "",
      hrsWeek: "",
      type: "theory",
      course: "",
      isElective: false,
    });
    setError("");
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      text: name ? `Delete subject "${name}"?` : "Are you sure you want to delete this subject?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSubject(id).unwrap();
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Failed to delete subject: " + (err.data?.message || err.message),
      });
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F3F6FB]">
      <div className="w-full h-full pb-0">
        <div className="bg-white rounded-[10px] shadow-sm border relative w-full h-full flex flex-col" style={{ borderColor: "#e8e8e8" }}>
          <div className="px-6 pt-4 pb-4 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]" style={{ textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)" }}>
                Ezey
              </div>
              <BackButton className="hover:bg-gray-100 transition" />
            </div>

            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" fill="#265768" />
                </svg>
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">Quick add subject</h2>
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
              <div className="grid grid-cols-5 gap-x-8 gap-y-6 mr-8 items-end">
                <Input label="Subject Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. DAA" />
                <Input label="Subject Code" name="code" value={form.code} onChange={handleChange} placeholder="e.g. CS201" />
                <Input label="Department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. CSE" />
                <Input label="Course" name="course" value={form.course} onChange={handleChange} placeholder="e.g. B.Tech" />
                <Input label="Semester" name="semester" value={form.semester} onChange={handleChange} placeholder="e.g. 4" />

                <Input label="Section" name="section" value={form.section} onChange={handleChange} placeholder="e.g. A" />
                <Input label="Hrs/Week" name="hrsWeek" type="number" value={form.hrsWeek} onChange={handleChange} placeholder="e.g. 4" />
                <CustomSelect
                  label="Type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  options={[
                    { label: "Theory", value: "theory" },
                    { label: "Lab / Practical", value: "lab" },
                  ]}
                />
                <CustomSelect
                  label="Is Elective?"
                  value={form.isElective ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, isElective: e.target.value === "true" })}
                  options={[
                    { label: "No", value: "false" },
                    { label: "Yes", value: "true" },
                  ]}
                />

                <div className="col-start-5 row-start-2 flex items-center justify-center gap-4 h-[40px] mb-[2px]">
                  <div className="flex flex-col items-center gap-1">
                    <Button variant="addItem" onClick={saveSubject} disabled={isAdding || isUpdating} className="w-fit">
                      {editingId ? "+ Update subject" : "+ Add subject"}
                    </Button>
                    {editingId && (
                      <button onClick={resetForm} className="text-[12px] text-[#F04438] hover:underline font-medium">Cancel Edit</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-6" />

            {error && <div className="mt-3 text-center text-red-500 text-sm font-medium">{error}</div>}

            {isFetching ? (
              <div className="mt-6 text-center text-[#aeadad]">Loading subjects...</div>
            ) : subjects.length === 0 ? (
              <div className="mt-4 border rounded-lg flex flex-col justify-center items-center gap-1 px-4 h-[calc(100vh-380px)]" style={{ borderColor: "#DFDFDF" }}>
                <img src={nodata} alt="No Data" className="w-full max-w-[380px] h-auto object-contain mt-2 mb-[-10px]" />
                <div className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]">No Data !</div>
              </div>
            ) : (
              <div className="mt-6 pb-6 flex-1 flex flex-col min-h-0 overflow-hidden">
                <SubjectTable
                  height="100%"
                  subjects={subjects}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdate={async (updatedItem) => {
                    try {
                      const payload = {
                        name: updatedItem.name,
                        code: updatedItem.code,
                        department: updatedItem.department,
                        course: updatedItem.course,
                        section: updatedItem.section,
                        semester: Number(updatedItem.semester),
                        type: updatedItem.type,
                        isElective: updatedItem.isElective,
                        hoursPerWeek: Number(updatedItem.hrsWeek || updatedItem.hoursPerWeek || 0),
                      };
                      await updateSubject({ id: updatedItem._id, data: payload }).unwrap();
                      Swal.fire({ icon: "success", text: "Subject updated successfully", timer: 1500, showConfirmButton: false });
                    } catch (err) {
                      Swal.fire({ icon: "error", text: "Failed to update subject: " + (err.data?.message || err.message) });
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

export default SubjectEntry;