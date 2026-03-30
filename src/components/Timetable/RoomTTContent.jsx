import React, { useState } from 'react'
import { SearchBar } from "../../components/ui/SearchBar"
import DataEntryTable from "../../components/ui/dataEntryTable"
import { Table } from "@mantine/core"
import { useNavigate } from 'react-router-dom'

const roomData = [
  { id: 1, roomNo: "B 101" },
  { id: 2, roomNo: "B 102" },
  { id: 3, roomNo: "B 103" },
  { id: 4, roomNo: "B 104" },
  { id: 5, roomNo: "B 105" },
  { id: 6, roomNo: "B 106" },
  { id: 7, roomNo: "B 107" },
  { id: 8, roomNo: "B 108" },
  { id: 9, roomNo: "B 109" },
  { id: 10, roomNo: "B 110" },
  { id: 11, roomNo: "B 111" },
  { id: 12, roomNo: "B 112" },
]

const PreviewIcon = () => (
  <img src="/preview.svg" alt="preview" className="w-[18px] opacity-100" />
);

const RoomContent = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filteredRooms = roomData.filter((r) =>
    r.roomNo.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: "sno", label: "S No", width: "20%" },
    { key: "room", label: "Room No", width: "45%" },
    { key: "preview", label: "Preview Timetable", width: "35%" },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Search Section */}
      <div className="flex items-center justify-between gap-8 mb-2">
        <div className="w-[400px]">
          <SearchBar
            placeholder="Search by room number..."
            value={search}
            onChange={setSearch}
          />
        </div>
        
        <div className="flex flex-col items-end justify-center pt-6">
          <p className="text-[#265768]/60 font-medium text-sm">
            Total Room Timetables: {roomData.length}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <DataEntryTable 
        columns={columns} 
        showActions={false}
        height="calc(100vh - 380px)"
      >
        {filteredRooms.map((room) => (
          <Table.Tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
            <Table.Td ta="center" className="text-[#265768]/70 py-4">
              {room.id}
            </Table.Td>
            <Table.Td ta="center" className="text-[#265768]/70 py-4">
              {room.roomNo}
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

        {filteredRooms.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={3} ta="center" py={40} className="text-[#265768]/40 italic">
              No rooms found matching "{search}"
            </Table.Td>
          </Table.Tr>
        )}
      </DataEntryTable>
    </div>
  )
}

export default RoomContent