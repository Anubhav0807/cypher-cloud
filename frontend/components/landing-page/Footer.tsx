export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-900">Cypher<span className="text-blue-600">Cloud</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hybrid-encrypted, sharded, multi-cloud storage for enterprises that can't afford to compromise.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {[
              { heading: "Product", links: ["Features", "Security", "Multi-Cloud", "Changelog"] },
              { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { heading: "Legal", links: ["Privacy", "Terms", "Cookie Policy"] },
            ].map((group) => (
              <div key={group.heading}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{group.heading}</p>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors duration-150">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} CypherCloud Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-slate-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
