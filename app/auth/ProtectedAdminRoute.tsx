"use client";

import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../../lib/supabase";

export default function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    function redirectAfterMissingSession() {
      if (sessionStorage.getItem("gymbuddy:logout-home") === "true") {
        sessionStorage.removeItem("gymbuddy:logout-home");
        window.location.replace("/");
        return;
      }

      window.location.replace("/login");
    }

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (!data.session) {
        redirectAfterMissingSession();
        return;
      }

      setIsAuthenticated(true);
      setCheckingSession(false);
    }

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        redirectAfterMissingSession();
        return;
      }

      setIsAuthenticated(true);
      setCheckingSession(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (checkingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0a0d0b] px-4 text-white">
        <p className="rounded-lg border border-white/10 bg-[#111713] px-5 py-4 text-sm font-bold text-zinc-300 shadow-2xl shadow-black/20">
          Checking admin session...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
