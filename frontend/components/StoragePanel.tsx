"use client";
import React, { useState } from "react";

const CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
  Photos: { color: "#64748b", icon: "🖼️" },
  Documents: { color: "#f59e0b", icon: "📄" },
  "Recycle Bin": { color: "#3b82f6", icon: "♻️" },
  Videos: { color: "#ef4444", icon: "🎬" },
  Musics: { color: "#8b5cf6", icon: "🎵" },
  "Other Files": { color: "#ec4899", icon: "📦" },
};

function bytesToMB(bytes: number) {
  return Number((bytes / (1024 * 1024)).toFixed(2));
}

export default function StoragePanel({ stats, storage }: any) {
  if (!stats) return null;

  const safeStorage = storage || { total: 0, used: 0 };

  const totalStorage = bytesToMB(safeStorage.total || 0);
  const usedStorage = bytesToMB(safeStorage.used || 0);

  const pctUsed =
    totalStorage > 0 ? Math.round((usedStorage / totalStorage) * 100) : 0;

  const [hovered, setHovered] = useState<string | null>(null);

  // Convert backend object → array
  const categories = Object.entries(stats?.typeStats || {})
    .map(([label, data]: any) => ({
      label,
      sizeMB: bytesToMB(data?.size || 0),
      files: data?.count || 0,
      color: CATEGORY_CONFIG[label]?.color || "#94a3b8",
      icon: CATEGORY_CONFIG[label]?.icon || "📁",
    }))
    .filter((cat) => cat.files > 0); // 🔥 add this

  return (
    <div className="flex flex-col gap-3 w-full p-1">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {/* Header */}
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-slate-800">Stor</span>
            <span className="text-xs text-white bg-blue-600 px-1.5 py-0.5 rounded-md font-black">
              age
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            {usedStorage} MB / {totalStorage} MB
          </span>
        </div>

        {/* Usage numbers */}
        <div className="px-5 pb-3 flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-slate-800">
              {usedStorage}
            </span>
            <span className="text-base font-semibold text-slate-400">
              MB used
            </span>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">
              {(totalStorage - usedStorage).toFixed(2)} MB free
            </p>
            <p className="text-[10px] text-slate-300">{pctUsed}% utilized</p>
          </div>
        </div>

        {/* Segmented bar */}
        <div className="px-5 pb-3">
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5 w-full">
            {categories.map((cat) => {
              const pct =
                totalStorage > 0 ? (cat.sizeMB / totalStorage) * 100 : 0;

              return (
                <div
                  key={cat.label}
                  onMouseEnter={() => setHovered(cat.label)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: cat.color,
                    opacity: hovered && hovered !== cat.label ? 0.4 : 1,
                    transition: "opacity 0.2s",
                  }}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2.5">
            {categories.map((cat) => (
              <div key={cat.label} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />

                <span className="text-[10px] text-slate-400">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-5 border-t border-slate-100" />

        {/* Category rows */}
        <div className="px-3 py-3 flex flex-col gap-1">
          {categories.map((cat) => {
            const barPct =
              totalStorage > 0
                ? Math.max(1, Math.round((cat.sizeMB / totalStorage) * 100))
                : 0;

            return (
              <div
                key={cat.label}
                className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ backgroundColor: `${cat.color}1a` }}
                >
                  {cat.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">
                      {cat.label}
                    </span>

                    <span
                      className="text-[11px] font-bold"
                      style={{ color: cat.color }}
                    >
                      {cat.sizeMB} MB
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${barPct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-0.5">
                    <span className="text-[10px] text-slate-400">
                      {cat.files} files
                    </span>

                    <span className="text-[10px] text-slate-300">
                      {barPct}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
