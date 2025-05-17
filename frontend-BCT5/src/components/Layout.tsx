import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth/authSlice";
import { useState } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
import Header from "./Header";

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
    <div>
      <Header />
      {/* Main content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
