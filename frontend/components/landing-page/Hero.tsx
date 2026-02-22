"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

function GridDots() {
  return (
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage: "radial-gradient(circle, #1e40af 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const anim = (delay: string) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white">
      <GridDots />

      {/* Ambient orbs */}
      <div className="absolute -top-48 -right-48 w-[680px] h-[680px] rounded-full bg-blue-400/20 blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute -bottom-32 -left-24 w-[480px] h-[480px] rounded-full bg-indigo-300/15 blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full bg-sky-200/20 blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />

      {/* Subtle vertical line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-200/30 to-transparent" style={{ left: "67%" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24 w-full">
        <div className="max-w-3xl">

          {/* Status badge */}
          <div style={anim("0.05s")} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">
              CypherCloud · Quantum-Safe Active
            </span>
          </div>

          {/* Headline */}
          <h1
            style={anim("0.12s")}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6"
          >
            Secure Multi-Cloud
            <br />
            <span className="relative inline-block">
              <span className="text-blue-600">Storage</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M2 6 C60 2, 160 2, 298 6" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            {" "}for the Future
          </h1>

          {/* Sub */}
          <p style={anim("0.22s")} className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 max-w-xl font-medium">
            CypherCloud uses hybrid encryption and encrypted sharding to distribute your files across AWS, GCP, and Azure — so no single provider ever holds your complete data.
          </p>

          {/* Buttons */}
          <div style={anim("0.3s")} className="flex flex-wrap gap-3">
            <Link href='/dashboard'>
            <button className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-300/40 active:scale-95 transition-all duration-200">
              Get Started Free
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            </Link>
            <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-7 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200">
              See How It Works
            </button>
          </div>

          {/* Trust bar */}
          <div style={anim("0.44s")} className="flex flex-wrap gap-6 mt-14">
            {[
              { icon: "⚡", label: "CypherCloud Engine" },
              { icon: "🔐", label: "AES-256 + RSA-4096" },
              { icon: "☁️", label: "AWS · GCP · Azure" },
              { icon: "🛡️", label: "SOC 2 Certified" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-semibold text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(-50%) translateX(0)" : "translateY(-44%) translateX(48px)",
            transition: "opacity 1s ease 0.5s, transform 1s ease 0.5s",
          }}
        >
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative w-[400px] h-[400px]">
      {/* Outer orbit */}
      <div
        className="absolute inset-0 rounded-full border border-blue-100"
        style={{ animation: "spin 28s linear infinite" }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-3 h-3 rounded-full bg-blue-300/70"
            style={{
              top: `${50 - 48 * Math.cos((deg * Math.PI) / 180)}%`,
              left: `${50 + 48 * Math.sin((deg * Math.PI) / 180)}%`,
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}
      </div>

      {/* Inner orbit */}
      <div
        className="absolute inset-14 rounded-full border border-indigo-200/50"
        style={{ animation: "spin 18s linear infinite reverse" }}
      >
        {[45, 135, 225, 315].map((deg) => (
          <div
            key={deg}
            className="absolute w-2.5 h-2.5 rounded-full bg-indigo-400/60"
            style={{
              top: `${50 - 48 * Math.cos((deg * Math.PI) / 180)}%`,
              left: `${50 + 48 * Math.sin((deg * Math.PI) / 180)}%`,
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}
      </div>

      {/* Center card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-52 h-52 bg-white rounded-3xl shadow-2xl shadow-blue-200/70 border border-blue-100/80 flex flex-col items-center justify-center gap-3 p-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-300/50">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-black text-slate-800">CypherCloud</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Quantum-Safe · Active</p>
          </div>
          <div className="flex gap-1">
            {["AWS", "GCP", "AZ"].map((c) => (
              <span key={c} className="text-[9px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded-md border border-blue-100">
                {c}
              </span>
            ))}
          </div>
          {/* Tiny stat */}
          <div className="w-full bg-slate-50 rounded-xl px-3 py-2 flex items-center justify-between">
            <span className="text-[9px] text-slate-400 font-semibold">Shards Distributed</span>
            <span className="text-[10px] font-black text-blue-600">284</span>
          </div>
        </div>
      </div>

      {/* Floating shard badges */}
      {[
        { label: "Encrypted", pos: "top-6 left-4", delay: "0s" },
        { label: "Sharded",   pos: "bottom-6 right-4", delay: "1s" },
        { label: "Distributed", pos: "top-1/2 -right-2", delay: "2s" },
      ].map((s) => (
        <div
          key={s.label}
          className={`absolute ${s.pos} bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg`}
          style={{ animation: "pulse 3s ease-in-out infinite", animationDelay: s.delay }}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}
