"use client";

import { useMemo, useState } from "react";

type MemberStatus = "Active" | "Expired" | "Expiring Soon";
type MemberFilter = "All" | MemberStatus;

type Member = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  plan: string;
  branch: string;
  trainer: string;
  joinDate: string;
  expiryDate: string;
};

type MemberForm = Omit<Member, "id">;

const filters: MemberFilter[] = ["All", "Active", "Expired", "Expiring Soon"];
const plans = ["Annual", "Quarterly", "Monthly", "Strength Plus"];
const branches = ["Noida", "Central", "Downtown", "West End"];
const trainers = ["Animesh"];

const emptyForm: MemberForm = {
  fullName: "",
  phone: "",
  email: "",
  plan: plans[0],
  branch: branches[0],
  trainer: trainers[0],
  joinDate: "",
  expiryDate: "",
};

const initialMembers: Member[] = [
  {
    id: 1,
    fullName: "Amit",
    phone: "1234567890",
    email: "amit@gymbuddy.local",
    plan: "Annual",
    branch: "Noida",
    trainer: "Animesh",
    joinDate: "2026-06-11",
    expiryDate: "2027-06-10",
  },
];

function dateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

export default function MembersPageContent() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<MemberFilter>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);

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
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openAddModal() {
    setEditingMemberId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(member: Member) {
    setEditingMemberId(member.id);
    setForm({
      fullName: member.fullName,
      phone: member.phone,
      email: member.email,
      plan: member.plan,
      branch: member.branch,
      trainer: member.trainer,
      joinDate: member.joinDate,
      expiryDate: member.expiryDate,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingMemberId(null);
    setForm(emptyForm);
  }

  function saveMember() {
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.joinDate || !form.expiryDate) {
      return;
    }

    if (editingMemberId) {
      setMembers((current) =>
        current.map((member) =>
          member.id === editingMemberId ? { ...member, ...form, fullName: form.fullName.trim(), phone: form.phone.trim(), email: form.email.trim() } : member,
        ),
      );
    } else {
      setMembers((current) => [
        {
          id: Date.now(),
          ...form,
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
        },
        ...current,
      ]);
    }

    closeModal();
  }

  function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setMembers((current) => current.filter((member) => member.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function applySearch() {
    setSearchTerm(searchInput);
  }

  function clearSearch() {
    setSearchInput("");
    setSearchTerm("");
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Members</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Members</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Manage gym members, plans, status, and renewals.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.22)] transition hover:bg-lime-300 sm:w-auto"
        >
          Add Member
        </button>
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
              {visibleMembers.map((member) => {
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
                        <button type="button" onClick={() => setDeleteTarget(member)} className="rounded-md border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs font-bold text-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visibleMembers.length === 0 ? <p className="py-8 text-center text-sm font-semibold text-zinc-500">No members match the current search.</p> : null}
        </div>
      </section>

      <div className="grid gap-3 md:hidden">
        {visibleMembers.map((member) => {
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
                <button type="button" onClick={() => setDeleteTarget(member)} className="rounded-md border border-red-300/20 bg-red-300/10 py-2 text-xs font-bold text-red-200">Delete</button>
              </div>
            </article>
          );
        })}
        {visibleMembers.length === 0 ? <p className="rounded-lg border border-white/10 bg-[#111713] p-5 text-center text-sm font-semibold text-zinc-500">No members match the current search.</p> : null}
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
              <Field label="Phone"><input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Email"><input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Membership Plan"><select value={form.plan} onChange={(event) => updateForm("plan", event.target.value)} className={textInputClass()}>{plans.map((plan) => <option key={plan}>{plan}</option>)}</select></Field>
              <Field label="Branch"><select value={form.branch} onChange={(event) => updateForm("branch", event.target.value)} className={textInputClass()}>{branches.map((branch) => <option key={branch}>{branch}</option>)}</select></Field>
              <Field label="Assigned Trainer"><select value={form.trainer} onChange={(event) => updateForm("trainer", event.target.value)} className={textInputClass()}>{trainers.map((trainer) => <option key={trainer}>{trainer}</option>)}</select></Field>
              <Field label="Join Date"><input type="date" value={form.joinDate} onChange={(event) => updateForm("joinDate", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Expiry Date"><input type="date" value={form.expiryDate} onChange={(event) => updateForm("expiryDate", event.target.value)} className={textInputClass()} /></Field>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white">Cancel</button>
              <button type="button" onClick={saveMember} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b]">Save Member</button>
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
            <p className="mt-2 text-sm leading-6 text-zinc-400">This will remove {deleteTarget.fullName} from local state.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setDeleteTarget(null)} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white">Cancel</button>
              <button type="button" onClick={confirmDelete} className="h-11 rounded-lg bg-red-400 px-5 text-sm font-black text-[#160707]">Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
