import { create } from 'zustand';

interface EditorState {
  currentFileId: string | null;
  currentFileName: string | null;
  content: string;
  isLoading: boolean;
  isDirty: boolean;

  // Actions
  setFile: (id: string, name: string, content: string) => void;
  updateContent: (content: string) => void;
  updateFileName: (name: string) => void;
  setLoading: (loading: boolean) => void;
  setDirty: (dirty: boolean) => void;
  clearFile: () => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentFileId: null,
  currentFileName: null,
  content: "",
  isLoading: false,
  isDirty: false,

  setFile: (id, name, content) =>
    set({
      currentFileId: id,
      currentFileName: name,
      content,
      isDirty: false,
    }),

  updateContent: (newContent) =>
    set({
      content: newContent,
      isDirty: true,
    }),

  updateFileName: (name) => set({ currentFileName: name }),

  setLoading: (loading) => set({ isLoading: loading }),

  setDirty: (dirty) => set({ isDirty: dirty }),

  clearFile: () =>
    set({
      currentFileId: null,
      currentFileName: null,
      content: "",
      isDirty: false,
    }),

  reset: () =>
    set({
      currentFileId: null,
      currentFileName: null,
      content: "",
      isLoading: false,
      isDirty: false,
    }),
}));
