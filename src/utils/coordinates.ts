import type { HandLandmark } from "../types/gesture";

export function convertFingerToWorldPosition(
  landmark: HandLandmark,
): [number, number, number] {
  const mirroredX = 1 - landmark.x;

  const worldX = (mirroredX - 0.5) * 5.5;
  const worldY = (0.5 - landmark.y) * 3.5;
  const worldZ = 0;

  return [worldX, worldY, worldZ];
}
