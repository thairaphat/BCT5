import React from "react";
import { FiEye } from "react-icons/fi";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";

interface ActivityProps {
    title: string;
    type: string;
    status: string;
    description?: string;
    startDate: string;
    endDate: string;
    volunteerPoints: number;
    volunteerHours: number;
    participants: string;
    actions?: React.ReactNode;
}

const getStatusColorClass = (status: string) => {
  switch (status) {
    case "อยู่ในระหว่างการอบรม":
      return "bg-blue-600 text-white";
    case "ผ่านกิจกรรม":
      return "bg-green-600 text-white";
    case "ไม่ผ่านกิจกรรม":
      return "bg-red-600 text-white";
    case "หมดระยะเวลา":
      return "bg-gray-400 text-white";
    case "ยกเลิกการลงทะเบียน":
      return "bg-yellow-600 text-black";
    default:
      return "bg-gray-300 text-black";
  }
};

export default function ActivityCard({
    title,
    type,
    status,
    description,
    startDate,
    endDate,
    volunteerPoints,
    volunteerHours,
    participants,
    actions,
}: ActivityProps) {
    const getTypeColorClass = (type: string) => {
        switch(type) {
          case "อาสา":
            return "bg-green-500";
          case "ช่วยงาน":
            return "bg-yellow-500";
          case "อบรม":
            return "bg-blue-500";
          default:
            return "bg-gray-400";
        }
    };

    return (
        <div className="border rounded-md shadow-md p-5 mb-6 max-w-4xl mx-auto bg-white">
            <h2 className="font-semibold text-lg mb-2">{title}</h2>

            {/* Tags */}
            <div className="flex gap-2 mb-3">
                {/* Tag type */}
                <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getTypeColorClass(type)}`}>
                  {type}
                </span>

                {/* Tag status */}
                <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getStatusColorClass(status)}`}>
                  {status}
                </span>
            </div>


            {/* Description */}
            {description && (
                <p className="text-gray-400 mb-3 text-base">{description}</p>
            )}

            {/* Info */}
            <div className="flex flex-wrap gap-x-10 gap-y-1 text-gray-700 text-base mb-4">
                <div>
                    <span className="font-medium">เริ่ม:</span> {startDate}
                </div>
                <div>
                    <span className="font-medium">สิ้นสุด:</span> {endDate}
                </div>
                <div>
                    <span className="font-medium">คะแนนจิตอาสา:</span> {volunteerPoints}
                </div>
                <div>
                    <span className="font-medium">คะแนนชั่วโมงอาสา:</span> {volunteerHours}
                </div>
                <div>
                    <span className="font-medium">ผู้เข้าร่วม:</span> {participants}
                </div>
            </div>
      

            <div className=" flex">
                <button className="w-full border border-black text-black font-semibold py-2 rounded hover:bg-gray-200 mt-3 flex items-center justify-center">
                    <FiEye className="md:mr-2 sm:ml-1"/>
                    ดูรายละเอียด
                </button>
                <button className="w-full border border-blue-500 text-blue-500 font-semibold py-2 rounded hover:bg-blue-50 mt-3 ml-5 flex items-center justify-center">
                    <IoCheckmarkSharp className="mr-2"/>
                    ปิดกิจกรรม
                </button>
                <button className="w-full border border-red-500 text-red-500 font-semibold py-2 rounded hover:bg-red-50 mt-3 ml-5 flex items-center justify-center">
                    <IoCloseSharp className="mr-2"/>
                    ยกเลิก
                </button>
            </div>


            {/* Actions */}
            <div className="flex gap-3">
                {actions}
            </div>
        </div>
    );
}
