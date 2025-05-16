import React from "react";

export default function Profile() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 1. ส่วนข้อมูลนิสิต */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ซ้าย: รูปและคะแนน */}
        <div className="bg-white shadow rounded p-4 flex items-center gap-4">
          <img
            src="/profile.jpg"
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-yellow-500 font-bold text-lg">65021644</h2>
            <p className="font-semibold">นายตะวัน กาญจน์อาคม</p>
            <p className="text-gray-500">Mr. Tawan Kanjanakomol</p>

            <div className="flex gap-6 mt-2 text-sm">
              <div className="text-green-600">100 คะแนนประพฤติ</div>
              <div className="text-blue-600">45 ชั่วโมงอาสา</div>
              <div className="text-purple-600">75 คะแนนจิตอาสา</div>
            </div>
          </div>
        </div>

        {/* ขวา: ข้อมูลการศึกษา */}
        <div className="bg-white shadow rounded p-4 text-sm leading-6">
          <p><strong>ระดับการศึกษา:</strong> ปริญญาตรี ทวิภาค ปกติ</p>
          <p><strong>คณะ / วิทยาลัย:</strong> เทคโนโลยีสารสนเทศและการสื่อสาร</p>
          <p><strong>หลักสูตร:</strong> วศ.บ. วิศวกรรมคอมพิวเตอร์</p>
          <p><strong>สถานะ:</strong> นิสิต</p>
          <p><strong>มหาวิทยาลัย:</strong> มหาวิทยาลัยพะเยา</p>
        </div>
      </div>

      {/* 2. Tabs แสดงหมวดกิจกรรม */}
      <div className="border-b">
        <div className="flex space-x-4 text-sm font-medium">
          <button className="px-4 py-2 border-b-2 border-yellow-400 text-yellow-600">กิจกรรมที่เคยทำ</button>
          <button className="px-4 py-2 text-gray-500">กิจกรรมที่สมัครไว้</button>
        </div>
      </div>

      {/* 3. สถิติกิจกรรม */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ซ้าย: ข้อมูลสรุป */}
        <div className="bg-white shadow rounded p-4 text-sm leading-6">
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

        {/* ขวา: กราฟวงกลม + แถบสถิติ */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-base font-semibold mb-4">อัตราส่วนการทำกิจกรรม</h3>

          {/* Placeholder Pie chart */}
          <div className="h-40 w-40 mx-auto mb-6 rounded-full bg-gradient-to-tr from-blue-400 to-green-400 flex items-center justify-center text-white font-bold">
            PieChart
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between">
                <span>กิจกรรมอาสา</span>
                <span className="text-blue-600 font-bold">10 ครั้ง</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded">
                <div className="bg-blue-500 h-3 rounded" style={{ width: '50%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span>กิจกรรมช่วยงาน</span>
                <span className="text-green-600 font-bold">5 ครั้ง</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded">
                <div className="bg-green-500 h-3 rounded" style={{ width: '25%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span>กิจกรรมอบรม</span>
                <span className="text-yellow-500 font-bold">5 ครั้ง</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded">
                <div className="bg-yellow-400 h-3 rounded" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}