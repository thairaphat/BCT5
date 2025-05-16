// components/Header.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth/authSlice";
import { useState } from "react";
import { FiMenu, FiX, FiBell, FiChevronDown} from "react-icons/fi";
import { MdLightMode } from "react-icons/md";
import logo from '../assets/dd1.png';

export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.currentUser);

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [activeRole, setActiveRole] = useState<"user" | "staff">("user");

    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const [theme, setTheme] = useState< 'light' | 'dark'>('light');


    const user1 = {
      nameTH: "นายเอกภาพ มิ่งศรีสุข",
      nameEN: "Mr. EAKKAPAP MINGSISUK",
      status: "นิสิต",
      avatar: "https://img5.pic.in.th/file/secure-sv1/-296c6d1e9173abeb2.jpg", // เปลี่ยนเป็น URL จริง
    };

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/login");
    };

    return (
      <header className="bg-[#FBBD04] shadow-md">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="https://img5.pic.in.th/file/secure-sv1/1-01c3495c35b599cc7c.png" alt="logo" className=" w-12 pt-2"/>
            <div className="text-xl font-bold text-white">VolunteerHub</div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 text-white font-semibold">
            <a href="/" className="hover:bg-transparent">หน้าแรก</a>
            <a href="/activityMe" className="hover:">กิจกรรม</a>
          </nav>
                
          <div className="relative">
            {/* ✅ ปุ่ม desktop: กล่องขาว + avatar + ข้อความ */}
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="hidden md:flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-md font-medium"
            >
              <img
                src={user1.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full border-2 border-blue-500"
              />
              บัญชีของฉัน
              <FiChevronDown />
            </button>

            {/* ✅ Dropdown menu (ใช้ร่วมกันได้) */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
                <div className="p-4 border-b text-center">
                  <img
                    src={user1.avatar}
                    alt="avatar"
                    className="w-20 h-20 rounded-full mx-auto"
                  />
                  <div className="font-bold text-lg mt-2">{user1.nameTH}</div>
                </div>
                <div className="p-4 space-y-3 border-b">
                  {/* บทบาท: ผู้ใช้งาน */}
                  <a
                    href="#"
                    onClick={() => setActiveRole("user")}
                    className={`flex items-center space-x-3 p-2 rounded-3xl transition-all ${
                      activeRole === "user" ? "bg-primary text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="pl-3 flex">
                      <div className={`font-bold ${activeRole === "user" ? "text-white" : "text-black"}`}>
                        ผู้ใช้งาน
                      </div>
                      <div className={`text-sm font-bold pt-0.5 pl-1 ${activeRole === "user" ? "text-white/80" : "text-gray-500"}`}>
                        User
                      </div>
                    </div>
                  </a>
                  
                  {/* บทบาท: เจ้าหน้าที่ */}
                  <a
                    href="#"
                    onClick={() => setActiveRole("staff")}
                    className={`flex items-center space-x-3 p-2 rounded-3xl transition-all ${
                      activeRole === "staff" ? "bg-primary text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="pl-3 flex">
                      <div className={`font-bold ${activeRole === "staff" ? "text-white" : "text-black"}`}>
                        เจ้าหน้าที่
                      </div>
                      <div className={`text-sm font-bold pt-0.5 pl-1 ${activeRole === "staff" ? "text-white/80" : "text-gray-500"}`}>
                        Staff
                      </div>
                    </div>
                  </a>
                </div>

                <div className="p-4 space-y-3">
                  <a href="#" className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md">
                    <div className="flex">
                      <div className="font-medium">การแจ้งเตือน</div>
                      <div className="bg-red-500 rounded-full ml-1 text-white px-1 font-bold text-xs pt-1">100</div>
                    </div>
                  </a>
                  <div className="relative">
                    <button
                      onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                      className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md w-full"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">การตั้งค่ารูปลักษณ์</span>
                        <MdLightMode className="ml-2 bg-primary rounded-full text-xl" />
                      </div>
                    </button>

                    {isThemeDropdownOpen && (
                      <div className="absolute right-0 mt-1 w-full bg-white rounded-md shadow z-50 border">
                        <ul className="text-sm">
                          <li
                            onClick={() => { setTheme('light'); setIsThemeDropdownOpen(false); }}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${theme === 'light' ? 'text-blue-600 font-semibold' : ''}`}
                          >
                            โหมดสีสว่าง {theme === 'light' && '✓'}
                          </li>
                          <li
                            onClick={() => { setTheme('dark'); setIsThemeDropdownOpen(false); }}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${theme === 'dark' ? 'text-blue-600 font-semibold' : ''}`}
                          >
                            โหมดสีมืด {theme === 'dark' && '✓'}
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <button onClick={handleLogout} className="w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-50">
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Avatar + Hamburger Menu (mobile only) */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Avatar */}
            <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
              <img
                src={user1.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
            </button>

            {/* Hamburger */}
            <button
              className="text-white font-bold"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden px-4 pb-4 space-y-2 bg-white text-primary font-semibold">
            <a href="#" className="block pt-2">Home</a>
            <a href="#" className="block">About</a>
          </nav>
        )}
      </header>
    );
}
