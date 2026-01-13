import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.ts";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({ reducer: { auth: authReducer } });

type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAuthState = useSelector.withTypes<RootState>();
