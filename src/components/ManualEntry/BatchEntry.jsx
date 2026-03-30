"use client";

import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import nodata from "../../assets/images/nodataa.png";
import { useNavigate } from "react-router-dom";
import {
  useGetBatchesQuery,
  useAddBatchMutation,
  useDeleteBatchMutation,
  useUpdateBatchMutation,
} from "../../redux/api/endpoints/batchesApi";
import { useGetSubjectsQuery } from "../../redux/api/endpoints/subjectsApi";
import BackButton from "../../components/common/BackButton";
import Swal from "sweetalert2";
import BatchTable from "./BatchTable";
import MultiSelect from "./MultiSelect";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const BatchEntry = () => {
  const [editingId, setEditingId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupItems, setPopupItems] = useState([]);

  const [form, setForm] = useState({
    course: "",
    department: "",
    name: "",
    strength: "",
    semester: "",
    subjects: [],
  });

  const [error, setError] = useState("");

  // ✅ Redux Hooks
  const { data: batchesData, isLoading: isFetchingBatches } = useGetBatchesQuery();
  const { data: subjectsData } = useGetSubjectsQuery();

  const [addBatch, { isLoading: isAdding }] = useAddBatchMutation();
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();
  const [deleteBatch, { isLoading: isDeleting }] = useDeleteBatchMutation();

  const batches = batchesData?.data || [];
  const subjectsList = subjectsData?.data || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSubject = (subject) => {
    setForm((prev) => {
      const exists = prev.subjects.find((s) => s._id === subject._id);
      if (exists) {
        return { ...prev, subjects: prev.subjects.filter((s) => s._id !== subject._id) };
      } else {
        return { ...prev, subjects: [...prev.subjects, subject] };
      }
    });
  };

  const removeSubject = (subjectId) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s._id !== subjectId),
    }));
  };

  const saveBatch = async () => {
    if (!form.course || !form.department || !form.name || !form.strength || !form.semester) {
      setError("Please fill all required fields");
      return;
    }
    if (form.subjects.length === 0) {
      setError("Please select at least one subject");
      return;
    }

    try {
      setError("");
      const code = `${form.department}_${Number(form.semester)}_${form.name}_2025`;
      const payload = {
        name: form.name,
        course: form.course,
        code,
        semester: Number(form.semester),
        department: form.department,
        strength: Number(form.strength),
        subjects: form.subjects.map((s) => s._id),
      };

      if (editingId) {
        await updateBatch({ id: editingId, data: payload }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Batch updated successfully.",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await addBatch(payload).unwrap();
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Batch added successfully.",
          timer: 1500,
          showConfirmButton: false
        });
      }

      resetForm();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.data?.message || err.message || "Failed to save batch"
      });
    }
  };

  const handleEdit = (batch) => {
    const subjectsRaw = batch.raw?.subjects || batch.subjects || [];
    const subjectsFromBatch = subjectsRaw.map((s) => {
      const subObj = typeof s.subject === "object" ? s.subject : (typeof s === "object" ? s : null);
      if (subObj) return subObj;
      const subId = typeof s === "string" ? s : (s.subject || s._id);
      return subjectsList.find(item => item._id === subId);
    }).filter(Boolean);
    setForm({
      course: batch.course || batch.degree || "",
      department: batch.department || "",
      name: batch.name || batch.section || batch.raw?.name || "",
      strength: (batch.strength || batch.capacity || batch.raw?.strength)?.toString?.() || "",
      semester: batch.semester?.toString?.() || "",
      subjects: subjectsFromBatch,
    });
    setEditingId(batch._id);
    setError("");
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      text: name ? `Delete batch "${name}"?` : "Are you sure you want to delete this batch?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      setError("");
      await deleteBatch(id).unwrap();
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Failed to delete batch: " + (err.data?.message || err.message),
        confirmButtonColor: "#4BACCE",
      });
    }
  };

  const resetForm = () => {
    setForm({
      course: "",
      department: "",
      name: "",
      strength: "",
      semester: "",
      subjects: [],
      faculties: [],
    });
    setEditingId(null);
    setError("");
  };

  const openListPopup = (title, items) => {
    setPopupTitle(title);
    setPopupItems(items);
    setShowPopup(true);
  };

  const loading = isAdding || isUpdating || isDeleting;

  return (
    <div className="h-screen overflow-hidden bg-[#F3F6FB]">
      <div className="w-full h-full pb-0">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full h-full flex flex-col"
          style={{ borderColor: "#e8e8e8" }}
        >
          <div className="px-6 pt-4 pb-4 flex flex-col h-full">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
              <div
                className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
                style={{ textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)" }}
              >
                Ezey
              </div>
              <BackButton className="hover:bg-gray-100 transition" />
            </div>

            {/* TITLE ROW */}
            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <path
                    d="M16 16H6C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14V2C4 1.46957 4.21071 0.960859 4.58579 0.585786C4.96086 0.210714 5.46957 0 6 0H7V5L9 3.5L11 5V0H16C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V14C18 14.5304 17.7893 15.0391 17.4142 15.4142C17.0391 15.7893 16.5304 16 16 16ZM14 18V20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V4H2V18H14Z"
                    fill="#265768"
                  />
                </svg>
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                  Quick add batch
                </h2>
              </div>
            </div>

            <div
              className="h-[3px] bg-[#0b84d6] rounded w-[calc(100%+48px)] -mx-6"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            {/* FORM */}
            <div className="mt-6 text-[#265768]">
              <div className="grid grid-cols-[repeat(4,1fr)_200px] gap-x-8 gap-y-6 mr-8 items-end">
                <Input label="Degree" name="course" value={form.course} onChange={handleChange} placeholder="e.g. B.Tech" />
                <Input label="Department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. CSE" />
                <Input label="Section" name="name" value={form.name} onChange={handleChange} placeholder="e.g. A" />
                <Input label="Strength" name="strength" type="number" value={form.strength} onChange={handleChange} placeholder="e.g. 60" />

                {/* Button anchored to Row 1, Col 5 */}
                <div className="col-start-5 row-start-1 flex items-center justify-center gap-4 h-[40px] mb-[2px]">
                  <div className="flex flex-col items-center gap-1">
                    <Button variant="addItem" onClick={saveBatch} disabled={loading} className="w-fit">
                      {editingId ? "+ Update batch" : "+ Add batch"}
                    </Button>
                    {editingId && (
                      <button onClick={resetForm} className="text-[12px] text-[#F04438] hover:underline font-medium">Cancel Edit</button>
                    )}
                  </div>
                </div>

                <Input label="Semester" name="semester" value={form.semester} onChange={handleChange} placeholder="e.g. 1" />

                {/* ROW 2 */}
                <div className="flex flex-col gap-2">
                  <MultiSelect
                    label="Assigned subjects"
                    placeholder="Select subjects"
                    options={subjectsList}
                    selectedItems={form.subjects}
                    onToggle={toggleSubject}
                    onRemove={removeSubject}
                    displayKey="name"
                    secondaryKey="code"
                    additionalKeys={["department", "semester", "section", "type", "course"]}
                  />
                </div>

                <div />

                {/* Empty gaps for column 5 */}
                <div />
                <div />
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-6" />

            {error && (
              <div className="mt-3 text-center text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            {/* TABLE */}
            {isFetchingBatches ? (
              <div className="mt-6 text-center text-[#aeadad]">Loading batches...</div>
            ) : batches.length === 0 ? (
              <div
                className="mt-4 border rounded-lg flex flex-col justify-center items-center gap-1 px-4 flex-1"
                style={{ borderColor: "#DFDFDF" }}
              >
                <img src={nodata} alt="No Data" className="w-full max-w-[380px] h-auto object-contain mt-2 mb-[-10px]" />
                <div
                  className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  No Data !
                </div>
              </div>
            ) : (
              <div className="mt-6 pb-6 flex-1 flex flex-col min-h-0 overflow-hidden">
                <BatchTable
                  height="100%"
                  batches={batches}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onOpenPopup={openListPopup}
                  onUpdate={async (updatedItem) => {
                    try {
                      const code = `${updatedItem.department}_${Number(updatedItem.semester)}_${updatedItem.name}_2025`;
                      const payload = {
                        name: updatedItem.name,
                        course: updatedItem.course,
                        code,
                        semester: Number(updatedItem.semester),
                        department: updatedItem.department,
                        strength: Number(updatedItem.strength),
                        subjects: updatedItem.subjects.map((s) => s._id || s),
                      };
                      await updateBatch({ id: updatedItem._id, data: payload }).unwrap();
                      Swal.fire({
                        icon: "success",
                        text: "Batch updated successfully",
                        timer: 1500,
                        showConfirmButton: false,
                      });
                    } catch (err) {
                      Swal.fire({
                        icon: "error",
                        text: "Failed to update batch: " + (err.data?.message || err.message),
                      });
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center shrink-0"
          style={{ background: "rgba(0,0,0,0.35)" }}
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-[10px] shadow-lg border"
            style={{
              width: "420px",
              maxHeight: "420px",
              overflow: "hidden",
              borderColor: "#e8e8e8",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <div className="text-[16px] font-semibold text-[#265768] font-['Mulish']">
                {popupTitle}
              </div>
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
                    <li
                      key={`${x?._id || "item"}-${i}`}
                      className="text-[13px] text-[#265768] border rounded px-3 py-2 font-['Mulish']"
                      style={{ borderColor: "#DFDFDF" }}
                    >
                      {popupTitle === "Assigned Subjects"
                        ? `${x?.name || x?.subject?.name || "-"}${x?.code || x?.subject?.code ? ` (${x.code || x.subject.code})` : ""}${x?.faculty ? ` - ${x.faculty}` : ""}`
                        : "-"}
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

export default BatchEntry;
