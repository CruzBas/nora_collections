"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Definición de la interfaz para cada elemento de la lista de navegación
interface EnlaceItem {
    nombre: string;
    href: string;
    icono: string;
}
// Lista de enlaces principales que se muestran en el panel lateral (coincidente con la captura de pantalla)
const enlacesPrincipales: EnlaceItem[] = [
    { nombre: "Dashboard", href: "/dashboard-recolectores", icono: "dashboard" },
    { nombre: "Cartera", href: "/dashboard/cartera", icono: "wallet" },
    { nombre: "Acuerdos", href: "/dashboard/acuerdos", icono: "business_center" },

];
// Lista de enlaces secundarios situados en la parte inferior (coincidente con la captura de pantalla)
const enlacesSecundarios: EnlaceItem[] = [
    { nombre: "Ayuda", href: "/dashboard/ayuda", icono: "support" },
    { nombre: "Cerrar Sesión", href: "/", icono: "logout" },
];
export default function NavLinks() {
    const rutaActiva = usePathname();
    // Función para renderizar el icono SVG correcto en base al identificador

    return (
        <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-[260px] p-6 justify-between select-none">
            {/* Contenedor Superior: Título / Logotipo del CRM */}
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="text-xl font-bold text-blue-900 tracking-tight">Collections CRM</h1>
                <p className="text-xs text-zinc-500 font-medium tracking-wide">System Admin</p>
            </div>
            {/* Navegación Media: Lista de enlaces principales */}
            <nav className="flex flex-col gap-1.5 flex-1">
                {enlacesPrincipales.map((enlace) => {
                    const esActivo = rutaActiva === enlace.href;
                    return (
                        <Link
                            key={enlace.href}
                            href={enlace.href}
                            className={`group flex items-center justify-between py-3 px-4 rounded-lg transition-all relative  ${esActivo
                                ? "bg-zinc-100 text-blue-600 font-semibold shadow-sm"
                                : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900 font-medium"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined">{enlace.icono}</span>
                                <span className="text-sm">{enlace.nombre}</span>
                            </div>
                            {/* Barra vertical azul indicadora de página activa a la derecha del enlace */}
                            {esActivo && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-3/5 bg-blue-600 rounded-l" />
                            )}
                        </Link>
                    );
                })}
            </nav>
            {/* Contenedor Inferior: Acción de Crear y enlaces secundarios */}
            <div className="flex flex-col gap-6 pt-6 border-t border-zinc-200">
                {/* Botón de Creación "+ Nuevo Acuerdo" */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 active:scale-[0.98] transition-all cursor-pointer">
                    <span className="material-symbols-outlined">add</span>
                    <span>Nuevo Acuerdo</span>
                </button>
                {/* Enlaces secundarios (Soporte, Salida) */}
                <div className="flex flex-col gap-1">
                    {enlacesSecundarios.map((enlace) => {
                        const esActivo = rutaActiva === enlace.href;
                        return (
                            <Link
                                key={enlace.href}
                                href={enlace.href}
                                className={`group flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${esActivo
                                    ? "bg-zinc-100 text-blue-600 font-semibold"
                                    : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900 font-medium"
                                    }`}
                            >

                                <span className="text-sm">{enlace.nombre}</span>
                                <span className="material-symbols-outlined">{enlace.icono}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}