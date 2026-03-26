import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import ManualEntryTable from "../ui/manualEntryTable";

const BatchTable = ({ batches, loading, onEdit, onDelete, onOpenPopup }) => {
  return (
    <ManualEntryTable
      height="calc(100vh - 460px)"
      columns={[
        { key: "sno", label: "S.No", width: "70px" },
        { key: "degree", label: "Degree / Course" },
        { key: "department", label: "Department" },
        { key: "capacity", label: "Capacity" },
        { key: "semester", label: "Semester" },
        { key: "section", label: "Section" },
        { key: "subjects", label: "Assigned Subjects" },
      ]}
    >
      {batches.map((batch, index) => {
        const subjects = batch.raw?.subjects || batch.subjects || [];

        return (
          <tr
            key={batch._id || `batch-${index}`}
            className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${
              index === batches.length - 1 ? "border-b-0" : ""
            }`}
          >
            <td className="py-5 text-center text-[#4C5968]">{index + 1}</td>
            <td className="py-5 text-center text-[#4C5968]">{batch.course || batch.degree || "-"}</td>
            <td className="py-5 text-center text-[#4C5968]">{batch.department || "-"}</td>
            <td className="py-5 text-center text-[#4C5968]">{batch.capacity || batch.strength || batch.raw?.strength || "-"}</td>
            <td className="py-5 text-center text-[#4C5968]">{batch.semester || "-"}</td>
            <td className="py-5 text-center text-[#4C5968]">{batch.section || batch.name || batch.raw?.name || "-"}</td>
            <td className="py-5 text-center text-[#4C5968]">
              {subjects.length > 0 ? (
                <button
                  onClick={() => onOpenPopup("Assigned Subjects", subjects.map((p) => p.subject))}
                  style={{
                    color: "#4BACCE",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontFamily: "'Mulish', sans-serif",
                    textDecoration: "underline",
                  }}
                >
                  See List ({subjects.length})
                </button>
              ) : (
                "-"
              )}
            </td>
            <td className="py-5">
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => onEdit(batch)}
                  disabled={loading}
                  className="text-[#C0C6D0] hover:text-[#1A8FE3]"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(batch._id)}
                  disabled={loading}
                  className="text-[#C0C6D0] hover:text-[#DC3545]"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </ManualEntryTable>
  );
};

export default BatchTable;
