import React, { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { 
  useGetFacultiesQuery, 
  useUpdateFacultyMutation, 
  useDeleteFacultyMutation 
} from "../../redux/api/endpoints/facultyApi";
import Swal from "sweetalert2";
import DataEntryTable from "../ui/dataEntryTable";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export default function Faculty({ searchQuery = "" }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupItems, setPopupItems] = useState([]);

  const { data: facultiesData, isLoading, error } = useGetFacultiesQuery();
  const [updateFaculty] = useUpdateFacultyMutation();
  const [deleteFaculty] = useDeleteFacultyMutation();

  const facultyList = facultiesData?.data || [];

  const columns = [
    { key: "sno", label: "S.No", width: "70px" },
    { key: "name", label: "Faculty Name" },
    { key: "email", label: "Email" },
    { key: "maxLoad", label: "Max load per day" },
    { key: "leavesPerMonth", label: "Leaves per month" },
    { key: "subjects", label: "Assigned Subjects" },
    { key: "actions", label: "Actions" },
  ];

  const handleEdit = (faculty) => {
    setEditingId(faculty._id);
    setEditData({
      ...faculty,
      subjectsText: faculty.subjects?.map(s => s.name || s).join(", ") || "",
    });
  };

  const handleDelete = async (facultyId) => {
    const result = await Swal.fire({
      text: "Are you sure you want to delete this faculty?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteFaculty(id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Faculty has been deleted.",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err.data?.message || "Failed to delete faculty."
        });
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        name: editData.name,
        email: editData.email,
        maxLoad: Number(editData.maxLoad),
        leavesPerMonth: Number(editData.leavesPerMonth),
      };
      
      await updateFaculty({ id: editingId, data: payload }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Faculty details updated successfully.",
        timer: 1500,
        showConfirmButton: false
      });
      setEditingId(null);
      setEditData(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.data?.message || "Failed to update faculty."
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const openSubjectsPopup = (subjects) => {
    const list = Array.isArray(subjects)
      ? subjects.map((s) => s?.name || s)
      : [];
    setPopupItems(list);
    setShowPopup(true);
  };

  const query = searchQuery.toLowerCase();
  const filtered = facultyList.filter((f) =>
    `${f.name} ${f.email}`.toLowerCase().includes(query)
  );

  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-0">
      <DataEntryTable columns={columns} height="100%" showActions={false}>
        {isLoading && (
          <tr>
            <td colSpan={7} className="py-10 text-center text-[#8A96A8]">
              Loading faculties...
            </td>
          </tr>
        )}

        {error && (
          <tr>
            <td colSpan={7} className="py-10 text-center text-red-500">
              Error loading faculties: {error.message}
            </td>
          </tr>
        )}

        {!isLoading &&
          filtered.map((f, idx) => (
            <tr
              key={f._id}
              className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${
                idx === filtered.length - 1 ? "border-b-0" : ""
              }`}
            >
              <td className="py-5 text-center text-[#4C5968]">{idx + 1}</td>
              <td className="py-5 text-center text-[#4C5968]">
                {editingId === f._id ? (
                  <Input variant="edit" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="min-w-[150px]" />
                ) : (
                  f.name
                )}
              </td>

              <td className="py-5 text-center text-[13px] text-[#8C96A3]">
                {editingId === f._id ? (
                  <Input variant="edit" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="min-w-[180px]" />
                ) : (
                  f.email
                )}
              </td>

              <td className="py-5 text-center text-[#8A96A8]">
                {editingId === f._id ? (
                  <Input variant="edit" type="number" value={editData.maxLoad} onChange={(e) => setEditData({ ...editData, maxLoad: e.target.value })} className="min-w-[100px]" />
                ) : (
                  `${f.maxLoad} Hrs`
                )}
              </td>

              <td className="py-5 text-center text-[#8A96A8]">
                {editingId === f._id ? (
                  <Input variant="edit" type="number" value={editData.leavesPerMonth} onChange={(e) => setEditData({ ...editData, leavesPerMonth: e.target.value })} className="min-w-[100px]" />
                ) : (
                  f.leavesPerMonth
                )}
              </td>

              <td className="py-5 text-center">
                <button
                  onClick={() => openSubjectsPopup(f.subjects)}
                  className="text-[13px] font-medium text-[#1A8FE3] hover:underline bg-transparent border-none cursor-pointer"
                >
                  See List ({f.subjects?.length || 0})
                </button>
              </td>

              <td className="py-5">
                {editingId === f._id ? (
                  <div className="flex justify-center gap-2">
                    <Button variant="ghostIcon" onClick={handleUpdate} className="text-[#1A8FE3!important]"><Check size={18} /></Button>
                    <Button variant="ghostIcon" onClick={handleCancelEdit} className="text-[#F04438!important]"><X size={18} /></Button>
                  </div>
                ) : (
                  <div className="flex justify-center gap-3">
                    <Button variant="ghostIcon" onClick={() => handleEdit(f)}><Edit2 size={15} /></Button>
                    <Button variant="ghostIcon" onClick={() => handleDelete(f._id)}><Trash2 size={15} /></Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
      </DataEntryTable>

      {/* SUBJECT POPUP */}
      {showPopup && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.35)" }}
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-[10px] shadow-lg border w-[420px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between px-5 py-3 border-b">
              <div className="font-semibold text-[#265768] Mulish">
                Assigned Subjects
              </div>
              <button 
                onClick={() => setShowPopup(false)}
                className="bg-transparent border-none cursor-pointer"
              >
                <X size={18} color="#265768" />
              </button>
            </div>

            <div className="p-4 max-h-[340px] overflow-y-auto custom-scroll">
              {popupItems.length === 0 ? (
                <div className="text-center text-gray-400 py-10 font-['Mulish']">No data</div>
              ) : (
                <ul className="space-y-2 list-none p-0 m-0">
                  {popupItems.map((x, i) => (
                    <li
                      key={i}
                      className="text-[13px] text-[#265768] border rounded px-3 py-2 font-['Mulish']"
                      style={{ borderColor: "#DFDFDF" }}
                    >
                      {x}
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
}























