'use client'

import { useState, useEffect } from "react";
import { CuentaCartera, Acuerdo, HistorialPago } from "@/app/components/types";
import { supabase } from "@/lib/supabase";

interface ModalHistorialPagosProps {
  cuenta?: CuentaCartera | null;
  acuerdo?: Acuerdo | null;
  onClose: () => void;
  onActualizarCuenta?: (id: string, updates: Partial<CuentaCartera>) => void;
  onActualizarAcuerdo?: (id: string, updates: Partial<Acuerdo> & { deleted?: boolean }) => void;
}

export default function ModalHistorialPagos({
  cuenta,
  acuerdo,
  onClose,
  onActualizarCuenta,
  onActualizarAcuerdo,
}: ModalHistorialPagosProps) {
  const [historial, setHistorial] = useState<HistorialPago[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form State
  const [monto, setMonto] = useState("");
  const [fechaPago, setFechaPago] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [file, setFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const clienteNombre = cuenta ? cuenta.cliente : acuerdo ? acuerdo.persona : "";
  const saldoDeuda = cuenta ? cuenta.saldoVencido : acuerdo ? acuerdo.montodeuda : 0;
  const ultimoPagoFecha = cuenta ? cuenta.ultPago : acuerdo ? acuerdo.fechaPago : "Sin registros";


  useEffect(() => {
    if (cuenta || acuerdo) {
      fetchHistorial();
      setStatusMsg(null);
      setMonto("");
      setFile(null);
      setFechaPago(new Date().toISOString().split("T")[0]);
    }
  }, [cuenta, acuerdo]);

  const fetchHistorial = async () => {
    if (!cuenta && !acuerdo) return;
    setLoadingHistory(true);
    try {
      let query = supabase.from("historial_pagos").select("*");

      if (cuenta) {
        query = query.eq("cuenta_id", cuenta.id);
      } else if (acuerdo) {
        query = query.eq("acuerdo_id", acuerdo.id);
      }

      const { data, error } = await query.order("fecha_pago", { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedData: HistorialPago[] = data.map((item) => ({
          id: item.id,
          cuentaId: item.cuenta_id,
          acuerdoId: item.acuerdo_id,
          userId: item.user_id,
          fechaPago: item.fecha_pago,
          monto: Number(item.monto),
          facturaUrl: item.factura_url,
          createdAt: item.created_at,
        }));
        setHistorial(mappedData);
      }
    } catch (error) {
      console.error("Error al obtener historial de pagos:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!cuenta && !acuerdo) return null;


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto || Number(monto) <= 0) {
      setStatusMsg({ type: "error", text: "Por favor, ingrese un monto válido mayor a 0." });
      return;
    }

    setLoading(true);
    setStatusMsg(null);
    let facturaUrl = "";

    try {

      if (file) {
        setUploadingFile(true);
        const fileExt = file.name.split(".").pop();
        const cleanClientName = clienteNombre.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        const fileName = `${cleanClientName}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("facturas")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("facturas")
          .getPublicUrl(fileName);

        facturaUrl = urlData.publicUrl;
        setUploadingFile(false);
      }


      // 2. Resolve matching accounts/agreements to keep everything in sync
      let targetCuentaId = cuenta ? cuenta.id : null;
      let targetAcuerdoId = acuerdo ? acuerdo.id : null;

      // Case A: Opened from Agreement, resolve matching client account
      if (acuerdo && !targetCuentaId) {
        const { data: matchedCuentas } = await supabase
          .from("cuenta_cartera")
          .select("id, saldo_vencido, ult_pago")
          .eq("cliente", acuerdo.persona)
          .limit(1);

        if (matchedCuentas && matchedCuentas.length > 0) {
          targetCuentaId = matchedCuentas[0].id;

          const nuevoSaldoCuenta = Math.max(0, Number(matchedCuentas[0].saldo_vencido) - Number(monto));
          await supabase
            .from("cuenta_cartera")
            .update({
              saldo_vencido: nuevoSaldoCuenta,
              ult_pago: fechaPago
            })
            .eq("id", targetCuentaId);

          onActualizarCuenta?.(targetCuentaId as string, {
            saldoVencido: nuevoSaldoCuenta,
            ultPago: fechaPago,
          });
        }
      }

      // Case B: Opened from Client Account, resolve matching agreement
      if (cuenta && !targetAcuerdoId) {
        const { data: matchedAcuerdos } = await supabase
          .from("acuerdos")
          .select("id, monto_deuda")
          .eq("persona", cuenta.cliente)
          .limit(1);

        if (matchedAcuerdos && matchedAcuerdos.length > 0) {
          targetAcuerdoId = matchedAcuerdos[0].id;

          const nuevoSaldoAcuerdo = Math.max(0, Number(matchedAcuerdos[0].monto_deuda) - Number(monto));
          
          if (nuevoSaldoAcuerdo <= 0) {
            await supabase.from("acuerdos").delete().eq("id", targetAcuerdoId);
            onActualizarAcuerdo?.(targetAcuerdoId as string, { deleted: true });
          } else {
            await supabase
              .from("acuerdos")
              .update({
                monto_deuda: nuevoSaldoAcuerdo,
                fecha_pago: fechaPago
              })
              .eq("id", targetAcuerdoId);

            onActualizarAcuerdo?.(targetAcuerdoId as string, {
              montodeuda: nuevoSaldoAcuerdo,
              fechaPago: fechaPago,
            });
          }
        }
      }

      // 3. Insert into historial_pagos (links both if they are matched!)
      const { error: insertError } = await supabase.from("historial_pagos").insert([
        {
          cuenta_id: targetCuentaId,
          acuerdo_id: targetAcuerdoId,
          monto: Number(monto),
          fecha_pago: new Date(fechaPago).toISOString(),
          factura_url: facturaUrl || null,
        },
      ]);

      if (insertError) throw insertError;

      // 4. Update the source that triggered the modal
      if (cuenta) {
        const nuevoSaldo = Math.max(0, cuenta.saldoVencido - Number(monto));
        const formattedDate = fechaPago;

        const { error: updateError } = await supabase
          .from("cuenta_cartera")
          .update({
            ult_pago: formattedDate,
            saldo_vencido: nuevoSaldo,
          })
          .eq("id", cuenta.id);

        if (updateError) throw updateError;

        onActualizarCuenta?.(cuenta.id, {
          saldoVencido: nuevoSaldo,
          ultPago: formattedDate,
        });
      } else if (acuerdo) {
        const nuevoSaldoDeuda = Math.max(0, acuerdo.montodeuda - Number(monto));
        const formattedDate = fechaPago;

        if (nuevoSaldoDeuda <= 0) {
          const { error: deleteError } = await supabase
            .from("acuerdos")
            .delete()
            .eq("id", acuerdo.id);

          if (deleteError) throw deleteError;

          onActualizarAcuerdo?.(acuerdo.id, {
            deleted: true,
          });
        } else {
          const { error: updateError } = await supabase
            .from("acuerdos")
            .update({
              fecha_pago: formattedDate,
              monto_deuda: nuevoSaldoDeuda,
            })
            .eq("id", acuerdo.id);

          if (updateError) throw updateError;

          onActualizarAcuerdo?.(acuerdo.id, {
            montodeuda: nuevoSaldoDeuda,
            fechaPago: formattedDate,
          });
        }
      }

      // Reset form
      setMonto("");
      setFile(null);
      setFechaPago(new Date().toISOString().split("T")[0]);
      setStatusMsg({ type: "success", text: "Pago registrado exitosamente." });

      // Refresh list
      await fetchHistorial();
    } catch (err: any) {
      console.error("Error al registrar el pago:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Error al procesar el pago. Por favor intente de nuevo.",
      });
    } finally {
      setLoading(false);
      setUploadingFile(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white border border-zinc-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* Left Column: Form & Info */}
        <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-100 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  {cuenta ? "Historial del Cliente" : "Historial del Acuerdo"}
                </span>
                <h2 className="text-xl font-bold text-zinc-900 mt-1">
                  {clienteNombre}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="md:hidden text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  Deuda Pendiente
                </span>
                <span className="text-xl font-extrabold text-rose-600 mt-1">
                  {formatCurrency(saldoDeuda)}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  {cuenta ? "Último Pago" : "Fecha de Pago"}
                </span>
                <span className="text-sm font-semibold text-zinc-700 mt-2">
                  {ultimoPagoFecha || "Sin registros"}
                </span>
              </div>
            </div>

            {/* Register new payment Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide border-b border-zinc-100 pb-2">
                Registrar Nuevo Pago
              </h3>

              {statusMsg && (
                <div
                  className={`text-xs font-medium p-3 rounded-lg border ${statusMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                  {statusMsg.text}
                </div>
              )}

              {/* Amount field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">
                  Monto del Pago
                </label>
                <div className="flex items-center gap-2 border border-zinc-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 rounded-lg px-3 py-2.5 transition-all">
                  <span className="text-sm font-semibold text-zinc-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    required
                    disabled={loading}
                    className="flex-1 bg-transparent border-0 p-0 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Date field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">
                  Fecha del Pago
                </label>
                <div className="flex items-center gap-2 border border-zinc-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 rounded-lg px-3 py-2.5 transition-all">
                  <span className="material-symbols-outlined text-zinc-400 text-sm">
                    calendar_today
                  </span>
                  <input
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                    required
                    disabled={loading}
                    className="flex-1 bg-transparent border-0 p-0 text-sm text-zinc-800 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Invoice Upload drag and drop */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">
                  Factura / Comprobante (Opcional)
                </label>

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] relative ${dragActive
                    ? "border-blue-500 bg-blue-50/20"
                    : file
                      ? "border-emerald-500 bg-emerald-50/10"
                      : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                    }`}
                >
                  <input
                    type="file"
                    id="invoice-file"
                    onChange={handleFileChange}
                    accept=".pdf,image/*"
                    disabled={loading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {file ? (
                    <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                      <span className="material-symbols-outlined text-emerald-600 text-2xl">
                        description
                      </span>
                      <span className="text-xs font-semibold text-zinc-700 truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Haz clic para cambiar
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                      <span className="material-symbols-outlined text-zinc-400 text-2xl">
                        cloud_upload
                      </span>
                      <span className="text-xs font-semibold text-zinc-600">
                        Arrastra o haz clic para subir factura
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        Formatos PDF o Imágenes (Max. 5MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs tracking-widest uppercase py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <span>
                  {loading
                    ? uploadingFile
                      ? "Subiendo Factura..."
                      : "Registrando..."
                    : "Guardar Pago"}
                </span>
                {!loading && (
                  <span className="material-symbols-outlined text-sm">save</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: History List */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-zinc-50/50 flex flex-col max-h-[45vh] md:max-h-full overflow-y-auto justify-between">
          <div className="h-full flex flex-col">
            {/* Header info */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900">
                Historial de Transacciones
              </h3>
              <button
                onClick={onClose}
                className="hidden md:flex text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1">
              {loadingHistory ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-zinc-400">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-medium">Cargando transacciones...</span>
                </div>
              ) : historial.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {historial.map((pago) => (
                    <div
                      key={pago.id}
                      className="bg-white border border-zinc-200/80 rounded-xl p-4 flex items-center justify-between hover:shadow-sm hover:border-zinc-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <span className="material-symbols-outlined text-sm">
                            payments
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-800">
                            {formatCurrency(pago.monto)}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {formatDate(pago.fechaPago)}
                          </span>
                        </div>
                      </div>

                      {/* Factura action */}
                      {pago.facturaUrl ? (
                        <a
                          href={pago.facturaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-xs">
                            description
                          </span>
                          <span>Ver Factura</span>
                        </a>
                      ) : (
                        <span className="text-[10px] font-medium text-zinc-400 italic">
                          Sin comprobante
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                    <span className="material-symbols-outlined text-xl">
                      payments
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-700">
                    Sin historial de pagos
                  </h4>
                  <p className="text-[10px] text-zinc-400 max-w-[200px] mt-1">
                    No se han registrado transacciones de pago para esta cuenta todavía.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
