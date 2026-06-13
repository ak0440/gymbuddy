"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import MembersPageContent from "./members/MembersPageContent";
import PaymentsPageContent from "./payments/PaymentsPageContent";
import SettingsPageContent from "./settings/SettingsPageContent";
import ToolsPageContent from "./tools/ToolsPageContent";
import TrainersPageContent from "./trainers/TrainersPageContent";
import { supabase } from "../lib/supabase";

type Role = "admin" | "member" | "trainer";
type MainSection =
  | "Home"
  | "Admin"
  | "Members"
  | "Payments"
  | "Trainer"
  | "TrainerDashboard"
  | "TrainerMembers"
  | "TrainerProfile"
  | "Branches"
  | "Services"
  | "Settings"
  | "Tools";
type Tone = "emerald" | "cyan" | "lime" | "amber";
type DashboardStat = { label: string; value: string; trend: string; tone: Tone };
type MemberStatus = "Active" | "Expired" | "Expiring Soon";
type NavChild = {
  label: string;
  section: MainSection;
  params?: Record<string, string>;
};
type AdminNavItem =
  | {
      type: "single";
      label: string;
      section: MainSection;
      params?: Record<string, string>;
    }
  | {
      type: "group";
      label: string;
      section: MainSection;
      children: NavChild[];
    };

type GymMember = {
  id: number;
  name: string;
  dob: string;
  age: number;
  bloodGroup: string;
  phone: string;
  email: string;
  plan: string;
  branch: string;
  startDate: string;
  expiryDate: string;
  trainer: string;
  status: MemberStatus;
  image: string;
};

type AttendanceRecord = {
  id: number;
  memberName: string;
  date: string;
  day: string;
  time: string;
  trainer: string;
};

type AdminDashboardMember = {
  id: number | string;
  name: string;
  plan: string;
  expiryDate: string;
};

type AdminDashboardMemberRow = {
  id: number | string;
  full_name?: string | null;
  name?: string | null;
  membership_plan?: string | null;
  plan?: string | null;
  expiry_date?: string | null;
  expiryDate?: string | null;
};

const memberMenu = [
  "Dashboard",
  "My Profile",
  "My Membership",
  "Attendance",
  "Workout Plan",
  "Payments",
  "Support",
];

const role: Role | null = null;
const logoSrc = "/gymbuddy_image/logo/Logo.png";

const adminNavigation: AdminNavItem[] = [
  { type: "single", label: "Dashboard", section: "Admin" },
  {
    type: "group",
    label: "Members",
    section: "Members",
    children: [
      { label: "All Members", section: "Members", params: { filter: "all" } },
      { label: "Active Members", section: "Members", params: { filter: "active" } },
      { label: "Membership Expiring Soon", section: "Members", params: { filter: "expiring" } },
      { label: "Expired Members", section: "Members", params: { filter: "expired" } },
    ],
  },
  {
    type: "group",
    label: "Trainers",
    section: "Trainer",
    children: [
      { label: "All Trainers", section: "Trainer", params: { filter: "all" } },
      { label: "Active Trainers", section: "Trainer", params: { filter: "active" } },
      { label: "Member Mapping", section: "Trainer", params: { view: "mapping" } },
    ],
  },
  {
    type: "group",
    label: "Business",
    section: "Payments",
    children: [
      { label: "Payments", section: "Payments", params: { view: "payments" } },
      { label: "Revenue", section: "Payments", params: { view: "revenue" } },
      { label: "Renewals", section: "Payments", params: { view: "renewals" } },
      { label: "Reports", section: "Payments", params: { view: "reports" } },
    ],
  },
  { type: "single", label: "Settings", section: "Settings" },
  { type: "single", label: "Tools", section: "Tools" },
];

const menuLabels: Partial<Record<MainSection, string>> = {
  Admin: "Dashboard",
  Trainer: "Trainers",
  TrainerDashboard: "Dashboard",
  TrainerMembers: "My Members",
  TrainerProfile: "My Profile",
};

const heroImages = [
  {
    src: "/gymbuddy_image/goodone.png",
    title: "Own The Workout",
    copy: "A bold fitness experience for focused training, member tracking, and daily gym momentum.",
  },
  {
    src: "/gymbuddy_image/gpt_homepage_1.png",
    title: "Train With Focus",
    copy: "A sharper GymBuddy experience for members, trainers, sessions, and gym operations.",
  },
  {
    src: "/gymbuddy_image/kettlebell.png",
    title: "Build Power",
    copy: "Track strength sessions, trainer activity, and member progress with a clean dashboard.",
  },
  {
    src: "/gymbuddy_image/girl_running.png",
    title: "Move With Energy",
    copy: "From cardio days to personal training, keep every workout and attendance update visible.",
  },
];

const memberStats: DashboardStat[] = [
  { label: "Membership Status", value: "Active", trend: "Premium plan", tone: "emerald" },
  { label: "Days Remaining", value: "42", trend: "Renews soon", tone: "lime" },
  { label: "Attendance Count", value: "18", trend: "This month", tone: "cyan" },
  { label: "Next Renewal Date", value: "Jul 22", trend: "Auto-pay on", tone: "amber" },
];

const expiringMemberships = [
  { name: "Amit", plan: "Annual", date: "Active", days: "No renewal alert" },
];

const recentAttendance = [
  { date: "Jun 10", checkIn: "07:12 AM", workout: "Push day", duration: "74 min" },
  { date: "Jun 8", checkIn: "06:58 AM", workout: "Conditioning", duration: "52 min" },
  { date: "Jun 6", checkIn: "07:20 AM", workout: "Pull day", duration: "69 min" },
  { date: "Jun 4", checkIn: "06:45 AM", workout: "Leg day", duration: "81 min" },
];

const workoutPlan = [
  { day: "Mon", focus: "Strength training", coach: "Animesh", status: "Planned" },
  { day: "Wed", focus: "Mobility and conditioning", coach: "Animesh", status: "Planned" },
  { day: "Fri", focus: "Full body session", coach: "Animesh", status: "Planned" },
];

const trainers = [
  {
    name: "Animesh",
    title: "Senior Strength Coach",
    specialty: "Strength, Fat Loss, Mobility",
    experience: "7 years",
    clients: 1,
    rating: "4.9",
    branch: "Noida",
    location: "Noida",
    status: "Available",
    image: "/gymbuddy_image/trainer/Animesh.jpeg",
    phone: "+91 98765 43210",
    email: "animesh@gymbuddy.com",
    bio: "Location: Noida. Animesh is assigned to Amit and tracks monthly attendance after each completed training session.",
    schedule: ["Mon 7 AM - 1 PM", "Wed 12 PM - 7 PM", "Fri 7 AM - 3 PM"],
    certifications: ["ACE Personal Trainer", "Kettlebell Fundamentals", "Sports Nutrition"],
  },
];

const initialMembers: GymMember[] = [
  {
    id: 1,
    name: "Amit",
    dob: "17 Feb 1988",
    age: 38,
    bloodGroup: "B+",
    phone: "1234567890",
    email: "amit@gymbuddy.local",
    plan: "Annual",
    branch: "Noida",
    startDate: "2026-06-11",
    expiryDate: "2027-06-10",
    trainer: "Animesh",
    status: "Active",
    image: "/gymbuddy_image/member/Amit.jpeg",
  },
];

const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    memberName: "Amit",
    date: "2026-06-11",
    day: "Thursday",
    time: "07:00",
    trainer: "Animesh",
  },
];

const trainerDashboardStats: DashboardStat[] = [
  { label: "Assigned Members", value: "1", trend: "Amit", tone: "emerald" },
  { label: "Completed Sessions", value: "0", trend: "Amit", tone: "cyan" },
];

const trainerAssignedMembers = [
  { id: 1, name: "Amit", sessions: 0 },
];

function getInitials(label: string) {
  return label
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);
}

function dashboardDateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dashboardDaysRemaining(expiryDate: string) {
  if (!expiryDate) {
    return 0;
  }

  const today = dashboardDateOnly(new Date());
  const expiry = dashboardDateOnly(new Date(`${expiryDate}T00:00:00`));
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
}

function dashboardMemberStatus(expiryDate: string): MemberStatus {
  const daysRemaining = dashboardDaysRemaining(expiryDate);

  if (daysRemaining < 0) {
    return "Expired";
  }

  if (daysRemaining <= 7) {
    return "Expiring Soon";
  }

  return "Active";
}

function normalizeDashboardDate(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.includes("T") ? value.split("T")[0] : value;
}

function mapDashboardMember(row: AdminDashboardMemberRow): AdminDashboardMember {
  return {
    id: row.id,
    name: row.full_name ?? row.name ?? "Unnamed Member",
    plan: row.membership_plan ?? row.plan ?? "Membership",
    expiryDate: normalizeDashboardDate(row.expiry_date ?? row.expiryDate),
  };
}

function StatCard({ stat }: { stat: DashboardStat }) {
  const toneClasses = {
    emerald: "from-emerald-300/18 text-emerald-200",
    cyan: "from-cyan-300/18 text-cyan-200",
    lime: "from-lime-300/18 text-lime-200",
    amber: "from-amber-300/18 text-amber-200",
  }[stat.tone];

  return (
    <section className="w-full max-w-full rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 shadow-2xl shadow-black/20">
      <div className={`mb-6 h-1 w-12 rounded-full bg-gradient-to-r ${toneClasses} to-transparent`} />
      <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-black tracking-normal text-white">{stat.value}</p>
        <span className={`rounded-md bg-white/[0.06] px-2.5 py-1 text-xs font-bold ${toneClasses}`}>
          {stat.trend}
        </span>
      </div>
    </section>
  );
}

function StatusBadge({ children }: { children: string }) {
  const active = children === "Active" || children === "Completed";
  const pending = children === "Pending" || children === "Next";

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${
        active
          ? "bg-lime-300/12 text-lime-200"
          : pending
            ? "bg-amber-300/12 text-amber-200"
            : "bg-zinc-700/50 text-zinc-300"
      }`}
    >
      {children}
    </span>
  );
}

function Panel({ title, action, children }: { title: string; action?: string; children: ReactNode }) {
  return (
    <section className="w-full max-w-full rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-white">{title}</h2>
        {action ? <button className="text-sm font-bold text-lime-300 hover:text-lime-200">{action}</button> : null}
      </div>
      {children}
    </section>
  );
}

function PublicHeader({
  isAuthenticated,
  onLoginClick,
}: {
  isAuthenticated: boolean;
  onLoginClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f0d]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" className="flex items-center gap-3.5 text-left" aria-label="Go to home">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-base font-black text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.24)] sm:h-14 sm:w-14">
            <Image src={logoSrc} alt="GymBuddy logo" fill sizes="52px" className="object-contain p-1" />
          </span>
          <span className="text-xl tracking-normal text-white">
            <span className="font-semibold">Gym</span>
            <span className="font-normal text-zinc-100">Buddy</span>
          </span>
        </button>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          <a href="#features" className="rounded-lg px-3 py-2 text-sm font-bold text-white transition hover:bg-white/[0.06] hover:text-lime-200">
            Features
          </a>
          <a href="#pricing" className="rounded-lg px-3 py-2 text-sm font-bold text-white transition hover:bg-white/[0.06] hover:text-lime-200">
            Pricing
          </a>
          <a href="#who" className="rounded-lg px-3 py-2 text-sm font-bold text-white transition hover:bg-white/[0.06] hover:text-lime-200">
            Who It&apos;s For
          </a>
          {isAuthenticated ? (
            <a
              href="/dashboard"
              className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-black text-[#07100b] transition hover:bg-lime-300"
            >
              Dashboard
            </a>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-black text-[#07100b] transition hover:bg-lime-300"
            >
              Partner Login
            </button>
          )}
          <a
            href="tel:+919876543210"
            className="rounded-lg bg-white px-4 py-2 text-sm font-black text-[#07100b] transition hover:bg-lime-100"
          >
            Book Demo
          </a>
        </nav>
      </div>
    </header>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  async function loginAdmin() {
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your admin email and password.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error("Admin login failed", error);
      setErrorMessage("Invalid admin email or password.");
      setIsSubmitting(false);
      return;
    }

    onClose();
    window.location.href = "/dashboard";
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close login modal" onClick={onClose} />
      <section className="relative w-full max-w-md rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Partner Login</p>
            <h2 className="mt-2 text-2xl font-black text-white">Partner Login</h2>
            <p className="mt-1 text-sm text-zinc-400">Access your gym management workspace.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300 transition hover:border-lime-300/40 hover:text-lime-200"
            aria-label="Close login modal"
          >
            x
          </button>
        </div>

        <div className="mt-6 grid gap-4">
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
                  loginAdmin();
                }
              }}
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60"
            />
          </label>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">{errorMessage}</p>
        ) : null}

        <button
          type="button"
          onClick={loginAdmin}
          disabled={isSubmitting}
          className="mt-6 h-11 w-full rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {["Trainer", "Member"].map((role) => (
            <div key={role} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-zinc-400">
              <span>{role}</span>
              <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-lime-200">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardHeader({
  activeRole,
  activeSection,
  onSectionChange,
  onLogout,
}: {
  activeRole: Role;
  activeSection: MainSection;
  onSectionChange: (section: MainSection) => void;
  onLogout: () => void;
}) {
  const roleLabel = activeRole[0].toUpperCase() + activeRole.slice(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Members: false,
    Trainers: false,
    Business: false,
  });
  const menuItems = activeRole === "admin" ? adminNavigation : [];

  function updateDashboardUrl(section: MainSection, params?: Record<string, string>) {
    const query = new URLSearchParams({ section: menuLabels[section] ?? section });

    if (params) {
      Object.entries(params).forEach(([key, value]) => query.set(key, value));
    }

    window.history.pushState(null, "", `/dashboard?${query.toString()}`);
  }

  function selectSection(section: MainSection, params?: Record<string, string>) {
    onSectionChange(section);
    updateDashboardUrl(section, params);
    if (section === "Members" && params?.filter) {
      window.dispatchEvent(new CustomEvent("gymbuddy:members-filter", { detail: params.filter }));
    }
    setDrawerOpen(false);
  }

  function toggleGroup(label: string) {
    setExpandedGroups((current) => ({ ...current, [label]: !current[label] }));
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f0d]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3.5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-lime-300 transition hover:border-lime-300/40 hover:bg-lime-300/10 md:hidden"
              aria-label="Open navigation menu"
            >
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="absolute mt-3 block h-0.5 w-5 rounded-full bg-current" />
              <span className="absolute -mt-3 block h-0.5 w-5 rounded-full bg-current" />
            </button>
            <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-base font-black text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.24)]">
              <Image src={logoSrc} alt="GymBuddy logo" fill sizes="44px" className="object-contain p-1" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg tracking-normal text-white">
                <span className="font-semibold">Gym</span>
                <span className="font-normal text-zinc-100">Buddy</span>
              </p>
              <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-lime-300/70">
                {`${roleLabel} dashboard`}
              </p>
            </div>
          </div>

          <nav className="hidden max-w-full gap-2 md:flex">
            {menuItems.map((item) => (
              item.type === "single" ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => selectSection(item.section, item.params)}
                  className={`h-10 shrink-0 rounded-lg px-4 text-sm font-bold transition ${
                    activeSection === item.section
                      ? "bg-lime-400 text-[#07100b]"
                      : "border border-white/10 bg-white/[0.05] text-zinc-300 hover:border-lime-300/40 hover:text-lime-200"
                  }`}
                >
                  {item.label}
                </button>
              ) : (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    className={`h-10 shrink-0 rounded-lg px-4 text-sm font-bold transition ${
                      activeSection === item.section
                        ? "bg-lime-400 text-[#07100b]"
                        : "border border-white/10 bg-white/[0.05] text-zinc-300 hover:border-lime-300/40 hover:text-lime-200"
                    }`}
                  >
                    {item.label}
                    <span className="ml-2 text-xs">{expandedGroups[item.label] ? "-" : "+"}</span>
                  </button>
                  {expandedGroups[item.label] ? (
                    <div className="absolute right-0 top-12 z-50 w-52 rounded-lg border border-white/10 bg-[#111713] p-2 shadow-2xl shadow-black/50">
                      {item.children.map((child) => (
                        <button
                          key={child.label}
                          type="button"
                          onClick={() => selectSection(child.section, child.params)}
                          className="block w-full rounded-md px-3 py-2 text-left text-sm font-bold text-zinc-300 transition hover:bg-lime-300/10 hover:text-lime-200"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            ))}
            <button
              type="button"
              onClick={onLogout}
              className="h-10 shrink-0 rounded-lg border border-white/10 bg-white/[0.05] px-4 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative h-full w-[86vw] max-w-sm border-r border-white/10 bg-[#0b0f0d] p-4 shadow-2xl shadow-black">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400">
                  <Image src={logoSrc} alt="GymBuddy logo" fill sizes="40px" className="object-contain p-1" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base tracking-normal text-white">
                    <span className="font-semibold">Gym</span>
                    <span className="font-normal text-zinc-100">Buddy</span>
                  </p>
                  <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-lime-300/70">Admin menu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300 transition hover:border-lime-300/40 hover:text-lime-200"
                aria-label="Close navigation menu"
              >
                x
              </button>
            </div>
            <nav className="mt-4 grid gap-2">
              {menuItems.map((item) => (
                item.type === "single" ? (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectSection(item.section, item.params)}
                    className={`h-12 rounded-lg px-4 text-left text-sm font-bold transition ${
                      activeSection === item.section
                        ? "bg-lime-400 text-[#07100b]"
                        : "border border-white/10 bg-white/[0.05] text-zinc-300 hover:border-lime-300/40 hover:text-lime-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.label)}
                      className={`flex h-11 w-full items-center justify-between rounded-md px-3 text-left text-sm font-bold transition ${
                        activeSection === item.section ? "bg-lime-400 text-[#07100b]" : "text-zinc-300 hover:bg-white/[0.06] hover:text-lime-200"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span>{expandedGroups[item.label] ? "-" : "+"}</span>
                    </button>
                    {expandedGroups[item.label] ? (
                      <div className="mt-2 grid gap-1">
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            type="button"
                            onClick={() => selectSection(child.section, child.params)}
                            className="rounded-md px-3 py-2 text-left text-sm font-semibold text-zinc-400 transition hover:bg-lime-300/10 hover:text-lime-200"
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              ))}
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onLogout();
                }}
                className="mt-2 h-12 rounded-lg border border-white/10 bg-white/[0.05] px-4 text-left text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
              >
                Logout
              </button>
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function AdminContent() {
  const [dashboardMembers, setDashboardMembers] = useState<AdminDashboardMember[]>([]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, full_name, membership_plan, expiry_date")
        .order("expiry_date", { ascending: true });

      if (!active) {
        return;
      }

      if (error) {
        console.error("Failed to load dashboard members", error);
        return;
      }

      setDashboardMembers((data ?? []).map((member) => mapDashboardMember(member as AdminDashboardMemberRow)));
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  const totalMembers = dashboardMembers.length || 1;
  const activeMembers = dashboardMembers.length
    ? dashboardMembers.filter((member) => dashboardMemberStatus(member.expiryDate) === "Active").length
    : 1;
  const expiringSoonMembers = dashboardMembers
    .filter((member) => dashboardMemberStatus(member.expiryDate) === "Expiring Soon")
    .slice(0, 5);
  const expiringFallback = expiringMemberships.slice(0, 5).map((member) => ({
    id: member.name,
    name: member.name,
    plan: member.plan,
    expiryDate: member.date,
  }));
  const expiringList = expiringSoonMembers.length ? expiringSoonMembers : expiringFallback;
  const recentMembersList = dashboardMembers.slice(0, 5);
  const recentMembersFallback = [
    { id: "amit", name: "Amit", plan: "Annual", expiryDate: "2027-06-10" },
  ];
  const quickActions: { label: string; section: MainSection }[] = [
    { label: "Add Member", section: "Members" },
    { label: "Add Trainer", section: "Trainer" },
    { label: "Open Business", section: "Payments" },
    { label: "Open Settings", section: "Settings" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Admin Dashboard</p>
        <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Operational Overview</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          A clean snapshot of memberships, trainers, and priority actions.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Members", value: String(totalMembers), note: "Supabase" },
          { label: "Active Members", value: String(activeMembers), note: "Current plans" },
          { label: "Membership Expiring Soon", value: String(expiringSoonMembers.length), note: "Next 7 days" },
          { label: "Active Trainers", value: "1", note: "Mock" },
        ].map((stat) => (
          <section key={stat.label} className="rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 shadow-2xl shadow-black/20">
            <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-3xl font-black tracking-normal text-white">{stat.value}</p>
              <span className="rounded-md bg-lime-300/10 px-2.5 py-1 text-xs font-bold text-lime-200">{stat.note}</span>
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Membership Expiring Soon">
          <div className="space-y-3">
            {expiringList.map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{member.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{member.plan}</p>
                </div>
                <p className="shrink-0 text-sm font-bold text-amber-200">{member.expiryDate}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent Members">
          <div className="space-y-3">
            {(recentMembersList.length ? recentMembersList : recentMembersFallback).map((member) => (
              <div key={member.id} className="grid gap-2 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{member.name}</p>
                  <p className="mt-1 text-zinc-400">{member.plan}</p>
                </div>
                <p className="font-bold text-lime-200">{member.expiryDate}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel title="Trainer Summary">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Total Trainers", value: "1" },
              { label: "Active Trainers", value: "1" },
              { label: "Assigned Members", value: String(totalMembers) },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick Actions">
          <div className="grid gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("gymbuddy:navigate", { detail: action.section }))}
                className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-4 text-left text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
              >
                {action.label}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function TrainerDashboardContent() {
  const [members] = useState(trainerAssignedMembers);
  const totalSessions = members.reduce((total, member) => total + member.sessions, 0);
  const dashboardStats = trainerDashboardStats.map((stat) =>
    stat.label === "Completed Sessions" ? { ...stat, value: String(totalSessions) } : stat,
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Trainer Dashboard</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Welcome back, Animesh</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Assigned members and completed session count are shown here.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-lime-300/20 bg-lime-300/[0.08] p-3">
          <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-sm font-black text-[#07100b]">
            <Image src={trainers[0].image} alt={trainers[0].name} fill sizes="56px" className="object-cover" />
          </div>
          <div>
            <p className="font-black text-white">Animesh</p>
            <p className="text-sm text-zinc-400">Noida</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Panel title="Assigned Members">
          <div className="grid gap-3">
            {members.map((member) => {
              return (
                <div
                  key={member.id}
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg font-black text-white">{member.name}</p>
                    <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-lime-200">
                      Completed Sessions: {member.sessions}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function TrainerMembersContent() {
  const [members, setMembers] = useState(trainerAssignedMembers);
  const [selectedMemberId, setSelectedMemberId] = useState(trainerAssignedMembers[0].id);
  const [sessionForm, setSessionForm] = useState({
    date: "2026-06-11",
    time: "07:00",
  });
  const selectedMember = members.find((member) => member.id === selectedMemberId) ?? members[0];

  function saveSession() {
    if (!sessionForm.date || !sessionForm.time) {
      return;
    }

    setMembers((current) =>
      current.map((member) =>
        member.id === selectedMember.id ? { ...member, sessions: member.sessions + 1 } : member,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">My Members</p>
        <h2 className="mt-3 text-3xl font-black tracking-normal text-white">Assigned Members</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Select a member to add session date and time.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Assigned Members">
          <div className="space-y-3">
            {members.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedMemberId(member.id)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  member.id === selectedMember.id
                    ? "border-lime-300/50 bg-lime-300/[0.08]"
                    : "border-white/10 bg-white/[0.035] hover:border-lime-300/30"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-black text-white">{member.name}</p>
                  <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-lime-200">
                    Sessions: {member.sessions}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Add Session">
          <div className="grid gap-4">
            <p className="text-sm font-bold text-white">{selectedMember.name}</p>
            <Field label="Session Date">
              <input
                type="date"
                value={sessionForm.date}
                onChange={(event) => setSessionForm((current) => ({ ...current, date: event.target.value }))}
                className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60"
              />
            </Field>
            <Field label="Session Time">
              <input
                type="time"
                value={sessionForm.time}
                onChange={(event) => setSessionForm((current) => ({ ...current, time: event.target.value }))}
                className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60"
              />
            </Field>
            <button
              type="button"
              onClick={saveSession}
              className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] transition hover:bg-lime-300"
            >
              Save Session
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function TrainerProfileContent() {
  return (
    <section className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">My Profile</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-lg bg-lime-400 text-2xl font-black text-[#07100b]">
          <Image src={trainers[0].image} alt={trainers[0].name} fill sizes="80px" className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Animesh</h2>
          <p className="mt-1 text-zinc-400">Senior strength coach</p>
          <p className="mt-2 text-sm font-bold text-lime-200">Noida branch</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Assigned Members", value: "1" },
          { label: "Name", value: "Animesh" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
            <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Bio</p>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{trainers[0].bio}</p>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Specialization</p>
            <p className="mt-3 text-sm font-bold text-lime-200">{trainers[0].specialty}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Certificates</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {trainers[0].certifications.map((certification) => (
                <span key={certification} className="rounded-md bg-lime-300/10 px-3 py-2 text-sm font-bold text-lime-200">
                  {certification}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeContent({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentImage = heroImages[activeSlide];
  const homeActions = [
    { label: "Start Free Trial", href: "#trial", variant: "primary" },
    { label: "Book Demo", href: "tel:+919876543210", variant: "secondary" },
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % heroImages.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div id="home" className="space-y-6">
      <section className="relative min-h-[620px] w-full max-w-full overflow-hidden rounded-lg border border-white/10 bg-[#111713]">
        <Image
          key={currentImage.src}
          src={currentImage.src}
          alt={currentImage.title}
          fill
          priority
          sizes="(min-width: 768px) calc(100vw - 18rem), calc(100vw - 5rem)"
          className="object-cover brightness-110 contrast-110 saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 to-transparent" />

        <div className="relative z-10 grid min-h-[620px] content-between gap-8 p-6 sm:p-8 lg:p-10">
          <div />

          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-lime-300">{currentImage.title}</p>
            <h2 className="text-4xl font-black tracking-normal text-white sm:text-5xl lg:text-6xl">
              Manage Smarter.
              <br />
              Train Better.
              <br />
              Grow Faster.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-200">
              The unified platform for gyms to manage operations, support trainers, and deliver a premium member experience.
            </p>
            <div id="start" className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <a
                  href="/dashboard"
                  className="rounded-lg border border-lime-300/60 bg-lime-300/10 px-5 py-3 text-sm font-black text-lime-100 transition hover:bg-lime-300 hover:text-[#07100b]"
                >
                  Go to Dashboard
                </a>
              ) : null}
              {homeActions.map((action) => {
                const className =
                  action.variant === "primary"
                    ? "rounded-lg bg-lime-400 px-5 py-3 text-sm font-black text-[#07100b] shadow-[0_0_28px_rgba(163,230,53,0.24)] transition hover:bg-lime-300"
                    : "rounded-lg bg-white px-5 py-3 text-sm font-black text-[#07100b] transition hover:bg-lime-100";

                return (
                  <a key={action.label} href={action.href} className={className}>
                    {action.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid w-full max-w-full gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Active Users", value: "2.4K+" },
                { label: "Fitness Spaces", value: "8+" },
                { label: "Daily Sessions", value: "32+" },
                { label: "Check-ins Logged", value: "48K+" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {heroImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeSlide ? "w-10 bg-lime-300" : "w-2.5 bg-white/35 hover:bg-white/60"
                  }`}
                  aria-label={`Show ${image.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="who" className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Who It&apos;s For</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Three Portals. One Platform.</h2>
        </div>
        <div id="features" className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Owners",
              text: "Manage operations, memberships, payments, and business visibility.",
            },
            {
              title: "Trainers",
              text: "Stay organized with assigned members, sessions, and progress tracking.",
            },
            {
              title: "Members",
              text: "Access fitness updates, check-ins, goals, and a connected gym experience.",
            },
          ].map((card) => (
            <article key={card.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <h3 className="text-xl font-black text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="sr-only" aria-label="Pricing" />

      <footer className="rounded-lg border border-white/10 bg-[#111713] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400">
              <Image src={logoSrc} alt="GymBuddy logo" fill sizes="48px" className="object-contain p-1" />
            </span>
            <p className="text-lg tracking-normal text-white">
              <span className="font-semibold">Gym</span>
              <span className="font-normal text-zinc-100">Buddy</span>
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-zinc-300">
            {["Features", "Pricing", "Contact", "Privacy Policy"].map((item) => (
              <a key={item} href={item === "Contact" ? "tel:+919876543210" : item === "Features" ? "#features" : item === "Pricing" ? "#pricing" : "#home"} className="transition hover:text-lime-200">
                {item}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TrainerContent() {
  const [selectedTrainer, setSelectedTrainer] = useState(trainers[0]);
  const assignedMember = initialMembers[0];
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [attendanceForm, setAttendanceForm] = useState({
    date: "2026-06-11",
    day: "Thursday",
    time: "07:00",
  });

  function updateAttendanceDate(date: string) {
    const parsedDate = new Date(`${date}T00:00:00`);
    const day = Number.isNaN(parsedDate.getTime())
      ? attendanceForm.day
      : parsedDate.toLocaleDateString("en-US", { weekday: "long" });

    setAttendanceForm((current) => ({ ...current, date, day }));
  }

  function markAttendance() {
    if (!attendanceForm.date || !attendanceForm.day || !attendanceForm.time) {
      return;
    }

    setAttendanceRecords((current) => [
      {
        id: Date.now(),
        memberName: assignedMember.name,
        date: attendanceForm.date,
        day: attendanceForm.day,
        time: attendanceForm.time,
        trainer: selectedTrainer.name,
      },
      ...current,
    ]);
  }

  return (
    <div className="grid w-full max-w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
      <Panel title="Trainer List" action={`${trainers.length} trainers`}>
        <div className="space-y-3">
          {trainers.map((trainer) => {
            const active = trainer.name === selectedTrainer.name;

            return (
              <button
                key={trainer.name}
                type="button"
                onClick={() => setSelectedTrainer(trainer)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  active
                    ? "border-lime-300/50 bg-lime-300/[0.08]"
                    : "border-white/10 bg-white/[0.035] hover:border-lime-300/30 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-sm font-black text-[#07100b]">
                    {trainer.image ? (
                      <Image src={trainer.image} alt={trainer.name} fill sizes="48px" className="object-cover" />
                    ) : (
                      getInitials(trainer.name)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-white">{trainer.name}</p>
                    <p className="mt-1 truncate text-sm text-zinc-400">{trainer.title}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge>{trainer.status}</StatusBadge>
                  <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-zinc-300">
                    {trainer.branch}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <section className="w-full max-w-full rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-2xl font-black text-[#07100b] shadow-[0_0_30px_rgba(163,230,53,0.24)]">
                {selectedTrainer.image ? (
                  <Image
                    src={selectedTrainer.image}
                    alt={selectedTrainer.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  getInitials(selectedTrainer.name)
                )}
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Trainer Profile</p>
                <h2 className="mt-2 text-3xl font-black text-white">{selectedTrainer.name}</h2>
                <p className="mt-1 text-zinc-400">{selectedTrainer.title}</p>
                {"location" in selectedTrainer ? (
                  <p className="mt-2 text-sm font-bold text-lime-200">Location: {selectedTrainer.location}</p>
                ) : null}
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-300">{selectedTrainer.bio}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Experience", value: selectedTrainer.experience },
                { label: "Clients", value: selectedTrainer.clients },
                { label: "Rating", value: selectedTrainer.rating },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="font-bold text-white">Weekly Schedule</p>
                <div className="mt-3 space-y-2">
                  {selectedTrainer.schedule.map((slot) => (
                    <p key={slot} className="rounded-md bg-black/20 px-3 py-2 text-sm text-zinc-300">
                      {slot}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="font-bold text-white">Certifications</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTrainer.certifications.map((certification) => (
                    <span key={certification} className="rounded-md bg-lime-300/10 px-3 py-2 text-sm font-bold text-lime-200">
                      {certification}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-white">Assigned Member</p>
                  <p className="mt-1 text-sm text-zinc-400">Animesh is assigned to Amit.</p>
                </div>
                <MemberStatusBadge status={assignedMember.status} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-lime-300/20 bg-lime-300/[0.08] p-3">
                <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-base font-black text-[#07100b]">
                  {assignedMember.image ? (
                    <Image src={assignedMember.image} alt={assignedMember.name} fill sizes="56px" className="object-cover" />
                  ) : (
                    getInitials(assignedMember.name)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-black text-white">{assignedMember.name}</p>
                  <p className="mt-1 text-sm text-zinc-300">
                    DOB {assignedMember.dob} - Age {assignedMember.age} - Blood Group {assignedMember.bloodGroup}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-lime-200">
                    {assignedMember.plan} plan - {assignedMember.branch} - {assignedMember.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-white">Monthly Attendance</p>
                  <p className="mt-1 text-sm text-zinc-400">Mark attendance after completing a session with Amit.</p>
                </div>
                <span className="rounded-md bg-lime-300/10 px-2.5 py-1 text-xs font-bold text-lime-200">
                  {attendanceRecords.length} sessions
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Field label="Date">
                  <input
                    type="date"
                    value={attendanceForm.date}
                    onChange={(event) => updateAttendanceDate(event.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60"
                  />
                </Field>
                <Field label="Day">
                  <input
                    value={attendanceForm.day}
                    onChange={(event) => setAttendanceForm((current) => ({ ...current, day: event.target.value }))}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60"
                  />
                </Field>
                <Field label="Time">
                  <input
                    type="time"
                    value={attendanceForm.time}
                    onChange={(event) => setAttendanceForm((current) => ({ ...current, time: event.target.value }))}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60"
                  />
                </Field>
              </div>

              <button
                type="button"
                onClick={markAttendance}
                className="mt-4 w-full rounded-lg bg-lime-400 px-4 py-3 text-sm font-black text-[#07100b] transition hover:bg-lime-300 sm:w-auto"
              >
                Mark Attendance
              </button>

              <div className="mt-5 space-y-2">
                {attendanceRecords.map((record) => (
                  <div
                    key={record.id}
                    className="grid gap-2 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-zinc-300 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                  >
                    <p className="font-bold text-white">{record.memberName}</p>
                    <p>{record.day}, {record.date}</p>
                    <p className="font-bold text-lime-200">{record.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-lime-300/20 bg-lime-300/[0.08] p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-lime-200">Contact</p>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Phone</p>
                <a href={`tel:${selectedTrainer.phone.replaceAll(" ", "")}`} className="mt-1 block font-bold text-white hover:text-lime-200">
                  {selectedTrainer.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Email</p>
                <a href={`mailto:${selectedTrainer.email}`} className="mt-1 block font-bold text-white hover:text-lime-200">
                  {selectedTrainer.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Specialty</p>
                <p className="mt-1 font-bold text-white">{selectedTrainer.specialty}</p>
              </div>
              {"location" in selectedTrainer ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Location</p>
                  <p className="mt-1 font-bold text-white">{selectedTrainer.location}</p>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-lime-400 px-4 py-3 text-sm font-black text-[#07100b] transition hover:bg-lime-300"
            >
              Assigned to Amit
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}

function ToolsContent() {
  return <ToolsPageContent />;
}

function PaymentsContent() {
  return <PaymentsPageContent />;
}

function SettingsContent() {
  return <SettingsPageContent />;
}

function TrainersContent() {
  return <TrainersPageContent />;
}

function MemberStatusBadge({ status }: { status: MemberStatus }) {
  const classes = {
    Active: "border-lime-300/30 bg-lime-300/12 text-lime-200",
    Expired: "border-red-300/25 bg-red-300/10 text-red-200",
    "Expiring Soon": "border-amber-300/30 bg-amber-300/12 text-amber-200",
  }[status];

  return <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${classes}`}>{status}</span>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function MembersContent() {
  return <MembersPageContent />;
}

/*
function LegacyMembersContent() {
  const [members, setMembers] = useState<GymMember[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof memberFilters)[number]>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyMemberForm);

  const visibleMembers = members.filter((member) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      member.name.toLowerCase().includes(search) ||
      member.phone.toLowerCase().includes(search);
    const matchesFilter = activeFilter === "All" || member.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  function updateForm(field: keyof typeof emptyMemberForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyMemberForm);
  }

  function saveMember() {
    if (!form.name.trim() || !form.phone.trim()) {
      return;
    }

    const member: GymMember = {
      id: Date.now(),
      name: form.name.trim(),
      dob: "17 Feb 1988",
      age: 38,
      bloodGroup: "B+",
      phone: form.phone.trim(),
      email: form.email.trim(),
      plan: form.plan,
      branch: form.branch,
      startDate: form.startDate,
      expiryDate: form.expiryDate,
      trainer: form.trainer,
      status: "Active",
      image: "/gymbuddy_image/member/Amit.jpeg",
    };

    setMembers((current) => [member, ...current]);
    closeModal();
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Members</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Members</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Manage gym members, plans, status, and renewals.
          </p>
        </div>
        <div className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-lime-300/30 bg-lime-300/10 px-5 text-sm font-black text-lime-200 sm:w-auto">
          Assigned to Animesh
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Members", value: "1", note: "Amit", tone: "lime" },
          { label: "Active Members", value: "1", note: "Annual plan", tone: "emerald" },
          { label: "Expired Members", value: "0", note: "No expired members", tone: "amber" },
          { label: "New This Month", value: "1", note: "Noida branch", tone: "cyan" },
        ].map((card) => (
          <section
            key={card.label}
            className="rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 shadow-2xl shadow-black/20"
          >
            <p className="text-sm font-medium text-zinc-400">{card.label}</p>
            <p className="mt-3 text-3xl font-black text-white">{card.value}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-lime-300/70">{card.note}</p>
          </section>
        ))}
      </div>

      <section className="rounded-lg border border-white/10 bg-[#111713] p-4 shadow-2xl shadow-black/20">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <label className="block min-w-0">
            <span className="sr-only">Search by name or phone</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or phone"
              className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/10"
            />
          </label>
          <div className="flex max-w-full gap-2 overflow-x-auto">
            {memberFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`h-10 shrink-0 rounded-lg px-4 text-sm font-bold transition ${
                  activeFilter === filter
                    ? "bg-lime-400 text-[#07100b]"
                    : "border border-white/10 bg-white/[0.05] text-zinc-300 hover:border-lime-300/40 hover:text-lime-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 md:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
              <tr className="border-b border-white/10">
                <th className="pb-3 font-bold">Name</th>
                <th className="pb-3 font-bold">DOB</th>
                <th className="pb-3 font-bold">Age</th>
                <th className="pb-3 font-bold">Blood Group</th>
                <th className="pb-3 font-bold">Mobile Number</th>
                <th className="pb-3 font-bold">Membership Plan</th>
                <th className="pb-3 font-bold">Branch</th>
                <th className="pb-3 font-bold">Trainer</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {visibleMembers.map((member) => (
                <tr key={member.id} className="text-zinc-300">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-sm font-black text-[#07100b]">
                        {member.image ? (
                          <Image src={member.image} alt={member.name} fill sizes="48px" className="object-cover" />
                        ) : (
                          getInitials(member.name)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{member.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{member.dob}</td>
                  <td className="py-4">{member.age}</td>
                  <td className="py-4">{member.bloodGroup}</td>
                  <td className="py-4">{member.phone}</td>
                  <td className="py-4">{member.plan}</td>
                  <td className="py-4">{member.branch}</td>
                  <td className="py-4">{member.trainer}</td>
                  <td className="py-4">
                    <MemberStatusBadge status={member.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleMembers.length === 0 ? (
            <p className="py-8 text-center text-sm font-semibold text-zinc-500">No members match the current search.</p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-3 md:hidden">
        {visibleMembers.map((member) => (
          <article key={member.id} className="rounded-lg border border-white/10 bg-[#111713] p-4 shadow-2xl shadow-black/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-sm font-black text-[#07100b]">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill sizes="48px" className="object-cover" />
                  ) : (
                    getInitials(member.name)
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-white">{member.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{member.phone}</p>
                </div>
              </div>
              <MemberStatusBadge status={member.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">DOB</p>
                <p className="mt-1 font-semibold text-white">{member.dob}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Age</p>
                <p className="mt-1 font-semibold text-white">{member.age}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Blood</p>
                <p className="mt-1 font-semibold text-white">{member.bloodGroup}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Plan</p>
                <p className="mt-1 font-semibold text-white">{member.plan}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Branch</p>
                <p className="mt-1 font-semibold text-white">{member.branch}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Trainer</p>
                <p className="mt-1 font-semibold text-white">{member.trainer}</p>
              </div>
            </div>
          </article>
        ))}
        {visibleMembers.length === 0 ? (
          <p className="rounded-lg border border-white/10 bg-[#111713] p-5 text-center text-sm font-semibold text-zinc-500">
            No members match the current search.
          </p>
        ) : null}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Add Member</h3>
                <p className="mt-1 text-sm text-zinc-400">Create a local mock member record.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300 transition hover:border-lime-300/40 hover:text-lime-200"
                aria-label="Close modal"
              >
                x
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name">
                <input value={form.name} onChange={(event) => updateForm("name", event.target.value)} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60" />
              </Field>
              <Field label="Phone Number">
                <input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60" />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60" />
              </Field>
              <Field label="Membership Plan">
                <select value={form.plan} onChange={(event) => updateForm("plan", event.target.value)} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60">
                  {membershipPlans.map((plan) => <option key={plan}>{plan}</option>)}
                </select>
              </Field>
              <Field label="Branch">
                <select value={form.branch} onChange={(event) => updateForm("branch", event.target.value)} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60">
                  {branches.map((branch) => <option key={branch}>{branch}</option>)}
                </select>
              </Field>
              <Field label="Assigned Trainer">
                <select value={form.trainer} onChange={(event) => updateForm("trainer", event.target.value)} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60">
                  {trainerNames.map((trainer) => <option key={trainer}>{trainer}</option>)}
                </select>
              </Field>
              <Field label="Start Date">
                <input type="date" value={form.startDate} onChange={(event) => updateForm("startDate", event.target.value)} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60" />
              </Field>
              <Field label="Expiry Date">
                <input type="date" value={form.expiryDate} onChange={(event) => updateForm("expiryDate", event.target.value)} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-lime-300/60" />
              </Field>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveMember}
                className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] transition hover:bg-lime-300"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
*/

function SimpleSection({ section }: { section: "Branches" | "Services" | "Tools" }) {
  const summaries = {
    Branches: {
      title: "Branches",
      copy: "Monitor branches, local occupancy, revenue, equipment status, and staff coverage.",
      metric: "8",
      label: "Open branches",
    },
    Services: {
      title: "Services",
      copy: "Showcase personal training, nutrition coaching, strength programs, group classes, and recovery support.",
      metric: "12",
      label: "Active services",
    },
    Tools: {
      title: "Tools",
      copy: "Temporary area for quick calculators, utilities, exports, and staff shortcuts while the product grows.",
      metric: "5",
      label: "Draft tools",
    },
  }[section];

  return (
    <div className="grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Panel title={summaries.title} action="Open">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <p className="max-w-2xl text-base leading-7 text-zinc-300">{summaries.copy}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Overview", "Activity", "Reports"].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-lg border border-white/10 bg-[#0d120f] px-4 py-3 text-left text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <section className="rounded-lg border border-lime-300/20 bg-lime-300/[0.08] p-5">
        <p className="text-sm font-bold text-lime-200">{summaries.label}</p>
        <p className="mt-3 text-4xl font-black text-white">{summaries.metric}</p>
        <p className="mt-4 text-sm leading-6 text-zinc-400">This section is ready for real data when the backend is connected.</p>
      </section>
    </div>
  );
}

function MemberContent() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto rounded-lg border border-white/10 bg-[#111713] p-2">
        {memberMenu.map((item) => (
          <button
            key={item}
            type="button"
            className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold transition ${
              item === "Dashboard"
                ? "bg-lime-400 text-[#07100b]"
                : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {memberStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Recent Attendance" action="History">
          <div className="space-y-3">
            {recentAttendance.map((item) => (
              <div
                key={`${item.date}-${item.workout}`}
                className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-zinc-300 sm:grid-cols-4"
              >
                <p className="font-bold text-white">{item.date}</p>
                <p>{item.checkIn}</p>
                <p>{item.workout}</p>
                <p className="font-bold text-lime-200">{item.duration}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Current Workout Plan" action="Open plan">
          <div className="space-y-3">
            {workoutPlan.map((item) => (
              <div
                key={`${item.day}-${item.focus}`}
                className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 sm:grid-cols-[44px_minmax(0,1fr)_auto]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-lime-300/12 text-sm font-black text-lime-200">
                  {item.day}
                </div>
                <div>
                  <p className="font-bold text-white">{item.focus}</p>
                  <p className="mt-1 text-sm text-zinc-400">Coach: {item.coach}</p>
                </div>
                <StatusBadge>{item.status}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default function Home({ initialRole = role }: { initialRole?: Role | null }) {
  const [activeRole, setActiveRole] = useState<Role | null>(initialRole);
  const [activeSection, setActiveSection] = useState<MainSection>(
    initialRole === "trainer" ? "TrainerDashboard" : initialRole === "admin" ? "Admin" : initialRole === "member" ? "Members" : "Home",
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkHomeSession() {
      const { data } = await supabase.auth.getSession();

      if (active) {
        setIsAuthenticated(Boolean(data.session));
      }
    }

    checkHomeSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  function handleSectionChange(section: MainSection) {
    setActiveSection(section);
  }

  useEffect(() => {
    function handleQuickNavigate(event: Event) {
      const section = (event as CustomEvent<MainSection>).detail;
      setActiveSection(section);
      window.history.pushState(null, "", `/dashboard?section=${encodeURIComponent(menuLabels[section] ?? section)}`);
    }

    window.addEventListener("gymbuddy:navigate", handleQuickNavigate);

    return () => {
      window.removeEventListener("gymbuddy:navigate", handleQuickNavigate);
    };
  }, []);

  async function handleLogout() {
    sessionStorage.setItem("gymbuddy:logout-home", "true");
    await supabase.auth.signOut();
    setActiveRole(null);
    setActiveSection("Home");
    setIsAuthenticated(false);
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0a0d0b] text-white">
      {activeRole ? (
        <DashboardHeader
          activeRole={activeRole}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onLogout={handleLogout}
        />
      ) : (
        <PublicHeader isAuthenticated={isAuthenticated} onLoginClick={() => setLoginModalOpen(true)} />
      )}

      <div className="min-h-screen w-full max-w-full overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
          {!activeRole ? <HomeContent isAuthenticated={isAuthenticated} /> : null}
          {activeRole === "admin" && activeSection === "Admin" ? <AdminContent /> : null}
          {activeRole === "admin" && activeSection === "Members" ? <MembersContent /> : null}
          {activeRole === "admin" && activeSection === "Payments" ? <PaymentsContent /> : null}
          {activeRole === "admin" && activeSection === "Trainer" ? <TrainersContent /> : null}
          {activeRole === "admin" && activeSection === "Settings" ? <SettingsContent /> : null}
          {activeRole === "trainer" && activeSection === "TrainerDashboard" ? <TrainerDashboardContent /> : null}
          {activeRole === "trainer" && activeSection === "TrainerMembers" ? <TrainerMembersContent /> : null}
          {activeRole === "trainer" && activeSection === "TrainerProfile" ? <TrainerProfileContent /> : null}
          {activeRole === "member" && activeSection === "Members" ? <MemberContent /> : null}
          {activeRole === "member" && activeSection === "Payments" ? <PaymentsContent /> : null}
          {activeRole && activeSection === "Tools" ? <ToolsContent /> : null}
          {activeRole && ["Branches", "Services"].includes(activeSection) ? (
            <SimpleSection section={activeSection as "Branches" | "Services"} />
          ) : null}
        </div>
      </div>
      {!activeRole && loginModalOpen ? <LoginModal onClose={() => setLoginModalOpen(false)} /> : null}
    </main>
  );
}
