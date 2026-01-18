import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  rootFolderId: string | null;
  rootFolderName: string | null;
  isOnboarded: boolean;

  // Actions
  setRootFolder: (id: string, name: string) => void;
  clearRootFolder: () => void;
  setOnboarded: (value: boolean) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      rootFolderId: null,
      rootFolderName: null,
      isOnboarded: false,

      setRootFolder: (id, name) =>
        set({
          rootFolderId: id,
          rootFolderName: name,
          isOnboarded: true,
        }),

      clearRootFolder: () =>
        set({
          rootFolderId: null,
          rootFolderName: null,
          isOnboarded: false,
        }),

      setOnboarded: (value) => set({ isOnboarded: value }),

      reset: () =>
        set({
          rootFolderId: null,
          rootFolderName: null,
          isOnboarded: false,
        }),
    }),
    {
      name: "cms-settings",
    }
  )
);
