"use client";

import React, { useEffect, useRef, useState } from "react";
import "./sign-in-flo.css";

interface SignInFloProps {
  initialMode?: "login" | "signup";
  onLogin?: (payload: { email: string; password: string; rememberMe: boolean }) => Promise<void> | void;
  onSignup?: (payload: { name: string; email: string; password: string; rememberMe: boolean }) => Promise<void> | void;
}

export const Component: React.FC<SignInFloProps> = ({ initialMode = "login", onLogin, onSignup }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    const particles: Array<{ x: number; y: number; r: number; sx: number; sy: number; o: number }> = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.8 + 0.5,
        sx: (Math.random() - 0.5) * 0.4,
        sy: (Math.random() - 0.5) * 0.4,
        o: Math.random() * 0.28 + 0.04,
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.sx;
        p.y += p.sy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${p.o})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const onToggleMode = () => {
    setIsSignUp((prev) => !prev);
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        if (onSignup) {
          await onSignup({ name, email, password, rememberMe });
        } else {
          await new Promise((r) => setTimeout(r, 1500));
        }
      } else if (onLogin) {
        await onLogin({ email, password, rememberMe });
      } else {
        await new Promise((r) => setTimeout(r, 1500));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="signin-wrap sif">
        <canvas ref={canvasRef} className="particles" />

        <div className="card">
          <div className="header">
            <div className="avatar">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
            <p>{isSignUp ? "Sign up to get started" : "Sign in to continue"}</p>
          </div>

          <form onSubmit={onSubmit}>
            <div className={`field ${isSignUp ? "" : "hidden"}`}>
              <div className="field-inner">
                <span className="icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input type="text" placeholder=" " autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Full Name</label>
              </div>
            </div>

            <div className="field">
              <div className="field-inner">
                <span className="icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input type="email" placeholder=" " autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Email Address</label>
              </div>
            </div>

            <div className="field">
              <div className="field-inner">
                <span className="icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
                <button type="button" className="toggle-btn" aria-label="Toggle password" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="row">
              <label className="checkbox-label">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Remember me
              </label>
              {!isSignUp && (
                <button type="button" className="link-btn">
                  Forgot password?
                </button>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              <div className="shimmer" />
              <span style={{ opacity: isSubmitting ? 0 : 1, transition: "opacity 0.2s" }}>
                {isSignUp ? "Create Account" : "Sign In"}
              </span>
              <div className="spinner" style={{ display: isSubmitting ? "block" : "none" }} />
            </button>
          </form>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="socials">
            <button className="social-btn" aria-label="GitHub">
              <div className="slide" />
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </button>
            <button className="social-btn" aria-label="Twitter / X">
              <div className="slide" />
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button className="social-btn" aria-label="LinkedIn">
              <div className="slide" />
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
          </div>

          <div className="footer">
            <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
            <button type="button" className="link-btn" style={{ marginLeft: 4 }} onClick={onToggleMode}>
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </div>
  );
};
