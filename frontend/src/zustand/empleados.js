import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEmpleadosStore = create(
  persist(
    (set) => ({
      empleados: [],
      setEmpleados: (empleados) => set({ empleados }),
    }),
    {
      name: 'empleados-list-storage',
      getStorage: () => localStorage,
    }
  )
)