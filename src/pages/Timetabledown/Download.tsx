import React from "react";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Timetabledown from "../../components/Timetabeldown/Timetabeldown";

const Downloade = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <Timetabledown />
      </div>
    </div>
  );
};

export default Downloade;
