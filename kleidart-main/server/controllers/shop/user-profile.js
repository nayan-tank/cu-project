import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch user details
export const fetchUserDetails = createAsyncThunk("user/fetchDetails", async () => {
  const response = await axios.get("/api/user/profile");
  return response.data;
});

// Update user details
export const updateUserDetails = createAsyncThunk("user/updateDetails", async (userData) => {
  const response = await axios.put("/api/user/profile", userData);
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

module.exports = userSlice.reducer 
