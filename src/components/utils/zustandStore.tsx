// floorStore.ts
import { create, useStore } from "zustand";

interface Floor {
  // Define your floor data structure here
  id: string;
  name: string;
  // Add other properties as needed
}

interface FloorStoreState {
  floors: Floor[];
  setFloors: (floors: Floor[]) => void;
}

const useFloorStore = create<FloorStoreState>(
  (set: (arg0: { floors: any }) => any) => ({
    floors: [] as Floor[], // Initialize floors as an empty array of Floor type
    setFloors: (floors: any) => set({ floors }),
  })
);

export default useFloorStore;
