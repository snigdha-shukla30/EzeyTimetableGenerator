import React, { useState } from 'react'
import { SearchBar } from "../../components/ui/SearchBar"
import DataEntryTable from "../../components/ui/dataEntryTable"
import { Table } from "@mantine/core"
import { useNavigate } from 'react-router-dom'

const facultyData = [
  { id: 1, name: "Dr Rakesh Kumar Yadav", email: "rakeshkumar879@gmail.com" },
  { id: 2, name: "Dr Shweta Vikram", email: "shweta879@gmail.com" },
  { id: 3, name: "Mrs Pooja Shukla", email: "poojashukla879@gmail.com" },
  { id: 4, name: "Mr Sanjeev Kumar", email: "Sanjeev.879@gmail.com" },
  { id: 5, name: "Dr Kalyan Acharya", email: "kalyan879@gmail.com" },
  { id: 6, name: "Dr Om Prakash", email: "Omprakash879@gmail.com" },
  { id: 7, name: "Dr Amit Sharma", email: "amitsharma879@gmail.com" },
  { id: 8, name: "Mrs Neha Gupta", email: "nehagupta879@gmail.com" },
  { id: 9, name: "Dr Priya Singh", email: "priyasingh879@gmail.com" },
  { id: 10, name: "Mr Rohit Verma", email: "rohitverma879@gmail.com" },
  { id: 11, name: "Dr Sunita Mishra", email: "sunitamishra879@gmail.com" },
  { id: 12, name: "Dr Vikram Tiwari", email: "vikramtiwari879@gmail.com" },
]

const PreviewIcon = () => (
  <img src="/preview.svg" alt="preview" className="w-[18px] opacity-100" />
);

const Tablefaculty = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filteredFaculty = facultyData.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: "sno", label: "S No", width: "10%" },
    { key: "name", label: "Faculty Name", width: "30%" },
    { key: "email", label: "Email", width: "35%" },
    { key: "preview", label: "Preview Timetable", width: "25%" },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Search Section */}
      <div className="flex items-center justify-between gap-8 mb-2">
        <div className="w-[400px]">
          <SearchBar
            placeholder="Search by faculty name..."
            value={search}
            onChange={setSearch}
          />
        </div>
        
        <div className="flex flex-col items-end justify-center pt-6">
          <p className="text-[#265768]/60 font-medium text-sm">
            Total Faculty Timetables: {facultyData.length}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <DataEntryTable 
        columns={columns} 
        showActions={false}
        height="calc(100vh - 380px)"
      >
        {filteredFaculty.map((faculty) => (
          <Table.Tr key={faculty.id} className="hover:bg-gray-50/50 transition-colors">
            <Table.Td ta="center" className="text-[#265768]/70 py-4">
              {faculty.id}
            </Table.Td>
            <Table.Td ta="center" className="text-[#265768]/70 py-4">
              {faculty.name}
            </Table.Td>
            <Table.Td ta="center" className="text-[#265768]/70 py-4">
              {faculty.email}
            </Table.Td>
            <Table.Td ta="center" className="py-2">
              <div className="flex items-center justify-center gap-2">
                <div 
                  onClick={() => navigate("/timetabledown")}
                  className="cursor-pointer"
                  title="Preview Timetable"
                >
                  <PreviewIcon />
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
        ))}

        {filteredFaculty.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={4} ta="center" py={40} className="text-[#265768]/40 italic">
              No faculty found matching "{search}"
            </Table.Td>
          </Table.Tr>
        )}
      </DataEntryTable>
    </div>
  )
}

export default Tablefaculty