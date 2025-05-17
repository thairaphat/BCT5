import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/auth/authSlice";
import SearchBox from "../components/SearchBox";
import { useState } from "react";
import Card from "../components/ui/card";
import { CiMail } from "react-icons/ci";
import { IoMdPeople } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

export default function DashboardStaff() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
        <div className="mb-9 flex justify-end px-9">
            <SearchBox value={searchTerm} onChange={setSearchTerm} />
            <div>
              <h1>ddd</h1>
            </div>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">

      {/* ฝั่งซ้าย - หมวดกิจกรรม */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "สร้างกิจกรรม", image: "/img/Card4.webp" },
          { title: "จัดการกิจกรรม", image: "/img/Card5.webp" },
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
            <img
                src="/img/info1.jpg"
                alt="กิจกรรม"
                className="rounded-md mb-3 w-full"
            />
            <p className="text-sm font-semibold text-yellow-600">
                “รู้ทันภัยพิบัติ: น้ำท่วมและการรับมือในเขตเมือง”
            </p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-4">
                หลักสูตรนี้จัดทำขึ้นเพื่อเสริมสร้างความรู้ ความเข้าใจ และทักษะในการเตรียมพร้อมรับมือกับสถานการณ์น้ำท่วมในพื้นที่ชุมชนเมือง 
                โดยครอบคลุมตั้งแต่การเตรียมตัวก่อนเกิดเหตุ การรับมือในระหว่างเหตุการณ์ และการฟื้นฟูหลังน้ำลด ผู้เรียนจะได้เรียนรู้เกี่ยวกับแผนการอพยพอย่างปลอดภัย
            </p>
            <p className="text-sm text-gray-500 mt-2">โดย นายตะวัน ภาณุวงศ์โกล</p>
            <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-1.5 rounded">
                ดูรายละเอียดเพิ่มเติม
            </button>

            <h2 className="text-lg font-bold mt-3 text-start">สถานะกิจกรรม</h2>
            <button className="w-full border border-gray-500 text-gray-500 font-semibold py-2 rounded hover:bg-gray-100 mt-3 flex items-center">
                <CiMail className=" text-gray-500 mx-2"/>
                คำร้อง
            </button>
            <button className="w-full border border-green-500 text-green-500 font-semibold py-2 rounded hover:bg-green-50 mt-3 flex items-center">
                <IoMdPeople className=" text-green-500 mx-2"/>
                ผู้เข้าร่วมทั้งหมด
            </button>
            <button className="w-full border border-red-500 text-red-500 font-semibold py-2 rounded hover:bg-red-50 mt-3 flex items-center">
                <MdOutlineCancel className=" text-red-500 mx-2"/>
                ปฏิเสธทั้งหมด
            </button>
        </Card>

      </div>
    </div>
    </div>
  );
}
