import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/auth/authSlice";
import SearchBox from "../components/SearchBox";
import { useEffect, useState } from "react";
import Card from "../components/ui/card";
import axios from "axios";

interface LatestActivity {
  image: string;
  name: string;
  description: string;
  author: string;
}

interface Notification {
  datetime: string;     // เช่น "2025-05-14T20:57:34"
  status: string;       // เช่น "ผ่านกิจกรรม"
  activityName: string; // เช่น "รู้ทันภัยพิบัติ: น้ำท่วมและการรับมือในเขตเมือง"
  point: number;        // เช่น 75 คะแนน
  hour: number;         // เช่น 12 ชั่วโมง
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [latestActivity, setLatestActivity] = useState<LatestActivity | null>(null);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    async function fetchLatestActivity() {
      try {
        const response = await axios.get("/api/latestActivity");
        setLatestActivity(response.data.latestActivity);
      } catch (error) {
        console.error("Failed to fetch latest activity", error);
      }
    }
    fetchLatestActivity();
  }, []);

  useEffect(() => {
    async function fetchLatestData() {
      try {
        const [activityRes, notificationRes] = await Promise.all([
          axios.get("/api/latestActivity"),
          axios.get("/api/latestNotification")
        ]);
        setLatestActivity(activityRes.data.latestActivity);
        setLatestNotification(notificationRes.data.latestNotification);
      } catch (error) {
        console.error("Failed to fetch latest data", error);
      }
    }
    fetchLatestData();
  }, []);

  return (
    <div>
      <div className="mb-9 flex justify-end px-9">
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* ฝั่งซ้าย - หมวดกิจกรรม */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
  { title: "อาสา", image: "/img/Card1.webp" },
  { title: "ช่วยงาน", image: "/img/Card2.webp" },
  { title: "อบรม", image: "/img/Card3.webp" },
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
    <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 text-white text-5xl font-bold drop-shadow-lg z-10">
      {item.title}
    </div>
  </div>
))}

      </div>

      {/* ฝั่งขวา */}
      <div className="space-y-6">
        {/* กิจกรรมล่าสุด */}
        <Card className="p-4">
            <h2 className="text-3xl font-bold mb-3 text-center">กิจกรรมล่าสุดของฉัน</h2>
            {latestActivity ? (
              <>
                <img
                  src={latestActivity.image}
                  alt={latestActivity.name}
                  className="rounded-md mb-3 w-full"
                />
                <p className="text-sm font-semibold text-yellow-600">
                  “{latestActivity.name}”
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-4">
                  {latestActivity.description}
                </p>
                <p className="text-sm text-gray-500 mt-2">โดย {latestActivity.author}</p>

                <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-1.5 rounded">
                  ดูรายละเอียดเพิ่มเติม
                </button>
              </>
            ) : (
              <p>กำลังโหลดข้อมูลกิจกรรมล่าสุด...</p>
            )}
            
          </Card>

        {/* การแจ้งเตือนล่าสุด */}
        <Card className="p-4">
  <h2 className="text-xl font-bold mb-3">การแจ้งเตือนล่าสุดของฉัน</h2>
  {latestNotification ? (
    <div className="bg-gray-100 rounded-lg p-3 space-y-1">
      <div className="text-sm text-gray-500">
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
        “{latestNotification.activityName}”
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

      </div>
    </div>
    </div>
  );
}
