"use client";

import React from "react";
import { fileTypeStats } from "@/lib/data";
import {
  DocIcon, ImageIcon, VideoIcon, AudioIcon, ZipIcon,
} from "./Icons";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Documents: DocIcon,
  Photos: ImageIcon,
  Videos: VideoIcon,
  Audio: AudioIcon,
  Archives: ZipIcon,
};

export default function FileTypeStats({types}:any) {
  console.log(types);
  const storageCategories = [
  { label: "Documents", files:types.Documents?types.Documents.count:0, size: "2.2 GB", sizeGB: 2.2, color: "#F59E0B", icon: "doc" },
  { label: "Photos", files:types.Photos?types.Photos.count:0, size: "13 GB", sizeGB: 13, color: "#3B82F6", icon: "image" },
  { label: "Videos", files:types.Video?types.Video.count:0, sizeGB: 42, color: "#EF4444", icon: "video" },
  { label: "Musics", files:types.Musics?types.Musics.count:0, size: "1.8 GB", sizeGB: 1.8, color: "#A855F7", icon: "audio" },
  { label: "Other Files", files: types.Archives?types.Archives.count:0, size: "16 GB", sizeGB: 16, color: "#EC4899", icon: "zip" },
];
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {storageCategories.map((stat) => {
        const Icon = iconMap[stat.label] || DocIcon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={15} className={stat.icon} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-700">
                {stat.files}
              </p>
              <p className="text-[10px] text-slate-400 leading-none">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
