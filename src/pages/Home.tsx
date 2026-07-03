import { CubeCounter } from "../components/molecules/CubeCounter";
import { GestureStatus } from "../components/molecules/GestureStatus";
import { CameraPanel } from "../components/organisms/CameraPanel";
import { ControlPanel } from "../components/organisms/ControlPanel";
import { CubeScene } from "../components/organisms/CubeScene";
import { MainLayout } from "../components/templates/MainLayout";
import { useGestureCubeBuilder } from "../hooks/useGestureCubeBuilder";
import { useHandTracking } from "../hooks/useHandTracking";
import { useWebcam } from "../hooks/useWebcam";
import { useCubeStore } from "../stores/cubeStore";

export function Home() {
  const totalCubes = useCubeStore((state) => state.cubes.length);

  const { videoRef, isCameraReady, error, startCamera, stopCamera } =
    useWebcam();

  const {
    canvasRef,
    isModelReady,
    isHandDetected,
    gesture,
    landmarks,
    error: trackingError,
  } = useHandTracking({
    videoRef,
    isEnabled: isCameraReady,
  });

  const { worldCursorPosition } = useGestureCubeBuilder({
    isEnabled: isCameraReady && isModelReady && isHandDetected,
    gesture,
    landmarks,
  });

  return (
    <MainLayout>
      <div className="mb-8 max-w-3xl">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200">
          AI Hand Tracking Playground
        </div>

        <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
          Build 3D Cubes With Your Fingers
        </h2>

        <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">
          Arahkan tangan ke kamera, gerakkan telunjuk sebagai cursor, lalu
          lakukan gesture pinch untuk membuat cube di dunia 3D.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr_340px]">
        <CameraPanel
          videoRef={videoRef}
          canvasRef={canvasRef}
          isCameraReady={isCameraReady}
          error={error}
          trackingError={trackingError}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
        />

        <CubeScene cursorPosition={worldCursorPosition} />

        <aside className="space-y-6">
          <GestureStatus
            isModelReady={isModelReady}
            isHandDetected={isHandDetected}
            gesture={gesture}
          />

          <CubeCounter total={totalCubes} />

          <ControlPanel />
        </aside>
      </div>
    </MainLayout>
  );
}