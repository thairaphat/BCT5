import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import axios from "axios";

interface ActivityStat {
  name: string;
  value: number;
  color: string;
}

interface ProfileData {
  studentId: string;
  thaiName: string;
  engName: string;
  conductScore: number;
  volunteerHours: number;
  volunteerPoints: number;
  educationLevel: string;
  faculty: string;
  program: string;
  status: string;
  university: string;
  activitySummary: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    lastActivity: string;
    nextActivity: string;
    byType: {
      volunteer: number;
      helper: number;
      training: number;
    };
  };
  activityRatio: ActivityStat[];
  profileImageUrl: string;
  coverImageUrl: string;
}

const mockProfileData: ProfileData = {
  studentId: "65021644",
  thaiName: "นายตะวัน กาญจน์อาคม",
  engName: "Mr. Tawan Kanjanakomol",
  conductScore: 100,
  volunteerHours: 45.0,
  volunteerPoints: 75,
  educationLevel: "ปริญญาตรี ทวิภาค ปกติ",
  faculty: "เทคโนโลยีสารสนเทศและการสื่อสาร",
  program: "วศ.บ. วิศวกรรมคอมพิวเตอร์",
  status: "นิสิต",
  university: "มหาวิทยาลัยพะเยา",
  activitySummary: {
    total: 20,
    pending: 5,
    completed: 14,
    failed: 1,
    lastActivity: "โครงการ Open UP 2022",
    nextActivity: "โครงการปฐมนิเทศนิสิตใหม่",
    byType: {
      volunteer: 10,
      helper: 5,
      training: 5,
    },
  },
  activityRatio: [
    { name: "กิจกรรมอาสา", value: 10, color: "#3B82F6" },
    { name: "กิจกรรมช่วยงาน", value: 5, color: "#10B981" },
    { name: "กิจกรรมอบรม", value: 5, color: "#FBBF24" },
  ],
  profileImageUrl: "https://img5.pic.in.th/file/secure-sv1/-296c6d1e9173abeb2.jpg",
  coverImageUrl: "https://f.ptcdn.info/091/052/000/os6u74lb7FjIiVg98he-o.jpg",
};

export default function Profile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call
    const timer = setTimeout(() => {
      setData(mockProfileData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // เรียก API จริง 
  // useEffect(() => {
  //   async function fetchProfile() {
  //     try {
  //       const res = await axios.get("/api/profile");
  //       setData(res.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   fetchProfile();
  // }, []);

  if (loading) return <p className="text-center py-10">กำลังโหลดข้อมูลโปรไฟล์...</p>;
  if (!data) return <p className="text-center py-10 text-red-500">ไม่พบข้อมูลโปรไฟล์</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-800 dark:text-white">
      {/* 1. ส่วนข้อมูลนิสิต */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ซ้าย: รูปและคะแนน พร้อม cover */}
        <div className="bg-white dark:bg-neutral-800 shadow rounded overflow-hidden">
          <div className="relative">
            <img
              src={data.coverImageUrl}
              alt="cover"
              className="w-full h-32 object-cover"
            />
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
              <img
                src={data.profileImageUrl}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
          </div>

          <div className="pt-14 px-6 pb-6 text-center">
            <h2 className="text-yellow-500 font-bold text-xl">{data.studentId}</h2>
            <p className="font-bold text-lg">{data.thaiName}</p>
            <p className="text-gray-500 dark:text-gray-300">{data.engName}</p>

            <div className="grid grid-cols-3 gap-4 text-center mt-6 text-sm">
              <div>
                <div className="text-green-500 font-bold text-lg">{data.conductScore}</div>
                <div className="text-gray-500 dark:text-gray-300">ความประพฤติ</div>
              </div>
              <div>
                <div className="text-blue-500 font-bold text-lg">{data.volunteerHours.toFixed(2)}</div>
                <div className="text-gray-500 dark:text-gray-300">ชั่วโมงอาสา</div>
              </div>
              <div>
                <div className="text-purple-500 font-bold text-lg">{data.volunteerPoints}</div>
                <div className="text-gray-500 dark:text-gray-300">คะแนนจิตอาสา</div>
              </div>
            </div>
          </div>
        </div>

        {/* ขวา: ข้อมูลการศึกษา */}
        <div className="bg-white dark:bg-neutral-800 shadow rounded p-6 text-base leading-relaxed space-y-3">
          <p><strong>ระดับการศึกษา:</strong> {data.educationLevel}</p>
          <p><strong>คณะ / วิทยาลัย:</strong> {data.faculty}</p>
          <p><strong>หลักสูตร:</strong> {data.program}</p>
          <p><strong>สถานะ:</strong> {data.status}</p>
          <p><strong>มหาวิทยาลัย:</strong> {data.university}</p>
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <button className="px-4 py-2 border-b-2 border-yellow-400 text-yellow-500">กิจกรรมที่เคยทำ</button>
          <button className="px-4 py-2 text-gray-500 dark:text-gray-300">กิจกรรมที่สมัครไว้</button>
        </div>
      </div>

      {/* 3. สถิติ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="bg-white dark:bg-neutral-800 shadow rounded p-4 text-sm leading-6">
          <h3 className="text-base font-semibold mb-4">ข้อมูลกิจกรรม</h3>
          <ul className="space-y-1">
            <li>กิจกรรมทั้งหมด: <strong>{data.activitySummary.total} กิจกรรม</strong></li>
            <li>รอดำเนินการ: <strong>{data.activitySummary.pending} กิจกรรม</strong></li>
            <li>ทำแล้ว: <strong>{data.activitySummary.completed} กิจกรรม</strong></li>
            <li>ไม่ผ่าน: <strong>{data.activitySummary.failed} กิจกรรม</strong></li>
            <li>กิจกรรมล่าสุด: <strong>{data.activitySummary.lastActivity}</strong></li>
            <li>กิจกรรมถัดไป: <strong>{data.activitySummary.nextActivity}</strong></li>
            <li>กิจกรรมจิตอาสา: <strong>{data.activitySummary.byType.volunteer} กิจกรรม</strong></li>
            <li>กิจกรรมช่วยงาน: <strong>{data.activitySummary.byType.helper} กิจกรรม</strong></li>
            <li>กิจกรรมอบรม: <strong>{data.activitySummary.byType.training} กิจกรรม</strong></li>
          </ul>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-neutral-800 shadow rounded p-4">
          <h3 className="text-base font-semibold mb-4">อัตราส่วนการทำกิจกรรม</h3>
          <div className="flex justify-center">
            <PieChart width={200} height={200}>
              <Pie
                data={data.activityRatio}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={18}
                    >
                      {data.activityRatio[index].value}
                    </text>
                  );
                }}
                dataKey="value"
              >
                {data.activityRatio.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="space-y-3 text-sm mt-4">
            {data.activityRatio.map(({ name, value, color }) => (
              <div key={name}>
                <div className="flex justify-between">
                  <span>{name}</span>
                  <span className="font-bold" style={{ color }}>{value} ครั้ง</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded">
                  <div className="h-3 rounded" style={{ width: `${value * 5}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
