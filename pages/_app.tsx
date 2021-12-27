import "../styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import "regenerator-runtime/runtime";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/supabaseClient";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
      }}
    >
      <ModalsProvider>
        <Auth.UserContextProvider supabaseClient={supabase}>
          {getLayout(<Component {...pageProps} />)}
        </Auth.UserContextProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
