import { SupabaseClient } from "@supabase/supabase-js";
import { create } from "zustand";

type State = {
    supabase: SupabaseClient | null;
};

type Actions = {
    setSupabaseClient: (supabase: SupabaseClient) => void;
};

export const useSupabase = create<State & Actions>((set) => ({
    supabase: null,
    setSupabaseClient: (supabase) => set({ supabase }),
}));
