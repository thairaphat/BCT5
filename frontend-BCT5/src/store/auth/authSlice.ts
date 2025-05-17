import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import * as api from "../../services/api"; 
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  student_id: string;
}

interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  status: 'idle',
  error: null,
};

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  student_id: string;
  faculty: string;
  major: string;
}

export const register = createAsyncThunk<
  User,
  { name: string; lastName: string; email: string; password: string; student_id: string; faculty: string; major: string },
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const { name, lastName, email, password, student_id, faculty, major } = data;

      if (!token) throw new Error("Token not found in response");

      localStorage.setItem('token', token);
      return token;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed';
      return thunkAPI.rejectWithValue(message);
    }

    const user: User = {
      id: Date.now().toString(),
      name,
      lastName,
      email,
      student_id,
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

export const login = createAsyncThunk<User, { studentId: string; password: string }, { rejectValue: string }>(
  "auth/login",
  async ({ studentId, password }, { rejectWithValue }) => {
    try {
      const response = await api.login(studentId, password);
      const { token, user } = response;

      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return user; // user ต้องมี student_id
    } catch (error) {
      return rejectWithValue("Login failed");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
