import { ReactElement, useEffect, useState } from "react";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Header from "../components/header";
import { Button } from "@mantine/core";
import { Link, Plus } from "phosphor-react";

export default function Index() {
  const router = useRouter();
  return (
    <section
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 10,
      }}
    >
      <Header
        title="Saas Example"
        showBreadcumbs={false}
        rightArea={
          <Button color="dark" onClick={() => router.push("/login")}>
            Login with Github
          </Button>
        }
      />
      <p>
        This is an example of an fullstack application using next-js and
        supabase
      </p>
    </section>
  );
}
