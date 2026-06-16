"use client";

import { useEffect, useMemo, useState } from "react";

const emptyMember = {
  full_name: "",
  email: "",
  phone: "",
  gender: "Male",
  age: "",
  address: "",
  membership_plan: "",
  start_date: new Date().toISOString().slice(0, 10),
  expiry_date: "",
  payment_status: "Paid"
};

function addMonths(dateString, months) {
  const date = new Date(dateString);
  date.setMonth(date.getMonth() + Number(months || 1));
  return date.toISOString().slice(0, 10);
}

export default function MemberForm({ initialValue, plans, onSubmit, loading }) {
  const [form, setForm] = useState({ ...emptyMember, ...(initialValue || {}) });

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.plan_name === form.membership_plan),
    [plans, form.membership_plan]
  );

  useEffect(() => {
    if (!form.membership_plan && plans.length) {
      setForm((current) => ({
        ...current,
        membership_plan: plans[0].plan_name,
        expiry_date: addMonths(current.start_date, plans[0].duration_months)
      }));
    }
  }, [plans, form.membership_plan]);

  useEffect(() => {
    if (selectedPlan && form.start_date) {
      setForm((current) => ({
        ...current,
        expiry_date: addMonths(current.start_date, selectedPlan.duration_months)
      }));
    }
  }, [selectedPlan, form.start_date]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      age: Number(form.age)
    });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Full Name
        <input name="full_name" value={form.full_name} onChange={updateField} required />
      </label>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={updateField} required />
      </label>
      <label>
        Phone
        <input name="phone" value={form.phone} onChange={updateField} required />
      </label>
      <label>
        Gender
        <select name="gender" value={form.gender} onChange={updateField}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Age
        <input name="age" type="number" min="12" max="100" value={form.age} onChange={updateField} required />
      </label>
      <label>
        Membership Plan
        <select name="membership_plan" value={form.membership_plan} onChange={updateField} required>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.plan_name}>
              {plan.plan_name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Start Date
        <input name="start_date" type="date" value={form.start_date} onChange={updateField} required />
      </label>
      <label>
        Expiry Date
        <input name="expiry_date" type="date" value={form.expiry_date} onChange={updateField} required />
      </label>
      <label>
        Payment Status
        <select name="payment_status" value={form.payment_status} onChange={updateField}>
          <option>Paid</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
      </label>
      <label className="span-2">
        Address
        <textarea name="address" value={form.address} onChange={updateField} rows="3" required />
      </label>
      <button className="primary-button span-2" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Member"}
      </button>
    </form>
  );
}
