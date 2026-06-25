"use client";

// Props del componente de filtros de encabezado
interface FiltrosDashboardProps {
  titulo: string;
  descripcion: string;
  cobrador: string;
  equipo: string;
  fecha: string;
  onCobradorChange: (valor: string) => void;
  onEquipoChange: (valor: string) => void;
  onFechaChange: (valor: string) => void;
}

// Ícono de chevron hacia abajo reutilizable para los selectores
function IconoChevronAbajo() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function FiltrosDashboard({
  titulo,
  descripcion,
  cobrador,
  equipo,
  fecha,
  onCobradorChange,
  onEquipoChange,
  onFechaChange,
}: FiltrosDashboardProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Título y descripción de la sección */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{titulo}</h2>
        <p className="text-sm text-zinc-500 font-medium mt-1">{descripcion}</p>
      </div>

      {/* Grupo de selectores de filtrado */}
      <div className="flex items-center gap-3">
        {/* Selector de cobrador */}
        <div className="relative">
          <select
            value={cobrador}
            onChange={(e) => onCobradorChange(e.target.value)}
            className="bg-white border border-zinc-200 text-zinc-700 text-xs font-bold py-2 pl-3 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          >
            <option value="Todos">Collector: Todos</option>
            <option value="Jose">Collector: Jose</option>
            <option value="Maria">Collector: Maria</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
            <IconoChevronAbajo />
          </div>
        </div>

        {/* Selector de equipo */}
        <div className="relative">
          <select
            value={equipo}
            onChange={(e) => onEquipoChange(e.target.value)}
            className="bg-white border border-zinc-200 text-zinc-700 text-xs font-bold py-2 pl-3 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          >
            <option value="Alpha">Team: Alpha</option>
            <option value="Beta">Team: Beta</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
            <IconoChevronAbajo />
          </div>
        </div>

        {/* Selector de período de fecha */}
        <div className="relative">
          <select
            value={fecha}
            onChange={(e) => onFechaChange(e.target.value)}
            className="bg-white border border-zinc-200 text-zinc-700 text-xs font-bold py-2 pl-3 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          >
            <option value="Octubre 2023">Octubre 2023</option>
            <option value="Noviembre 2023">Noviembre 2023</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
            <IconoChevronAbajo />
          </div>
        </div>
      </div>
    </div>
  );
}
