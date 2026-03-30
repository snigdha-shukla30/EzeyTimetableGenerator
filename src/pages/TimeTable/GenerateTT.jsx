import React, { useState } from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "../../components/ui/Header";
import { CardContainer } from "../../components/ui/Card";
import TimetableContent from "../../components/Timetable/GenerateTTContent";

const GenerateTimetablePage = () => {
  const [activeMenu, setActiveMenu] = useState("timetable");

  return (
    <div
      className="min-h-screen h-screen bg-[#FFFFFF] flex px-2 py-5 gap-4 overflow-hidden"
      style={{ fontFamily: "Mulish, sans-serif" }}
    >
      {/* Sidebar */}
      <div className="shrink-0">
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-2">
        <div className="w-full flex-1 flex flex-col space-y-2 overflow-hidden">
          {/* Header */}
          <div className="w-full bg-white border border-[#BFBFBF] rounded-[10px] px-6 py-3 shadow-[0_4px_14px_rgba(148,163,184,0.18)] flex items-center gap-6">
            <Header />
          </div>

          {/* Body Wrapper */}
          <CardContainer className="flex-1 flex flex-col pb-0">
            {/* Title Section */}
            <section className="mb-4 flex items-start justify-between gap-8">
              <div>
                <h1 className="text-[32px] leading-tight font-semibold text-[#265768]/90 mb-1">
                  Generate Timetable
                </h1>
                <p className="text-sm text-[#265768]/50 max-w-3xl">
                  Generate and preview timetables using batch ID
                </p>
              </div>
            </section>

            <TimetableContent />
          </CardContainer>
        </div>
      </div>
    </div>
  );
};

export default GenerateTimetablePage;
