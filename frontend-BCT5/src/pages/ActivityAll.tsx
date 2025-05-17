import React, { useState } from "react";
import SearchBox from "../components/SearchBox";

const activityTypes = ["ทั้งหมด", "อบรม", "ช่วยงาน", "อาสา"];

const sampleActivities = [
  {
    id: 1,
    type: "อบรม",
    title: "รู้ทันภัยพิบัติ: น้ำท่วมและการรับมือในเขตเมือง",
    description:
      "หลักสูตรนี้จัดทำขึ้นเพื่อเสริมสร้างความรู้ ความเข้าใจ และทักษะในการเตรียมพร้อมรับมือกับสถานการณ์น้ำท่วมในพื้นที่ชุมชนเมือง...",
    image: "/img/info1.jpg",
    author: "นายตะวัน ภาณุวงศ์โกล",
  },
  {
    id: 2,
    type: "อาสา",
    title: "จิตอาสาเก็บขยะในคลองเพื่อสิ่งแวดล้อม",
    description:
      "ร่วมเป็นส่วนหนึ่งในการฟื้นฟูแหล่งน้ำในเขตเมือง ด้วยการเก็บขยะในชุมชนและรณรงค์การลดขยะ...",
    image: "/img/info2.jpg",
    author: "นายตะวัน ภาณุวงศ์โกล",
  },
  // เพิ่มกิจกรรมอื่นๆ ตามต้องการ
];

export default function ActivityAll() {
  const [type, setType] = useState("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const filteredActivities =
    type === "ทั้งหมด"
      ? sampleActivities
      : sampleActivities.filter((a) => a.type === type);

  return (
    <div className="max-w-7xl mx-auto p-4">
        <div className="mb-7 flex justify-end px-9">
            <SearchBox value={searchTerm} onChange={setSearchTerm} />
        </div>
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">
          กิจกรรมประเภท: <span className="text-yellow-400">{type}</span>
        </h1>
        <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400
                      bg-white text-black dark:bg-[#1e1e1e] dark:text-white"
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

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredActivities.map((a) => (
    <div key={a.id} className="p-4 border rounded-lg shadow-sm flex flex-col justify-between h-full min-h-[450px] bg-white dark:bg-[#1e1e1e]">
  <div>
    <img
      src={a.image}
      alt={a.title}
      className="rounded-md mb-3 w-full aspect-video object-cover"
    />
    <p className="text-sm font-semibold text-yellow-400">
      “{a.title}”
    </p>
    <p className="text-sm text-gray-600 dark:text-white mt-2 line-clamp-4">
      {a.description}
    </p>
  </div>
  <div className="mt-4">
    <p className="text-sm text-gray-500 dark:text-gray-500">โดย {a.author}</p>
    <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-1.5 rounded">
      ดูรายละเอียดเพิ่มเติม
    </button>
  </div>
</div>
  ))}
</div>

    </div>
  );
}
