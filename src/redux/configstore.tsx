import { configureStore } from "@reduxjs/toolkit";
import animalReducer from "./animalSlice";

const store = configureStore({
  reducer: {
    animals: animalReducer,
    // 다른 리듀서들도 필요한 경우 여기에 추가
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
