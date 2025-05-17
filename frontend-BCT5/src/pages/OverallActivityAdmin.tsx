import React from "react";
import { FaEye, FaEdit, FaTimes } from "react-icons/fa";

const activities = new Array(9).fill(null).map((_, i) => ({
  id: i + 1,
  title: "โครงการอาสาพัฒนาชุมชน",
  tags: ["ช่วยงาน", "อนุมัติแล้ว", "กำลังดำเนินงาน"],
  description:
    "กิจกรรมอาสาเพื่อพัฒนาชุมชนในพื้นที่ห่างไกล เน้นการปรับปรุงโครงสร้างพื้นฐานและให้ความรู้แก่ชุมชน",
  start: "20 พ.ค. 2568",
  end: "24 พ.ค. 2568",
  points: 5,
  hours: 5.0,
  participants: "5/30",
}));

export default function AllActivitiesPage() {
  return (
    <div className="p-4 space-y-6 font-sans">
      <h2 className="text-4xl font-semibold text-center text-yellow-500 ">
        กิจกรรมทั้งหมด
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-2"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {activity.title}
            </h3>

            <div className="flex flex-wrap gap-2">
              {activity.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`text-white text-xs px-3 py-1 rounded-full ${
                    tag === "ช่วยงาน"
                      ? "bg-blue-500"
                      : tag === "อนุมัติแล้ว"
                      ? "bg-green-500"
                      : "bg-emerald-500"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              {activity.description}
            </p>

            <div className="text-sm text-gray-500 space-y-1">
              <p>เริ่ม: {activity.start}</p>
              <p>สิ้นสุด: {activity.end}</p>
              <p>
                คะแนนจิตอาสา: {activity.points} | ชั่วโมงอาสา: {activity.hours}
              </p>
              <p>ผู้เข้าร่วม: {activity.participants}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 pt-2">
              <button
                type="button"
                className="w-full sm:w-auto flex items-center justify-center gap-1 text-sm px-3 py-1 border border-gray-400 rounded hover:bg-gray-100"
              >
                <FaEye /> ดูรายละเอียด
              </button>
              <button
                type="button"
                className="w-full sm:w-auto flex items-center justify-center gap-1 text-sm px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50"
              >
                <FaEdit /> แก้ไข
              </button>
              <button
                type="button"
                className="w-full sm:w-auto flex items-center justify-center gap-1 text-sm px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
              >
                <FaTimes /> ลบกิจกรรม
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
