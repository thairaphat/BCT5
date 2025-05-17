import React from "react";
import SearchBox from "../components/SearchBox";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchActivities } from "../services/api";
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

interface ActivityType {
  title: string;
  dateRange: string;
  status: string;
  type: string;
  image?: string;
}

export default function MyActivities() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams] = useSearchParams();
    const [activityList, setActivityList] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
  async function loadActivities() {
    try {
      const response = await fetchActivities();
      setActivityList(response); // หรือ response.activities ขึ้นกับโครงสร้าง API ของคุณ
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  loadActivities();
}, []);
useEffect(() => {
  async function fetchActivities() {
    try {
      const response = await axios.get("http://localhost:3000/api/student/activity-history", {
        withCredentials: true, // ถ้าใช้ cookie auth
      });

      // ตรวจสอบโครงสร้าง response
      if (Array.isArray(response.data)) {
        setActivityList(response.data); // ถ้า API คืน array ตรง ๆ
      } else if (Array.isArray(response.data.activities)) {
        setActivityList(response.data.activities); // ถ้าอยู่ใน object
      } else {
        console.warn("Unexpected API format", response.data);
        setActivityList([]);
      }

    } catch (error) {
      console.error("Failed to fetch activities", error);
      setActivityList([]);
    } finally {
      setLoading(false);
    }
  }

  fetchActivities();
}, []);
useEffect(() => {
  async function fetchActivities() {
      try {
        const response = await axios.get("/api/activities"); 
        // ตรวจสอบ response.data.activities
        if (response.data && Array.isArray(response.data.activities)) {
          setActivityList(response.data.activities);
        } else {
          setActivityList([]);
          console.warn("API returned unexpected activities format", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch activities", error);
        setActivityList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const filteredActivities = activityList.filter((item) => {
    const matchType = type === "ทั้งหมด" || item.type === type;
    const matchStatus = !status || status === "ทั้งหมด" || item.status === status;
    const matchSearch = item.title.includes(searchTerm) || item.type.includes(searchTerm);
    return matchType && matchStatus && (searchTerm ? matchSearch : true);
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
      {loading ? (
        <p className="text-center py-10">กำลังโหลดกิจกรรม...</p>
      ) : filteredActivities.length === 0 ? (
        <p className="text-center py-10">ไม่พบกิจกรรมที่ตรงกับเงื่อนไข</p>
      ) : (
        filteredActivities.map((activity, idx) => (
          <div
          key={idx}
          className="flex flex-col md:flex-row bg-white border rounded-lg shadow-md mb-6 overflow-hidden transition-shadow hover:shadow-lg"
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
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                  ไม่มีภาพ
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:w-3/4 p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-semibold mb-1">{activity.title}</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      📅 {activity.dateRange}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-semibold">สถานะ:</span>{" "}
                      <span className={getStatusColorClass(activity.status)}>{activity.status}</span>
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      ประเภทกิจกรรม: <span className="text-gray-700">{activity.type}</span>
                    </p>
                </div>
                {/* Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <button className="flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded hover:bg-cyan-200 transition">
                      📁 ดูรายละเอียด
                    </button>
                    <button className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition">
                      ⛔ ยกเลิก
                    </button>
                </div>
            </div>
          </div>
        ))
      )}   
    </div>
  );
}
