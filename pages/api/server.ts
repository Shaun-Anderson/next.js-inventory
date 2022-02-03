import { supabase } from "../../utils/supabaseClient";

export async function getServers() {
  const user = supabase.auth.user();
  const { data: posts, error } = await supabase
    .from("servers")
    .select(
      `
    *,
    brand: brand_id(*),
    location:location_id (
      *
    )
  `
    )
    .order("id")
    .eq("user_id", user?.id);

  if (error) throw error.message;
  return posts;
}

export async function getServerForLocation(api: string, location_id: number) {
  const user = supabase.auth.user();
  console.log(location_id);
  const { data: posts, error } = await supabase
    .from("servers")
    .select("*")
    .eq("location_id", location_id)
    .eq("user_id", user?.id);
  if (error) throw error.message;
  return posts;
}

export async function getServer(id: number) {
  const user = supabase.auth.user();
  console.log(id);
  const { data: posts, error } = await supabase
    .from("servers")
    .select(
      `
    *,
    brand: brand_id(*),
    location:location_id (
      *
    )
  `
    )
    .eq("id", id)
    .eq("user_id", user?.id)
    .limit(1)
    .single();
  if (error) throw error.message;
  return posts;
}
