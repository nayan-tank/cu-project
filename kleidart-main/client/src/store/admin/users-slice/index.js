import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userList: [],
  userDetails: null,
  isLoading: false,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async Thunks
export const getAllUsersForAdmin = createAsyncThunk(
  "/user/getAllUsersForAdmin",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api/admin/users/get`, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const getUserDetailsForAdmin = createAsyncThunk(
  "/user/getUserDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/admin/users/get/${id}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const updateUserDetailsForAdmin = createAsyncThunk(
  "/user/updateUserDetailsForAdmin",
  async ({ id, userDetails }) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/admin/users/update/${id}`,
      userDetails, // Sending only userDetails
      { withCredentials: true }
    );
    return response.data;
  }
);

export const deleteUserDetailsForAdmin = createAsyncThunk(
  "/user/deleteUserDetailsForAdmin",
  async ({ id }) => {
    await axios.put(`${API_BASE_URL}/api/admin/users/delete/${id}`, {}, {
      withCredentials: true,
    });
    return id; // Return the deleted user's ID
  }
);

// Slice Definition
const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    resetUserDetails: (state) => {
      state.userDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(getAllUsersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.userList = [];
      })

      // Get User Details
      .addCase(getUserDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.data;
      })
      .addCase(getUserDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.userDetails = null;
      })

      // In your slice
      .addCase(updateUserDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;

        // Assuming the response contains the updated user data
        const updatedUser = action.payload.data;

        // Update the user details in userList
        if (state.userList && state.userList.length > 0) {
          const index = state.userList.findIndex(user => user._id === updatedUser._id);
          if (index !== -1) {
            // Replace the old user with the updated user
            state.userList[index] = updatedUser;
          }
        }

        // Optionally, update the `userDetails` if you have a separate detail view
        state.userDetails = updatedUser;
      })
      .addCase(updateUserDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.userDetails = null;
      })


      // Delete User
      .addCase(deleteUserDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted user from the userList
        state.userList = state.userList.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUserDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Export Actions and Reducer
export const { resetUserDetails } = adminUserSlice.actions;
export default adminUserSlice.reducer;
