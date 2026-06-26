"use client";

// Props del componente de barra superior
interface BarraSuperiorProps {
  pantalla: string;

}

export default function BarraSuperior({ pantalla }: BarraSuperiorProps) {
  return (
    <header className="h-16 w-full bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-30">


      {/* Iconos de acción: notificaciones, configuración y perfil */}
      <div className="flex items-center gap-5">
        <h1 className="text-xl font-bold text-blue-900 tracking-tight">{pantalla}</h1>



      </div>
      <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 cursor-pointer overflow-hidden">
        SA
      </div>
    </header>
  );
}
