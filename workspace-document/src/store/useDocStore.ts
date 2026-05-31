import { create } from "zustand";

interface DocumentState {
  content: string;
  role: "Owner" | "Editor" | "Viewer";
  isSaving: boolean;
  updateContent: (newText: string) => void;
  setRole: (newRole: "Owner" | "Editor" | "Viewer") => void;
}

// Generates a high-performance, decoupled global state machine hook
export const useDocStore = create<DocumentState>((set) => ({
  content:
    "<h2>Welcome to your secure enterprise workspace node</h2><p>Type <strong>/</strong> to initialize the markdown rendering loops...</p>",
  role: "Owner", // Default role on initial startup instantiation
  isSaving: false,

  updateContent: (newText) => set({ content: newText, isSaving: true }),
  setRole: (newRole) => set({ role: newRole }),
}));
