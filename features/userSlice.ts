import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import User from "@/api/models/user.model";
import Api from "@/lib/api";
import { LoadingState } from "./features";

export const getCurrentUser = createAsyncThunk("", async () => {
  const response = await Api.instance.userController.currentUser();
  return response.data;
});

type State = {
  user?: User;
} & LoadingState;

const userSlice = createSlice({
  name: "user",
  initialState: (): State => ({
    state: "idle",
  }),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.state = "pending";
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.state = "failed";
      })
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.state = "success";
      });
  },
});

export default userSlice;
export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
