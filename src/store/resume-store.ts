"use client";

import { create } from "zustand";
import { v4 as uuid } from "uuid";
import type { BlockType, ResumeBlock } from "@/types";

interface ResumeState {
  resumeId: string;
  title: string;
  templateId: string;
  blocks: ResumeBlock[];
  history: ResumeBlock[][];
  future: ResumeBlock[][];
  dirty: boolean;
  loadResume: (id: string, blocks: ResumeBlock[], title: string, templateId: string) => void;
  setTitle: (title: string) => void;
  setTemplateId: (templateId: string) => void;
  addBlock: (type: BlockType, content?: Record<string, unknown>) => void;
  updateBlock: (id: string, content: Record<string, unknown>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  undo: () => void;
  redo: () => void;
  markSaved: () => void;
}

function getDefaultContent(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "experience":
      return { title: "Role", company: "Company", dates: "2021 - Present", bullets: ["Impact bullet"] };
    case "education":
      return { school: "University", degree: "Degree", dates: "2018 - 2022" };
    case "projects":
      return { title: "Project", description: "Built for impact", link: "" };
    case "skills":
      return { items: ["TypeScript", "React", "Product Thinking"] };
    case "metrics":
      return { headline: "+37% conversion", context: "Redesigned onboarding funnel" };
    case "custom":
      return { title: "Rich Text", body: "<h2>Section title</h2><p>Write a paragraph here.</p><ul><li>List item</li></ul>" };
    case "github":
      return { repo: "repo-name", stars: 0, language: "TypeScript" };
    default:
      return { title: "Section" };
  }
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumeId: "",
  title: "Untitled Resume",
  templateId: "minimal",
  blocks: [],
  history: [],
  future: [],
  dirty: false,

  loadResume: (id, blocks, title, templateId) =>
    set({ resumeId: id, blocks, title, templateId, history: [], future: [], dirty: false }),

  setTitle: (title) => set({ title, dirty: true }),

  setTemplateId: (templateId) => set({ templateId, dirty: true }),

  addBlock: (type, content) => {
    const current = get().blocks;
    const next = [
      ...current,
      {
        id: uuid(),
        type,
        order: current.length,
        content: { ...getDefaultContent(type), ...(content ?? {}) }
      }
    ];
    set((state) => ({ blocks: next, history: [...state.history, state.blocks], future: [], dirty: true }));
  },

  updateBlock: (id, content) => {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
      history: [...state.history, state.blocks],
      future: [],
      dirty: true
    }));
  },

  deleteBlock: (id) => {
    set((state) => {
      const filtered = state.blocks.filter((b) => b.id !== id).map((b, idx) => ({ ...b, order: idx }));
      return { blocks: filtered, history: [...state.history, state.blocks], future: [], dirty: true };
    });
  },

  reorderBlocks: (activeId, overId) => {
    const blocks = [...get().blocks].sort((a, b) => a.order - b.order);
    const oldIndex = blocks.findIndex((b) => b.id === activeId);
    const newIndex = blocks.findIndex((b) => b.id === overId);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

    const moved = [...blocks];
    const [item] = moved.splice(oldIndex, 1);
    moved.splice(newIndex, 0, item);
    set((state) => ({
      blocks: moved.map((b, idx) => ({ ...b, order: idx })),
      history: [...state.history, state.blocks],
      future: [],
      dirty: true
    }));
  },

  moveBlock: (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const blocks = [...get().blocks].sort((a, b) => a.order - b.order);
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= blocks.length || toIndex >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    set((state) => ({
      blocks: next.map((b, idx) => ({ ...b, order: idx })),
      history: [...state.history, state.blocks],
      future: [],
      dirty: true
    }));
  },

  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      return {
        blocks: previous,
        history: state.history.slice(0, -1),
        future: [state.blocks, ...state.future],
        dirty: true
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return { blocks: next, history: [...state.history, state.blocks], future: state.future.slice(1), dirty: true };
    }),

  markSaved: () => set({ dirty: false })
}));
