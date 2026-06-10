"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

type Role = "admin" | "member";
type MainSection = "Home" | "Admin" | "Members" | "Trainer" | "Branches" | "Services" | "Tools";
type Tone = "emerald" | "cyan" | "lime" | "amber";

const role: Role = "admin";

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

const mainMenu: MainSection[] = ["Home", "Admin", "Members", "Trainer", "Branches", "Services", "Tools"];

const timerPresets = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "2.5 min", seconds: 150 },
  { label: "3 min", seconds: 180 },
];

const heroImages = [
  {
    src: "/gymbuddy_image/dumbell in hand.jpg",
    title: "Train Strong",
    copy: "Premium strength floor, daily coaching, and member progress tracked in one place.",
  },
  {
    src: "/gymbuddy_image/men dumbel.jpg",
    title: "Coach Better",
    copy: "Keep trainers, sessions, branch load, and member plans moving with less friction.",
  },
  {
    src: "/gymbuddy_image/balls.jpg",
    title: "Move Every Day",
    copy: "From cardio to conditioning, GymBuddy keeps every workout and attendance record visible.",
  },
  {
    src: "/gymbuddy_image/raw motu.jpg",
    title: "Build Community",
    copy: "Turn walk-ins, renewals, and social leads into long-term gym members.",
  },
];

const adminStats: { label: string; value: string; trend: string; tone: Tone }[] = [
  { label: "Total Members", value: "2,486", trend: "+12.8%", tone: "emerald" },
  { label: "Active Members", value: "2,104", trend: "+8.2%", tone: "cyan" },
  { label: "Revenue", value: "$84,320", trend: "+18.4%", tone: "lime" },
  { label: "Expiring Memberships", value: "126", trend: "Next 14 days", tone: "amber" },
];

const memberStats: { label: string; value: string; trend: string; tone: Tone }[] = [
  { label: "Membership Status", value: "Active", trend: "Premium plan", tone: "emerald" },
  { label: "Days Remaining", value: "42", trend: "Renews soon", tone: "lime" },
  { label: "Attendance Count", value: "18", trend: "This month", tone: "cyan" },
  { label: "Next Renewal Date", value: "Jul 22", trend: "Auto-pay on", tone: "amber" },
];

const recentMembers = [
  { name: "Aarav Mehta", plan: "Elite Annual", branch: "Downtown", joined: "Today", status: "Active" },
  { name: "Nina Kapoor", plan: "Strength Plus", branch: "West End", joined: "Yesterday", status: "Active" },
  { name: "Kabir Shah", plan: "Monthly", branch: "Central", joined: "Jun 8", status: "Pending" },
  { name: "Rhea Soni", plan: "Elite Annual", branch: "North Hub", joined: "Jun 7", status: "Active" },
];

const expiringMemberships = [
  { name: "Dev Patel", plan: "Monthly", date: "Jun 12", days: "2 days" },
  { name: "Maya Rao", plan: "Strength Plus", date: "Jun 15", days: "5 days" },
  { name: "Ishan Gill", plan: "Quarterly", date: "Jun 18", days: "8 days" },
  { name: "Sara Khan", plan: "Annual", date: "Jun 21", days: "11 days" },
];

const recentAttendance = [
  { date: "Jun 10", checkIn: "07:12 AM", workout: "Push day", duration: "74 min" },
  { date: "Jun 8", checkIn: "06:58 AM", workout: "Conditioning", duration: "52 min" },
  { date: "Jun 6", checkIn: "07:20 AM", workout: "Pull day", duration: "69 min" },
  { date: "Jun 4", checkIn: "06:45 AM", workout: "Leg day", duration: "81 min" },
];

const workoutPlan = [
  { day: "Mon", focus: "Push strength", coach: "Arjun", status: "Completed" },
  { day: "Wed", focus: "Leg volume", coach: "Maya", status: "Next" },
  { day: "Fri", focus: "Pull hypertrophy", coach: "Arjun", status: "Planned" },
  { day: "Sat", focus: "Zone 2 cardio", coach: "Self", status: "Planned" },
];

const trainers = [
  {
    name: "Animesh",
    title: "Senior Strength Coach",
    specialty: "Strength, Fat Loss, Mobility",
    experience: "7 years",
    clients: 42,
    rating: "4.9",
    branch: "Downtown",
    status: "Available",
    phone: "+91 98765 43210",
    email: "animesh@gymbuddy.com",
    bio: "Animesh builds practical strength programs for beginners and advanced members, with a focus on form, consistency, and measurable progress.",
    schedule: ["Mon 7 AM - 1 PM", "Wed 12 PM - 7 PM", "Fri 7 AM - 3 PM"],
    certifications: ["ACE Personal Trainer", "Kettlebell Fundamentals", "Sports Nutrition"],
  },
  {
    name: "Maya",
    title: "Conditioning Coach",
    specialty: "HIIT, Endurance, Group Classes",
    experience: "5 years",
    clients: 36,
    rating: "4.8",
    branch: "Central",
    status: "In session",
    phone: "+91 98765 43211",
    email: "maya@gymbuddy.com",
    bio: "Maya runs high-energy conditioning plans for members who want better stamina, weight control, and athletic movement.",
    schedule: ["Tue 8 AM - 2 PM", "Thu 2 PM - 8 PM", "Sat 9 AM - 1 PM"],
    certifications: ["NASM CPT", "Functional Training", "CPR Certified"],
  },
  {
    name: "Arjun",
    title: "Hypertrophy Specialist",
    specialty: "Muscle Gain, Split Plans, Nutrition",
    experience: "6 years",
    clients: 39,
    rating: "4.7",
    branch: "West End",
    status: "Available",
    phone: "+91 98765 43212",
    email: "arjun@gymbuddy.com",
    bio: "Arjun helps members structure progressive training blocks with simple nutrition habits and clear weekly targets.",
    schedule: ["Mon 1 PM - 8 PM", "Thu 8 AM - 2 PM", "Sun 10 AM - 2 PM"],
    certifications: ["ISSA Specialist", "Bodybuilding Prep", "Nutrition Coach"],
  },
];

function getInitials(label: string) {
  return label
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);
}

function MenuIcon({ item, active }: { item: MainSection; active: boolean }) {
  const iconClass = active ? "text-[#07100b]" : "text-lime-300";

  if (item === "Home") {
    return (
      <svg className={`h-4 w-4 ${iconClass}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (item === "Services") {
    return (
      <svg className={`h-4 w-4 ${iconClass}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 5v4M16 10v4M11 15v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (item === "Tools") {
    return (
      <svg className={`h-4 w-4 ${iconClass}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m14.5 5 4.5 4.5-3 3L13 9.5 10.5 12l1.5 1.5-5.5 5.5L5 17.5l5.5-5.5L9 10.5 11.5 8 8.5 5 11 2.5 14.5 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  return <span className="text-[11px] font-black">{getInitials(item)}</span>;
}

function Sidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: MainSection;
  onSectionChange: (section: MainSection) => void;
}) {

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-20 flex-col border-r border-white/10 bg-[#0b0f0d]/95 px-3 py-4 backdrop-blur-xl md:w-72 md:px-5">
      <div className="flex items-center border-b border-white/10 pb-5">
        <p className="hidden text-xl font-black tracking-normal text-white md:block">GymBuddy</p>
        <p className="grid h-11 w-11 place-items-center rounded-lg bg-lime-400 text-lg font-black text-[#07100b] shadow-[0_0_30px_rgba(163,230,53,0.34)] md:hidden">
          G
        </p>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {mainMenu.map((item) => {
          const active = item === activeSection;

          return (
            <button
              type="button"
              key={item}
              onClick={() => onSectionChange(item)}
              className={`group flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
                active
                  ? "bg-lime-400 text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.22)]"
                  : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
              }`}
              aria-label={item}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-[11px] font-black ${
                  active ? "bg-[#07100b]/10" : "bg-white/[0.06] text-lime-300"
                }`}
              >
                <MenuIcon item={item} active={active} />
              </span>
              <span className="hidden truncate md:inline">{item}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center justify-center gap-2 border-t border-white/10 pt-4 md:justify-start">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Open Instagram"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-lime-300 transition hover:border-lime-300/50 hover:bg-lime-300/10"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
            <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
          </svg>
        </a>
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Open Facebook"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-lime-300 transition hover:border-lime-300/50 hover:bg-lime-300/10"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14.2 8.2H16V5.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6v2.6H6v3.5h3V24h3.7v-8.3h3l.5-3.5h-3.5V10c0-1 .3-1.8 1.5-1.8Z" />
          </svg>
        </a>
        <a
          href="tel:+919876543210"
          aria-label="Call GymBuddy"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-lime-300 transition hover:border-lime-300/50 hover:bg-lime-300/10"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6.5 4.5 9 4l2 4-1.5 1.2a12 12 0 0 0 5.3 5.3L16 13l4 2-.5 2.5c-.2 1-1.1 1.7-2.1 1.5C10.6 17.8 6.2 13.4 5 6.6c-.2-1 .5-1.9 1.5-2.1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </aside>
  );
}

function TopBar({ currentRole, activeSection }: { currentRole: Role; activeSection: MainSection }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#101411]/86 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300/70">
            {currentRole === "admin" ? "Operations" : "Member space"}
          </p>
          <h1 className="text-xl font-bold text-white sm:text-2xl">{activeSection}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-64 items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-500 sm:flex">
            Search members, plans, payments
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-lime-300 transition hover:border-lime-300/50 hover:bg-lime-300/10">
            <span className="sr-only">Notifications</span>
            <span className="h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_16px_rgba(190,242,100,0.9)]" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-white ring-1 ring-white/10">
            {currentRole === "admin" ? "AM" : "MK"}
          </div>
        </div>
      </div>
    </header>
  );
}

function StatCard({ stat }: { stat: (typeof adminStats)[number] }) {
  const toneClasses = {
    emerald: "from-emerald-300/18 text-emerald-200",
    cyan: "from-cyan-300/18 text-cyan-200",
    lime: "from-lime-300/18 text-lime-200",
    amber: "from-amber-300/18 text-amber-200",
  }[stat.tone];

  return (
    <section className="rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 shadow-2xl shadow-black/20">
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
    <section className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-white">{title}</h2>
        {action ? <button className="text-sm font-bold text-lime-300 hover:text-lime-200">{action}</button> : null}
      </div>
      {children}
    </section>
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Recent Members" action="View all">
          <div className="overflow-x-auto">
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

function HomeContent({ onSectionChange }: { onSectionChange: (section: MainSection) => void }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentImage = heroImages[activeSlide];
  const homeActions = [
    { label: "Start Your Journey", href: "#start", variant: "primary" },
    { label: "Start Free Trial", href: "#trial", variant: "secondary" },
    { label: "Our Services", onClick: () => onSectionChange("Services"), variant: "secondary" },
    { label: "Contact Us", href: "tel:+919876543210", variant: "secondary" },
    { label: "About Us", href: "#about", variant: "secondary" },
  ];

  return (
    <div className="space-y-6">
      <section className="relative min-h-[620px] overflow-hidden rounded-lg border border-white/10 bg-[#111713]">
        <Image
          key={currentImage.src}
          src={currentImage.src}
          alt={currentImage.title}
          fill
          priority
          sizes="(min-width: 768px) calc(100vw - 18rem), calc(100vw - 5rem)"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050806] via-[#050806]/82 to-[#050806]/20" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#111713] to-transparent" />

        <div className="relative z-10 grid min-h-[620px] content-between gap-8 p-6 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-lg border border-lime-300/25 bg-black/30 px-4 py-2 backdrop-blur-md">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-lime-200">GymBuddy Fitness Club</p>
            </div>
            <div className="hidden rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-sm font-bold text-white backdrop-blur-md sm:block">
              Open 5 AM - 11 PM
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-lime-300">{currentImage.title}</p>
            <h2 className="text-5xl font-black tracking-normal text-white sm:text-6xl lg:text-7xl">
              Build a stronger gym experience.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-200">{currentImage.copy}</p>
            <div id="start" className="mt-8 flex flex-wrap gap-3">
              {homeActions.map((action) => {
                const className =
                  action.variant === "primary"
                    ? "rounded-lg bg-lime-400 px-5 py-3 text-sm font-black text-[#07100b] shadow-[0_0_28px_rgba(163,230,53,0.24)] transition hover:bg-lime-300"
                    : "rounded-lg border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200";

                if (action.onClick) {
                  return (
                    <button key={action.label} type="button" onClick={action.onClick} className={className}>
                      {action.label}
                    </button>
                  );
                }

                return (
                  <a key={action.label} href={action.href} className={className}>
                    {action.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: "Members", value: "2.4K" },
                { label: "Branches", value: "8" },
                { label: "Trainers", value: "32" },
                { label: "Check-ins", value: "418" },
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

      <div id="about" className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Start Your Journey", copy: "Choose a plan, meet your trainer, and begin with a clean fitness roadmap." },
          { title: "Start Free Trial", copy: "Try the gym floor, classes, and coaching experience before you commit." },
          { title: "About GymBuddy", copy: "A modern fitness club built around strength, coaching, community, and progress." },
        ].map((item) => (
          <section key={item.title} className="rounded-lg border border-white/10 bg-[#111713] p-5">
            <div className="mb-5 h-1 w-12 rounded-full bg-lime-300" />
            <h3 className="text-lg font-black text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{item.copy}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

function TrainerContent() {
  const [selectedTrainer, setSelectedTrainer] = useState(trainers[0]);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
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
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-lime-400 text-sm font-black text-[#07100b]">
                    {getInitials(trainer.name)}
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

      <section className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-lg bg-lime-400 text-2xl font-black text-[#07100b] shadow-[0_0_30px_rgba(163,230,53,0.24)]">
                {getInitials(selectedTrainer.name)}
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Trainer Profile</p>
                <h2 className="mt-2 text-3xl font-black text-white">{selectedTrainer.name}</h2>
                <p className="mt-1 text-zinc-400">{selectedTrainer.title}</p>
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
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-lime-400 px-4 py-3 text-sm font-black text-[#07100b] transition hover:bg-lime-300"
            >
              Assign Member
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function ToolsContent() {
  const [selectedSeconds, setSelectedSeconds] = useState(timerPresets[0].seconds);
  const [remainingSeconds, setRemainingSeconds] = useState(timerPresets[0].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Choose a timer and press start.");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          setStatus("Timer complete. Nice work.");
          audioRef.current?.play().catch(() => {
            setStatus("Timer complete. Tap the page once if your browser blocked sound.");
          });
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  function selectPreset(seconds: number) {
    setSelectedSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
    setStatus("Ready when you are.");
  }

  function startTimer() {
    if (remainingSeconds === 0) {
      setRemainingSeconds(selectedSeconds);
    }

    audioRef.current?.load();
    setIsRunning(true);
    setStatus("Timer running.");
  }

  function pauseTimer() {
    setIsRunning(false);
    setStatus("Timer paused.");
  }

  function resetTimer() {
    setIsRunning(false);
    setRemainingSeconds(selectedSeconds);
    setStatus("Timer reset.");
  }

  const progress = Math.max(0, Math.min(100, ((selectedSeconds - remainingSeconds) / selectedSeconds) * 100));

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="rounded-lg border border-white/10 bg-[#111713] p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Tools</p>
            <h2 className="mt-3 text-3xl font-black text-white">Workout Timer</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Pick a preset for rest periods, circuits, or quick conditioning rounds. The finish sound plays automatically when the countdown reaches zero.
            </p>
          </div>
          <StatusBadge>{isRunning ? "Running" : remainingSeconds === 0 ? "Complete" : "Ready"}</StatusBadge>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {timerPresets.map((preset) => {
            const active = preset.seconds === selectedSeconds;

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => selectPreset(preset.seconds)}
                className={`rounded-lg border px-4 py-5 text-left transition ${
                  active
                    ? "border-lime-300/50 bg-lime-300/[0.1] text-lime-100"
                    : "border-white/10 bg-white/[0.035] text-white hover:border-lime-300/40"
                }`}
              >
                <p className="text-2xl font-black">{preset.label}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Preset</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-white/10 bg-black/25 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-500">Remaining</p>
          <p className="mt-4 text-7xl font-black tracking-normal text-white sm:text-8xl">{formatTime(remainingSeconds)}</p>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-lime-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-4 text-sm font-semibold text-zinc-400">{status}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startTimer}
            disabled={isRunning}
            className="rounded-lg bg-lime-400 px-5 py-3 text-sm font-black text-[#07100b] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start
          </button>
          <button
            type="button"
            onClick={pauseTimer}
            disabled={!isRunning}
            className="rounded-lg border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="rounded-lg border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
          >
            Reset
          </button>
        </div>

        <audio ref={audioRef} src="/sounds/timerfinish.wav" preload="auto" />
      </section>

      <aside className="rounded-lg border border-lime-300/20 bg-lime-300/[0.08] p-5">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-lime-200">Quick Use</p>
        <div className="mt-5 space-y-3">
          {[
            "1 min for short rest between accessory sets.",
            "2 min for strength work and controlled recovery.",
            "2.5 min for heavy compound lifts.",
            "3 min for max effort sets or partner rotations.",
          ].map((tip) => (
            <p key={tip} className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-zinc-300">
              {tip}
            </p>
          ))}
        </div>
      </aside>
    </div>
  );
}

function SimpleSection({ section }: { section: Exclude<MainSection, "Home" | "Admin" | "Trainer"> }) {
  const summaries = {
    Members: {
      title: "Members",
      copy: "Manage member profiles, membership plans, renewals, and attendance history.",
      metric: "2,486",
      label: "Total records",
    },
    Trainer: {
      title: "Trainer",
      copy: "Track trainer schedules, assigned members, sessions, and performance notes.",
      metric: "32",
      label: "Active trainers",
    },
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
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {memberStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
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
                className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3"
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
  const [activeSection, setActiveSection] = useState<MainSection>("Home");

  return (
    <main className="min-h-screen bg-[#0a0d0b] text-white">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="min-h-screen pl-20 md:pl-72">
        <TopBar currentRole={role} activeSection={activeSection} />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {activeSection === "Home" ? (
            <HomeContent onSectionChange={setActiveSection} />
          ) : role === "member" ? (
            <MemberContent />
          ) : activeSection === "Admin" ? (
            <AdminContent />
          ) : activeSection === "Trainer" ? (
            <TrainerContent />
          ) : activeSection === "Tools" ? (
            <ToolsContent />
          ) : (
            <SimpleSection section={activeSection} />
          )}
        </div>
      </div>
    </main>
  );
}
