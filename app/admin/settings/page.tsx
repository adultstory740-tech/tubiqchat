"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultSessionDuration: Number(settings.defaultSessionDuration),
        defaultMaxMessages: Number(settings.defaultMaxMessages),
        inactivityTimeout: Number(settings.inactivityTimeout),
      }),
    });
    alert("Settings saved!");
    setLoading(false);
  };

  if (loading || !settings) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Global Session Settings</h1>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium">Default Session Duration (Minutes)</label>
          <input
            type="number"
            className="border p-2 w-full rounded mt-1 bg-transparent border-gray-600"
            value={settings.defaultSessionDuration}
            onChange={(e) => setSettings({ ...settings, defaultSessionDuration: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Messages Per Session</label>
          <input
            type="number"
            className="border p-2 w-full rounded mt-1 bg-transparent border-gray-600"
            value={settings.defaultMaxMessages}
            onChange={(e) => setSettings({ ...settings, defaultMaxMessages: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Inactivity Timeout (Seconds)</label>
          <input
            type="number"
            className="border p-2 w-full rounded mt-1 bg-transparent border-gray-600"
            value={settings.inactivityTimeout}
            onChange={(e) => setSettings({ ...settings, inactivityTimeout: e.target.value })}
          />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full mt-4" disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
