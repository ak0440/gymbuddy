"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SUPABASE_DEBUG_URL, supabase } from "../../../lib/supabase";

type QueryDebug<T> = {
  count: number;
  data: T | null;
  error: unknown;
};

type DebugState = {
  env: {
    supabaseUrl: string;
    anonKeyExists: boolean;
    anonKeyPreview: string;
  };
  authUser: {
    loggedIn: boolean;
    userId: string;
    email: string;
    raw: unknown;
    error: unknown;
  };
  session: {
    exists: boolean;
    accessTokenExists: boolean;
    expiresAt: string;
    raw: unknown;
    error: unknown;
  };
  userProfiles: QueryDebug<unknown[]>;
  gyms: QueryDebug<unknown[]>;
  members: QueryDebug<unknown[]>;
  directGymLookup: {
    gymIdUsed: string;
    data: unknown;
    error: unknown;
  };
};

const emptyDebugState: DebugState = {
  env: {
    supabaseUrl: "",
    anonKeyExists: false,
    anonKeyPreview: "",
  },
  authUser: {
    loggedIn: false,
    userId: "",
    email: "",
    raw: null,
    error: null,
  },
  session: {
    exists: false,
    accessTokenExists: false,
    expiresAt: "",
    raw: null,
    error: null,
  },
  userProfiles: {
    count: 0,
    data: null,
    error: null,
  },
  gyms: {
    count: 0,
    data: null,
    error: null,
  },
  members: {
    count: 0,
    data: null,
    error: null,
  },
  directGymLookup: {
    gymIdUsed: "",
    data: null,
    error: null,
  },
};

function stringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20">
      <h2 className="text-lg font-black text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-white/10 py-2 last:border-b-0 sm:grid-cols-[220px_minmax(0,1fr)]">
      <dt className="text-sm font-semibold text-zinc-500">{label}</dt>
      <dd className="break-all text-sm font-bold text-white">{value || "-"}</dd>
    </div>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-80 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-5 text-lime-100">
      {stringify(value)}
    </pre>
  );
}

export default function SupabaseDebugPage() {
  const [debug, setDebug] = useState<DebugState>(emptyDebugState);
  const [loading, setLoading] = useState(true);

  const runDebug = useCallback(async () => {
    setLoading(true);

    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const env = {
      supabaseUrl: SUPABASE_DEBUG_URL || "",
      anonKeyExists: anonKey.length > 0,
      anonKeyPreview: anonKey ? anonKey.slice(0, 12) : "",
    };
    console.log("[DEBUG_ENV]", env);

    const authResult = await supabase.auth.getUser();
    const user = authResult.data.user;
    const authUser = {
      loggedIn: Boolean(user),
      userId: user?.id || "",
      email: user?.email || "",
      raw: authResult.data,
      error: authResult.error,
    };
    console.log("[DEBUG_AUTH_USER]", authResult);

    const sessionResult = await supabase.auth.getSession();
    const session = sessionResult.data.session;
    const sessionDebug = {
      exists: Boolean(session),
      accessTokenExists: Boolean(session?.access_token),
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : "",
      raw: sessionResult.data,
      error: sessionResult.error,
    };
    console.log("[DEBUG_SESSION]", sessionResult);

    const userProfilesResult = await supabase.from("user_profiles").select("*").limit(10);
    const userProfiles = {
      count: userProfilesResult.data?.length ?? 0,
      data: userProfilesResult.data ?? null,
      error: userProfilesResult.error,
    };
    console.log("[DEBUG_USER_PROFILES]", userProfilesResult);

    const gymsResult = await supabase.from("gyms").select("*").limit(10);
    const gyms = {
      count: gymsResult.data?.length ?? 0,
      data: gymsResult.data ?? null,
      error: gymsResult.error,
    };
    console.log("[DEBUG_GYMS]", gymsResult);

    const membersResult = await supabase.from("members").select("id, full_name, gym_id").limit(10);
    const members = {
      count: membersResult.data?.length ?? 0,
      data: membersResult.data ?? null,
      error: membersResult.error,
    };
    console.log("[DEBUG_MEMBERS]", membersResult);

    const firstProfile = userProfilesResult.data?.[0] as { gym_id?: string | null } | undefined;
    const gymIdUsed = firstProfile?.gym_id || "";
    const directGymResult = gymIdUsed
      ? await supabase.from("gyms").select("*").eq("id", gymIdUsed).maybeSingle()
      : { data: null, error: null };
    const directGymLookup = {
      gymIdUsed,
      data: directGymResult.data,
      error: directGymResult.error,
    };
    console.log("[DEBUG_DIRECT_GYM_LOOKUP]", directGymLookup);

    setDebug({
      env,
      authUser,
      session: sessionDebug,
      userProfiles,
      gyms,
      members,
      directGymLookup,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      runDebug();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [runDebug]);

  return (
    <main className="min-h-screen bg-[#070b08] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Development Only</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Supabase Debug</h1>
            <p className="mt-2 text-sm text-zinc-400">Shows what this browser session can see from Supabase.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={runDebug}
              disabled={loading}
              className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Refreshing..." : "Refresh Debug"}
            </button>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Environment">
            <dl>
              <Row label="NEXT_PUBLIC_SUPABASE_URL" value={debug.env.supabaseUrl} />
              <Row label="Anon Key Exists" value={debug.env.anonKeyExists ? "Yes" : "No"} />
              <Row label="Anon Key First 12 Chars" value={debug.env.anonKeyPreview} />
            </dl>
          </Card>

          <Card title="Auth User">
            <dl>
              <Row label="Logged In" value={debug.authUser.loggedIn ? "Yes" : "No"} />
              <Row label="User ID" value={debug.authUser.userId} />
              <Row label="Email" value={debug.authUser.email} />
            </dl>
            <div className="mt-4 grid gap-3">
              <JsonBlock value={debug.authUser.raw} />
              <JsonBlock value={debug.authUser.error} />
            </div>
          </Card>

          <Card title="Session">
            <dl>
              <Row label="Session Exists" value={debug.session.exists ? "Yes" : "No"} />
              <Row label="Access Token Exists" value={debug.session.accessTokenExists ? "Yes" : "No"} />
              <Row label="Token Expiry" value={debug.session.expiresAt} />
            </dl>
            <div className="mt-4 grid gap-3">
              <JsonBlock value={debug.session.raw} />
              <JsonBlock value={debug.session.error} />
            </div>
          </Card>

          <Card title="user_profiles Test">
            <dl>
              <Row label="Count" value={String(debug.userProfiles.count)} />
            </dl>
            <div className="mt-4 grid gap-3">
              <JsonBlock value={debug.userProfiles.data} />
              <JsonBlock value={debug.userProfiles.error} />
            </div>
          </Card>

          <Card title="gyms Test">
            <dl>
              <Row label="Count" value={String(debug.gyms.count)} />
            </dl>
            <div className="mt-4 grid gap-3">
              <JsonBlock value={debug.gyms.data} />
              <JsonBlock value={debug.gyms.error} />
            </div>
          </Card>

          <Card title="members Test">
            <dl>
              <Row label="Count" value={String(debug.members.count)} />
            </dl>
            <div className="mt-4 grid gap-3">
              <JsonBlock value={debug.members.data} />
              <JsonBlock value={debug.members.error} />
            </div>
          </Card>

          <Card title="Direct Gym Lookup Test">
            <dl>
              <Row label="gym_id Used" value={debug.directGymLookup.gymIdUsed} />
            </dl>
            <div className="mt-4 grid gap-3">
              <JsonBlock value={debug.directGymLookup.data} />
              <JsonBlock value={debug.directGymLookup.error} />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
