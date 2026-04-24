import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useVentasStore = create(
  persist(
    (set) => ({
      ventas: [], 
      setVentas: (ventas) => set({ ventas }),
    }),
    {
      name: 'ventas-storage', 
      getStorage: () => localStorage,
    }
  )
);