import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function CreateActivity() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        volunteerHours: "",
        spiritPoints: "",
        startDate: "",
        endDate: "",
        maxParticipants: "",
    });

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("ส่งข้อมูลกิจกรรม:", formData);
        // สามารถส่งไปยัง backend ได้ที่นี่ เช่น axios.post("/api/activities", formData)
    };
    return (
        <div>
            <button className="md:ml-14 sm:ml-0 flex items-center font-semibold text-primary">
                <IoIosArrowRoundBack className="text-3xl"/>
                กลับไปยังหน้ากิจกรรม
            </button>
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
            <h1 className="text-2xl font-bold text-center text-yellow-500 mb-6">
              สร้างกิจกรรม
            </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* ชื่อกิจกรรม */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            ชื่อกิจกรรม
          </label>
          <input
            type="text"
            name="name"
            placeholder="กรอกชื่อกิจกรรม"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 p-2"
          />
        </div>

        {/* รายละเอียด */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            รายละเอียดกิจกรรม
          </label>
          <textarea
            name="description"
            placeholder="กรอกรายละเอียดกิจกรรม"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 p-2"
          />
        </div>

        {/* ประเภท + คะแนน */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              ประเภทกิจกรรม
            </label>
            <input
              type="text"
              name="category"
              placeholder="อบรม, จิตอาสา, ฯลฯ"
              value={formData.category}
              onChange={handleChange}
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 p-2"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              คะแนนชั่วโมงอาสา
            </label>
            <input
              type="number"
              name="volunteerHours"
              value={formData.volunteerHours}
              onChange={handleChange}
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 p-2"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              คะแนนจิตอาสา
            </label>
            <input
              type="number"
              name="spiritPoints"
              value={formData.spiritPoints}
              onChange={handleChange}
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 p-2"
            />
          </div>
        </div>

        {/* วันที่กิจกรรม */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              วันที่เริ่มต้นกิจกรรม
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 p-2"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              วันที่สิ้นสุดกิจกรรม
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 p-2"
            />
          </div>
        </div>

        {/* จำนวนรับสมัคร */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            จำนวนรับสมัครสูงสุด
          </label>
          <input
            type="number"
            name="maxParticipants"
            placeholder="เช่น 100"
            value={formData.maxParticipants}
            onChange={handleChange}
            className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 p-2"
          />
        </div>

        {/* ปุ่ม submit */}
        <button
          type="submit"
          className="btn w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold"
        >
          สร้างกิจกรรม
        </button>

        {/* หมายเหตุ */}
        <p className="text-sm text-red-600 text-center mt-2">
          * กิจกรรมที่สร้างจะต้องได้รับการอนุมัติจากเจ้าหน้าที่ก่อนจึงจะแสดงในระบบ
        </p>
      </form>
    </div>
        </div>
        
    );
}