import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth/authSlice";
import SearchBox from "../components/SearchBox";
import { useEffect, useState } from "react";
import Card from "../components/ui/card";
import axios from "axios";

// Define interfaces for API response
interface DashboardStats {
  total_activities: number;
  pending_count: number;
  approved_count: number;
  attended_count: number;
  rejected_count: number;
  total_points: number;
  total_hours: number;
}

interface Activity {
  registration_id: number;
  registration_status: string;
  activity_id: number;
  name: string;
  activity_type: string;
  activity_status: string;
  start_date: string;
  end_date: string;
  description?: string;
  location?: string;
}

interface UserProfile {
  id_user: number;
  student_id: string;
  role: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  volunteer_hours: number;
  volunteer_points: number;
  faculty_name: string;
  department_name: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: Activity[];
  upcomingActivities: Activity[];
  profile: UserProfile;
}

// Mock data to use if API fails (for development)
const mockLatestActivity = {
  image: "https://img5.pic.in.th/file/secure-sv1/mock-activity-image.jpeg",
  name: "กิจกรรมอาสาพัฒนาชุมชน",
  description: "เป็นกิจกรรมที่ให้นักศึกษาได้มีส่วนร่วมในการพัฒนาชุมชนท้องถิ่นให้มีความเป็นอยู่ที่ดีขึ้น",
  author: "ฝ่ายกิจกรรมนักศึกษา"
};

const mockLatestNotification = {
  datetime: "2025-05-17T14:30:00",
  status: "ผ่านกิจกรรม",
  activityName: "อาสาพัฒนาเพื่อน้อง",
  point: 75,
  hour: 12
};

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [latestActivity, setLatestActivity] = useState<any>(null);
  const [latestNotification, setLatestNotification] = useState<any>(null);
  
  const user = useAppSelector((state) => state.auth.currentUser);
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const response = await axios.get(`${baseURL}/student/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setDashboardData(response.data);
          // Since we now have real data, we can use the most recent activity for display
          if (response.data.recentActivities && response.data.recentActivities.length > 0) {
            const latest = response.data.recentActivities[0];
            setLatestActivity({
              image: "https://img5.pic.in.th/file/secure-sv1/mock-activity-image.jpeg", // Use a default image
              name: latest.name,
              description: latest.description || "กิจกรรมอาสาสมัคร",
              author: "เจ้าหน้าที่กิจกรรม"
            });
          } else {
            setLatestActivity(mockLatestActivity);
          }
          
          // Set a mock notification until we have real notification data
          setLatestNotification(mockLatestNotification);
        } else {
          setError("ไม่สามารถโหลดข้อมูลได้: " + response.data.message);
          // Set mock data as fallback
          setLatestActivity(mockLatestActivity);
          setLatestNotification(mockLatestNotification);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล โปรดลองอีกครั้งในภายหลัง");
        // Set mock data as fallback
        setLatestActivity(mockLatestActivity);
        setLatestNotification(mockLatestNotification);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [token]);

  return (
    <div>
      <div className="mb-9 flex justify-end px-9">
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-2xl font-semibold text-gray-600 dark:text-gray-300">กำลังโหลดข้อมูล...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl text-red-500 dark:text-red-400">{error}</div>
        </div>
      ) : (
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* ฝั่งซ้าย - หมวดกิจกรรม */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "อาสา", image: "/img/Card1.webp", points: dashboardData?.stats?.total_points || 0 },
            { title: "ช่วยงาน", image: "/img/Card2.webp", hours: dashboardData?.stats?.total_hours || 0 },
            { title: "อบรม", image: "/img/Card3.webp", count: dashboardData?.stats?.total_activities || 0 },
          ].map((item) => (
            <div
              key={item.title}
              onClick={() => navigate(`/activityMe?type=${encodeURIComponent(item.title)}`)}
              className="relative h-[280px] md:h-[320px] lg:h-[700px] rounded-xl overflow-hidden shadow group cursor-pointer"
            >
              {/* รูปหลัก */}
              <img
                src={item.image}
                alt={item.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />

              {/* overlay ดำ (หายตอน hover) */}
              <div className="absolute inset-0 bg-black/50 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

              {/* inner shadow อยู่ตลอด */}
              <div className="absolute inset-0 shadow-[inset_0_-121px_20px_0_rgba(0,0,0,0.6)] pointer-events-none" />

              {/* ข้อความบนรูป */}
              <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold drop-shadow-lg z-10">
                {item.title}
              </div>
              
              {/* Show stats (if available) */}
              {(item.points > 0 || item.hours > 0 || item.count > 0) && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold px-3 py-2 rounded-full z-10">
                  {item.points > 0 && `${item.points} คะแนน`}
                  {item.hours > 0 && `${item.hours} ชั่วโมง`}
                  {item.count > 0 && `${item.count} กิจกรรม`}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ฝั่งขวา */}
        <div className="space-y-6">
          {/* Profile Summary */}
          {dashboardData?.profile && (
            <Card className="p-4 bg-gradient-to-br to-white dark:from-gray-800 dark:to-gray-900 border">
              <h2 className="text-xl font-bold mb-3">ข้อมูลนักศึกษา</h2>
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="https://img5.pic.in.th/file/secure-sv1/-296c6d1e9173abeb2.jpg"
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-yellow-400"
                />
                <div>
                  <p className="font-semibold">{dashboardData.profile.first_name} {dashboardData.profile.last_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{dashboardData.profile.student_id}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">คณะ:</span> {dashboardData.profile.faculty_name}</p>
                <p><span className="font-medium">สาขา:</span> {dashboardData.profile.department_name}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <div>
                    <span className="text-purple-600 font-bold">{dashboardData.profile.volunteer_points || 0}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">คะแนน</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-bold">{dashboardData.profile.volunteer_hours || 0}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">ชั่วโมง</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* การแจ้งเตือนล่าสุด */}
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-3">การแจ้งเตือนล่าสุดของฉัน</h2>
            {latestNotification ? (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  วันที่ {new Date(latestNotification.datetime).toLocaleString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
                <p className="text-sm">
                  <span className={`font-semibold ${latestNotification.status === "ผ่านกิจกรรม" ? "text-green-600" : "text-red-600"}`}>
                    {latestNotification.status}
                  </span>{" "}
                  "{latestNotification.activityName}"
                </p>
                <div className="flex gap-2 text-sm font-medium">
                  <span className="text-purple-500">+{latestNotification.point} คะแนน</span>
                  <span className="text-blue-500">+{latestNotification.hour} ชั่วโมง</span>
                </div>
              </div>
            ) : (
              <p>กำลังโหลดข้อมูลแจ้งเตือนล่าสุด...</p>
            )}
          </Card>

          {/* กิจกรรมที่กำลังจะมาถึง */}
          {dashboardData?.upcomingActivities && dashboardData.upcomingActivities.length > 0 && (
            <Card className="p-4">
              <h2 className="text-xl font-bold mb-3">กิจกรรมที่กำลังจะมาถึง</h2>
              <div className="space-y-3">
                {dashboardData.upcomingActivities.map((activity) => (
                  <div key={activity.registration_id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <div className="font-medium text-md">{activity.name}</div>
                    <div className="text-sm text-gray-500 flex justify-between mt-1">
                      <span>เริ่มวันที่: {new Date(activity.start_date).toLocaleDateString("th-TH")}</span>
                      <span className="text-yellow-600 font-medium">{activity.activity_type}</span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate("/activityMe")}
                  className="w-full text-yellow-600 hover:text-yellow-700 font-medium text-sm">
                  ดูทั้งหมด →
                </button>
              </div>
            </Card>
          )}

          {/* สถิติกิจกรรม */}
          {dashboardData?.stats && (
            <Card className="p-4">
              <h2 className="text-xl font-bold mb-3">สถิติกิจกรรมของฉัน</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dashboardData.stats.total_activities}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">กิจกรรมทั้งหมด</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{dashboardData.stats.attended_count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">กิจกรรมที่ผ่าน</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dashboardData.stats.pending_count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">รอการอนุมัติ</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{dashboardData.stats.approved_count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ได้รับอนุมัติ</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      )}
    </div>
  );
}