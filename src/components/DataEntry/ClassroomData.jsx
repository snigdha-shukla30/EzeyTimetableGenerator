import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  useGetClassroomsQuery,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation
} from "../../redux/api/endpoints/classroomsApi";
import DataEntryTable from "../ui/dataEntryTable";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export default function ClassroomData({ searchQuery = "" }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  const { data: classroomsData, isLoading, error } = useGetClassroomsQuery();
  const [updateClassroom] = useUpdateClassroomMutation();
  const [deleteClassroom] = useDeleteClassroomMutation();

  const classrooms = classroomsData?.data || [];

  const columns = [
    { key: "sno", label: "S.No", width: "70px" },
    { key: "name", label: "Classroom Name" },
    { key: "type", label: "Classroom Type" },
    { key: "capacity", label: "Capacity" },
  ];

  const handleEdit = (room) => {
    setEditingId(room._id);
    setEditData({ ...room, type: room.type || "", capacity: room.capacity || "" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        name: editData.name,
        type: editData.type.trim(),
        capacity: Number(editData.capacity)
      };
      await updateClassroom({ id: editingId, data: payload }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Classroom details updated successfully.",
        timer: 1500,
        showConfirmButton: false
      });
      setEditingId(null);
      setEditData(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.data?.message || err.message || "Failed to update classroom."
      });
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete Classroom?",
      text: name ? `Delete "${name}"? This action cannot be undone.` : "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteClassroom(id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Classroom has been deleted.",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err.data?.message || "Failed to delete classroom."
        });
      }
    }
  };

  const filtered = classrooms.filter((c) => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <DataEntryTable columns={columns} height="100%">
      {isLoading && <tr><td colSpan={5} className="py-10 text-center text-[#8A96A8]">Loading classrooms...</td></tr>}
      {error && <tr><td colSpan={5} className="py-10 text-center text-red-500">Error loading classrooms: {error.message}</td></tr>}
      {!isLoading && filtered.map((room, idx) => (
        <tr key={room._id} className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${idx === filtered.length - 1 ? "border-b-0" : ""}`}>
          <td className="py-5 text-center text-[#4C5968]">{idx + 1}</td>
          <td className="py-5 text-center text-[#4C5968]">{room.name}</td>
          <td className="py-5 text-center text-[#8A96A8]">
            {editingId === room._id ? (
              <Input variant="edit" value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })} className="min-w-[150px]" />
            ) : room.type}
          </td>
          <td className="py-5 text-center text-[#8A96A8]">
            {editingId === room._id ? (
              <Input variant="edit" type="number" value={editData.capacity} onChange={(e) => setEditData({ ...editData, capacity: e.target.value })} className="min-w-[100px]" />
            ) : room.capacity}
          </td>
          <td className="py-5">
            {editingId === room._id ? (
              <div className="flex justify-center gap-2">
                <Button variant="ghostIcon" onClick={handleUpdate} className="text-[#1A8FE3]"><Check size={18} /></Button>
                <Button variant="ghostIcon" onClick={handleCancel} className="text-[#F04438]"><X size={18} /></Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Button variant="ghostIcon" onClick={() => handleEdit(room)}><Edit2 size={15} strokeWidth={1.5} /></Button>
                <Button variant="ghostIcon" onClick={() => handleDelete(room._id, room.name)}><Trash2 size={15} strokeWidth={1.5} /></Button>
              </div>
            )}
          </td>
        </tr>
      ))}
      </DataEntryTable>
    </div>
  );
}


