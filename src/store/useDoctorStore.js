import { create } from "zustand";

export const useDoctorStore = create((set) => ({
  doctor: null,
  location: null,
  patient: null,
  records: [],
  accessHistory: [],

  setDoctor: (doc) => set({ doctor: doc }),
  setLocation: (loc) => set({ location: loc }),
  setPatient: (pt) => set({ patient: pt }),
  setRecords: (recs) => set({ records: recs }),
  setAccessHistory: (hist) => set({ accessHistory: hist }),
}));
