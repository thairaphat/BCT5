import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/auth/authSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login"); // ✅ redirect กลับไปหน้า login
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ยินดีต้อนรับสู่ Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}
