import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "กิจกรรมอาสา", value: 10, color: "#3B82F6" },
  { name: "กิจกรรมช่วยงาน", value: 5, color: "#10B981" },
  { name: "กิจกรรมอบรม", value: 5, color: "#FBBF24" },
];

export default function Profile() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-800 dark:text-white">
      {/* 1. ส่วนข้อมูลนิสิต */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ซ้าย: รูปและคะแนน พร้อม cover */}
        <div className="bg-white dark:bg-neutral-800 shadow rounded overflow-hidden">
          <div className="relative">
    <img src="https://f.ptcdn.info/091/052/000/os6u74lb7FjIiVg98he-o.jpg" alt="cover" className="w-full h-32 object-cover" />
    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
      <img
        src="https://img5.pic.in.th/file/secure-sv1/-296c6d1e9173abeb2.jpg"
        alt="profile"
        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
      />
    </div>
  </div>

  <div className="pt-14 px-6 pb-6 text-center">
    <h2 className="text-yellow-500 font-bold text-xl">65021644</h2>
    <p className="font-bold text-lg">นายตะวัน กาญจน์อาคม</p>
    <p className="text-gray-500 dark:text-gray-300">Mr. Tawan Kanjanakomol</p>

    <div className="grid grid-cols-3 gap-4 text-center mt-6 text-sm">
      <div>
        <div className="text-green-500 font-bold text-lg">100</div>
        <div className="text-gray-500 dark:text-gray-300">ความประพฤติ</div>
      </div>
      <div>
        <div className="text-blue-500 font-bold text-lg">45.00</div>
        <div className="text-gray-500 dark:text-gray-300">ชั่วโมงอาสา</div>
      </div>
      <div>
        <div className="text-purple-500 font-bold text-lg">75</div>
        <div className="text-gray-500 dark:text-gray-300">คะแนนจิตอาสา</div>
      </div>
    </div>
  </div>
        </div>

        {/* ขวา: ข้อมูลการศึกษา */}
        <div className="bg-white dark:bg-neutral-800 shadow rounded p-6 text-base leading-relaxed space-y-3">
          <p><strong>ระดับการศึกษา:</strong> ปริญญาตรี ทวิภาค ปกติ</p>
          <p><strong>คณะ / วิทยาลัย:</strong> เทคโนโลยีสารสนเทศและการสื่อสาร</p>
          <p><strong>หลักสูตร:</strong> วศ.บ. วิศวกรรมคอมพิวเตอร์</p>
          <p><strong>สถานะ:</strong> นิสิต</p>
          <p><strong>มหาวิทยาลัย:</strong> มหาวิทยาลัยพะเยา</p>
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
            <li>กิจกรรมทั้งหมด: <strong>20 กิจกรรม</strong></li>
            <li>รอดำเนินการ: <strong>5 กิจกรรม</strong></li>
            <li>ทำแล้ว: <strong>14 กิจกรรม</strong></li>
            <li>ไม่ผ่าน: <strong>1 กิจกรรม</strong></li>
            <li>กิจกรรมล่าสุด: <strong>โครงการ Open UP 2022</strong></li>
            <li>กิจกรรมถัดไป: <strong>โครงการปฐมนิเทศนิสิตใหม่</strong></li>
            <li>กิจกรรมจิตอาสา: <strong>10 กิจกรรม</strong></li>
            <li>กิจกรรมช่วยงาน: <strong>5 กิจกรรม</strong></li>
            <li>กิจกรรมอบรม: <strong>5 กิจกรรม</strong></li>
          </ul>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-neutral-800 shadow rounded p-4">
          <h3 className="text-base font-semibold mb-4">อัตราส่วนการทำกิจกรรม</h3>
          <div className="flex justify-center">
            <PieChart width={200} height={200}>
              <Pie
                data={data}
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
                      {data[index].value}
                    </text>
                  );
                }}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="space-y-3 text-sm mt-4">
            {data.map(({ name, value, color }) => (
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