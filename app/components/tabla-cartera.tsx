'use client'
import { useState } from "react";
import { CuentaCartera, EtapaCobranza } from "@/app/components/types";


// Props de la tabla de cartera prioritaria
interface TablaCarteraProps {
  cuentas: CuentaCartera[];
  onCambiarEtapa: (id: string, etapa: EtapaCobranza) => void;
}


const etapas = [
  "Pre-legal", "Seguimiento", "Negociación", "Aviso"
];







export default function TablaCartera({
  cuentas,
  onCambiarEtapa,
}: TablaCarteraProps) {
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
              <th className="py-4 px-6">ID Cuenta</th>
              <th className="py-4 px-6">Cliente</th>
              <th className="py-4 px-6">Saldo de deuda</th>
              <th className="py-4 px-6 text-center">Días Mora</th>
              <th className="py-4 px-6">Etapa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {cuentas.length > 0 ? (
              cuentas.map((cuenta) => (
                <tr key={cuenta.id} className="hover:bg-zinc-50/30 transition-colors">
                  <td className="py-4 px-6 text-sm font-semibold text-zinc-900">{cuenta.id}</td>

                  {/* Columna de cliente con último pago registrado */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-800">{cuenta.cliente}</span>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        Últ. pago: {cuenta.ultPago}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-sm font-semibold text-zinc-900">
                    {cuenta.saldoVencido}
                  </td>

                  {/* Etiqueta de días mora con color según severidad */}
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cuenta.diasMora >= 90
                        ? "bg-rose-50 text-rose-600"
                        : cuenta.diasMora >= 60
                          ? "bg-amber-50 text-amber-600"
                          : cuenta.diasMora >= 30
                            ? "bg-blue-50 text-blue-600"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                    >
                      {cuenta.diasMora}+
                    </span>
                  </td>

                  {/* Etapa de cobranza con indicador de color */}
                  <td className="py-4 px-6">
                    <select
                      value={cuenta.etapa}
                      onChange={(e) => onCambiarEtapa(cuenta.id, e.target.value as EtapaCobranza)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {etapas.map((etapa) => (
                        <option key={etapa} value={etapa}>
                          {etapa}
                        </option>
                      ))}
                    </select>
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
  );
}
