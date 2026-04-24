import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStockStore = create(
  persist(
    (set) => ({
      stock: [], 
      setStock: (stock) => set({ stock }),
    }),
    {
      name: 'stock-storage',
      getStorage: () => localStorage,
    }
  )
);