import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar, FaCalendarAlt, FaClock, FaStopwatch, FaClipboardList } from "react-icons/fa";

interface StatusHistory {
  status: string;
  date?: string;
  color: string; // ใช้เลือกสีข้อความ
}

interface ActivityDetailType {
  id: number;
  title: string;
  type: string;
  description: string;
  registrationPeriod: string;
  activityPeriod: string;
  volunteerHours: number;
  volunteerPoints: number;
  level: string;
  statusHistory: StatusHistory[];
  image?: string;  // <-- เพิ่มตรงนี้
}

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>(); // ดึง id จาก URL params
  const [activity, setActivity] = useState<ActivityDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  // รวม fetch activity และ fetch registration status ไว้ใน useEffect เดียวกัน หรือ แยกไว้บนสุดก่อน return
  useEffect(() => {
    async function fetchData() {
      try {
        const [activityRes, regRes] = await Promise.all([
          axios.get(`/api/activities/${id}`),
          axios.get(`/api/activities/${id}/registration-status`),
        ]);
        setActivity(activityRes.data);
        setIsRegistered(regRes.data.registered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <p className="text-center py-10">กำลังโหลดข้อมูลกิจกรรม...</p>;
  }

  if (!activity) {
    return <p className="text-center py-10 text-red-500">ไม่พบข้อมูลกิจกรรม</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left side: content */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-4 border-l-8 border-primary pl-3">{activity.title}</h1>

        {/* สมมติมีภาพ */}
        <div
          className="w-full aspect-video bg-gray-300 border border-gray-400 mb-6"
          style={{
            backgroundImage: `url(${activity.image || "/img/default.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

          <h1 className="text-2xl font-bold">
            <span className="text-yellow-500">กิจกรรมประเภท:</span> {activity.type}
          </h1>
          <h2 className="text-lg font-semibold mb-1">เกี่ยวกับกิจกรรม</h2>
          <p className="text-gray-800 dark:text-white">{activity.description}</p>
        </div>

        {/* Right side: status + button */}
        <div className="border border-gray-300 rounded p-4 flex flex-col justify-between h-fit mt-12">
          {/* Box: สถานะ */}
          <div className="space-y-3 text-sm text-black dark:text-white">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <span>
                <span className="font-semibold">ระดับกิจกรรม:</span> {activity.level}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <FaCalendarAlt className="mt-1" />
              <div>
                <span className="font-semibold">ระยะเวลาลงทะเบียน:</span>
                <br />
                {activity.registrationPeriod}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FaClock className="mt-1" />
              <div>
                <span className="font-semibold">ระยะเวลากิจกรรม:</span>
                <br />
                {activity.activityPeriod}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaStopwatch />
              <span className="font-semibold">ชั่วโมงอาสา :</span> {activity.volunteerHours} ชั่วโมง
            </div>

            <div className="flex items-center gap-2">
              <FaClipboardList />
              <span className="font-semibold">คะแนนจิตอาสา :</span> {activity.volunteerPoints || "-"}
            </div>
          </div>

          {/* Box: ลำดับความสำเร็จ */}
          <div>
            <h3 className="font-bold text-sm border-b pb-1 mb-2 mt-6">ลำดับความสำเร็จ</h3>
            <ul className="text-sm space-y-1">
              {activity.statusHistory && activity.statusHistory.length > 0 ? (
                activity.statusHistory.map((status, idx) => (
                  <li
                    key={idx}
                    className={`border-l-4 pl-3 ${
                      status.color === "green"
                        ? "text-green-600 border-green-600"
                        : status.color === "blue"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-gray-500"
                    }`}
                  >
                    <span className="font-medium">{status.status}</span>
                    {status.date ? ` วันที่ ${status.date}` : null}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">ไม่มีลำดับความสำเร็จ</li>
              )}
            </ul>
          </div>

          {/* Button */}
          <button
            onClick={async () => {
              try {
                if (isRegistered) {
                  // ยกเลิกลงทะเบียน
                  await axios.post(`/api/activities/${id}/cancel-registration`);
                  setIsRegistered(false);
                  alert("ยกเลิกลงทะเบียนสำเร็จ");
                } else {
                  // ลงทะเบียน
                  await axios.post(`/api/activities/${id}/register`);
                  setIsRegistered(true);
                  alert("ลงทะเบียนสำเร็จ");
                }
              } catch (error) {
                alert("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง");
                console.error(error);
              }
            }}
            className={`w-full border font-semibold py-2 rounded mt-3 ${
              isRegistered
                ? "border-red-500 text-red-500 hover:bg-red-50"
                : "border-green-600 text-green-600 hover:bg-green-50"
            }`}
            disabled={isRegistered === null} // ปิดปุ่มระหว่างโหลดสถานะ
          >
            {isRegistered === null
              ? "กำลังโหลด..."
              : isRegistered
              ? "ยกเลิกลงทะเบียน"
              : "ลงทะเบียน"}
          </button>
      </div>
    </div>
  );
}
