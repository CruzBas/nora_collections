"use client";

import { useState } from "react";
import { CuentaCartera, EtapaCobranza } from "@/app/components/types";
import Tareas from "@/app/components/tareas";
import BarraSuperior from "@/app/components/barra-superior";
import FiltrosDashboard from "@/app/components/filtros-dashboard";
import TarjetasMetricas from "@/app/components/tarjetas-metricas";
import TablaCartera from "@/app/components/tabla-cartera";
import ActividadHoy from "@/app/components/actividad-hoy";
import { Tarea } from '@/app/components/types';

// Datos iniciales
const cuentasIniciales: CuentaCartera[] = [
  {
    id: "#AC-8921",
    cliente: "Roberto Jiménez",
    ultPago: "12/08/23",
    saldoVencido: "$4,500.00",
    diasMora: 90,
    etapa: "Pre-legal",
  },
  {
    id: "#AC-7743",
    cliente: "María González",
    ultPago: "05/09/23",
    saldoVencido: "$1,200.00",
    diasMora: 45,
    etapa: "Seguimiento",
  },
  {
    id: "#AC-9012",
    cliente: "Empresa Logística S.A.",
    ultPago: "20/09/23",
    saldoVencido: "$8,900.50",
    diasMora: 65,
    etapa: "Negociación",
  },
  {
    id: "#AC-3321",
    cliente: "Luis Herrera",
    ultPago: "--",
    saldoVencido: "$650.00",
    diasMora: 15,
    etapa: "Aviso",
  }, {
    id: "#AC-3324",
    cliente: "Luis Herrera",
    ultPago: "--",
    saldoVencido: "$650.00",
    diasMora: 15,
    etapa: "Aviso",
  }, {
    id: "#AC-3323",
    cliente: "Luis Herrera",
    ultPago: "--",
    saldoVencido: "$650.00",
    diasMora: 15,
    etapa: "Aviso",
  },
];

const tareasIniciales: Tarea[] = [
  {
    id: "#AC-8921",
    nombre: "Roberto Jiménez",
    descripcion: "Llamada de seguimiento",
  },
  {
    id: "#AC-7743",
    nombre: "María González",
    descripcion: "Visita a domicilio",
  }
];

export default function Dashboard() {
  const [cuentas, setCuentas] = useState(cuentasIniciales);

  const [cobrador, setCobrador] = useState("Todos");
  const [equipo, setEquipo] = useState("Alpha");
  const [fecha, setFecha] = useState("Octubre 2023");
  const [busqueda, setBusqueda] = useState("");

  const cambiarEtapa = (
    id: string,
    etapa: EtapaCobranza
  ) => {
    setCuentas((prev) =>
      prev.map((cuenta) =>
        cuenta.id === id
          ? { ...cuenta, etapa }
          : cuenta
      )
    );
  };

  const cuentasFiltradas = cuentas.filter(
    (cuenta) =>
      cuenta.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      cuenta.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-slate-50/50 text-zinc-800 pb-12 select-none">
      <BarraSuperior
        pantalla={"Dashboard"}

      />

      <main className="p-8 flex flex-col gap-8">


        <TarjetasMetricas />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">


          <ActividadHoy />

          <Tareas tareas={tareasIniciales} />
        </div>
      </main>
    </div>
  );
}