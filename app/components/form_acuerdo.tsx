'use client'
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Persona, EtapaCobranza, CuentaCartera, Acuerdo } from "./types"
export function Form_acuerdo({ acuerdoParaEditar, onSaved, onLimpiar, personasConAcuerdo = [] }: { acuerdoParaEditar?: Acuerdo | null, onSaved?: () => void, onLimpiar?: () => void, personasConAcuerdo?: string[] }) {

    const [cuentaCartera, setCuentaCartera] = useState<CuentaCartera[]>([]);

    useEffect(() => {
        const fetchCuentas = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase.from('cuenta_cartera').select('*').eq('user_id', user.id);
            if (data) {
                const mappedData: CuentaCartera[] = data.map(item => ({
                    id: item.id,
                    cliente: item.cliente,
                    ultPago: item.ult_pago,
                    saldoVencido: item.saldo_vencido,
                    diasMora: item.dias_mora,
                    etapa: item.etapa
                }));
                setCuentaCartera(mappedData);
            }
        };
        fetchCuentas();
    }, []);
    const [persona, setPersona] = useState<CuentaCartera | null>(null);
    const [monto, setMonto] = useState<number | ''>('');
    const [cuotaInicial, setCuotaInicial] = useState<number | ''>('');
    const [fecha, setFecha] = useState<string>('');
    const [numeroPagos, setNumeroPagos] = useState<number | ''>('');
    const [frecuencia, setFrecuencia] = useState<string>('');
    const [tipoPago, setTipoPago] = useState<string>('');

    useEffect(() => {
        if (acuerdoParaEditar) {

            const personaSeleccionada = cuentaCartera.find(
                c => c.cliente === acuerdoParaEditar.persona || acuerdoParaEditar.persona.includes(c.cliente)
            ) || null;
            setPersona(personaSeleccionada);
            setMonto(acuerdoParaEditar.montodeuda);
            setCuotaInicial(acuerdoParaEditar.cuota);
            setFecha(acuerdoParaEditar.fechaAcuerdo);
            setNumeroPagos(acuerdoParaEditar.numeroPagos);
            setFrecuencia(acuerdoParaEditar.frecuencia?.toLowerCase() ?? '');
            setTipoPago(acuerdoParaEditar.tipoAcuerdo?.toLowerCase() ?? '');
        } else {
            setPersona(null);
            setMonto('');
            setCuotaInicial('');
            setFecha('');
            setNumeroPagos('');
            setFrecuencia('');
            setTipoPago('');
        }
    }, [acuerdoParaEditar, cuentaCartera]);


    const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const personaSeleccionada = cuentaCartera.find((cuenta) => cuenta.id === e.target.value);
        setPersona(personaSeleccionada || null);
        setMonto(personaSeleccionada ? personaSeleccionada.saldoVencido : '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const payload = {
            user_id: user.id,
            persona: persona?.cliente || '',
            monto_acuerdo: String(monto),
            fecha_pago: fecha || new Date().toISOString().split('T')[0],
            monto_deuda: Number(monto),
            cuota: Number(cuotaInicial),
            fecha_acuerdo: fecha,
            numero_pagos: Number(numeroPagos),
            frecuencia: frecuencia,
            tipo_acuerdo: tipoPago,
            fecha_vencimiento: "10/12/2026"
        };

        if (acuerdoParaEditar?.id) {
            await supabase.from('acuerdos').update(payload).eq('id', acuerdoParaEditar.id);
        } else {
            await supabase.from('acuerdos').insert([payload]);
        }

        if (onSaved) {
            onSaved();
        }
    };

    const handleLimpiar = () => {
        setPersona(null);
        setMonto('');
        setCuotaInicial('');
        setFecha('');
        setNumeroPagos('');
        setFrecuencia('');
        setTipoPago('');
        if (onLimpiar) onLimpiar();
    };

    const [cuenta, setCuenta] = useState<CuentaCartera | null>(null);

    return (
        <div className="relative z-10 w-full max-w-[440px] bg-white border border-zinc-200/80 shadow-xl shadow-zinc-200/30 rounded-xl overflow-hidden flex flex-col">
            {/* Barra de gradiente de acento superior */}
            <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500" />

            <div className="p-8 md:p-10 flex flex-col flex-1">
                {/* Encabezado */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900">Portal de Acuerdos</h1>
                        <p className="text-xs text-zinc-500 mt-1.5 font-medium tracking-normal">
                            Crea un nuevo aucerdo
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleLimpiar}
                        className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors flex items-center gap-1"
                        title="Limpiar formulario"
                    >
                        <span className="material-symbols-outlined">delete_forever</span>
                        Limpiar
                    </button>
                </div>

                {/* Formulario */}
                <form className="flex flex-col gap-6 flex-1" onSubmit={handleSubmit}>
                    {/* Campo de Correo Electrónico Comercial */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Persona</label>
                        <select value={persona?.id || ""} className="w-full h-11 pr-10 pl-3 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-blue-500 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all" name="Persona" id="" onChange={handlePersonaChange}>
                            <option value="" disabled>Seleccione una persona</option>
                            {cuentaCartera
                                .filter(c =>

                                    !personasConAcuerdo.includes(c.cliente) ||
                                    c.cliente === acuerdoParaEditar?.persona
                                )
                                .map((cuenta) => (
                                    <option key={cuenta.id} value={cuenta.id}>
                                        {cuenta.cliente}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    {/* Monto a liquidar */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="monto" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                            Monto de deuda
                        </label>
                        <div className="relative">
                            <input
                                id="monto"
                                type='number'
                                value={monto}
                                onChange={(e) => setMonto(e.target.value ? Number(e.target.value) : '')}
                                placeholder="0"
                                className="w-full h-11 pr-10 pl-3 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-blue-500 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all"
                                autoComplete="off"
                            />

                        </div>
                    </div>
                    {/* Cuota inicial*/}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="cuotaInicial" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                            Cuota inicial
                        </label>
                        <div className="relative">
                            <input
                                id="cuotaInicial"
                                type='number'
                                value={cuotaInicial}
                                onChange={(e) => setCuotaInicial(e.target.value ? Number(e.target.value) : '')}
                                placeholder="$0.00"
                                className="w-full h-11 pr-10 pl-3 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-blue-500 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all"
                                autoComplete="off"
                            />

                        </div>
                    </div>

                    {/*Fecha*/}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="fecha" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                            Fecha del acuerdo
                        </label>
                        <div className="relative">
                            <input
                                id="fecha"
                                type='date'
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="w-full h-11 pr-10 pl-3 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-blue-500 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all"
                                autoComplete="off"
                            />

                        </div>

                    </div>

                    {/* Número de pagos */}
                    <div className="flex flex-row gap-2">
                        {/* Numero de pagos */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="numeroPagos" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                                Numero de pagos
                            </label>
                            <div className="relative">
                                <input
                                    id="numeroPagos"
                                    type='number'
                                    value={numeroPagos}
                                    onChange={(e) => setNumeroPagos(e.target.value ? Number(e.target.value) : '')}
                                    placeholder="0"
                                    className="w-full h-11 pr-10 pl-3 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-blue-500 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all"
                                    autoComplete="off"
                                />

                            </div>
                        </div>
                        {/* Frecuencia de pago*/}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="frecuenciaPago" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                                Frecuencia de pago
                            </label>
                            <div className="relative">
                                <select
                                    id="frecuenciaPago"
                                    value={frecuencia}
                                    onChange={(e) => setFrecuencia(e.target.value)}
                                    className="w-full h-11 pr-10 pl-3 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-blue-500 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all"
                                    autoComplete="off"
                                >
                                    <option value="" disabled>Seleccione una frecuencia</option>
                                    <option value="diario">Diario</option>
                                    <option value="semanal">Semanal</option>
                                    <option value="quincenal">Quincenal</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="bimestral">Bimestral</option>
                                    <option value="trimestral">Trimestral</option>
                                    <option value="semestral">Semestral</option>
                                    <option value="anual">Anual</option>

                                </select>
                            </div>

                        </div>

                    </div>

                    {/*Tipo de acuerdo */}
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase" htmlFor="tipoPago">
                        Tipo de acuerdo
                    </label>
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-row gap-1.5">
                            <input type="radio" name="tipoPago" id="tipoPagoFormal" checked={tipoPago === 'formal'} onChange={() => setTipoPago('formal')} />
                            <label htmlFor="tipoPagoFormal" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Formal</label>
                        </div>
                        <div className="flex flex-row gap-1.5">
                            <input type="radio" name="tipoPago" id="tipoPagoInformal" checked={tipoPago === 'informal'} onChange={() => setTipoPago('informal')} />
                            <label htmlFor="tipoPagoInformal" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Informal</label>
                        </div>
                        <div className="flex flex-row gap-1.5">
                            <input type="radio" name="tipoPago" id="tipoPagoLegal" checked={tipoPago === 'legal'} onChange={() => setTipoPago('legal')} />
                            <label htmlFor="tipoPagoLegal" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Legal</label>
                        </div>
                    </div>
                    {/* Resumen del acuerdo */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600">
                                Monto a Financiar
                            </span>
                            <span className="text-lg font-semibold text-zinc-900">
                                $0.00
                            </span>
                        </div>
                        {/* Moneda */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600">
                                Monto de Deuda
                            </span>
                            <span className="text-lg font-semibold text-zinc-900">
                                {persona?.saldoVencido}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600">
                                Valor Cuota Estimada
                            </span>
                            <span className="text-lg font-semibold text-blue-600">
                                $0.00
                            </span>
                        </div>

                        <hr className="border-zinc-200" />

                        <div className="flex items-center justify-between">
                            <span className="text-xl font-semibold uppercase tracking-wide text-zinc-700">
                                Total Proyectado
                            </span>
                            <span className="text-2xl font-bold text-zinc-900">
                                $0.00
                            </span>
                        </div>
                    </div>

                    {/* Botón de acción principal */}
                    <button
                        type="submit"
                        className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-normal transition-colors duration-200 disabled:opacity-50 flex items-center justify-center shadow-sm"
                    >
                        <span>Guardar Acuerdo</span>
                    </button>
                </form>
            </div>

            {/* Pie de tarjeta */}
            <div className="p-8 pt-0 md:p-10 md:pt-0 flex flex-col gap-3">
                {/* Disclaimer */}
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase text-center">
                    Nora® - Soluciones Tecnologicas
                </p>
            </div>
        </div>
    )
}