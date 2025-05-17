import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MyActivities from "./pages/ActivityMe";
import ActivityHistory from "./pages/ActivityHistory";
import ActivityDetail from "./pages/ActivityDescript";
import Profile from "./pages/Profile";
import ActivityAll from "./pages/ActivityAll";
import DashboardStaff from "./pages/DashboardStaff";
import CreateActivity from "./pages/CreateActivity";
import ManageOverview from "./pages/ManageOverview";
import DashboardAdmin from "./pages/DashboardAdmin";
import ManagePetitionActivity from "./pages/ManagePetitionActivity";
import ManageRoleAdmin from "./pages/ManageRoleAdmin";
import OverallActivityAdmin from "./pages/OverallActivityAdmin";  

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
        <Route index element={<Dashboard />} />
        <Route path="/activityMe" element={<MyActivities />} />
        <Route path="/activityHistory" element={<ActivityHistory />} />
        <Route path="/activityDescript" element={<ActivityDetail />} />
        <Route path="/activityAll" element={<ActivityAll />} />
        <Route path="/Profile" element={<Profile />} />

        <Route path="/dashboardStaff" element={<DashboardStaff />} />
        <Route path="/createActivity" element={<CreateActivity />} />
        <Route path="/ManageOverview" element={<ManageOverview/>} />
        <Route path="/DashboardAdmin" element={<DashboardAdmin/>} />
        <Route path="/ManagePetitionActivity" element={<ManagePetitionActivity/>} />
        <Route path="/ManageRoleAdmin" element={<ManageRoleAdmin/>} />
        <Route path="/OverallActivityAdmin" element={<OverallActivityAdmin/>} />
      </Route>

      <Route path="*" element={<div>ไม่พบหน้านี้</div>} />
    </Routes>
  );
}

