"use client";

// Props del componente de barra superior
interface BarraSuperiorProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
}

export default function BarraSuperior({ busqueda, onBusquedaChange }: BarraSuperiorProps) {
  return (
    <header className="h-16 w-full bg-white border-b border-zinc-200 px-8 flex items-center justify-end sticky top-0 z-30">


      {/* Iconos de acción: notificaciones, configuración y perfil */}
      <div className="flex items-center gap-5">


        {/* Avatar del administrador del sistema */}
        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 cursor-pointer overflow-hidden">
          SA
        </div>
      </div>
    </header>
  );
}
