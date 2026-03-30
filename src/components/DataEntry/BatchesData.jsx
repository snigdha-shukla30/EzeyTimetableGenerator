import React, { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { 
  useGetBatchesQuery, 
  useUpdateBatchMutation, 
  useDeleteBatchMutation 
} from "../../redux/api/endpoints/batchesApi";
import Swal from "sweetalert2";
import DataEntryTable from "../ui/dataEntryTable";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export default function Batches({ searchQuery, refreshTrigger }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupItems, setPopupItems] = useState([]);

  const { data: batchesData, isLoading, error } = useGetBatchesQuery();
  const [updateBatch] = useUpdateBatchMutation();
  const [deleteBatch] = useDeleteBatchMutation();

  const batches = batchesData?.data || [];

  const columns = [
    { key: "sno", label: "S.No", width: "70px" },
    { key: "degree", label: "Degree / Course" },
    { key: "batchCode", label: "Batch code" },
    { key: "department", label: "Department" },
    { key: "capacity", label: "Capacity" },
    { key: "semester", label: "Semester" },
    { key: "section", label: "Section" },
    { key: "subjects", label: "Assigned Subjects" },
  ];

  const handleDelete = async (batchId, name) => {
    const result = await Swal.fire({
      title: "Delete Batch?",
      text: name ? `Delete "${name}"? This action cannot be undone.` : "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteBatch(batchId).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Batch has been deleted.",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err.data?.message || "Failed to delete batch."
        });
      }
    }
  };

  const handleEdit = (batch) => {
    setEditingId(batch._id);
    setEditData({ ...batch });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        degree: editData.degree || editData.course,
        batchCode: editData.batchCode,
        department: editData.department,
        capacity: Number(editData.capacity || editData.strength),
        semester: Number(editData.semester),
        section: editData.section,
      };
      
      await updateBatch({ id: editingId, data: payload }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Batch details updated successfully.",
        timer: 1500,
        showConfirmButton: false
      });
      setEditingId(null);
      setEditData(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.data?.message || "Failed to update batch."
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const openListPopup = (title, items) => {
    setPopupTitle(title);
    setPopupItems(Array.isArray(items) ? items : []);
    setShowPopup(true);
  };

  const q = (searchQuery || "").toLowerCase();
  const filtered = batches.filter(
    (b) =>
      (b.degree || b.course || "").toLowerCase().includes(q) ||
      (b.batchCode || "").toLowerCase().includes(q) ||
      (b.department || "").toLowerCase().includes(q)
  );

  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-0">
      <DataEntryTable columns={columns} height="100%">
        {isLoading && <tr><td colSpan={9} className="py-10 text-center text-[#8A96A8]">Loading batches...</td></tr>}
        {error && <tr><td colSpan={9} className="py-10 text-center text-red-500">Error loading batches: {error.message}</td></tr>}
        {!isLoading && filtered.map((item, idx) => (
          <tr key={item._id} className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${idx === filtered.length - 1 ? "border-b-0" : ""}`}>
            <td className="py-5 text-center text-[#4C5968]">{idx + 1}</td>
            <td className="py-5 text-center text-[#4C5968]">
              {editingId === item._id ? (
                <Input variant="edit" value={editData.degree || editData.course || ""} onChange={(e) => setEditData({ ...editData, degree: e.target.value, course: e.target.value })} className="min-w-[120px]" />
              ) : (item.degree || item.course || "N/A")}
            </td>

            <td className="py-5 text-center text-[#8A96A8]">
              {editingId === item._id ? (
                <Input variant="edit" value={editData.batchCode || ""} onChange={(e) => setEditData({ ...editData, batchCode: e.target.value })} className="min-w-[100px]" />
              ) : (item.batchCode || "N/A")}
            </td>

            <td className="py-5 text-center text-[#8A96A8]">
              {editingId === item._id ? (
                <Input variant="edit" value={editData.department || ""} onChange={(e) => setEditData({ ...editData, department: e.target.value })} className="min-w-[120px]" />
              ) : (item.department || "N/A")}
            </td>

            <td className="py-5 text-center text-[#8A96A8]">
              {editingId === item._id ? (
                <Input variant="edit" value={editData.capacity || editData.strength || ""} onChange={(e) => setEditData({ ...editData, capacity: e.target.value, strength: e.target.value })} className="min-w-[80px]" />
              ) : (item.capacity || item.strength || "N/A")}
            </td>

            <td className="py-5 text-center text-[#8A96A8]">
              {editingId === item._id ? (
                <Input variant="edit" value={editData.semester || ""} onChange={(e) => setEditData({ ...editData, semester: e.target.value })} className="min-w-[80px]" />
              ) : (item.semester || "N/A")}
            </td>

            <td className="py-5 text-center text-[#8A96A8]">{item.batchCode?.split("_")[2] || "A"}</td>

            <td className="py-5 text-center">
              {(item.raw?.subjects || item.subjects || []).length > 0 ? (
                <button
                  onClick={() => openListPopup("Assigned Subjects", (item.raw?.subjects || item.subjects || []).map((s) => typeof s.subject === "object" ? s.subject : s))}
                  className="text-[#1A8FE3] hover:underline text-[13px] font-medium"
                >
                  See List ({(item.raw?.subjects || item.subjects).length})
                </button>
              ) : "None"}
            </td>

            <td className="py-5">
              {editingId === item._id ? (
                <div className="flex justify-center gap-2">
                  <Button variant="ghostIcon" onClick={handleUpdate} className="text-[#1A8FE3!important]"><Check size={18} /></Button>
                  <Button variant="ghostIcon" onClick={handleCancelEdit} className="text-[#F04438!important]"><X size={18} /></Button>
                </div>
              ) : (
                <div className="flex justify-center gap-3">
                  <Button variant="ghostIcon" onClick={() => handleEdit(item)}><Edit2 size={15} strokeWidth={1.5} /></Button>
                  <Button variant="ghostIcon" onClick={() => handleDelete(item._id)}><Trash2 size={15} strokeWidth={1.5} /></Button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </DataEntryTable>

      {showPopup && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.35)" }}
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-[10px] shadow-lg border"
            style={{ width: 420, maxHeight: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between px-5 py-3 border-b">
              <div className="font-semibold text-[#265768] Mulish">{popupTitle}</div>
              <button 
                onClick={() => setShowPopup(false)}
                className="bg-transparent border-none cursor-pointer"
              >
                <X size={18} color="#265768" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto" style={{ maxHeight: 340 }}>
              <ul className="space-y-2 list-none p-0 m-0">
                {popupItems.map((x, i) => (
                  <li
                    key={i}
                    className="text-[13px] text-[#265768] border rounded px-3 py-2 font-['Mulish']"
                  >
                    {x?.name || x?.subject?.name || "-"}
                    {x?.code || x?.subject?.code ? ` (${x.code || x.subject.code})` : ""}
                    {x?.email ? ` (${x.email})` : ""}
                    {x?.faculty ? ` - ${x.faculty}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}















