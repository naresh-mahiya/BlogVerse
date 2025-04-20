import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../appwrite/auth";

const initialState = {
  status: JSON.parse(localStorage.getItem("status")) || false,
  userData: JSON.parse(localStorage.getItem("userData")) || null,
  error: null,
  loading: false,
};
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const session = await authService.login(credentials);
      if (session) return session;
      else throw new Error();
    } catch (error) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      return rejectWithValue(error?.message || "Logout failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const session = await authService.createAccount(credentials);
      if (session) return session;
      else throw Error();
    } catch (error) {
      return rejectWithValue(error?.message || "Registration failed");
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.status = true;
        state.error = null;
        state.loading = false;
        localStorage.setItem("status", true);
        localStorage.setItem("userData", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.status = false;
        state.userData = null;
        localStorage.removeItem("status");
        localStorage.removeItem("userData");
      })

      .addCase(logout.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.error = null;
        state.userData = null;
        state.status = false;
        state.loading = false;
        localStorage.removeItem("status");
        localStorage.removeItem("userData");
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = false;
        state.userData = null;
        state.loading = false;
        state.error = action.payload;
        localStorage.removeItem("status");
        localStorage.removeItem("userData");
      })

      .addCase(register.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
        localStorage.setItem("status", true);
        localStorage.setItem("userData", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
        state.userData = null;
        localStorage.removeItem("status");
        localStorage.removeItem("userData");
      });
  },
});

export default authSlice.reducer;
