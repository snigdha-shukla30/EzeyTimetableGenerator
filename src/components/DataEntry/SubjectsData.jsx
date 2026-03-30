import React, { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import {
  useGetSubjectsQuery,
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
} from "../../redux/api/endpoints/subjectsApi";
import Swal from "sweetalert2";
import DataEntryTable from "../ui/dataEntryTable";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export default function Subjects({ searchQuery = "" }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  const { data, isLoading, error } = useGetSubjectsQuery();
  const [deleteSubject] = useDeleteSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();

  const subjects = data?.data || [];

  const columns = [
    { key: "sno", label: "S.No", width: "70px" },
    { key: "name", label: "Subject Name" },
    { key: "code", label: "Subject Code" },
    { key: "department", label: "Department" },
    { key: "type", label: "Type" },
    { key: "hoursPerWeek", label: "Hrs/Week" },
  ];

  const query = (searchQuery || "").toLowerCase();
  const filtered = subjects.filter((sub) => {
    const text = [sub.name, sub.code, sub.department, sub.type, sub.hoursPerWeek].join(" ").toLowerCase();
    return text.includes(query);
  });

  const handleDelete = async (subjectId, name) => {
    const result = await Swal.fire({
      title: "Delete Subject?",
      text: name ? `Delete "${name}"? This action cannot be undone.` : "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSubject(subjectId).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Subject has been deleted.",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err.data?.message || "Failed to delete subject."
        });
      }
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject._id);
    setEditData({ ...subject });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        name: editData.name,
        code: editData.code,
        department: editData.department,
        type: editData.type,
        hoursPerWeek: Number(editData.hoursPerWeek),
      };
      await updateSubject({ id: editingId, data: payload }).unwrap();
      Swal.fire({ icon: "success", text: "Subject updated successfully", confirmButtonColor: "#28a745" });
      setEditingId(null);
      setEditData(null);
    } catch (err) {
      Swal.fire("Error", "Failed to update subject: " + (err.data?.message || err.message), "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <DataEntryTable columns={columns} height="100%">
      {isLoading && <tr><td colSpan={7} className="py-10 text-center text-[#8A96A8]">Loading subjects...</td></tr>}
      {!isLoading && error && <tr><td colSpan={7} className="py-10 text-center text-red-500 text-sm">{error?.data?.message || "Failed to load subjects"}</td></tr>}
      {!isLoading && !error && filtered.map((sub, idx) => (
        <tr key={sub._id} className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${idx === filtered.length - 1 ? "border-b-0" : ""}`}>
          <td className="py-5 text-center text-[#4C5968] font-medium" style={{ width: "70px" }}>{idx + 1}</td>
          <td className="py-5 text-center text-[#4C5968]">
            {editingId === sub._id ? (
              <Input variant="edit" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="min-w-[220px]" />
            ) : sub.name}
          </td>
          <td className="py-5 text-center">
            {editingId === sub._id ? (
              <Input variant="edit" value={editData.code} onChange={(e) => setEditData({ ...editData, code: e.target.value })} className="w-[130px]" />
            ) : <span className="text-[#1A8FE3] text-[13px] font-medium">{sub.code}</span>}
          </td>
          <td className="py-5 text-center text-[#8A96A8]">
            {editingId === sub._id ? (
              <Input variant="edit" value={editData.department} onChange={(e) => setEditData({ ...editData, department: e.target.value })} className="w-[160px]" />
            ) : sub.department}
          </td>
          <td className="py-5 text-center text-[#8A96A8]">
            {editingId === sub._id ? (
              <Input variant="edit" value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })} className="w-[140px]" />
            ) : sub.type}
          </td>
          <td className="py-5 text-center text-[#8A96A8]">
            {editingId === sub._id ? (
              <Input variant="edit" type="number" value={editData.hoursPerWeek} onChange={(e) => setEditData({ ...editData, hoursPerWeek: e.target.value })} className="w-[110px]" />
            ) : sub.hoursPerWeek}
          </td>
          <td className="py-5">
            {editingId === sub._id ? (
              <div className="flex justify-center gap-2">
                <Button variant="ghostIcon" onClick={handleUpdate} className="text-[#1A8FE3]"><Check size={18} /></Button>
                <Button variant="ghostIcon" onClick={handleCancelEdit} className="text-[#F04438]"><X size={18} /></Button>
              </div>
            ) : (
              <div className="flex justify-center gap-3">
                <Button variant="ghostIcon" onClick={() => handleEdit(sub)}><Edit2 size={15} strokeWidth={1.5} /></Button>
                <Button variant="ghostIcon" onClick={() => handleDelete(sub._id)}><Trash2 size={15} strokeWidth={1.5} /></Button>
              </div>
            )}
          </td>
        </tr>
      ))}
      </DataEntryTable>
    </div>
  );
}
