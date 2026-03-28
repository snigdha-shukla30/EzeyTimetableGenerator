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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await dashboardSummaryAPI();
        setDashboardData(res.data ?? res);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
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
    <div className='flex h-screen w-full ' style={{ fontFamily: "Mulish, sans-serif" }}>
      {/* Sidebar */}
      <div className='shrink-0'>
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>

      {/* Main Content - No Scroll */}
      <div className='flex flex-col flex-1 min-w-0 h-screen border-b border-[#E8E8E8]'>
        {/* Header - Fixed Height */}
        <div className='shrink-0 bg-white px-8 py-4'>
          <Header />
        </div>

        {/* Content Area - No Scroll */}
        <div className='flex-1 px-8 py-4 overflow-hidden bg-[#F5F5F5] ml-10 mr-10 mb-7 rounded-lg '>
          <div className='h-full flex flex-col'>
            {loading && (
              <div className='flex items-center justify-center h-full'>
                <p className='text-gray-500'>Loading dashboard...</p>
              </div>
            )}

            {error && (
              <div className='bg-red-50 border border-red-200 rounded p-3 mb-3'>
                <p className='text-red-600 text-sm'>{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Welcome Section */}
                <div className='shrink-0 mb-3'>
                  <h1
                    className='text-2xl font-bold text-[#265768]'
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Welcome back, {user?.name || "User"}!
                  </h1>
                  <p className='text-xs text-[#8B8B8B] mt-1'>
                    Your smart scheduling workspace is ready.<br />
                    Seamlessly manage departments, teachers, subjects, and classroom availability.
                  </p>
                </div>

                {/* Main Grid */}
                <div className='flex-1 flex flex-col lg:flex-row gap-3 min-h-0'>

                  {/* Left Column */}
                  <div className='flex-[2] flex flex-col gap-3 min-h-0'>
                    {/* Stats Cards */}
                    <div className='shrink-0 flex gap-2 mt-2'>
                      {stats.map((item, index) => (
                        <div key={index} className='flex-1'>
                          <StatsCard {...item} />
                        </div>
                      ))}
                    </div>

                    {/* QuickReport */}
                    <QuickReport quickReport={dashboardData?.quickReport} />
                  </div>

                  {/* Right Column - Faculty Status (Responsive) */}
                  <div className='w-full lg:w-[35%] min-h-[400px]   rounded-lg  p-4 ml-0 lg:ml-4'>
                    <FacultyStatus
                      facultyList={dashboardData?.facultyList}
                      totalFaculties={dashboardData?.totalFaculties}
                    />
                  </div>

                </div>
              </>
            )}
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




