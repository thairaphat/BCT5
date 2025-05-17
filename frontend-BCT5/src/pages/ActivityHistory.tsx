import React from "react";
import SearchBox from "../components/SearchBox";
import { useState } from "react";
import { useMemo } from "react";
import { HiSpeakerphone } from "react-icons/hi"; // 👈 ไอคอนลำโพง

const activityHistory = [
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "09/07/2567",
    end: "20/07/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "01/04/2567",
    end: "10/04/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2566,
    title: "มหกรรมศึกษาเมือง",
    start: "09/04/2566",
    end: "11/04/2566",
    hours: 10.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "กิจกรรมถวายเทียนพรรษา",
    start: "10/07/2565",
    end: "15/07/2565",
    hours: 20.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "วันสุนทรภู่ 31 พฤษภาคม",
    start: "31/05/2565",
    end: "02/06/2565",
    hours: 7.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "09/07/2567",
    end: "20/07/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "01/04/2567",
    end: "10/04/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2566,
    title: "มหกรรมศึกษาเมือง",
    start: "09/04/2566",
    end: "11/04/2566",
    hours: 10.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "กิจกรรมถวายเทียนพรรษา",
    start: "10/07/2565",
    end: "15/07/2565",
    hours: 20.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "วันสุนทรภู่ 31 พฤษภาคม",
    start: "31/05/2565",
    end: "02/06/2565",
    hours: 7.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "09/07/2567",
    end: "20/07/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "01/04/2567",
    end: "10/04/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2566,
    title: "มหกรรมศึกษาเมือง",
    start: "09/04/2566",
    end: "11/04/2566",
    hours: 10.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "กิจกรรมถวายเทียนพรรษา",
    start: "10/07/2565",
    end: "15/07/2565",
    hours: 20.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "วันสุนทรภู่ 31 พฤษภาคม",
    start: "31/05/2565",
    end: "02/06/2565",
    hours: 7.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "09/07/2567",
    end: "20/07/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "01/04/2567",
    end: "10/04/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2566,
    title: "มหกรรมศึกษาเมือง",
    start: "09/04/2566",
    end: "11/04/2566",
    hours: 10.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "กิจกรรมถวายเทียนพรรษา",
    start: "10/07/2565",
    end: "15/07/2565",
    hours: 20.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "วันสุนทรภู่ 31 พฤษภาคม",
    start: "31/05/2565",
    end: "02/06/2565",
    hours: 7.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "09/07/2567",
    end: "20/07/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "01/04/2567",
    end: "10/04/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2566,
    title: "มหกรรมศึกษาเมือง",
    start: "09/04/2566",
    end: "11/04/2566",
    hours: 10.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "กิจกรรมถวายเทียนพรรษา",
    start: "10/07/2565",
    end: "15/07/2565",
    hours: 20.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "วันสุนทรภู่ 31 พฤษภาคม",
    start: "31/05/2565",
    end: "02/06/2565",
    hours: 7.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "09/07/2567",
    end: "20/07/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "01/04/2567",
    end: "10/04/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2566,
    title: "มหกรรมศึกษาเมือง",
    start: "09/04/2566",
    end: "11/04/2566",
    hours: 10.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "กิจกรรมถวายเทียนพรรษา",
    start: "10/07/2565",
    end: "15/07/2565",
    hours: 20.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "วันสุนทรภู่ 31 พฤษภาคม",
    start: "31/05/2565",
    end: "02/06/2565",
    hours: 7.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "09/07/2567",
    end: "20/07/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "01/04/2567",
    end: "10/04/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2566,
    title: "มหกรรมศึกษาเมือง",
    start: "09/04/2566",
    end: "11/04/2566",
    hours: 10.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "กิจกรรมถวายเทียนพรรษา",
    start: "10/07/2565",
    end: "15/07/2565",
    hours: 20.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "วันสุนทรภู่ 31 พฤษภาคม",
    start: "31/05/2565",
    end: "02/06/2565",
    hours: 7.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "09/07/2567",
    end: "20/07/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2567,
    title: "โครงการ JOB FAIR 2024",
    start: "01/04/2567",
    end: "10/04/2567",
    hours: 8.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2566,
    title: "มหกรรมศึกษาเมือง",
    start: "09/04/2566",
    end: "11/04/2566",
    hours: 10.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "กิจกรรมถวายเทียนพรรษา",
    start: "10/07/2565",
    end: "15/07/2565",
    hours: 20.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
  {
    year: 2565,
    title: "วันสุนทรภู่ 31 พฤษภาคม",
    start: "31/05/2565",
    end: "02/06/2565",
    hours: 7.0,
    points: 5,
    type: "ผู้เข้าร่วมโครงการ",
    passed: true,
  },
];

export default function ActivityHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16);

  const filteredItems = useMemo(() => {
    return activityHistory.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(startIdx, endIdx);
  }, [filteredItems, startIdx, endIdx]);

  return (
    <div className="max-w-6xl mx-auto p-6 pt-0">
      <SearchBox value={searchTerm} onChange={setSearchTerm} />
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6 mt-5">
  <HiSpeakerphone className="text-yellow-500 text-3xl" />
  ประวัติการเข้าร่วมกิจกรรม
</h1>

      <div className="overflow-auto">
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">ปีการศึกษา</th>
              <th className="p-2 border">ชื่อโครงการ</th>
              <th className="p-2 border">วันที่เริ่มกิจกรรม</th>
              <th className="p-2 border">วันที่สิ้นสุดกิจกรรม</th>
              <th className="p-2 border text-right">ชั่วโมงอาสา</th>
              <th className="p-2 border text-right">คะแนนจิตอาสา</th>
              <th className="p-2 border">ประเภทการเข้าร่วม</th>
              <th className="p-2 border text-center">ผ่านกิจกรรม</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2 border">{startIdx + idx + 1}</td>
                <td className="p-2 border">{item.year}</td>
                <td className="p-2 border">{item.title}</td>
                <td className="p-2 border">{item.start}</td>
                <td className="p-2 border">{item.end}</td>
                <td className="p-2 border text-right">{item.hours.toFixed(2)}</td>
                <td className="p-2 border text-right">{item.points}</td>
                <td className="p-2 border">{item.type}</td>
                <td className="p-2 border text-center">{item.passed ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-white">
  <span>
    แสดง {startIdx + 1} - {Math.min(endIdx, totalItems)} จาก {totalItems} รายการ
  </span>

  <div className="flex items-center gap-2">
    {/* หน้าแรก */}
    <button
      onClick={() => setCurrentPage(1)}
      disabled={currentPage === 1}
      className="px-2 py-1 border rounded disabled:opacity-50 
                 text-gray-800 dark:text-white 
                 border-gray-400 dark:border-white"
    >
      &laquo;
    </button>

    {/* หน้าก่อน */}
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-2 py-1 border rounded disabled:opacity-50 
                 text-gray-800 dark:text-white 
                 border-gray-400 dark:border-white"
    >
      &lsaquo;
    </button>

    {/* ช่องกรอกเลขหน้า */}
    <span className="flex items-center gap-1">
      หน้า{" "}
      <input
        type="number"
        min={1}
        max={totalPages}
        value={currentPage}
        onChange={(e) =>
          setCurrentPage(Math.min(Math.max(Number(e.target.value), 1), totalPages))
        }
        className="w-14 px-2 py-1 border rounded text-center 
                   text-black dark:text-black 
                   bg-white dark:bg-white 
                   border-gray-400 dark:border-white"
      />
      / {totalPages}
    </span>

    {/* หน้าถัดไป */}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-2 py-1 border rounded disabled:opacity-50 
                 text-gray-800 dark:text-white 
                 border-gray-400 dark:border-white"
    >
      &rsaquo;
    </button>

    {/* หน้าสุดท้าย */}
    <button
      onClick={() => setCurrentPage(totalPages)}
      disabled={currentPage === totalPages}
      className="px-2 py-1 border rounded disabled:opacity-50 
                 text-gray-800 dark:text-white 
                 border-gray-400 dark:border-white"
    >
      &raquo;
    </button>
  </div>
</div>
    </div>
  );
}
