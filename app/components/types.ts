// Tipos compartidos del módulo de cartera y cobranza
// Se exportan desde aquí para que todos los componentes los reutilicen
export type EtapaCobranza = "Pre-legal" | "Seguimiento" | "Negociación" | "Aviso";


export interface CuentaCartera {
  id: string;
  cliente: string;
  ultPago: string;
  saldoVencido: string;
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

