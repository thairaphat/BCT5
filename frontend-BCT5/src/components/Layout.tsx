import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth/authSlice";

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.currentUser);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">MyApp</span>
        <div className="flex items-center space-x-4">
          {user && <span>👋 สวัสดี, {user.name}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            ออกจากระบบ
          </button>
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
