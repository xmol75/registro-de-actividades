
export interface SurgicalActivity {
  id: string;
  datePerformed: string; // YYYY-MM-DD
  patientIdentifier: string;
  procedureName: string;
  notes?: string;
  isPaid: boolean;
  datePaid: string | null; // YYYY-MM-DD or null
}

export enum ActivityFilter {
  ALL = 'all',
  PAID = 'paid',
  UNPAID = 'unpaid',
}
