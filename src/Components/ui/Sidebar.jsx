import React, { useEffect, useState } from "react";
import { Home, FileText, Calendar, LogOut, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutAPI } from "../../api/api";

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [timetableOpen, setTimetableOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const mainMenu = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "dataentry", label: "Data Entry", icon: FileText, path: "/dataentry" },
    {
      id: "timetable",
      label: "Time Table",
      icon: Calendar,
      path: "/generate",
      subMenu: [
        { id: "room", label: "Room", path: "/generate/room" },
        { id: "faculty", label: "Faculty", path: "/generate/faculty" },
        { id: "student", label: "Student", path: "/generate/student" },
      ],
    },
  ];

  const handleMenuClick = (item) => {
    if (item.subMenu) {
      setTimetableOpen((prev) => !prev);
      setActiveMenu(item.id);
    } else {
      setActiveMenu(item.id);
      setTimetableOpen(false);
      setActiveSubMenu(null);
      navigate(item.path);
    }
  };

  const handleSubMenuClick = (sub) => {
    setActiveSubMenu(sub.id);
    navigate(sub.path);
  };

  // ✅ LOGOUT MAPPING (backend + local clear)
  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = activeMenu === item.id;
    const hasSubMenu = !!item.subMenu;
    const isOpen = hasSubMenu && timetableOpen;

    return (
      <div
        key={item.id}
        className={`${isOpen ? "rounded-xl mb-2" : ""}`}
        style={isOpen ? { background: "#F9F9F94D" } : {}}
      >
        <button
          onClick={() => handleMenuClick(item)}
          className={`relative w-full flex items-center gap-2 py-3 ${!isOpen ? "mb-2" : ""}
          transition-[transform,background,box-shadow,color] duration-300 ease-out
          ${isActive
              ? "text-white pl-5 pr-5 ml-[-16px] w-[calc(100%+16px)] rounded-xl rounded-l-none scale-[1.01] overflow-hidden"
              : "text-white/55 hover:text-white/85 hover:bg-white/10 hover:translate-x-[2px] px-5 rounded-xl"
            }`}
          style={
            isActive
              ? {
                background: "linear-gradient(272deg, #167291 0%, #8B7EFF 80%)",
              }
              : {}
          }
        >
          {/* Active purple strip (left edge touch) */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[8px] h-10 rounded-r-full bg-[#6D63FF] z-20" />
          )}

          {/* Right side fade overlay */}
          {isActive && (
            <span
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0) 45%, rgba(15,128,156,0.35) 78%, rgba(15,128,156,0.9) 100%)",
              }}
            />
          )}

          <Icon size={18} className="relative z-30" />

          <span
            className={`relative z-30 flex-1 truncate text-left ${isActive ? "text-white" : "text-white/55"}`}
            style={{
              fontFamily: "Mulish, sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "150%",
            }}
          >
            {item.label}
          </span>

          {/* Chevron for submenu items */}
          {hasSubMenu && (
            <span className="relative z-30 ml-auto">
              {timetableOpen ? (
                <ChevronUp size={16} className={isActive ? "text-white" : "text-white/55"} />
              ) : (
                <ChevronDown size={16} className={isActive ? "text-white" : "text-white/55"} />
              )}
            </span>
          )}
        </button>

        {/* Submenu */}
        {isOpen && (
          <div
            className="px-3 pb-0 overflow-hidden"
            style={{ animation: "slideDown 0.25s ease-out" }}
          >
            {/* pl-7: line ko right ki taraf extend karta hai */}
            {/* my-1: line ki height choti ho rhi hai */}
            <div className="border-l-2 border-white/90 pl-5 ml-10 my-3">
              {item.subMenu.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubMenuClick(sub)}
                  className={`w-full text-left py-1 px-2 mb-0.5 transition-all duration-200
                    ${activeSubMenu === sub.id
                      ? "text-[#265768]" /* active: sirf #265768 text color, koi bg nahi */
                      : "text-white/55 hover:text-[#265768]/85" /* inactive: hover bg hata diya */
                    }`}
                  style={{
                    fontFamily: "Mulish, sans-serif",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "150%",
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <aside
        className="
          relative
          w-64
          h-[calc(100vh-1rem)]
          mt-2 mb-2 ml-4
          rounded-[10px]
          bg-gradient-to-b from-[#0F809C] via-[#167291] to-[#174264]
          shadow-[0_10px_30px_rgba(0,0,0,0.20)]
          flex flex-col justify-between
          pt-5 pb-4
        "
        style={{ fontFamily: "Mulish, sans-serif" }}
      >
        {/* TOP SECTION */}
        <div className="px-4">
          {/* Ezey Text */}
          <div
            className="text-white text-center mb-10 mt-4"
            style={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              fontSize: "32px",
              lineHeight: "120%",
            }}
          >
            Ezey
          </div>

          <div className="text-[11px] uppercase tracking-[0.18em] text-white/65 mb-3 ml-1">
            Menu
          </div>

          {mainMenu.map(renderItem)}
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-2">
          {/* Full width divider line */}
          <div className="w-full border-t border-1 border-white/40" />

          <div className="px-4 pt-4 pb-2 shadow-[0_-12px_20px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-4 py-1">
              {/* Left: user info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="rounded-full overflow-hidden border border-white/90 flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "37px",
                    borderRadius: "57.86px",
                    opacity: 1,
                  }}
                >
                  <img
                    src="/profile.jpg"
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center gap-0.5 min-w-0">
                  <div
                    className="text-white whitespace-nowrap mb-1"
                    style={{
                      fontFamily: "Mulish, sans-serif",
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "150%",
                      height: "12px",
                      opacity: 1,
                    }}
                  >
                    {user?.name || "User"}
                  </div>

                  <div
                    className="text-white w-full truncate"
                    style={{
                      fontFamily: "Mulish, sans-serif",
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "150%",
                    }}
                    title={user?.email || "user@email.com"}
                  >
                    {user?.email || "user@email.com"}
                  </div>
                </div>
              </div>

              {/* Logout icon */}
              <button
                onClick={handleLogout}
                className="text-white/90 hover:text-white transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;