"use client";

import { useRef, useState } from "react";
import { apiFetch } from "./api";

export default function LoginForm({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<"invalid" | "locked" | "other" | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    const res = await apiFetch("/api/admin/login", "POST", "", { email, password });
    if (res.status === 200) {
      window.location.assign("/admin/projects");
      return;
    }
    setError(res.status === 401 ? "invalid" : res.status === 429 ? "locked" : "other");
    setPassword("");
    busyRef.current = false;
    setBusy(false);
    if (res.status === 401) setTimeout(() => passwordRef.current?.focus(), 0);
  }

  const locked = error === "locked";

  return (
    <main id="main-content" className="login-card">
      <h1>Staff sign-in</h1>
      <p className="muted">Sign in to add and edit your projects.</p>

      {expired && !error ? (
        <p className="banner">Your session ended. Please sign in again.</p>
      ) : null}

      <form onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            disabled={locked}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              id="password"
              ref={passwordRef}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              disabled={locked}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-toggle"
              aria-pressed={show}
              aria-label="Show password"
              onClick={() => setShow((s) => !s)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error ? (
          <p className="banner banner-error" role="alert">
            {error === "invalid"
              ? "That email or password isn't right. Please try again."
              : error === "locked"
                ? "Too many sign-in attempts. Please wait 15 minutes and try again."
                : "Something went wrong. Please try again."}
          </p>
        ) : null}

        <button
          type="submit"
          className="button button-primary block"
          disabled={busy || locked}
          aria-busy={busy}
        >
          {busy ? (
            <>
              <span className="spinner" aria-hidden="true" /> Signing in...
            </>
          ) : locked ? (
            "Try again later"
          ) : (
            "Sign in"
          )}
        </button>
      </form>
      <p className="muted small">Forgot your password? Change it in Vercel and redeploy.</p>
    </main>
  );
}
