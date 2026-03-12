"use client";

import FilesTable from "@/components/FilesTable";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [activeNav, setActiveNav] = useState("files");
  const [allFiles, setAllFiles] = useState<any[]>([]);

  const { user, loading, refreshDashboard } = useUser();
  const searchParams = useSearchParams();

  const fetchFiles = async () => {
    try {
      const res = await api.get("/api/file/mine");
      console.log("Mine", res.data);
      setAllFiles(res.data.files);

    } catch (err: any) {
      if (err.response?.status === 401) {
        router.replace("/sign-in");
      } else {
        console.error("Failed to fetch my files", err);
      }
    }
  };

  // 👇 CALL API WHEN PAGE LOADS
  useEffect(() => {
    fetchFiles();
  }, [refreshDashboard]);

  const query = searchParams.get("search")?.toLowerCase() || "";

  if (loading) {
    return <Loading />;
  }

  const filteredFiles = query
    ? allFiles.filter((file: any) =>
      file.name?.toLowerCase().includes(query)
    )
    : allFiles;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar active={activeNav} setActive={setActiveNav} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} />

        <div className="flex flex-1 overflow-hidden">

          <main className="flex-1 overflow-y-auto p-5 xl:p-6 space-y-5">
            <FilesTable files={filteredFiles} search={query} />
          </main>

        </div>
      </div>
    </div>
  );
}