type CubeCounterProps = {
  total: number;
};

export function CubeCounter({ total }: CubeCounterProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm font-bold text-white">Cube Counter</p>
      <p className="mt-1 text-xs text-slate-400">
        Jumlah cube yang sudah dibuat.
      </p>

      <div className="mt-5 rounded-2xl bg-slate-900/80 p-5 text-center">
        <p className="text-5xl font-black text-cyan-300">{total}</p>
        <p className="mt-2 text-xs text-slate-500">Total Cubes</p>
      </div>
    </div>
  );
}
