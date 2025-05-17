import React, { useState } from "react";

type Participant = {
  name: string;
  id: string;
  email: string;
  status: "approved" | "pending" | "rejected";
  actions?: ("approve" | "reject")[];
};

const statusColor = {
  approved: "bg-green-500",
  pending: "bg-yellow-400",
  rejected: "bg-red-500",
};

export default function ManagePetitionActivity() {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      name: "นายธนพล ศรีวิชัย",
      id: "633010001",
      email: "thanapon@gggg.com",
      status: "approved",
    },
    {
      name: "นางสาวพิมพ์มาดา จันทร์เพ็ญ",
      id: "633010002",
      email: "pimmada.j@email.com",
      status: "approved",
    },
    {
      name: "นางสาวพิมพ์มาดา จันทร์เพ็ญ",
      id: "633010002",
      email: "pimmada.j@email.com",
      status: "approved",
    },
    {
      name: "นางสาวพิมพ์มาดา จันทร์เพ็ญ",
      id: "633010002",
      email: "pimmada.j@email.com",
      status: "pending",
      actions: ["approve", "reject"],
    },
    {
      name: "นางสาวพิมพ์มาดา จันทร์เพ็ญ",
      id: "633010002",
      email: "pimmada.j@email.com",
      status: "rejected",
    },
  ]);

  const handleStatusChange = (index: number, newStatus: Participant["status"]) => {
    const updated = [...participants];
    updated[index].status = newStatus;
    delete updated[index].actions; // ลบปุ่มหลังเปลี่ยนสถานะ
    setParticipants(updated);
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-xl font-bold mb-4">รายชื่อผู้เข้าร่วม: โครงการอาสาพัฒนาชุมชน</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2 text-gray-600 text-sm mb-4">
        <div>
          <p>เริ่ม: 20 พ.ค. 2568</p>
          <p>สิ้นสุด: 24 พ.ค. 2568</p>
        </div>
        <div>
          <p>คะแนนจิตอาสา: 5</p>
          <p>ผู้เข้าร่วม: 5/30</p>
        </div>
        <div>
          <p>คะแนนชั่วโมงอาสา: 5.0</p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="ค้นหารายชื่อ"
          className="px-4 py-2 border rounded-md w-full max-w-sm"
        />
      </div>

      {/* ✅ ส่วนแก้ให้ responsive */}
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left whitespace-nowrap">ชื่อ-นามสกุล</th>
              <th className="border p-2 text-left whitespace-nowrap">รหัสนิสิต</th>
              <th className="border p-2 text-left whitespace-nowrap">อีเมล</th>
              <th className="border p-2 text-left whitespace-nowrap">สถานะ</th>
              <th className="border p-2 text-left whitespace-nowrap">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, idx) => (
              <tr key={idx}>
                <td className="border p-2 whitespace-nowrap">{p.name}</td>
                <td className="border p-2 whitespace-nowrap">{p.id}</td>
                <td className="border p-2 whitespace-nowrap">{p.email}</td>
                <td className="border p-2 whitespace-nowrap">
                  <span
                    className={`text-white px-3 py-1 rounded-full text-sm ${statusColor[p.status]}`}
                  >
                    {p.status === "approved"
                      ? "อนุมัติแล้ว"
                      : p.status === "pending"
                      ? "รออนุมัติ"
                      : "ปฏิเสธ"}
                  </span>
                </td>
                <td className="border p-2 space-y-1 sm:space-x-2">
                  {p.actions?.includes("approve") && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-full text-sm w-full sm:w-auto"
                      onClick={() => handleStatusChange(idx, "approved")}
                    >
                      อนุมัติ
                    </button>
                  )}
                  {p.actions?.includes("reject") && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-full text-sm w-full sm:w-auto"
                      onClick={() => handleStatusChange(idx, "rejected")}
                    >
                      ปฏิเสธ
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="mt-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
        ย้อนกลับไปรายละเอียดกิจกรรม
      </button>
    </div>
  );
}