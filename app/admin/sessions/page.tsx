"use client";

import { useEffect, useState } from "react";

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10">Loading active sessions...</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Active Chat Sessions</h1>
      <table className="min-w-full bg-transparent border border-gray-700">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4 border-b border-gray-700 text-left">User ID</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Character</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Started At</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Msgs Used / Max</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Dur. (Sec)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {sessions.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">No active sessions</td>
            </tr>
          ) : (
            sessions.map((s) => (
              <tr key={s._id}>
                <td className="py-2 px-4">{s.userId}</td>
                <td className="py-2 px-4 capitalize">{s.characterName}</td>
                <td className="py-2 px-4">{new Date(s.startTime).toLocaleString()}</td>
                <td className="py-2 px-4 text-center">
                  <span className={`${s.messagesUsed >= s.maxMessages ? 'text-red-500 font-bold' : ''}`}>
                    {s.messagesUsed}
                  </span> / {s.maxMessages}
                </td>
                <td className="py-2 px-4">{s.durationSec}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
