import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {emptySplitApi} from "../features/api/apiSlice";

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(emptySplitApi.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
