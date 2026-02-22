"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/92 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-300/40">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="text-[15px] font-black tracking-tight text-slate-900">
            Cypher<span className="text-blue-600">Cloud</span>
          </span>
        </div>

        {/* Nav links */}
        {/* <div className="hidden md:flex items-center gap-8">
          {["Features", "Security", "Multi-Cloud", "Docs"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div> */}

        {/* Auth CTAs */}
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
          <button className="text-sm bg-red-800 font-semibold text-white hover:bg-red-700 transition-colors px-3 py-1.5 rounded-lg">
            Sign In
          </button>
          </Link>
          <Link href="/sign-up">
          <button className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 px-4 py-2 rounded-xl shadow-md shadow-blue-300/40 flex items-center gap-1.5">
            Sign Up
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
