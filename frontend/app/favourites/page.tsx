"use client";
import Navbar from "@/components/favourites-page/Navbar";
import FavouritesTable from "@/components/favourites-page/FavouritesTable";
import Loading from "@/components/Loading";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function page() {
  const [activeNav, setActiveNav] = useState("favourites");
  const [favouriteFiles, setFavouriteFiles] = useState([]);
  const { user, loading, files, refreshDashboard } = useUser();
  const searchParams = useSearchParams();
  const fetchFiles = async () => {
    try {
      const res = await api.get("/api/file/favourite");
      console.log("Favourites", res.data);
      setFavouriteFiles(res.data.files);
    } catch (err) {
      console.error("Failed to fetch my files", err);
    }
  };

  // 👇 CALL API WHEN PAGE LOADS
  useEffect(() => {
    fetchFiles();
  }, [refreshDashboard]);
  const query = searchParams.get("search")?.toLowerCase() || "";

  const filteredFiles = query
    ? favouriteFiles.filter((file: any) => file.name?.toLowerCase().includes(query))
    : favouriteFiles;
  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-visible">
      <Sidebar active={activeNav} setActive={setActiveNav} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} />
        <div className="flex flex-1 overflow-visible">
          {/* ── Center content ──────────────────────────────── */}
          <main className="flex-1 overflow-y-auto p-5 xl:p-6 space-y-5">
            <FavouritesTable files={filteredFiles} />
          </main>
        </div>
      </div>
    </div>
  );
}
