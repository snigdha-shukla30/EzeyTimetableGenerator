import React, { useState, useEffect } from 'react'
import Sidebar from "../../components/ui/Sidebar";
import Header from "../../components/ui/Header";
import StatsCard from "../../components/Dashboard/StatsCard";
import FacultyStatus from "../../components/Dashboard/FacultyStatus";
import { dashboardSummaryAPI } from "../../services/api";
import QuickReport from '../../components/Dashboard/QuickReport';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchDashboardData = async () => {
      try {
        const res = await dashboardSummaryAPI();
        setDashboardData(res.data ?? res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = dashboardData
    ? [
      { label: "Classroom", count: dashboardData.totalClassrooms, imageUrl: "/classroom.webp" },
      { label: "Subjects", count: dashboardData.totalSubjects, imageUrl: "/subjects.webp" },
      { label: "Faculty", count: dashboardData.totalFaculties, imageUrl: "/faculty.webp" },
      { label: "Time Tables", count: dashboardData.totalApprovedTimetables, imageUrl: "/timetable.webp" },
    ]
    : [];

  return (
    <div className='flex h-screen w-full overflow-hidden bg-[#BFBFBF]'>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className='flex flex-col flex-1 min-w-0 overflow-hidden bg-white'>
        <Header />

        <div className='flex-1 p-4 overflow-hidden bg-white'>
          <div
            style={{
              borderRadius: "5px",
              border: "2px solid #BFBFBF",
              boxShadow: "0px 1px 4px 0px #00000040",
              background: "rgba(191, 191, 191, 0.1)",
              padding: "20px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflow: "hidden",
            }}
          >
            {/* Welcome Section */}
            <section className="shrink-0">
              <h1
                className="text-[22px] md:text-[26px] lg:text-[32px] leading-tight font-bold text-[#265768] mb-1"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Welcome back, {user?.name || "User"}!
              </h1>
              <p
                className="text-xs md:text-sm ml-1 text-[#26576880] mt-1 max-w-3xl"
                style={{ fontFamily: "Mulish, sans-serif" }}
              >
                Your smart scheduling workspace is ready.{" "}
                <br />
                Seamlessly manage departments, teachers, subjects, and classroom availability.
              </p>
            </section>

            {/* Main content: left column + FacultyStatus right */}
            <div className='flex-1 flex gap-17 2xl:gap-[28vh] min-h-0'>

              {/* Left: StatsCards + QuickReport */}
              <div className='flex-[3] flex flex-col gap-0 min-w-0 overflow-hidden'>

                {/* StatsCards */}
                <div
                  className='shrink-0'
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    gap: "0px",
                    marginTop: "18px"
                  }}
                >
                  {stats.map((item, index) => (
                    <div key={index} style={{ flex: "1 1 0", minWidth: 0 }}>
                      <StatsCard {...item} />
                    </div>
                  ))}
                </div>

                {/* QuickReport */}
                <div className='flex-1 min-h-0 pr-5.5 2xl:pr-14'>
                  <QuickReport quickReport={dashboardData?.quickReport} />
                </div>
              </div>

              {/* Right: FacultyStatus */}
              <div
                className='min-w-0 min-h-0 flex items-start'
                style={{ paddingRight: "clamp(8px, 1.5vw, 20px)", marginTop: "18px" }}
              >
                <FacultyStatus />
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;













// import React, { useEffect, useState } from "react";
// import Sidebar from "../../components/ui/Sidebar";
// import Header from "../../components/ui/Header";
// import StatsCard from "../../components/Dashboard/StatsCard";
// import QuickReport from "../../components/Dashboard/QuickReport";
// import UploadLoadset from "../../components/Dashboard/UploadLoadset";
// import FacultyStatus from "../../components/Dashboard/FacultyStatus";
// import { dashboardSummaryAPI } from "../../services/api";



// const Dashboard = () => {
//   const [activeMenu, setActiveMenu] = useState("dashboard");
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [user, setUser] = useState(null);

//   useEffect(() => {

//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const res = await dashboardSummaryAPI();
//         setDashboardData(res.data ?? res);
//       } catch (err) {
//         setError(err.message || "Failed to load dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const stats = dashboardData
//     ? [
//       {
//         label: "Classroom",
//         count: dashboardData.totalClassrooms,
//         imageUrl:
//           "/classroom.webp",
//       },
//       {
//         label: "Subjects",
//         count: dashboardData.totalSubjects,
//         imageUrl:
//           "/subjects.webp",
//       },
//       {
//         label: "Faculty",
//         count: dashboardData.totalFaculties,
//         imageUrl:
//           "/faculty.webp",
//       },
//       {
//         label: "Time Tables",
//         count: dashboardData.totalApprovedTimetables,
//         imageUrl:
//           "/timetable.webp",
//       },
//     ]
//     : [

//     ];

//   return (
//     // <div className="min-h-screen h-screen bg-[#FFFFFF] flex px-2 py-4 gap-4 overflow-hidden" style={{ fontFamily: 'Mulish, sans-serif' }}>
//     <div className="h-screen bg-[#FFFFFF] flex px-2 pt-4 gap-4  overflow-hidden" style={{ fontFamily: 'Mulish, sans-serif' }}>

//       <div className="shrink-0">
//         <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
//       </div>

//       <div className="flex-1 flex pt-2 overflow-y-auto">
//         <div className="w-full max-w-[1170px] space-y-2">
//           <div className="w-full bg-white border border-[#BFBFBF] rounded-[10px] px-6 py-3 shadow-[0_4px_14px_rgba(148,163,184,0.18)] flex items-center gap-6">
//             <Header />
//           </div>

//           <div className="w-full bg-white rounded-[10px] border border-[#BFBFBF] shadow-[0_16px_40px_rgba(148,163,184,0.22)] px-8 py-8">
//             {loading && <p className="text-center mt-10">Loading dashboard...</p>}
//             {error && <p className="text-center text-red-500">{error}</p>}

//             {!loading && (
//               <>
//                 <section className="mb-6 flex items-start justify-between gap-8 ">
//                   <div>
//                     <h1 className="text-[32px] leading-tight font-bold text-[#265768] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
//                       Welcome back, {user?.name || "User"}!
//                     </h1>
//                     <p className="text-sm text-[#265768] max-w-3xl" style={{ fontFamily: 'Mulish, sans-serif' }}>
//                       Your smart scheduling workspace is ready. Seamlessly manage
//                       departments, teachers, subjects, and classroom availability.
//                     </p>
//                   </div>


//                 </section>

//                 <section className="flex items-start justify-end gap-6 mb-15">
//                   <div className="flex gap-5">
//                     {stats.map((item, index) => (
//                       <StatsCard key={index} {...item} />
//                     ))}
//                   </div>

//                   <FacultyStatus
//                     facultyList={dashboardData?.facultyList}
//                     totalFaculties={dashboardData?.totalFaculties}
//                   />
//                 </section>

//                 <section className="flex items-start gap-15 mt-[-315px] mb-0.1">
//                   <QuickReport quickReport={dashboardData?.quickReport} />
//                   <UploadLoadset />
//                 </section>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




