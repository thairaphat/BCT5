import React, { useEffect, useState, useMemo } from "react";
import SearchBox from "../components/SearchBox";
import { HiSpeakerphone } from "react-icons/hi";
import axios from "axios";

export default function ActivityHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivityHistory() {
      try {
        const res = await axios.get("/api/activity-history");
        if (Array.isArray(res.data)) {
          setActivityHistory(res.data);
        } else {
          console.warn("API response is not an array:", res.data);
          setActivityHistory([]);
        }
      } catch (error) {
        console.error("Error fetching activity history:", error);
        setActivityHistory([]);
      } finally {
        setLoading(false);
      }
    }
    fetchActivityHistory();
  }, []);

  const filteredItems = useMemo(() => {
    if (!Array.isArray(activityHistory)) return [];
    return activityHistory.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activityHistory]);

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

      {loading ? (
        <p className="text-center py-10">กำลังโหลดข้อมูล...</p>
      ) : (
        <>
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-white">
            <span>
              แสดง {startIdx + 1} - {Math.min(endIdx, totalItems)} จาก {totalItems} รายการ
            </span>

            <div className="flex items-center gap-2">
              {/* หน้าแรก */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 border rounded disabled:opacity-50 text-gray-800 dark:text-white border-gray-400 dark:border-white"
              >
                &laquo;
              </button>

              {/* หน้าก่อน */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border rounded disabled:opacity-50 text-gray-800 dark:text-white border-gray-400 dark:border-white"
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
                  className="w-14 px-2 py-1 border rounded text-center text-black dark:text-black bg-white dark:bg-white border-gray-400 dark:border-white"
                />
                / {totalPages}
              </span>

              {/* หน้าถัดไป */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50 text-gray-800 dark:text-white border-gray-400 dark:border-white"
              >
                &rsaquo;
              </button>

              {/* หน้าสุดท้าย */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50 text-gray-800 dark:text-white border-gray-400 dark:border-white"
              >
                &raquo;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
