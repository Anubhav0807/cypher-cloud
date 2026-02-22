"use client";

import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./landing-page/Footer";

// ─── Icons ────────────────────────────────────────────────────────────────────

const ZapIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const DashboardIcon = ({ size = 17, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const UploadIcon = ({ size = 17, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FilesIcon = ({ size = 17, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const StarIcon = ({ size = 17, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ShareIcon = ({ size = 17, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const TrashIcon = ({ size = 17, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const BroomIcon = ({ size = 17, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 3L5 7l4 4" /><path d="M5 7l4 4 6-6" />
    <path d="M14 14l-4 4 4 4" /><path d="M10 18h8" />
  </svg>
);

const CloudUploadIcon = ({ size = 64, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const CheckCircleIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Types ─────────────────────────────────────────────────────────────────────

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", label: "Dashboard", Icon: DashboardIcon, href: "/dashboard" },
  { id: "upload", label: "Upload", Icon: UploadIcon, href: "/upload" },
  { id: "files", label: "My Files", Icon: FilesIcon, badge: 3, href: "/allfiles" },
];

const secondaryNav = [
  { id: "favourites", label: "Favourites", Icon: StarIcon, href: "/favourites" },
  { id: "shared", label: "Shared", Icon: ShareIcon, href: "/shared" },
  { id: "trash", label: "Recycle Bin", Icon: TrashIcon, href: "/trash" },
  { id: "clean", label: "Deep Clean", Icon: BroomIcon, href: "/clean" },
];

// ─── Format helpers ────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(type: string): string {
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("video/")) return "🎬";
  if (type.startsWith("audio/")) return "🎵";
  if (type === "application/pdf") return "📄";
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) return "🗜️";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("sheet") || type.includes("excel")) return "📊";
  return "📁";
}

// ─── Main Upload Page ──────────────────────────────────────────────────────────

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));

    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(null);
          setUploadedFiles((prev) => [...newFiles, ...prev]);
        }, 400);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 120);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) simulateUpload(files);
    },
    [simulateUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) simulateUpload(files);
      e.target.value = "";
    },
    [simulateUpload]
  );

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };
const [activeNav, setActiveNav] = useState("upload");
  return (
    <>
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      

        <Sidebar active={activeNav} setActive={setActiveNav} />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
      <Navbar/>
        <div className="p-8 max-w-3xl mx-auto overflow-hidden">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !uploadProgress && inputRef.current?.click()}
            className={`relative rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden
              ${isDragging
                ? "border-2 border-blue-500 bg-blue-50 shadow-xl shadow-blue-100 scale-[1.01]"
                : "border-2 border-dashed border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 shadow-md"
              }
              ${uploadProgress !== null ? "pointer-events-none" : ""}
            `}
            style={{ minHeight: 320 }}
          >
            {/* Subtle gradient background */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: isDragging
                  ? "radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)"
                  : "radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%)",
              }}
            />

            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />

            <div className="relative flex flex-col items-center justify-center py-16 px-8 text-center">
              {/* Upload icon */}
              <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  isDragging
                    ? "bg-blue-100 text-blue-600 shadow-lg shadow-blue-200"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-400"
                }`}
              >
                <CloudUploadIcon size={44} />
              </div>

              {uploadProgress !== null ? (
                <div className="w-full max-w-xs">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Encrypting & uploading…</p>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-scroll">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-500 font-semibold mt-2">{Math.round(uploadProgress)}%</p>
                </div>
              ) : (
                <>
                  <h2 className={`text-lg font-bold mb-1 transition-colors ${isDragging ? "text-blue-700" : "text-slate-700"}`}>
                    {isDragging ? "Drop to upload" : "Drag & drop files here"}
                  </h2>
                  <p className="text-sm text-slate-400 mb-6">or click to browse</p>

                  <button
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                  >
                    Browse Files
                  </button>

                  <div className="flex items-center gap-4 mt-8">
                    {["PDF", "MP4", "JPG", "ZIP", "DOCX"].map((ext) => (
                      <span key={ext} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 text-[11px] font-bold tracking-wide">
                        {ext}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-300 mt-3">All files are AES-256 encrypted automatically</p>
                </>
              )}
            </div>
          </div>

          {/* Encryption info strip */}
          <div className="mt-4 flex items-center gap-6 px-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm">
            {[
              { label: "Encryption", value: "AES-256" },
              { label: "Key Exchange", value: "RSA-4096" },
              { label: "Storage", value: "Multi-Cloud" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-slate-400">{label}:</span>
                <span className="text-xs font-bold text-slate-600">{value}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-1.5 text-green-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[11px] font-semibold">End-to-end encrypted</span>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700">Uploaded Files</h3>
                <span className="text-xs text-slate-400">{uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="space-y-2">
                {uploadedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400">{formatBytes(file.size)}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                          <CheckCircleIcon size={11} />
                          Encrypted
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">AES-256</span>
                      <button
                        onClick={() => removeFile(i)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all"
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:scale-[1.01] transition-all duration-200">
                Confirm & Save to Cloud
              </button>
            </div>
          )}
        </div>
      </main>
    </div>

    </>
  );
}
