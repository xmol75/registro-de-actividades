export interface SurgicalActivity {
  id: string;
  fecha: string; // YYYY-MM-DD
  nhc: string; // Número de Historia Clínica
  cirugia: string; // Nombre del procedimiento
  equipoQuirurgico: string;
  tiempoFin?: string; // HH:MM
  precio?: number;
  comentario?: string;
  isPaid: boolean;
  mesCobro?: string; // YYYY-MM o undefined
}

export enum ActivityFilter {
  ALL = 'all',
  PAID = 'paid',
  UNPAID = 'unpaid',
}

export enum AppView {
  MAIN_MENU = 'main_menu',
  PROLONGACIONES = 'prolongaciones',
  // TRASPLANTES = 'trasplantes', // Se puede añadir cuando esté lista
}
