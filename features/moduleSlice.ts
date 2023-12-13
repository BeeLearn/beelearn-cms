import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import Api from "@/lib/api";
import Module, { ModuleBreadCrumb } from "@/api/models/module.model";

import { BreadCrumbState, LoadingState, PaginateState } from "./features";

const moduleAdapter = createEntityAdapter<Module>({
  sortComparer: (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
});

export const getModules = createAsyncThunk(
  "modules/getModules",
  async ([options]: Parameters<typeof Api.instance.moduleController.list>) => {
    const response = await Api.instance.moduleController.list(options);

    return {
      options: options,
      data: response.data,
    };
  }
);

const moduleSlice = createSlice({
  name: "modules",
  initialState: moduleAdapter.getInitialState<LoadingState & PaginateState & BreadCrumbState<ModuleBreadCrumb>>({
    state: "idle",
    count: 0,
  }),
  reducers: {
    addOne: moduleAdapter.addOne,
    updateOne: moduleAdapter.updateOne,
    removeOne: moduleAdapter.removeOne,
    removeMany: moduleAdapter.removeMany,
  },
  extraReducers(builder) {
    builder
      .addCase(getModules.pending, (state) => {
        if (state.count == 0) state.state = "pending";
      })
      .addCase(getModules.rejected, (state) => {
        if (state.count == 0) state.state = "failed";
      })
      .addCase(getModules.fulfilled, (state, { payload }) => {
        const { options, data } = payload;
        const { response, breadcrumb} = data;

        state.state = "success";
        state.count = response.count;
        state.next = response.next;
        state.previous = response.previous;

        state.breadcrumb = breadcrumb;

        if (options?.url) moduleAdapter.addMany(state, response.results);
        else moduleAdapter.setAll(state, response.results);
      });
  },
});

export default moduleSlice;

export const moduleActions = moduleSlice.actions;
export const moduleReducer = moduleSlice.reducer;
export const moduleSelector = moduleAdapter.getSelectors();
