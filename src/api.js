const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || "";

function adminHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (ADMIN_SECRET) {
    headers.Authorization = `Bearer ${ADMIN_SECRET}`;
  }
  return headers;
}

export async function registerGuest({ name, song, artist }) {
  const res = await fetch(`${API_URL}/api/registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, song, artist }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data.registration;
}

export async function fetchRegistrations() {
  const res = await fetch(`${API_URL}/api/registrations`, {
    headers: adminHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load registrations");
  return data;
}

export async function pickRandomGuest() {
  const res = await fetch(`${API_URL}/api/random`, {
    method: "POST",
    headers: adminHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not pick a guest");
  return data.registration;
}

export async function resetQueue() {
  const res = await fetch(`${API_URL}/api/admin`, {
    method: "POST",
    headers: adminHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Reset failed");
  return data;
}

export async function clearQueue() {
  const res = await fetch(`${API_URL}/api/admin`, {
    method: "DELETE",
    headers: adminHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Clear failed");
  return data;
}

export function announceGuest(registration) {
  if (!("speechSynthesis" in window)) {
    return Promise.reject(new Error("Speech not supported in this browser"));
  }

  const text = `Next up: ${registration.name}! Please come to the stage to sing ${registration.song} by ${registration.artist}.`;

  return new Promise((resolve, reject) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(new Error(e.error || "Speech failed"));

    window.speechSynthesis.speak(utterance);
  });
}

export function isApiConfigured() {
  return Boolean(API_URL);
}
