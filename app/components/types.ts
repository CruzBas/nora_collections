// Tipos compartidos del módulo de cartera y cobranza
// Se exportan desde aquí para que todos los componentes los reutilicen
export type EtapaCobranza = "Pre-legal" | "Seguimiento" | "Negociación" | "Aviso";


export interface CuentaCartera {
  id: string;
  cliente: string;
  ultPago: string;
  saldoVencido: number;
  diasMora: number;
  etapa: EtapaCobranza;
}

export interface Tarea {
  id: string;
  nombre: string;
  descripcion: string;

}

export interface Card {
  title: string;
  value: number | string;
  icon: string;
  footer: string;
  color: string;


}

export interface Persona {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  deuda: string;
  fechadeUltimoPago: string;
  diasdeMora: number;

}

export interface Acuerdo {
  id: string;
  persona: string;
  fechaVencimiento: string;
  montoAcuerdo: string;
  fechaPago: string;
  montodeuda: number;
  cuota: number,
  fechaAcuerdo: string,
  numeroPagos: number,
  frecuencia: string,
  tipoAcuerdo: string,

}


