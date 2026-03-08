"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DotsIcon,
  DocIcon,
  ImageIcon,
  VideoIcon,
  AudioIcon,
  ZipIcon,
  FigmaIcon,
  AiIcon,
} from "../Icons";
import type { FileItem, CloudProvider } from "@/lib/data";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { Star } from "lucide-react";

const fileIconMap: Record<
  FileItem["type"],
  React.ComponentType<{ size?: number; className?: string }>
> = {
  doc: DocIcon,
  image: ImageIcon,
  video: VideoIcon,
  audio: AudioIcon,
  figma: FigmaIcon,
  ai: AiIcon,
  zip: ZipIcon,
};

const fileIconColors: Record<FileItem["type"], string> = {
  doc: "bg-amber-50 text-amber-500",
  image: "bg-blue-50 text-blue-500",
  video: "bg-red-50 text-red-500",
  audio: "bg-purple-50 text-purple-500",
  figma: "bg-pink-50 text-pink-500",
  ai: "bg-orange-50 text-orange-500",
  zip: "bg-slate-50 text-slate-500",
};

const memberColors = [
  "bg-gradient-to-br from-violet-400 to-blue-500",
  "bg-gradient-to-br from-pink-400 to-rose-500",
  "bg-gradient-to-br from-emerald-400 to-cyan-500",
  "bg-gradient-to-br from-amber-400 to-orange-500",
];

interface MemberAvatarsProps {
  members: string[];
}

/* ------------------ Helpers ------------------ */

const formatSize = (bytes: number) => {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const mapFileType = (mime: string): FileItem["type"] => {
  if (!mime) return "doc";
  if (mime.startsWith("image")) return "image";
  if (mime.startsWith("video")) return "video";
  if (mime.startsWith("audio")) return "audio";
  if (mime.includes("pdf") || mime.includes("word")) return "doc";
  if (mime.includes("zip")) return "zip";
  return "doc";
};

/* ------------------ Avatar Component ------------------ */

function MemberAvatars({ members }: MemberAvatarsProps) {
  return (
    <div className="flex -space-x-2">
      {members.slice(0, 3).map((_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full border-2 border-white ${
            memberColors[i % memberColors.length]
          } flex items-center justify-center text-white text-[8px] font-black`}
        >
          {String.fromCharCode(65 + i)}
        </div>
      ))}
      {members.length > 3 && (
        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-500 text-[8px] font-bold">
          +{members.length - 3}
        </div>
      )}
    </div>
  );
}

/* ------------------ Main Component ------------------ */

export default function FilesTable({ files = [], search = "" }: any) {
  const [filter, setFilter] = useState<"all" | "image" | "doc">("all");
  const [activeMenu, setActiveMenu] = useState<string | number | null>(null);
  const [localFiles, setLocalFiles] = useState(files);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | number | null>(
    null,
  );
  const { refreshDashboard } = useUser();

  /* 🔥 Transform backend files → UI format */
  const transformedFiles: FileItem[] = (files || []).map((file: any) => ({
    id: file.id,
    name: file.name,
    type: mapFileType(file.type),
    size: formatSize(file.size),
    modified: formatDate(file.modified),
    members: file.members || [],
    encryption: "AES-256",
    status: "encrypted",
    clouds: ["AWS"],
  }));

  let filtered = transformedFiles;

  if (filter !== "all") {
    filtered = filtered.filter((f) => f.type === filter);
  }

  if (search) {
    filtered = filtered.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()),
    );
  }
  const handleShare = () => {
    console.log("kkk");
  };
  const removingFavourites = async (fileId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file/favourite`,
        {
          fileId: fileId,
        },
        {
          withCredentials: true,
        },
      );
      setLocalFiles((prev: any) => prev.filter((f: any) => f.id !== fileId));
      setActiveMenu(null);
      refreshDashboard();
    } catch (err) {
      console.error("Removal failed:", err);
    }
  };

  const handleDelete = async (fileId: string | number) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file/recycle`,
        { fileIds: [fileId] },
        { withCredentials: true },
      );

      setLocalFiles((prev: any) => prev.filter((f: any) => f.id !== fileId));

      setActiveMenu(null);
      refreshDashboard();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-black text-slate-800">Files</h2>
        <div className="flex items-center gap-2">
          {(["all", "image", "doc"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-lg capitalize transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow shadow-blue-200"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
          {[
            { label: "Name", span: "col-span-5" },
            { label: "Size", span: "col-span-2" },
            { label: "Last Modified", span: "col-span-2" },
            { label: "Members", span: "col-span-2" },
            { label: "", span: "col-span-1" },
          ].map((h) => (
            <div key={h.label} className={`${h.span}`}>
              {h.label && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {h.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            No files uploaded yet.
          </div>
        ) : (
          filtered.map((file: FileItem, i: number) => {
            const FileIcon = fileIconMap[file.type];
            const iconStyle = fileIconColors[file.type];

            return (
              <div
                key={file.id}
                className={`grid grid-cols-12 px-4 py-3 items-center hover:bg-blue-50/40 transition-colors cursor-pointer group ${
                  i < filtered.length - 1 ? "border-b border-slate-50" : ""
                }`}
                onClick={() => setActiveMenu(null)}
              >
                {/* Name */}
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconStyle}`}
                  >
                    <FileIcon size={15} />
                  </div>

                  <Link
                    href={`/files/${file.id}`}
                    className="text-sm font-semibold text-slate-700 truncate group-hover:text-blue-600 hover:underline transition-colors"
                  >
                    {file.name}
                  </Link>
                </div>

                {/* Size */}
                <div className="col-span-2 text-sm text-slate-500">
                  {file.size}
                </div>

                {/* Modified */}
                <div className="col-span-2 text-sm text-slate-500">
                  {file.modified}
                </div>

                {/* Members */}
                <div className="col-span-2">
                  <MemberAvatars members={file.members} />
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === file.id ? null : file.id);
                    }}
                    className="w-7 h-7 rounded-lg text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-all opacity-40 group-hover:opacity-100"
                  >
                    <DotsIcon size={20} />
                  </button>

                  {activeMenu === file.id && (
                    <div className="absolute right-8 top-0 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          removingFavourites(file.id);
                          setActiveMenu(null);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        Remove from Favourites
                      </button>

                      <button
                        onClick={() => {
                          setSelectedFile(file.id);
                          setShareOpen(true);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        Share
                      </button>

                      <div className="my-1 border-t border-slate-100"></div>

                      <button
                        onClick={() => handleDelete(file.id)}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      {shareOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Share File</h3>

            <input
              type="email"
              placeholder="Enter email"
              className="border w-full px-3 py-2 rounded mb-4"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShareOpen(false)}
                className="px-3 py-2 text-sm text-slate-500"
              >
                Cancel
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
