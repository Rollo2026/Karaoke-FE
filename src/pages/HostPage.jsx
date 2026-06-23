import { useCallback, useEffect, useState } from "react";
import {
  announceGuest,
  fetchRegistrations,
  pickRandomGuest,
  resetQueue,
  clearQueue,
} from "../api";

export default function HostPage() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ total: 0, waiting: 0, called: 0 });
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [announcing, setAnnouncing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await fetchRegistrations();
      setRegistrations(data.registrations);
      setStats(data.stats);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  async function handlePickRandom() {
    setLoading(true);
    setError("");
    try {
      const guest = await pickRandomGuest();
      setCurrent(guest);
      await load();
    } catch (err) {
      setError(err.message);
      setCurrent(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnnounce() {
    if (!current) return;
    setAnnouncing(true);
    setError("");
    try {
      await announceGuest(current);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnnouncing(false);
    }
  }

  async function handleReset() {
    if (!confirm("Mark all guests as waiting again?")) return;
    setLoading(true);
    try {
      await resetQueue();
      setCurrent(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    if (!confirm("Delete ALL registrations? This cannot be undone.")) return;
    setLoading(true);
    try {
      await clearQueue();
      setCurrent(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page page--host">
      <div className="hero">
        <p className="hero__eyebrow">Host panel</p>
        <h1>Call the next singer</h1>
        <p className="hero__sub">
          Pick a random guest from the queue, then announce them over the speakers.
        </p>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat__value">{stats.total}</span>
          <span className="stat__label">Total</span>
        </div>
        <div className="stat stat--waiting">
          <span className="stat__value">{stats.waiting}</span>
          <span className="stat__label">Waiting</span>
        </div>
        <div className="stat stat--called">
          <span className="stat__value">{stats.called}</span>
          <span className="stat__label">Performed</span>
        </div>
      </div>

      {error && <p className="message message--error">{error}</p>}

      <div className="card host-actions">
        <button
          className="btn btn--primary btn--large"
          onClick={handlePickRandom}
          disabled={loading || stats.waiting === 0}
        >
          {loading ? "Picking…" : "🎲 Pick random guest"}
        </button>

        {current && (
          <div className="now-playing">
            <p className="now-playing__label">Now calling</p>
            <h2 className="now-playing__name">{current.name}</h2>
            <p className="now-playing__song">
              <em>{current.song}</em> — {current.artist}
            </p>
            <button
              className="btn btn--accent btn--large"
              onClick={handleAnnounce}
              disabled={announcing}
            >
              {announcing ? "Announcing…" : "📢 Announce via microphone"}
            </button>
            <p className="hint">
              Uses your browser's text-to-speech. Connect speakers for the venue.
            </p>
          </div>
        )}
      </div>

      <div className="card queue">
        <div className="queue__header">
          <h2>Queue</h2>
          <div className="queue__tools">
            <button className="btn btn--ghost btn--small" onClick={load}>
              Refresh
            </button>
            <button className="btn btn--ghost btn--small" onClick={handleReset} disabled={loading}>
              Reset all
            </button>
            <button className="btn btn--ghost btn--small btn--danger" onClick={handleClear} disabled={loading}>
              Clear all
            </button>
          </div>
        </div>

        {registrations.length === 0 ? (
          <p className="empty">No registrations yet. Share the guest link!</p>
        ) : (
          <ul className="queue__list">
            {registrations.map((r) => (
              <li key={r.id} className={r.called ? "queue__item queue__item--called" : "queue__item"}>
                <div>
                  <strong>{r.name}</strong>
                  <span className="queue__song">
                    {r.song} — {r.artist}
                  </span>
                </div>
                <span className={`badge ${r.called ? "badge--called" : "badge--waiting"}`}>
                  {r.called ? "Done" : "Waiting"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
