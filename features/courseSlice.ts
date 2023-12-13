import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import Course from "../api/models/course.model";
import Api from "../lib/api";

import { LoadingState, PaginateState } from "./features";

const courseAdapter = createEntityAdapter<Course>({
  sortComparer: (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at)
});

export const getCourses = createAsyncThunk(
  "courses/getCourses",
  async ([options]: Parameters<typeof Api.instance.courseController.list>) => {
    const response = await Api.instance.courseController.list(options);
    return {
      options: options,
      response: response.data,
    };
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: courseAdapter.getInitialState<LoadingState & PaginateState>({
    count: 0,
    state: "idle",
    next: null,
    previous: null,
  }),
  reducers: {
    setAll: courseAdapter.setAll,
    setOne: courseAdapter.setOne,
    addOne: courseAdapter.addOne,
    addMany: courseAdapter.addMany,
    updateOne: courseAdapter.updateOne,
    removeOne: courseAdapter.removeOne,
    removeMany: courseAdapter.removeMany,
  },
  extraReducers(builder) {
    builder
      .addCase(getCourses.pending, (state) => {
        if (state.count == 0) state.state = "pending";
      })
      .addCase(getCourses.rejected, (state, { payload }) => {
        if (state.count == 0) state.state = "failed";
      })
      .addCase(getCourses.fulfilled, (state, { payload }) => {
        const { options, response } = payload;
        state.state = "success";
        state.count = response.count;
        state.next = response.next;
        state.previous = response.previous;

        if (options?.url) courseAdapter.addMany(state, response.results);
        else courseAdapter.setAll(state, response.results);
      });
  },
});

export const courseActions = courseSlice.actions;
export const courseReducer = courseSlice.reducer;
export const courseSelector = courseAdapter.getSelectors();

export default courseSlice;
