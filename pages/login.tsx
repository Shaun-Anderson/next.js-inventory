import { ReactElement, useEffect, useState } from "react";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Auth from "../components/auth";

export default function Index() {
  const router = useRouter();
  return <Auth />;
}
