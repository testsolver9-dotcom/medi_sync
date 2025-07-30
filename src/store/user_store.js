// File: src/store/useUserStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'medisync-user-storage', // unique name for localStorage key
      partialize: (state) => ({ user: state.user }), // only persist user data
    }
  )
);
