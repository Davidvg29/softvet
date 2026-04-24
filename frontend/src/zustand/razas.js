import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRazasStore = create(
  persist(
    (set) => ({
      razas: [], // Iniciamos con array vacío
      setRazas: (razas) => set({ razas }),
    }),
    {
      name: 'razas-storage', // Nombre único para el localStorage
      getStorage: () => localStorage,
    }
  )
);