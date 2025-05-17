
import React from "react";
import SearchBox from "../components/SearchBox";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Status mapping from backend to frontend display names
const statusMapping: Record<string, string> = {
  "pending": "รอการอนุมัติ",
  "in-process": "อยู่ระหว่างกิจกรรม",
  "passed": "ผ่านกิจกรรม",
  "failed": "ไม่ผ่านกิจกรรม",
  "cancelled": "ยกเลิกการลงทะเบียน"
};

// Status tabs for filtering
const tabs = [
  "อยู่ระหว่างกิจกรรม",
  "ผ่านกิจกรรม",
  "ไม่ผ่านกิจกรรม",
  "หมดระยะเวลา",
  "ยกเลิกการลงทะเบียน",
];

// Get status color class based on status
const getStatusColorClass = (status: string) => {
  switch (status) {
    case "in-process":
    case "อยู่ระหว่างกิจกรรม":
      return "text-blue-600";
    case "passed":
    case "ผ่านกิจกรรม":
      return "text-green-600";
    case "failed":
    case "ไม่ผ่านกิจกรรม":
      return "text-red-600";
    case "closed":
    case "หมดระยะเวลา":
      return "text-gray-500";
    case "cancelled":
    case "ยกเลิกการลงทะเบียน":
      return "text-yellow-700";
    case "pending":
    case "รอการอนุมัติ":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

// Map backend status to frontend tab status
const mapStatusToTab = (backendStatus: string): string => {
  return statusMapping[backendStatus] || backendStatus;
};

// ActivityType interface matching your database
interface ActivityType {
  id: number;
  type_name: string;
}

// Default activity types based on your database
const defaultActivityTypes: ActivityType[] = [
  { id: 1, type_name: "อบรม" },
  { id: 2, type_name: "ช่วยงาน" },
  { id: 3, type_name: "จิตอาสา" }
];

// Activity interface to match backend response
interface Activity {
  registration_id: number;
  activity_id: number;
  registration_status: string; // Backend status
  registration_date: string;
  attended_date: string | null;
  points_earned: number | null;
  hours_earned: number | null;
  name: string;
  activity_type: number; // This is the ID from the activity_types table
  activity_status: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date: string;
  volunteer_hours: number;
  volunteer_points: number;
}

// Enhanced activity with type name
interface EnhancedActivity extends Activity {
  activity_type_name: string;
}

// Format date range for display
const formatDateRange = (startDate: string, endDate: string): string => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    
    return `${start.toLocaleDateString("th-TH", formatOptions)} - ${end.toLocaleDateString("th-TH", formatOptions)}`;
  } catch (error) {
    return `${startDate} - ${endDate}`;
  }
};

export default function MyActivities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const [activities, setActivities] = useState<EnhancedActivity[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>(defaultActivityTypes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Get type and status from URL params
  const type = searchParams.get("type") || "ทั้งหมด";
  const status = searchParams.get("status") || "ทั้งหมด";

  // Fetch activity types from backend
  const fetchActivityTypes = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await axios.get(`${baseURL}/activity-types`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success && Array.isArray(response.data.activityTypes)) {
        setActivityTypes(response.data.activityTypes);
      } else {
        console.error("Failed to fetch activity types:", response.data.message);
        // Keep default activity types
      }
    } catch (err: any) {
      console.error("Error fetching activity types:", err);
      // Keep default activity types
    }
  };

  // Handle activity type dropdown change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === "ทั้งหมด") {
      navigate("/activityMe"); // Clear query
    } else {
      navigate(`/activityMe?type=${encodeURIComponent(selected)}`);
    }
  };

  // Handle activity cancellation
  const handleCancelActivity = async (activityId: number) => {
    if (!confirm("คุณต้องการยกเลิกการลงทะเบียนกิจกรรมนี้ใช่หรือไม่?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("access_token");
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      
      const response = await axios.post(
        `${baseURL}/student/cancel-participation/${activityId}`,
        { reason: "ยกเลิกโดยผู้ใช้" }, // You can make this a form input if needed
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Refresh activities after cancellation
        fetchActivities();
        alert("ยกเลิกการลงทะเบียนสำเร็จ");
      } else {
        alert(`ไม่สามารถยกเลิกได้: ${response.data.message}`);
      }
    } catch (err: any) {
      console.error("Error cancelling activity:", err);
      alert(`เกิดข้อผิดพลาด: ${err.message || 'ไม่สามารถยกเลิกกิจกรรมได้'}`);
    }
  };

  // Get activity type name by ID
  const getActivityTypeName = (typeId: number): string => {
    const activityType = activityTypes.find(type => type.id === typeId);
    return activityType ? activityType.type_name : `ประเภท ${typeId}`;
  };

  // Fetch activities from backend
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await axios.get(`${baseURL}/student/my-activities`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success && Array.isArray(response.data.activities)) {
        // Add activity_type_name to each activity
        const enhancedActivities = response.data.activities.map((activity: Activity) => ({
          ...activity,
          activity_type_name: getActivityTypeName(activity.activity_type)
        }));
        
        setActivities(enhancedActivities);
      } else {
        setActivities([]);
        setError(response.data.message || "ไม่สามารถโหลดข้อมูลกิจกรรมได้");
      }
    } catch (err: any) {
      console.error("Error fetching activities:", err);
      setError(`เกิดข้อผิดพลาด: ${err.message || 'ไม่สามารถโหลดข้อมูลได้'}`);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity types and activities on component mount
  useEffect(() => {
    const init = async () => {
      await fetchActivityTypes();
      await fetchActivities();
    };
    
    init();
  }, []);

  // Update activity type names whenever activityTypes changes
  useEffect(() => {
    if (activityTypes.length > 0 && activities.length > 0) {
      const updatedActivities = activities.map(activity => ({
        ...activity,
        activity_type_name: getActivityTypeName(activity.activity_type)
      }));
      
      setActivities(updatedActivities);
    }
  }, [activityTypes]);

  // Filter activities based on search, type, and status
  const filteredActivities = activities.filter((item) => {
    // Convert backend status to frontend display status for filtering
    const displayStatus = mapStatusToTab(item.registration_status);
    
    // Filter by type
    const matchType = type === "ทั้งหมด" || item.activity_type_name === type;
    
    // Filter by status
    const matchStatus = !status || status === "ทั้งหมด" || displayStatus === status;
    
    // Filter by search term
    const matchSearch = 
      !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.activity_type_name && item.activity_type_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchType && matchStatus && matchSearch;
  });

  // Get activity type image by type ID
  const getActivityTypeImage = (typeId: number): string => {
    switch(typeId) {
      case 1: // อบรม
        return "/img/Card3.webp";
      case 2: // ช่วยงาน
        return "/img/Card2.webp";
      case 3: // จิตอาสา
        return "/img/Card1.webp";
      default:
        return "/img/Card1.webp"; // Default image
    }
  };

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
              onChange={handleTypeChange}
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              {activityTypes.map((t) => (
                <option key={t.id} value={t.type_name}>
                  {t.type_name}
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
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : filteredActivities.length === 0 ? (
        <p className="text-center py-10">ไม่พบกิจกรรมที่ตรงกับเงื่อนไข</p>
      ) : (
        filteredActivities.map((activity, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md mb-6 overflow-hidden transition-shadow hover:shadow-lg"
          >
            {/* Thumbnail */}
            <div className="md:w-1/4 w-full h-48 md:h-auto">
              <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                <img 
                  src={getActivityTypeImage(activity.activity_type)} 
                  alt={activity.activity_type_name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Details */}
            <div className="md:w-3/4 p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-semibold mb-1 dark:text-white">{activity.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      📅 {formatDateRange(activity.start_date, activity.end_date)}
                    </p>
                    <p className="text-sm mt-2 dark:text-gray-300">
                      <span className="font-semibold">สถานะ:</span>{" "}
                      <span className={getStatusColorClass(activity.registration_status)}>
                        {mapStatusToTab(activity.registration_status)}
                      </span>
                    </p>
                    <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                      ประเภทกิจกรรม: <span className="text-gray-700 dark:text-gray-300">{activity.activity_type_name}</span>
                    </p>
                    {activity.points_earned && (
                      <p className="text-sm mt-1 text-purple-600 dark:text-purple-400">
                        ได้รับคะแนน: {activity.points_earned} คะแนน
                      </p>
                    )}
                    {activity.hours_earned && (
                      <p className="text-sm mt-1 text-blue-600 dark:text-blue-400">
                        ได้รับชั่วโมง: {activity.hours_earned} ชั่วโมง
                      </p>
                    )}
                </div>
                {/* Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <button 
                      onClick={() => navigate(`/activityDescript?id=${activity.activity_id}`)}
                      className="flex items-center gap-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded hover:bg-cyan-200 dark:hover:bg-cyan-800 transition"
                    >
                      📁 ดูรายละเอียด
                    </button>
                    
                    {/* Only show cancel button for activities that can be cancelled */}
                    {(activity.registration_status === "pending" || activity.registration_status === "in-process") && (
                      <button 
                        onClick={() => handleCancelActivity(activity.activity_id)}
                        className="flex items-center gap-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800 transition"
                      >
                        ⛔ ยกเลิก
                      </button>
                    )}
                </div>
            </div>
          </div>
        ))
      )}   
    </div>
  );
}