"use client";
import React, { useEffect } from "react";
import RoleToolbar from "@/components/RoleToolbar";
import SecureEditor from "@/components/SecureEditor";
import { useDocStore } from "@/store/useDocStore";
import { loadDraftFromLocal, saveDraftToLocal } from "@/utils/indexedDB";

export default function WorkspaceDocumentPage() {
  const { content, isSaving, updateContent } = useDocStore();

  // 1. LIFECYCLE INITIALIZATION: Pull down the latest backup from local storage on load
  // useEffect(() => {
  //   async function restoreBackup() {
  //     const savedDraft = await loadDraftFromLocal();
  //     if (savedDraft) {
  //       // Hydrate our global state manager with the retrieved backup HTML text
  //       useDocStore.setState({ content: savedDraft });
  //     }
  //   }
  //   restoreBackup();
  // }, []);
  useEffect(() => {
    async function restoreBackup() {
      const savedDraft = await loadDraftFromLocal();

      if (savedDraft) {
        // Case A: Securely hydrate the view with the retrieved hard drive backup text
        useDocStore.setState({ content: savedDraft });
      } else {
        // Case B: If IndexedDB is completely empty (first load), fallback to your default starter text explicitly
        useDocStore.setState({
          content:
            "<h2>Welcome to your secure enterprise workspace node</h2><p>Type <strong>/</strong> to initialize the markdown rendering loops...</p>",
        });
      }
    }
    restoreBackup();
  }, []);

  // 2. BACKWARD DEBOUNCED SYNC MATRIX: Trigger background saves after typing stops
  useEffect(() => {
    if (!isSaving) return;

    // Wait 1500ms after the user stops typing to avoid crashing disk write-speeds
    const debounceTimer = setTimeout(async () => {
      await saveDraftToLocal(content);
      // Turn off the saving status loader animation inside our global toolbar
      useDocStore.setState({ isSaving: false });
    }, 1500);

    return () => clearTimeout(debounceTimer);
  }, [content, isSaving]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b border-slate-900 pb-5">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Project 2: Secure Document Workspace
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Isolated text editor core running on port 3002 | Guarded via dynamic
            background IndexedDB auto-save pipelines
          </p>
        </header>

        <RoleToolbar />
        <SecureEditor />
      </div>
    </div>
  );
}
