import React from "react";
import SearchBox from "../components/SearchBox";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PetitionCard from "../components/ui/PetitionCard";

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
    startDate: "1 พ.ค. 2568",
    endDate: "5 พ.ค. 2568",
    status: "ผ่านกิจกรรม",
    type: "ช่วยงาน",
    description: "อบรมเกี่ยวกับความปลอดภัยขั้นพื้นฐานสำหรับอาสาสมัคร",
    volunteerPoints: 10,
    volunteerHours: 8,
    participants: "15/30",
  },
];

export default function ManageOverview() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const type = searchParams.get("type") || "ทั้งหมด";
    const status = searchParams.get("status") || "ทั้งหมด";

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        if (selected === "ทั้งหมด") {
          navigate("/managePetition"); // ล้าง query
        } else {
          navigate(`/managePetition?type=${encodeURIComponent(selected)}`);
        }
    };

    const filteredActivities = activities.filter((item) => {
      const matchType = type === "ทั้งหมด" || item.type === type;
      const matchStatus = status === "ทั้งหมด" || item.status === status;
      return matchType && matchStatus;
    });

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 pt-0">
            <SearchBox value={searchTerm} onChange={setSearchTerm} />
            <h1 className="text-3xl font-bold text-yellow-500 text-center mb-8 mt-5">
                จัดการคำร้อง
            </h1>
            <div className="max-w-4xl mx-auto p-6 pt-0">
                {/* Header + Dropdown */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <h1 className="text-2xl font-bold">
                      กิจกรรมประเภท: <span className="text-yellow-600">{type}</span>
                    </h1>
                    <select
                      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={type}
                      onChange={handleChange}
                    >
                      {activityTypes.map((t) => (
                        <option key={t} value={t}>
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
                                `/managePetition?type=${encodeURIComponent(type)}${
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
            
            <div className="space-y-6 max-w-4xl mx-auto">
              {filteredActivities
                .filter((a) => a.title.includes(searchTerm))
                .map((activity, index) => (
                  <PetitionCard
                    key={index}
                    title={activity.title}
                    status={activity.status}
                    type={activity.type}
                    description={activity.description}
                    startDate={activity.startDate}
                    endDate={activity.endDate}
                    volunteerPoints={activity.volunteerPoints}
                    volunteerHours={activity.volunteerHours}
                    participants={activity.participants}
                    actions={null}
                  />
              ))}
            </div>
        </div>
    );
}
