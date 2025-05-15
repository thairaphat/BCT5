import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// หน้าหลักหลัง login
function HomePage() {
  return <div>🎉 ยินดีต้อนรับเข้าสู่ระบบ!</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        {/* เพิ่มหน้าอื่นๆ ได้ที่นี่ เช่น <Route path="dashboard" element={<Dashboard />} /> */}
      </Route>

      <Route path="*" element={<div>ไม่พบหน้านี้</div>} />
    </Routes>
  );
}
