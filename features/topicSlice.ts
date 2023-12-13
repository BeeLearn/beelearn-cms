import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import Api from "@/lib/api";
import Topic, { TopicBreadCrumb } from "@/api/models/topic.model";

import { BreadCrumbState, LoadingState, PaginateState } from "./features";

const topicAdapter = createEntityAdapter<Topic>({
  sortComparer: (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
});

export const getTopics = createAsyncThunk(
  "topics/getTopics",
  async ([options]: Parameters<typeof Api.instance.topicController.list>) => {
    const response = await Api.instance.topicController.list(options);
    return {
      options,
      data: response.data,
    };
  }
);

const topicSlice = createSlice({
  name: "topics",
  initialState: topicAdapter.getInitialState<
    LoadingState & PaginateState & BreadCrumbState<TopicBreadCrumb>
  >({
    state: "idle",
    count: 0,
  }),
  reducers: {
    addOne: topicAdapter.addOne,
    addMany: topicAdapter.addMany,
    updateOne: topicAdapter.updateOne,
    removeOne: topicAdapter.removeOne,
    removeMany: topicAdapter.removeMany,
  },
  extraReducers(builder) {
    builder
      .addCase(getTopics.pending, (state) => {
        if (state.count == 0) state.state = "pending";
      })
      .addCase(getTopics.rejected, (state) => {
        if (state.count == 0) state.state = "failed";
      })
      .addCase(getTopics.fulfilled, (state, { payload }) => {
        const { options, data } = payload;
        const { response, breadcrumb } = data;

        state.state = "success";
        state.count = response.count;
        state.next = response.next;
        state.previous = response.previous;
        state.breadcrumb = breadcrumb;

        if (options?.url) topicAdapter.addMany(state, response.results);
        else topicAdapter.setAll(state, response.results);
      });
  },
});

export default topicSlice;
export const topicActions = topicSlice.actions;
export const topicReducer = topicSlice.reducer;
export const topicSelector = topicAdapter.getSelectors();
