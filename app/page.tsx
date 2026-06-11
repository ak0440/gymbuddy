"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import ToolsPageContent from "./tools/ToolsPageContent";

type Role = "admin" | "member" | "trainer";
type MainSection =
  | "Home"
  | "Admin"
  | "Members"
  | "Trainer"
  | "TrainerDashboard"
  | "TrainerMembers"
  | "TrainerProfile"
  | "Branches"
  | "Services"
  | "Tools";
type Tone = "emerald" | "cyan" | "lime" | "amber";
type MemberStatus = "Active" | "Expired" | "Expiring Soon";

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

const adminMenu = [
  "Dashboard",
  "Attendance",
  "Payments",
  "Reports",
  "Settings",
];

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

const roleMenus: Record<Role, MainSection[]> = {
  admin: ["Admin", "Members", "Trainer", "Branches", "Services", "Tools"],
  trainer: ["TrainerDashboard", "TrainerMembers", "TrainerProfile"],
  member: ["Members", "Tools"],
};

const menuLabels: Partial<Record<MainSection, string>> = {
  Admin: "Dashboard",
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

const adminStats: { label: string; value: string; trend: string; tone: Tone }[] = [
  { label: "Total Members", value: "1", trend: "Amit", tone: "emerald" },
  { label: "Active Members", value: "1", trend: "Active", tone: "cyan" },
  { label: "Revenue", value: "Annual", trend: "Current plan", tone: "lime" },
  { label: "Expiring Memberships", value: "0", trend: "No alerts", tone: "amber" },
];

const memberStats: { label: string; value: string; trend: string; tone: Tone }[] = [
  { label: "Membership Status", value: "Active", trend: "Premium plan", tone: "emerald" },
  { label: "Days Remaining", value: "42", trend: "Renews soon", tone: "lime" },
  { label: "Attendance Count", value: "18", trend: "This month", tone: "cyan" },
  { label: "Next Renewal Date", value: "Jul 22", trend: "Auto-pay on", tone: "amber" },
];

const recentMembers = [
  { name: "Amit", plan: "Annual", branch: "Noida", joined: "Active", status: "Active" },
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

const memberFilters: ("All" | MemberStatus)[] = ["All", "Active", "Expired", "Expiring Soon"];

const membershipPlans = ["Annual"];
const branches = ["Noida"];
const trainerNames = ["Animesh"];

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

const emptyMemberForm = {
  name: "",
  phone: "",
  email: "",
  plan: membershipPlans[0],
  branch: branches[0],
  startDate: "",
  expiryDate: "",
  trainer: trainerNames[0],
};

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

const trainerDashboardStats: { label: string; value: string; trend: string; tone: Tone }[] = [
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

function StatCard({ stat }: { stat: (typeof adminStats)[number] }) {
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

function SocialIcon({ type }: { type: "facebook" | "instagram" }) {
  if (type === "facebook") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.2 8.2H16V5.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6v2.6H6v3.5h3V24h3.7v-8.3h3l.5-3.5h-3.5V10c0-1 .3-1.8 1.5-1.8Z" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function PublicHeader({
  loginOpen,
  onLoginToggle,
  onLogin,
}: {
  loginOpen: boolean;
  onLoginToggle: () => void;
  onLogin: (role: Role) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f0d]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" className="flex items-center gap-3 text-left" aria-label="Go to home">
          <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-base font-black text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.28)]">
            <Image src={logoSrc} alt="GymBuddy logo" fill sizes="56px" className="object-contain p-1" />
          </span>
          <span className="text-lg font-black text-white">GymBuddy</span>
        </button>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          <a href="#home" className="rounded-lg px-3 py-2 text-sm font-bold text-white transition hover:bg-white/[0.06] hover:text-lime-200">
            Home
          </a>
          <div className="relative">
            <button
              type="button"
              onClick={onLoginToggle}
              className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-black text-[#07100b] transition hover:bg-lime-300"
            >
              Login
            </button>
            {loginOpen ? (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border border-white/10 bg-[#111713] p-2 shadow-2xl shadow-black/40">
                {[
                  { label: "Admin", role: "admin" },
                  { label: "Member", role: "member" },
                  { label: "Trainer", role: "trainer" },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => onLogin(item.role as Role)}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm font-bold text-zinc-300 transition hover:bg-lime-300/10 hover:text-lime-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Facebook"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-lime-300 transition hover:border-lime-300/50 hover:bg-lime-300/10"
          >
            <SocialIcon type="facebook" />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Instagram"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-lime-300 transition hover:border-lime-300/50 hover:bg-lime-300/10"
          >
            <SocialIcon type="instagram" />
          </a>
          <a
            href="tel:+919876543210"
            className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
          >
            Contact Us
          </a>
        </nav>
      </div>
    </header>
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

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f0d]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400 text-base font-black text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.28)]">
            <Image src={logoSrc} alt="GymBuddy logo" fill sizes="44px" className="object-contain p-1" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-white">GymBuddy</p>
            <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-lime-300/70">
              {activeRole === "trainer" ? "Animesh" : `${roleLabel} dashboard`}
            </p>
          </div>
        </div>

        <nav className="flex max-w-full gap-2 overflow-x-auto">
          {roleMenus[activeRole].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSectionChange(item)}
              className={`h-10 shrink-0 rounded-lg px-4 text-sm font-bold transition ${
                activeSection === item
                  ? "bg-lime-400 text-[#07100b]"
                  : "border border-white/10 bg-white/[0.05] text-zinc-300 hover:border-lime-300/40 hover:text-lime-200"
              }`}
            >
              {menuLabels[item] ?? item}
            </button>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="h-10 shrink-0 rounded-lg border border-white/10 bg-white/[0.05] px-4 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
          >
            Home
          </button>
        </nav>
      </div>
    </header>
  );
}

function AdminContent() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto rounded-lg border border-white/10 bg-[#111713] p-2">
        {adminMenu.map((item) => (
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
        {adminStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Recent Members" action="View all">
          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                <tr className="border-b border-white/10">
                  <th className="pb-3 font-bold">Name</th>
                  <th className="pb-3 font-bold">Plan</th>
                  <th className="pb-3 font-bold">Branch</th>
                  <th className="pb-3 font-bold">Joined</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentMembers.map((member) => (
                  <tr key={member.name} className="text-zinc-300">
                    <td className="py-4 font-semibold text-white">{member.name}</td>
                    <td className="py-4">{member.plan}</td>
                    <td className="py-4">{member.branch}</td>
                    <td className="py-4">{member.joined}</td>
                    <td className="py-4">
                      <StatusBadge>{member.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Expiring Memberships" action="Notify">
          <div className="space-y-3">
            {expiringMemberships.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-3"
              >
                <div>
                  <p className="font-bold text-white">{member.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{member.plan}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-200">{member.days}</p>
                  <p className="mt-1 text-xs text-zinc-500">{member.date}</p>
                </div>
              </div>
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

function HomeContent() {
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
              The all-in-one platform to stay connected, organized, and focused on results.
            </p>
            <div id="start" className="mt-8 flex flex-wrap gap-3">
              {homeActions.map((action) => {
                const className =
                  action.variant === "primary"
                    ? "rounded-lg bg-lime-400 px-5 py-3 text-sm font-black text-[#07100b] shadow-[0_0_28px_rgba(163,230,53,0.24)] transition hover:bg-lime-300"
                    : "rounded-lg border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200";

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

      <footer className="rounded-lg border border-white/10 bg-[#111713] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-lime-400">
              <Image src={logoSrc} alt="GymBuddy logo" fill sizes="48px" className="object-contain p-1" />
            </span>
            <p className="text-lg font-black text-white">GymBuddy</p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm font-bold text-zinc-400">
            {["Features", "Pricing", "Contact", "Privacy Policy"].map((item) => (
              <a key={item} href={item === "Contact" ? "tel:+919876543210" : "#home"} className="transition hover:text-lime-200">
                {item}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

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

export default function Home() {
  const [activeRole, setActiveRole] = useState<Role | null>(role);
  const [activeSection, setActiveSection] = useState<MainSection>(
    role === "trainer" ? "TrainerDashboard" : role === "admin" ? "Admin" : role === "member" ? "Members" : "Home",
  );
  const [loginOpen, setLoginOpen] = useState(false);

  function handleLogin(nextRole: Role) {
    setActiveRole(nextRole);
    setLoginOpen(false);

    if (nextRole === "admin") {
      setActiveSection("Admin");
      return;
    }

    if (nextRole === "trainer") {
      setActiveSection("TrainerDashboard");
      return;
    }

    setActiveSection("Members");
  }

  function handleSectionChange(section: MainSection) {
    setActiveSection(section);
  }

  function handleLogout() {
    setActiveRole(null);
    setActiveSection("Home");
    setLoginOpen(false);
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
        <PublicHeader
          loginOpen={loginOpen}
          onLoginToggle={() => setLoginOpen((open) => !open)}
          onLogin={handleLogin}
        />
      )}

      <div className="min-h-screen w-full max-w-full overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
          {!activeRole ? <HomeContent /> : null}
          {activeRole === "admin" && activeSection === "Admin" ? <AdminContent /> : null}
          {activeRole === "admin" && activeSection === "Members" ? <MembersContent /> : null}
          {activeRole === "admin" && activeSection === "Trainer" ? <TrainerContent /> : null}
          {activeRole === "trainer" && activeSection === "TrainerDashboard" ? <TrainerDashboardContent /> : null}
          {activeRole === "trainer" && activeSection === "TrainerMembers" ? <TrainerMembersContent /> : null}
          {activeRole === "trainer" && activeSection === "TrainerProfile" ? <TrainerProfileContent /> : null}
          {activeRole === "member" && activeSection === "Members" ? <MemberContent /> : null}
          {activeRole && activeSection === "Tools" ? <ToolsContent /> : null}
          {activeRole && ["Branches", "Services"].includes(activeSection) ? (
            <SimpleSection section={activeSection as "Branches" | "Services"} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
