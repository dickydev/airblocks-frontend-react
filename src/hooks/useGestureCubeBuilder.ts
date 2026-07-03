import { useEffect, useMemo, useRef, useState } from "react";
import type { GestureName, HandLandmark } from "../types/gesture";
import { useCubeStore } from "../stores/cubeStore";
import { convertFingerToWorldPosition } from "../utils/coordinates";

type UseGestureCubeBuilderOptions = {
  isEnabled: boolean;
  gesture: GestureName;
  landmarks: HandLandmark[];
};

const PINCH_COOLDOWN_MS = 700;
const OPEN_PALM_RESET_COOLDOWN_MS = 1500;

export function useGestureCubeBuilder({
  isEnabled,
  gesture,
  landmarks,
}: UseGestureCubeBuilderOptions) {
  const addCube = useCubeStore((state) => state.addCube);
  const resetCubes = useCubeStore((state) => state.resetCubes);

  const previousGestureRef = useRef<GestureName>("Idle");
  const lastPinchTimeRef = useRef(0);
  const lastOpenPalmTimeRef = useRef(0);

  const [lastSpawnPosition, setLastSpawnPosition] = useState<
    [number, number, number] | null
  >(null);

  const indexFingerTip = landmarks[8] ?? null;

  const worldCursorPosition = useMemo(() => {
    if (!indexFingerTip) return null;

    return convertFingerToWorldPosition(indexFingerTip);
  }, [indexFingerTip]);

  useEffect(() => {
    if (!isEnabled) {
      previousGestureRef.current = "Idle";
      return;
    }

    const now = Date.now();
    const previousGesture = previousGestureRef.current;

    const isNewPinch = gesture === "Pinch" && previousGesture !== "Pinch";
    const canSpawnCube = now - lastPinchTimeRef.current > PINCH_COOLDOWN_MS;

    if (isNewPinch && canSpawnCube && worldCursorPosition) {
      addCube(worldCursorPosition);
      setLastSpawnPosition(worldCursorPosition);
      lastPinchTimeRef.current = now;
    }

    const isNewOpenPalm =
      gesture === "Open Palm" && previousGesture !== "Open Palm";
    const canReset =
      now - lastOpenPalmTimeRef.current > OPEN_PALM_RESET_COOLDOWN_MS;

    if (isNewOpenPalm && canReset) {
      resetCubes();
      lastOpenPalmTimeRef.current = now;
    }

    previousGestureRef.current = gesture;
  }, [addCube, gesture, isEnabled, resetCubes, worldCursorPosition]);

  return {
    worldCursorPosition,
    lastSpawnPosition,
  };
}