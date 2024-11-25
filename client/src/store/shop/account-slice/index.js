import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  userInfo: {},
};

export const updateAccountInfo = createAsyncThunk(
  "/account/updateAccountInfo",
  async (formData) => {
    const response = await axios.put(
      "http://localhost:5000/api/user/update", // Ensure this is correct
      { userId: formData.userId, userData: formData } // Adjust as necessary
    );
    return response.data;
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateAccountInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAccountInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload.data; // Assuming the response contains updated user info
      })
      .addCase(updateAccountInfo.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default accountSlice.reducer;