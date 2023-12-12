import { configureStore } from "@reduxjs/toolkit";

import { courseReducer } from "@/features/courseSlice";
import { moduleReducer } from "@/features/moduleSlice";
import { lessonReducer } from "@/features/lessonSlice";
import { topicReducer } from "@/features/topicSlice";
import { questionReducers } from "@/features/questionSlice";
import { userReducer } from "@/features/userSlice";

const store = configureStore({
  reducer: {
    course: courseReducer,
    module: moduleReducer,
    lesson: lessonReducer,
    topic: topicReducer,
    question: questionReducers,
    user: userReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
