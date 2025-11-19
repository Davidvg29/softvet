import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMascotasStore = create(
  persist(
    (set) => ({
      mascotas: [], // 🔹 siempre inicia como array vacío
      setMascotas: (mascotas) => set({ mascotas }),
    }),
    {
      name: 'mascotas-storage',
      getStorage: () => localStorage,
    }
  )
);