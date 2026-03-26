import React, { useState } from "react";
import { Edit2, Trash2, X, Check } from "lucide-react";
import ManualEntryTable from "../ui/manualEntryTable";

const ClassroomData = ({ classrooms, onEdit, onDelete, searchQuery }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", type: "", capacity: "" });

  const filtered = classrooms.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (room) => {
    setEditingId(room._id);
    setEditForm({
      name: room.name,
      type: room.type,
      capacity: room.capacity,
    });
  };

  const handleSaveEdit = async (id) => {
    await onEdit(id, editForm);
    setEditingId(null);
  };

  const handleCancelEdit = () => setEditingId(null);

  return (
    <div className="mt-6">
      <ManualEntryTable
        height="calc(100vh - 330px)"

        columns={[
          { key: "sno", label: "S.No", width: "70px" },
          { key: "name", label: "Classroom number" },
          { key: "type", label: "Classroom type" },
          { key: "capacity", label: "Capacity" },
        ]}
      >
        {filtered.map((room, idx) => (
          <tr
            key={room._id || idx}
            style={{
              borderBottom:
                idx === filtered.length - 1 ? "none" : "1px solid #D9D9D9",
            }}
          >
            {/* S.No */}
            <td align="center" className="text-[13px] text-[#265768] py-3">{idx + 1}</td>

            {/* NAME */}
            <td align="center" className="text-[13px] text-[#265768] py-3">
              {editingId === room._id ? (
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="px-2 py-1 border border-[#1DA5FF] rounded text-center"
                />
              ) : (
                room.name
              )}
            </td>

            {/* TYPE */}
            <td align="center" className="text-[13px] text-[#265768]">
              {editingId === room._id ? (
                <select
                  value={editForm.type}
                  onChange={(e) =>
                    setEditForm({ ...editForm, type: e.target.value })
                  }
                  className="px-2 py-1 border border-[#1DA5FF] rounded"
                >
                  <option value="lecture">Lecture Hall</option>
                  <option value="lab">Computer Lab</option>
                  <option value="seminar">Seminar Room</option>
                </select>
              ) : (
                room.type
              )}
            </td>

            {/* CAPACITY */}
            <td align="center" className="text-[13px] text-[#265768]">
              {editingId === room._id ? (
                <input
                  type="number"
                  value={editForm.capacity}
                  onChange={(e) =>
                    setEditForm({ ...editForm, capacity: e.target.value })
                  }
                  className="px-2 py-1 border border-[#1DA5FF] rounded text-center w-[80px]"
                />
              ) : (
                room.capacity
              )}
            </td>

            {/* ACTIONS */}
            <td align="center">
              {editingId === room._id ? (
                <div className="flex justify-center gap-3">
                  <button onClick={() => handleSaveEdit(room._id)}>
                    <Check size={15} color="#10B981" />
                  </button>

                  <button onClick={handleCancelEdit}>
                    <X size={15} color="#EF4444" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center gap-3">
                  <button onClick={() => handleEditClick(room)} className="text-[#C0C6D0] hover:text-[#1A8FE3]">
                    <Edit2 size={15} />
                  </button>

                  <button onClick={() => onDelete(room._id)} className="text-[#C0C6D0] hover:text-[#F04438]">
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </ManualEntryTable>
    </div>
  );
};

export default ClassroomData;
