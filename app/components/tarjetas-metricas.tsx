

export default function TarjetasMetricas() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tarjeta: Monto Recuperado del Mes */}
      <div className="bg-white border-t-[3px] border-t-emerald-500 border-x border-b border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-44 relative">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              Monto Recuperado (Mes)
            </span>
            <span className="text-3xl font-extrabold text-zinc-950 mt-2">$45,230.00</span>
          </div>
          {/* Ícono de tendencia al alza */}
          <span className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </span>
        </div>
        {/* Indicador porcentual comparativo */}
        <div>
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold py-1 px-2 rounded">
            +12%
          </span>
          <span className="text-[11px] text-zinc-400 font-semibold ml-2">vs mes anterior</span>
        </div>
      </div>

      {/* Tarjeta: Progreso de Meta con barra de avance */}
      <div className="bg-white border-t-[3px] border-t-blue-600 border-x border-b border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-44">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              Progreso de Meta
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-zinc-950">68%</span>
              <span className="text-xs font-semibold text-zinc-400">de $65,000.00</span>
            </div>
          </div>
          {/* Ícono de bandera de meta */}
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </span>
        </div>
        <div className="w-full">
          {/* Barra de progreso visual */}
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-blue-600 h-full w-[68%] rounded-full" />
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase">
            <span>$45,230.00</span>
            <span>Restan $19,770.00</span>
          </div>
        </div>
      </div>

      {/* Tarjeta: Monto Pendiente en Riesgo */}
      <div className="bg-white border-t-[3px] border-t-rose-500 border-x border-b border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-44">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              Monto Pendiente (En Riesgo)
            </span>
            <span className="text-3xl font-extrabold text-zinc-950 mt-2">$12,850.00</span>
          </div>
          {/* Ícono de advertencia */}
          <span className="p-2 bg-rose-50 text-rose-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
        </div>
        {/* Detalle de cuentas en riesgo */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5 text-rose-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>42 cuentas en mora &gt; 60 días</span>
        </div>
      </div>
    </section>
  );
}
