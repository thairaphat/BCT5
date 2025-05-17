import { FiSearch } from "react-icons/fi";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="w-full">
  <div className="flex items-center  bg-gray-100 text-gray-900  dark:bg-[#2c2c2c] dark:text-white rounded-xl px-4 py-2 shadow-inner border border-gray-300 dark:border-[#3a3a3a] w-full max-w-3xl transition-colors duration-300">
    <input
      className="bg-transparent outline-none flex-1  text-gray-900 dark:text-white  placeholder-gray-500 dark:placeholder-gray-400"
      type="text"
      placeholder="ค้นหากิจกรรม"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <FiSearch className="text-gray-900 text-lg dark:text-white" />
  </div>
</div>
  );
}