import { useState } from "react";
import { registerGuest } from "../api";

export default function GuestPage() {
  const [name, setName] = useState("");
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setLoading(true);

    try {
      const registration = await registerGuest({ name, song, artist });
      setSuccess(registration);
      setName("");
      setSong("");
      setArtist("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <p className="hero__eyebrow">You're up next… maybe</p>
        <h1>Join the queue</h1>
        <p className="hero__sub">
          Enter your name and song choice. The host will call you to the stage when it's your turn.
        </p>
      </div>

      <form className="card form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            required
            autoComplete="name"
          />
        </label>

        <label className="field">
          <span>Song title</span>
          <input
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="e.g. Bohemian Rhapsody"
            required
          />
        </label>

        <label className="field">
          <span>Artist</span>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Queen"
            required
          />
        </label>

        {error && <p className="message message--error">{error}</p>}

        {success && (
          <div className="message message--success">
            <strong>You're in the queue!</strong>
            <p>
              {success.name} — <em>{success.song}</em> by {success.artist}
            </p>
          </div>
        )}

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? "Signing up…" : "Sign me up 🎵"}
        </button>
      </form>
    </div>
  );
}
