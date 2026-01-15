import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.ts";
import blogReducer from "./BlogSlice.ts";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: { auth: authReducer, blog: blogReducer },
});

type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();
