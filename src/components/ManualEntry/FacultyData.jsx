import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import ManualEntryTable from "../ui/manualEntryTable";

const FacultyData = ({
  searchQuery = "",
  facultyList = [],
  onEdit,
  onDelete,
}) => {
  const query = searchQuery.toLowerCase();

  const filtered = facultyList.filter((f) =>
    `${f.name} ${f.email}`.toLowerCase().includes(query)
  );

  return (
    <div className="mt-6 pb-4">
      <ManualEntryTable
        height="calc(100vh - 380px)"
        minWidth="100%"
        columns={[
          { key: "sno", label: "S.No", width: "70px" },
          { key: "name", label: "Faculty Name" },
          { key: "email", label: "Email" },
          { key: "maxLoad", label: "Max load/day" },
          { key: "leaves", label: "Leaves/month" },
          { key: "subjects", label: "Assigned Subjects" },
        ]}
      >
        {filtered.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-10 text-center text-gray-400">
              No faculties found
            </td>
          </tr>
        ) : (
          filtered.map((f, idx) => (
            <tr
              key={f._id || idx}
              className={`text-sm border-b border-[#D9D9D9] hover:bg-gray-50 transition ${
                idx === filtered.length - 1 ? "border-b-0" : ""
              }`}
            >
              <td className="py-4 text-center text-[#265768]">{idx + 1}</td>
              {/* Faculty Name */}
              <td className="py-4 text-center text-[#265768] font-medium">
                {f.name}
              </td>

              {/* Email */}
              <td className="py-4 text-center text-[#265768]">
                {f.email}
              </td>

              {/* Max Load */}
              <td className="py-4 text-center text-[#265768]">
                {f.maxLoad} Hrs
              </td>

              {/* Leaves */}
              <td className="py-4 text-center text-[#265768]">
                {f.leavesPerMonth}
              </td>

              {/* Subjects */}
              <td className="py-4 text-center">
                <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
                  See List ({f.subjects?.length || 0})
                </button>
              </td>

              {/* Actions */}
              <td className="py-4">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(f)}
                    className="text-[#C0C6D0] hover:text-[#1A8FE3]"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    onClick={() => onDelete(f._id)}
                    className="text-[#C0C6D0] hover:text-[#F04438]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </ManualEntryTable>
    </div>
  );
};

export default FacultyData;
