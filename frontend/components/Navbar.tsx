"use client";

import React, { useState } from "react";
import { SearchIcon, PlusIcon, BellIcon } from "./Icons";

interface NavbarProps {
  onUpload?: () => void;
}

export default function Navbar({ onUpload }: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="flex  justify-between items-center gap-4 px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-20">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <SearchIcon
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search files, shards, logs…" 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      <div className="flex items-center gap-2.5 ml-auto">
        {/* Create New button */}
        {/* <button
          onClick={onUpload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-blue-200"
        >
          <PlusIcon size={15} />
          <span>Create New</span>
        </button> */}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserOpen(false);
            }}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all relative"
          >
            <BellIcon size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-30">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Notifications</p>
              </div>
              {[
                { msg: "Shard reconstruction verified", time: "2m ago", dot: "bg-emerald-400" },
                { msg: "New file encrypted & distributed", time: "8m ago", dot: "bg-emerald-400" },
                { msg: "Login from new IP detected", time: "21m ago", dot: "bg-amber-400" },
                { msg: "Key rotation completed", time: "1h ago", dot: "bg-blue-400" },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                  <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                  <div>
                    <p className="text-xs text-slate-700 font-medium">{n.msg}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setUserOpen(!userOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-white text-xs font-black shadow">
              RK
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-700 leading-none">Raj Kumar</p>
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-slate-400">
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-30">
              {["My Profile", "API Keys", "Billing", "Team Settings"].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {item}
                </button>
              ))}
              <div className="border-t border-slate-100">
                <button className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
