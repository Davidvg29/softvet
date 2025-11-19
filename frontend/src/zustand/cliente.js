// useClientesStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useClientesStore = create(
  persist(
    (set) => ({
      clientes: [], // 🔹 siempre inicia como array vacío
      setClientes: (clientes) => set({ clientes }),
    }),
    {
      name: 'clientes-storage',
      getStorage: () => localStorage,
    }
  )
);
