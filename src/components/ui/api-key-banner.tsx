"use client";

import { useSettingsStore } from "@/store/settings-store";
import { useEffect, useState } from "react";

export function ApiKeyBanner() {
  const { geminiKey, setShowSettings } = useSettingsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;
  if (geminiKey.length > 10) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9990,
        animation: "fadeUp 0.6s var(--ease)",
      }}
    >
      <button
        onClick={() => setShowSettings(true)}
        className="glass-strong"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 28px",
          border: "1px solid rgba(251,191,36,0.25)",
          borderRadius: 100,
          background: "rgba(251,191,36,0.08)",
          backdropFilter: "blur(24px)",
          color: "#fbbf24",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.3s var(--ease)",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>🔑</span>
        Add Gemini API Key to start generating recipes
        <span style={{ opacity: 0.6, fontSize: "0.78rem" }}>→</span>
      </button>
    </div>
  );
}
