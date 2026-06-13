"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type MemberStatus = "Active" | "Expired" | "Expiring Soon";
type MemberFilter = "All" | MemberStatus;
type SupabaseConnectionStatus = "checking" | "connected" | "error";

type Member = {
  id: number | string;
  fullName: string;
  phone: string;
  dob: string;
  email: string;
  plan: string;
  branch: string;
  trainer: string;
  joinDate: string;
  expiryDate: string;
};

type MemberForm = Omit<Member, "id">;

type SupabaseMemberRow = {
  id: number | string;
  full_name?: string | null;
  fullName?: string | null;
  name?: string | null;
  phone?: string | null;
  dob?: string | null;
  date_of_birth?: string | null;
  dateOfBirth?: string | null;
  mobile_number?: string | null;
  mobileNumber?: string | null;
  email?: string | null;
  membership_plan?: string | null;
  membershipPlan?: string | null;
  plan?: string | null;
  branch?: string | null;
  assigned_trainer?: string | null;
  assignedTrainer?: string | null;
  trainer?: string | null;
  join_date?: string | null;
  joinDate?: string | null;
  start_date?: string | null;
  startDate?: string | null;
  expiry_date?: string | null;
  expiryDate?: string | null;
};

const filters: MemberFilter[] = ["All", "Active", "Expired", "Expiring Soon"];
const plans = ["Annual", "Quarterly", "Monthly", "Strength Plus"];
const branches = ["Noida", "Central", "Downtown", "West End"];
const trainers = ["None", "Animesh"];

const emptyForm: MemberForm = {
  fullName: "",
  phone: "",
  dob: "",
  email: "",
  plan: plans[0],
  branch: branches[0],
  trainer: trainers[0],
  joinDate: "",
  expiryDate: "",
};

function dateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function valueToString(value: string | number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

function normalizeDate(value: string | null | undefined) {
  const date = valueToString(value);
  return date.includes("T") ? date.split("T")[0] : date;
}

function isValidDob(dob: string) {
  if (!isValidDateInput(dob)) {
    return false;
  }

  const birthDate = dateOnly(new Date(`${dob}T00:00:00`));
  const earliestDate = dateOnly(new Date("1900-01-01T00:00:00"));
  const today = dateOnly(new Date());

  return birthDate.getTime() >= earliestDate.getTime() && birthDate.getTime() <= today.getTime();
}

function isValidDateInput(dateValue: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return false;
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const parsedDate = new Date(`${dateValue}T00:00:00`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() + 1 === month &&
    parsedDate.getDate() === day
  );
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function mapSupabaseMember(row: SupabaseMemberRow): Member {
  return {
    id: row.id,
    fullName: valueToString(row.full_name ?? row.fullName ?? row.name),
    phone: valueToString(row.phone ?? row.mobile_number ?? row.mobileNumber),
    dob: normalizeDate(row.dob ?? row.date_of_birth ?? row.dateOfBirth),
    email: valueToString(row.email),
    plan: valueToString(row.membership_plan ?? row.membershipPlan ?? row.plan),
    branch: valueToString(row.branch),
    trainer: valueToString(row.assigned_trainer ?? row.assignedTrainer ?? row.trainer),
    joinDate: normalizeDate(row.join_date ?? row.joinDate ?? row.start_date ?? row.startDate),
    expiryDate: normalizeDate(row.expiry_date ?? row.expiryDate),
  };
}

function getDaysRemaining(expiryDate: string) {
  if (!expiryDate) {
    return 0;
  }

  const today = dateOnly(new Date());
  const expiry = dateOnly(new Date(`${expiryDate}T00:00:00`));
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
}

function getMembershipStatus(expiryDate: string): MemberStatus {
  const daysRemaining = getDaysRemaining(expiryDate);

  if (daysRemaining < 0) {
    return "Expired";
  }

  if (daysRemaining <= 7) {
    return "Expiring Soon";
  }

  return "Active";
}

function statusClasses(status: MemberStatus) {
  return {
    Active: "border-lime-300/30 bg-lime-300/12 text-lime-200",
    Expired: "border-red-300/25 bg-red-300/10 text-red-200",
    "Expiring Soon": "border-amber-300/30 bg-amber-300/12 text-amber-200",
  }[status];
}

function StatusBadge({ status }: { status: MemberStatus }) {
  return <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${statusClasses(status)}`}>{status}</span>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function textInputClass() {
  return "h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60";
}

function memberFilterFromValue(value: string | null | undefined): MemberFilter {
  const normalizedValue = value?.toLowerCase();

  if (normalizedValue === "active") {
    return "Active";
  }

  if (normalizedValue === "expiring") {
    return "Expiring Soon";
  }

  if (normalizedValue === "expired") {
    return "Expired";
  }

  return "All";
}

export default function MembersPageContent() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<MemberFilter>("All");
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConnectionStatus>("checking");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | string | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [savingMember, setSavingMember] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deletingMember, setDeletingMember] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadMembers = useCallback(async () => {
    setLoadingMembers(true);
    setMembersError(false);

    const { data, error } = await supabase.from("members").select("*");

    if (error) {
      console.error("Failed to load members", error);
      setMembers([]);
      setMembersError(true);
      setLoadingMembers(false);
      return;
    }

    setMembers((data ?? []).map((member) => mapSupabaseMember(member as SupabaseMemberRow)));
    setLoadingMembers(false);
  }, []);

  useEffect(() => {
    let active = true;

    async function checkSupabaseConnection() {
      const { error } = await supabase.from("members").select("id").limit(1);

      if (!active) {
        return;
      }

      if (error) {
        console.error("Supabase connection failed", error);
        setSupabaseStatus("error");
        return;
      }

      console.log("Supabase connection OK");
      setSupabaseStatus("connected");
    }

    checkSupabaseConnection();
    const loadTimer = window.setTimeout(() => {
      loadMembers();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(loadTimer);
    };
  }, [loadMembers]);

  useEffect(() => {
    function applyFilter(value: string | null | undefined) {
      setActiveFilter(memberFilterFromValue(value));
    }

    const timer = window.setTimeout(() => {
      applyFilter(new URLSearchParams(window.location.search).get("filter"));
    }, 0);

    function handleFilter(event: Event) {
      applyFilter((event as CustomEvent<string>).detail);
    }

    window.addEventListener("gymbuddy:members-filter", handleFilter);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("gymbuddy:members-filter", handleFilter);
    };
  }, []);

  const summary = useMemo(() => {
    const counts = {
      total: members.length,
      active: 0,
      expiringSoon: 0,
      expired: 0,
    };

    members.forEach((member) => {
      const status = getMembershipStatus(member.expiryDate);
      if (status === "Active") counts.active += 1;
      if (status === "Expiring Soon") counts.expiringSoon += 1;
      if (status === "Expired") counts.expired += 1;
    });

    return counts;
  }, [members]);

  const visibleMembers = members.filter((member) => {
    const search = searchTerm.trim().toLowerCase();
    const status = getMembershipStatus(member.expiryDate);
    const matchesSearch =
      search.length === 0 ||
      member.fullName.toLowerCase().includes(search) ||
      member.phone.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search);
    const matchesFilter = activeFilter === "All" || status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  function updateForm(field: keyof MemberForm, value: string) {
    setForm((current) => {
      if ((field === "dob" || field === "joinDate" || field === "expiryDate") && value.length > 10) {
        return current;
      }

      return { ...current, [field]: field === "phone" ? digitsOnly(value) : value };
    });
  }

  function openAddModal() {
    setEditingMemberId(null);
    setForm(emptyForm);
    setSaveError("");
    setModalOpen(true);
  }

  function openEditModal(member: Member) {
    setEditingMemberId(member.id);
    setForm({
      fullName: member.fullName,
      phone: member.phone,
      dob: member.dob,
      email: member.email,
      plan: member.plan,
      branch: member.branch,
      trainer: member.trainer,
      joinDate: member.joinDate,
      expiryDate: member.expiryDate,
    });
    setSaveError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingMemberId(null);
    setForm(emptyForm);
    setSaveError("");
    setSavingMember(false);
  }

  async function saveMember() {
    if (!form.fullName.trim() || !form.phone.trim() || !form.dob || !form.email.trim() || !form.joinDate || !form.expiryDate) {
      setSaveError("Please fill all required member details.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setSaveError("Mobile number must be exactly 10 digits.");
      return;
    }

    if (!isValidDob(form.dob)) {
      setSaveError("Please enter a valid DOB. DOB cannot be in the future.");
      return;
    }

    if (!isValidDateInput(form.joinDate) || !isValidDateInput(form.expiryDate)) {
      setSaveError("Please enter valid dates using a 4 digit year.");
      return;
    }

    if (dateOnly(new Date(`${form.expiryDate}T00:00:00`)).getTime() < dateOnly(new Date(`${form.joinDate}T00:00:00`)).getTime()) {
      setSaveError("Expiry date cannot be before join date.");
      return;
    }

    setSavingMember(true);
    setSaveError("");

    const memberPayload = {
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
      dob: form.dob,
      email: form.email.trim(),
      membership_plan: form.plan,
      branch: form.branch,
      assigned_trainer: form.trainer,
      join_date: form.joinDate,
      expiry_date: form.expiryDate,
    };

    if (editingMemberId) {
      const { error } = await supabase.from("members").update(memberPayload).eq("id", editingMemberId);

      if (error) {
        console.error("Failed to update member", error);
        setSaveError("Could not update member. Please check the details and try again.");
        setSavingMember(false);
        return;
      }

      console.log("Member updated successfully");
      await loadMembers();
      closeModal();
      return;
    }

    const { error } = await supabase.from("members").insert(memberPayload);

    if (error) {
      console.error("Failed to add member", error);
      setSaveError("Could not save member. Please check the details and try again.");
      setSavingMember(false);
      return;
    }

    console.log("Member added successfully");
    await loadMembers();
    closeModal();
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeletingMember(true);
    setDeleteError("");

    const { error } = await supabase.from("members").delete().eq("id", deleteTarget.id);

    if (error) {
      console.error("Failed to delete member", error);
      setDeleteError("Could not delete member. Please try again.");
      setDeletingMember(false);
      return;
    }

    console.log("Member deleted successfully");
    await loadMembers();
    setDeleteTarget(null);
    setDeletingMember(false);
  }

  function applySearch() {
    setSearchTerm(searchInput);
  }

  function clearSearch() {
    setSearchInput("");
    setSearchTerm("");
  }

  const emptyMessage = members.length === 0 ? "No members found" : "No members match the current search.";
  const supabaseStatusLabel = {
    checking: "Supabase: Checking...",
    connected: "Supabase: Connected ✅",
    error: "Supabase: Error ❌",
  }[supabaseStatus];
  const supabaseStatusClass = {
    checking: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    connected: "border-lime-300/30 bg-lime-300/10 text-lime-100",
    error: "border-red-300/25 bg-red-300/10 text-red-100",
  }[supabaseStatus];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Members</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Members</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Manage gym members, plans, status, and renewals.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
          <span className={`inline-flex h-8 items-center rounded-lg border px-3 text-xs font-bold ${supabaseStatusClass}`}>
            {supabaseStatusLabel}
          </span>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.22)] transition hover:bg-lime-300 sm:w-auto"
          >
            Add Member
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Members", value: summary.total },
          { label: "Active Members", value: summary.active },
          { label: "Expiring Soon", value: summary.expiringSoon },
          { label: "Expired Members", value: summary.expired },
        ].map((card) => (
          <section key={card.label} className="rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 shadow-2xl shadow-black/20">
            <p className="text-sm font-medium text-zinc-400">{card.label}</p>
            <p className="mt-3 text-3xl font-black text-white">{card.value}</p>
          </section>
        ))}
      </div>

      <section className="rounded-lg border border-white/10 bg-[#111713] p-4 shadow-2xl shadow-black/20">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  applySearch();
                }
              }}
              placeholder="Search by name, phone, or email"
              className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60"
            />
            <button
              type="button"
              onClick={applySearch}
              className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] transition hover:bg-lime-300"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearSearch}
              className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-zinc-300 transition hover:border-lime-300/40 hover:text-lime-200"
            >
              Clear
            </button>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto">
            {filters.map((filter) => (
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
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
              <tr className="border-b border-white/10">
                {["Full Name", "Phone", "Email", "Membership Plan", "Branch", "Assigned Trainer", "Join Date", "Expiry Date", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="pb-3 font-bold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {!loadingMembers && !membersError ? visibleMembers.map((member) => {
                const status = getMembershipStatus(member.expiryDate);

                return (
                  <tr key={member.id} className="text-zinc-300">
                    <td className="py-4 font-semibold text-white">{member.fullName}</td>
                    <td className="py-4">{member.phone}</td>
                    <td className="py-4">{member.email}</td>
                    <td className="py-4">{member.plan}</td>
                    <td className="py-4">{member.branch}</td>
                    <td className="py-4">{member.trainer}</td>
                    <td className="py-4">{member.joinDate}</td>
                    <td className="py-4">{member.expiryDate}</td>
                    <td className="py-4"><StatusBadge status={status} /></td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setViewingMember(member)} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-300 hover:text-lime-200">View</button>
                        <button type="button" onClick={() => openEditModal(member)} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-300 hover:text-lime-200">Edit</button>
                        <button type="button" onClick={() => { setDeleteError(""); setDeleteTarget(member); }} className="rounded-md border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs font-bold text-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              }) : null}
            </tbody>
          </table>
          {loadingMembers ? <p className="py-8 text-center text-sm font-semibold text-zinc-500">Loading members...</p> : null}
          {membersError ? <p className="py-8 text-center text-sm font-semibold text-red-200">Failed to load members</p> : null}
          {!loadingMembers && !membersError && visibleMembers.length === 0 ? <p className="py-8 text-center text-sm font-semibold text-zinc-500">{emptyMessage}</p> : null}
        </div>
      </section>

      <div className="grid gap-3 md:hidden">
        {!loadingMembers && !membersError ? visibleMembers.map((member) => {
          const status = getMembershipStatus(member.expiryDate);

          return (
            <article key={member.id} className="rounded-lg border border-white/10 bg-[#111713] p-4 shadow-2xl shadow-black/20">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-white">{member.fullName}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{member.phone}</p>
                  <p className="mt-1 truncate text-sm text-zinc-500">{member.email}</p>
                </div>
                <StatusBadge status={status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Plan</p><p className="mt-1 font-semibold text-white">{member.plan}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Branch</p><p className="mt-1 font-semibold text-white">{member.branch}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Trainer</p><p className="mt-1 font-semibold text-white">{member.trainer}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Expiry</p><p className="mt-1 font-semibold text-white">{member.expiryDate}</p></div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setViewingMember(member)} className="rounded-md border border-white/10 bg-white/[0.05] py-2 text-xs font-bold text-zinc-300">View</button>
                <button type="button" onClick={() => openEditModal(member)} className="rounded-md border border-white/10 bg-white/[0.05] py-2 text-xs font-bold text-zinc-300">Edit</button>
                <button type="button" onClick={() => { setDeleteError(""); setDeleteTarget(member); }} className="rounded-md border border-red-300/20 bg-red-300/10 py-2 text-xs font-bold text-red-200">Delete</button>
              </div>
            </article>
          );
        }) : null}
        {loadingMembers ? <p className="rounded-lg border border-white/10 bg-[#111713] p-5 text-center text-sm font-semibold text-zinc-500">Loading members...</p> : null}
        {membersError ? <p className="rounded-lg border border-white/10 bg-[#111713] p-5 text-center text-sm font-semibold text-red-200">Failed to load members</p> : null}
        {!loadingMembers && !membersError && visibleMembers.length === 0 ? <p className="rounded-lg border border-white/10 bg-[#111713] p-5 text-center text-sm font-semibold text-zinc-500">{emptyMessage}</p> : null}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">{editingMemberId ? "Edit Member" : "Add Member"}</h3>
                <p className="mt-1 text-sm text-zinc-400">Status is calculated from the expiry date.</p>
              </div>
              <button type="button" onClick={closeModal} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300">x</button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name"><input value={form.fullName} onChange={(event) => updateForm("fullName", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Phone"><input inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className={textInputClass()} /></Field>
              <Field label="DOB"><input type="date" min="1900-01-01" max="9999-12-31" value={form.dob} onChange={(event) => updateForm("dob", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Email"><input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Membership Plan"><select value={form.plan} onChange={(event) => updateForm("plan", event.target.value)} className={textInputClass()}>{plans.map((plan) => <option key={plan}>{plan}</option>)}</select></Field>
              <Field label="Branch"><select value={form.branch} onChange={(event) => updateForm("branch", event.target.value)} className={textInputClass()}>{branches.map((branch) => <option key={branch}>{branch}</option>)}</select></Field>
              <Field label="Assigned Trainer"><select value={form.trainer} onChange={(event) => updateForm("trainer", event.target.value)} className={textInputClass()}>{trainers.map((trainer) => <option key={trainer}>{trainer}</option>)}</select></Field>
              <Field label="Join Date"><input type="date" min="1900-01-01" max="9999-12-31" value={form.joinDate} onChange={(event) => updateForm("joinDate", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Expiry Date"><input type="date" min="1900-01-01" max="9999-12-31" value={form.expiryDate} onChange={(event) => updateForm("expiryDate", event.target.value)} className={textInputClass()} /></Field>
            </div>
            {saveError ? (
              <p className="mt-4 rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">
                {saveError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} disabled={savingMember} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
              <button type="button" onClick={saveMember} disabled={savingMember} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] disabled:cursor-not-allowed disabled:opacity-70">
                {savingMember ? "Saving..." : "Save Member"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {viewingMember ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Member Profile</p>
                <h3 className="mt-2 text-2xl font-black text-white">{viewingMember.fullName}</h3>
              </div>
              <button type="button" onClick={() => setViewingMember(null)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300">x</button>
            </div>
            <div className="mt-6 grid gap-4">
              {[
                ["Phone", viewingMember.phone],
                ["Email", viewingMember.email],
                ["Membership", viewingMember.plan],
                ["Branch", viewingMember.branch],
                ["Trainer", viewingMember.trainer],
                ["Join Date", viewingMember.joinDate],
                ["Expiry Date", viewingMember.expiryDate],
                ["Days Remaining", String(getDaysRemaining(viewingMember.expiryDate))],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
                  <p className="mt-2 font-bold text-white">{value}</p>
                </div>
              ))}
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Status</p>
                <div className="mt-2"><StatusBadge status={getMembershipStatus(viewingMember.expiryDate)} /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-lime-300/20 bg-lime-300/[0.08] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-200">Attendance Summary</p>
                  <p className="mt-2 text-2xl font-black text-white">12 visits</p>
                  <p className="mt-1 text-sm text-zinc-400">Mock data this month</p>
                </div>
                <div className="rounded-lg border border-lime-300/20 bg-lime-300/[0.08] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-200">Payment Summary</p>
                  <p className="mt-2 text-2xl font-black text-white">Paid</p>
                  <p className="mt-1 text-sm text-zinc-400">Mock latest invoice</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black">
            <h3 className="text-xl font-black text-white">Delete member?</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">This will remove {deleteTarget.fullName} from the members database.</p>
            {deleteError ? (
              <p className="mt-4 rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">
                {deleteError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => { setDeleteTarget(null); setDeleteError(""); }} disabled={deletingMember} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={deletingMember} className="h-11 rounded-lg bg-red-400 px-5 text-sm font-black text-[#160707] disabled:cursor-not-allowed disabled:opacity-70">
                {deletingMember ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
