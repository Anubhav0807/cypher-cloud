"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import StatCards from "@/components/StatCards";
import FileTypeStats from "@/components/FileTypeStats";
import FoldersGrid from "@/components/FoldersGrid";
import FilesTable from "@/components/FilesTable";
import StoragePanel from "@/components/StoragePanel";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div
      className="flex min-h-screen bg-slate-50/80"
      style={{ fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {/* ── Main area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          {/* ── Center content ──────────────────────────────── */}
          <main className="flex-1 overflow-y-auto p-5 xl:p-6 space-y-5">

            {/* Page heading */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black text-slate-800 tracking-tight">Dashboard</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saturday, Feb 21 · All systems operational
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-600">Quantum-Safe Active</span>
              </div>
            </div>

            {/* Stat cards */}
            <StatCards />

            {/* File type pill strip */}
            <FileTypeStats />

            {/* Folders */}
            <FoldersGrid />

            {/* Files table */}
            <FilesTable />
          </main>

          {/* ── Right panel ─────────────────────────────────── */}
          <aside className="w-72 xl:w-80 flex-shrink-0 overflow-y-auto p-5 xl:p-6 border-l border-slate-100 bg-slate-50/50 space-y-4 hidden lg:block">
            <StoragePanel />
          </aside>
        </div>
      </div>
    </div>
  );
}
