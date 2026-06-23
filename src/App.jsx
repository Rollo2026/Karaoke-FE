import { Routes, Route, Link, useLocation } from "react-router-dom";
import GuestPage from "./pages/GuestPage";
import HostPage from "./pages/HostPage";
import { isApiConfigured } from "./api";

export default function App() {
  const location = useLocation();
  const isHost = location.pathname.startsWith("/host");

  return (
    <div className="app">
      <div className="bg-glow bg-glow--left" />
      <div className="bg-glow bg-glow--right" />

      <header className="header">
        <Link to="/" className="logo">
          <span className="logo__mic">🎤</span>
          <span>Karaoke Night</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={!isHost ? "nav__link nav__link--active" : "nav__link"}>
            Register
          </Link>
          <Link to="/host" className={isHost ? "nav__link nav__link--active" : "nav__link"}>
            Host
          </Link>
        </nav>
      </header>

      {!isApiConfigured() && (
        <div className="banner banner--warn">
          Set <code>VITE_API_URL</code> in your environment variables to connect to the backend.
        </div>
      )}

      <main className="main">
        <Routes>
          <Route path="/" element={<GuestPage />} />
          <Route path="/host" element={<HostPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Sign up · Get called · Sing your heart out</p>
      </footer>
    </div>
  );
}
