import React, { useState } from "react";
import { FaUserShield, FaUserAltSlash, FaArrowUp } from "react-icons/fa";

const initialUsers = [
  {
    name: "นายธนพล ศรีวิชัย",
    email: "thanapon@gggg.com",
    role: "นิสิต",
    status: "ใช้งานได้",
    isSuspended: false,
  },
  {
    name: "นางสาวพิมพ์มาดา A",
    email: "pimmada.a@email.com",
    role: "นิสิต",
    status: "ใช้งานได้",
    isSuspended: false,
  },
  {
    name: "นางสาวพิมพ์มาดา B",
    email: "pimmada.b@email.com",
    role: "นิสิต",
    status: "ถูกระงับ",
    isSuspended: true,
  },
  {
    name: "นางสาวพิมพ์มาดา C",
    email: "pimmada.c@email.com",
    role: "เจ้าหน้าที่",
    status: "ใช้งานได้",
    isSuspended: false,
  },
  {
    name: "นางสาวพิมพ์มาดา D",
    email: "pimmada.d@email.com",
    role: "เจ้าหน้าที่",
    status: "ใช้งานได้",
    isSuspended: false,
  },
];

export default function ManageRoleAdmin() {
  const [users, setUsers] = useState(initialUsers);

  const toggleRole = (index: number) => {
    setUsers((prev) => {
      const updated = [...prev];
      updated[index].role = updated[index].role === "นิสิต" ? "เจ้าหน้าที่" : "นิสิต";
      return updated;
    });
  };

  const toggleSuspend = (index: number) => {
    setUsers((prev) => {
      const updated = [...prev];
      updated[index].isSuspended = !updated[index].isSuspended;
      updated[index].status = updated[index].isSuspended ? "ถูกระงับ" : "ใช้งานได้";
      return updated;
    });
  };

  return (
    <div className="p-4 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">จัดการผู้ใช้งาน</h1>
        <input
          type="text"
          placeholder="ค้นหาผู้ใช้งาน"
          className="border px-4 py-2 rounded-md w-full sm:w-auto max-w-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl shadow border">
        <table className="min-w-[700px] w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left whitespace-nowrap">ชื่อ-นามสกุล</th>
              <th className="border px-3 py-2 text-left whitespace-nowrap">อีเมล</th>
              <th className="border px-3 py-2 text-left whitespace-nowrap">สิทธิ์</th>
              <th className="border px-3 py-2 text-left whitespace-nowrap">สถานะ</th>
              <th className="border px-3 py-2 text-left whitespace-nowrap">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.email} className="align-top">
                <td className="border px-3 py-2 whitespace-nowrap">{user.name}</td>
                <td className="border px-3 py-2 whitespace-nowrap">{user.email}</td>
                <td className="border px-3 py-2">
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${
                      user.role === "เจ้าหน้าที่" ? "bg-blue-500" : "bg-green-500"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="border px-3 py-2">
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${
                      user.status === "ใช้งานได้" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="border px-3 py-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRole(index)}
                      className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs px-3 py-1 border border-blue-300 text-blue-600 rounded hover:bg-blue-50"
                    >
                      <FaArrowUp className="text-blue-500" />
                      {user.role === "นิสิต" ? "เป็นเจ้าหน้าที่" : "เป็นนิสิต"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSuspend(index)}
                      className={`w-full sm:w-auto flex items-center justify-center gap-1 text-xs px-3 py-1 border rounded ${
                        user.isSuspended
                          ? "border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                          : "border-red-500 text-red-500 hover:bg-red-50"
                      }`}
                    >
                      {user.isSuspended ? (
                        <FaUserShield className="text-yellow-500" />
                      ) : (
                        <FaUserAltSlash className="text-red-500" />
                      )}
                      {user.isSuspended ? "ยกเลิกระงับ" : "ระงับบัญชี"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}