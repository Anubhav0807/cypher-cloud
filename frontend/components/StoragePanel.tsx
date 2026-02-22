"use client";
import React, { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// Mock data (replace with your real imports)
// ---------------------------------------------------------------------------
const totalStorage = 100;
const usedStorage = 75;
const storageCategories = [
  { label: "Documents",   size: "12 GB", sizeGB: 12, color: "#f59e0b", icon: "📄", files: 1340 },
  { label: "Photos",      size: "18 GB", sizeGB: 18, color: "#3b82f6", icon: "🖼️", files: 5821 },
  { label: "Videos",      size: "32 GB", sizeGB: 32, color: "#ef4444", icon: "🎬", files: 204  },
  { label: "Musics",      size: "8 GB",  sizeGB: 8,  color: "#8b5cf6", icon: "🎵", files: 912  },
  { label: "Other Files", size: "5 GB",  sizeGB: 5,  color: "#ec4899", icon: "📦", files: 67   },
];

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
function useCountUp(target: number, duration = 1200, delay = 300) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setCount(Math.round(p * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return count;
}

function useMounted(delay = 400) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------
function Card({ className = "", style = {}, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`} style={style}>
      {children}
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color, transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
    </div>
  );
}

function Tooltip({ tip, children }: { tip: string | null; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      {tip && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10 shadow-lg">
          {tip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// Tiny inline sparkline
function Sparkline({ color }: { color: string }) {
  const pts = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];
  const max = Math.max(...pts);
  const W = 52, H = 20;
  const step = W / (pts.length - 1);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(H - (p / max) * H).toFixed(1)}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible flex-shrink-0">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <circle cx={(pts.length - 1) * step} cy={H - (pts[pts.length - 1] / max) * H} r="2.5" fill={color} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export default function StoragePanel() {
  const total = storageCategories.reduce((s, c) => s + c.sizeGB, 0);
  const ready = useMounted(400);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const usedCount = useCountUp(usedStorage, 1200, 300);
  const pctUsed = Math.round((usedStorage / totalStorage) * 100);
  const hovCat = storageCategories.find((c) => c.label === hovered);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Mono:wght@500&display=swap');
        .sp-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .sp-mono { font-family: 'DM Mono', monospace !important; }
        @keyframes spFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spPing {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .sp-in { opacity: 0; animation: spFadeUp 0.45s ease forwards; }
        .sp-shimmer-text {
          background: linear-gradient(90deg, #059669 0%, #34d399 45%, #059669 100%);
          background-size: 200% auto;
          animation: spShimmer 2.5s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sp-row-hover:hover { background: #f8fafc; }
        .sp-drop { background: repeating-linear-gradient(-45deg,transparent,transparent 6px,rgba(59,130,246,.04) 6px,rgba(59,130,246,.04) 12px); }
        .sp-drop.sp-over { background: repeating-linear-gradient(-45deg,transparent,transparent 6px,rgba(59,130,246,.09) 6px,rgba(59,130,246,.09) 12px); }
      `}</style>

      <div className="sp-root flex flex-col gap-3 w-full max-w-sm mx-auto p-1">

        {/* ── Main card ── */}
        <Card>
          {/* Header */}
          <div className="px-5 pt-5 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-800">Stor</span>
              <span className="text-xs text-white bg-blue-600 px-1.5 py-0.5 rounded-md font-black leading-none">age</span>
            </div>
            <span className="sp-mono text-[11px] text-slate-400">{usedStorage} GB / {totalStorage} GB</span>
          </div>

          {/* Usage number */}
          <div className="px-5 pb-3 flex items-end justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="sp-mono text-4xl font-black text-slate-800 leading-none tabular-nums">{usedCount}</span>
              <span className="text-base font-semibold text-slate-400 leading-none">GB used</span>
            </div>
            <div className="text-right">
              <p className="sp-mono text-xs text-slate-400">{totalStorage - usedStorage} GB free</p>
              <p className="text-[10px] text-slate-300 mt-0.5">{pctUsed}% utilized</p>
            </div>
          </div>

          {/* Segmented bar */}
          <div className="px-5 pb-3">
            <Tooltip tip={hovCat ? `${hovCat.label}: ${hovCat.size}` : null}>
              <div className="flex h-4 rounded-full overflow-hidden gap-0.5 w-full cursor-pointer">
                {storageCategories.map((cat, i) => {
                  const pct = (cat.sizeGB / total) * 100;
                  return (
                    <div
                      key={cat.label}
                      onMouseEnter={() => setHovered(cat.label)}
                      onMouseLeave={() => setHovered(null)}
                      className={`h-full ${i === 0 ? "rounded-l-full" : ""} ${i === storageCategories.length - 1 ? "rounded-r-full" : ""}`}
                      style={{
                        width: ready ? `${pct}%` : "0%",
                        backgroundColor: cat.color,
                        opacity: hovered && hovered !== cat.label ? 0.3 : 1,
                        transition: `width 0.9s cubic-bezier(0.34,1.56,0.64,1) ${i * 90}ms, opacity 0.2s`,
                      }}
                    />
                  );
                })}
              </div>
            </Tooltip>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2.5">
              {storageCategories.map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center gap-1 cursor-pointer"
                  onMouseEnter={() => setHovered(cat.label)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: cat.color,
                      transform: hovered === cat.label ? "scale(1.7)" : "scale(1)",
                      transition: "transform 0.2s",
                    }}
                  />
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: hovered === cat.label ? "#334155" : "#94a3b8",
                      transition: "color 0.2s",
                    }}
                  >
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-slate-100" />

          {/* Category rows */}
          <div className="px-3 py-3 flex flex-col gap-0.5">
            {storageCategories.map((cat, i) => {
              const barPct = Math.round((cat.sizeGB / total) * 100);
              return (
                <div
                  key={cat.label}
                  className="sp-in sp-row-hover flex items-center gap-3 rounded-xl px-2 py-2 cursor-pointer transition-colors duration-150"
                  style={{ animationDelay: `${500 + i * 80}ms` }}
                  onMouseEnter={() => setHovered(cat.label)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{
                      backgroundColor: `${cat.color}1a`,
                      transform: hovered === cat.label ? "scale(1.1)" : "scale(1)",
                      transition: "transform 0.2s",
                    }}
                  >
                    {cat.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700">{cat.label}</span>
                      <span className="sp-mono text-[11px] font-bold" style={{ color: cat.color }}>{cat.size}</span>
                    </div>
                    <ProgressBar value={ready ? barPct : 0} color={cat.color} />
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-slate-400">{cat.files.toLocaleString()} files</span>
                      <span className="text-[10px] text-slate-300">{barPct}%</span>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div style={{ opacity: hovered === cat.label ? 1 : 0.45, transition: "opacity 0.2s" }}>
                    <Sparkline color={cat.color} />
                  </div>

                  <span className="text-slate-300 flex-shrink-0"><ChevronRight /></span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ── Quick stat tiles ── */}
        {/* <div className="sp-in grid grid-cols-3 gap-2" style={{ animationDelay: "350ms" }}>
          {[
            { label: "Total Files", value: "8,344", icon: "🗂️" },
            { label: "Last Sync",   value: "2m ago", icon: "🔄" },
            { label: "Shared",      value: "14",     icon: "🔗" },
          ].map((s) => (
            <Card key={s.label} className="px-2 py-3 flex flex-col items-center gap-1 cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-lg">{s.icon}</span>
              <span className="sp-mono text-sm font-black text-slate-800">{s.value}</span>
              <span className="text-[9px] text-slate-400 text-center leading-tight">{s.label}</span>
            </Card>
          ))}
        </div> */}

        {/* ── Drop zone ── */}
        <div
          className={`sp-in sp-drop rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            dragging ? "sp-over border-blue-400 scale-[1.01]" : "border-slate-200 hover:border-blue-300"
          }`}
          style={{ animationDelay: "430ms" }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
        >
          <div className="flex flex-col items-center gap-2 py-5">
            <div
              className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 transition-transform duration-300"
              style={{ transform: dragging ? "scale(1.15)" : "scale(1)" }}
            >
              <UploadIcon />
            </div>
            <p className="text-sm font-bold text-slate-600">{dragging ? "Drop to upload!" : "Import Files"}</p>
            <p className="text-[10px] text-slate-400">Drag & drop or click to browse</p>
            <div className="flex gap-1 mt-0.5">
              {["PDF", "MP4", "JPG", "ZIP"].map((ext) => (
                <span key={ext} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">{ext}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Security card ── */}
       
      </div>
    </>
  );
}
