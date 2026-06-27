"use client"

import BarraSuperior from "@/app/components/barra-superior";
import TablaCartera from "@/app/components/tabla-cartera";
import { CuentaCartera, EtapaCobranza } from "@/app/components/types";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/app/components/card";

const cuentasIniciales: CuentaCartera[] = [
    {
        id: "#AC-8921",
        cliente: "Roberto Jiménez",
        ultPago: "12/08/23",
        saldoVencido: 4500.00,
        diasMora: 90,
        etapa: "Pre-legal",
    },
    {
        id: "#AC-7743",
        cliente: "María González",
        ultPago: "05/09/23",
        saldoVencido: 1200.00,
        diasMora: 45,
        etapa: "Seguimiento",
    },
    {
        id: "#AC-9012",
        cliente: "Empresa Logística S.A.",
        ultPago: "20/09/23",
        saldoVencido: 8900.50,
        diasMora: 65,
        etapa: "Negociación",
    },
    {
        id: "#AC-3321",
        cliente: "Luis Herrera",
        ultPago: "--",
        saldoVencido: 650.00,
        diasMora: 15,
        etapa: "Aviso",
    }, {
        id: "#AC-3324",
        cliente: "Luis Herrera",
        ultPago: "--",
        saldoVencido: 650.00,
        diasMora: 15,
        etapa: "Aviso",
    }, {
        id: "#AC-3323",
        cliente: "Luis Herrera",
        ultPago: "--",
        saldoVencido: 650.00,
        diasMora: 15,
        etapa: "Aviso",
    },
];


export default function Cartera() {

    const [cuentas, setCuentas] = useState<CuentaCartera[]>([]);

    useEffect(() => {
        const fetchCuentas = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase.from('cuenta_cartera').select('*').eq('user_id', user.id);
            if (error) {
                console.error("Error fetching cuentas:", error);
            } else if (data) {
                // Map snake_case to camelCase
                const mappedData: CuentaCartera[] = data.map(item => ({
                    id: item.id,
                    cliente: item.cliente,
                    ultPago: item.ult_pago,
                    saldoVencido: item.saldo_vencido,
                    diasMora: item.dias_mora,
                    etapa: item.etapa
                }));
                setCuentas(mappedData);
            }
        };
        fetchCuentas();
    }, []);

    const cambiarEtapa = async (
        id: string,
        etapa: EtapaCobranza
    ) => {
        // Optimistic update
        setCuentas((prev) =>
            prev.map((cuenta) =>
                cuenta.id === id
                    ? { ...cuenta, etapa }
                    : cuenta
            )
        );

        // Update in Supabase
        const { error } = await supabase
            .from('cuenta_cartera')
            .update({ etapa })
            .eq('id', id);

        if (error) {
            console.error("Error updating etapa:", error);
            // In a real app, you might revert the optimistic update here
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-screen bg-slate-50/50 text-zinc-800 pb-12 select-none">
            <BarraSuperior
                pantalla={"Cartera"}

            />
            <main className="p-8 flex flex-col gap-3">
                <h1 className="text-2xl font-bold text-zinc-900">Cartera de clientes</h1>
                <h3 className="text-md  text-zinc-900">Gestion y seguimiento de cuentas asignadas</h3>
                <div className="flex flex-row flex-wrap gap-13 mt-4 flex-1 " >

                    <Card
                        title="Total de cuentas"
                        value="20"
                        icon="groups"
                        footer="2.3%"
                        iconFooter="trending_up"
                        color="blue" />

                    <Card
                        title="Monto por recuperar"
                        value="$1,000.00"
                        icon="wallet"
                        footer="4.3%"
                        iconFooter="trending_down"
                        color="green"
                    />
                    <Card
                        title="Riesgo Critico "
                        value="3"
                        icon="warning"
                        footer=""
                        iconFooter=""
                        color="red "
                    />
                    <Card
                        title="Promesas de pago"
                        value="2"
                        icon="handshake"
                        footer=""
                        iconFooter=""
                        color="red "
                    />



                </div>
                <TablaCartera
                    cuentas={cuentas}
                    onCambiarEtapa={cambiarEtapa}
                />
            </main>

        </div>


    );
}