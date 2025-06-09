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
        
      ],
      setStorageLocations: (value) => set({ storageLocations: value }),
      removeStorageLocation: (index) => {
        const current = get().storageLocations;
        const updated = current.filter((_, i) => i !== index);
        set({ storageLocations: updated });
      },

      awsUploadLocation: '',
      setAwsUploadLocation: (value) => set({ awsUploadLocation: value }),

      darkMode: true,
      toggleDarkMode: (value) => {
        const current = get().darkMode;
        set({ darkMode: !current })
      },

      backupsScheduling: true,
      toggleBackupsScheduling: (value) => {
        const current = get().backupsScheduling;
        set({ backupsScheduling: !current })
      },

      showChecklist: true,
      setShowChecklist: (value) => set({ showChecklist: value }),

    }),
    {
      name: 'useSiteStore', // name of the item in the storage (must be unique)
      //   storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)