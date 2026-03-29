import React, { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'

const facultyData = [
  { id: 1, roomNo: "101" },
  { id: 2, roomNo: "102" },
  { id: 3, roomNo: "103" },
  { id: 4, roomNo: "104" },
  { id: 5, roomNo: "105" },
  { id: 6, roomNo: "106" },
  { id: 7, roomNo: "107" },
  { id: 8, roomNo: "108" },
  { id: 9, roomNo: "109" },
  { id: 10, roomNo: "110" },
  { id: 11, roomNo: "111" },
  { id: 12, roomNo: "112" },
]

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Mulish:wght@400;500;600&display=swap');

  .faculty-search-input::placeholder {
    color: #26576880 !important;
    opacity: 1 !important;
  }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .font-Playfair { font-family: 'Playfair Display', serif !important; }
  .font-Mulish { font-family: 'Mulish', sans-serif !important; }
`

const THUMB_HEIGHT_PX = 56

const Student = () => {
  const [search, setSearch] = useState('')
  const [thumbTop, setThumbTop] = useState(0)
  const tableRef = useRef(null)
  const trackRef = useRef(null)

  const filteredFaculty = facultyData.filter((f) =>
    f.roomNo.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const el = tableRef.current
    if (!el) return
    const handleScroll = () => {
      const scrollable = el.scrollHeight - el.clientHeight
      if (scrollable <= 0) return
      const scrollRatio = el.scrollTop / scrollable
      const trackHeight = trackRef.current ? trackRef.current.clientHeight : 0
      const maxTop = trackHeight - THUMB_HEIGHT_PX
      setThumbTop(scrollRatio * maxTop)
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <style>{globalStyles}</style>
      <div
        className="h-full w-full max-w-[98%] mx-auto px-3 py-4 border-2 border-[#BFBFBF] rounded shadow-xl bg-[#BFBFBF]/10"
        style={{ marginBottom: '0.5rem' }}
      >
        <h1 className="text-2xl md:text-3xl mt-4 ml-4 font-bold font-Playfair text-[#265768]">
          View / Edit generated schedules
        </h1>
        <p className="text-xs md:text-sm mt-1 ml-4 font-medium font-Mulish" style={{ color: 'rgba(38, 87, 104, 0.5)' }}>
          Faculty wise schedules
        </p>

        <div>
          <p className="text-base md:text-sm font-medium font-Mulish text-[#265768] mt-8 ml-4">
            Enter Room Number
          </p>
          <div className="relative ml-4 mt-0.5 w-full max-w-[270px] md:max-w-[270px]">
            <Search
              size={20}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#265768]"
            />
            <input
              type="text"
              placeholder="e.g. B 102"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="faculty-search-input w-full pl-8 pr-3 py-2.5 text-xs md:text-sm text-gray-700 bg-white focus:outline-none"
              style={{ border: "1.5px solid #BFBFBF", borderRadius: "8px" }}
            />
          </div>
        </div>

        <p className="text-[#265768] font-medium font-Mulish text-sm text-right mt-4 mb-1 ml-4 mr-4">
          Total roomwise Timetables: 20
        </p>

        <div
          className="relative mt-0 border-2 border-[#DFDFDF] rounded-2xl shadow-sm overflow-hidden ml-4 mr-4"
          style={{ maxHeight: '380px' }}
        >
          <div
            ref={tableRef}
            className="hide-scrollbar overflow-x-auto overflow-y-auto"
            style={{ maxHeight: '380px' }}
          >
            <div className="px-7 bg-white">
              <table className="w-full table-fixed border-separate border-spacing-y-2 text-sm md:text-base bg-white">
                <colgroup>
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '45%' }} />
                  <col style={{ width: '35%' }} />
                </colgroup>
                <thead className="text-[#265768] sticky top-0 z-10 bg-white">
                  <tr>
                    {['S No', 'Room No', 'Preview Timetable'].map((header) => (
                      <th
                        key={header}
                        className="px-2 py-2 text-center font-medium relative bg-white"
                        style={{ borderBottom: "2px solid #0077FF" }}
                      >
                        {header}
                        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#0077FF] shadow-[0_2px_4px_rgba(0,119,255,0.6)]"></span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.length > 0 ? (
                    filteredFaculty.map((faculty) => (
                      <tr key={faculty.id} className="hover:bg-gray-100">
                        <td
                          className="px-4 py-2 border-b-2 text-center"
                          style={{ borderColor: "#D9D9D9", color: "rgba(38, 87, 104, 0.5)" }}
                        >
                          {faculty.id}
                        </td>
                        <td
                          className="px-4 py-2 border-b-2 text-center"
                          style={{ borderColor: "#D9D9D9", color: "rgba(38, 87, 104, 0.5)" }}
                        >
                          {faculty.roomNo}
                        </td>
                        <td
                          className="px-4 py-2 border-b-2 text-center"
                          style={{ borderColor: "#D9D9D9", color: "rgba(38, 87, 104, 0.5)" }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="1" y="1" width="16" height="16" rx="2" stroke="#265768" strokeOpacity="0.5" strokeWidth="1.5" />
                              <line x1="1" y1="6" x2="17" y2="6" stroke="#265768" strokeOpacity="0.5" strokeWidth="1.5" />
                              <line x1="1" y1="11" x2="17" y2="11" stroke="#265768" strokeOpacity="0.5" strokeWidth="1.5" />
                              <line x1="6" y1="6" x2="6" y2="17" stroke="#265768" strokeOpacity="0.5" strokeWidth="1.5" />
                              <line x1="12" y1="6" x2="12" y2="17" stroke="#265768" strokeOpacity="0.5" strokeWidth="1.5" />
                            </svg>
                            <button style={{ color: "rgba(38, 87, 104, 0.5)" }}>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-6 text-center"
                        style={{ color: "rgba(38, 87, 104, 0.4)" }}
                      >
                        No rooms found matching "{search}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* scrollbar */}
          <div ref={trackRef} className='absolute right-2 top-0 h-[48vh] w-[1.5vh] bg-white border border-[#575757]/20 rounded-xl shadow overflow-hidden mt-5'>
            <div
              className='h-[7vh] w-[1.5vh] bg-gradient-to-b from-[#575757]/90 to-[#75CBF6] shadow rounded-xl'
              style={{ transform: `translateY(${thumbTop}px)`, transition: 'transform 0.1s' }}
            ></div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Student