import { Button } from "../atoms/Button";
import { useCubeStore } from "../../stores/cubeStore";
import { useSceneStore } from "../../stores/sceneStore";

export function ControlPanel() {
  const addCube = useCubeStore((state) => state.addCube);
  const resetCubes = useCubeStore((state) => state.resetCubes);

  const zoom = useSceneStore((state) => state.zoom);
  const rotationY = useSceneStore((state) => state.rotationY);
  const zoomIn = useSceneStore((state) => state.zoomIn);
  const zoomOut = useSceneStore((state) => state.zoomOut);
  const rotateLeft = useSceneStore((state) => state.rotateLeft);
  const rotateRight = useSceneStore((state) => state.rotateRight);
  const resetView = useSceneStore((state) => state.resetView);

  return (
    <section className="rounded-4xl border border-white/10 bg-white/4 p-5">
      <p className="text-sm font-bold text-white">Control Panel</p>

      <p className="mt-1 text-xs leading-6 text-slate-400">
        Cube bisa dibuat dengan pinch. Scene bisa dikontrol dengan swipe atau
        tombol manual.
      </p>

      <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Gesture Guide
        </p>

        <ul className="mt-3 space-y-2 text-xs leading-6 text-slate-300">
          <li>🤏 Pinch: buat cube</li>
          <li>🖐️ Open palm: reset semua cube</li>
          <li>☝️ Swipe left/right: rotate scene</li>
          <li>☝️ Swipe up: zoom in</li>
          <li>☝️ Swipe down: zoom out</li>
        </ul>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button onClick={() => addCube()} className="w-full">
          Add Cube
        </Button>

        <Button onClick={resetCubes} variant="danger" className="w-full">
          Reset Cubes
        </Button>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-900/80 p-4">
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div>
            <p>Zoom</p>
            <p className="mt-1 text-lg font-black text-cyan-300">
              {Math.round(zoom * 100)}%
            </p>
          </div>

          <div>
            <p>Rotation</p>
            <p className="mt-1 text-lg font-black text-cyan-300">
              {Math.round((rotationY * 180) / Math.PI)}°
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button onClick={zoomIn} variant="secondary" className="w-full">
          Zoom In
        </Button>

        <Button onClick={zoomOut} variant="secondary" className="w-full">
          Zoom Out
        </Button>

        <Button onClick={rotateLeft} variant="secondary" className="w-full">
          Rotate Left
        </Button>

        <Button onClick={rotateRight} variant="secondary" className="w-full">
          Rotate Right
        </Button>

        <Button
          onClick={resetView}
          variant="secondary"
          className="w-full col-span-2"
        >
          Reset View
        </Button>
      </div>
    </section>
  );
}
