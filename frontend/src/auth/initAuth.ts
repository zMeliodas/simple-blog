import { supabase } from "./supabaseClient.ts";
import { setSession } from "./authSlice.ts";
import type { AppDispatch } from "./store.ts";

export function initAuth(dispatch: AppDispatch) {
    
  supabase.auth.getSession().then((data) => {
    dispatch(setSession(data.data.session));
  });

  return supabase.auth.onAuthStateChange((_, session) => {
    dispatch(setSession(session));
  });
}
