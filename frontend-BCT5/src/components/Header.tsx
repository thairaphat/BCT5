import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { MdLightMode } from "react-icons/md";

export default function Header() {
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"user" | "staff">("user");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });

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

  return (
    <header className="bg-primary text-white dark:bg-[#1f1f1f] dark:text-primary shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="https://img5.pic.in.th/file/secure-sv1/1-01c3495c35b599cc7c.png" alt="logo" className="w-12 pt-2" />
          <div className="text-xl font-bold">VolunteerHub</div>
        </div>

        <nav className="hidden md:flex space-x-6 font-semibold">
          <a href="/" className="hover:underline">หน้าแรก</a>
          <a href="/activityMe" className="hover:underline">กิจกรรม</a>
        </nav>

        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="hidden md:flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-md font-medium"
          >
            <img src={user1.avatar} alt="avatar" className="w-8 h-8 rounded-full border-2 border-blue-500" />
            บัญชีของฉัน <FiChevronDown />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-lg z-50">
              <div className="p-4 border-b text-center">
                <img src={user1.avatar} alt="avatar" className="w-20 h-20 rounded-full mx-auto" />
                <div className="font-bold text-lg mt-2">{user1.nameTH}</div>
              </div>
              <div className="p-4 space-y-3 border-b">
                {['user', 'staff'].map((role) => (
                  <a
                    key={role}
                    href="#"
                    onClick={() => setActiveRole(role as typeof activeRole)}
                    className={`flex items-center p-2 rounded-3xl ${activeRole === role ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    <div className="pl-3">
                      <div className={`font-bold ${activeRole === role ? "text-white" : "text-black dark:text-white"}`}>{role === "user" ? "ผู้ใช้งาน" : "เจ้าหน้าที่"}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="p-4 space-y-3">
                <button
                  onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                  className="flex items-center justify-between w-full hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md"
                >
                  <span className="font-medium">การตั้งค่ารูปลักษณ์</span>
                  <MdLightMode className="text-xl bg-primary rounded-full" />
                </button>

                {isThemeDropdownOpen && (
                  <ul className="bg-white dark:bg-gray-700 rounded-md text-sm mt-1 border">
                    <li
                      onClick={() => { setTheme('light'); setIsThemeDropdownOpen(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${theme === 'light' ? 'text-blue-600 font-semibold' : ''}`}
                    >
                      โหมดสีสว่าง {theme === 'light' && '✓'}
                    </li>
                    <li
                      onClick={() => { setTheme('dark'); setIsThemeDropdownOpen(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${theme === 'dark' ? 'text-blue-600 font-semibold' : ''}`}
                    >
                      โหมดสีมืด {theme === 'dark' && '✓'}
                    </li>
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
            <img src={user1.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-blue-500" />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white font-bold">
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-800 text-primary font-semibold">
          <a href="#" className="block pt-2">Home</a>
          <a href="#" className="block">About</a>
        </nav>
      )}
    </header>
  );
}