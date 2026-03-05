"use client";
import FilesTable from "@/components/FilesTable";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";
import { files } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function page() {
  const [activeNav, setActiveNav] = useState("files");
  const { user, files, loading } = useUser();
  const searchParams = useSearchParams();
  const query = searchParams.get("search")?.toLowerCase() || "";
  if (loading) {
    return <Loading />;
  }

  const filteredFiles = query
    ? files.filter((file: any) => file.name?.toLowerCase().includes(query))
    : files;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar active={activeNav} setActive={setActiveNav} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} />
        <div className="flex flex-1 overflow-hidden">
          {/* ── Center content ──────────────────────────────── */}
          <main className="flex-1 overflow-y-auto p-5 xl:p-6 space-y-5">
            <FilesTable files={filteredFiles} />
          </main>
        </div>
      </div>
    </div>
  );
}
