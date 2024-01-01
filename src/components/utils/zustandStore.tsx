// floorStore.ts
import { create } from "zustand";
import axiosInstance from "./axiosInstance"; // Import your Axios instance

interface Floor {
  floor_name: any;
  floor_id: any;
  id: string;
  name: string;
  // Add other properties as needed
}

interface FloorStoreState {
  floors: Floor[];
  setFloors: (floors: Floor[]) => void;
}

const useFloorStore = create<FloorStoreState>((set) => ({
  floors: [], // Initialize floors as an empty array of Floor type
  setFloors: (floors) => set({ floors }),
}));

export default useFloorStore;
