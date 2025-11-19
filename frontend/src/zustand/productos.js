// useProductosStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProductosStore = create(
  persist(
    (set) => ({
      productos: [], // 🔹 siempre inicia como array vacío
      setProductos: (productos) => set({ productos }),
    }),
    {
      name: 'productos-storage',
      getStorage: () => localStorage,
    }
  )
);
