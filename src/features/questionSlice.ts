import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import Api from "@/lib/api";
import Question, { ContentTypes } from "@/api/models/question.model";

import { LoadingState, PaginateState } from "./features";
import Paginate from "@/api/models/paginate.model";
import { groupBy } from "@/lib/arrayHelper";

type TListQuestion = {
  query?: Record<string, any>;
  urls?: string[];
};

export const listQuestions = async (options?: TListQuestion) => {
  let response;
  options = options ?? {};

  if (options!.urls)
    response = options.urls.map((url) => {
      return Api.instance.questionController
        .list({ url })
        .then((response) => response.data);
    });
  else
    response = Object.keys(ContentTypes).map((type) => {
      options!.query = Object.assign(options!.query ?? {}, {
        content_type: type,
      });

      return Api.instance.questionController
        .list(options!)
        .then((response) => response.data);
    });

  return Promise.all(response);
};

export const deleteQuestions = async (questions: Question[]) => {
  const group = groupBy(questions, (question) => question.content_type);

  const pks: string[] = [];
  const response = [];

  for (const [contentType, data] of group.entries()) {
    const ids = data.map((data) => data.id);

    response.push(
      Api.instance.questionController.remove({
        path: "bulk-delete",
        query: {
          ids,
          content_type: contentType,
        },
      })
    );

    pks.push(...data.map((data) => data.created_at));
  }

  await Promise.all(response);

  return pks;
};

export const transformPagination = (payload: Paginate<Question>[]) =>
  payload.map((data) => ({
    count: data.count,
    next: data.next,
    previous: data.previous,
  }));

export const getQuestions = createAsyncThunk(
  "questions/getQuestions",
  listQuestions
);

const questionAdapter = createEntityAdapter<Question>({
  selectId: (question) => question.created_at,
});

const questionSlice = createSlice({
  name: "questions",
  initialState: questionAdapter.getInitialState<
    LoadingState & { paginate: PaginateState[] }
  >({
    state: "idle",
    paginate: [],
  }),
  reducers: {
    addOne: questionAdapter.addOne,
    addMany: questionAdapter.addMany,
    updateOne: questionAdapter.updateOne,
    removeOne: questionAdapter.removeOne,
    removeMany: questionAdapter.removeMany,
    setPaginate(state, { payload }: PayloadAction<PaginateState[]>) {
      state.paginate = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getQuestions.pending, (state) => {
        state.state = "pending";
      })
      .addCase(getQuestions.rejected, (state) => {
        state.state = "failed";
      })
      .addCase(getQuestions.fulfilled, (state, { payload }) => {
        state.paginate = transformPagination(payload);
        const questions = payload.map((data) => data.results);

        questionAdapter.setAll(state, questions.flat());

        state.state = "success";
      });
  },
});

export default questionSlice;
export const questionActions = questionSlice.actions;
export const questionReducers = questionSlice.reducer;
export const questionSelector = questionAdapter.getSelectors();
