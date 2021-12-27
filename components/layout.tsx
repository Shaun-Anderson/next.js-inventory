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
  const fetcher = (url, token) =>
    fetch(url, {
      method: "GET",
      headers: new Headers({ "Content-Type": "application/json", token }),
      credentials: "same-origin",
    }).then((res) => res.json());

  // const [session, setSession] = useState(null);
  const session = supabase.auth.session();
  const { data, error } = useSWR(
    session ? ["/api/getUser", session.access_token] : null,
    fetcher
  );
  const [authView, setAuthView] = useState("sign_in");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") setAuthView("forgotten_password");
        if (event === "USER_UPDATED")
          setTimeout(() => setAuthView("sign_in"), 1000);
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   setSession(supabase.auth.session());

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });
  // }, []);
  console.log(!session);
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
