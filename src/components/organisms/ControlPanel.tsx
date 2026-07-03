import { Button } from "../atoms/Button";
import { useCubeStore } from "../../stores/cubeStore";

export function ControlPanel() {
  const addCube = useCubeStore((state) => state.addCube);
  const resetCubes = useCubeStore((state) => state.resetCubes);

  return (
    <section className="rounded-4xl border border-white/10 bg-white/4 p-5">
      <p className="text-sm font-bold text-white">Control Panel</p>

      <p className="mt-1 text-xs leading-6 text-slate-400">
        Sekarang cube bisa dibuat dengan gesture pinch. Tombol manual tetap
        tersedia sebagai fallback.
      </p>

      <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Gesture Guide
        </p>

        <ul className="mt-3 space-y-2 text-xs leading-6 text-slate-300">
          <li>🤏 Pinch jempol + telunjuk: buat cube</li>
          <li>🖐️ Open palm: reset semua cube</li>
          <li>☝️ Telunjuk: gerakkan cursor 3D</li>
        </ul>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button onClick={() => addCube()} className="w-full">
          Add Cube
        </Button>

        <Button onClick={resetCubes} variant="danger" className="w-full">
          Reset Cubes
        </Button>
      </div>
    </section>
  );
}