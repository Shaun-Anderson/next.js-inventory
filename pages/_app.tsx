import "../styles/globals.css";
import { ReactElement, ReactNode, useEffect } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import "regenerator-runtime/runtime";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { ModalProvider } from "use-modal-hook";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.session();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event, session);
        console.log(session);
        console.log(`UserContext.onAuthStateChange event=${event}`);
        if (event == "SIGNED_IN") {
          // Send session to /api/auth route to set the auth cookie.
          // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
          fetch("/api/auth", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            credentials: "same-origin",
            body: JSON.stringify({ event, session }),
          }).then((res) => {
            res.json();
            router.push("/dashboard");
          });
        }
        if (event == "SIGNED_OUT") {
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
      }}
    >
      <ModalsProvider modalProps={{}}>
        <ModalProvider>
          <Auth.UserContextProvider supabaseClient={supabase}>
            {getLayout(<Component {...pageProps} />)}
          </Auth.UserContextProvider>
        </ModalProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
