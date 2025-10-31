import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEmpleadoStore = create(
  persist(
    (set) => ({
      empleado: null,
      setEmpleado: (empleado) => set({ empleado }),
      logout: () => set({ empleado: null }),
    }),
    {
      name: 'empleado-storage', // nombre en localStorage
      getStorage: () => localStorage, // por defecto usa localStorage
    }
  )
)
