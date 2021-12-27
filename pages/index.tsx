import { ReactElement, useEffect, useState } from "react";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  return (
    <section>
      <h2>Layout Example (Index)</h2>
      <button onClick={() => router.push("/login")}>Log in</button>
      <p>
        This example adds a property <code>getLayout</code> to your page,
        allowing you to return a React component for the layout. This allows you
        to define the layout on a per-page basis. Since we're returning a
        function, we can have complex nested layouts if desired.
      </p>
      <p>
        When navigating between pages, we want to persist page state (input
        values, scroll position, etc) for a Single-Page Application (SPA)
        experience.
      </p>
      <p>
        This layout pattern will allow for state persistence because the React
        component tree is persisted between page transitions. To preserve state,
        we need to prevent the React component tree from being discarded between
        page transitions.
      </p>
      <h3>Try It Out</h3>
      <p>
        To visualize this, try tying in the search input in the{" "}
        <code>Sidebar</code> and then changing routes. You'll notice the input
        state is persisted.
      </p>
    </section>
  );
}
