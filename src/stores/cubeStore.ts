import { create } from "zustand";
import type { CubeItem } from "../types/cube";

type CubeStore = {
  cubes: CubeItem[];
  addCube: (position?: [number, number, number]) => void;
  resetCubes: () => void;
};

const COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#facc15",
  "#fb7185",
  "#60a5fa",
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getRandomPosition(): [number, number, number] {
  return [
    Math.random() * 4 - 2,
    Math.random() * 3 - 1,
    Math.random() * 2 - 1,
  ];
}

export const useCubeStore = create<CubeStore>((set) => ({
  cubes: [],

  addCube: (position) => {
    const newCube: CubeItem = {
      id: crypto.randomUUID(),
      position: position ?? getRandomPosition(),
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ],
      scale: 0.45,
      color: getRandomColor(),
    };

    set((state) => ({
      cubes: [...state.cubes, newCube],
    }));
  },

  resetCubes: () => {
    set({ cubes: [] });
  },
}));