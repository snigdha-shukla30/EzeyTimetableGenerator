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