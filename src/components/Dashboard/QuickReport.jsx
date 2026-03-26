import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 38 },
  { day: "Wed", value: 25 },
  { day: "Thu", value: 48 },
  { day: "Fri", value: 65 },
  { day: "Sat", value: 38 },
];

const ChartBlock = ({ title }) => (
  <div className="flex-1 min-w-0 flex flex-col">
    <p
      className="text-center text-[11px] md:text-[12px] lg:text-[13px] font-semibold text-[#265768] mb-2 shrink-0"
      style={{ fontFamily: "Mulish, sans-serif" }}
    >
      {title}
    </p>
    <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={14} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            width={28}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill="url(#barGradient)" />
            ))}
          </Bar>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B9AB2" stopOpacity={1} />
              <stop offset="100%" stopColor="#A8D8E8" stopOpacity={0.4} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const QuickReport = () => {
  return (
    <div
      className="bg-white rounded-[10px] border border-[#BFBFBF] px-3 md:px-5 lg:px-8 py-3 md:py-4"
      style={{
        boxShadow: "0px 1px 4px 0px #00000040",
        width: "min(49vw, 100%)",
        maxWidth: "1000px",
        minWidth: "280px",
        height: "clamp(200px, 40vh, 400px)",
        marginTop: "40px",
      }}
    >
      <div className="flex gap-4 md:gap-6 lg:gap-10 h-full">
        <ChartBlock title="Faculty Utilization" />
        <ChartBlock title="Classroom Utilization" />
        <ChartBlock title="Blank Periods" />
      </div>
    </div>
  );
};

export default QuickReport;





// import React, { useEffect, useState } from "react";
// import { Users, School, Calendar, BarChart2 } from "lucide-react";
// import { dashboardSummaryAPI } from "../../services/api"; // ✅ path apne project ke hisaab se adjust karna

// const QuickReport = () => {
//   const [loading, setLoading] = useState(true);
//   const [quickReport, setQuickReport] = useState({
//     facultyUtilization: 0,
//     classroomUtilization: 0,
//     blankPeriods: 0,
//   });

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const res = await dashboardSummaryAPI();
//         setQuickReport(res?.data?.quickReport || {});
//       } catch (err) {
//         console.error("Failed to fetch dashboard summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSummary();
//   }, []);

//   const reports = [
//     {
//       label: "Faculty\nUtilization",
//       value: `${quickReport.facultyUtilization ?? 0}%`,
//       Icon: Users,
//     },
//     {
//       label: "Classroom\nUtilization",
//       value: `${quickReport.classroomUtilization ?? 0}%`,
//       Icon: School,
//     },
//     {
//       label: "Blank\nPeriods",
//       value: `${quickReport.blankPeriods ?? 0}%`,
//       Icon: Calendar,
//     },
//   ];

//   return (
//     <div
//       className="w-[335px] h-[259px] bg-white rounded-[10px] border border-[#CACACA] p-6 flex flex-col"
//       style={{ boxShadow: "0px 4px 50px 0px rgba(0, 0, 0, 0.05)" }}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-center gap-2 mb-3">
//         <h3 className="text-[16px] font-semibold text-[#265768] text-center">
//           Quick Report
//         </h3>
//         <BarChart2 className="w-4 h-4 text-[#265768]" />
//       </div>

//       {/* Divider line */}
//       <div className="w-full h-[3px] bg-[#D9D9D9] mb-5" />

//       {loading ? (
//         <div className="flex-1 flex items-center justify-center text-[#265768]">
//           Loading...
//         </div>
//       ) : (
//         <div className="grid grid-cols-3 gap-4 flex-1">
//           {reports.map((item, idx) => {
//             const Icon = item.Icon;
//             const percentage = parseInt(item.value) || 0;

//             return (
//               <div
//                 key={idx}
//                 className="flex flex-col items-center justify-center text-center group"
//               >
//                 {/* Semi-circle with percentage */}
//                 <div className="relative w-[80px] h-[45px] mb-2">
//                   {/* Background faded semi-circle */}
//                   <svg
//                     className="absolute inset-0 w-full h-full"
//                     viewBox="0 0 100 50"
//                     preserveAspectRatio="xMidYMid meet"
//                   >
//                     <path
//                       d="M 10 45 A 40 40 0 0 1 90 45"
//                       fill="none"
//                       stroke="#E5E7EB"
//                       strokeWidth="8"
//                       strokeLinecap="round"
//                     />
//                   </svg>

//                   {/* Foreground blue semi-circle */}
//                   <svg
//                     className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:opacity-80"
//                     viewBox="0 0 100 50"
//                     preserveAspectRatio="xMidYMid meet"
//                   >
//                     <path
//                       d="M 10 45 A 40 40 0 0 1 90 45"
//                       fill="none"
//                       stroke="#4BACCE"
//                       strokeWidth="10"
//                       strokeLinecap="round"
//                       strokeDasharray={`${(percentage / 100) * 125.66} 125.66`}
//                     />
//                   </svg>

//                   {/* Percentage text */}
//                   <div className="absolute inset-0 flex items-end justify-center pb-1">
//                     <span
//                       className="text-[12px] font-semibold text-[#265768]"
//                       style={{
//                         fontFamily: "Mulish, sans-serif",
//                         lineHeight: "150%",
//                       }}
//                     >
//                       {item.value}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
//                   <Icon className="w-6 h-6 text-[#4A90E2]" strokeWidth={1.5} />
//                 </div>

//                 <div className="text-[14px] text-[#265768] leading-tight whitespace-pre-line font-normal">
//                   {item.label}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuickReport;













