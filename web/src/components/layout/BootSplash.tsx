"use client";

import { useEffect, useState } from "react";

export function BootSplash() {
  const [phase, setPhase] = useState<"show" | "hide" | "gone">("show");

  useEffect(() => {
    const hideAt = window.setTimeout(() => setPhase("hide"), 1400);
    const goneAt = window.setTimeout(() => setPhase("gone"), 1850);
    return () => {
      window.clearTimeout(hideAt);
      window.clearTimeout(goneAt);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`boot${phase === "hide" ? " is-done" : ""}`}>
      <div className="boot-disc">
        <img src="/assets/zakcar/logo-splash.png" alt="Zak Rent A Car" className="boot-logo" />
        <svg className="boot-car" viewBox="0 0 168 56" aria-hidden="true">
          <g className="boot-drive">
            <path
              className="boot-dash"
              d="M6 40 H30"
              fill="none"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M42 40 H54 L66 26 H104 L116 38 H132"
              fill="none"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path d="M70 26 V38 M100 26 V38" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            <circle className="boot-wheel" cx="72" cy="40" r="6.5" fill="none" stroke="#fff" strokeWidth="2.2" />
            <circle className="boot-wheel" cx="118" cy="40" r="6.5" fill="none" stroke="#fff" strokeWidth="2.2" />
            <circle cx="72" cy="40" r="1.6" fill="#fff" />
            <circle cx="118" cy="40" r="1.6" fill="#fff" />
          </g>
        </svg>
      </div>
    </div>
  );
}
