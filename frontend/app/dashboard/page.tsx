"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import StatCards from "@/components/StatCards";
import FileTypeStats from "@/components/FileTypeStats";
import FoldersGrid from "@/components/FoldersGrid";
import FilesTable from "@/components/FilesTable";
import StoragePanel from "@/components/StoragePanel";
import Loading from "@/components/Loading";
import { useUser } from "@/context/UserContext";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const { user, stats, files,storage, loading } = useUser();

  if (loading) return <Loading />;
  console.log("stats:", stats);
console.log("storage:", storage);

  if (!user || !stats) return <Loading/>;

  return (
    <div className="flex min-h-screen bg-slate-50/80">
      <Sidebar active={activeNav} setActive={setActiveNav} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} />

        <div className="flex flex-1">
          <main className="flex-1 overflow-y-hidden p-5 xl:p-6 space-y-5">
            <StatCards stats={stats} />

            <FileTypeStats types={stats?.typeStats} />

            {/* <FoldersGrid /> */}

            <FilesTable files={files} />
          </main>

          <aside className="w-72 xl:w-80 flex-shrink-0 overflow-y-auto p-5 xl:p-6 border-l border-slate-100 bg-slate-50/50 space-y-4 hidden lg:block">
            <StoragePanel stats={stats} storage={storage} />
          </aside>
        </div>
      </div>
    </div>
  );
}
