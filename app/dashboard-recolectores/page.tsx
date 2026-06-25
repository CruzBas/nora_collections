"use client";

import { useState } from "react";
import { CuentaCartera } from "@/app/components/types";
import BarraSuperior from "@/app/components/barra-superior";
import FiltrosDashboard from "@/app/components/filtros-dashboard";
import TarjetasMetricas from "@/app/components/tarjetas-metricas";
import TablaCartera from "@/app/components/tabla-cartera";
import ActividadHoy from "@/app/components/actividad-hoy";

// Datos iniciales de prueba para la cartera prioritaria
const cuentasIniciales: CuentaCartera[] = [
  { id: "#AC-8921", cliente: "Roberto Jiménez", ultPago: "12/08/23", saldoVencido: "$4,500.00", diasMora: 90, etapa: "Pre-legal" },
  { id: "#AC-7743", cliente: "María González", ultPago: "05/09/23", saldoVencido: "$1,200.00", diasMora: 45, etapa: "Seguimiento" },
  { id: "#AC-9012", cliente: "Empresa Logística S.A.", ultPago: "20/09/23", saldoVencido: "$8,900.50", diasMora: 65, etapa: "Negociación" },
  { id: "#AC-3321", cliente: "Luis Herrera", ultPago: "--", saldoVencido: "$650.00", diasMora: 15, etapa: "Aviso" },
];

export default function Dashboard() {
  // Estado de los filtros del panel
  const [cobrador, setCobrador] = useState("Todos");
  const [equipo, setEquipo] = useState("Alpha");
  const [fecha, setFecha] = useState("Octubre 2023");
  const [busqueda, setBusqueda] = useState("");

  // Filtrado reactivo de cuentas según el texto de búsqueda
  const cuentasFiltradas = cuentasIniciales.filter(
    (cuenta) =>
      cuenta.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      cuenta.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-slate-50/50 text-zinc-800 pb-12 select-none">
      {/* Barra superior con búsqueda y perfil */}
      <BarraSuperior busqueda={busqueda} onBusquedaChange={setBusqueda} />

      {/* Contenido principal del panel */}
      <main className="p-8 flex flex-col gap-8">
        {/* Encabezado con título y selectores de filtrado */}
        <FiltrosDashboard
          titulo="Resumen Operativo"
          descripcion="Visión general de recuperación y cartera actual."
          cobrador={cobrador}
          equipo={equipo}
          fecha={fecha}
          onCobradorChange={setCobrador}
          onEquipoChange={setEquipo}
          onFechaChange={setFecha}
        />

        {/* Sección de tarjetas con indicadores clave */}
        <TarjetasMetricas />

        {/* Sección de dos columnas: cartera y actividad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Tabla de cartera prioritaria (ocupa 2 de 3 columnas) */}
          <TablaCartera cuentas={cuentasFiltradas} />

          {/* Panel lateral de actividad diaria (ocupa 1 columna) */}
          <ActividadHoy />
        </div>
      </main>
    </div>
  );
}
