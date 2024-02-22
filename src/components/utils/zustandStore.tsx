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
  addFloor: (floor: Floor) => void;
  editFloor: (floorId: string, newFloor: Floor) => void;
  deleteFloor: (floorId: string) => void;
}

const useFloorStore = create<FloorStoreState>((set) => ({
  floors: [], // Initialize floors as an empty array of Floor type
  setFloors: (floors) => set({ floors }),
  addFloor: (floor) => set((state) => ({ floors: [...state.floors, floor] })),
  editFloor: (floorId, newFloor) =>
    set((state) => ({
      floors: state.floors.map((floor) =>
        floor.id === floorId ? { ...floor, ...newFloor } : floor
      ),
    })),
  deleteFloor: (floorId) =>
    set((state) => ({
      floors: state.floors.filter((floor) => floor.id !== floorId),
    })),
}));

export default useFloorStore;
