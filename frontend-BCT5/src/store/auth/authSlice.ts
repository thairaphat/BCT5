// src/store/auth/authSlice.ts
import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const URL_api ='';
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const loadUserFromStorage = (): User | null => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

const initialState: AuthState = {
  currentUser: loadUserFromStorage(),
  status: "idle",
  error: null,
};

interface User {
  id: string;
  name: string;
  lastName: string;
  password:string;
  email: string;
  studentId: string;
  faculty: string;
  major: string;
}

// เพิ่มส่วนนี้ด้านบน ก่อน createSlice
export const register = createAsyncThunk<
  User,
  { name: string; lastName: string; email: string; password: string; studentId: string; faculty: string; major: string },
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const { name, lastName, email, password, studentId, faculty, major } = data;

    if (email === "demo@example.com") {
      return rejectWithValue("อีเมลนี้ถูกใช้ไปแล้ว");
    }

    const user: User = {
      id: Date.now().toString(),
      name,
      lastName,
      email,
      password,
      studentId,
      faculty,
      major,
    };

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("เกิดข้อผิดพลาดที่ไม่คาดคิด");
  }
});

export const login = createAsyncThunk<
  User,
  { student_id: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ student_id, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', { student_id, password });
    const token = response.data.token;

    // if (student_id === "" && password === "") {
    //   const user: User = {
    //     id: "",
    //     name: "",
    //     lastName: "",
    //     password:'',
    //     email:"",
    //     studentId: "",
    //     faculty: "",
    //     major: "",
    //   };
    if (!token) throw new Error("Token not found in response");
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("เกิดข้อผิดพลาด");
  }
});


export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          state.currentUser = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || "เกิดข้อผิดพลาด";
        })

        .addCase(register.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          state.currentUser = action.payload;
        })
        .addCase(register.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || "เกิดข้อผิดพลาดในการสมัคร";
        })

        .addCase(logout.fulfilled, (state) => {
          state.currentUser = null;
        });
    }
});

export default authSlice.reducer;