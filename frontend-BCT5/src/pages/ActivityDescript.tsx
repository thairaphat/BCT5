import React from "react";
import { FaStar, FaCalendarAlt, FaClock, FaStopwatch, FaClipboardList } from 'react-icons/fa';

export default function ActivityDetail() {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side: content */}
        <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-4 border-l-8 border-primary pl-3">ชื่อกิจกรรม</h1>

            <div className="w-full aspect-video bg-gray-300 border border-gray-400 mb-6" />

            <h1 className="text-2xl font-bold">
  <span className="text-yellow-500">กิจกรรมประเภท:</span> ทั้งหมด
</h1>
            <h2 className="text-lg font-semibold mb-1">เกี่ยวกับกิจกรรม</h2>
            <p className="text-gray-800 dark:text-white">
  It is a long established fact that a reader will be distracted by the readable content...
</p>
        </div>

      {/* Right side: status + button */}
    <div className="border border-gray-300 rounded p-4 flex flex-col justify-between h-fit mt-12">

        {/* Box: สถานะ */}
        <div className="space-y-3 text-sm text-black dark:text-white">
  <div className="flex items-center gap-2">
    <FaStar className="text-yellow-400" />
    <span>
      <span className="font-semibold">ระดับกิจกรรม:</span> สูง
    </span>
  </div>

  <div className="flex items-start gap-2">
    <FaCalendarAlt className="mt-1" />
    <div>
      <span className="font-semibold">ระยะเวลาลงทะเบียน:</span>
      <br />
      14 พ.ค. 2568 - 13 มิ.ย. 2568
    </div>
  </div>

  <div className="flex items-start gap-2">
    <FaClock className="mt-1" />
    <div>
      <span className="font-semibold">ระยะเวลากิจกรรม:</span>
      <br />
      14 พ.ค. 2568 - 13 มิ.ย. 2568
    </div>
  </div>

  <div className="flex items-center gap-2">
    <FaStopwatch />
    <span className="font-semibold">ชั่วโมงอาสา :</span> 13 ชั่วโมง
  </div>

  <div className="flex items-center gap-2">
    <FaClipboardList />
    <span className="font-semibold">คะแนนจิตอาสา :</span> -
  </div>
</div>

        {/* Box: ลำดับความสำเร็จ */}
        <div>
          <h3 className="font-bold text-sm border-b pb-1 mb-2 mt-6">ลำดับความสำเร็จ</h3>
          <ul className="text-sm space-y-1">
            <li>
              <span className="text-green-600 font-medium border-l-4 border-green-600 pl-3">ลงทะเบียน</span>{" "}
              วันที่ 14 พ.ค. 2568 20:57:34
            </li>
            <li>
              <span className="text-blue-600 font-medium border-l-4 border-blue-600 pl-3">อยู่ในระหว่างกิจกรรม</span>
            </li>
            <li className="text-gray-500 border-l-4 border-gray-500 pl-3">ผ่านกิจกรรม</li>
            <li className="text-gray-500 border-l-4 border-gray-500 pl-3">
              หมดระยะเวลา วันที่ 20 พ.ค. 2568 20:57:34
            </li>
          </ul>
        </div>

        {/* Button */}
        <button className="w-full border border-red-500 text-red-500 font-semibold py-2 rounded hover:bg-red-50 mt-3">
          ยกเลิกลงทะเบียน
        </button>
      </div>
    </div>
  );
}
