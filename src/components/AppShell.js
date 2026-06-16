"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Dumbbell, LayoutDashboard, Menu, Users, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Members", icon: Users },
  { href: "/plans", label: "Plans", icon: Dumbbell }
];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <button className="mobile-menu glass-button" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <aside className={`sidebar glass-panel ${open ? "open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark">
            <Activity size={24} />
          </div>
          <div>
            <h1>GymPro</h1>
            <p>Smart Gym System</p>
          </div>
          <button className="close-menu" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <span>Premium Admin</span>
          <strong>Control every membership from one beautiful workspace.</strong>
        </div>
      </aside>

      <main className="content-area">{children}</main>
    </div>
  );
}
