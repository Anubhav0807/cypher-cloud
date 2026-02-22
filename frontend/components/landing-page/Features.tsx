"use client";
import { useEffect, useRef, useState } from "react";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "Hybrid Encryption",
    desc: "AES-256 symmetric encryption wrapped with RSA-4096 asymmetric keys — double-layered protection for every file before it leaves your device.",
    badge: "AES-256 + RSA-4096",
    accent: { bg: "#eff6ff", icon: "#dbeafe", text: "#2563eb", badgeBg: "#dbeafe", badgeText: "#1d4ed8", border: "#bfdbfe", hoverBorder: "#93c5fd", glow: "rgba(37,99,235,0.12)" },
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Encrypted Sharding",
    desc: "Files are cryptographically split into encrypted shards and stored across independent nodes. No individual shard contains recoverable data.",
    badge: "Zero Single Point",
    accent: { bg: "#f0f9ff", icon: "#e0f2fe", text: "#0284c7", badgeBg: "#e0f2fe", badgeText: "#0369a1", border: "#bae6fd", hoverBorder: "#7dd3fc", glow: "rgba(14,165,233,0.12)" },
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
    ),
    title: "Multi-Cloud Distribution",
    desc: "Shards are spread automatically across AWS, GCP, and Azure. Even if one provider is compromised or offline, your data remains intact and inaccessible.",
    badge: "AWS · GCP · Azure",
    accent: { bg: "#eef2ff", icon: "#e0e7ff", text: "#4f46e5", badgeBg: "#e0e7ff", badgeText: "#3730a3", border: "#c7d2fe", hoverBorder: "#a5b4fc", glow: "rgba(99,102,241,0.12)" },
  },
];

export default function Features() {
  const { ref, inView } = useInView();

  return (
    <section id="features" className="py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-white pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-black tracking-widest uppercase text-blue-600 mb-4"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(12px)", transition: "all 0.5s ease 0s" }}
          >
            CypherCloud Technology
          </span>
          <h2
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)", transition: "all 0.5s ease 0.1s" }}
          >
            Three Layers of
            <span className="text-blue-600"> Unbreakable</span> Security
          </h2>
          <p
            className="text-slate-500 text-lg max-w-xl mx-auto font-medium"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)", transition: "all 0.5s ease 0.2s" }}
          >
            Every file CypherCloud handles is encrypted, sharded, and distributed — automatically, with zero configuration from you.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative bg-white rounded-2xl p-8 shadow-sm cursor-default"
              style={{
                border: `1px solid ${f.accent.border}`,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.55s ease ${0.15 + i * 0.13}s, transform 0.55s ease ${0.15 + i * 0.13}s, box-shadow 0.3s, border-color 0.3s`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = f.accent.hoverBorder;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px ${f.accent.glow}`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = f.accent.border;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              {/* Hover bg wash */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
                style={{ background: f.accent.bg }}
              />

              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: f.accent.icon, color: f.accent.text }}
                >
                  {f.icon}
                </div>
                <span
                  className="inline-block text-[10px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full mb-3"
                  style={{ background: f.accent.badgeBg, color: f.accent.badgeText }}
                >
                  {f.badge}
                </span>
                <h3 className="text-lg font-black text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{f.desc}</p>
                <div
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                >
                  Learn more
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
