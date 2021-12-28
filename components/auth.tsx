import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn({ email });
      console.log(session);
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn(
        {
          provider: "github",
        },
        { redirectTo: "http://localhost:3000/dashboard" }
      );
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="row flex flex-center">
      <h1 className="header">Supabase + Next.js</h1>
      <p className="description">
        Sign in via magic link with your email below
      </p>
      <div>
        <input
          className="inputField"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin(email);
          }}
          className="button block"
          disabled={loading}
        >
          <span>{loading ? "Loading" : "Send magic link"}</span>
        </button>
        <button
          className="mt-4 p-2 pl-5 pr-5 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300"
          onClick={() => handleGitHubLogin()}
          disabled={loading}
        >
          {loading ? "Logging in" : "Login with GitHub"}
        </button>
      </div>
    </main>
  );
}
