// floorStore.ts
import { create } from "zustand";

interface Floor {
  // Define your floor data structure here
  id: number;
  name: string;
  // Add other properties as needed
}

interface FloorStoreState {
  floors: Floor[];
  setFloors: (floors: Floor[]) => void;
}

const useFloorStore = create<FloorStoreState>((set) => ({
  floors: [],
  setFloors: (floors) => set({ floors }),
}));

export default useFloorStore;
