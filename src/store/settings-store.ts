import { create } from "zustand";

// ═══════════════════════════════════════════
// SETTINGS STORE
// Persists API key in localStorage (client-only)
// ═══════════════════════════════════════════

interface SettingsState {
  geminiKey: string;
  showSettings: boolean;
  setGeminiKey: (key: string) => void;
  setShowSettings: (show: boolean) => void;
  toggleSettings: () => void;
  clearKey: () => void;
  hasKey: () => boolean;
}

const STORAGE_KEY = "chefai_gemini_key";

function loadKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function saveKey(key: string) {
  if (typeof window === "undefined") return;
  try {
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // storage full or blocked
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  geminiKey: "",
  showSettings: false,

  setGeminiKey: (key: string) => {
    saveKey(key);
    set({ geminiKey: key });
  },

  setShowSettings: (show: boolean) => set({ showSettings: show }),
  toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),

  clearKey: () => {
    saveKey("");
    set({ geminiKey: "" });
  },

  hasKey: () => {
    const k = get().geminiKey;
    return k.length > 10;
  },
}));

// Hydrate on client
if (typeof window !== "undefined") {
  const stored = loadKey();
  if (stored) {
    useSettingsStore.setState({ geminiKey: stored });
  }
}
