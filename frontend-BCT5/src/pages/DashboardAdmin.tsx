import React from "react";
import { LuCalendar } from "react-icons/lu";
import { MdOutlineCheckBox, MdBlock } from "react-icons/md";
import { FaEye, FaEdit, FaTimes } from "react-icons/fa";

type Activity = {
  title: string;
  status: string[];
  description: string;
  startDate: string;
  endDate: string;
  points: number;
  hours: number;
  participants: string;
};

const summary = [
  {
    title: "กิจกรรมทั้งหมด",
    count: 32,
    icon: <LuCalendar className="text-3xl text-yellow-500" />,
    subtitle: "กิจกรรมทั้งหมดในระบบ",
    textColor: "text-yellow-500",
  },
  {
    title: "รออนุมัติ",
    count: 16,
    icon: <MdOutlineCheckBox className="text-3xl text-blue-500" />,
    subtitle: "กิจกรรมที่รอการอนุมัติ",
    textColor: "text-blue-500",
  },
  {
    title: "ถูกระงับ",
    count: 2,
    icon: <MdBlock className="text-3xl text-red-500" />,
    subtitle: "บัญชีที่ถูกระงับการใช้งาน",
    textColor: "text-red-500",
  },
];

const activities: Activity[] = new Array(6).fill(null).map(() => ({
  title: "โครงการอาสาพัฒนาชุมชน",
  status: ["ช่วยงาน", "อนุมัติแล้ว", "กำลังดำเนินงาน"],
  description:
    "กิจกรรมอาสาเพื่อพัฒนาชุมชนในพื้นที่ห่างไกล เน้นการปรับปรุงโครงสร้างพื้นฐานและให้ความรู้แก่ชุมชน",
  startDate: "20 พ.ค. 2568",
  endDate: "24 พ.ค. 2568",
  points: 5,
  hours: 5.0,
  participants: "5/30",
}));

export default function DashboardAdmin() {
  return (
    <div className="p-6 space-y-8">
      {/* สรุปกล่องด้านบน */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summary.map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md p-5 rounded-xl border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-md font-semibold ${item.textColor}`}>
                {item.title}
              </h2>
              <span>{item.icon}</span>
            </div>
            <p className="text-3xl font-bold mt-2">{item.count}</p>
            <p className="text-gray-600 text-sm mt-1">{item.subtitle}</p>
          </div>
        ))}
      </div>

      {/* หัวข้อกิจกรรมล่าสุด */}
      <h2 className="text-xl font-semibold text-yellow-500">
        กิจกรรมที่จัดการล่าสุด
      </h2>

      {/* การ์ดกิจกรรม */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow border border-gray-200 space-y-2"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {activity.title}
            </h3>

            <div className="flex flex-wrap gap-2">
              {activity.status.map((s, i) => (
                <span
                  key={i}
                  className={`text-white text-xs px-3 py-1 rounded-full ${
                    s === "ช่วยงาน"
                      ? "bg-blue-500"
                      : s === "อนุมัติแล้ว"
                      ? "bg-green-500"
                      : "bg-emerald-500"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-600">{activity.description}</p>
            <p className="text-sm text-gray-500">
              เริ่ม: {activity.startDate} | สิ้นสุด: {activity.endDate}
            </p>
            <p className="text-sm text-gray-500">
              คะแนนจิตอาสา: {activity.points} | คะแนนชั่วโมงอาสา:{" "}
              {activity.hours}
            </p>
            <p className="text-sm text-gray-500">
              ผู้เข้าร่วม: {activity.participants}
            </p>

            <div className="flex gap-2 pt-2">
  {/* ปุ่มดูรายละเอียด */}
  <button className="flex items-center gap-1 text-sm px-3 py-1 border border-gray-300 text-black rounded hover:bg-gray-100">
    <FaEye className="text-base" />
    ดูรายละเอียด
  </button>

  {/* ปุ่มแก้ไข */}
  <button className="flex items-center gap-1 text-sm px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50">
    <FaEdit className="text-base" />
    แก้ไข
  </button>

  {/* ปุ่มลบ */}
  <button className="flex items-center gap-1 text-sm px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50">
    <FaTimes className="text-base" />
    ลบกิจกรรม
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}
