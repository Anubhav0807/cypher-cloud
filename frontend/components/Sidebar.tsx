"use client";

import React from "react";
import {
  DashboardIcon, FilesIcon, ShardsIcon, CloudIcon, ShieldIcon,
  LockIcon, SettingsIcon, ZapIcon, StarIcon, ShareIcon, TrashIcon, BroomIcon,
} from "./Icons";
import { UploadIcon } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", Icon: DashboardIcon,lk:"dashboard" },
  { id: "upload", label: "Upload", Icon: UploadIcon,lk:"upload"},
  { id: "files", label: "My Files", Icon: FilesIcon,lk:"myfiles" },
];

const secondaryNav = [
  { id: "favourites", label: "Favourites", Icon: StarIcon,lk:"favourites"},
  { id: "shared", label: "Shared", Icon: ShareIcon,lk:"shared"},
  { id: "trash", label: "Recycle Bin", Icon: TrashIcon,lk:"trash"},
  { id: "clean", label: "Deep Clean", Icon: BroomIcon,lk:"clean"},
];

export default function Sidebar({ active, setActive }: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-200">
          <ZapIcon size={15} className="text-white" />
        </div>
        <div>
          <span className="text-base font-black tracking-tight text-slate-800">Cypher</span>
          <span className="text-base font-black tracking-tight text-blue-600"> Cloud</span>
        </div>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, Icon, badge,lk}) => {
          const isActive = active === id;
          return (
            <Link key={id} href={`/${lk}`}>
            <button
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-blue-300 -ml-3" />
              )}
              <Icon size={17} />
              <span>{label}</span>
              {badge && !isActive && (
                <span className="ml-auto w-5 h-5 rounded-full bg-red-100 text-red-500 text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
            </Link>
          );
        })}

        <div className="pt-3 pb-1">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-1">Storage</p>
        </div>

        {secondaryNav.map(({ id, label, Icon,lk}) => {
          const isActive = active === id;
          return (
            <Link key={id} href={`/${lk}`}>
            <button
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      {/* <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 text-white relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10" />
        <div className="absolute -right-2 -bottom-4 w-10 h-10 rounded-full bg-white/10" />
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2">
            <ZapIcon size={15} className="text-white" />
          </div>
          <p className="text-xs font-semibold leading-snug mb-1">Upgrade to <strong>Pro</strong></p>
          <p className="text-[10px] text-blue-100 mb-3">Unlimited encrypted storage</p>
          <button className="w-full py-1.5 rounded-lg bg-white text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div> */}
    </aside>
  );
}
