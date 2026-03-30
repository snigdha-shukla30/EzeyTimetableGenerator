import React from 'react'
import { Button } from "../ui/Button"
import { useNavigate } from "react-router-dom"
import { Download } from "lucide-react"

const periods = [
  { label: '1', time: '09:35 - 10:25' },
  { label: '2', time: '10:25 - 11:15' },
  { label: '3', time: '11:15 - 12:05' },
  { label: '4', time: '12:05 - 12:55' },
  { label: '5', time: '12:55 - 01:45' },
  { label: '6', time: '01:45 - 02:35' },
  { label: '7', time: '02:35 - 03:25' },
  { label: '8', time: '03:25 - 04:15' },
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const timetableData = {
  Monday: {
    1: { subject: 'Python Programming', teacher: 'Mr. Sanjeev Kumar', room: 'B207 (lecture)' },
    2: { subject: 'Software Engineering', teacher: 'Mr.OM Prakash', room: 'B355 (lecture)' },
  },
  Tuesday: {
    0: { subject: 'Operating Systems (BCA401)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B167 (lecture)' },
    7: { subject: 'Software Engineering (BCA402)', teacher: 'Mr.OM Prakash', room: 'B210 (lecture)' },
  },
  Wednesday: {
    0: { subject: 'Operating Systems Lab (BCA411)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B104 (lab)' },
    1: { subject: 'Operating Systems Lab (BCA411)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B104 (lab)' },
    5: { subject: 'Python Programming Lab (BCA412)', teacher: 'Mr. Sanjeev Kumar', room: 'B104 (lab)' },
    6: { subject: 'Python Programming Lab (BCA412)', teacher: 'Mr. Sanjeev Kumar', room: 'B104 (lab)' },
    7: { subject: 'Software Engineering (BCA402)', teacher: 'Mr.OM Prakash', room: 'B208 (lecture)' },
  },
  Thursday: {
    0: { subject: 'Python Programming (BCA404)', teacher: 'Mr. Sanjeev Kumar', room: 'B207 (lecture)' },
    5: { subject: 'Operating Systems Lab (BCA411)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B103 (lab)' },
    6: { subject: 'Operating Systems Lab (BCA411)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B105 (lab)' },
    7: { subject: 'Operating Systems (BCA401)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B305 (lecture)' },
  },
  Friday: {
    0: { subject: 'Python Programming (BCA404)', teacher: 'Mr. Sanjeev Kumar', room: 'B308 (lecture)' },
    1: { subject: 'Operating Systems (BCA401)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B305 (lecture)' },
    2: { subject: 'Software Engineering (BCA402)', teacher: 'Mr.OM Prakash', room: 'B210 (lecture)' },
  },
  Saturday: {
    0: { subject: 'Python Programming (BCA404)', teacher: 'Mr. Sanjeev Kumar', room: 'B207 (lecture)' },
    1: { subject: 'Operating Systems (BCA401)', teacher: 'Mrs.Divyanshi Rajvanshi', room: 'B208 (lecture)' },
    6: { subject: 'Python Programming Lab (BCA412)', teacher: 'Mr. Sanjeev Kumar', room: 'B104 (lab)' },
    7: { subject: 'Python Programming Lab (BCA412)', teacher: 'Mr. Sanjeev Kumar', room: 'B104 (lab)' },
  },
}

const Timetabledown = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Controls: Title & Buttons */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[32px] leading-tight font-semibold text-[#265768]/90 mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
            B.Tech ( CSE )
          </h1>
          <p className="text-sm font-medium text-[#265768]/50">
            Semester - I, Section - A
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="back" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button variant="upload" onClick={() => window.print()} className="!min-w-[120px] !h-[42px]">
            <Download size={18} className="mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-gray-300 rounded">
        <table className="border-collapse w-full text-center table-fixed min-w-[800px]">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-4 text-[#265768B3] text-[13px] font-bold w-[100px]">
                Day/Period
              </th>
              {periods.map((p) => (
                <th key={p.label} className="border border-gray-300 px-2 py-2">
                  <div className="text-[13px] font-bold text-[#265768B3] mb-1">{p.label}</div>
                  <div className="text-[11px] text-[#26576880] whitespace-nowrap">{p.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const row = (timetableData as any)[day] || {}
              const rendered = []

              for (let i = 0; i < 8; i++) {
                if (i === 4) {
                   if (day === 'Monday') {
                     rendered.push(
                       <td key={`${day}-lunch`} rowSpan={6} className="border border-gray-300 bg-gray-50/50 align-middle">
                         <span className="text-[14px] font-bold text-[#26576880] tracking-[0.2em] [writing-mode:vertical-lr] rotate-180">LUNCH</span>
                       </td>
                     ) 
                   }
                   continue
                }

                const cell = row[i]
                if (cell) {
                  rendered.push(
                    <td key={`${day}-${i}`} className="border border-gray-300 px-2 py-3 align-top hover:bg-gray-50 transition-colors">
                      <div className="text-[12px] font-bold text-[#265768CC] mb-1 leading-tight">{cell.subject}</div>
                      <div className="text-[11px] text-[#26576899] mb-1">{cell.teacher}</div>
                      <div className="text-[10px] text-[#26576866]">{cell.room}</div>
                    </td>
                  )
                } else {
                  rendered.push(<td key={`${day}-${i}`} className="border border-gray-300" />)
                }
              }

              return (
                <tr key={day}>
                  <td className="border border-gray-300 font-bold text-[#265768B3] text-[13px] bg-gray-50/30">{day}</td>
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
