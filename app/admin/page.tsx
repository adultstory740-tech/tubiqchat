"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);

  const [newPlan, setNewPlan] = useState({ name: "", price: 0, coins: 0, durationMinutes: 15, messageLimit: 50 });

  const [editingUser, setEditingUser] = useState<any>(null);
  const [settings, setSettings] = useState({ defaultSessionDuration: 10, defaultMaxMessages: 50, inactivityTimeout: 20 });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchStats();
      fetchPlans();
      fetchSettings();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("admin_token", data.token);
      setIsAuthenticated(true);
      fetchStats();
      fetchPlans();
      fetchSettings();
    } else {
      setLoginError(data.error || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setStats(null);
  };

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  };

  const fetchPlans = async () => {
    const res = await fetch("/api/admin/plans");
    const data = await res.json();
    setPlans(data);
  };

  const fetchSettings = async () => {
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    if (data) setSettings(data);
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    alert("Settings saved!");
  };

  // Plans Management
  const createPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlan)
    });
    fetchPlans();
    setNewPlan({ name: "", price: 0, coins: 0, durationMinutes: 15, messageLimit: 50 });
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
    fetchPlans();
  };

  // User Management
  const saveUserUpdate = async () => {
    if (!editingUser) return;
    await fetch(`/api/admin/users/${editingUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coins: editingUser.coins,
        sessionDuration: editingUser.sessionDuration,
        messageLimit: editingUser.messageLimit
      })
    });
    setEditingUser(null);
    fetchStats();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchStats();
  };

  // Sessions Management
  const forceEndSession = async (id: string) => {
    if (!confirm("Force end this chat session?")) return;
    await fetch(`/api/admin/sessions/${id}`, { method: "DELETE" });
    fetchStats();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white p-4">
        <form onSubmit={handleLogin} className="bg-[#1e293b] p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-sm flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Admin Panel</h1>
            <p className="text-sm text-gray-400 mt-2">Secure Login</p>
          </div>

          {loginError && <p className="text-red-400 text-sm font-bold text-center">{loginError}</p>}

          <input
            type="text"
            placeholder="Username"
            className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition"
            value={username} onChange={e => setUsername(e.target.value)} required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition"
            value={password} onChange={e => setPassword(e.target.value)} required
          />
          <button type="submit" className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-pink-500/25">
            Login
          </button>
        </form>
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-white min-h-screen bg-[#0f172a] animate-pulse">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col lg:flex-row">
      {/* Navigation (Sidebar on Desktop, Top slider on Mobile) */}
      <div className="bg-[#1e293b] border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:p-6 flex lg:flex-col lg:w-64 gap-4 lg:gap-8 sticky top-0 z-20 overflow-x-auto w-full lg:h-screen lg:overflow-y-auto no-scrollbar items-center lg:items-stretch shadow-md">
        <div className="flex-shrink-0 mr-4 lg:mr-0">
          <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">LoverChat</h1>
          <p className="hidden lg:block text-[10px] lg:text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">Admin Portal</p>
        </div>

        <nav className="flex lg:flex-col gap-2 flex-grow lg:flex-grow-0 min-w-max">
          {["overview", "users", "sessions", "plans", "settings"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-center lg:text-left px-4 py-2 lg:py-3 rounded-xl font-bold transition capitalize text-sm lg:text-base ${activeTab === tab ? "bg-pink-500/20 text-pink-400 border border-pink-500/30" : "hover:bg-white/5 text-gray-400"}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="text-center lg:text-left px-4 py-2 lg:py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition lg:mt-auto ml-auto lg:ml-0 text-sm lg:text-base whitespace-nowrap border lg:border-none border-red-500/20">
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 capitalize">{activeTab}</h2>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
              <div className="bg-[#1e293b] p-6 lg:p-8 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                <h2 className="text-gray-400 mb-2 font-bold uppercase tracking-widest text-[10px] lg:text-xs">Total Users</h2>
                <p className="text-3xl lg:text-5xl font-black">{stats.totalUsers}</p>
              </div>
              <div className="bg-[#1e293b] p-6 lg:p-8 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <h2 className="text-gray-400 mb-2 font-bold uppercase tracking-widest text-[10px] lg:text-xs">Global Economy (Coins)</h2>
                <p className="text-3xl lg:text-5xl font-black text-yellow-400">{stats.totalCoins}</p>
              </div>
              <div className="bg-[#1e293b] p-6 lg:p-8 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                <h2 className="text-gray-400 mb-2 font-bold uppercase tracking-widest text-[10px] lg:text-xs">Active Sessions</h2>
                <p className="text-3xl lg:text-5xl font-black text-green-400">{stats.activeSessions.length}</p>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="bg-[#1e293b] rounded-2xl border border-white/10 shadow-xl overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-black/40 text-gray-400 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="p-4 lg:p-5 font-bold">User / GuestID</th>
                      <th className="p-4 lg:p-5 font-bold">Coins</th>
                      <th className="p-4 lg:p-5 font-bold">Current Plan</th>
                      <th className="p-4 lg:p-5 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.users.map((u: any) => (
                      <tr key={u._id} className="border-t border-white/5 hover:bg-white/5 transition">
                        <td className="p-4 lg:p-5 font-mono text-xs opacity-70">
                          {u.guestId || u._id}
                        </td>
                        <td className="p-4 lg:p-5 text-yellow-400 font-bold">{u.coins}</td>
                        <td className="p-4 lg:p-5 text-gray-300 font-semibold">{u.planName || "Free"}</td>
                        <td className="p-4 lg:p-5 flex justify-center gap-2 lg:gap-3">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500 text-xs px-2 lg:px-3 py-1 pb-1.5 rounded-lg border border-blue-500/30 transition hover:text-white font-bold whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500 text-xs px-2 lg:px-3 py-1 pb-1.5 rounded-lg border border-red-500/30 transition hover:text-white font-bold whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SESSIONS TAB */}
          {activeTab === "sessions" && (
            <div className="bg-[#1e293b] rounded-2xl border border-white/10 shadow-xl overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm min-w-[700px]">
                  <thead className="bg-black/40 text-gray-400 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="p-4 lg:p-5 font-bold">Character</th>
                      <th className="p-4 lg:p-5 font-bold">User ID</th>
                      <th className="p-4 lg:p-5 font-bold">Messages Used</th>
                      <th className="p-4 lg:p-5 font-bold">End Time</th>
                      <th className="p-4 lg:p-5 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.activeSessions.map((sess: any) => (
                      <tr key={sess._id} className="border-t border-white/5 hover:bg-white/5 transition">
                        <td className="p-4 lg:p-5 font-bold text-pink-400 capitalize">{sess.characterName}</td>
                        <td className="p-4 lg:p-5 font-mono text-[10px] opacity-50">{sess.userId}</td>
                        <td className="p-4 lg:p-5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 lg:w-24 h-2 bg-black rounded-full overflow-hidden shrink-0">
                              <div className="h-full bg-pink-500" style={{ width: `${(sess.messagesUsed / sess.maxMessages) * 100}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{sess.messagesUsed} / {sess.maxMessages}</span>
                          </div>
                        </td>
                        <td className="p-4 lg:p-5 text-gray-300 text-xs lg:text-sm whitespace-nowrap">
                          {new Date(sess.endTime).toLocaleTimeString()}
                        </td>
                        <td className="p-4 lg:p-5 flex justify-center">
                          <button
                            onClick={() => forceEndSession(sess._id)}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500 text-[10px] lg:text-xs px-2 lg:px-3 py-1 pb-1.5 rounded-lg border border-red-500/30 transition hover:text-white font-bold whitespace-nowrap"
                          >
                            Force End
                          </button>
                        </td>
                      </tr>
                    ))}
                    {stats.activeSessions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">No active sessions right now</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PLANS TAB */}
          {activeTab === "plans" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 border-none lg:border-none">
              <div className="bg-[#1e293b] p-6 lg:p-8 rounded-2xl border border-white/10 shadow-xl order-1">
                <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Create New Plan</h3>
                <form onSubmit={createPlan} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-1 block">Plan Name</label>
                    <input type="text" placeholder="e.g. VIP Pass" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition w-full" value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-1 block">Price ($)</label>
                      <input type="number" placeholder="0" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition w-full" value={newPlan.price || ""} onChange={e => setNewPlan({ ...newPlan, price: Number(e.target.value) })} required />
                    </div>
                    <div>
                      <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-1 block">Coins Given</label>
                      <input type="number" placeholder="0" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition w-full" value={newPlan.coins || ""} onChange={e => setNewPlan({ ...newPlan, coins: Number(e.target.value) })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-1 block">Duration (Mins)</label>
                      <input type="number" placeholder="15" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition w-full" value={newPlan.durationMinutes || ""} onChange={e => setNewPlan({ ...newPlan, durationMinutes: Number(e.target.value) })} required />
                    </div>
                    <div>
                      <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-1 block">Limit (Msgs)</label>
                      <input type="number" placeholder="50" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition w-full" value={newPlan.messageLimit || ""} onChange={e => setNewPlan({ ...newPlan, messageLimit: Number(e.target.value) })} required />
                    </div>
                  </div>
                  <button type="submit" className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg transition mt-2 shadow-lg shadow-pink-500/25">Create Published Plan</button>
                </form>
              </div>

              <div className="flex flex-col gap-4 order-2">
                {plans.map((p) => (
                  <div key={p._id} className="bg-[#1e293b] p-5 lg:p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/20 transition duration-500"></div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl lg:text-2xl font-black text-pink-400">{p.name}</h4>
                      <p className="text-lg lg:text-xl font-bold bg-white/10 px-3 py-1 rounded-lg">${p.price}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4 lg:mb-6 text-sm">
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-center px-1">
                        <span className="block text-yellow-400 font-bold text-base lg:text-lg">{p.coins}</span>
                        <span className="text-[8px] lg:text-[10px] text-gray-400 uppercase tracking-widest">Coins</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-center px-1">
                        <span className="block text-white font-bold text-base lg:text-lg">{p.durationMinutes}m</span>
                        <span className="text-[8px] lg:text-[10px] text-gray-400 uppercase tracking-widest">Time</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-center px-1">
                        <span className="block text-white font-bold text-base lg:text-lg">{p.messageLimit}</span>
                        <span className="text-[8px] lg:text-[10px] text-gray-400 uppercase tracking-widest">Msgs</span>
                      </div>
                    </div>
                    <button onClick={() => deletePlan(p._id)} className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-lg font-bold transition">Delete Plan</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="bg-[#1e293b] p-6 lg:p-8 rounded-2xl border border-white/10 shadow-xl max-w-2xl">
              <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6 text-pink-400">Global System Configurations</h3>
              <form onSubmit={saveSettings} className="flex flex-col gap-6">
                <div>
                  <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-2 block">Default Session Duration (Minutes)</label>
                  <input type="number" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition w-full" value={settings.defaultSessionDuration || ""} onChange={e => setSettings({ ...settings, defaultSessionDuration: Number(e.target.value) })} required />
                  <p className="text-[10px] text-gray-500 mt-1">Applied to sessions where user has not purchased a customized plan.</p>
                </div>
                <div>
                  <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-2 block">Default Max Messages</label>
                  <input type="number" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition w-full" value={settings.defaultMaxMessages || ""} onChange={e => setSettings({ ...settings, defaultMaxMessages: Number(e.target.value) })} required />
                  <p className="text-[10px] text-gray-500 mt-1">Total combined AI + User messages allowed per anonymous session limit.</p>
                </div>
                <div>
                  <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-2 block">Inactivity Timeout (Seconds)</label>
                  <input type="number" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none transition w-full" value={settings.inactivityTimeout || ""} onChange={e => setSettings({ ...settings, inactivityTimeout: Number(e.target.value) })} required />
                  <p className="text-[10px] text-gray-500 mt-1">Amount of idle seconds before the server automatically kicks out the user to secure the session.</p>
                </div>
                <button type="submit" className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg transition mt-4 shadow-lg shadow-pink-500/25">Save Global Settings</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-[#1e293b] border border-white/10 p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-sm lg:max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Edit User Configuration</h3>
            <p className="font-mono text-[10px] text-pink-400 mb-4 lg:mb-6 bg-pink-500/10 p-2 rounded truncate">{editingUser._id}</p>

            <div className="flex flex-col gap-4 mb-6 lg:mb-8 text-sm lg:text-base">
              <div>
                <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-1 block">Coin Balance</label>
                <input type="number" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none w-full text-yellow-400 font-bold"
                  value={editingUser.coins}
                  onChange={e => setEditingUser({ ...editingUser, coins: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-1 block">Session (Mins)</label>
                  <input type="number" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none w-full"
                    value={editingUser.sessionDuration || 15}
                    onChange={e => setEditingUser({ ...editingUser, sessionDuration: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-1 block">Limit (Msgs)</label>
                  <input type="number" className="bg-black/50 p-3 rounded-lg border border-white/5 focus:border-pink-500 outline-none w-full"
                    value={editingUser.messageLimit || 50}
                    onChange={e => setEditingUser({ ...editingUser, messageLimit: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-3 lg:gap-4">
              <button onClick={() => setEditingUser(null)} className="flex-1 bg-white/5 hover:bg-white/10 p-3 rounded-lg font-bold transition text-gray-300 text-sm lg:text-base">Cancel</button>
              <button onClick={saveUserUpdate} className="flex-1 bg-pink-600 hover:bg-pink-500 p-3 rounded-lg font-bold transition text-white shadow-lg shadow-pink-500/25 text-sm lg:text-base whitespace-nowrap">Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
