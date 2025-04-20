import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../appwrite/auth";

const initialState = {
  status: JSON.parse(localStorage.getItem("status")) || false,
  userData: JSON.parse(localStorage.getItem("userData")) || null,
  error: null,
  loading: false,
};

//  UPDATED: login thunk now also fetches user info after session is created
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      await authService.login(credentials); // just create session
      const user = await authService.getCurrentUser(); // get actual user info
      return user;
    } catch (error) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

// ✅ UPDATED: register thunk also fetches user info after account is created
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      await authService.createAccount(credentials); // create account + session
      const user = await authService.getCurrentUser(); // get actual user info
      return user;
    } catch (error) {
      return rejectWithValue(error?.message || "Registration failed");
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

// (already correct) - fetchCurrentUser thunk
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      if (user) return user;
      else throw new Error("No active user");
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch current user");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.status = true;
        state.error = null;
        state.loading = false;
        localStorage.setItem("status", true);
        localStorage.setItem("userData", JSON.stringify(action.payload)); // ✅ stores name + email now
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.status = false;
        state.userData = null;
        localStorage.removeItem("status");
        localStorage.removeItem("userData");
      })

      .addCase(logout.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
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

      .addCase(register.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
        localStorage.setItem("status", true);
        localStorage.setItem("userData", JSON.stringify(action.payload)); // ✅ stores name + email now
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
        state.userData = null;
        localStorage.removeItem("status");
        localStorage.removeItem("userData");
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.status = true;
        state.loading = false;
        localStorage.setItem("status", true);
        localStorage.setItem("userData", JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.userData = null;
        state.status = false;
        state.loading = false;
        state.error = action.payload;
        localStorage.removeItem("status");
        localStorage.removeItem("userData");
      });
  },
});

export default authSlice.reducer;
