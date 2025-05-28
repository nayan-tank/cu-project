import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// export const addReview = createAsyncThunk(
//   "/order/addReview",
//   async (formdata) => {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/shop/review/add`,
//       formdata
//     );
//     console.log("response", response)
//     return response.data;
//   }
// );

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/shop/review/add`,
        formdata
      );
      // console.log("Response from backend:", response);

      // Check if the response.data exists and has the success field
      if (response?.data?.success !== undefined) {
        return response.data;
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      // console.error("Error adding review:", error);
      return error
    }
  }
);

export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/shop/review/${id}`
  );

  return response.data;
});

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        console.log(state);
        
        state.isLoading = false;
        state.reviews = [];
      })


      .addCase(addReview.pending, (state) => {
        console.log("loading");
        
      })
      .addCase(addReview.fulfilled, (state, action) => {
        console.log("success");
        
      })
      .addCase(addReview.rejected, (state, action) => {
        console.log(action);
        
      })
  },
});

export default reviewSlice.reducer;
