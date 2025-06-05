import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useSiteStore = create()(
  persist(
    (set, get) => ({

      resetStore: () => set({
        count: 0,
        termsOfUseAccepted: false
      }),

      count: 0,
      addCount: () => set({ count: get().count + 1 }),

      termsOfUseAccepted: false,
      setTermsOfUseAccepted: (value) => set({ termsOfUseAccepted: value }),

      storageLocations: [
        'D:\\Articles Backups'
      ],
      setStorageLocations: (value) => set({ storageLocations: value }),
      removeStorageLocation: (index) => {
        const current = get().storageLocations;
        const updated = current.filter((_, i) => i !== index);
        set({ storageLocations: updated });
      },

      darkMode: true,
      toggleDarkMode: (value) => {
        const current = get().darkMode;
        set({ darkMode: !current })
      }

    }),
    {
      name: 'useSiteStore', // name of the item in the storage (must be unique)
      //   storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)