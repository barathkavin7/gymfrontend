"use client";

import { useState } from "react";

const emptyPlan = {
  plan_name: "",
  duration_months: 1,
  price: "",
  description: ""
};

export default function PlanForm({ initialValue, onSubmit, loading }) {
  const [form, setForm] = useState({ ...emptyPlan, ...(initialValue || {}) });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      duration_months: Number(form.duration_months),
      price: Number(form.price)
    });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Plan Name
        <input name="plan_name" value={form.plan_name} onChange={updateField} required />
      </label>
      <label>
        Duration Months
        <input
          name="duration_months"
          type="number"
          min="1"
          max="60"
          value={form.duration_months}
          onChange={updateField}
          required
        />
      </label>
      <label>
        Price
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={updateField} required />
      </label>
      <label className="span-2">
        Description
        <textarea name="description" value={form.description} onChange={updateField} rows="4" required />
      </label>
      <button className="primary-button span-2" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Plan"}
      </button>
    </form>
  );
}
