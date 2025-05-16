import { FiSearch } from "react-icons/fi";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({ value, onChange, placeholder = "ค้นหากิจกรรม" }: SearchBoxProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 shadow-sm w-full max-w-full">
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <FiSearch className="text-gray-400 text-lg" />
    </div>
  );
}