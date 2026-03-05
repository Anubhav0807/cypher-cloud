"use client";

import React from "react";
import { folders } from "@/lib/data";
import { FolderIcon, DotsIcon } from "./Icons";

export default function FoldersGrid({types}:any) {

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-black text-slate-800">Folders</h2>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="group relative p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
          >
            {/* Background blob */}
            <div
              className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500"
              style={{ backgroundColor: folder.color }}
            />

            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200"
                style={{ backgroundColor: folder.bgColor }}
              >
                <FolderIcon size={20} style={{ color: folder.iconColor }} />
              </div>
              <button className="text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100">
                <DotsIcon size={16} />
              </button>
            </div>

            <p className="text-sm font-bold text-slate-700 leading-tight">{folder.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{folder.count.toLocaleString()} files</p>

            <div
              className="absolute bottom-0 left-0 h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(90deg, ${folder.color}90, transparent)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
