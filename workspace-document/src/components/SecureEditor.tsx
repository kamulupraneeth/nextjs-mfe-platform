"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDocStore } from "@/store/useDocStore";

export default function SecureEditor() {
  const { content, role, updateContent } = useDocStore();

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      updateContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] text-slate-200 leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      // Use standard queue scheduling to prevent infinite cursor re-rendering loops
      window.requestAnimationFrame(() => {
        editor.commands.setContent(content);
      });
    }
  }, [editor, content]);

  // Keep editor capabilities in sync with RBAC roles
  useEffect(() => {
    if (!editor) return;
    editor.setOptions({ editable: role !== "Viewer" });
  }, [editor, role]);

  if (!editor) {
    return (
      <div className="text-slate-500 animate-pulse text-sm">
        Initializing Secure Editor Canvas...
      </div>
    );
  }

  return (
    <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-8 backdrop-blur shadow-2xl min-h-[450px]">
      <EditorContent editor={editor} />
    </div>
  );
}
