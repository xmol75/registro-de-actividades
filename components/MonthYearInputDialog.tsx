import React, { useState, useEffect } from 'react';
import { SurgicalActivity } from '../types';

interface MonthYearInputDialogProps {
  activity: SurgicalActivity;
  onConfirm: (activityId: string, monthYear: string) => void;
  onCancel: () => void;
}

const MonthYearInputDialog: React.FC<MonthYearInputDialogProps> = ({ activity, onConfirm, onCancel }) => {
  const [monthYear, setMonthYear] = useState<string>('');

  useEffect(() => {
    // Set initial value to current month or existing month if available
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    setMonthYear(activity.mesCobro || `${currentYear}-${currentMonth}`);
  }, [activity.mesCobro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthYear) {
      alert("Por favor, selecciona un mes y año.");
      return;
    }
    onConfirm(activity.id, monthYear);
  };

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-40 flex items-center justify-center p-4 z-50 transition-opacity duration-150 ease-in-out">
      <div className="bg-sky-50 p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-150 ease-in-out scale-95 opacity-0 animate-fade-in-scale">
        <h3 className="text-xl font-semibold text-sky-700 mb-1">Registrar Mes de Cobro</h3>
        <p className="text-sm text-slate-600 mb-4">
          Para: <span className="font-medium">{activity.cirugia}</span> del {new Date(activity.fecha + 'T00:00:00').toLocaleDateString('es-ES')}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="monthYearInput" className="block text-sm font-medium text-sky-700 mb-1">
              Mes y Año de Cobro:
            </label>
            <input
              type="month"
              id="monthYearInput"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              className="w-full p-2 border border-slate-300 bg-white rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-700"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors"
            >
              Confirmar Pago
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MonthYearInputDialog;