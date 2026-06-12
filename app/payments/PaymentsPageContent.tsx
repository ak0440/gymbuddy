"use client";

import { useMemo, useState, type ReactNode } from "react";

type PaymentStatus = "Paid" | "Pending" | "Overdue";
type PaymentFilter = "All" | PaymentStatus | "This Month";
type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer";

type Payment = {
  id: number;
  memberName: string;
  phone: string;
  plan: string;
  amount: number;
  paymentDate: string;
  nextRenewalDate: string;
  paymentMode: PaymentMode;
  notes: string;
};

type PaymentForm = Omit<Payment, "id" | "amount"> & {
  amount: string;
};

const filters: PaymentFilter[] = ["All", "Paid", "Pending", "Overdue", "This Month"];
const plans = ["Annual", "Quarterly", "Monthly", "Strength Plus"];
const paymentModes: PaymentMode[] = ["Cash", "UPI", "Card", "Bank Transfer"];

const emptyForm: PaymentForm = {
  memberName: "",
  phone: "",
  plan: plans[0],
  amount: "",
  paymentDate: "",
  nextRenewalDate: "",
  paymentMode: paymentModes[0],
  notes: "",
};

const initialPayments: Payment[] = [
  {
    id: 1,
    memberName: "Amit",
    phone: "1234567890",
    plan: "Annual",
    amount: 18000,
    paymentDate: "2026-06-11",
    nextRenewalDate: "2027-06-10",
    paymentMode: "UPI",
    notes: "Annual plan payment received.",
  },
  {
    id: 2,
    memberName: "Riya Sharma",
    phone: "9876543210",
    plan: "Monthly",
    amount: 0,
    paymentDate: "",
    nextRenewalDate: "2026-06-18",
    paymentMode: "Cash",
    notes: "Payment pending at front desk.",
  },
  {
    id: 3,
    memberName: "Karan Mehta",
    phone: "9123456780",
    plan: "Quarterly",
    amount: 6500,
    paymentDate: "2026-05-01",
    nextRenewalDate: "2026-06-05",
    paymentMode: "Card",
    notes: "Renewal overdue.",
  },
];

function dateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getPaymentStatus(payment: Payment): PaymentStatus {
  if (!payment.paymentDate || payment.amount <= 0) {
    return "Pending";
  }

  const today = dateOnly(new Date());
  const renewalDate = dateOnly(new Date(`${payment.nextRenewalDate}T00:00:00`));

  if (renewalDate.getTime() < today.getTime()) {
    return "Overdue";
  }

  return "Paid";
}

function isThisMonth(dateValue: string) {
  if (!dateValue) {
    return false;
  }

  const date = new Date(`${dateValue}T00:00:00`);
  const today = new Date();
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
}

function isExpiringRenewal(dateValue: string) {
  if (!dateValue) {
    return false;
  }

  const today = dateOnly(new Date());
  const renewalDate = dateOnly(new Date(`${dateValue}T00:00:00`));
  const daysRemaining = Math.ceil((renewalDate.getTime() - today.getTime()) / 86400000);
  return daysRemaining >= 0 && daysRemaining <= 7;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusClasses(status: PaymentStatus) {
  return {
    Paid: "border-lime-300/30 bg-lime-300/12 text-lime-200",
    Pending: "border-amber-300/30 bg-amber-300/12 text-amber-200",
    Overdue: "border-red-300/25 bg-red-300/10 text-red-200",
  }[status];
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${statusClasses(status)}`}>{status}</span>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
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

export default function PaymentsPageContent() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<PaymentFilter>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [form, setForm] = useState<PaymentForm>(emptyForm);

  const summary = useMemo(() => {
    return payments.reduce(
      (totals, payment) => {
        const status = getPaymentStatus(payment);

        if (status === "Paid") {
          totals.totalRevenue += payment.amount;
        }

        if (status === "Paid" && isThisMonth(payment.paymentDate)) {
          totals.paidThisMonth += payment.amount;
        }

        if (status === "Pending" || status === "Overdue") {
          totals.pendingDues += payment.amount;
        }

        if (isExpiringRenewal(payment.nextRenewalDate)) {
          totals.expiringRenewals += 1;
        }

        return totals;
      },
      { totalRevenue: 0, paidThisMonth: 0, pendingDues: 0, expiringRenewals: 0 },
    );
  }, [payments]);

  const visiblePayments = payments.filter((payment) => {
    const search = searchTerm.trim().toLowerCase();
    const status = getPaymentStatus(payment);
    const matchesSearch =
      search.length === 0 ||
      payment.memberName.toLowerCase().includes(search) ||
      payment.phone.toLowerCase().includes(search);
    const matchesFilter =
      activeFilter === "All" ||
      status === activeFilter ||
      (activeFilter === "This Month" && isThisMonth(payment.paymentDate));

    return matchesSearch && matchesFilter;
  });

  function updateForm(field: keyof PaymentForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openRecordModal() {
    setEditingPaymentId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(payment: Payment) {
    setEditingPaymentId(payment.id);
    setForm({
      memberName: payment.memberName,
      phone: payment.phone,
      plan: payment.plan,
      amount: String(payment.amount),
      paymentDate: payment.paymentDate,
      nextRenewalDate: payment.nextRenewalDate,
      paymentMode: payment.paymentMode,
      notes: payment.notes,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingPaymentId(null);
    setForm(emptyForm);
  }

  function savePayment() {
    const amount = Number(form.amount);

    if (!form.memberName.trim() || !form.phone.trim() || !form.nextRenewalDate || Number.isNaN(amount) || amount < 0) {
      return;
    }

    const paymentPayload = {
      ...form,
      memberName: form.memberName.trim(),
      phone: form.phone.trim(),
      amount,
      notes: form.notes.trim(),
    };

    if (editingPaymentId) {
      setPayments((current) => current.map((payment) => (payment.id === editingPaymentId ? { id: payment.id, ...paymentPayload } : payment)));
    } else {
      setPayments((current) => [{ id: Date.now(), ...paymentPayload }, ...current]);
    }

    closeModal();
  }

  function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setPayments((current) => current.filter((payment) => payment.id !== deleteTarget.id));
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
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Payments</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Payments</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Track member payments, dues, renewals and revenue.</p>
        </div>
        <button
          type="button"
          onClick={openRecordModal}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] shadow-[0_0_24px_rgba(163,230,53,0.22)] transition hover:bg-lime-300 sm:w-auto"
        >
          Record Payment
        </button>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Revenue", value: formatCurrency(summary.totalRevenue) },
          { label: "Paid This Month", value: formatCurrency(summary.paidThisMonth) },
          { label: "Pending Dues", value: formatCurrency(summary.pendingDues) },
          { label: "Expiring Renewals", value: String(summary.expiringRenewals) },
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
              placeholder="Search by name or phone"
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
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
              <tr className="border-b border-white/10">
                {["Member Name", "Phone", "Plan", "Amount", "Payment Date", "Next Renewal Date", "Payment Mode", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="pb-3 font-bold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {visiblePayments.map((payment) => {
                const status = getPaymentStatus(payment);

                return (
                  <tr key={payment.id} className="text-zinc-300">
                    <td className="py-4 font-semibold text-white">{payment.memberName}</td>
                    <td className="py-4">{payment.phone}</td>
                    <td className="py-4">{payment.plan}</td>
                    <td className="py-4">{formatCurrency(payment.amount)}</td>
                    <td className="py-4">{payment.paymentDate || "Not paid"}</td>
                    <td className="py-4">{payment.nextRenewalDate}</td>
                    <td className="py-4">{payment.paymentMode}</td>
                    <td className="py-4"><StatusBadge status={status} /></td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setViewingPayment(payment)} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-300 hover:text-lime-200">View</button>
                        <button type="button" onClick={() => openEditModal(payment)} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-300 hover:text-lime-200">Edit</button>
                        <button type="button" onClick={() => setDeleteTarget(payment)} className="rounded-md border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs font-bold text-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visiblePayments.length === 0 ? <p className="py-8 text-center text-sm font-semibold text-zinc-500">No payments match the current search.</p> : null}
        </div>
      </section>

      <div className="grid gap-3 md:hidden">
        {visiblePayments.map((payment) => {
          const status = getPaymentStatus(payment);

          return (
            <article key={payment.id} className="rounded-lg border border-white/10 bg-[#111713] p-4 shadow-2xl shadow-black/20">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-white">{payment.memberName}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{payment.phone}</p>
                  <p className="mt-1 text-sm font-bold text-lime-200">{formatCurrency(payment.amount)}</p>
                </div>
                <StatusBadge status={status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Plan</p><p className="mt-1 font-semibold text-white">{payment.plan}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Mode</p><p className="mt-1 font-semibold text-white">{payment.paymentMode}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Paid On</p><p className="mt-1 font-semibold text-white">{payment.paymentDate || "Not paid"}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Renewal</p><p className="mt-1 font-semibold text-white">{payment.nextRenewalDate}</p></div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setViewingPayment(payment)} className="rounded-md border border-white/10 bg-white/[0.05] py-2 text-xs font-bold text-zinc-300">View</button>
                <button type="button" onClick={() => openEditModal(payment)} className="rounded-md border border-white/10 bg-white/[0.05] py-2 text-xs font-bold text-zinc-300">Edit</button>
                <button type="button" onClick={() => setDeleteTarget(payment)} className="rounded-md border border-red-300/20 bg-red-300/10 py-2 text-xs font-bold text-red-200">Delete</button>
              </div>
            </article>
          );
        })}
        {visiblePayments.length === 0 ? <p className="rounded-lg border border-white/10 bg-[#111713] p-5 text-center text-sm font-semibold text-zinc-500">No payments match the current search.</p> : null}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">{editingPaymentId ? "Edit Payment" : "Record Payment"}</h3>
                <p className="mt-1 text-sm text-zinc-400">Status is calculated from amount, payment date, and renewal date.</p>
              </div>
              <button type="button" onClick={closeModal} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300">x</button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Member Name"><input value={form.memberName} onChange={(event) => updateForm("memberName", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Phone"><input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Membership Plan"><select value={form.plan} onChange={(event) => updateForm("plan", event.target.value)} className={textInputClass()}>{plans.map((plan) => <option key={plan}>{plan}</option>)}</select></Field>
              <Field label="Amount"><input type="number" min="0" value={form.amount} onChange={(event) => updateForm("amount", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Payment Date"><input type="date" value={form.paymentDate} onChange={(event) => updateForm("paymentDate", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Next Renewal Date"><input type="date" value={form.nextRenewalDate} onChange={(event) => updateForm("nextRenewalDate", event.target.value)} className={textInputClass()} /></Field>
              <Field label="Payment Mode"><select value={form.paymentMode} onChange={(event) => updateForm("paymentMode", event.target.value)} className={textInputClass()}>{paymentModes.map((mode) => <option key={mode}>{mode}</option>)}</select></Field>
              <Field label="Notes"><input value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} className={textInputClass()} /></Field>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white">Cancel</button>
              <button type="button" onClick={savePayment} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b]">Save Payment</button>
            </div>
          </div>
        </div>
      ) : null}

      {viewingPayment ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Payment Details</p>
                <h3 className="mt-2 text-2xl font-black text-white">{viewingPayment.memberName}</h3>
              </div>
              <button type="button" onClick={() => setViewingPayment(null)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300">x</button>
            </div>
            <div className="mt-6 grid gap-4">
              {[
                ["Phone", viewingPayment.phone],
                ["Plan", viewingPayment.plan],
                ["Amount", formatCurrency(viewingPayment.amount)],
                ["Payment Mode", viewingPayment.paymentMode],
                ["Payment Date", viewingPayment.paymentDate || "Not paid"],
                ["Next Renewal Date", viewingPayment.nextRenewalDate],
                ["Status", getPaymentStatus(viewingPayment)],
                ["Notes", viewingPayment.notes || "No notes"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
                  <p className="mt-2 font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black">
            <h3 className="text-xl font-black text-white">Delete Payment?</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">This will remove the local payment record for {deleteTarget.memberName}.</p>
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
