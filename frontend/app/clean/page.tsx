'use client'
import FilesTable from '@/components/FilesTable';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import React, { useState } from 'react'

export default function page() {
     const [activeNav, setActiveNav] = useState("clean");
  return (
    <div className='flex h-screen bg-slate-50 overflow-hidden'>
      <Sidebar active={activeNav} setActive={setActiveNav} />
       <div className="flex-1 flex flex-col min-w-0">
        <Navbar/>
         <div className="flex fllex-1 overflow-hidden">
          {/* ── Center content ──────────────────────────────── */}
          <main className="flex-1 overflow-y-auto p-5 xl:p-6 space-y-5">
                <FilesTable/>
          </main>
          </div>
       </div>
    </div>
  )
}
