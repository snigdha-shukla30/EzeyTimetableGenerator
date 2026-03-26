import React from 'react'

const periods = [
  { label: 'I', time: '09:35 - 10:25' },
  { label: 'II', time: '10:25 - 11:15' },
  { label: 'III', time: '11:15 - 12:05' },
  { label: 'IV', time: '12:05 - 12:55' },
  { label: 'V', time: '12:55 - 01:45' },
  { label: 'VI', time: '01:45 - 02:35' },
  { label: 'VII', time: '02:35 - 03:25' },
  { label: 'VIII', time: '03:25 - 04:15' },
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Each cell: [periodIndex] => { subject, teacher, room } or null
// periodIndex 0-7 (I to VIII)
// Period V (index 4) is Lunch for all days
// Image data mapped to period indices 0-7 (I=0, II=1, III=2, IV=3, V=4/Lunch, VI=5, VII=6, VIII=7)
// 09:35-10:25 = I(0), 10:25-11:15 = II(1), 11:15-12:05 = III(2), 12:05-12:55 = IV(3)
// 12:55-01:45 = V(4/Lunch), 01:45-02:35 = VI(5), 02:35-03:25 = VII(6), 03:25-04:15 = VIII(7)
// Image times: 09-10=I, 10-11=II, 11-12=III, 12-13=Lunch, 13-14=VI, 14-15=VII, 15-16=VIII (skipping IV)
const timetableData = {
  Monday: {
    // 09-10: empty, 10-11: Python Programming, 11-12: Software Engineering
    1: { subject: 'Python Programming', teacher: 'Mr. Sanjeev Kumar', room: 'B207 (lecture)' },
    2: { subject: 'Software Engineering', teacher: 'Mr.OM Prakash', room: 'B355 (lecture)' },
    // VI(13-14): empty, VII(14-15): empty, VIII(15-16): empty
  },
  Tuesday: {
    // 09-10: Operating Systems, 10-11: empty, 11-12: empty
    0: { subject: 'Operating Systems (BCA401)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B167 (lecture)' },
    // VI(13-14): empty, VII(16-17): Software Engineering
    7: { subject: 'Software Engineering (BCA402)', teacher: 'Mr.OM Prakash', room: 'B210 (lecture)' },
  },
  Wednesday: {
    // 09-10: Operating Systems Lab, 10-11: Operating Systems Lab, 11-12: empty
    0: { subject: 'Operating Systems Lab (BCA411)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B104 (lab)' },
    1: { subject: 'Operating Systems Lab (BCA411)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B104 (lab)' },
    // VII(14-15): Python Programming Lab, VIII(15-16): Python Programming Lab, 16-17: Software Engineering
    5: { subject: 'Python Programming Lab (BCA412)', teacher: 'Mr. Sanjeev Kumar', room: 'B104 (lab)' },
    6: { subject: 'Python Programming Lab (BCA412)', teacher: 'Mr. Sanjeev Kumar', room: 'B104 (lab)' },
    7: { subject: 'Software Engineering (BCA402)', teacher: 'Mr.OM Prakash', room: 'B208 (lecture)' },
  },
  Thursday: {
    // 09-10: Python Programming, 10-11: empty, 11-12: empty
    0: { subject: 'Python Programming (BCA404)', teacher: 'Mr. Sanjeev Kumar', room: 'B207 (lecture)' },
    // VI(13-14): Operating Systems Lab, VII(14-15): Operating Systems Lab, VIII(15-16): Operating Systems
    5: { subject: 'Operating Systems Lab (BCA411)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B103 (lab)' },
    6: { subject: 'Operating Systems Lab (BCA411)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B105 (lab)' },
    7: { subject: 'Operating Systems (BCA401)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B305 (lecture)' },
  },
  Friday: {
    // 09-10: Python Programming, 10-11: Operating Systems, 11-12: Software Engineering
    0: { subject: 'Python Programming (BCA404)', teacher: 'Mr. Sanjeev Kumar', room: 'B308 (lecture)' },
    1: { subject: 'Operating Systems (BCA401)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B305 (lecture)' },
    2: { subject: 'Software Engineering (BCA402)', teacher: 'Mr.OM Prakash', room: 'B210 (lecture)' },
    // VI(13-14): empty, VII(14-15): empty, VIII(15-16): empty
  },
  Saturday: {
    // 09-10: Python Programming, 10-11: Operating Systems, 11-12: empty
    0: { subject: 'Python Programming (BCA404)', teacher: 'Mr. Sanjeev Kumar', room: 'B207 (lecture)' },
    1: { subject: 'Operating Systems (BCA401)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B208 (lecture)' },
    // VII(14-15): Python Programming Lab, VIII(15-16): Python Programming Lab
    6: { subject: 'Python Programming Lab (BCA412)', teacher: 'Mr. Sanjeev Kumar', room: 'B104 (lab)' },
    7: { subject: 'Python Programming Lab (BCA412)', teacher: 'Mr. Sanjeev Kumar', room: 'B104 (lab)' },
  },
}

const Cell = ({ data }) => {
  if (!data) return <td className="border border-[#D9D9D9] px-1 py-2 text-center" />
  return (
    <td className="border border-[#D9D9D9] px-1 py-2 text-center">
      <div className="text-[10px] font-semibold text-[#26576880] font-Mulish leading-tight break-words">
        {data.subject}
      </div>
      <div className="text-[9px] text-[#26576880] font-Mulish leading-tight break-words">{data.teacher}</div>
      <div className="text-[9px] text-[#26576880] font-Mulish leading-tight break-words">{data.room}</div>
    </td>
  )
}

const Timetabledown = () => {
  return (
    <div
      className="h-full w-full max-w-[98%] mx-auto px-3 py-4 border-2 border-[#D9D9D9] rounded shadow-xl bg-[#BFBFBF]/10 flex flex-col"
      style={{ marginBottom: '0.5rem' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#265768]" style={{ fontFamily: 'Playfair Display, serif' }}>
            B.Tech ( CSE )
          </h1>
          <p className="text-sm font-medium text-[#26576880]" style={{ fontFamily: 'Mulish, sans-serif' }}>
            Semester - I , Section - A
          </p>
        </div>

        {/* Back + Download */}
        <div className="flex items-center gap-3 mt-1">
          <button className="h-[40px] px-6 rounded border font-bold border-[#4BACCE] text-[#4BACCE] bg-white text-sm">
            Back
          </button>

          <div className="relative">
            <button
              className="h-[40px] px-5 text-sm font-medium text-white rounded-[6px] flex items-center gap-2"
              style={{
                background: 'linear-gradient(0deg,#265768 0%,#4BACCE 100%)',
                boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
              }}
            >
              {/* Download icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              <span className="text-lg leading-none">Download</span>
            </button>
  
          </div>
        </div>
      </div>

      {/* Timetable */}
      <div className="mt-4 flex flex-col flex-1">
        <table className="border-collapse w-full border border-[#4BACCE] table-fixed h-full">
          <thead>
            <tr className="bg-white">
              <th className="border border-[#D9D9D9] px-1 py-2 text-[#265768] text-[10px] font-semibold text-center w-[9%]">
                Day/Period
              </th>
              {periods.map((p) => (
                <th
                  key={p.label}
                  className="border border-[#D9D9D9] px-1 py-2 text-center"
                >
                  <div className="text-[10px] font-bold text-[#26576880]">{p.label}</div>
                  <div className="text-[9px] text-[#26576880] font-medium">{p.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const row = timetableData[day] || {}
              const cells = []
              let skip = false

              // Build cells for this row
              const rendered = []
              for (let i = 0; i < 8; i++) {
                if (skip) { skip = false; continue }

                // Period V (index 4) = Lunch for all days — render once as rowspan across all days
                // We'll handle Lunch as a special merged cell spanning all day rows
                // But since each row is its own <tr>, we just show "Lunch" text in period V
                if (i === 4) {
                  if (day === 'Monday') {
                    // render rowspan=6 cell
                    rendered.push(
                      <td
                        key={`${day}-lunch`}
                        rowSpan={6}
                        className="border border-[#D9D9D9] px-1 py-2 text-center align-middle"
                      >
                        <span className="text-[13px] font-semibold text-[#265768]">Lunch</span>
                      </td>
                    )
                  }
                  // other days skip this cell (rowspan handles it)
                  continue
                }

                const cell = row[i]
                if (cell && cell.span) {
                  rendered.push(
                    <td
                      key={`${day}-${i}`}
                      colSpan={cell.span}
                      className="border border-[#D9D9D9] px-1 py-2 text-center"
                    >
                      <div className="text-[10px] font-semibold text-[#26576880]">{cell.subject}</div>
                      <div className="text-[9px] text-[#26576880]">{cell.teacher}</div>
                      <div className="text-[9px] text-[#26576880]">{cell.room}</div>
                    </td>
                  )
                  skip = true
                } else if (cell) {
                  rendered.push(
                    <td key={`${day}-${i}`} className="border border-[#D9D9D9] px-1 py-2 text-center">
                      <div className="text-[10px] font-semibold text-[#26576880]">{cell.subject}</div>
                      <div className="text-[9px] text-[#26576880]">{cell.teacher}</div>
                      <div className="text-[9px] text-[#26576880]">{cell.room}</div>
                    </td>
                  )
                } else {
                  rendered.push(
                    <td key={`${day}-${i}`} className="border border-[#D9D9D9] px-1 py-2" />
                  )
                }
              }

              return (
                <tr key={day} className="bg-white">
                  <td className="border border-[#D9D9D9] px-1 py-2 text-center font-semibold text-[#265768] text-[10px]">
                    {day}
                  </td>
                  {rendered}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Timetabledown