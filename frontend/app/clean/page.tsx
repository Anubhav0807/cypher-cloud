"use client";

import FilesTable from "@/components/FilesTable";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function Page() {
  const [activeNav, setActiveNav] = useState("clean");
  const [showFilesTable, setShowFilesTable] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshDashboard } = useUser();
  // ✅ Correct useEffect (not nested)
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/file/mine");
        setFiles(res.data.files ?? []);
      } catch (err: any) {
        console.error("All Files Fetch Error:", err);
        setError("Failed to load all errors");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ✅ Delete ALL user files dynamically (not hardcoded)
  const handleDeleteAllFiles = async () => {
    try {
      setLoading(true);

      // Extract all file IDs dynamically
      const fileIds = files.map((file) => file.id);

      api.delete("/api/file/delete", {
        data: { fileIds }
      });

      // Clear state after delete
      setFiles([]);
      setShowModal(false);
      setShowFilesTable(false);
      refreshDashboard();
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete files");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setShowFilesTable(true);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar active={activeNav} setActive={setActiveNav} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-5 xl:p-6 space-y-5">
            {/* Loading UI */}
            {loading && (
              <div className="text-center text-slate-500">
                Loading dashboard...
              </div>
            )}

            {/* Error UI */}
            {error && (
              <div className="text-center text-red-500">{error}</div>
            )}

            {/* Files Table */}
            {showFilesTable && !loading && (
              <FilesTable files={files} />
            )}
          </main>
        </div>
      </div>

      {/* Deep Clean Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8 animate-fadeIn">
            <h2 className="text-xl font-bold text-slate-800 mb-3">
              Deep Clean All Files?
            </h2>

            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              This will permanently delete all your files from the database.
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-sm font-medium"
              >
                No, Keep Files
              </button>

              <button
                onClick={handleDeleteAllFiles}
                disabled={loading || files.length === 0}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Cleaning...
                  </>
                ) : (
                  "Yes, Deep Clean"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}