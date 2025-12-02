// useHCStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHCStore = create(
  persist(
    (set) => ({
      hc: [], // 🔹 siempre inicia como array vacío
      setHistoriasClinicas: (hc) => set({ hc }),
    }),
    {
      name: 'historiaClinica-storage',
      getStorage: () => localStorage,
    }
  )
);