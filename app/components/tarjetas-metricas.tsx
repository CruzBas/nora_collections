'use client'
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { CuentaCartera, Tarea, HistorialPago } from "./types"
import { useRouter } from "next/navigation";



export default function TarjetasMetricas() {



  const [cuentas, setCuentas] = useState<CuentaCartera[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [historialPago, setHistorialPago] = useState<HistorialPago[]>([]);
  const totalPagosRealizados = historialPago.reduce(
    (total, pago) => total + pago.monto,
    0
  );

  //fetch pagos del historial
  const fetchPagos = async (userId: string) => {
    const { data: pagos, error } = await supabase.from('historial_pagos').select('*').eq('user_id', userId);
    if (error) console.error('Error fetchPagos:', error);
    if (pagos) {
      setHistorialPago(pagos.map((item: any): HistorialPago => ({
        id: item.id,
        cuentaId: item.cuenta_id,
        acuerdoId: item.acuerdo_id,
        userId: item.user_id,
        fechaPago: item.fecha_pago,
        monto: Number(item.monto),
        facturaUrl: item.factura_url,
        createdAt: item.created_at,
      })));
    }
  };

  //fetch Tareas pendientes
  const fetchTareas = async (userId: string) => {
    const { data, error } = await supabase.from('tareas').select('*').eq('user_id', userId).eq('completado', false);
    if (error) console.error('Error fetchTareas:', error);
    if (data) {
      setTareas(data.map((item: any): Tarea => ({
        id: item.id,
        user_id: item.user_id,
        descripcion: item.descripcion,
        nombre: item.nombre,
        completado: item.completado,
        fecha_creacion: item.fecha_creacion,
      })));
    }
  };

  //fetch cuentas de cartera
  const fetchData = async (userId: string) => {
    const { data: cData, error } = await supabase.from('cuenta_cartera').select('*').eq('user_id', userId);
    if (error) console.error('Error fetchData:', error);
    if (cData) {
      setCuentas(cData.map((item: any) => ({
        id: item.id,
        cliente: item.cliente,
        ultPago: item.ult_pago,
        saldoVencido: item.saldo_vencido,
        diasMora: item.dias_mora,
        etapa: item.etapa
      })));
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
      } else {
        setUser(user);
        fetchData(user.id);
        fetchPagos(user.id);
        fetchTareas(user.id);
      }
    };
    checkUser();
  }, [router]);

  const cuentasRiesgoCritico = cuentas.filter(
    (cuenta) =>
      cuenta.etapa === "Pre-legal" ||
      cuenta.etapa === "Aviso"
  );
  const riesgoCritico = cuentasRiesgoCritico.length;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tarjeta: Monto Recuperado del Mes */}
      <div className="bg-white border-t-[3px] border-t-emerald-500 border-x border-b border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-44 relative">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              Monto Recuperado (Mes)
            </span>
            <span className="text-3xl font-extrabold text-zinc-950 mt-2">{totalPagosRealizados.toFixed(2)}</span>
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

      </div>

      {/* Tarjeta: Tareas por completar */}
      <div className="bg-white border-t-[3px] border-t-blue-600 border-x border-b border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-44">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              Por completar
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-zinc-950">{tareas.length}</span>
              <span className="text-xs font-semibold text-zinc-400">tareas pendientes</span>
            </div>
          </div>
          {/* Ícono de lista de tareas */}
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
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <polyline points="3 6 4 7 6 5" />
              <polyline points="3 12 4 13 6 11" />
              <polyline points="3 18 4 19 6 17" />
            </svg>
          </span>
        </div>
        {/* Indicador de urgencia */}
        <div>
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold py-1 px-2 rounded">
            {tareas.length === 0 ? "¡Al día!" : tareas.length > 5 ? "Atención requerida" : "En progreso"}
          </span>
        </div>
      </div>

      {/* Tarjeta: Monto Pendiente en Riesgo */}
      <div className="bg-white border-t-[3px] border-t-rose-500 border-x border-b border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-44">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              Monto Pendiente (En Riesgo)
            </span>
            <span className="text-3xl font-extrabold text-zinc-950 mt-2">{riesgoCritico}</span>
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
