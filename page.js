"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "s1-admin-password";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      fetchRecords(saved);
    }
  }, []);

  async function fetchRecords(pw) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/attendance", {
        headers: { "x-admin-password": pw },
      });
      if (res.status === 401) {
        setAuthed(false);
        sessionStorage.removeItem(STORAGE_KEY);
        setError("Incorrect password.");
        return;
      }
      const data = await res.json();
      setRecords(data.records || []);
      setAuthed(true);
      sessionStorage.setItem(STORAGE_KEY, pw);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    fetchRecords(password);
  }

  async function handleReset() {
    if (!confirm("This will permanently delete all recorded attendance. Continue?")) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        setRecords([]);
      } else {
        setError("Reset failed. Check your password.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <div className="wrap">
        <h1>Admin Dashboard</h1>
        <div className="subtitle">Enter password to access responses</div>
        <div className="card">
          <form onSubmit={handleLogin}>
            <label htmlFor="pw">Password</label>
            <input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Checking…" : "Login"}
            </button>
          </form>
          {error && <div className="msg err">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="wrap wide">
      <h1>Admin Dashboard</h1>
      <div className="subtitle">S1 Student Attendance — Surgical Rotation</div>

      <div className="card">
        <div className="toolbar">
          <div className="count">{records.length} response{records.length === 1 ? "" : "s"}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="secondary"
              style={{ marginTop: 0, width: "auto", padding: "8px 14px" }}
              onClick={() => fetchRecords(password)}
              disabled={loading}
            >
              Refresh
            </button>
            <button
              className="danger"
              style={{ marginTop: 0, width: "auto", padding: "8px 14px" }}
              onClick={handleReset}
              disabled={loading}
            >
              Reset all
            </button>
          </div>
        </div>

        {records.length === 0 ? (
          <p style={{ color: "#666", marginTop: 20 }}>No responses yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Matric number</th>
                <th>Group</th>
                <th>Date</th>
                <th>Submitted at</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.matricNumber || "—"}</td>
                  <td>{r.group || "—"}</td>
                  <td>{r.date}</td>
                  <td>{new Date(r.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
