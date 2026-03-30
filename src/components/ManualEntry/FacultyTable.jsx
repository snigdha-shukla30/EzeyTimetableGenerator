import React, { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import DataEntryTable from "../ui/dataEntryTable";

const FacultyTable = ({ facultyList, onEdit, onDelete, onOpenPopup, onUpdate, height }) => {
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
    <DataEntryTable
      height={height}
      columns={[
        { key: "sno", label: "S.No", width: "70px" },
        { key: "name", label: "Faculty Name" },
        { key: "email", label: "Email" },
        { key: "maxLoad", label: "Max Load" },
        { key: "leaves", label: "Leaves" },
        { key: "subjects", label: "Assigned Subjects" },
      ]}
    >
      {facultyList.map((item, idx) => (
        <tr
          key={item._id || idx}
          className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${
            idx === facultyList.length - 1 ? "border-b-0" : ""
          }`}
        >
          <td className="py-5 text-center text-[#4C5968]">{idx + 1}</td>
          <td className="py-5 text-center text-[#4C5968]">
            {inlineEditingId === item._id ? (
              <input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-2 py-1 border rounded text-center min-w-[150px]"
              />
            ) : (
              item.name || "-"
            )}
          </td>
          <td className="py-5 text-center text-[#4C5968]">
            {inlineEditingId === item._id ? (
              <input
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-2 py-1 border rounded text-center min-w-[200px]"
              />
            ) : (
              item.email || "-"
            )}
          </td>
          <td className="py-5 text-center text-[#4C5968]">
            {inlineEditingId === item._id ? (
              <input
                type="number"
                value={editData.maxLoad || editData.max_load}
                onChange={(e) => setEditData({ ...editData, maxLoad: e.target.value })}
                className="w-full px-2 py-1 border rounded text-center min-w-[80px]"
              />
            ) : (
              item.maxLoad || item.max_load || "-"
            )}
          </td>
          <td className="py-5 text-center text-[#4C5968]">
            {inlineEditingId === item._id ? (
              <input
                type="number"
                value={editData.leavesPerMonth || editData.leaves_per_month}
                onChange={(e) => setEditData({ ...editData, leavesPerMonth: e.target.value })}
                className="w-full px-2 py-1 border rounded text-center min-w-[80px]"
              />
            ) : (
              item.leavesPerMonth || item.leaves_per_month || "-"
            )}
          </td>
          <td className="py-5 text-center text-[#4C5968]">
            {item.subjects?.length > 0 ? (
              <button
                onClick={() => onOpenPopup("Assigned Subjects", item.subjects.map(s => typeof s === "object" ? s : { name: s }))}
                className="text-[#1A8FE3] hover:underline bg-transparent border-none cursor-pointer text-[13px]"
              >
                View List
              </button>
            ) : "-"}
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
                    className="text-[rgba(38,87,104,0.5)] hover:text-[rgba(38,87,104,0.8)]"
                  >
                    <Edit2 size={15} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => onDelete(item._id, item.name)}
                    className="text-[rgba(38,87,104,0.5)] hover:text-[rgba(38,87,104,0.8)]"
                  >
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      ))}
    </DataEntryTable>
  );
};

export default FacultyTable;
