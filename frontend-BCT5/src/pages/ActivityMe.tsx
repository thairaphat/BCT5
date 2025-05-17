import React from "react";
import SearchBox from "../components/SearchBox";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaFolderOpen, FaTimesCircle, FaRegCalendarAlt } from "react-icons/fa"; 


const tabs = [
  "อยู่ระหว่างกิจกรรม",
  "ผ่านกิจกรรม",
  "ไม่ผ่านกิจกรรม",
  "หมดระยะเวลา",
  "ยกเลิกการลงทะเบียน",
];

const activityTypes = ["ทั้งหมด", "อาสา", "ช่วยงาน", "อบรม"];

const getStatusColorClass = (status: string) => {
  switch (status) {
    case "อยู่ในระหว่างการอบรม":
      return "text-blue-600";
    case "ผ่านกิจกรรม":
      return "text-green-600";
    case "ไม่ผ่านกิจกรรม":
      return "text-red-600";
    case "หมดระยะเวลา":
      return "text-gray-500";
    case "ยกเลิกการลงทะเบียน":
      return "text-yellow-700";
    default:
      return "text-gray-600";
  }
};

const activities = [
    {
      title: "อบรมความปลอดภัยเบื้องต้น",
      dateRange: "1 พ.ค. 2568 - 5 พ.ค. 2568",
      status: "ผ่านกิจกรรม",
      type: "อบรม",
      image: "/img/train1.jpg",
    },
    {
      title: "ช่วยงานเก็บขยะชายหาด",
      dateRange: "10 พ.ค. 2568 - 12 พ.ค. 2568",
      status: "อยู่ในระหว่างการอบรม",
      type: "ช่วยงาน",
      image: "/img/work1.jpg",
    },
    {
      title: "กิจกรรมปลูกป่า",
      dateRange: "20 พ.ค. 2568 - 21 พ.ค. 2568",
      status: "ยกเลิกการลงทะเบียน",
      type: "อาสา",
      image: "/img/volunteer1.jpg",
    },
    {
      title: "เวิร์กช็อปปฐมพยาบาล",
      dateRange: "15 มิ.ย. 2568 - 18 มิ.ย. 2568",
      status: "อยู่ในระหว่างการอบรม",
      type: "อบรม",
      image: "/img/train2.jpg",
    },
    {
      title: "ช่วยงานจัดบูธมหกรรมสิ่งแวดล้อม",
      dateRange: "5 มิ.ย. 2568 - 7 มิ.ย. 2568",
      status: "ผ่านกิจกรรม",
      type: "ช่วยงาน",
      image: "/img/work2.jpg",
    },
    {
      title: "วิ่งการกุศลเพื่อผู้ป่วยโรคเรื้อรัง",
      dateRange: "28 พ.ค. 2568",
      status: "ไม่ผ่านกิจกรรม",
      type: "อาสา",
      image: "/img/volunteer2.jpg",
    },
];

export default function MyActivities() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const type = searchParams.get("type") || "ทั้งหมด";
    const status = searchParams.get("status") || "ทั้งหมด";

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        if (selected === "ทั้งหมด") {
          navigate("/activityMe"); // ล้าง query
        } else {
          navigate(`/activityMe?type=${encodeURIComponent(selected)}`);
        }
    };

    const filteredActivities = activities.filter((item) => {
        const matchType = type === "ทั้งหมด" || item.type === type;
        const matchStatus = !status || status === "ทั้งหมด" || item.status === status;
        return matchType && matchStatus;
    });

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 pt-0">
            <SearchBox value={searchTerm} onChange={setSearchTerm} />
            <h1 className="text-3xl font-bold text-yellow-500 text-center mb-8 mt-5">
                กิจกรรมของฉัน
            </h1>
            <div className="max-w-4xl mx-auto p-6 pt-0">
                {/* Header + Dropdown */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <h1 className="text-2xl font-bold">
                      กิจกรรมประเภท: <span className="text-yellow-600">{type}</span>
                    </h1>
                    <select
  className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-[#2c2c2c] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
  value={type}
  onChange={handleChange}
>
  {activityTypes.map((t) => (
    <option
      key={t}
      value={t}
      className="text-black dark:text-white bg-white dark:bg-[#2c2c2c]"
    >
      {t}
    </option>
  ))}
</select>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 justify-start border-b mb-8 text-sm font-medium">
                {["ทั้งหมด", ...tabs].map((label, i) => (
                    <button
                        key={i}
                        onClick={() =>
                            navigate(
                                `/activityMe?type=${encodeURIComponent(type)}${
                                    label !== "ทั้งหมด" ? `&status=${encodeURIComponent(label)}` : ""
                                }`
                            )
                        }
                        className={`px-4 py-2 rounded-t-md ${
                            label === status || (label === "ทั้งหมด" && !searchParams.get("status"))
                                ? "bg-yellow-500 text-white"
                                : "hover:text-yellow-500"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Activity Cards */}
            {filteredActivities.map((activity, idx) => (
  <div
    key={idx}
    className="flex flex-col md:flex-row bg-white dark:bg-[#1f1f1f] text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-md mb-6 overflow-hidden transition-shadow hover:shadow-lg"
  >
    {/* Thumbnail */}
    <div className="md:w-1/4 w-full h-48 md:h-auto">
      {activity.image ? (
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
          ไม่มีภาพ
        </div>
      )}
    </div>

    {/* Details */}
    <div className="md:w-3/4 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-1">{activity.title}</h2>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <FaRegCalendarAlt className="text-base text-red-500" />
          {activity.dateRange}
        </p>
        <p className="text-sm mt-2">
          <span className="font-semibold">สถานะ:</span>{" "}
          <span className={getStatusColorClass(activity.status)}>
            {activity.status}
          </span>
        </p>
        <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
          ประเภทกิจกรรม: <span className="text-gray-700 dark:text-gray-200">{activity.type}</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
  <button className="flex items-center gap-2 bg-cyan-100 text-cyan-700 px-3 py-1 rounded hover:bg-cyan-200 transition">
    <FaFolderOpen className="text-lg" />
    ดูรายละเอียด
  </button>
  <button className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition">
    <FaTimesCircle className="text-lg" />
    ยกเลิก
  </button>
</div>
    </div>
  </div>
))}
        </div>
    );
}
