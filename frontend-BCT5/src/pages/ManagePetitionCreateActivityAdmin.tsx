import React, { useState } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react"; // ✅ ไอคอนใหม่

type ActivityStatus = "รออนุมัติ" | "อนุมัติ" | "ยกเลิก";
type ActivityCategory = "อาสา" | "วิชาการ";

interface Activity {
  id: number;
  title: string;
  category: ActivityCategory;
  status: ActivityStatus;
  description: string;
  startDate: string;
  endDate: string;
  participant: string;
  score: string;
}

const initialActivities: Activity[] = [
  {
    id: 1,
    title: "โครงการอาสาพัฒนาชุมชน",
    category: "อาสา",
    status: "รออนุมัติ",
    description:
      "กิจกรรมอาสาพัฒนาชุมชนในพื้นที่ห่างไกล เน้นการปรับปรุงโครงสร้างพื้นฐานและให้ความรู้กับชุมชน",
    startDate: "20 ก.พ. 2568",
    endDate: "24 ก.พ. 2568",
    participant: "5/30",
    score: "5.0",
  },
  {
    id: 2,
    title: "ช่วยงานจัดนิทรรศการวิทยาศาสตร์",
    category: "วิชาการ",
    status: "อนุมัติ",
    description: "ช่วยงานนิทรรศการวิทยาศาสตร์สำหรับโรงเรียนในจังหวัด",
    startDate: "20 ก.พ. 2568",
    endDate: "24 ก.พ. 2568",
    participant: "12/30",
    score: "5.0",
  },
  {
    id: 3,
    title: "ช่วยงานจัดนิทรรศการวิทยาศาสตร์",
    category: "วิชาการ",
    status: "ยกเลิก",
    description: "กิจกรรมช่วยงานสื่อวิทยาศาสตร์สำหรับคณะฯ",
    startDate: "20 ก.พ. 2568",
    endDate: "24 ก.พ. 2568",
    participant: "12/30",
    score: "5.0",
  },
];

export default function ManagePetitionCreateActivityAdmin() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const handleApprove = (id: number) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.id === id ? { ...act, status: "อนุมัติ" } : act
      )
    );
  };

  const handleReject = (id: number) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.id === id ? { ...act, status: "ยกเลิก" } : act
      )
    );
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case "รออนุมัติ":
        return "bg-yellow-400 text-black";
      case "อนุมัติ":
        return "bg-green-500 text-white";
      case "ยกเลิก":
        return "bg-red-500 text-white";
    }
  };

  const getCategoryColor = (category: ActivityCategory) => {
    return category === "อาสา"
      ? "bg-green-500 text-white"
      : "bg-blue-500 text-white";
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {activities.map((act) => (
        <div
          key={act.id}
          className={`rounded-xl p-6 border ${
            act.status === "รออนุมัติ" ? "border-purple-400" : "border-gray-200"
          } shadow-sm`}
        >
          {/* Header */}
          <div className="flex flex-col gap-2 mb-3">
            <h2 className="text-xl font-bold">{act.title}</h2>
            <div className="flex gap-2">
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${getCategoryColor(
                  act.category
                )}`}
              >
                {act.category}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(
                  act.status
                )}`}
              >
                {act.status}
              </span>
            </div>
            <p className="text-gray-700">{act.description}</p>
          </div>

          {/* Detail */}
          <div className="text-sm text-gray-800 flex flex-wrap gap-x-10 gap-y-1 mb-4">
            <p>เริ่ม: {act.startDate}</p>
            <p>สิ้นสุด: {act.endDate}</p>
            <p>คะแนนจิตอาสา: 5</p>
            <p>ผู้เข้าร่วม: {act.participant}</p>
            <p>คะแนนชั่วโมงอาสา: {act.score}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-black rounded text-sm hover:bg-gray-100">
              <Eye className="w-5 h-5" />
              ดูรายละเอียด
            </button>

            {act.status === "รออนุมัติ" && (
              <>
                <button
                  onClick={() => handleApprove(act.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded text-sm hover:bg-blue-50"
                >
                  <CheckCircle className="w-5 h-5" />
                  อนุมัติ
                </button>
                <button
                  onClick={() => handleReject(act.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50"
                >
                  <XCircle className="w-5 h-5" />
                  ยกเลิก
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
