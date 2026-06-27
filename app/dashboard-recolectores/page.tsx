"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CuentaCartera, EtapaCobranza } from "@/app/components/types";
import Tareas from "@/app/components/tareas";
import BarraSuperior from "@/app/components/barra-superior";
import FiltrosDashboard from "@/app/components/filtros-dashboard";
import TarjetasMetricas from "@/app/components/tarjetas-metricas";
import TablaCartera from "@/app/components/tabla-cartera";
import ActividadHoy from "@/app/components/actividad-hoy";
import { Tarea } from '@/app/components/types';



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
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cuentas, setCuentas] = useState<CuentaCartera[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);

  const [cobrador, setCobrador] = useState("Todos");
  const [equipo, setEquipo] = useState("Alpha");
  const [fecha, setFecha] = useState("Octubre 2023");
  const [busqueda, setBusqueda] = useState("");

  const fetchData = async (userId: string) => {
    // Fetch cuentas
    const { data: cData } = await supabase.from('cuenta_cartera').select('*').eq('user_id', userId);
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

    // Fetch tareas
    const { data: tData } = await supabase.from('tareas').select('*').eq('user_id', userId).eq('completado', false);
    if (tData) {
      setTareas(tData);
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
      }
    };
    checkUser();
  }, [router]);

  const handleAddTarea = async (nombre: string, descripcion: string) => {
    if (!user) return;
    const newTarea = { user_id: user.id, nombre, descripcion };
    const { data, error } = await supabase.from('tareas').insert([newTarea]).select();
    if (!error && data) {
      setTareas(prev => [...prev, data[0]]);
    }
  };

  const handleCompletarTarea = async (id: string) => {
    const { error } = await supabase.from('tareas').update({ completado: true }).eq('id', id);
    if (!error) {
      setTareas(prev => prev.filter(t => t.id !== id));
    }
  };

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

          <Tareas
            tareas={tareas}
            onAddTarea={handleAddTarea}
            onCompletarTarea={handleCompletarTarea}
          />
        </div>
      </main>
    </div>
  );
}