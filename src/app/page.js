"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { CalendarClock, CreditCard, Plus, TrendingUp, Users, Zap } from "lucide-react";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";

const chartColors = ["#8b5cf6", "#06b6d4", "#22c55e", "#f97316", "#ec4899"];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Total Members",
        value: stats?.totalMembers ?? 0,
        icon: Users,
        tone: "violet"
      },
      {
        label: "Active Plans",
        value: stats?.activePlans ?? 0,
        icon: Zap,
        tone: "cyan"
      },
      {
        label: "Revenue",
        value: formatCurrency(stats?.totalRevenue ?? 0),
        icon: CreditCard,
        tone: "green"
      },
      {
        label: "Expired Plans",
        value: stats?.expiredMemberships ?? 0,
        icon: CalendarClock,
        tone: "orange"
      }
    ],
    [stats]
  );

  return (
    <AppShell>
      <Toast type="error" message={error} />

      <section className="hero-banner">
        <div>
          <span className="eyebrow">GymPro Command Center</span>
          <h2>Welcome to the Gym Community</h2>
          <p>Track members, plans, and renewals from a premium management dashboard.</p>
        </div>
        <div className="hero-orbit">
          <TrendingUp size={52} />
          <strong>{stats ? `${stats.activeMembers} Active` : "Loading"}</strong>
          <span>Memberships</span>
        </div>
      </section>

      <section className="stats-grid">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="quick-actions">
        <Link className="action-button" href="/members?new=true">
          <Plus size={18} />
          Add Member
        </Link>
        <Link className="action-button secondary" href="/members">
          <Users size={18} />
          View Members
        </Link>
        <Link className="action-button warm" href="/plans">
          <Zap size={18} />
          Membership Plans
        </Link>
      </section>

      <section className="widget-grid">
        <article className="glass-panel widget-card">
          <h3>Dashboard Widgets</h3>
          <div className="mini-stat-row">
            <span>Today's New Members</span>
            <strong>{stats?.todaysNewMembers ?? 0}</strong>
          </div>
          <div className="mini-stat-row">
            <span>Expiring Memberships</span>
            <strong>{stats?.expiringMemberships ?? 0}</strong>
          </div>
          <div className="mini-stat-row">
            <span>Total Revenue</span>
            <strong>{formatCurrency(stats?.totalRevenue ?? 0)}</strong>
          </div>
          <div className="mini-stat-row">
            <span>Active Memberships</span>
            <strong>{stats?.activeMembers ?? 0}</strong>
          </div>
        </article>

        <article className="glass-panel chart-card wide">
          <h3>Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats?.revenueOverview || []}>
              <defs>
                <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ background: "#10172a", border: "1px solid rgba(255,255,255,0.14)" }} />
              <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#revenueGlow)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </article>

        <article className="glass-panel chart-card">
          <h3>Membership Statistics</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stats?.membershipStatistics || []}
                dataKey="members"
                nameKey="name"
                innerRadius={58}
                outerRadius={94}
                paddingAngle={5}
              >
                {(stats?.membershipStatistics || []).map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#10172a", border: "1px solid rgba(255,255,255,0.14)" }} />
            </PieChart>
          </ResponsiveContainer>
        </article>

        <article className="glass-panel chart-card">
          <h3>Members by Plan</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats?.membershipStatistics || []}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ background: "#10172a", border: "1px solid rgba(255,255,255,0.14)" }} />
              <Bar dataKey="members" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="glass-panel widget-card recent-card">
          <h3>Recent Registrations</h3>
          <div className="recent-list">
            {(stats?.recentRegistrations || []).map((member) => (
              <div className="recent-item" key={member.id}>
                <div>
                  <strong>{member.full_name}</strong>
                  <span>{member.membership_plan}</span>
                </div>
                <small>{formatDate(member.created_at)}</small>
              </div>
            ))}
            {stats && stats.recentRegistrations.length === 0 ? <p className="muted">No recent registrations yet.</p> : null}
          </div>
        </article>
      </section>
    </AppShell>
  );
}
