"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

const logoSrc = "/gymbuddy_image/logo/Logo.png";
const loginRoleStorageKey = "gymbuddy:login-role";
type LoginRole = "member";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedLoginRole] = useState<LoginRole>("member");
  const [errorMessage, setErrorMessage] = useState("");
  const [portalNotice, setPortalNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loginSelectedRole() {
    setErrorMessage("");
    setPortalNotice("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error(`${selectedLoginRole} login failed`, error);
      setErrorMessage("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem(loginRoleStorageKey, selectedLoginRole);
    window.location.href = "/dashboard";
  }

  function showComingSoon(role: "Admin" | "Trainer") {
    setErrorMessage("");
    setPortalNotice(`${role} portal coming soon`);
  }

  return (
    <main className="min-h-screen w-full bg-[#0a0d0b] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-lg border border-white/10 bg-[#111713] shadow-2xl shadow-black/30 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-white/10 bg-black/20 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <div className="flex items-center gap-3.5">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400">
                <Image src={logoSrc} alt="GymBuddy logo" fill sizes="48px" className="object-contain p-1" />
              </span>
              <p className="text-xl tracking-normal text-white">
                <span className="font-semibold">Gym</span>
                <span className="font-normal text-zinc-100">Buddy</span>
              </p>
            </div>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Member Login</p>
            <h1 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Welcome back</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Access your fitness workspace.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <Link href="/" className="mb-5 inline-flex rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-bold text-zinc-300 transition hover:border-lime-300/40 hover:text-lime-200">
              Back to Home
            </Link>
            <div className="grid gap-4">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      loginSelectedRole();
                    }
                  }}
                  className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60"
                />
              </label>
            </div>

            {errorMessage ? (
              <p className="mt-4 rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">{errorMessage}</p>
            ) : null}
            {portalNotice ? (
              <p className="mt-4 rounded-lg border border-lime-300/20 bg-lime-300/10 px-3 py-2 text-sm font-semibold text-lime-100">{portalNotice}</p>
            ) : null}

            <button
              type="button"
              onClick={loginSelectedRole}
              disabled={isSubmitting}
              className="mt-6 h-11 w-full rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => showComingSoon("Admin")}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-bold text-zinc-400"
              >
                <span>Admin</span>
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-lime-200">
                  Coming Soon
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPortalNotice("")}
                className="flex items-center justify-between gap-3 rounded-lg border border-lime-300/40 bg-lime-300/10 px-4 py-3 text-left text-sm font-bold text-lime-100"
              >
                <span>Member</span>
              </button>
              <button
                type="button"
                onClick={() => showComingSoon("Trainer")}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-bold text-zinc-400"
              >
                <span>Trainer</span>
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-lime-200">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
