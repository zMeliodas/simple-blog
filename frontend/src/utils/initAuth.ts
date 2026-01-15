import { supabase } from "../services/supabaseClient.ts";
import { setSession } from "../redux/authSlice.ts";
import type { AppDispatch } from "../redux/store.ts";

export function initAuth(dispatch: AppDispatch) {
    
  supabase.auth.getSession().then((data) => {
    dispatch(setSession(data.data.session));
  });

  return supabase.auth.onAuthStateChange((_, session) => {
    dispatch(setSession(session));
  });
}
