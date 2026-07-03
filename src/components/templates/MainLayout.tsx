import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-xl font-black tracking-tight">AirBlocks</h1>
            <p className="text-xs text-slate-400">
              Build 3D cubes with your fingers
            </p>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 md:block">
            Webcam · Hand Tracking · 3D Scene
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8">
        {children}
      </main>
    </div>
  );
}
