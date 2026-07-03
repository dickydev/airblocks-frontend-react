import { create } from "zustand";

type SceneStore = {
  zoom: number;
  rotationY: number;

  zoomIn: () => void;
  zoomOut: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  resetView: () => void;
};

const MIN_ZOOM = 0.65;
const MAX_ZOOM = 2.2;
const ZOOM_STEP = 0.2;
const ROTATION_STEP = Math.PI / 8;

export const useSceneStore = create<SceneStore>((set) => ({
  zoom: 1,
  rotationY: 0,

  zoomIn: () => {
    set((state) => ({
      zoom: Math.min(MAX_ZOOM, state.zoom + ZOOM_STEP),
    }));
  },

  zoomOut: () => {
    set((state) => ({
      zoom: Math.max(MIN_ZOOM, state.zoom - ZOOM_STEP),
    }));
  },

  rotateLeft: () => {
    set((state) => ({
      rotationY: state.rotationY - ROTATION_STEP,
    }));
  },

  rotateRight: () => {
    set((state) => ({
      rotationY: state.rotationY + ROTATION_STEP,
    }));
  },

  resetView: () => {
    set({
      zoom: 1,
      rotationY: 0,
    });
  },
}));
