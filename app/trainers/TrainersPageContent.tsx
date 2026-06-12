"use client";

import { useMemo, useState, type ReactNode } from "react";

type TrainerStatus = "Active" | "Inactive";

type MockMember = {
  id: number;
  name: string;
  phone: string;
};

type Trainer = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  specialization: string;
  branch: string;
  status: TrainerStatus;
  sessionsCompleted: number;
  assignedMemberIds: number[];
};

type TrainerForm = Omit<Trainer, "id" | "sessionsCompleted" | "assignedMemberIds"> & {
  sessionsCompleted: string;
};

const branches = ["Noida", "Central", "Downtown", "West End"];
const statuses: TrainerStatus[] = ["Active", "Inactive"];

const mockMembers: MockMember[] = [
  { id: 1, name: "Amit", phone: "1234567890" },
  { id: 2, name: "Riya Sharma", phone: "9876543210" },
  { id: 3, name: "Karan Mehta", phone: "9123456780" },
  { id: 4, name: "Neha Singh", phone: "9988776655" },
];

const emptyForm: TrainerForm = {
  fullName: "",
  phone: "",
  email: "",
  specialization: "",
  branch: branches[0],
  status: "Active",
  sessionsCompleted: "0",
};

const initialTrainers: Trainer[] = [
  {
    id: 1,
    fullName: "Animesh",
    phone: "9876543210",
    email: "animesh@gymbuddy.local",
    specialization: "Strength Training",
    branch: "Noida",
    status: "Active",
    sessionsCompleted: 0,
    assignedMemberIds: [1],
  },
];

function inputClass() {
  return "h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60";
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function StatusBadge({ status }: { status: TrainerStatus }) {
  const classes =
    status === "Active"
      ? "border-lime-300/30 bg-lime-300/12 text-lime-200"
      : "border-zinc-400/20 bg-zinc-400/10 text-zinc-300";

  return <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${classes}`}>{status}</span>;
}

function memberNames(ids: number[]) {
  return mockMembers.filter((member) => ids.includes(member.id)).map((member) => member.name);
}

export default function TrainersPageContent() {
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState<number | null>(null);
  const [viewingTrainer, setViewingTrainer] = useState<Trainer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Trainer | null>(null);
  const [assigningTrainer, setAssigningTrainer] = useState<Trainer | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [form, setForm] = useState<TrainerForm>(emptyForm);

  const summary = useMemo(() => {
    return trainers.reduce(
      (totals, trainer) => {
        totals.total += 1;
        if (trainer.status === "Active") totals.active += 1;
        totals.assignedMembers += trainer.assignedMemberIds.length;
        totals.sessionsCompleted += trainer.sessionsCompleted;
        return totals;
      },
      { total: 0, active: 0, assignedMembers: 0, sessionsCompleted: 0 },
    );
  }, [trainers]);

  function updateForm(field: keyof TrainerForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openAddModal() {
    setEditingTrainerId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(trainer: Trainer) {
    setEditingTrainerId(trainer.id);
    setForm({
      fullName: trainer.fullName,
      phone: trainer.phone,
      email: trainer.email,
      specialization: trainer.specialization,
      branch: trainer.branch,
      status: trainer.status,
      sessionsCompleted: String(trainer.sessionsCompleted),
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTrainerId(null);
    setForm(emptyForm);
  }

  function saveTrainer() {
    const sessionsCompleted = Number(form.sessionsCompleted);

    if (!form.fullName.trim() || !form.phone.trim() || Number.isNaN(sessionsCompleted) || sessionsCompleted < 0) {
      return;
    }

    const trainerPayload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      specialization: form.specialization.trim(),
      branch: form.branch,
      status: form.status,
      sessionsCompleted,
    };

    if (editingTrainerId) {
      setTrainers((current) =>
        current.map((trainer) =>
          trainer.id === editingTrainerId
            ? { ...trainer, ...trainerPayload }
            : trainer,
        ),
      );
    } else {
      setTrainers((current) => [
        {
          id: Date.now(),
          ...trainerPayload,
          assignedMemberIds: [],
        },
        ...current,
      ]);
    }

    closeModal();
  }

  function openAssignModal(trainer: Trainer) {
    setAssigningTrainer(trainer);
    setSelectedMemberIds(trainer.assignedMemberIds);
  }

  function toggleSelectedMember(memberId: number) {
    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    );
  }

  function saveAssignments() {
    if (!assigningTrainer) {
      return;
    }

    setTrainers((current) =>
      current.map((trainer) =>
        trainer.id === assigningTrainer.id ? { ...trainer, assignedMemberIds: selectedMemberIds } : trainer,
      ),
    );
    setAssigningTrainer(null);
    setSelectedMemberIds([]);
  }

  function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setTrainers((current) => current.filter((trainer) => trainer.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Trainers</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Trainers</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Manage trainers, assigned members, and completed sessions.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.22)] transition hover:bg-lime-300 sm:w-auto"
        >
          Add Trainer
        </button>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Trainers", value: summary.total },
          { label: "Active Trainers", value: summary.active },
          { label: "Assigned Members", value: summary.assignedMembers },
          { label: "Sessions Completed", value: summary.sessionsCompleted },
        ].map((card) => (
          <section key={card.label} className="rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 shadow-2xl shadow-black/20">
            <p className="text-sm font-medium text-zinc-400">{card.label}</p>
            <p className="mt-3 text-3xl font-black text-white">{card.value}</p>
          </section>
        ))}
      </div>

      <section className="hidden rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 md:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
              <tr className="border-b border-white/10">
                {["Trainer Name", "Phone", "Email", "Specialization", "Branch", "Assigned Members Count", "Sessions Completed", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="pb-3 font-bold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {trainers.map((trainer) => (
                <tr key={trainer.id} className="text-zinc-300">
                  <td className="py-4 font-semibold text-white">{trainer.fullName}</td>
                  <td className="py-4">{trainer.phone}</td>
                  <td className="py-4">{trainer.email}</td>
                  <td className="py-4">{trainer.specialization}</td>
                  <td className="py-4">{trainer.branch}</td>
                  <td className="py-4">{trainer.assignedMemberIds.length}</td>
                  <td className="py-4">{trainer.sessionsCompleted}</td>
                  <td className="py-4"><StatusBadge status={trainer.status} /></td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => setViewingTrainer(trainer)} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-300 hover:text-lime-200">View</button>
                      <button type="button" onClick={() => openEditModal(trainer)} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-300 hover:text-lime-200">Edit</button>
                      <button type="button" onClick={() => setDeleteTarget(trainer)} className="rounded-md border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs font-bold text-red-200">Delete</button>
                      <button type="button" onClick={() => openAssignModal(trainer)} className="rounded-md border border-lime-300/20 bg-lime-300/10 px-3 py-2 text-xs font-bold text-lime-200">Assign Members</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-3 md:hidden">
        {trainers.map((trainer) => (
          <article key={trainer.id} className="rounded-lg border border-white/10 bg-[#111713] p-4 shadow-2xl shadow-black/20">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-black text-white">{trainer.fullName}</h3>
                <p className="mt-1 text-sm text-zinc-400">{trainer.phone}</p>
                <p className="mt-1 truncate text-sm text-zinc-500">{trainer.email}</p>
              </div>
              <StatusBadge status={trainer.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Specialization</p><p className="mt-1 font-semibold text-white">{trainer.specialization}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Branch</p><p className="mt-1 font-semibold text-white">{trainer.branch}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Members</p><p className="mt-1 font-semibold text-white">{trainer.assignedMemberIds.length}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Sessions</p><p className="mt-1 font-semibold text-white">{trainer.sessionsCompleted}</p></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setViewingTrainer(trainer)} className="rounded-md border border-white/10 bg-white/[0.05] py-2 text-xs font-bold text-zinc-300">View</button>
              <button type="button" onClick={() => openEditModal(trainer)} className="rounded-md border border-white/10 bg-white/[0.05] py-2 text-xs font-bold text-zinc-300">Edit</button>
              <button type="button" onClick={() => setDeleteTarget(trainer)} className="rounded-md border border-red-300/20 bg-red-300/10 py-2 text-xs font-bold text-red-200">Delete</button>
              <button type="button" onClick={() => openAssignModal(trainer)} className="rounded-md border border-lime-300/20 bg-lime-300/10 py-2 text-xs font-bold text-lime-200">Assign</button>
            </div>
          </article>
        ))}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">{editingTrainerId ? "Edit Trainer" : "Add Trainer"}</h3>
                <p className="mt-1 text-sm text-zinc-400">Keep trainer details simple for now.</p>
              </div>
              <button type="button" onClick={closeModal} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300">x</button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name"><input value={form.fullName} onChange={(event) => updateForm("fullName", event.target.value)} className={inputClass()} /></Field>
              <Field label="Phone"><input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className={inputClass()} /></Field>
              <Field label="Email"><input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} className={inputClass()} /></Field>
              <Field label="Specialization"><input value={form.specialization} onChange={(event) => updateForm("specialization", event.target.value)} className={inputClass()} /></Field>
              <Field label="Branch"><select value={form.branch} onChange={(event) => updateForm("branch", event.target.value)} className={inputClass()}>{branches.map((branch) => <option key={branch}>{branch}</option>)}</select></Field>
              <Field label="Status"><select value={form.status} onChange={(event) => updateForm("status", event.target.value as TrainerStatus)} className={inputClass()}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></Field>
              <Field label="Sessions Completed"><input type="number" min="0" value={form.sessionsCompleted} onChange={(event) => updateForm("sessionsCompleted", event.target.value)} className={inputClass()} /></Field>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white">Cancel</button>
              <button type="button" onClick={saveTrainer} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b]">Save Trainer</button>
            </div>
          </div>
        </div>
      ) : null}

      {assigningTrainer ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Assign Members</h3>
                <p className="mt-1 text-sm text-zinc-400">{assigningTrainer.fullName}</p>
              </div>
              <button type="button" onClick={() => setAssigningTrainer(null)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300">x</button>
            </div>
            <div className="mt-5 grid gap-3">
              {mockMembers.map((member) => (
                <label key={member.id} className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <span>
                    <span className="block font-bold text-white">{member.name}</span>
                    <span className="mt-1 block text-sm text-zinc-400">{member.phone}</span>
                  </span>
                  <input type="checkbox" checked={selectedMemberIds.includes(member.id)} onChange={() => toggleSelectedMember(member.id)} className="h-5 w-5 accent-lime-400" />
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setAssigningTrainer(null)} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white">Cancel</button>
              <button type="button" onClick={saveAssignments} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b]">Save Assignment</button>
            </div>
          </div>
        </div>
      ) : null}

      {viewingTrainer ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Trainer Profile</p>
                <h3 className="mt-2 text-2xl font-black text-white">{viewingTrainer.fullName}</h3>
              </div>
              <button type="button" onClick={() => setViewingTrainer(null)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300">x</button>
            </div>
            <div className="mt-6 grid gap-4">
              {[
                ["Phone", viewingTrainer.phone],
                ["Email", viewingTrainer.email],
                ["Branch", viewingTrainer.branch],
                ["Specialization", viewingTrainer.specialization],
                ["Status", viewingTrainer.status],
                ["Sessions Completed", String(viewingTrainer.sessionsCompleted)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
                  <p className="mt-2 font-bold text-white">{value || "Not added"}</p>
                </div>
              ))}
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Assigned Members</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {memberNames(viewingTrainer.assignedMemberIds).length > 0 ? (
                    memberNames(viewingTrainer.assignedMemberIds).map((name) => (
                      <span key={name} className="rounded-md border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-sm font-bold text-lime-200">{name}</span>
                    ))
                  ) : (
                    <p className="text-sm font-semibold text-zinc-500">No members assigned.</p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black">
            <h3 className="text-xl font-black text-white">Delete Trainer?</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">This will remove the local trainer record for {deleteTarget.fullName}.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setDeleteTarget(null)} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white">Cancel</button>
              <button type="button" onClick={confirmDelete} className="h-11 rounded-lg bg-red-400 px-5 text-sm font-black text-[#120707]">Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
