"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "../../lib/supabase";

type TrainerStatus = "Active" | "Inactive";
type TrainerFilter = "All" | TrainerStatus;

type Trainer = {
  id: number | string;
  fullName: string;
  phone: string;
  email: string;
  specialization: string;
  branch: string;
  status: TrainerStatus;
};

type TrainerForm = Omit<Trainer, "id">;

type SupabaseTrainerRow = {
  id: number | string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  specialization?: string | null;
  branch?: string | null;
  status?: string | null;
};

type SupabaseUserProfileRow = {
  gym_id?: number | string | null;
};

const branches = ["Noida", "Central", "Downtown", "West End"];
const statuses: TrainerStatus[] = ["Active", "Inactive"];
const filters: TrainerFilter[] = ["All", "Active", "Inactive"];

const emptyForm: TrainerForm = {
  fullName: "",
  phone: "",
  email: "",
  specialization: "",
  branch: branches[0],
  status: "Active",
};

function valueToString(value: string | number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

function normalizeStatus(value: string | null | undefined): TrainerStatus {
  return value === "Inactive" ? "Inactive" : "Active";
}

function mapSupabaseTrainer(row: SupabaseTrainerRow): Trainer {
  return {
    id: row.id,
    fullName: valueToString(row.full_name),
    phone: valueToString(row.phone),
    email: valueToString(row.email),
    specialization: valueToString(row.specialization),
    branch: valueToString(row.branch),
    status: normalizeStatus(row.status),
  };
}

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

export default function TrainersPageContent() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [gymId, setGymId] = useState<number | string | null>(null);
  const [loadingTrainers, setLoadingTrainers] = useState(true);
  const [trainersError, setTrainersError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<TrainerFilter>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState<number | string | null>(null);
  const [viewingTrainer, setViewingTrainer] = useState<Trainer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Trainer | null>(null);
  const [form, setForm] = useState<TrainerForm>(emptyForm);
  const [savingTrainer, setSavingTrainer] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deletingTrainer, setDeletingTrainer] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadTrainers = useCallback(async (resolvedGymId: number | string | null) => {
    setLoadingTrainers(true);
    setTrainersError("");

    if (!resolvedGymId) {
      setTrainers([]);
      setTrainersError("No gym is linked to this admin account.");
      setLoadingTrainers(false);
      return;
    }

    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .eq("gym_id", resolvedGymId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load trainers", error);
      setTrainers([]);
      setTrainersError("Failed to load trainers.");
      setLoadingTrainers(false);
      return;
    }

    setTrainers((data ?? []).map((trainer) => mapSupabaseTrainer(trainer as SupabaseTrainerRow)));
    setLoadingTrainers(false);
  }, []);

  useEffect(() => {
    let active = true;

    async function resolveAdminGymAndLoadTrainers() {
      setLoadingTrainers(true);
      setTrainersError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (userError || !user) {
        console.error("Failed to load logged-in admin user", userError);
        setTrainersError("Admin session not found.");
        setLoadingTrainers(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("gym_id")
        .eq("id", user.id)
        .single();

      if (!active) {
        return;
      }

      if (profileError || !profile) {
        console.error("Failed to load admin profile", profileError);
        setTrainersError("Admin profile not configured.");
        setLoadingTrainers(false);
        return;
      }

      const adminProfile = profile as SupabaseUserProfileRow;

      if (!adminProfile.gym_id) {
        setTrainersError("No gym is linked to this admin account.");
        setLoadingTrainers(false);
        return;
      }

      setGymId(adminProfile.gym_id);
      await loadTrainers(adminProfile.gym_id);
    }

    const timer = window.setTimeout(() => {
      resolveAdminGymAndLoadTrainers();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [loadTrainers]);

  const summary = useMemo(() => {
    return trainers.reduce(
      (totals, trainer) => {
        totals.total += 1;
        if (trainer.status === "Active") totals.active += 1;
        if (trainer.status === "Inactive") totals.inactive += 1;
        return totals;
      },
      { total: 0, active: 0, inactive: 0 },
    );
  }, [trainers]);

  const visibleTrainers = trainers.filter((trainer) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      trainer.fullName.toLowerCase().includes(search) ||
      trainer.phone.toLowerCase().includes(search) ||
      trainer.email.toLowerCase().includes(search) ||
      trainer.specialization.toLowerCase().includes(search);
    const matchesFilter = activeFilter === "All" || trainer.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  function updateForm(field: keyof TrainerForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openAddModal() {
    setEditingTrainerId(null);
    setForm(emptyForm);
    setSaveError("");
    setModalOpen(true);
  }

  function openEditModal(trainer: Trainer) {
    setEditingTrainerId(trainer.id);
    setForm({
      fullName: trainer.fullName,
      phone: trainer.phone,
      email: trainer.email,
      specialization: trainer.specialization,
      branch: trainer.branch || branches[0],
      status: trainer.status,
    });
    setSaveError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTrainerId(null);
    setForm(emptyForm);
    setSaveError("");
    setSavingTrainer(false);
  }

  async function saveTrainer() {
    if (!form.fullName.trim()) {
      setSaveError("Please enter trainer full name.");
      return;
    }

    if (!gymId) {
      setSaveError("No gym is linked to this admin account.");
      return;
    }

    setSavingTrainer(true);
    setSaveError("");

    const trainerPayload = {
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      specialization: form.specialization.trim(),
      branch: form.branch,
      status: form.status,
    };

    if (editingTrainerId) {
      const { error } = await supabase.from("trainers").update(trainerPayload).eq("id", editingTrainerId).eq("gym_id", gymId);

      if (error) {
        console.error("Failed to update trainer", error);
        setSaveError("Could not update trainer. Please check the details and try again.");
        setSavingTrainer(false);
        return;
      }

      await loadTrainers(gymId);
      closeModal();
      return;
    }

    const { error } = await supabase.from("trainers").insert({
      ...trainerPayload,
      gym_id: gymId,
    });

    if (error) {
      console.error("Failed to add trainer", error);
      setSaveError("Could not save trainer. Please check the details and try again.");
      setSavingTrainer(false);
      return;
    }

    await loadTrainers(gymId);
    closeModal();
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    if (!gymId) {
      setDeleteError("No gym is linked to this admin account.");
      return;
    }

    setDeletingTrainer(true);
    setDeleteError("");

    const { error } = await supabase.from("trainers").delete().eq("id", deleteTarget.id).eq("gym_id", gymId);

    if (error) {
      console.error("Failed to delete trainer", error);
      setDeleteError("Could not delete trainer. Please try again.");
      setDeletingTrainer(false);
      return;
    }

    await loadTrainers(gymId);
    setDeleteTarget(null);
    setDeletingTrainer(false);
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
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Trainers</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Trainers</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Manage trainers and gym staff details.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.22)] transition hover:bg-lime-300 sm:w-auto"
        >
          Add Trainer
        </button>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Trainers", value: summary.total },
          { label: "Active Trainers", value: summary.active },
          { label: "Inactive Trainers", value: summary.inactive },
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
              placeholder="Search by name, phone, email, or specialization"
              className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60"
            />
            <button type="button" onClick={applySearch} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] transition hover:bg-lime-300">
              Search
            </button>
            <button type="button" onClick={clearSearch} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-zinc-300 transition hover:border-lime-300/40 hover:text-lime-200">
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
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
              <tr className="border-b border-white/10">
                {["Full Name", "Phone", "Email", "Specialization", "Branch", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="pb-3 font-bold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {!loadingTrainers && !trainersError ? visibleTrainers.map((trainer) => (
                <tr key={trainer.id} className="text-zinc-300">
                  <td className="py-4 font-semibold text-white">{trainer.fullName}</td>
                  <td className="py-4">{trainer.phone || "-"}</td>
                  <td className="py-4">{trainer.email || "-"}</td>
                  <td className="py-4">{trainer.specialization || "-"}</td>
                  <td className="py-4">{trainer.branch || "-"}</td>
                  <td className="py-4"><StatusBadge status={trainer.status} /></td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => setViewingTrainer(trainer)} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-300 hover:text-lime-200">View</button>
                      <button type="button" onClick={() => openEditModal(trainer)} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-300 hover:text-lime-200">Edit</button>
                      <button type="button" onClick={() => { setDeleteError(""); setDeleteTarget(trainer); }} className="rounded-md border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs font-bold text-red-200">Delete</button>
                    </div>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>
          {loadingTrainers ? <p className="py-8 text-center text-sm font-semibold text-zinc-500">Loading trainers...</p> : null}
          {trainersError ? <p className="py-8 text-center text-sm font-semibold text-red-200">{trainersError}</p> : null}
          {!loadingTrainers && !trainersError && visibleTrainers.length === 0 ? <p className="py-8 text-center text-sm font-semibold text-zinc-500">No trainers found</p> : null}
        </div>
      </section>

      <div className="grid gap-3 md:hidden">
        {!loadingTrainers && !trainersError ? visibleTrainers.map((trainer) => (
          <article key={trainer.id} className="rounded-lg border border-white/10 bg-[#111713] p-4 shadow-2xl shadow-black/20">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-black text-white">{trainer.fullName}</h3>
                <p className="mt-1 text-sm text-zinc-400">{trainer.phone || "-"}</p>
                <p className="mt-1 truncate text-sm text-zinc-500">{trainer.email || "-"}</p>
              </div>
              <StatusBadge status={trainer.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Specialization</p><p className="mt-1 font-semibold text-white">{trainer.specialization || "-"}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Branch</p><p className="mt-1 font-semibold text-white">{trainer.branch || "-"}</p></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setViewingTrainer(trainer)} className="rounded-md border border-white/10 bg-white/[0.05] py-2 text-xs font-bold text-zinc-300">View</button>
              <button type="button" onClick={() => openEditModal(trainer)} className="rounded-md border border-white/10 bg-white/[0.05] py-2 text-xs font-bold text-zinc-300">Edit</button>
              <button type="button" onClick={() => { setDeleteError(""); setDeleteTarget(trainer); }} className="rounded-md border border-red-300/20 bg-red-300/10 py-2 text-xs font-bold text-red-200">Delete</button>
            </div>
          </article>
        )) : null}
        {loadingTrainers ? <p className="rounded-lg border border-white/10 bg-[#111713] p-5 text-center text-sm font-semibold text-zinc-500">Loading trainers...</p> : null}
        {trainersError ? <p className="rounded-lg border border-white/10 bg-[#111713] p-5 text-center text-sm font-semibold text-red-200">{trainersError}</p> : null}
        {!loadingTrainers && !trainersError && visibleTrainers.length === 0 ? <p className="rounded-lg border border-white/10 bg-[#111713] p-5 text-center text-sm font-semibold text-zinc-500">No trainers found</p> : null}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">{editingTrainerId ? "Edit Trainer" : "Add Trainer"}</h3>
                <p className="mt-1 text-sm text-zinc-400">Trainer records are saved to your gym workspace.</p>
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
            </div>
            {saveError ? <p className="mt-4 rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">{saveError}</p> : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} disabled={savingTrainer} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
              <button type="button" onClick={saveTrainer} disabled={savingTrainer} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] disabled:cursor-not-allowed disabled:opacity-70">
                {savingTrainer ? "Saving..." : "Save Trainer"}
              </button>
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
                ["Name", viewingTrainer.fullName],
                ["Phone", viewingTrainer.phone],
                ["Email", viewingTrainer.email],
                ["Specialization", viewingTrainer.specialization],
                ["Branch", viewingTrainer.branch],
                ["Status", viewingTrainer.status],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
                  <p className="mt-2 font-bold text-white">{value || "Not added"}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black">
            <h3 className="text-xl font-black text-white">Delete Trainer?</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">This will remove {deleteTarget.fullName} from the trainers database.</p>
            {deleteError ? <p className="mt-4 rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">{deleteError}</p> : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => { setDeleteTarget(null); setDeleteError(""); }} disabled={deletingTrainer} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={deletingTrainer} className="h-11 rounded-lg bg-red-400 px-5 text-sm font-black text-[#120707] disabled:cursor-not-allowed disabled:opacity-70">
                {deletingTrainer ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
