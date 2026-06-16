"use client";

import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import Modal from "@/components/Modal";
import PlanForm from "@/components/PlanForm";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "success", message: "" });

  async function loadPlans() {
    try {
      const result = await api.getPlans();
      setPlans(result);
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  async function savePlan(payload) {
    setLoading(true);
    try {
      if (modal?.type === "edit") {
        await api.updatePlan(modal.plan.id, payload);
        setNotice({ type: "success", message: "Plan updated successfully" });
      } else {
        await api.createPlan(payload);
        setNotice({ type: "success", message: "Plan added successfully" });
      }
      setModal(null);
      await loadPlans();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function deletePlan(id) {
    if (!window.confirm("Delete this membership plan?")) return;
    try {
      await api.deletePlan(id);
      setNotice({ type: "success", message: "Plan deleted successfully" });
      await loadPlans();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  }

  return (
    <AppShell>
      <Toast type={notice.type} message={notice.message} />

      <header className="page-header">
        <div>
          <span className="eyebrow">Membership Plans</span>
          <h2>Plans</h2>
        </div>
        <button className="primary-button compact" onClick={() => setModal({ type: "add" })}>
          <Plus size={18} />
          Add Plan
        </button>
      </header>

      <section className="plan-grid">
        {plans.map((plan) => (
          <article className="plan-card glass-panel" key={plan.id}>
            <div className="plan-topline">
              <span>{plan.duration_months} Month{plan.duration_months > 1 ? "s" : ""}</span>
              <strong>{formatCurrency(plan.price)}</strong>
            </div>
            <h3>{plan.plan_name}</h3>
            <p>{plan.description}</p>
            <div className="plan-actions">
              <button className="icon-button" onClick={() => setModal({ type: "edit", plan })} aria-label="Edit plan">
                <Edit3 size={16} />
              </button>
              <button className="icon-button danger" onClick={() => deletePlan(plan.id)} aria-label="Delete plan">
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </section>

      {plans.length === 0 ? <p className="empty-state glass-panel">No plans found. Add a plan to begin.</p> : null}

      {modal?.type === "add" ? (
        <Modal title="Add Plan" onClose={() => setModal(null)}>
          <PlanForm onSubmit={savePlan} loading={loading} />
        </Modal>
      ) : null}

      {modal?.type === "edit" ? (
        <Modal title="Edit Plan" onClose={() => setModal(null)}>
          <PlanForm initialValue={modal.plan} onSubmit={savePlan} loading={loading} />
        </Modal>
      ) : null}
    </AppShell>
  );
}
