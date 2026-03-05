"use client";

import React from "react";
import { FilesIcon, LockIcon, ShardsIcon, CloudIcon } from "./Icons";


export default function StatCards({stats}:any) {
  const statts = [
  {
    label: "Total Files",
    value: stats?.totalFiles,
    sub: "+12 this week",
    Icon: FilesIcon,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
    glow: "shadow-blue-100",
  },
  {
    label: "Encrypted Files",
    value: stats?.encryptedFiles,
    sub: "100% coverage",
    Icon: LockIcon,
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    glow: "shadow-emerald-100",
  },
  {
    label: "Active Shards",
    value: stats?.totalShards,
    sub: "Across 3 providers",
    Icon: ShardsIcon,
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    text: "text-violet-600",
    glow: "shadow-violet-100",
  },
  {
    label: "Cloud Buckets",
    value: stats?.cloudBuckets,
    sub: "AWS",
    Icon: CloudIcon,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    glow: "shadow-amber-100",
  },
];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {statts.map((stat) => (
        <div
          key={stat.label}
          className={`group relative bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-lg ${stat.glow} hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer`}
        >
          {/* Decorative background circle */}
          <div
            className={`absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-300`}
          />

          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}
            >
              <stat.Icon size={17} className={stat.text} />
            </div>
            <div
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.bg} ${stat.text}`}
            >
              ↑ Live
            </div>
          </div>

          <p className="text-2xl font-black text-slate-800 leading-none">{stat.value}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">{stat.label}</p>
          {/* <p className="text-[10px] text-slate-400 mt-0.5">{stat.sub}</p> */}

          <div
            className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
          />
        </div>
      ))}
    </div>
  );
}
