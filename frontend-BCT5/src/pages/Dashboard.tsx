import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/auth/authSlice";
import SearchBox from "../components/SearchBox";
import { useState } from "react";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="">
      <div className="mb-9 flex justify-end px-9">
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
      </div>
      <h1 className="text-2xl font-bold mb-4">ยินดีต้อนรับสู่ Dashboard</h1>
    </div>
  );
}
