'use client'
import { useState } from "react"
import { Persona, EtapaCobranza, CuentaCartera } from "./types"
export function Form_acuerdo() {

    const [cuentaCartera, setCuentaCartera] = useState<CuentaCartera[]>([
        {
            id: "1",
            cliente: "Juan",
            ultPago: "2022-01-01",
            saldoVencido: 1000,
            diasMora: 10,
            etapa: "Pre-legal"
        },
        {
            id: "2",
            cliente: "Maria",
            ultPago: "2022-01-01",
            saldoVencido: 2000,
            diasMora: 20,
            etapa: "Seguimiento"
        }
    ]);
    const [persona, setPersona] = useState<CuentaCartera | null>(null);
    const [monto, setMonto] = useState<number | ''>('');

    const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const personaSeleccionada = cuentaCartera.find((cuenta) => cuenta.id === e.target.value);
        setPersona(personaSeleccionada || null);
        setMonto(personaSeleccionada ? personaSeleccionada.saldoVencido : '');
    };

    const [cuenta, setCuenta] = useState<CuentaCartera | null>(null);

    return (
        <div className="relative z-10 w-full max-w-[440px] bg-white border border-zinc-200/80 shadow-xl shadow-zinc-200/30 rounded-xl overflow-hidden flex flex-col">
            {/* Barra de gradiente de acento superior */}
            <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500" />

            <div className="p-8 md:p-10 flex flex-col flex-1">
                {/* Encabezado */}
                <div className="mb-8">
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900">Portal de Acuerdos</h1>
                    <p className="text-xs text-zinc-500 mt-1.5 font-medium tracking-normal">
                        Crea un nuevo aucerdo
                    </p>
                </div>

                {/* Formulario */}
                <form className="flex flex-col gap-6 flex-1">
                    {/* Campo de Correo Electrónico Comercial */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Persona</label>
                        <select className="w-full h-11 pr-10 pl-3 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-blue-500 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all" name="Persona" id="" onChange={handlePersonaChange}>
                            {cuentaCartera.map((cuenta) => (
                                <option key={cuenta.id} value={cuenta.id}>
                                    {cuenta.cliente}
                                </option>
                            ))}
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
                                    className="w-full h-11 pr-10 pl-3 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:border-blue-500 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all"
                                    autoComplete="off"
                                >
                                    <option selected disabled>Seleccione una frecuencia</option>
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
                            <input type="radio" name="tipoPago" id="tipoPago" />
                            <label htmlFor="tipoPago" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Formal</label>
                        </div>
                        <div className="flex flex-row gap-1.5">
                            <input type="radio" name="tipoPago" id="tipoPago" />
                            <label htmlFor="tipoPago" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Informal</label>
                        </div>
                        <div className="flex flex-row gap-1.5">
                            <input type="radio" name="tipoPago" id="tipoPago" />
                            <label htmlFor="tipoPago" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Legal</label>
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
                </form>
            </div>

            {/* Pie de tarjeta */}
            <div className="p-8 pt-0 md:p-10 md:pt-0 flex flex-col gap-3">
                {/* Botón de acción principal */}
                <button
                    type="submit"
                    className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-normal transition-colors duration-200 disabled:opacity-50 flex items-center justify-center shadow-sm"
                >
                    <span>Guardar Acuerdo</span>
                </button>


                {/* Disclaimer */}
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase text-center">
                    Nora® - Soluciones Tecnologicas
                </p>
            </div>
        </div>
    )
}