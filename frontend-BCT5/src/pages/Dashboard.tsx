// Dashboard.tsx (Dark Theme Ready)
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/auth/authSlice";
import SearchBox from "../components/SearchBox";
import { useState } from "react";
import Card from "../components/ui/card";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#181818] dark:text-white transition-colors duration-300">
      <div className="mb-9 px-9">
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* ฝั่งซ้าย - หมวดกิจกรรม */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ title: "อาสา", image: "/img/Card1.webp" }, { title: "ช่วยงาน", image: "/img/Card2.webp" }, { title: "อบรม", image: "/img/Card3.webp" }].map((item) => (
            <div
              key={item.title}
              onClick={() => navigate(`/activityMe?type=${encodeURIComponent(item.title)}`)}
              className="relative h-[280px] md:h-[320px] lg:h-[700px] rounded-xl overflow-hidden shadow group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_-121px_20px_0_rgba(0,0,0,0.6)] pointer-events-none" />
              <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 text-white text-5xl font-bold drop-shadow-lg z-10">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        {/* ฝั่งขวา */}
        <div className="space-y-6">
          {/* กิจกรรมล่าสุด */}
          <Card className="p-4 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#2e2e2e] text-black dark:text-white">
            <h2 className="text-3xl font-bold mb-3 text-center">กิจกรรมล่าสุดของฉัน</h2>
            <img src="/img/info1.jpg" alt="กิจกรรม" className="rounded-md mb-3 w-full" />
            <p className="text-sm font-semibold text-yellow-600">“รู้ทันภัยพิบัติ: น้ำท่วมและการรับมือในเขตเมือง”</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-4">
              หลักสูตรนี้จัดทำขึ้นเพื่อเสริมสร้างความรู้ ความเข้าใจ และทักษะในการเตรียมพร้อมรับมือกับสถานการณ์น้ำท่วมในพื้นที่ชุมชนเมือง
              โดยครอบคลุมตั้งแต่การเตรียมตัวก่อนเกิดเหตุ การรับมือในระหว่างเหตุการณ์ และการฟื้นฟูหลังน้ำลด ผู้เรียนจะได้เรียนรู้เกี่ยวกับแผนการอพยพอย่างปลอดภัย
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">โดย นายตะวัน ภาณุวงศ์โกล</p>
            <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-1.5 rounded">
              ดูรายละเอียดเพิ่มเติม
            </button>
          </Card>

          {/* การแจ้งเตือนล่าสุด */}
          <Card className="p-4 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#2e2e2e] text-black dark:text-white">
            <h2 className="text-xl font-bold mb-3">การแจ้งเตือนล่าสุดของฉัน</h2>
            <div className="bg-gray-100 dark:bg-[#2c2c2c] rounded-lg p-3 space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                วันที่ 14 พ.ค. 2568 20:57:34
              </div>
              <p className="text-sm">
                <span className="font-semibold text-green-600">ผ่านกิจกรรม</span> “รู้ทันภัยพิบัติ: น้ำท่วมและการรับมือในเขตเมือง”
              </p>
              <div className="flex gap-2 text-sm font-medium">
                <span className="text-purple-500">+75 คะแนน</span>
                <span className="text-blue-500">+12 ชั่วโมง</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}