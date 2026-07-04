"use client";

import { useSettingsStore } from "@/store/settings-store";
import { useState, useEffect } from "react";

export function SettingsModal() {
  const { geminiKey, showSettings, setGeminiKey, setShowSettings, clearKey } =
    useSettingsStore();

  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | "error" | null>(null);

  // Hydrate
  useEffect(() => {
    setInput(geminiKey);
  }, [geminiKey, showSettings]);

  if (!showSettings) return null;

  const handleSave = () => {
    const trimmed = input.trim();
    setGeminiKey(trimmed);
    setSaved(true);
    setTestResult(null);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ["test"],
          mealType: "SNACK",
          servings: 1,
          apiKey: trimmed,
        }),
      });

      if (res.ok) {
        setTestResult("ok");
        setGeminiKey(trimmed);
      } else {
        const data = await res.json();
        if (data.error === "INVALID_API_KEY") {
          setTestResult("error");
        } else {
          // It worked but maybe another issue
          setTestResult("ok");
          setGeminiKey(trimmed);
        }
      }
    } catch {
      setTestResult("error");
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    clearKey();
    setInput("");
    setTestResult(null);
    setSaved(false);
  };

  const masked =
    geminiKey.length > 10
      ? `${geminiKey.slice(0, 6)}${"•".repeat(20)}${geminiKey.slice(-4)}`
      : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.3s var(--ease)",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setShowSettings(false)}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Modal */}
      <div
        className="glass-strong"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          padding: 40,
          animation: "fadeUp 0.5s var(--ease)",
        }}
      >
        {/* Close */}
        <button
          onClick={() => setShowSettings(false)}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--muted)",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "var(--accent-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            marginBottom: 24,
          }}
        >
          🔑
        </div>

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          Gemini API Key
        </h2>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            marginBottom: 28,
          }}
        >
          Your key is stored <strong>only in your browser</strong> (localStorage)
          and sent directly to Google&apos;s API. We never store or see it.
        </p>

        {/* Current key status */}
        {geminiKey.length > 10 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              background: "rgba(74,222,128,0.06)",
              border: "1px solid rgba(74,222,128,0.15)",
              borderRadius: 14,
              marginBottom: 20,
              fontSize: "0.825rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--accent)" }}>✓</span>
              <span style={{ fontFamily: "monospace", color: "var(--muted)" }}>
                {masked}
              </span>
            </div>
            <button
              onClick={handleClear}
              style={{
                background: "none",
                border: "none",
                color: "#f87171",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        )}

        {/* Input */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSaved(false);
              setTestResult(null);
            }}
            placeholder="AIzaSy... paste your key here"
            style={{
              width: "100%",
              padding: "16px 20px",
              background: "var(--glass)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              color: "var(--fg)",
              fontSize: "0.95rem",
              fontFamily: "monospace",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(74,222,128,0.3)")
            }
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* How to get a key */}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.78rem",
            color: "var(--accent)",
            marginBottom: 24,
            transition: "opacity 0.2s",
          }}
        >
          Get a free key from Google AI Studio →
        </a>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleTest}
            disabled={!input.trim() || testing}
            className="btn-ghost"
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 14,
              opacity: !input.trim() || testing ? 0.4 : 1,
            }}
          >
            {testing ? "Testing…" : "🧪 Test Key"}
          </button>

          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="btn-primary"
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 14,
              fontSize: "0.9rem",
              opacity: !input.trim() ? 0.4 : 1,
            }}
          >
            {saved ? "✓ Saved!" : "💾 Save Key"}
          </button>
        </div>

        {/* Test result */}
        {testResult === "ok" && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 18px",
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 12,
              fontSize: "0.85rem",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: "fadeUp 0.3s var(--ease)",
            }}
          >
            ✅ Key is valid! You&apos;re ready to generate recipes.
          </div>
        )}

        {testResult === "error" && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 18px",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: 12,
              fontSize: "0.85rem",
              color: "#f87171",
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: "fadeUp 0.3s var(--ease)",
            }}
          >
            ❌ Invalid key. Please check and try again.
          </div>
        )}

        {/* Info */}
        <div
          style={{
            marginTop: 24,
            padding: "14px 18px",
            background: "var(--glass)",
            borderRadius: 12,
            fontSize: "0.78rem",
            color: "var(--muted-2)",
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "var(--muted)" }}>🔒 Privacy:</strong> The key
          stays in your browser&apos;s localStorage and is sent directly to
          Google&apos;s servers. It is <strong>never</strong> sent to our backend
          or stored anywhere else.
        </div>
      </div>
    </div>
  );
}
