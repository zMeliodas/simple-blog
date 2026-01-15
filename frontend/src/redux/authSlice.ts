import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  initialized: boolean;
}

const initialState: AuthState = { session: null, initialized: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.initialized = true;
    },
  },
});

export const { setSession } = authSlice.actions;
export default authSlice.reducer;
