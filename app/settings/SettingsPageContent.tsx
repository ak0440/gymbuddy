"use client";

import { useState, type ReactNode } from "react";

type SettingsTab = "Gym Profile" | "Branches" | "Membership Plans" | "Trainers" | "Payment Modes" | "App Branding" | "Notifications";

type GymProfile = {
  gymName: string;
  ownerName: string;
  contactNumber: string;
  email: string;
  website: string;
  address: string;
  description: string;
};

type Branch = {
  id: number;
  branchName: string;
  address: string;
  contactNumber: string;
  managerName: string;
};

type MembershipPlan = {
  id: number;
  planName: string;
  durationDays: string;
  price: string;
  description: string;
};

type TrainerSetting = {
  id: number;
  name: string;
  phone: string;
  email: string;
  specialization: string;
};

type PaymentModeSetting = {
  id: number;
  name: string;
};

type Branding = {
  appName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
};

type Notifications = {
  membershipExpiryAlerts: boolean;
  paymentReminders: boolean;
  newMemberNotifications: boolean;
  trainerNotifications: boolean;
};

const tabs: SettingsTab[] = ["Gym Profile", "Branches", "Membership Plans", "Trainers", "Payment Modes", "App Branding", "Notifications"];

const defaultGymProfile: GymProfile = {
  gymName: "GymBuddy Fitness Club",
  ownerName: "Amit",
  contactNumber: "1234567890",
  email: "hello@gymbuddy.local",
  website: "https://gymbuddy.local",
  address: "Noida, Uttar Pradesh",
  description: "Modern fitness space for members, trainers, renewals, attendance, and gym operations.",
};

const emptyBranch: Omit<Branch, "id"> = {
  branchName: "",
  address: "",
  contactNumber: "",
  managerName: "",
};

const emptyPlan: Omit<MembershipPlan, "id"> = {
  planName: "",
  durationDays: "",
  price: "",
  description: "",
};

const emptyTrainer: Omit<TrainerSetting, "id"> = {
  name: "",
  phone: "",
  email: "",
  specialization: "",
};

const emptyPaymentMode: Omit<PaymentModeSetting, "id"> = {
  name: "",
};

const defaultBranding: Branding = {
  appName: "GymBuddy",
  tagline: "Manage smarter. Train better. Grow faster.",
  primaryColor: "#a3e635",
  secondaryColor: "#111713",
};

function inputClass() {
  return "h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60";
}

function textareaClass() {
  return "min-h-24 w-full rounded-lg border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60";
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6">
      <h3 className="text-xl font-black text-white">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ActionButton({ children, onClick, tone = "neutral" }: { children: ReactNode; onClick: () => void; tone?: "primary" | "danger" | "neutral" }) {
  const className =
    tone === "primary"
      ? "bg-lime-400 text-[#07100b] hover:bg-lime-300"
      : tone === "danger"
        ? "border border-red-300/20 bg-red-300/10 text-red-200 hover:bg-red-300/15"
        : "border border-white/10 bg-white/[0.05] text-zinc-300 hover:border-lime-300/40 hover:text-lime-200";

  return (
    <button type="button" onClick={onClick} className={`h-10 rounded-lg px-4 text-sm font-bold transition ${className}`}>
      {children}
    </button>
  );
}

export default function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Gym Profile");
  const [gymProfile, setGymProfile] = useState(defaultGymProfile);
  const [savedGymProfile, setSavedGymProfile] = useState(defaultGymProfile);
  const [branches, setBranches] = useState<Branch[]>([
    { id: 1, branchName: "Noida", address: "Sector 62, Noida", contactNumber: "1234567890", managerName: "Amit" },
  ]);
  const [branchForm, setBranchForm] = useState(emptyBranch);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([
    { id: 1, planName: "Monthly", durationDays: "30", price: "2000", description: "Basic monthly gym access." },
    { id: 2, planName: "Quarterly", durationDays: "90", price: "5500", description: "Three month membership plan." },
    { id: 3, planName: "Half-Yearly", durationDays: "180", price: "10000", description: "Six month fitness plan." },
    { id: 4, planName: "Annual", durationDays: "365", price: "18000", description: "Full year membership plan." },
  ]);
  const [planForm, setPlanForm] = useState(emptyPlan);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [trainers, setTrainers] = useState<TrainerSetting[]>([
    { id: 1, name: "Animesh", phone: "9876543210", email: "animesh@gymbuddy.local", specialization: "Strength Training" },
  ]);
  const [trainerForm, setTrainerForm] = useState(emptyTrainer);
  const [editingTrainerId, setEditingTrainerId] = useState<number | null>(null);
  const [paymentModes, setPaymentModes] = useState<PaymentModeSetting[]>([
    { id: 1, name: "Cash" },
    { id: 2, name: "UPI" },
    { id: 3, name: "Credit Card" },
    { id: 4, name: "Debit Card" },
    { id: 5, name: "Bank Transfer" },
  ]);
  const [paymentModeForm, setPaymentModeForm] = useState(emptyPaymentMode);
  const [editingPaymentModeId, setEditingPaymentModeId] = useState<number | null>(null);
  const [branding, setBranding] = useState(defaultBranding);
  const [notifications, setNotifications] = useState<Notifications>({
    membershipExpiryAlerts: true,
    paymentReminders: true,
    newMemberNotifications: true,
    trainerNotifications: false,
  });

  function saveBranch() {
    if (!branchForm.branchName.trim() || !branchForm.contactNumber.trim()) return;

    if (editingBranchId) {
      setBranches((current) => current.map((branch) => (branch.id === editingBranchId ? { id: branch.id, ...branchForm } : branch)));
    } else {
      setBranches((current) => [{ id: Date.now(), ...branchForm }, ...current]);
    }

    setBranchForm(emptyBranch);
    setEditingBranchId(null);
  }

  function savePlan() {
    if (!planForm.planName.trim() || !planForm.durationDays.trim() || !planForm.price.trim()) return;

    if (editingPlanId) {
      setPlans((current) => current.map((plan) => (plan.id === editingPlanId ? { id: plan.id, ...planForm } : plan)));
    } else {
      setPlans((current) => [{ id: Date.now(), ...planForm }, ...current]);
    }

    setPlanForm(emptyPlan);
    setEditingPlanId(null);
  }

  function saveTrainer() {
    if (!trainerForm.name.trim() || !trainerForm.phone.trim()) return;

    if (editingTrainerId) {
      setTrainers((current) => current.map((trainer) => (trainer.id === editingTrainerId ? { id: trainer.id, ...trainerForm } : trainer)));
    } else {
      setTrainers((current) => [{ id: Date.now(), ...trainerForm }, ...current]);
    }

    setTrainerForm(emptyTrainer);
    setEditingTrainerId(null);
  }

  function savePaymentMode() {
    if (!paymentModeForm.name.trim()) return;

    if (editingPaymentModeId) {
      setPaymentModes((current) => current.map((mode) => (mode.id === editingPaymentModeId ? { id: mode.id, ...paymentModeForm } : mode)));
    } else {
      setPaymentModes((current) => [{ id: Date.now(), ...paymentModeForm }, ...current]);
    }

    setPaymentModeForm(emptyPaymentMode);
    setEditingPaymentModeId(null);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Settings</p>
        <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Settings</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Configure gym profile, plans, trainers, payment modes, branding, and alerts.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-white/10 bg-[#111713] p-2 shadow-2xl shadow-black/20 lg:sticky lg:top-5 lg:self-start">
          <div className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`h-11 shrink-0 rounded-lg px-4 text-left text-sm font-bold transition lg:w-full ${
                  activeTab === tab ? "bg-lime-400 text-[#07100b]" : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          {activeTab === "Gym Profile" ? (
            <SectionCard title="Gym Profile">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Gym Name"><input value={gymProfile.gymName} onChange={(event) => setGymProfile({ ...gymProfile, gymName: event.target.value })} className={inputClass()} /></Field>
                <Field label="Owner Name"><input value={gymProfile.ownerName} onChange={(event) => setGymProfile({ ...gymProfile, ownerName: event.target.value })} className={inputClass()} /></Field>
                <Field label="Contact Number"><input value={gymProfile.contactNumber} onChange={(event) => setGymProfile({ ...gymProfile, contactNumber: event.target.value })} className={inputClass()} /></Field>
                <Field label="Email Address"><input type="email" value={gymProfile.email} onChange={(event) => setGymProfile({ ...gymProfile, email: event.target.value })} className={inputClass()} /></Field>
                <Field label="Website"><input value={gymProfile.website} onChange={(event) => setGymProfile({ ...gymProfile, website: event.target.value })} className={inputClass()} /></Field>
                <Field label="Address"><input value={gymProfile.address} onChange={(event) => setGymProfile({ ...gymProfile, address: event.target.value })} className={inputClass()} /></Field>
                <div className="sm:col-span-2">
                  <Field label="Description"><textarea value={gymProfile.description} onChange={(event) => setGymProfile({ ...gymProfile, description: event.target.value })} className={textareaClass()} /></Field>
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <ActionButton onClick={() => setGymProfile(savedGymProfile)}>Reset</ActionButton>
                <ActionButton tone="primary" onClick={() => setSavedGymProfile(gymProfile)}>Save Changes</ActionButton>
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "Branches" ? (
            <SectionCard title="Branches">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <input placeholder="Branch Name" value={branchForm.branchName} onChange={(event) => setBranchForm({ ...branchForm, branchName: event.target.value })} className={inputClass()} />
                <input placeholder="Address" value={branchForm.address} onChange={(event) => setBranchForm({ ...branchForm, address: event.target.value })} className={inputClass()} />
                <input placeholder="Contact Number" value={branchForm.contactNumber} onChange={(event) => setBranchForm({ ...branchForm, contactNumber: event.target.value })} className={inputClass()} />
                <input placeholder="Manager Name" value={branchForm.managerName} onChange={(event) => setBranchForm({ ...branchForm, managerName: event.target.value })} className={inputClass()} />
              </div>
              <div className="mt-4 flex justify-end">
                <ActionButton tone="primary" onClick={saveBranch}>{editingBranchId ? "Update Branch" : "Add Branch"}</ActionButton>
              </div>
              <div className="mt-5 grid gap-3">
                {branches.map((branch) => (
                  <div key={branch.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-zinc-300 md:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="min-w-0">
                      <p className="font-black text-white">{branch.branchName}</p>
                      <p className="mt-1 break-words">{branch.address}</p>
                      <p className="mt-1">Manager: {branch.managerName} | {branch.contactNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <ActionButton onClick={() => { setEditingBranchId(branch.id); setBranchForm({ branchName: branch.branchName, address: branch.address, contactNumber: branch.contactNumber, managerName: branch.managerName }); }}>Edit</ActionButton>
                      <ActionButton tone="danger" onClick={() => setBranches((current) => current.filter((item) => item.id !== branch.id))}>Delete</ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "Membership Plans" ? (
            <SectionCard title="Membership Plans">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <input placeholder="Plan Name" value={planForm.planName} onChange={(event) => setPlanForm({ ...planForm, planName: event.target.value })} className={inputClass()} />
                <input type="number" min="1" placeholder="Duration (days)" value={planForm.durationDays} onChange={(event) => setPlanForm({ ...planForm, durationDays: event.target.value })} className={inputClass()} />
                <input type="number" min="0" placeholder="Price" value={planForm.price} onChange={(event) => setPlanForm({ ...planForm, price: event.target.value })} className={inputClass()} />
                <input placeholder="Description" value={planForm.description} onChange={(event) => setPlanForm({ ...planForm, description: event.target.value })} className={inputClass()} />
              </div>
              <div className="mt-4 flex justify-end">
                <ActionButton tone="primary" onClick={savePlan}>{editingPlanId ? "Update Plan" : "Add Plan"}</ActionButton>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {plans.map((plan) => (
                  <div key={plan.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-black text-white">{plan.planName}</p>
                        <p className="mt-1 text-sm text-zinc-400">{plan.durationDays} days | Rs. {plan.price}</p>
                        <p className="mt-2 text-sm leading-6 text-zinc-300">{plan.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <ActionButton onClick={() => { setEditingPlanId(plan.id); setPlanForm({ planName: plan.planName, durationDays: plan.durationDays, price: plan.price, description: plan.description }); }}>Edit</ActionButton>
                      <ActionButton tone="danger" onClick={() => setPlans((current) => current.filter((item) => item.id !== plan.id))}>Delete</ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "Trainers" ? (
            <SectionCard title="Trainers">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <input placeholder="Name" value={trainerForm.name} onChange={(event) => setTrainerForm({ ...trainerForm, name: event.target.value })} className={inputClass()} />
                <input placeholder="Phone" value={trainerForm.phone} onChange={(event) => setTrainerForm({ ...trainerForm, phone: event.target.value })} className={inputClass()} />
                <input type="email" placeholder="Email" value={trainerForm.email} onChange={(event) => setTrainerForm({ ...trainerForm, email: event.target.value })} className={inputClass()} />
                <input placeholder="Specialization" value={trainerForm.specialization} onChange={(event) => setTrainerForm({ ...trainerForm, specialization: event.target.value })} className={inputClass()} />
              </div>
              <div className="mt-4 flex justify-end">
                <ActionButton tone="primary" onClick={saveTrainer}>{editingTrainerId ? "Update Trainer" : "Add Trainer"}</ActionButton>
              </div>
              <div className="mt-5 grid gap-3">
                {trainers.map((trainer) => (
                  <div key={trainer.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-zinc-300 md:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="min-w-0">
                      <p className="font-black text-white">{trainer.name}</p>
                      <p className="mt-1 break-words">{trainer.email} | {trainer.phone}</p>
                      <p className="mt-1 text-lime-200">{trainer.specialization}</p>
                    </div>
                    <div className="flex gap-2">
                      <ActionButton onClick={() => { setEditingTrainerId(trainer.id); setTrainerForm({ name: trainer.name, phone: trainer.phone, email: trainer.email, specialization: trainer.specialization }); }}>Edit</ActionButton>
                      <ActionButton tone="danger" onClick={() => setTrainers((current) => current.filter((item) => item.id !== trainer.id))}>Delete</ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "Payment Modes" ? (
            <SectionCard title="Payment Modes">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input placeholder="Payment Mode" value={paymentModeForm.name} onChange={(event) => setPaymentModeForm({ name: event.target.value })} className={inputClass()} />
                <ActionButton tone="primary" onClick={savePaymentMode}>{editingPaymentModeId ? "Update" : "Add"}</ActionButton>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {paymentModes.map((mode) => (
                  <div key={mode.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <p className="font-bold text-white">{mode.name}</p>
                    <div className="flex gap-2">
                      <ActionButton onClick={() => { setEditingPaymentModeId(mode.id); setPaymentModeForm({ name: mode.name }); }}>Edit</ActionButton>
                      <ActionButton tone="danger" onClick={() => setPaymentModes((current) => current.filter((item) => item.id !== mode.id))}>Delete</ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "App Branding" ? (
            <SectionCard title="App Branding">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="App Name"><input value={branding.appName} onChange={(event) => setBranding({ ...branding, appName: event.target.value })} className={inputClass()} /></Field>
                  <Field label="Tagline"><input value={branding.tagline} onChange={(event) => setBranding({ ...branding, tagline: event.target.value })} className={inputClass()} /></Field>
                  <Field label="Primary Color"><input type="color" value={branding.primaryColor} onChange={(event) => setBranding({ ...branding, primaryColor: event.target.value })} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 p-1" /></Field>
                  <Field label="Secondary Color"><input type="color" value={branding.secondaryColor} onChange={(event) => setBranding({ ...branding, secondaryColor: event.target.value })} className="h-11 w-full rounded-lg border border-white/10 bg-black/25 p-1" /></Field>
                  <div className="sm:col-span-2 rounded-lg border border-dashed border-white/15 bg-black/20 p-5 text-center">
                    <p className="text-sm font-bold text-white">Logo Upload Placeholder</p>
                    <p className="mt-1 text-sm text-zinc-500">File storage will be connected later.</p>
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 p-5" style={{ backgroundColor: branding.secondaryColor }}>
                  <div className="grid h-14 w-14 place-items-center rounded-lg text-xl font-black" style={{ backgroundColor: branding.primaryColor, color: "#07100b" }}>
                    {branding.appName.slice(0, 1) || "G"}
                  </div>
                  <p className="mt-5 text-2xl font-black text-white">{branding.appName}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{branding.tagline}</p>
                  <button type="button" className="mt-5 h-10 rounded-lg px-4 text-sm font-black" style={{ backgroundColor: branding.primaryColor, color: "#07100b" }}>Preview Button</button>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "Notifications" ? (
            <SectionCard title="Notifications">
              <div className="grid gap-3">
                {[
                  ["membershipExpiryAlerts", "Membership Expiry Alerts"],
                  ["paymentReminders", "Payment Reminders"],
                  ["newMemberNotifications", "New Member Notifications"],
                  ["trainerNotifications", "Trainer Notifications"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setNotifications((current) => ({ ...current, [key]: !current[key as keyof Notifications] }))}
                    className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-left"
                  >
                    <span className="font-bold text-white">{label}</span>
                    <span className={`flex h-7 w-12 items-center rounded-full p-1 transition ${notifications[key as keyof Notifications] ? "bg-lime-400" : "bg-zinc-700"}`}>
                      <span className={`h-5 w-5 rounded-full bg-[#07100b] transition ${notifications[key as keyof Notifications] ? "translate-x-5" : ""}`} />
                    </span>
                  </button>
                ))}
              </div>
            </SectionCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
