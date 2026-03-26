import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import ManualEntryTable from "../ui/manualEntryTable";

const SubjectTable = ({ subjects, onEdit, onDelete }) => {
  return (
    <ManualEntryTable
      height="calc(100vh - 460px)"
      columns={[
        { key: "sno", label: "S.No", width: "70px" },
        { key: "name", label: "Subject Name" },
        { key: "code", label: "Subject Code" },
        { key: "department", label: "Department" },
        { key: "semester", label: "Semester" },
        { key: "section", label: "Section" },
        { key: "type", label: "Type" },
        { key: "hrsWeek", label: "Hrs/Week" },
      ]}
    >
      {subjects.map((item, idx) => (
        <tr
          key={item._id || idx}
          className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${
            idx === subjects.length - 1 ? "border-b-0" : ""
          }`}
        >
          <td className="py-5 text-center text-[#4C5968]">{idx + 1}</td>
          <td className="py-5 text-center text-[#4C5968]">{item.name}</td>
          <td className="py-5 text-center text-[#4C5968]">{item.code}</td>
          <td className="py-5 text-center text-[#4C5968]">{item.department}</td>
          <td className="py-5 text-center text-[#4C5968]">{item.semester}</td>
          <td className="py-5 text-center text-[#4C5968]">{item.section}</td>
          <td className="py-5 text-center text-[#4C5968]">{item.type}</td>
          <td className="py-5 text-center text-[#4C5968]">{item.hrsWeek}</td>
          <td className="py-5">
            <div className="flex justify-center gap-3">
              <button
                onClick={() => onEdit(item)}
                className="text-[#C0C6D0] hover:text-[#1A8FE3]"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="text-[#C0C6D0] hover:text-[#F04438]"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </ManualEntryTable>
  );
};

export default SubjectTable;
