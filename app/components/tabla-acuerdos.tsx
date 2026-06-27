'use client'
import { useState } from "react";
import { CuentaCartera, EtapaCobranza, Acuerdo } from "@/app/components/types";


export default function TablaAcuerdos({ acuerdos, onEdit, onDelete }: { acuerdos: Acuerdo[], onEdit: (acuerdo: Acuerdo) => void, onDelete: (id: string) => void }) {


    return (
        <section className="bg-white border border-zinc-200/80 rounded-xl shadow-sm lg:col-span-2 overflow-hidden">
            {/* Encabezado de la sección con enlace a vista completa */}
            <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-900">Cartera Prioritaria</h3>

            </div>

            {/* Tabla interactiva de cuentas */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 border-b border-zinc-200 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            <th className="py-4 px-6">Nombre</th>
                            <th className="py-4 px-6">Fecha de Vencimiento</th>
                            <th className="py-4 px-6">Monto del Acuerdo</th>
                            <th className="py-4 px-6">Fecha de Pago</th>
                            <th className="py-4 px-6 text-center">Acciones</th>


                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {acuerdos.length > 0 ? (
                            acuerdos.map((acuerdo) => (
                                <tr key={acuerdo.id} className="hover:bg-zinc-50/30 transition-colors">
                                    <td className="py-4 px-6 text-sm font-semibold text-zinc-900">{acuerdo.persona}</td>


                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-zinc-800">{acuerdo.fechaVencimiento}</span>
                                            <span className="text-[11px] text-zinc-400 font-medium">
                                                Total de la Deuda: ${acuerdo.montodeuda}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-sm font-semibold text-zinc-900">
                                        {acuerdo.montoAcuerdo}
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-zinc-800">{acuerdo.fechaPago}</span>

                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => onEdit(acuerdo)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Editar">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button onClick={() => onDelete(acuerdo.id)} className="text-red-600 hover:text-red-800 transition-colors" title="Eliminar">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Mensaje de estado vacío cuando no hay resultados de búsqueda
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-sm text-zinc-400 font-medium">
                                    No se encontraron cuentas asociadas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}