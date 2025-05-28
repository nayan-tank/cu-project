import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
  galleryImageList: [],
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getFeatureImages = createAsyncThunk(
  "/feature/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/common/feature/get`,{
        withCredentials: true
      }
    );

    return response.data;
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "/feature/deleteFeatureImage",
  async (id) => {

    const response = await axios.delete(
      `${API_BASE_URL}/api/common/feature/delete/${id}`,{
        withCredentials: true
      }
    );

    return response?.data;
  }
);

export const addGalleryImage = createAsyncThunk(
  "/gallery/addGalleryImage",
  async (image) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/common/gallery/add`,
      { image },
      {
        withCredentials: true
      }
    );

    return response.data;
  }
);

export const getGalleryImages = createAsyncThunk(
  "/dallery/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/common/gallery/get`,{
        withCredentials: true
      }
    );

    return response.data;
  }
);

export const deleteGalleryImage = createAsyncThunk(
  "/gallery/deleteFeatureImage",
  async (id) => {

    const response = await axios.delete(
      `${API_BASE_URL}/api/common/gallery/delete/${id}`,{
        withCredentials: true
      }
    );

    return response?.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/feature/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/common/feature/add`,
      { image },
      {
        withCredentials: true
      }
    );

    return response.data;
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })
      .addCase(getGalleryImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGalleryImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleryImageList = action.payload.data;
      })
      .addCase(getGalleryImages.rejected, (state) => {
        state.isLoading = false;
        state.galleryImageList = [];
      });
  },
});

export default commonSlice.reducer;
