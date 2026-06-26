// Componente de resumen de actividad diaria del colector
// Muestra métricas de contacto y un plan de pagos activo

export default function ActividadHoy() {
  return (
    <section className="flex flex-col gap-6">
      <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <h3 className="text-base font-bold text-zinc-900">Actividad (Hoy)</h3>

        {/* Vista previa del acuerdo de pago activo con mini barra de progreso */}
        <div className="bg-slate-50 border border-zinc-200/60 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2">
            <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
              Plan de Pagos Activo
            </span>
            <span className="text-[10px] font-bold text-blue-600">89% Ejecutado</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-zinc-800">Acuerdo #AC-9012</span>
              <span className="text-[11px] font-bold text-zinc-400">$3,500 / $8,900</span>
            </div>
            {/* Mini barra de progreso del acuerdo */}
            <div className="w-full bg-zinc-200/60 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-blue-600 h-full w-[89%]" />
            </div>
          </div>
        </div>

        {/* Lista de contadores de actividades del día */}
        <div className="flex flex-col gap-3">
          {/* Contador de llamadas realizadas */}
          <div className="flex items-center justify-between bg-slate-50 border border-zinc-100 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <span className="material-symbols-outlined">phone</span>
              </span>
              <span className="text-sm font-semibold text-zinc-700">Llamadas</span>
            </div>
            <span className="text-lg font-bold text-zinc-900">45</span>
          </div>

          {/* Contador de correos enviados */}
          <div className="flex items-center justify-between bg-slate-50 border border-zinc-100 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <span className="material-symbols-outlined">mail</span>
              </span>
              <span className="text-sm font-semibold text-zinc-700">Correos Enviados</span>
            </div>
            <span className="text-lg font-bold text-zinc-900">120</span>
          </div>

          {/* Contador de SMS enviados */}
          <div className="flex items-center justify-between bg-slate-50 border border-zinc-100 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <span className="material-symbols-outlined">sms</span>
              </span>
              <span className="text-sm font-semibold text-zinc-700">SMS Enviados</span>
            </div>
            <span className="text-lg font-bold text-zinc-900">85</span>
          </div>
        </div>
      </div>
    </section>
  );
}
