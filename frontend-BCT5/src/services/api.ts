import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

api.interceptors.request.use(
  (config: any): any => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any): Promise<any> => {
    const errorMessage = error.message || "เกิดข้อผิดพลาดในการส่งคำขอ";
    return Promise.reject(errorMessage);
  }
);

api.interceptors.response.use(
  (response: any): any => {
    return response.data;
  },
  async (error: any): Promise<any> => {
    let errorMessage = "เกิดข้อผิดพลาดในการเชื่อมต่อ";
    const originalRequest = error.config;
    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        !isRefreshing
      ) {
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
          try {
            const response: any = await api.post("/user/refresh", {
              refresh_token: refreshToken,
            });

            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

            isRefreshing = false;

            return axios(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }

            return Promise.reject(
              "หมดเวลาเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่อีกครั้ง"
            );
          }
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
      } else if (error.response.status === 401) {
        if (!window.location.pathname.includes("/login")) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      errorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
    } else {
      errorMessage = error.message || errorMessage;
    }
    return Promise.reject(errorMessage);
  }
);

export const login = (student_id: string, password: string): Promise<any> => {
  try {
    return api.post("/login", { student_id, password });
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    return Promise.reject(errorMessage);
  }
};

export const logout = (): Promise<any> => {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return api.get("/user/logout");
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการออกจากระบบ";
    return Promise.reject(errorMessage);
  }
};

export const refreshToken = (refreshToken: string): Promise<any> => {
  try {
    return api.post("/user/refresh", { refresh_token: refreshToken });
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการรีเฟรชโทเค็น";
    return Promise.reject(errorMessage);
  }
};

// ดึงกิจกรรมล่าสุดของผู้ใช้ (Dashboard)
export const fetchLatestActivity = (): Promise<any> => {
  try {
    return api.get("/activities/latest"); // เปลี่ยน URL ให้ตรงกับ backend API ของคุณ
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการดึงกิจกรรมล่าสุด";
    return Promise.reject(errorMessage);
  }
};

// ดึงการแจ้งเตือนล่าสุดของผู้ใช้ (Dashboard)
export const fetchLatestNotification = (): Promise<any> => {
  try {
    return api.get("/notifications/latest"); // เปลี่ยน URL ให้ตรงกับ backend API ของคุณ
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการดึงการแจ้งเตือนล่าสุด";
    return Promise.reject(errorMessage);
  }
};

// ดึงรายการกิจกรรมทั้งหมดของผู้ใช้ (ActivityMe)
export const fetchActivities = (): Promise<any> => {
  try {
    return api.get("/activities"); // เปลี่ยน URL ให้ตรงกับ backend API ของคุณ
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการดึงรายการกิจกรรม";
    return Promise.reject(errorMessage);
  }
};
