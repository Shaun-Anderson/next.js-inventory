import { ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import styles from "./layout.module.css";
import { AppShell, Navbar, Header, Center } from "@mantine/core";
import Sidebar from "../components/sidebar";
import { Calculator } from "phosphor-react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/auth";
import useSWR from "swr";

export default function Layout({ children }) {
  // const fetcher = (url, token) =>
  //   fetch(url, {
  //     method: "GET",
  //     headers: new Headers({ "Content-Type": "application/json", token }),
  //     credentials: "same-origin",
  //   }).then((res) => res.json());

  // const [session, setSession] = useState(null);
  const session = supabase.auth.session();
  // console.log(session);
  // const { data, error } = useSWR(
  //   session ? ["/api/getUser", session.access_token] : null,
  //   fetcher
  // );
  // const [authView, setAuthView] = useState("sign_in");

  if (session)
    return (
      <AppShell
        padding="md"
        className={styles.root}
        navbar={<Sidebar session={session} />}
        styles={(theme) => ({
          main: {
            paddingTop: "34px",
            width: "calc(100vw - 300px)",
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        {children}
      </AppShell>
    );

  return <Auth />;
}
