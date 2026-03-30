import React, { useState } from "react";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import { CardContainer } from "../../components/ui/Card";
import Timetabledown from "../../components/Timetable/DownloadTTContent";

const Downloade = () => {
  const [activeMenu, setActiveMenu] = useState("timetable");

  return (
    <div
      className="min-h-screen h-screen bg-[#FFFFFF] flex px-2 py-4 gap-4 overflow-hidden"
      style={{ fontFamily: "Mulish, sans-serif" }}
    >
      {/* Sidebar */}
      <div className="shrink-0">
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex pt-2 overflow-y-auto">
        <div className="w-full space-y-2">
          {/* Header */}
          <div className="w-full bg-white border border-[#BFBFBF] rounded-[10px] px-6 py-3 shadow-[0_4px_14px_rgba(148,163,184,0.18)] flex items-center gap-6">
            <Header />
          </div>

          {/* Card */}
          <CardContainer title="" className="min-h-[calc(100vh-150px)] flex flex-col">
            <Timetabledown />
          </CardContainer>
        </div>
      </div>
    </div>
  );
};

export default Downloade;
