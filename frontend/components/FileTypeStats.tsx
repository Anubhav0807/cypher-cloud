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

export default function FileTypeStats() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {fileTypeStats.map((stat) => {
        const Icon = iconMap[stat.label] || DocIcon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={15} className={stat.text} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-700">
                {stat.count.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 leading-none">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
