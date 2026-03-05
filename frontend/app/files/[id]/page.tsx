"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { files } from "@/lib/data";
import type { FileItem, CloudProvider } from "@/lib/data";
import axios from "axios";
import { useUser } from "@/context/UserContext";

// ─── Icon helpers (inline SVGs, consistent with project style) ────────────────

function BackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Constants (mirrored from FilesTable to stay consistent) ─────────────────

const fileIconColors: Record<FileItem["type"], string> = {
  doc: "bg-amber-50 text-amber-500",
  image: "bg-blue-50 text-blue-500",
  video: "bg-red-50 text-red-500",
  audio: "bg-purple-50 text-purple-500",
  figma: "bg-pink-50 text-pink-500",
  ai: "bg-orange-50 text-orange-500",
  zip: "bg-slate-50 text-slate-500",
};

const cloudColors: Record<
  CloudProvider,
  { pill: string; dot: string; label: string }
> = {
  AWS: {
    pill: "bg-amber-50 border-amber-200",
    dot: "bg-amber-400",
    label: "text-amber-700",
  },
  GCP: {
    pill: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
    label: "text-blue-700",
  },
  Azure: {
    pill: "bg-violet-50 border-violet-200",
    dot: "bg-violet-500",
    label: "text-violet-700",
  },
};

const cloudDescriptions: Record<CloudProvider, string> = {
  AWS: "Amazon Web Services — us-east-1",
  GCP: "Google Cloud Platform — us-central1",
  Azure: "Microsoft Azure — eastus2",
};

const memberColors = [
  "bg-gradient-to-br from-violet-400 to-blue-500",
  "bg-gradient-to-br from-pink-400 to-rose-500",
  "bg-gradient-to-br from-emerald-400 to-cyan-500",
  "bg-gradient-to-br from-amber-400 to-orange-500",
];

const statusStyles: Record<
  FileItem["status"],
  { bg: string; dot: string; label: string }
> = {
  encrypted: {
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
    label: "text-emerald-700",
  },
  processing: {
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-400",
    label: "text-amber-700",
  },
  pending: {
    bg: "bg-slate-50 border-slate-200",
    dot: "bg-slate-400",
    label: "text-slate-600",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <span className="text-slate-400">{icon}</span>
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-[12px] font-semibold text-slate-400 w-32 flex-shrink-0">
        {label}
      </span>
      <span className="text-[12.5px] font-semibold text-slate-700 text-right">
        {value}
      </span>
    </div>
  );
}

// ─── Not Found state ──────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
        <FileTextIcon />
      </div>
      <p className="text-slate-500 font-semibold text-sm">File not found</p>
      <Link
        href="/"
        className="text-[12.5px] text-blue-600 font-semibold hover:underline flex items-center gap-1.5"
      >
        <BackIcon /> Back to Dashboard
      </Link>
    </div>
  );
}
function getReadableType(mime: string) {
  if (!mime) return "Document";

  if (mime.includes("word")) return "DOCX Document";
  if (mime.includes("pdf")) return "PDF Document";
  if (mime.includes("image")) return "Image";
  if (mime.includes("video")) return "Video";
  if (mime.includes("audio")) return "Audio";
  if (mime.includes("zip")) return "ZIP Archive";

  return "Document";
}
function formatSize(bytes: number) {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}
// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FilePreviewPage() {
  const params = useParams();
  const { files } = useUser();
  const [copied, setCopied] = useState(false);

  const id = String(params?.id);

  if (!files) return null;

  const file = files.find((f: any) => f.id === id);

  if (!file) return <NotFound />;

  // normalize missing backend fields
  file.status = file.status || "encrypted";
  file.encryption = file.encryption || "AES-256";
  file.clouds = file.clouds || ["AWS"];
  file.members = file.members || [];
  file.type = file.type || "doc";
  file.size = file.size || "0 MB";
  file.modified = file.modified || "Unknown";

  if (!file) return <NotFound />;

  const iconStyle = fileIconColors[file.type];
  const statusStyle =
    statusStyles[file.status as keyof typeof statusStyles] ||
    statusStyles["encrypted"];

  function handleCopyId() {
    navigator.clipboard.writeText(String(file?.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  //Checking to download a file by calling hardcoded ifd of particular file
  const handleDownload = async (fileId: string) => {
    try {
      const fileData = files.find((f: any) => f.id === fileId);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file/download/${fileId}`,
        {
          responseType: "blob",
          withCredentials: true,
        },
      );

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileData?.name || "downloaded-file";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top nav bar ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {/* <Link
            href="/"
            className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            
            Back
          </Link> */}
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
            <BackIcon />
            <Link
              href="/dashboard"
              className="hover:text-slate-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href="/myfiles"
              className="hover:text-slate-600 transition-colors font-medium"
            >
              My Files
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-semibold truncate max-w-[200px]">
              {file.name}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-all">
            <ShareIcon />
            Share
          </button>
          <button
            onClick={() => handleDownload(file.id)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow shadow-blue-200 transition-all"
          >
            <DownloadIcon />
            Download
          </button>
        </div>
      </div>

      {/* ── Page body ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* File header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 flex items-center gap-5">
          {/* Large icon */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconStyle}`}
          >
            <FileTextIcon />
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-slate-900 tracking-tight truncate mb-1.5">
              {file.name}
            </h1>
            <div className="flex items-center flex-wrap gap-2">
              {/* Type badge */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {getReadableType(file.type)}
              </span>
              {/* Status badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.label}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                />
                {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
              </span>
              {/* Encryption badge */}
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                <LockIcon />
                {file.encryption}
              </span>
            </div>
          </div>

          {/* Size pill */}
          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-black text-slate-800 tracking-tight">
              {formatSize(file.size)}
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              File size
            </p>
          </div>
        </div>

        {/* ── Two-column grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left — details (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* File details */}
            <SectionCard title="File Details" icon={<FileTextIcon />}>
              <MetaRow label="File Name" value={file.name} />
              <MetaRow
                label="File Type"
                value={
                  <span className="capitalize">
                    {getReadableType(file.type)}
                  </span>
                }
              />
              <MetaRow label="Size" value={formatSize(file.size)} />
              <MetaRow label="Last Modified" value={file.modified} />
              <MetaRow
                label="File ID"
                value={
                  <button
                    onClick={handleCopyId}
                    className="font-mono text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md transition-colors"
                  >
                    {copied ? "Copied!" : `#${file.id}`}
                  </button>
                }
              />
            </SectionCard>

            {/* Security */}
            <SectionCard title="Security & Encryption" icon={<ShieldIcon />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <LockIcon />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-emerald-800">
                        Encryption Algorithm
                      </p>
                      <p className="text-[11px] text-emerald-600">
                        {file.encryption}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <ShieldIcon />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-blue-800">
                        Quantum-Safe Status
                      </p>
                      <p className="text-[11px] text-blue-600">
                        Post-quantum algorithms enabled
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <CloudIcon />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-700">
                        Shard Distribution
                      </p>
                      <p className="text-[11px] text-slate-500">
                        File split across {file.clouds.length} cloud provider
                        {file.clouds.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                    3 shards
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right — cloud + members (1 col) */}
          <div className="flex flex-col gap-5">
            {/* Cloud providers */}
            <SectionCard title="Cloud Distribution" icon={<CloudIcon />}>
              <div className="space-y-2.5">
                {file.clouds.map((cloud) => {
                  const style = cloudColors[cloud];
                  return (
                    <div
                      key={cloud}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${style.pill}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`}
                      />
                      <div className="min-w-0">
                        <p className={`text-[12px] font-bold ${style.label}`}>
                          {cloud}
                        </p>
                        <p className="text-[10.5px] text-slate-400 font-medium truncate">
                          {cloudDescriptions[cloud]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* Members */}
            <SectionCard title="Shared With" icon={<UsersIcon />}>
              <div className="space-y-2">
                {file.members.map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-black ${memberColors[i % memberColors.length]}`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div>
                      <p className="text-[12.5px] font-semibold text-slate-700">
                        Team Member {String.fromCharCode(65 + i)}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {i === 0 ? "Owner" : "Editor"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
