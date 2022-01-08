import { supabase } from "../../utils/supabaseClient";

export async function getLocations() {
  const user = supabase.auth.user();
  const { data: posts, error } = await supabase
    .from("locations")
    .select(`*`)
    .eq("user_id", user?.id);

  if (error) throw error.message;
  return posts;
}
