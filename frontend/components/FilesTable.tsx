"use client";

import React, { useState } from "react";
import { files } from "@/lib/data";
import { DotsIcon, DocIcon, ImageIcon, VideoIcon, AudioIcon, ZipIcon, FigmaIcon, AiIcon } from "./Icons";
import type { FileItem, CloudProvider } from "@/lib/data";

const fileIconMap: Record<FileItem["type"], React.ComponentType<{ size?: number; className?: string }>> = {
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

const cloudColors: Record<CloudProvider, string> = {
  AWS: "bg-amber-100 text-amber-600",
  GCP: "bg-blue-100 text-blue-600",
  Azure: "bg-violet-100 text-violet-600",
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

function MemberAvatars({ members }: MemberAvatarsProps) {
  return (
    <div className="flex -space-x-2">
      {members.slice(0, 3).map((_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full border-2 border-white ${memberColors[i % memberColors.length]} flex items-center justify-center text-white text-[8px] font-black`}
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

export default function FilesTable() {
  const [filter, setFilter] = useState<"all" | "encrypted" | "processing">("all");

  const filtered = filter === "all" ? files : files.filter((f) => f.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-black text-slate-800">Files</h2>
        <div className="flex items-center gap-2">
          {(["all", "encrypted", "processing"] as const).map((f) => (
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
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors ml-1">
            View All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
          {[
            { label: "Name", span: "col-span-4" },
            { label: "Size", span: "col-span-2" },
            { label: "Last Modified", span: "col-span-2" },
            { label: "Members", span: "col-span-2" },
            { label: "Cloud", span: "col-span-1" },
            { label: "", span: "col-span-1" },
          ].map((h) => (
            <div key={h.label} className={`${h.span} flex items-center gap-1`}>
              {h.label && (
                <>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {h.label}
                  </span>
                  {h.label !== "Members" && h.label !== "Cloud" && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M4 1l2 3H2l2-3zM4 7L2 4h4L4 7z" fill="#CBD5E1" />
                    </svg>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((file, i) => {
          const FileIcon = fileIconMap[file.type];
          const iconStyle = fileIconColors[file.type];

          return (
            <div
              key={file.id}
              className={`grid grid-cols-12 px-4 py-3 items-center hover:bg-blue-50/40 transition-colors cursor-pointer group ${
                i < filtered.length - 1 ? "border-b border-slate-50" : ""
              }`}
            >
              {/* Name */}
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyle}`}>
                  <FileIcon size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{file.encryption}</p>
                </div>
              </div>

              {/* Size */}
              <div className="col-span-2">
                <span className="text-sm text-slate-500">{file.size}</span>
              </div>

              {/* Modified */}
              <div className="col-span-2">
                <span className="text-sm text-slate-500">{file.modified}</span>
              </div>

              {/* Members */}
              <div className="col-span-2">
                <MemberAvatars members={file.members} />
              </div>

              {/* Cloud */}
              <div className="col-span-1">
                <div className="flex flex-col gap-0.5">
                  {file.clouds.slice(0, 2).map((c) => (
                    <span
                      key={c}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none ${cloudColors[c]}`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end">
                <button className="w-7 h-7 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <DotsIcon size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
