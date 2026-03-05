"use client";
import FilesTable from "@/components/FilesTable";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";
import React, { useState } from "react";

export default function page() {
  const [activeNav, setActiveNav] = useState("favorites");
  const {user,loading,files}=useUser();
  if(loading){
    return <Loading/>
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-visible">
      <Sidebar active={activeNav} setActive={setActiveNav} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} />
        <div className="flex flex-1 overflow-visible">
          {/* ── Center content ──────────────────────────────── */}
          <main className="flex-1 overflow-y-auto p-5 xl:p-6 space-y-5">
            <FilesTable files={files} />
          </main>
        </div>
      </div>
    </div>
  );
}
