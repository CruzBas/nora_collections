"use client"

import BarraSuperior from "@/app/components/barra-superior";
import TablaCartera from "@/app/components/tabla-cartera";
import { CuentaCartera, EtapaCobranza, Acuerdo } from "@/app/components/types";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/app/components/card";


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

    const [acuerdos, setAcuerdos] = useState<Acuerdo[]>([]);
    const fetchAcuerdos = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.from('acuerdos').select('*').eq('user_id', user.id);
        if (error) {
            console.error("Error fetching acuerdos:", error);
        } else if (data) {
            const mappedData: Acuerdo[] = data.map(item => ({
                id: item.id,
                persona: item.persona,
                fechaVencimiento: item.fecha_vencimiento,
                montoAcuerdo: item.monto_acuerdo,
                fechaPago: item.fecha_pago,
                montodeuda: item.monto_deuda,
                cuota: item.cuota,
                fechaAcuerdo: item.fecha_acuerdo,
                numeroPagos: item.numero_pagos,
                frecuencia: item.frecuencia,
                tipoAcuerdo: item.tipo_acuerdo
            }));
            setAcuerdos(mappedData);
        }
    };

    const cuentasActivas = cuentas.length;

    //Suma de todos los acuerdos
    const montoCartera = cuentas.reduce(
        (total, cuenta) => total + Number(cuenta.saldoVencido),
        0
    );

    //cuentas en etapa de riesgo critico
    const cuentasRiesgoCritico = cuentas.filter(
        (cuenta) =>
            cuenta.etapa === "Pre-legal" ||
            cuenta.etapa === "Aviso"
    );

    const riesgoCritico = cuentasRiesgoCritico.length;

    const totalRiesgo = riesgoCritico;

    useEffect(() => {
        fetchAcuerdos();
    }, []);
    const acuerdosPago = acuerdos.length



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


        const { error } = await supabase
            .from('cuenta_cartera')
            .update({ etapa })
            .eq('id', id);

        if (error) {
            console.error("Error updating etapa:", error);

        }
    };

    const actualizarCuenta = (id: string, updates: Partial<CuentaCartera>) => {
        setCuentas((prev) =>
            prev.map((cuenta) =>
                cuenta.id === id ? { ...cuenta, ...updates } : cuenta
            )
        );
    };

    return (
        <div className="flex flex-col flex-1 min-h-screen bg-slate-50/50 text-zinc-800 pb-12 select-none">
            <BarraSuperior
                pantalla={"Cartera"}

            />
            <main className="p-8 flex flex-col flex-1 gap-3">
                <h1 className="text-2xl font-bold text-zinc-900">Cartera de clientes</h1>
                <h3 className="text-md  text-zinc-900">Gestion y seguimiento de cuentas asignadas</h3>
                <div className="flex flex-row flex-wrap gap-13 mt-4 flex-1 " >

                    <Card
                        title="Total de cuentas"
                        value={cuentasActivas}
                        icon="groups"
                        footer="2.3%"
                        iconFooter="trending_up"
                        color="blue" />

                    <Card
                        title="Monto por recuperar"
                        value={montoCartera}
                        icon="wallet"
                        footer="4.3%"
                        iconFooter="trending_down"
                        color="green"
                    />
                    <Card
                        title="Riesgo Critico "
                        value={riesgoCritico}
                        icon="warning"
                        footer=""
                        iconFooter=""
                        color="red "
                    />
                    <Card
                        title="Promesas de pago"
                        value={acuerdosPago}
                        icon="handshake"
                        footer=""
                        iconFooter=""
                        color="red "
                    />



                </div>
                <TablaCartera
                    cuentas={cuentas}
                    onCambiarEtapa={cambiarEtapa}
                    onActualizarCuenta={actualizarCuenta}
                />
            </main>

        </div>


    );
}