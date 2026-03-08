"use client";
import FilesTable from "@/components/FilesTable";
import Loading from "@/components/Loading";
import Navbar from "@/components/shared-page/Navbar";

import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const [activeNav, setActiveNav] = useState("shared");
  const [sharedFiles, setSharedFiles] = useState([]);
  const { user, files, loading,refreshDashboard } = useUser();
  const searchParams = useSearchParams();
  const fetchFiles = async () => {
      try {
        const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file/shared`,
      {
        cache: "no-store",
        credentials: "include",
      }
    );
       const data= await res.json()
        console.log("Recycled",data);
        setSharedFiles(data.files);
      } catch (err) {
        console.error("Failed to fetch my files", err);
      }
    };
  
    // 👇 CALL API WHEN PAGE LOADS
    useEffect(() => {
      fetchFiles();
    }, [refreshDashboard]);

    if (loading) {
      return <Loading />;
    }
  
  const query = searchParams.get("search")?.toLowerCase() || "";

  if (loading) {
    return <Loading />;
  }

  const filteredFiles = query
    ? sharedFiles.filter((file: any) =>
        file.name?.toLowerCase().includes(query),
      )
    : sharedFiles;

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
