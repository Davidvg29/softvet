import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useEspeciesStore = create(
  persist(
    (set) => ({
      especies: [], 
      setEspecies: (especies) => set({ especies }),
    }),
    {
      name: 'especies-storage', 
      getStorage: () => localStorage,
    }
  )
);