import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTurnosStore = create(
  persist(
    (set) => ({
      turnos: [], // 🔹 siempre inicia como array vacío
      setTurnos: (turnos) => set({ turnos }),
    }),
    {
      name: 'turnos-storage',
      getStorage: () => localStorage,
    }
  )
);