import React, { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import ManualEntryTable from "../ui/manualEntryTable";

const ClassroomTable = ({ classrooms, onEdit, onDelete, onUpdate, height }) => {
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleInlineEdit = (item) => {
    setInlineEditingId(item._id);
    setEditData({ ...item });
  };

  const handleCancel = () => {
    setInlineEditingId(null);
    setEditData(null);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editData);
    }
    setInlineEditingId(null);
    setEditData(null);
  };

  return (
    <ManualEntryTable
      height={height}
      columns={[
        { key: "sno", label: "S.No", width: "70px" },
        { key: "name", label: "Classroom Number" },
        { key: "type", label: "Type" },
        { key: "capacity", label: "Capacity" },
      ]}
    >
      {classrooms.map((item, idx) => (
        <tr
          key={item._id || idx}
          className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${
            idx === classrooms.length - 1 ? "border-b-0" : ""
          }`}
        >
          <td className="py-5 text-center text-[#4C5968]">{idx + 1}</td>
          <td className="py-5 text-center text-[#4C5968]">
            {inlineEditingId === item._id ? (
              <input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-2 py-1 border rounded text-center min-w-[120px]"
              />
            ) : (
              item.name || "-"
            )}
          </td>
          <td className="py-5 text-center text-[#4C5968]">
            {inlineEditingId === item._id ? (
              <select
                value={editData.type}
                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                className="w-full px-2 py-1 border rounded text-center min-w-[120px]"
              >
                <option value="theory">Theory</option>
                <option value="lab">Practical / Lab</option>
              </select>
            ) : (
              <span className="capitalize">{item.type || "-"}</span>
            )}
          </td>
          <td className="py-5 text-center text-[#4C5968]">
            {inlineEditingId === item._id ? (
              <input
                type="number"
                value={editData.capacity}
                onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                className="w-full px-2 py-1 border rounded text-center min-w-[80px]"
              />
            ) : (
              item.capacity || "-"
            )}
          </td>
          <td className="py-5">
            <div className="flex justify-center gap-3">
              {inlineEditingId === item._id ? (
                <>
                  <button onClick={handleSave} className="text-[#1A8FE3] hover:text-[#1572B6]">
                    <Check size={18} />
                  </button>
                  <button onClick={handleCancel} className="text-[#F04438] hover:text-[#D93F34]">
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleInlineEdit(item)}
                    className="text-[#C0C6D0] hover:text-[#1A8FE3]"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(item._id, item.name)}
                    className="text-[#C0C6D0] hover:text-[#F04438]"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      ))}
    </ManualEntryTable>
  );
};

export default ClassroomTable;
