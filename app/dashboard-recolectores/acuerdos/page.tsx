'use client'
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Form_acuerdo } from "@/app/components/form_acuerdo";
import BarraSuperior from "@/app/components/barra-superior";
import Card from "@/app/components/card";
import { CuentaCartera, EtapaCobranza, Acuerdo } from "@/app/components/types";

import TablaAcuerdos from "@/app/components/tabla-acuerdos";
export default function Acuerdos() {
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


    useEffect(() => {
        fetchAcuerdos();
    }, []);

    const [acuerdoEditando, setAcuerdoEditando] = useState<Acuerdo | null>(null);

    //Personas con acuerdo
    const personasConAcuerdo = acuerdos.map(a => a.persona);

    //Acuerdos activos
    const acuerdosActivos = acuerdos.length;

    //Suma de todos los acuerdos
    const sumaAcuerdos = acuerdos.reduce(
        (total, acuerdo) => total + Number(acuerdo.montoAcuerdo),
        0
    );

    const handleEliminarAcuerdo = async (id: string) => {
        // Optimistic update
        setAcuerdos(acuerdos.filter(a => a.id !== id));

        const { error } = await supabase.from('acuerdos').delete().eq('id', id);
        if (error) {
            console.error("Error deleting acuerdo:", error);
            // Optionally revert the update if failed
        }
    };

    const handleEditarAcuerdo = (acuerdo: Acuerdo) => {
        setAcuerdoEditando(acuerdo);
    };

    const actualizarAcuerdo = (id: string, updates: Partial<Acuerdo> & { deleted?: boolean }) => {
        setAcuerdos((prev) => {
            if (updates.deleted) {
                return prev.filter((acuerdo) => acuerdo.id !== id);
            }
            return prev.map((acuerdo) =>
                acuerdo.id === id ? { ...acuerdo, ...updates } : acuerdo
            );
        });
    };

    return (
        <div className="flex flex-col flex-1 min-h-screen bg-slate-50/50 text-zinc-800 pb-12 select-none">
            <BarraSuperior pantalla="Acuerdos" />
            <div className="flex flex-row flex-1 gap-2 mt-2 mb-2">

                <div className="flex flex-col flex-1 min-h-screen bg-slate-50/50 text-zinc-800 pb-12 select-none p-8 gap-3">
                    <h1 className="text-2xl font-bold text-zinc-900">Acuerdos de Pago</h1>
                    <h3 className="text-md text-zinc-900">Conoce los acuerdos de pago establecidos con el cliente</h3>
                    <div className="flex flex-row flex-wrap gap-3 mt-4">
                        <Card
                            title="Monto según acuerdos"
                            value={sumaAcuerdos}
                            icon="local_atm"
                            iconFooter="arrow_upward"
                            footer="342,850 respecto al mes pasado"
                            color="border-t-blue-600"
                        />

                        <Card
                            title="Acuerdos activos"
                            value={acuerdosActivos}
                            icon="description"
                            iconFooter="arrow_upward"
                            footer="2 respecto al mes pasado"
                            color="border-t-green-600"
                        />


                    </div>
                    <div className="mt-2 w-full">
                        <TablaAcuerdos
                            acuerdos={acuerdos}
                            onEdit={handleEditarAcuerdo}
                            onDelete={handleEliminarAcuerdo}
                            onActualizarAcuerdo={actualizarAcuerdo}
                        />
                    </div>
                </div>


                <Form_acuerdo
                    acuerdoParaEditar={acuerdoEditando}
                    onSaved={fetchAcuerdos}
                    onLimpiar={() => setAcuerdoEditando(null)}
                    personasConAcuerdo={personasConAcuerdo}
                />
            </div>
        </div>
    )
}