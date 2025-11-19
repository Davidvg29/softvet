import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEmpleadoStore = create(
  persist(
    (set) => ({
      empleado: null, // empleado actual logueado
      setEmpleado: (empleado) => set({ empleado }),
      logout: () => set({ empleado: null }),
    }),
    {
      name: 'empleado-storage',
      getStorage: () => localStorage,
    }
  )
)
