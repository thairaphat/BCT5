// src/pages/Register.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { register } from "../store/auth/authSlice";
import {
  FiMail,
  FiUser,
  FiAlertCircle,
  FiCreditCard,
  FiKey,
  FiShield,
} from "react-icons/fi";

export default function Register() {
  const [name, setName] = useState("");
  const [lastName, setlastName] = useState("");
  const [studentId, setstudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [faculty, setFaculty] = useState("");
  const [major, setMajor] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;

    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 1;

    setPasswordStrength(Math.min(strength, 4));
  }, [password]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 1:
        return "อ่อนมาก";
      case 2:
        return "อ่อน";
      case 3:
        return "ปานกลาง";
      case 4:
        return "แข็งแรง";
      default:
        return "กรุณากรอกรหัสผ่าน";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setValidationError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setValidationError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setValidationError(null);

    try {
      const resultAction = await dispatch(
        register({ name, lastName, email, password, studentId, faculty, major })
      ).unwrap();
      if (resultAction) {
        navigate("/");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-login bg-cover">
      <div
        className={`w-full max-w-md transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <p className=" text-black mt-1 flex">
              Welcome to <p className="text-primary">&nbsp;VolunteerHub</p>
            </p>
            <h2 className="text-5xl font-bold text-black">Sign in</h2>
          </div>

          <div className="p-8 pt-0">
            {/* ข้อความแสดงข้อผิดพลาด */}
            {(validationError || error) && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start mb-6 border-l-4 border-red-500 animate-fadeIn">
                <FiAlertCircle className="mr-3 mt-0.5 flex-shrink-0" />
                <span>{validationError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <FiMail className="mr-2 text-primary" />
                  Enter your email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="flex">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2 flex items-center"
                  >
                    <FiUser className="mr-2 text-primary" />
                    First name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                    placeholder="First name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-gray-700 font-medium mb-2 flex items-center"
                  >
                    <FiUser className="mr-2 text-primary" />
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setlastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none ml-2"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="studentId"
                  className="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <FiCreditCard className="mr-2 text-primary" />
                  Student ID
                </label>
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setstudentId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                  placeholder="Student ID"
                  required
                />
              </div>

              <div className="flex">
                <div>
                  <label
                    htmlFor="faculty"
                    className="block text-gray-700 font-medium mb-2 flex items-center"
                  >
                    <FiUser className="mr-2 text-primary" />
                    Faculty
                  </label>
                  <select
                    id="faculty"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                    required
                  >
                    <option value="">-- กรุณาเลือกคณะ --</option>
                    <option value="วิศวกรรมศาสตร์">วิศวกรรมศาสตร์</option>
                    <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                    <option value="บริหารธุรกิจ">บริหารธุรกิจ</option>
                    {/* เพิ่มอื่น ๆ ได้ตามต้องการ */}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="major"
                    className="block text-gray-700 font-medium mb-2 flex items-center"
                  >
                    <FiUser className="mr-2 text-primary" />
                    Major
                  </label>
                  <select
                    id="major"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none ml-2"
                    required
                  >
                    <option value="">-- กรุณาเลือกสาขา --</option>
                    <option value="คอมพิวเตอร์">คอมพิวเตอร์</option>
                    <option value="โยธา">โยธา</option>
                    <option value="ไฟฟ้า">ไฟฟ้า</option>
                    {/* เพิ่มได้ตามสาขา */}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <FiKey className="mr-2 text-primary" />
                  Enter your Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  required
                />

                {/* แสดงความแข็งแรงของรหัสผ่าน */}
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs text-gray-500">
                        ความแข็งแรงของรหัสผ่าน:
                      </div>
                      <div
                        className={`text-xs ${
                          passwordStrength <= 1
                            ? "text-red-500"
                            : passwordStrength === 2
                            ? "text-orange-500"
                            : passwordStrength === 3
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {getStrengthText()}
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength * 25}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      รหัสผ่านที่ดีควรมีความยาวอย่างน้อย 8 ตัวอักษร
                      และประกอบด้วยตัวอักษรพิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข
                      และอักขระพิเศษ
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <FiShield className="mr-2 text-primary" />
                  Confirm your Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring focus:ring-opacity-20 transition-all duration-200 outline-none ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary focus:ring-primary"
                  }`}
                  placeholder="••••••••"
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">รหัสผ่านไม่ตรงกัน</p>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center space-x-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>กำลังสมัครสมาชิก...</span>
                    </>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Have an Account ?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:text-primary-dark transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
