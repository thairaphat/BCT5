// store/auth/loginSlice.ts
import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import * as api from "../../services/api"; 
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';

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
      const response = await axios.post('http://localhost:3000/api/login', { student_id, password });
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
