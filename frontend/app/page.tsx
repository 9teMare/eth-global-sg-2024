import { useSupabase } from "@/store/supabaseStore";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
    const supabase = createClient();
    const { setSupabaseClient } = useSupabase();
    setSupabaseClient(supabase);

    return null;
}
