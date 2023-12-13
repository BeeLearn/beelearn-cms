import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import Api from "@/lib/api";
import Lesson, { LessonBreadCrumb } from "@/api/models/lesson.model";

import { BreadCrumbState, LoadingState, PaginateState } from "./features";

const lessonAdapter = createEntityAdapter<Lesson>({
  sortComparer: (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at)
});

export const getLessons = createAsyncThunk(
  "lessons/getLessons",
  async ([options]: Parameters<typeof Api.instance.lessonController.list>) => {
    const response = await Api.instance.lessonController.list(options);

    return {
      options: options,
      data: response.data,
    };
  }
);

const lessonSlice = createSlice({
  name: "lessons",
  initialState: lessonAdapter.getInitialState<
    LoadingState & PaginateState & BreadCrumbState<LessonBreadCrumb>
  >({
    state: "idle",
    count: 0,
  }),
  reducers: {
    addOne: lessonAdapter.addOne,
    updateOne: lessonAdapter.updateOne,
    removeOne: lessonAdapter.removeOne,
    removeMany: lessonAdapter.removeMany,
  },
  extraReducers(builder) {
    builder
      .addCase(getLessons.pending, (state) => {
        if (state.count == 0) state.state = "pending";
      })
      .addCase(getLessons.rejected, (state) => {
        if (state.count == 0) state.state = "failed";
      })
      .addCase(getLessons.fulfilled, (state, { payload }) => {
        const { options, data } = payload;
        const { breadcrumb, response } = data;

        state.state = "success";
        state.count = response.count;
        state.next = response.next;
        state.previous = response.previous;
        state.breadcrumb = breadcrumb;

        if (options?.url) lessonAdapter.addMany(state, response.results);
        else lessonAdapter.setAll(state, response.results);
      });
  },
});

export default lessonSlice;

export const lessonActions = lessonSlice.actions;
export const lessonReducer = lessonSlice.reducer;
export const lessonSelector = lessonAdapter.getSelectors();
