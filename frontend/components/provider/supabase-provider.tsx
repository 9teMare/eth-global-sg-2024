"use client";

import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { createContext, ReactNode } from "react";

export const SupabaseContext = createContext<SupabaseClient | null>(null);

export default function SupabaseProvider({ children }: { children: ReactNode }) {
    const supabase = createClient();

    return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
}
