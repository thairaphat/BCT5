// store/auth/loginSlice.ts
import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: apiBaseUrl,

// const apiClient = axios.create({
//   baseURL: " https://btc5.thiraphat.online/backendapi/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const login = createAsyncThunk<
  string, // payload type = token
  { student_id: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async ({ student_id, password }, thunkAPI) => {
    try {
      const response = await api.post(apiBaseUrl + '/login', { student_id, password });
      const token = response.data.token;

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
  }
);

const loginSlice = createSlice({
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
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
