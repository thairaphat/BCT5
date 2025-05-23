import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth/authSlice";
import { useState } from "react";
import Header from "./Header";
import { FiMenu, FiX } from "react-icons/fi";

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const user = useAppSelector((state) => state.auth.currentUser);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#181818] dark:text-white transition-colors duration-300">
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}