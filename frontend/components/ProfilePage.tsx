import { useState } from "react";

const NAV_ITEMS = [
  { icon: "grid", label: "Dashboard" },
  { icon: "upload", label: "Upload" },
  { icon: "file", label: "My Files" },
];
const STORAGE_ITEMS = [
  { icon: "star", label: "Favourites" },
  { icon: "share2", label: "Shared" },
  { icon: "trash2", label: "Recycle Bin" },
  { icon: "zap", label: "Deep Clean" },
];

function Icon({ name, size = 16, color = "currentColor", strokeWidth = 1.8 }) {
  const s = { width: size, height: size, display: "block" };
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    grid: <svg style={s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    upload: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    file: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    star: <svg style={s} viewBox="0 0 24 24" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    share2: <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    trash2: <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    zap: <svg style={s} viewBox="0 0 24 24" {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    user: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    bell: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    shield: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    key: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
    edit2: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
    camera: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    check: <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    chevronRight: <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    globe: <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    lock: <svg style={s} viewBox="0 0 24 24" {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    moon: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  };
  return icons[name] || null;
}

const TABS = ["Profile", "Security", "Notifications", "Preferences"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState({ uploads: true, shares: true, storage: false, updates: true });
  const [form, setForm] = useState({ name: "Shivansh", email: "shivansh@cyphercloud.io", phone: "+91 98765 43210", bio: "Engineering student & cloud enthusiast.", location: "New Delhi, India" });

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f4f5fb; font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        .page-enter { animation: fadeIn 0.3s ease both; }
        .saved-toast { animation: popIn 0.35s cubic-bezier(.22,1,.36,1) both; }
        .nav-item { display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;cursor:pointer;font-size:13.5px;font-weight:500;color:#7c84a0;transition:all 0.15s;text-decoration:none; }
        .nav-item:hover { background:#f0f1f8; color:#3b5bdb; }
        .nav-item.active { background:#3b5bdb; color:white; }
        .tab-btn { font-family:'Plus Jakarta Sans',sans-serif;font-size:13.5px;font-weight:500;color:#9aa0bc;border:none;background:none;cursor:pointer;padding:10px 18px;border-radius:9px;transition:all 0.15s;white-space:nowrap; }
        .tab-btn:hover { background:#f0f1f8; color:#4a5068; }
        .tab-btn.active { background:#eef1ff; color:#3b5bdb; font-weight:600; }
        .field-label { font-size:11.5px;font-weight:600;color:#9aa0bc;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px; }
        .field-value { font-size:14px;color:#1e2540;font-weight:500; }
        .edit-input { font-family:'Plus Jakarta Sans',sans-serif;font-size:13.5px;color:#1e2540;border:1.5px solid #e2e5ef;border-radius:8px;padding:9px 12px;width:100%;outline:none;background:#fafbff;transition:border-color 0.15s,box-shadow 0.15s; }
        .edit-input:focus { border-color:#3b5bdb;box-shadow:0 0 0 3px rgba(59,91,219,0.1); }
        .primary-btn { font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:13.5px;background:#3b5bdb;color:white;border:none;border-radius:8px;padding:9px 22px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.15s; }
        .primary-btn:hover { background:#3451c7;box-shadow:0 4px 14px rgba(59,91,219,0.35);transform:translateY(-1px); }
        .ghost-btn { font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;font-size:13.5px;background:transparent;color:#7c84a0;border:1.5px solid #e2e5ef;border-radius:8px;padding:9px 18px;cursor:pointer;transition:all 0.15s; }
        .ghost-btn:hover { border-color:#c5cae0;color:#4a5068;background:#f5f6fb; }
        .toggle { position:relative;width:40px;height:22px;cursor:pointer;flex-shrink:0; }
        .toggle input { opacity:0;width:0;height:0; }
        .toggle-track { position:absolute;inset:0;border-radius:20px;background:#e2e5ef;transition:background 0.2s; }
        .toggle input:checked + .toggle-track { background:#3b5bdb; }
        .toggle-thumb { position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:white;box-shadow:0 1px 4px rgba(0,0,0,0.18);transition:transform 0.2s; }
        .toggle input:checked ~ .toggle-thumb { transform:translateX(18px); }
        .card { background:white;border-radius:14px;border:1px solid #eef0f7;overflow:hidden; }
        .section-title { font-size:14px;font-weight:700;color:#1e2540;margin-bottom:4px; }
        .section-sub { font-size:12.5px;color:#9aa0bc; }
        .divider { height:1px;background:#f3f4fa; }
        .danger-btn { font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:13px;background:#fff1f1;color:#e53e3e;border:1.5px solid #fecaca;border-radius:8px;padding:9px 18px;cursor:pointer;transition:all 0.15s; }
        .danger-btn:hover { background:#fee2e2; }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:"#f4f5fb" }}>

        {/* Sidebar */}
        <div style={{ width:220, background:"white", borderRight:"1px solid #eef0f7", padding:"20px 14px", display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:9,padding:"4px 8px 20px" }}>
            <div style={{ width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#3b5bdb,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span style={{ fontSize:15,fontWeight:800,color:"#1e2540",letterSpacing:"-0.02em" }}>Cypher <span style={{color:"#3b5bdb"}}>Cloud</span></span>
          </div>

          {NAV_ITEMS.map(n => (
            <div key={n.label} className={`nav-item${n.label==="Dashboard"?" ":""}`}>
              <Icon name={n.icon} size={15} />{n.label}
            </div>
          ))}

          <div style={{ fontSize:11,fontWeight:700,color:"#c5cade",textTransform:"uppercase",letterSpacing:"0.1em",padding:"14px 14px 6px" }}>Storage</div>

          {STORAGE_ITEMS.map(n => (
            <div key={n.label} className="nav-item"><Icon name={n.icon} size={15} />{n.label}</div>
          ))}

          <div style={{ flex:1 }} />

          {/* Profile nav item - active */}
          <div className="nav-item active" style={{ marginBottom:4 }}>
            <Icon name="user" size={15} color="white" />My Profile
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex:1, padding:"32px 36px", overflowY:"auto" }}>

          {/* Top bar */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28 }}>
            <div>
              <h1 style={{ fontSize:22,fontWeight:800,color:"#1e2540",letterSpacing:"-0.02em" }}>My Profile</h1>
              <p style={{ fontSize:13,color:"#9aa0bc",marginTop:2 }}>Manage your personal info and account settings</p>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              {saved && (
                <div className="saved-toast" style={{ display:"flex",alignItems:"center",gap:6,background:"#f0fff4",border:"1.5px solid #bbf7d0",borderRadius:8,padding:"7px 14px",fontSize:13,fontWeight:600,color:"#16a34a" }}>
                  <Icon name="check" size={14} color="#16a34a" />Changes saved
                </div>
              )}
              <div style={{ width:36,height:36,borderRadius:10,background:"#f0f1f8",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative" }}>
                <Icon name="bell" size={16} color="#7c84a0" />
                <div style={{ position:"absolute",top:8,right:9,width:7,height:7,borderRadius:"50%",background:"#ef4444",border:"2px solid white" }} />
              </div>
              <div style={{ width:36,height:36,borderRadius:10,background:"#3b5bdb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",cursor:"pointer" }}>S</div>
            </div>
          </div>

          {/* Profile hero card */}
          <div className="card page-enter" style={{ marginBottom:20 }}>
            {/* Banner */}
            <div style={{ height:100,background:"linear-gradient(120deg,#3b5bdb 0%,#6366f1 50%,#0ea5e9 100%)",position:"relative" }}>
              <div style={{ position:"absolute",inset:0,opacity:0.15,backgroundImage:"radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",backgroundSize:"40px 40px" }} />
            </div>

            <div style={{ padding:"0 28px 24px",position:"relative" }}>
              {/* Avatar */}
              <div style={{ position:"relative",width:76,height:76,marginTop:-38,marginBottom:12 }}>
                <div style={{ width:76,height:76,borderRadius:18,background:"linear-gradient(135deg,#3b5bdb,#6366f1)",border:"3px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,color:"white",boxShadow:"0 4px 16px rgba(59,91,219,0.3)" }}>S</div>
                <div style={{ position:"absolute",bottom:-2,right:-2,width:22,height:22,borderRadius:7,background:"#3b5bdb",border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                  <Icon name="camera" size={11} color="white" />
                </div>
              </div>

              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:20,fontWeight:800,color:"#1e2540",letterSpacing:"-0.02em" }}>Shivansh Ranjan</div>
                  <div style={{ fontSize:13,color:"#9aa0bc",marginTop:2 }}>shivansh@cyphercloud.io</div>
                  <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:8 }}>
                    <span style={{ fontSize:12,fontWeight:600,background:"#eef1ff",color:"#3b5bdb",padding:"3px 10px",borderRadius:20 }}>Free Plan</span>
                    <span style={{ fontSize:12,color:"#9aa0bc" }}>·</span>
                    <span style={{ fontSize:12,color:"#9aa0bc" }}>Joined Mar 2026</span>
                  </div>
                </div>
                {!editMode ? (
                  <button className="ghost-btn" onClick={() => setEditMode(true)} style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <Icon name="edit2" size={13} />Edit Profile
                  </button>
                ) : (
                  <div style={{ display:"flex",gap:8 }}>
                    <button className="ghost-btn" onClick={() => setEditMode(false)}>Cancel</button>
                    <button className="primary-btn" onClick={handleSave}><Icon name="check" size={13} color="white" />Save</button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div style={{ display:"flex",gap:24,marginTop:20,paddingTop:20,borderTop:"1px solid #f3f4fa" }}>
                {[["2", "Files"], ["8.55 MB", "Used"], ["3", "Buckets"], ["0", "Shared"]].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontSize:18,fontWeight:800,color:"#1e2540",letterSpacing:"-0.02em" }}>{val}</div>
                    <div style={{ fontSize:12,color:"#9aa0bc",marginTop:1 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex",gap:4,marginBottom:20,background:"white",padding:"6px",borderRadius:12,border:"1px solid #eef0f7",width:"fit-content" }}>
            {TABS.map(t => (
              <button key={t} className={`tab-btn${activeTab===t?" active":""}`} onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "Profile" && (
            <div className="page-enter" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              {/* Personal info */}
              <div className="card" style={{ padding:24, gridColumn:"1 / -1" }}>
                <div style={{ marginBottom:20 }}>
                  <div className="section-title">Personal Information</div>
                  <div className="section-sub">Your basic account details</div>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
                  {[
                    { key:"name", label:"Full Name", icon:"user" },
                    { key:"email", label:"Email Address", icon:"globe" },
                    { key:"phone", label:"Phone Number", icon:"globe" },
                    { key:"location", label:"Location", icon:"globe" },
                  ].map(f => (
                    <div key={f.key}>
                      <div className="field-label">{f.label}</div>
                      {editMode ? (
                        <input className="edit-input" value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))} />
                      ) : (
                        <div className="field-value">{form[f.key]}</div>
                      )}
                    </div>
                  ))}
                  <div style={{ gridColumn:"1 / -1" }}>
                    <div className="field-label">Bio</div>
                    {editMode ? (
                      <textarea className="edit-input" rows={3} value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))} style={{ resize:"none" }} />
                    ) : (
                      <div className="field-value">{form.bio}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Storage card */}
              <div className="card" style={{ padding:24 }}>
                <div style={{ marginBottom:16 }}>
                  <div className="section-title">Storage Usage</div>
                  <div className="section-sub">8.55 MB of 15 MB used</div>
                </div>
                <div style={{ height:8,background:"#f3f4fa",borderRadius:99,overflow:"hidden",marginBottom:14 }}>
                  <div style={{ height:"100%",width:"57%",background:"linear-gradient(90deg,#f97316,#ef4444)",borderRadius:99 }} />
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {[["Documents","#f97316","57%","8.55 MB"],["Photos","#0ea5e9","1%","0.22 MB"],["Other","#6366f1","42%","3.07 MB"]].map(([lbl,clr,pct,sz]) => (
                    <div key={lbl} style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:8,height:8,borderRadius:"50%",background:clr,flexShrink:0 }} />
                      <div style={{ flex:1,fontSize:13,color:"#4a5068",fontWeight:500 }}>{lbl}</div>
                      <div style={{ fontSize:12,color:"#9aa0bc" }}>{pct}</div>
                      <div style={{ fontSize:13,fontWeight:600,color:"#1e2540",minWidth:60,textAlign:"right" }}>{sz}</div>
                    </div>
                  ))}
                </div>
                <button className="primary-btn" style={{ marginTop:18,width:"100%",justifyContent:"center" }}>Upgrade Plan</button>
              </div>

              {/* Activity card */}
              <div className="card" style={{ padding:24 }}>
                <div style={{ marginBottom:16 }}>
                  <div className="section-title">Recent Activity</div>
                  <div className="section-sub">Your last actions</div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
                  {[
                    { action:"Uploaded file", detail:"Software Project.pdf", time:"2 hrs ago", dot:"#3b5bdb" },
                    { action:"Shared file", detail:"Team20_Presentation.pptx", time:"5 hrs ago", dot:"#10b981" },
                    { action:"Encrypted file", detail:"patReciept.pdf", time:"Yesterday", dot:"#f97316" },
                    { action:"Logged in", detail:"New Delhi, India", time:"Mar 08, 2026", dot:"#6366f1" },
                  ].map((a, i, arr) => (
                    <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"11px 0",borderBottom: i < arr.length-1 ? "1px solid #f3f4fa" : "none" }}>
                      <div style={{ width:8,height:8,borderRadius:"50%",background:a.dot,marginTop:5,flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13.5,fontWeight:600,color:"#1e2540" }}>{a.action}</div>
                        <div style={{ fontSize:12,color:"#9aa0bc" }}>{a.detail}</div>
                      </div>
                      <div style={{ fontSize:11.5,color:"#c5cade",whiteSpace:"nowrap" }}>{a.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="page-enter" style={{ display:"flex",flexDirection:"column",gap:16 }}>
              <div className="card" style={{ padding:24 }}>
                <div className="section-title" style={{ marginBottom:4 }}>Password</div>
                <div className="section-sub" style={{ marginBottom:20 }}>Last changed 30 days ago</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
                  {["Current Password","New Password","Confirm Password"].map((lbl,i) => (
                    <div key={lbl} style={{ gridColumn: i===2 ? "1" : "auto" }}>
                      <div className="field-label">{lbl}</div>
                      <input type="password" className="edit-input" placeholder="••••••••" />
                    </div>
                  ))}
                </div>
                <button className="primary-btn"><Icon name="key" size={14} color="white" />Update Password</button>
              </div>

              <div className="card" style={{ padding:24 }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div>
                    <div className="section-title">Two-Factor Authentication</div>
                    <div className="section-sub">Add an extra layer of security to your account</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(v=>!v)} />
                    <div className="toggle-track" />
                    <div className="toggle-thumb" />
                  </label>
                </div>
                {twoFA && (
                  <div style={{ marginTop:16,padding:14,background:"#f0fff4",borderRadius:10,border:"1.5px solid #bbf7d0",fontSize:13,color:"#16a34a",fontWeight:500,display:"flex",gap:8,alignItems:"center" }}>
                    <Icon name="check" size={14} color="#16a34a" />2FA is enabled. Your account is more secure.
                  </div>
                )}
              </div>

              <div className="card" style={{ padding:24 }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4 }}>
                  <div>
                    <div className="section-title" style={{ color:"#e53e3e" }}>Danger Zone</div>
                    <div className="section-sub">Irreversible account actions</div>
                  </div>
                </div>
                <div className="divider" style={{ margin:"16px 0" }} />
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:13.5,fontWeight:600,color:"#1e2540" }}>Delete Account</div>
                    <div style={{ fontSize:12,color:"#9aa0bc",marginTop:2 }}>Permanently remove your account and all data</div>
                  </div>
                  <button className="danger-btn">Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="page-enter card" style={{ padding:24 }}>
              <div className="section-title" style={{ marginBottom:4 }}>Notification Preferences</div>
              <div className="section-sub" style={{ marginBottom:20 }}>Choose what you want to be notified about</div>
              <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
                {[
                  { key:"uploads", label:"File Uploads", desc:"When your files finish uploading" },
                  { key:"shares", label:"File Shares", desc:"When someone shares a file with you" },
                  { key:"storage", label:"Storage Alerts", desc:"When you're running low on storage" },
                  { key:"updates", label:"Product Updates", desc:"New features and improvements" },
                ].map((n, i, arr) => (
                  <div key={n.key} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0",borderBottom: i < arr.length-1 ? "1px solid #f3f4fa" : "none" }}>
                    <div>
                      <div style={{ fontSize:14,fontWeight:600,color:"#1e2540" }}>{n.label}</div>
                      <div style={{ fontSize:12.5,color:"#9aa0bc",marginTop:2 }}>{n.desc}</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={notifs[n.key]} onChange={() => setNotifs(p => ({...p, [n.key]: !p[n.key]}))} />
                      <div className="toggle-track" />
                      <div className="toggle-thumb" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Preferences" && (
            <div className="page-enter" style={{ display:"flex",flexDirection:"column",gap:16 }}>
              <div className="card" style={{ padding:24 }}>
                <div className="section-title" style={{ marginBottom:4 }}>Appearance</div>
                <div className="section-sub" style={{ marginBottom:20 }}>Customize how Cypher Cloud looks</div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:"1px solid #f3f4fa" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:34,height:34,borderRadius:9,background:"#f0f1f8",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <Icon name="moon" size={16} color="#7c84a0" />
                    </div>
                    <div>
                      <div style={{ fontSize:14,fontWeight:600,color:"#1e2540" }}>Dark Mode</div>
                      <div style={{ fontSize:12,color:"#9aa0bc" }}>Switch to a darker interface</div>
                    </div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(v=>!v)} />
                    <div className="toggle-track" />
                    <div className="toggle-thumb" />
                  </label>
                </div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:34,height:34,borderRadius:9,background:"#f0f1f8",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <Icon name="globe" size={16} color="#7c84a0" />
                    </div>
                    <div>
                      <div style={{ fontSize:14,fontWeight:600,color:"#1e2540" }}>Language</div>
                      <div style={{ fontSize:12,color:"#9aa0bc" }}>English (US)</div>
                    </div>
                  </div>
                  <button className="ghost-btn" style={{ display:"flex",alignItems:"center",gap:5,fontSize:13 }}>Change <Icon name="chevronRight" size={13} /></button>
                </div>
              </div>

              <div className="card" style={{ padding:24 }}>
                <div className="section-title" style={{ marginBottom:4 }}>Privacy</div>
                <div className="section-sub" style={{ marginBottom:20 }}>Control your data and visibility</div>
                {[
                  { label:"Profile Visibility", desc:"Who can see your profile", value:"Private" },
                  { label:"Activity Status", desc:"Show when you're active", value:"Friends only" },
                ].map((item, i, arr) => (
                  <div key={item.label} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom: i < arr.length-1 ? "1px solid #f3f4fa" : "none" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:34,height:34,borderRadius:9,background:"#f0f1f8",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <Icon name="lock" size={16} color="#7c84a0" />
                      </div>
                      <div>
                        <div style={{ fontSize:14,fontWeight:600,color:"#1e2540" }}>{item.label}</div>
                        <div style={{ fontSize:12,color:"#9aa0bc" }}>{item.desc}</div>
                      </div>
                    </div>
                    <button className="ghost-btn" style={{ display:"flex",alignItems:"center",gap:5,fontSize:13 }}>{item.value} <Icon name="chevronRight" size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
