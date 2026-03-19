import React, { useState, useEffect } from 'react'
import Sidebar from "../../Components/ui/Sidebar";
import Header from "../../Components/ui/Header";
import StatsCard from "../../Components/Dashboard/StatsCard";
import FacultyStatus from "../../Components/Dashboard/FacultyStatus";
import { dashboardSummaryAPI } from "../../api/api";
import QuickReport from '../../Components/Dashboard/QuickReport';

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
    <div className='flex h-screen w-full overflow-hidden bg-white'>
      {/* ✅ FIX: activeMenu aur setActiveMenu props pass kiye */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className='flex flex-col flex-1 min-w-0 overflow-hidden bg-white'>
        <Header />

        <div className='flex-1 p-4 overflow-hidden bg-white'>
          <div
            style={{
              borderRadius: "5px",
              border: "1px solid #BFBFBF",
              boxShadow: "0px 1px 4px 0px #00000040",
              background: "#FFFFFF", /* ✅ FIX: pure white */
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
                className="text-xs md:text-sm text-[#265768] max-w-3xl"
                style={{ fontFamily: "Mulish, sans-serif" }}
              >
                Your smart scheduling workspace is ready. Seamlessly manage
                departments, teachers, subjects, and classroom availability.
              </p>
            </section>

            {/* Main content: left column + FacultyStatus right */}
            <div className='flex-1 flex gap-17 2xl:gap-[28vh] min-h-0'>

              {/* Left: StatsCards + QuickReport */}
              <div className='flex-[3] flex flex-col gap-3 min-w-0 overflow-hidden'>

                {/* StatsCards */}
                <div
                  className='shrink-0'
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    gap: "0px"
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
                style={{ paddingRight: "clamp(8px, 1.5vw, 20px)" }}
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