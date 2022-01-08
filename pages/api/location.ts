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

export async function getLocation(id: number) {
  const user = supabase.auth.user();
  console.log(id);
  const { data: posts, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .limit(1)
    .single();
  if (error) throw error.message;
  return posts;
}
