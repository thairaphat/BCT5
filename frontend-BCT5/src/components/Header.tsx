import { useState, useEffect, useRef } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth/authSlice";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { MdLightMode } from "react-icons/md";

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"user" | "staff">("user");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  
  const [activityDropdownOpen, setActivityDropdownOpen] = useState(false);
  const activityDropdownRef = useRef<HTMLDivElement>(null);

  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const pagesDropdownRef = useRef<HTMLDivElement>(null);

   // ปิด dropdown ถ้าคลิกนอก สำหรับทั้งสอง dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        activityDropdownRef.current &&
        !activityDropdownRef.current.contains(event.target as Node)
      ) {
        setActivityDropdownOpen(false);
      }
      if (
        pagesDropdownRef.current &&
        !pagesDropdownRef.current.contains(event.target as Node)
      ) {
        setPagesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ปิด dropdown ถ้าคลิกรอบนอก (optional)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const user1 = {
    nameTH: "นายเอกภาพ มิ่งศรีสุข",
    avatar: "https://img5.pic.in.th/file/secure-sv1/-296c6d1e9173abeb2.jpg",
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-[#FBC700] dark:bg-[#1a1a1a] shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="https://img5.pic.in.th/file/secure-sv1/1-01c3495c35b599cc7c.png"
            alt="logo"
            className="w-10"
          />
          <div className="text-xl font-bold text-white dark:text-yellow-400">
            VolunteerHub
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-white dark:text-yellow-400 font-semibold">
      <a className="cursor-pointer" onClick={() => navigate("/")}>
        หน้าแรก
      </a>

      <div className="relative" ref={dropdownRef}>
        <button
          className="cursor-pointer focus:outline-none"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          กิจกรรม ▼
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
            <a
              onClick={() => {
                navigate("/activityMe");
                setDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              กิจกรรมของฉัน
            </a>
            <a
              onClick={() => {
                navigate("/activityAll");
                setDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              กิจกรรมทั้งหมด
            </a>
            <a
              onClick={() => {
                navigate("/activityHistory");
                setDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              ประวัติกิจกรรม
            </a>
          </div>
        )}
      </div>
      {/* ปุ่ม หน้าทั้งหมด */}
      <div className="relative" ref={pagesDropdownRef}>
        <button
          className="cursor-pointer focus:outline-none"
          onClick={() => setPagesDropdownOpen((prev) => !prev)}
        >
          หน้าทั้งหมด ▼
        </button>

        {pagesDropdownOpen && (
          <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
            <a
              onClick={() => {
                navigate("/activityMe");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              MyActivities
            </a>
            <a
              onClick={() => {
                navigate("/activityHistory");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              ActivityHistory
            </a>
            <a
              onClick={() => {
                navigate("/activityDescript");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              ActivityDetail
            </a>
            <a
              onClick={() => {
                navigate("/activityAll");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              ActivityAll
            </a>
            <a
              onClick={() => {
                navigate("/Profile");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              Profile
            </a>
            <a
              onClick={() => {
                navigate("/dashboardStaff");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              DashboardStaff
            </a>
            <a
              onClick={() => {
                navigate("/createActivity");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              CreateActivity
            </a>
            <a
              onClick={() => {
                navigate("/ManageOverview");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              ManageOverview
            </a>
            <a
              onClick={() => {
                navigate("/DashboardAdmin");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              DashboardAdmin
            </a>
            <a
              onClick={() => {
                navigate("/ManagePetitionActivity");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              ManagePetitionActivity
            </a>
            <a
              onClick={() => {
                navigate("/ManageRoleAdmin");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              ManageRoleAdmin
            </a>
            <a
              onClick={() => {
                navigate("/OverallActivityAdmin");
                setPagesDropdownOpen(false);
              }}
              className="block px-4 py-2 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              OverallActivityAdmin
            </a>
          </div>
        )}
      </div>
      
    </nav>

        {/* Account Button */}
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-md border shadow-sm font-medium
              ${theme === "dark"
                ? "bg-[#1a1a1a] text-white border-gray-700"
                : "bg-white text-yellow-600 border-gray-300"}`}
          >
            <img
              src={user1.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full border-2 border-yellow-600"
            />
            บัญชีของฉัน
            <FiChevronDown />
          </button>

          {isUserDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-80 z-50 rounded-xl shadow-xl border 
  ${theme === "dark" ? "bg-[#1a1a1a] text-white border-gray-700" : "bg-white text-black border-gray-200"}`}>

  {/* Profile */}
  <a onClick={() => navigate('/Profile')}>
    <div className="p-5 text-center border-b">
      <img src={user1.avatar} alt="avatar" className="w-20 h-20 rounded-full mx-auto border-4 border-yellow-400 shadow" />
      <div className="font-semibold text-lg mt-3">{user1.nameTH}</div>
    </div>
  </a>

  {/* Roles */}
  <div className="flex flex-col gap-2 px-5 py-4 border-b">
    <span className="text-sm text-gray-500 dark:text-gray-400">บทบาทของคุณ</span>
    {["user", "staff"].map((role) => (
      <button
        key={role}
        onClick={() => setActiveRole(role as "user" | "staff")}
        className={`w-full py-2 rounded-full transition-all font-semibold shadow-sm 
          ${activeRole === role
            ? "bg-yellow-400 text-white"
            : theme === "dark"
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-gray-100 text-black hover:bg-gray-200"}`}
      >
        {role === "user" ? "ผู้ใช้งาน User" : "เจ้าหน้าที่ Staff"}
      </button>
    ))}
  </div>

  {/* Appearance */}
  <div className="px-5 py-4 border-b space-y-3">
    <div className="flex items-center justify-between">
      <span className="font-medium">การตั้งค่ารูปลักษณ์</span>
      <MdLightMode className="text-xl text-yellow-400" />
    </div>

    <div className="space-y-1 text-sm">
      <button
        onClick={() => setTheme("light")}
        className={`w-full text-left px-3 py-1.5 rounded-md transition-all 
          ${theme === "light" ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      >
        โหมดสีสว่าง {theme === "light" && "✓"}
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`w-full text-left px-3 py-1.5 rounded-md transition-all 
          ${theme === "dark" ? "bg-blue-100 dark:bg-blue-900 text-blue-400 font-semibold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      >
        โหมดสีมืด {theme === "dark" && "✓"}
      </button>
    </div>
  </div>

  {/* Logout */}
  <div className="px-5 py-4">
    <button
      onClick={handleLogout}
      className="w-full py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-600 dark:text-white font-semibold transition"
    >
      ออกจากระบบ
    </button>
  </div>
</div>
            
          )}
        </div>
      </div>
    </header>
  );
}