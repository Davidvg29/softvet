import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCategoriasStore = create(
  persist(
    (set) => ({
      categorias: [], 
      setCategorias: (categorias) => set({ categorias }),
    }),
    {
      name: 'categorias-storage', 
      getStorage: () => localStorage,
    }
  )
);